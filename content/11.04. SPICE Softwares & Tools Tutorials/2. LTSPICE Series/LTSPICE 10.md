# Advanced Analog Verification: Statistical Yield, SPICE Mechanics, and Automated Reliability Metrics

The discipline of analog verification and reliability engineering demands a rigorous, mathematical approach to circuit simulation. Modern integrated circuit design relies heavily on SPICE engines to validate statistical yield, extract deeply embedded performance metrics, and guarantee operation across extreme process, voltage, and temperature (PVT) variations. The transition from qualitative waveform inspection to quantitative, automated metric extraction is what separates basic simulation from professional-grade verification. This exhaustive research report dissects the LTspice simulation engine, detailing the underlying matrix solver algorithms, advanced statistical analysis techniques, and the extraction of automated metrics through complex post-processing directives. 

## Chapter 1: The Syntax, Parsing Engine, and Order of Execution

Understanding the sequential parsing and mathematical formulation within the LTspice simulation engine establishes the foundation of advanced analog verification. The simulator does not interpret a netlist linearly from top to bottom; rather, it executes a highly deterministic, multi-pass parsing sequence before the matrix solver initiates.

### Netlist Parsing and Parameter Resolution
When LTspice reads a `.cir`, `.net`, or `.asc` file, the parsing engine executes a preliminary sweep to prioritize `.param` statements and `.func` directives, regardless of their topological position within the schematic or netlist file . All parameter substitutions, mathematical expressions, and subcircuit scoping assignments are evaluated completely before the simulation matrix is constructed . This pre-computation phase allows complex mathematical expressions, such as temperature-dependent component values or statically evaluated trigonometric functions, to govern component values before the matrix solver is ever invoked.

Scoping rules apply strictly based on the method of external file inclusion. The inclusion of external SPICE models relies on two primary directives with fundamentally different behaviors. The `.inc` directive injects the target file directly into the global scope, essentially pasting the exact text into the top-level netlist, meaning all free-floating components within that file become part of the active circuit . Conversely, the `.lib` directive operates selectively; it only loads `.model` and `.subckt` definitions that are explicitly called by the active circuit elements, actively ignoring any standalone circuit elements or stimuli defined at the global scope of the library file .

### The Modified Nodal Analysis (MNA) Engine
Once parameters are resolved and subcircuits are flattened, LTspice constructs the Modified Nodal Analysis (MNA) matrix. The MNA formulation represents the circuit in conductance form, systematically "stamping" each element into a node-voltage matrix based on its terminal connections . The fundamental system is solved via the linear algebraic equation:

$\mathbf{A} \cdot \mathbf{x} = \mathbf{b}$

Where $\mathbf{A}$ represents the matrix containing the network conductances (and frequency-dependent reactive terms for AC or transient analysis), $\mathbf{x}$ represents the state vector of unknown node voltages and dependent branch currents (such as the currents flowing through inductors and independent voltage sources), and $\mathbf{b}$ contains the independent source stimuli . During transient analysis time steps, capacitors and inductors are replaced by their trapezoidal-rule companion models, representing them as a conductance in parallel with a current source set by the previous time step's state . 

### DC Operating Point and Newton-Raphson Convergence
Before a transient or AC analysis can begin, the engine must solve the DC operating point to establish the initial biasing conditions of the circuit. Because semiconductor devices introduce highly non-linear conductances, LTspice utilizes the Newton-Raphson (NR) algorithm . This numerical method iteratively linearizes the non-linear device equations at an initial guess point, utilizing the Jacobian matrix to solve the resulting linear system for voltage corrections, and repeatedly updates the guess until the nodal equations converge within specified tolerance limits defined by `reltol`, `vntol`, and `abstol` .

If the initial NR iterations fail to converge due to singular matrices, highly non-linear junctions, or positive feedback loops, LTspice automatically triggers a sequence of contingency algorithms.

| Solver Contingency Stage | Mathematical Mechanism | Application Scenario |
| :--- | :--- | :--- |
| **1. Gmin Stepping** | Injects a small conductance ($10^{-12} \Omega^{-1}$) across all non-linear junctions to prevent singular matrices, iteratively reducing it to zero as convergence is achieved. | Curing "Singular Matrix" errors in deep submicron MOSFET networks . |
| **2. Source Stepping** | Ramps independent voltage and current sources from zero to their final values, tracking the operating point continuously. | Resolving states in circuits with multiple stable operating points or heavy hysteresis . |
| **3. Damped Pseudo-Transient** | Attaches parasitic capacitors to all nodes and attempts to step through time until the circuit dynamically settles to a stable DC state. | Final contingency for highly stiff circuits; often results in prolonged simulation times . |

Advanced verification engineers bypass these automated, time-consuming contingencies by tightly controlling the solver mechanics directly within the netlist. 

```spice
* Advanced Engine Control Directives for Convergence Optimization
.options Gmin=1e-12
.options abstol=1e-11 reltol=1e-4
.options itl1=200 itl2=100 itl4=200
.options numdgt=15 plotwinsize=0
.options method=gear maxstep=10n
```

## Chapter 2: The `.meas` Directive Masterclass

The `.meas` (measure) directive is a powerful post-processing tool that automatically extracts scalar metrics from the simulation dataset. These expressions are evaluated sequentially in post-processing after the matrix solver has completed the simulation run, allowing for exact parameter extraction without requiring manual cursor placement in the waveform viewer .

### Step-by-Step Tutorial 1: TRIG and TARG for Propagation Delay
A standard measurement extracts time, voltage, or current values based on crossing thresholds using the `TRIG` and `TARG` syntax. This is the industry standard for measuring propagation delays, rise times, and fall times automatically . A trigger defines when the measurement begins, and the target defines when it halts.

```spice
* Extracting Propagation Delay from a CMOS Buffer
* The delay is measured from the input falling to 0.9V to the output rising to 0.9V
.meas TRAN tpd_rise 
+ TRIG V(in) VAL=0.9 FALL=1 
+ TARG V(out) VAL=0.9 RISE=1 

* Extracting Rise Time (10% to 90% of a 1.8V supply)
* The rise time is measured from 0.18V to 1.62V on the first rising edge
.meas TRAN t_rise 
+ TRIG V(out) VAL=0.18 RISE=1 
+ TARG V(out) VAL=1.62 RISE=1
```

**Expected SPICE Error Log Output:**
tpd_rise: v(out)=0.9 at 2.451e-09
t_rise: v(out)=1.62 at 3.125e-09
The parsing engine outputs the exact interpolated time the crossing occurred. If a trigger condition is never achieved during the specified simulation time, the log will output `Measurement failed`, which is critical for flagging automated regression test failures .

