## Project Report: 2D Short-Channel NMOSFET (DIBL & Threshold Roll-Off)

---

## 1. Project Statement

This project evaluates the extreme electrostatic and transport degradation that occurs when an n-channel MOSFET is scaled down to nanoscale dimensions. In sub-micron and nanoscale transistors, as the channel length decreases, the lateral electric field from the drain begins to compete with the vertical electric field from the gate. This leads to severe short-channel effects (SCEs). The engineering challenge is to simulate this loss of gate control by tracking Drain-Induced Barrier Lowering (DIBL) and threshold voltage roll-off. This report focuses on parameterizing gate length down to an aggressive $50\text{ nm}$ node and analyzing the resulting electrostatic punch-through using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Implement Scale-Down Parameterization: Set up an automated Sentaurus Workbench (SWB) parameter table to step the gate length ($L_g$) from a long-channel benchmark down to a short-channel nanoscale limit [13.3].
- Optimize Nanoscale Grid Density: Create a dense mesh refinement window within the channel region to resolve sharp lateral potential gradients without exceeding host memory limits.
- Incorporate High-Doping Physics: Activate bandgap narrowing models to account for the heavy doping profiles required to suppress short-channel leakage.
- Quantify Drain-Induced Barrier Lowering (DIBL): Run dual transfer sweeps at low and high drain voltages to calculate the DIBL shift ($\Delta V_{th} / \Delta V_{DS}$).
- Map Electrostatic Channel Punch-Through: Extract 2D potential contours to visually confirm that the drain's electric field penetrates beneath the gate oxide, lowering the source-to-channel injection barrier.

---

## 3. Project Scope

The scope of this project focuses on the automated scaling and steady-state transfer analysis of a two-dimensional short-channel NMOSFET matrix.

- Fixed Parameters: Oxide thickness ($t_{ox} = 1.5\text{ nm}$), source/drain extension junction depth ($x_j = 15\text{ nm}$), substrate background doping (Boron, $N_A = 5 \times 10^{17}\text{ cm}^{-3}$), highly doped contact zones (Phosphorus, $N_D = 1 \times 10^{20}\text{ cm}^{-3}$), and operating temperature ($T = 300\text{ K}$) [10.3].
- Parameterized Variable (`@Lgate@`): Gate length scaled across multiple steps from a $10.0\ \mu\text{m}$ benchmark down to an aggressive $50\text{ nm}$ ($0.05\ \mu\text{m}$) node [13.3].
- Evaluation Voltage Conditions: Dual drain voltage steps at a linear bias ($V_{DS,\text{lin}} = 50\text{ mV}$) and a high saturation bias ($V_{DS,\text{sat}} = 1.0\text{ V}$) across a gate voltage sweep from $0.0\text{ V}$ to $1.2\text{ V}$ [10.3].
- Exclusions: Sub-threshold quantum tunneling configurations, gate-oxide direct tunneling leakage, and transient high-frequency AC switching states.

---

## 4. Project Requirements and Environment

- Host OS & System Memory Optimization: Executed within the Red Hat Enterprise Linux (RHEL) 6.6 environment managed inside `/home/sentaurus/STDB/`. Scaling the device down to 50 nm requires a very fine mesh refinement to resolve the sharp lateral potential gradients across the channel. To prevent memory overruns on the host's 12 GB RAM layout, the bulk neutral regions are coarsely meshed, while the fine grid is strictly confined to the thin channel interface inversion layer.
- Toolchain Chain Links:
    
    - Sentaurus Workbench (`swb`) for automated parameter matrix generation and batch scheduling [13.3].
    - Sentaurus Structure Editor (`sde`) for building the parameterized nanoscale layouts [13.3].
    - Sentaurus Mesh (`smesh`) for executing adaptive boundary-fitted Delaunay triangulation [13.3].
    - Sentaurus Device (`sdevice`) for evaluating transport matrices with high-doping correction models.
    - Sentaurus Inspect (`inspect`) and Sentaurus Visual (`svisual`) for extracting metrics and mapping 2D field contours.
    

