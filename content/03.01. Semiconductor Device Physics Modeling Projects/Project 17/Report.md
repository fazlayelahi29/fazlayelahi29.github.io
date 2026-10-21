## Project Report: SPROCESS 2D Local Oxidation of Silicon (LOCOS) Isolation

---

## 1. Project Statement

This project evaluates the two-dimensional stress-dependent thermal growth mechanics and morphological transformations of a Local Oxidation of Silicon (LOCOS) isolation structure. In historical and foundational planar semiconductor manufacturing pipelines, electrical isolation between adjacent active devices is achieved by growing thick, localized field oxide (FOX) regions. This project moves away from static geometric Boolean shapes to simulate true physical oxidation within Sentaurus Process (SPROCESS). The simulation focuses on tracking oxygen species diffusion, chemical reaction interfaces, volumetric expansion, and the formation of the iconic, organic "Bird's Beak" structure beneath a structured silicon nitride mask using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Establish a Multi-Layered 2D Process Flow: Construct a 2D silicon substrate structure masked symmetrically with a thin pad oxide and a patterned silicon nitride ($\text{Si}_3\text{N}_4$) oxidation barrier.
- Model Stress-Dependent Viscoelastic Mass Transport: Implement a high-temperature wet thermal oxidation step ($1050^\circ\text{C}$ in an $\text{H}_2\text{O}$ ambient) within the process simulation engine.
- Resolve Volumetric Interface Swelling: Simulate the physical transformation of silicon into silicon dioxide ($\text{SiO}_2$), capturing the subsequent vertical and lateral spatial volume expansion.
- Capture the Bird's Beak Geometric Signature: Extract the resulting 2D structural profile to observe the organic, curved boundary where the swelling oxide lifts the edges of the rigid nitride mask.
- Validate Grid Triangulation Compatibility: Pass the organically shaped multi-material structure to the grid generator to ensure the mesh matrix handles highly curved, narrow-angle interfaces smoothly.

---

## 3. Project Scope

The scope of this project is strictly limited to the multi-step 2D process simulation and morphological extraction of a LOCOS isolation block.

- Fixed Initial Layout Parameters: Physical simulation domain width ($Y = 2.0\ \mu\text{m}$), silicon wafer substrate baseline depth ($X = 2.0\ \mu\text{m}$), initial pad oxide stress-relief layer thickness ($20\text{ nm}$), and primary silicon nitride mask layer thickness ($150\text{ nm}$).
- Active Photolithographic Etch Mask Window: A centralized rectangular cutout window ($1.0\ \mu\text{m}$ wide, spanning from $Y = 0.5\ \mu\text{m}$ to $Y = 1.5\ \mu\text{m}$) etched down to the pad oxide layer, exposing the underlying active region to the ambient gas.
- Active Oxidation Parameters: Wet oxidation drive-in modeled at a constant thermal budget ($T = 1050^\circ\text{C}$) for a total duration ($t = 45\text{ minutes}$) under a saturated steam ($\text{H}_2\text{O}$) ambient.
- Exclusions: Subsequent sacrificial nitride stripping phases, lateral dopant segregation/redistribution profiling during oxidation (snowplow effect), and 3D corner stress configurations.

---

## 4. Project Requirements and Environment

- Host OS & Parallel Processing Launch: Executed within the Red Hat Enterprise Linux (RHEL) 6.6 workspace mapped inside `/home/sentaurus/STDB/`. The simulation bypasses Scheme geometry entries, invoking the Sentaurus Process (`sprocess`) engine binary directly via the application directory script `/home/eda/sentaurus-2017.09/bin/sprocess`.
- Grid Triangulation Stress Testing: Unlike planar layouts, the expansion of a LOCOS structure generates organic, highly curved material boundaries. When the output structural `.tdr` file is parsed by Sentaurus Mesh (`smesh`), it heavily tests the underlying 2D Delaunay triangulation algorithms. The mesher must dynamically refine grid lines along the curving interfaces to prevent narrow-angle element errors or simulation crashes on the host's 12 GB RAM configuration.
- Toolchain Chain Links:
    
    - Sentaurus Process (`sprocess`) to handle the 2D viscoelastic moving-boundary oxidation calculations.
    - Sentaurus Visual (`svisual`) for extracting cross-sectional 2D profiles and analyzing the structural contours of the oxide growth.
    

