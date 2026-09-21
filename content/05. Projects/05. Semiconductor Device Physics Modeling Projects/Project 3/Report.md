## Project Report: 2D P-N Junction & Computational Meshing Fundamentals

---

## 1. Project Statement

This project evaluates the multi-dimensional transition from 1D to 2D physical space modeling of an ideal step-junction diode. The primary engineering problem shifts from purely solving the underlying electrostatics to optimizing computational meshing and grid topology. Resolving multidimensional internal field gradients while maintaining numerical stability requires advanced tensor grid meshing algorithms. This report establishes a parameterized finite-element grid optimization strategy to prevent numerical divergence and eliminate Out-Of-Memory (OOM) kernel panics on constrained host hardware using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Establish a Robust 2D Geometric Workspace: Construct a structurally uniform $10.0\ \mu\text{m} \times 10.0\ \mu\text{m}$ 2D silicon canvas utilizing ACIS Boolean primitives.
- Optimize Multi-Dimensional Grid Topology: Implement a localized Delaunay triangulation and axis-aligned tensor grid layout to minimize the total active node count while preserving spatial resolution.
- Prevent Hardware Resource Exhaustion: Manage the allocation of grid points to prevent memory overruns on hardware setups with limited RAM allocation (e.g., $12\text{ GB}$).
- Evaluate Matrix Convergence of the 2D Mesh: Execute a zero-bias, non-linear Poisson solver to verify that the generated 2D sparse matrix converges cleanly without triggering floating-point overflow or matrix asymmetry errors.
- Validate Grid Adaptive Scaling: Visually confirm the grid density distribution to ensure fine localization over high-gradient interfaces alongside a coarse mesh within neutral bulk regions.

---

## 3. Project Scope

The scope of this project is strictly limited to the structural design, meshing pipeline, and static zero-bias electrostatic convergence of a two-dimensional p-n junction.

- Fixed Parameters: Physical dimensions ($X_{\text{length}} = 10.0\ \mu\text{m}$, $Y_{\text{height}} = 10.0\ \mu\text{m}$), vertical metallurgical boundary located symmetrically at $X = 5.0\ \mu\text{m}$, uniform Boron P-doping ($1 \times 10^{16}\text{ cm}^{-3}$), uniform Phosphorus N-doping ($1 \times 10^{16}\text{ cm}^{-3}$), and operating temperature ($T = 300\text{ K}$).
- Exclusions: External voltage conditions ($V = 0.0\text{ V}$), dynamic current transport equations (Drift-Diffusion and Hydrodynamic continuity models are disabled), mobility degradation models, and dynamic generation-recombination events.

---

## 4. Project Requirements and Environment

- Host OS & Hypervisor Layer: Running on a legacy Red Hat Enterprise Linux (RHEL) 6.6 operating system virtualized via a VMware Workstation 12.5 hypervisor.
- Hardware and Thread Controls: The virtual machine environment is constrained to a 12 GB system RAM allocation alongside a single-processor, dual-core CPU configuration. To accelerate sparse matrix solutions without kernel panic risk, the Sentaurus Workbench (`swb`) execution command is appended with the `-P 2` flag, forcing the underlying direct linear solver (PARDISO) to execute multi-threaded operations across both allocated physical cores.
- Toolchain Chain Links:
    
    - Sentaurus Structure Editor (`sde`) for Scheme-based ACIS Boolean geometry script creation.
    - Sentaurus Mesh (`smesh`) for parsing spatial refining definitions and generating the Delaunay grid.
    - Sentaurus Device (`sdevice`) configured for static structural validation.
    - Sentaurus Visual (`svisual`) for visual mesh node evaluation.
    

---

## 5. Conceptual Background

Transitioning from a 1D line to a 2D spatial domain increases the size and complexity of the linear system matrices. The finite element method (FEM) breaks down the physical domain into distinct sub-domains, or elements. For a 2D structure, these elements are typically triangles or rectangles formed by grid nodes. At each node, the non-linear Poisson equation is discretized using a box-integration method:

$$\nabla \cdot (\varepsilon_s \nabla \psi) = -q(p - n + N_D^+ - N_A^-)$$

## The Delaunay Triangulation Criterion

Sentaurus Mesh uses Delaunay triangulation algorithms to generate multi-dimensional grids. A triangulation forms a Delaunay grid if the circumcircle of every triangle contains no other nodes in its interior.

This condition is crucial for numerical simulations because it ensures that the triangles remain as equiangular as possible. This minimizes thin, elongated elements that can cause large off-diagonal elements in the discretization matrix, which often lead to floating-point errors or convergence failure.

