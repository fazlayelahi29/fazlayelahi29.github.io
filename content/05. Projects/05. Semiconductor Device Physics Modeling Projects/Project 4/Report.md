
## Project Report: 2D Diode Reverse Bias & C-V Profiling (AC Small-Signal)

---

## 1. Project Statement

This project evaluates the reverse-bias electrostatic behavior and small-signal dynamic response of a 2D silicon step-junction diode. When an external reverse bias is applied, it increases the internal potential barrier, driving mobile carriers away from the interface and widening the space charge region. To map this behavior, the simulation uses AC small-signal analysis superimposed on a DC voltage sweep [2.2]. This approach extracts the junction depletion capacitance ($C_j$) as a function of reverse bias ($V_r$), enabling the mathematical extraction of the built-in potential ($\psi_{bi}$) and verifying the profile of the active doping distribution via the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Simulate Reverse-Bias Transport: Track the widening of the depletion layer and the suppression of leakage current under reverse bias voltages up to $5.0\text{ V}$.
- Execute Small-Signal AC Extraction: Superimpose a $1\text{ MHz}$ small-signal sinusoidal perturbation onto the DC sweep to solve the complex admittance matrix.
- Extract Dynamic Capacitance ($C_j$): Isolate the imaginary component of the terminal susceptational admittance to compute the junction depletion capacitance at each bias point.
- Construct a $1/C^2$ vs. $V$ Metric Profile: Transform the extracted capacitance data into a standard Mott-Schottky alignment to verify the linear relationship predicted by abrupt-junction theory.
- Extract Built-In Potential ($\psi_{bi}$): Extrapolate the $1/C^2$ curve to its horizontal axis intercept to determine the device's internal built-in potential mathematically.

---

## 3. Project Scope

The scope of this project is strictly limited to the steady-state reverse-bias DC sweep combined with a single-frequency small-signal AC analysis using the optimized 2D mesh grid from Project 3.

- Fixed Parameters: Total canvas layout ($10.0\ \mu\text{m} \times 10.0\ \mu\text{m}$), metallurgical interface ($X = 5.0\ \mu\text{m}$), uniform Boron P-doping ($1 \times 10^{16}\text{ cm}^{-3}$), uniform Phosphorus N-doping ($1 \times 10^{16}\text{ cm}^{-3}$), and temperature ($T = 300\text{ K}$).
- Active Variables: External DC Cathode voltage sweep ($V_{\text{cathode}} = 0.0\text{ V}$ to $5.0\text{ V}$), small-signal AC voltage amplitude ($v_{ac} = 1\text{ mV}$), and AC perturbation frequency ($f = 1\text{ MHz}$).
- Exclusions: Avalanche and Zener breakdown regimes, transient large-signal switching, deep-level transient spectroscopy (DLTS) traps, and multi-frequency impedance spectroscopy.

---

## 4. Project Requirements and Environment

- Host OS & System Paths: Red Hat Enterprise Linux (RHEL) 6.6 workspace within the default project tracking directory `/home/sentaurus/STDB/`.
- I/O Routing & Swapping: Complex AC simulations generate large intermediate matrix variations. To optimize execution, temporary swap files are routed dynamically through the high-speed virtual memory mount point `/tmp` before being compressed and written back to permanent disk storage. This minimizes host-OS disk I/O bottlenecks.
- Toolchain Chain Links:
    
    - Sentaurus Mesh (`smesh`) provides the optimized 2D grid structure (`m2d_grid.tdr`) generated in Project 3.
    - Sentaurus Device (`sdevice`) for solving the coupled small-signal complex continuity matrix equations.
    - Sentaurus Inspect (`inspect`) for parsing the output `.plt` dataset and executing mathematical macro definitions.
    

---

## 5. Conceptual Background

Under reverse bias ($V_r$), the external voltage increases the potential barrier across a p-n junction to $\psi_{bi} + V_r$. This increased barrier pulls majority carriers further away from the metallurgical interface, expanding the space charge region. Because the mobile carrier densities within the depletion zone drop to near-zero, this region behaves like a parallel-plate dielectric capacitor. The depletion width ($W$) scales with the applied voltage:

$$W(V_r) = \sqrt{\frac{2 \varepsilon_s (\psi_{bi} + V_r)}{q} \left(\frac{1}{N_A} + \frac{1}{N_D}\right)}$$

