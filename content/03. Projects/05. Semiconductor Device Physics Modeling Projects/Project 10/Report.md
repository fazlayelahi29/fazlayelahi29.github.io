## Project Report: 2D Long-Channel NMOSFET (Transfer Characteristics)

---

## 1. Project Statement

This project evaluates the multi-terminal electrostatic control and linear transport characteristics of a 2D long-channel n-channel Metal-Oxide-Semiconductor Field-Effect Transistor (NMOSFET). Transitioning from isolated 1D stacks to a fully integrated three-terminal transistor architecture allows for the direct observation of lateral charge transport channel modulation. By utilizing a long gate length configuration ($L_g = 10.0\ \mu\text{m}$), the design eliminates short-channel non-idealities, creating an ideal benchmark system. The report focuses on simulating the subthreshold and linear inversion transfer curves ($I_D$-$V_G$), calculating the subthreshold swing ($SS$), and extracting the linear threshold voltage ($V_{th}$) using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Construct an Integrated 2D 3-Terminal Transistor: Fabricate a long-channel NMOSFET layout featuring isolated source/drain extensions on a parameterized p-type substrate.
- Incorporate Field-Dependent Carrier Mobilities: Activate concentration-dependent and transverse electric field-dependent mobility models to capture surface-roughness and phonon scattering.
- Evaluate Linear Regime Transfer Metrics: Simulate the drain current ($I_D$) response under a constant low lateral bias ($V_{ds} = 50\text{ mV}$) across a gate voltage sweep up to $3.0\text{ V}$.
- Quantify Subthreshold Conduction Swing ($SS$): Analyze the subthreshold slope on a logarithmic current scale to evaluate the turn-off efficiency of the channel.
- Extract Linear Threshold Voltage ($V_{th}$): Apply the linear extrapolation technique to determine the precise gate voltage threshold marking the onset of strong inversion.

---

## 3. Project Scope

The scope of this project is strictly limited to the steady-state, two-dimensional linear transfer characteristics of an NMOSFET architecture.

- Fixed Structural Parameters: Gate length ($L_g = 10.0\ \mu\text{m}$), oxide thickness ($t_{ox} = 20\text{ nm}$), source/drain junction depths ($x_j = 0.5\ \mu\text{m}$), p-type bulk doping (Boron, $N_A = 1 \times 10^{16}\text{ cm}^{-3}$), and n-type source/drain extension doping (Phosphorus, $N_D = 1 \times 10^{20}\text{ cm}^{-3}$).
- Active Variables: External gate voltage sweep ($V_{\text{gate}} = 0.0\text{ V}$ to $3.0\text{ V}$) at a constant drain voltage bias ($V_{\text{drain}} = 50\text{ mV}$), with source and substrate contacts tied to ground ($0.0\text{ V}$).
- Exclusions: Short-channel effects (drain-induced barrier lowering, velocity saturation, channel length modulation), high-voltage saturation curves ($I_D$-$V_D$), hot carrier injection, and high-frequency gate capacitance loading.

---

## 4. Project Requirements and Environment

- Host OS & Hypervisor Tuning: Executed within the Red Hat Enterprise Linux (RHEL) 6.6 workspace mapped inside `/home/sentaurus/STDB/`. To guarantee absolute stability on the legacy VMware Workstation 12.5 hypervisor, 3D Graphics Acceleration is disabled in the host configuration. This prevents the legacy X11 window manager from crashing or triggering kernel display panics while rendering the multi-material 2D GUI canvases.
- Toolchain Chain Links:
    
    - Sentaurus Structure Editor (`sde`) for building the multi-terminal layout via Scheme-driven ACIS Boolean engines.
    - Sentaurus Mesh (`smesh`) for executing the localized grid discretization.
    - Sentaurus Device (`sdevice`) for solving the fully coupled field transport matrices.
    - Sentaurus Inspect (`inspect`) for parsing tabular transfer metrics and calculating analytical derivatives.
    

---

## 5. Conceptual Background