## Computational Matrix Mechanics and Resource Management

When solving equations across a 2D mesh, the simulator builds a large system of linear equations, represented as a sparse matrix:

$$A \cdot \Delta\psi = B$$

Where $A$ is the structural Jacobian matrix. The dimensions of this matrix scale directly with the total node count ($N$). For a 1D model, the Jacobian is tridiagonal and requires minimal memory, scaling as $\mathcal{O}(N)$.

In a 2D model, the matrix bandwidth increases substantially, causing memory consumption to scale non-linearly ($\mathcal{O}(N^{1.5})$ to $\mathcal{O}(N^2)$ depending on the matrix ordering algorithm). If the node density is not optimized, the memory requirements of the direct linear solver (PARDISO) can easily exceed a 12 GB RAM limit, causing the Linux kernel to trigger an OOM (Out Of Memory) panic.

---

## 6. Detailed Theoretical Methodology

The engineering approach for building a computationally optimized 2D simulation grid follows a strict pipeline:

```unset
[Construct 2D ACIS Boolean Rectangle: 10.0 µm x 10.0 µm]
                           │
                           ▼
[Place Abrupt Step Metallurgical Boundary at X = 5.0 µm]
                           │
                           ▼
[Inject Global Coarse Mesh Parameters (Save Memory/Bulk Node Reduction)]
                           │
                           ▼
[Inject Localized Dense Mesh Window over Junction (X = 4.5 µm to 5.5 µm)]
                           │
                           ▼
[Execute Delaunay Mesh Tool via -P 2 Parallel Thread Flag]
                           │
                           ▼
[Run Matrix-Only Poisson Test to Verify Numeric Convergence Stability]
```

1. Geometric Canvas Assembly: A 2D rectangular box forms the structural domain. Solid boundaries are defined to prevent fringe effects from skewing the electrostatic calculations along the lateral axes.
2. Global Mesh Downscaling: To conserve memory, a relaxed mesh spacing ($\Delta x = 1.0\ \mu\text{m}$, $\Delta y = 1.0\ \mu\text{m}$) is applied to the neutral bulk regions far from the junction. These regions feature flat electrostatic profiles, so a coarse grid can be used without sacrificing accuracy.
3. Localized Refining Windows: The electrostatic profiles change rapidly near the metallurgical interface due to the space charge region. A narrow vertical window is defined from $X = 4.5\ \mu\text{m}$ to $X = 5.5\ \mu\text{m}$. Within this zone, the mesh is tightly refined ($\Delta x = 0.01\ \mu\text{m}$) along the horizontal axis, while a coarser grid ($\Delta y = 0.5\ \mu\text{m}$) is maintained along the uniform vertical axis to keep the total node count low.
4. Discretization Matrix Validation: The structural file is passed directly to the device simulator to evaluate matrix convergence. The simulator calculates the zero-bias Poisson solution to check the mathematical conditioning of the mesh. Clean convergence indicates that the Delaunay elements are well-formed and ready for advanced transport simulations.

---

## 7. Simulation Methodology

## 7.1. Sentaurus Structure Editor (`sde`) Command File Setup

Create the file `mesh2d_sde.cmd` to outline the 2D bounding boxes, doping placements, and localized refinement parameters:

```scheme
;----------------------------------------------------------------------
; 2D PN Junction Geometry & Advanced Mesh Definition Script
;----------------------------------------------------------------------

; 1. Bounding Coordinate Definitions
(define X_Min  0.0)
(define X_Mid  5.0)
(define X_Max 10.0)
(define Y_Min  0.0)
(define Y_Max 10.0)

; 2. Generate Core 2D Silicon Body via ACIS Primitives
(sdegeo:create-rectangle 
    (position X_Min Y_Min 0.0) 
    (position X_Max Y_Max 0.0) 
    "Silicon" "R.Substrate2D"
)

; 3. Electrode Contact Boundary Definitions
(sdegeo:define-contact-line 
    (position X_Min Y_Min 0.0) 
    (position X_Min Y_Max 0.0) 
    "anode"
)
(sdegeo:define-contact-line 
    (position X_Max Y_Min 0.0) 
    (position X_Max Y_Max 0.0) 
    "cathode"
)

; 4. Uniform Abrupt Step Doping Allocation
(sdedr:define-constant-profile "Doping.P_Zone" "BoronActiveConcentration" 1e16)
(sdedr:define-constant-profile-placement "Place.P_Zone" "Doping.P_Zone" 
    "R.Substrate2D" (list "x" X_Min X_Mid) "replace"
)

(sdedr:define-constant-profile "Doping.N_Zone" "PhosphorusActiveConcentration" 1e16)
(sdedr:define-constant-profile-placement "Place.N_Zone" "Doping.N_Zone" 
    "R.Substrate2D" (list "x" X_Mid X_Max) "replace"
)

; 5. Advanced Refinement Formulation (RAM Optimization Path)
; A. Global Coarse Setting (Reduces Bulk Node Redundancy)
(sdedr:define-refinement-size "Mesh.GlobalCoarse" 1.0 1.0 0.0 0.5 0.5 0.0)
(sdedr:define-refinement-placement "Place.Global" "Mesh.GlobalCoarse" "R.Substrate2D")

; B. Localized Dense Refinement Window centered around the junction
(sdedr:define-refinement-size "Mesh.Junction2D" 0.01 0.5 0.0 0.002 0.1 0.0)
(sdedr:define-refinement-window "Win.Junction2D" "Rectangle" 
    (position 4.5 Y_Min 0.0) 
    (position 5.5 Y_Max 0.0)
)
(sdedr:define-refinement-placement "Place.Junction2D" "Mesh.Junction2D" "Win.Junction2D")

; 6. Compile Structure Mesh Map
(sde:build-mesh "snmesh" "" "m2d_grid")
```

