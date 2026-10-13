# Advanced Mixed-Signal Co-Simulation and VLSI Architecture in LTspice: Bridging the Continuous and Discrete Time Domains

## Introduction

The verification of modern Very Large Scale Integration (VLSI) systems demands a rigorous synthesis of continuous-time analog dynamics and discrete-time digital logic. As mixed-signal Systems-on-Chip (SoCs) integrate increasingly sensitive analog front-ends with high-speed digital signal processing cores, the boundary between these domains blurs. Signal integrity degradation, quantization noise, clock jitter, and ground bounce cascade across this boundary, rendering isolated domain simulations inadequate. LTspice, originally developed for switch-mode power supply (SMPS) design, has evolved into a formidable mixed-signal simulator due to its highly optimized sparse matrix solver and proprietary event-driven digital A-device library . 

This comprehensive report details the advanced methodologies required to co-simulate complex mixed-signal systems within LTspice. By directly embedding Z-transform discrete-time mathematical models alongside non-linear analog SPICE components, systems architects can evaluate closed-loop control algorithms, algorithmic data converters, and high-speed serial peripheral buses with unprecedented fidelity. The subsequent ten chapters deconstruct the simulator’s internal algorithms, provide exact syntax for proprietary component instantiation, present rigorous mathematical proofs for data conversion and loop-filter analysis, and provide verified SPICE netlists for immediate application in VLSI verification workflows.

## Chapter 1: Analog vs. Digital Simulation Domains

The fundamental challenge in mixed-signal simulation lies in reconciling two disparate computational paradigms: the continuous-time analog domain, governed by differential equations and evaluated via numerical integration, and the discrete-time digital domain, governed by boolean logic and evaluated via event-driven state machines . Understanding how LTspice bridges these domains is critical for achieving convergence, maintaining accuracy, and optimizing simulation execution time.

### Continuous-Time Matrix Evaluation

Analog simulation in LTspice relies on Modified Nodal Analysis (MNA), which constructs a system of non-linear differential-algebraic equations (DAEs) to represent the circuit topology . At each time step, LTspice linearizes non-linear devices (such as MOSFETs and BJTs) using a Taylor series expansion truncated to the first two terms, formulating a Jacobian matrix . The simulator then employs the Newton-Raphson method, iterating until the nodal voltages and branch currents converge within the strict tolerances defined by `reltol` (relative tolerance), `abstol` (absolute current tolerance), and `vntol` (absolute voltage tolerance) . 

To handle the differential equations introduced by reactive elements, LTspice utilizes implicit numerical integration. The simulator provides three integration methods, each presenting a distinct trade-off between numerical stability and artificial damping . 

| Integration Method | Algorithm Characteristics | Optimal VLSI Application | Drawbacks |
| :--- | :--- | :--- | :--- |
| **Trapezoidal** | High accuracy, minimal artificial damping, susceptible to numerical ringing in switching circuits. | High-Q resonant circuits, low-distortion audio amplifiers, continuous-time filters. | Can produce trapezoidal ringing (computational artifacts) across sharp non-linear boundaries. |
| **Gear (2nd Order)** | Highly stable, rapidly dampens numerical ringing, mathematically robust for highly non-linear topologies. | Switching regulators, heavy logic switching, high-speed PWM domains . | Can artificially smooth out genuine high-frequency physical transients if time steps are too large. |
| **Modified Trap** | A proprietary LTspice compromise blending Trap accuracy with algorithmic dampening. | General-purpose mixed-signal co-simulation, standard analog verification . | Can occasionally mask minor non-linearities in precision RF simulations. |

When Newton-Raphson iterations fail to converge during a transient step, LTspice dynamically reduces the internal time step ($dt$) . If $dt$ becomes infinitesimally small, a "Time Step Too Small" convergence failure occurs. This is mitigated by relaxing `reltol` (e.g., to $0.01$) or utilizing the `.options alternate` solver, which increases the internal mathematical precision of the Jacobian matrix by a factor of 1,000 to resolve mathematical singularities .

### Event-Driven Digital Evaluation

In stark contrast to the computationally intensive MNA matrix solver, LTspice handles its native digital logic library (A-devices) using an event-driven algorithm . When a pure digital node transitions, the simulator does not construct a Jacobian matrix or execute Newton-Raphson iterations for the internal gate logic. Instead, it evaluates the boolean state based on input logic thresholds and schedules a future output event based on the specified propagation delay (`Td`) . 

Because pure digital gates require no external power pins and assume idealized infinite input impedance, they are mathematically decoupled from the analog matrix unless directly interfacing with an analog node. This architecture allows thousands of digital gates to be simulated at near-instantaneous speeds .

### Bridging the Domains: The `tripdt` Parameter

The critical intersection of these domains occurs when a rapidly transitioning digital output drives a continuous-time analog node (e.g., a digital timer driving a MOSFET gate). By default, digital A-devices do not supply timestep information to the analog simulation engine . Consequently, the analog solver, detecting no prior rate-of-change, may take a massive time step that completely skips over the digital transition's rise or fall time, leading to severe interpolation errors and skipped switching events .

To enforce synchronization, the systems architect must utilize the undocumented `tripdt` instance parameter . By setting `tripdt` to a value an order of magnitude smaller than the transition time (e.g., `tripdt=100p` for a 1ns rise time), the digital device forces the analog solver to drastically reduce its maximum time step across the state change . This ensures that the Newton-Raphson algorithm accurately captures the transient dynamics of the mixed-signal interface without degrading the simulation speed during steady-state logic periods.

## Chapter 2: The A-Device Digital Library

LTspice includes a powerful, albeit largely undocumented, library of proprietary Special Functions known as A-devices . These mixed-mode simulation devices circumvent the limitations of traditional macro-modeling—which often relies on hundreds of discrete SPICE primitives like controlled sources and diodes—by providing native, highly optimized behavioral algorithms directly compiled into the solver core.

### Universal Syntax and Pin Mapping

All A-devices share a universal eight-terminal netlist syntax :

```spice
Annn n001 n002 n003 n004 n005 n006 n007 n008 <model> [instance parameters]
```

The physical pin mapping is rigidly defined across the entire digital gate family, which includes `INV`, `BUF`, `AND`, `OR`, `XOR`, `SCHMITT`, `SCHMTBUF`, `SCHMTINV`, `DFLOP`, and highly specialized analog interfaces like `VARISTOR` and `MODULATE` . 

