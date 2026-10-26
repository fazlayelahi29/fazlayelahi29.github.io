# The Mathematical Architecture of SPICE: Unifying Time, Frequency, and Numerical Integration

## Chapter 1: The Illusion of Continuous Time

The fundamental premise of physical electronics rests upon the continuous flow of time and the uninterrupted conservation of energy. In the physical universe, a capacitor integrates current into voltage seamlessly over an infinitely divisible timeline, governed by the precise differential relationship $I = C \cdot \frac{dv}{dt}$. An inductor resists changes in current through an equally continuous derivative, $V = L \cdot \frac{di}{dt}$. However, the digital computer, bounded by discrete clock cycles, quantized floating-point arithmetic, and finite memory architectures, is fundamentally incapable of processing true mathematical continuity. To simulate the highly dynamic behavior of analog circuits, the Simulation Program with Integrated Circuit Emphasis (SPICE) engine must construct an elaborate mathematical illusion. It must discretize the continuous flow of time into a sequence of finite, quantized steps, denoted as $\Delta t$ or $h_n$.

This discretization is the foundational axiom of transient circuit simulation. By slicing time into microscopic intervals, the SPICE engine transitions the problem from the realm of continuous calculus into the domain of discrete algebra. Instead of evaluating a continuous function $v(t)$ for all real numbers $t \in \mathbb{R}$, the simulator calculates the system's state only at specific, discrete time points $t_0, t_1, t_2, \dots, t_n, t_{n+1}$. The temporal space between $t_n$ and $t_{n+1}$ is a complete void to the simulator; the engine only possesses knowledge of the circuit's state at the exact boundaries of these steps. Because the computer cannot directly evaluate the infinitesimal limit required for a true derivative ($\lim_{\Delta t \to 0} \frac{\Delta v}{\Delta t}$), it must approximate the derivative using the finite history of the circuit's previous states. 

For an energy storage element, the exact differential equation is replaced by a finite difference equation. The integral of current over time, which determines the accumulated charge $Q = C \cdot V$, is approximated by calculating the numerical area under the current curve across the discrete interval $h_{n+1} = t_{n+1} - t_n$. This introduces a critical mandate for modern SPICE models: strict charge conservation. Early capacitance models that relied solely on the $C(v) \cdot \frac{dv}{dt}$ formulation often violated charge conservation under highly non-linear conditions, leading to artificially created or destroyed charge . Modern compact modeling standards, such as those implemented in Verilog-A and advanced SPICE cores, mandate that capacitive currents be formulated strictly as the time derivative of charge, $I = \frac{dq(v)}{dt}$, ensuring that the numerical integration over time perfectly conserves the total charge in the system . 

This mathematical approximation brings forth profound implications for the practicing engineer. When continuous energy-storage elements are subjected to discrete approximations, they cease to behave exactly as pure physics dictates. Depending on the geometry of the discretization—the specific numerical integration method selected—the simulated capacitor or inductor may artificially dissipate energy, artificially generate energy, or introduce fictitious high-frequency oscillations that do not exist in the real world . To master circuit simulation, one must deeply understand that the output of a transient analysis is not a flawless reflection of physical reality, but rather the exact solution to a numerically approximated, discretized mathematical model of that reality.

## Chapter 2: Numerical Integration Fundamentals

The mechanism by which SPICE translates the continuous calculus of reactive elements into discrete algebra is known as numerical integration. To comprehend this translation, we must examine how the differential equations of energy storage elements are mapped into the Modified Nodal Analysis (MNA) matrix, which is strictly an algebraic construct designed to solve linear systems of the form $A \cdot x = z$ .

Consider the nonlinear Ordinary Differential Equation (ODE) or Differential Algebraic Equation (DAE) system representing a general circuit: $F(x(t), \dot{x}(t), t) = 0$, where $x(t)$ represents the vector of unknown node voltages and specific branch currents, and $\dot{x}(t)$ represents their time derivatives. The MNA formulation easily handles static linear elements like resistors, where the relationship $I = V/R$ maps directly to a constant conductance matrix $G$ . However, the time-derivative term $\dot{x}(t)$ prevents a direct algebraic solution. 

Numerical integration algorithms resolve this mathematical impasse by approximating the derivative $\dot{x}(t_{n+1})$ as an algebraic function of present and past states, such as $x_{n+1}, x_n$, and $x_{n-1}$. By substituting this algebraic approximation into the differential equation, the dynamic reactive element is transformed into an equivalent discrete-time linear model, commonly referred to as a "companion model" . For example, a physical capacitor $C$ is mathematically replaced at each time step by two discrete, static components connected in parallel: an equivalent conductance ($G_{eq}$) and an equivalent independent historical current source ($I_{eq}$) . The specific numerical values of $G_{eq}$ and $I_{eq}$ are entirely dictated by the chosen numerical integration formula and the current time step size $h_n$.

Once this transformation is complete, the circuit technically contains no continuous derivatives. It is simply a mesh of conductances and constant current sources. The SPICE engine then stamps these equivalent values into the global MNA matrix . The MNA matrix is partitioned into four quadrants: a $G$ matrix for nodal conductances, a $B$ matrix mapping voltage source connections, a $C$ matrix (the transpose of $B$) mapping dependent currents, and a $D$ matrix for specific controlled source dependencies . Because the values of $I_{eq}$ (and potentially $G_{eq}$ if the time step changes or the capacitance is non-linear) depend on the results of previous time steps, the MNA matrix must be re-stamped and re-solved at every single time point $t_n$. This continuous cycle of transforming calculus into static algebra, solving the matrix, and advancing time forms the beating heart of the transient simulation engine. The accuracy and stability of the entire simulation rely strictly on how the numerical integration formula computes that companion model.

## Chapter 3: The Backward Euler Method

The Backward Euler method represents the foundational implicit numerical integration algorithm utilized by SPICE. It is a first-order method that approximates the time derivative by assuming that the rate of change of the variable over the entire time step $h$ is entirely dictated by the derivative at the exact *end* of the time step.

Mathematically, for a general differential equation $\dot{x} = f(t, x)$, the Backward Euler formula is derived by applying a backward-looking finite difference approximation:
$x_{n+1} = x_n + h \cdot f(t_{n+1}, x_{n+1})$

Applying this algorithm to a linear capacitor, where $i(t) = C \cdot \frac{dv(t)}{dt}$, the derivative $\frac{dv}{dt}$ is approximated as:
$i_{n+1} = C \cdot \frac{v_{n+1} - v_n}{h}$

By rearranging this equation algebraically to solve for the current $i_{n+1}$ at the new time step, we obtain the algebraic Norton companion model:
$i_{n+1} = \left(\frac{C}{h}\right) v_{n+1} - \left(\frac{C}{h}\right) v_n$

This equation perfectly describes a parallel combination of a resistor and a current source . The term $\frac{C}{h}$ represents the equivalent conductance $G_{eq}$ to be stamped into the MNA diagonal, and the term $\frac{C}{h} v_n$ represents the equivalent historical current source $I_{eq}$ placed in the known stimulus vector $z$. Thus, the capacitor has been successfully discretized.

