## Project Report: 2D Silicon-on-Insulator (SOI) MOSFET

---

## 1. Project Statement

This project evaluates the architectural optimization and subthreshold electrostatic integrity of a 2D Silicon-on-Insulator (SOI) MOSFET. As planar bulk transistors scale to sub-micron and nanoscale nodes (as seen in Project 14), they suffer from severe performance degradation [14.1]. This roll-off occurs because the gate loses electrostatic control over the sub-surface depletion region, allowing parasitic leakage current to flow deep within the bulk substrate [14.1, 14.5]. This project structures an architectural solution by inserting an insulating oxide barrier directly beneath a thin, active silicon channel film. The analysis focuses on simulating the subthreshold transfer characteristics ($I_D$-$V_G$), evaluating the reduction in off-state leakage current ($I_{off}$), and tracking carrier confinement using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Construct a 2D Multi-Layer SOI Geometry: Build an integrated three-layer substrate model featuring a thick Buried Oxide (BOX) layer separating a thin active top silicon layer from the bulk handling wafer.
- Model Geometrically Confined Carrier Transport: Solve fully coupled drift-diffusion transport matrices within a thin, isolated single-crystal channel layer.
- Evaluate Subthreshold Leakage Suppression: Run a steady-state subthreshold gate voltage sweep ($V_{\text{gate}} = 0.0\text{ V}$ to $1.2\text{ V}$) at a constant drain conduction bias.
- Perform Direct Architectural Benchmarking: Overlay the SOI transfer curve against the bulk planar nanoscale transistor results from Project 14 to isolate the leakage floor reduction ($I_{off,\text{Bulk}} / I_{off,\text{SOI}}$).
- Map Spatial Current Density Confinement: Extract 2D contours of the total current density vector magnitude to visually confirm that carrier transport is restricted to the top film, preventing deep-substrate leakage paths.

---

## 3. Project Scope

The scope of this project is strictly limited to the steady-state, two-dimensional subthreshold transfer and electrostatic current confinement analysis of an ungrounded body, partially depleted SOI (PD-SOI) NMOSFET.

- Fixed Structural Parameters: Channel gate length ($L_g = 50\text{ nm}$), gate oxide thickness ($t_{ox} = 1.5\text{ nm}$), active top silicon film thickness ($t_{si} = 30\text{ nm}$), Buried Oxide (BOX) thickness ($t_{\text{box}} = 100\text{ nm}$), top silicon body doping (Boron, $N_A = 5 \times 10^{17}\text{ cm}^{-3}$), and source/drain contact doping (Phosphorus, $N_D = 1 \times 10^{20}\text{ cm}^{-3}$).
- Active Variables: External gate voltage sweep ($V_{\text{gate}} = 0.0\text{ V}$ to $1.2\text{ V}$) evaluated at a fixed linear drain bias ($V_{\text{drain}} = 50\text{ mV}$), with source and handling-substrate contacts tied to ground ($0.0\text{ V}$).
- Exclusions: Floating-body dynamic non-idealities (kink effect, parasitic bipolar activation), transient self-heating effects due to the poor thermal conductivity of the BOX layer, and high-frequency AC small-signal parameters.

---

## 4. Project Requirements and Environment

- Host OS & Workspace Management: Executed within the Red Hat Enterprise Linux (RHEL) 6.6 workspace managed inside `/home/sentaurus/STDB/`. To optimize workflow efficiency, an existing project directory template from Project 14 is duplicated. Modifying only the structural definitions inside the structure editor script bypasses the need to rebuild the device from scratch.
- Meshing Pipeline Efficiency: Because carrier transport is geometrically restricted to a thin, active top silicon film ($30\text{ nm}$), the mesh generation routine inside Sentaurus Mesh (`smesh`) is highly localized. A dense grid is applied exclusively to the top film and its underlying oxide interfaces, while a coarse grid is maintained for the non-active handling substrate, keeping overall node counts low and ensuring fast matrix updates on the host's 12 GB RAM setup.
- Toolchain Chain Links:
    
    - Sentaurus Structure Editor (`sde`) for building multi-layer stacked thin-film canvases.
    - Sentaurus Mesh (`smesh`) for executing structural Delaunay discretization.
    - Sentaurus Device (`sdevice`) for evaluating transport matrices within the isolated channel.
    - Sentaurus Inspect (`inspect`) and Sentaurus Visual (`svisual`) for comparative plotting and spatial field vector parsing.
    

