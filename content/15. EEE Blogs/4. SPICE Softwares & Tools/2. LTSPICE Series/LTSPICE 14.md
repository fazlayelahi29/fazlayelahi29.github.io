# Advanced Signal Integrity and Electromagnetic Compatibility in LTspice: A Comprehensive RF Engineering Analysis

## Introduction

In the contemporary landscape of high-speed digital and radio-frequency (RF) engineering, the demarcation between digital logic and microwave engineering has entirely dissolved. As data rates scale relentlessly into the multi-gigabit-per-second (Gbps) regime and digital edge rates compress into the picosecond domain, the physical interconnects transporting these signals cease to function as ideal, equipotential nodes. Instead, they behave as complex, distributed-element waveguides governed strictly by Maxwellian electromagnetics. The accurate simulation of these physical behaviors—encompassing transmission line wave propagation, frequency-dependent dielectric losses, interconnect cross-talk, power delivery network (PDN) anti-resonance, and parasitic electromagnetic interference (EMI)—is paramount for ensuring signal integrity (SI) and electromagnetic compatibility (EMC) prior to hardware fabrication.

This comprehensive research report provides an exhaustive, expert-level analysis of utilizing LTspice to conquer the most formidable challenges in high-speed design. While LTspice is conventionally recognized for its prowess in switched-mode power supply simulation, its underlying transient engine, when augmented with sophisticated SPICE directives and field-solver-derived S-parameters, represents a highly capable environment for RF and SI analysis. This document systematically dissects the theoretical foundations and practical methodologies required to model transmission line theory, mathematically convolute S-parameter matrices into the time domain, synthesize ultra-realistic PCB geometries, and rigorously evaluate systems against stringent regulatory constraints, such as those mandated by the Bangladesh Telecommunication Regulatory Commission (BTRC). By establishing a rigorous framework of advanced SPICE modeling techniques, this analysis equips the RF and SI engineer with the theoretical depth and practical syntax necessary to validate complex, high-frequency architectures.

## Chapter 1: The Challenges of High-Speed Design in SPICE

The transition from classical lumped-element circuit theory to distributed-element transmission line theory is defined by the spatial relationship between the physical length of the electrical interconnect and the wavelength of the propagating signal. In classical SPICE analysis, wires are presumed to represent equipotential nodes where voltage changes instantaneously across the entire conductor. This fundamental assumption of Modified Nodal Analysis (MNA) fails catastrophically when the physical length of the trace exceeds one-tenth of the electrical wavelength ($\lambda/10$), or in the time domain, when the propagation delay of the interconnect ($t_{pd}$) exceeds one-half of the signal's rise time ($t_r$).

When $t_r < 2 \cdot t_{pd}$, the interconnect acts as a distributed waveguide where the physical transit time of the electromagnetic wave cannot be ignored. High-speed phenomena are governed by Maxwell's equations, which describe the propagation of a transverse electromagnetic (TEM) wave along the $z$-axis. The instantaneous voltage $V(z,t)$ and current $I(z,t)$ at any point along the line are described by the Telegrapher's equations:

$\frac{\partial V(z,t)}{\partial z} = -R I(z,t) - L \frac{\partial I(z,t)}{\partial t}$
$\frac{\partial I(z,t)}{\partial z} = -G V(z,t) - C \frac{\partial V(z,t)}{\partial t}$

Simulating these partial differential equations in a time-domain transient analysis requires the SPICE engine to mathematically model spatial wave propagation. If an engineer attempts to manually cascade discrete, lumped RLC segments to approximate this distributed nature, two severe issues arise. First, the simulation matrix becomes computationally massive, leading to intractable simulation times. Second, the cascaded segments introduce artificial low-pass filtering and spurious high-frequency ringing that distort the true phase of the signal. 

Furthermore, the numerical integration methods utilized by the SPICE engine profoundly impact high-speed simulations. SPICE simulators typically offer backward Euler, trapezoidal, and Gear integration methods . While Gear integration is highly stable and computationally robust for stiff systems like switching power supplies, it artificially dampens physical oscillations . In high-speed digital SI analysis, where capturing the exact amplitude of overshoot, undershoot, and parasitic ringing is critical for determining logic thresholds and dielectric breakdown, the artificial damping of the Gear method is unacceptable . Conversely, trapezoidal integration preserves the energy of high-frequency oscillatory modes, providing a much higher degree of accuracy for lossless or low-loss transmission lines, albeit at the risk of numerical instability (numerical ringing) if parasitic resistances are completely omitted . Therefore, high-speed transient analysis mandates the use of specialized distributed-element models coupled with carefully configured `.OPTIONS` directives to enforce appropriate integration schemes.

## Chapter 2: Transmission Line Theory and Modeling

To model distributed interconnects accurately without the geometric explosion of cascaded lumped elements, LTspice provides three foundational transmission line elements: the `T` element (lossless), the `U` element (uniform RC-line), and the `O` element (lossy, invoked via the `LTRA` model) . These components natively solve the Telegrapher's equations by tracking the historical state of voltages and currents at the line's terminals, circumventing the need for internal nodes.

### The Lossless `T` Element

The ideal `T` element assumes that the series resistance ($R$) and shunt conductance ($G$) are precisely zero. The characteristic impedance ($Z_0$) and phase velocity ($v_p$) are strictly real quantities defined by the distributed inductance ($L$) and capacitance ($C$) per unit length:

$Z_0 = \sqrt{\frac{L}{C}}$
$v_p = \frac{1}{\sqrt{LC}}$

In LTspice, defining a lossless `T` element requires specifying the characteristic impedance ($Z_0$) and either the electrical delay ($T_d$) or the physical length and frequency parameter. A typical SPICE directive for a 50 $\Omega$ trace with a 1 nanosecond delay is formulated as follows:

```spice
T1 In 0 Out 0 Z0=50 Td=1n
```

Because this model utilizes an exact analytical delay mechanism, the signal appearing at the output is a mathematically perfect replica of the input, shifted in time and modified solely by the reflection coefficients ($\Gamma$) at the source and load boundaries. However, this is fundamentally inadequate for multi-gigahertz links, where dispersion and attenuation dominate.

### The Uniform RC-Line `U` Element

For specific applications, such as modeling long on-chip interconnects, polysilicon gates, or highly lossy cables, the inductance is negligible compared to the distributed series resistance and shunt capacitance. In these instances, the `U` element (Uniform RC-line) is utilized . The `U` element models an interconnect where $L=0$ and $G=0$. The SPICE syntax for the `U` element requires specifying the total resistance and total capacitance:

