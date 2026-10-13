# Advanced Foundry-Level Semiconductor Device Physics and LTspice PDK Architecture

## Introduction

The accurate translation of semiconductor physics into deterministic circuit simulation environments requires an exhaustive understanding of device-level quantum mechanics, charge control paradigms, and transient numerical integration algorithms. Standard compact models often lack the parameterization necessary to capture deep sub-micron quantum tunneling, multi-dimensional parasitic arrays, dynamic charge trapping, and wide-bandgap electrothermal dynamics. Developing a Process Design Kit (PDK) that operates flawlessly in a robust engine like LTspice necessitates mastering the mathematical interplay between partial differential equations, Modified Nodal Analysis (MNA), and subcircuit (`.subckt`) hierarchies. 

This report provides a definitive architectural blueprint for translating complex physical realities—ranging from advanced Gummel-Poon charge paradigms and the unified EKV formulation to dynamic charge-trapping in Gallium Nitride (GaN) HEMTs—into foundry-grade LTspice component models. Through a meticulous synthesis of mathematical modeling, algorithmic transient analysis, and precise text-based model programming, this document details the state-of-the-art methodologies in SPICE-based physical emulation.

## Chapter 1: Fundamental Charge Equations and the SPICE Parser

At the core of the LTspice engine is a robust numerical parser designed to solve non-linear differential equations using Modified Nodal Analysis (MNA). To evaluate dynamic charge storage and semiconductor non-linearities, the engine translates physical capacitance into voltage-dependent charge equations. Unlike earlier iterations of Berkeley SPICE that suffer from severe numerical discontinuities during Newton-Raphson iteration, LTspice enforces continuous first and higher-order derivatives across all fundamental device equations . 

### Non-Linear Charge Formulation and Conservation

Capacitance in a semiconductor junction is fundamentally non-linear, as it relies on the dynamic width of the depletion region, which fluctuates under applied bias voltage. Rather than evaluating capacitance locally at each time step—which inherently violates charge conservation over long transient runs—the LTspice engine integrates capacitance to track the absolute state variable of charge, $Q$ . The charge $Q$ at a given node is evaluated as the integral of the voltage-dependent capacitance:

$Q(V) = \int_{0}^{V} C(v) \, dv$

For a standard PN junction, the non-linear depletion charge $Q_j$ is given by:

$Q_j(V) = \frac{C_{j0} \cdot V_{bi}}{1 - m} \left[ 1 - \left( 1 - \frac{V}{V_{bi}} \right)^{1-m} \right]$

where $C_{j0}$ is the zero-bias junction capacitance, $V_{bi}$ is the intrinsic built-in potential of the silicon lattice, and $m$ is the doping grading coefficient. By maintaining charge as the primary state variable, the simulator ensures that displacement currents ($i = \frac{dq}{dt}$) are strictly conserved.

### Integration Methods: Trapezoidal, Modified Trap, and Gear

The simulator resolves these continuous charge equations over time using implicit numerical integration. Traditional SPICE implementations default to the standard Trapezoidal rule, which can induce numerical artifacts or "ringing" in highly non-linear power switching circuits . LTspice defaults to a proprietary Modified Trapezoidal integration, which maintains the speed and accuracy of standard trapezoidal methods while applying precision algorithmic damping to eliminate non-physical numerical ringing . The standard trapezoidal approximation estimates the next state vector as:

$x_{n+1} = x_n + \frac{h}{2} (f(t_n, x_n) + f(t_{n+1}, x_{n+1}))$

While Modified Trapezoidal integration is generally superior for preserving oscillator loop dynamics and high-Q resonant tanks, specific switching topologies may require alternative solvers. Gear integration, a backward differentiation formula (BDF), introduces artificial numerical damping that forcefully suppresses ringing but can over-stabilize oscillatory phenomena . Additionally, a first-order Backward Euler method can be forced for diagnostic stability. To manipulate these integration algorithms in a schematic, SPICE directives are explicitly defined by the PDK architect .

| SPICE Directive | Integration Method | Characteristics |
| :--- | :--- | :--- |
| `.options method=trap` | Standard Trapezoidal | Fast, high accuracy, susceptible to numerical ringing. |
| `.options method=modified_trap` | Modified Trapezoidal | LTspice default. High accuracy, cancels trapezoidal ringing. |
| `.options method=gear` | Gear (2nd Order BDF) | Artificial damping. High numerical stability, poor for LC oscillators. |
| `.options maxord=1` | Backward Euler | 1st Order method. Extreme stability, lowest precision for highly transient AC. |

To enforce Gear integration and adjust convergence tolerances for a rugged power simulation, the following SPICE directive is embedded in the schematic :

```spice
.options method=gear reltol=0.005 abstol=1e-10 gshunt=1e-15 itl4=50
```

## Chapter 2: Advanced Diode and BJT Modeling

The bipolar junction transistor (BJT) fundamentally relies on minority carrier diffusion across a narrow base region. The legacy Ebers-Moll model lacks the physical complexity to account for high-level injection phenomena, base-width modulation (the Early effect), and base push-out. The Gummel-Poon integral charge-control model resolves these theoretical limitations by defining a normalized base charge parameter, $q_b$, which dynamically scales the current transport based on localized charge density.

### The Gummel-Poon Charge Control Paradigm

In the Gummel-Poon formulation, the intrinsic forward and reverse collector currents are modulated by the total majority carrier charge in the base, denoted as $Q_B$. The normalized base charge $q_b = Q_B / Q_{B0}$ directly dictates the magnitude of the main current transport mechanism:

$I_{CC} = \frac{I_S}{q_b} \left[ \exp\left(\frac{V_{BE}}{N_F V_T}\right) - \exp\left(\frac{V_{BC}}{N_R V_T}\right) \right]$

The parameter $q_b$ is defined by two primary non-linear components. The first factor, $q_1$, models the Early effect, where the effective base width decreases under high collector-base reverse bias, quantified by the forward and reverse Early voltages ($V_{AF}$ and $V_{AR}$). The second factor, $q_2$, models the high-current beta degradation caused by the Kirk effect (base push-out), parameterized by the forward and reverse knee currents ($I_{KF}$ and $I_{KR}$). 