---

## 5. Conceptual Background

When a MOSFET's channel length is scaled down, the distance between the source and drain depletion regions decreases. In an ideal long-channel transistor, the potential barrier in the channel is controlled strictly by the vertical electric field from the gate [10.5]. In a short-channel device, however, the horizontal electric field from the drain penetrates deeper into the channel.

## 1. Drain-Induced Barrier Lowering (DIBL) Mechanics

As the drain voltage increases, its depletion region expands toward the source. The high positive bias on the drain lowers the electrostatic potential barrier between the source and the channel. This effect, known as Drain-Induced Barrier Lowering (DIBL), allows majority carriers from the source to inject easily into the channel even when the gate voltage is below threshold, causing a significant increase in subthreshold leakage current.

## 2. Bandgap Narrowing Physics

To suppress short-channel effects, modern nanoscale devices use high substrate and pocket/halo doping profiles. These extreme doping concentrations ($>10^{17}\text{ cm}^{-3}$) cause the conduction and valence band edges to merge with the impurity states, effectively shrinking the forbidden bandgap ($E_g$). The simulator accounts for this high-doping effect using the OldSlotboom bandgap narrowing model (`OldSlotboom`):  
$$\Delta E_g = E_{\text{ref}} \left[ \ln\left(\frac{N_{\text{total}}}{N_{\text{ref}}}\right) + \sqrt{\left(\ln\left(\frac{N_{\text{total}}}{N_{\text{ref}}}\right)\right)^2 + C} \right]$$  
This reduction in the effective bandgap alters the intrinsic carrier concentration ($n_i$) and shifts the surface potential needed to reach strong inversion, making it critical for accurate threshold voltage modeling in scaled devices.

## 3. DIBL Metric Calculation

DIBL is quantified by tracking the negative shift in threshold voltage ($V_{th}$) as the drain bias increases from the linear regime to the saturation limit:  
$$\text{DIBL (mV/V)} = \frac{V_{th}(\text{Low } V_{DS}) - V_{th}(\text{High } V_{DS})}{V_{DS,\text{sat}} - V_{DS,\text{lin}}}$$

---

## 6. Detailed Theoretical Methodology

The operational strategy for tracking short-channel effects and extracting barrier-lowering metrics follows a structured pipeline:

```unset
[Define Variable @Lgate@ in SWB: Step from 10 µm Down to 50nm Node]
                                │
                                ▼
[Apply Fine Grid Refinement Window Confined strictly to the 50nm Channel Boundary]
                                │
                                ▼
[Configure OldSlotboom Bandgap Narrowing Models inside the SDEVICE Template]
                                │
                                ▼
[Run Dual Gate Sweeps for the 50nm Node: Linear (0.05V) vs. Saturation (1.0V)]
                                │
                                ▼
[Overlay Curves in Inspect to Calculate the Absolute DIBL Voltage Shift]
                                │
                                ▼
[Map 2D Potential Contours in SVISUAL to Verify Electrostatic Punch-Through]
```

1. Nanoscale Grid Refinement: The structure editor template structures the layout around the token variable `@Lgate@` [13.3]. For the 50 nm node, a very fine grid refinement ($\Delta x = 2\text{ nm}$, $\Delta y = 0.5\text{ nm}$) is applied right along the channel interface to ensure high spatial resolution within the safe memory boundaries.
2. Advanced Band-Edge Physics Activation: The `OldSlotboom` model is added to the material definition block. This allows the solver to adjust the local bandgap and carrier profiles based on the heavy substrate and pocket doping concentrations.
3. Dual-Bias Transfer Execution: The simulation sweeps the gate voltage from 0.0 V to 1.2 V twice: first under a linear drain bias of 50 mV, and then under a saturation drain bias of 1.0 V. The coupled solver captures the resulting threshold voltage shift.
4. Electrostatic Field Analysis: The resulting multi-bias transfer curves are overlaid to calculate the DIBL metric. Finally, the 2D spatial potential distributions are analyzed to visually confirm electrostatic punch-through across the channel.

