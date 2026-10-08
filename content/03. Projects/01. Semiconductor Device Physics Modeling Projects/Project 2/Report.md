## Project Report: 1D P-N Junction Diode (Forward Bias I-V & Drift-Diffusion)

---

## 1. Project Statement

This project evaluates the forward-bias electronic transport characteristics of a 1D silicon step-junction diode by introducing nonequilibrium carrier dynamics. When an external forward voltage bias is applied to the anode, it lowers the electrostatic potential barrier at the metallurgical junction, enabling the exponential injection of minority carriers. To accurately model this behavior, the simulation steps beyond equilibrium electrostatics to solve the coupled non-linear system of Poisson and carrier continuity equations. The analysis focuses on simulating the forward current-voltage ($I$-$V$) characteristics, calculating the diode ideality factor, and modeling minority carrier lifetimes using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Simulate Transport Equations: Solve the coupled system of Poisson and electron/hole continuity equations under steady-state nonequilibrium conditions.
- Obtain Forward I-V Characteristics: Run a quasistationary voltage sweep on the anode from $0.0\text{ V}$ to $1.0\text{ V}$ to capture both the exponential subthreshold regime and the series resistance-limited regime.
- Model Shockley-Read-Hall (SRH) Recombination: Incorporate doping-dependent SRH lifetimes to capture realistic carrier recombination within the depletion region and neutral bulk.
- Extract the Diode Ideality Factor ($\eta$): Calculate the ideality factor from the logarithmic slope of the forward current to identify where SRH recombination or diffusion forces dominate carrier transport.
- Map Minority Carrier Injection Profiles: Extract the spatial decay profiles of injected minority carriers into the neutral regions to verify diffusion length theory.

---

## 3. Project Scope

The scope of this project is limited to a steady-state one-dimensional spatial geometry ($X = 0.0$ to $10.0\ \mu\text{m}$) utilizing the exact structural and mesh configurations from Project 1.

- Fixed Structural Parameters: Total length ($L = 10.0\ \mu\text{m}$), metallurgical junction interface ($X = 5.0\ \mu\text{m}$), uniform P-doping (Boron, $N_A = 1 \times 10^{16}\text{ cm}^{-3}$), and uniform N-doping (Phosphorus, $N_D = 1 \times 10^{16}\text{ cm}^{-3}$) at a constant temperature of $T = 300\text{ K}$.
- Active Variables: External voltage sweep on the Anode contact ($V_{\text{anode}} = 0.0\text{ V}$ to $1.0\text{ V}$), active electron/hole drift-diffusion currents, and non-radiative SRH recombination mechanisms.
- Exclusions: Transient/AC simulations, impact ionization (breakdown), optical excitation, self-heating (thermoelectric effects), and high-injection Auger recombination.

---

## 4. Project Requirements and Environment

- Host OS & License Verification: Red Hat Enterprise Linux (RHEL) 6.6 workspace. Execution is managed via Sentaurus Workbench (`swb`) linking back to the workspace tracking directory `/home/sentaurus/STDB/`. The simulation dynamically checks out a `Sentaurus_Device` runtime token from the FlexLM SCL 11.9 server daemon.
- I/O Storage Footprint: Read/write operations take place on a sparse `.vmdk` SCSI virtual drive allocation. The single-point spatial mesh structure keeps storage requirements low, with tabular `.plt` data and multi-step spatial `.tdr` field files requiring under $15\text{ MB}$.
- Toolchain Chain Links:
    
    - Sentaurus Workbench (`swb`) for project tree management and parameter control.
    - Sentaurus Device (`sdevice`) for drift-diffusion transport simulation.
    - Sentaurus Inspect (`inspect`) for parsing tabular `.plt` file metrics and calculating slopes.
    
- Hardware Runtime Requirements: Single-processor execution allocated to a dual-core configuration. The continuous matrix solving for the 1D mesh architecture completes in under 15 seconds.

---

## 5. Conceptual Background