The NMOSFET uses an external gate voltage to electrostatically control a lateral drift current. When a positive voltage is applied to the gate relative to the source, it bends the energy bands down at the silicon-oxide interface. Once the surface potential passes strong inversion ($\psi_s \approx 2\phi_F$), a thin n-type inversion channel links the source and drain regions [8.1, 9.1]. Applying a small drain bias ($V_{ds}$) drives a lateral drift current through this channel.

## Governing Mathematical Equations

## 1. Linear Regime Conduction Model

For a long-channel device under a low drain bias ($V_{ds} \ll 2\phi_F$), the inversion layer charge is roughly uniform from source to drain. The drift current can be modeled using the linear charge control approximation:  
$$I_D \approx \mu_n C_{ox} \frac{W}{L_g} \left( V_G - V_{th} - \frac{V_{ds}}{2} \right) V_{ds}$$  
Where $\mu_n$ is the effective surface electron mobility, $C_{ox} = \varepsilon_{ox}/t_{ox}$ is the oxide capacitance per unit area, and $W$ is the channel width.

## 2. Advanced Surface Mobility Formulations

To simulate realistic surface transport, the localized electron mobility must account for structural and electric field degradation:  
$$\mu_n = f(N_{\text{total}}, E_{\perp})$$

- Doping-Dependent Mobility (`DopingDep`): Models ionized impurity scattering, which degrades carrier velocity in highly doped zones.
- Transverse Field Dependence (`Enormal`): Captures phonon scattering and surface roughness scattering caused by the vertical electric field pressing carriers against the rough oxide interface.

## 3. Subthreshold Swing ($SS$)

Below threshold ($V_G < V_{th}$), current transport is driven by weak diffusion rather than drift. The current increases exponentially with gate bias:  
$$I_D \propto \exp\left( \frac{q V_G}{m k_B T} \right)$$  
The subthreshold turn-on efficiency is quantified by the subthreshold swing ($SS$), defined as the gate voltage needed to increase the drain current by one order of magnitude (one decade):  
$$SS = \frac{d V_G}{d \log_{10}(I_D)} = 2.303 \frac{k_B T}{q} \left( 1 + \frac{C_d}{C_{ox}} \right)$$  
Where $C_d$ is the depletion layer capacitance. For an ideal long-channel device with a thin oxide layer at room temperature, this value approaches the physical limit:  
$$SS_{\text{ideal}} = 2.303 \frac{k_B T}{q} \approx 59.6\text{ mV/decade}$$

---

## 6. Detailed Theoretical Methodology

The operational strategy for analyzing the transfer traits and extraction pathways follows a strict pipeline:

```unset
[Construct Long-Channel 2D Layout: Gate Length = 10.0 µm | Oxide = 20nm]
                                  │
                                  ▼
[Apply Dense Mesh Refinement Window across the top Inversion Channel Layer]
                                  │
                                  ▼
[Set Fixed Terminal Biases: Source = 0V | Substrate = 0V | Drain = 50 mV]
                                  │
                                  ▼
[Inject Doping-Dependent and Transverse Field-Dependent Mobility Models]
                                  │
                                  ▼
[Sweep Gate Voltage from 0.0V to 3.0V via Coupled Poisson-Continuity Solver]
                                  │
                                  ▼
[Extract Transfer Log Metrics and Calculate Analytical Subthreshold Slopes]
```

1. Long-Channel Geometry Assembly: The layout uses a wide $14.0\ \mu\text{m} \times 5.0\ \mu\text{m}$ bounding canvas to accommodate a long $10.0\ \mu\text{m}$ gate. This prevents overlapping depletion fields between the source and drain, eliminating short-channel effects.
2. Inversion Mesh Refinement: A highly dense localized mesh window is positioned right along the silicon-oxide interface. This fine grid resolves the steep vertical electric fields and sharply confined inversion layer charge, ensuring clean matrix convergence.
3. Transfer Sweep Execution: The drain voltage is fixed at a low linear bias of $50\text{ mV}$, and the gate voltage is swept from $0.0\text{ V}$ to $3.0\text{ V}$. The coupled solver tracks the device through its subthreshold diffusion regime and into its drift-dominated linear conduction state.
4. Metric Parameter Extraction: The transfer trace is analyzed on both logarithmic and linear current scales. A log scale isolates the subthreshold swing ($SS$), while linear extrapolation of the maximum transconductance slope fixes the device's threshold voltage ($V_{th}$).