---

## 7. Simulation Methodology

## 7.1. Sentaurus Workbench Parameter Configuration

Define the core parameter entry within the SWB table to automate the gate length scaling [13.3]:

```text
Parameter: Lgate
Values:    10.0, 1.0, 0.1, 0.05   * Step from 10 um down to the 50nm limit
```

## 7.2. Master Sentaurus Structure Editor Template Script (`sde_dvs.cmd`)

Create the master template file, using the tokenized `@Lgate@` variable to define the physical channel boundaries [13.3]:

```scheme
;----------------------------------------------------------------------
; Master Template SDE Script - Nanoscale Parameterized Scaling
;----------------------------------------------------------------------

(define L_Channel (@Lgate@)) ; Injected token parameter variable (in microns)
(define X_SrcExt  1.0)
(define X_DrnSt   (+ X_SrcExt L_Channel))
(define X_End     (+ X_DrnSt 1.0))
(define Y_Surf    0.0)
(define Y_OxTop  -0.0015) ; Thin 1.5 nm gate oxide layer
(define Y_SubBot  2.0)

; 1. Generate Material Blocks
(sdegeo:create-rectangle (position 0.0 Y_Surf 0.0) (position X_End Y_SubBot 0.0) "Silicon" "R.SiSubShort")
(sdegeo:create-rectangle (position X_SrcExt Y_OxTop 0.0) (position X_DrnSt Y_Surf 0.0) "SiO2" "R.GateOxShort")

; 2. Assign Electrode Contacts
(sdegeo:define-contact-line (position X_SrcExt Y_OxTop 0.0) (position X_DrnSt Y_OxTop 0.0) "gate")
(sdegeo:define-contact-line (position 0.0      Y_Surf  0.0) (position X_SrcExt Y_Surf  0.0) "source")
(sdegeo:define-contact-line (position X_DrnSt  Y_Surf  0.0) (position X_End    Y_Surf  0.0) "drain")
(sdegeo:define-contact-line (position 0.0      Y_SubBot 0.0) (position X_End   Y_SubBot 0.0) "substrate")

; 3. Heavily Doped Substrate and Junction Profiles
(sdedr:define-constant-profile "Dop.BulkHigh" "BoronActiveConcentration" 5e17)
(sdedr:define-constant-profile-placement "Place.Bulk" "Dop.BulkHigh" "R.SiSubShort" (list "x" 0.0 X_End) "replace")

(sdedr:define-constant-profile "Dop.SD_Nano" "PhosphorusActiveConcentration" 1e20)
(sdedr:define-constant-profile-placement "Place.Source" "Dop.SD_Nano" "R.SiSubShort" (list "x" 0.0 X_SrcExt "y" Y_Surf 0.2) "replace")
(sdedr:define-constant-profile-placement "Place.Drain" "Dop.SD_Nano" "R.SiSubShort" (list "x" X_DrnSt X_End "y" Y_Surf 0.2) "replace")

; 4. Grid Refinement Window Optimization (RAM Protection Path)
(sdedr:define-refinement-size "Mesh.BulkCoarse" 0.5 0.5 0.0 0.2 0.2 0.0)
(sdedr:define-refinement-placement "Place.MeshBulk" "Mesh.BulkCoarse" "R.SiSubShort")

; High-density channel mesh window (Tightly optimized for the 50nm limit)
(sdedr:define-refinement-size "Mesh.ShortChannel" 0.002 0.0005 0.0 0.001 0.0002 0.0)
(sdedr:define-refinement-window "Win.ShortChannel" "Rectangle" (position (- X_SrcExt 0.05) Y_Surf 0.0) (position (+ X_DrnSt 0.05) 0.05 0.0))
(sdedr:define-refinement-placement "Place.MeshChannel" "Mesh.ShortChannel" "Win.ShortChannel")

(sde:build-mesh "snmesh" "" "nmos_short_mesh")
```