```spice
U1 In 0 Out 0 UMODEL L=10m
.model UMODEL URC(R=10 C=10p)
```

The uniform RC-line acts as a severe low-pass filter, resulting in significant inter-symbol interference (ISI) and edge degradation in digital signals. 

### The Lossy `O` Element (LTRA Model)

To model real-world PCB traces, coaxial cables, and high-speed backplanes, the lossy transmission line must be employed. This is represented by the `O` element, which is instantiated in the schematic using the `LTLIN` symbol and relies on the `LTRA` (Lossy TRAnsmission line) `.model` directive . The complex characteristic impedance of a lossy line is governed by all four primary parameters:

$Z_0 = \sqrt{\frac{R + j\omega L}{G + j\omega C}}$

The propagation constant ($\gamma$), which defines the frequency-dependent attenuation ($\alpha$) and phase ($\beta$) constants, is given by:

$\gamma = \alpha + j\beta = \sqrt{(R + j\omega L)(G + j\omega C)}$

The SPICE syntax for defining an `LTRA` model requires the per-unit-length parameters and the total length of the line (`len`):

```spice
O1 In 0 Out 0 MyLossyLine
.model MyLossyLine LTRA(R=1.5 L=250n C=100p G=0.001 len=0.1)
```

While the standard `LTRA` formulation natively supports static distributed values, real-world RF losses are highly dynamic. Conductor losses escalate proportionally to the square root of frequency ($\sqrt{f}$) due to the skin effect, wherein the current density migrates entirely to the outer periphery of the copper conductor . Simultaneously, dielectric loss ($G$) is a function of the substrate's loss tangent ($\tan \delta$) and increases linearly with frequency . 

| Loss Mechanism | Physical Origin | Frequency Dependence | SPICE Parameter Impact |
| :--- | :--- | :--- | :--- |
| **Skin Effect** | Current crowding at conductor surface | Proportional to $\sqrt{f}$ | Dynamic increase in $R$ |
| **Dielectric Damping** | Molecular polarization in substrate | Proportional to $f$ | Dynamic increase in $G$ |
| **Surface Roughness** | Current path meandering on copper foil | Enhances skin effect at high $f$ | Modifies $R$ multiplier |

To accurately capture these broadband effects within LTspice, static `LTRA` models are frequently superseded by importing full-wave 3D electromagnetic S-parameter data, which implicitly contains all frequency-dependent dispersion, skin effect, and dielectric loss behaviors, including the complex broadband characteristics described by the Djordjevic-Sarkar dielectric model for FR4 substrates .

## Chapter 3: S-Parameter Integration

Scattering parameters (S-parameters) constitute the foundation of modern high-frequency network analysis. Because evaluating the open-circuit and short-circuit voltages of the Z and Y parameters becomes physically impossible at microwave frequencies due to parasitic radiation and reflection, S-parameters describe the electrical behavior of linear networks using incident and reflected power waves based on matched impedance terminations (universally normalized to 50 $\Omega$).

The mathematical framework of an N-port S-parameter system is defined by a matrix relating the incident wave vectors $[a]$ to the reflected wave vectors $[b]$:

$\begin{bmatrix} b_1 \\ b_2 \\ \vdots \\ b_N \end{bmatrix} = \begin{bmatrix} S_{11} & S_{12} & \dots & S_{1N} \\ S_{21} & S_{22} & \dots & S_{2N} \\ \vdots & \vdots & \ddots & \vdots \\ S_{N1} & S_{N2} & \dots & S_{NN} \end{bmatrix} \begin{bmatrix} a_1 \\ a_2 \\ \vdots \\ a_N \end{bmatrix}$

### Importing Touchstone Files

In the LTspice environment, measured or field-solver-simulated S-parameter data is integrated using Touchstone format files (`.s1p`, `.s2p`, `.s4p`, etc.), where the numerical prefix denotes the port count . The Touchstone 1.0 standard is organized into structured frequency rows, expressing the complex matrices in Magnitude/Angle (MA), Real/Imaginary (RI), or dB/Angle (DB) formats . 

To embed an `.s4p` file into a transient SI simulation, an S-parameter block (such as an `S4P` component) must be instantiated on the schematic, with the SPICE directive explicitly linking the Touchstone file to the component . The syntax is structured as:

```spice
S1 N1 N2 N3 N4 0 my_backplane_model.s4p
```

For advanced differential signaling, the Touchstone 2.0 standard (`.ts` extension) introduced support for mixed-mode S-parameters, which mathematically decouple the data into differential-mode ($S_{dd}$), common-mode ($S_{cc}$), and mode-conversion ($S_{dc}$, $S_{cd}$) behaviors . While LTspice can process these matrices, careful mapping of the physical ports to the logical SPICE nodes is required to prevent anti-causal reflections.

### Time-Domain Convolution and Vector Fitting

The fundamental challenge of S-parameter integration within a SPICE solver is that S-parameters are intrinsic to the frequency domain, whereas transient analysis requires a continuous time-domain evaluation. LTspice resolves this dichotomy via discrete-time convolution. The frequency-domain response $H(j\omega)$ must be transformed into a time-domain impulse response $h(t)$ utilizing an Inverse Fast Fourier Transform (IFFT). The output voltage $y(t)$ is computed at every time step by convolving the input stimulus $x(t)$ with $h(t)$:

$y(t) = \int_{-\infty}^{t} x(\tau) h(t - \tau) d\tau$

However, raw empirical S-parameters invariably contain measurement noise, truncation artifacts, and minor passivity violations. If an ostensibly passive interconnect model artificially generates energy due to these mathematical artifacts, the recursive convolution engine will inevitably diverge, causing the SPICE matrix solver to fail. 

To rectify this, advanced rational approximation techniques, principally the Vector Fitting (VF) algorithm, are executed . Vector fitting approximates the measured frequency-domain S-parameters as a summation of partial fractions (poles and residues) within the complex Laplace domain ($s = \sigma + j\omega$):

$f(s) \approx \sum_{n=1}^{N} \frac{c_n}{s - a_n} + d + s \cdot e$

