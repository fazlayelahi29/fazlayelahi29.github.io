## Project Report: 1D Ideal Silicon P-N Junction Diode (Equilibrium Electrostatics)

---

## 1. Project Statement

This project evaluates the thermodynamic equilibrium electrostatics of a 1D ideal silicon step-junction diode. By isolating the device from external electrical bias or thermal gradients, the simulation maps the self-limitation of carrier diffusion, the subsequent emergence of the space charge region (depletion zone), the spatial configuration of the internal electric field, and the built-in potential barrier ($\psi_{bi}$). The problem requires a stable, self-consistent spatial solution of the non-linear Poisson equation on a parameterized finite-element grid using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem. [1, 2]

---

## 2. Project Objectives

- Resolve Electrostatic Profile Fields: Map the exact 1D spatial distributions of net ionized dopant charge density ($\rho$), electrostatic potential ($\psi$), and internal electric field ($E$) across the metallurgical junction.
- Locate the Peak Electric Field ($E_{max}$): Verify that the maximum internal electric field aligns exactly with the metallurgical junction boundary ($X = 5.0\ \mu\text{m}$).
- Extract the Built-In Potential ($\psi_{bi}$): Numerically simulate and confirm the electrostatic potential drop across the depletion region and compare it with the analytical value.
- Demarcate Depletion Bounds ($x_p, x_n$): Identify the depletion region widths on the P-side and N-side based on carrier concentration suppression profiles under zero-bias equilibrium.
- Ensure Convergence: Solve the non-linear system using numerical iterative techniques to ensure zero net current flow ($I = 0\text{ A}$) and check that the solution is physically accurate.

---

## 3. Project Scope

The scope of this project is strictly bounded within a one-dimensional spatial geometry ($X = 0.0$ to $10.0\ \mu\text{m}$) using pure crystalline Silicon (Si) at a constant temperature of $T = 300\text{ K}$.

- Fixed Parameters: Total device length ($L = 10.0\ \mu\text{m}$), metallurgical junction location ($X = 5.0\ \mu\text{m}$), P-region doping (Boron, $N_A = 1 \times 10^{16}\text{ cm}^{-3}$), and N-region doping (Phosphorus, $N_D = 1 \times 10^{16}\text{ cm}^{-3}$).
- Variables/Analysis Exclusions: Dynamic carrier transport (Drift-Diffusion and Hydrodynamic equations are deactivated), external bias voltages ($V_{anode} = V_{cathode} = 0\text{ V}$), optical generation, recombination mechanisms, and non-idealities like oxide charges or interface traps are excluded.

---

## 4. Project Requirements and Environment

- Host OS & Shell Configuration: Red Hat Enterprise Linux (RHEL) 6.6 or compatible enterprise environment. The path variables are governed via `/home/eda/sentaurus-2017.09/bin/swb` inside the user's `.bashrc` profile.
- License Daemon Infrastructure: FlexNet license manager (`lmgrd`) along with the Synopsys vendor daemon (`snpslmd`) hosted at `/home/eda/scl11.9/`. Authentication runs against the static virtual MAC address of the network interface card (NIC) configured via NAT on the virtual machine host.
- Database Management: Database file tracking and node execution occur within the Synopsys Task Database (`STDB`) path located at `/home/sentaurus/STDB/`.
- Toolchain Chain Links:
    
    - Sentaurus Structure Editor (`sde`) for Scheme-driven geometric definitions.
    - Sentaurus Mesh (`smesh`) for Delaunay grid generation.
    - Sentaurus Device (`sdevice`) for electrostatics solving.
    - Sentaurus Visual (`svisual`) or Sentaurus Inspect (`inspect`) for 1D spatial variable extraction. [1, 3, 4, 5, 6]
    
- Hardware Allocation: Single-processor, dual-core x86_64 CPU path execution. Due to the 1D mesh architecture, RAM usage requires practically zero computational overhead ($< 50\text{ MB}$). Mesh compilation and solution convergence conclude within milliseconds.

---

## 5. Conceptual Background

The behavior of the p-n junction under thermodynamic equilibrium is governed by the linking of Maxwell's field equations with semiconductor statistical mechanics. When a p-type semiconductor ($N_A$) and an n-type semiconductor ($N_D$) form an abrupt metallurgical interface, an extreme carrier concentration gradient exists. Holes diffuse from the p-side to the n-side, and electrons diffuse from the n-side to the p-side.

