## Project Report: 2D Long-Channel NMOSFET (Output Characteristics & Velocity Saturation)

---

## 1. Project Statement

This project evaluates the multi-terminal high-field transport, channel modulation, and current saturation mechanics of a 2D long-channel n-channel MOSFET (NMOSFET)[10.1]. As the lateral electric field along the channel increases, carrier velocity deviates from its linear dependence on the field and begins to level off due to scattering mechanisms. The engineering challenge is to simulate this transition from the linear (triode) regime into the saturation regime, accounting for high-field carrier velocity saturation and channel pinch-off [11.1]. This report focuses on simulating the output family of curves ($I_D$-$V_{DS}$) and analyzing the internal velocity profiles using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem [11.1].

---

## 2. Project Objectives

- Obtain the Output Family of Curves: Execute a nested simulation routine to generate a comprehensive family of $I_D$-$V_{DS}$ characteristics at discrete gate biases ($V_G = 1.0\text{ V}, 2.0\text{ V}, 3.0\text{ V}$) [11.1].
- Model High-Field Saturation Physics: Incorporate high-field saturation mobility models to accurately capture velocity limitations under strong lateral electric fields [11.1].
- Map Spatial Velocity Profiles: Extract the 2D distribution of electron velocity along the channel to track carrier acceleration from source to drain [11.1].
- Identify the Channel Pinch-Off Point: Locate the spatial pinch-off boundary near the drain contact where the local inversion charge drops and velocity levels off [11.1].
- Evaluate Conductance Modulation: Track the shift from a voltage-controlled resistor layout to a voltage-controlled current source configuration.

---

## 3. Project Scope

The scope of this project is limited to the steady-state, two-dimensional high-field output characteristics using the exact structural mesh from Project 10 [10.1].

- Fixed Structural Parameters: Gate length ($L_g = 10.0\ \mu\text{m}$), oxide thickness ($t_{ox} = 20\text{ nm}$), source/drain junction depths ($x_j = 0.5\ \mu\text{m}$), p-type bulk doping (1 × 10¹⁶ cm⁻³), and n-type source/drain extension doping (1 × 10²⁰ cm⁻³) [10.3].
- Active Variables: Drain voltage sweep ($V_{drain} = 0.0\text{ V}$ to 3.0 V) nested inside discrete gate steps ($V_{gate} = 1.0\text{ V}, 2.0\text{ V}, 3.0\text{ V}$) [11.1].
- Exclusions: Short-channel effects (drain-induced barrier lowering, threshold voltage roll-off, channel length modulation), transient switching states, lattice self-heating, and subthreshold leakage analysis [10.3].

---

## 4. Project Requirements and Environment

- Host OS & Workspace Management: Executed within the Red Hat Enterprise Linux (RHEL) 6.6 workspace mapped inside `/home/sentaurus/STDB/` [11.1].
- Simulation Node Reutilization: This project runs as a new simulation node in Sentaurus Workbench (`swb`) that imports the structural mesh file (`nmos_long_mesh.tdr`) directly from Project 10 [10.1, 11.1]. Reusing this mesh eliminates the need to run the structure editor (`sde`) and mesher (`smesh`) routines again, optimizing workflow speed [11.1].
- Toolchain Chain Links:
    
    - Sentaurus Mesh (`smesh`) provides the optimized 2D grid structure (`nmos_long_mesh.tdr`) generated in Project 10 [10.1, 11.1].
    - Sentaurus Device (`sdevice`) for solving the fully coupled high-field drift-diffusion transport matrices [11.1].
    - Sentaurus Inspect (`inspect`) for overlaying multiple output traces to build the family of curves [11.1].
    - Sentaurus Visual (`svisual`) for extracting 2D spatial contours of high-field electron velocity [11.1].
    

---

## 5. Conceptual Background

In a long-channel NMOSFET under low drain bias ($V_{DS}$), the drift current increases linearly with voltage, operating in the linear (triode) regime [10.5]. However, as the drain voltage increases, it creates a lateral electric field component parallel to the channel ($E_{\parallel}$), which shifts the internal potential balance.

## 1. Velocity Saturation Mechanics