Where $a_n$ represents the complex poles, $c_n$ represents the residues, $d$ is the constant term, and $e$ is the proportional term . By algorithmically enforcing that all poles reside strictly in the left-half of the s-plane, the S-parameter data is synthesized into a provably causal and unconditionally passive equivalent macro-model, often realized as an underlying network of state-space matrices, controlled sources, resistors, and capacitors . This robust transformation guarantees absolute stability during long-duration transient bit-error-rate (BER) simulations.

## Chapter 4: Cross-Talk and Interconnect Parasitics

As PCB routing densities escalate to accommodate expansive high-speed bus architectures, the electromagnetic fields of adjacent traces inevitably overlap, inducing severe cross-talk. Cross-talk is governed by the distributed mutual inductance ($L_m$) and mutual capacitance ($C_m$) coupling an aggressor net to a victim net.

In LTspice, the inductive coupling between adjacent traces is explicitly defined using the `K` directive, which specifies the coupling coefficient ($k$) bridging two discrete inductors ($L_1$ and $L_2$) . The resulting mutual inductance is derived as:

$L_m = k \sqrt{L_1 L_2}$

### SPICE Syntax for Cross-Talk Modeling

To synthesize a distributed coupled transmission line (such as a differential pair or a dense memory bus), the equivalent circuit leverages cascaded, coupled LC segments. The inter-trace fringing capacitance is modeled by placing a capacitor bridging the adjacent nodes, while the magnetic field overlap is established via the `K` statement.

```spice
* Coupled Line Segment (Aggressor and Victim)
L1 In_Aggressor Mid_Aggressor 5nH
L2 In_Victim Mid_Victim 5nH
C1 Mid_Aggressor 0 2pF
C2 Mid_Victim 0 2pF
C_Mutual Mid_Aggressor Mid_Victim 0.5pF
K1 L1 L2 0.35
```

### NEXT and FEXT Dynamics

Cross-talk physically manifests as Near-End Cross-Talk (NEXT) and Far-End Cross-Talk (FEXT). 

*   **NEXT** represents the coupled energy propagating backward toward the source of the victim line. The capacitive and inductive coupling currents flow in the identical direction, making NEXT predominantly positive, broad, and highly insensitive to the physical length of the trace once the line exceeds the saturation length.
*   **FEXT** is the coupled energy propagating forward, synchronously with the wavefront, toward the receiver of the victim line. Crucially, the capacitive and inductive currents flow in opposite directions. In a perfectly homogeneous medium, such as a pure stripline embedded symmetrically within a uniform FR4 dielectric, the inductive and capacitive coupling exactly cancel, rendering FEXT essentially zero.

However, in microstrip routing, the dielectric environment is inhomogeneous (FR4 below, air above). Because electromagnetic fields propagate faster in air than in FR4, the odd-mode phase velocity diverges from the even-mode phase velocity. This velocity mismatch shatters the cancellation effect, resulting in a severe, highly damaging FEXT pulse that grows proportionally with the coupled trace length. Simulating this velocity discrepancy in LTspice requires meticulously tuning the mutual reactive elements to reflect the differential effective permittivities ($\epsilon_{eff,odd} \neq \epsilon_{eff,even}$).

## Chapter 5: Impedance Matching Networks

Maximum power transfer theorem dictates that optimal energy transfer from an active RF source to a passive load is achieved exclusively when the load impedance is the complex conjugate of the source impedance ($Z_L = Z_S^*$). When interfacing nonlinear RF amplifiers with antennas or mismatched transmission lines, impedance matching networks must be constructed. These networks utilize purely reactive elements (L and C) to traverse the admittance and impedance circles of the Smith Chart, transforming an arbitrary impedance locus back to the 50 $\Omega$ origin.

The input impedance of a terminated transmission line of length $l$ and phase constant $\beta$ is given by the foundational equation:

$Z_{in} = Z_0 \frac{Z_L + j Z_0 \tan(\beta l)}{Z_0 + j Z_L \tan(\beta l)}$

By employing L-networks, Pi-networks, or T-networks, the strategically placed reactive elements neutralize the imaginary reactance while simultaneously scaling the real resistance. The quality factor ($Q$) of the matching network dictates its operational bandwidth; higher $Q$ networks provide exceptional matching over a narrow frequency band, whereas lower $Q$ (multi-stage) networks yield broader bandwidths at the expense of footprint and insertion loss.

To empirically verify matching networks within LTspice, an `.AC` sweep analysis is utilized to calculate the voltage standing wave ratio (VSWR) and return loss ($S_{11}$).

```spice
* Small Signal AC Sweep for Network Analysis
V1 In 0 DC 0 AC 1
R_Source In Net1 50
* (Matching Network LC Elements Inserted Here)
R_Load Out 0 75
.AC dec 100 10Meg 5Gig
```

The matching efficiency can be plotted directly in the LTspice waveform viewer by extracting the complex reflection coefficient ($\Gamma$):

$\Gamma = \frac{V_{reflected}}{V_{incident}} = \frac{Z_{in} - Z_0}{Z_{in} + Z_0}$

Plotting the mathematical expression `20*log10(abs(V(in)/I(V_source) - 50)/(abs(V(in)/I(V_source) + 50)))` yields the standard Return Loss curve in decibels, verifying deep nulls that signify maximum power transfer at the target resonant frequencies.

## Chapter 6: Power Delivery Network (PDN) Analysis

A resilient Power Delivery Network (PDN) is the bedrock of SI. It ensures that high-speed digital ASICs, FPGAs, and microprocessors receive aggressively stable voltage supplies despite inducing severe, high-frequency transient current demands. The efficacy of a PDN is evaluated by its target impedance ($Z_{target}$), which defines the maximum permissible impedance of the power rail across a massive frequency spectrum—typically ranging from DC (regulated by the VRM) up to the multi-gigahertz band (regulated by on-die capacitance).

$Z_{target} = \frac{\Delta V_{allowable}}{\Delta I_{transient}}$

If the aggregate PDN impedance breaches the $Z_{target}$ threshold at any specific frequency, a transient current possessing spectral energy at that frequency will induce a proportional voltage ripple ($\Delta V = \Delta I \cdot Z_{PDN}$). This ripple compresses voltage margins, inducing logic failures and exacerbating timing jitter on high-speed outputs.

### Simulating the PDN in LTspice

To simulate the PDN accurately, the Voltage Regulator Module (VRM) output impedance, the bulk storage capacitors, and the high-frequency ceramic decoupling capacitors (MLCCs) must be modeled with extreme precision. Ideal capacitors are a mathematical fiction; every physical capacitor is an RLC network containing Equivalent Series Resistance (ESR) and Equivalent Series Inductance (ESL).