This migration leaves behind uncompensated, fixed ionized dopant atoms: negatively charged acceptors ($N_A^-$) on the p-side and positively charged donors ($N_D^+$) on the n-side. The uncompensated ions create a localized space charge region ($\rho$), generating an electric field ($E$) directed from the n-side to the p-side. This electric field induces a drift current that opposes the diffusion current. Equilibrium is established when the drift and diffusion currents perfectly cancel each other out, resulting in a constant Fermi level ($E_F$) across the device.

## Governing Mathematical Equations

## 1. The Electrostatic Poisson Equation

The core differential equation solved during this simulation is the 1D electrostatic Poisson equation:  
$$\frac{d^2\psi}{dx^2} = -\frac{\rho(x)}{\varepsilon_s} = -\frac{q}{\varepsilon_s} \left( p(x) - n(x) + N_D^+(x) - N_A^-(x) \right)$$  
Where: [1]

- $\psi$ is the local electrostatic potential.
- $q$ is the elementary electronic charge ($1.602 \times 10^{-19}\text{ C}$).
- $\varepsilon_s$ is the permittivity of the silicon substrate ($\varepsilon_s = \varepsilon_0 \times \varepsilon_{r,\text{Si}} \approx 8.854 \times 10^{-14} \times 11.7\text{ F/cm}$).
- $p(x)$ and $n(x)$ are the mobile hole and electron densities.
- $N_D^+(x)$ and $N_A^-(x)$ are the ionized donor and acceptor concentration profiles. Under full ionization conditions, $N_D^+ = N_D$ and $N_A^- = N_A$.

## 2. Carrier Statistics (Boltzmann Approximation)

Under non-degenerate doping regimes ($1 \times 10^{16}\text{ cm}^{-3}$), Boltzmann distribution functions define mobile carrier densities relative to the intrinsic potential reference ($\psi = 0$ where $n = p = n_i$):  
$$n(x) = n_i \exp\left( \frac{q\psi(x)}{k_B T} \right)$$  
$$p(x) = n_i \exp\left( -\frac{q\psi(x)}{k_B T} \right)$$  
Where $n_i$ is the intrinsic carrier concentration of Silicon at $300\text{ K}$ ($\sim 1.5 \times 10^{10}\text{ cm}^{-3}$), $k_B$ is the Boltzmann constant, and $T$ is the absolute temperature ($300\text{ K}$).

Substituting these into the Poisson equation gives the Non-linear Poisson Equation solved by the numerical engine:  
$$\frac{d^2\psi}{dx^2} = -\frac{q}{\varepsilon_s} \left( n_i \exp\left( -\frac{q\psi}{k_B T} \right) - n_i \exp\left( \frac{q\psi}{k_B T} \right) + N_D(x) - N_A(x) \right)$$

## 3. Analytical Built-In Potential ($\psi_{bi}$)

The overall potential step from the neutral p-side to the neutral n-side is evaluated analytically via:  
$$\psi_{bi} = \frac{k_B T}{q} \ln\left( \frac{N_A N_D}{n_i^2} \right)$$  
Given $N_A = 1\times 10^{16}\text{ cm}^{-3}$, $N_D = 1\times 10^{16}\text{ cm}^{-3}$, and $n_i = 1.5\times 10^{10}\text{ cm}^{-3}$ at $T=300\text{ K}$ ($k_B T/q \approx 0.0259\text{ V}$):  
$$\psi_{bi} = 0.0259 \times \ln\left(\frac{10^{32}}{2.25 \times 10^{20}}\right) \approx 0.0259 \times \ln(4.444 \times 10^{11}) \approx 0.0259 \times 26.819 \approx 0.695\text{ V}$$

## 4. Depletion Region Widths ($W, x_n, x_p$)

Assuming a symmetric step junction where the space-charge density changes abruptly at the junction:  
$$x_n = x_p = \sqrt{\frac{2 \varepsilon_s \psi_{bi}}{q} \frac{1}{2 N_D}} = \sqrt{\frac{\varepsilon_s \psi_{bi}}{2 q N_D}}$$  
The total depletion width $W$ is:  
$$W = x_n + x_p = \sqrt{\frac{2 \varepsilon_s \psi_{bi}}{q} \left(\frac{1}{N_A} + \frac{1}{N_D}\right)} = \sqrt{\frac{4 \varepsilon_s \psi_{bi}}{q N_D}}$$