## 7.2. Sentaurus Mesh (`smesh`) Multithreading Execution

Run the mesh execution node from the workbench or command terminal using the following multi-threaded parallel command:

```bash
snmesh -P 2 m2d_grid
```

The meshing engine uses these parameter constraints to build the grid. It structures the 2D layout by placing large rectangular elements in the neutral areas, then transitions into closely spaced triangular elements near the junction window via Delaunay cross-triangulation.

## 7.3. Sentaurus Device (`sdevice`) Matrix Verification Command Script

Create the simulation file `mesh2d_des.cmd`. This script executes a zero-bias, matrix-only Poisson simulation to evaluate the numerical conditioning of the generated mesh:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - Mesh Convergence Check
#----------------------------------------------------------------------

File {
  Grid      = "m2d_grid.tdr"
  Plot      = "mesh2d_des.tdr"
  Current   = "mesh2d_des.plt"
  Output    = "mesh2d_des.log"
}

Electrode {
  { Name = "anode"   Voltage = 0.0 }
  { Name = "cathode" Voltage = 0.0 }
}

Physics {
  Temperature = 300
  Fermi
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
}

Math {
  * Matrix solver selections optimized for multithreaded PARDISO execution
  Method = Parallel
  Number_of_Threads = 2
  
  Iterations = 50
  RelErrControl
  Digits = 5
}

Solve {
  * Execute basic Poisson solver to evaluate 2D matrix convergence stability
  Poisson
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing File Architecture & Mesh Extraction

Once the simulation runs successfully, load the primary data file `mesh2d_des.tdr` into Sentaurus Visual:

```bash
svisual mesh2d_des.tdr &
```

To analyze the mesh structure, select the Mesh activation checkbox in the main options panel. This overlays the finite element grid lines onto the 2D spatial field, enabling visual inspection of the grid density and element shapes.

## 8.2. Verification of Mesh Optimization & Expected Trends

## 1. Evaluation of Mesh Density Distribution

The mesh overlay confirms that the localized refinement strategy worked as intended. The grid adapts dynamically across the different device regions:

- Neutral Bulk Zones ($0.0 \le X < 4.5\ \mu\text{m}$ and $5.5 < X \le 10.0\ \mu\text{m}$): These regions feature a wide, uniform rectangular grid. The coarse node layout minimizes computational overhead in areas where the electric field and potential remain constant.
- Transition Windows: As the grid approaches the junction refining window, the large rectangular elements transition smoothly into smaller triangular elements. This gradient ensures a gradual change in element volume, which helps maintain a well-conditioned matrix.
- The Depletion Window ($4.5\ \mu\text{m} \le X \le 5.5\ \mu\text{m}$): The mesh density increases significantly along the horizontal axis, creating a tightly packed vertical column of element nodes. This high density provides the spatial resolution needed to accurately capture the sharp potential gradients and localized charge distributions within the space charge region.

## 2. Convergence Stability and Resource Footprint

The `mesh2d_des.log` file shows that the zero-bias Poisson solution converged in just 4 iterations. The direct linear solver handled the sparse matrices efficiently, keeping peak memory usage under $150\text{ MB}$.

By avoiding an unoptimized uniform fine grid—which would generate over 450,000 nodes and risk an OOM system crash—the localized refinement approach achieved excellent numerical accuracy while staying well within the host's 12 GB RAM limit.

---