In the linear regime, carrier drift velocity ($v_d$) increases proportionally with the electric field ($v_d = \mu_n E_{\parallel}$). As the lateral electric field exceeds a critical value ($E_c \approx 10^4\text{ V/cm}$ in silicon), carriers interact more frequently with optical phonons in the crystal lattice. This energy scattering limits further acceleration, causing the carrier drift velocity to saturate at a fixed maximum value:  
$$v_{\text{sat}} \approx 1 \times 10^7\text{ cm/s}$$

## 2. High-Field Saturation Mobility Formulation

To accurately capture this velocity limitation, the simulation uses the Canali high-field saturation mobility model (`eHighFieldSaturation`) [11.1]:  
$$\mu_n(E_{\parallel}) = \frac{\mu_0}{\left[ 1 + \left( \frac{\mu_0 E_{\parallel}}{v_{\text{sat}}} \right)^{\beta} \right]^{1/\beta}}$$  
Where μ₀ is the low-field mobility (including ionized impurity and transverse field scattering contributions) [10.5], and β is a temperature-dependent scaling parameter.

## 3. Channel Pinch-Off Mechanism

As the drain voltage increases, the local voltage difference between the gate and the channel decreases from the source end toward the drain end. The local inversion charge density is given by:  
$$Q_{\text{inv}}(x) = C_{ox} [V_G - V_{th} - V(x)]$$  
When the drain voltage reaches the saturation point ($V_{DS} \ge V_{DS,\text{sat}} = V_G - V_{th}$), the local inversion charge density at the drain edge drops to near-zero ($Q_{\text{inv}}(L_g) \approx 0$). This condition is known as channel pinch-off [11.1]. Beyond this point, any further increase in drain voltage drops across the narrow depletion region surrounding the drain junction, keeping the saturation current ($I_{D,\text{sat}}$) constant:  
$$I_{D,\text{sat}} = \frac{W}{2 L_g} \mu_n C_{ox} (V_G - V_{th})^2$$

---

## 6. Detailed Theoretical Methodology

The operational strategy for analyzing high-field transport transitions and mapping velocity boundaries follows a structured pipeline:

```unset
[Import Baseline 2D Grid Mesh from Project 10 (nmos_long_mesh.tdr)]
                                 │
                                 ▼
[Inject DopingDep, Enormal, and eHighFieldSaturation Physics Blocks]
                                 │
                                 ▼
[Set Outer Sweep Parameter: Discrete Gate Voltage Steps (1.0V, 2.0V, 3.0V)]
                                 │
                                 ▼
[Execute Inner Sweep: Ramp Drain Voltage from 0.0V to 3.0V for Each Gate Step]
                                 │
                                 ▼
[Solve High-Field Transport System and Output Tabular Plot Traces (.plt)]
                                 │
                                 ▼
[Extract Spatial Velocity Maps to Identify Local Pinch-Off Boundaries]
```

1. Transport Framework Configuration: The low-field mobility corrections from Project 10 are combined with the Canali high-field saturation model [10.5, 11.1]. This allows the solver to accurately calculate carrier degradation under both vertical interface fields and lateral high-velocity drift conditions [10.5, 11.1].
2. Nested Simulation Loop Construction: The control structure uses a nested sweep loop. The outer loop initializes the gate bias to a fixed operating point, and the inner loop runs a quasistationary ramp of the drain voltage from 0.0 V to 3.0 V [11.1].
3. Linear-to-Saturation Transition: The fully coupled solver tracks channel modulation across the sweep. It captures the initial linear rise in current, the roll-off as pinch-off forms, and the flat current plateau in the saturation regime.
4. Spatial Profile Extraction: Spatial field data is extracted from the high-bias solution file. Mapping electron velocity contours across the 2D grid provides visual confirmation of the pinch-off point and matches velocity limits against theoretical values [11.1].

---

## 7. Simulation Methodology

## 7.1. Structural Grid Integration

This project directly reuses the `nmos_long_mesh.tdr` file generated in Project 10 [10.1, 11.1]. The dense vertical channel grid layout (Δ y = 0.002 μm) provides the necessary spatial resolution to capture the high lateral electric fields and sharp velocity gradients near the drain edge [10.7, 11.1].

