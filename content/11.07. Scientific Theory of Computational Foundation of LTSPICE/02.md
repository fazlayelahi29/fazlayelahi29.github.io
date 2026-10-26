# Advanced Power Electronics and Stability Analysis in LTspice

## Introduction

The design, optimization, and validation of Switch-Mode Power Supplies (SMPS) represent some of the most mathematically rigorous and heavily scrutinized disciplines in modern electrical engineering. As load requirements for advanced application-specific integrated circuits, artificial intelligence processors, and high-frequency communication transceivers push relentlessly into the sub-1-volt, >100-ampere domain, the tolerances for voltage deviation, ripple, and transient recovery time have narrowed exponentially. In this regime, trial-and-error benchtop prototyping is no longer a viable engineering methodology. Comprehensive, high-fidelity simulation is the mandatory precursor to physical realization.

LTspice—particularly in its 24 and 26 iterations—has cemented its position as the preeminent tool for mixed-mode power electronics simulation . Unlike traditional SPICE engines that were optimized strictly for small-signal analog integrated circuit design or steady-state linear networks, LTspice was engineered from the ground up to solve the discontinuous, highly nonlinear, and piecewise-linear equations inherent to hard-switched power conversion . This capability enables engineers to simulate cycle-by-cycle transient phenomena in minutes rather than hours, without sacrificing the fidelity of high-frequency parasitic ringing, semiconductor avalanche characteristics, or dynamic switching losses. One significant new feature found in recent LTspice versions is the addition of a native Frequency Response Analysis (FRA) device, which can be used to perform exact AC analysis on non-linear, time-domain circuits . 

However, extracting the full analytical power of the simulator requires an intimate understanding of both computational mathematics and control theory. The simulator is fundamentally a numerical tool; its outputs are only as valid as the physical models and solver constraints defined by the designer. A persistent challenge in power electronics simulation is bridging the dichotomy between large-signal time-domain analysis, which captures exact switching waveforms, and small-signal frequency-domain analysis, which is required to derive Bode plots and design stable feedback compensators. 

This exhaustive engineering report aims to bridge the gap between theoretical SMPS control mathematics and highly advanced LTspice simulation techniques. Over the course of the following chapters, this document will detail a complete end-to-end methodology for analyzing power conversion systems. It will cover the derivation of state-space averaged models, the extraction of invariant PWM switch models, discrete-time sampling approximations, exact parasitic estimations, the mathematical mechanics of Modified Nodal Analysis, and the utilization of Type-III error amplifiers. By the conclusion of this text, the analytical framework presented will empower designers to achieve first-pass success in even the most complex, multi-loop, non-linear power converter topologies.

## Chapter 1: SMPS Simulation Philosophy 

### 1.1 The Dual-Domain Paradigm: Time-Domain vs. State-Space Averaging

The simulation of switching converters inherently demands solving a system of differential equations that change their structural state multiple times per switching period. In a continuous conduction mode converter, the circuit transitions between at least two distinct topological states: the active state when the primary control switch is conducting, and the passive state when the freewheeling diode or synchronous rectifier is conducting. 

The time-domain switching simulation approach models these transitions exactly as they occur in reality. Using non-linear semiconductor models or idealized voltage-controlled switches, the simulator calculates the instantaneous nodal voltages and branch currents at every micro-step of the simulation . This methodology is imperative for evaluating peak voltage stresses, root-mean-square currents, thermal dissipation, magnetic core saturation, and electromagnetic interference signatures driven by parasitic tank ringing. However, time-domain simulation is inherently a large-signal process. Because the circuit is discontinuous and non-linear, classical linear AC analysis cannot be directly applied to a switching model.

To evaluate loop stability using standard control theory, the non-linear, time-varying switching converter must be transformed into a linear, time-invariant continuous system. This necessitates the use of state-space averaged modeling . Pioneered by researchers R.D. Middlebrook and Slobodan Ćuk, state-space averaging removes the switching frequency ripple by averaging the state variables over one switching period . The resulting averaged model allows the application of standard Laplace-domain transfer functions to determine the control-to-output gain, input-to-output audio susceptibility, and output impedance . 

A rigorous SMPS design philosophy demands the simultaneous utilization of both domains. The state-space averaged model is constructed to synthesize the error amplifier compensator rapidly, while the exact time-domain model validates the large-signal transient response and ensures that the physical circuit does not violate the small-signal assumptions inherent to the averaged model.

### 1.2 Mathematical Foundations of the LTspice Solver (MNA)

To master LTspice for power electronics, one must understand how the engine interprets a schematic. LTspice relies on Modified Nodal Analysis (MNA) to construct the system of equations representing the circuit . Classical nodal analysis formulates equations strictly based on Kirchhoff’s Current Law, using nodal voltages as the only unknowns. However, classical nodal analysis cannot easily accommodate ideal voltage sources, inductors, or current-controlled devices, because their branch currents cannot be expressed strictly as a function of their nodal voltages .