### Step-by-Step Tutorial 2: Conditional Evaluation with FIND and WHEN
While `TRIG` and `TARG` calculate the difference between two events, the `FIND` and `WHEN` syntaxes are utilized to extract a specific state of the circuit at an exact moment in time, or to find the exact time a specific state is achieved.

```spice
* Finding the output voltage at an exact moment in time
.meas TRAN Vout_at_1ms FIND V(out) AT=1m

* Finding the exact time the output current crosses 500mA
.meas TRAN Time_of_Peak WHEN I(R_load)=0.5 CROSS=last
```

**Expected SPICE Error Log Output:**
vout_at_1ms: v(out)=3.2155 V
time_of_peak: i(r_load)=0.5 at 4.221e-03

### Step-by-Step Tutorial 3: Aggregation Functions (INTEG, MAX, MIN, RMS, AVG)
The `.meas` directive supports mathematical aggregation over a specified temporal or frequency domain utilizing the `FROM` and `TO` clauses. This is vital for analyzing power dissipation, energy transfer, and voltage ripple over a specific steady-state window .

```spice
* Extracting Average Power, RMS Voltage, and Peak-to-Peak Ripple
* Analysis is restricted to the steady-state window between 1ms and 2ms
.meas TRAN V_ripple PP V(out) FROM 1m TO 2m
.meas TRAN V_rms RMS V(out) FROM 1m TO 2m
.meas TRAN V_min MIN V(out) FROM 1m TO 2m
.meas TRAN V_max MAX V(out) FROM 1m TO 2m
.meas TRAN P_avg AVG -V(in)*I(V_in) FROM 1m TO 2m
.meas TRAN Total_Energy INTEG -V(in)*I(V_in) FROM 1m TO 2m

* Deriving Secondary Metrics using parameter math
.meas TRAN P_out AVG V(out)*I(R_load) FROM 1m TO 2m
.meas TRAN Efficiency PARAM P_out/P_avg
```

**Expected SPICE Error Log Output:**
v_ripple: PP(v(out))=0.0451 FROM 0.001 TO 0.002
v_rms: RMS(v(out))=1.205 FROM 0.001 TO 0.002
p_avg: AVG(-v(in)*i(v_in))=0.1254 FROM 0.001 TO 0.002
total_energy: INTEG(-v(in)*i(v_in))=0.0001254 FROM 0.001 TO 0.002
efficiency: p_out/p_avg=0.8845
Metrics extracted via `.meas` can be algebraically combined using `.meas param` to generate secondary metrics. Calculating efficiency dynamically via this method prevents the need to manually divide power readings across thousands of simulation runs .

## Chapter 3: Advanced Parameter Stepping

Parametric sweeping allows verification engineers to validate circuit performance across varying environmental and manufacturing conditions. The `.step` directive performs nested sweeps, iterating the matrix solver for every permutation of the defined variables, and aggregating the data into a single output file .

### Multi-Dimensional Nested Sweeping
LTspice permits the stepping of global parameters (`.step param`), environmental temperatures (`.step temp`), and active device models (`.step model`). To execute a multi-dimensional sweep—such as observing the behavior of an analog filter across both varying capacitance tolerances and operating temperatures—multiple `.step` directives are included within the same netlist.

```spice
* Multi-Dimensional Nested Sweep: Capacitance and Temperature
.param C_val=1u
.step param C_val list 1u 2.2u 4.7u 10u
.step temp -40 125 55

* Stepping a BJT model through different vendor libraries
.step model Q1 2N2222 2N3904 2N4401
```

When multiple `.step` commands are invoked, LTspice processes them as deeply nested programming loops . In the capacitance and temperature example above, the outer loop evaluates the four specified capacitance values. For each of those four values, the inner loop executes simulations at -40°C, 15°C, 70°C, and 125°C. This combination results in 16 discrete, sequentially executed simulation runs. 

When multi-dimensional sweeps are combined with `.meas` statements, the SPICE Error Log generates a highly structured tabular dataset of the measurements versus the swept parameters . This tabular data can be plotted directly within LTspice's waveform viewer by right-clicking the Error Log and selecting "Plot .step'ed .meas data" . This mechanism turns the time-domain viewer into a parametric analysis tool, allowing the engineer to plot efficiency, propagation delay, or RMS noise directly against changes in load resistance or temperature .

## Chapter 4: Statistical Distributions and Tolerance Definition

Statistical yield analysis requires the programmatic application of stochastic variance to ideal component values. LTspice provides four primary intrinsic functions to generate randomized values during the parameter resolution phase . Understanding the underlying mathematical probability density functions (PDFs) of these generators is critical for accurately modeling real-world manufacturing deviations.

### The Uniform Distributions: `mc()` and `flat()`
The `mc(nom, tol)` function generates a uniform random distribution, returning a value strictly bounded between $nom \cdot (1 - tol)$ and $nom \cdot (1 + tol)$. It is mathematically equivalent to writing `{nom * (1 + flat(tol))}` . The `flat(x)` function independently returns a uniform random number spanning from $-x$ to $x$ .

The Probability Density Function (PDF) for the uniform distribution generated by `mc(nom, tol)` is defined as:

$f(x) = \begin{cases} \frac{1}{2 \cdot nom \cdot tol} & \text{for } nom(1-tol) \le x \le nom(1+tol) \\ 0 & \text{otherwise} \end{cases}$

This uniform distribution models components where the manufacturer guarantees the part falls within a specified tolerance band, but provides no guarantee of a central tendency (often the case with resistors sorted and binned by tolerance after manufacturing).

### The Normal Distribution: `gauss()`
For process variations that naturally follow a Gaussian bell curve (such as semiconductor threshold voltages, oxide thicknesses, or diffusion depths), the `gauss(sigma)` function returns a random value centered precisely at zero with a standard deviation of $\sigma$ . 

The PDF for the standard normal variation applied by the `gauss` function is:

$f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x}{\sigma}\right)^2}$

To apply this to a component within a netlist, the nominal value must be algebraically multiplied by the Gaussian variance factor.

```spice
* Statistical Component Definitions
* R1 will have a nominal 10k value with a 1-sigma variance of 2%
.param R_nom = 10k
.param R_var = {R_nom * (1 + gauss(0.02))}
R1 node1 node2 {R_var}

* C1 utilizes the built-in Monte Carlo uniform variance function
.param C_nom = 100n
.param C_tol = 0.10
C1 node2 0 {mc(C_nom, C_tol)}
```

## Chapter 5: Monte Carlo Simulation Mechanics

Monte Carlo (MC) analysis represents the mass-execution of statistical distributions to determine the overall yield, standard deviation, and performance envelope of a circuit under randomized manufacturing variance. 

### Executing Statistical Mass-Runs
Because LTspice lacks a dedicated graphical menu for Monte Carlo analysis, the `.step` directive is utilized as a dummy iterator loop to force the simulator to regenerate the parameters and solve the matrix repeatedly. 

