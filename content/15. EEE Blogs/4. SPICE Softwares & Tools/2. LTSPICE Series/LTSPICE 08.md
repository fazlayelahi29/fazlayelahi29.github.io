# Advanced Validation and Control Theory of Switch-Mode Power Supplies using LTspice

The relentless drive toward higher power densities, elevated switching frequencies, and tighter dynamic regulation in Switch-Mode Power Supplies (SMPS) demands absolute rigor in power conversion validation. The margin for error in modern power electronics is exceptionally thin; unmodeled parasitics, subtle phase margin degradations, or improperly clamped leakage inductances can precipitate catastrophic semiconductor failures or systemic instabilities. This comprehensive investigation establishes the definitive mathematical and simulative frameworks required to design, model, and validate complex switching converters. By leveraging the advanced numerical capabilities of LTspice, integrating exact parasitic estimations, and employing mathematically rigorous control loop stability techniques, this analysis delivers an exhaustive methodology for SMPS engineering.

## Chapter 1: SMPS Simulation Philosophy

The foundation of robust power electronics engineering lies in selecting the appropriate mathematical and simulative domain for the analysis in question. Power converters are inherently nonlinear, time-varying systems driven by discrete switching events. Consequently, simulating their behavior necessitates a philosophical and practical bifurcation: time-domain cycle-by-cycle simulation versus state-space averaged (SSA) continuous-time modeling.

Time-domain cycle-by-cycle simulations evaluate the physical circuit at a microscopic temporal resolution. Every switching transition, diode reverse recovery event, and resonant parasitic ringing cycle is calculated. This methodology is indispensable for determining peak voltage stresses, dynamic switching losses, and large-signal transient responses such as startup sequences, input voltage feedforward reactions, or short-circuit faults . However, the computational burden of resolving nanosecond-scale switching transitions over millisecond-scale low-frequency loop dynamics results in protracted simulation times. 

Conversely, State-Space Averaging fundamentally transforms the discontinuous, nonlinear switching model into a continuous, linear, or locally linearized system by averaging the states, specifically inductor currents and capacitor voltages, over a single switching period, $T_{sw}$. The fundamental SSA formulation dictates that the system dynamics matrix is a duty-cycle-weighted average of the switched topological states. The state-space matrix formulation is expressed mathematically as:

$\dot{\hat{x}}(t) = [A_1 D + A_2 (1-D)] \hat{x}(t) + [B_1 D + B_2 (1-D)] \hat{u}(t)$

In this expression, $A_1$ and $A_2$ represent the continuous system matrices during the switch-on and switch-off intervals respectively, while $D$ is the steady-state duty cycle. 

Averaged models are paramount when performing small-signal AC analysis to validate closed-loop stability via Bode plots . Because they eliminate the high-frequency switching ripple, average models can simulate thousands of times faster than cycle-by-cycle models, allowing the designer to rapidly tune compensation networks. However, averaging intrinsically destroys high-frequency discrete data. Phenomena that manifest at half the switching frequency, such as subharmonic oscillation in peak-current-mode control, are mathematically invisible to basic averaged models unless specific discrete-time extensions, such as Ridley's sample-and-hold models, are mathematically appended to the transfer functions . 

The modern simulation philosophy dictates a hybrid workflow. Averaged models are deployed during the initial control-loop synthesis to calculate the exact Type-II or Type-III resistor-capacitor combinations. Once the phase margin is mathematically secured, the components are transplanted into the exact cycle-by-cycle time-domain model to validate large-signal step responses and to confirm that large-signal nonlinearities, such as inductor saturation or operational amplifier output-current clipping, do not compromise the theoretical stability.

| Analytical Domain | Primary Application | Mathematical Basis | Computational Speed | Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Cycle-by-Cycle Time Domain** | Switching losses, SOA, EMI, large-signal transients | Nonlinear numerical integration | Slow (minutes to hours) | High data density complicates AC frequency response extraction |
| **State-Space Averaged (SSA)** | Loop stability, phase/gain margin, AC sweeps | Linearized small-signal state matrices | Near-instantaneous | Ignores subharmonic oscillations and high-frequency ringing |
| **Sampled-Data Modeling** | Current-mode control at half-switching frequency | Discrete-time z-domain transformations | Fast | Highly complex to mathematically formulate for novel topologies |

## Chapter 2: Transient Analysis of Non-Isolated Topologies

The cornerstone of non-isolated power conversion resides in the Buck, Boost, and SEPIC topologies. Analyzing these topologies in the time domain requires exacting attention to both Continuous Conduction Mode (CCM) and Discontinuous Conduction Mode (DCM) dynamics, where the transition between these modes radically alters the control-to-output transfer function.

### The Synchronous Buck Converter

Consider a step-down application requiring a conversion from $V_{in} = 12\text{ V}$ to $V_{out} = 3.3\text{ V}$ at a switching frequency $F_{sw} = 500\text{ kHz}$. To minimize ripple while preserving transient bandwidth, an output filter utilizing an inductor $L = 3.3\text{ \mu H}$ and a multi-layer ceramic capacitor (MLCC) bank $C_{out} = 47\text{ \mu F}$ is selected. 

In LTspice, the parasitic elements must be explicitly defined to observe realistic damping and voltage droop. The inductor's Direct Current Resistance ($DCR$) is estimated at $15\text{ m}\Omega$, and the MLCC's Equivalent Series Resistance ($ESR$) is set to $2\text{ m}\Omega$. The equivalent series inductance ($ESL$) of the capacitor, typically $400\text{ pH}$ for a 1210 package, must be modeled to accurately simulate high-frequency switching spikes on the output rail. 

In CCM, the inductor current never reaches zero, and the duty cycle $D$ is simply derived from the voltage ratio:

$D_{CCM} = \frac{V_{out}}{V_{in}} = \frac{3.3}{12} = 0.275$

The peak-to-peak inductor current ripple $\Delta I_L$ defines the boundary of continuous conduction:

$\Delta I_L = \frac{V_{in} - V_{out}}{L} \cdot \frac{D}{F_{sw}} = \frac{12 - 3.3}{3.3 \times 10^{-6}} \cdot \frac{0.275}{500 \times 10^3} = 1.45\text{ A}$

If the load current $I_{load}$ drops below $\frac{\Delta I_L}{2} = 0.725\text{ A}$, an asynchronous buck converter transitions into DCM. In DCM, the inductor current rests at zero for a portion of the switching cycle, transforming the inductor from a constant current source into a discrete energy packet delivery mechanism. The DC gain in DCM becomes heavily load-dependent, completely altering the small-signal plant transfer function and causing the dominant double-pole to split into a single low-frequency pole.