Modified Nodal Analysis resolves this fundamental limitation by introducing additional constraint equations and augmenting the matrix to include specific branch currents as independent variables . For a power electronics circuit containing $n$ non-reference nodes and $b$ branches requiring current variables, the MNA formulation takes the matrix form:

$\begin{bmatrix} G & B \\ C & D \end{bmatrix} \begin{bmatrix} V \\ I \end{bmatrix} = \begin{bmatrix} J \\ E \end{bmatrix}$

In this formulation, the matrix $G$ contains the conductances connected between nodes, while $B$ and $C$ represent the topological connections of voltage sources and inductors, explicitly defining Kirchhoff's Voltage Law constraints . The vector $V$ contains the unknown node voltages, and $I$ contains the unknown branch currents for the components that cannot be defined by conductance alone. Because SMPS circuits are dominated by inductors, voltage sources, and non-linear switches, the MNA matrix in LTspice is dynamically recalculated at every time step. When a power MOSFET transitions from the off state to the on state, the values in the $G$ matrix change by orders of magnitude. This dramatic stiffness in the differential equations necessitates highly robust numerical integration algorithms to maintain convergence.

### 1.3 Overcoming Transient Solver Instabilities and Integration Methods

To solve the time-derivatives of capacitors and inductors, LTspice utilizes discrete-time numerical integration. The choice of integration method critically dictates the accuracy and stability of an SMPS simulation. LTspice offers three primary methods: trapezoidal, modified trap, and gear integration .

Trapezoidal integration is the default method in LTspice. It is a second-order, A-stable method that offers high accuracy and minimizes numerical damping. However, when applied to the stiff, hard-switching waveforms of power converters, trapezoidal integration frequently suffers from a phenomenon known as trap ringing . This manifests as an unphysical, high-frequency, alternating-polarity oscillation on nodes experiencing instantaneous voltage or current transitions. Trap ringing occurs because the trapezoidal rule maps high-frequency poles from the s-plane to the boundary of the unit circle in the z-plane, leading to sustained numerical oscillations at the Nyquist frequency of the solver's time step .

To counter this, LTspice employs a proprietary modified trap algorithm designed to detect and damp trapezoidal ringing dynamically without sacrificing the global accuracy of the second-order trapezoidal rule . While effective for general analog circuitry, it occasionally fails to resolve severe switching transients in un-snubbed power stages, resulting in "Time step too small" convergence failures .

Gear integration is a backward-differentiation formula that is inherently heavily damped . Gear integration forces high-frequency poles into the origin of the z-plane, completely eliminating trap ringing . While it adds artificial numerical damping—which slightly degrades the accuracy of high-Q resonant tank simulations and oscillators—it is the premier choice for hard-switched SMPS transient simulations because it ensures robust matrix convergence and cleans up false numerical artifacts .

To enforce Gear integration and optimize the solver for a high-current switching converter, specific tolerances must be loosened to speed up simulation time without materially degrading large-signal accuracy. 

*Table 1.1: Optimal LTspice Solver Options for SMPS Transient Simulation*

| SPICE Parameter | Default Value | Recommended SMPS Value | Engineering Justification |
| :--- | :--- | :--- | :--- |
| `method` | trap | gear | Eliminates trapezoidal ringing during extremely fast switching transitions; forces matrix convergence . |
| `reltol` | 0.001 | 0.01 | Relative error tolerance. Loosening to 0.01 significantly speeds up simulation while remaining adequately precise for power evaluation . |
| `abstol` | 1pA | 1nA | Absolute current tolerance. A 1pA threshold is excessively tight for converters passing tens of amperes, causing solver stalling . |
| `vntol` | 1\mu V | 100\mu V | Absolute voltage tolerance. Loosening prevents the MNA solver from stalling on microvolt-level node noise during switching . |
| `ITL4` | 10 | 100 | Transient iterations per time step. Increasing to 100 prevents convergence aborts during discontinuous switch state changes . |

These options can be applied directly to the schematic text using the directive: `.options method=gear reltol=1e-2 abstol=1e-9 vntol=1e-4 ITL4=100`.

### 1.4 The Mathematics of State-Space Averaging (Middlebrook & Ćuk)

To transition from the time domain to the frequency domain for loop stability analysis, we apply the State-Space Averaging technique . Consider a continuous conduction mode buck converter. The state vector is defined as $x(t)$ comprising the inductor current and capacitor voltage, and the input vector is $u(t)$ comprising the input voltage.

During the active subinterval when the switch is closed, the state equations are governed by the linear system:
$\dot{x} = A_1 x + B_1 u$