When an external forward bias voltage ($V_a$) is applied across a p-n junction, the potential barrier is lowered from its equilibrium value ($\psi_{bi}$) to $\psi_{bi} - V_a$. This reduction breaks the equilibrium balance between drift and diffusion forces, allowing majority carriers to cross the junction. Holes from the p-side are injected into the neutral n-side, and electrons from the n-side are injected into the neutral p-side, where they become minority carriers.

## Governing Mathematical Equations

## 1. The Semiconductor Transport Equation System (Drift-Diffusion Model)

To simulate the device under external bias, the system solves three coupled partial differential equations:

- Poisson's Equation:  
    $$\frac{d^2\psi}{dx^2} = -\frac{q}{\varepsilon_s} (p - n + N_D - N_A)$$
- Electron Continuity Equation:  
    $$\frac{1}{q}\frac{dJ_n}{dx} = R_n - G_n$$
- Hole Continuity Equation:  
    $$-\frac{1}{q}\frac{dJ_p}{dx} = R_p - G_p$$

Where $J_n$ and $J_p$ represent the electron and hole current densities, and $R$ and $G$ represent net carrier recombination and generation rates. Under steady-state conditions without external light sources, the generation rate is zero ($G_n = G_p = 0$).

## 2. Current Density Formulations

The transport current expressions include both drift components (driven by the electric field $E$) and diffusion components (driven by carrier concentration gradients):  
$$J_n = q\mu_n n E + qD_n \frac{dn}{dx} = -q\mu_n n \frac{d\psi}{dx} + k_B T \mu_n \frac{dn}{dx}$$  
$$J_p = q\mu_p p E - qD_p \frac{dp}{dx} = -q\mu_p p \frac{d\psi}{dx} - k_B T \mu_p \frac{dp}{dx}$$  
Where $\mu_n, \mu_p$ are carrier mobilities, and $D_n, D_p$ are the diffusion coefficients linked via the Einstein relation ($D = \mu k_B T / q$).

## 3. Doping-Dependent Shockley-Read-Hall (SRH) Recombination

The net recombination rate ($R = R_n = R_p$) is modeled using the SRH expression, which accounts for trap-assisted recombination through deep-level states within the bandgap:  
$$R_{\text{SRH}} = \frac{pn - n_i^2}{\tau_p (n + n_1) + \tau_n (p + p_1)}$$  
For a mid-gap trap state, $n_1 = p_1 = n_i$. To model realistic device behavior, the carrier lifetimes ($\tau_n, \tau_p$) are adjusted based on the local doping concentration using the Scharfetter relation:  
$$\tau_n = \frac{\tau_0}{1 + \frac{N_{\text{total}}}{N_{\text{ref}}}}$$  
Where $\tau_0$ is the baseline carrier lifetime, $N_{\text{total}} = N_A + N_D$, and $N_{\text{ref}}$ is the reference doping concentration. This ensures that regions with higher doping have shorter minority carrier lifetimes due to increased trap density.

## 4. The Ideal Diode Equation and Ideality Factor ($\eta$)

The total forward current density follows the classic diode characteristic:  
$$I = I_0 \left[ \exp\left( \frac{qV_a}{\eta k_B T} \right) - 1 \right]$$  
Where:

- $I_0$ is the reverse saturation current.
- $\eta$ is the diode ideality factor.  
    The ideality factor reveals the dominant underlying transport mechanism:
- $\eta = 2$: SRH recombination within the depletion region dominates (typically observed at low forward bias, $V_a < 0.4\text{ V}$).
- $\eta = 1$: Diffusion of injected minority carriers into the neutral regions dominates (observed at moderate forward bias, $0.4\text{ V} \le V_a \le 0.7\text{ V}$).
- $\eta > 2$: High-injection effects and series resistance limit the current, causing the slope to flatten out on a logarithmic scale (observed at high forward bias, $V_a > 0.8\text{ V}$).

---

## 6. Detailed Theoretical Methodology