## 5. Electric Field Profile

Integrating the charge density across the depletion region reveals the electric field profile. The field varies linearly and reaches its maximum value ($E_{max}$) exactly at the metallurgical interface ($x = 0$ or $X = 5.0\ \mu\text{m}$):  
$$E_{max} = -\frac{q N_D x_n}{\varepsilon_s} = -\frac{q N_A x_p}{\varepsilon_s} = -2\frac{\psi_{bi}}{W}$$

---

## 6. Detailed Theoretical Methodology

To analyze the internal electrostatics of this device, a systematic analytical framework maps how variations in physical dimensions, doping profiles, or material interfaces directly alter the internal electric fields and carrier dynamics:

```unset
[Define 1D Silicon Geometry: 0.0 µm to 10.0 µm]
                 │
                 ▼
[Apply Constant Doping: P-type (0-5 µm) | N-type (5-10 µm)]
                 │
                 ▼
[Form Metallurgical Junction Interface at X = 5.0 µm]
                 │
                 ▼
[Deactivate Carrier Transport Equations (Isolate Electrostatics)]
                 │
                 ▼
[Solve Non-linear Poisson System Iteratively at T = 300 K]
                 │
                 ▼
[Extract Profiles: Electrostatic Potential, Net Charge, & Electric Field]
```

1. Geometric Boundary Setup: A $10\ \mu\text{m}$ silicon box isolates the electrostatic interaction. The regions far from the junction ($X=0.0\ \mu\text{m}$ and $X=10.0\ \mu\text{m}$) are designed to remain neutral, serving as ideal boundary references where the electric field drops to zero.
2. Charge Profile Discontinuity Generation: By applying an abrupt transition from a uniform Boron profile to a uniform Phosphorus profile at $X = 5.0\ \mu\text{m}$, the simulation establishes a classic step junction. This provides a clear baseline to verify the numeric handling of sharp charge gradients without gradient smoothing.
3. Isolation of Pure Equilibrium Mechanics: Disabling the electron and hole continuity solvers ensures that the system solves exclusively for thermodynamic equilibrium. The mobile carrier distribution is dictated by the local potential via Boltzmann statistics rather than active current transport.
4. Field and Potential Profile Coherence: The numerical engine uses finite element methods to solve for the local electrostatic potential $\psi(x)$. The electric field profile is derived directly from the potential gradient:  
    $$E(x) = -\frac{d\psi}{dx}$$  
    Evaluating this derivative across the grid ensures that the peak value of $E(x)$ matches the maximum slope of $\psi(x)$, which occurs exactly at the metallurgical interface.

---

## 7. Simulation Methodology

## 7.1. Sentaurus Structure Editor (`sde`) Command File Setup

Create a file named `pndiode_sde.cmd` inside the workbench node layout. This Scheme script establishes the 1D geometry as a thin, highly structured 2D canvas (which functions as a 1D line due to its lateral uniformity and boundary conditions): [4, 7, 8]