The exact textual representation of the Synchronous Buck converter simulation in LTspice format is provided below:

```spice
Version 4
SHEET 1 880 680
WIRE 112 32 -32 32
WIRE -32 112 -32 32
WIRE 112 112 112 32
WIRE 272 112 112 112
WIRE 416 112 336 112
WIRE 560 112 416 112
WIRE -32 208 -32 192
WIRE 112 224 112 208
WIRE 416 224 416 112
WIRE 560 224 560 112
WIRE 112 304 112 288
WIRE -32 352 -32 288
WIRE 112 352 112 304
WIRE 112 352 -32 352
WIRE 416 352 416 304
WIRE 416 352 112 352
WIRE 560 352 560 304
WIRE 560 352 416 352
WIRE -32 368 -32 352
SYMBOL voltage -32 96 R0
SYMATTR InstName V1
SYMATTR Value 12
SYMBOL ind 256 96 R90
SYMATTR InstName L1
SYMATTR Value 3.3u
SYMATTR SpiceLine Rser=0.015
SYMBOL cap 400 224 R0
SYMATTR InstName C1
SYMATTR Value 47u
SYMATTR SpiceLine Rser=0.002 Lser=400p
SYMBOL res 544 212 R0
SYMATTR InstName Rload
SYMATTR Value 1.5
SYMBOL nmos 80 112 R0
SYMATTR InstName M1
SYMATTR Value BSC050N03LS
SYMBOL nmos 80 224 R0
SYMATTR InstName M2
SYMATTR Value BSC050N03LS
TEXT -40 400 Left 2 !.tran 0 2m 0 10n
```

### The Boost Converter and the Right-Half-Plane Zero

For a step-up Boost topology elevating $V_{in} = 5\text{ V}$ to $V_{out} = 12\text{ V}$ with a load of $R_{load} = 10\text{ }\Omega$, generating a $1.2\text{ A}$ output, the CCM duty cycle is:

$D = 1 - \frac{V_{in}}{V_{out}} = 1 - \frac{5}{12} = 0.583$

The transient simulation of the Boost converter reveals a critical non-minimum phase behavior known as the Right-Half-Plane (RHP) zero. When a load step occurs, the duty cycle immediately increases. However, increasing the duty cycle transiently decreases the off-time $(1-D)$. Because the off-time is the only period during which energy is delivered to the output capacitor through the rectifier, the output voltage momentarily dips in the wrong direction before recovering. The mathematical location of the RHP zero is defined as:

$\omega_{RHP} = \frac{R_{load} \cdot (1-D)^2}{L}$

Using an inductor $L = 6.8\text{ \mu H}$ with a $DCR = 25\text{ m}\Omega$, the RHP zero occurs at $\omega_{RHP} \approx 255\text{ krad/s}$, which equates to approximately $40.6\text{ kHz}$. Attempting to cross the control loop over near this frequency results in catastrophic instability; the crossover frequency must be strictly mathematically limited to a maximum of $\frac{1}{3} f_{RHP}$ to avoid phase degradation.

### The SEPIC Converter

The SEPIC (Single-Ended Primary-Inductor Converter) topology provides non-inverting step-up or step-down functionality. In CCM, the voltage transfer ratio is:

$\frac{V_{out}}{V_{in}} = \frac{D}{1-D}$

A SEPIC requires two inductors, which are often wound on a single coupled magnetic core to save space and improve ripple steering. If $V_{in}$ ranges from $9\text{ V}$ to $16\text{ V}$ with $V_{out} = 12\text{ V}$ and $F_{sw} = 300\text{ kHz}$, coupled inductors $L_1 = L_2 = 10\text{ \mu H}$ are chosen. The coupling coefficient $k$ is estimated at $0.98$. In DCM, the SEPIC equations become highly complex, requiring specialized transfer functions to model the bifurcated resonant states between the coupling capacitor $C_c = 4.7\text{ \mu F}$ and the leakage inductances . During DCM in a SEPIC, the inductor currents reach zero, and the coupling capacitor forms an undamped resonant tank with the uncoupled leakage inductances, generating high-frequency ringing that must be simulated using tight maximum timestep constraints in the `.tran` directive.

## Chapter 3: Isolated Converters and Magnetics

The Flyback converter is the quintessential isolated topology for low-to-medium power applications. Unlike a forward converter, the flyback transformer acts as a multi-winding coupled inductor, storing energy in the magnetic core's air gap during the primary MOSFET on-time and releasing it to the secondary during the off-time.

### Transformer Modeling and Dot Convention

Proper modeling of the flyback transformer in LTspice requires defining the primary inductance ($L_p$), secondary inductance ($L_s$), and the mutual coupling coefficient ($k$). The dot convention dictates the phase relationship. If the primary dot is at the drain of the switching MOSFET, the secondary dot must be at the anode of the rectifying diode to ensure energy is strictly discharged during the off-time.

To model physical imperfections, the leakage inductance ($L_{lk}$) must be calculated. The mathematical representation of primary-referred leakage inductance is:

$L_{lk} = L_p \cdot (1 - k)$

If $L_p = 150\text{ \mu H}$ and $k = 0.985$, then $L_{lk} = 2.25\text{ \mu H}$. This uncoupled inductance stores energy that cannot be transferred to the secondary winding. When the primary MOSFET turns off, this energy forces a massive voltage spike on the drain node, which will exceed the device's avalanche breakdown if not actively mitigated.

### Active Clamp and Regenerative Snubber Design

While traditional passive RCD snubbers dissipate this leakage energy as heat, high-efficiency designs utilize an active regenerative snubber or active clamp . The active clamp topology employs an auxiliary high-side switch (typically a PMOS or a high-side driven NMOS) in series with a clamp capacitor $C_{clamp}$. 

When the main MOSFET turns off, the leakage energy resonates into $C_{clamp}$ through the body diode of the auxiliary switch. The auxiliary switch is then turned on with zero-voltage switching (ZVS). During the remainder of the off-time, the leakage energy stored in $C_{clamp}$ resonates back into the primary winding, regenerating the power back into the supply rail and facilitating ZVS for the main MOSFET upon its next turn-on cycle .

To design the clamp capacitor, the resonant half-period between $L_{lk}$ and $C_{clamp}$ must be larger than the maximum off-time of the converter to prevent the clamp voltage from resonating backwards. 

$f_{res} = \frac{1}{2\pi \sqrt{L_{lk} C_{clamp}}}$