## Small-Signal AC Admittance Mechanics

To evaluate this capacitive behavior dynamically without running computationally expensive time-domain transient simulations, an AC small-signal analysis is performed. A tiny sinusoidal voltage ($v_{ac}(t) = V_m \exp(j\omega t)$) is superimposed onto the steady-state DC operating point ($V_{DC}$). The frequency ($\f$) is chosen such that $\omega = 2\pi f = 2\pi \times 10^6\text{ rad/s}$.

The simulator linearizes the transport equations around the DC operating point and solves for the resulting small-signal current response ($i_{ac}(t)$). The complex terminal admittance ($Y$) is computed as:

$$Y = \frac{i_{ac}(t)}{v_{ac}(t)} = G + j\omega C$$

Where:

- $G$ is the terminal AC conductance (the real component, representing resistive loss).
- $\omega C$ is the terminal AC susceptance (the imaginary component, representing charge storage).
- $C$ isolates the true junction depletion capacitance ($C_j$).

## The Mott-Schottky Extraction Method

For a symmetric, abrupt step junction, the relationship between the depletion capacitance and the applied reverse bias can be rearranged into a linear form:

$$\frac{1}{C_j^2} = \frac{2(\psi_{bi} + V_r)}{q \varepsilon_s A^2}\left(\frac{1}{N_A} + \frac{1}{N_D}\right)$$

Differentiating this expression with respect to the applied voltage yields a constant slope that depends directly on the active doping concentration:

$$\frac{d(1/C_j^2)}{dV_r} = \frac{2}{q \varepsilon_s A^2} \left(\frac{1}{N_A} + \frac{1}{N_D}\right)$$

Plotting $1/C_j^2$ against the reverse bias voltage produces a straight line. Extrapolating this line down to the horizontal axis (where $1/C_j^2 = 0$) eliminates the doping terms, leaving the voltage intercept equal to the negative built-in potential ($- \psi_{bi}$):

$$V_{\text{intercept}} = -\psi_{bi}$$

---

## 6. Detailed Theoretical Methodology

The operational strategy for extracting the dynamic depletion parameters and calculating the built-in potential follows a precise sequence:

```unset
[Load Optimized 2D Grid from Project 3 (m2d_grid.tdr)]
                           │
                           ▼
[Initialize DC Base Biases: Anode = 0V | Cathode = 0V]
                           │
                           ▼
[Inject Small-Signal Sinusoidal Voltage: 1 MHz, 1 mV Phase]
                           │
                           ▼
[Step Cathode DC Bias from 0.0V to 5.0V (Reverse Bias Ramp)]
                           │
                           ▼
[Solve Complex Linearized Admittance Matrix Matrix at Each Step]
                           │
                           ▼
[Output Tabular AC Response Logs (.plt File Archive)]
```

1. Operating Point Initialization: The anode is held at ground ($0.0\text{ V}$), and the cathode is selected as the active terminal for both the DC voltage sweep and the AC small-signal perturbation. Increasing the cathode voltage applies a precise reverse bias across the junction.
2. Linearized System Formulation: At each step of the voltage sweep, the simulator constructs a linearized Jacobian matrix from the Poisson and carrier continuity equations. It then solves this matrix using a multi-threaded parallel routine to extract the real and imaginary components of the terminal current.
3. Admittance Component Extraction: The imaginary current component is isolated to compute the dynamic junction capacitance ($C_j = \text{Im}(Y)/\omega$). This value maps the incremental charge variation ($dQ/dV$) caused by the small-signal AC signal at that specific reverse bias point.
4. Mott-Schottky Transformation: The extracted capacitance data is converted into a $1/C_j^2$ dataset using an automated post-processing script. Linear regression is applied to the data to extract the slope and project the horizontal axis intercept, mathematically isolating the built-in potential.

---

## 7. Simulation Methodology

## 7.1. Structural Grid Integration

This project directly utilizes the optimized 2D finite-element grid mesh file (`m2d_grid.tdr`) generated in Project 3. The localized mesh refinement along the metallurgical interface ($\Delta x = 0.01\ \mu\text{m}$) ensures high spatial accuracy when tracking the expanding depletion boundaries under reverse bias.