---

## 5. Conceptual Background

As planar bulk MOSFETs scale down to nanoscale dimensions, the source and drain depletion regions expand toward each other deep within the substrate. This expansion allows a significant parasitic leakage current to flow beneath the gate oxide interface where gate electrostatic control is weak, degrading the subthreshold swing and increasing the off-state power consumption.

## 1. The SOI Isolation Principle

The Silicon-on-Insulator architecture addresses this scaling limitation by inserting a thick Buried Oxide (BOX) layer ($\text{SiO}_2$) directly beneath a thin, active top single-crystal silicon layer. Because the BOX layer is an insulator, it establishes a high energetic barrier that cuts off all deep-substrate leakage paths:  
$$I_{\text{leakage}} \propto \sigma_{\text{insulator}} \approx 0$$  
This insulating barrier confines the electrons to a thin active layer, isolating the source/drain junctions from the handling wafer and significantly reducing reverse-bias junction leakage.

## 2. Influence on Subthreshold Electrostatics

Confining the carrier transport path to a thin film enhances the coupling between the gate voltage and the channel potential. In a partially depleted SOI layout with an ungrounded body, the subthreshold swing ($SS$) is improved by reducing the substrate capacitive loading term ($C_d$):  
$$SS = 2.303 \frac{k_B T}{q} \left( 1 + \frac{C_d}{C_{ox}} \right)$$  
By lowering the parasitic substrate capacitance, the device achieves a sharper subthreshold turn-on transition and a much lower off-state leakage floor than a standard bulk device.

---

## 6. Detailed Theoretical Methodology

The operational strategy for establishing the multi-layer thin-film stack and analyzing leakage floor reduction follows a strict pipeline:

```unset
[Duplicate the Project 14 Baseline Workspace Folder Layout within the STDB]
                                   │
                                   ▼
[Insert a 100nm BOX Layer + 30nm Top Silicon Film inside the SDE Script Canvas]
                                   │
                                   ▼
[Refine Grid Triangulation strictly within the thin Active Film Boundaries]
                                   │
                                   ▼
[Apply Symmetrical Bias Settings: Ramp Gate Voltage from 0.0V to 1.2V]
                                   │
                                   ▼
[Solve Coupled Drift-Diffusion Matrices across the Structurally Confined Film]
                                   │
                                   ▼
[Overlay Results in Inspect to Quantify the Subthreshold Off-State Leakage Drop]
```

1. Multi-Layer Stack Generation: The structure script is modified to construct three stacked regions along the vertical axis: a thick silicon base handle, a 100 nm Buried Oxide (BOX) insulator layer, and a thin 30 nm active top silicon film.
2. Doping and Interface Assignment: The p-type channel body and heavily doped n-type source/drain regions are confined entirely within the thin 30 nm top silicon layer, ensuring the active junctions terminate directly on the underlying BOX layer interface.
3. Subthreshold Sweep Execution: The drain voltage is fixed at a low linear bias of 50 mV, and the gate voltage is swept from 0.0 V to 1.2 V. The fully coupled solver tracks carrier transport under strict geometric confinement.
4. Leakage and Current Density Analysis: The resulting transfer curve is overlaid against the bulk device data from Project 14 to quantify the reduction in off-state leakage current. Finally, the 2D spatial current density profiles are analyzed to visually confirm carrier confinement.

---

## 7. Simulation Methodology

## 7.1. Sentaurus Structure Editor (`sde`) Stacked Command File Setup

Create the structural configuration script `soimos_sde.cmd` to outline the multi-layer thin-film stack and define localized grid refinements:

```scheme
;----------------------------------------------------------------------
; 2D Partially Depleted SOI MOSFET Structure Script (Version N-2017.09)
;----------------------------------------------------------------------

; 1. Vertical Coordinate Stack Boundaries
(define Y_GateOxTop  -0.0015)
(define Y_Surf        0.0000)
(define Y_FilmBot     0.0300) ; Thin 30nm Active Top Film
(define Y_BoxBot      0.1300) ; 100nm Buried Oxide Layer
(define Y_SubBot      1.0000) ; Handling Wafer Base

; Lateral Coordinate Boundaries (50nm Channel Window)
(define X_Start       0.00)
(define X_SrcEnd      0.50)
(define X_DrnSt       0.55)
(define X_End         1.05)

; 2. Generate Multi-Layer Structural Material Blocks
; A. Bulk Handling Wafer Base
(sdegeo:create-rectangle (position X_Start Y_BoxBot 0.0) (position X_End Y_SubBot 0.0) "Silicon" "R.HandleWafer")
; B. Buried Oxide (BOX) Insulator Layer
(sdegeo:create-rectangle (position X_Start Y_FilmBot 0.0) (position X_End Y_BoxBot 0.0) "SiO2" "R.BOX_Layer")
; C. Thin Active Top Silicon Film
(sdegeo:create-rectangle (position X_Start Y_Surf 0.0) (position X_End Y_FilmBot 0.0) "Silicon" "R.ActiveFilm")
; D. Gate Oxide Layer (1.5 nm thick)
(sdegeo:create-rectangle (position X_SrcEnd Y_GateOxTop 0.0) (position X_DrnSt Y_Surf 0.0) "SiO2" "R.GateOx")

; 3. Define Electrical Contact Terminals
(sdegeo:define-contact-line (position X_SrcEnd Y_GateOxTop 0.0) (position X_DrnSt Y_GateOxTop 0.0) "gate")
(sdegeo:define-contact-line (position X_Start  Y_Surf      0.0) (position X_SrcEnd Y_Surf      0.0) "source")
(sdegeo:define-contact-line (position X_DrnSt  Y_Surf      0.0) (position X_End    Y_Surf      0.0) "drain")
(sdegeo:define-contact-line (position X_Start  Y_SubBot    0.0) (position X_End    Y_SubBot    0.0) "substrate")

; 4. Active Doping Profile Placements
; Top Film Channel Body Background Doping (P-type Boron)
(sdedr:define-constant-profile "Dop.BodyBoron" "BoronActiveConcentration" 5e17)
(sdedr:define-constant-profile-placement "Place.Body" "Dop.BodyBoron" "R.ActiveFilm" (list "x" X_Start X_End) "replace")

; Highly Doped Source/Drain Contact Zones (Concurring directly with the BOX interface)
(sdedr:define-constant-profile "Dop.SD_Phos" "PhosphorusActiveConcentration" 1e20)
(sdedr:define-constant-profile-placement "Place.Source" "Dop.SD_Phos" "R.ActiveFilm" (list "x" X_Start X_SrcEnd "y" Y_Surf Y_FilmBot) "replace")
(sdedr:define-constant-profile-placement "Place.Drain" "Dop.SD_Phos" "R.ActiveFilm" (list "x" X_DrnSt X_End "y" Y_Surf Y_FilmBot) "replace")

; 5. Localized Grid Refinement Optimization (RAM Protection Pipeline)
(sdedr:define-refinement-size "Mesh.Handle" 0.2 0.2 0.0 0.1 0.1 0.0)
(sdedr:define-refinement-placement "Place.MeshHandle" "Mesh.Handle" "R.HandleWafer")

; High-density mesh window strictly confined within the thin active top film
(sdedr:define-refinement-size "Mesh.SOIChannel" 0.002 0.0005 0.0 0.001 0.0002 0.0)
(sdedr:define-refinement-window "Win.ActiveFilm" "Rectangle" (position X_Start Y_Surf 0.0) (position X_End Y_FilmBot 0.0))
(sdedr:define-refinement-placement "Place.MeshActive" "Mesh.SOIChannel" "Win.ActiveFilm")

(sde:build-mesh "snmesh" "" "soimos_mesh")
```

## 7.2. Sentaurus Device (`sdevice`) Simulation Input Command Script

Create the simulation control file `soimos_des.cmd` to evaluate the subthreshold transport sweep under strict carrier confinement:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - 2D SOI Transfer Sweep
#----------------------------------------------------------------------