For a non-ideal buck converter incorporating inductor direct current resistance ($r_L$), capacitor equivalent series resistance ($r_c$), and a load resistor ($R$), the continuous matrices are meticulously defined as :
$A_1 = \begin{bmatrix} -\frac{r_L + (R \parallel r_c)}{L} & -\frac{R}{L(R+r_c)} \\ \frac{R}{C(R+r_c)} & -\frac{1}{C(R+r_c)} \end{bmatrix}, \quad B_1 = \begin{bmatrix} \frac{1}{L} \\ 0 \end{bmatrix}$

During the passive subinterval, the input is disconnected from the LC filter, yielding the secondary state equations:
$\dot{x} = A_2 x + B_2 u$
Where $A_2$ is identical to $A_1$, but the input matrix $B_2$ becomes a zero matrix since the input voltage no longer drives the inductor .

The core principle of state-space averaging asserts that if the switching frequency is sufficiently high such that the state variables do not change significantly during one cycle—known as the small-ripple approximation—the system can be approximated by a single, averaged state equation weighted by the steady-state duty cycle $D$ :
$\dot{\bar{x}} = [D A_1 + (1-D) A_2]\bar{x} + [D B_1 + (1-D) B_2]\bar{u}$

By defining $\bar{A}$ and $\bar{B}$ as the duty-cycle-weighted averages of the respective matrices, a nonlinear, time-invariant system is achieved . To utilize AC analysis in SPICE, this system must be mathematically linearized. Variables are decomposed into steady-state DC operating points and small-signal AC perturbations. By expanding the averaged equation and eliminating both the steady-state DC terms and the second-order non-linear differential terms, the purely linear small-signal AC state equation is derived :
$\dot{\hat{x}} = \bar{A}\hat{x} + \bar{B}\hat{u} + [(A_1 - A_2)X + (B_1 - B_2)U]\hat{d}$

Applying the Laplace transform to this differential equation yields the exact control-to-output transfer function $G_{vd}(s)$, which directly dictates the necessary compensation strategy. However, deriving these matrices manually for complex topologies is highly prone to algebraic errors. To simulate this effortlessly in LTspice, engineers rely on an invariant circuit model.

### 1.5 The Invariant PWM Switch Model (Vorpérian)

In 1990, Vatché Vorpérian revolutionized SMPS analysis by observing that the nonlinearity in a PWM converter is entirely confined to the switching cell, which consists solely of the active switch and the passive freewheeling diode . The LC filter elements remain entirely linear. Therefore, instead of averaging the entire circuit equations, one can simply average the voltages and currents across the switching cell alone, creating an invariant PWM Switch Model that can be applied to any topology .

The PWM switch is modeled as a three-terminal device with an Active ($a$) terminal connected to the active switch, a Passive ($p$) terminal connected to the diode, and a Common ($c$) terminal at the junction between the switch and diode . In continuous conduction mode, the averaged large-signal relationships between the terminal currents and voltages are exceptionally elegant:
$i_a = d \cdot i_c$
$v_{cp} = d \cdot v_{ap}$

Because SPICE engines are inherently linear solvers when executing a small-signal AC analysis, LTspice automatically linearizes these non-linear large-signal equations around the computed DC operating point . The subcircuit implementation of the Vorpérian PWM switch in LTspice requires nothing more than Arbitrary Behavioral Sources . 

The netlist representation of a Voltage-Mode CCM PWM Switch in LTspice is implemented via the following text:
```spice
.subckt PWM_VM_CCM a p c d
* Active terminal current is a function of Duty Cycle and Common current
B1 a p I=V(d)*I(V_sense)
* Common terminal voltage is a function of Duty Cycle and Active-to-Passive voltage
B2 c_internal p V=V(d)*V(a,p)
* Dummy zero-volt source to measure the common current for B1
V_sense c_internal c 0
.ends
```
By simply placing this subcircuit into an LTspice schematic and rotating the terminals to match a buck, boost, or SEPIC configuration, the engineer obtains instantaneous access to exact small-signal Bode plots .

### 1.6 The Discrete-Time Modeling Extension (Ridley's Sample and Hold)

While state-space averaging is perfectly adequate for voltage-mode control, it exhibits a catastrophic failure in predicting the dynamics of current-mode control. A current-mode switching regulator relies on an inner loop that commands the peak inductor current . When the duty cycle exceeds fifty percent, the converter is prone to sub-harmonic oscillations at exactly half the switching frequency. Standard continuous-time state-space models fail to predict this instability because the averaging process smears out the switching ripple, which is the very mechanism driving the instability.

To rectify this, Dr. Raymond Ridley introduced a discrete-time modeling extension that captures the sample-and-hold effect of the current-mode modulator . The intersection of the sensed inductor current ramp and the demand current reference acts as a discrete sampling event . Ridley demonstrated that the continuous-time approximation of this discrete-time sample-and-hold function can be modeled as a transfer function $H_e(s)$ placed in the feedback path of the current loop :
$H_e(s) \approx 1 + \frac{s}{\omega_n Q_z} + \frac{s^2}{\omega_n^2}$
Where the resonant frequency $\omega_n$ is situated exactly at half the switching frequency ($\omega_n = \pi / T_s$) . This second-order polynomial introduces a pair of right-half-plane zeros that drastically erode phase margin near the Nyquist frequency . By injecting $H_e(s)$ into the LTspice invariant model, the simulator accurately predicts the high-frequency phase plunge and allows the precise calculation of the external slope compensation ramp required to damp the sub-harmonic double pole .