$q_b = \frac{q_1}{2} + \sqrt{\left(\frac{q_1}{2}\right)^2 + q_2}$

where the physical modifiers are mathematically defined as:
$q_1 = 1 + \frac{V_{BC}}{V_{AF}} + \frac{V_{BE}}{V_{AR}}, \quad q_2 = \frac{I_S}{I_{KF}} \left[ \exp\left(\frac{V_{BE}}{N_F V_T}\right) - 1 \right]$

### Transit Time Parameterization and Capacitance

High-frequency transient behavior requires precise modeling of the forward transit time $\tau_F$ and its severe bias dependence under large-signal injection. The effective transit time is modified by the parameters $XTF$, $VTF$, and $ITF$ to account for carrier velocity saturation and the physical widening of the base into the collector region at extreme current densities :

$\tau_{F, eff} = \tau_F \left[ 1 + XTF \cdot \left(\frac{I_{CC}}{I_{CC} + ITF}\right)^2 \exp\left(\frac{V_{BC}}{1.44 \cdot VTF}\right) \right]$

| SPICE Parameter | Physical Description | Unit |
| :--- | :--- | :--- |
| `VAF` | Forward Early voltage (base-width modulation). | V |
| `IKF` | Forward knee current (onset of high-level injection/beta roll-off). | A |
| `TF` | Ideal forward transit time modeling excess minority charge. | sec |
| `XTF` | Coefficient for transit time bias dependence. | - |
| `VTF` | Voltage describing transit time dependence on $V_{BC}$. | V |
| `ITF` | Current describing transit time dependence on $I_C$. | A |

An advanced NPN model implementation in LTspice reflects these high-level physical realities, capturing both DC beta droop and AC transit time expansion:

```spice
* Advanced NPN Transistor Model utilizing Gummel-Poon Physics
.model NPN_ADVANCED NPN (
+ IS=1.2E-14 BF=150 NF=1.0 VAF=65 IKF=0.15 
+ ISE=3E-15 NE=1.5 BR=4 NR=1.0 VAR=15 IKR=0.02 
+ ISC=1E-14 NC=1.5 RB=15 RE=0.2 RC=1.5 
+ CJE=5E-12 VJE=0.7 MJE=0.33 CJC=2E-12 VJC=0.6 MJC=0.33 
+ TF=200E-12 XTF=1.5 VTF=1.2 ITF=0.1 TR=10E-9
+ EG=1.11 XTI=3.0 KF=1E-15 AF=1.2)
```

## Chapter 3: Deep Submicron MOSFET Models

As CMOS technology scales deeply into the sub-100nm regime, classic piecewise models (Level 1–3) catastrophically fail to address velocity saturation, drain-induced barrier lowering (DIBL), and quantum tunneling across the gate dielectric. Modern foundries rely heavily on the BSIM (Berkeley Short-channel IGFET Model) family for digital architectures and the charge-based EKV (Enz-Krummenacher-Vittoz) model for precise analog synthesis.

### The EKV Model Formulation

The EKV model presents a unified analytical formulation valid continuously across weak, moderate, and strong inversion regions, completely bypassing the mathematical discontinuities found in piecewise regional models . Its continuous transconductance equations and inversion coefficients make it invaluable for low-voltage, low-power analog IC design. 

The core of the EKV model utilizes a pinch-off voltage $V_P$ (the channel potential where inversion charge becomes zero) and specific normalized currents $I_F$ and $I_R$ :

$I_D = I_S \cdot (i_f - i_r)$

where $I_S$ is the specific normalization current (dependent on mobility, oxide capacitance, and geometry), and $i_f, i_r$ are the normalized forward and reverse currents linked to the pinch-off voltage $V_P$, source voltage $V_S$, and drain voltage $V_D$ :

$i_{f,r} = \left[ \ln \left( 1 + \exp \left( \frac{V_P - V_{S,D}}{2 V_T} \right) \right) \right]^2$

The EKV model accurately preserves the continuity of first and higher-order derivatives across all inversion states, directly outputting the variables required for precision analog layout, such as $g_{mg}$, $g_{ms}$, and $g_{md}$ .

### BSIM4: Quantum Dielectric Tunneling and Leakage Mechanisms

BSIM4 introduces quantum mechanical charge-layer thickness modeling (`TOXE` for electrical thickness, `TOXP` for physical thickness) to address the finite charge distribution within the channel inversion layer . With gate oxides scaling below 3 nm, direct tunneling current becomes a dominant source of static power dissipation. BSIM4 partitions this tunneling into gate-to-channel ($I_{gc}$), gate-to-source ($I_{gs}$), gate-to-drain ($I_{gd}$), and gate-to-bulk ($I_{gb}$) . The tunneling density is modeled physically as an exponential decay function dependent on the oxide electric field:

$J_{g} = A \cdot \left(\frac{V_{ox}}{t_{ox}}\right)^2 \exp\left( \frac{-B \cdot t_{ox} \cdot \alpha(V_{ox})}{V_{ox}} \right)$

Additionally, BSIM4 captures Gate-Induced Drain Leakage (GIDL) and Gate-Induced Source Leakage (GISL), which occur under high electric fields in the gate-to-drain overlap depletion region due to band-to-band tunneling . The GIDL current is explicitly calculated using the extracted parameters $AGIDL$, $BGIDL$, $CGIDL$, and $EGIDL$ :

$I_{GIDL} = AGIDL \cdot W_{eff} \cdot V_{ds} \cdot E_s \cdot \exp\left( \frac{-BGIDL}{E_s} \right)$

where $E_s$ represents the vertical electric field evaluated as a function of $V_{ds}$, $V_{gs}$, and the body-bias coefficient $CGIDL$ .