Assuming a peak primary current $I_p = 3.2\text{ A}$ and $F_{sw} = 200\text{ kHz}$, selecting $C_{clamp} = 47\text{ nF}$ provides a resonant frequency of approximately $489\text{ kHz}$, guaranteeing that the clamp voltage remains relatively stable while absorbing the leakage spike without excessive ringing.

```spice
Version 4
SHEET 1 1280 880
WIRE -112 16 -176 16
WIRE 96 16 -112 16
WIRE -176 64 -176 16
WIRE 96 64 96 16
WIRE 96 160 96 144
WIRE -176 256 -176 144
WIRE 96 256 96 240
WIRE 96 256 -176 256
WIRE -176 288 -176 256
WIRE 320 16 208 16
WIRE 320 64 320 16
WIRE 448 64 320 64
WIRE 320 160 320 144
WIRE 448 160 448 144
WIRE 320 256 320 240
WIRE 448 256 448 240
WIRE 448 256 320 256
WIRE 320 288 320 256
WIRE 208 16 96 16
SYMBOL ind 80 48 R0
SYMATTR InstName Lp
SYMATTR Value 150u
SYMATTR SpiceLine Rser=0.05
SYMBOL ind 304 48 R0
SYMATTR InstName Ls
SYMATTR Value 9.375u
SYMATTR SpiceLine Rser=0.01
SYMBOL voltage -176 48 R0
SYMATTR InstName Vin
SYMATTR Value 24
SYMBOL diode 432 64 R0
SYMATTR InstName D1
SYMATTR Value MBRS3100
SYMBOL cap 432 160 R0
SYMATTR InstName Cout
SYMATTR Value 100u
SYMBOL res 512 160 R0
SYMATTR InstName Rload
SYMATTR Value 4
SYMBOL cap 208 48 R90
SYMATTR InstName Cclamp
SYMATTR Value 47n
SYMBOL pmos 208 112 R0
SYMATTR InstName Maux
SYMATTR Value Si7113DN
SYMBOL nmos 80 160 R0
SYMATTR InstName Mmain
SYMATTR Value BSC050N03LS
TEXT -176 336 Left 2 !.tran 0 5m 0 10n
TEXT -176 368 Left 2 !K1 Lp Ls 0.985
```

## Chapter 4: Loop Stability and The Middlebrook Method

In classical feedback systems, validating the stability margin requires breaking the closed loop to inject an AC stimulus and measuring the return signal. However, physically severing the feedback path in a highly integrated SMPS model destroys the DC operating point, pushing the operational amplifier into saturation and yielding nonsensical AC data.

Dr. R.D. Middlebrook pioneered a methodology to measure the open-loop gain of a system while keeping the loop physically closed at DC . The Middlebrook method injects an AC signal into the closed loop at a specific node, ideally between a low-impedance output and a high-impedance input.

### Mathematical Foundation

Let the loop be broken by injecting a test voltage $v_z$. The forward signal is $v_y$ and the return signal is $v_x$. The measured voltage loop gain $T_v$ is defined as $T_v = \frac{v_y}{v_x}$. Similarly, by injecting a test current $i_z$, the measured current loop gain is $T_i = \frac{i_y}{i_x}$ .

If the injection point is perfectly chosen such that the impedance looking backward $Z_1$ is vastly smaller than $Z_2$ (impedance looking forward), $T_v$ accurately approximates the true loop gain $T(s)$ . However, in highly integrated circuits, finding an ideal injection point is often impossible due to reverse signal transmission and bilateral loading effects.

Middlebrook's General Feedback Theorem, and its extension by Michael Tian, resolves this limitation by utilizing both voltage and current injection to mathematically reconstruct the exact loop gain regardless of the injection node's impedance ratio . The exact expression derived by Tian integrates both measurements to nullify backward transmission errors:

$T(s) = \frac{T_v T_i - 1}{T_v + T_i + 2}$

### SPICE Directives for Tian's Injection Method

To automate this complex matrix calculation in LTspice using Tian's extension, a specialized AC injection macro is required . The loop is conceptually broken using an AC voltage source `V_inj` and an AC current source `I_inj` operating sequentially across two simulation steps. 

The precise LTspice directives required to compute Tian's loop gain are:

```spice
.ac dec 100 10 1Meg
.step param run -1 1 2
.param V_inj = if(run==1, 1, 0)
.param I_inj = if(run==-1, 1, 0)

V1 inj_x inj_y {V_inj} AC {V_inj}
I1 inj_y inj_x {I_inj} AC {I_inj}
```

After the simulation completes, the raw AC data requires mathematical recombination. The true loop gain trace is plotted using the following exact waveform arithmetic in the LTspice plot engine:

$\frac{-1}{1 - \frac{1}{2 (V_{y,V} \cdot I_{x,I} - V_{x,V} \cdot I_{y,I}) + V_{y,V} + I_{x,I}}}$

Where $V_{y,V}$ represents the voltage at node $y$ during the voltage injection run, and $I_{x,I}$ represents the current at node $x$ during the current injection run . This complex algebraic manipulation completely eliminates the loading errors associated with standard single-injection methods.

## Chapter 5: Frequency Response Analysis (FRA)

While the `.ac` analysis combined with Tian's method is mathematically elegant for state-space averaged linear models, modern power electronics increasingly rely on encapsulated, highly non-linear switching $\mu$Modules or monolithic ICs. In these devices, the internal compensation networks and pulse-width modulators are hidden inside encrypted macromodels that operate exclusively in the time domain, rendering traditional `.ac` analysis impossible because the SPICE engine cannot linearize encrypted digital logic .

To circumvent this limitation, modern versions of LTspice introduced the native Frequency Response Analysis (`.fra`) directive. This tool performs automated cycle-by-cycle time-domain simulations, injecting a sinusoidal perturbation, waiting for the system to settle, performing a Discrete Fourier Transform (DFT) to extract the magnitude and phase of the fundamental frequency, and then sequentially stepping to the next frequency .

### The Native .fra Probe Syntax

The FRA component requires a highly specific schematic setup. The loop is broken using a specialized 4-terminal analyzer probe (`fraprobe`) .

The proper deployment mandates the following precise rules:
1.  **Placement:** The FRA probe must be placed in series with the feedback loop, oriented such that the flat side faces the lower impedance node (the output voltage rail) and the pointy side faces the higher impedance node (the feedback divider network) . 
2.  **Amplitude Tuning:** The probe injects a perturbation amplitude, which must be carefully calibrated. If the amplitude is too low, the injected signal is lost in the intrinsic switching ripple noise, resulting in a jagged Bode plot. If it is too high, it drives the error amplifier into non-linear slewing or duty-cycle saturation, distorting the DFT extraction. A standard initial stimulus amplitude is between $10\text{ mV}$ and $20\text{ mV}$.
3.  **Directive Configuration:** The SPICE directive explicitly calls the FRA engine.