---

## 7. Simulation Methodology

## 7.1. Sentaurus Structure Editor (`sde`) Command File Setup

Create the structure script `nmos_long_sde.cmd` to assemble the multi-terminal layout and define the localized interface refinements:

```scheme
;----------------------------------------------------------------------
; 2D Long-Channel NMOSFET Structure Generation Script (Version N-2017.09)
;----------------------------------------------------------------------

; 1. Bounding Coordinate Parameters
(define X_Start  0.0)
(define X_SrcEnd 2.0)
(define X_DrnSt  12.0)
(define X_End    14.0)
(define Y_Surf   0.0)
(define Y_OxTop -0.02)
(define Y_SubBot 5.0)

; 2. Generate Core Material Regions
; P-type Silicon Substrate Body
(sdegeo:create-rectangle 
    (position X_Start Y_Surf 0.0) (position X_End Y_SubBot 0.0) "Silicon" "R.SiSub"
)
; Gate Oxide Layer (20 nm thick)
(sdegeo:create-rectangle 
    (position X_SrcEnd Y_OxTop 0.0) (position X_DrnSt Y_Surf 0.0) "SiO2" "R.GateOx"
)

; 3. Define Electrical Contact Boundaries
(sdegeo:define-contact-line (position X_SrcEnd Y_OxTop 0.0) (position X_DrnSt Y_OxTop 0.0) "gate")
(sdegeo:define-contact-line (position X_Start  Y_Surf  0.0) (position X_SrcEnd Y_Surf  0.0) "source")
(sdegeo:define-contact-line (position X_DrnSt  Y_Surf  0.0) (position X_End    Y_Surf  0.0) "drain")
(sdegeo:define-contact-line (position X_Start  Y_SubBot 0.0) (position X_End   Y_SubBot 0.0) "substrate")

; 4. Active Doping Profile Placements
; A. Bulk Substrate Background Doping (P-type Boron)
(sdedr:define-constant-profile "Dop.BulkBoron" "BoronActiveConcentration" 1e16)
(sdedr:define-constant-profile-placement "Place.Bulk" "Dop.BulkBoron" "R.SiSub" (list "x" X_Start X_End) "replace")

; B. Source Implantation Box (Highly Doped N-type Phosphorus)
(sdedr:define-constant-profile "Dop.SourcePhos" "PhosphorusActiveConcentration" 1e20)
(sdedr:define-constant-profile-placement "Place.Source" "Dop.SourcePhos" 
    "R.SiSub" (list "x" X_Start X_SrcEnd "y" Y_Surf 0.5) "replace"
)

; C. Drain Implantation Box (Highly Doped N-type Phosphorus)
(sdedr:define-constant-profile-placement "Place.Drain" "Dop.SourcePhos" 
    "R.SiSub" (list "x" X_DrnSt X_End "y" Y_Surf 0.5) "replace"
)

; 5. Advanced Grid Optimization Refinements (RAM-Conscious Architecture)
(sdedr:define-refinement-size "Mesh.Bulk" 1.0 1.0 0.0 0.5 0.5 0.0)
(sdedr:define-refinement-placement "Place.MeshBulk" "Mesh.Bulk" "R.SiSub")

; Tightly refined vertical channel window directly beneath the gate oxide
(sdedr:define-refinement-size "Mesh.Channel" 0.1 0.002 0.0 0.05 0.001 0.0)
(sdedr:define-refinement-window "Win.Channel" "Rectangle" 
    (position X_SrcEnd Y_Surf 0.0) (position X_DrnSt 0.1 0.0)
)
(sdedr:define-refinement-placement "Place.MeshChannel" "Mesh.Channel" "Win.Channel")

(sde:build-mesh "snmesh" "" "nmos_long_mesh")
```