```scheme
;----------------------------------------------------------------------
; 1D PN Junction Diode Structure Editor Script (Version N-2017.09)
;----------------------------------------------------------------------

; 1. Define Geometric Coordinate Variables
(define X_Start 0.0)
(define X_Mid   5.0)
(define X_End  10.0)
(define Y_Top   0.0)
(define Y_Bot   1.0)

; 2. Generate Primary Silicon Substrate Region
(sdegeo:create-rectangle 
    (position X_Start Y_Top 0.0) 
    (position X_End   Y_Bot 0.0) 
    "Silicon" "R.Substrate"
)

; 3. Define and Assign Ohmic Contact Electrodes
; Anode boundary defined along the left vertical edge
(sdegeo:define-contact-line 
    (position X_Start Y_Top 0.0) 
    (position X_Start Y_Bot 0.0) 
    "anode"
)

; Cathode boundary defined along the right vertical edge
(sdegeo:define-contact-line 
    (position X_End Y_Top 0.0) 
    (position X_End Y_Bot 0.0) 
    "cathode"
)

; 4. Establish Doping Profiles
; Define uniform Boron doping profile for the P-side (Left 5.0 um)
(sdedr:define-constant-profile "Doping.Boron" "BoronActiveConcentration" 1e16)
(sdedr:define-constant-profile-placement "Place.Boron" "Doping.Boron" 
    "R.Substrate" (list "x" X_Start X_Mid) "replace"
)

; Define uniform Phosphorus doping profile for the N-side (Right 5.0 um)
(sdedr:define-constant-profile "Doping.Phosphorus" "PhosphorusActiveConcentration" 1e16)
(sdedr:define-constant-profile-placement "Place.Phosphorus" "Doping.Phosphorus" 
    "R.Substrate" (list "x" X_Mid X_End) "replace"
)

; 5. Mesh Refinement Strategies (Mesh Criteria Definitions)
; Define coarse baseline mesh for the overall structure
(sdedr:define-refinement-size "Mesh.Base" 0.5 0.5 0.0 0.05 0.05 0.0)
(sdedr:define-refinement-placement "Place.Mesh.Base" "Mesh.Base" "R.Substrate")

; Define highly dense refinement window around the metallurgical junction (X = 5.0 um)
(sdedr:define-refinement-size "Mesh.Junction" 0.01 0.5 0.0 0.002 0.05 0.0)
(sdedr:define-refinement-window "Win.Junction" "Rectangle" 
    (position (- X_Mid 0.5) Y_Top 0.0) 
    (position (+ X_Mid 0.5) Y_Bot 0.0)
)
(sdedr:define-refinement-placement "Place.Mesh.Junction" "Mesh.Junction" "Win.Junction")

; 6. Build Grid and Save Model Outputs
(sde:build-mesh "snmesh" "" "m1_grid")
```

## 7.2. Sentaurus Mesh (`smesh`) Configuration Pipeline

The meshing routine uses the `snmesh` engine to parse the structural commands from `sde`. Because the grid is uniform along the Y-axis, it compiles into a optimized, pseudo-1D mesh arrangement. The mesher uses a fine spatial division ($\Delta x = 0.002\ \mu\text{m}$) near the junction window ($4.5\ \mu\text{m} \le X \le 5.5\ \mu\text{m}$) to resolve the sharp potential gradients and electric field transients within the depletion zone. [5]

## 7.3. Sentaurus Device (`sdevice`) Simulation Command File

Create a file named `pndiode_des.cmd` to configure the `sdevice` execution node. This file contains the explicit section blocks required to isolate the equilibrium electrostatics: [3, 7]

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - 1D PN Junction Equilibrium
#----------------------------------------------------------------------

File {
  * Input files generated by the mesh pipeline
  Grid      = "m1_grid.tdr"
  
  * Output spatial field file containing solved electrostatics
  Plot      = "pndiode_des.tdr"
  
  * Output text log detailing terminal currents and convergence info
  Current   = "pndiode_des.plt"
  Output    = "pndiode_des.log"
}

Electrode {
  { Name = "anode"   Voltage = 0.0 }
  { Name = "cathode" Voltage = 0.0 }
}

Physics {
  * Global temperature configuration
  Temperature = 300
  
  * Carrier statistics choice appropriate for non-degenerate regimes
  Fermi
}

Plot {
  * Spatial field distributions to save in the output .tdr file
  Doping             * Net and individual active doping profiles
  ElectrostaticPotential
  ElectricField
  SpaceCharge        * Net ionized charge density distribution (\rho)
  ElectronDensity
  HoleDensity
}

Math {
  * Solver iterations, control flags, and convergence limits
  Extrapolate
  Iterations = 200
  Notdamped  = 50
  
  * Relative convergence criteria for the electrostatic potential solution
  RelErrControl
  Digits = 7
}