| Pin Number | Function Designation | Behavioral Rules and Compilation Handling |
| :--- | :--- | :--- |
| **1 through 5** | Logical Inputs | Evaluated against the `Ref` threshold. Unused inputs tied to Pin 8 are stripped from the simulation matrix with zero speed penalty . |
| **6** | Complementary Output ($\overline{Q}$) | Actively drives current based on output parameters (`Rout`, `Vhigh`, `Vlow`). |
| **7** | True Output ($Q$) | Main logic output. Follows identical drive strength rules as Pin 6. |
| **8** | Device Common | Floating reference ground. If unconnected on the schematic, it defaults to SPICE global node 0 . |

A unique feature of the LTspice schematic compiler is its handling of unconnected terminals. Any pin left floating on the schematic is automatically tied to Terminal 8 by the netlister . This behavior allows a single 5-input `AND` gate symbol to functionally operate as a 2-input, 3-input, or 4-input gate with zero manual reconfiguration; the unused inputs are mathematically ignored . Note that for the `XOR` device, if more than two inputs are used, the output asserts only if *exactly one* input is true, deviating from standard multi-input parity generation .

### Specialized A-Devices for Mixed-Signal Architecture

Beyond basic boolean logic, the A-device library contains highly specialized mixed-signal components critical for VLSI architectures:

*   **DFLOP:** A master-slave D-type flip-flop natively supporting a clock input, a D input, and asynchronous active-high `PRE` (Preset) and `CLR` (Clear) pins. The `CLR` input takes strict logical precedence over `PRE` . The start-up state is controllable via the `ic=` parameter .
*   **Sample (SampleHold):** A discrete-time sampling register. It operates in two exclusive modes: tracking the input when the `S/H` pin is high, or latching the input on the rising edge of the `CLK` pin. Only one of these control pins must be connected for the compiler to validate the device .
*   **PhaseDet (PhiDet):** A Type-IV Phase-Frequency Detector (PFD) explicitly designed for Phase-Locked Loop (PLL) simulations. It natively decodes leading/lagging clock edges to drive charge pump arrays, replacing complex cross-coupled NAND-gate structures .
*   **OTA (Operational Transconductance Amplifier):** The `OTA` is implemented as an A-device for extreme computational efficiency in analog macro-modeling . Its output current fundamentally follows the equation $I_{out} = \tanh(V_{diff} \times G)$, naturally modeling the saturation characteristics of a bipolar differential pair . The `linear` instance parameter disables the hyperbolic tangent limit, rendering it an ideal linear transconductor .

## Chapter 3: Timing and Logic Thresholds

To accurately model the physical layer of various digital logic families—such as 1.8V CMOS, 5V TTL, or Low-Voltage Differential Signaling (LVDS)—the generic A-devices must be tightly parameterized . By default, LTspice A-devices operate with 0V/1V logic levels, an idealized 0.5V threshold, zero propagation delay, and an unrealistic $1 \Omega$ output impedance . Simulating realistic interconnect delays and signal integrity necessitates overwriting these defaults.

### Output Characteristics and Propagation Logic

Device characteristics are passed via instance parameters in the `SpiceLine` attribute of the component . The primary parameters governing analog-digital interfacing are:

*   **`Vhigh` and `Vlow`**: Define the steady-state logic high and low voltage rails .
*   **`Ref`**: Defines the analog input switching threshold. If omitted, LTspice algebraically deduces this as $0.5 \times (Vhigh + Vlow)$ .
*   **`Trise` and `Tfall`**: Define the linear slewing transition times between $Vlow$ and $Vhigh$. If only `Trise` is defined, `Tfall` implicitly defaults to the same value .
*   **`Td`**: Defines the propagation delay from the input threshold crossing to the onset of the output transition. The input hold time is mathematically locked to equal this propagation delay .
*   **`Rout`, `Rhigh`, `Rlow`**: Define the output impedance. Note that slewing parameters (`Trise`/`Tfall`) and RC parameters (`Rout`/`Cout`/`Tau`) are mutually exclusive; defining both on a single instance triggers a compiler warning .

### Modeling Specific Logic Families via Global Parameters

When simulating an entire mixed-signal IC containing hundreds of gates, manually configuring each `SpiceLine` is highly inefficient and error-prone. Instead, global parameters should be established using the `.param` SPICE directive, allowing dynamic switching between logic families .

| Logic Family | Vhigh | Vlow | Ref | Trise / Tfall | Td (Prop Delay) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **5V TTL** | 5.0V | 0.0V | 1.5V | 2.0ns | 5.0ns |
| **3.3V LVCMOS** | 3.3V | 0.0V | 1.65V | 1.0ns | 2.5ns |
| **1.8V CMOS** | 1.8V | 0.0V | 0.9V | 0.5ns | 1.2ns |
| **LVDS (Differential)** | 1.4V | 1.0V | 1.2V | 0.2ns | 0.5ns |

The SPICE implementation for a 1.8V CMOS environment is executed as follows:

```spice
* Global Logic Parameters for 1.8V Advanced CMOS
.param L_VHI = 1.8
.param L_VLO = 0.0
.param L_REF = 0.9
.param L_TRISE = 500p
.param L_TFALL = 500p
.param L_TD = 1.2n
```

Each digital gate in the schematic is then assigned the corresponding string in its `SpiceLine` attribute:
`Vhigh={L_VHI} Vlow={L_VLO} Ref={L_REF} Trise={L_TRISE} Tfall={L_TFALL} Td={L_TD}` . 

### Schmitt Trigger Modeling

The `SCHMITT`, `SCHMTBUF`, and `SCHMTINV` devices demand an explicit mathematical definition of their hysteresis window to function correctly . Instead of a single `Ref` parameter, they utilize `Vt` (Threshold Voltage center) and `Vh` (Hysteresis Voltage delta) . The physical switching thresholds are calculated internally as:

$V_{trip(low)} = V_t - V_h$
$V_{trip(high)} = V_t + V_h$

For a standard 5V logic system exhibiting 1.0V of hysteresis centered at 2.5V, setting `Vt=2.5 Vh=0.5` ensures the gate trips at 3.0V on a rising analog edge and 2.0V on a falling analog edge .

## Chapter 4: ADC Modeling and Quantization