```spice
* 500-Run Monte Carlo Simulation Setup
.step param run 1 500 1
.param C_val = {mc(100n, 0.1)}  ; 10% Uniform Tolerance
.param Vth_var = {gauss(0.05)}  ; 50mV Gaussian variance
.meas TRAN Peak_Voltage MAX V(out)
```

By default, LTspice seeds its pseudo-random number generator (PRNG) with the exact same starting integer for every simulation batch. This deterministic behavior ensures that a 500-run sweep will yield the exact same 500 waveforms every time the netlist is executed, facilitating reproducible debugging. To enforce true randomness across different simulation sessions, the `.options tSeed` directive is invoked. This option forces the engine to seed the PRNG using the system's real-time clock .

### Overlaying Variance Waveforms and Evaluating Process Variations
During a Monte Carlo run, the waveform viewer overlays every iteration on the same graph, visually demonstrating the dispersion band of the circuit's transient or AC response. While visualizing the envelope is useful, the true value of MC analysis lies in data extraction.

When `.meas` statements are applied to a Monte Carlo run, the resulting data in the SPICE Error Log forms a massive statistical dataset linking each step to its specific performance outcome. Because parsing thousands of lines of text manually is error-prone, verification engineers export this dataset to external programmatic tools . Utilizing Python libraries such as `spicelib` or the `ltspice-mcp` module allows scripts to parse the `.raw` and `.log` files, automatically rendering histograms of the variance and mathematically calculating the aggregate $\mu$ and $\sigma$ of the performance metrics .

## Chapter 6: Worst-Case Analysis (WCA) and Six-Sigma Validation

While Monte Carlo analysis provides an accurate stochastic picture of manufacturing yield, it requires thousands, or even millions, of runs to confidently map the extreme tails of a statistical distribution. Worst-Case Analysis (WCA) accelerates this validation by deliberately forcing components to their absolute extreme tolerance boundaries, guaranteeing circuit performance under the harshest theoretical manufacturing permutations .

### Identifying Extreme Boundaries via Binary Functions
To execute a WCA in LTspice, engineers step through a binary truth table of variance boundaries. The `binary(run, index)` function is explicitly utilized in custom equations to toggle variables sharply between their positive $+tol$ and negative $-tol$ extremes based on the current step number . If a circuit contains $N$ critical components, testing all boundary combinations requires $2^N$ simulations (or $2^N + 1$ to include the nominal run) .

```spice
* Worst-Case Analysis Setup for 3 Resistors (2^3 = 8 runs)
.step param run 0 7 1
.param tol = 0.05
.param R1_wc = {10k * (1 + (if(binary(run, 0), tol, -tol)))}
.param R2_wc = {20k * (1 + (if(binary(run, 1), tol, -tol)))}
.param R3_wc = {5k *  (1 + (if(binary(run, 2), tol, -tol)))}
R1 in n1 {R1_wc}
R2 n1 n2 {R2_wc}
R3 n2 0  {R3_wc}
```
In this matrix, the `binary()` function evaluates the binary representation of the `run` variable and checks the bit at the specified `index`. This elegantly maps every possible maximum and minimum variance combination to a specific simulation step .

### Six-Sigma Reliability Standards
To achieve Six-Sigma quality, the statistical output of the WCA and MC analyses must be formally quantified using Process Capability Indices ($C_p$) and Process Performance Indices ($C_{pk}$) . These metrics dictate whether a circuit design is robust enough for mass production without exhibiting excessive failure rates.

| Capability Metric | Mathematical Definition | Interpretative Meaning |
| :--- | :--- | :--- |
| **$C_p$ (Process Capability)** | $C_p = \frac{USL - LSL}{6\sigma}$ | Measures the allowable specification spread (Upper/Lower Specification Limits) relative to the natural process spread. Fails to account for mean shifting . |
| **$C_{pk}$ (Process Performance)** | $C_{pk} = \min\left( \frac{USL - \mu}{3\sigma}, \frac{\mu - LSL}{3\sigma} \right)$ | Accounts for the process mean ($\mu$) shifting away from the target value. A highly accurate indicator of true yield . |

A calculated $C_{pk} \ge 2.0$ represents a true Six-Sigma level of quality, corresponding to an exceptionally low Defect Per Million Opportunities (DPMO) rate of 3.4 . Verification engineers extract the target mean ($\mu$) and standard deviation ($\sigma$) directly from the SPICE `.meas` logs, piping the raw data into Python histograms to dynamically compute these yield metrics and certify the design against Six-Sigma tolerances .

## Chapter 7: Spectral Analysis, FFTs, and THD

Evaluating the linearity, distortion, and spectral purity of analog circuits requires moving the analytical framework from the time domain into the frequency domain. LTspice facilitates this through the `.four` SPICE directive and an integrated, high-resolution Fast Fourier Transform (FFT) post-processing engine.

### Total Harmonic Distortion (THD) Calculations
The `.four` directive commands the simulator to compute the Fourier series components of a specified transient waveform at a defined fundamental frequency, automatically calculating the Total Harmonic Distortion . 

In signal processing literature, two mathematically distinct definitions of THD exist: Fundamental-based ($THD_F$) and RMS-based ($THD_R$) . $THD_R$ expresses distortion as the ratio of harmonic content to the overall RMS value of the waveform, which inherently underestimates distortion at highly non-linear levels . Consequently, SPICE algorithms rely exclusively on $THD_F$, defining THD as the ratio of the RMS sum of the harmonics to the fundamental component alone :

$THD_F = \frac{\sqrt{V_2^2 + V_3^2 + \dots + V_n^2}}{V_1} \times 100\%$

```spice
* THD Analysis Setup for an Audio Amplifier
.tran 0 10m 0 10n
.four 1kHz 9 V(out)
```
Upon completion of the `.tran` analysis, the `.four` directive triggers. The results are written directly to the SPICE Error Log in a structured table, detailing the DC component, followed by the magnitude, normalized magnitude, phase, and normalized phase of the fundamental and the next 8 harmonics, concluding with the calculated THD percentage .

### FFT Mitigation and Windowing Functions
When utilizing the waveform viewer's FFT tool rather than the `.four` directive, verification engineers frequently encounter spectral leakage. This phenomenon occurs when the sampled time-domain vector does not represent an exact integer number of cycles (non-coherent sampling), causing energy from the fundamental tone to smear across adjacent frequency bins . 

To mitigate leakage, mathematical windowing functions are multiplied against the time-domain dataset before the FFT is executed. The selection of the window profoundly alters the resulting spectrum:

| Windowing Function | Mathematical Characteristics | Application Scenario |
| :--- | :--- | :--- |
| **Rectangular (None)** | Zero sideband suppression. Highest frequency resolution. | Ideal only for perfectly coherent sampling where exactly integer cycles are captured . |
| **Hann / Hanning** | Excellent general-purpose roll-off. | Standard for stationary periodic and random noise signals . |
| **Flat-Top** | Extremely wide main lobe, poor frequency resolution, but nearly perfect amplitude accuracy ($\sim -0.01$ dB error). | Required for making precise amplitude measurements of fundamental frequencies and calibration . |
| **Blackman-Harris** | Exceptional sideband rejection (steep roll-off) but broadens the main lobe. | Ideal for resolving small spurious tones or harmonics situated directly adjacent to massive fundamental frequencies . |

To lower the mathematical noise floor and enhance the Spurious-Free Dynamic Range (SFDR) to levels exceeding 160 dB in the FFT viewer, the simulator's default waveform data compression must be disabled, and double-precision 64-bit floating-point math must be strictly enforced .

```spice
* Mandatory Directives for High-Resolution FFT Analysis
.options plotwinsize=0 
.options numdgt=15
```
By setting `plotwinsize=0`, lossy compression is eliminated, ensuring every computed node voltage is logged exactly as solved by the matrix. Setting `numdgt=15` forces the engine to export dependent variable data using double-precision accuracy .

## Chapter 8: AC Noise Analysis

The `.noise` directive executes a sophisticated frequency-domain analysis to evaluate the intrinsic semiconductor and thermal noise generated by a circuit, expressing the output as a noise spectral density ($V / \sqrt{Hz}$ or $A / \sqrt{Hz}$) .

### Physics of Device Noise
1. **Thermal (Johnson-Nyquist) Noise:** Generated by the random thermal agitation of charge carriers within resistive elements, regardless of applied voltage. It is mathematically modeled as a flat, white noise spectrum:
   $v_n = \sqrt{4 k_B T R \Delta f}$
   where $k_B$ is Boltzmann's constant, $T$ is absolute temperature, $R$ is resistance, and $\Delta f$ is the noise bandwidth .
2. **Flicker (1/f) Noise:** Dominant at low frequencies, this noise is heavily dependent on manufacturing defects, carrier trapping mechanisms, and surface states within the transistor oxide channel .
3. **Shot Noise:** Associated with DC current flowing across potential barriers (such as PN junctions), derived from the quantized nature of charge carriers.

### The `.noise` Directive Syntax
```spice
* Noise Analysis from 1Hz to 1MHz
.noise V(out) V_in dec 100 1 1Meg
```
This syntax instructs LTspice to calculate the total output noise spectral density `V(onoise)` at the node `out`. Simultaneously, the simulator calculates the equivalent input-referred noise `V(inoise)` by dividing the output noise by the complex transfer function (gain) from the designated source `V_in` to the output .

### BSIM Noise Modeling Flags
Modern CMOS verification relies entirely on the Berkeley Short-Channel IGFET Models (BSIM3 and BSIM4). In LTspice, the behavior of flicker and thermal noise within the MOSFET channel is not absolute; it is explicitly controlled by model card parameters passed into the `.model` directive .

| BSIM Parameter | Description | Typical Application |
| :--- | :--- | :--- |
| **`KF`** | Flicker noise coefficient | Scales the overall magnitude of the 1/f noise curve . |
| **`AF`** | Flicker noise exponent | Controls the slope of the 1/f noise curve . |
| **`EF`** | Flicker noise frequency exponent | Determines the precise frequency dependence characteristic . |
| **`tnoimod`** | Thermal noise model selector | Defines the thermal noise equation physics . |

The `tnoimod` parameter is of particular interest to analog verification engineers. Setting `tnoimod=0` commands the BSIM4 engine to use a basic, charge-based thermal noise model suitable for low-frequency simulation. Setting `tnoimod=1` invokes a holistic thermal noise model that actively partitions induced gate noise and accurately models channel resistance noise for high-frequency RF applications .

## Chapter 9: Initial Conditions and Steady-State Acceleration

Highly inductive circuits, high-Q RF resonators, and Switch-Mode Power Supplies (SMPS) often suffer from exceptionally long startup transients. Running a transient simulation from $t=0$ while waiting for massive bypass capacitors to charge can consume hours of computational time. Verification engineers use specific SPICE directives to force the circuit directly into its steady-state operating point, accelerating analysis.

### Differentiating `.ic` and `.nodeset`
While both directives provide initial voltage vectors to the matrix solver, their underlying physical mechanics and impact on the Newton-Raphson solver are fundamentally distinct .

* **`.nodeset V(node)=X`**: This directive provides an initial "hint" or starting guess to the Newton-Raphson DC solver . LTspice forces the node to the specified voltage during the first phase of the DC operating point calculation. Once the solver achieves initial convergence, the constraint is released, and the matrix is re-solved to find the true, physically valid DC operating point . It is primarily used to cure convergence failures in bistable circuits (like latches or flip-flops) by forcing the circuit into a known state before releasing it.
* **`.ic V(node)=X`**: This directive dictates a rigid, immovable boundary condition during the initial transient solution (ITS). The transient analysis literally begins at $t=0$ with the node clamped to this exact voltage, bypassing the physical charging of capacitors entirely . 

### Integration Methods and Trapezoidal Ringing
When circuits undergo violent switching transients, LTspice's default modified-trapezoidal integration algorithm can exhibit severe numerical oscillation known as "trapezoidal ringing" . This occurs because the trapezoidal rule is second-order accurate and does not artificially damp high-frequency oscillatory behavior . 

To suppress this mathematical artifact, engineers switch the numerical solver to the Gear method .

```spice
* Enforcing Gear Integration and Initial Conditions
.options method=gear maxstep=10n
.ic V(Vout)=5.0 I(L1)=2.5
```
The Gear method utilizes backward differentiation formulas (BDF), which introduces artificial mathematical dampening, effectively crushing the non-physical numerical ringing . However, because Gear integration actively changes the circuit's response by damping transient phenomena, it is strictly reserved for stiff, high $dV/dt$ switching circuits where the trapezoidal ringing prevents the matrix solver from stepping forward in time . Setting `maxstep` is also crucial, as Gear integration can occasionally jump over narrow switching transitions if the timestep is not explicitly capped .

## Chapter 10: Advanced Waveform Math

LTspice includes a robust, highly capable waveform viewer that goes far beyond simply plotting raw nodal voltages. The viewer acts as a secondary math engine capable of evaluating dynamic, complex algebraic expressions post-simulation. This allows verification engineers to visualize derived vectors, power dissipation, and logical states without modifying the underlying netlist or re-running the heavy matrix solver .