### 1.7 Translating SSA to Loop Compensation: The K-Factor Method

Once the control-to-output transfer function of the power stage is accurately extracted using the averaged models, the engineer must design a feedback compensator to ensure stability. The compensator processes the output voltage error and generates the duty cycle command. To maximize transient response while guaranteeing a robust phase margin (typically between 45 and 60 degrees), the K-Factor method pioneered by Venable is heavily utilized .

The K-Factor method calculates the exact placement of poles and zeros required to provide a specific phase boost at a chosen crossover frequency ($f_c$) . A Type-II compensator, which utilizes an origin pole, one high-frequency pole, and one low-frequency zero, can provide up to 90 degrees of phase boost . A Type-III compensator introduces a second pole-zero pair, allowing up to 180 degrees of phase boost, making it mandatory for voltage-mode buck converters suffering from the severe -180 degree phase delay of the LC double pole .

The separation factor $k$ determines the geometric distance between the crossover frequency and the compensator's poles and zeros . If the required phase boost is defined as $\phi_{boost}$, the K-factor is calculated as:
$k = \tan\left(\frac{\phi_{boost}}{2} + 45^\circ\right)$

Based on this mathematical foundation, the pole and zero frequencies are symmetrically placed around the crossover frequency to maximize the phase margin exactly where the loop gain crosses 0 dB . 

*Table 1.2: Venable K-Factor Pole and Zero Placement for Type-III Compensation*

| Compensator Feature | Frequency Calculation | Mathematical Implication | Component Calculation (Given $R_1$)  |
| :--- | :--- | :--- | :--- |
| Zero 1 ($f_{z1}$) | $f_c / k$ | Cancels the first LC filter pole, arresting the gain roll-off. | $C_2 = \frac{1}{2\pi \cdot f_{z1} \cdot R_2}$ |
| Zero 2 ($f_{z2}$) | $f_c / k$ | Cancels the second LC filter pole, providing maximum phase boost at $f_c$. | $R_3 = \frac{R_1 \cdot f_{z2}}{f_{p1} - f_{z2}}$ |
| Pole 1 ($f_{p1}$) | $f_c \cdot k$ | Attenuates high-frequency noise and switching ripple above crossover. | $C_1 = \frac{C_2}{(2\pi \cdot f_{p1} \cdot R_2 \cdot C_2) - 1}$ |
| Pole 2 ($f_{p2}$) | $f_c \cdot k$ | Counters the ESR zero of the output capacitor, forcing gain down at high frequency. | $C_3 = \frac{1}{2\pi \cdot f_{p2} \cdot R_3}$ |
| DC Gain ($K_{dc}$) | $2\pi f_c \cdot C_1$ | Sets the origin pole to eliminate steady-state DC error. | $R_2 = \frac{K_{dc} \cdot R_1}{G_{plant\_fc}}$ |

By implementing these precise RC resistor and capacitor values into the error amplifier topology within LTspice, the designer can mathematically guarantee the loop response prior to running a single time-domain simulation.

### 1.8 Exact Parasitic Modeling and Full `.asc` Schematic Text

A high-fidelity state-space or transient simulation is entirely voided if the reactive components are treated as ideal. Modern multilayer ceramic capacitors and power inductors exhibit highly complex, frequency-dependent behaviors. 

Consider an inductor selected for a high-current application. In LTspice, this inductor must be modeled not just by its inductance, but by its Direct Current Resistance (DCR), which dictates the DC conduction loss . Furthermore, the parallel capacitance ($C_p$) represents the inter-winding capacitance, dictating the self-resonant frequency . In time-domain simulations, $C_p$ is solely responsible for the extreme high-frequency ringing observed on the switch node during the dead-time transitions . Finally, the parallel resistance ($R_{par}$) represents the frequency-dependent core losses of the magnetic material . Omitting $R_{par}$ will result in artificially high Q-factors in AC analysis and under-reported losses in efficiency calculations.

To codify the integration of the Vorpérian PWM Switch model and the exact parasitic parameters discussed above, we utilize the raw syntax of an LTspice schematic file (`.asc`). LTspice saves schematics in a plain-text format consisting of geometric plotting coordinates for `WIRE` directives and `TEXT` flags for SPICE directives . 

Below is the complete text representation of an LTspice `.asc` file for the small-signal AC analysis of a Buck converter using the invariant CCM switch model. This schematic structure can be copied into a standard text editor and saved as `AC_Buck_Averaged.asc` to instantly generate the circuit.