| BSIM4 Parameter | Physical Definition | Default / Unit |
| :--- | :--- | :--- |
| `TOXE` | Electrical gate equivalent oxide thickness. | 3E-9 m |
| `TOXP` | Physical gate equivalent oxide thickness. | m |
| `IGCMOD` | Gate-to-channel tunneling current model selector. | 0 (off), 1 (on) |
| `AGIDL` | Pre-exponential coefficient for GIDL current. | $\Omega^{-1}$ |
| `BGIDL` | Exponential coefficient for GIDL current. | V/m |

A standard implementation of a deep-submicron NMOS defining these parameters in LTspice syntax:

```spice
* BSIM4.7.0 N-Channel Sub-micron MOSFET 
.model NMOS_BSIM4 NMOS (LEVEL=54 
+ VERSION=4.7.0 TOXE=2.1E-9 TOXP=1.9E-9 DTOX=0.2E-9 
+ EPSROX=3.9 WINT=0.0 LINT=0.0 
+ VTH0=0.35 K1=0.4 K2=-0.02 DVT0=2.2 DVT1=0.53 
+ U0=350 UA=1.2E-9 UB=1.5E-19 UC=0.05E-9 VSAT=1E5 
+ AGIDL=0.001 BGIDL=2.5E7 CGIDL=0.5 EGIDL=0.8 
+ IGBMOD=1 IGCMOD=1 IGS=1 IGD=1 
+ RS=120 RD=120 RDSMOD=1)
```

## Chapter 4: Wide-Bandgap (WBG) Devices

The transition from traditional silicon to wide-bandgap (WBG) materials—specifically Gallium Nitride (GaN) and Silicon Carbide (SiC)—demands a total overhaul of the SPICE macroscopic perspective. In these materials, high electron mobility, thermal transport, and distinct multi-dimensional electron gas behaviors dominate the operational envelope.

### GaN HEMTs: ASM-HEMT Model and Dynamic Charge Trapping

Gallium Nitride High Electron Mobility Transistors (HEMTs) do not utilize a doped channel. Instead, they form a 2-dimensional electron gas (2DEG) at the AlGaN/GaN heterojunction due to intense spontaneous and piezoelectric polarization fields . The industry-standard Advanced SPICE Model for HEMTs (ASM-HEMT) calculates the surface potential by self-consistently solving the Schrödinger and Poisson equations within the triangular quantum well formed at this interface . 

The 2DEG charge density $n_s$ is modeled analytically to prevent iterative numerical instability :

$n_s = DOS \cdot V_{tv} \ln \left[ \left(1 + \exp\left(\frac{E_f - E_0}{V_{tv}}\right)\right) \left(1 + \exp\left(\frac{E_f - E_1}{V_{tv}}\right)\right) \right]$

Where $DOS$ is the 2-dimensional density of states in GaN, $V_{tv}$ is the thermal voltage, and $E_0, E_1$ are the localized quantum sub-band energy levels derived from the Schrödinger-Poisson resolution . 

A critical modeling challenge in GaN devices is the dynamic $R_{DS(on)}$ degradation caused by charge trapping in deep-level buffer states. Under high drain voltages ($V_{DS}$), electrons injected into the buffer layer become trapped in localized defects. During a rapid switching event, these trapped electrons repel the 2DEG, momentarily depleting the channel and raising $R_{DS(on)}$ significantly above its DC steady-state value . Advanced PDKs integrate behavioral RC networks within the subcircuit to track the temporal trapping states and dynamically inject a virtual $V_{gs}$ penalty.

### SiC MOSFETs and Thermal Scaling

SiC MOSFETs offer exceptionally fast switching, but the threshold voltage ($V_{th}$) and body diode forward voltage exhibit aggressive negative temperature coefficients . To map this in LTspice without requiring constant manual parameter updates, foundry models expose the internal junction temperature $T_j$ and case temperature $T_c$ as external electrical voltage pins, utilizing an equivalence where $1V = 1^\circ C$ . 

The intrinsic body diode threshold behavior as a function of temperature is parameterized via continuous quadratic fitting to ensure stability during reverse-recovery simulation :

$V_{th\_bd}(T_j) = a_0 + a_1 \cdot T_j + a_2 \cdot T_j^2$

| WBG Material Property | Silicon (Si) | Silicon Carbide (SiC) | Gallium Nitride (GaN) |
| :--- | :--- | :--- | :--- |
| Bandgap Energy (eV) | 1.1 | 3.2 | 3.4 |
| Breakdown Field (MV/cm) | 0.3 | 3.0 | 3.3 |
| Thermal Conductivity (W/cm·K) | 1.5 | 4.9 | 2.3 |
| SPICE Modeling Architecture | BSIM / EKV | VDMOS + Thermal Subckt | ASM-HEMT (2DEG) |

A representative LTspice subcircuit for a thermal-aware SiC MOSFET embeds these principles:

```spice
* SiC MOSFET Subcircuit Wrapper with Active Thermal Nodes
.subckt SiC_MOSFET_1200V D G S Tj Tc
* Main device instantiation
M1 D G S S SiC_Core L=1u W=1u
* Physical body diode with reverse recovery optimized for -4V Vgs
D_Body S D SiC_Diode
* Transient Thermal interface (Cauer Network approximation)
Rth1 Tj T_int 0.25
Cth1 Tj 0 0.5m
Rth2 T_int Tc 0.20
Cth2 T_int 0 0.7m
* Models
.model SiC_Core NMOS (LEVEL=1 VTO=2.8 KP=4.5 
+ CGDO=15p CGSO=800p CBD=0 RG=2.5)
.model SiC_Diode D (IS=1E-13 N=1.2 RS=0.015 EG=3.2 TT=15n)
.ends SiC_MOSFET_1200V
```

## Chapter 5: Non-Linear Magnetics and Core Saturation

Power converter topologies, particularly flyback, forward, and LLC resonant converters, require highly accurate modeling of magnetic core saturation, coercive force, and dynamic hysteresis loops. The default LTspice linear inductor fails to model localized saturation fluxes and finite permeability. To resolve this, the LTspice engine natively integrates the Chan core model, a phenomenological algorithm that evaluates magnetic hysteresis with robust computational efficiency .

