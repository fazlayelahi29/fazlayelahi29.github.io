# State-of-the-Art Semiconductor Modeling and Custom Libraries in LTspice

## Chapter 1: Fundamental Charge Equations and SPICE Syntax Parsing Engine

### 1.1 The Quantum Mechanical and Statistical Foundations of Charge Transport

The modeling of semiconductor devices within a circuit simulator such as SPICE requires the translation of fundamental quantum mechanical and statistical principles into computationally tractable lumped-element equivalent circuits. In physical reality, charge transport within a solid-state lattice is governed by the continuous, three-dimensional partial differential equations of solid-state device physics. The core of this system comprises the Poisson equation, which relates the electrostatic potential to the charge density, and the carrier continuity equations for both electrons and holes. 

The electrostatic potential $\psi$ and the local charge density $\rho$ are linked via the Poisson equation:

$\nabla^2 \psi = -\frac{\rho}{\epsilon_{si}} = -\frac{q}{\epsilon_{si}} (p - n + N_D^+ - N_A^-)$

Simultaneously, the time evolution of the electron concentration $n$ and hole concentration $p$ is defined by the continuity equations, which incorporate the divergence of the current density $\mathbf{J}$, the optical or thermal generation rate $G$, and the recombination rate $R$:

$\frac{\partial n}{\partial t} = \frac{1}{q}\nabla \cdot \mathbf{J}_n + G - R$
$\frac{\partial p}{\partial t} = -\frac{1}{q}\nabla \cdot \mathbf{J}_p + G - R$

The current densities themselves are derived from the drift-diffusion transport model, which is an approximation of the Boltzmann Transport Equation under the assumption of near-equilibrium conditions and relatively low electric fields. However, attempting to simultaneously solve these coupled, non-linear partial differential equations across a large network of interacting devices using finite element analysis or Technology Computer-Aided Design (TCAD) is computationally unfeasible for circuit-level simulation. 

To bridge the gap between rigorous solid-state physics and network analysis, SPICE and its highly optimized derivatives like LTspice rely on the integral charge-control framework. By integrating the continuity equations over the volume of the specific device regions (such as the neutral base of a bipolar transistor or the depletion region of a diode), the spatial dependencies are analytically resolved. This reduces the problem to a system of zero-dimensional, non-linear ordinary differential equations governed exclusively by the boundary conditions at the device terminals. Consequently, the instantaneous terminal current $i(t)$ of any semiconductor device in SPICE is evaluated as the sum of a static transport current $I_{dc}(V)$ and the displacement current resulting from the temporal derivative of the integrated stored charge $Q(t)$:

$i(t) = \frac{dQ(V, t)}{dt} + I_{dc}(V)$

This fundamental simplification requires the simulator to continuously evaluate complex, nonlinear algebraic functions of the terminal voltages, compute their temporal derivatives, and satisfy Kirchhoff’s Current Law (KCL) and Kirchhoff’s Voltage Law (KVL) at every node in the simulated circuit space.

### 1.2 The SPICE Matrix Formulation and Modified Nodal Analysis

To resolve the electrical network defined by these highly nonlinear charge and current equations, the LTspice solver engine relies on a robust numerical algorithm known as Modified Nodal Analysis (MNA). Standard nodal analysis, while sufficient for passive resistive networks or networks driven purely by independent current sources, fails categorically when ideal independent voltage sources, coupled inductors, or voltage-controlled voltage sources are introduced . The primary limitation of standard nodal analysis is that the current flowing through a voltage-defined branch cannot be expressed as a function of the node voltages using a finite conductance. 

MNA circumvents this limitation by expanding the system of unknown variables. In addition to the standard node voltages, MNA introduces specific branch currents—such as those flowing through independent voltage sources and inductors—as independent unknown variables . This yields a linear differential-algebraic system of equations characterized by a blocked matrix structure:

$\begin{bmatrix} \mathbf{G} & \mathbf{B} \\ \mathbf{C} & \mathbf{D} \end{bmatrix} \begin{bmatrix} \mathbf{v} \\ \mathbf{j} \end{bmatrix} = \begin{bmatrix} \mathbf{i} \\ \mathbf{e} \end{bmatrix}$

The structure and physical significance of these matrix blocks dictate how the simulator parses the circuit topology, as delineated in the table below.

| Matrix/Vector Component | Dimension | Physical Definition and Stamping Behavior |
| :--- | :--- | :--- |
| $\mathbf{G}$ | $n \times n$ | The admittance matrix formed by the interconnections of passive elements (resistors, conductors). Diagonal elements represent the sum of conductances connected to a specific node, while off-diagonal elements represent the negative conductance connecting two nodes . |
| $\mathbf{B}$ | $n \times m$ | The connectivity matrix mapping the $m$ voltage-defined branches to the $n$ circuit nodes. Elements are $1$, $-1$, or $0$ depending on the polarity of the connection . |
| $\mathbf{C}$ | $m \times n$ | Often the transpose of $\mathbf{B}$ ($\mathbf{B}^T$) in purely passive networks, representing the voltage-node dependencies for the branch equations . |
| $\mathbf{D}$ | $m \times m$ | A matrix containing the dependencies of the voltage-defined branches on other branch currents, non-zero primarily when current-controlled voltage sources are present . |
| $\mathbf{v}$ | $n \times 1$ | The vector of unknown node voltages to be solved by the simulator . |
| $\mathbf{j}$ | $m \times 1$ | The vector of unknown branch currents flowing through the voltage-defined components . |
| $\mathbf{i}$ | $n \times 1$ | The forcing vector containing the sum of known independent current sources entering each node . |
| $\mathbf{e}$ | $m \times 1$ | The forcing vector containing the known values of the independent voltage sources . |

Because semiconductor devices (such as diodes, BJTs, and MOSFETs) exhibit nonlinear voltage-current and voltage-charge relationships, they cannot be directly stamped into the linear MNA admittance matrix $\mathbf{G}$. Instead, LTspice utilizes the Newton-Raphson iterative algorithm to solve this system . For a generalized nonlinear system formulated as $F(x) = 0$, the Newton-Raphson method iteratively finds successive approximations using the Jacobian matrix $\mathbf{J}$ :

