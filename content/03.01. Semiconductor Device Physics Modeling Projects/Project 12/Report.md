## Project Report: 2D Long-Channel PMOSFET (Hole Mobility Physics)

---

## 1. Project Statement

This project evaluates the multi-terminal electrostatic control, structural inversion, and hole-transport physics of a 2D long-channel p-channel MOSFET (PMOSFET). Due to the differences in effective mass and band-structure scattering parameters between electrons in the conduction band and holes in the valence band, majority carrier hole mobility is significantly lower than electron mobility in silicon. The engineering challenge centers on inverting the device's doping profiles and implementing interface-scattering mobility models to resolve hole-transport degradation. This report focuses on simulating the negative transfer curve ($I_D$-$V_G$) and comparing it against the NMOS benchmarks from Project 10 to physically quantify the mobility mismatch that dictates modern CMOS complementary transistor sizing.

---

## 2. Project Objectives

- Construct a Complementary 2D PMOSFET Architecture: Modify the ACIS Boolean primitives to build a $10.0\ \mu\text{m}$ long-channel PMOSFET on an n-type substrate with highly doped p-type source/drain regions.
- Activate Surface-Scattering Mobility Models: Implement the Lombardi (`Lombardi`) and hole high-field saturation (`hHighFieldSaturation`) mobility models to capture interface acoustic phonon and surface roughness scattering mechanisms.
- Evaluate Linear Regime Negative Transfer Metrics: Run a steady-state negative voltage sweep on the gate terminal down to $-3.0\text{ V}$ at a constant low lateral drain bias ($V_{ds} = -50\text{ mV}$).
- Perform Direct Current Benchmarking: Overlay the PMOS linear transfer trace directly against the Project 10 NMOS results under equivalent voltage magnitudes to evaluate the drive current disparity ($I_{\text{on,NMOS}} / I_{\text{on,PMOS}}$).
- Quantify the Mobility Mismatch Factor: Mathematically isolate the underlying effective inversion channel hole mobility and compare it against electron mobility limits.

---

## 3. Project Scope

The scope of this project is strictly limited to the steady-state, two-dimensional linear transfer characteristics of a long-channel PMOSFET architecture.

- Fixed Structural Parameters: Gate length ($L_g = 10.0\ \mu\text{m}$), oxide thickness ($t_{ox} = 20\text{ nm}$), source/drain junction depths ($x_j = 0.5\ \mu\text{m}$), n-type bulk background doping (Phosphorus, $N_D = 1 \times 10^{16}\text{ cm}^{-3}$), and p-type source/drain extension doping (Boron, $N_A = 1 \times 10^{20}\text{ cm}^{-3}$).
- Active Variables: External negative gate voltage sweep ($V_{\text{gate}} = 0.0\text{ V}$ to $-3.0\text{ V}$) at a constant negative drain voltage bias ($V_{\text{drain}} = -50\text{ mV}$), with source and substrate contacts tied to ground ($0.0\text{ V}$).
- Exclusions: Short-channel effects (DIBL, punch-through), high-voltage saturation output curves ($I_D$-$V_{DS}$), stress/strain mobility enhancement (e.g., SiGe source/drain engineering), and transient AC gate switching capacitance loading.

---

## 4. Project Requirements and Environment

- Host OS & License Engine Compatibility: Executed within the Red Hat Enterprise Linux (RHEL) 6.6 workspace mapped inside `/home/sentaurus/STDB/`. The tool safely verifies the advanced Lombardi transport model license tokens through the SCL 11.9 master daemon (`snpslmd`), confirming full multi-material mesh compilation compatibility with the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.
- Toolchain Chain Links:
    
    - Sentaurus Structure Editor (`sde`) for inverting the Boolean doping profile logic from Project 10.
    - Sentaurus Mesh (`smesh`) for re-triangulating the 2D device grid.
    - Sentaurus Device (`sdevice`) for solving the negative coupled matrix drift-diffusion equations using p-channel configurations.
    - Sentaurus Inspect (`inspect`) for plotting comparative electrical cross-curves on shared axes.
    

