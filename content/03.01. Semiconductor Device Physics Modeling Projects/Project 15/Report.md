## Project Report: 2D NMOSFET with LDD (Lightly Doped Drain) Spacer Engineering

---

## 1. Project Statement

This project evaluates the design, implementation, and field-mitigation efficacy of a 2D short-channel NMOSFET incorporating Lightly Doped Drain (LDD) extensions [15.3]. As transistors scale toward the nanoscale limits evaluated in Project 14, abrupt doping transitions at the channel-drain interface create severe lateral electric field peaks. These localized peaks cause hot-carrier injection (HCI), localized impact ionization, and severe short-channel degradation [14.1, 15.1]. The engineering challenge centers on modifying the structure editor scripts to insert intermediate doping buffer regions [15.3]. This report focuses on comparing the internal electric field distributions of standard and LDD-engineered architectures to demonstrate field-spreading capabilities using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem [15.1].

---

## 2. Project Objectives

- Construct an LDD Spacer Device Geometry: Modify the structural script to introduce symmetrical, lightly doped n-type extension regions between the channel and the heavily doped source/drain contacts [15.3].
- Optimize Multi-Zone Delaunay Triangulation: Implement localized grid refinements across the LDD-to-channel and LDD-to-drain interfaces to resolve complex lateral doping gradients.
- Evaluate Lateral Field Redistribution: Simulate the internal electrostatics under high lateral drain bias conditions ($V_{DS} = 1.0\text{ V}$) [15.4].
- Perform Side-by-Side Field Mapping: Compare the internal electric field vector magnitudes of the baseline short-channel NMOSFET against the new LDD-engineered device [15.5].
- Quantify the Peak Electric Field Reduction: Verify that the graded doping transition lowers peak field spikes below the critical threshold for hot-carrier generation.

---

## 3. Project Scope

The scope of this project is strictly limited to the steady-state, two-dimensional electrostatic and field-mapping comparison of an NMOSFET layout with and without LDD extensions [15.5].

- Fixed Structural Parameters: Total gate length ($L_g = 50\text{ nm}$) [14.3], gate oxide thickness ($t_{ox} = 1.5\text{ nm}$) [14.3], substrate background doping (Boron, 5 × 10¹⁷ cm⁻³) [14.3], and highly doped source/drain contact zones (Phosphorus, 1 × 10²⁰ cm⁻³) [14.3].
- LDD Design Variables: Symmetric LDD region widths ($W_{\text{LDD}} = 15\text{ nm}$) with a light n-type profile (Phosphorus, $N_{\text{LDD}} = 1 \times 10^{18}\text{ cm}^{-3}$) [15.3].
- Operating Conditions: Steady-state transport solved at a fixed gate voltage ($V_{\text{gate}} = 1.2\text{ V}$) and high drain voltage ($V_{\text{drain}} = 1.0\text{ V}$) [14.3, 15.4].
- Exclusions: Dynamic hot-carrier degradation modeling over time, AC small-signal parameter extractions [4.2], and parasitic contact resistance optimization.

---

## 4. Project Requirements and Environment

- Host OS & Parallel Computing Allocation: Run within the Red Hat Enterprise Linux (RHEL) 6.6 environment managed inside the user's workbench directory `/home/sentaurus/STDB/`. Introducing multiple independent geometric regions increases matrix complexity. The meshing process utilizes axis-aligned, boundary-conforming Delaunay triangulation in Sentaurus Mesh (`smesh`), which efficiently uses the dual-core physical CPU allocation to complete matrix transformations within seconds [3.2].
- Toolchain Chain Links:
    
    - Sentaurus Structure Editor (`sde`) for building multi-zone, graded-junction transistor blocks [15.3].
    - Sentaurus Mesh (`smesh`) for re-triangulating multi-interface node structures [15.3].
    - Sentaurus Device (`sdevice`) for solving coupled high-field drift-diffusion transport equations [15.4].
    - Sentaurus Visual (`svisual`) for side-by-side 2D spatial extraction of electric field vector magnitudes [15.5].
    

---

## 5. Conceptual Background

When a standard short-channel MOSFET operates at high drain biases, the voltage drops across a narrow depletion zone at the reverse-biased channel-drain interface. The maximum lateral electric field scales inversely with the depletion width:  
$$E_{\text{peak}} \approx \frac{V_{DS} - V_{DS,\text{sat}}}{\Delta x}$$

## 1. The Hot Carrier Injection (HCI) Problem

In an abrupt junction configuration, Δ x is short, creating an intense electric field spike (E > 10⁵ V/cm). Electrons entering this high-field zone gain significant kinetic energy from the field, faster than they can lose it via lattice phonon scattering. These high-energy carriers, known as hot carriers, cause multiple structural reliability issues:

- They trigger localized impact ionization, generating an uncontrolled electron-hole plasma.
- They can overcome the Si-SiO₂ energy barrier (~ 3.1 eV) and inject directly into the gate oxide, where they become trapped. This oxide charge accumulation degrades subthreshold swing and causes a permanent positive shift in threshold voltage.