The Self-Resonant Frequency (SRF) of a decoupling capacitor is defined as the point where its capacitive and inductive reactances perfectly cancel:

$f_{SRF} = \frac{1}{2\pi \sqrt{ESL \cdot C}}$

At the SRF, the impedance of the capacitor drops to its absolute minimum, equal precisely to the ESR. Frequencies exceeding the SRF transform the capacitor into an inductor.

| Component | Dominant Frequency Range | Primary Parasitic Constraint |
| :--- | :--- | :--- |
| **VRM Loop** | DC to 1 MHz | Control loop bandwidth, output inductor |
| **Bulk Tantalum/Polymer** | 1 MHz to 10 MHz | High ESR, High ESL |
| **MLCC (0603/0402)** | 10 MHz to 100 MHz | ESL, Mounting Inductance |
| **On-Die/Package Cap** | 100 MHz to >1 GHz | Dielectric thickness, Interconnect length |

When engineers place disparate capacitor values in parallel to achieve broadband low-impedance decoupling, dangerous anti-resonance peaks emerge. These peaks occur where the rising inductive reactance of the larger capacitor resonates in parallel with the falling capacitive reactance of the smaller capacitor, creating a high-impedance pole.

In LTspice, an AC analysis is utilized to sweep a 1-Ampere AC current source applied at the IC power pin. The resulting voltage plot directly represents the raw impedance profile in ohms ($Z = V/I$).

```spice
I_Transient 0 VDD_Core AC 1
.AC dec 200 1kHz 2GHz
```

By painstakingly fine-tuning the ESR, ESL, and mounting inductance values in the LTspice component attributes, the anti-resonance peaks can be critically damped, sculpting a flattened impedance profile that remains safely subordinate to the $Z_{target}$ threshold.

## Chapter 7: Modeling PCB Geometry

While Touchstone files extracted from 3D field solvers provide absolute precision, iterative pre-layout analysis frequently necessitates synthesizing SPICE equivalent circuits directly from raw PCB geometrical specifications.

### Microstrip and Stripline Equations

For a microstrip transmission line constructed on an FR4 substrate with trace width $W$, substrate height $H$, trace thickness $T$, and relative permittivity $\epsilon_r$, the propagating electromagnetic fields exist partially in the lossy dielectric and partially in the lossless air above. This split propagation necessitates the calculation of the effective permittivity ($\epsilon_{eff}$) . 

$\epsilon_{eff} = \frac{\epsilon_r + 1}{2} + \frac{\epsilon_r - 1}{2} \frac{1}{\sqrt{1 + 12 \frac{H}{W}}}$

The characteristic impedance of a standard microstrip (assuming $W/H > 1$) can be reliably approximated as:

$Z_0 = \frac{120\pi}{\sqrt{\epsilon_{eff}} \left[ \frac{W}{H} + 1.393 + 0.667 \ln\left( \frac{W}{H} + 1.444 \right) \right]}$

Conversely, a stripline is fully embedded between two reference ground planes. Because the fields are entirely contained within the homogeneous dielectric, $\epsilon_{eff} = \epsilon_r$, eliminating the complex phase velocity disparities that plague microstrips .

### Vias, BGAs, and SMA Connectors

A through-hole via traversing a multi-layer PCB disrupts the controlled impedance environment, behaving predominantly as a series inductance with a shunt capacitance to the adjacent ground planes. The parasitic inductance of a via can be approximated by:

$L_{via} \approx 5.08 \cdot h \cdot \left[ \ln\left( \frac{4h}{d} \right) + 1 \right] \text{ (in nH)}$

Where $h$ is the via length and $d$ is the via diameter in inches. Furthermore, BGA package parasitics and SMA connector transitions introduce significant capacitive discontinuities. To build ultra-realistic high-speed testbenches in LTspice, these physical discontinuities are modeled by cascading discrete LC via sub-circuits with the transmission line `O` or `T` matrices. Simulating this composite netlist utilizing a step voltage source allows the engineer to generate a Time-Domain Reflectometry (TDR) plot, visually mapping the impedance profile and pinpointing the exact spatial locations of reflections.

## Chapter 8: Conducted and Radiated EMI Simulation

Electromagnetic Interference (EMI) compliance is not merely an engineering metric; it is a legally mandated hurdle required for the commercial sale of any electronic product. Conducted emissions evaluate the high-frequency noise injected back into the AC or DC power mains, whereas radiated emissions measure the electromagnetic fields broadcasted inadvertently into free space.

### Line Impedance Stabilization Networks (LISN)

Pre-compliance conducted EMI simulation in LTspice requires the rigorous modeling of a Line Impedance Stabilization Network (LISN). The LISN performs two critical functions: it isolates the device under test (DUT) from the unpredictable ambient noise of the external power grid, and it provides a standardized, stable RF impedance (typically 50 $\Omega$) across the regulatory testing spectrum (150 kHz to 30 MHz for CISPR standards) .

The standard CISPR 16/32 LISN utilizes a 50 $\mu$H inductor and an 8 $\mu$F coupling capacitor for mains-connected consumer equipment, while automotive CISPR 25 standards dictate a 5 $\mu$H inductor and 1 $\mu$F capacitor . In LTspice, the virtual LISN is modeled directly between the ideal DC source and the switching converter under test.

```spice
* Virtual LISN Model for CISPR 32 Conducted Emissions
L_LISN V_Mains V_DUT 50uH
C_Coupling V_DUT EMI_Out 0.1uF
R_Measurement EMI_Out 0 50
```

By executing a high-resolution transient simulation and subsequently running a Fast Fourier Transform (FFT) on the voltage waveform captured across `R_Measurement`, the spectral content is exposed. This data can be directly plotted against CISPR limit lines to predict compliance.

### Localized Regulatory Standards (BTRC, Bangladesh)

When designing telecommunications equipment for deployment in specific sovereign markets, localized regulatory alignment is strictly enforced. In Dhaka, Bangladesh, the Bangladesh Telecommunication Regulatory Commission (BTRC) enforces rigorous compliance guidelines for telecommunications equipment, networking hardware, and wireless transmitters . 