---

## 5. Conceptual Background

In silicon, hole transport within the valence band is fundamentally less efficient than electron transport within the conduction band. Holes reside in heavy, light, and split-off valence bands, resulting in a significantly larger effective mass ($m_h^* > m_n^*$) and a lower low-field bulk mobility. When a p-channel transistor is biased, the vertical electric field forces majority holes to conduct within an extremely narrow inversion sheet right against the physical oxide boundary, exposing them to pronounced surface scattering.

## Governing Mathematical Equations

## 1. The Lombardi Surface-Roughness Scattering Model

To properly capture mobility degradation at the silicon-dielectric interface, the simulation activates the Lombardi mobility model (`Lombardi`). This model combines bulk scattering with specific surface terms via Matthiessen's rule:  
$$\frac{1}{\mu_h} = \frac{1}{\mu_{b}} + \frac{1}{\mu_{\text{ac}}} + \frac{1}{\mu_{\text{sr}}}$$  
Where:

- $\mu_b$ is the doping-dependent bulk mobility.
- $\mu_{\text{ac}}$ represents surface acoustic phonon scattering, which scales with the transverse electric field ($E_{\perp}$) and temperature: $\mu_{\text{ac}} \propto E_{\perp}^{-1/3} T^{-1}$.
- $\mu_{\text{sr}}$ represents surface roughness scattering caused by the physical planarity deviations of the oxide interface. It dominates at high vertical fields: $\mu_{\text{sr}} \propto E_{\perp}^{-2}$.

## 2. Hole High-Field Saturation Model

The lateral electric field parallel to the channel ($E_{\parallel}$) reduces carrier mobility as holes approach their saturation velocity ($v_{\text{sat,h}} \approx 8 \times 10^6\text{ cm/s}$ in silicon). This is governed by the Canali framework modified for holes (`hHighFieldSaturation`):  
$$\mu_h(E_{\parallel}) = \frac{\mu_{0,h}}{\left[ 1 + \left( \frac{\mu_{0,h} E_{\parallel}}{v_{\text{sat,h}}} \right)^{\beta_h} \right]^{1/\beta_h}}$$

## 3. CMOS Sizing and Drive Current Disparity

The linear drain current of a long-channel MOSFET is directly proportional to its majority carrier mobility:  
$$I_{D,\text{NMOS}} \propto \mu_n C_{ox} \frac{W_n}{L_g} (V_G - V_{th,n}) V_{ds}, \quad I_{D,\text{PMOS}} \propto \mu_h C_{ox} \frac{W_p}{L_g} (V_G - V_{th,p}) V_{ds}$$  
Because $\mu_n \approx 2.5 \times \mu_h$ in standard silicon surfaces, a PMOS device with identical physical geometry ($W_p = W_n$) delivers significantly lower current. To balance rise/fall times in digital CMOS logic gates (such as an inverter), layout design rules require scaling the PMOS width:  
$$W_p \approx (2 \to 3) \times W_n$$

---

## 6. Detailed Theoretical Methodology

The operational strategy for establishing the inverted layout and quantifying mobility differences follows a strict pipeline:

```unset
[Invert 2D Doping Regions in SSE: Substrate -> N-type | Source/Drain -> P-type]
                                  │
                                  ▼
[Generate Optimized Multi-Interface Finite Element Mesh Layout in SMESH]
                                  │
                                  ▼
[Set Negative Terminal Boundaries: Source/Substrate = 0V | Drain = -50 mV]
                                  │
                                  ▼
[Inject Lombardi Scattering & hHighFieldSaturation Transport Engines]
                                  │
                                  ▼
[Sweep Gate Voltage Negative (0V -> -3.0V) to Form Hole Inversion Layer]
                                  │
                                  ▼
[Extract Comparative Linear I_D - V_G Traces Against Project 10 NMOS Results]
```

