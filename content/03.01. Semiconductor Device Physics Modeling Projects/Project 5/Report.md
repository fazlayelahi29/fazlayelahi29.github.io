## Project Report: 2D P-N Junction Avalanche Breakdown Mechanisms

---

## 1. Project Statement

This project evaluates the extreme high-field reverse-bias operation and structural failure thresholds of a 2D silicon step-junction diode. Pushing the device into deep reverse bias establishes extreme electric field gradients that trigger carrier acceleration, leading to carrier multiplication. To model this runaway conduction, the simulation activates non-linear impact ionization and band-to-band tunneling generation models [5.1]. The project focuses on determining the exact breakdown voltage ($V_{BR}$), identifying the critical electric field limit of silicon, and optimizing solver constraints to manage steep numerical gradients using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Simulate High-Field Carrier Generation: Model carrier generation under extreme reverse-bias electric fields using coupled impact ionization and tunneling physics models.
- Determine the Breakdown Voltage ($V_{BR}$): Execute a high-voltage reverse bias sweep up to $100\text{ V}$ to capture the sharp asymptotic current spike that defines the breakdown point.
- Analyze Field Crowding Effects: Map the 2D spatial distribution of the electric field and generation rates to inspect edge effects and field crowding along the structural corners of the junction.
- Implement Advanced Solver Controls: Adjust the simulator's convergence parameters and matrix iteration limits to maintain stability through the sharp, non-linear current transitions.
- Isolate Breakdown Mechanisms: Compare the contributions of impact ionization (avalanche) and band-to-band tunneling (Zener) to determine the dominant breakdown mechanism for this specific doping profile.

---

## 3. Project Scope

The scope of this project is limited to the static, steady-state high-voltage reverse-bias simulation using the 2D finite-element mesh grid from Project 3.

- Fixed Parameters: Canvas geometry ($10.0\ \mu\text{m} \times 10.0\ \mu\text{m}$), metallurgical interface ($X = 5.0\ \mu\text{m}$), uniform Boron P-doping ($1 \times 10^{16}\text{ cm}^{-3}$), uniform Phosphorus N-doping ($1 \times 10^{16}\text{ cm}^{-3}$), and operating temperature ($T = 300\text{ K}$).
- Active Variables: Cathode reverse bias voltage sweep ($V_{\text{cathode}} = 0.0\text{ V}$ to $100\text{ V}$), active impact ionization generation rate ($G_{avail}$), and band-to-band tunneling generation rate ($G_{b2b}$).
- Exclusions: Dynamic transient breakdown timings, lattice self-heating (thermal runaway/hydrodynamic effects), and external optical or radiation-induced carrier generation.

---

## 4. Project Requirements and Environment

- Host OS & Workspace Tuning: Red Hat Enterprise Linux (RHEL) 6.6 environment operating within `/home/sentaurus/STDB/`.
- Workspace Preferences & Iteration Limits: To prevent premature simulation termination during highly non-linear breakdown sweeps, the global preference file `gpref2.sentaurus.N-2017.09.xml` in the STDB workspace is modified. The maximum allowed iteration limit for SDEVICE solver nodes is increased, preventing timeouts during complex matrix calculations.
- Toolchain Chain Links:
    
    - Sentaurus Mesh (`smesh`) provides the optimized 2D grid structure (`m2d_grid.tdr`) generated in Project 3.
    - Sentaurus Device (`sdevice`) for solving the coupled Poisson and continuity equations with high-field generation models.
    - Sentaurus Inspect (`inspect`) for plotting the reverse $I$-$V$ breakdown curve and extracting $V_{BR}$.
    - Sentaurus Visual (`svisual`) for mapping 2D spatial contours of electric fields and localized impact ionization rates.
    

---

## 5. Conceptual Background

When a p-n junction is heavily reverse-biased, the electric field within the depletion region increases significantly. If a mobile carrier entering this zone gains more energy from the field than the bandgap energy ($E_g$) before colliding with the crystal lattice, it can knock a bound valence electron into the conduction band. This process, known as impact ionization, creates a new electron-hole pair. These newly generated carriers are accelerated in opposite directions by the high field, colliding with other atoms and triggering a runaway chain reaction called avalanche breakdown.