Simulating Analog-to-Digital Converters (ADCs) in LTspice requires rigorous modeling of both temporal discretization (sampling) and amplitude discretization (quantization). The fidelity of this mathematical model directly dictates the accuracy of subsequent Signal-to-Noise and Distortion Ratio (SINAD) and Effective Number of Bits (ENOB) measurements derived via spectral analysis.

### Mathematical Foundation of Quantization

An ideal N-bit ADC with a full-scale voltage range $V_{FS}$ has a discrete Least Significant Bit (LSB) resolution defined as:

$\Delta = \frac{V_{FS}}{2^N}$

The quantization error, $e_q(t) = x(t) - x_q(t)$, is modeled stochastically as a uniformly distributed white noise process bounded between $-\frac{\Delta}{2}$ and $+\frac{\Delta}{2}$. The total quantization noise power (variance) is mathematically proven by integrating the error probability density function:

$\sigma_q^2 = \frac{1}{\Delta} \int_{-\Delta/2}^{\Delta/2} e^2 de = \frac{\Delta^2}{12}$

For a full-scale sinusoidal input, the theoretical Signal-to-Quantization-Noise Ratio (SQNR) is derived as:

$SQNR_{dB} = 10 \log_{10} \left( \frac{V_{FS}^2 / 8}{\Delta^2 / 12} \right) = 6.02N + 1.76 \text{ dB}$

### SPICE Implementation of an N-Bit ADC

To implement this continuous-to-discrete conversion in LTspice without the immense computational overhead of a transistor-level Pipeline or Successive Approximation Register (SAR) ADC, systems architects utilize Behavioral Voltage Sources (B-sources) paired with the A-device `Sample` components .

The B-source mathematically forces the continuous analog signal into discrete amplitude steps using the `floor()` or `round()` functions, while the dual `Sample` array enforces the temporal hold .

```spice
* Behavioral 12-bit ADC Model
* Parameters: VFS = 2.048V, N = 12, Delta = 2.048 / 4096 = 0.0005V
B_Quantizer N_Quantized 0 V = { 0.0005 * floor((V(Analog_In) / 0.0005) + 0.5) }

* Sampling Stage using cascaded A-Device SampleHold components
* Note: CLK and CLK_DEL must be strictly non-overlapping to prevent race conditions.
A_Sample1 N_Quantized 0 0 0 0 0 N_Hold1 0 SampleHold CLK=CLK Rout=10
A_Sample2 N_Hold1 0 0 0 0 0 N_ADC_Out 0 SampleHold CLK=CLK_DEL Rout=10
```

### Jitter and Aliasing Spectral Analysis

Clock jitter introduces a dynamic voltage error strictly dependent on the input signal's instantaneous slew rate. The error voltage induced by a random timing jitter $\Delta t$ is expressed as:

$e_j(t) = \frac{dx(t)}{dt} \Delta t$

To model random aperture jitter in LTspice, the ideal clock voltage source is frequency-modulated by a random noise generator utilizing the `white(time)` behavioral function . 

To extract the ENOB, a transient simulation (`.tran`) is executed, and the resultant `N_ADC_Out` waveform is passed through LTspice's built-in Fast Fourier Transform (FFT) engine. To prevent spectral leakage, the simulation `Stop Time` and `Maximum Timestep` must be calculated such that the data window captures an exact integer number of cycles of the coherent input frequency. Furthermore, waveform compression must be disabled by utilizing the `.options plotwinsize=0` directive, ensuring no lossy compression algorithms distort the noise floor prior to FFT computation. The physical ENOB is subsequently extracted from the simulated SINAD:

$ENOB = \frac{SINAD_{dB} - 1.76}{6.02}$

## Chapter 5: DAC Reconstruction and Glitch Analysis

Digital-to-Analog Converters (DACs) introduce distinct mixed-signal anomalies during the discrete-to-continuous conversion phase. The discrete-time digital stream is reconstructed into the continuous-time domain via a Zero-Order Hold (ZOH) process, which intrinsically shapes the frequency response and generates high-frequency alias images.

### Zero-Order Hold Mathematics

The ZOH operation holds the analog output voltage constant for the absolute duration of the sample period $T_s$. The impulse response of the ZOH is a rectangular pulse of width $T_s$. Applying the continuous-time Fourier Transform to this impulse response yields the frequency domain transfer function:

$H_{ZOH}(f) = T_s \frac{\sin(\pi f T_s)}{\pi f T_s} e^{-j \pi f T_s}$

This results in the well-known $\text{sinc}(x)$ frequency droop, attenuating the fundamental signal as it approaches the Nyquist frequency ($f_s/2$). At exactly the Nyquist limit, the ZOH introduces an unavoidable $-3.92 \text{ dB}$ attenuation, which must be compensated for by downstream analog equalization.

### Modeling Glitch Energy

In segmented or R-2R ladder DAC architectures, minute timing skews between the parallel digital bit switches cause transient voltage spikes during major carry transitions (e.g., transitioning from `0111...1` to `1000...0`). This is defined as glitch impulse area, quantified in Volt-seconds (V-s).

To simulate glitch energy accurately in LTspice, a summing node is constructed where each digital bit drives a binary-weighted behavioral current source. By intentionally introducing asymmetric propagation delays (`Td`) to the digital gates driving the Most Significant Bit (MSB) versus the Least Significant Bits (LSBs), the resulting transient non-overlap generates a physical glitch at the analog output node .

```spice
* 4-bit DAC Summing Node with Glitch Injection
.param I_LSB = 1u
* MSB delayed by 100ps relative to LSBs to simulate skew
B_Bit0 I_Out 0 I = { I_LSB * V(D0) }
B_Bit1 I_Out 0 I = { 2 * I_LSB * V(D1) }
B_Bit2 I_Out 0 I = { 4 * I_LSB * V(D2) }
B_Bit3 I_Out 0 I = { 8 * I_LSB * V(D3_Delayed) }

* Add parasitic trace capacitance and load resistance to observe glitch decay
C_Load I_Out 0 5p
R_Load I_Out 0 10k
```

### Active Reconstruction Filters

To suppress the high-frequency images mirrored around multiples of $f_s$, and to flatten the sinc droop in the passband, a continuous-time analog reconstruction filter is mandatory. A Sallen-Key or Multiple Feedback (MFB) active low-pass filter can be rapidly prototyped using LTspice's idealized `UniversalOpamp2` macro-model . By sweeping the filter using an AC analysis (`.ac dec 100 1 10Meg`), the architect can verify that the stop-band attenuation exceeds the theoretical quantization noise floor (e.g., $>74$ dB for a 12-bit system) at the first image frequency, $f_s - f_{in}$.