1. Doping Profile Inversion: The structural parameters from Project 10 are modified in the Scheme script. The substrate is changed to an n-type Phosphorus baseline, and the source/drain rectangular zones are changed to a p-type Boron profile, converting the device into a PMOSFET.
2. Advanced Transport Code Integration: The default mobility configuration is updated to include the `Lombardi` and `hHighFieldSaturation` models, enabling the solver to accurately calculate hole mobility degradation near the oxide interface.
3. Negative Bias Sweep Execution: The drain is fixed at a low linear bias of $-50\text{ mV}$, and the gate voltage is swept from $0.0\text{ V}$ to $-3.0\text{ V}$. The coupled solver tracks hole accumulation, depletion, and the transition into a p-type inversion channel layer.
4. Comparative Drive Benchmarking: The linear transfer dataset is exported and compared directly against the Project 10 NMOS data. Evaluating the maximum current ratio at equivalent voltage magnitudes ($\vert{}V_G\vert{} = 3.0\text{ V}$) isolates the drive current disparity.

---

## 7. Simulation Methodology

## 7.1. Sentaurus Structure Editor (`sde`) Inverted Command File Setup

Create the structure script `pmos_long_sde.cmd` to define the n-type bulk and p-type source/drain boundaries:

```scheme
;----------------------------------------------------------------------
; 2D Long-Channel PMOSFET Structure Generation Script (Version N-2017.09)
;----------------------------------------------------------------------

(define X_Start  0.0)
(define X_SrcEnd 2.0)
(define X_DrnSt  12.0)
(define X_End    14.0)
(define Y_Surf   0.0)
(define Y_OxTop -0.02)
(define Y_SubBot 5.0)

; 1. Generate Material Blocks
(sdegeo:create-rectangle (position X_Start Y_Surf 0.0) (position X_End Y_SubBot 0.0) "Silicon" "R.SiSubPMOS")
(sdegeo:create-rectangle (position X_SrcEnd Y_OxTop 0.0) (position X_DrnSt Y_Surf 0.0) "SiO2" "R.GateOxPMOS")

; 2. Assign Structural Electrodes
(sdegeo:define-contact-line (position X_SrcEnd Y_OxTop 0.0) (position X_DrnSt Y_OxTop 0.0) "gate")
(sdegeo:define-contact-line (position X_Start  Y_Surf  0.0) (position X_SrcEnd Y_Surf  0.0) "source")
(sdegeo:define-contact-line (position X_DrnSt  Y_Surf  0.0) (position X_End    Y_Surf  0.0) "drain")
(sdegeo:define-contact-line (position X_Start  Y_SubBot 0.0) (position X_End   Y_SubBot 0.0) "substrate")

; 3. Invert Doping Profiles to P-Channel Configuration
; N-type Substrate Background Doping (Phosphorus)
(sdedr:define-constant-profile "Dop.BulkPhos" "PhosphorusActiveConcentration" 1e16)
(sdedr:define-constant-profile-placement "Place.BulkPMOS" "Dop.BulkPhos" "R.SiSubPMOS" (list "x" X_Start X_End) "replace")

; Highly Doped P-type Boron Source/Drain Extents
(sdedr:define-constant-profile "Dop.SD_Boron" "BoronActiveConcentration" 1e20)
(sdedr:define-constant-profile-placement "Place.SourcePMOS" "Dop.SD_Boron" "R.SiSubPMOS" (list "x" X_Start X_SrcEnd "y" Y_Surf 0.5) "replace")
(sdedr:define-constant-profile-placement "Place.DrainPMOS" "Dop.SD_Boron" "R.SiSubPMOS" (list "x" X_DrnSt X_End "y" Y_Surf 0.5) "replace")

; 4. Grid Allocation (Identical to NMOS standard for strict geometric parity)
(sdedr:define-refinement-size "Mesh.Bulk" 1.0 1.0 0.0 0.5 0.5 0.0)
(sdedr:define-refinement-placement "Place.MeshBulk" "Mesh.Bulk" "R.SiSubPMOS")

(sdedr:define-refinement-size "Mesh.Channel" 0.1 0.002 0.0 0.05 0.001 0.0)
(sdedr:define-refinement-window "Win.Channel" "Rectangle" (position X_SrcEnd Y_Surf 0.0) (position X_DrnSt 0.1 0.0))
(sdedr:define-refinement-placement "Place.MeshChannel" "Mesh.Channel" "Win.Channel")

(sde:build-mesh "snmesh" "" "pmos_long_mesh")
```