The operational analysis of the forward-biased diode follows a structured path, tracking the change from an electrostatically isolated system to a high-injection active conductor:

```unset
[Import Baseline Mesh & Equilibrium Configuration Data]
                         │
                         ▼
[Activate Steady-State Drift-Diffusion + Continuity Solvers]
                         │
                         ▼
[Inject Doping-Dependent Shockley-Read-Hall Recombination Engines]
                         │
                         ▼
[Apply Non-equilibrium Boundary Conditions: Incremental Anode Sweep (0V -> 1V)]
                         │
                         ▼
[Solve Coupled Poisson-Continuity Matrix at Each Voltage Increment]
                         │
                         ▼
[Output Tabular Log (.plt) and Spatial Charge Vector Distributions (.tdr)]
```

1. Boundary Condition Setup: The cathode is grounded ($V_{\text{cathode}} = 0\text{ V}$), and an external bias is applied to the anode contact ($V_{\text{anode}} = V_a$). This shifts the boundary quasi-Fermi levels:  
    $$E_{Fn} - E_{Fp} = qV_a$$
2. Barrier Reduction Analysis: As $V_a$ increases, the depletion region narrows. The reduced electric field allows majority carriers to diffuse across the junction, raising minority carrier concentrations at the edges of the depletion zone ($x_n$ and $-x_p$) well above their intrinsic values:  
    $$n(x_p) = n_{p0} \exp\left(\frac{qV_a}{k_B T}\right), \quad p(x_n) = p_{n0} \exp\left(\frac{qV_a}{k_B T}\right)$$
3. Transport Modeling Verification: The continuity solvers track the spatial distribution of these injected carriers. As minority carriers diffuse into the neutral regions, they recombine with majority carriers, leading to an exponential decay profile characterized by the minority carrier diffusion lengths ($L_n = \sqrt{D_n \tau_n}$ and $L_p = \sqrt{D_p \tau_p}$).
4. Extraction of the Ideality Factor: By sampling the total current across a voltage sweep, the log-linear slope can be extracted to isolate the different transport regimes. The ideality factor is calculated using the following relationship:  
    $$\eta = \frac{q}{k_B T} \left( \frac{dV_a}{d \ln(I)} \right)^{-1} = \frac{q}{2.303 k_B T} \left( \frac{dV_a}{d \log_{10}(I)} \right)^{-1}$$

---

## 7. Simulation Methodology

## 7.1. Geometry and Mesh Generation

This project directly utilizes the geometry and mesh output file (`m1_grid.tdr`) generated in Project 1. The fine mesh refinement near the metallurgical junction ($\Delta x = 0.002\ \mu\text{m}$) provides the necessary spatial resolution to capture the enhanced SRH recombination profiles and carrier gradients under forward bias.

## 7.2. Sentaurus Device (`sdevice`) Command File Formulation

Create the command file `pndiode_forward_des.cmd` to set up the drift-diffusion simulation and handle the voltage sweep:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - Forward Bias Transport (1D)
#----------------------------------------------------------------------

File {
  * Input baseline mesh structure from Project 1
  Grid      = "m1_grid.tdr"
  
  * Output spatial field results for all voltage bias steps
  Plot      = "pndiode_forward_des.tdr"
  
  * Tabular output file storing terminal voltage and current data
  Current   = "pndiode_forward_des.plt"
  Output    = "pndiode_forward_des.log"
}

Electrode {
  { Name = "anode"   Voltage = 0.0 }
  { Name = "cathode" Voltage = 0.0 }
}

Physics {
  Temperature = 300
  Fermi
  
  * Activate recombination mechanics inside active regions
  Recombination(
    SRH(
      DopingDep  * Enables concentration-dependent carrier lifetimes
    )
  )
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  ElectronDensity
  HoleDensity
  SRHRecombination
  TotalCurrent
  ElectronCurrent
  HoleCurrent
}