```spice
.fra Tstart=1m Tstop=50m FreqStart=100 FreqStop=100k Npts=50 Amplitude=15m
```

The parameters demand rigorous configuration based on the switching frequency and loop bandwidth :
*   `Tstart=1m`: The simulation will run freely for $1\text{ ms}$ before data collection begins, allowing the converter to reach steady-state regulation and bypassing startup transients.
*   `Tstop=50m`: Determines the maximum integration time at the lowest frequency points to ensure sufficient wave cycles are captured for accurate DFT extraction.
*   `Amplitude=15m`: The peak voltage of the injected sine wave.

When the simulation completes, LTspice generates a Bode plot mirroring standard AC analysis but derived entirely from highly accurate, large-signal, nonlinear transient data .

## Chapter 6: Interpreting Bode Plots and Stability Margins

Once the frequency response data is extracted via transient `.fra` analysis or averaged `.ac` sweeps, the Bode plot must be meticulously interpreted. Stability in a linear, time-invariant approximation of a power converter is determined by the Nyquist stability criterion, which practically translates to Phase Margin (PM) and Gain Margin (GM) on a Bode plot.

### Phase Margin, Gain Margin, and Crossover Frequency

The open-loop transfer function $G(s)H(s)$ consists of the plant $G(s)$ representing the power stage and the compensator $H(s)$ representing the error amplifier. 

The crossover frequency ($f_c$) is identified as the frequency at which the magnitude of the loop gain $|G(j\omega)H(j\omega)|$ equals $0\text{ dB}$, or a scalar gain of $1\text{ V/V}$. This parameter directly dictates the control bandwidth and transient response speed of the SMPS. A fundamental constraint for crossover is establishing $f_c \le \frac{F_{sw}}{10}$ to prevent the high-frequency switching noise from aliasing into the control loop .

Phase Margin is evaluated strictly at the crossover frequency $f_c$. It represents the safety margin in phase delay before the system reaches absolute instability at $-180^\circ$. 

$PM = \angle (G(j 2\pi f_c) H(j 2\pi f_c)) - (-180^\circ)$

A Phase Margin of $45^\circ$ is the absolute minimum requirement for stability, typically yielding a transient step response with approximately $15\%$ overshoot. A robust design targeting critical damping aims for a PM of $60^\circ$, which yields minimal ringing. 

Gain Margin is evaluated at the frequency where the phase delay reaches precisely $-180^\circ$. It is defined as the absolute value of the magnitude in decibels below $0\text{ dB}$. 

$GM = 0\text{ dB} - |G(j 2\pi f_{-180}) H(j 2\pi f_{-180})|$

A highly robust design requires a minimum Gain Margin of $10\text{ dB}$ to ensure that component tolerances or temperature drifts do not inadvertently push the gain above zero when the phase is inverted.

### Managing Right-Half-Plane (RHP) Zeros

As previously mentioned in the context of Boost and Flyback topologies operating in CCM, RHP zeros inject catastrophic phase delay while simultaneously increasing the magnitude slope. The mathematical footprint of a single RHP zero is characterized by:

$H_{RHP}(s) = \left( 1 - \frac{s}{\omega_{RHP}} \right)$

Because the zero resides in the right-half of the s-plane, the phase contribution is $\angle (1 - j\frac{\omega}{\omega_{RHP}}) = \arctan(-\frac{\omega}{\omega_{RHP}})$. This phase trajectory drops to $-90^\circ$ at high frequencies, acting exactly like a pole in terms of phase degradation, but accelerating the gain like a zero. Consequently, the control loop must be forcefully rolled off well before this frequency. The crossover frequency is typically constrained to $f_c < \frac{\omega_{RHP}}{2\pi \cdot 3}$, ensuring the RHP zero's phase degradation does not fatally erode the Phase Margin.

## Chapter 7: Efficiency, Power Dissipation, and Safe Operating Area (SOA)

Thermal management is inexorably linked to the electrical design. Validating efficiency and verifying that the MOSFETs remain within their Safe Operating Area (SOA) requires precise measurement of power dissipation. LTspice provides a highly advanced set of `.meas` commands capable of integrating transient waveforms over specific time intervals to determine localized and system-wide energy losses .

### Cycle-by-Cycle Efficiency Calculation

To calculate the absolute efficiency of a converter under steady-state conditions, the input power ($P_{in}$) and output power ($P_{out}$) must be integrated over exactly one, or a discrete integer multiple of, switching cycles.

Given an input voltage source `V1`, an output node `V(out)`, and an output load current source `I1`, the exact `.meas` scripts are written to evaluate the average power :

```spice
.tran 0 2.5m 2m startup
.meas TRAN Pin AVG -V(IN)*I(V1) FROM 2.40m TO 2.42m
.meas TRAN Pout AVG V(OUT)*I(I1) FROM 2.40m TO 2.42m
.meas TRAN Efficiency PARAM (Pout/Pin)*100
```
The negative sign on the input power calculation, `-V(IN)*I(V1)`, is an absolute necessity because LTspice's passive sign convention dictates that current flowing out of the positive terminal of a voltage source is considered negative . By calculating the ratio, the engineer derives the true steady-state efficiency.

### Average Power Dissipation in MOSFETs

To quantify the thermal stress on the primary switching MOSFET (`M1`), we must isolate its internal power dissipation. The instantaneous power is simply the product of the Drain-to-Source voltage and the Drain current: $P_{inst}(t) = V_{DS}(t) \cdot I_D(t)$ .

By integrating this localized instantaneous power over time, we extract the total energy, which is then divided by the time interval to yield average power dissipation :

```spice
.meas TRAN P_Loss_M1 INTEG V(SW)*I(M1) FROM 2.40m TO 2.42m
.meas TRAN P_Loss_Avg PARAM P_Loss_M1 / (2.42m - 2.40m)
```
If `P_Loss_Avg` calculates to $1.25\text{ W}$, and the MOSFET possesses a thermal resistance junction-to-ambient ($\theta_{JA}$) of $45^\circ\text{C/W}$, the junction temperature will rise by $\Delta T = 1.25 \times 45 = 56.25^\circ\text{C}$ above ambient. This capability allows the engineer to definitively validate thermal SOA margins prior to layout.