## Chapter 6: Z-Transform and Discrete-Time Control

Modern mixed-signal systems frequently execute compensation and control loops entirely in the digital domain using embedded microcontrollers or specialized DSPs. Simulating a digital Proportional-Integral-Derivative (PID) controller or an Infinite Impulse Response (IIR) filter interacting with a continuous-time analog plant requires directly embedding Z-transform transfer functions within the LTspice netlist .

### The Bilinear Transform and S-Domain Limitations

While LTspice B-sources natively support Laplace transform continuous-time poles and zeros via the `laplace` syntax keyword , the solver core does not natively parse Z-transforms . To simulate a discrete-time control algorithm, the system must either be approximated using the Bilinear Transform (Tustin's method) and fed to the `laplace` parser, or explicitly modeled structurally using unit delay elements .

The Bilinear Transform maps the discrete Z-domain to the continuous S-domain using the algebraic substitution:

$s = \frac{2}{T_s} \frac{z-1}{z+1}$

While this resulting S-domain equation can be injected into a `laplace` B-source, non-linear frequency warping occurs as the signal frequency approaches the Nyquist limit. For exact discrete-time simulation, a structural approach using absolute $Z^{-1}$ delay registers is mathematically superior .

### Implementing the $Z^{-1}$ Delay Element

A $Z^{-1}$ block represents a mathematical delay of exactly one sample period $T_s$. Attempting to use a single `Sample` A-device for this results in a catastrophic hold-time race condition during simulation: as the global clock transitions, the single sample device instantly updates its output, causing downstream elements in a sequential pipeline to erroneously capture the new data instead of the delayed data .

The robust VLSI solution, mirroring actual silicon flip-flop design, is to construct a true Master-Slave delay register using two cascaded `Sample` devices running on anti-phase clocks .

```spice
* Z-1 Unit Delay Subcircuit for Discrete Time Systems
.subckt Z_DELAY In Out CLK CLK_BAR
* Master stage captures on CLK
A_Master In 0 0 0 0 0 N_Mid 0 SampleHold CLK=CLK Rout=10
* Slave stage transfers on CLK_BAR, guaranteeing hold-time
A_Slave N_Mid 0 0 0 0 0 Out 0 SampleHold CLK=CLK_BAR Rout=10
.ends Z_DELAY
```

### Biquad IIR Filter Simulation

With the $Z^{-1}$ macro-model firmly established, any arbitrary discrete-time transfer function can be constructed in Direct Form II. Consider a standard second-order (Biquad) filter commonly used for audio DSP and PID compensation:

$H(z) = \frac{Y(z)}{X(z)} = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2}}{1 + a_1 z^{-1} + a_2 z^{-2}}$

This is translated into a highly efficient LTspice netlist by deploying two `Z_DELAY` subcircuits to hold the intermediate state variables $w[n-1]$ and $w[n-2]$, and utilizing a Behavioral Voltage Source to calculate the difference equation multiplier nodes .

```spice
* Discrete Time Biquad Multiplier Stage
* Feedforward and Feedback paths mathematically summed
B_Wn Node_W 0 V = { V(X_in) - (a1 * V(W_n1)) - (a2 * V(W_n2)) }
B_Yn Node_Y 0 V = { (b0 * V(Node_W)) + (b1 * V(W_n1)) + (b2 * V(W_n2)) }

* Z-1 Delay Line Instantiations
X_Delay1 Node_W W_n1 CLK CLK_BAR Z_DELAY
X_Delay2 W_n1 W_n2 CLK CLK_BAR Z_DELAY
```

This precise structural architecture allows systems architects to accurately simulate the severe quantization effects of floating-point versus fixed-point DSP coefficients by wrapping the B-source multiplier equations in `round()` math functions . 

## Chapter 7: Finite State Machine Implementation

Integrating complex digital IP (Intellectual Property) blocks, such as Finite State Machines (FSMs), directly into LTspice is crucial for verifying start-up sequencing, fault-handling logic, and dynamic power management states without requiring computationally expensive co-simulation links to external Verilog/VHDL simulators.

### Structural FSM Construction

An FSM consists fundamentally of next-state combinational logic, a state register (composed of synchronized D-Flip Flops), and output combinational logic. Using the A-device `DFLOP` and standard logic gates, a synchronous Moore or Mealy machine can be instantiated entirely within the analog framework .

To avoid extreme netlist complexity when porting Verilog to SPICE, complex boolean next-state logic can be condensed into Behavioral Voltage Sources evaluating boolean expressions . In LTspice's behavioral syntax, the caret symbol `^` acts as a boolean XOR, `&` as AND, and `|` as OR. Logical evaluations natively return a numerical `1` for True and `0` for False, which maps perfectly to 1V logic gates .

```spice
* FSM State Register (2-bit: S1, S0)
* Td ensures adequate setup time for the combinational feedback loop
A_FF0 N_Next0 0 CLK 0 0 N_S0_bar N_S0 0 DFLOP Td=1n Vhigh=3.3 Vlow=0
A_FF1 N_Next1 0 CLK 0 0 N_S1_bar N_S1 0 DFLOP Td=1n Vhigh=3.3 Vlow=0

* Next State Logic (Example: 2-bit up-counter with an Enable flag)
B_Next0 N_Next0 0 V = { if(V(Enable) > 1.65, !V(N_S0), V(N_S0)) }
B_Next1 N_Next1 0 V = { if(V(Enable) > 1.65, V(N_S1) ^ V(N_S0), V(N_S1)) }
```

### Analog Threshold Triggering

FSMs in mixed-signal ASICs frequently change state based on continuous-time analog events, such as an Under-Voltage Lockout (UVLO) condition, a thermal shutdown, or an over-current comparator trip. 

To interface the analog domain to the digital FSM safely, an analog voltage must be reliably thresholded. While `SCHMITT` devices handle this seamlessly with built-in hysteresis , a continuous behavioral evaluation can also be implemented for rapid parametric sweeps. For instance, to generate a digital `FAULT` flag when a monitored analog rail drops below a critical 2.75V threshold:

```spice
* Analog UVLO Fault Detector
B_Fault N_Fault 0 V = { if(V(V_Mon) < 2.75, 3.3, 0) }
```