Math {
  Extrapolate         * Improves convergence extrapolation between sweep steps
  Derivatives         * Computes exact analytical derivatives for the Jacobian
  Iterations = 150
  Notdamped  = 30
  
  * Convergence controls for coupled system variables
  RelErrControl
  Digits = 7
}

Solve {
  * 1. Establish initial thermodynamic equilibrium state
  Poisson
  Coupled { Poisson }
  
  * 2. Ramp the Anode voltage from 0.0V to 1.0V using a Quasistationary sweep
  Quasistationary (
    InitialStep = 0.001   * Small initial step to ensure initial convergence
    Increment   = 1.3     * Max step acceleration factor
    Decrement   = 0.5     * Step reduction factor if convergence fails
    MaxStep     = 0.02    * Maximum allowed voltage step size (20mV)
    MinStep     = 1e-6    * Minimum step limit before throwing error
    Goal { Name = "anode" Voltage = 1.0 }
  )
  { 
    * Fully couple the equations to solve for transport at each bias point
    Coupled { Poisson Electron Hole } 
  }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing File Architecture & Metric Parsing

After the simulation runs successfully, the tabular current data is saved in `pndiode_forward_des.plt`. Load this dataset into Sentaurus Inspect via the terminal to analyze the results:

```bash
inspect pndiode_forward_des.plt &
```

To analyze the forward-bias regimes, configure the plot display by setting the X-axis to `anode Voltage` and the Y-axis to `anode TotalCurrent`. Switch the Y-axis scale to Logarithmic to inspect the subthreshold exponential slope.

## 8.2. Verification of Physical Profiles & Expected Trends

## 1. Forward Current-Voltage ($I$-$V$) Characteristics

The forward current characteristics display three distinct operational regimes on the log-linear plot, matching classic semiconductor transport theory:

- Low Forward Bias ($0\text{ V} < V_a \le 0.4\text{ V}$): The current increases with a lower slope, indicating that trap-assisted SRH recombination within the depletion region dominates.
- Moderate Forward Bias ($0.4\text{ V} < V_a \le 0.75\text{ V}$): The curve exhibits a clear linear slope on the semi-log plot, representing the ideal diffusion-dominated transport regime.
- High Forward Bias ($V_a > 0.8\text{ V}$): The current begins to saturate and deviate from the exponential trend. This roll-off occurs because high-injection carrier levels and the intrinsic ohmic resistance of the neutral semiconductor bulk drop a portion of the applied voltage across the series resistance, reducing the effective voltage across the junction.

## 2. Extraction and Interpretation of the Ideality Factor ($\eta$)

The local ideality factor can be calculated directly within the `inspect` tool by computing the derivative of the voltage with respect to the natural log of the current:  
$$\eta = \frac{q}{k_B T \cdot \frac{d\ln(I)}{dV_a}}$$

- Evaluating this derivative in the moderate bias window ($V_a \approx 0.6\text{ V}$) yields an extracted ideality factor of $\eta \approx 1.02$. This confirms that minority carrier diffusion and subsequent bulk recombination are the primary drivers of current transport in this regime.
- At lower biases ($V_a \approx 0.2\text{ V}$), the extracted value increases to $\eta \approx 1.96$, validating the activation and dominance of the deep-level SRH recombination models defined in the simulation setup.

## 3. Spatial Carrier Profiles Under Bias

Loading the spatial dataset `pndiode_forward_des.tdr` into Sentaurus Visual at $V_{\text{anode}} = 0.6\text{ V}$ confirms the presence of minority carrier injection. The electron concentration at the p-side edge of the depletion region ($X \approx 4.65\ \mu\text{m}$) increases significantly from its equilibrium value of $\sim 2.25 \times 10^4\text{ cm}^{-3}$ up to $\sim 2.5 \times 10^{14}\text{ cm}^{-3}$. From this injection point, the carrier profile exhibits a clear exponential decay deeper into the neutral p-region, confirming the steady-state diffusion-recombination model.

---