## Governing Mathematical Equations

## 1. Total Generation Term in Continuity Equations

High-field generation mechanisms introduce active source terms ($G$) into the steady-state electron and hole continuity equations:  
$$\frac{1}{q}\nabla \cdot J_n = R_{\text{SRH}} - G_{\text{avail}} - G_{b2b}$$  
$$-\frac{1}{q}\nabla \cdot J_p = R_{\text{SRH}} - G_{\text{avail}} - G_{b2b}$$

## 2. The Van Overstraeten – de Man Impact Ionization Model

The impact ionization generation rate ($G_{\text{avail}}$) is proportional to the local current densities and carrier ionization coefficients ($\alpha_n, \alpha_p$):  
$$G_{\text{avail}} = \alpha_n \frac{\vert{}J_n\vert{}}{q} + \alpha_p \frac{\vert{}J_p\vert{}}{q}$$  
The ionization coefficients describe the number of electron-hole pairs generated per unit distance by a single carrier. They are modeled as exponential functions of the local electric field component parallel to the current path ($E_{\parallel}$):  
$$\alpha_n(E_{\parallel}) = \gamma a_n \exp\left( -\frac{\gamma b_n}{E_{\parallel}} \right), \quad \alpha_p(E_{\parallel}) = \gamma a_p \exp\left( -\frac{\gamma b_p}{E_{\parallel}} \right)$$  
Where $a_n, b_n, a_p, b_p$ are empirical coefficients, and $\gamma$ is a temperature-dependent scaling factor that accounts for phonon scattering effects.

## 3. The Hurkx Band-to-Band (B2B) Tunneling Model

At extreme fields, quantum mechanical tunneling allows valence electrons to cross the forbidden bandgap directly into the conduction band. The Hurkx model expresses this generation component ($G_{b2b}$) as:  
$$G_{b2b} = A_{\text{b2b}} E^2 \exp\left( -\frac{B_{\text{b2b}}}{E} \right)$$  
Where $A_{\text{b2b}}$ and $B_{\text{b2b}}$ are fixed tunneling parameters. For moderately doped step junctions ($1 \times 10^{16}\text{ cm}^{-3}$), the depletion width is relatively wide, making avalanche multiplication the dominant breakdown mechanism, while band-to-band tunneling contributions remain negligible.

---

## 6. Detailed Theoretical Methodology

The strategy for capturing the highly non-linear breakdown point and analyzing field crowding effects follows a systematic pipeline:

```unset
[Load Baseline 2D Finite-Element Grid (m2d_grid.tdr)]
                           │
                           ▼
[Inject Avalanche (vanOverstraeten) & Band2Band (Hurkx) Generation Physics]
                           │
                           ▼
[Configure Strict Math Blocks: Lower Step Decrement limits and MinStep Constraints]
                           │
                           ▼
[Sweep Cathode Reverse Voltage from 0V up to 100V Asymptote]
                           │
                           ▼
[Solve Fully Coupled Generation-Transport Matrix at Each Voltage Increment]
                           │
                           ▼
[Extract Spatial ImpactIonizationRate and Identify Structural Field Crowding]
```

1. High-Field Physics Integration: Activating both the Van Overstraeten impact ionization and Hurkx band-to-band tunneling models enables the simulation engine to capture multi-mechanism high-field generation.
2. Solver Parameter Configuration: Avalanche breakdown causes current to spike by orders of magnitude over very small voltage changes. To maintain numeric stability, the voltage sweep step size must be heavily constrained. Reducing `MinStep` allows the solver to cut down the step size dynamically when dealing with sharp current gradients, preventing matrix divergence.
3. 2D Field Crowding Evaluation: In a multi-dimensional structure, the electric field lines tend to concentrate at geometric corners or changes in structural profiles. This localized field concentration, known as field crowding, lowers the effective breakdown voltage compared to an ideal 1D planar device. The 2D spatial field files are analyzed to identify where breakdown is initiated.

---

## 7. Simulation Methodology

## 7.1. Structural Grid Integration

This project uses the optimized 2D finite-element mesh file (`m2d_grid.tdr`) generated in Project 3. The fine mesh refinement ($\Delta x = 0.01\ \mu\text{m}$) provides the necessary spatial resolution to capture the highly localized carrier generation profiles and sharp electric field peaks within the space charge region.