Version 4
SHEET 1 1140 680
WIRE 160 -160 -16 -160
WIRE 304 -160 240 -160
WIRE 432 -160 304 -160
WIRE 528 -160 512 -160
WIRE 528 -144 528 -160
WIRE 672 -144 528 -144
WIRE -16 -64 -16 -160
WIRE 240 -64 240 -160
WIRE 432 -64 432 -160
WIRE 672 -64 672 -144
WIRE -16 64 -16 16
WIRE 160 64 160 -16
WIRE 240 64 240 16
WIRE 304 64 304 -160
WIRE 432 64 432 16
WIRE 672 64 672 16
WIRE 160 112 160 64
WIRE 304 112 304 64
WIRE -16 144 -16 64
WIRE 160 144 160 112
WIRE 240 144 240 64
WIRE 304 144 304 112
WIRE 432 144 432 64
WIRE 672 144 672 64
WIRE 160 144 -16 144
WIRE 240 144 160 144
WIRE 304 144 240 144
WIRE 432 144 304 144
WIRE 672 144 432 144
WIRE -16 192 -16 144
FLAG -16 192 0
FLAG 672 -144 Vout
FLAG -16 -160 Vin
SYMBOL voltage -16 -80 R0
SYMATTR InstName V1
SYMATTR Value 12
SYMATTR AC 0
SYMBOL res 656 -80 R0
SYMATTR InstName R_load
SYMATTR Value 0.048
SYMBOL ind 416 -80 R0
SYMATTR InstName L1
SYMATTR Value 0.33u
SYMATTR SpiceLine Rser=0.0008 Cpar=5.5p Rpar=1200
SYMBOL cap 224 -80 R0
SYMATTR InstName C_out
SYMATTR Value 240u
SYMATTR SpiceLine Rser=0.001 Lser=0.2n
SYMBOL voltage 160 -32 R0
SYMATTR InstName V_d
SYMATTR Value 0.1
SYMATTR AC 1
SYMBOL AutoGenerated\\PWM_VM_CCM 304 112 R180
SYMATTR InstName X1
TEXT -40 -200 Left 2 !.ac dec 100 100 1Meg
TEXT -40 -230 Left 2 !.param D=0.1
TEXT -40 -260 Left 2 !.options method=gear reltol=1e-3
TEXT -40 -290 Left 2 * AC Small Signal Averaged Buck

The parsing structure of the `.asc` file is highly rigid. The `FLAG` token defines nodal names and ground connections . The `SYMBOL` block calls the exact component geometry, while the `SYMATTR` blocks dynamically inject the SPICE parameters . The `SYMATTR SpiceLine Rser=0.0008 Cpar=5.5p Rpar=1200` line directly embeds the precise inductor parasitics into the LTspice solver without cluttering the schematic visual with individual discrete components . 

The integration of the `!.ac dec 100 100 1Meg` directive forces the simulator to perform a small-signal frequency sweep from 100 Hz to 1 MHz. The stimulus for this sweep is the AC perturbation injected via the `V_d` source, representing the small-signal duty cycle $\hat{d}$ . This layout embodies the pinnacle of analytical efficiency, yielding infinite-resolution Bode plots of the uncompensated plant dynamics in milliseconds, bypassing the massive computational overhead of brute-force time-domain integration. 



## Sources