### Plotting Derivatives, Integrals, and Dynamic Power
By right-clicking a trace label in the waveform viewer or adding a custom trace (`Ctrl+A`), users can input raw calculus and algebraic expressions:
* **Derivative (`ddt(x)`)**: Useful for visualizing the instantaneous current through a capacitor using the physical relationship $i = C \cdot \frac{dv}{dt}$. Plotting `ddt(V(out))` displays the voltage slew rate directly on the graph . Notably, the `ddt()` function is highly susceptible to the aforementioned trapezoidal ringing; utilizing Gear integration smooths the resulting derivative plot immensely .
* **Integral (`idt(x)`)**: Used for evaluating the total charge accumulated over time $Q = \int I dt$ or magnetic flux $\Phi = \int V dt$ .
* **Dynamic Power**: Plotting an expression such as `V(n1,n2)*I(R1)` calculates and displays the instantaneous power dissipation of a specific element in real-time . Holding the `Ctrl` key and clicking the resulting trace label forces the viewer to calculate the exact average power over the currently zoomed time window .

### Boolean Logic and Masking
Waveform expressions support Boolean logic for complex state evaluation, providing a mechanism to generate digital waveforms from purely analog signals.

if(V(out) > 1.8, 1, 0)
This expression generates a digital bitstream, pulling high to $1V$ only when the analog `V(out)` signal breaches the $1.8V$ threshold. This technique is invaluable for generating pass/fail mask overlays in mixed-signal verification, allowing an engineer to visually instantly identify logic-level failures during a Monte Carlo mass-run.

### Managing Phase and Delay
The `delay(x, t)` function allows a waveform to be shifted chronologically on the horizontal time axis . This aids in the visual alignment of signals suffering from varying propagation latency, allowing for direct visual comparison of edge rates. In frequency domain AC analysis plots, phase unrolling can be managed by altering the trace expression to `ph(V(out))` and overriding standard Bode plot wrap limits, providing a continuous, unbroken view of phase margin degradation . 


## Sources