The defining characteristic of the Backward Euler method is its extraordinary numerical stability. In numerical analysis, a method's stability is evaluated by applying it to the linear test equation $\dot{y} = \lambda y$ (where $\lambda$ is a complex eigenvalue) and mapping the region of the complex plane where the numerical solution decays to zero. Setting $z = \lambda h$, the amplification factor for Backward Euler is $R(z) = \frac{1}{1-z}$ . The method is unconditionally *A-stable*, meaning its absolute stability region encompasses the entire left half of the complex plane ($Re(z) \le 0$) . 

Furthermore, Backward Euler possesses the exceedingly rare and mathematically powerful property of *L-stability* (often referred to as stiff decay) . L-stability guarantees that as the time step $h$ approaches infinity, or as the system's eigenvalues become infinitely stiff (representing near-instantaneous transients), the numerical amplification factor limits exactly to zero ($\lim_{z \to -\infty} R(z) = 0$) .

However, this absolute stability comes at a severe computational cost. The Backward Euler algorithm fundamentally overestimates the decay of the system. By relying solely on the endpoint derivative, it introduces a significant local truncation error proportional to $O(h^2)$ . This mathematical truncation error manifests physically as an artificial, fictitious resistance placed in parallel with the energy storage elements. This phenomenon, known as numerical damping, forces highly resonant circuits (such as high-Q LC tanks or ideal oscillators) to artificially decay and lose energy over time, even when the physical circuit possesses zero parasitic resistance. While Backward Euler is a fortress of stability for stiff DC-coupled circuits and heavily damped networks, its artificial damping makes it a poor choice for simulating high-frequency sinusoidal steady-state behaviors where energy preservation is critical.

## Chapter 4: The Trapezoidal Rule

To recover the energy lost to the numerical damping of the Backward Euler method, SPICE extensively employs the Trapezoidal Rule, which serves as the default transient integration algorithm in many commercial SPICE derivatives. The Trapezoidal Rule is a second-order implicit method that calculates the next state by averaging the derivatives at both the beginning and the end of the time step, effectively drawing a straight line between the two derivative points.

For the general differential equation $\dot{x} = f(t, x)$, the Trapezoidal integration formula is defined as:
$x_{n+1} = x_n + \frac{h}{2} \Big( f(t_n, x_n) + f(t_{n+1}, x_{n+1}) \Big)$

When applied to the capacitor equation $i = C \cdot \frac{dv}{dt}$, we substitute $f(t, v) = i(t)/C$ to obtain:
$v_{n+1} = v_n + \frac{h}{2C} (i_n + i_{n+1})$

Rearranging this expression to form the algebraic Norton companion model for the MNA matrix yields:
$i_{n+1} = \left(\frac{2C}{h}\right)v_{n+1} - \left(\frac{2C}{h}\right)v_n - i_n$

Here, the equivalent companion conductance is $G_{eq} = \frac{2C}{h}$, and the historical current source depends on both the past voltage and the past current: $I_{eq} = \frac{2C}{h}v_n + i_n$. 

Because the Trapezoidal Rule is a second-order method, its local truncation error is bounded by $O(h^3)$, making it significantly more accurate than Backward Euler for tracking smooth, continuous, sinusoidal waveforms. Moreover, its stability region perfectly coincides with the exact boundary of the left half of the complex plane. It is exactly A-stable. As a result, it introduces zero artificial numerical damping; it perfectly preserves the energy of linear conservative systems, allowing pure LC oscillators to ring infinitely without any artificial numerical decay.

However, the mathematical perfection of the Trapezoidal Rule harbors a devastating flaw for modern non-linear switching circuits. While it is A-stable, it is emphatically *not* L-stable . If we examine the amplification factor $R(z)$ for the standard test equation $z = \lambda h$, we find that $R(z) = \frac{1 + z/2}{1 - z/2}$. Crucially, as $z \to -\infty$ (representing a massive time step relative to an extremely fast transient, such as a sharp MOSFET switching edge or a diode reverse-recovery snap-off), the limit of $R(z)$ approaches $-1$ . 

This behavior dictates that if a circuit undergoes an instantaneous topological change, and the SPICE time step $h$ is large relative to the physical time constant, the discrete mathematical solution will multiply the previous state's error by $-1$. The simulated voltage will oscillate violently between positive and negative extremes at every subsequent time step, a purely numerical artifact known universally as "Trapezoidal Ringing" . This ringing is not a physical phenomenon; it is a critical breakdown of the Trapezoidal difference equation failing to enforce stiff decay. In high-speed digital electronics and pulse-width modulated (PWM) power supplies, this ringing can completely obliterate the accuracy of the simulation, demanding an alternative mathematical approach that balances accuracy with stiff decay.

## Chapter 5: The Gear Method

To reconcile the demand for higher-order accuracy with the absolute necessity of L-stability to suppress numerical ringing, SPICE implements the Gear integration algorithms, specifically the second-order Backward Differentiation Formula, known as Gear-2 . By utilizing a parameter such as `MAXORD=2` (maximum integration order), SPICE engages this powerful multi-step methodology .

Unlike the Trapezoidal Rule, which utilizes both the state variable and its derivative at the past time step to evaluate the integral, Gear's method relies exclusively on a multi-step history of the state variable itself. It fits an interpolating polynomial through the present voltage and several past voltage points, evaluating the derivative solely at the present time step $t_{n+1}$. Because it does not explicitly propagate the past derivative $f(t_n, x_n)$ forward, it completely bypasses the mathematical mechanism that causes the alternating polarity of Trapezoidal ringing.

The derivation of Gear-2 begins with a second-order backward difference polynomial. Assuming a uniform time step $h$ for the sake of foundational derivation, the approximation of the derivative is:
$\dot{x}_{n+1} = \frac{3x_{n+1} - 4x_n + x_{n-1}}{2h}$

Substituting this into the capacitor equation $i_{n+1} = C \cdot \dot{v}_{n+1}$, we derive the Gear-2 companion model:
$i_{n+1} = \left(\frac{3C}{2h}\right) v_{n+1} - C \cdot \frac{4v_n - v_{n-1}}{2h}$

This yields an equivalent conductance $G_{eq} = \frac{1.5 C}{h}$, and a historical current source that deeply depends on two prior time steps: $I_{eq} = \frac{C}{2h}(4v_n - v_{n-1})$.

Because SPICE utilizes a dynamic, variable time step algorithm, the generic Gear-2 formula must be heavily modified dynamically during simulation to account for non-uniform step sizes where $h_n \neq h_{n-1}$. The coefficients in the derivative approximation become complex algebraic ratios of $h_n$ and $h_{n-1}$ to ensure the polynomial fit remains accurate despite a shifting temporal grid .

The Gear-2 method is the ultimate mathematical weapon against stiff differential equations. Like Backward Euler, it is rigorously L-stable, meaning its amplification factor $R(z) \to 0$ as $z \to -\infty$ . Therefore, it immediately dampens and suppresses any fictitious high-frequency numerical noise or ringing introduced by sharp switching transients . It achieves this while maintaining second-order accuracy, making it vastly superior to Backward Euler for tracking non-linear curves. While it does introduce a minuscule amount of artificial numerical damping (unlike the perfectly energy-preserving Trapezoidal Rule), this damping is generally negligible except in the most sensitive, high-Q RF oscillator simulations. For the vast majority of modern analog, digital, and power electronics, Gear-2 is the definitive integration standard.