- [**scribd.com** LTSpice Help | PDF | Spice | Trigonometric Functions - Scribd](https://www.scribd.com/document/273806514/LTSpice-Help)
- [**ez.analog.com** Ringing in voltage source (0V) used as current meter - Q&A - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/600042/ringing-in-voltage-source-0v-used-as-current-meter)
- [**we-online.com** LTspice examples](https://www.we-online.com/files/pdf1/ltspice-examples.pdf)
- [**youtube.com** Introducing LTspice 24 - YouTube](https://www.youtube.com/watch?v=36TrOs2qwJA)
- [**ieee.li** Circuit Simulation Primer For The Power Electronics Engineer](https://www.ieee.li/pdf/viewgraphs/circuit-simulation-primer-for-the-power-electronics-engineer.pdf)
- [**scribd.com** Transfer Function Modeling For The Buck Converter: Sanda Lefteriu](https://www.scribd.com/document/413706557/lefteriu2016)
- [**preprints.org** Advanced AC Equivalent Circuit Modeling of PWM Converters Using](https://www.preprints.org/manuscript/202505.0668)
- [**arxiv.org** A Building-Block Approach to State-Space Modeling of DC ... - arXiv](https://arxiv.org/pdf/1908.04594)
- [**scribd.com** State-Space Averaging in Power Converters - Scribd](https://www.scribd.com/document/686746417/Middlebrook)
- [**dspace.bracu.ac.bd** Thesis Title: State Space Modeling of a BUCK Converter and](https://dspace.bracu.ac.bd/bitstreams/6df43d41-d098-48f6-b829-88246f50d87f/download)
- [**mikrocontroller.net** A GENERAL UNIFIED APPROACH TO MODELLING SWITCHING](https://www.mikrocontroller.net/attachment/124600/SSA_Cuk_Middlebrook.pdf)
- [**scribd.com** Modified Nodal Analysis in Circuit Theory | PDF | Matrix (Mathematics)](https://www.scribd.com/document/652572651/2002-Wedepohl)
- [**scribd.com** Modified Nodal Analysis in Circuit Simulation | PDF - Scribd](https://www.scribd.com/document/277142543/MNA-Stamp)
- [**researchgate.net** The modified nodal approach to network analysis - ResearchGate](https://www.researchgate.net/publication/3184759_The_modified_nodal_approach_to_network_analysis)
- [**researchgate.net** Modified nodal analysis: An essential addition to electrical circuit](https://www.researchgate.net/publication/3406448_Modified_nodal_analysis_An_essential_addition_to_electrical_circuit_theory_and_analysis)
- [**mdpi.com** Assessment of the Current for a Non-Linear Power Inductor ... - MDPI](https://www.mdpi.com/2079-9292/12/3/579)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=337&subsort=1&index=158355)
- [**groups.io** Timestep too small" error while simulation - LTspice - Groups.io](https://groups.io/g/LTspice/topic/timestep_too_small_error/50142172)
- [**ez.analog.com** Simulation running very slow - Q&A - LTspice - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/559640/simulation-running-very-slow)
- [**researchgate.net** (PDF) Design of Type-III Compensator for Fast Dynamic](https://www.researchgate.net/publication/385769811_Design_of_Type-III_Compensator_for_Fast_Dynamic_Performance_in_Buck_Converters)
- [**paperpublications.org** Small Signal Modelling of a Buck Converter using State Space](https://www.paperpublications.org/upload/book/Small%20Signal%20Modelling-783.pdf)
- [**onsemi.com** Simulating Power Supplies with SPICE - onsemi](https://www.onsemi.com/pub/collateral/tnd349-d.pdf)
- [**electronics.stackexchange.com** Average PWM Switch Model - Electrical Engineering Stack Exchange](https://electronics.stackexchange.com/questions/301873/average-pwm-switch-model)
- [**ansyshelp.ansys.com** SMPS - Twin Builder® Components - Ansys Help](https://ansyshelp.ansys.com/public/Views/Secured/Electronics/v252/en/PDFs/SMPS.pdf)
- [**scribd.com** SMPS Simulation Using Spice 3 | PDF | Inductance - Scribd](https://www.scribd.com/document/806166446/Switchmode-Power-Supply-Simulation-With-PSpice-and-SPICE-3-McGraw-Hill)
- [**docs.ampnuts.ru** Understanding and Applying Current-Mode Control Theory](http://docs.ampnuts.ru/ti.com.datasheet/LM43603/Application_note_SNVA555.PDF)
- [**cdn14.21dianyuan.com** A New, Continuous-Time Model For Current-Mode Control](https://cdn14.21dianyuan.com/download.php?id=74016)
- [**scribd.com** Current-Mode Control Modeling Techniques | PDF | Amplifier - Scribd](https://www.scribd.com/document/452813631/A-New-Way-to-Model-Current-Mode-Control-Part-Two-pdf)
- [**ti.com** current-mode modeling for peak, valley and emulated control methods](https://www.ti.com/lit/snva542)
- [**st.com** an5497-introduction-to-the-buck-current-mode-with-the](https://www.st.com/resource/en/application_note/an5497-introduction-to-the-buck-current-mode-with-the-bg474edpow1-discovery-kit-stmicroelectronics.pdf)
- [**thesis.unipd.it** Mixed-Signal Peak-Current-Mode Control of a Buck-Converter](https://thesis.unipd.it/retrieve/31ff8c93-be1a-4557-9e11-0b61818e52d5/Karim_Asif.pdf)
- [**designers-guide.org** An Accurate and Practical Small-Signal Model for Current-Mode](https://designers-guide.org/forum/Attachments/an_accurate_and_practical_small_signal_model_for_current_mode_control.pdf)
- [**mdpi.com** Linear Quadratic Gaussian Controller for Single-Ended Primary](https://www.mdpi.com/1996-1073/17/14/3385)
- [**ieeexplore.ieee.org** Line-Impedance-Immune Decentralized Energy Management](https://ieeexplore.ieee.org/iel8/7054730/8661887/11449536.pdf)
- [**mdpi.com** Computer-Aided Design of Digital Compensators for DC/DC Power](https://www.mdpi.com/1996-1073/11/12/3251)
- [**researchgate.net** Type III Compensator Design for Power Converters - ResearchGate](https://www.researchgate.net/publication/232704936_Type_III_Compensator_Design_for_Power_Converters)
- [**passive-components.eu** B–H Curve-Based Inductor Modelling in LTspice](https://passive-components.eu/b-h-curve-based-inductor-modelling-in-ltspice-a-current-dependent-magnetic-model/)
- [**allaboutcircuits.com** Modeling Inductors with LTspice - Technical Articles](https://www.allaboutcircuits.com/technical-articles/modeling-inductors-with-ltspice/)
- [**hackaday.com** Practical Inductors In LTSpice - Hackaday](https://hackaday.com/2023/07/18/practical-inductors-in-ltspice/)
- [**dev-docs.kicad.org** LTspice - Developer Documentation | KiCad](https://dev-docs.kicad.org/en/import-formats/ltspice/index.html)
- [**analog.com** ltspice-keyboard-shortcuts.pdf - Analog Devices](https://www.analog.com/media/en/news-marketing-collateral/solutions-bulletins-brochures/ltspice-keyboard-shortcuts.pdf?modelType=spice-models)
- [**researchgate.net** Averaged modeling of PWM converters operating in discontinuous](https://www.researchgate.net/publication/3280125_Averaged_modeling_of_PWM_converters_operating_in_discontinuous_conduction_mode)
- [**scribd.com** PSpice Switching Converter Simulations | PDF | Spice - Scribd](https://www.scribd.com/presentation/323491765/Simulation-of-Switching-Converters-ppt)
- [**escholarship.org** Density, High-Efficiency AC/DC and DC - UC Berkeley](https://escholarship.org/content/qt5nd7p886/qt5nd7p886.pdf)
- [**scribd.com** LTspice Help | PDF | Spice | Electrical Network - Scribd](https://www.scribd.com/document/615367782/LTspiceHelp)
- [**industrialmonitordirect.com** Fix MC34063 Buck Converter Simulation: PSpice & Proteus](https://industrialmonitordirect.com/blogs/knowledgebase/troubleshooting-mc34063-buck-converter-spice-simulation-errors)
- [**api.eestar.com** LTspice XVII help 中文翻译版本文由微信公众号电子帮翻译而成](https://api.eestar.com/article/share/2020/10/fda54202010221347106716.pdf)
- [**cdn14.21dianyuan.com** Simplified Analysis of PWM Converters Using Model of PWM Switch](https://cdn14.21dianyuan.com/download.php?id=205832)
- [**researchgate.net** (PDF) PWM-switch modeling of DC-DC converters - ResearchGate](https://www.researchgate.net/publication/3279454_PWM-switch_modeling_of_DC-DC_converters)
- [**powersimtof.com** The PWM switch model introduced by Vatché Vorpérian in 1986](https://powersimtof.com/Downloads/PPTs/PWM%20VM%20into%20CM.pdf)
- [**allaboutcircuits.com** Closed-Loop Control for an LTspice Switching Regulator](https://www.allaboutcircuits.com/technical-articles/closed-loop-control-for-an-ltspice-switching-regulator/)
- [**youtube.com** Le_R4 - DC-DC Converter Control - PWM Switch Simulation LTSpice](https://www.youtube.com/watch?v=6bI-cKLbNvM)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=7364&subsort=1&index=15655)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=7730&before=1140414971000000000&subsort=1&index=9224)
- [**spicelib.readthedocs.io** AscEditor - spicelib documentation - Read the Docs](https://spicelib.readthedocs.io/en/latest/classes/asc_editor.html)
- [**web.mit.edu** Introduction to LTspice SPICE Netlists LTspice - MIT](https://web.mit.edu/6.101/www/s2020/handouts/LTSpiceIntro_4.pdf)
- [**courses.grainger.illinois.edu** LTspice Tutorial Part 2- Components and Basic Interface](https://courses.grainger.illinois.edu/ece110/sp2020/content/labs/Experiments/LTspice%20Tutorial%20Part%202%20-%20Components%20and%20basic%20interface.pdf)
- [**mouser.com** How to Use LTspice Models](https://www.mouser.com/pdfDocs/how_to_use_ltspice_models_an-e.pdf)
- [**electronics.stackexchange.com** LTspice: How to convert .asc file to netlist?](https://electronics.stackexchange.com/questions/106854/ltspice-how-to-convert-asc-file-to-netlist)
- [**koasas.kaist.ac.kr** A state-space modeling of nonideal DC-DC converters - KOASAS](https://koasas.kaist.ac.kr/bitstream/10203/23569/1/A%20STATE-SPACE%20MODELING%20OF%20NON_IDEAL.pdf)
- [**user.unob.cz** State-Space Averaging (SSA) Revisited](https://user.unob.cz/biolek/veda/articles/WSEASTrans_DCDC_SSA.pdf)
- [**researchgate.net** State Space Averaging Technique of Power Converter with Digital](https://www.researchgate.net/profile/Mohammad-Faridun-Naim-Tajuddin/publication/224106992_State_space_averaging_technique_of_power_converter_with_digital_PID_controller/links/54695f430cf20dedafd0d883/State-space-averaging-technique-of-power-converter-with-digital-PID-controller.pdf)
- [**ltwiki.org** .OPTIONS -- Set simulator options - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_OPTIONS_Set_simulator_options.htm)
- [**forum.qorvo.com** Literature on solver options - QSPICE - Qorvo Tech Forum](https://forum.qorvo.com/t/literature-on-solver-options/15757)
- [**ltwiki.org** SPICE: - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/SPICE_.htm)
- [**designers-guide.org** Simulator Options - Designer's Guide Community](https://designers-guide.org/analysis/dg-spice/chA.pdf)
- [**industrialmonitordirect.com** Mastering Circuit Schematics, Nodal Methods, Simulator Limits](https://industrialmonitordirect.com/blogs/knowledgebase/mastering-circuit-schematics-nodal-methods-simulator-limits)
- [**docs.plexim.com** Using PLECS Spice - Plexim documentation site](https://docs.plexim.com/plecs/5.0/spice/using-spice/)
- [**scholarsmine.mst.edu** Modeling the practical performance of switched-capacitor converters](https://scholarsmine.mst.edu/cgi/viewcontent.cgi?article=5861&context=masters_theses)
- [**ee.iitb.ac.in** Techniques for circuit simulation - Electrical Engineering](https://www.ee.iitb.ac.in/~sequel/circuit_sim_1.pdf)
- [**scribd.com** Psbook | PDF | Spice | Amplifier - Scribd](https://www.scribd.com/document/159944812/psbook)
- [**researchgate.net** An advanced PWM-switch model including semiconductor device](https://www.researchgate.net/publication/3280434_An_advanced_PWM-switch_model_including_semiconductor_device_nonlinearities)
- [**rcl-radio.ru** AN1681 (0) VIEW - rcl-radio.ru](https://rcl-radio.ru/wp-content/uploads/2014/09/AN1681.pdf)
- [**journal.sobraep.org.br** K-Factor Method Approach for Voltage Regulation of CCM Boost](https://journal.sobraep.org.br/index.php/rep/article/download/1100/990/1848)
- [**ieeexplore.ieee.org** An Integrated Onboard EV Charger With Wide Voltage Range](https://ieeexplore.ieee.org/iel8/6287639/10820123/11086583.pdf)
- [**ieeexplore.ieee.org** Investigation and Performance Evaluation of Novel Single-Switch](https://ieeexplore.ieee.org/iel8/6287639/10820123/11031407.pdf)
- [**ieeexplore.ieee.org** A Bidirectional Interleaved Totem Pole PFC-Based Integrated On](https://ieeexplore.ieee.org/iel8/6287639/10380310/10606433.pdf)
- [**ieeexplore.ieee.org** An Integrated Onboard EV Charger with Wide Voltage Range](https://ieeexplore.ieee.org/iel8/6287639/6514899/11086583.pdf)
- [**vtechworks.lib.vt.edu** Unified Three-terminal Switch Model for Current Mode Controls](https://vtechworks.lib.vt.edu/bitstream/10919/35647/1/Yan_Y_T_2010.pdf)
- [**scribd.com** Advanced Analog IC Design Overview | Bipolar Junction Transistor](https://www.scribd.com/document/659258079/Advanced-Analog-Integrated-Circuit-Design-B-Murmann)
- [**penzar.com** TopSpice Frequency Response Analysis - Penzar Development](https://penzar.com/topspice/fra/fra.htm)
- [**tdr.lib.ntu.edu.tw** 國立臺灣大學電機資訊學院電機工程學系 博士論文 應用於電腦電源之](https://tdr.lib.ntu.edu.tw/bitstream/123456789/7059/1/ntu-100-1.pdf)
- [**studylib.net** EE214B Advanced Analog IC Design Course Syllabus - studylib.net](https://studylib.net/doc/26226809/advanced-analog-ic-design)
- [**scribd.com** LTspice FRA Guide for Converters | PDF | Electrical Network - Scribd](https://www.scribd.com/document/879159011/Frekans-yan%C4%B1t%C4%B1-analizi)
- [**groups.io** LTspice@groups.io | Documentation for .probe directive](https://groups.io/g/LTspice/topic/documentation_for_probe/81547034)
- [**analog.com** LTspice® How-to: Using the .STEP Directive to Perform Repeated](https://www.analog.com/en/resources/technical-articles/ltspice-using-the-step-command-to-perform-repeated-analysis.html)
- [**cde.nus.edu.sg** LTspice Manual](https://cde.nus.edu.sg/ece/wp-content/uploads/sites/3/2024/09/LTspiceManual.pdf)
- [**researchgate.net** (PDF) Guide to Basics Of LT-SPICE-XVII - ResearchGate](https://www.researchgate.net/publication/376835934_Guide_to_Basics_Of_LT-SPICE-XVII)