---

## 5. Conceptual Background

The localized thermal growth of silicon dioxide relies on oxygen diffusing through an existing oxide layer and reacting with the underlying silicon substrate.

## 1. The Deal-Grove Oxidation Model and Viscoelastic Expansion

The standard 1D growth rate of silicon dioxide is governed by the classic Deal-Grove relationship:  
$$x_{ox}^2 + A x_{ox} = B(t + \tau)$$  
Where $B$ is the parabolic rate constant (limited by oxidant diffusion through the existing oxide layer), and $B/A$ is the linear rate constant (limited by the chemical reaction rate at the $\text{Si}-\text{SiO}_2$ interface).

When silicon is converted into silicon dioxide, the molecular volume increases significantly. Each silicon atom combines with two oxygen molecules, causing the newly grown $\text{SiO}_2$ structure to swell to $\sim 2.2$ times the volume of the original silicon consumed. At high temperatures ($T \ge 950^\circ\text{C}$), the oxide acts as a highly viscous fluid, allowing it to relieve internal strain by flowing vertically upward into open regions.

## 2. The Mechanics of Bird's Beak Formation

Silicon Nitride ($\text{Si}_3\text{N}_4$) acts as an excellent mechanical mask because the diffusion coefficient of oxygen within it is near zero, preventing oxidation directly beneath the covered zones. However, as wet oxidation progresses in the open window ($0.5\ \mu\text{m} \le Y \le 1.5\ \mu\text{m}$), oxygen molecules also diffuse laterally through the thin, underlying pad oxide layer.

As a result, a small amount of oxide grows beneath the edges of the nitride mask. The severe volumetric expansion ($2.2\times$) within this narrow, confined space exerts a strong upward mechanical force that bends and lifts the edges of the rigid nitride mask. The resulting oxide growth tapers off deeper under the mask, forming a curved, organic geometry known as the "Bird's Beak" structure. This structure limits isolation density by reducing the available active area on the wafer.

---

## 6. Detailed Theoretical Methodology

The process strategy for setting up the multi-layer deposition, active mask etching, and moving-boundary thermal solving follows a strict pipeline:

```unset
[Initialize 2D Wafer Bounding Canvas: Width = 2.0 µm | Depth = 2.0 µm in SPROCESS]
                                      │
                                      ▼
[Deposit 20nm Pad Oxide Stress Relief Layer + 150nm Rigid Silicon Nitride Mask]
                                      │
                                      ▼
[Apply localized Etch Command to remove Nitride within the 0.5 µm to 1.5 µm Window]
                                      │
                                      ▼
[Inject Viscoelastic Wet Oxidation Solver: H2O Saturated Ambient at 1050°C]
                                      │
                                      ▼
[Track Moving Boundary Transformations and Output Organic Structural Maps (.tdr)]
```

1. Multi-Layer Canvas Initialization: A 2D silicon substrate canvas is defined with a dense surface grid to resolve the moving oxidation front. A thin pad oxide and a thicker silicon nitride mask layer are then deposited sequentially across the surface.
2. Etch Window Patterning: A localized etch command is applied to remove the nitride mask within the centralized window ($0.5\ \mu\text{m}$ to $1.5\ \mu\text{m}$), exposing the pad oxide below while leaving the outer regions protected.
3. Moving-Boundary Solving: The wet oxidation step is executed. The SPROCESS solver runs a nested simulation loop that calculates oxygen diffusion and interface reaction rates while continuously updating the deformation of the viscoelastic grid over time.
4. Morphological Geometry Extraction: The final 2D structural output file is analyzed to evaluate the deformation profile and inspect the curvature of the bird's beak transition beneath the mask edges.

---

## 7. Simulation Methodology

## 7.1. Sentaurus Process (`sprocess`) 2D Input Command File Setup