The BTRC mandates strict adherence to international IEC and CISPR 32 standards for electromagnetic compatibility, augmented by localized spectrum allocation strictures regarding out-of-band spurious emissions and cybersecurity protocols . Simulating these emission profiles in LTspice prior to physical compliance testing at a BTRC-approved facility allows RF engineers to iterate and optimize differential filtering, common-mode chokes, and spread-spectrum clocking (SSC) techniques. This proactive simulation strategy drastically mitigates the financial and temporal risks of failing official BTRC certification.

## Chapter 9: High-Speed Clocking and Jitter

Jitter is formally defined as the deviation of a signal's timing edges from their ideal, periodic mathematical positions. As data rates climb into the multi-gigabit-per-second realm, deterministic jitter (originating from inter-symbol interference, cross-talk, and impedance reflections) and random jitter (originating from thermal phase noise) rapidly consume the unit interval (UI) timing budget.

### Simulating Phase Noise

Thermal noise dictates the theoretical phase noise limit of high-frequency clock oscillators. In LTspice, transient noise analysis can be explicitly performed, or specific, complex jitter profiles can be artificially injected utilizing the `.param` directive alongside arbitrary behavioral voltage sources (`B` elements) .

By mathematically defining a white noise matrix or utilizing a PRBS (Pseudo-Random Binary Sequence) voltage generator, the stochastic nature of real-world data streams can be simulated. The phase noise spectral density can be converted into an equivalent transient jitter parameter, allowing the simulation to reflect the true jitter profile of a synthesized PLL output .

### Eye Diagram Plotting

The aggregate degradation of the clock tree and the data interconnect is most effectively visualized using an eye diagram. The eye diagram is formed by synchronously folding the time-domain waveform back onto itself over successive bit periods. This superimposition reveals the worst-case amplitude noise (voltage closure) and timing jitter (horizontal closure) simultaneously .

In LTspice, an eye diagram is generated by plotting the transient response of the data line and applying the `baudrate` parameter within the `.OPTIONS` directive . 

```spice
.OPTIONS baudrate=10e9
```

This specific directive instructs the LTspice waveform viewer to algorithmically wrap the abscissa (time axis) to overlay the bit transitions perfectly . By configuring this setting, the RF engineer can measure the vertical eye opening (voltage margin) and the horizontal eye opening (timing margin) directly within the LTspice GUI, providing instantaneous validation of the link's bit-error-rate (BER) integrity.

## Chapter 10: RF Amplifier Simulation

The active front-end of any sophisticated microwave system relies inherently on the linearity and gain of the Low Noise Amplifier (LNA). The comprehensive evaluation of an LNA in LTspice involves not only calculating its small-signal gain ($S_{21}$) and noise figure (NF), but rigorously quantifying its large-signal non-linearities, specifically the 1dB Compression Point ($P_{1dB}$) and the Third-Order Intercept Point (IP3) .

### The 1dB Compression Point ($P_{1dB}$)

As the input RF power to an amplifier increases, the active semiconductor devices (BJTs, GaAs pHEMTs, CMOS) eventually saturate, unable to swing beyond their supply rails. The $P_{1dB}$ point is the threshold input (or output) power level at which the amplifier's gain deviates from its ideal, linear trajectory by precisely 1 dB . In LTspice, this compression phenomenon is simulated utilizing an `.AC` or `.TRAN` parametric sweep of the input voltage amplitude, plotting the output power until the 1 dB gain collapse is definitively observed.

### Third-Order Intercept Point (IP3)

When a non-linear amplifier is stimulated simultaneously with two closely spaced RF tones at frequencies $f_1$ and $f_2$, the mathematical Taylor series expansion of the non-linear transfer function generates intermodulation distortion (IMD) products . The third-order IMD products, located specifically at $2f_1 - f_2$ and $2f_2 - f_1$, are particularly catastrophic because they fall directly inside the amplifier's narrow passband, making them impossible to eradicate with subsequent filtering .

The mathematics of a non-linear transfer function dictate a harsh reality: for every 1 dB increase in the fundamental input power, the third-order intermodulation products increase by 3 dB. The IP3 is the theoretical extrapolation point where the fundamental tone power precisely intersects the third-order IMD power.

To simulate IP3 in LTspice:
1. Define two distinct, high-purity sinusoidal voltage sources at $f_1$ and $f_2$.
2. Execute a highly accurate `.TRAN` simulation with maximized timestep resolution.
3. Perform a Fast Fourier Transform (FFT) or utilize the `.FOUR` directive to compute the spectral power .

```spice
* IP3 Two-Tone Simulation Directives
.TRAN 0 1m 0 1n
.FOUR 10Meg V(RF_Out)
.OPTIONS plotwinsize=0
```
*(Note: Disabling data compression via `plotwinsize=0` is critical to prevent the loss of the high-frequency FFT noise floor).*

By carefully measuring the amplitude of the fundamental ($f_1$) and the IMD3 ($2f_1 - f_2$) products within the LTspice FFT viewer, the IP3 is calculated algorithmically. High IP3 values denote exceptional linearity, a critical and non-negotiable metric for wideband heterodyne receivers attempting to isolate weak signals in an increasingly crowded electromagnetic spectrum.

Through the rigorous application of these advanced LTspice methodologies—ranging from complex transmission line mathematics and Touchstone matrix convolution, to stringent EMC modeling and non-linear RF characterization—the modern engineer is empowered to guarantee absolute signal integrity and regulatory compliance well before the fabrication of physical hardware. 


## Sources