$\mathbf{J}(x^{(k)}) \cdot \Delta x^{(k+1)} = -F(x^{(k)})$
$x^{(k+1)} = x^{(k)} + \Delta x^{(k+1)}$

In the context of electrical networks, the Jacobian matrix essentially represents the small-signal equivalent conductance matrix of the entire circuit evaluated at the specific operating point $x^{(k)}$ . For every nonlinear semiconductor device in the topology, the simulator computes a linear "companion model" at each iterative step . Taking a simple two-terminal nonlinear device with a current $I_D(V_D)$ as an example, the companion model consists of a Norton equivalent circuit comprising a parallel equivalent conductance $G_{eq}$ and an equivalent independent current source $I_{eq}$ .

$G_{eq} = \frac{\partial I_D}{\partial V_D} \bigg|_{V_D^{(k)}}$
$I_{eq} = I_D(V_D^{(k)}) - G_{eq} \cdot V_D^{(k)}$

These companion model values are dynamically stamped into the $\mathbf{G}$ matrix and the right-hand-side vector $\mathbf{i}$ . The simulator repeats this linearization, matrix stamping, and subsequent LU factorization (inversion) until the changes in node voltages and branch currents between successive iterations fall below strict convergence tolerances .

### 1.3 Local Truncation Error and Time-Step Control Algorithms

To perform a transient analysis, the continuous time derivatives of the device charges must be numerically discretized . LTspice utilizes specific numerical integration formulas—primarily the Trapezoidal rule, the Backward Euler method, and Gear's method—to approximate these differential equations . 

When the simulator evaluates the companion model for an energy-storing element like a capacitor or a semiconductor junction capacitance, the continuous current relationship is $i = C \frac{dv}{dt}$. By applying the Backward Euler approximation for a discretised time step $h = t_{n+1} - t_n$, the derivative is replaced by a finite difference calculation :

$i_{n+1} = \frac{C}{h} v_{n+1} - \frac{C}{h} v_n$

This linearizes the reactive element for the current time step, establishing a companion conductance $G_{eq} = \frac{C}{h}$ and a parallel historical current source $I_{eq} = \frac{C}{h} v_n$ that depends entirely on the voltage solved at the previous time step . 

To guarantee both numerical stability and acceptable precision during this integration, the LTspice solver engine continuously monitors a metric known as the Local Truncation Error (LTE) . The LTE mathematically estimates the error introduced by assuming the numerical integration polynomial (e.g., linear for Backward Euler, quadratic for Trapezoidal) accurately matches the true, analytical solution over the specific time step $h$ . If the calculated LTE across any node in the circuit exceeds a predefined boundary, the simulator rejects the currently computed time point, reduces the time step $h$ by a specific factor, and completely recalculates the Jacobian matrix . Conversely, if the LTE is extremely small indicating minimal change in the derivatives, the simulator aggressively increases the time step to accelerate the simulation speed without sacrificing accuracy .

The acceptable bounds for LTE and the success criteria for the Newton-Raphson convergence are rigidly dictated by global simulator options . Understanding these parameters is critical for the modeling engineer aiming to prevent convergence failure in highly non-linear circuits.

| Simulator Option | Default Value | Mathematical Purpose and Convergence Impact |
| :--- | :--- | :--- |
| **RELTOL** | $0.001$ ($0.1\%$) | The relative error tolerance. This mandates the required fractional precision between successive Newton-Raphson iterations. If the expected voltage is 5V, the delta must fall below 5mV . |
| **VNTOL** | $1 \mu V$ | The absolute voltage error tolerance. This parameter provides a noise floor for voltage convergence, preventing RELTOL from demanding impossible precision (e.g., trying to resolve nanovolt changes on a signal swinging near zero volts) . |
| **ABSTOL** | $1 pA$ | The absolute current error tolerance. Similar to VNTOL, this parameter sets the minimum resolvable current delta, allowing convergence when branch currents approach zero . |
| **CHGTOL** | $10 fC$ | The absolute charge tolerance for the numerical integration routines, preventing infinite looping when calculating minute displacement currents . |
| **TRTOL** | $2.0$ | The transient error tolerance. This parameter scales the strictness of the LTE time-step control algorithm. A higher value allows larger time steps by artificially inflating the acceptable error threshold, while a lower value forces tighter, more accurate temporal resolution . |

### 1.4 The LTspice Syntax Parsing Engine and Subcircuit Instantiation

To construct custom libraries containing complex semiconductor devices, the LTspice parsing engine utilizes the `.subckt` directive. Subcircuits represent a foundational abstraction layer, allowing for hierarchical schematic design . By encapsulating raw SPICE primitives—such as core transistors, package parasitic inductances, and temperature-dependent controlled sources—into a single functional block, the user can instantiate the complex model via an `X` prefix in the netlist . 

A critical and highly powerful feature of LTspice's engine is its ability to parse mathematical expressions and pass parameters recursively through these hierarchical blocks . Parameters are defined using the `.param` directive and evaluated using curly braces `{}` . It is vital to note that parameters passed into subcircuits are not evaluated as static numbers at the top level of the netlist; rather, the algebraic expressions themselves are passed and dynamically evaluated within the localized scope of the subcircuit instantiation . This allows for the creation of geometry-scalable models where a single master parameter (like active silicon area) scales all associated physical properties.

```spice
.subckt Custom_BJT_Macro C B E PARAMS: AREA=1.0 MULT=1 IS_T=1e-14
* Parasitic extrinsic base resistance parameterized by layout geometry
Rb_ext B B_int {50 / AREA}
* Package parasitic inductance
L_emit E_int E {1.2n * MULT}
* Internal core device utilizing the passed expression for saturation current
Q1 C B_int E_int NPN_core {AREA}
.model NPN_core NPN(IS={IS_T * MULT} BF=100 VAF=50)
.ends Custom_BJT_Macro
```