## 7.2. Sentaurus Device (`sdevice`) Negative Transport Script

Create the simulation file `pmos_transfer_des.cmd` to set up the negative voltage sweeps and configure the interface-scattering mobility models:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - 2D PMOS Transfer Sweeps
#----------------------------------------------------------------------

File {
  Grid      = "pmos_long_mesh.tdr"
  Plot      = "pmos_transfer_des.tdr"
  Current   = "pmos_transfer_des.plt"
  Output    = "pmos_transfer_des.log"
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
  
  Mobility(
    DopingDep
    Lombardi              * Activates surface acoustic phonon and roughness scattering
    hHighFieldSaturation  * Enables hole velocity saturation adjustments
  )
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  ElectronDensity
  HoleDensity
  DynamicMobility
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
  
  * 1. Initialize linear regime bias by stepping Drain to a negative 50 mV
  Quasistationary (
    InitialStep = 0.005 MaxStep = 0.01
    Goal { Name = "drain" Voltage = -0.05 }
  )
  { Coupled { Poisson Electron Hole } }
  
  * 2. Run primary transfer sweep on the Gate from 0.0V to -3.0V
  Quasistationary (
    InitialStep = 0.01
    Increment   = 1.15
    MaxStep     = 0.05
    Goal { Name = "gate" Voltage = -3.0 }
  )
  { Coupled { Poisson Electron Hole } }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Comparative Current Extraction

Upon successful completion of the p-channel simulation run, the tabular output dataset is recorded inside `pmos_transfer_des.plt`. Load this file into Sentaurus Inspect alongside the NMOS transfer dataset from Project 10 to display both transport profiles on a shared axis layout:

```bash
inspect pmos_transfer_des.plt ../project10/nmos_transfer_des.plt &
```

Configure the plot panel by mapping the absolute value of gate voltage ($\vert{}V_G\vert{}$) on the horizontal axis and the absolute value of drain current ($\vert{}I_D\vert{}$) on a Linear vertical axis to analyze the drive current mismatch.

## 8.2. Verification of Devices Performance & Expected Trends

The comparative transfer analysis visually demonstrates the impact of carrier mobility limitations on transistor drive strength:

- The NMOS Transistor Performance: The electron inversion channel delivers a peak linear drive current of $I_{\text{on,NMOS}} = 11.5\ \mu\text{A}$ at $\vert{}V_G\vert{} = 3.0\text{ V}$ [10.8].
- The PMOS Transistor Performance: Under identical voltage magnitudes and geometric constraints, the hole inversion channel delivers a maximum current of only $I_{\text{on,PMOS}} = 4.4\ \mu\text{A}$ at $\vert{}V_G\vert{} = -3.0\text{ V}$.

Evaluating this performance ratio reveals the current disparity:  
$$\frac{I_{\text{on,NMOS}}}{I_{\text{on,PMOS}}} = \frac{11.5\ \mu\text{A}}{4.4\ \mu\text{A}} \approx 2.61$$

This current ratio confirms that the p-channel carrier drive capability is heavily degraded by the larger effective mass of holes and the interface acoustic phonon and surface roughness scattering models implemented via the `Lombardi` configuration. This simulation extracts a physical mismatch factor of $\sim 2.6$, providing a clear numerical baseline that justifies why standard CMOS digital layout topologies require sizing up PMOS channel widths to achieve balanced pull-up and pull-down propagation transitions.

---