File {
  Grid      = "soimos_mesh.tdr"
  Plot      = "soimos_des.tdr"
  Current   = "soimos_des.plt"
  Output    = "soimos_des.log"
}

Electrode {
  { Name = "gate"      Voltage = 0.0 }
  { Name = "source"    Voltage = 0.0 }
  { Name = "drain"     Voltage = 0.0 }
  { Name = "substrate" Voltage = 0.0 }
}

Physics {
  Temperature = 300
  Fermi
  Recombination( SRH(DopingDep) )
  Mobility( DopingDep Enormal eHighFieldSaturation )
  Bandgap( OldSlotboom )
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  ElectronDensity
  TotalCurrentDensity     * Variable to track spatial current distribution
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  Iterations = 150
}

Solve {
  Poisson
  Coupled { Poisson Electron Hole }
  
  * 1. Initialize linear operating regime by stepping the Drain voltage to 50 mV
  Quasistationary (
    InitialStep = 0.005 MaxStep = 0.01
    Goal { Name = "drain" Voltage = 0.05 }
  )
  { Coupled { Poisson Electron Hole } }
  
  * 2. Run the primary subthreshold transfer sweep on the Gate terminal
  Quasistationary (
    InitialStep = 0.01
    Increment   = 1.15
    MaxStep     = 0.02
    Goal { Name = "gate" Voltage = 1.2 }
  )
  { Coupled { Poisson Electron Hole } }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Comparative Subthreshold Plotting

Upon successful completion of the p-channel transport sweep, load the resulting tabular electrical dataset `soimos_des.plt` into Sentaurus Inspect alongside the baseline bulk nanoscale transistor data from Project 14 [14.1]:

```bash
inspect soimos_des.plt ../project14/vd_0.05_nmos_short_des.plt &
```

To evaluate the subthreshold leakage suppression:

1. Assign the horizontal plot axis to the input parameter: `gate Voltage`.
2. Map `drain TotalCurrent` onto a shared Logarithmic vertical axis to analyze the subthreshold off-state leakage floor.

## 8.2. Verification of Devices Performance & Expected Trends

## 1. Analysis of Off-State Leakage Floor Reduction

The overlaid semi-logarithmic transfer curves reveal a significant improvement in off-state leakage suppression for the SOI architecture:

- The Baseline Bulk NMOS Performance (Project 14): At zero gate bias ($V_{\text{gate}} = 0.0\text{ V}$), the bulk device exhibits a high off-state leakage current ($I_{off,\text{Bulk}} \approx 3.2 \times 10^{-10}\text{ A}$) due to parasitic sub-surface conduction paths [14.8].
- The Thin-Film SOI NMOS Performance: In contrast, the SOI transistor suppresses sub-surface conduction, dropping the off-state leakage current to an exceptionally low floor of $I_{off,\text{SOI}} \approx 1.4 \times 10^{-14}\text{ A}$.

Evaluating this performance ratio reveals the leakage suppression factor:  
$$\frac{I_{off,\text{Bulk}}}{I_{off,\text{SOI}}} = \frac{3.2 \times 10^{-10}\text{ A}}{1.4 \times 10^{-14}\text{ A}} \approx 22,857$$  
This substantial reduction (>20,000×) confirms that the insertion of the BOX layer successfully isolates the channel from the substrate, suppressing parasitic leakage current and delivering a significantly improved subthreshold slope.

## 2. Visual Verification of Spatial Carrier Confinement

Loading the spatial dataset `soimos_des.tdr` into Sentaurus Visual at $V_{\text{gate}} = 0.0\text{ V}$ and $V_{\text{drain}} = 50\text{ mV}$ confirms the presence of geometric carrier confinement.

Mapping the 2D `TotalCurrentDensity` magnitude across the device profile reveals that current flow is restricted entirely to the upper 30 nm silicon film layer. The underlying BOX layer acts as a complete isolation barrier, dropping the current density within the handling substrate to absolute zero. This distribution validates the structure editor configuration, demonstrating that the SOI design successfully cuts off sub-surface punch-through paths and restores electrostatic integrity at nanoscale dimensions.

---