In addition to static parameter evaluation, advanced behavioral modeling is achieved using Arbitrary Behavioral Sources (B-sources). These sources allow for the implementation of complex non-linear mathematical expressions directly tied to real-time node voltages or branch currents during the simulation execution. B-sources can evaluate transcendental functions, Boolean logic matrices, and even Laplace transforms, making them indispensable for implementing electrothermal feedback loops and custom compact modeling where standard hard-coded C-language primitives in the simulator core fall short.

## Chapter 2: Diode and BJT Modeling

### 2.1 P-N Junction Physics and SPICE Diode Formulations

The SPICE diode model provides the foundational framework for all semiconductor junction modeling, capturing the mechanisms of DC conduction, reverse avalanche breakdown, junction depletion capacitance, and minority carrier diffusion charge . 

The static DC current $I_D$ flowing through the device is modeled as a superposition of normal forward injection, space-charge recombination, and high-field reverse breakdown mechanisms . The normal forward injection current is governed by the classic Shockley diode formulation:

$I_{fwd} = I_S \left( e^{\frac{V_D}{N V_T}} - 1 \right)$

Here, $I_S$ represents the saturation current, $N$ is the forward emission coefficient (ideality factor), and $V_T = \frac{kT}{q}$ represents the thermal voltage . In physical junctions, particularly at lower forward biases, carrier recombination within the depletion space-charge region becomes non-negligible. This phenomenon is modeled by a secondary exponential term characterized by the recombination saturation current $I_{SR}$ and a recombination emission coefficient $N_R$, which theoretically approaches 2 .

$I_{rec} = I_{SR} \left( e^{\frac{V_D}{N_R V_T}} - 1 \right)$

In the reverse bias regime, the diode model must account for the rapid onset of current when the reverse voltage $V_D$ exceeds the defined breakdown voltage $BV$ . The breakdown current $I_{rev}$ relies on an exponential extrapolation scaled by the reverse breakdown knee current $I_{BV}$ and the breakdown ideality factor $N_{BV}$ .

$I_{rev} = I_{BV} \cdot e^{\frac{-V_D + BV}{N_{BV} V_T}}$

The dynamic, time-domain behavior of the diode is dictated by the total stored charge $Q_d$, comprised of the minority carrier diffusion charge associated with the forward current and the depletion layer charge tied to the voltage across the metallurgical junction . The diffusion charge is modeled as a direct linear function of the forward transit time $TT$, representing the average time minority carriers spend in the neutral region before recombining .

$Q_{diff} = TT \cdot I_{fwd}$

Conversely, the depletion capacitance $C_j$ exhibits a highly non-linear relationship with the applied voltage. Under reverse bias, the capacitance decays predictably as the depletion region physically widens. Under forward bias, however, the standard algebraic formulation approaches a mathematical singularity as the applied voltage $V_D$ approaches the built-in junction potential $V_J$ . To maintain numerical stability and ensure continuous derivatives for the Newton-Raphson solver, the SPICE algorithm partitions the depletion charge equation into two continuous piecewise functions, separated by the forward-bias depletion capacitance coefficient, $FC$ (typically set to 0.5) .

For $V_D < FC \cdot V_J$:
$Q_{junc} = C_{JO} \cdot V_J \frac{1 - \left(1 - \frac{V_D}{V_J}\right)^{1-M}}{1-M}$

For $V_D \ge FC \cdot V_J$, the model utilizes a Taylor series expansion to safely extrapolate the charge without approaching the singularity :
$Q_{junc} = C_{JO} \left( F_1 + \frac{F_3 \cdot (V_D - FC \cdot V_J) + \frac{M}{2 V_J} (V_D^2 - (FC \cdot V_J)^2)}{F_2} \right)$

Where $C_{JO}$ represents the zero-bias junction capacitance, $M$ is the grading coefficient (0.33 for linearly graded junctions, 0.5 for abrupt junctions), and $F_1, F_2, F_3$ are predetermined algebraic constants derived internally from $FC$ and $M$ to enforce mathematical continuity at the boundary condition .

Furthermore, semiconductor junctions are inherently sensitive to temperature variations. The SPICE engine handles thermal tracking through physical parameters such as the energy gap $EG$ (typically $1.11 eV$ for Silicon) and the saturation current temperature exponent $XTI$ (defaulting to 3.0) . The saturation current updates based on the local device temperature $T$ relative to the nominal measurement temperature $T_{NOM}$ using the relationship:

$I_S(T) = I_S(T_{NOM}) \left( \frac{T}{T_{NOM}} \right)^{\frac{XTI}{N}} \cdot \text{exp} \left( \frac{q \cdot EG}{k \cdot N \cdot T_{NOM}} \left( \frac{T - T_{NOM}}{T} \right) \right)$

| Diode SPICE Parameter | Description | Default Value | Physical Implication |
| :--- | :--- | :--- | :--- |
| **IS** | Saturation Current | $1 \times 10^{-14} A$ | Determines the magnitude of the drift-diffusion current under forward and reverse bias . |
| **N** | Emission Coefficient | $1.0$ | Identifies the dominant conduction mechanism (1 for ideal diffusion, 2 for recombination) . |
| **TT** | Transit Time | $0 s$ | Defines the minority carrier lifetime in the neutral region; directly controls the reverse recovery time $t_{rr}$ in switching applications . |
| **CJO** | Zero-Bias Capacitance | $0 F$ | The depletion capacitance at 0V, scaled by the junction area . |
| **M** | Grading Coefficient | $0.5$ | Dictates how capacitance changes with voltage, defined by the doping profile (abrupt vs. graded) . |
| **VJ** | Junction Potential | $1.0 V$ | The built-in potential barrier across the p-n junction . |

```spice
* Highly accurate switching diode model incorporating transit time, grading, and breakdown
.model 1N4148_Custom D(IS=4.35E-9 N=1.906 RS=0.6458
+ IKF=0.106 EG=1.11 XTI=3
+ CJO=2.5p M=0.333 VJ=0.6 FC=0.5 TT=3.48E-9
+ BV=100 IBV=1E-4 NBV=1.5)
```

### 2.2 The Integral Charge-Control Relation and the Gummel-Poon BJT Model