### The Chan Model Implementation

The Chan model evaluates the core's magnetic field strength $H$ and magnetic flux density $B$ using purely physical dimensions and three primary hysteretic parameters derived from manufacturer B-H curve graphs :
1.  **Coercive force ($Hc$)**: The magnetic field strength required to demagnetize the material, measured in Amp-turns/meter.
2.  **Residual flux density ($Br$)**: The remnant magnetic flux remaining at zero external field, in Tesla.
3.  **Saturation flux density ($Bs$)**: The maximum theoretical flux density before complete alignment of magnetic domains, in Tesla.

The geometric parameters required to close the loop include the magnetic path length ($Lm$), cross-sectional area ($A$), length of the air gap ($Lg$), and number of turns ($N$) . By assuming constant permeability prior to saturation, the fundamental inductance of a toroidal core is established via:

$L = \frac{N^2 \cdot \mu \cdot A}{L_m}$

However, as the magnetic domains align under heavy current injection, the permeability $\mu$ drops sharply toward $\mu_0$, directly reflecting an inductance collapse observable via Faraday's law :

$V = N \cdot A \cdot \frac{dB}{dt}$

### Modeling Transformers and Leakage Inductance

Coupled inductors with non-linear hysteresis cannot utilize standard `K` statement mutual coupling matrices if they are configured as separated saturable inductors, as the Chan model does not natively support mutual inductance between two separate core declarations . Instead, a subcircuit topology must define the core's single magnetizing inductance (`Lmag`) containing the core physics. The primary and secondary windings are then coupled via ideal voltage-controlled voltage sources (VCVS) and current-controlled current sources (CCCS), or by scaling turns ratios across a shared core . 

Furthermore, leakage inductance ($L_{leak}$) must be modeled physically as linear inductors placed in series with the ideal coupled ports. The leakage is determined by the coupling coefficient $k$:

$L_{leak} = (1 - k) \cdot L_p$

```spice
* Custom Transformer with Chan Magnetic Core and Leakage
.subckt XFRM_CHAN PRI_P PRI_N SEC_P SEC_N params: Np=100 Ns=50
* Primary leakage and DC resistance
R_pri PRI_P 1 0.05
L_leak_p 1 2 2.5u
* Magnetizing inductance utilizing the Chan Model (Nmag = 1)
* Allows percentage scaling for secondary windings
Lmag 2 PRI_N N=1 Hc=15.5 Br=0.12 Bs=0.39 A=120u Lm=45m Lg=0
* Secondary coupling using E and F sources to simulate turns ratio
E_sec SEC_int1 SEC_N 2 PRI_N {Ns/Np}
F_pri 2 PRI_N V_sec {Ns/Np}
* Secondary Winding Leakage and Parasitics
V_sec SEC_int1 SEC_int2 0
L_leak_s SEC_int2 3 1.2u
R_sec 3 SEC_P 0.02
.ends XFRM_CHAN
```

## Chapter 6: Behavioral Modeling with Arbitrary Sources

When strict physical semiconductor parameterization is impossible—or when modeling analog computational blocks, control loop compensators, or abstract non-linear resistors—LTspice’s Arbitrary Behavioral Sources (`B` sources) provide unparalleled flexibility. B sources allow voltages or currents to be defined as abstract mathematical expressions of system variables, parsing complex algebraic operators during the transient matrix solution.

### Non-Linear Math and Voltage-Controlled Resistors

A B-source can dynamically calculate current based on arbitrary node voltages, enabling the design of an ideal Voltage-Controlled Resistor (VCR). This is frequently utilized in abstract behavioral modeling of components like variable attenuators or digital potentiometers. To prevent a zero-division singularity in the LTspice matrix solver, a microscopic offset (e.g., `1m`) is appended to the denominator:
```spice
B_VCR N1 N2 I = V(N1, N2) / (V(CTRL) + 1m)
```

### Laplace Transforms and Frequency-Domain Modeling

For frequency-domain modeling, such as closed-loop PI controllers, EMI filters, or AC sensor roll-offs, the `B` source inherently parses continuous-time Laplace domain transfer functions . LTspice converts these s-domain functions into impulse responses, processing them via fast convolution during transient analysis. Consider a classical Type-II compensator utilized in switch-mode power supplies, featuring a single origin pole, one low-frequency zero, and one high-frequency pole:

$H(s) = K \cdot \frac{1 + \frac{s}{\omega_z}}{s \left(1 + \frac{s}{\omega_p}\right)}$

This equation is implemented directly in LTspice syntax without constructing an elaborate operational amplifier schematic:
```spice
* Ideal Type-II Compensator using s-domain transformation
B_Compensator OUT 0 V = V(ERR) * Laplace = {1000 * (1 + s/1e4) / (s * (1 + s/1e6))}
```

## Chapter 7: Subcircuits (.subckt) and Hierarchical Schematic Design

For foundry PDKs, delivering monolithic, flat simulation files is computationally and structurally unmanageable. Hierarchical design wraps complex multi-layer parasitic models, custom thermal logic, and distributed RC networks inside `.subckt` block wrappers. These blocks effectively instantiate isolated, standalone netlist namespaces. A node named `Gate_Internal` inside a subcircuit will never collide with a node named `Gate_Internal` in the top-level schematic, preventing catastrophic solver failures.

### Dynamic Parameter Passing

Variables required to compute physical device scaling (e.g., MOSFET finger widths `W`, channel length `L`, multiplicity `M`, or temperature offsets) must be evaluated dynamically. Rather than hard-coding values, the PDK architect utilizes the `params:` directive to establish default values that are overwritten by the top-level symbol call.