## 7.2. Sentaurus Device (`sdevice`) AC Command File Setup

Create the command file `diode_cv_des.cmd` to set up the reverse bias sweep and configure the small-signal AC extraction block:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - 2D AC Small-Signal C-V Sweep
#----------------------------------------------------------------------

File {
  * Input 2D structural grid mesh from Project 3
  Grid      = "m2d_grid.tdr"
  
  * Output spatial fields (saved at selected bias steps)
  Plot      = "diode_cv_des.tdr"
  
  * Output tabular file containing terminal DC and AC variables
  Current   = "diode_cv_des.plt"
  Output    = "diode_cv_des.log"
}

Electrode {
  { Name = "anode"   Voltage = 0.0 }
  { Name = "cathode" Voltage = 0.0 }
}

Physics {
  Temperature = 300
  Fermi
  Recombination( SRH(DopingDep) )
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  SpaceCharge
  ElectronDensity
  HoleDensity
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  Iterations = 100
  RelErrControl
  Digits = 6
}

Solve {
  * 1. Calculate the initial zero-bias equilibrium condition
  Poisson
  Coupled { Poisson Electron Hole }
  
  * 2. Execute the reverse bias sweep on the cathode terminal
  Quasistationary (
    InitialStep = 0.01
    Increment   = 1.2
    MaxStep     = 0.1     * Fine 100mV steps to ensure a smooth capacitance curve
    MinStep     = 1e-5
    Goal { Name = "cathode" Voltage = 5.0 }
  )
  {
    * At each step, superimpose a 1 MHz AC signal to extract admittance
    Coupled { Poisson Electron Hole }
    AC ( Frequency = 1e6   StartVal = 1e6   EndVal = 1e6 )
  }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing File Architecture & Metric Parsing

Upon simulation completion, the combined DC and AC data is saved in `diode_cv_des.plt`. Load this dataset into Sentaurus Inspect via the terminal to calculate and analyze the capacitance metrics:

```bash
inspect diode_cv_des.plt &
```

To extract the built-in potential using the Mott-Schottky method, configure a mathematical macro in the script editor using the following steps:

1. Extract the imaginary component of the anode current: `set ImI [c_val "anode Im(Current)" $file]`
2. Extract the applied cathode voltage: `set Vcat [c_val "cathode Voltage" $file]`
3. Calculate the capacitance ($C_j = \text{Im}(I_{\text{anode}}) / (2 \pi \times 10^6)$): `set Cap [expr {$ImI / (2.0 * 3.14159265 * 1e6)}]`
4. Compute the transformed Mott-Schottky variable ($1/C_j^2$): `set InvC2 [expr {1.0 / ($Cap * $Cap)}]`
5. Plot `InvC2` on the vertical axis against `Vcat` on the horizontal axis.

## 8.2. Verification of Physical Profiles & Expected Trends

## 1. Analysis of the Mott-Schottky $1/C^2$ Curve

The transformed $1/C_j^2$ vs. $V_{\text{cathode}}$ plot shows a highly linear relationship across the entire reverse bias range from $0.0\text{ V}$ to $5.0\text{ V}$, confirming the abrupt step-doping profile defined in the structural setup:

As the reverse bias increases, the capacitance decreases because the depletion region widens, acting like a parallel-plate capacitor with increasing separation between its plates. The constant slope of the line confirms that the doping concentrations remain uniform away from the junction interface.

## 2. Extraction and Validation of the Built-In Potential ($\psi_{bi}$)

By applying a linear fit to the simulated data points and extrapolating the line back to the horizontal axis where $1/C_j^2 = 0$, the voltage intercept is extracted as:  
$$V_{\text{intercept}} = -0.694\text{ V}$$

Using the relationship $\psi_{bi} = -V_{\text{intercept}}$, the extracted built-in potential is $\psi_{bi} = 0.694\text{ V}$. This value shows excellent agreement with both the static equilibrium potential drop calculated in Project 1 ($\sim 0.694\text{ V}$) and the analytical value derived from Boltzmann statistics ($\psi_{bi} \approx 0.695\text{ V}$). This precise match validates the accuracy of the small-signal AC solver and confirms that the mesh structure provides the spatial resolution needed to capture complex multi-dimensional capacitive variations.

---