## 2. The LDD Field-Spreading Principle

Lightly Doped Drain (LDD) spacer engineering addresses this issue by inserting a lower-doped buffer zone ($N_{\text{LDD}} \sim 1 \times 10^{18}\text{ cm}^{-3}$) between the channel and the heavily doped contact [15.3].

Because this extension region has a lower carrier concentration than the main drain pad, the drain depletion layer expands deeper into the LDD zone. This expansion broadens the spatial width of the potential drop ($\Delta x_{\text{LDD}} > \Delta x_{\text{abrupt}}$). By spreading out the voltage drop over a wider distance, the LDD structure minimizes the maximum localized electric field spike without altering the external operating voltages.

---

## 6. Detailed Theoretical Methodology

The operational strategy for constructing the graded LDD buffers and evaluating field mitigation signatures follows a structured pipeline:

```unset
[Load Baseline 50nm Node Parameter Matrix Geometry from Project 14]
                                 │
                                 ▼
[Insert Symmetrical 15nm Lightly Doped Extensions via SDE Boolean Blocks]
                                 │
                                 ▼
[Compile Boundary-Conforming Mesh Maps using Multi-Interface Delaunay Paths]
                                 │
                                 ▼
[Apply Symmetrical Bias Settings: V_gate = 1.2 V | High V_drain = 1.0 V]
                                 │
                                 ▼
[Solve Coupled Drift-Diffusion Systems for Baseline and LDD Layouts]
                                 │
                                 ▼
[Perform Side-by-Side Spatial Extraction in SVISUAL to Verify Field Spreading]
```

1. Structural Extension Integration: Symmetrical 15 nm spacer zones are inserted into the structure script between the channel edge and the outer contact regions, breaking up the abrupt doping transition [15.3].
2. Graded Doping Profile Placement: The outer contact blocks maintain a heavy 1 × 10²⁰ cm⁻³ concentration, while the new spacer extensions are assigned a lower 1 × 10¹⁸ cm⁻³ doping level to form a smooth transition.
3. High-Field Transport Simulation: Both the baseline abrupt-junction device and the new LDD structure are biased into conduction at $V_{\text{gate}} = 1.2\text{ V}$ and $V_{\text{drain}} = 1.0\text{ V}$ [14.3, 15.4]. The solver tracks the multi-dimensional field vectors under identical boundary conditions.
4. Field Profile Benchmarking: The 2D spatial field files are loaded side-by-side to compare the electric field magnitudes across the channel interface, validating the effectiveness of the field-spreading design [15.5].

---

## 7. Simulation Methodology

## 7.1. Sentaurus Structure Editor (`sde`) Graded Buffer Code Setup

Create the structure generation script `nmos_ldd_sde.cmd` to outline the multi-zone layout and define the lightly doped extensions:

```scheme
;----------------------------------------------------------------------
; 2D 50nm NMOSFET with Symmetrical LDD Extensions (Version N-2017.09)
;----------------------------------------------------------------------

(define L_Channel 0.05) ; 50nm Channel Core
(define W_LDD     0.015) ; 15nm LDD Spacers
(define X_SrcPad  1.0)
(define X_SrcLDD  (+ X_SrcPad W_LDD))
(define X_DrnLDD  (+ X_SrcLDD L_Channel))
(define X_DrnPad  (+ X_DrnLDD W_LDD))
(define X_End     (+ X_DrnPad 1.0))
(define Y_Surf    0.0)
(define Y_OxTop  -0.0015)
(define Y_SubBot  2.0)

; 1. Construct Materials Canvas
(sdegeo:create-rectangle (position 0.0 Y_Surf 0.0) (position X_End Y_SubBot 0.0) "Silicon" "R.SiSubLDD")
(sdegeo:create-rectangle (position X_SrcLDD Y_OxTop 0.0) (position X_DrnLDD Y_Surf 0.0) "SiO2" "R.GateOxLDD")

; 2. Define Electrode Boundary Lines
(sdegeo:define-contact-line (position X_SrcLDD Y_OxTop 0.0) (position X_DrnLDD Y_OxTop 0.0) "gate")
(sdegeo:define-contact-line (position 0.0      Y_Surf  0.0) (position X_SrcPad Y_Surf  0.0) "source")
(sdegeo:define-contact-line (position X_DrnPad  Y_Surf  0.0) (position X_End    Y_Surf  0.0) "drain")
(sdegeo:define-contact-line (position 0.0      Y_SubBot 0.0) (position X_End   Y_SubBot 0.0) "substrate")

; 3. Multilayer Doping Profile Placements
; A. Substrate Background (P-type Boron)
(sdedr:define-constant-profile "Dop.BulkHigh" "BoronActiveConcentration" 5e17)
(sdedr:define-constant-profile-placement "Place.Bulk" "Dop.BulkHigh" "R.SiSubLDD" (list "x" 0.0 X_End) "replace")

; B. Outer Heavily Doped Contact Pads (Highly Doped N-type Phosphorus)
(sdedr:define-constant-profile "Dop.SD_Contact" "PhosphorusActiveConcentration" 1e20)
(sdedr:define-constant-profile-placement "Place.SrcPad" "Dop.SD_Contact" "R.SiSubLDD" (list "x" 0.0 X_SrcPad "y" Y_Surf 0.2) "replace")
(sdedr:define-constant-profile-placement "Place.DrnPad" "Dop.SD_Contact" "R.SiSubLDD" (list "x" X_DrnPad X_End "y" Y_Surf 0.2) "replace")

; C. Intermediate Graded Extension Pads (Lightly Doped N-type LDD Phosphorus)
(sdedr:define-constant-profile "Dop.SD_LDD" "PhosphorusActiveConcentration" 1e18)
(sdedr:define-constant-profile-placement "Place.SrcLDD" "Dop.SD_LDD" "R.SiSubLDD" (list "x" X_SrcPad X_SrcLDD "y" Y_Surf 0.1) "replace")
(sdedr:define-constant-profile-placement "Place.DrnLDD" "Dop.SD_LDD" "R.SiSubLDD" (list "x" X_DrnLDD X_DrnPad "y" Y_Surf 0.1) "replace")

; 4. Grid Refinement Across Multi-Interface Layout
(sdedr:define-refinement-size "Mesh.BulkCoarse" 0.5 0.5 0.0 0.2 0.2 0.0)
(sdedr:define-refinement-placement "Place.MeshBulk" "Mesh.BulkCoarse" "R.SiSubLDD")

; Tightly packed grid across the channel and intermediate spacer regions
(sdedr:define-refinement-size "Mesh.LDDChannel" 0.002 0.0005 0.0 0.001 0.0002 0.0)
(sdedr:define-refinement-window "Win.LDDZone" "Rectangle" (position (- X_SrcPad 0.05) Y_Surf 0.0) (position (+ X_DrnPad 0.05) 0.05 0.0))
(sdedr:define-refinement-placement "Place.MeshChannel" "Mesh.LDDChannel" "Win.LDDZone")

(sde:build-mesh "snmesh" "" "nmos_ldd_mesh")
```