```spice
* Scalable High-Voltage LDMOS with dynamically calculated parasitics
.subckt LDMOS_HV D G S B params: W=10u L=0.5u M=1 dTemp=0
* Internal parasitic resistance scaling based on geometry
R_Gate G G_int {15 / (W * M)}
R_Source S S_int {20 / (W * M)}
* Core device instantiation
M_Core D_int G_int S_int B N_LDMOS L={L} W={W*M} TEMP={27 + dTemp}
* Drift region non-linear resistance incorporating velocity saturation
B_Rdrift D D_int I = V(D, D_int) / (50 + 0.1 * V(D, D_int)^2)
.ends LDMOS_HV
```
By invoking this component in the top-level netlist, the user effectively types `X1 D G S 0 LDMOS_HV W=20u M=4 dTemp=50`. LTspice flattens the hierarchy during netlist extraction, substituting the defined variables and computing the specific scaling formulas instantly before matrix generation.

## Chapter 8: Custom Symbol Creation (.asy)

A purely mathematical `.subckt` requires a graphical interface for effective schematic interaction. The LTspice symbol file (`.asy`) maps visual bounding boxes, geometric shapes, pin locations, and parameter string parsing directly to the underlying model. Understanding the raw ASCII text of the `.asy` file allows for automated PDK generation using python-based electronic design automation (EDA) workflows.

### Pin Mapping and Dynamic Attribute Assignment

An `.asy` file requires exact port ordering to map graphical schematic pins to the internal netlist ports of the `.subckt`. The order of the `PINATTR SpiceOrder` must precisely match the port sequence defined in the `.subckt` header (e.g., Drain, Gate, Source) . 

| Attribute Directive | Description | Example Implementation |
| :--- | :--- | :--- |
| `SYMATTR Prefix` | Informs the parser of the device classification (e.g., X for subcircuit). | `SYMATTR Prefix X` |
| `SYMATTR InstName` | Default reference designator on the schematic. | `SYMATTR InstName U` |
| `SYMATTR Value` | Matches the exact name of the `.subckt` being called. | `SYMATTR Value LDMOS_HV` |
| `PINATTR SpiceOrder` | The numerical sequence in the netlist for the specific pin. | `PINATTR SpiceOrder 1` |

Crucially, setting `SYMATTR Prefix X` instructs the LTspice parser to treat the instantiated symbol as a hierarchical subcircuit rather than an intrinsic semiconductor device type (like `M` for MOSFET or `D` for Diode). A complete, minimal text structure for a customized three-terminal symbol is provided below:

Version 4
SymbolType CELL
LINE Normal -32 -32 32 -32
LINE Normal -32 32 32 32
LINE Normal -32 -32 -32 32
LINE Normal 32 -32 32 32
WINDOW 0 0 -40 Bottom | Left 2
WINDOW 3 0 40 Top | Left 2
SYMATTR Prefix X
SYMATTR InstName U
SYMATTR Value LDMOS_HV
SYMATTR Description High-Voltage Scalable LDMOS Model
PIN -32 0 LEFT 8
PINATTR PinName Gate
PINATTR SpiceOrder 2
PIN 32 -16 RIGHT 8
PINATTR PinName Drain
PINATTR SpiceOrder 1
PIN 32 16 RIGHT 8
PINATTR PinName Source
PINATTR SpiceOrder 3

## Chapter 9: Advanced Library Management

With the release of LTspice version 24 and 26, the directory structure for library management underwent significant reconfiguration to accommodate system-wide corporate IT security policies and multi-user sandbox environments. Standard components and models are no longer deposited directly into the program execution directory located in `Program Files`.

### Directory Strictures and Integration

LTspice 24/26 expects custom user files, third-party symbols (`.asy`), subcircuits (`.sub`), and comprehensive component databases (`.cmp`) to be nested safely within the user's local application data paths . Specifically, the intrinsic device databases must be managed at:
`C:\Users\[Username]\AppData\Local\LTspice\lib\cmp` .

To integrate standard diode or MOSFET components directly into the default schematic picker dialogs without relying on `.subckt` wrappers, the `.model` parameters must be appended directly to the user-specific database files such as `user.dio`, `user.mos`, or `user.bjt` located in this directory . 

### Incorporating Encrypted Intellectual Property

To reference an encrypted, proprietary vendor `.lib` file situated outside the standard app data paths, the absolute or relative path must be explicitly declared via a SPICE `.lib` directive within the schematic or the `.asy` file . For encrypted libraries, LTspice reads an obfuscated bitstream directly into the matrix solver without writing intermediate plain-text to the system disk, thereby preserving corporate intellectual property:
```spice
.lib C:\Project_Alpha\Models\Vendor_GaN_Encrypted.lib
```

## Chapter 10: Electrothermal Modeling and Self-Heating

Modern wide-bandgap and silicon power switching components routinely handle tens of kilowatts, rendering static, fixed-temperature simulations physically inaccurate. Device characteristics—such as threshold voltage shifts, carrier mobility degradation, leakage currents, and dynamic saturation limits—shift instantaneously during a high-energy switching transient. Electrothermal modeling dynamically computes localized Joule heating $P_{diss} = I_{D} \cdot V_{DS}$ and applies the calculated temporal temperature directly back into the device physics equations during the simulation run.

### Cauer and Foster Thermal Networks

To model transient heat dissipation, thermal resistance $R_{th}$ (measured in $^\circ C/W$) and thermal capacitance $C_{th}$ (measured in Joules/$^\circ C$) are represented as analogous electrical components. The Foster thermal network represents a mathematical curve-fitting of a device's transient thermal impedance ($Z_{th}$) response, typically supplied by the manufacturer. While computationally simple, the specific nodes within a Foster network lack physical meaning. Conversely, the Cauer network represents actual, sequential physical boundaries (e.g., Die-to-Solder, Solder-to-Leadframe, Leadframe-to-Heatsink) . 

To integrate dynamic self-heating into the LTspice solver, the architect constructs an interactive subcircuit where the instantaneous power dissipation is actively monitored using behavioral sources. The resulting thermal response shifts the `$TEMP` or `Tnom` properties internal to the SPICE nodes.