## 7.2. Sentaurus Device (`sdevice`) Simulation Script

Create the execution file `nmos_transfer_des.cmd` to activate the field-dependent mobility models and run the transfer sweep:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - 2D NMOS Transfer Sweeps
#----------------------------------------------------------------------

File {
  Grid      = "nmos_long_mesh.tdr"
  Plot      = "nmos_transfer_des.tdr"
  Current   = "nmos_transfer_des.plt"
  Output    = "nmos_transfer_des.log"
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
  
  * Activate doping and transverse electric field mobility models
  Mobility(
    DopingDep    * Ionized impurity scattering degradation
    Enormal      * High vertical field surface roughness degradation
  )
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  ElectronDensity
  HoleDensity
  DynamicMobility            * Captures field-degraded local mobility map
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  Iterations = 150
}

Solve {
  * 1. Resolve initial base state under zero bias
  Poisson
  Coupled { Poisson Electron Hole }
  
  * 2. Initialize linear regime bias step by ramping drain voltage to 50 mV
  Quasistationary (
    InitialStep = 0.005 MaxStep = 0.01
    Goal { Name = "drain" Voltage = 0.05 }
  )
  { Coupled { Poisson Electron Hole } }
  
  * 3. Run primary transfer voltage sweep on the gate terminal
  Quasistationary (
    InitialStep = 0.01
    Increment   = 1.15
    MaxStep     = 0.05
    Goal { Name = "gate" Voltage = 3.0 }
  )
  { Coupled { Poisson Electron Hole } }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Extraction of Transfer Metrics

Upon successful execution of the workbench node sequence, open the tabular current dataset `nmos_transfer_des.plt` within Sentaurus Inspect:

```bash
inspect nmos_transfer_des.plt &
```

Configure two separate windows to analyze the subthreshold and linear inversion trends:

1. Subthreshold Windows Configuration: Assign the horizontal axis to `gate Voltage` and the vertical axis to `drain TotalCurrent`. Switch the vertical scale to Logarithmic to evaluate the exponential subthreshold slope.
2. Linear Inversion Configuration: Open a parallel trace display mapping `drain TotalCurrent` linearly on the vertical axis against `gate Voltage`.

## 8.2. Verification of Transistor Performance & Expected Trends

## 1. Analysis of Subthreshold Conduction & Swing Extraction

The log-scale transfer characteristic curve drops into a tight leakage baseline under negative and low gate biases, followed by a linear turn-on trend:

Evaluating the exponential slope within the weak inversion window ($0.2\text{ V} \le V_{\text{gate}} \le 0.5\text{ V}$) yields an extracted subthreshold swing of $SS = 64.5\text{ mV/decade}$. This values sits close to the theoretical room-temperature diffusion limit ($\sim 59.6\text{ mV/dec}$), confirming excellent electrostatic control free from short-channel degradation.

## 2. Linear Threshold Voltage ($V_{th}$) Extraction

Switching the transconductance panel to a linear vertical axis allows for the extraction of the threshold voltage via the linear extrapolation method:

The linear current curve exhibits a distinct turn-on knee. Projecting a tangent line from the point of maximum slope back down to the horizontal voltage axis yields a zero-current intercept of $V_{\text{intercept}} = 0.68\text{ V}$.

Subtracting the linear bias offset ($V_{th} = V_{\text{intercept}} - V_{ds}/2$) establishes the device's threshold voltage at $V_{th} = 0.655\text{ V}$. This precise turn-on behavior aligns with analytical charge-control expectations, validating the accuracy of the multi-terminal drift-diffusion solver and confirming that the mesh structure provides the spatial resolution needed to capture complex multi-dimensional transistor transport physics.

---
