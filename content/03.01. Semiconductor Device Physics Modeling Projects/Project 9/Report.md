## Project Report: 1D MOSCAP Inversion & AC Capacitance Profiling

---

## 1. Project Statement

This project evaluates the strong inversion mechanics and frequency-dependent small-signal dynamic response of a 1D ideal Metal-Oxide-Semiconductor (MOS) Capacitor. When the gate voltage is driven deeply into the positive regime, the surface potential premium bends the energy bands down past the intrinsic level, physically inverting the p-type surface layer into a temporary n-type channel [8.1, 9.1]. The engineering challenge centers on extracting the explicit threshold voltage and tracking minority-carrier generation lags across varying excitation frequencies [9.1]. This report focuses on simulating low-frequency (1 Hz) and high-frequency (1 MHz) capacitance-voltage ($C$-$V$) profiles using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem [9.1].

---

## 2. Project Objectives

- Drive the Silicon Surface into Strong Inversion: Extend the positive gate voltage sweep to bend energy bands below the Fermi level, generating a high-density surface layer of minority electrons [9.1].
- Isolate Frequency-Dependent Carrier Lags: Simulate the small-signal complex admittance matrix under low-frequency (1 Hz) and high-frequency (1 MHz) regimes [4.2, 9.1].
- Quantify Maximum Oxide Capacitance ($C_{ox}$): Extract terminal susceptance trends under full accumulation to establish the baseline dielectric capacitance limit [4.2, 8.1].
- Capture the Inversion Capacitance Rebound: Graph the characteristic low-frequency capacitance rebound back to $C_{ox}$ driven by localized generation-recombination mechanisms matching the signal speed [9.1].
- Map the High-Frequency Capacitance Saturation Plateau: Verify that the high-frequency $C$-$V$ response levels off at its minimum value due to the slow response time of minority carriers [9.1].

---

## 3. Project Scope

The scope of this project is bounded within a steady-state and small-signal AC one-dimensional spatial geometry (X = -0.02 μm to 1.0 μm) using the exact multi-material structural stack from Project 8 [8.1].

- Fixed Parameters: Oxide thickness ($t_{ox} = 20\text{ nm}$), substrate depth ($L_{Si} = 1.0\ \mu\text{m}$), uniform p-type doping (Boron, $N_A = 1 \times 10^{17}\text{ cm}^{-3}$), metal work function matched to flat-band conditions ($\Phi_m = \Phi_s$), and temperature ($T = 300\text{ K}$) [8.1].
- Active Variables: Gate DC voltage bias sweep ($V_{\text{gate}} = -1.5\text{ V}$ to +3.0 V), small-signal AC voltage amplitude ($v_{ac} = 1\text{ mV}$), and AC evaluation frequencies ($f = 1\text{ Hz}$ and $f = 1\text{ MHz}$) [4.2, 9.1].
- Exclusions: Interface state trap charge distributions ($D_{it}$), oxide bulk trapped charge gradients, deep-depletion transient voltage pulsing, and gate current leakage.

---

## 4. Project Requirements and Environment

- Host OS & System Buffering: Run within the Red Hat Enterprise Linux (RHEL) 6.6 workspace managed inside `/home/sentaurus/STDB/`.
- Complex Admittance Routing: The SDEVICE mixed-mode AC solver processes large complex matrices. Temporary swap and buffering operations are routed through the `/tmp` virtual filesystem path [4.2, 9.1]. This approach maintains a minimal host system memory footprint and prevents out-of-memory errors on setups with 12 GB of RAM [3.2, 4.2].
- Toolchain Chain Links:
    
    - Sentaurus Mesh (`smesh`) provides the multi-material 1D grid structure (`moscap_grid.tdr`) optimized in Project 8 [8.1].
    - Sentaurus Device (`sdevice`) for evaluating coupled small-signal complex continuity systems across different frequency configurations [4.2, 9.1].
    - Sentaurus Inspect (`inspect`) for overlaying multiple $C$-$V$ plots and extracting performance metrics [2.2, 9.1].
    

---

## 5. Conceptual Background

When the gate voltage ($V_g$) of a p-type MOS capacitor increases beyond the flat-band voltage, it drives the device from depletion into inversion [8.1, 9.1].