```spice
* Advanced Electrothermal N-Channel MOSFET with Thermal Runaway Capacity
.subckt THERMAL_MOS D G S Tj Tc
* Calculate real-time instantaneous power dissipation (P = V * I)
B_Power P_node 0 V = I(V_sense) * V(D_int, S)
* Convert calculated power to a driving current for the thermal Cauer network
G_Heat Tj Tc P_node 0 1.0

* Thermal Cauer Network representing physical layer impedances
* (Die -> Solder -> Package Case)
R_th1 Tj T_int1 0.15
C_th1 Tj 0 500u
R_th2 T_int1 Tc 0.45
C_th2 T_int1 0 2m

* Intrinsic Device with Dynamic Temperature Feedback Equation
* Note: V(Tj) is dynamically evaluated to adjust internal RDS variables
B_Rds D D_int I = V(D, D_int) / (0.015 * (1 + 0.008 * (V(Tj) - 25)))
V_sense D_int D_core 0
M1 D_core G S S CORE_NMOS L=1u W=10m

.model CORE_NMOS NMOS (LEVEL=3 VTO=3.5 KP=2.0)
.ends THERMAL_MOS
```

In this advanced closed-loop architecture, the `B_Power` source mathematically extracts the instantaneous $V \cdot I$ multiplier of the main MOSFET channel. This acts as a current source that continuously drives the thermal RC network. The local node `Tj` reaches a voltage directly proportional to the junction temperature. This dynamic value is actively fed back into the `B_Rds` channel resistance equation. This precise topology permits the simulation of dangerous thermal runaway scenarios: if insufficient heatsinking is applied at node `Tc`, the temperature `Tj` rises, accelerating resistance, which in turn spikes $I^2R$ power generation, driving a continuous cycle of catastrophic physical failure that is immediately visible within the transient `.raw` waveform data. 


## Sources

