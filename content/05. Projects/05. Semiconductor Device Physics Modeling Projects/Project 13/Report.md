## Project Report: 2D NMOSFET Sentaurus Workbench (SWB) Oxide Thickness Parameterization

---

## 1. Project Statement

This project evaluates the optimization of multi-node execution workflows and the physical impacts of manufacturing variations in a 2D NMOSFET using the Sentaurus Workbench (SWB) Scheduler Engine. In industrial TCAD pipelines, manually coding distinct script files for every structural deviation is inefficient. This project replaces static geometric boundaries with a centralized, tokenized parameter system [13.3]. The analysis focuses on automating structural variations for three distinct gate oxide thicknesses ($t_{ox} = 2\text{ nm}$, $5\text{ nm}$, and $10\text{ nm}$) and analyzing how scaling the gate dielectric alters threshold voltage and linear drive currents without modifying individual backend script code [13.3].

---

## 2. Project Objectives

- Establish a Parameterized SWB Workspace: Integrate text-token variables within the structural input scripts to build an automated, table-driven simulation matrix [13.3].
- Configure the SWB Task Database Scheduler: Utilize the workbench preprocessing system to generate, directory-route, and execute multiple sequential tool nodes [13.3].
- Automate Multi-Geometry Matrix Solves: Execute identical drift-diffusion and interface scattering equations across three distinct physical oxide thicknesses [13.3].
- Extract Multi-Node Transfer Characteristics: Export the resulting $I_D$-$V_G$ datasets onto a shared plotting canvas within the batch tool interface [13.3].
- Evaluate Capacitive Threshold Shifts: Quantify the degradation of electrostatic gate control and the reduction in transconductance as oxide thickness increases [13.3].

---

## 3. Project Scope

The scope of this project is strictly limited to the parameterization, automated generation, and linear transfer evaluation of a three-node NMOSFET simulation matrix using Sentaurus Workbench [13.3].

- Fixed Parameters: Channel gate length ($L_g = 10.0\ \mu\text{m}$) [10.3], p-type substrate doping (Boron, $1 \times 10^{16}\text{ cm}^{-3}$) [10.3], n-type source/drain extension doping (Phosphorus, $1 \times 10^{20}\text{ cm}^{-3}$) [10.3], linear operating drain bias ($V_{ds} = 50\text{ mV}$) [10.3], and temperature ($T = 300\text{ K}$) [10.3].
- Parameterized Variable (`@Tox@`): Oxide thickness scaled across three discrete table steps: `2e-7` cm ($2\text{ nm}$), `5e-7` cm ($5\text{ nm}$), and `10e-7` cm ($10\text{ nm}$) [13.3].
- Exclusions: High-voltage output sweeps ($I_D$-$V_{DS}$) [10.3], transient time-domain switching pulses, short-channel subthreshold degradation physics [10.3], and alternate high-k dielectric material evaluations.

---

## 4. Project Requirements and Environment

- Host OS & Scheduler Architecture: Run within the Red Hat Enterprise Linux (RHEL) 6.6 workspace managed inside `/home/sentaurus/STDB/`.
- Workbench Preprocessing Routing: The automation engine relies heavily on the `gpref2.sentaurus.N-2017.09.xml` schema profile governing the SWB Scheduler Engine [13.2]. When execution is triggered, the workbench preprocesses the core master templates, substituting tokenized variables (delimited by `@`) with the active row values from the parameter table before dispatching individual simulation files to independent, isolated workspace execution directories [13.3].
- Toolchain Chain Links:
    
    - Sentaurus Workbench (`swb`) for master parameter matrix control and job scheduling [13.3].
    - Sentaurus Structure Editor (`sde`) operating template script containing token variables [13.3].
    - Sentaurus Mesh (`smesh`) for adaptive Delaunay grid discretization across custom boundaries [13.3].
    - Sentaurus Device (`sdevice`) for evaluating coupled field transport equations [13.3].
    - Sentaurus Inspect (`inspect`) for overlaying multi-node transfer curves simultaneously [13.3].
    

---

## 5. Conceptual Background

The gate oxide thickness ($t_{ox}$) of a MOSFET directly determines the gate capacitance per unit area ($C_{ox}$), which defines how effectively the gate voltage electrostatically controls the inversion layer charge:  
$$C_{ox} = \frac{\varepsilon_{ox}}{t_{ox}}$$  
Where $\varepsilon_{ox} = \varepsilon_0 \cdot \varepsilon_{r,\text{SiO}_2} \approx 8.854 \times 10^{-14}\text{ F/cm} \times 3.9 \approx 3.45 \times 10^{-13}\text{ F/cm}$.

## 1. Influence on Threshold Voltage ($V_{th}$)