| Integration Method | Order | A-Stable | L-Stable (Stiff Decay) | Numerical Damping | Susceptible to Ringing |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Backward Euler** | 1st | Yes | Yes | High | No |
| **Trapezoidal** | 2nd | Yes | No | Zero | Yes |
| **Gear-2 (BDF2)** | 2nd | Yes | Yes | Low | No |

## Chapter 6: Dynamic Time-Step Control

The illusion of continuous time requires the simulator to carefully manage the size of the discrete time step $h_n$. If $h_n$ is too large, the numerical integration polynomials will deviate drastically from the true physical waveform, leading to catastrophic simulation inaccuracy and a failure to capture transient events. If $h_n$ is microscopically small, the simulation will take an eternity to execute, consuming vast computational resources unnecessarily. To optimize this delicate balance, the SPICE engine deploys a dynamic, real-time feedback loop known as Time-Step Control, continuously expanding and contracting $\Delta t$ based on the mathematical roughness of the circuit's waveforms.

The primary mathematical mechanism for this control is the estimation of the Local Truncation Error (LTE). The LTE is defined as the mathematical difference between the exact analytical solution of the differential equation and the approximate solution generated by the numerical integration method over a single time step . Because SPICE does not know the exact analytical solution, it must mathematically estimate the LTE using Taylor series remainders and divided differences.

For a second-order method like Trapezoidal or Gear-2, the fundamental theoretical LTE is proportional to the third derivative of the charge (or flux) with respect to time, multiplied by the cube of the time step:
$LTE_{n+1} \approx C \cdot \frac{h_n^3}{12} \cdot \frac{d^3 v}{dt^3}$

SPICE calculates the third derivative dynamically using divided differences—recursively calculating the slopes of slopes using the voltage history from the past three time points . If the mathematically estimated LTE at any given node exceeds a predefined maximum allowable error, the SPICE engine immediately rejects the time step. It discards the calculated solution, shrinks the time step $h_n$ by a calculated factor (often up to an order of magnitude reduction), and attempts to solve the time point again from the previous valid state.

The maximum allowable error is strictly dictated by the user's tolerance parameters (`RELTOL`, `ABSTOL`, `VNTOL`), combined with a highly critical, empirical scaling factor known as `TRTOL` (Transient Error Tolerance). The operational formula for the maximum allowed LTE is generally defined as:
$LTE_{allowed} = \text{TRTOL} \cdot (\text{RELTOL} \cdot |v| + \text{ABSTOL})$

The `TRTOL` parameter defaults to a value of 7.0 . This dimensionless constant is not derived from pure mathematical proof; rather, it was empirically determined during the original development of SPICE2 by Laurence Nagel at UC Berkeley in the 1970s to provide the optimal balance between simulation speed and accuracy across a broad suite of test circuits . By setting `TRTOL=7`, SPICE purposefully overestimates the acceptable bounds of the local truncation error by a factor of seven . This allows the simulator to take much larger time steps than strict mathematical rigor would otherwise permit, significantly boosting simulation speed without causing the Newton-Raphson iterations to fail or destabilize. 

Raising `TRTOL` allows for even larger time steps, which acts as a form of hysteresis to prevent the simulator from needlessly shrinking the step size on minor errors . Conversely, lowering `TRTOL` tightens the temporal grid, eliminating interpolation artifacts at the expense of computational time . Additional parameters such as `CHGTOL` define the absolute tolerance for charge calculation, providing an extra layer of boundary constraint when evaluating the divided differences of non-linear capacitive elements . Through this elaborate choreography of divided differences and tolerance thresholds, SPICE breathes life into a timeline that appears continuous to the user, yet is fundamentally a highly reactive, non-uniform discrete grid.

| SPICE Parameter | Function in Time-Step Control | Default Value | Implication of Adjustment |
| :--- | :--- | :--- | :--- |
| **RELTOL** | Relative error tolerance for node voltages/currents. | 0.001 | Lowering increases accuracy but exponentially increases runtime. |
| **TRTOL** | Transient error tolerance. Scales the acceptable LTE. | 7.0 | Raising increases time step size and speeds up simulation. |
| **ABSTOL** | Absolute current error tolerance. | 1 pA | Establishes the noise floor for current calculations. |
| **VNTOL** | Absolute voltage error tolerance. | 1 $\mu$V | Establishes the noise floor for voltage calculations. |
| **CHGTOL** | Maximum charge error used strictly in LTE calculations. | 10 fC | Bounds the error on integrating non-linear capacitors. |

## Chapter 7: AC Analysis and Complex Phasors

While Transient Analysis wrestles with the mathematical complexities of numerical integration, companion models, and dynamic time-stepping, SPICE possesses a completely disparate engine for small-signal frequency domain simulation: the AC Analysis. In AC Analysis, the illusion of continuous time is entirely discarded. The concept of time ceases to exist, and the grueling differential equations are obliterated, replaced by the elegant and exact linear algebra of complex numbers.

The AC Analysis fundamentally assumes that the circuit has settled into a sinusoidal steady state, driven exclusively by small-signal sinusoidal sources. Because the system is assumed to be linear (or strictly linearized around a specific DC operating point), the time-domain derivative operator $\frac{d}{dt}$ can be analytically replaced by the complex frequency multiplier $j\omega$, where $j = \sqrt{-1}$ and $\omega = 2\pi f$. 

This analytical substitution is a profound mathematical simplification. The differential equation for a capacitor, $i(t) = C \cdot \frac{dv(t)}{dt}$, is instantaneously transformed into the complex phasor domain as $I(j\omega) = j\omega C \cdot V(j\omega)$. Consequently, the capacitor is modeled not by a historical Norton companion circuit requiring backward-looking integration, but simply by a constant complex admittance: $Y_C = j\omega C$ . Similarly, an inductor becomes an admittance of $Y_L = \frac{1}{j\omega L}$. Any mutual inductance between coupled coils is naturally handled by stamping complex trans-admittance terms into the off-diagonal components of the matrix .

Before an AC Analysis can begin, SPICE must execute a standard DC Operating Point analysis to find the quiescent steady-state of the circuit. Once the DC voltages and currents are found, every nonlinear semiconductor device (such as diodes, BJTs, and MOSFETs) is linearized. SPICE calculates the partial derivatives of the highly non-linear device equations at the operating point, effectively extracting a Taylor series expansion truncated to the first order . This calculates the small-signal parameters, such as the transconductance ($g_m = \frac{\partial I_D}{\partial V_{GS}}$) and output conductance ($g_{ds} = \frac{\partial I_D}{\partial V_{DS}}$) . The nonlinear device is then completely replaced by a linear macro-model consisting only of constant resistors, linear dependent Voltage-Controlled Current Sources (VCCS), and linear parasitic capacitors evaluated at that specific DC bias .

Once the circuit is successfully linearized and reactive elements are converted to complex admittances, SPICE constructs a Complex Modified Nodal Analysis matrix. The system takes the form:
$(G + j\omega C) \cdot X(j\omega) = Z(j\omega)$
where $G$ is the real conductance matrix, $C$ is the reactive matrix, $X$ is the vector of unknown complex node voltages, and $Z$ is the vector of complex AC stimuli . 