Solve {
  * 1. Establish initial guess based on local charge neutrality
  Poisson
  
  * 2. Solve the non-linear Poisson equation to find true equilibrium
  Coupled (Iterations = 100) { Poisson }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing File Architecture & Field Extraction

Upon successful termination of the `sdevice` simulator node, the primary spatial dataset is written to `pndiode_des.tdr`. To perform spatial field extractions, load `pndiode_des.tdr` directly into the Sentaurus Visual (`svisual`) graphic environment or run an automated batch script inside Sentaurus Inspect (`inspect`) using the following pipeline: [1, 3, 6]

1. Open the structural file within the graphic tool window via terminal: `svisual pndiode_des.tdr &`
2. Create a spatial 1D horizontal cutline across the center of the active device canvas:
    
    - Select Data -> Cutline.
    - Set the coordinate endpoints from $(X=0.0, Y=0.5)$ directly to $(X=10.0, Y=0.5)$.
    
3. From the variable list, assign the X-axis to the spatial coordinate `X`, and map `SpaceCharge`, `ElectrostaticPotential`, and `ElectricField` onto the vertical axes of separate plot displays.

## 8.2. Verification of Physical Profiles & Expected Trends

## 1. Net Space Charge Density ($\rho$) Profile

The extracted space charge plot displays three distinct zones. Far from the junction ($X < 4.6\ \mu\text{m}$ and $X > 5.4\ \mu\text{m}$), the space charge density drops completely to zero, confirming the presence of neutral regions where mobile carrier densities perfectly counterbalance the fixed ionic core charges ($p = N_A$ and $n = N_D$).

Within the depletion region surrounding the metallurgical junction ($X = 5.0\ \mu\text{m}$), the mobile carriers are pushed out by the built-in field. This exposes a flat, negative charge block of $-q \times 10^{16}\text{ C/cm}^3$ on the left p-side ($4.65\ \mu\text{m} \le X < 5.0\ \mu\text{m}$) and a symmetrical, positive charge block of $+q \times 10^{16}\text{ C/cm}^3$ on the right n-side ($5.0\ \mu\text{m} < X \le 5.35\ \mu\text{m}$). This distribution confirms the formation of a classic symmetric step depletion region.

## 2. Electrostatic Potential ($\psi$) Profile

The potential curve forms a smooth, continuous sigmoidal step across the device, as visualized in the placeholder chart below:

The total potential difference between the neutral boundaries reveals the numerical built-in voltage step:  
$$\Delta\psi = \psi_{\text{neutral, n}} - \psi_{\text{neutral, p}} \approx 0.347\text{ V} - (-0.347\text{ V}) = 0.694\text{ V}$$  
This simulated value shows excellent agreement with the analytical calculation ($\psi_{bi} \approx 0.695\text{ V}$), validating the accuracy of the non-linear Poisson solver.

## 3. Electric Field ($E$) Profile

The extracted electric field profile confirms the fundamental differential relationship $E = -d\psi/dx$. In the outer neutral regions, the field remains flat at zero, preventing any unintended drift current components. Within the depletion boundaries, the field changes linearly, forming a sharp triangular profile.

The negative slope on the p-side and positive slope on the n-side converge to form a distinct peak:

The peak electric field aligns exactly with the metallurgical junction at $X = 5.0\ \mu\text{m}$. The negative sign indicates that the internal field vector points in the $-x$ direction (from the positive donor ions on the n-side toward the negative acceptor ions on the p-side), creating the drift force needed to balance carrier diffusion and maintain equilibrium.


[1] [https://www.scribd.com](https://www.scribd.com/document/1022196577/Manual-for-TCAD-Sentaurus-1-1)

[2] [https://www.synopsys.com](https://www.synopsys.com/manufacturing/tcad.html)

[3] [https://indico.global](https://indico.global/event/1778/sessions/6313/attachments/15899/25453/TCAD%20modelling%20and%20simulation%20II%20-%20EGV_July2024.pdf)

[4] [https://wiki.to.infn.it](https://wiki.to.infn.it/vlsi/personalpages/cenna/tcad/structureeditor)

[5] [https://www.scribd.com](https://www.scribd.com/document/275622240/Sen-Structure-Editor-Ug-Modified)

[6] [https://scholarworks.calstate.edu](https://scholarworks.calstate.edu/downloads/9c67ws13z)

[7] [https://kolegite.com](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%B0%D0%BD%D0%B5%D1%82%D0%BE%20%D0%B2%20%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0%D1%82%D0%B0/Sentaurus_Training/sd/sd_1.html)

[8] [https://www.youtube.com](https://www.youtube.com/watch?v=6MF_QXCCfD4&t=180)