## Chapter 8: Gate Drive Simulation and Switching Losses

The macroscopic power loss evaluated in Chapter 7 is a composite of continuous conduction losses ($P_{cond}$) and dynamic switching losses ($P_{sw}$). Isolating the dynamic switching losses requires high-fidelity modeling of the gate drive circuitry and the intrinsic nonlinear capacitances of the power MOSFET .

### Modeling the Miller Plateau

During the turn-on transition, the gate current initially charges the Gate-Source capacitance ($C_{gs}$). Once the gate voltage reaches the threshold voltage $V_{th}$, the MOSFET begins to conduct load current, and the Drain voltage $V_{DS}$ subsequently begins to fall. Due to the Miller effect, the Gate-Drain capacitance ($C_{gd}$) appears mathematically amplified to the gate drive circuit. 

During the period where $V_{DS}$ is actively falling, the gate voltage is clamped at a flat voltage level known as the Miller Plateau, mathematically defined as:

$V_{plateau} = V_{th} + \frac{I_D}{g_m}$

where $g_m$ is the forward transconductance of the device. The time spent residing on this plateau is the primary contributor to crossover switching losses, as the device is simultaneously supporting high voltage and conducting high current .

### Calculating Dynamic Switching Losses

To minimize switching losses, the gate resistance ($R_g$) must be tuned to supply maximum current during the Miller plateau without inducing severe parasitic ringing . If $R_g = 2.2\text{ }\Omega$ and the gate driver outputs $V_{dr} = 10\text{ V}$, the Miller plateau current is calculated as $I_{g,miller} = \frac{V_{dr} - V_{plateau}}{R_g}$. 

The turn-on time $t_{on}$ is closely approximated by:

$t_{on} = \frac{Q_{gd}}{I_{g,miller}}$

The dynamic turn-on energy $E_{on}$ per cycle can be explicitly integrated in LTspice by isolating the exact time bounds of the crossover interval using `.meas` commands . 

```spice
.meas TRAN E_on INTEG V(SW)*I(M1) FROM 2.4012m TO 2.4015m
```

The average switching power loss is then derived from the summation of turn-on and turn-off energies: $P_{sw} = (E_{on} + E_{off}) \cdot F_{sw}$ .

### Tuning Deadtime in Synchronous Topologies

In a synchronous half-bridge converter, if both the high-side and low-side MOSFETs turn on simultaneously, catastrophic shoot-through currents will destroy the phase leg. Deadtime ($t_{dt}$) must be inserted between the complementary gate signals. However, excessive deadtime forces the load current to flow through the low-side MOSFET's lossy body diode. This diode conduction induces massive reverse recovery losses ($Q_{rr}$) when the high-side MOSFET subsequently turns on, alongside severe forward conduction losses defined by $V_f \cdot I_D \cdot t_{dt}$. Validating a precise deadtime of $20\text{ ns}$ to $35\text{ ns}$ in LTspice using highly nonlinear `.lib` models ensures optimal efficiency mapping by balancing shoot-through prevention against body diode dissipation.

## Chapter 9: EMI Mitigation, Layout Parasitics, and Ringing

A schematic simulated without layout parasitics is an idealized fantasy. Real-world PCB traces inherently possess stray inductance, and copper layers separated by FR4 dielectric produce stray capacitance. These unseen components form high-frequency resonant tank circuits that ring aggressively during the rapid $\frac{dv}{dt}$ and $\frac{di}{dt}$ switching transitions.

### Modeling PCB Parasitics

A standard analytical rule of thumb for physical PCB trace inductance is $L_{trace} \approx 1\text{ nH/mm}$. An $8\text{ mm}$ trace connecting the high-side source to the switch node inserts $8\text{ nH}$ of parasitic inductance into the critical commutation loop. When the low-side MOSFET turns on at a commutation rate of $\frac{di}{dt} = 2\text{ A/ns}$, the voltage overshoot induced across this physical trace is:

$V_{spike} = L_{trace} \frac{di}{dt} = 8\times 10^{-9} \cdot 2\times 10^9 = 16\text{ V}$

This $16\text{ V}$ inductive spike is superimposed onto the switch node, causing localized ground bounce and radiating severe Electromagnetic Interference (EMI). 

To accurately simulate this phenomenon, explicit inductor components ($L_{parasitic} = 8\text{ nH}$) and capacitor components ($C_{stray} = 15\text{ pF}$) must be manually inserted into the critical high-di/dt commutation loops in the LTspice `.asc` schematic.

### Feedforward RC Snubber Design

To dampen this high-frequency resonant ringing without sacrificing excessive efficiency, a feedforward RC snubber is placed directly across the low-side switch node to ground. The ringing frequency $f_{ring}$ is observed using the LTspice FFT tool to be, for example, $150\text{ MHz}$.

The parasitic resonant tank is defined by:
$f_{ring} = \frac{1}{2\pi \sqrt{L_{leak} C_{stray}}}$

To critically damp the node without generating excessive thermal losses, the snubber capacitor $C_{sn}$ is typically sized to be $3\times$ to $4\times$ the value of the parasitic capacitance $C_{stray}$. 
If $C_{stray} = 15\text{ pF}$, we select $C_{sn} = 56\text{ pF}$. 

The required snubber resistor $R_{sn}$ is then chosen to match the characteristic impedance of the parasitic tank:

$R_{sn} = \sqrt{\frac{L_{leak}}{C_{stray}}}$

Assuming the $8\text{ nH}$ leakage, the characteristic impedance dictates $R_{sn} = \sqrt{\frac{8 \times 10^{-9}}{15 \times 10^{-12}}} = 23.1\text{ }\Omega$. Implementing a $22\text{ }\Omega$, $56\text{ pF}$ RC snubber in the simulation will drastically attenuate the $150\text{ MHz}$ spike, preventing EMI propagation and ensuring compliance with stringent CISPR-25 or EN55022 radiated emissions standards.

## Chapter 10: Advanced Control Loop Compensators

The stability, dynamic bandwidth, and disturbance rejection of the SMPS are dictated entirely by the error amplifier's compensator network. Control strategies broadly divide into Voltage-Mode Control (VMC) and Current-Mode Control (CMC).

### Current-Mode Control vs Voltage-Mode Control

In Voltage-Mode Control, the error amplifier output directly sets the duty cycle by comparing the error signal against a fixed-frequency artificial voltage ramp oscillator. The LC output filter produces a complex conjugate double-pole at $\omega_o = \frac{1}{\sqrt{LC}}$. This double-pole causes a brutal $-180^\circ$ phase drop precisely at the resonant frequency, severely complicating stabilization and requiring a highly complex Type-III compensator to inject two corresponding zeros.