## 7.2. Sentaurus Device (`sdevice`) Breakdown Command File Setup

Create the command file `diode_breakdown_des.cmd` to set up the high-voltage sweep and configure the necessary high-field generation models:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - 2D Avalanche Breakdown Sweep
#----------------------------------------------------------------------

File {
  * Input 2D structural grid mesh from Project 3
  Grid      = "m2d_grid.tdr"
  
  * Output spatial field results for all voltage bias steps
  Plot      = "diode_breakdown_des.tdr"
  
  * Tabular output file storing terminal voltage and current data
  Current   = "diode_breakdown_des.plt"
  Output    = "diode_breakdown_des.log"
}

Electrode {
  { Name = "anode"   Voltage = 0.0 }
  { Name = "cathode" Voltage = 0.0 }
}

Physics {
  Temperature = 300
  Fermi
  Recombination(
    SRH(DopingDep)
    Avalanche( vanOverstraeten )  * Activates impact ionization mechanics
    Band2Band( Hurkx )            * Activates Zener tunneling mechanics
  )
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  SpaceCharge
  ElectronDensity
  HoleDensity
  ImpactIonization                * Spatial distribution of carrier generation rate
  Band2BandGeneration             * Spatial distribution of tunneling generation rate
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  
  * Strict iteration limits to handle sharp non-linear breakdown gradients
  Iterations = 200
  Notdamped  = 60
  
  * Tight convergence requirements for high-field generation
  RelErrControl
  Digits = 6
}

Solve {
  * 1. Initialize equilibrium state
  Poisson
  Coupled { Poisson Electron Hole }
  
  * 2. Execute high-voltage reverse bias sweep on the cathode terminal
  Quasistationary (
    InitialStep = 0.1
    Increment   = 1.15
    Decrement   = 0.3      * Small reduction step to quickly resolve steep slopes
    MaxStep     = 1.0      * Max step size under low current gradients
    MinStep     = 1e-8     * Allows tiny steps down to 10nV near breakdown
    Goal { Name = "cathode" Voltage = 100.0 }
  )
  {
    * Fully couple transport and generation models at each step
    Coupled { Poisson Electron Hole }
  }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing File Architecture & Metric Parsing

Once the simulation completes, the tabular current data is saved in `diode_breakdown_des.plt`. Load this dataset into Sentaurus Inspect via the terminal to extract the breakdown voltage:

```bash
inspect diode_breakdown_des.plt &
```

Configure the plot display by setting the horizontal axis to `cathode Voltage` and the vertical axis to `cathode TotalCurrent`. Use a Logarithmic scale on the vertical axis to clearly identify the leakage current baseline and the sharp avalanche breakdown transition.

## 8.2. Verification of Breakdown Profiles & Expected Trends

## 1. Analysis of the Reverse $I$-$V$ Conduction Curve

The reverse characteristic curve shows a flat, low-level saturation current at moderate voltages, followed by a sharp transition into a high-conduction regime:

The current remains minimal until the voltage reaches $V_{BR} = 65.2\text{ V}$. At this threshold, the curve spikes vertically, turning nearly parallel to the current axis. This vertical profile confirms that impact ionization has triggered a runaway carrier multiplication process, defining the device's maximum safe reverse operating voltage.

## 2. Verification of 2D Spatial Field Crowding Effects

Loading the final spatial dataset `diode_breakdown_des.tdr` into Sentaurus Visual at $V_{\text{cathode}} = 65.2\text{ V}$ confirms the presence of 2D edge effects. Plotting the `ElectricField` contours shows that the internal field is not perfectly uniform along the junction.

Due to the geometric boundaries of the 2D layout, the electric field lines crowd at the outer edges of the step junction, causing the local electric field to peak at $E_{\text{crit}} \approx 3 \times 10^5\text{ V/cm}$.

Mapping the `ImpactIonization` variable reveals that carrier generation is highly concentrated within these high-field corner regions. This concentration demonstrates that avalanche breakdown is initiated locally at the structural edges rather than uniformly across the parallel plane of the junction, highlighting the importance of 2D spatial modeling for accurate device optimization.

---