- [**ieee.li** Behavioral Sources, Parameters and Expression Evaluation](https://ieee.li/pdf/viewgraphs/ltspice_behavioral_sources_parameters_and_expression_evaluation.pdf)
- [**electronics.stackexchange.com** How to pass parameters to subcircuits in LTSpice with the include](https://electronics.stackexchange.com/questions/572572/how-to-pass-parameters-to-subcircuits-in-ltspice-with-the-include-statement)
- [**groups.io** SUB file vs .LIB - LTspice - Groups.io](https://groups.io/g/LTspice/topic/sub_file_vs_lib/50143579)
- [**agnd.net** LTspice - agnd.net](https://agnd.net/valpo/341/LTspiceHelpXVII.pdf)
- [**dspace.cuni.cz** NextGen SPICE – Electrical Circuit Simulation Library for .NET](https://dspace.cuni.cz/bitstream/handle/20.500.11956/99795/130231639.pdf?sequence=1&isAllowed=y)
- [**analog-electronics.ewi.tudelft.nl** Modified Nodal Analysis - Structured Electronics Design](https://analog-electronics.ewi.tudelft.nl/webbook/SED/_build/html/network_theory/NetworkTheory-1_Modified_Nodal_Analysis.html)
- [**scribd.com** Modified Nodal Analysis in Circuit Simulation | PDF - Scribd](https://www.scribd.com/document/277142543/MNA-Stamp)
- [**livewaves.net** How it works - LiveWaves](https://livewaves.net/how-it-works)
- [**dokumen.pub** SPICE Circuit Handbook. 9780071491334, 0071491333](https://dokumen.pub/spice-circuit-handbook-9780071491334-0071491333.html)
- [**eroots.tech** What is Newton-Raphson Method? | Power Systems Glossary | eRoots](https://eroots.tech/glossary/newton-raphson-method)
- [**electronics.stackexchange.com** LTspice problem while trying to simulate third-party model](https://electronics.stackexchange.com/questions/633268/ltspice-problem-while-trying-to-simulate-third-party-model)
- [**groups.io** LTspice Convergence - Groups.io](https://groups.io/g/LTspice/topic/ltspice_convergence/71423362)
- [**analog.com** LTspice: Speed Up Your Simulations - Analog Devices](https://www.analog.com/en/resources/technical-articles/ltspice-speed-up-your-simulations.html)
- [**ltwiki.org** .MEASURE -- Evaluate User-Defined Electrical Quantities - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_MEASURE_Evaluate_User_Defined_Electrical_Quantities.htm)
- [**cxi1.co.uk** DC Analysis with LTSpice](https://www.cxi1.co.uk/ltspice/dccircuits.htm)
- [**github.com** ngspice.md - VLSIDA/chip-tutorials - GitHub](https://github.com/VLSIDA/chip-tutorials/blob/main/ngspice.md)
- [**electronics.stackexchange.com** How to find Input capacitance and output resistance of a CMOS](https://electronics.stackexchange.com/questions/498872/how-to-find-input-capacitance-and-output-resistance-of-a-cmos-circuit-with-spice)
- [**spiceman.net** .measure/.meas : LTspice -- Evaluate User-Defined Electrical](https://spiceman.net/ltspice-command-measure/)
- [**analog.com** LTspice: Using .MEAS and .STEP Commands to Calculate Efficiency](https://www.analog.com/en/resources/technical-articles/ltspice-using-meas-and-step-commands-to-calculate-efficiency.html)
- [**analog.com** LTspice: Plotting a Parameter Against Something Other Than Time](https://www.analog.com/en/resources/technical-articles/ltspice-plotting-a-parameter-against-something-other-than-time-e-g-resistance.html)
- [**web.eecs.utk.edu** ECE 581 - Tutorial: LTspiceParamterSweep - UTK-EECS](https://web.eecs.utk.edu/~dcostine/ECE581/Fall2025/tutorials.php?topic=LTspiceParamterSweep)
- [**pyltspice.readthedocs.io** ltsteps - PyLTSpice documentation](https://pyltspice.readthedocs.io/en/latest/utilities/LTSteps.html)
- [**ltwiki.org** Parametric plot (plot measurements in relation to a swept parameter)](https://ltwiki.org/index.php?title=Parametric_plot_(plot_measurements_in_relation_to_a_swept_parameter))
- [**groups.io** Use .MEAS to extract data from datasets created by other .MEAS](https://groups.io/g/LTspice/topic/50203755?msg=73872)
- [**analog.com** LTspice: Worst-Case Circuit Analysis with Minimal Simulations Runs](https://www.analog.com/en/resources/technical-articles/ltspice-worst-case-circuit-analysis-with-minimal-simulations-runs.html)
- [**scribd.com** LTspice Model Updates and Additions | PDF - Scribd](https://www.scribd.com/document/248202590/Change-Log)
- [**ltwiki.org** Undocumented LTspice - LTwiki](https://ltwiki.org/?title=Undocumented_LTspice)
- [**spicelib.readthedocs.io** spicelib documentation](https://spicelib.readthedocs.io/_/downloads/en/latest/pdf/)
- [**pypi.org** ltspice-mcp - PyPI](https://pypi.org/project/ltspice-mcp/)
- [**analog.com** LTspice®模擬工具教程指南](https://www.analog.com/media/cn/technical-documentation/intelligence/LTspice24-simulation-tool.pdf)
- [**dokumen.pub** Design for Six Sigma: A Roadmap For Product Development](https://dokumen.pub/design-for-six-sigma-a-roadmap-for-product-development-9780071435994-0-07-143599-9-0-07-141208-5.html)
- [**mdpi.com** Application of Quality 4.0 (Q4.0) and Industrial Internet of Things](https://www.mdpi.com/2624-7402/5/1/35)
- [**hoaqtkd.com** Design for Six Sigma - hoaqtkd.com](https://hoaqtkd.com/wp-content/uploads/2021/12/design-for-six-sigma.pdf)
- [**qpr.buaa.edu.cn** Reliability Engineering](https://qpr.buaa.edu.cn/__local/2/AA/B8/BB116BBD20312235B2E7F93FAD2_483F18EF_5132FE.pdf)
- [**studylib.net** Philips Semiconductors Quality Reference Handbook - Studylib](https://studylib.net/doc/8686976/philips-business-excellence)
- [**jcep.edu.in** SHIVAJI UNIVERSITY, KOLHAPUR](https://jcep.edu.in/uploads/dptmech/syllabus/Syllabus_B_Tech_Mech_Final_year_Old.pdf)
- [**researchgate.net** Fan-Out Wafer-Level Packaging for Heterogeneous Integration](https://www.researchgate.net/publication/326361719_Fan-Out_Wafer-Level_Packaging_for_Heterogeneous_Integration)
- [**uktech.ac.in** Syllabus of B.TECH – Mechanical Engineering](https://uktech.ac.in/downloadmedia/siteContent/202404291156435999BTech%20Mechanical.pdf)
- [**ece.mcgill.ca** 7.1 Emitter-Follower or Class A Output Stage](https://www.ece.mcgill.ca/~grober4/SPICE/SPICE_Decks/1st_Edition_LTSPICE/chapter7/Chapter%207%20Output%20Stages%20and%20Power%20Amplifiers%20web%20version.html)
- [**powerelectronicsnews.com** Harmonic Distortion Measurement with SPICE](https://www.powerelectronicsnews.com/spice-course-for-electronic-simulation-part-8-measuring-harmonic-distortion/)
- [**core.ac.uk** Power Factor Correction Circuit for AC to DC Converter - CORE](https://core.ac.uk/download/pdf/657109281.pdf)
- [**tjr-lab.mit.edu** R&S ZNA User Manual](https://tjr-lab.mit.edu/wp-content/uploads/2025/02/ZNA67-Vector-Network-Analyzers-User-Manual.pdf?x26146)
- [**manuals.plus** Hioki PW4001 Power Analyzer Instruction Manual](https://manuals.plus/m/6c0ad112b392dbfc09476fbc3c807bb406e93c34087eba23334728760ae905e2)
- [**allaboutcircuits.com** Example Circuits and Netlists | Electronics Textbook](https://www.allaboutcircuits.com/textbook/reference/chpt-7/example-circuits-and-netlists/)
- [**dewesoft.com** FFT Analysis: What Is FFT & How It Works | Dewesoft](https://dewesoft.com/blog/guide-to-fft-analysis)
- [**hodany.com** Signal analysis in the frequency domain with LTspice – Part 1.](https://hodany.com/2022/01/signal-analysis-in-the-frequency-domain-with-ltspice-part-1/)
- [**ece.au.dk** Keysight InfiniiVision 2000 X-Series Oscilloscopes User's Guide](https://ece.au.dk/fileadmin/ingen_mappe_valgt/Keysight_DSOX2012A.pdf)
- [**groups.io** LTspice@groups.io | Number of Digits in a simulation](https://groups.io/g/LTspice/topic/number_of_digits_in_a/50184195)
- [**ltwiki.org** .OPTIONS -- Set simulator options - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_OPTIONS_Set_simulator_options.htm)
- [**ltwiki.org** .NOISE -- Perform a noise analysis - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_NOISE_Perform_a_noise_analysis.htm)
- [**scribd.com** VLSI Design Lab Manual for ECE Students | PDF | Spice | Electrical](https://www.scribd.com/document/962659126/vlsi)
- [**embedded.com** Guide to SPICE Simulation for Circuit Analysis and Design – Part 20](https://www.embedded.com/guide-to-spice-simulation-for-circuit-analysis-and-design-part-20-noise-analysis/)
- [**researchgate.net** A Guide to Phase Noise Analysis of Single and Multi-PLL Frequency](https://www.researchgate.net/publication/325828153_A_Guide_to_Phase_Noise_Analysis_of_Single_and_Multi-PLL_Frequency_Synthesizers_with_LTSpice)
- [**uio.no** Mandatory lab 3 : Component noise with LTspice - UiO](https://www.uio.no/studier/emner/matnat/ifi/IN5230/h25/nedlastninger/presenation_assignment_3_2025.pdf)
- [**eeworld.com.cn** LTspice(14) Noise仿真-电子头条-EEWORLD电子工程世界](https://www.eeworld.com.cn/emp/xuyuntangs/a371362.jspx)
- [**manuals.plus** ngspice user manual - Manuals+](https://manuals.plus/m/13635ef162f01e8321011c4d3cb7d94644da202429dbee8ae35b85d23997a22e)
- [**simetrix.co.uk** SIMETRIX SIMULATOR REFERENCE MANUAL](https://www.simetrix.co.uk/Files/manuals/9.3/SimulatorReference.pdf)
- [**ngspice.sourceforge.io** BSIM3v3.3 MOSFET Model - Ngspice](https://ngspice.sourceforge.io/external-documents/models/bsim330_manual.pdf)
- [**simplis.com** Bipolar Junction Transistor (SPICE Gummel Poon) - SIMPLIS](https://simplis.com/documentation/simetrix/simulator_reference/topics/analogdevicereference_bipolarjunctiontransistor_spicegummelpoon.htm)
- [**fliphtml5.com** CMOS Integrated Circuit Simulation with LTspice - FlipHTML5](https://fliphtml5.com/wmkd/pvpq/CMOS_Integrated_Circuit_Simulation_with_LTspice/)
- [**blog.csdn.net** BSIM4 MOSFET Model_bsim4模型 - CSDN博客](https://blog.csdn.net/vzhenyi/article/details/41929463)
- [**cmosedu.com** BSIM4 User's Manual - CMOSedu.com](https://cmosedu.com/cmos1/BSIM4_manual.pdf)
- [**class.ece.iastate.edu** BSIM4v4.7 MOSFET Model - Iowa State University](https://class.ece.iastate.edu/djchen/ee501/BSIM470_Manual.pdf)
- [**mirrors.mit.edu** ngspice user manual](https://mirrors.mit.edu/macports/distfiles/ngspice/ngspice-36-manual.pdf)
- [**electronics.stackexchange.com** Why is the LTspice simulation behaving differently in these identical](https://electronics.stackexchange.com/questions/721283/why-is-the-ltspice-simulation-behaving-differently-in-these-identical-cases)
- [**forum.kicad.info** Timestep too small - Simulation (Ngspice) - KiCad.info Forums](https://forum.kicad.info/t/timestep-too-small/53274)
- [**industrialmonitordirect.com** Fixing LTspice Time Step Errors in IR2110 Half-Bridge Designs](https://industrialmonitordirect.com/blogs/knowledgebase/fixing-ltspice-time-step-errors-in-ir2110-half-bridge-designs)
- [**forum.qorvo.com** Stability of derivative function - QSPICE - Qorvo Tech Forum](https://forum.qorvo.com/t/stability-of-derivative-function/17404)
- [**scribd.com** Solving SPICE Convergence Problems | PDF - Scribd](https://www.scribd.com/document/1055086285/Solving-SPICE-Convergence-Problems)
- [**intusoft.com** isspice4 user's guide - volumes 1 and 2 - Intusoft](http://www.intusoft.com/lit/IsSpice4.pdf)
- [**spiceman.net** LTspice-How to use Waveform Viewer - Spiceman](https://spiceman.net/ltspice-waveform-viewer/)
- [**ltwiki.org** Waveform Arithmetic - LTwiki](https://ltwiki.org/LTspiceHelpXVII/LTspiceHelp/html/Waveform_Arithmetic.htm)
- [**youtube.com** LTSpice (Pt 4): Waveform Arithmetic, RMS/Average & Fast Fourier](https://www.youtube.com/watch?v=Xzh7uHLYMVA)
- [**cde.nus.edu.sg** LTspice Manual](https://cde.nus.edu.sg/ece/wp-content/uploads/sites/3/2024/09/LTspiceManual.pdf)
- [**courses.egr.uh.edu** LTSpice Basic Tutorial](https://courses.egr.uh.edu/ECE/ECE3355/Honors%20Electronics%20LTSpice/LTSpice%20Tutorials/LTspice_Basics.pdf)
- [**help.simetrix.co.uk** Simulator Reference: Using Expressions - Documentation - SIMetrix](https://help.simetrix.co.uk/9.1/simetrix/simulator_reference/topics/simulatordevices_usingexpressions.htm?hl=table)
- [**thesis.unipd.it** Extraction of equivalent circuit models of superconducting quantum](https://thesis.unipd.it/retrieve/de06b8b2-06ef-4402-bd20-3dd9b2c2a27f/Garberino_Michael.pdf)
- [**ftp.riken.jp** ngspice user manual - ftp](http://ftp.riken.jp/Linux/gentoo/distfiles/d4/ngspice-43-manual.pdf)
- [**sites.units.it** SPICE: - PHP 8.2.31 - UniTS](https://sites.units.it/carrato/didatt/doc/spice.pdf)
- [**ampbooks.com** SPICE Simulation of the Epiphone Deluxe EA-10 Power Amp](https://www.ampbooks.com/mobile/tutorials/epiphone/)
- [**cdn.elektroniknet.de** SPICE 3f4, PSPICE, LT-SPICE - elektroniknet](https://cdn.elektroniknet.de/media_uploads/documents/1408977840-2-spice.pdf)
- [**elcom-team.com** Power Electronics Devices, Circuits & Applications 4/E](https://elcom-team.com/Subjects/power%20electronics/%D8%A7%D9%84%D9%83%D8%AA%D8%A8%20%D9%88%20%D8%A7%D9%84%D8%AD%D9%84%D9%88%D9%84/power-electro-reference-book-(4th-ed).pdf)
- [**ez.analog.com** Turning up the Noise: .NOISE Simulations in LTspice: Part 1 of 3](https://ez.analog.com/ez-blogs/b/engineerzone-spotlight/posts/turning-up-the-noise-noise-simulations-in-ltspice-part-1-of-3)
- [**farnell.com** THE LTSPICE IV - Farnell](https://www.farnell.com/datasheets/1760451.pdf)
- [**web.mit.edu** Introduction to LTspice SPICE Netlists LTspice - MIT](https://web.mit.edu/6.101/www/s2020/handouts/LTSpiceIntro_4.pdf)
- [**electronics.stackexchange.com** How do you simulate voltage noise with LTSpice?](https://electronics.stackexchange.com/questions/55233/how-do-you-simulate-voltage-noise-with-ltspice)
- [**2025.help.altair.com** Extended Definitions - Altair® Twin Activate® 2025](https://2025.help.altair.com/2025/twinactivate/extended_definitions.pdf)
- [**researchgate.net** Digital Wave vs. Nodal Analysis for Circuit ... - ResearchGate](https://www.researchgate.net/profile/Piero_Belforte/publication/288668128_Digital_Wave_vs_Nodal_Analysis_for_Circuit_Simulation_an_experimental_comparison/links/5682ab9e08aebccc4e0e0326/Digital-Wave-vs-Nodal-Analysis-for-Circuit-Simulation-an-experimental-comparison.pdf)
- [**analog.com** LTspice®: Waveform Viewer - Analog Devices](https://www.analog.com/en/resources/media-center/videos/5579252577001.html)
- [**we-online.com** LTspice examples](https://www.we-online.com/files/pdf1/ltspice-examples.pdf)
- [**youtube.com** LTspice Waveform Viewer - YouTube](https://www.youtube.com/watch?v=SnKSS7EBnyg)
- [**github.com** ControlElements.md - kanedahiroshi/LTspiceControlLibrary - GitHub](https://github.com/kanedahiroshi/LTspiceControlLibrary/blob/master/ControlElements.md)
- [**faultsim.app** Sobre — FaultSim](https://faultsim.app/about)
- [**github.com** Symbolic-modified-nodal-analysis/node analysis.ipynb at master](https://github.com/Tiburonboy/Symbolic-modified-nodal-analysis/blob/master/node%20analysis.ipynb)
- [**etd.auburn.edu** SPICE model implementation of a quantum phase-slip junction](https://etd.auburn.edu/bitstream/handle/10415/4742/Thesis_final_Uday%20Goteti.pdf?sequence=2&isAllowed=y)
- [**ideals.illinois.edu** c 2018 Vishesh Verma - IDEALS - University of Illinois](https://www.ideals.illinois.edu/items/109485/bitstreams/358081/data.pdf)
- [**forum.qorvo.com** Voltage oscillation in different transformer modeling approach](https://forum.qorvo.com/t/voltage-oscillation-in-different-transformer-modeling-approach/18253)
- [**ftp.kaist.ac.kr** ngspice user manual](https://ftp.kaist.ac.kr/macports/distfiles/ngspice/ngspice-30-manual.pdf)
- [**people.ece.ubc.ca** SPICE Model Parameters - People](https://people.ece.ubc.ca/robertor/Links_files/Files/ICCAP-2008-doc/icmdl/icmdl05a8.html)
- [**engineering.upenn.edu** PSpice Reference Guide - Penn Engineering](https://www.engineering.upenn.edu/~jan/spice/PSpice_ReferenceguideOrCAD.pdf)
- [**scribd.com** Hspice BSIM3v3 Model Levels Overview | PDF | Spice | Mosfet - Scribd](https://www.scribd.com/document/88219145/Levels-49-and-53-Bsim3v3-Mos-Models)
- [**soclibrary.futa.edu.ng** Data Converters (Franco Maloberti) (Z-Library).pdf](https://soclibrary.futa.edu.ng/books/Data%20Converters%20(Franco%20Maloberti)%20(Z-Library).pdf)
- [**researchgate.net** (PDF) A sawtooth waveform inspired pitch estimator for speech and](https://www.researchgate.net/publication/23558616_A_sawtooth_waveform_inspired_pitch_estimator_for_speech_and_music)
- [**scribd.com** Oscilloscope Keysight Mso-X 3024a | PDF | Electronics - Scribd](https://www.scribd.com/document/718970087/Oscilloscope-Keysight-Mso-x-3024a)
- [**docs.rs-online.com** Keysight InfiniiVision HD3-Series Oscilloscopes - RS Online](https://docs.rs-online.com/a794/A700000011891659.pdf)
- [**media.distrelec.com** Keysight InfiniiVision 1200 X-Series and EDUX1052A/G Oscilloscopes](https://media.distrelec.com/Web/Downloads/_m/an/InfiniiVision_1200_X_EDUX1052_eng_man.pdf)
- [**ngspice.sourceforge.io** ngspice-44-manual.pdf](https://ngspice.sourceforge.io/docs/ngspice-44-manual.pdf)
- [**unm.edu** T-Spice 14 User Guide—Contents - The University of New Mexico](https://www.unm.edu/~pzarkesh/ECE520/tspice.pdf)
- [**api.eestar.com** LTspice XVII help 中文翻译版本文由微信公众号电子帮翻译而成](https://api.eestar.com/article/share/2020/10/fda54202010221347106716.pdf)
- [**youtube.com** Automating calculations using .meas in LTspice - YouTube](https://www.youtube.com/watch?v=Tgpvky0YqKI)
- [**youtube.com** How to use .meas command to find given value in LTspice - YouTube](https://www.youtube.com/watch?v=mE9qCKxI1BA)
- [**youtube.com** LTSpice plotting a measured signal - YouTube](https://www.youtube.com/watch?v=wi37QCnQJD0)
- [**eng.biu.ac.il** CMOS Circuit Design, Layout, and Simulation, 3rd Edition (IEEE](https://www.eng.biu.ac.il/~wimers/files/courses/Old%20Courses/Digital_VLSI_Design/Book/CMOS_Circuit_Design__Layout__and_Simulation__3rd_Edition.pdf)
- [**scribd.com** AIM SPICE Circuit Simulation Guide | PDF - Scribd](https://www.scribd.com/document/111776939/AIMSPICE-TutorialManual)
- [**scribd.com** MOSFET and CNTFET VLSI Circuit Study | PDF | Field Effect Transistor](https://www.scribd.com/document/932008150/Undergraduate-Thesis-Bappy)
- [**research.nottingham.edu.cn** TRANSISTOR-BASED HARDWARE NEURAL NETWORK SYSTEM](https://research.nottingham.edu.cn/files/1654072062/Zhihao_Chen_-_20416132_-_thesis.pdf)
- [**globaltestsupply.com** LR8101 LR8102 - Global Test Supply](https://www.globaltestsupply.com/pdfs/cache/www.globaltestsupply.com/lr8101/manual/lr8101-manual.pdf)
- [**pt.scribd.com** Pw8001a961-02 0 | PDF - Scribd](https://pt.scribd.com/document/676711864/PW8001A961-02-0)
- [**arxiv.org** Reliable SPICE Simulations of Memristors, Memcapacitors ... - arXiv](https://arxiv.org/pdf/1307.2717)
- [**scribd.com** WinSpice3 User Manual Overview | PDF | Electrical Network - Scribd](https://www.scribd.com/document/425916146/Spice-Man)
- [**spiceman.net** .lib/.include : LTspice -- Include a Library/Include Another File](https://spiceman.net/ltspice-command-lib-inc/)
- [**kolegite.com** CMOS Integrated Circuit Simulation with LTspice IV](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%BE%D0%B2%D0%B0%20%D1%81%D1%85%D0%B5%D0%BC%D0%BE%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D0%B0/%D0%9F%D0%90%D0%98%D0%A1/cmos-integrated-circuit-simulation-with-ltpice%20%281%29.pdf)
- [**dokumen.pub** SPICE and LTspice for Power Electronics and Electric Power](https://dokumen.pub/spice-and-ltspice-for-power-electronics-and-electric-power.html)
- [**eevblog.com** LTSpice .measure magnitude at certain frequency - EEVblog](https://www.eevblog.com/forum/beginners/ltspice-measure-magnitude-at-certain-frequency/)
- [**powerelectronicsnews.com** Guide to Spice Simulation for Circuit Analysis and Design – Part 14](https://www.powerelectronicsnews.com/guide-to-spice-simulation-for-circuit-analysis-and-design-part-14-evaluating-user-defined-electrical-quantities/)
- [**web.eecs.utk.edu** ECE 202 - Tutorial: LTspiceParamterSweep - UTK-EECS](https://web.eecs.utk.edu/~dcostine/ECE202/Spring2024/tutorials.php?topic=LTspiceParamterSweep)
- [**docs.easyeda.com** Making measurements of simulation results - EasyEDA Std User Guide](https://docs.easyeda.com/en/Simulation/Chapter17-Making-measurements-of-simulation-results/)
- [**electronics.stackexchange.com** LTSpice: How to use .meas command to find the fundamental](https://electronics.stackexchange.com/questions/366794/ltspice-how-to-use-meas-command-to-find-the-fundamental-frequency-of-non-sinus)
- [**ltwiki.org** Convergence problems? - LTwiki-Wiki for LTspice](https://ltwiki.org/index.php?title=Convergence_problems%3F)
- [**community.infineon.com** Resolving convergence challenges in LTspice](https://community.infineon.com/t5/Knowledge-Base-Articles/Resolving-convergence-challenges-in-LTspice/ta-p/1053215)