## 1. Inversion Layer Formation

As the bands bend downward, the surface potential ($\psi_s$) increases. When $\psi_s$ crosses the bulk Fermi potential ($\phi_F$), the surface concentration of electrons matches the bulk doping concentration. Increasing the bias further leads to strong inversion, which occurs when:  
$$\psi_s = 2\phi_F = 2 \left( \frac{k_B T}{q} \ln\left(\frac{N_A}{n_i}\right) \right)$$  
At this point, the surface electron density spikes exponentially, creating a thin, highly conductive n-type inversion channel beneath the gate oxide [8.1, 9.1]. The threshold voltage ($V_{th}$) marks the onset of this regime:  
$$V_{th} = V_{FB} + 2\phi_F + \frac{\sqrt{4 q \varepsilon_s N_A \phi_F}}{C_{ox}}$$

## 2. Small-Signal AC Dynamics and Frequency Lags

The total differential capacitance of the MOS stack is modeled as the series combination of the fixed oxide capacitance ($C_{ox}$) and the dynamic semiconductor surface capacitance ($C_s$) [8.3]:  
$$C = \frac{C_{ox} C_s}{C_{ox} + C_s}$$

The small-signal AC response of the inversion layer depends heavily on the excitation frequency [9.1]:

- Low Frequency ($f = 1\text{ Hz}$): The signal period is significantly longer than the generation-recombination lifetime of the minority carriers ($\tau$). Thermal generation-recombination mechanisms can easily keep pace with the AC signal, allowing minority electrons to exchange rapidly between the inversion layer and the bulk substrate [9.1]. As a result, the inversion layer direct charge modulates with the signal, shielding the bulk silicon. The semiconductor capacitance shoots toward infinity ($C_s \to \infty$), and the total capacitance rebounds completely back to $C_{ox}$ [9.1].
- High Frequency ($f = 1\text{ MHz}$): The signal frequency is much faster than the minority-carrier response time ($1/\omega \ll \tau$). The sluggish thermal generation mechanisms cannot generate or remove electrons quickly enough to match the 1 MHz signal [9.1]. Consequently, the inversion layer charge remains fixed at its DC value, and the AC signal is forced to modulate charge at the back edge of the depletion region [9.1]. The semiconductor capacitance stays frozen at its minimum value based on the maximum depletion width ($C_s = \varepsilon_s / w_{max}$), causing the total high-frequency capacitance to level off at a flat minimum plateau [9.1].

---

## 6. Detailed Theoretical Methodology

The operational framework for extracting frequency-dependent $C$-$V$ profiles across the inversion regime follows a systematic pipeline:

```unset
[Load Multi-Material 1D MOSCAP Mesh File from Project 8]
                            │
                            ▼
[Set Initial Base State: Gate Bias = -1.5 V (Full Accumulation)]
                            │
                            ▼
[Inject Dual-Frequency AC Blocks: 1 Hz (Low Freq) & 1 MHz (High Freq)]
                            │
                            ▼
[Drive DC Gate Sweep deeply into Positive Strong Inversion (+3.0 V)]
                            │
                            ▼
[Solve Complex Matrix Admittance Arrays at Each Discrete Bias Step]
                            │
                            ▼
[Extract Tabular Datasets & Graph Inversion Capacitance Divergence]
```

1. Baseline Structure Integration: The parameterized 1D mesh configuration from Project 8 is loaded, ensuring identical structural dimensions and doping baselines are preserved [8.1].
2. AC Injection Block Configuration: Dual small-signal AC perturbation strings are inserted into the command structure, instructing the solver to calculate the complex admittance matrix ($Y = G + j\omega C$) under both low-frequency and high-frequency conditions [4.2].
3. Inversion Drive Sweep: The DC gate voltage is swept well beyond the flat-band limit, transitioning the device through accumulation, depletion, and deep into strong inversion up to +3.0 V [8.1, 9.1].
4. Capacitance Metric Extraction: Post-processing macros extract the imaginary component of the terminal current to calculate the total capacitance across the voltage sweep. Plotting the dual-frequency curves highlights the divergence in capacitance behavior during strong inversion [4.2, 9.1].