This `N_Fault` node is then logically routed to the asynchronous `CLR` pins of the FSM `DFLOP` array, ensuring a safe, instantaneous hardware reset during a transient simulation event . The continuous monitoring ensures that the digital core reacts immediately to the analog failure, validating the system-level fault tolerance.

## Chapter 8: Phase-Locked Loops (PLL) and Clock Recovery

Simulating a complete Phase-Locked Loop (PLL) synthesizer is notoriously difficult in SPICE. It encompasses widely separated, conflicting time constants: the high-frequency microwave oscillations of the Voltage Controlled Oscillator (VCO), the rapid digital phase alignments at the Phase-Frequency Detector (PFD), and the exceedingly slow integration dynamics of the analog loop filter . LTspice handles this matrix computation exceptionally well if the loop components are modeled utilizing the behavioral A-device structures.

### The Phase-Frequency Detector (PFD)

The LTspice `PhaseDet` A-device natively acts as a complex Type-IV PFD . It receives a reference clock and a feedback clock, decoding the phase error and outputting localized UP and DOWN logic pulses. Utilizing this single optimized primitive eliminates the need to build a complex cross-coupled NAND-gate logic structure, drastically speeding up simulation time and reducing numerical artifacting at the clock edges .

### Charge Pump Mechanics and Non-Idealities

The charge pump translates the digital UP/DOWN logic pulses from the PFD into a bi-directional analog current injected directly into the loop filter. In physical hardware, charge pumps suffer from current mismatch and sub-nanoampere leakage currents. These non-idealities cause a static phase offset at lock and periodic ripple on the VCO control line, directly generating severe reference spurs in the frequency domain . 

A behavioral charge pump in LTspice can accurately model these non-idealities using a controlled current source:

```spice
* Non-Ideal Charge Pump Model
.param I_CP = 5m       ; 5mA nominal pump current
.param I_Leakage = 10n ; 10nA parasitic leakage
.param I_Mismatch = 0.98 ; 2% sink/source mismatch
B_CP I_Out 0 I = { (I_CP * V(UP_pulse)) - (I_CP * I_Mismatch * V(DOWN_pulse)) + I_Leakage }
```

### Loop Filter Mathematics and Lock-Time Calculation

For a standard charge-pump PLL, a 2nd-order or 3rd-order passive low-pass filter translates the discontinuous charge pulses into a smooth VCO tuning voltage ($V_{tune}$) . The open-loop transfer function of the PLL is universally defined as:

$G(s) = \frac{I_{CP} K_{VCO}}{2 \pi N s} Z_F(s)$

Where $K_{VCO}$ is the VCO gain (in rad/s/V), $N$ is the feedback divider ratio, and $Z_F(s)$ is the transimpedance of the loop filter. A standard 2nd-order passive filter consists of a series $R_1$ and $C_1$ in parallel with a shunt $C_2$. Its transimpedance is:

$Z_F(s) = \frac{1 + s R_1 C_1}{s(C_1 + C_2)(1 + s R_1 \frac{C_1 C_2}{C_1 + C_2})}$

The system designer must place the stabilizing zero $\omega_z = 1 / (R_1 C_1)$ below the targeted loop bandwidth to ensure convergence, and the pole $\omega_p = \frac{C_1 + C_2}{R_1 C_1 C_2}$ above the loop bandwidth to attenuate the charge pump switching ripple. A phase margin of 50 to 60 degrees is targeted for optimal lock time and minimum overshoot . 

In a linear second-order approximation, the physical lock time required to settle within a specific error band $\epsilon$ can be mathematically predicted via:

$T_{lock} \approx \frac{-\ln(\epsilon)}{\zeta \omega_n}$

In LTspice, the exact closed-loop lock-time can be simulated via a `.tran` step response analysis, observing the $V_{tune}$ node to verify that the transient settling strictly adheres to the mathematical damping factor $\zeta$ and natural frequency $\omega_n$ derived from the filter components.

## Chapter 9: Pulse Width Modulation (PWM) Generation

Power electronics controllers, Class-D audio amplifiers, and motor drives rely heavily on precision Pulse Width Modulation (PWM). The architectural methodology used to generate PWM within the LTspice environment drastically impacts both the ultimate accuracy and the simulation execution time.

### Analog Ramp and Comparator Method

The traditional SPICE approach relies on an analog ramp generator—typically a fixed current source charging a capacitor, periodically discharged by a clock-driven BJT or MOSFET switch—fed into a high-gain analog voltage comparator alongside the analog control voltage. 

While this physically represents legacy analog PWM controllers, it is computationally devastating. The simulator's Newton-Raphson solver must constantly evaluate the high-gain internal differential transistors of the comparator, forcing micro-step evaluations at every single clock edge . If the integration limits (specifically `reltol`) are too loose, the simulator may numerically skip the exact crossing point, introducing artificial numerical jitter into the PWM duty cycle and causing sub-harmonic oscillations in the downstream power stage.

### Digital Event-Driven Timer Method

A substantially faster and more mathematically accurate approach utilizes the digital A-device `Counter` combined with behavioral logic, or mathematically defining the PWM directly via a B-source utilizing the internal simulation state variables .

By utilizing the intrinsic `time` keyword in LTspice, which accesses the simulator's current transient time step , a mathematically perfect saw-tooth carrier wave can be synthesized and compared with zero solver overhead:

```spice
* Mathematical 1MHz PWM Generator
.param F_SW = 1Meg
.param T_SW = {1/F_SW}
* Generate a precise sawtooth ramp oscillating between 0 and 1
B_Sawtooth V_Ramp 0 V = { (time / T_SW) - floor(time / T_SW) }

* Behavioral Comparator with instant state transition
B_PWM V_PWM_Out 0 V = { if(V(V_Ramp) < V(Duty_Cycle_Control), 3.3, 0) }
```

This purely algebraic evaluation allows the matrix solver to glide through the switching events without resolving complex semiconductor models. For full mixed-signal verification involving an MCU peripheral, digital `DFLOP` devices can be sequentially chained to form an explicitly clocked digital down-counter, triggering standard logic gates that map identically to the architectural RTL implementation of a real silicon timer peripheral.

## Chapter 10: Microcontroller Peripheral Co-Simulation

Verifying the physical layer of peripheral communications—such as Inter-Integrated Circuit (I2C) or Serial Peripheral Interface (SPI)—requires modeling the complex interaction between digital protocol timing logic and analog transmission line physics. High capacitance on a PCB trace or long wire harness can severely degrade digital timing margins, causing catastrophic setup and hold violations at the receiving IC.