Because there are no time steps, there is no truncation error, no numerical damping, and absolutely no Trapezoidal ringing. At every frequency point $f$ specified by the user's sweep, SPICE simply re-evaluates the complex matrix $(G + j2\pi f C)$ and solves the linear system using sparse matrix complex LU factorization. The resulting complex vector $X$ yields both the magnitude and phase of every node in the circuit, allowing for exact Bode plot generation without a single step of numerical integration.

## Chapter 8: Laplace Transforms in Behavioral Modeling

The transition from the time domain to the frequency domain is a core feature of SPICE, but modern engineering frequently demands the inverse: simulating theoretically defined frequency-domain transfer functions within a time-domain transient analysis. This requirement is fulfilled through Analog Behavioral Modeling (ABM) blocks utilizing the Laplace variable $s$ . 

In control systems, power electronics, and signal processing, engineers design compensators and filters using rational polynomials in the $s$-domain:
$H(s) = \frac{V_{out}(s)}{V_{in}(s)} = \frac{a_0 + a_1 s + a_2 s^2 + \dots + a_m s^m}{b_0 + b_1 s + b_2 s^2 + \dots + b_n s^n}$

When an ABM Laplace block is placed into a transient simulation, SPICE faces a severe mathematical dilemma. The simulator's transient engine operates strictly in discrete time $t_n$, advancing chronologically, but the behavioral block is defined in the continuous complex frequency domain $s$. Because the Laplace transform represents an integral over all time from $t=0$ to infinity, SPICE cannot simply evaluate $H(s)$ algebraically during a local time step. It must dynamically convert the $s$-domain transfer function into an equivalent discrete time-domain representation.

Historically, early SPICE algorithms accomplished this via recursive convolution. The simulator would compute the inverse Laplace transform of $H(s)$ to find the continuous-time impulse response $h(t)$. During the transient simulation, the engine would mathematically convolve the input signal $v_{in}(t)$ with $h(t)$ at every time step . However, direct numerical convolution is computationally disastrous; calculating the integral requires looking back at every single past time step since $t=0$, causing the simulation memory and execution time to scale exponentially as the analysis progresses.

Modern SPICE engines resolve this computational bottleneck through State-Space Realization and Bilinear Transformations . Instead of convolution, the engine algebraically decomposes the rational $H(s)$ polynomial into a system of coupled first-order linear differential equations, represented as a state-space matrix:
$\dot{x}(t) = A \cdot x(t) + B \cdot v_{in}(t)$
$v_{out}(t) = C \cdot x(t) + D \cdot v_{in}(t)$

Once transformed into this canonical state-space differential form, the equations are no longer bound to the frequency domain. SPICE can now apply the exact same numerical integration algorithms—Backward Euler, Trapezoidal, or Gear-2—to these abstract state variables $x(t)$ as it does to physical capacitors and inductors . The theoretical Laplace function is mathematically synthesized into a virtual subcircuit of numerical companion models, allowing it to be stamped directly into the main MNA matrix and solved simultaneously with the rest of the transient physical physics engine. This enables the seamless integration of ideal PID controllers, complex filters, and theoretical transfer functions directly into non-linear physical circuit simulations.

## Chapter 9: Fourier Analysis and FFTs

Just as the simulation engine must dynamically bridge time and frequency for Laplace blocks, it must also provide the user with the ability to extract frequency spectra from non-linear transient waveforms. SPICE provides two vastly different mathematical mechanisms to accomplish this: the internal `.FOUR` command executed natively by the simulator, and the post-processing Fast Fourier Transform (FFT) executed by the waveform viewer .

The `.FOUR` SPICE directive represents an in-line, classical Fourier Series decomposition. When declared in the netlist, the simulator engine computes the Fourier coefficients directly during the transient simulation as it advances through time. It continuously evaluates the fundamental integral:
$a_n = \frac{2}{T} \int_{0}^{T} v(t) \cos(n \omega t) dt$
$b_n = \frac{2}{T} \int_{0}^{T} v(t) \sin(n \omega t) dt$

Because the SPICE engine generates data at non-uniform, dynamically varying time steps $t_n$, it utilizes polynomial interpolation between the simulated points to evaluate the continuous integral accurately on the fly . The `.FOUR` command is highly precise for calculating Total Harmonic Distortion (THD) because it relies on the raw, unaliased floating-point values computed inside the simulation core, but it is inherently limited: it typically only computes the fundamental frequency and the first nine harmonics, and it forces the user to declare the exact fundamental frequency prior to running the simulation .

Conversely, the Fast Fourier Transform (FFT) executed by a waveform viewer (such as Probe) is a strict post-processing algorithm . The FFT algorithm (typically the Cooley-Tukey radix-2 algorithm) fundamentally requires an input array of data points that are uniformly spaced in time ($\Delta t = \text{constant}$), and the number of points must often be an exact power of 2 ($N = 2^k$) . 

However, the raw data exported by the SPICE engine is fundamentally non-uniform, heavily dictated by the dynamic time-step control scaling back $h_n$ during sharp edges and expanding $h_n$ during steady states. Before the FFT can be executed, the Probe software must perform a massive resampling and interpolation operation. It reads the non-uniform SPICE output file and interpolates the transient data onto a rigid, uniformly spaced time grid . 

This interpolation is a significant source of mathematical artifacting. If the interpolation algorithm uses simple linear mapping between widely spaced time points, it inadvertently introduces a high-frequency noise floor into the FFT spectrum that does not exist in the actual simulated circuit. Furthermore, the FFT is subject to spectral leakage if the sampled time window is not an exact integer multiple of the waveform's fundamental period. To mitigate this leakage, windowing functions (such as Hann, Hamming, or Blackman-Harris) must be applied to the interpolated data to artificially taper the ends of the data set to zero . Thus, while the Probe FFT provides a sweeping, high-resolution broadband spectrum essential for EMI/EMC analysis, the user must recognize that they are viewing a mathematically transformed, interpolated, and windowed shadow of the original dynamic time-step data.

## Chapter 10: The Holistic Physics Engine

The ultimate triumph of the SPICE architecture is not found in any single mathematical algorithm, but in the seamless, orchestrated convergence of multiple distinct mathematical disciplines. To simulate the transient response of a nonlinear circuit, SPICE must simultaneously balance discrete time discretization, iterative nonlinear algebra, and sparse linear matrix theory. This synthesis forms the holistic physics engine, executing millions of operations per second in a rigidly nested loop hierarchy.

At the very outermost layer sits the **Time Integration Loop**. As discussed in Chapters 3 through 6, this loop dictates the flow of simulated time. It selects a time step $h_n$, estimates the local truncation error, and chooses a numerical integration formula (Trapezoidal or Gear). This formula calculates the companion models ($G_{eq}$ and $I_{eq}$) for every capacitor and inductor, temporarily freezing time and converting the dynamic ODEs into a static, DC equivalent circuit.