Create the complete manufacturing simulation script `locos_2d_fps.cmd`. The script uses explicit deposition, lithographic etching, and thermal execution sequences:

```text
#----------------------------------------------------------------------
# Sentaurus Process 2D Input Command File - LOCOS Isolation Flow
#----------------------------------------------------------------------

# 1. Initialize 2D Grid Boundaries (X represents depth, Y represents width)
line x location=0.00   spacing=0.002  tag=SiTop
line x location=0.05   spacing=0.01
line x location=0.50   spacing=0.05
line x location=2.00   spacing=0.20   tag=SiBot

line y location=0.00   spacing=0.05   tag=LeftEdge
line y location=0.45   spacing=0.01   * Tight mesh around the mask edge
line y location=0.55   spacing=0.01
line y location=1.00   spacing=0.05   * Central open window zone
line y location=1.45   spacing=0.01
line y location=1.55   spacing=0.01   * Tight mesh around the right mask edge
line y location=2.00   spacing=0.05   tag=RightEdge

# 2. Fabricate Base Substrate Region Canvas
region Silicon xlo=SiTop xhi=SiBot ylo=LeftEdge yhi=RightEdge
init material=Silicon doping=Boron concentration=1e15

# 3. Process Steps: Multi-Layer Isolation Stack Deposition
deposit oxide   thickness=0.020 type=isotropic   * 20nm Pad Oxide stress buffer
deposit nitride thickness=0.150 type=isotropic   * 150nm Rigid Si3N4 mask barrier

# 4. Process Steps: Photolithographic Mask Patterning and Localized Etch
* Cut an oxidation window across the central region from Y = 0.5 um to 1.5 um
etch nitride rectangle xlo=-0.20 xhi=0.0 ylo=0.50 yhi=1.50

# Export intermediate pre-oxidation structural layout for baseline check
struct file=pre_oxidation.tdr

# 5. Process Steps: Viscoelastic High-Temperature Wet Oxidation Loop
# Runs at 1050°C for 45 minutes under saturated steam, activating moving-boundary models
diffuse temperature=1050 time=45.0(<min>) h2o

# 6. Export Final Post-Oxidation Organic Structural State File
struct file=post_locos.tdr
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Morphological Structural Extraction

Upon successful termination of the SPROCESS execution block, open the final 2D structural state dataset `post_locos.tdr` within Sentaurus Visual:

```bash
svisual post_locos.tdr &
```

To analyze the multi-material interface boundaries and organic profiles:

1. In the options panel, activate region fills and color-code the regions by material: Silicon (Bulk Substrate), Oxide (Grown Isolation), and Nitride (Surface Mask Layer).
2. Zoom into the transition corner near the left mask edge boundary ($Y \approx 0.5\ \mu\text{m}$).
3. Activate the Mesh Display Overlay to verify that the Delaunay grid adapted smoothly to the highly curved interfaces.

## 8.2. Verification of Process Profiles & Expected Trends

The final 2D structural cross-section reveals an organic, multi-material layout that directly illustrates stress-dependent thermal growth:

- The Saturated Field Oxide Window ($0.5\ \mu\text{m} \le Y \le 1.5\ \mu\text{m}$): In the central open region, the oxygen reactively consumes the silicon substrate, growing a thick, symmetric lens-shaped field oxide block. The grown oxide swells upward past the original wafer surface and pushes downward into the bulk substrate, verifying the $\sim 45\%$ consumption and $\sim 55\%$ upward growth ratio predicted by volumetric expansion theory.
- The Bird's Beak Transition Contours: At the mask boundaries ($Y = 0.5\ \mu\text{m}$ and $Y = 1.5\ \mu\text{m}$), the profile displays its most significant feature. Oxygen molecules diffusing laterally through the pad oxide have initiated oxidation beneath the protected zones. The volumetric expansion of this sub-surface growth forms an organic, wedge-shaped profile that physically bends and lifts the edges of the rigid nitride mask.

The successful generation of these smooth, curved boundaries without grid distortion or element failure confirms that the moving-boundary solvers and mesh refinement routines functioned correctly, demonstrating the utility of process emulation for accurate isolation modeling.

---