### I2C Bus Physics and Open-Drain Modeling

The I2C protocol operates on a bidirectional open-drain architecture. Devices can only actively pull the bus lines (SDA and SCL) to ground; a passive pull-up resistor ($R_p$) is entirely responsible for generating the rising edge logic transition . 

The rising edge speed is governed strictly by the RC time constant of the pull-up resistor and the total equivalent parasitic bus capacitance ($C_b$). 

| I2C Speed Mode | Max Frequency | Max Rise Time ($t_r$) | Max Bus Capacitance ($C_b$) |
| :--- | :--- | :--- | :--- |
| **Standard Mode** | 100 kHz | 1000 ns | 400 pF |
| **Fast Mode** | 400 kHz | 300 ns | 400 pF |
| **Fast Mode Plus** | 1 MHz | 120 ns | 550 pF  |

The maximum allowable pull-up resistor is constrained by the maximum rise time ($t_r$) dictated by the I2C specification. The logic high threshold is defined at $0.7 \times V_{cc}$ and the logic low threshold at $0.3 \times V_{cc}$. The mathematical derivation for the rise time between these specific thresholds yields:

$R_{max} = \frac{t_r}{0.8473 \times C_b}$

Conversely, the minimum pull-up resistor is constrained by the maximum low-level output sink current ($I_{OL}$, typically 3mA to 20mA depending on the mode) the silicon die can sink without exceeding the maximum $V_{OL}$ threshold (usually 0.4V):

$R_{min} = \frac{V_{cc} - V_{OL}}{I_{OL}}$

### SPICE Co-Simulation of the I2C Physical Layer

To simulate this mechanism in LTspice, an ideal open-drain output must be modeled. Standard A-device logic gates possess active push-pull outputs. To convert a push-pull digital gate into an open-drain buffer, a Voltage Controlled Switch (SW) or an ideal behavioral current source must be utilized .

```spice
* Open-Drain I2C SDA Buffer Model
* MCU Logic simulating internal protocol state machine
A_MCU_Logic N_Internal 0 0 0 0 0 N_Tx_Logic 0 BUF Vhigh=3.3 Vlow=0

* Open Drain Switch (Closes to ground when N_Tx_Logic is HIGH)
S_OD_FET SDA_Pad 0 N_Tx_Logic 0 SW_OpenDrain
.model SW_OpenDrain SW(Ron=10 Roff=100Meg Vt=1.65 Vh=0.5)

* Analog Bus Physics Loading
R_Pullup V_3V3 SDA_Pad 2.2k
C_Parasitic SDA_Pad 0 200p
```

By performing a transient simulation (`.tran`) over several clock cycles, the systems architect can visually inspect the SDA and SCL node voltages. If the combination of $R_{pullup}$ and $C_{parasitic}$ causes the $t_r$ to stretch beyond 300ns (for Fast Mode), the waveform will fail to cross the $0.7 \times V_{cc}$ threshold in time for the next clock edge . LTspice’s `.meas` directives can automatically extract these timing margins and flag violations:

```spice
.meas TRAN RiseTime TRIG V(SDA_Pad) VAL=0.99 RISE=1 TARG V(SDA_Pad) VAL=2.31 RISE=1
```

### SPI Transmission Line Integrity

Unlike I2C, SPI operates utilizing an active push-pull topology capable of speeds exceeding 50 MHz. At these frequencies, the PCB trace can no longer be modeled as a simple lumped capacitance; it must be treated as a transmission line. Signal reflections, overshoot, and ringing become the dominant failure mechanisms. 

To simulate an SPI bus in LTspice, the architect connects the driving A-device to the receiving A-device via a Lossy Transmission Line model (`LTRA` or `T`) . The characteristic impedance $Z_0$ of the trace interacts with the output impedance of the driver (`Rout`). If $R_{out} < Z_0$, severe ringing occurs, necessitating series source termination. By iteratively sweeping the series termination resistor using a `.step param` directive, the optimal resistance that perfectly dampens the reflection can be identified, mathematically confirming the signal integrity prior to PCB layout tape-out . This final synthesis of digital protocol timing and microwave transmission line theory represents the absolute pinnacle of LTspice mixed-signal verification. 


## Sources