Nested directly inside the Time Loop is the **Newton-Raphson Iteration Loop** . With the reactive elements temporarily reduced to static resistors and current sources, the engine must resolve the highly nonlinear behavior of the semiconductor devices (diodes, BJTs, MOSFETs). Because the MNA matrix can only solve linear systems, the Newton-Raphson algorithm linearizes the nonlinear devices based on a "guessed" operating voltage. It computes the mathematical derivatives (the Jacobian matrix) of the nonlinear current equations to generate small-signal equivalent transconductances and equivalent current sources . These linearized elements are stamped into the matrix. 

At the innermost core lies the **Linear Matrix Solver**. The fully populated, now entirely linear and static MNA matrix equation ($A \cdot x = z$) is solved using Sparse LU Factorization . The result is a new vector of node voltages $x$.

But the simulation for this time step is not yet complete. The new voltages are fed back up to the Newton-Raphson loop. The nonlinear semiconductor equations are re-evaluated at these new voltages. If the new currents differ from the guessed currents by a margin greater than the `RELTOL` and `ABSTOL` tolerances, the linear matrix is re-stamped with new derivatives, and the matrix is solved again. This inner iteration continues until the node voltages converge to a stable limit . 

If the Newton-Raphson loop fails to converge after a set number of iterations (dictated by the `ITL4` parameter), the engine aborts the attempt, kicks control back to the outer Time Loop, shrinks the time step $h_n$, and begins the entire process again . If severe convergence failures occur, SPICE engages fallback algorithms such as `GMIN` Stepping (injecting artificial parallel conductances to aid matrix inversion) or Source Stepping (ramping up power supplies slowly to find a valid DC operating point) . In extreme cases, it utilizes pseudo-transient analysis to force a stable starting state .

| Simulation Loop | Function | Algorithm Used | Failure Consequence |
| :--- | :--- | :--- | :--- |
| **Time Integration Loop** | Advances time $\Delta t$, computes reactive companion models. | Trapezoidal, Gear, Backward Euler | High Truncation Error $\rightarrow$ Step rejected, $h_n$ reduced. |
| **Newton-Raphson Loop** | Linearizes nonlinear components at a specific time point. | Jacobian derivative evaluation | Non-convergence $\rightarrow$ Time step rejected, $h_n$ reduced. |
| **Linear Matrix Solver** | Solves the linear algebraic system $A \cdot x = z$. | Sparse LU Factorization (e.g., KLU) | Singular Matrix $\rightarrow$ Simulation halts (topological error). |

Only when the Newton-Raphson loop converges, and only when the Time Loop verifies that the Local Truncation Error of the new solution is within the `TRTOL` boundaries, is the time step officially accepted. The data is written to the output file, time $t_n$ advances to $t_{n+1}$, and the immense mathematical machinery resets to take its next step into the illusion of continuous time. 

This tripartite architecture—Numerical Integration binding continuous time to discrete algebra, Newton-Raphson binding nonlinear physics to linear approximations, and Sparse Matrix Solvers binding immense network topologies into instantaneous numerical solutions—is what allows SPICE to accurately mirror the continuous physical universe inside the discrete confines of digital computation. 


## Sources