In Peak Current-Mode Control (CMC), the peak inductor current is actively sensed cycle-by-cycle . The error amplifier no longer sets a duty cycle; instead, it sets a current command threshold. Because the inductor behaves as a controlled current source within the feedback loop, the inductor mathematically "disappears" from the low-frequency small-signal transfer function. This phenomenon reduces the power stage to a single-pole system governed primarily by the output capacitor and the load resistor: $\omega_p = \frac{1}{R_{load} C_{out}}$. This single-pole system undergoes a gradual $-90^\circ$ phase drop, making it vastly easier to compensate using a simpler Type-II compensator.

| Control Architecture | Power Stage Poles | Required Compensator | Disturbance Rejection | Susceptibility |
| :--- | :--- | :--- | :--- | :--- |
| **Voltage-Mode (VMC)** | Complex double-pole | Type-III (2 zeros, 2 poles) | Poor audio susceptibility | Highly immune to noise |
| **Current-Mode (CMC)** | Single-pole | Type-II (1 zero, 1 pole) | Excellent input feedforward | Susceptible to subharmonic oscillation |

### Type-II and Type-III Transfer Functions

The **Type-II Compensator** provides an origin pole to ensure infinite DC gain and zero steady-state error, one zero to boost phase at the crossover frequency, and one high-frequency pole to attenuate switching noise. 
Given a transconductance ($g_m$) error amplifier, the mathematical transfer function in the s-domain is:

$H_{Type-II}(s) = g_m \frac{1 + s R_c C_c}{s (C_c + C_p) \left( 1 + s R_c \frac{C_c C_p}{C_c + C_p} \right)}$

Where the resistor $R_c$ and capacitor $C_c$ form the stabilizing zero, and $C_p$ sets the high-frequency noise-attenuating pole.

The **Type-III Compensator** provides an origin pole, two zeros to counteract the complex double-pole of VMC, and two high-frequency poles. 
For an operational amplifier-based Type-III network utilizing components $R_1, R_2, R_3, C_1, C_2, C_3$, the exhaustive transfer function is:

$H_{Type-III}(s) = \frac{R_1 + R_3}{R_1 R_3 C_2} \cdot \frac{\left( s + \frac{1}{R_2 C_1} \right) \left( s + \frac{1}{(R_1+R_3) C_3} \right)}{s \left( s + \frac{C_1+C_2}{R_2 C_1 C_2} \right) \left( s + \frac{1}{R_3 C_3} \right)}$

### Slope Compensation in CMC

A critical vulnerability of Peak Current-Mode Control is subharmonic oscillation . If the duty cycle $D$ exceeds $50\%$, the geometry of the inductor current waveform dictates that any small perturbation in the inductor current will propagate to the next switching cycle with an amplified magnitude. This positive feedback mechanism causes the duty cycle to oscillate chaotically at exactly half the switching frequency ($\frac{F_{sw}}{2}$) .

To mathematically nullify this instability, an artificial downward slope, known as Slope Compensation ($m_c$), must be superimposed onto the current-sense signal, or equivalently subtracted from the error amplifier reference signal. To guarantee absolute stability across all operating duty cycles, the injected slope $m_c$ must satisfy the fundamental Ridley stability criterion:

$m_c \ge \frac{1}{2} m_2$

where $m_2$ represents the natural downward slope of the inductor current during the off-time, defined as $m_2 = \frac{V_{out}}{L}$.

In LTspice, this dynamic is explicitly modeled by generating an artificial voltage ramp using a `.param` behavioral voltage source and summing it into the current-sense node before it reaches the PWM comparator. 

| Stability Parameter | Operating Condition | Resulting Dynamic Behavior |
| :--- | :--- | :--- |
| $m_c = 0$ | $D > 0.5$ | Undamped subharmonic oscillation at $F_{sw}/2$ |
| $m_c < 0.5 \cdot m_2$ | $D > 0.5$ | Poorly damped ringing at $F_{sw}/2$ |
| $m_c = 0.5 \cdot m_2$ | All $D$ | Infinite Q, critically damped, optimal bandwidth |
| $m_c \ge m_2$ | All $D$ | Deadbeat control (perturbations vanish in exactly 1 cycle) |

By integrating mathematically derived slope compensation injection, utilizing the advanced FRA or Middlebrook methods to extract precise Bode plots, analyzing the dynamic `.meas` transient integrations for exact switching losses, and modeling high-fidelity regenerative active snubbers for non-ideal leakage inductances, the power electronics engineer transforms the seemingly chaotic landscape of power conversion into an exact, predictable, and exceptionally robust discipline. 


## Sources