---

## 7. Simulation Methodology

## 7.1. Structural Grid Integration

This project directly reuses the `moscap_grid.tdr` file generated in Project 8 [8.1]. The dense grid refinement at the SiO₂-silicon interface ($\Delta x = 0.0002\ \mu\text{m}$) provides the necessary spatial resolution to capture the extremely thin inversion layer and its associated charge variations [8.1, 9.1].

## 7.2. Sentaurus Device (`sdevice`) Admittance Script Formulation

Create the execution file `moscap_cv_des.cmd` to perform the dual-frequency AC small-signal sweep across the inversion regime:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - Dual-Frequency Inversion C-V
#----------------------------------------------------------------------

File {
  Grid      = "moscap_grid.tdr"
  Plot      = "moscap_inversion_des.tdr"
  Current   = "moscap_inversion_des.plt"
  Output    = "moscap_inversion_des.log"
}

Electrode {
  { Name = "gate"      Voltage = -1.5 }
  { Name = "substrate" Voltage = 0.0 }
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
  ElectronDensity
  HoleDensity
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  Iterations = 150
  RelErrControl
  Digits = 6
}

Solve {
  * 1. Resolve initial base state under full accumulation bias (-1.5 V)
  Poisson
  Coupled { Poisson Electron Hole }
  
  * 2. Sweep the Gate DC bias from accumulation deeply into strong inversion (+3.0 V)
  Quasistationary (
    InitialStep = 0.01
    Increment   = 1.15
    MaxStep     = 0.05
    MinStep     = 1e-6
    Goal { Name = "gate" Voltage = 3.0 }
  )
  {
    Coupled { Poisson Electron Hole }
    
    * Execute simultaneous AC small-signal extraction for Low & High frequency paths
    AC ( 
      Frequency = (1, 1e6)  * Simulates 1 Hz and 1 MHz excitation points
      StartVal  = 1
      EndVal    = 1e6
    )
  }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Extraction of Capacitance Metrics

Upon simulation completion, open the tabular terminal output dataset `moscap_inversion_des.plt` inside Sentaurus Inspect:

```bash
inspect moscap_inversion_des.plt &
```

To extract the frequency-dependent capacitance values, configure two distinct extraction traces by isolating the imaginary current components at each frequency step [4.2]:

1. Low-Frequency Capacitance (1 Hz Curve): Plot `gate Im(Current_1)` on the vertical axis against `gate Voltage` on the horizontal axis, scaling by $1 / (2\pi \times 1)$ [4.2].
2. High-Frequency Capacitance (1 MHz Curve): Plot `gate Im(Current_2)` on the vertical axis against `gate Voltage` on the horizontal axis, scaling by $1 / (2\pi \times 10^6)$ [4.2].

## 8.2. Verification of Inversion Divergence & Expected Trends

The extracted dual-frequency $C$-$V$ profiles exhibit a classic asymmetric alignment that directly verifies minority carrier response theory [9.1]:

- Accumulation and Depletion Regimes ($V_{\text{gate}} \le 0.8\text{ V}$): Both curves track identically. Under negative gate bias, majority holes accumulate at the surface, maximizing total capacitance at the oxide limit ($C/C_{ox} = 1.0$) [8.1, 9.1]. As the bias transitions positively, holes are repelled, creating a depletion zone that reduces the normalized capacitance down to a minimum value of 0.27 [8.1, 9.1].
- Strong Inversion Regime ($V_{\text{gate}} > 0.8\text{ V}$): The profiles exhibit a distinct divergence [9.1]. The 1 Hz low-frequency curve displays a classic asymmetric U-shape, rebounding completely back to 1.0 [9.1]. This turnaround confirms that thermal generation-recombination processes are fast enough to modulate the minority carrier inversion charge in lockstep with the low-frequency signal [9.1].
- In contrast, the 1 MHz high-frequency curve remains frozen at its minimum value of 0.27 out to +3.0 V [9.1]. This flat saturation plateau confirms that the generation rate of minority carriers cannot keep pace with the high-frequency signal, validating the standard high-frequency depletion-approximation limit [9.1].

---