- [**eevblog.com** What's going on with this simulation? - EEVblog](https://www.eevblog.com/forum/chat/whats-going-on-with-this-simulation/)
- [**scribd.com** LTJournal V24N4 01 DF SPICEDifferentiation MikeEngelhardt - Scribd](https://www.scribd.com/document/1066282067/LTJournal-V24N4-01-Df-SPICEDifferentiation-MikeEngelhardt)
- [**ez.analog.com** Simulation running very slow - Q&A - LTspice - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/559640/simulation-running-very-slow)
- [**groups.io** LTspice@groups.io | Using TLINE and Lossy line](https://groups.io/g/LTspice/topic/using_tline_and_lossy_line/50250967)
- [**studocu.vn** LTspice 26 Keyboard Shortcuts Guide](https://www.studocu.vn/vn/document/dai-hoc-kinh-te-quoc-dan/kinh-te-quoc-te/ltspice-26-keyboard-shortcuts-guide/158811326)
- [**ltwiki.org** A. General Structure and Conventions - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/A_General_Structure_and_Conventions.htm)
- [**intusoft.com** isspice4 user's guide - volumes 1 and 2 - Intusoft](http://www.intusoft.com/lit/IsSpice4.pdf)
- [**groups.io** Tline Example - LTspice - Groups.io](https://groups.io/g/LTspice/topic/tline_example/50179056)
- [**microwaves101.com** Microstrip Loss Calculations](https://www.microwaves101.com/encyclopedias/microstrip-loss-calculations)
- [**rfessentials.com** Loss Tangent Effect on RF Propagation | RF Essentials](https://rfessentials.com/rf-knowledge-base/how-does-the-loss-tangent-of-a-dielectric-material-affect-rf-signal-propagation/)
- [**pcbandassembly.com** Transmission Line Loss Calculator - Pcbandassembly](https://pcbandassembly.com/transmission-line-loss-calculator/)
- [**ic-emc.org** User's Manual - IC-EMC Home page](http://www.ic-emc.org/download/IC-EMC_Manual_v2v9.pdf)
- [**helpfiles.keysight.com** SnP (Touchstone) File Format - Keysight](https://helpfiles.keysight.com/csg/N1930xB/FilePrint/SnP_File_Format.htm)
- [**ibis.org** Touchstone® File Format Specification - IBIS Open Forum](https://ibis.org/touchstone_ver2.1/touchstone_ver2_1.pdf)
- [**researchgate.net** 169 questions with answers in CIRCUIT SIMULATION | Science topic](https://www.researchgate.net/topic/Circuit-Simulation)
- [**ieeexplore.ieee.org** A Novel Automatic Pole Determination Method for Macromodeling](https://ieeexplore.ieee.org/iel8/9970761/11684959/11685235.pdf)
- [**arxiv.org** Vector Fitting - arXiv](https://arxiv.org/pdf/1908.08977)
- [**ieeexplore.ieee.org** Stability, Causality, and Passivity Analysis of Canonical Equivalent](http://ieeexplore.ieee.org/iel7/6287639/8948470/09136670.pdf)
- [**techrxiv.org** A Novel Algorithm for Transforming S-Parameters to Reduced-Order](https://www.techrxiv.org/doi/pdf/10.36227/techrxiv.171173279.99752352)
- [**scribd.com** User Guide | PDF | Copyright | Proprietary Software - Scribd](https://www.scribd.com/document/364940436/User-Guide)
- [**sairam.edu.in** EEE SYLLABUS BOOK - Sri Sairam Engineering College](http://sairam.edu.in/wp-content/uploads/2023/12/EEE-SYLLABUS-BOOK-26-09-2022.pdf)
- [**eng.libretexts.org** 3.5: Microstrip Transmission Lines - Engineering LibreTexts](https://eng.libretexts.org/Bookshelves/Electrical_Engineering/Electronics/Microwave_and_RF_Design_II_-_Transmission_Lines_(Steer)/03%3A_Planar_Transmission_Lines/3.05%3A_Microstrip_Transmission_Lines)
- [**protoexpress.com** Difference Between Microstrip and Stripline - Sierra Circuits](https://www.protoexpress.com/blog/difference-between-microstrip-stripline-pcb/)
- [**help.simetrix.co.uk** Line Impedance Stabilization Network (LISN) - Documentation](https://help.simetrix.co.uk/9.4/simplis/sp_analog_functions/topics/lisn.htm)
- [**vista-compliance.com** News - Vista Laboratories](https://www.vista-compliance.com/news/news)
- [**jjrlab.com** Exporting Wireless Products to Bangladesh BTRC Certification](https://www.jjrlab.com/news/exporting-wireless-products-to-bangladesh-btrc-certification.html)
- [**scribd.com** ITU-Trends in Telecommunication Reform 2006 | PDF - Scribd](https://www.scribd.com/document/85469705/ITU-Trends-in-Telecommunication-Reform-2006)
- [**itu.int** ITU Contribution to the Implementation of the WSIS Outcomes: 2021](https://www.itu.int/en/itu-wsis/Documents/ITUContribution/2021_ITU_Contribution_to_WSIS-Implementation-20211025.pdf)
- [**simplistechnologies.com** User Manual: Parameters and Expressions - SIMPLIS](https://www.simplistechnologies.com/documentation/simplis/user_manual/topics/parts_parametersandexpressions.htm)
- [**researchgate.net** A Guide to Phase Noise Analysis of Single and Multi-PLL Frequency](https://www.researchgate.net/publication/325828153_A_Guide_to_Phase_Noise_Analysis_of_Single_and_Multi-PLL_Frequency_Synthesizers_with_LTSpice)
- [**ee.buffalo.edu** Learning Electronics - The Empirical Approach](https://www.ee.buffalo.edu/faculty/paololiu/LiuElectronics.pdf)
- [**analog.com** ltspice-keyboard-shortcuts.pdf - Analog Devices](https://www.analog.com/media/en/news-marketing-collateral/solutions-bulletins-brochures/ltspice-keyboard-shortcuts.pdf?modelType=spice-models)
- [**ltspicehelpmanual.azurewebsites.net** Set Simulator Options - Introduction](https://ltspicehelpmanual.azurewebsites.net/options--setsimulatoroptions.htm)
- [**dokumen.pub** Analog Circuit Design Volume 2: Immersion in the Black Art of](https://dokumen.pub/analog-circuit-design-volume-2-immersion-in-the-black-art-of-analog-design-2-reprintnbsped-0123978882-9780123978882.html)
- [**stephan.win31.de** Receiver Concepts for Dummies - Stephan Großklaß](http://stephan.win31.de/superhet.htm)
- [**scribd.com** Simulazioni RF With LTSpice | PDF | Electronic Filter | Spice - Scribd](https://www.scribd.com/document/138318613/Simulazioni-RF-with-LTSpice)
- [**iexploresiliconvalley.com** LTspice for EE students | iExploreSiliconValley.com | Page 2](https://iexploresiliconvalley.com/category/ltspice-for-ee-students/page/2/)
- [**electronics.stackexchange.com** LTSpice's ltline (lossy transmission line) symbol slowing down the](https://electronics.stackexchange.com/questions/181590/ltspices-ltline-lossy-transmission-line-symbol-slowing-down-the-simulation-pr)
- [**nmg.gitlab.io** Lossy Transmission Line Model (LTRA) -](https://nmg.gitlab.io/ngspice-manual/transmissionlines/lossytransmissionlines/lossytransmissionlinemodel_ltra.html)
- [**du.ac.in** UNIVERSITY OF DELHI](https://www.du.ac.in/uploads/13032025_Btech.pdf)
- [**doe.cusat.ac.in** Master of Science - Department of Electronics, CUSAT](https://doe.cusat.ac.in/M.Sc.Syllabus_2024.pdf)
- [**ddu.ac.in** SYLLABI BOOK - DHARMSINH DESAI UNIVERSITY](https://www.ddu.ac.in/pdf/FoT/EC/Syllabus/EC_Syllabus_BTech_AY_2021-2025.pdf)
- [**eng.biu.ac.il** CMOS Circuit Design, Layout, and Simulation, 3rd Edition (IEEE](https://www.eng.biu.ac.il/~wimers/files/courses/Old%20Courses/Digital_VLSI_Design/Book/CMOS_Circuit_Design__Layout__and_Simulation__3rd_Edition.pdf)
- [**webapi.mist.ac.bd** MILITARY INSTITUTE OF SCIENCE AND TECHNOLOGY (MIST)](https://webapi.mist.ac.bd:8080/uploads/downloads/pdf_4e401a99952245c78933b8e8928087f7.pdf)
- [**gitam.edu** M.Tech-VLSI-Design-2024-25_06-12-24.pdf - Gitam](https://www.gitam.edu/sites/default/files/syllabus/M.Tech-VLSI-Design-2024-25_06-12-24.pdf)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=3461&subsort=1&index=93929)
- [**coilcraft.com** Spice Models / S-parameters - Coilcraft](https://www.coilcraft.com/ja-jp/models/spice/)
- [**simetrix.co.uk** SIMETRIX SIMULATOR REFERENCE MANUAL](https://www.simetrix.co.uk/Files/manuals/9.3/SimulatorReference.pdf)
- [**simplis.com** Simulator Reference: AC Table Lookup (including S-Parameters)](https://simplis.com/documentation/simetrix/simulator_reference/topics/analogdevicereference_actablelookup_includings_parameters.htm)
- [**analog.com** LTspice How to: Importing Third-Party Models - Analog Devices](https://www.analog.com/en/resources/technical-articles/ltspice-how-to-import-third-party-models.html)
- [**scribd.com** Broadband SPICE Model Generator | PDF - Scribd](https://www.scribd.com/document/158236956/Broadband-SPICE-Model-Generator)
- [**github.com** Simulation Issues with s2p File-based Inductors #314 - GitHub](https://github.com/IHP-GmbH/IHP-Open-PDK/issues/314)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=2260&before=1579278847898319835&subsort=1)
- [**researchgate.net** Digital Wave vs. Nodal Analysis for Circuit ... - ResearchGate](https://www.researchgate.net/profile/Piero_Belforte/publication/288668128_Digital_Wave_vs_Nodal_Analysis_for_Circuit_Simulation_an_experimental_comparison/links/5682ab9e08aebccc4e0e0326/Digital-Wave-vs-Nodal-Analysis-for-Circuit-Simulation-an-experimental-comparison.pdf)
- [**sourceforge.net** Transmission Line model issues in ngspice - SourceForge](https://sourceforge.net/p/ngspice/discussion/133842/thread/363a66f8/?page=3)
- [**dokumen.pub** Bogatin's Practical Guide to Best Measurement Practices for Digital](https://dokumen.pub/bogatins-practical-guide-to-best-measurement-practices-for-digital-oscilloscope.html)
- [**mdpi-res.com** Advanced CMOS Integrated Circuit Design and Application - MDPI](https://mdpi-res.com/bookfiles/book/5194/Advanced_CMOS_Integrated_Circuit_Design_and_Application.pdf?v=1790557691)
- [**analog.com** CN0571 - Analog Devices](https://www.analog.com/en/resources/reference-designs/circuits-from-the-lab/cn0571.html)
- [**analogdevicesinc.github.io** User Guide — System Level Documentation documentation](https://analogdevicesinc.github.io/system-level/solutions/reference-designs/fmcomms8/user-guide/)
- [**jlcpcb.com** PCB Design - JLCPCB](https://jlcpcb.com/blog/category/pcb-design)
- [**mdpi.com** Impact of the Noise on the Emulated Grid Voltage Signal in ... - MDPI](https://www.mdpi.com/2079-9292/12/4/787)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=2153&after=1588181565240142447&subsort=1)
- [**scribd.com** MicroSim Application Notes PDF - Scribd](https://www.scribd.com/document/442277627/MicroSim-Application-Notes-pdf)
- [**ieca-inc.com** 2N5171 thyristr.lib](http://www.ieca-inc.com/images/Spice-Simulation_Using_LTspice_Part_2.pdf)
- [**mdpi.com** SPICE-Compatible Circuit Models of Multiports Described by ... - MDPI](https://www.mdpi.com/2079-9292/13/12/2260)
- [**scribd.com** Users Guide | PDF | Spice | Electronic Circuits - Scribd](https://www.scribd.com/document/553612376/Users-Guide)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=3026&subsort=1)
- [**scribd.com** LTspice 4 E2 | PDF | Rectifier | Modulation - Scribd](https://www.scribd.com/document/51765014/LTspice-4-e2)
- [**scribd.com** Practical Electronics - May 2026 | PDF | Radio - Scribd](https://www.scribd.com/document/1022143458/Practical-Electronics-May-2026)
- [**gunthard-kraus.de** SPICE-Schaltungs- Simulation mit LTspice XVII - Gunthard-Kraus.de](http://www.gunthard-kraus.de/LTSwitcherCAD/LTSpice%20XVII%20_Tutorial_korr.pdf)
- [**cc.ee.ntu.edu.tw** Time-Domain Simulation – Macromodeling](https://cc.ee.ntu.edu.tw/~rbwu/rapid_content/course/pi/PI10_Macromodeling.pdf)
- [**sintef.no** Vector Fitting - SINTEF](https://www.sintef.no/en/software/vector-fitting/)
- [**photonics.intec.ugent.be** Time-domain compact macromodeling of linear photonic circuits via](https://www.photonics.intec.ugent.be/download/pub_4425.pdf)
- [**opg.optica.org** Extracting causal impulse responses from baseband band-limited S](https://opg.optica.org/oe/fulltext.cfm?uri=oe-32-5-7697)
- [**mdpi.com** Assessment of the Current for a Non-Linear Power Inductor ... - MDPI](https://www.mdpi.com/2079-9292/12/3/579)
- [**www2.mvcc.edu** Operational Amplifiers and Linear Integrated Circuits, 3E](https://www2.mvcc.edu/users/faculty/jfiore/books/OperationalAmplifiersAndLinearICs_3E.pdf)
- [**ngspice.sourceforge.io** ngspice-44-manual.pdf](https://ngspice.sourceforge.io/docs/ngspice-44-manual.pdf)
- [**vbn.aau.dk** Efficient Automated Design and Optimization for Wide-Bandgap](https://vbn.aau.dk/files/752350357/PHD_PPK_ONLINE.pdf)
- [**dokumen.pub** Telecommunication Electronics 1630817368, 9781630817367](https://dokumen.pub/telecommunication-electronics-1630817368-9781630817367.html)
- [**archive.org** Full text of "CMOS VLSI Design A Circuits And Systems Perspective"](https://archive.org/stream/cmosvlsidesignacircuitsandsystemsperspective_201908/CMOS%20VLSI%20Design%20A%20Circuits%20and%20Systems%20Perspective_djvu.txt)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=7579&subsort=1)
- [**normankoren.com** Spice and the art of preamplifier design, Part 1](https://www.normankoren.com/Audio/Spice_preamp.html)
- [**boa.unimib.it** Università degli Studi di Milano - Bicocca](https://boa.unimib.it/retrieve/3ff309bc-1031-42cb-8a4e-e856d35f55f2/phd_unimib_875223.pdf)
- [**2025.help.altair.com** Extended Definitions - Altair® Twin Activate® 2025](https://2025.help.altair.com/2025/twinactivate/extended_definitions.pdf)
- [**www2.mvcc.edu** Operational Amplifiers and Linear Integrated Circuits, 3E](https://www2.mvcc.edu/users/faculty/jfiore/OpAmps/OperationalAmplifiersAndLinearICs_3E.pdf)
- [**digikey.com** How to use LTspice to Determine Photo Sensing Noise Performance](https://www.digikey.com/en/blog/how-to-use-ltspice-to-determine-photo-sensing-noise-performance)
- [**researchgate.net** Digital Wave vs. Nodal Analysis for Circuit Simulation - ResearchGate](https://www.researchgate.net/publication/288668128_Digital_Wave_vs_Nodal_Analysis_for_Circuit_Simulation_an_experimental_comparison)
- [**theamphour.com** An Interview with Mike Engelhardt (Re-broadcast) | The Amp Hour](https://theamphour.com/196-an-interview-with-mike-engelhardt-re-broadcast/)
- [**gomactech.net** PROGRAM - GOMAC Tech](https://www.gomactech.net/2023/assets/pdf/GOMACTech_2023_Program.pdf)
- [**vdoc.pub** Microwave And Rf Semiconductor Control Device Modeling [PDF]](https://vdoc.pub/documents/microwave-and-rf-semiconductor-control-device-modeling-3nv8j9ou3lmg)
- [**globalcalcs.com** Resistors in Parallel Calculator｜Calc](https://globalcalcs.com/en/science/resistor-parallel/)
- [**changpuak.ch** Klirrfaktor in Theorie und Praxis - changpuak.ch](https://www.changpuak.ch/electronics/tut_04.php)
- [**limpreur.info** 2005 ARRL Periodicals - Nov/Dec QEX](https://www.limpreur.info/books-and-magazines/QEX/QEX%202005/QEX%202005-11.pdf)
- [**pace.edu.in** 21EC62-MOD-3](https://www.pace.edu.in/img/course/21EC62-MOD-3.pdf)
- [**scholarsmine.mst.edu** Dielectric Loss Tangent Extraction using Two Single-Ended](https://scholarsmine.mst.edu/cgi/viewcontent.cgi?article=5705&context=ele_comeng_facwork)
- [**ltwiki.org** .OPTIONS -- Set simulator options - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_OPTIONS_Set_simulator_options.htm)
- [**dokumen.pub** Basic Electronics for Beginners: Analogue Electronics and](https://dokumen.pub/basic-electronics-for-beginners-analogue-electronics-and-microcontrollers-projects-9781907920844.html)
- [**agnd.net** LTspice - agnd.net](https://agnd.net/valpo/341/LTspiceHelpXVII.pdf)
- [**asau.ru** Biosignal Processing](https://www.asau.ru/files/pdf/3346486.pdf)
- [**s3.eu-central-1.amazonaws.com** The LTspice XVII Simulator - Amazon S3](https://s3.eu-central-1.amazonaws.com/elektormagazine/links/the-ltspice-xvii-simulator-ebook.pdf)
- [**aeroelectric.com** Practical Electronics Handbook - AeroElectric Connection](http://www.aeroelectric.com/Reference_Docs/Books/Practical_Electronics_Handbook_6th_ed.pdf)
- [**api.eestar.com** LTspice XVII help 中文翻译版本文由微信公众号电子帮翻译而成](https://api.eestar.com/article/share/2020/10/fda54202010221347106716.pdf)
- [**help.altair.com** Spice Netlist](https://help.altair.com/twinactivate/help/en_us/topics/math_solutions/spice_netlist_t.htm)
- [**fr.scribd.com** SPICE Netlist for VLSI Circuit Design | PDF - Scribd](https://fr.scribd.com/doc/211805638/SPICE-Netlist-Written-by-Mos)
- [**mathworks.com** Use S-parameters with Port Reduction - MATLAB & Simulink](https://www.mathworks.com/help/rf/ug/modeling-a-high-speed-backplane-part-1-measured-16-port-s-parameters-to-4-port-s-parameters.html)
- [**ansyshelp.ansys.com** Computing and Exporting Full-Wave SPICE Subcircuits - Ansys Help](https://ansyshelp.ansys.com/public/Views/Secured/Electronics/v252/en/Subsystems/SIwave/Content/ComputingFullWaveSPICESubcircuitsinSIwave.htm)
- [**zuken.com** S-parameters/Touchstone® Model for High-Speed PCB Analysis](https://www.zuken.com/en/blog/preparing-s-parameters-touchstone-model-for-high-speed-pcb-analysis/)
- [**youtube.com** LTSpice's ltline (lossy transmission line) symbol slowing ... - YouTube](https://www.youtube.com/watch?v=uRNWsGILeoU)