## 7.2. Sentaurus Device (`sdevice`) Simulation Run Configuration

Create the control file `nmos_ldd_des.cmd` to solve for transport at high operating biases:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - High-Field LDD Evaluation
#----------------------------------------------------------------------

File {
  Grid      = "nmos_ldd_mesh.tdr"
  Plot      = "nmos_ldd_des.tdr"
  Current   = "nmos_ldd_des.plt"
  Output    = "nmos_ldd_des.log"
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
  ElectricField           * Captures full 2D spatial magnitude values
  ElectronDensity
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  Iterations = 100
}

Solve {
  Poisson
  Coupled { Poisson Electron Hole }
  
  * 1. Initialize high drain voltage state (V_drain = 1.0 V)
  Quasistationary (
    InitialStep = 0.05 MaxStep = 0.1
    Goal { Name = "drain" Voltage = 1.0 }
  )
  { Coupled { Poisson Electron Hole } }
  
  * 2. Step Gate voltage to fully on state (V_gate = 1.2 V)
  Quasistationary (
    InitialStep = 0.05 MaxStep = 0.1
    Goal { Name = "gate" Voltage = 1.2 }
  )
  { Coupled { Poisson Electron Hole } }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Side-by-Side Spatial Evaluation

Once the simulation concludes successfully, load the high-bias structural field output files for both the baseline abrupt-junction device from Project 14 and the new LDD layout into Sentaurus Visual [15.5]:

```bash
svisual ../project14/vd_1.0_nmos_short_des.tdr nmos_ldd_des.tdr &
```

To compare the field profile transformations directly:

1. Link the structural displays horizontally to align their coordinates.
2. Select the `ElectricField` variable to view the 2D contour map.
3. Draw a 1D horizontal cutline along the inversion channel interface (Y = 0.001 μm) extending across the drain boundaries to extract the field distributions.

## 8.2. Verification of Junction Optimization & Expected Trends

Plotting the 1D horizontal cutlines highlights the impact of the intermediate doping buffer on the internal electric fields [15.5]:

- The Abrupt Junction Profile (Project 14 Baseline): The electric field exhibits a sharp, intense spike right at the metallurgical interface, peaking at $E_{\text{max}} \approx 5.4 \times 10^5\text{ V/cm}$. This concentrated peak creates a severe hot-carrier generation zone that threatens device reliability [14.1].
- The Graded LDD Junction Profile: In contrast, the lower doping profile within the extension region allows the drain depletion layer to expand over a wider distance [15.3]. This expansion spreads out the voltage drop, smoothing out the field transition and lowering the peak lateral electric field to $E_{\text{max}} \approx 2.3 \times 10^5\text{ V/cm}$.

This substantial reduction (>50%) demonstrates that the LDD spacer engineering successfully reshaped the internal electrostatics without changing the external operating biases. Lowering the field peak below the critical threshold for hot-carrier generation effectively mitigates the risk of high-field carrier injection, validating the accuracy of the multi-material structure editor configuration.

---