While the Ebers-Moll model provides a simplistic, piece-wise linear approximation of bipolar junction transistor (BJT) behavior suitable for basic large-signal analysis, it fails to capture critical high-performance phenomena. Modern SPICE simulators, therefore, rely entirely on the Gummel-Poon model . Based on the integral charge-control framework formulated by H.K. Gummel and H.C. Poon in 1970, this model elegantly captures complex second-order physical phenomena including the Early effect (base-width modulation), high-level injection (carrier velocity saturation and conductivity modulation), and base push-out (the Kirk effect) .

At the heart of the Gummel-Poon model is the assumption that the dominant terminal currents (the transport current flowing from emitter to collector) are strictly controlled by the total integrated majority carrier charge in the neutral base region . The primary transport current $I_{CC}$ is defined by:

$I_{CC} = \frac{I_S}{q_b} \left( e^{\frac{V_{B'E'}}{N_F V_T}} - e^{\frac{V_{B'C'}}{N_R V_T}} \right)$

Where $V_{B'E'}$ and $V_{B'C'}$ are the intrinsic voltages present directly at the junctions (subtracting the voltage drops across the parasitic bulk resistances), $I_S$ is the transport saturation current, $N_F$ and $N_R$ are the forward and reverse emission coefficients, and $q_b$ is the normalized base charge .

The normalized base charge $q_b$ represents the ratio of the actual instantaneous base charge $Q_b$ to the theoretical zero-bias base charge $Q_{b0}$ . It dynamically alters the transport current based on the applied bias and is computed as the analytical solution to a quadratic equation derived from charge partitioning :

$q_b = \frac{q_1}{2} \left( 1 + \sqrt{1 + 4 q_2} \right)$

The term $q_1$ models the physical modulation of the base width due to the spatial expansion of the depletion regions (the Early effect) . As the collector-base reverse bias increases, the depletion region extends further into the neutral base, narrowing the effective base width. This results in less recombination and a higher current gain. This phenomenon is mathematically parameterized by the forward Early voltage $V_{AF}$ and the reverse Early voltage $V_{AR}$ :

$q_1 = \frac{1}{1 - \frac{V_{B'E'}}{V_{AR}} - \frac{V_{B'C'}}{V_{AF}}}$

The term $q_2$ accounts for the phenomenon of high-level injection . At very high current densities, the concentration of injected minority carriers in the base approaches or exceeds the background majority carrier doping concentration. To maintain charge neutrality, majority carriers flood the base, causing conductivity modulation. This effectively increases the total base charge and subsequently reduces the forward current gain—a phenomenon referred to as $\beta$ roll-off . This behavior is bounded in the model by the forward knee current $I_{KF}$ and the reverse knee current $I_{KR}$ :

$q_2 = \frac{I_f}{I_{KF}} + \frac{I_r}{I_{KR}}$

Where $I_f$ and $I_r$ represent the ideal forward and reverse transport currents calculated before base charge normalization is applied . 

Additionally, the total base current $I_B$ is not perfectly ideal; it consists of ideal transport recombination in the neutral base, as well as non-ideal recombination occurring within the space-charge depletion regions at the junctions . The Gummel-Poon model splits these physical locations into independent exponential components :

$I_B = \frac{I_f}{\beta_F} + I_{SE} \left( e^{\frac{V_{B'E'}}{N_E V_T}} - 1 \right) + \frac{I_r}{\beta_R} + I_{SC} \left( e^{\frac{V_{B'C'}}{N_C V_T}} - 1 \right)$

Where $I_{SE}$ and $I_{SC}$ are the base-emitter and base-collector leakage saturation currents, and $N_E$ and $N_C$ are their respective leakage emission coefficients (typically ranging between 1.5 to 2.0 due to trap-assisted recombination mechanics) .

### 2.3 Advanced BJT Dynamics: Transit Times, Base Push-Out, and Excess Phase

While the DC characteristics are defined by the base charge, the high-frequency AC and non-linear transient performance are overwhelmingly dominated by the device's diffusion capacitances. These capacitances are directly proportional to the forward and reverse transit times, $TF$ and $TR$ . The forward transit time fundamentally represents the average time it takes for an injected minority carrier to physically diffuse across the neutral base region to the collector boundary .

In deep saturation, or when operating at extremely high current densities, the velocity of carriers traversing the collector-base space-charge region reaches its physical saturation limit. This causes a localized build-up of mobile carriers that effectively neutralizes the background doping of the collector epitaxial layer . This neutralizes the junction field and pushes the effective metallurgical base region out into the collector—a phenomenon formally known as the Kirk effect, or base push-out . This widening of the base dramatically increases the transit time, severely degrading the transistor's cut-off frequency $f_T$ .

To accurately represent this, the Gummel-Poon model modifies the baseline ideal forward transit time $TF$ using an empirical multiplier function controlled by three interacting parameters: $XTF$ (the coefficient for transit time bias dependence), $VTF$ (the voltage dependence of transit time), and $ITF$ (the high-current dependence threshold) :

$T_{FF} = TF \cdot \left[ 1 + XTF \cdot \left( \frac{I_f}{I_f + ITF} \right)^2 \cdot e^{\frac{V_{B'C'}}{1.44 \cdot VTF}} \right]$

The effective forward diffusion capacitance is then evaluated dynamically during the transient integration as $C_{diff} = T_{FF} \cdot \frac{\partial I_{CC}}{\partial V_{B'E'}}$ .

Furthermore, to accurately model the physical layout of modern planar bipolar devices, the base-collector junction capacitance must be recognized as spatially distributed. In a physical transistor, only a part of the base-collector capacitance exists directly under the active emitter area (the intrinsic node), while a significant and often dominant portion lies under the extrinsic base contact region . 

The Gummel-Poon SPICE implementation introduces the specific parameter $XCJC$, which dictates the fractional ratio of the total base-collector zero-bias capacitance ($C_{JC}$) connected strictly to the internal intrinsic base node $B'$ . The remainder of the capacitance $(1 - XCJC)$ is connected to the external base node $B$ . 