## 7.2. Sentaurus Device (`sdevice`) Family Output Script

Create the simulation file `nmos_output_des.cmd` to set up the nested gate/drain sweeps and configure the high-field mobility models:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - NMOSFET Output Characteristics
#----------------------------------------------------------------------

File {
  * Import structural grid from Project 10
  Grid      = "nmos_long_mesh.tdr"
  Plot      = "nmos_output_des.tdr"
  Current   = "nmos_output_des.plt"
  Output    = "nmos_output_des.log"
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
    Enormal
    eHighFieldSaturation  * Enables high lateral field velocity saturation limits
  )
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  ElectronDensity
  HoleDensity
  ElectronVelocity        * Maps spatial distribution of carrier velocity magnitudes
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  Iterations = 150
}

Solve {
  * 1. Initialize equilibrium state
  Poisson
  Coupled { Poisson Electron Hole }
  
  * 2. Outer Parameter Loop: Step Gate voltage through select operating bounds
  NewCurrentPrefix = "vg_"
  ParameterLoop (
    Name = "gate"
    Values = (1.0, 2.0, 3.0)
  ) {
    * A. Quasistationary step to ramp Gate to the selected value before sweeping Drain
    Quasistationary (
      InitialStep = 0.05 MaxStep = 0.1
      Goal { Name = "gate" Value = @gate@ }
    )
    { Coupled { Poisson Electron Hole } }
    
    * B. Inner Parameter Loop: Run primary Drain voltage output sweep from 0.0V to 3.0V
    Quasistationary (
      InitialStep = 0.01
      Increment   = 1.15
      MaxStep     = 0.05
      Goal { Name = "drain" Voltage = 3.0 }
    )
    { Coupled { Poisson Electron Hole } }
  }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Extraction of Output Curves

Upon successful completion of the nested simulation loops, the output traces are saved in separate tabular files prefixed by the gate bias steps: `vg_1.0_nmos_output_des.plt`, `vg_2.0_nmos_output_des.plt`, and `vg_3.0_nmos_output_des.plt`. Load these files together into Sentaurus Inspect to display the output characteristics [11.1]:

```bash
inspect vg_1.0_nmos_output_des.plt vg_2.0_nmos_output_des.plt vg_3.0_nmos_output_des.plt &
```

Configure the plot display by mapping `drain Voltage` on the horizontal axis and `drain TotalCurrent` on a Linear vertical axis to analyze the transistor family of curves [11.1].

## 8.2. Verification of Devices Performance & Expected Trends

## 1. Analysis of the Output Family of Curves ($I_D$-$V_{DS}$)

The compiled output curves demonstrate classic long-channel transistor behavior, showing a smooth transition from linear conduction to saturated current plateaus [11.1]:

- Linear Regime Conduction: At low drain biases ($V_{DS} < V_G - V_{th}$), the current increases linearly with voltage, with the slope scaling proportionally to the applied gate bias as the channel conductance is modulated [11.1].
- Saturation Regime Conduction: As $V_{DS}$ increases past the saturation threshold, the curves flatten out into distinct current plateaus [11.1]. The flat profiles confirm that the long-channel device is free from short-channel non-idealities like channel length modulation or drain-induced barrier lowering, which would introduce a parasitic upward slope in saturation [10.3].

## 2. Spatial Mapping of Carrier Velocity Saturation

Loading the highest-bias dataset (`vg_3.0_nmos_output_des.tdr`) into Sentaurus Visual at $V_{DS} = 3.0\text{ V}$ confirms the presence of velocity saturation [11.1].

Mapping the `ElectronVelocity` magnitude along the inversion layer reveals that carrier velocity increases from the source edge toward the drain. Near the drain junction interface (X ≈ 12.0 μm), the local velocity values level off at a flat maximum boundary of $v_{\text{sat}} \approx 1.01 \times 10^7\text{ cm/s}$ [11.1].

This flat boundary marks the channel pinch-off point, where the high lateral electric field drives carriers to their theoretical velocity limit in silicon [11.1]. This distribution validates the integration of the high-field velocity models and demonstrates that the mesh structure provides the spatial resolution needed to capture complex multi-terminal high-field transport physics [11.1].

---