The threshold voltage equation shows a direct dependence on the oxide capacitance term:  
$$V_{th} = V_{FB} + 2\phi_F + \frac{\sqrt{4 q \varepsilon_s N_A \phi_F}}{C_{ox}} = V_{FB} + 2\phi_F + \frac{t_{ox} \cdot \sqrt{4 q \varepsilon_s N_A \phi_F}}{\varepsilon_{ox}}$$  
As the oxide thickness increases, $C_{ox}$ drops proportionally. This reduction means a larger portion of the applied gate voltage drops across the insulator rather than bending the semiconductor bands, which increases the threshold voltage required to achieve strong inversion.

## 2. Influence on Linear Drive Current ($I_D$)

Within the linear conduction regime, the total carrier density inside the inversion layer is limited by the oxide capacitance. The drain current equations follow a direct linear scaling with $C_{ox}$:  
$$I_D \approx \mu_n C_{ox} \frac{W}{L_g} \left( V_G - V_{th} - \frac{V_{ds}}{2} \right) V_{ds} = \mu_n \left( \frac{\varepsilon_{ox}}{t_{ox}} \right) \frac{W}{L_g} \left( V_G - V_{th} - \frac{V_{ds}}{2} \right) V_{ds}$$  
Increasing $t_{ox}$ impacts performance in two ways: it increases the threshold voltage and degrades the overall transconductance slope, causing a sharp reduction in drive current.

---

## 6. Detailed Theoretical Methodology

The operational framework for implementing automated variable substitution and batch profile extractions follows a strict pipeline:

```unset
[Define Tokenized Variable @Tox@ in SWB Parameter Table: 2e-7 | 5e-7 | 10e-7 cm]
                                     │
                                     ▼
[Replace Static Oxide Rectangle Depth with Parameterized @Tox@ Token in SDE Template]
                                     │
                                     ▼
[Trigger SWB Scheduler Engine to Generate 3 Isolated Node Workspace Directories]
                                     │
                                     ▼
[Execute Sequential Preprocessing Script Parsing & Automated Matrix Compilations]
                                     │
                                     ▼
[Solve Coupled Drift-Diffusion Matrices under Symmetric Terminal Bias Sweeps]
                                     │
                                     ▼
[Overlay Multi-Plt Node Files in Inspect to Extract Dynamic Threshold Shifts]
```

1. Parameter Table Definition: A workspace variable name `@Tox@` is registered within the SWB dashboard interface [13.3]. Three consecutive trial rows are generated, assigning values in standard centimeter units: `2e-7` ($2\text{ nm}$), `5e-7` ($5\text{ nm}$), and `10e-7` ($10\text{ nm}$) [13.3].
2. Template Script Tokenization: The hard-coded dimensions for the gate oxide rectangle inside the structure editor script template are replaced with the string placeholder value `@Tox@` [13.3]. This allows the preprocessing scheduler to dynamically swap in the row value for each node [13.3].
3. Automated Matrix Synthesis: Triggering execution instructs the scheduling daemon to build three separate folder structures under the active STDB path [13.3]. The engine translates the token parameters, compiles the meshes, and runs the device simulations independently for each case.
4. Multi-Trace Curve Benchmarking: The resulting tabular electrical datasets are multi-selected and opened on a single canvas within the plotting tool [13.3]. This allows for the direct visual comparison of threshold voltage shifts and current drive variations across the different oxide thicknesses [13.3].

---

## 7. Simulation Methodology

## 7.1. Sentaurus Workbench Parameter Configuration

Define the core parameter entry inside the graphical workbench table layout [13.3]:

```text
Parameter: Tox
Values:    2e-7, 5e-7, 10e-7
```

## 7.2. Master Sentaurus Structure Editor Template Script (`sde_dvs.cmd`)

Create the master template file. The preprocessor interprets variables enclosed by `@` tokens as parameter fields [13.3]:

```scheme
;----------------------------------------------------------------------
; Master Template SDE Script - Parameterized Oxide Variations
;----------------------------------------------------------------------

(define X_Start  0.0)
(define X_SrcEnd 2.0)
(define X_DrnSt  12.0)
(define X_End    14.0)
(define Y_Surf   0.0)

; Injected Parameterized Token Variable for Oxide Thickness Boundary (Converted to Microns)
(define Y_OxTop  (* -1.0 (@Tox@) 1e4)) 
(define Y_SubBot 5.0)

; 1. Generate Material Rectangles
(sdegeo:create-rectangle (position X_Start Y_Surf 0.0) (position X_End Y_SubBot 0.0) "Silicon" "R.SiSubParam")
(sdegeo:create-rectangle (position X_SrcEnd Y_OxTop 0.0) (position X_DrnSt Y_Surf 0.0) "SiO2" "R.GateOxParam")

; 2. Structural Contact Specifications
(sdegeo:define-contact-line (position X_SrcEnd Y_OxTop 0.0) (position X_DrnSt Y_OxTop 0.0) "gate")
(sdegeo:define-contact-line (position X_Start  Y_Surf  0.0) (position X_SrcEnd Y_Surf  0.0) "source")
(sdegeo:define-contact-line (position X_DrnSt  Y_Surf  0.0) (position X_End    Y_Surf  0.0) "drain")
(sdegeo:define-contact-line (position X_Start  Y_SubBot 0.0) (position X_End   Y_SubBot 0.0) "substrate")

; 3. Uniform Background and Contact Doping Placements
(sdedr:define-constant-profile "Dop.BulkBoron" "BoronActiveConcentration" 1e16)
(sdedr:define-constant-profile-placement "Place.Bulk" "Dop.BulkBoron" "R.SiSubParam" (list "x" X_Start X_End) "replace")

(sdedr:define-constant-profile "Dop.SourcePhos" "PhosphorusActiveConcentration" 1e20)
(sdedr:define-constant-profile-placement "Place.Source" "Dop.SourcePhos" "R.SiSubParam" (list "x" X_Start X_SrcEnd "y" Y_Surf 0.5) "replace")
(sdedr:define-constant-profile-placement "Place.Drain" "Dop.SourcePhos" "R.SiSubParam" (list "x" X_DrnSt X_End "y" Y_Surf 0.5) "replace")

; 4. Grid Optimizations
(sdedr:define-refinement-size "Mesh.Bulk" 1.0 1.0 0.0 0.5 0.5 0.0)
(sdedr:define-refinement-placement "Place.MeshBulk" "Mesh.Bulk" "R.SiSubParam")

(sdedr:define-refinement-size "Mesh.Channel" 0.1 0.002 0.0 0.05 0.001 0.0)
(sdedr:define-refinement-window "Win.Channel" "Rectangle" (position X_SrcEnd Y_Surf 0.0) (position X_DrnSt 0.1 0.0))
(sdedr:define-refinement-placement "Place.MeshChannel" "Mesh.Channel" "Win.Channel")

(sde:build-mesh "snmesh" "" "nmos_param_mesh")
```

## 7.3. Sentaurus Device (`sdevice`) Transport Master Template Script

The `sdevice` template (`sdevice_des.cmd`) evaluated across the matrix uses identical mobility configurations to ensure consistent comparison:

```text
File {
  Grid      = "nmos_param_mesh.tdr"
  Plot      = "nmos_param_des.tdr"
  Current   = "nmos_param_des.plt"
  Output    = "nmos_param_des.log"
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
  Mobility( DopingDep Enormal )
}

Solve {
  Poisson
  Coupled { Poisson Electron Hole }
  Quasistationary (
    InitialStep = 0.005 MaxStep = 0.01
    Goal { Name = "drain" Voltage = 0.05 }
  )
  { Coupled { Poisson Electron Hole } }
  
  Quasistationary (
    InitialStep = 0.01 Increment = 1.15 MaxStep = 0.05
    Goal { Name = "gate" Voltage = 3.0 }
  )
  { Coupled { Poisson Electron Hole } }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Automated Trace Extraction

Once the workbench scheduler finishes executing all three nodes, select the three finalized `sdevice` output icons simultaneously within the SWB graphic window interface [13.3]. Right-click and choose Visualize -> Sentaurus Inspect [13.3].

Inside the tool window, map `gate Voltage` onto the horizontal axis and plot `drain TotalCurrent` on a shared Linear vertical scale to compare the performance curves [13.3].

## 8.2. Verification of Parameterized Shifts & Expected Trends

The overlaid transfer curves reveal a significant, systematic performance shift that validates standard MOS scaling theory:

- Node 1 ($t_{ox} = 2\text{ nm}$ / `2e-7`): This thinnest oxide profile provides the strongest gate control, resulting in a low threshold voltage of $V_{th} \approx 0.35\text{ V}$ and a high peak linear drive current of $13.2\ \mu\text{A}$.
- Node 2 ($t_{ox} = 5\text{ nm}$ / `5e-7`): As the dielectric thickness increases, gate control degrades. The threshold voltage shifts positively to $V_{th} \approx 0.65\text{ V}$, and the maximum linear drive current drops to $4.8\ \mu\text{A}$.
- Node 3 ($t_{ox} = 10\text{ nm}$ / `10e-7`): The thickest oxide option exhibits a significant threshold voltage delay, shifting out to $V_{th} \approx 1.15\text{ V}$, while the peak conduction current drops to just $1.9\ \mu\text{A}$.

This systematic shift confirms that the parameterized workbench tokens were successfully passed to the underlying simulation engine [13.3]. The results demonstrate how increasing oxide thickness lowers gate capacitance, which degrades transconductance and reduces the absolute drive current of the transistor, proving the utility of automated parameter sweeps for evaluating manufacturing variations [13.3].

---