- [**engineering.usu.edu** Design and Control of Series Resonant Converters for DC Current](https://engineering.usu.edu/ece/files/pdfs/student-papers/dissertations/2018/wang-hongjie-phd-dissertation.pdf)
- [**itechguides.com** Simulating a Buck-Boost Converter in LTspice - iTechGuides](https://www.itechguides.com/simulating-a-buck-boost-converter-in-ltspice-from-ideal-switches-to-a-regulated-design/)
- [**researchgate.net** Extracting Small-Signal Models of Power Converters Using Time](https://www.researchgate.net/publication/385832529_Extracting_Small-Signal_Models_of_Power_Converters_Using_Time-Domain_Step_Response_Simulation_in_SPICE)
- [**youtube.com** Lecture 09 :Current mode control, Control design, Sampling effect](https://www.youtube.com/watch?v=8zKD57PNUTc)
- [**redrok.com** Application Note](https://www.redrok.com/an9208.pdf)
- [**extrica.com** A novel regenerative snubber circuit for flyback topology converters](https://www.extrica.com/article/20898)
- [**researchgate.net** (PDF) A novel regenerative snubber circuit for flyback topology](https://www.researchgate.net/publication/342567538_A_novel_regenerative_snubber_circuit_for_flyback_topology_converters)
- [**venableinstruments.com** Measurement of loop gain in feedback systems. - Venable Instruments](https://www.venableinstruments.com/hubfs/Middlebrook_Measurement%20of%20loop%20gain%20in%20feedback%20systems.pdf)
- [**u.dianyuan.com** Measurement of loop gain in feedback systems - RD MIDDLEBROOK](https://u.dianyuan.com/upload/space/2010/12/30/1293704376-389780.pdf)
- [**edn.com** Middlebrook's and Rosenstark's loop gain measurements - EDN](https://www.edn.com/middlebrooks-and-rosenstarks-loop-gain-measurements/)
- [**scribd.com** Loop Gain Simulation Techniques Explained | PDF - Scribd](https://www.scribd.com/document/693761730/Loop-Gain-Simulation-Frank-Wiedmann)
- [**keysight.com** Designing for Stability in High Frequency Circuits | Keysight](https://www.keysight.com/content/dam/keysight/en/doc/gate/application-notes/Designing-for-Stability-in-High-Frequency-Circuits.pdf)
- [**sanjayavasarala.wordpress.com** Open loop analysis in HSPICE and MATLAB using Middlebrook's](https://sanjayavasarala.wordpress.com/2012/09/11/open-loop-analysis-in-hspicematlab-using-middlebrooks-technique/)
- [**we-online.com** LTspice examples](https://www.we-online.com/files/pdf1/ltspice-examples.pdf)
- [**ez.analog.com** Getting Started with LTspice - FAQs/Docs - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs/c/getting-started-with-ltspice)
- [**ez.analog.com** How to Generate a Bode Plot for an SMPS in LTspice - FAQs/Docs](https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs/FD549/generate-a-bode-plot-for-an-smps-in-ltspice-17-1)
- [**scribd.com** LTspice Commands and Shortcuts Guide | PDF | Spice - Scribd](https://www.scribd.com/document/858256355/LT-Spice-keyboard-shortcuts)
- [**macnica.co.jp** Let's try using LTspice - Dot Commands (3): Transient Analysis (.tran)](https://www.macnica.co.jp/en/business/semiconductor/articles/analog_devices/147282/)
- [**analog.com** LTspice: Using .MEAS and .STEP Commands to Calculate Efficiency](https://www.analog.com/en/resources/technical-articles/ltspice-using-meas-and-step-commands-to-calculate-efficiency.html)
- [**powerelectronicsnews.com** Estimation of Switching Losses of SiC MOSFET using LTspice](https://www.powerelectronicsnews.com/power-supply-design-notes-estimation-of-switching-losses-of-sic-mosfet-using-ltspice/)
- [**assets.wolfspeed.com** PRD-03043: Measuring Switching and Conduction Losses in](https://assets.wolfspeed.com/uploads/2024/01/Wolfspeed_PRD-03043_Measuring_Switching_and_Conduction_Losses_in_LTspice_Simulation_Software.pdf)
- [**edaboard.com** how to find switching losses in LTSpice - EDABoard.com](https://www.edaboard.com/threads/how-to-find-switching-losses-in-ltspice.412968/)
- [**turcomat.org** Design of peak current mode-controlled Buck converter with high](https://turcomat.org/index.php/turkbilmat/article/download/7834/6186/14116)
- [**agnd.net** LTspice - agnd.net](https://agnd.net/valpo/341/LTspiceHelpXVII.pdf)
- [**denethor.wlu.ca** LTspice Tutorial - Wilfrid Laurier University Physics Labs](http://denethor.wlu.ca/ltspice/)
- [**youtube.com** LTspice tutorial - Stepping sets of parameters - YouTube](https://www.youtube.com/watch?v=1iOzX91LJ8g)
- [**youtube.com** LTspice tutorial - FREQ function - YouTube](https://www.youtube.com/watch?v=Ao16bytrbwc)
- [**ltwiki.org** Undocumented LTspice - LTwiki](https://ltwiki.org/?title=Undocumented_LTspice)
- [**api.eestar.com** LTspice XVII help 中文翻译版本文由微信公众号电子帮翻译而成](https://api.eestar.com/article/share/2020/10/fda54202010221347106716.pdf)
- [**mdpi.com** Review of Voltage Balancing Techniques for Series-Connected SiC](https://www.mdpi.com/1996-1073/17/23/5846)
- [**researchgate.net** Analytical Model to Study Hard Turn-off Switching Dynamics of SiC](https://www.researchgate.net/publication/341809592_Analytical_Model_to_Study_Hard_Turn-off_Switching_Dynamics_of_SiC_mosfet_and_Schottky_Diode_Pair)
- [**mdpi-res.com** Advanced Power Electronics Technology - MDPI](https://mdpi-res.com/bookfiles/book/11325/Advanced_Power_Electronics_Technology.pdf?v=1790299047)
- [**figshare.swinburne.edu.au** NEUROELECTRONICS: DESIGN PATTERNS, METHODS AND](https://figshare.swinburne.edu.au/articles/thesis/Neuroelectronics_Design_patterns_methods_and_implementations/31418492/1/files/62179811.pdf)
- [**arxiv.org** Topolectrical circuits – recent experimental advances and ... - arXiv](https://arxiv.org/html/2502.18563v2)
- [**electronics.stackexchange.com** Phase margin analysis of a [diy] PMOS LDO [with LTspice]](https://electronics.stackexchange.com/questions/202754/phase-margin-analysis-of-a-diy-pmos-ldo-with-ltspice)
- [**minds.wisc.edu** A HARDWARE-IN-THE-LOOP PLATFORM FOR DC PROTECTION](https://minds.wisc.edu/bitstreams/36373289-26f6-4d1b-9512-526b375cad20/download)
- [**ltspicehelpmanual.azurewebsites.net** .MEASURE — Evaluate User-Defined Electrical Quantities](https://ltspicehelpmanual.azurewebsites.net/measure--evaluateuser-definedele.htm)
- [**ufsj.edu.br** LTspice tutorial - UFSJ](https://ufsj.edu.br/portal-repositorio/File/Apostila%202.pdf)
- [**electronics.stackexchange.com** How to integrate a signal in LTSpice?](https://electronics.stackexchange.com/questions/254602/how-to-integrate-a-signal-in-ltspice)
- [**web.mit.edu** Introduction to LTspice - MIT](https://web.mit.edu/6.101/www/s2020/handouts/LTSpiceIntro.pdf)
- [**epc-co.com** Circuit Simulation Using EPC Device Models](https://epc-co.com/epc/portals/0/epc/documents/product-training/circuit_simulations_using_spice.pdf)
- [**uio.no** Mandatory lab 3 : Component noise with LTspice - UiO](https://www.uio.no/studier/emner/matnat/ifi/IN5230/h25/nedlastninger/presenation_assignment_3_2025.pdf)
- [**researchgate.net** (PDF) Guide to Basics Of LT-SPICE-XVII - ResearchGate](https://www.researchgate.net/publication/376835934_Guide_to_Basics_Of_LT-SPICE-XVII)
- [**youtube.com** LTSPICE measure - YouTube](https://www.youtube.com/watch?v=DqLXW4qn6j0)
- [**dev-docs.kicad.org** LTspice - Developer Documentation | KiCad](https://dev-docs.kicad.org/en/import-formats/ltspice/index.html)
- [**simonbramble.co.uk** Flyback Converter Design | LTspice - Simon Bramble](http://www.simonbramble.co.uk/dc_dc_converter_design/flyback_converter/flyback_converter_design.html)
- [**ez.analog.com** LT3748 RCD snubber help - EngineerZone - Analog Devices](https://ez.analog.com/power/f/q-a/585060/lt3748-rcd-snubber-help)
- [**analog.com** No-Opto Flyback DC/DC Converters & Snubber Protection Circuits](https://www.analog.com/en/resources/technical-articles/no-opto-flyback-dc-dc-converters-snubber-protection-circuits.html)
- [**rohm.com** Three phase, Single-End Flyback with RCD snubber (AC/DC IC](https://www.rohm.com/topology/aux_3ph_se_flyback_acdc_ic)
- [**youtube.com** How to simulate isolated DC-DC converters (e.g., FLYBACK)](https://www.youtube.com/watch?v=w44CT3GlNzo)
- [**electronics.stackexchange.com** Flyback transformer simulation in LTspice](https://electronics.stackexchange.com/questions/602323/flyback-transformer-simulation-in-ltspice)
- [**youtube.com** LTSPICE RDC Snubber for 250W Flyback DC DC - YouTube](https://www.youtube.com/watch?v=1paJYiab8-s)
- [**analog.com** EVAL-LT8306-AZ Evaluation Board - Analog Devices](https://www.analog.com/en/resources/evaluation-hardware-and-software/evaluation-boards-kits/eval-lt8306-az.html)
- [**ez.analog.com** LT1242 Current mode control help - EngineerZone - Analog Devices](https://ez.analog.com/power/f/q-a/118550/lt1242-current-mode-control-help)
- [**analog.com** A Unified LTspice AC Model for Current-Mode DC-to-DC Converters](https://www.analog.com/en/resources/technical-articles/a-unified-ltspice-ac-model-for-current-mode-dc-to-dc-converters.html)
- [**pmc.ncbi.nlm.nih.gov** Identifying A(s) and β(s) in Single-Loop Feedback Circuits Using the](https://pmc.ncbi.nlm.nih.gov/articles/PMC9185645/)
- [**ieeexplore.ieee.org** A Multi-Point Sensitivity Approach for Stability Analysis ... - IEEE Xplore](https://ieeexplore.ieee.org/iel8/8784029/8999500/11670508.pdf)
- [**arxiv.org** Accurate Small-Signal Modeling of Digitally Controlled Buck ... - arXiv](https://arxiv.org/html/2510.00943v1)
- [**mdpi.com** Power Electronics in Renewable Energy Systems - MDPI](https://www.mdpi.com/bookfiles/book/1373/Power_Electronics_in_Renewable_Energy_Systems.pdf)
- [**mdpi.com** Design Automation of Low Dropout Voltage Regulators: A General](https://www.mdpi.com/2079-9292/12/1/205)
- [**ieeexplore.ieee.org** Distributed Control Strategies for Microgrids: An Overview](https://ieeexplore.ieee.org/iel7/6287639/8948470/09233319.pdf)
- [**escholarship.org** UC Davis - eScholarship.org](https://escholarship.org/content/qt72t5b63m/qt72t5b63m.pdf)
- [**ieeexplore.ieee.org** Investigation on the Small Signal Characteristic Based on the LLC](https://ieeexplore.ieee.org/iel7/7873541/8758247/08758252.pdf)
- [**analog.com** ltspice-keyboard-shortcuts.pdf - Analog Devices](https://www.analog.com/media/en/news-marketing-collateral/solutions-bulletins-brochures/ltspice-keyboard-shortcuts.pdf?modelType=spice-models)
- [**electronics.stackexchange.com** MOSFET switching losses in LTSpice](https://electronics.stackexchange.com/questions/340554/mosfet-switching-losses-in-ltspice)
- [**ez.analog.com** Switching power loss - Q&A - LTspice - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/565294/switching-power-loss)
- [**groups.io** LTspice@groups.io | How can I simulate SWITCHING LOSSES and](https://groups.io/g/LTspice/topic/how_can_i_simulate_switching/97577052)
- [**youtube.com** Converter switch loss measurement in LTspice - YouTube](https://www.youtube.com/watch?v=b5vnJvpNuac)
- [**ltspicehelpmanual.azurewebsites.net** W. Current Controlled Switch - Introduction](https://ltspicehelpmanual.azurewebsites.net/wcurrentcontrolledswitch.htm)
- [**ltspicehelpmanual.azurewebsites.net** J. JFET - Introduction](https://ltspicehelpmanual.azurewebsites.net/jjfet.htm)
- [**ltspicehelpmanual.azurewebsites.net** Data Trace Selection - Introduction](https://ltspicehelpmanual.azurewebsites.net/datatraceselection.htm)
- [**scribd.com** Users Guide | PDF | Spice | Electronic Circuits - Scribd](https://www.scribd.com/document/553612376/Users-Guide)
- [**scribd.com** PSIM User Manual PDF - Scribd](https://www.scribd.com/document/458320168/PSIM-user-manual-pdf)
- [**scribd.com** User's Manual: © Altair Engineering, Inc. All Rights Reserved | PDF](https://www.scribd.com/document/641107862/Untitled)
- [**ltspicehelpmanual.azurewebsites.net** G. Voltage Dependent Current Source - Introduction](https://ltspicehelpmanual.azurewebsites.net/gvoltagedependentcurrentsource.htm)
- [**cdn14.21dianyuan.com** Loop Gain Measurement.qxp](https://cdn14.21dianyuan.com/download.php?id=61242)
- [**edaboard.com** Middlebrook's Method VS Tian's Method VS Middlebrook's General](https://www.edaboard.com/threads/middlebrooks-method-vs-tians-method-vs-middlebrooks-general-feedback-theorem.393450/)
- [**ejournals.eu** use of middlebrook's method in frequency analysis of power](https://ejournals.eu/pliki_artykulu_czasopisma/pelny_tekst/674b9e89-1087-4099-8535-205384a6e565/pobierz)
- [**youtube.com** Video 3: Feedback Amplifier Analysis - The Middlebrook approach](https://www.youtube.com/watch?v=dbSrgBhbsbo)