$C_{BC\_int} = XCJC \cdot C_{BC}(V_{B'C'})$
$C_{BC\_ext} = (1 - XCJC) \cdot C_{BC}(V_{BC'})$

This split is absolutely critical for high-frequency S-parameter modeling and RF design. The extrinsic capacitance creates a direct feed-forward path that bypasses the internal base spreading resistance ($r_{bb'}$), significantly altering the phase margins, stability, and high-frequency gain roll-off of the device . 

Finally, to account for the phase shift introduced by the spatially distributed nature of the base transport mechanism (which a lumped 0D equivalent circuit inherently fails to capture), the $PTF$ parameter is utilized . $PTF$ explicitly specifies the excess phase shift (measured in degrees) that occurs at the cut-off frequency $f_T = \frac{1}{2 \pi TF}$ . The LTspice engine implements this mathematically either as a Bessel polynomial filter or a continuous-time delay block during transient analysis to accurately render the complex pole behaviors of microwave transistors.

### 2.4 Practical Implementation of the Gummel-Poon Model

Integrating the deep theoretical physics discussed above, a complete sub-micron or high-frequency RF BJT model requires the highly deliberate assignment of these parameters. 

| Gummel-Poon Parameter | Description | Physical Mechanism Modeled |
| :--- | :--- | :--- |
| **IS** | Transport Saturation Current | Extrapolated intercept of the ideal Gummel plot determining overall current scaling . |
| **VAF** | Forward Early Voltage | Represents the slope of the $I_C$ vs $V_{CE}$ output characteristic due to base-width modulation . |
| **IKF** | Forward Knee Current | Marks the current level where high-level injection begins, causing the $\beta$ to roll off . |
| **ISE / ISC** | B-E / B-C Leakage Current | Models the non-ideal, trap-assisted recombination occurring in the depletion regions ($N \approx 2$) . |
| **TF** | Ideal Forward Transit Time | Represents base transit speed, dominating diffusion capacitance and high-frequency $f_T$ limit . |
| **ITF** | High Current for TF Dependence | The current threshold where the Kirk effect (base push-out) significantly degrades transit time . |
| **XCJC** | B-C Capacitance Split | Geometrical ratio splitting capacitance between the intrinsic active base and extrinsic base contact . |

The following represents a comprehensively parameterized SPICE model card for a microwave NPN transistor, translating the quantum and charge-control physics into the LTspice `.model` parsing engine:

```spice
* Advanced NPN Gummel-Poon Model Example for High Frequency RF
.model NPN_RF NPN (
+ IS=1.2E-14 BF=150 NF=1.0 VAF=65 IKF=0.08 
+ ISE=3.5E-15 NE=1.5 BR=4 NR=1.0 VAR=15 IKR=0.02
+ ISC=1.0E-14 NC=2.0
+ RB=15 IRB=1E-4 RBM=2 RE=0.2 RC=1.5
+ CJE=2.5p VJE=0.75 MJE=0.33 
+ CJC=1.8p VJC=0.65 MJC=0.33 XCJC=0.65
+ CJS=2.0p VJS=0.7 MJS=0.5
+ TF=15p XTF=1.5 VTF=1.2 ITF=0.1 PTF=20
+ TR=10n EG=1.11 XTI=3.0 KF=1E-15 AF=1.2 )
```

In this implementation, the intrinsic physics of the base-width modulation ($VAF=65$), base push-out driven by velocity saturation ($TF, XTF, VTF, ITF$), and the non-ideal depletion layer recombination ($ISE, ISC$) are perfectly married to the macroscopic geometrical layout constraints dictated by the internal base spreading resistance ($RB, IRB, RBM$) and the distributed intrinsic-extrinsic capacitance splits ($XCJC=0.65$). The LTspice parsing engine linearly scales these parameters through the Area multiplier defined in the component instantiation before constructing the localized Jacobian matrices necessary for the robust Newton-Raphson nonlinear simulation cycle.

## Sources

- [**en.wikipedia.org** Modified nodal analysis - Wikipedia](https://en.wikipedia.org/wiki/Modified_nodal_analysis)
- [**lpsa.swarthmore.edu** Modified Nodal Analysis - printable - Swarthmore College](https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNAAll.html)
- [**spicesharp.github.io** Modified Nodal Analysis](https://spicesharp.github.io/SpiceSharp/articles/custom_components/modified_nodal_analysis.html)
- [**researchgate.net** Overview of SPICE-like circuit simulation algorithms - ResearchGate](https://www.researchgate.net/publication/3348837_Overview_of_SPICE-like_circuit_simulation_algorithms)
- [**uom.lk** modified nodal analysis](https://uom.lk/sites/default/files/elect/files/ee321s3.3.pdf)
- [**ti.com** Accelerating Power-Supply Compliance to Specification](https://www.ti.com/lit/slup308)
- [**arxiv.org** Reliable SPICE Simulations of Memristors, Memcapacitors ... - arXiv](https://arxiv.org/pdf/1307.2717)
- [**ltspicehelpmanual.azurewebsites.net** Set Simulator Options - Introduction](https://ltspicehelpmanual.azurewebsites.net/options--setsimulatoroptions.htm)
- [**analog.com** ltspice-keyboard-shortcuts.pdf - Analog Devices](https://www.analog.com/media/en/news-marketing-collateral/solutions-bulletins-brochures/ltspice-keyboard-shortcuts.pdf?modelType=spice-models)
- [**scribd.com** Spice Commands and User Manual | PDF - Scribd](https://www.scribd.com/document/408731648/spice-commands-and-user-manual)
- [**spiceman.net** LTspice-Addition of Sub-circuit model(.subckt) - Spiceman](https://spiceman.net/ltspice-subcircuit-model-add/)
- [**scribd.com** Creating Subcircuits in LTspice | PDF | Spice - Scribd](https://www.scribd.com/document/102353048/LTspice-subcircuit-tutorial)
- [**ltwiki.org** .PARAM -- User-defined parameters - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_PARAM_User_defined_parameters.htm)
- [**eevblog.com** LTSpice XVII sweeping or stepping subckt parameters - EEVblog](https://www.eevblog.com/forum/projects/ltspice-xvii-sweeping-or-stepping-subckt-parameters/)
- [**mathworks.com** SPICE Diode - SPICE-compatible diode - MATLAB - MathWorks](https://www.mathworks.com/help/sps/ref/spicediode.html)
- [**allaboutcircuits.com** SPICE Models | Diodes and Rectifiers | Electronics Textbook](https://www.allaboutcircuits.com/textbook/semiconductors/chpt-3/spice-models/)
- [**skyworksinc.com** Varactor SPICE Models for RF VCO Applications - Skyworks](https://www.skyworksinc.com/-/media/SkyWorks/Documents/Products/1-100/Varactor_SPICE_Model_AN_200315C.pdf)
- [**engineering.purdue.edu** SPICE Version 2G6 User's Guide - Purdue College of Engineering](https://engineering.purdue.edu/~ee255/design_hub_files/References/SpiceManual.pdf)
- [**scribd.com** SPICE 2G Circuit Simulation Guide | PDF - Scribd](https://www.scribd.com/document/531130458/SPICE-Version-2G-User-s-Guide)
- [**ltwiki.org** Q. Bipolar transistor - LTwiki](https://ltwiki.org/files/LTspiceHelp.chm/html/Q-device.htm)
- [**kolegite.com** THE SPICE BOOK](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%B0%D0%BD%D0%B5%D1%82%D0%BE%20%D0%B2%20%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0%D1%82%D0%B0/The%20SPICE%20Book%20by%20Andrei%20Vladimirescu%20%28z-lib.org%29.pdf)
- [**scribd.com** Gummel-Poon Charge BJT | PDF | Bipolar Junction Transistor - Scribd](https://www.scribd.com/document/607297540/Gummel-Poon-charge-bjt)
- [**designers-guide.org** 1 Introduction - Designer's Guide Community](https://designers-guide.org/vbic/documents/VbicText.pdf)
- [**jpier.org** modeling of bipolar junction transistor in fdtd simulation of printed](https://www.jpier.org/ac_api/download.php?id=020130)
- [**qrpforum.de** G U M M E L - P O O N B I P O L A R M O D E L - QRP-Forum](https://www.qrpforum.de/index.php?attachment/4284-gp-docu-pdf/)
- [**scribd.com** Gummel-Poon Model for Bipolar Transistors | PDF - Scribd](https://www.scribd.com/document/163356228/Gummel-Pool-Bjt)
- [**spiceopus.si** SPICE3 Version 3f3 User's Manual - SPICE OPUS](http://www.spiceopus.si/download/spice3_manual.pdf)
- [**fscdn.rohm.com** Overview of ROHM's Simulation Models for Bipolar Transistors](https://fscdn.rohm.com/en/products/databook/applinote/discrete/transistor/overview_of_rohms_simulation_models_for_bipolar_transistors_an-e.pdf)
- [**dr.lib.iastate.edu** Computer simulation and waveform measurements of pulsed L](https://dr.lib.iastate.edu/bitstreams/27081b26-7ed8-45f8-b2b5-71c726095a91/download)
- [**preserve.lehigh.edu** Physics-based modeling and characterization of ... - Lehigh Preserve](https://preserve.lehigh.edu/system/files/derivatives/coverpage/390568.pdf)
- [**scribd.com** Hspice Elem Device Models | PDF | Bipolar Junction Transistor | Spice](https://www.scribd.com/document/39882459/Hspice-Elem-Device-Models)
- [**people.inf.ethz.ch** Principles Circuit Modeling](https://people.inf.ethz.ch/fcellier/Pubs/BG/springer_chap6.pdf)
- [**people.ece.ubc.ca** Model Parameters - People](https://people.ece.ubc.ca/robertor/Links_files/Files/ICCAP-2008-doc/icmdl/icmdl084.html)
- [**users.fit.cvut.cz** Untitled - Sign in to your account](https://users.fit.cvut.cz/~lorencz/clanky/6_Novel_Extraction_Method_2000.pdf)
- [**collectionscanada.gc.ca** compact modelling - for integrated circuit design](https://www.collectionscanada.gc.ca/obj/s4/f2/dsk2/ftp01/MQ27007.pdf)
- [**groups.io** Passing a text parameter to a subcircuit - LTspice - Groups.io](https://groups.io/g/LTspice/topic/passing_a_text_parameter_to_a/99727258)
- [**simplistechnologies.com** Passing Parameters into Subcircuits Using the PARAMS Property](https://www.simplistechnologies.com/documentation/simplis/ast_05/topics/appendix_5a_passing_parameters_into_subcircuits_using_the_params_property.htm)
- [**ez.analog.com** Need help understanding syntax of subckt - Q&A - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/567325/need-help-understanding-syntax-of-subckt)
- [**youtube.com** Sub circuit with Symbol and parameters in LTSpice (English).](https://www.youtube.com/watch?v=uOjkZM3p6Lg)
- [**youtube.com** Extracting Spice Diode Capacitance Models - YouTube](https://www.youtube.com/watch?v=Q7TJ8P7HBYk)
- [**sites.units.it** SPICE: - PHP 8.2.31 - UniTS](https://sites.units.it/carrato/didatt/doc/spice.pdf)
- [**engineering.upenn.edu** PSpice Reference Guide - Penn Engineering](https://www.engineering.upenn.edu/~jan/spice/PSpice_ReferenceguideOrCAD.pdf)
- [**digikey.nl** APN1004: Varactor SPICE Models for RF VCO Applications](https://www.digikey.nl/Site/Global/Layouts/DownloadPdf.ashx?pdfUrl=7DADA02FC6724344A21B26383589AA68)
- [**diyaudio.com** Rectifier Applications - diyAudio](https://www.diyaudio.com/community/attachments/rectifier-applications-handbook-pdf.1364247/)
- [**convexoptimization.com** SPICE DEVICE MODELS AND DESIGN SIMULATION EXAMPLES](https://convexoptimization.com/TOOLS/Sedra.pdf)
- [**woody.us.es** WinSpice3 User's Manual](https://woody.us.es/ASIGN/TCEF_1T/Prob/WSpiceman.pdf)
- [**scribd.com** Gummel-Poon Bipolar Model Guide | PDF - Scribd](https://www.scribd.com/document/645521254/Sischka-2001-Agilent-GP)
- [**qucs.github.io** Component Reference - Qucs](http://qucs.github.io/qucs-manual/0.0.19/html-en/component_reference.html)
- [**aeroelectric.com** Practical Electronics Handbook - AeroElectric](http://www.aeroelectric.com/Reference_Docs/Books/Practical_Electronics_Handbook_6th_ed.pdf)
- [**static.fossee.in** Imran Farhat.pdf - Semester Long Internship Spring 2026 - FOSSEE](https://static.fossee.in/fossee/reports-2026/semester-long-internship-2026/Semlong-internship-2026-eSim/Imran%20Farhat.pdf)
- [**pdfcoffee.com** ARRL Handbook For Radio Communications 2014 - pdfcoffee.com](https://pdfcoffee.com/arrl-handbook-for-radio-communications-2014-pdf-free.html)
- [**scribd.com** Modified Nodal Analysis | PDF | Matrix (Mathematics) - Scribd](https://www.scribd.com/document/1012264757/Modified-Nodal-Analysis)
- [**docs.lib.purdue.edu** A STUDY OF NUMERICAL INTEGRATION TECHNIQUES FOR USE](https://docs.lib.purdue.edu/cgi/viewcontent.cgi?article=1301&context=ecetr)
- [**ngspice.sourceforge.io** ngspice-44-manual.pdf](https://ngspice.sourceforge.io/docs/ngspice-44-manual.pdf)
- [**vbn.aau.dk** Efficient Automated Design and Optimization for Wide-Bandgap](https://vbn.aau.dk/files/752350357/PHD_PPK_ONLINE.pdf)
- [**simetrix.co.uk** SIMETRIX SIMULATOR REFERENCE MANUAL](https://www.simetrix.co.uk/Files/manuals/9.3/SimulatorReference.pdf)
- [**cmosedu.com** BSIM4 User's Manual - CMOSedu.com](https://cmosedu.com/cmos1/BSIM4_manual.pdf)
- [**scribd.com** BSIM4 Manual | PDF | Mosfet | Dielectric - Scribd](https://www.scribd.com/document/41887274/BSIM4-Manual)
- [**venus-ngl.tele.ntnu.no** AIM-Spice Reference Manual Version 2020.100 July 2020](http://venus-ngl.tele.ntnu.no/downloads/aimspiceref.2020.100.pdf)
- [**ngspice.sourceforge.io** BSIM4v4.8.0 MOSFET Model - Ngspice](https://ngspice.sourceforge.io/external-documents/models/BSIM480_Manual.pdf)
- [**scribd.com** BSIM4 4.8.1 Technical Manual | PDF | Field Effect Transistor - Scribd](https://www.scribd.com/document/507835958/BSIM4-4-8-1-Technical-Manual)
- [**kolegite.com** Compact Models User Guide](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%B0%D0%BD%D0%B5%D1%82%D0%BE%20%D0%B2%20%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0%D1%82%D0%B0/Sentaurus_manuals/PDFManual/data/cm_ug.pdf)
- [**people.ece.ubc.ca** SPICE Model Parameters for BSIM4.5.0 - People](https://people.ece.ubc.ca/robertor/Links_files/Files/ICCAP-2008-doc/icmdl/icmdl048.html)
- [**home.iitk.ac.in** BSIM-BULK: Industry Standard SPICE Model for Analog ... - IIT Kanpur](https://home.iitk.ac.in/~chauhan/2020_Q4_BSIM-BULK_HV.pdf)
- [**www2.eecs.berkeley.edu** BSIM4.1.0 MOSFET Model - EECS at Berkeley](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2000/Archive/ERL-00-48.pdf)
- [**researchgate.net** (PDF) A generalized EKV charge-based MOSFET model including](https://www.researchgate.net/publication/348342027_A_generalized_EKV_charge-based_MOSFET_model_including_oxide_and_interface_traps)
- [**cambridge.org** Basic Transistor Modeling (Chapter 2) - Systematic Design of](https://www.cambridge.org/core/books/systematic-design-of-analog-cmos-circuits/basic-transistor-modeling/C4EDB3A8B5F2687EDE98E9D98EB71F37)
- [**scribd.com** EKV v2.6 MOSFET Model Tutorial | PDF | Field Effect Transistor](https://www.scribd.com/document/108821185/Ekv-param-Extarct)
- [**valvol.xyz** Configure the hysteretic core model of the LTspice simulator](http://valvol.xyz/en/calc_gm.php)
- [**luminusdevices.zendesk.com** Using SPICE to Perform Transient Thermal Modeling](https://luminusdevices.zendesk.com/hc/en-us/articles/44419356146701-Thermal-Using-SPICE-to-Perform-Transient-Thermal-Modeling)
- [**fscdn.rohm.com** How to Use Thermal Models](https://fscdn.rohm.com/en/products/databook/applinote/discrete/sic/common/how_to_use_thermal_models_an-e.pdf)
- [**article.sapub.org** The Electro-Thermal Sub Circuit Model for Power Mosfets](http://article.sapub.org/10.5923.j.msse.20120102.02.html)
- [**tsapps.nist.gov** Thermal component models for electrothermal network simulation](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=28551)
- [**mdpi.com** LTspice Electro-Thermal Model of Joule Heating in High Density](https://www.mdpi.com/2079-9292/8/12/1453)
- [**scispace.com** Thermal and electro-thermal modeling of components and systems](https://scispace.com/pdf/thermal-and-electro-thermal-modeling-of-components-and-23we7jk7fi.pdf)
- [**researchgate.net** (PDF) LTspice Electro-Thermal Model of Joule Heating in High](https://www.researchgate.net/publication/337699548_LTspice_Electro-Thermal_Model_of_Joule_Heating_in_High_Density_Polyethylene_Optical_Fiber_Microducts)
- [**community.infineon.com** Types of thermal models and how to find thermal network coefficients](https://community.infineon.com/t5/Knowledge-Base-Articles/Types-of-thermal-models-and-how-to-find-thermal-network-coefficients/ta-p/974861)
- [**mathworks.com** Foster Thermal Model - Heat transfer through a semiconductor module](https://www.mathworks.com/help/simscape-electrical/ref/fosterthermalmodel.html)
- [**efficiencywins.nexperia.com** Nexperia's Foster and Cauer Thermal Models Accelerate Thermal](https://efficiencywins.nexperia.com/efficient-products/nexperia-s-foster-and-cauer-thermal-models-accelerate-thermal-design)
- [**repositorio.tec.mx** Untitled](https://repositorio.tec.mx/server/api/core/bitstreams/ba85e0c9-3925-4c8a-b972-e6bb585edde5/content)
- [**scribd.com** Micro-Cap 9: Electronic Circuit Analysis Program Reference Manual](https://www.scribd.com/document/72468377/rm)
- [**personal.utdallas.edu** BSIM3v3.2.2 MOSFET Model](https://personal.utdallas.edu/~yxc101000/courses/7327/handout/bsim3v322.pdf)
- [**people.ece.ubc.ca** SPICE Model Parameters - People](https://people.ece.ubc.ca/robertor/Links_files/Files/ICCAP-2008-doc/icmdl/icmdl05a8.html)
- [**ngspice.sourceforge.io** BSIM3v3.3 MOSFET Model - Ngspice](https://ngspice.sourceforge.io/external-documents/models/bsim330_manual.pdf)
- [**docenti.ing.unipi.it** BSIM3v3 Manual](https://docenti.ing.unipi.it/~a008309/mat_stud/PSM/Archive/2016/Approfondimenti/bsimset.pdf)
- [**edadownload.software.keysight.com** MOSFET Models - Keysight](https://edadownload.software.keysight.com/eedl/iccap/2012_01/pdf/mosfet.pdf)
- [**scribd.com** BSIM3v3 Manual | PDF | Doping (Semiconductor) | Mosfet - Scribd](https://www.scribd.com/document/1058329933/BSIM3v3-Manual)
- [**kobaweb.ei.st.gunma-u.ac.jp** High-Voltage MOS Device Modeling with BSIM3v3 SPICE Model](https://kobaweb.ei.st.gunma-u.ac.jp/news/pdf/e82-c_4_630.pdf)
- [**intra.ee.ucr.edu** APPENDIX A: Parameter List](https://intra.ee.ucr.edu/~rlake/EE135/SPICE/BerkeleySpice/BSIMv323/appa.pdf)
- [**venus-ngl.tele.ntnu.no** AIM-Spice Reference Manual](http://venus-ngl.tele.ntnu.no/downloads/aimspiceref.pdf)
- [**people.engr.tamu.edu** HSPICE MOSFET Models Manual](https://people.engr.tamu.edu/spalermo/ecen474/hspice_mosfet.pdf)
- [**edaboard.com** Understanding the inversion coefficient proposed by EKV - EDABoard](https://www.edaboard.com/threads/understanding-the-inversion-coefficient-proposed-by-ekv.385317/)
- [**emo.org.tr** MOSFET MODELING WITH EKV 2.6 AND ANALOG CIRCUIT](https://www.emo.org.tr/ekler/a22c0c0a4515485_ek.pdf)
- [**researchgate.net** Is there any specific model for MOSFET's pinch off voltage?](https://www.researchgate.net/post/Is-there-any-specific-model-for-MOSFETs-pinch-off-voltage)
- [**ee.iitb.ac.in** The EPFL-EKV MOSFET Model Equations for Simulation](https://www.ee.iitb.ac.in/student/~vharihar/ekv_v262.pdf)
- [**infoscience.epfl.ch** A generalized EKV charge-based MOSFET model including oxide](https://infoscience.epfl.ch/bitstreams/d4aebfb5-4716-47aa-af5e-2809a6f552ad/download)
- [**resolve.cambridge.org** 11 Overview of MOSFET models and parameter extraction for design](https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/A0FF4FF398156F0C3003D856767B6ADD/9780511803840c11_p452-482_CBO.pdf/overview_of_mosfet_models_and_parameter_extraction_for_design.pdf)
- [**courses.ece.ucsb.edu** ECE 225 - Lecture 4 MOS & MOSFET Review](https://courses.ece.ucsb.edu/ECE225/225_S17Banerjee/Lectures/Lecture%204.pdf)
- [**youtube.com** EKV Model: MOS Transistor Modeling at All Inversion Levels](https://www.youtube.com/watch?v=27mKoIsoNlE)
- [**thesis.unipd.it** Physics-Based Compact Model for p-GaN/AlGaN/GaN HEMTs](https://thesis.unipd.it/retrieve/e4dc881c-fb0d-4290-91a0-9110dc8bb289/Master_Thesis.pdf)
- [**researchgate.net** Saturation velocity in a GaN HEMT as a function of electron density.](https://www.researchgate.net/figure/Saturation-velocity-in-a-GaN-HEMT-as-a-function-of-electron-density-a-3D-model-b-2D_fig4_305741607)
- [**scribd.com** Advanced SPICE Model For GaN HEMTs | PDF - Scribd](https://www.scribd.com/document/765802032/Advanced-SPICE-Model-for-GaN-HEMTs)
- [**mos-ak.org** GaN HEMT SPICE Model Standard for Power & RF - MOS-AK](https://www.mos-ak.org/washington_dc_2015/presentations/T06_Samuel_Mertens_MOS-AK_Washington_DC_2015.pdf)
- [**research.chalmers.se** Parameter Extraction and SPICE Modeling of Packaged GaN Power](https://research.chalmers.se/publication/552294/file/552294_Fulltext.pdf)
- [**opus4.kobv.de** Physics-based trap modeling of GaN HEMTs - OPUS](https://opus4.kobv.de/opus4-btu/files/6933/Petros_Beleniotis.pdf)
- [**ias.ac.in** GaN HEMTs: Device architectures, analytical models, and](https://www.ias.ac.in/article/fulltext/boms/049/0120)