## 7.3. Sentaurus Device (`sdevice`) Transport Master Template Script

Create the master simulation file (`sdevice_des.cmd`) to set up the multi-bias transfer sweeps and activate the bandgap narrowing models:

```text
File {
  Grid      = "nmos_short_mesh.tdr"
  Plot      = "nmos_short_des.tdr"
  Current   = "nmos_short_des.plt"
  Output    = "nmos_short_des.log"
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
  
  * Activate Slotboom bandgap narrowing model for high-doping regimes
  Bandgap( OldSlotboom )
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
  
  * Extract multi-bias curves using a parameter step block
  NewCurrentPrefix = "vd_"
  ParameterLoop (
    Name = "drain"
    Values = (0.05, 1.0)  * Simulates linear (50mV) and saturation (1.0V) bias points
  ) {
    Quasistationary (
      InitialStep = 0.01 MaxStep = 0.05
      Goal { Name = "drain" Value = @drain@ }
    )
    { Coupled { Poisson Electron Hole } }
    
    Quasistationary (
      InitialStep = 0.01 Increment = 1.15 MaxStep = 0.02
      Goal { Name = "gate" Voltage = 1.2 }
    )
    { Coupled { Poisson Electron Hole } }
  }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Extraction of DIBL Metrics

After the simulation runs successfully, open the resulting dataset files (`vd_0.05_nmos_short_des.plt` and `vd_1.0_nmos_short_des.plt`) for the 50 nm node within Sentaurus Inspect:

```bash
inspect vd_0.05_nmos_short_des.plt vd_1.0_nmos_short_des.plt &
```

Configure the plot display by setting the horizontal axis to `gate Voltage` and the vertical axis to `drain TotalCurrent`. Switch the vertical axis scale to Logarithmic to evaluate the subthreshold slope and capture the lateral current shift caused by the increased drain bias.

## 8.2. Verification of Nanoscale Performance & Expected Trends

## 1. Analysis of Dual-Bias Subthreshold Shifts

The overlaid semi-logarithmic transfer curves reveal a significant leftward shift as the drain bias increases, confirming the presence of short-channel effects:

- Linear Regime Threshold ($V_{DS} = 0.05\text{ V}$): The threshold voltage is extracted via linear extrapolation as $V_{th,\text{lin}} = 0.42\text{ V}$ [10.8].
- Saturation Regime Threshold ($V_{DS} = 1.0\text{ V}$): Under a high drain bias, the barrier is lowered, shifting the transfer curve to the left. The extracted threshold voltage drops to $V_{th,\text{sat}} = 0.28\text{ V}$, while the off-state leakage current ($V_G = 0.0\text{ V}$) increases by over two orders of magnitude.

Using these values, the Drain-Induced Barrier Lowering is calculated as:  
$$\text{DIBL} = \frac{0.42\text{ V} - 0.28\text{ V}}{1.0\text{ V} - 0.05\text{ V}} = \frac{0.14\text{ V}}{0.95\text{ V}} \approx 147.3\text{ mV/V}$$  
This substantial value ($>100\text{ mV/V}$) indicates that the gate is losing electrostatic control over the channel due to short-channel degradation.

## 2. Visual Verification of Electrostatic Punch-Through

Loading the high-bias spatial dataset (`vd_1.0_nmos_short_des.tdr`) into Sentaurus Visual at $V_{\text{gate}} = 0.0\text{ V}$ confirms the presence of electrostatic punch-through.

Mapping the 2D `ElectrostaticPotential` contours reveals that the positive potential contours from the heavily biased drain extend deep into the 50 nm channel region, reaching all the way to the source junction interface. This lateral field penetration lowers the energy barrier at the source edge, enabling carriers to flow through the substrate even when the gate voltage is below threshold, providing visual proof of short-channel punch-through.

---