- [**dsp-book.narod.ru** Electrical Engineering Dictionary](https://dsp-book.narod.ru/eed1.pdf)
- [**researchgate.net** Best Practices for Compact Modeling in Verilog-A - ResearchGate](https://www.researchgate.net/publication/281227678_Best_Practices_for_Compact_Modeling_in_Verilog-A)
- [**biomatematica.it** Stiff Systems](http://www.biomatematica.it/urbino2002/programmi/Italy1.pdf)
- [**doras.dcu.ie** THE NUMERICAL SOLUTION OF ORDINARY AND ALGEBRAIC](https://doras.dcu.ie/18933/1/Gerard_Keogh.pdf)
- [**lpsa.swarthmore.edu** Modified Nodal Analysis - printable - Swarthmore College](https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNAAll.html)
- [**repositum.tuwien.at** Mixed-mode device simulation - reposiTUm](https://repositum.tuwien.at/bitstream/20.500.12708/18037/1/Grasser%20Tibor%20-%201999%20-%20Mixed-mode%20device%20simulation.pdf)
- [**scribd.com** Newton-Raphson for Nonlinear Circuits | PDF - Scribd](https://www.scribd.com/presentation/550656453/Newton-Raphson-Method)
- [**ecircuitcenter.com** Transient Analysis - eCircuit Center](https://www.ecircuitcenter.com/SpiceTopics/Transient%20Analysis/Transient%20Analysis.htm)
- [**kilthub.cmu.edu** ASP - CMU's KiltHub](https://kilthub.cmu.edu/articles/journal_contribution/ASP_an_interactive_APL_circuit_simulation_package/6468356/files/11896907.pdf)
- [**piazza.com** Math 361S Lecture Notes Numerical integration of ODEs - Piazza](https://piazza.com/class_profile/get_resource/jbkyyl6qilt5y2/jfyfzbo2z3qu8)
- [**arxiv.org** Lecture Notes Numerical Solution of ODEs - arXiv](https://arxiv.org/html/2412.19959v1)
- [**intusoft.com** SPICE Numerical Methods, Part 1 Convergence Methods - Intusoft](http://www.intusoft.com/nlhtm/nl72.htm)
- [**unm.edu** T-Spice 14 User Guide—Contents - The University of New Mexico](https://www.unm.edu/~pzarkesh/ECE520/tspice.pdf)
- [**epc-co.com** Circuit Simulation Using EPC Device Models](https://epc-co.com/epc/portals/0/epc/documents/product-training/circuit_simulations_using_device_models.pdf)
- [**scribd.com** T-Spice User's Guide: Release 16.3 June 2015 | PDF | Mosfet - Scribd](https://www.scribd.com/document/322849729/tspice)
- [**arxiv.org** Stochastic Testing Method for Transistor-Level Uncertainty ... - arXiv](https://arxiv.org/pdf/1409.4831)
- [**kolegite.com** THE SPICE BOOK](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%B0%D0%BD%D0%B5%D1%82%D0%BE%20%D0%B2%20%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0%D1%82%D0%B0/The%20SPICE%20Book%20by%20Andrei%20Vladimirescu%20%28z-lib.org%29.pdf)
- [**pulsonix.com** Pulsonix Spice Simulator](https://pulsonix.com/downloads/manuals/spice/Pulsonix%20Spice%20Users%20Guide.pdf)
- [**ic.ese.upenn.edu** VLIW-SCORE: Beyond C for Sequential Control of SPICE FPGA](https://ic.ese.upenn.edu/pdf/vliw_score_fpt2011.pdf)
- [**scribd.com** Ngspice Manual PDF | PDF | Bipolar Junction Transistor - Scribd](https://www.scribd.com/document/482322746/ngspice-manual-pdf)
- [**scribd.com** Semiconductor Device Modeling Guide | PDF | P–N Junction | Spice](https://www.scribd.com/document/726673741/Giuseppe-Massobrio-Paolo-Antognetti-Semiconductor-Device-Modeling-With-SPICE-McGraw-Hill-1993)
- [**scribd.com** SPICE Module: User's Guide | PDF - Scribd](https://www.scribd.com/document/525455579/LRM-PSPICE)
- [**sanandres.uep.edu.py** Analysis Design Of Linear Circuits Solution](https://sanandres.uep.edu.py/default.aspx/T6DB9S/704624/Analysis%20Design%20Of%20Linear%20Circuits%20Solution.pdf)
- [**arxiv.org** Transient Forward Harmonic Adjoint Sensitivity Analysis - arXiv](https://arxiv.org/pdf/2401.13496)
- [**web.engr.oregonstate.edu** Chapter 21 Using Transmission Lines](https://web.engr.oregonstate.edu/~moon/ece323/hspice98/files/chapter_21.pdf)
- [**ieeexplore.ieee.org** The Partial Elements Equivalent Circuit Method: The State of the Art](https://ieeexplore.ieee.org/iel7/15/10359425/10231005.pdf)
- [**people.engr.tamu.edu** HSPICE MOSFET Models Manual](https://people.engr.tamu.edu/spalermo/ecen474/hspice_mosfet.pdf)
- [**rincon-mora.gatech.edu** PSpice Reference Manual](https://rincon-mora.gatech.edu/spice/pspice.pdf)
- [**bitmesra.ac.in** In-depth course for EEE Departments - BIT Mesra](https://bitmesra.ac.in/UploadedDocuments/admineee/files/Course%20Structure,%20Syllabus%202022%20Onwards.pdf)
- [**crescent.education** B.Tech. (Electrical and Electronics Engineering) Regulations 2021](https://crescent.education/wp-content/uploads/2024/11/B.Tech_.-EEE-R2021_CS_compressed.pdf)
- [**scribd.com** Viscose Fiber Overview in Chemistry | PDF | Bending - Scribd](https://www.scribd.com/document/347255701/Syllabus-BE-Merged)
- [**hodany.com** Signal analysis in the frequency domain with LTspice – Part 2.](https://hodany.com/2022/02/signal-analysis-in-the-frequency-domain-with-ltspice-part-2/)
- [**knowledge.ni.com** Configuring a Fourier Analysis in Multisim - NI - Support](https://knowledge.ni.com/KnowledgeArticleDetails?id=kA03q000000YHDjCAO&l=en-US)
- [**soclibrary.futa.edu.ng** Digital Signals Theory](https://soclibrary.futa.edu.ng/books/Digital%20Signals%20Theory%20%28Brian%20McFee%29%20%28Z-Library%29.pdf)
- [**groups.io** LTspice@groups.io | Messages](https://groups.io/g/LTspice/messages?page=7896&after=1113786953000000000&subsort=1&index=5800)
- [**cambridge.org** Basic Nonlinear Microwave Circuit Analysis Techniques (Chapter 2)](https://www.cambridge.org/core/books/nonlinear-circuit-simulation-and-modeling/basic-nonlinear-microwave-circuit-analysis-techniques/95840830941189173B9ECE86AA874993)
- [**sander.ai** Sander Dieleman: Latest Posts](https://sander.ai/)
- [**learnfea.com** Newton-Raphson Method for NonLinear FEA - LearnFEA](https://learnfea.com/newton-raphson-method-for-nonlinear-fea/)
- [**eroots.tech** What is Newton-Raphson Method? | Power Systems Glossary | eRoots](https://eroots.tech/glossary/newton-raphson-method)
- [**researchgate.net** KLU sparse direct linear solver implementation into NGSPICE](https://www.researchgate.net/publication/254041555_KLU_sparse_direct_linear_solver_implementation_into_NGSPICE)
- [**researchgate.net** Overview of SPICE-like circuit simulation algorithms - ResearchGate](https://www.researchgate.net/publication/3348837_Overview_of_SPICE-like_circuit_simulation_algorithms)
- [**community.infineon.com** Resolving convergence challenges in LTspice](https://community.infineon.com/t5/Knowledge-Base-Articles/Resolving-convergence-challenges-in-LTspice/ta-p/1053215)
- [**ltwiki.org** Convergence problems? - LTwiki-Wiki for LTspice](https://ltwiki.org/index.php?title=Convergence_problems%3F)
- [**vbn.aau.dk** An LTSpice - MATLAB Interface for Mitigating Convergence](https://vbn.aau.dk/ws/portalfiles/portal/489168449/pkubulus_ltspicematlab_convergence_postprint.pdf)
- [**simetrix.co.uk** SIMETRIX SIMULATOR REFERENCE MANUAL](https://www.simetrix.co.uk/Files/manuals/9.0/SimulatorReference.pdf)
- [**sites.units.it** SPICE: - PHP 8.2.31 - UniTS](https://sites.units.it/carrato/didatt/doc/spice.pdf)
- [**vbn.aau.dk** Efficient Automated Design and Optimization for Wide-Bandgap](https://vbn.aau.dk/files/752350357/PHD_PPK_ONLINE.pdf)
- [**docs.lib.purdue.edu** A STUDY OF NUMERICAL INTEGRATION TECHNIQUES FOR USE](https://docs.lib.purdue.edu/cgi/viewcontent.cgi?article=1301&context=ecetr)
- [**analog.com** SPICE Differentiation | Analog Devices](https://www.analog.com/en/resources/technical-articles/spice-differentiation.html)
- [**dspace.cuni.cz** NextGen SPICE – Electrical Circuit Simulation Library for .NET](https://dspace.cuni.cz/bitstream/handle/20.500.11956/99795/130231639.pdf?sequence=1&isAllowed=y)
- [**digital-library.theiet.org** Generalised associated discrete circuit model for switching devices](https://digital-library.theiet.org/doi/pdf/10.1049/ip-smt%3A19949591?download=true)
- [**mdpi.com** Advanced Numerical Methods for Multitime Partial Differential](https://www.mdpi.com/2075-1680/15/6/467)
- [**altium.com** Configuring & Running a Simulation - Altium](https://www.altium.com/documentation/altium-designer/circuit-simulation/configuring-running)
- [**rudraj.it** HSPICE Simulation and Analysis User Guide](http://www.rudraj.it/hspice_sa.pdf)
- [**class.ece.iastate.edu** Virtuoso® Analog Design Environment User Guide](https://class.ece.iastate.edu/djchen/ee501/2011/Cadence%20analog%20design%20environment%20user%20guide%202006.pdf)
- [**karunya.edu** DIVISION OF ELECTRICAL AND ELECTRONICS ENGINEERING](https://www.karunya.edu/sites/default/files/img/2024/academics/05%20EEE.pdf)
- [**indect.fei.tuke.sk** MicroSim PSpice & Basics - INDECT](https://indect.fei.tuke.sk/Zaklady_elektroniky-EN/_materials/Lectures/Basic%20Electronics6-7.pdf)
- [**engineering.upenn.edu** PSpice User's Guide - Penn Engineering](https://www.engineering.upenn.edu/~jan/spice/PSpice_UserguideOrCAD.pdf)
- [**simetrix.co.uk** SIMETRIX SIMULATOR REFERENCE MANUAL](https://www.simetrix.co.uk/Files/manuals/9.3/SimulatorReference.pdf)
- [**library.knu.edu.af** An Analog Electronics Companion](https://library.knu.edu.af/opac/temp/11302.pdf)
- [**scribd.com** Users Guide | PDF | Spice | Electronic Circuits - Scribd](https://www.scribd.com/document/553612376/Users-Guide)
- [**ieee-cas.org** a short history of - IEEE Circuits and Systems Society](https://ieee-cas.org/files/ieeecass/2022-01/a_short_history_of_circuits_and_systems-_ebook-_web.pdf)
- [**politesi.polimi.it** simulation and analysis of modular - POLITesi](https://www.politesi.polimi.it/retrieve/9fdeaec8-e3ad-4a78-b303-f60b5757879a/del%20Giudice%20-%20Phd%20Thesis.pdf)
- [**dokumen.pub** Analog Circuit Simulators for IC Designers 9783030642051](https://dokumen.pub/analog-circuit-simulators-for-ic-designers-9783030642051-9783030642068.html)
- [**researchgate.net** Element stamp algorithm for matrix formulation of symbolic circuits](https://www.researchgate.net/publication/320138507_Element_stamp_algorithm_for_matrix_formulation_of_symbolic_circuits)
- [**geokniga.org** Fourier Transforms in Spectroscopy](https://www.geokniga.org/sites/geokniga/files/books/fouriertransformsinspectroscopy.pdf)
- [**scribd.com** SPIP Manual 4 1 | PDF | Button (Computing) - Scribd](https://www.scribd.com/document/187007881/SPIP-Manual-4-1)
- [**proceedings.iclr.cc** LATENT FOURIER TRANSFORM - ICLR Proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/file/3ae02df8061edeba2acc6f79294fa8e0-Paper-Conference.pdf)
- [**ece.iisc.ac.in** HSPICE User Guide: Signal Integrity - ECE, IISc](https://ece.iisc.ac.in/~dipanjan/E8_262/hspice_si.pdf)
- [**ia802807.us.archive.org** FUNDAMENTALS OF MACHINE DESIGN](https://ia802807.us.archive.org/25/items/FUNDAMENTALSOFMACHINEDESIGNORLOVVOL1/FUNDAMENTALS%20OF%20MACHINE%20DESIGN%20ORLOV%20VOL%201.pdf)
- [**wiki.eecs.yorku.ca** Cadence Verilog-A Language Reference](https://wiki.eecs.yorku.ca/lab/emil/_media/mmsim13_11_480:veriaref.pdf)
- [**rudraj.it** HSPICE Reference Manual](http://www.rudraj.it/hspice_cmdref.pdf)
- [**pdfcoffee.com** Modeling and Simulation of Systems Using MATLAB® and Simulink](https://pdfcoffee.com/modeling-and-simulation-of-systems-using-matlab-and-simulink-devendra-k-chaturvedi-crc-2010-pdf-free.html)
- [**bitmesra.ac.in** BIRLA INSTITUTE OF TECHNOLOGY MESRA RANCHI](https://bitmesra.ac.in/UploadedDocuments/admineee/files/Syllabus%20CBCS%20Based%20EEE%20Course.pdf)
- [**mural.maynoothuniversity.ie** Non-linear Dynamic Transformer Modelling and Optimum Control](https://mural.maynoothuniversity.ie/id/eprint/5615/1/PhD_thesis_optimum_control_power_converter_TueVu.pdf)
- [**gitam.edu** B.Tech. Computer Science and Engineering - Gitam](https://www.gitam.edu/sites/default/files/syllabus/BTech.CSE%202020-2021_0.pdf)
- [**kletech.ac.in** Electrical & Electronics Engineering Program](https://www.kletech.ac.in/pdf/Bachelor-of-Electrical-Electronics-Engineering-pdf.pdf)
- [**information-iii.org** Contents - International Information Institute](http://www.information-iii.org/abs_e2.html)
- [**gigglecozy.com** Gigglecozy: Home](https://gigglecozy.com/)
- [**figshare.swinburne.edu.au** NEUROELECTRONICS: DESIGN PATTERNS, METHODS AND](https://figshare.swinburne.edu.au/articles/thesis/Neuroelectronics_Design_patterns_methods_and_implementations/31418492/1/files/62179811.pdf)
- [**research.tue.nl** Physics-consistent machine learning for electric circuits](https://research.tue.nl/files/423235557/20261015_F_rster_hf.pdf)
- [**mialdeatdo.com** Engineering Circuit Analysis - Aldea TDO](https://mialdeatdo.com/wp-content/uploads/2019/09/William_Hart_Hayt_Jack_E_Kemmerly_Steven_M_Durbz-lib.org_.pdf)
- [**diglib.tugraz.at** Design of an Integrated Switched Capacitor DC-DC Converter for](https://diglib.tugraz.at/download.php?id=608a8a3cc6f63&location=browse)
- [**osti.gov** XyceTM Parallel Electronic Simulator - OSTI.GOV](https://www.osti.gov/servlets/purl/1018462)
- [**run.unl.pt** CAPACITOR CIRCUITS IN DEEP-SUBMICRON CMOS ... - run@unl.pt](https://run.unl.pt/bitstreams/6d931903-b380-4a51-a1c1-6222c3328fca/download)
- [**api.pageplace.de** CIRCUIT SIMULATION METHODS and ALGORITHMS](https://api.pageplace.de/preview/DT0400.9781351460644_A37406679/preview-9781351460644_A37406679.pdf)
- [**scribd.com** PrimeSim HSPICE User Guide Overview | PDF | Spice - Scribd](https://www.scribd.com/document/855571550/Primesim-Hspice-Sa)
- [**scribd.com** The Designer's Guide To Spice and Spectre | PDF - Scribd](https://www.scribd.com/document/768042274/The-Designer-s-Guide-to-Spice-and-Spectre)
- [**epc-co.com** Circuit Simulation Using EPC Device Models](https://epc-co.com/epc/portals/0/epc/documents/product-training/circuit_simulations_using_spice.pdf)
- [**osti.gov** XyceTM Parallel Electronic Simulator - OSTI.GOV](https://www.osti.gov/servlets/purl/1097213)
- [**ruor.uottawa.ca** Improvements in Obreshkov-based High-Order ... - uO Research](https://ruor.uottawa.ca/bitstream/10393/32090/3/Lin_Yaoyao_2015_thesis.pdf)
- [**scispace.com** Numerical Solution of Ordinary Differential Equations - SciSpace](https://scispace.com/pdf/numerical-solution-of-ordinary-differential-equations-2lssco7c5f.pdf)
- [**coaps.fsu.edu** Numerical Methods for Fluid Dynamics - fsu/coaps](https://www.coaps.fsu.edu/pub/eric/OCP5930/Papers/Numerical%20Methods%20for%20GFD%20by%20Durran.pdf)
- [**real.mtak.hu** Practical Aspects of the Richardson Extrapolation](https://real.mtak.hu/72180/1/Practical_Aspects_of_the_Richardson_Extrapolation_final_submitted_u.pdf)
- [**tevza.org** Finite Difference Methods for Ordinary and Partial Differential](http://tevza.org/home/course/modelling-II_2016/books/Leveque%20-%20Finite%20Difference%20Methods.pdf)
- [**truenano.com** 7.5 MOSFET SPICE model](https://truenano.com/PSD20/chapter7/ch7_5.htm)
- [**note.com** SPICE Transient Analysis: A Thorough Explanation of MNA ... - note](https://note.com/sukimaengineer/n/nd77ab03b2f28?hl=en)
- [**course.ece.cmu.edu** MOSFET & SPICE Models](http://course.ece.cmu.edu/~ece322/LECTURES/Lecture17/L17b.PDF)
- [**engineering.purdue.edu** SPICE Version 2G6 User's Guide - Purdue College of Engineering](https://engineering.purdue.edu/~ee255/design_hub_files/References/SpiceManual.pdf)
- [**ece.mcgill.ca** 5.1 Describing MOSFETs To Spice](https://www.ece.mcgill.ca/~grober4/SPICE/SPICE_Decks/1st_Edition/chapter5/Chapter%205%20MOSFETs%20web%20version.html)
- [**scribd.com** Nonlinear Circuit Analysis Techniques | PDF | Spice - Scribd](https://www.scribd.com/document/884645220/Mosfet-Cmos)
- [**youtube.com** MOSFET in SPICE: Scalability and Binning | Dr. Hesham Omran](https://www.youtube.com/watch?v=kkQN4-roUc0)
- [**youtube.com** AMS | 03-07 | How SPICE Works: Modified Nodal Analysis (MNA)](https://www.youtube.com/watch?v=XTcKVCZuuv0)
- [**web.stanford.edu** Star-Hspice Manual - Stanford University](https://web.stanford.edu/class/archive/ee/ee371/ee371.1066/tools/hspice.pdf)
- [**intusoft.com** isspice4 user's guide - volumes 1 and 2 - Intusoft](http://www.intusoft.com/lit/IsSpice4.pdf)
- [**dartec.com** HSPICE Simulation and Analysis User Guide](https://www.dartec.com/MIC4120/SPICE/hspice_sim_analysis.pdf)
- [**engineering.upenn.edu** PSpice Reference Guide - Penn Engineering](https://www.engineering.upenn.edu/~jan/spice/PSpice_ReferenceguideOrCAD.pdf)
- [**nmg.gitlab.io** FFT: fast Fourier transform of vectors -](https://nmg.gitlab.io/ngspice-manual/interactiveinterpreter/commands/fft_fastfouriertransformofvectors.html)
- [**agnd.net** LTspice - agnd.net](https://agnd.net/valpo/341/LTspiceHelpXVII.pdf)
- [**cseweb.ucsd.edu** HSPICE Reference Manual: Commands and Control Options](https://cseweb.ucsd.edu/classes/wi10/cse241a/assign/hspice_cmdref.pdf)
- [**scribd.com** SPICE Circuit Simulation Overview | PDF - Scribd](https://www.scribd.com/document/507263903/spice2001-07)
- [**researchgate.net** 5 Companion model for stamping a nonlinear capacitor.](https://www.researchgate.net/figure/Companion-model-for-stamping-a-nonlinear-capacitor_fig23_4034302)
- [**stackoverflow.com** c++ - Implementing Newton-Raphson Method for Nonlinear Circuit](https://stackoverflow.com/questions/76591098/implementing-newton-raphson-method-for-nonlinear-circuit-simulation-with-diode-components)
- [**academia.edu** (PDF) A Nonlinear Capacitor Model for Use in the PSpice Environment](https://www.academia.edu/32138813/A_Nonlinear_Capacitor_Model_for_Use_in_the_PSpice_Environment)
- [**flooxs.org** Spice Procs — FLOOXS Reference](https://flooxs.org/docs/61f92bdb/proc-Spice.html)
- [**etd.auburn.edu** SPICE model implementation of a quantum phase-slip junction](https://etd.auburn.edu/bitstream/handle/10415/4742/Thesis_final_Uday%20Goteti.pdf?sequence=2&isAllowed=y)
- [**global-sci.com** RLC Equivalent Circuit Synthesis Method for Structure-Preserved](https://www.global-sci.com/cicp/article/download/5520/10978)
- [**ngspice.sourceforge.io** ngspice-manual.pdf](https://ngspice.sourceforge.io/docs/ngspice-manual.pdf)
- [**iee.et.tu-dresden.de** Micro-Cap 12](https://www.iee.et.tu-dresden.de/~jmueller/simulation/soft/microcap/MC12.RefManual.pdf)
- [**scribd.com** rm10 - Manual PDF - Scribd](https://www.scribd.com/document/328495881/rm10-Manual-pdf)
- [**manuals.plus** ngspice user manual - Manuals+](https://manuals.plus/m/13635ef162f01e8321011c4d3cb7d94644da202429dbee8ae35b85d23997a22e)
- [**sas.upenn.edu** Driving Force](https://www.sas.upenn.edu/LabManuals/BBB251/NIA/NEUROLAB/MEMB/ans1.htm)
- [**kolegite.com** A Nonlinear Capacitor Model for Use in the PSpice Environment](https://kolegite.com/EE_library/papers/modeling_and_simulation/nonlinear-capacitor-model_FU_Cadence.pdf)
- [**forum.allaboutcircuits.com** Definition of capacitance in differential charge-voltage terms](https://forum.allaboutcircuits.com/threads/definition-of-capacitance-in-differential-charge-voltage-terms.70477/)
- [**scribd.com** Charge Conservation in Transcapacitance | Capacitance | Capacitor](https://www.scribd.com/document/132867608/00473160)
- [**circuitmath.com** Circuit Analysis Tutorials | CircuitMath](https://circuitmath.com/learn)
- [**github.com** ee-labs/CIRCUIT_ELEMENTS_LAB_PLAN.md at master · reedos/ee](https://github.com/reedos/ee-labs/blob/master/CIRCUIT_ELEMENTS_LAB_PLAN.md)
- [**scribd.com** Circuit Simulator Functions Explained | PDF | Electrical Network](https://www.scribd.com/document/533755473/ams-lec-03-simulator-v01)
- [**zealpolytechnic.com** Electrical Circuit Analysis & Network Theory - Zeal Polytechnic Pune](https://zealpolytechnic.com/wp-content/uploads/2023/04/Electrical-Circuit-Analysis-Network-Theory.pdf)
- [**hvg.ece.concordia.ca** A Tool for Modeling and Analysis of Electronic Circuits and Systems](https://hvg.ece.concordia.ca/Publications/TECH_REP/TMAAC_TR12/TMAAC_TR12.pdf)
- [**joeydelp.github.io** Technical Discussion - JoSIM Documentation](https://joeydelp.github.io/JoSIM/tech_disc/)
- [**dr.lib.iastate.edu** Transient analysis for symbolic simulation of large scale networks](https://dr.lib.iastate.edu/bitstreams/c1b28c1d-9aa5-44d3-8860-083fd7aac9d2/download)
- [**web.engr.oregonstate.edu** ECE 521 - College of Engineering | Oregon State University](https://web.engr.oregonstate.edu/~karti/ece521/Lectures.pdf)
- [**help.simetrix.co.uk** Simulator Reference: DC Operating Point Algorithms - SIMetrix](https://help.simetrix.co.uk/8.0/simetrix/mergedProjects/simulator_reference/topics/simref_convergence_accuracyandperformance_dcoperatingpointalgorithms.htm)
- [**youspice.com** Quick Solutions to Solve SPICE Convergence Issues. - YouSpice](https://youspice.com/quick-solutions-to-solve-spice-convergence-issues/)