- [**scribd.com** LTspice: Advanced Integration Methods | PDF - Scribd](https://www.scribd.com/document/450254440/LTSpice-Numerical-Methods)
- [**researchgate.net** Overview of SPICE-like circuit simulation algorithms - ResearchGate](https://www.researchgate.net/publication/3348837_Overview_of_SPICE-like_circuit_simulation_algorithms)
- [**groups.io** LTSPICE solvers: Trapezoidal, Mod. trap, Gear or Alternate - Groups.io](https://groups.io/g/LTspice/topic/ltspice_solvers_trapezoidal/50145164)
- [**gotroot.ca** Using Gear integration](https://gotroot.ca/spectrum/www.spectrum-soft.com/faq/help/faq134.html)
- [**ltwiki.org** Integration Methods - LTwiki](https://ltwiki.org/files/LTspiceHelp.chm/html/integration_method_issues.htm)
- [**forum.allaboutcircuits.com** LTspice Integration Method -- Warning! | All About Circuits](https://forum.allaboutcircuits.com/threads/ltspice-integration-method-warning.183216/)
- [**ieee.li** Getting the Most from LTspice (and a Quick Look at LTpowerCAD)](https://www.ieee.li/pdf/viewgraphs/getting-the-most-from-ltspice.pdf)
- [**scribd.com** Gummel-Poon Model for Bipolar Transistors | PDF - Scribd](https://www.scribd.com/document/163356228/Gummel-Pool-Bjt)
- [**analog-electronics.tudelft.nl** Bipolar transistors - Structured Electronics Design](https://analog-electronics.tudelft.nl/webbook/SED/_build/html/ModelingActiveDevices/ActiveDevices_Bipolar_transistors.html)
- [**emo.org.tr** MOSFET MODELING WITH EKV 2.6 AND ANALOG CIRCUIT](https://www.emo.org.tr/ekler/a22c0c0a4515485_ek.pdf)
- [**ee.iitb.ac.in** The EPFL-EKV MOSFET Model Equations for Simulation](https://www.ee.iitb.ac.in/student/~vharihar/ekv_v262.pdf)
- [**silvaco.com** EKV MOSFET Model Version 2.6 Now Available in SmartSpice and](https://silvaco.com/simulation-standard/ekv-mosfet-model-version-2-6-now-available-in-smartspice-and-utmost-iii/)
- [**studocu.vn** Title: EKV MOSFET Model Equations for Circuit Simulation (Version](https://www.studocu.vn/vn/document/hutech-university-of-technology/tieng-trung-noi-3/title-ekv-mosfet-model-equations-for-circuit-simulation-version-26/126764212)
- [**cmosedu.com** BSIM4 User's Manual - CMOSedu.com](https://cmosedu.com/cmos1/BSIM4_manual.pdf)
- [**scribd.com** BSIM4 Manual | PDF | Mosfet | Dielectric - Scribd](https://www.scribd.com/document/41887274/BSIM4-Manual)
- [**pages.hmc.edu** BSIM4 User's Manual](https://pages.hmc.edu/harris/cmosvlsi/4e/BSIM4_manual.pdf)
- [**www2.eecs.berkeley.edu** bsim4.0.0 technical notes - EECS at Berkeley](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2000/Archive/ERL-00-39.pdf)
- [**people.ece.ubc.ca** SPICE Model Parameters for BSIM4.5.0 - People](https://people.ece.ubc.ca/robertor/Links_files/Files/ICCAP-2008-doc/icmdl/icmdl048.html)
- [**scribd.com** BSIM4 4.8.1 Technical Manual | PDF | Field Effect Transistor - Scribd](https://www.scribd.com/document/507835958/BSIM4-4-8-1-Technical-Manual)
- [**www2.eecs.berkeley.edu** BSIM4.1.0 MOSFET Model - EECS at Berkeley](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2000/Archive/ERL-00-48.pdf)
- [**ewh.ieee.org** BSIM4 Modeling and Parameter Extraction - IEEE Web Hosting](https://ewh.ieee.org/r5/denver/sscs/References/2003_03_Assenmacher.pdf)
- [**class.ece.iastate.edu** BSIM4v4.7 MOSFET Model - Iowa State University](https://class.ece.iastate.edu/djchen/ee501/BSIM470_Manual.pdf)
- [**edadownload.software.keysight.com** MOSFET Models - Keysight](https://edadownload.software.keysight.com/eedl/iccap/2012_01/pdf/mosfet.pdf)
- [**opus4.kobv.de** Physics-based trap modeling of GaN HEMTs - OPUS](https://opus4.kobv.de/opus4-btu/files/6933/Petros_Beleniotis.pdf)
- [**scribd.com** ASM-HEMT: GaN HEMT Modeling Insights | PDF | Electronics - Scribd](https://www.scribd.com/document/850259751/Asm-Hemt-Yschauhan)
- [**home.iitk.ac.in** ASM-HEMT: Compact Modeling of - IIT Kanpur](https://home.iitk.ac.in/~chauhan/ASM-HEMT_YSChauhan.pdf)
- [**iitk.ac.in** ASM-HEMT 101.0.0 Advanced SPICE Model for HEMTs - IIT Kanpur](https://iitk.ac.in/asm/asm_package/ASMHEMT101.0.0_Manual.pdf)
- [**iitk.ac.in** GaN HEMT Modeling for Power and RF Applications using ASM](https://www.iitk.ac.in/dordoldn/isro/Publications/YSC/4-GaN_HEMT_Modeling_for_Power.pdf)
- [**researchgate.net** Analytical Modeling of Surface-Potential and Intrinsic Charges in](https://www.researchgate.net/publication/260536074_Analytical_Modeling_of_Surface-Potential_and_Intrinsic_Charges_in_AlGaNGaN_HEMT_Devices)
- [**mdpi.com** Trapping Dynamics in GaN HEMTs for Millimeter-Wave Applications](https://www.mdpi.com/2079-9292/10/2/137)
- [**semanticscholar.org** A GaN-HEMT Compact Model Including Dynamic RDSon Effect for](https://www.semanticscholar.org/paper/A-GaN-HEMT-Compact-Model-Including-Dynamic-RDSon-Li-Evans/7ba621c11466279bd2a0d50b1e49f043f224a223)
- [**wolfspeed.com** Modeling common topologies with Wolfspeed Silicon Carbide](https://www.wolfspeed.com/knowledge-center/article/modeling-common-topologies-with-wolfspeed-silicon-carbide-mosfets/)
- [**digitaltwin1.org** An analytical switching model of SiC MOSFET considering the](https://digitaltwin1.org/articles/2-19/pdf)
- [**allaboutcircuits.com** Simulating SiC MOSFET Thermal and Switching Behavior in LTspice](https://www.allaboutcircuits.com/technical-articles/simulating-sic-mosfet-thermal-switching-behavior-ltspice-tutorial/)
- [**ltwiki.org** The Chan model - LTwiki-Wiki for LTspice](https://ltwiki.org/index.php?title=The_Chan_model)
- [**mdpi.com** Modeling Pulsed Magnetic Core Behavior in LTspice - MDPI](https://www.mdpi.com/2079-9292/14/12/2335)
- [**allaboutcircuits.com** Modeling Inductors with LTspice - Technical Articles](https://www.allaboutcircuits.com/technical-articles/modeling-inductors-with-ltspice/)
- [**valvol.xyz** Configure the hysteretic core model of the LTspice simulator](http://valvol.xyz/en/calc_gm.php)
- [**osti.gov** Modeling Pulsed Magnetic Core Behavior in LTspice - OSTI.GOV](https://www.osti.gov/servlets/purl/2562789)
- [**electronics.stackexchange.com** Meaning of N parameter in Chan Model LTspice](https://electronics.stackexchange.com/questions/559408/meaning-of-n-parameter-in-chan-model-ltspice)
- [**groups.io** LTspice@groups.io | Creating a Chan Transformer](https://groups.io/g/LTspice/topic/creating_a_chan_transformer/73221313)
- [**analog.com** LTspice Technical Information and Guides - Analog Devices](https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator/ltspice-recommended-reading-list.html)
- [**dev-docs.kicad.org** LTspice - Developer Documentation | KiCad](https://dev-docs.kicad.org/en/import-formats/ltspice/index.html)
- [**we-online.com** LTspice examples](https://www.we-online.com/files/pdf1/ltspice-examples.pdf)
- [**spiceman.net** LTspice folder/file structure and SPICE model type - Spiceman](https://spiceman.net/ltspice-spicemodel-knowledge/)
- [**electronics.stackexchange.com** LTspice 24 `.ini` file location - Electrical Engineering Stack Exchange](https://electronics.stackexchange.com/questions/700101/ltspice-24-ini-file-location)
- [**eevblog.com** LTspice24 - user libraries and Search Paths in the Settings - EEVblog](https://www.eevblog.com/forum/eda/ltspice24-user-libraries-and-search-paths-in-the-settings/)
- [**ez.analog.com** LTspice 24 Default File Locations (Windows) - Q&A - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/586120/ltspice-24-default-file-locations-windows)
- [**ez.analog.com** Latest Download and Release Notes - FAQs/Docs - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs)
- [**ltwiki.org** .LIB -- Include a library - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_LIB_Include_a_library.htm)
- [**groups.io** LTspice@groups.io | Chan Core Usage](https://groups.io/g/LTspice/topic/chan_core_usage/50203749)
- [**ez.analog.com** Nonlinear inductor (Chan)- is there a way to extract time-domain](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/588204/nonlinear-inductor-chan---is-there-a-way-to-extract-time-domain-transient-data-for-flux-within-the-air-gap-it-looks-like-i-can-get-only-current-voltage-i-d-like-to-use-ltspice-to-accurately-model-the-time-varying-field-within)
- [**passive-components.eu** Magnetic Circuits LTSpice Modelling Part II.](https://passive-components.eu/magnetic-circuits-ltspice-modelling-part-ii/)
- [**mdpi.com** Improved Jiles–Atherton Magnetic Core Model and Its SPICE ... - MDPI](https://www.mdpi.com/2079-9292/15/5/1009)
- [**fscdn.rohm.com** How to Use LTspice Models - ROHM Semiconductor](https://fscdn.rohm.com/en/products/databook/applinote/common/how_to_use_ltspice_models_an-e.pdf)
- [**mouser.com** How to Use LTspice Models](https://www.mouser.com/pdfDocs/how_to_use_ltspice_models_an-e.pdf)
- [**youtube.com** Using LTspice to extract an EKV spice model from BSIM level 49](https://www.youtube.com/watch?v=NmAhpdp1OLo)
- [**home.iitk.ac.in** The HV-EKV MOSFET Model](https://home.iitk.ac.in/~chauhan/HV-EKV_YSChauhan.pdf)
- [**scribd.com** EKV v2.6 MOSFET Model Tutorial | PDF | Field Effect Transistor](https://www.scribd.com/document/108821185/Ekv-param-Extarct)
- [**mos-ak.org** a Designer's Perspective on the EKV Model and its Usage - MOS-AK](https://www.mos-ak.org/montreux/posters/09_Mawet_MOS-AK06.pdf)
- [**mdpi.com** A GaN-HEMT Compact Model Including Dynamic RDSon Effect for](https://www.mdpi.com/1996-1073/14/8/2092)
- [**youtube.com** Simulating ferromagnetic major and minor hysteresis loops by LTspice](https://www.youtube.com/watch?v=IbwDfZgh8_0)
- [**youtube.com** LTspice tutorial - Simulating Magnetic Hysteresis - YouTube](https://www.youtube.com/watch?v=nBKC3eyqNyY)
- [**youtube.com** How to Create a Hysteresis Controller for LTspice - YouTube](https://www.youtube.com/watch?v=s7eHpsJ19ck)
- [**passive-components.eu** Simulating Ferromagnetic Hysteresis Loops by LTspice](https://passive-components.eu/simulating-ferromagnetic-major-and-minor-hysteresis-loops-by-ltspice/)
- [**semanticscholar.org** An Algorithm on Direct Tunneling Current Model Based on DIBL Effect](https://www.semanticscholar.org/paper/An-Algorithm-on-Direct-Tunneling-Current-Model-on-Wu-Zhao/460be76114bc1bd3669f553f2872126e36db59e6)
- [**people.ece.ubc.ca** Structure of the BSIM4 RF Simulation Model - People](https://people.ece.ubc.ca/robertor/Links_files/Files/ICCAP-2008-doc/icmdl/icmdl046.html)
- [**youtube.com** Dispersion in GaN HEMTs: Origin, Characterization and Modeling](https://www.youtube.com/watch?v=s3WByoHlC1I)
- [**scholarworks.uark.edu** Improved Compact Modeling of High Voltage Gallium Nitride High](https://scholarworks.uark.edu/context/etd/article/6293/viewcontent/Hossain_uark_0011A_14970.pdf)
- [**researchgate.net** GaN-HEMT compact model by equivalent circuit. - ResearchGate](https://www.researchgate.net/figure/GaN-HEMT-compact-model-by-equivalent-circuit_fig1_350775191)
- [**powerelectronicsnews.com** How to Simulate SiC MOSFETs with LTspice - Power Electronics News](https://www.powerelectronicsnews.com/how-to-simulate-sic-mosfets-with-ltspice-the-importance-of-a-good-driver/)
- [**fscdn.rohm.com** Overview of ROHM's Simulation Models for Si MOSFETs](https://fscdn.rohm.com/en/products/databook/applinote/discrete/transistor/mosfet/overview_of_rohms_simulation_models_for_si_mosfets_an-e.pdf)
- [**electronics.stackexchange.com** LTSpice model of IRF520 body diode](https://electronics.stackexchange.com/questions/766936/ltspice-model-of-irf520-body-diode)
- [**youtube.com** LTspice Modelling of Wolfspeed SiC MOSFET and SiC Diode](https://www.youtube.com/watch?v=vFCtCPUcJMg)
- [**ez.analog.com** Physically Based, Scalable SPICE Modeling](https://ez.analog.com/cfs-file/__key/communityserver-discussions-components-files/1020/Topic-3_2D00_Physically-Based_2C00_-Scalable-SPICE-Modeling-Methodologies-for-Modern-Power-Electronic-Devices_5F00_JVupdate.pdf)
- [**youtube.com** Silicon Carbide (SiC) Mosfet Characteristics in LTspice - YouTube](https://www.youtube.com/watch?v=bryGigu1Dwk)
- [**ww3.math.ucla.edu** Efficient Solution of the Schroedinger-Poisson Equations In Layered](https://ww3.math.ucla.edu/camreport/cam08-49.pdf)
- [**comsol.com** Self-Consistent Schrödinger-Poisson Results for a Nanowire](https://www.comsol.com/blogs/self-consistent-schrodinger-poisson-results-for-a-nanowire-benchmark)
- [**mdpi.com** Surface-Potential-Based Compact Modeling of p-GaN Gate HEMTs](https://www.mdpi.com/2072-666X/12/2/199)
- [**mathmods.eu** Simulation of GaN/AlGaN heterostructures for a HEMT ... - MathMods](https://www.mathmods.eu/resources/downloads/master-theses/finish/37-master-s-theses/262-paul-ellinghaus-thesis.pdf)
- [**nbi.ku.dk** Schrödinger-Poisson Calculations for Majorana Devices](https://nbi.ku.dk/english/theses/masters-theses/august-edwards-mikkelsen/ThesisFinal.pdf)
- [**briefs.techconnect.org** Industry Standard GaN HEMT Model for Power and RF Applications](https://briefs.techconnect.org/papers/asm-hemt-industry-standard-gan-hemt-model-for-power-and-rf-applications/)
- [**ez.analog.com** LTSpice - The system cannot find the path specified.](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/599558/ltspice---the-system-cannot-find-the-path-specified/594188)
- [**groups.io** LTspice@groups.io | Understanding user file locations and structure.](https://groups.io/g/LTspice/topic/understanding_user_file/111227407)
- [**ez.analog.com** LTspice without %appdata% or %localappdata% - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/574500/ltspice-without-appdata-or-localappdata)