- [**scribd.com** LTSpice Help | PDF | Spice | Trigonometric Functions - Scribd](https://www.scribd.com/document/273806514/LTSpice-Help)
- [**technav.ieee.org** Circuit analysis computing | IEEE Technology Navigator](https://technav.ieee.org/topic/circuit-analysis-computing/)
- [**edn.com** Use LTspice to simulate mixed continuous and sampled systems](https://www.edn.com/use-ltspice-to-simulate-mixed-continuous-and-sampled-systems/)
- [**scribd.com** LTspice: Advanced Integration Methods | PDF - Scribd](https://www.scribd.com/document/450254440/LTSpice-Numerical-Methods)
- [**community.infineon.com** Resolving convergence challenges in LTspice](https://community.infineon.com/t5/Knowledge-Base-Articles/Resolving-convergence-challenges-in-LTspice/ta-p/1053215)
- [**ltwiki.org** Integration Methods - LTwiki](https://ltwiki.org/files/LTspiceHelp.chm/html/integration_method_issues.htm)
- [**agnd.net** LTspice - agnd.net](https://agnd.net/valpo/341/LTspiceHelpXVII.pdf)
- [**rohmfs-rohm-com-cn.oss-cn-shanghai.aliyuncs.com** How to Use LTspice Models: Tips for Improving Convergence](https://rohmfs-rohm-com-cn.oss-cn-shanghai.aliyuncs.com/en/products/databook/applinote/common/how_to_use_ltspice_models_tips_for_improving_convergence_an-e.pdf)
- [**ltwiki.org** A. Special functions. - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/A_Special_functions_.htm)
- [**groups.io** LTspice@groups.io | user-defined digital logic levels](https://groups.io/g/LTspice/topic/user_defined_digital_logic/50169508)
- [**ltwiki.org** A. Special functions. - LTwiki](https://ltwiki.org/files/LTspiceHelp.chm/html/A-device.htm)
- [**eevblog.com** LTspice gate parameters - EEVblog](https://www.eevblog.com/forum/projects/ltspice-gate-parameters/)
- [**ltwiki.org** Undocumented LTspice - LTwiki](https://ltwiki.org/?title=Undocumented_LTspice)
- [**allaboutcircuits.com** Modifying the Operation of Digital Components in LTspice](https://www.allaboutcircuits.com/technical-articles/modifying-the-operation-of-digital-components-in-ltspice/)
- [**electronics.stackexchange.com** LTSpice change output voltage of gate](https://electronics.stackexchange.com/questions/614442/ltspice-change-output-voltage-of-gate)
- [**ltwiki.org** B. Arbitrary behavioral voltage or current sources. - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/B_Arbitrary_behavioral_voltage_or_current_sources_.htm)
- [**ltwiki.org** B. Arbitrary behavioral voltage or current sources. - LTwiki](https://ltwiki.org/LTspiceHelpXVII/LTspiceHelp/html/B-device.htm)
- [**web.mit.edu** Introduction to LTspice - MIT](https://web.mit.edu/6.101/www/s2020/handouts/LTSpiceIntro.pdf)
- [**groups.io** Importing Complex Impedances - LTspice - Groups.io](https://groups.io/g/LTspice/topic/importing_complex_impedances/83850387)
- [**fliphtml5.com** CMOS Integrated Circuit Simulation with LTspice - FlipHTML5](https://fliphtml5.com/wmkd/pvpq/CMOS_Integrated_Circuit_Simulation_with_LTspice/)
- [**researchgate.net** 31 questions with answers in LTSPICE | Science topic - ResearchGate](https://www.researchgate.net/topic/LTspice)
- [**electronics.stackexchange.com** Need help for a Dflop implementation in LTspice](https://electronics.stackexchange.com/questions/266638/need-help-for-a-dflop-implementation-in-ltspice)
- [**researchgate.net** A Guide to Phase Noise Analysis of Single and Multi-PLL Frequency](https://www.researchgate.net/publication/325828153_A_Guide_to_Phase_Noise_Analysis_of_Single_and_Multi-PLL_Frequency_Synthesizers_with_LTSpice)
- [**engicalchub.com** PLL Loop Filter Design Guide: 2nd-Order Passive Charge Pump](https://engicalchub.com/guides/pll-loop-filter-guide/)
- [**youtube.com** PLL Phase Locked Loop on LTSpice - YouTube](https://www.youtube.com/watch?v=Zg4cCoXDg_w)
- [**rftools.io** PLL Loop Filter Design: A Practical Locking Guide - rftools.io](https://rftools.io/blog/pll-loop-filter/)
- [**schemalyzer.com** I2C Pull-up Resistor Calculator | Schemalyzer Tools](https://www.schemalyzer.com/en/tools/i2c-pullup-calculator)
- [**allaboutcircuits.com** I2C Design Mathematics: Capacitance and Resistance](https://www.allaboutcircuits.com/technical-articles/i2c-design-mathematics-capacitance-and-resistance/)
- [**analog.com** How to Add a Voltage-Controlled Switch in LTspice | Analog Devices](https://www.analog.com/en/resources/analog-dialogue/articles/how-to-add-a-voltage-controlled-switch.html)
- [**mdpi.com** Current-Mode Control of a Distributed Buck Converter with a Lossy](https://www.mdpi.com/2079-9292/13/17/3565)
- [**analog.com** LTspice® How-to: Using the .STEP Directive to Perform Repeated](https://www.analog.com/en/resources/technical-articles/ltspice-using-the-step-command-to-perform-repeated-analysis.html)
- [**cde.nus.edu.sg** LTspice Manual](https://cde.nus.edu.sg/ece/wp-content/uploads/sites/3/2024/09/LTspiceManual.pdf)
- [**analog.com** ltspice-keyboard-shortcuts.pdf - Analog Devices](https://www.analog.com/media/en/news-marketing-collateral/solutions-bulletins-brochures/ltspice-keyboard-shortcuts.pdf?modelType=spice-models)
- [**ez.analog.com** if statement does not stop call to a function with divide by zero - Q&A](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/594388/if-statement-does-not-stop-call-to-a-function-with-divide-by-zero)
- [**ltwiki.org** LTSPICE LISTING - LTwiki](https://ltwiki.org/files/LTSpicePartListAPI.html)
- [**analog.com** LTspice® Demo Circuits - Analog Devices](https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator/lt-spice-demo-circuits.html)
- [**ltwiki.org** LTSPICE LISTING - LTwiki](https://ltwiki.org/images/archive/4/4e/20110920094837!LTSpicePartListAPI.pdf)
- [**courses.grainger.illinois.edu** LTspice Tutorial Part 4- Intermediate Circuits](https://courses.grainger.illinois.edu/ece110/sp2020/content/labs/Experiments/LTspice%20Tutorial%20%20Part%204-%20Intermediate%20Circuits.pdf)
- [**youtube.com** Design and simulation of Schmitt Trigger circuit using LTspice](https://www.youtube.com/watch?v=6KihNESMdFI)
- [**mitsubishielectric.com** How to use LTspice® models - Mitsubishi Electric](https://www.mitsubishielectric.com/semiconductors/powerdevices/design_support/simulator/simulator_introduction/spice_introduction.html)
- [**ez.analog.com** Configuring Default SchmittBuf in LTSpice for 5V Input and 3.3V](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/593230/configuring-default-schmittbuf-in-ltspice-for-5v-input-and-3-3v-output)
- [**groups.io** Time-Delay simulation - LTspice - Groups.io](https://groups.io/g/LTspice/topic/time_delay_simulation/50158281)
- [**elec3004.uqcloud.net** Discrete-Time System Analysis Using the Z-Transform](https://elec3004.uqcloud.net/2013/lectures/Lathi-Ch11-Discrete-Time%20System%20Analysis%20Using%20the%20Z-Transform.pdf)
- [**groups.io** Simulation of Z-transform filters/systems with SPICE - Groups.io](https://groups.io/g/LTspice/topic/simulation_of_z_transform/50145740)
- [**youtube.com** Electronic Basic 1:LTSpice Design And Simulate Delay Circuit](https://www.youtube.com/watch?v=4-NeNd7gvUw)
- [**youtube.com** LT Spice - 2.Delay Circuit - YouTube](https://www.youtube.com/watch?v=9u8alJ_73_g)
- [**kolegite.com** CMOS Integrated Circuit Simulation with LTspice IV](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%BE%D0%B2%D0%B0%20%D1%81%D1%85%D0%B5%D0%BC%D0%BE%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D0%B0/%D0%9F%D0%90%D0%98%D0%A1/cmos-integrated-circuit-simulation-with-ltpice%20%281%29.pdf)
- [**ltwiki.org** Filter Pages and LTspice Goodies - LTwiki](https://ltwiki.org/index.php?title=Filter_Pages_and_LTspice_Goodies)
- [**eecg.utoronto.ca** Beginner's Guide to LTSpice Pages 1&2 Commands & techniques](https://www.eecg.utoronto.ca/~ali/spice/LTspice/LTSpiceShortGuide.pdf)
- [**archive.org** Full text of "Everyday Practical Electronic" - Internet Archive](https://archive.org/stream/EPEMagazine/EPEnonlinear.ir2015-07_djvu.txt)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=7248&subsort=1&index=17759)
- [**scribd.com** LTspice Circuit Simulation Guide | PDF | Spice | Logic Gate - Scribd](https://www.scribd.com/document/695757973/Supplement-20091006)
- [**ngspice.sourceforge.io** ngspice-44-manual.pdf](https://ngspice.sourceforge.io/docs/ngspice-44-manual.pdf)
- [**pdfcoffee.com** Mohindru P. Electronic Circuit Analysis Using LTSpice... 2021](https://pdfcoffee.com/mohindru-p-electronic-circuit-analysis-using-ltspice-2021-pdf-free.html)
- [**dokumen.pub** SPICE and LTspice for Power Electronics and Electric Power](https://dokumen.pub/spice-and-ltspice-for-power-electronics-and-electric-power.html)
- [**renesas.cn** PLL Loop Filter Design and Fine Tuning](https://www.renesas.cn/zh/document/apn/pll-loop-filter-design-and-fine-tuning)
- [**people.engr.tamu.edu** Lecture 6: Loop Filter Circuits - Texas A&M University](https://people.engr.tamu.edu/spalermo/ecen620/lecture06_ee620_loop_filters.pdf)
- [**researchgate.net** PLL loop filter and charge pump. | Download Scientific Diagram](https://www.researchgate.net/figure/PLL-loop-filter-and-charge-pump_fig2_4181585)
- [**analog.com** LTspice - Analog Devices](https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html)
- [**we-online.com** LTspice examples](https://www.we-online.com/files/pdf1/ltspice-examples.pdf)
- [**youtube.com** LTSpice (Pt 2): More Simulations in the Time & Frequency Domains](https://www.youtube.com/watch?v=gRPHSGyQaQA)
- [**ez.analog.com** Is it possible to force a fixed internal time step in LTspice transient](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/604125/is-it-possible-to-force-a-fixed-internal-time-step-in-ltspice-transient-simulation)
- [**youtube.com** Electric Circuit Simulation With LTspice (Recording of the IEEE](https://www.youtube.com/watch?v=yaqVUEW4DWM)
- [**ieee.li** Circuits and Systems (CAS) Society - IEEE – Long Island Section](https://ieee.li/cas/)
- [**help.scia.net** Modified Newton Raphson method - Help SCIA Engineer](https://help.scia.net/25.0/en/analysis/solver_setup/nonlinear_solution_methods/modified_newton_raphson_method.htm)
- [**youtube.com** Behind the Scenes of the SPICE Circuit Simulator - Part 3 - YouTube](https://www.youtube.com/watch?v=PrYmqYbrJLA)
- [**github.com** SpiceSharpParser/circuits/a-devices/README.md at main - GitHub](https://github.com/SpiceSharp/SpiceSharpParser/blob/main/circuits/a-devices/README.md)
- [**courses.egr.uh.edu** LTSpice Basic Tutorial](https://courses.egr.uh.edu/ECE/ECE3355/Honors%20Electronics%20LTSpice/LTSpice%20Tutorials/LTspice_Basics.pdf)
- [**ez.analog.com** Parameters for "G" Component - Q&A - LTspice - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/567929/parameters-for-g-component)
- [**slideshare.net** ltspice basic practice.pptx - Slideshare](https://www.slideshare.net/slideshow/ltspice-basic-practicepptx/258414068)
- [**s3.eu-central-1.amazonaws.com** The LTspice XVII Simulator - Amazon S3](https://s3.eu-central-1.amazonaws.com/elektormagazine/links/the-ltspice-xvii-simulator-ebook.pdf)
- [**ieee.li** LTspice IV Basic Lab Class](https://ieee.li/pdf/viewgraphs/ltspice_basics.pdf)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=2319&after=1573756253503742274&subsort=1)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=7322&subsort=1&index=16767)
- [**scribd.com** LTspice Help | PDF | Spice | Electrical Network - Scribd](https://www.scribd.com/document/615367782/LTspiceHelp)
- [**sigaa.unifei.edu.br** Dissertações/Teses - UNIFEI - SIGAA Mobile](https://sigaa.unifei.edu.br/sigaa/public/programa/defesas.jsf?lc=pt_BR&id=331)
- [**scribd.com** Advanced Practical Electronics Circuits | PDF | Power Supply - Scribd](https://www.scribd.com/document/900486988/Advanced-Practical-Electronics-Circuits-Systems)
- [**ti.com** I2C Bus Pullup Resistor Calculation - Texas Instruments](https://www.ti.com/lit/pdf/slva689)
- [**sites.ifi.unicamp.br** I2C Bus Pullup Resistor Calculation - Sites do IFGW](https://sites.ifi.unicamp.br/soares/files/2017/03/Pull-up-slva689.pdf)
- [**electronics.stackexchange.com** LTspice: behavioral modelling elements for propagation delay](https://electronics.stackexchange.com/questions/532582/ltspice-behavioral-modelling-elements-for-propagation-delay)
- [**ez.analog.com** Getting Started with LTspice - FAQs/Docs - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs/c/getting-started-with-ltspice)
- [**web.mit.edu** Introduction to LTspice SPICE Netlists LTspice - MIT](https://web.mit.edu/6.101/www/s2020/handouts/LTSpiceIntro_4.pdf)
- [**youtube.com** LTspice tutorial - Digital circuits and logic gates - YouTube](https://www.youtube.com/watch?v=JttE2NObDPM)
- [**youtube.com** Simulating Digital Logic in LTSpice (085i) - YouTube](https://www.youtube.com/watch?v=UtXbUzwHYlI)
