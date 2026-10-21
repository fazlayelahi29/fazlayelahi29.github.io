# Finite Impulse Response (IIR) Filter Design in Digital Signal Processing using Python 

## PROBLEM 1: CHARACTERIZATION AND SIMULATION OF A THREE-POINT MOVING AVERAGE FIR FILTER

### 1. PROBLEM STATEMENT

**GIVEN:** An assortment of technical manuals pertaining to digital signal filtering applications, within which a specific requirement for temporal data smoothing is outlined. The stipulated methodology for this smoothing application is the integration of a Moving Average filter. The general algebraic relationship dictating the behavior of an $M$-point moving average filter between the system input $x[n]$ and system output $y[n]$ is firmly established as $y[n] = \frac{1}{M} \sum_{k=0}^{M-1} x[n-k]$. The operational constraint demands that the filter structure be explicitly configured as a three-point averaging system, forcing the crucial parameter $M = 3$. Substituting this integer value into the foundational relationship produces the definitive discrete-time difference equation to be utilized: $y[n] = \frac{1}{3}x[n] + \frac{1}{3}x[n-1] + \frac{1}{3}x[n-2]$.

  

**REQUIRED:** The rigorous conceptual formulation, algorithmic design, and programmatic implementation of a Python computational routine to evaluate the specified three-point moving average filter. The generated simulation must numerically process the feedforward difference equation and sequentially extract four analytical evaluations: the time-domain impulse response graph, the logarithmic magnitude response graph, the Z-domain pole-zero coordinate mapping, and the frequency-domain phase rotation map. The methodology must emphatically highlight the architectural characteristics of finite duration output and intrinsic system stability.

  

### 2. CONCEPTUAL THEORY

The analysis of the requested moving average system requires a foundational understanding of the alternative structural classification of digital filters: the Finite Impulse Response (FIR) architecture. In direct contrast to the Infinite Impulse Response (IIR) systems discussed previously, FIR filters possess an architecture entirely devoid of internal algorithmic feedback. The computation of an FIR system's output depends strictly on a mathematically weighted summation of the current input sample and a finite, specified number of previous input samples.

  

Because the output is exclusively a function of independent feedforward inputs, the system is fundamentally guaranteed to possess absolute stability. If an FIR filter is struck by a transient impulse, the non-zero values will propagate deterministically through the finite delay stages and then definitively cease. The impulse response will inevitably settle to absolute zero after a strictly defined amount of time.

  

The most ubiquitous and fundamental embodiment of the FIR architecture is the moving average filter. The mathematical objective of a moving average filter is to compute the unweighted arithmetic mean of a sliding window of sequential data points. By mathematically averaging adjacent temporal samples, transient high-frequency noise spikes are smoothed out and diminished, while the underlying low-frequency trends are preserved and passed through the system. Consequently, the moving average filter operates as a highly primitive, albeit structurally simple, low-pass digital filter.

  

The generic structural framework of an $M$-point moving average filter is governed by the linear convolution equation:

  

$$y[n] = \frac{1}{M} \sum_{k=0}^{M-1} x[n-k]$$

  

The parameter $M$ dictates the strict integer length of the sliding computational window. For this specific analytical requirement, the window length is constrained to $M=3$. This parameter forces the expansion of the summation series into exactly three distinct mathematical terms:

  

$$y[n] = \frac{1}{3}x[n] + \frac{1}{3}x[n-1] + \frac{1}{3}x[n-2]$$

  

To fully comprehend the frequency characteristics and stability of this specific difference equation, it must be mapped from the discrete-time domain into the complex-frequency Z-domain. The absolute linearity of the Z-transform permits each time-shifted input sequence, $x[n-k]$, to be algebraically mapped to $z^{-k}X(z)$. Applying this transform to the three-point expanded equation yields the Z-domain representation:

  

$$Y(z) = \frac{1}{3}X(z) + \frac{1}{3}z^{-1}X(z) + \frac{1}{3}z^{-2}X(z)$$

The transfer function $H(z)$, defined systematically as the ratio of output $Y(z)$ to input $X(z)$, is algebraically isolated:

  

$$H(z) = \frac{Y(z)}{X(z)} = \frac{1}{3}(1 + z^{-1} + z^{-2})$$

When expressed as a formal rational fraction for standard pole-zero analysis, the system function is strictly defined as:

  

$$H(z) = \frac{1/3 + 1/3 z^{-1} + 1/3 z^{-2}}{1}$$

This mathematical architecture is critical. The denominator polynomial consists entirely of the scalar $1$, meaning the system possesses zero finite poles located outside the absolute origin of the Z-plane. All mathematical poles are located identically at $z=0$. Because a system's stability is completely dependent on all poles remaining strictly within the unit circle (radius $< 1$), the absolute centralization of the moving average poles at radius $= 0$ mathematically guarantees inherent, unconditional, and irrevocable Bounded-Input Bounded-Output (BIBO) stability.

  

Furthermore, the numerator polynomial will yield two finite zeros strategically located upon the complex unit circle. These zeros enforce deep mathematical nulls—points of absolute signal rejection—at specific high-frequency intervals within the magnitude response. This behavior confirms the operational classification of the FIR moving average system as a stable, frequency-selective smoothing entity, dictating the required configuration for the computational simulation.

  

### 3. ALGORITHM DESIGN

The translation of the three-point moving average mathematical framework into an executable computational model demands a sequence of rigid procedural steps. The fundamental logic pathway mirrors the analysis of sequential digital systems but mandates critical alterations to the polynomial coefficient definitions to accurately reflect the strict feedforward architecture.

  

1. **Computational Library Provisioning:** The Python operational environment must be fortified with the necessary libraries. The arrays require the `numpy` infrastructure, the linear convolutions demand `scipy.signal`, the algebraic root mapping necessitates `control`, and the multidimensional plotting relies upon `matplotlib.pyplot`.
    
      
    
2. **Input Vector Instantiation:** An idealized discrete-time stimulus must be synthesized to perturb the digital system. A computational array is defined consisting of exactly thirty zero-valued indices. To emulate a theoretically perfect transient impulse, the zero-th index integer of the array is forcefully modified to a value of $1$.
    
      
    
3. **FIR Coefficient Architecture Configuration:** The structural essence of the three-point moving average difference equation must be encoded into array format.
    
      
    - The feedforward numerator polynomial coefficients are extracted from the equation $y[n] = \frac{1}{3}x[n] + \frac{1}{3}x[n-1] + \frac{1}{3}x[n-2]$. An array `num` is allocated containing the three successive scalar weights: $[1/3, 1/3, 1/3]$.
        
          
        
    - The feedback denominator polynomial, reflecting the absolute absence of IIR recursion, is strictly constrained to a singular scalar weight of $1$. An array `den` is allocated containing solely $[1]$.
        
          
        
4. **Sampling Framework Specification:** A theoretical base sampling frequency of $f_s = 100\text{ Hz}$ is computationally declared. This scalar acts as the mathematical anchor required to later scale the normalized frequency evaluations into physically relevant Hertz.
    
      
    
5. **Digital Convolution Execution:** The discrete temporal input array and the meticulously structured coefficient arrays are routed into a linear filtering sub-routine. Because the denominator array contains only a solitary $1$, the algorithmic solver bypasses any recursive feedback loops and executes a pure finite convolution sequence. The resulting finite duration output array is stored in memory as the time-domain impulse response.
    
      
    
6. **Complex Z-Plane Sweeping:** The identical coefficient arrays are routed into a discrete Fourier evaluation sub-routine. The algorithm sequentially sweeps the mathematical boundary of the Z-plane unit circle, generating an array of normalized angular frequencies alongside a corresponding array of complex magnitude and phase vectors.
    
      
    
7. **System Object Registration:** A formalized discrete-time control system object is registered within the computational memory using the arrays. This step strictly prepares the mathematical data structures for specialized root locus factorization.
    
      
    
8. **Graphical Rendering Sequence:** A partitioned quad-plot visual canvas is instantiated to systematically display the data arrays.
    
      
    - **Phase 8.1:** The computed impulse response array is rendered as a discrete stem plot to visually confirm the fundamental finite duration behavior of the FIR system.
        
          
        
    - **Phase 8.2:** The absolute linear magnitude of the complex frequency array is calculated, logarithmically scaled into Decibels, and plotted against the scaled continuous-time frequency axis.
        
          
        
    - **Phase 8.3:** The root mapping algorithm evaluates the registered system object, factorizing the numerator zeros and denominator poles, and graphically plotting their absolute geometric coordinates atop a standardized Z-plane grid.
        
          
        
    - **Phase 8.4:** The purely angular rotation data is computationally decoupled from the complex frequency response array and plotted sequentially to verify the phase characteristics of the system.
        
          
        

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
import control as ct

x = np.zeros(30)
x[0] = 1
num = [1/3, 1/3, 1/3]
den = [1]
fs = 100
h = signal.lfilter(num, den, x)
w, H = signal.freqz(num, den)
sys = ct.tf(num, den, dt=True)
plt.figure(figsize=(10, 8))

plt.subplot(2, 2, 1)
plt.stem(h)
plt.xlabel('n')
plt.ylabel('h[n]')
plt.title('Impulse Response (Unit Step)')
plt.grid(linestyle=':')

plt.subplot(2, 2, 2)
plt.plot((w / np.pi) * fs / 2, 20 * np.log10(np.abs(H)))
plt.xlabel('Normalized Frequency (rad/sample)')
plt.ylabel('Magnitude (dB)')
plt.title('Magnitude Response (Low-Pass)')
plt.grid(linestyle=':')

plt.subplot(2, 2, 3)
ct.pzmap(sys, title=False, marker_size=10)

plt.subplot(2, 2, 4)
plt.plot((w / np.pi) * fs / 2, np.angle(H))
plt.xlabel('Normalized Frequency (rad/sample)')
plt.ylabel('Phase (Radians)')
plt.title('Phase Response')
plt.grid(linestyle=':')
plt.tight_layout()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The generated computational script executes the precise formulation of the three-point moving average FIR mathematical model. Every structural command is intricately linked to the underlying feedforward filter theory.

  

The environment is systematically prepared by integrating fundamental computational toolsets. `numpy` is designated for multidimensional array synthesis, `matplotlib.pyplot` is secured for high-level data visualization, `scipy.signal` is tasked with performing advanced time and frequency domain algorithmic processing, and `control` provides the rigid computational framework required to map complex polynomials.

  

The simulated physical input signal is rigidly established via `x = np.zeros(30)`. This command dictates the creation of a thirty-element linear array, representing a discrete block of temporal sample points. The assignment `x[0] = 1` mathematically corrupts the initial zero state, fabricating an idealized, singular impulse designed to violently perturb the digital filter structure and force an observable response.

  

The critical parameterization of the FIR system relies entirely on the formulation of the polynomial arrays. The command `num = [1/3, 1/3, 1/3]` rigorously maps the three independent scalar weights dictated by the mathematical model ($1/3$ applied to the current input, $1/3$ applied to the first delay, and $1/3$ applied to the second delay). Crucially, the command `den = [1]` explicitly informs the underlying computational engine that there is absolutely zero recursive feedback in the difference equation. This mathematically defines the system as Finite Impulse Response. The parameter `fs = 100` establishes the foundational sampling frequency metric.

  

The temporal evaluation of the difference equation is executed unconditionally by `h = signal.lfilter(num, den, x)`. The `lfilter` algorithm receives the feedforward coefficients, detects the absolute absence of feedback coefficients, and shifts its internal processing mechanism into a purely linear convolution mode. The algorithm sequentially slides the $1/3$ weighting window across the impulse array. The output array `h` will predictably display three consecutive values of $1/3$, followed immediately and forever by absolute zeros, definitively proving the inherent stability and finite duration of the FIR architecture.

  

The spectral evaluation of the system is forced by `w, H = signal.freqz(num, den)`. This algorithmic routine bypasses time-domain simulation entirely, directly calculating the Discrete-Time Fourier Transform by factoring the rational polynomial structure along the Z-plane perimeter. The dual outputs are synchronized strictly: `w` holds the normalized radians per sample, while `H` retains the raw complex numerical outputs signifying continuous amplitude scaling and phase shift.

  

To execute the root-locus mapping, a discrete time-invariant transfer function model is explicitly registered within the system memory using `sys = ct.tf(num, den, dt=True)`. This encapsulates the coefficient lists into a formalized control object necessary for complex-plane geometry solvers.

  

The visualization sequence immediately launches a structured graphical canvas via `plt.figure(figsize=(10, 8))`. The display is fractured into four independent, precisely scaled viewports utilizing `plt.subplot(2, 2, n)`.

  

Within the primary viewport, `plt.stem(h)` visually maps the calculated impulse sequence. The stem markers clearly define the discrete nature of the data, visually reinforcing the mathematically finite decay of the moving average filter down to absolute zero. The string `plt.title('Impulse Response (Unit Step)')` is rigorously applied to mirror the exact textual idiosyncrasies of the specific operational directive, preserving absolute fidelity to the provided source code structure.

  

Within the secondary viewport, the frequency discrimination characteristic is graphed. `np.abs(H)` algorithms strip away all complex angular data, isolating pure amplitude ratios. These ratios are violently compressed into standard logarithmic decibels using `20 * np.log10(...)`. The graphical presentation unmistakably visualizes the deep frequency nulls corresponding directly to the algorithmic smoothing behavior.

  

Within the tertiary viewport, `ct.pzmap(sys, title=False, marker_size=10)` aggressively factorizes the formalized system model. The mapping algorithm discovers two finite zeros positioned meticulously on the perimeter of the unit circle, confirming the locations of total high-frequency rejection. The algorithm also confirms all poles are clustered precisely at the absolute spatial origin of the unit circle, verifying unconditional topological stability.

  

Within the final viewport, `np.angle(H)` isolates the rotational shift applied to passing frequencies. The resulting plot demonstrates the strictly linear phase shift intrinsic to symmetrical FIR architectures, guaranteeing that passing signal components are equally delayed in time without undergoing spatial distortion. The script cleanly terminates processing with `plt.tight_layout()`, preventing spatial collisions between the graphical components.

  

## PROBLEM 2: DESIGN AND ANALYSIS OF A TWO-POLE DIGITAL RESONATOR FILTER

### 1. PROBLEM STATEMENT

**GIVEN:** Complex technical specifications for a highly specialized class of frequency-selective systems known as digital resonators. A digital resonator is structurally defined as a two-pole discrete-time bandpass filter engineered to exhibit a dominant, high-magnitude peak at a very specific target resonant frequency. The generalized transfer function is mathematically defined by two strategically placed complex conjugate poles $p_1$ and $p_2$, yielding $H(z) = \frac{1}{(1-p_1 z^{-1})(1-p_2 z^{-1})}$. The poles are positioned in the complex plane at polar coordinates $p_1 = re^{j\omega_r}$ and $p_2 = re^{-j\omega_r}$, where $r$ is the spatial distance from the origin ($0 < r < 1$) and $\omega_r$ is the normalized angular resonant frequency. Utilizing Euler's rigorous mathematical formula, the operational transfer function is expanded to real coefficients: $H(z) = \frac{1}{1 - 2r\cos(\omega_r)z^{-1} + r^2 z^{-2}}$. The specific physical parameters mandated for this simulation are a pole radius of $r = 0.90$, a continuous-time sampling frequency of $f_s = 100\text{ Hz}$, and a targeted cutoff/resonant frequency of $f_c = 10\text{ Hz}$.

  

**REQUIRED:** The rigorous mathematical expansion and computational implementation of a Python script designed to simulate and analyze the specified $r = 0.90$ digital resonator system. The algorithm must independently calculate the correct trigonometric feedback coefficients based on the mandated input parameters. The simulation must sequentially process the designed system to produce and plot four critical technical evaluations: the damped oscillatory impulse response, the peaked narrow-band magnitude response, the complex conjugate pole-zero map, and the non-linear phase response.

  

### 2. CONCEPTUAL THEORY

To systematically construct a digital resonator, the principles of advanced discrete-time Infinite Impulse Response (IIR) filtering must be applied specifically to second-order systems. While a first-order system (containing one mathematical pole) is fundamentally restricted to rudimentary low-pass or high-pass behaviors, a second-order system (containing two mathematical poles) unlocks the capability to selectively isolate and amplify specific, narrow bands of frequencies. This behavior is termed resonance.

  

Digital resonators are frequently deployed in critical communication receivers and demodulation circuits where a solitary, target frequency must be aggressively extracted from a broad spectrum of ambient noise. The defining characteristic of a resonant filter is a transfer function magnitude response that exhibits a sharp, aggressively peaking maximum located exactly at the desired resonant frequency.

  

The mathematical topology required to generate this resonant peak necessitates the highly precise placement of two feedback poles within the complex Z-plane. To ensure that the difference equation operates entirely on real numerical values (a physical requirement for standard computational audio and data processing), any complex pole positioned in the positive frequency plane must be mathematically counterbalanced by an identical complex conjugate pole positioned symmetrically in the negative frequency plane.

  

These complex conjugate poles are defined mathematically in polar form as:

  

$$p_1 = re^{j\omega_r}$$

  

$$p_2 = re^{-j\omega_r}$$

  

The geometric parameters $r$ and $\omega_r$ dictate the entire physical behavior of the filter.

  

- The angular parameter $\omega_r$ represents the normalized angular frequency (measured in discrete radians per sample). It geometrically defines the angle of the pole relative to the real axis. This angle dictates the exact center frequency where the resonator will exhibit its maximum magnitude peak.
    
      
    
- The radial parameter $r$ represents the absolute distance of the pole from the mathematical origin $(0,0)$. This distance dictates the sharpness or selectivity of the resonator. As $r$ approaches the unit circle boundary ($r \rightarrow 1$), the resonant peak becomes infinitely sharp and narrow. However, if $r \ge 1$, the poles exit the unit circle, destroying system stability and forcing the filter into uncontrolled, infinite oscillation. Therefore, stable operation mandates $0 < r < 1$.
    
      
    

The fundamental rational transfer function for this two-pole topology is expressed by multiplying the individual pole factors:

  

$$H(z) = \frac{1}{(1-p_1 z^{-1})(1-p_2 z^{-1})}$$

  

To translate this conceptual transfer function into a set of executable coefficients for a computational difference equation, the complex polar definitions are substituted into the denominator:

  

$$H(z) = \frac{1}{1 - (p_1 + p_2)z^{-1} + (p_1 p_2)z^{-2}}$$

By applying Euler's rigorous identity, which states that $e^{j\theta} = \cos(\theta) + j\sin(\theta)$, the complex summations and multiplications reduce strictly to real-valued trigonometric terms. The summation $(p_1 + p_2)$ simplifies mathematically to $2r\cos(\omega_r)$, and the product $(p_1 p_2)$ simplifies exactly to $r^2$. The final, computationally actionable transfer function is thereby derived:

  

$$H(z) = \frac{1}{1 - 2r\cos(\omega_r)z^{-1} + r^2 z^{-2}}$$

  

Based on the operational parameters specified, the pole radius is rigidly set to $r = 0.90$. This value places the poles extremely close to the unit circle, mathematically ensuring a narrow, highly selective frequency peak while maintaining system stability. The target resonant physical frequency is $f_c = 10\text{ Hz}$ operating at a sampling rate of $f_s = 100\text{ Hz}$. The continuous frequency must be converted to the normalized angular parameter $\omega_r$ prior to coefficient generation.

  

When this precisely calibrated system is subjected to a transient unit impulse, the close proximity of the poles to the unit circle forces the mathematical difference equation to generate a sinusoidal oscillation that slowly decays over time. This damped, oscillating time-domain response physically proves the highly frequency-selective nature of the resonant structural topology. The computational algorithm must dynamically calculate these trigonometric transformations to accurately simulate the system.

  

### 3. ALGORITHM DESIGN

The programmatic simulation of the two-pole digital resonator requires an algorithmic sequence that actively calculates mathematical coefficients dynamically based on physical input parameters, diverging from the static coefficient declaration seen in simpler filter models.

  

1. **Computational Subsystem Activation:** The foundational numerical and visualization modules must be imported. `numpy` is required for array instantiation and trigonometric scalar evaluations. `scipy.signal` provides the recursive convolution engines. `control` grants specialized pole-zero locus mapping algorithms. `matplotlib.pyplot` is leveraged for multidimensional graphing operations.
    
      
    
2. **Impulse Array Allocation:** An extended temporal input array is required to properly visualize the extended ringing characteristics of a highly resonant filter. A computational array is defined consisting of exactly fifty zero-valued indices. The initial index at coordinate zero is mathematically inverted to a value of $1$, forming the discrete-time impulse.
    
      
    
3. **Physical Parameter Declaration:** The strict physical attributes governing the resonator are defined within the memory space. The pole radius is explicitly declared as $r = 0.90$. The system sampling frequency is declared as $f_s = 100\text{ Hz}$. The intended peak cutoff frequency is established as $f_c = 10\text{ Hz}$.
    
      
    
4. **Angular Frequency Normalization:** The continuous-time frequency parameters must be transformed into the normalized discrete domain. The algorithm calculates the normalized angular resonant frequency utilizing the algebraic ratio: $\omega = 2\pi(f_c/f_s)$.
    
      
    
5. **Dynamic Coefficient Synthesis:** The feedforward and feedback difference equation multipliers are dynamically generated using the derived transfer function rules.
    
      
    - The numerator feedforward coefficient array `num` is allocated with a static singular value of $[1]$.
        
          
        
    - The denominator feedback coefficient array `den` is calculated using the parameters $r$ and the computed angle $\omega$. The array is populated sequentially with the values $[1, -2r\cos(\omega), r^2]$, completing the computational model.
        
          
        
6. **Recursive Simulation Execution:** The extended impulse array and the dynamically synthesized trigonometric coefficient arrays are passed into the linear filtering solver. The solver engages the second-order recursive feedback loop, iteratively processing the damped oscillations and outputting the final time-domain impulse response array.
    
      
    
7. **Z-Domain Frequency Evaluation:** The polynomial coefficient arrays are analyzed by a discrete Fourier evaluation algorithm. The solver sweeps the complete perimeter of the Z-plane, calculating the corresponding complex numerical magnitude and phase rotational data at every distinct frequency interval.
    
      
    
8. **Control System Formalization:** The dynamically generated coefficient lists are packaged into a formally defined discrete-time control system object, mathematically preparing the dataset for complex root factorization.
    
      
    
9. **Visualization Plotting Sequence:** A four-quadrant graphical canvas is rendered to display the extracted system behaviors.
    
      
    - **Execution 9.1:** The computed oscillating impulse response array is plotted using discrete stem markers to clearly visualize the slowly decaying sinusoidal characteristics.
        
          
        
    - **Execution 9.2:** The absolute linear magnitude is extracted from the complex frequency data, converted mathematically to logarithmic decibels, and plotted. The algorithm visualizes the highly selective, narrow bandwidth peak located exactly at the calculated target frequency.
        
          
        
    - **Execution 9.3:** The control system object is analyzed by the Z-plane mapping routine. The solver calculates and geographically plots the two complex conjugate poles residing symmetrically at radius $0.90$, visually proving system stability.
        
          
        
    - **Execution 9.4:** The purely rotational phase angle data is decoupled from the complex array and plotted across the frequency axis, demonstrating the mathematically non-linear phase delay inherent to resonant IIR feedback topologies.
        
          
        

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
import control as ct

x = np.zeros(50)
x[0] = 1
r = 0.9
fs = 100 # Sampling frequency
fc = 10 # Cutoff frequency
w = 2*np.pi*(fc/fs)
num = [1]
den = [1, -2*r*np.cos(w), r**2]
h = signal.lfilter(num, den, x)
w_freq, H = signal.freqz(num, den)
sys = ct.tf(num, den, dt=True)
plt.figure(figsize=(10, 8))

plt.subplot(2, 2, 1)
plt.stem(h)
plt.xlabel('n')
plt.ylabel('h[n]')
plt.title('Impulse Response (Unit Step)')
plt.grid(linestyle=':')

plt.subplot(2, 2, 2)
plt.plot((w_freq / np.pi) * fs / 2, 20 * np.log10(np.abs(H)))
plt.xlabel('Normalized Frequency (rad/sample)')
plt.ylabel('Magnitude (dB)')
plt.title('Magnitude Response (Low-Pass)')
plt.grid(linestyle=':')

plt.subplot(2, 2, 3)
ct.pzmap(sys, title=False, marker_size=10)

plt.subplot(2, 2, 4)
plt.plot((w_freq / np.pi) * fs / 2, np.angle(H))
plt.xlabel('Normalized Frequency (rad/sample)')
plt.ylabel('Phase (Radians)')
plt.title('Phase Response')
plt.grid(linestyle=':')
plt.tight_layout()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The advanced computational sequence is engineered to dynamically translate raw physical filter constraints into complex mathematical coefficients, processing them through a rigid recursive algorithm.

  

The software architecture is immediately structured by the importation of specialized computational modules. `numpy` is initiated to handle arrays and execute high-level trigonometric calculations. `scipy.signal` is loaded to provide optimized digital difference equation solvers and frequency evaluation routines. `control` is imported to facilitate absolute Z-domain complex geometry plotting. `matplotlib.pyplot` is commanded to manage the rigorous visual plotting requirements.

  

The simulation vector is systematically defined using `x = np.zeros(50)`. This dictates an expanded discrete time window comprising exactly fifty empty samples. This extended frame is deliberately required because highly resonant systems exhibit extended temporal ringing; a shorter frame would prematurely truncate the data. The command `x[0] = 1` forces a singularity at the origin, perfectly defining the discrete impulse trigger.

  

The physical attributes of the desired resonator are explicitly injected into the memory logic. The variable `r = 0.9` dictates the aggressive pole radius. The variable `fs = 100` establishes the fundamental system sampling clock. The variable `fc = 10` sets the specific continuous-time frequency targeted for maximum amplification.

  

The continuous target frequency is mathematically translated into the discrete spatial domain via `w = 2*np.pi*(fc/fs)`. This algorithmic conversion is critical because discrete-time solvers operate exclusively on normalized angular geometry (radians per sample) rather than temporal physics. The result is stored as the fundamental angle `w`.

  

The core system polynomials are constructed dynamically. The command `num = [1]` assigns an absolute lack of feedforward zeros. The command `den = [1, -2*r*np.cos(w), r**2]` meticulously executes the derived Euler formula mapping. The solver computes the cosine of the normalized angle `w`, applies the specified radius `r`, and builds a rigid, real-numbered three-element array representing the second-order recursive feedback loops.

  

The primary temporal computation is executed via `h = signal.lfilter(num, den, x)`. The `lfilter` routine interprets the dynamically calculated `den` array. Recognizing the existence of advanced delay indices, the algorithm enters a recursive feedback mode. It aggressively churns the transient input signal against the trigonometric coefficients. The mathematical result perfectly simulates a damped oscillator, producing an extended output array `h` that slowly decays over fifty time steps, physically proving the resonant nature of the structure.

  

The complex spectral evaluation is isolated and executed by `w_freq, H = signal.freqz(num, den)`. To avoid variable namespace collisions with the structural angle `w`, the frequency evaluation array is formally assigned to `w_freq`. The `freqz` algorithm calculates the Discrete-Time Fourier Transform, outputting raw angular positions against complex magnitude variables, stored tightly in `H`.

  

The system mapping protocol requires a formalized object, achieved through `sys = ct.tf(num, den, dt=True)`. This encapsulates the dynamic real-coefficient arrays into a structured representation formatted for strict topological analysis.

  

The computational framework triggers a four-part visualization grid matrix via `plt.figure(figsize=(10, 8))` and recursive calls to `plt.subplot(2, 2, n)`.

  

In the primary quadrant, `plt.stem(h)` rigorously plots the time-domain data. The stem architecture cleanly renders the decaying sinusoidal oscillation provoked by the impulse trigger. The visual output unambiguously confirms the structural characteristics of frequency-selective IIR elements. The explicit string `plt.title('Impulse Response (Unit Step)')` is mathematically incorrect given the impulsive nature of the input, yet it is rigidly transcribed exactly as dictated by the provided reference framework.

  

In the secondary quadrant, `np.abs(H)` isolates the pure scalar ratios from the complex evaluation. The arrays are subjected to `20 * np.log10(...)` to translate the linear amplitudes into standardized decibels. The plot explicitly visualizes a sharp, narrow mathematical peak situated exactly at the $10\text{ Hz}$ target mark, definitively proving the algorithmic execution of the bandpass design objective. The title `plt.title('Magnitude Response (Low-Pass)')` is again transcribed identically from the source documentation despite the overt bandpass nature of the generated data.

  

In the tertiary quadrant, `ct.pzmap(sys, title=False, marker_size=10)` systematically evaluates the formatted control object. The algorithm factors the trigonometric denominator and graphically plots two distinct complex conjugate poles. The visual rendering proves that the poles reside precisely symmetrical to the horizontal real axis, spaced identically at the calculated angle, and located extremely close to, but safely inside, the unit circle (radius $0.90$). This absolute positioning confirms both the high selectivity and the maintained stability of the structural layout.

  

In the final quadrant, the command `np.angle(H)` strips out the complex rotational components and plots the phase delay. The graphical output visually confirms the non-linear phase characteristics associated with second-order recursive systems, definitively demonstrating that incoming frequency components undergo unequal temporal delays as they are passed through the steep mathematical gradients surrounding the resonant peak. The program ceases execution by commanding `plt.tight_layout()`, ensuring total spatial cohesion across the generated scientific interfaces. 


## PROBLEM 3: DESIGN AND IMPLEMENTATION OF A FINITE IMPULSE RESPONSE (FIR) LOW-PASS FILTER USING THE BLACKMAN WINDOW METHOD

### 1. PROBLEM STATEMENT

**GIVEN:** An engineering requirement to design a digital Finite Impulse Response (FIR) low-pass filter operating under a specific set of frequency and attenuation constraints. The discrete-time system operates with a sampling frequency of $8000\text{ Hz}$. The frequency response of the desired filter must exhibit a passband edge frequency of $1500\text{ Hz}$. The transition band, which separates the passband from the stopband, must possess a width of $500\text{ Hz}$. Furthermore, the minimum allowable stopband attenuation for this filter design is specified strictly as strictly greater than $50\text{ dB}$. Based on these rigid spectral parameters, the Blackman window function is explicitly selected to synthesize the filter coefficients.

  

**REQUIRED:** A comprehensive computational script must be developed using the Python programming language and the `scipy.signal` library to calculate the optimal filter order, determine the ideal cutoff frequency, and compute the FIR filter coefficients. The mathematical outputs must be utilized to calculate the frequency response of the designed filter. Finally, the magnitude response in decibels (dB) and the unwrapped phase response in degrees must be visualized through two-dimensional plots to verify that the attenuation and phase linearity requirements are completely satisfied.

  

### 2. CONCEPTUAL THEORY

To fully comprehend the mechanisms of digital filter design, the foundational principles of discrete-time signal processing must be established from their absolute origins. Signals in the physical world are continuous in both time and amplitude. To process these signals computationally, they must be digitized through a process called sampling, where continuous-time measurements are captured at regular intervals. The rate at which these samples are captured is defined as the sampling frequency, denoted mathematically as $F_s$.

  

When a discrete-time signal is processed, it is frequently necessary to isolate certain frequency components while suppressing others. This isolation process is known as filtering. Digital filters are broadly categorized into two primary architectures based on the duration of their impulse response: Infinite Impulse Response (IIR) filters and Finite Impulse Response (FIR) filters. FIR filters are defined by an impulse response that exists for a finite number of samples. The fundamental equation defining an FIR filter relies on a sequence of coefficients denoted as $h[n]$, where $n$ represents the discrete sample index. The filter length is commonly defined as $M+1$, where $M$ represents the filter order. One of the most defining and advantageous characteristics of FIR filters is their ability to maintain an exactly linear phase response. A linear phase response ensures that all frequency components passing through the filter experience the exact same temporal delay, thereby preventing any phase distortion in the processed waveform.

  

The design of an FIR filter mathematically originates in the frequency domain. An ideal low-pass filter is designed to perfectly transmit all frequencies up to a designated cutoff frequency, $\omega_c$, while perfectly and instantaneously blocking all frequencies above that threshold. The frequency response of an ideal behavior is commonly denoted with a subscript 'D', representing the desired response, $H_D(\omega)$. For an ideal low-pass filter, the normalized frequency response is defined as unity ($1$) for frequencies between $0$ and $\omega_c$, and zero ($0$) for frequencies between $\omega_c$ and the Nyquist limit ($\pi$).

  

To implement this ideal frequency domain specification in the time domain, the Inverse Discrete-Time Fourier Transform (IDTFT) is mathematically applied to the desired frequency response. The IDTFT operation yields the discrete-time impulse response, denoted as $h_D[n]$. The computation of this integral for an ideal low-pass filter yields a sinc function. The fundamental physical problem with the ideal impulse response is two-fold. First, it is an infinite duration signal, extending from negative infinity to positive infinity. Second, it is non-causal, meaning it requires future knowledge of the signal to compute the present output, which is physically impossible to realize in real-time systems.

  

To create a physically realizable and causal filter, the infinite impulse response must be truncated. An obvious mathematical solution is to abruptly cut off the filter coefficients beyond a certain index, shifting them to establish causality. However, abruptly truncating an infinite sequence in the time domain causes severe anomalies in the frequency domain. This truncation manifests as undesirable ripples and overshoots in both the passband and the stopband of the filter's frequency response. This physical manifestation is formally known as the Gibbs phenomenon.

  

To eliminate these abrupt discontinuities and mitigate the Gibbs oscillation, the Windowing Method is deployed. Instead of abruptly truncating the ideal impulse response, a mathematically symmetrical window function, denoted as $w[n]$, is applied. The window function smoothly weights the desired FIR coefficients, tapering them down to zero at both extreme ends of the sequence. The final, realizable filter coefficients, $h_w[n]$, are obtained by mathematically multiplying the ideal impulse response by the selected window function:

  

$$h_w[n]=h_D[n]w[n]$$

.

  

Various window functions exist, each offering a unique mathematical trade-off between the width of the main lobe (which dictates the transition band width) and the amplitude of the sidelobes (which dictates the stopband attenuation). The specific window is selected based entirely on the attenuation requirements of the system. For a filter requiring a stopband attenuation greater than $50\text{ dB}$, simpler windows like the Rectangular or Hanning window are mathematically insufficient. The Blackman window is specifically optimized to provide exceedingly high stopband attenuation. The mathematical expression for the Blackman window function is defined as:

  

$$w_{bla}[n]=0.42-0.5\cos\left(\frac{2\pi n}{M}\right)+0.08\cos\left(\frac{4\pi n}{M}\right)$$

. This specific cosine-summation formulation guarantees a peak sidelobe attenuation of $-57\text{ dB}$ and an overall stopband attenuation reaching $-74\text{ dB}$.

  

Because the windowing process inherently alters the frequency edges, an empirical formula is utilized to calculate the required filter order $M$ based on the transition width ($\Delta f$) and the sampling frequency ($F_s$). For the Blackman window, the relationship is closely approximated by $M \approx 6 \times (F_s / \Delta f)$. Furthermore, the ideal cutoff frequency $F_c$ supplied to the synthesis algorithm must be situated directly in the center of the transition band. This compensated cutoff frequency is calculated by adding half of the transition width to the passband edge frequency.

  

### 3. ALGORITHM DESIGN

To translate the mathematical theory of digital filter design into a functional, executable computational program, a rigorous, step-by-step algorithmic blueprint must be established. This logic flow dictates the exact sequential processing required to generate the correct filter coefficients.

  

1. **Library Importation:** The algorithm must begin by loading all necessary external computational libraries. A mathematical library is required for numerical array processing and continuous variable manipulation. A plotting library is required for the visual rendering of the frequency domain data. Finally, a specialized signal processing library is required to execute the windowing functions and discrete-time transforms.
    
      
    
2. **Spectral Parameter Initialization:** The raw physical constraints supplied in the problem statement must be stored as discrete floating-point variables in memory. The sampling frequency ($F_s$), transition width ($TW$), and passband edge frequency ($PBE$) must be explicitly defined.
    
      
    
3. **Filter Order Computation:** The optimal integer order of the filter, $M$, must be calculated. This is achieved by taking the product of a constant factor ($6$) and the sampling frequency ($F_s$), dividing this product by the transition width ($TW$), and rounding the floating-point result to the nearest whole integer.
    
      
    
4. **Filter Length Determination:** Because digital sequences begin at an index of zero, the total number of coefficients (often referred to as taps) required for the array is computed by adding one to the calculated filter order ($M+1$).
    
      
    
5. **Cutoff Frequency Compensation:** The ideal structural cutoff frequency, $F_c$, must be calculated. The transition width must be divided by two, and this result must be appended mathematically to the defined passband edge frequency ($PBE$).
    
      
    
6. **Coefficient Synthesis via Blackman Window:** A function specialized for FIR window design must be invoked. The computed filter length, the compensated cutoff frequency, the string identifier for the Blackman window, the specific designation of a low-pass filter topology, and the sampling frequency must all be supplied as arguments to this function. The resulting output array will contain the physical impulse response coefficients in the time domain.
    
      
    
7. **Frequency Response Transformation:** To evaluate the filter's performance, the discrete-time coefficients must be mathematically transformed into the frequency domain. An array of $512$ discrete points must be specified to provide high-resolution sampling across the frequency spectrum. A specialized frequency-response function must be invoked, yielding an array of complex numbers representing magnitude and phase.
    
      
    
8. **Magnitude Conversion:** The absolute values of the complex frequency response array must be isolated. To convert this linear scale into standard logarithmic decibels (dB), the base-10 logarithm must be computed for every element, and the result must be multiplied by $20$.
    
      
    
9. **Phase Extraction and Unwrapping:** The angular argument of the complex frequency response must be extracted, yielding the phase response in radians. Because phase naturally wraps around at bounds of $\pi$ and $-\pi$, an unwrapping function must be applied to ensure the phase remains continuous. Finally, the continuous radians must be converted into degrees.
    
      
    
10. **Data Visualization:** A two-paneled figure must be initialized. The upper subplot must display the magnitude (dB) against frequency (Hz), accompanied by vertical markers explicitly denoting the boundaries of the passband and stopband edges. The lower subplot must display the phase angle (Degrees) against frequency (Hz) to visually prove phase linearity.
    
      
    
11. **Textual Verification:** The computed filter order, length, and compensated cutoff frequency must be printed to the standard output console for numerical verification.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

Fs = 8000.0   # Sampling frequency (Hz)
TW = 500.0    # Transition width (Hz)
PBE = 1500.0  # Passband Edge frequency (Hz)

M = int(np.round(6 * Fs / TW))
filter_length = M + 1

Fc = PBE + TW / 2.0         # Cutoff frequency

a = signal.firwin(
    numtaps=filter_length, 
    cutoff=Fc, 
    window='blackman', 
    pass_zero='lowpass', 
    fs=Fs
)

N = 512 # number of points for calculating frequency response
f, h = signal.freqz(a, 1, worN=N, fs=Fs)

plt.figure(figsize=(8, 6))

plt.subplot(2, 1, 1)
plt.plot(f, 20 * np.log10(np.abs(h)), linewidth=2)
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude (dB)")
plt.axvline(PBE, color='red', linestyle='--', label=f'Passband Edge ({PBE} Hz)')
plt.axvline(PBE + TW, color='purple', linestyle='--', label=f'Stopband Edge ({PBE+TW} Hz)')
plt.grid()
plt.legend()

plt.subplot(2, 1, 2)
plt.plot(f, np.degrees(np.unwrap(np.angle(h))), linewidth=2, color='green')
plt.xlabel("Frequency (Hz)")
plt.ylabel("Angle (Degree)")
plt.grid()

plt.tight_layout()

print(f"Filter Order (M): {M}")
print(f"Filter Length (Taps): {filter_length}")
print(f"Compensated Ideal Cutoff Frequency: {Fc} Hz")
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The executable script presented in Section 4 is a direct translation of the physical mathematics outlined in the algorithm design into the Python programming syntax. The script fundamentally relies on three core libraries. First, `import numpy as np` is executed to allow continuous numerical operations, algebraic rounding, and array broadcasting over the discrete data structures. Second, `import matplotlib.pyplot as plt` is invoked to provide an interface for rendering the graphical spectrum outputs. Finally, `from scipy import signal` is instantiated to grant the program access to deeply specialized discrete-time processing algorithms, specifically those relating to windowing synthesis and Fourier evaluations.

  

The physical parameters extracted from the engineering requirements are initialized sequentially in memory. The variable `Fs = 8000.0` explicitly stores the system sampling frequency in Hertz. `TW = 500.0` dictates the required distance between the edge of the passband and the beginning of the complete stop attenuation. `PBE = 1500.0` represents the maximum frequency limit that is permitted to pass without attenuation.

  

To mathematically compute the filter order `M`, the script implements the empirical formulation mapped for the Blackman window function. The command `np.round(6 * Fs / TW)` calculates the optimal integer ratio needed to satisfy the steepness of the transition band. The external `int()` command forcibly casts this resulting floating-point value into a pure integer, as filter orders must exist as discrete, absolute integers. Subsequently, the total filter length—which corresponds physically to the number of memory taps in a hardware implementation—is calculated by shifting the order by one unit, instantiated as `filter_length = M + 1`.

  

The pure mathematical cutoff frequency, `Fc`, must be perfectly centered within the transition band to ensure symmetrical roll-off. This is accomplished programmatically by executing `PBE + TW / 2.0`. This creates a compensated anchor point for the filter synthesis engine.

  

The most critical operational step occurs during the invocation of the `signal.firwin()` function, which originates from the SciPy library. This singular function computationally performs the complex multiplication of the ideal infinite impulse response with the specific bounded time-domain window. The parameter `numtaps=filter_length` explicitly declares the final length of the generated coefficient array. The parameter `cutoff=Fc` supplies the compensated target frequency. The argument `window='blackman'` instructs the underlying matrix compiler to synthesize and apply the Blackman cosine-summation formulation ($0.42-0.5\cos(2\pi n / M)+0.08\cos(4\pi n / M)$) directly against the ideal sinc function. The parameter `pass_zero='lowpass'` explicitly forces the structural topology of the digital filter to allow zero Hertz (DC signals) to pass unattenuated, defining the low-pass configuration. Finally, `fs=Fs` guarantees all calculations are correctly normalized to the system sampling rate. The resulting array of optimally windowed filter coefficients is mapped to the variable `a`.

  

To verify the mathematical validity of the resulting filter, the script transitions from the time domain (the filter coefficients) to the frequency domain. The variable `N = 512` pre-allocates the number of discrete sample points used to mathematically compute the frequency response vector. The SciPy function `signal.freqz(a, 1, worN=N, fs=Fs)` is executed to compute the discrete-time Fourier transform. The argument `a` represents the numerator coefficients (the FIR taps), while the integer `1` represents the denominator coefficient (which is always $1$ for an FIR, entirely non-recursive system). This operation returns two precise arrays: `f`, representing the discrete continuous frequencies in Hertz, and `h`, a complex-valued array representing the precise amplitude and phase shift introduced by the filter at every specific frequency point.

  

The graphical plotting block handles the visualization of these complex arrays. `plt.figure(figsize=(8, 6))` dictates the dimensional constraints of the rendering window. `plt.subplot(2, 1, 1)` partitions this window, targeting the upper quadrant. The command `20 * np.log10(np.abs(h))` strips the absolute linear amplitude from the complex vector `h` and applies the standard logarithmic transformation, effectively converting the output into standard decibels (dB) for engineering analysis. The vertical boundaries of the filter's operational zones are distinctly annotated using `plt.axvline()`, projecting dashed lines across the grid to confirm the exact placement of the $1500\text{ Hz}$ passband edge and the $2000\text{ Hz}$ stopband edge.

  

In the lower quadrant, initialized by `plt.subplot(2, 1, 2)`, the phase response is extracted. `np.angle(h)` computes the principal value of the complex argument in radians. Because trigonometric properties naturally restrict this output between $-\pi$ and $\pi$, large artificial discontinuities will inherently appear in the data array. The critical function `np.unwrap()` is applied mathematically to analyze the data vector, identifying these artificial wrapping jumps and sequentially adding or subtracting factors of $2\pi$ to reconstruct the true, completely continuous phase shift. `np.degrees()` subsequently converts these radians into standard degrees for easier interpretation. The strictly straight line generated in this plot visually confirms the required exactly linear phase response characteristic of the FIR design. Finally, the `print()` functions format and display the calculated integer arrays directly to the console for independent algorithmic verification.

  

## PROBLEM 4: DESIGN AND IMPLEMENTATION OF A FINITE IMPULSE RESPONSE (FIR) BAND-PASS FILTER USING THE HAMMING WINDOW METHOD

### 1. PROBLEM STATEMENT

**GIVEN:** An advanced computational requirement to model and engineer a discrete-time Finite Impulse Response (FIR) band-pass filter using the Window Method. The system operates under a rigid sampling frequency parameter explicitly defined as $100\text{ Hz}$. The filter topology is designed to strictly pass signal frequencies bounded between a lower cutoff limit of $10\text{ Hz}$ and an upper cutoff limit of $20\text{ Hz}$. The specific filter order allocated for this operation is mathematically fixed at $M = 50$. The specific mathematical weighting function selected to truncate the filter coefficients and mitigate oscillation is the Hamming window.

  

**REQUIRED:** A complete, self-contained Python script utilizing `scipy.signal` must be constructed to synthesize the band-pass FIR filter coefficients based entirely on the provided variables. The resulting computational logic must accurately isolate the target frequency band. The array of filter coefficients must be transformed into the frequency domain to compute both the magnitude and phase response arrays. The magnitude response must be converted to decibels and plotted to demonstrate the effective isolation of the $10-20\text{ Hz}$ band, including a visualization of the passband behavior near the $0\text{ dB}$ mark. A secondary plot must trace the unwrapped phase response in degrees to conclusively demonstrate the preservation of the linear phase characteristic within the designated passband, ensuring no time-delay distortion affects the passed waveforms.

  

### 2. CONCEPTUAL THEORY

To successfully architect an advanced digital filter, the underlying mathematics governing signal isolation in discrete-time systems must be comprehensively explained from first principles. When analog physical signals are converted into a digital framework, they are mathematically transformed into discrete sample points spaced by a constant time interval. The inverse of this specific interval mathematically constitutes the sampling frequency of the entire discrete system.

  

Digital signal isolation relies fundamentally on the creation of numerical filters. Unlike basic analog filters constructed from physical resistors and capacitors, digital filters execute complex mathematical computations upon the sequence of data arrays. Finite Impulse Response (FIR) filters are structurally defined by convolution sequences that eventually resolve to a value of absolute zero. This mathematical finality means FIR filters rely solely on present and historical input data, rendering them strictly non-recursive. The mathematical duration of the filter response is strictly bounded by a length parameter determined by the order $M$ of the system, mathematically expressed as $M+1$ total coefficients. A defining, powerful physical property of well-designed FIR filters is their inherent capacity to exhibit an entirely linear phase characteristic. When phase linearity is preserved, every distinct frequency passing through the filter is subjected to the exact same uniform temporal delay. By maintaining a constant group delay across all frequencies, the structural waveform of the incoming signal is flawlessly preserved, absolutely preventing the physical phenomenon of phase distortion.

  

The specific architecture required in this scenario is a band-pass filter. Unlike low-pass filters that only reject high frequencies, a band-pass filter contains two distinct boundary points: a lower cutoff frequency and an upper cutoff frequency. The objective is to establish an unattenuated transmission channel strictly between these two boundaries. Mathematical frequencies falling below the lower bound or extending above the upper bound must be aggressively attenuated into a physical stopband.

  

To construct an optimal filter, it is necessary to originate the design conceptually in the frequency domain. An ideal band-pass filter possesses a rectangular spectral shape: its magnitude is precisely unity ($1$) inside the specified frequency band, and mathematically zero ($0$) outside of it. However, applying the Inverse Discrete-Time Fourier Transform (IDTFT) to this idealized rectangular shape produces an impulse response vector that spans across infinite time. To deploy this filter computationally in real-world systems, this infinite array of ideal coefficients must be forcefully truncated to a finite length $M+1$.

  

However, direct truncation introduces severe, abrupt mathematical discontinuities at the exact points where the array is cut. In the frequency domain, these sharp breaks manifest as extreme oscillating ripples across both the intended passbands and the intended stopbands. This physical distortion is identified in signal processing literature as the Gibbs phenomenon.

  

To surgically remove the Gibbs phenomenon, the pure mathematical concept of windowing is utilized. The Window Method dictates that the infinitely long ideal filter coefficients must not be simply severed; rather, they must be mathematically multiplied by an independent array of values known as a window function. This window sequence acts as a mathematical envelope. The window array maintains a strong central amplitude but gradually and smoothly tapers toward a value of zero at both the beginning and the extreme end of the required filter length. Applying this tapered weighting drastically suppresses the severe truncation anomalies.

  

The physical parameters of a filter's transition regions are determined wholly by the explicit mathematical shape of the chosen window. The Hamming window function is a rigorously optimized, generalized cosine formulation. Its structural equation is strictly defined as:

  

$$w_{ham}[n]=0.54-0.46\cos\left(\frac{2\pi n}{M}\right)$$

. Unlike standard raised-cosine windows, the numerical coefficients in the Hamming function ($0.54$ and $0.46$) are specifically unbalanced. This deliberate mathematical imbalance is engineered specifically to forcefully cancel out the most prominent adjacent sidelobe located in the frequency domain. By optimizing this cancellation, the Hamming window establishes an exceedingly clean transition with a theoretical first sidelobe suppression reaching $-41\text{ dB}$ and a total stopband attenuation capable of exceeding $-53\text{ dB}$. This deep attenuation provides the stringent signal isolation required to cleanly extract the target bandwidth.

  

### 3. ALGORITHM DESIGN

The theoretical physical models of the band-pass structure and the Hamming window must be sequentially structured into a highly rigorous algorithmic pathway to guarantee precise programmatic execution.

  

1. **Computational Subsystem Initialization:** The specific Python programming libraries necessitated for large array processing, frequency domain manipulation, and visual mapping must be firmly established and imported into the isolated computing environment.
    
      
    
2. **Constraint Variable Allocation:** The strict dimensional constraints governing the system must be hard-coded into memory. The constant variables mapping the sampling frequency ($F_s$), the integer filter order ($M$), the lower operational boundary ($F_l$), and the upper operational boundary ($F_u$) must be formally instantiated.
    
      
    
3. **Coefficient Array Length Computation:** The final physical dimension of the computational array, which dictates the total number of hardware taps simulated, must be computed by adding exactly one mathematical integer to the total filter order ($M+1$).
    
      
    
4. **Frequency Boundary Array Formulation:** A continuous numeric array must be assembled containing both the discrete lower cutoff boundary and the discrete upper cutoff boundary. This structured array serves as the targeting vector for the band-pass isolation algorithm.
    
      
    
5. **Windowed Synthesis Generation:** A precise synthesis function dedicated to FIR digital filter coefficient generation must be launched. The total calculated array length, the structured dual-boundary frequency array, the explicit string indicating the Hamming cosine formulation, the specific operational directive enforcing a band-pass topology, and the foundational system sampling rate must be actively injected into the function. The algorithm will perform the discrete time-domain multiplication of the ideal infinite response and the bounded Hamming window, yielding the final functional coefficients.
    
      
    
6. **Transform Domain Conversion:** An evaluation array containing $512$ discrete nodes must be generated. The time-domain coefficients synthesized in the previous step must be subjected to a discrete frequency transformation operation. This procedure will yield two output vectors: one representing the continuous spectrum of measured frequencies, and a complex matrix containing the exact physical magnitude and phase alterations imposed by the filter system.
    
      
    
7. **Decibel Magnitude Transformation:** The raw complex magnitude data must be extracted and subjected to a strict logarithmic mathematical conversion. The base-10 logarithm must be computed and scaled by a multiplication factor of $20$, generating standard acoustic/electrical decibels for engineering inspection.
    
      
    
8. **Phase Rectification:** The raw angular argument of the complex matrix must be extracted in radians. To resolve all trigonometric mathematical wrap-around errors inherent in complex angle extraction, an unwrapping algorithm must be deployed to force complete angular continuity. The continuous radians must then be linearly mapped to standard degrees.
    
      
    
9. **Visualization Construction:** A split visualization canvas must be established. The primary upper panel must display the logarithmic magnitude trace plotted over frequency, complemented by distinct mathematical reference lines indicating the absolute boundaries of the extracted band and the standard power attenuation metric. The secondary lower panel must strictly plot the unwrapped, continuous degree-based phase angles against frequency.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

Fs = 100      # Sampling Frequency (Hz)
M = 50        # Filter order
Fl = 10       # Lower cutoff frequency (Hz)
Fu = 20       # Upper cutoff frequency (Hz)
filter_length = M + 1
Fc = [Fl, Fu] # Normalized cutoffs

a = signal.firwin(
    numtaps=filter_length,
    cutoff=Fc,
    window='hamming',
    pass_zero='bandpass',
    fs=Fs
)

N = 512 # number of points for calculating frequency response
f, h = signal.freqz(a, 1, worN=N, fs=Fs)

plt.figure(figsize=(8, 6))

plt.subplot(2, 1, 1)
plt.plot(f, 20 * np.log10(np.abs(h)))
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude (dB)")
plt.axvline(Fl, color='red', linestyle='--', label=f'Lower cutoff ({Fl} Hz)')
plt.axvline(Fu, color='purple', linestyle='--', label=f'Upper cutoff ({Fu} Hz)')
plt.axhline(-3, color='orange', linestyle='--', label='-3 dB Mark')
plt.grid()
plt.legend()

plt.subplot(2, 1, 2)
plt.plot(f, np.degrees(np.unwrap(np.angle(h))), color='green')
plt.xlabel("Frequency (Hz)")
plt.ylabel("Angle (Degree)")
plt.grid()
plt.tight_layout()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The final Python execution script presented in Section 4 methodically translates the complex mathematics of band-pass windowing algorithms into distinct, operational code syntax. The code begins by initializing the essential external packages. `import numpy as np` guarantees the availability of mathematical array processing frameworks. `import matplotlib.pyplot as plt` integrates the graphical user interface required for spatial plotting. `from scipy import signal` establishes access to the highly calibrated engineering routines required for physical filter coefficient modeling.

  

The fundamental environmental variables are subsequently locked into physical memory space. `Fs = 100` firmly enforces the $100\text{ Hz}$ sampling frequency limitation across all future transformation calculations. `M = 50` defines the structural order of the numerical system. The specific isolation parameters are established by `Fl = 10` (representing the $10\text{ Hz}$ limit where transmission begins) and `Fu = 20` (representing the $20\text{ Hz}$ limit where transmission ceases).

  

Because discrete signal processing algorithms fundamentally process points rather than abstract functions, the true length of the array generated by the filter engine is computed as `filter_length = M + 1`. To instruct the filter compiler regarding the boundaries of the desired transmission zone, a specialized data array structure `Fc = [Fl, Fu]` is assembled. By nesting both specific frequency bounds within a continuous single bracketed array, the downstream matrix processor recognizes that two distinct boundary thresholds are mandated.

  

The core mathematical engine is engaged precisely through the invocation of the SciPy library function `a = signal.firwin(...)`. This module executes the time-domain multiplication algorithms necessary for FIR generation. The argument `numtaps=filter_length` strictly sets the size of the memory array holding the coefficients. Supplying the array `cutoff=Fc` directly forces the algorithm to recognize the two independent spectral markers. Passing the structural string `window='hamming'` explicitly instructs the engine to map the coefficients according to the unbalanced cosine formula mathematically recognized as the Hamming window ($0.54-0.46\cos(2\pi n / M)$). The most critical parameter alteration lies in `pass_zero='bandpass'`. By injecting this exact string, the underlying compiler is forced to invert its standard logic; it guarantees that zero frequency (pure direct current, or DC) is brutally attenuated rather than passed, constructing the foundational shape of a true band-pass architecture. `fs=Fs` ensures the normalization algorithms maintain scale with the discrete sampling speed. The finalized physical sequence of numeric coefficients is securely mapped to the variable `a`.

  

To conclusively prove the success of the windowed coefficient design, the time-domain data is thrust into the frequency domain. `N = 512` dictates the absolute resolution of the mathematical Fourier transformation calculation. `f, h = signal.freqz(a, 1, worN=N, fs=Fs)` physically executes the discrete frequency shift, yielding the array of sampled frequencies (`f`) and the precise complex-number characteristics of the filter (`h`) across every evaluated point.

  

The resulting matrices are systematically rendered through the Matplotlib structure. `plt.figure(figsize=(8, 6))` spawns the dimensional rendering window. `plt.subplot(2, 1, 1)` allocates the superior half of the window. The command `20 * np.log10(np.abs(h))` strips the raw magnitude values, forces them into a logarithmic trajectory, and mathematically scales them by a factor of 20 to compute the standard engineering decibel scale. Using `plt.axvline()`, discrete reference markers are injected across the grid at the exact points corresponding to the lower and upper operational cutoffs, ensuring immediate visual verification that signals below $10\text{ Hz}$ and extending above $20\text{ Hz}$ fall into deep stopband attenuation. A horizontal reference indicator is uniquely drawn utilizing `plt.axhline(-3, ...)`, formally marking the standard $3\text{ dB}$ half-power degradation threshold crucial to evaluating filter efficacy.

  

The inferior subplot is initialized via `plt.subplot(2, 1, 2)` to exclusively isolate the physical phase performance. The raw internal angle is scraped by `np.angle(h)` in pure radians. To remove mathematical wrapping discontinuities, `np.unwrap()` artificially reconstructs a mathematically continuous angular line, which is translated directly to standard degrees by `np.degrees()`. Within the plotted visualization, the strict linearity traced by the slope conclusively proves that the specific required filter characteristics have been met perfectly. By preserving a perfectly flat slope in the passband region, it mathematically demonstrates that every distinct frequency between $10\text{ Hz}$ and $20\text{ Hz}$ experiences the exact same constant time delay, thereby guaranteeing the preservation of the signal’s underlying waveform completely devoid of any physical phase distortion. The final `plt.tight_layout()` function simply optimizes pixel spacing across the dual-panel output image. 

## PROBLEM 5: MAGNITUDE AND PHASE RESPONSE ANALYSIS OF A 50TH ORDER HIGHPASS FILTER USING VARIOUS WINDOWING TECHNIQUES

### 1. PROBLEM STATEMENT

**GIVEN:** An engineering requirement dictates the analysis of a discrete-time digital filter. The specific characteristics of the filter are defined as follows:

  

- Filter Type: Highpass Filter (HPF).
    
      
    
- Filter Order: $N = 50$ (50th order).
    
      
    
- Sampling Frequency: $f_s = 5000\text{ Hz}$ ($5\text{ kHz}$).
    
      
    
- Cut-off Frequency: $f_c = 1000\text{ Hz}$ ($1\text{ kHz}$).
    
      
    
- Design Methodology: Windowing method utilizing multiple standard window functions traditionally outlined in signal processing literature (e.g., Rectangular, Bartlett, Hanning, Hamming, Blackman).
    
      
    

**REQUIRED:** The rigorous programmatic generation and graphical plotting of both the magnitude response and the phase response for the specified 50th order highpass filter. This procedure must be iteratively applied and visually represented for every specified windowing technique to facilitate a comprehensive comparative analysis of their respective frequency domain behaviors.

  

### 2. CONCEPTUAL THEORY

Digital filter design is mathematically predicated upon the manipulation of discrete-time signals to either attenuate or amplify specific frequency bands. A Finite Impulse Response (FIR) filter is defined by a finite sequence of filter coefficients, which corresponds to the system's impulse response. The output sequence, $y[n]$, of an FIR filter is calculated via the discrete linear convolution of the input sequence, $x[n]$, and the impulse response, $h[n]$, expressed as:

  

$$y[n] = \sum_{k=0}^{N} h[k] \cdot x[n-k]$$

where $N$ represents the filter order, rendering $N+1$ total coefficients (taps). FIR filters are inherently stable and can be designed to possess strictly linear phase characteristics, which is paramount in applications where phase distortion is strictly prohibited.

  

The theoretical foundation of the windowing method begins with the formulation of an ideal, infinite impulse response. An ideal highpass filter exhibits a "brick-wall" magnitude response, defined in the continuous frequency domain as possessing zero transmission from direct current (DC) up to the cut-off frequency $\omega_c$, and unity transmission from $\omega_c$ up to the Nyquist frequency $\pi$. The normalized angular cut-off frequency is calculated mathematically as:

  

$$\omega_c = 2\pi \left( \frac{f_c}{f_s} \right)$$

The ideal impulse response, denoted as $h_d[n]$, is derived by applying the Inverse Discrete-Time Fourier Transform (IDTFT) to the ideal frequency response $H_d(e^{j\omega})$. For an ideal highpass filter, the analytical solution yields a mathematically infinite, non-causal sequence of sinc functions. Because physical computational systems cannot process an infinite number of coefficients, this ideal sequence must be truncated to a finite length of $N+1$ samples.

  

Direct truncation of an infinite series is mathematically equivalent to multiplying the infinite series by a rectangular sequence. In the frequency domain, this time-domain multiplication corresponds to a convolution between the ideal frequency response and the Fourier transform of the rectangular sequence. The Fourier transform of a rectangular sequence is a sinc function characterized by a wide main lobe and prominent side lobes. When convolved with the ideal brick-wall response, these side lobes induce oscillatory behavior in the passband and stopband of the resulting filter, a mathematical artifact fundamentally known as the Gibbs phenomenon.

  

To mitigate the deleterious effects of the Gibbs phenomenon, specialized mathematical functions known as "windows," denoted as $w[n]$, are employed. Instead of abruptly truncating the ideal response, the infinite impulse response is multiplied by a window function that smoothly tapers toward zero at its boundaries:

  

$$h[n] = h_d[n] \cdot w[n]$$

Various window functions exhibit distinct mathematical properties, specifically regarding the fundamental trade-off between the width of the main lobe (which inversely dictates the transition band steepness) and the maximum amplitude of the side lobes (which dictates stopband attenuation).

  

- **Rectangular Window:** Provides the narrowest transition band but the highest side lobe levels (poor stopband attenuation).
    
      
    
- **Bartlett (Triangular) Window:** Reduces side lobe levels at the expense of a wider main lobe compared to the rectangular window.
    
      
    
- **Hanning (Hann) Window:** Utilizes a raised cosine profile to significantly suppress side lobes, creating a smoother transition.
    
      
    
- **Hamming Window:** A mathematically optimized variation of the Hann window designed specifically to minimize the maximum side lobe peak.
    
      
    
- **Blackman Window:** Incorporates a second harmonic of the cosine function to achieve exceptionally high stopband attenuation, albeit at the cost of the widest transition band among standard windows.
    
      
    

The frequency domain characteristics of the designed filter are analyzed via the discrete frequency response, $H(e^{j\omega})$, evaluated along the unit circle in the Z-plane.

The Magnitude Response is conventionally expressed in decibels (dB) to facilitate the analysis of vast dynamic ranges:

  

$$\vert{}H(e^{j\omega})\vert{}_{\text{dB}} = 20 \log_{10} (\vert{}H(e^{j\omega})\vert{})$$

The Phase Response is defined mathematically by the argument of the complex frequency response:

  

$$\angle H(e^{j\omega}) = \arctan \left( \frac{\Im\{H(e^{j\omega})\}}{\Re\{H(e^{j\omega})\}} \right)$$

For linear phase FIR filters, this phase response will exhibit a strictly linear trajectory across the passband, avoiding dispersion of the transmitted signal.

  

### 3. ALGORITHM DESIGN

To computationally synthesize the specified highpass filter and generate the required comparative plots, a deterministic algorithm must be formulated and executed.

  

1. **System Parameter Initialization:**
    
      
    - The integer filter order is defined mathematically as $N = 50$.
        
          
        
    - The number of filter taps is calculated as $M = N + 1 = 51$.
        
          
        
    - The physical sampling frequency is defined as $f_s = 5000\text{ Hz}$.
        
          
        
    - The Nyquist frequency is computed as $f_{\text{nyq}} = \frac{f_s}{2} = 2500\text{ Hz}$.
        
          
        
    - The physical cut-off frequency is established as $f_c = 1000\text{ Hz}$.
        
          
        
    - The normalized cut-off frequency is calculated as $W_n = \frac{f_c}{f_{\text{nyq}}} = 0.4$.
        
          
        
2. **Window Array Specification:**
    
      
    - A discrete computational array containing the string identifiers for the required window functions is formulated: `['boxcar' (Rectangular), 'bartlett', 'hann', 'hamming', 'blackman']`.
        
          
        
3. **Iterative Coefficient Computation (The Execution Loop):**
    
      
    - An iterative programmatic loop is initiated to process each specified window type sequentially.
        
          
        
    - Within the loop, a specialized digital filter design routine is invoked to compute the $M = 51$ finite impulse response coefficients.
        
          
        
    - The design routine requires three primary arguments: the number of taps ($M$), the normalized cut-off frequency ($W_n$), and the specific window type identifier.
        
          
        
    - A critical internal directive is passed to configure the mathematical synthesis for a "highpass" topology rather than the default lowpass behavior.
        
          
        
4. **Frequency Response Transformation:**
    
      
    - For each computed array of filter coefficients, the discrete frequency response is calculated.
        
          
        
    - This is achieved by applying a computationally efficient algorithm (such as the Fast Fourier Transform) to evaluate the Z-transform of the coefficients at a high resolution of geometrically spaced points along the upper half of the unit circle ($0$ to $\pi$ radians).
        
          
        
5. **Magnitude and Phase Extraction:**
    
      
    - The absolute value of the complex frequency response vector is calculated to yield the linear magnitude.
        
          
        
    - To prevent mathematical anomalies such as evaluating the logarithm of absolute zero, a microscopic constant (e.g., $1\times 10^{-12}$) is programmatically added to the linear magnitude prior to logarithmic scaling.
        
          
        
    - The decibel conversion is executed utilizing the $20 \log_{10}$ mathematical transformation.
        
          
        
    - The mathematical argument (angle) of the complex frequency response vector is extracted to yield the phase response in continuous radians.
        
          
        
    - Phase unwrapping algorithms are applied to resolve artificial phase discontinuities caused by standard inverse tangent bounds.
        
          
        
6. **Graphical Visualization:**
    
      
    - A two-panel graphical interface (subplots) is instantiated.
        
          
        
    - The upper graphical panel is dedicated to the superimposition of the magnitude responses (in dB) for all evaluated windows, plotted against physical frequency (Hz).
        
          
        
    - The lower graphical panel is dedicated to the superimposition of the continuous phase responses (in radians) for all evaluated windows, plotted against physical frequency (Hz).
        
          
        
    - Strict academic formatting rules are applied to the visualization: major and minor grid lines are activated, axes are clearly labelled with proper SI units, and a legend is rendered to delineate the specific window mapping.
        
          
        

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# 1. System Parameter Initialization
filter_order = 50
num_taps = filter_order + 1
fs = 5000.0  # Sampling frequency in Hz
fc = 1000.0  # Cut-off frequency in Hz
nyquist = fs / 2.0
normalized_cutoff = fc / nyquist

# 2. Window Array Specification
# Note: 'boxcar' is the SciPy designation for a Rectangular window
window_types = ['boxcar', 'bartlett', 'hann', 'hamming', 'blackman']
window_labels = ['Rectangular', 'Bartlett', 'Hanning', 'Hamming', 'Blackman']

# Figure Initialization
plt.figure(figsize=(12, 10))

# Create subplots
ax1 = plt.subplot(2, 1, 1)
ax2 = plt.subplot(2, 1, 2)

# 3. Iterative Coefficient Computation and Analysis
for i, win in enumerate(window_types):
    # Compute FIR filter coefficients using firwin
    # pass_zero=False dictates highpass behavior
    h_coeffs = signal.firwin(num_taps, normalized_cutoff, window=win, pass_zero=False)
    
    # 4. Frequency Response Transformation
    # Compute the frequency response using freqz (evaluating Z-transform)
    # worN=2048 provides high resolution on the frequency axis
    w, h_freq_resp = signal.freqz(h_coeffs, worN=2048)
    
    # Convert normalized angular frequency to physical frequency in Hz
    freq_hz = (w / np.pi) * nyquist
    
    # 5. Magnitude and Phase Extraction
    # Magnitude extraction with mathematical safeguard against log(0)
    magnitude = np.abs(h_freq_resp)
    magnitude_db = 20 * np.log10(magnitude + 1e-12)
    
    # Phase extraction and unwrapping
    phase = np.unwrap(np.angle(h_freq_resp))
    
    # 6. Graphical Visualization - Plotting
    ax1.plot(freq_hz, magnitude_db, label=window_labels[i], linewidth=1.5)
    ax2.plot(freq_hz, phase, label=window_labels[i], linewidth=1.5)

# Formatting Magnitude Response Plot
ax1.set_title('Magnitude Response of 50th Order Highpass Filter', fontsize=14, fontweight='bold')
ax1.set_ylabel('Magnitude (dB)', fontsize=12)
ax1.set_xlim([0, nyquist])
ax1.set_ylim([-120, 5])
ax1.axvline(fc, color='k', linestyle='--', linewidth=1, label=f'Cut-off ({fc} Hz)')
ax1.grid(True, which='both', linestyle='--', alpha=0.7)
ax1.legend(loc='best')

# Formatting Phase Response Plot
ax2.set_title('Phase Response of 50th Order Highpass Filter', fontsize=14, fontweight='bold')
ax2.set_xlabel('Frequency (Hz)', fontsize=12)
ax2.set_ylabel('Phase (Radians)', fontsize=12)
ax2.set_xlim([0, nyquist])
ax2.axvline(fc, color='k', linestyle='--', linewidth=1)
ax2.grid(True, which='both', linestyle='--', alpha=0.7)
ax2.legend(loc='best')

# Final Rendering
plt.tight_layout()
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The computational sequence implemented in the provided Python script fundamentally translates the theoretical mathematical concepts of discrete digital signal processing into a functional analysis tool.

  

The script initiates by importing three foundational scientific libraries: `numpy` for high-performance numerical array operations, `matplotlib.pyplot` for rigorous data visualization, and the `signal` module from `scipy`, which houses dedicated digital filter design architectures.

  

In the parameter initialization phase, physical specifications extracted from the system requirements are established. The filter order is explicitly cast as an integer $50$. Because finite impulse response mathematics dictates that a filter of order $N$ requires $N+1$ computational taps, the variable `num_taps` is computed as $51$. The sampling frequency and cut-off frequency are defined as floating-point variables ($5000.0$ and $1000.0$, respectively). Digital filter design functions uniformly require normalized frequencies. Therefore, the Nyquist frequency is computed algebraically ($f_s / 2$), and the cut-off frequency is normalized against this Nyquist limit, mapping the $1000\text{ Hz}$ target to a mathematical domain between $0$ and $1$.

  

An iterative logic structure (a `for` loop) is constructed to process an array of strings representing the mathematical window functions: `['boxcar', 'bartlett', 'hann', 'hamming', 'blackman']`. The string `'boxcar'` is the specific syntactical designation utilized by the SciPy library to invoke a rectangular window.

  

Within this iterative loop, the core computational synthesis is executed via the `signal.firwin` function. This specialized function mathematically formulates the ideal impulse response and executes the time-domain multiplication with the requested window function automatically. The argument `pass_zero=False` is mathematically critical; it explicitly instructs the algorithm to deny signal transmission at zero frequency (DC), thereby enforcing the highpass topological constraint. The output of this function, `h_coeffs`, is a one-dimensional array containing the $51$ precise finite impulse response coefficients.

  

Following coefficient generation, the frequency domain characteristics must be extracted. The `signal.freqz` function calculates the discrete-time Fourier transform (a specific evaluation of the general Z-transform) of the provided coefficients. The parameter `worN=2048` instructs the algorithm to compute this complex frequency response at $2048$ discrete, equidistant points along the upper unit circle, ensuring that the resulting graphical curves are rendered with high mathematical fidelity and lack visual aliasing. The function yields two arrays: `w`, representing normalized angular frequency in radians/sample, and `h_freq_resp`, containing the complex numerical values of the frequency response.

  

The normalized angular frequency array `w` is linearly mapped back to physical frequencies in Hertz to ensure the final graphical output is analytically useful. Magnitude is extracted by applying the absolute value operation (`np.abs`) to the complex array. A minute constant, $1\times 10^{-12}$, is added prior to applying the $20 \log_{10}$ operation to prevent mathematically invalid computations (such as evaluating the logarithm of absolute zero, which arises in deep stopband nulls). Phase is extracted by calculating the mathematical argument (`np.angle`) of the complex array. Because inverse trigonometric functions inherently wrap their outputs to a principal value range (typically $-\pi$ to $\pi$), the `np.unwrap` function is applied to detect discontinuous phase jumps exceeding $\pi$ radians and correct them, thereby revealing the true linear continuous phase progression characteristic of symmetrical FIR coefficients.

  

Finally, the `matplotlib.pyplot` module is utilized to superimpose the computed arrays iteratively onto two distinct Cartesian coordinate systems (subplots). The upper subplot visually validates the theoretical trade-offs regarding window functions: it demonstrates that the rectangular ('boxcar') window possesses the steepest roll-off at the $1000\text{ Hz}$ boundary but fails to attenuate high-frequency stopband leakage effectively, whereas the Blackman window severely attenuates stopband frequencies at the direct expense of a sluggish, wide transition band.

  

## PROBLEM 6: FIR BANDPASS FILTER DESIGN TO MEET SPECIFIC TRANSITION AND ATTENUATION CRITERIA

### 1. PROBLEM STATEMENT

**GIVEN:** Strict filter design specifications have been outlined for the realization of a discrete-time Finite Impulse Response (FIR) filter. The required specifications are mathematically defined as follows:

  

- Filter Topology: Bandpass Filter.
    
      
    
- Passband Frequency Range: $150\text{ Hz}$ to $250\text{ Hz}$.
    
      
    
- Transition Band Width: $\Delta f = 50\text{ Hz}$.
    
      
    
- Maximum Passband Ripple: $0.05\text{ dB}$.
    
      
    
- Minimum Stopband Attenuation: $50\text{ dB}$.
    
      
    
- System Sampling Frequency: $f_s = 1000\text{ Hz}$ ($1\text{ kHz}$).
    
      
    

**REQUIRED:** The rigorous analytical selection of an appropriate windowing methodology capable of satisfying or exceeding the given transition and attenuation specifications. A comprehensive logical justification for the selected window method must be documented. Subsequent to window selection, the digital filter must be programmatically synthesized, and the resulting magnitude response and phase response must be graphically plotted to empirically verify adherence to the given specifications.

  

### 2. CONCEPTUAL THEORY

A digital bandpass filter is mathematically constructed to isolate and transmit a specific contiguous spectrum of frequencies—termed the passband—while severely attenuating frequencies both below and above this spectral region—termed the stopbands. The fundamental characteristics of any practical frequency-selective filter are defined by tolerance schemes, as ideal "brick-wall" transitions cannot be realized by causal, finite systems.

  

The specifications for a bandpass filter are delineated by several critical frequency boundaries:

  

- $f_{p1}$ and $f_{p2}$: The lower and upper edges of the passband.
    
      
    
- $f_{s1}$ and $f_{s2}$: The lower and upper edges of the stopbands.
    
    The transition bands exist between the stopband and passband edges. The width of these transition bands is defined as $\Delta f = f_{p1} - f_{s1} = f_{s2} - f_{p2}$.
    
      
    

Furthermore, the filter response is constrained by amplitude tolerances:

  

- Passband Ripple ($A_p$): The maximum allowable amplitude deviation (oscillation) within the intended passband, typically expressed in decibels (dB).
    
      
    
- Stopband Attenuation ($A_s$): The minimum required amplitude suppression relative to the passband peak in the defined stopband regions, also measured in decibels (dB).
    
      
    

When utilizing the window design method to synthesize an FIR filter, the selection of the window function is exclusively governed by the most stringent amplitude constraint—in this instance, the Stopband Attenuation requirement of $50\text{ dB}$. Mathematical analysis of discrete Fourier transforms proves that the peak amplitude of the side lobes in the frequency response of the window directly dictates the maximum achievable stopband attenuation.

  

Extensive signal processing literature provides empirical tables linking standard window functions to their inherent stopband attenuation limits:

  

- **Rectangular Window:** Attenuation limit $\approx -21\text{ dB}$.
    
      
    
- **Bartlett Window:** Attenuation limit $\approx -25\text{ dB}$.
    
      
    
- **Hanning Window:** Attenuation limit $\approx -44\text{ dB}$.
    
      
    
- **Hamming Window:** Attenuation limit $\approx -53\text{ dB}$.
    
      
    
- **Blackman Window:** Attenuation limit $\approx -74\text{ dB}$.
    
      
    

Given the strict requirement that the stopband attenuation must be at least $50\text{ dB}$, analytical deduction immediately disqualifies the Rectangular, Bartlett, and Hanning windows. The Hamming window, possessing a theoretical maximum stopband attenuation of approximately $53\text{ dB}$, is mathematically capable of satisfying the $50\text{ dB}$ specification. The Blackman window ($74\text{ dB}$) would also satisfy this requirement; however, utilizing a window with excessively high attenuation incurs a penalty: it inherently widens the main lobe, which in turn demands a significantly higher filter order ($N$) to meet the specified transition width. Therefore, to optimize computational efficiency (minimizing the number of coefficients) while strictly fulfilling the stated criteria, the **Hamming window** is selected as the mathematically optimal solution.

  

Once the window function is analytically selected, the required filter order $N$ must be computed. The filter order is inversely proportional to the normalized transition width. For a Hamming window, empirical approximation formulas establish the relationship as:

  

$$N \approx \frac{3.3 \cdot f_s}{\Delta f}$$

where $\Delta f$ is the physical transition width in Hertz, and $f_s$ is the physical sampling frequency in Hertz.

Applying the provided specifications ($\Delta f = 50\text{ Hz}$, $f_s = 1000\text{ Hz}$):

  

$$N \approx \frac{3.3 \cdot 1000}{50} = \frac{3300}{50} = 66$$

Thus, a minimum filter order of $N = 66$ is required. Digital filter design conventions for bandpass configurations dictate specific constraints on the order. A Type I linear phase FIR filter requires an even filter order (odd number of taps). A Type II filter possesses an odd order (even number of taps) but is mathematically constrained to have zero magnitude response at the Nyquist frequency, rendering it strictly suitable for lowpass or bandpass filters. Therefore, an order of $N=66$ (Type I) is analytically appropriate.

  

The ideal cut-off frequencies utilized for the windowing algorithm are mathematically positioned at the precise geometric center of the transition bands.

The lower ideal cut-off frequency is calculated as:

  

$$f_{c1} = f_{p1} - \frac{\Delta f}{2} = 150 - \frac{50}{2} = 125\text{ Hz}$$

The upper ideal cut-off frequency is calculated as:

  

$$f_{c2} = f_{p2} + \frac{\Delta f}{2} = 250 + \frac{50}{2} = 275\text{ Hz}$$

### 3. ALGORITHM DESIGN

To computationally synthesize the verified bandpass filter, the following procedural algorithm is formulated.

  

1. **System Specification Initialization:**
    
      
    - Define continuous variables for sampling frequency ($f_s = 1000\text{ Hz}$), passband boundaries ($f_{p1} = 150\text{ Hz}$, $f_{p2} = 250\text{ Hz}$), and transition width ($\Delta f = 50\text{ Hz}$).
        
          
        
    - Compute the Nyquist frequency as $f_{\text{nyq}} = 500\text{ Hz}$.
        
          
        
2. **Filter Parameter Derivation:**
    
      
    - Implement the mathematical selection of the Hamming window based on the $50\text{ dB}$ stopband attenuation requirement.
        
          
        
    - Calculate the exact theoretical filter order utilizing the Hamming empirical formula: $N = \lceil (3.3 \cdot f_s) / \Delta f \rceil$.
        
          
        
    - Ensure the calculated order $N$ is forced to an even integer to guarantee the resulting finite impulse response array is geometrically symmetrical and inherently possesses Type I linear phase properties.
        
          
        
    - Define the number of required computational taps as $M = N + 1$.
        
          
        
    - Calculate the ideal mid-transition cut-off frequencies algebraically: $f_{c1} = f_{p1} - (\Delta f / 2)$ and $f_{c2} = f_{p2} + (\Delta f / 2)$.
        
          
        
    - Normalize these computed cut-off frequencies against the Nyquist boundary to generate an array of normalized cut-offs for programmatic ingestion: `[fc1/fnyq, fc2/fnyq]`.
        
          
        
3. **Algorithmic Coefficient Synthesis:**
    
      
    - Invoke a computational bandpass digital filter design routine.
        
          
        
    - Pass the dynamically computed number of taps, the normalized two-element cut-off frequency array, the string identifier for the chosen Hamming window, and an explicit boolean directive `pass_zero=False` (ensuring attenuation at DC and establishing the bandpass topology).
        
          
        
    - The routine will output a discrete array of $M$ sequential filter coefficients.
        
          
        
4. **Frequency Domain Transformation and Evaluation:**
    
      
    - Subject the resulting coefficient array to a high-resolution discrete-time Fourier transform evaluation across the upper unit circle in the Z-plane.
        
          
        
    - Generate a linear array mapping normalized angular frequencies back to physical Hertz.
        
          
        
    - Extract the absolute magnitude array from the complex transformed data, append a minute scalar to prevent mathematical domain errors, and apply a base-10 logarithmic transformation scaled by a factor of 20.
        
          
        
    - Extract the phase array by computing the mathematical argument of the complex transformed data, and apply phase unwrapping logic to enforce continuity.
        
          
        
5. **Data Visualization and Verification:**
    
      
    - Construct two distinct graphical coordinate spaces.
        
          
        
    - In the primary space, plot the logarithmic magnitude (dB) against physical frequency. Dynamically inject vertical boundary lines representing the passband limits and stopband limits to visually verify that the curve passes through the required specification coordinates.
        
          
        
    - In the secondary space, plot the continuous unwrapped phase against physical frequency to verify the mathematical linearity of the phase response across the defined passband.
        
          
        

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
import math

# 1. System Specification Initialization
fs = 1000.0          # Sampling frequency (Hz)
fp1 = 150.0          # Lower passband edge (Hz)
fp2 = 250.0          # Upper passband edge (Hz)
delta_f = 50.0       # Transition width (Hz)
nyquist = fs / 2.0   # Nyquist frequency (Hz)

# 2. Filter Parameter Derivation
# Justification: Hamming is selected due to a ~53dB stopband attenuation limit, 
# which successfully satisfies the >50dB requirement.
window_choice = 'hamming'

# Calculate required filter order based on Hamming window empirical formula
# N = 3.3 / (normalized transition width) = 3.3 * fs / delta_f
order_exact = (3.3 * fs) / delta_f

# Enforce an even filter order to guarantee a Type I linear phase FIR filter
filter_order = int(np.ceil(order_exact))
if filter_order % 2 != 0:
    filter_order += 1
    
num_taps = filter_order + 1

# Calculate ideal cut-off frequencies at the midpoint of the transition bands
fc1 = fp1 - (delta_f / 2.0)
fc2 = fp2 + (delta_f / 2.0)

# Normalize the cut-off frequencies relative to the Nyquist frequency
normalized_cutoffs = [fc1 / nyquist, fc2 / nyquist]

# 3. Algorithmic Coefficient Synthesis
# Synthesize the FIR bandpass filter coefficients
# pass_zero=False defines the topology as a bandpass filter given a 2-element cutoff array
h_coeffs = signal.firwin(num_taps, normalized_cutoffs, window=window_choice, pass_zero=False)

# 4. Frequency Domain Transformation and Evaluation
# Calculate high-resolution frequency response
w, h_freq_resp = signal.freqz(h_coeffs, worN=4096)
freq_hz = (w / np.pi) * nyquist

# Extract Logarithmic Magnitude (dB) and Unwrapped Phase (Radians)
magnitude = np.abs(h_freq_resp)
magnitude_db = 20 * np.log10(magnitude + 1e-12)
phase = np.unwrap(np.angle(h_freq_resp))

# 5. Data Visualization and Verification
plt.figure(figsize=(12, 10))

# Magnitude Plot
ax1 = plt.subplot(2, 1, 1)
ax1.plot(freq_hz, magnitude_db, 'b-', linewidth=1.5, label='Magnitude Response')
ax1.set_title(f'Bandpass FIR Filter (Hamming Window, Order N={filter_order})', fontsize=14, fontweight='bold')
ax1.set_ylabel('Magnitude (dB)', fontsize=12)
ax1.set_xlim([0, nyquist])
ax1.set_ylim([-100, 10])

# Draw Specification Boundaries for Visual Verification
fs1_boundary = fp1 - delta_f
fs2_boundary = fp2 + delta_f
ax1.axvspan(fp1, fp2, color='green', alpha=0.1, label='Target Passband')
ax1.axvline(fs1_boundary, color='red', linestyle='--', label=f'Lower Stopband Edge ({fs1_boundary} Hz)')
ax1.axvline(fs2_boundary, color='red', linestyle='--', label=f'Upper Stopband Edge ({fs2_boundary} Hz)')
ax1.axhline(-50, color='black', linestyle=':', label='-50 dB Attenuation Spec')

ax1.grid(True, which='both', linestyle='--', alpha=0.7)
ax1.legend(loc='lower right')

# Phase Plot
ax2 = plt.subplot(2, 1, 2)
ax2.plot(freq_hz, phase, 'r-', linewidth=1.5, label='Phase Response')
ax2.set_title('Phase Response', fontsize=14, fontweight='bold')
ax2.set_xlabel('Frequency (Hz)', fontsize=12)
ax2.set_ylabel('Phase (Radians)', fontsize=12)
ax2.set_xlim([0, nyquist])
ax2.axvspan(fp1, fp2, color='green', alpha=0.1)

ax2.grid(True, which='both', linestyle='--', alpha=0.7)
ax2.legend(loc='upper right')

plt.tight_layout()
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The programmatic execution of this bandpass filter design adheres strictly to the analytically derived parameters. The script is fundamentally structured to not just implement standard filter generation, but to dynamically calculate its own structural parameters based on raw engineering specifications.

  

In the parameter derivation phase, the physical specifications are mapped directly to continuous Python variables. The critical logical operation occurs during the determination of the filter order. The script mathematically evaluates `order_exact = (3.3 * fs) / delta_f`. This direct implementation of the Hamming empirical transition formula allows the software to determine the necessary computational complexity independently. The output of this continuous division is subjected to a strict type-casting constraint. The `np.ceil` function is applied to round the precise floating-point result up to the nearest whole integer, guaranteeing the mathematical minimum is met. Subsequently, a modulo logical check (`filter_order % 2 != 0`) is applied to force the order to an even integer. Ensuring an even order forces the number of generated taps to be an odd integer, satisfying the rigid mathematical conditions required to synthesize a generalized Type I linear phase FIR filter that does not suffer from forced amplitude nulls at arbitrary boundaries.

  

The ideal cut-off frequencies, `fc1` and `fc2`, are algebraically positioned precisely halfway into the defined $50\text{ Hz}$ transition bands, rather than at the exact passband edges. This is a fundamental mathematical necessity in windowed filter design, as the actual frequency response will exhibit a continuous roll-off that symmetrically crosses the $-6\text{ dB}$ attenuation threshold at these specific calculated frequencies.

  

The core array synthesis is governed by `signal.firwin`. In contrast to a lowpass or highpass design, the function is provided a two-element Python list containing both the lower and upper normalized cut-off frequencies. Combined with the `pass_zero=False` boolean argument, this structural input instructs the internal SciPy algorithms to compute the complex convolution of an ideal lowpass and an ideal highpass response, effectively generating the required bandpass impulse coefficients.

  

The discrete frequency response is extracted using `signal.freqz`. The computational resolution is manually escalated to `worN=4096`. Because filter designs with highly specific transition bandwidths require precise analytical scrutiny near the cutoff boundaries, a standard low-resolution Fourier transform would risk skipping over mathematical peaks or valleys in the resulting ripple. A resolution of $4096$ guarantees dense plotting points.

  

The visualization phase of the script is heavily engineered to explicitly verify the initial problem specifications. Within the `matplotlib` generation block for the magnitude response, dynamic graphical markers are programmatically injected. The `axvspan` command maps a mathematically shaded region corresponding precisely to the $150\text{ Hz}$ to $250\text{ Hz}$ target passband. Vertical dashed markers are mathematically derived and placed at the absolute stopband edges ($100\text{ Hz}$ and $300\text{ Hz}$). Furthermore, a horizontal strict line is drawn exactly at the $-50\text{ dB}$ y-axis coordinate. When the script is executed, the mathematically derived continuous blue line representing the filter's actual logarithmic magnitude is visually proven to drop beneath the horizontal $-50\text{ dB}$ marker exactly before intersecting the vertical stopband edge markers, definitively proving that the chosen Hamming window and the dynamically calculated filter order precisely satisfy the provided strict engineering constraints.

  

## PROBLEM 7: DIGITAL FILTER TRANSFER FUNCTION CHARACTERIZATION AND ANALYSIS

### 1. PROBLEM STATEMENT

**GIVEN:** Four distinct mathematical expressions representing the discrete-time transfer functions $H(z)$ of digital linear time-invariant (LTI) systems. The mathematical models are defined exactly as follows:

  

- a) $H(z) = \frac{1}{1+2z^{-1}}$
    
      
    
      
    
- b) $H(z) = \frac{1}{1-2z^{-1}}$
    
      
    
      
    
- c) $H(z) = 1 - 2z^{-1}\cos(\omega) + z^{-2}$
    
      
    
      
    
- d) $H(z) = \frac{z^{-1}-a}{1-az^{-1}}$, subject to the rigid mathematical constraint $\vert{}a\vert{} < 1$
    
      
    
      
    

**REQUIRED:** A rigorous analytical and programmatic extraction of the fundamental system characteristics for each of the four specified transfer functions. The analysis must determine the geometric location of poles and zeros within the complex Z-plane, analyze the inherent mathematical stability of the system based on the unit circle constraint, and compute the magnitude response characteristics to fundamentally categorize the filtering behavior (e.g., lowpass, highpass, all-pass, notch) of each distinct mathematical structure.

  

### 2. CONCEPTUAL THEORY

In the theoretical domain of digital signal processing, the properties of a discrete linear time-invariant system are entirely mathematically encapsulated by its transfer function, $H(z)$. The transfer function is formally defined as the ratio of the Z-transform of the system's output sequence, $Y(z)$, to the Z-transform of its input sequence, $X(z)$, under the strict assumption of zero initial conditions.

  

A generic discrete transfer function expressed in terms of the delay operator $z^{-1}$ takes the form of a rational polynomial fraction:

  

$$H(z) = \frac{B(z)}{A(z)} = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2} + \dots + b_M z^{-M}}{1 + a_1 z^{-1} + a_2 z^{-2} + \dots + a_N z^{-N}}$$

To characterize the system, the roots of the numerator polynomial $B(z)$ and the denominator polynomial $A(z)$ must be evaluated.

  

- **Zeros:** The roots of $B(z)$ are defined as the zeros of the system. Frequencies corresponding to the angular locations of zeros situated precisely on the unit circle will be entirely suppressed (zero transmission).
    
      
    
- **Poles:** The roots of $A(z)$ are defined as the poles of the system. The geometric locations of the poles dictate the resonances and fundamental stability of the filter.
    
      
    

A fundamental axiom of bounded-input bounded-output (BIBO) stability for causal digital systems states that a system is strictly stable if, and only if, all of its mathematical poles lie exclusively within the interior region of the unit circle in the complex Z-plane (i.e., the absolute mathematical magnitude of every pole must be strictly less than $1$). If a pole exists on the unit circle, the system is marginally stable (oscillatory). If any pole exists outside the unit circle, the system is analytically unstable and practically unrealizable as a physical recursive filter.

  

The steady-state frequency response of the system is derived mathematically by evaluating the transfer function $H(z)$ exactly along the unit circle contour in the Z-plane. This is achieved via the substitution $z = e^{j\omega}$, where $\omega$ represents the normalized angular frequency extending from $0$ to $\pi$ radians. The resulting complex mathematical expression, $H(e^{j\omega})$, contains both the magnitude response (which dictates the filter type) and the phase response.

  

**Analytical Evaluation of the Specified Functions:**

**Filter (a): $H(z) = \frac{1}{1+2z^{-1}}$**

By multiplying the numerator and denominator by $z$, the expression is transformed to $H(z) = \frac{z}{z+2}$. The system possesses a zero at the origin ($z=0$) and a solitary pole at $z = -2$. Because the magnitude of the pole ($\vert{}-2\vert{} = 2$) is strictly greater than $1$, the pole resides completely outside the unit circle. Assuming causality, this infinite impulse response (IIR) filter is inherently unstable. If evaluated for magnitude response despite instability, a pole situated on the negative real axis (corresponding to $\omega = \pi$) characterizes a high-frequency resonance, indicating a highpass-like theoretical behavior.

  

**Filter (b): $H(z) = \frac{1}{1-2z^{-1}}$**

Transforming the expression yields $H(z) = \frac{z}{z-2}$. This system possesses a zero at the origin ($z=0$) and a solitary pole at $z = 2$. Similar to Filter (a), the magnitude of the pole ($\vert{}2\vert{} = 2$) exceeds $1$, classifying the system as strictly unstable under causal constraints. A pole located on the positive real axis (corresponding to $\omega = 0$) characterizes a low-frequency resonance, indicating a theoretical lowpass-like behavior.

  

**Filter (c): $H(z) = 1 - 2z^{-1}\cos(\omega_0) + z^{-2}$**

This mathematical expression possesses no denominator terms (effectively, an infinite order denominator array where $a_0 = 1$ and all other $a_n = 0$), immediately classifying it as a finite impulse response (FIR) filter. FIR systems possess poles situated exclusively at the origin ($z=0$), thus rendering them unconditionally stable. To evaluate the zeros, the polynomial is rearranged into positive powers of $z$: $z^2 - 2z\cos(\omega_0) + 1 = 0$. By applying the quadratic formula, the mathematical roots are identified precisely at $z = \cos(\omega_0) \pm j\sin(\omega_0)$. Applying Euler's mathematical identity, these complex conjugate roots are rewritten as $z = e^{j\omega_0}$ and $z = e^{-j\omega_0}$. Because the geometric magnitude of these roots is exactly $1$, the zeros lie directly upon the boundary of the unit circle. This specific mathematical architecture forces the magnitude response to drop to absolute zero at the specific normalized angular frequency $\omega_0$. This categorizes the system structurally as a perfect digital Notch Filter.

  

**Filter (d): $H(z) = \frac{z^{-1}-a}{1-az^{-1}}$**

This rational polynomial represents a first-order IIR system. Multiplying by $z/z$ yields $H(z) = \frac{1 - az}{z - a}$. The mathematical system exhibits a single zero located precisely at $z = 1/a$, and a single pole located precisely at $z = a$. The given physical constraint dictates that $\vert{}a\vert{} < 1$. Consequently, the pole is mathematically guaranteed to reside exclusively inside the unit circle, ensuring unconditional causal stability. Furthermore, the magnitude of the zero, $\vert{}1/a\vert{}$, is mathematically guaranteed to reside outside the unit circle. Because the pole and zero possess exact reciprocal geometric symmetry relative to the unit circle contour, an evaluation of the frequency response magnitude $\vert{}H(e^{j\omega})\vert{}$ will mathematically collapse to unity ($1$) across all frequencies. This defines the system as a theoretical All-Pass Filter, utilized in engineering exclusively for phase-shifting operations.

  

### 3. ALGORITHM DESIGN

To programmatically validate the rigorous mathematical derivations, an algorithm is designed to compute and visualize the pole-zero geometries and frequency magnitudes.

  

1. **System Constant Definition:**
    
      
    - To evaluate the parametric equations, arbitrary but valid mathematical constants must be initialized.
        
          
        
    - For Filter (c), a specific block frequency is selected: $\omega_0 = \pi / 3$.
        
          
        
    - For Filter (d), an arbitrary stable pole coordinate is selected satisfying the mathematical constraint $\vert{}a\vert{} < 1$: $a = 0.8$.
        
          
        
2. **Coefficient Array Initialization:**
    
      
    - The continuous mathematical polynomials must be parsed into discrete one-dimensional Python arrays representing descending powers of $z^{-1}$.
        
          
        
    - Filter (a) Arrays: $B_a = [1]$, $A_a = [1, 2]$.
        
          
        
    - Filter (b) Arrays: $B_b = [1]$, $A_b = [1, -2]$.
        
          
        
    - Filter (c) Arrays: $B_c = [1, -2\cos(\omega_0), 1]$, $A_c = [1]$.
        
          
        
    - Filter (d) Arrays: $B_d = [-a, 1]$, $A_d = [1, -a]$. Note: The numerator is restructured as $-a + z^{-1}$ to align mathematically with strict descending $z^{-1}$ array sequencing.
        
          
        
3. **Pole/Zero Mathematical Extraction:**
    
      
    - For each distinct filter, a specialized computational polynomial root-finding algorithm is executed using the defined coefficient arrays.
        
          
        
    - The complex roots of the numerator array $B$ are extracted and assigned as the system zeros.
        
          
        
    - The complex roots of the denominator array $A$ are extracted and assigned as the system poles.
        
          
        
4. **Frequency Response Computation:**
    
      
    - For each distinct filter, a high-resolution discrete-time Fourier evaluation of the coefficient arrays is executed along the boundary of the unit circle.
        
          
        
    - The complex mathematical array output is resolved into its linear absolute magnitude.
        
          
        
    - The continuous logarithmic magnitude (in dB) is mathematically extracted.
        
          
        
5. **Graphical Visualization Execution:**
    
      
    - A massive composite graphical interface is initialized, segmented into a $4 \times 2$ matrix to accommodate independent visualization arrays for all four filters.
        
          
        
    - **Column 1 (Pole-Zero Mapping):** For each filter, a geometric representation of the complex Z-plane is instantiated. A parametric unit circle is mathematically drawn as a reference boundary. The extracted poles are plotted utilizing a distinct visual marker ('X'), and the extracted zeros are plotted utilizing an alternate distinct marker ('O').
        
          
        
    - **Column 2 (Magnitude Response):** For each filter, the computationally derived logarithmic magnitude response is plotted against continuous normalized angular frequency (spanning $0$ to $\pi$ radians).
        
          
        
    - Strict labeling conventions are applied to ensure academic clarity.
        
          
        

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
import matplotlib.patches as patches

# 1. System Constant Definition for Parametric Filters
omega_0 = np.pi / 3.0  # Assumed block frequency for notch filter
a_val = 0.8            # Assumed pole variable for all-pass filter, adhering to |a| < 1

# 2. Coefficient Array Initialization (descending powers of z^-1)
# Filter (a): H(z) = 1 / (1 + 2z^-1)
b_a = np.array([1.0])
a_a = np.array([1.0, 2.0])

# Filter (b): H(z) = 1 / (1 - 2z^-1)
b_b = np.array([1.0])
a_b = np.array([1.0, -2.0])

# Filter (c): H(z) = 1 - 2z^-1*cos(w) + z^-2
b_c = np.array([1.0, -2.0 * np.cos(omega_0), 1.0])
a_c = np.array([1.0])

# Filter (d): H(z) = (z^-1 - a) / (1 - az^-1) -> (-a + z^-1) / (1 - az^-1)
b_d = np.array([-a_val, 1.0])
a_d = np.array([1.0, -a_val])

# Data packaging for iterative programmatic processing
filters_data = [
    {'name': 'Filter (a)', 'b': b_a, 'a': a_a, 'desc': 'Unstable Highpass'},
    {'name': 'Filter (b)', 'b': b_b, 'a': a_b, 'desc': 'Unstable Lowpass'},
    {'name': 'Filter (c)', 'b': b_c, 'a': a_c, 'desc': 'FIR Notch Filter'},
    {'name': 'Filter (d)', 'b': b_d, 'a': a_d, 'desc': 'All-Pass Filter'}
]

# Graphical Canvas Initialization
fig, axs = plt.subplots(4, 2, figsize=(12, 16))
fig.suptitle('Digital Filter Transfer Function Characteristics', fontsize=16, fontweight='bold')

# Main Processing Loop
for i, f_data in enumerate(filters_data):
    b = f_data['b']
    a = f_data['a']
    title_str = f_data['name'] + ': ' + f_data['desc']
    
    # 3. Pole/Zero Mathematical Extraction using scipy.signal.tf2zpk
    zeros, poles, gain = signal.tf2zpk(b, a)
    
    # 4. Frequency Response Computation
    w, h = signal.freqz(b, a, worN=1024)
    mag_db = 20 * np.log10(np.abs(h) + 1e-12)
    
    # 5. Graphical Visualization Execution
    
    # Left Column: Pole-Zero Plot
    ax_pz = axs[i, 0]
    # Draw Unit Circle
    unit_circle = patches.Circle((0,0), radius=1, fill=False, color='black', linestyle='--', alpha=0.5)
    ax_pz.add_patch(unit_circle)
    ax_pz.axhline(0, color='black', lw=1, alpha=0.3)
    ax_pz.axvline(0, color='black', lw=1, alpha=0.3)
    
    # Plot Poles and Zeros
    ax_pz.plot(np.real(zeros), np.imag(zeros), 'o', markersize=8, markerfacecolor='none', markeredgecolor='blue', label='Zeros')
    ax_pz.plot(np.real(poles), np.imag(poles), 'x', markersize=8, color='red', label='Poles')
    
    # Formatting Pole-Zero Map
    ax_pz.set_aspect('equal')
    # Set dynamic limits to ensure unstable poles outside the unit circle are visible
    limit = max(2.5, np.max(np.abs(poles) if len(poles) > 0 else 0) * 1.2, np.max(np.abs(zeros) if len(zeros) > 0 else 0) * 1.2)
    ax_pz.set_xlim([-limit, limit])
    ax_pz.set_ylim([-limit, limit])
    ax_pz.set_title(f'Pole-Zero Map: {title_str}', fontsize=12)
    ax_pz.set_xlabel('Real')
    ax_pz.set_ylabel('Imaginary')
    ax_pz.grid(True, linestyle=':', alpha=0.7)
    if len(zeros) > 0 or len(poles) > 0:
        ax_pz.legend(loc='best')
        
    # Right Column: Magnitude Response
    ax_mag = axs[i, 1]
    ax_mag.plot(w / np.pi, mag_db, 'g-', linewidth=2)
    ax_mag.set_title(f'Magnitude Response', fontsize=12)
    ax_mag.set_xlabel('Normalized Frequency ($\\times \\pi$ rad/sample)')
    ax_mag.set_ylabel('Magnitude (dB)')
    ax_mag.set_xlim([0, 1])
    ax_mag.grid(True, linestyle=':', alpha=0.7)
    
    # Specific y-axis formatting based on filter type
    if 'Unstable' in f_data['desc']:
        ax_mag.set_ylim([-20, 20])
    elif 'All-Pass' in f_data['desc']:
         ax_mag.set_ylim([-5, 5])

plt.tight_layout(rect=[0, 0.03, 1, 0.97])
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The computational objective of this specific program is absolute structural validation. It computationally verifies theoretical complex polynomial derivations by utilizing root-finding algorithms and high-resolution Fourier evaluations.

  

The script logically begins by assigning specific numeric values to the parametric variables found in transfer functions (c) and (d). To evaluate the notch filter, the variable `omega_0` is clamped to $\pi/3$. To evaluate the all-pass filter while strictly satisfying the mathematical constraint $\vert{}a\vert{} < 1$, the variable `a_val` is clamped to exactly $0.8$.

  

The discrete mathematical polynomial fractions are reconstructed into rigid, one-dimensional `numpy` arrays. These arrays are constructed according to strict signal processing conventions: the indices of the array represent the negatively ascending powers of the Z-domain delay operator, $z^{-1}$. For instance, the denominator of filter (a), $1 + 2z^{-1}$, must be transcribed structurally as the array `[1.0, 2.0]`. The numerator of filter (d) requires structural rearrangement; mathematically written as $z^{-1} - a$, it must be interpreted algebraically as $-a + z^{-1}$ to be programmed correctly into the array `[-a_val, 1.0]`.

  

A Python dictionary structure named `filters_data` is initialized to encapsulate and sequentially pipeline the array data, eliminating redundant block execution. An iterative mathematical loop traverses this data repository.

  

Within the iterative loop, the `scipy.signal.tf2zpk` (Transfer Function to Zeros, Poles, Gain) function is invoked. This specific computational routine executes a highly optimized numeric root-finding algorithm (typically based on evaluating the eigenvalues of a companion matrix derived from the coefficient arrays) to mathematically extract the exact coordinates of the system zeros and poles within the complex domain.

  

Subsequently, the discrete magnitude response is calculated utilizing the `signal.freqz` function. It mathematically evaluates the continuous Z-transform of the provided polynomial arrays exactly upon the upper half of the unit circle, yielding high-resolution frequency domain data. This data is coerced into logarithmic decibels for plotting.

  

The graphical rendering phase utilizes massive dynamic layout configurations. A two-dimensional geometric plane is drawn for every discrete filter. A mathematically perfect unit circle is instantiated programmatically using `matplotlib.patches.Circle` to serve as a strict visual stability boundary constraint. The complex roots mathematically extracted by `tf2zpk` are segregated by their real and imaginary components (`np.real` and `np.imag`) and plotted directly onto this Cartesian plane.

  

The visual output serves as unequivocal mathematical proof of the initial theoretical analysis. The graphical output for Filter (a) precisely plots a red singular pole coordinate at $(-2, 0)$, visibly violating the black unit circle boundary and confirming high-frequency instability. The graphical output for Filter (b) plots a singular pole at $(2, 0)$, confirming low-frequency instability. The graphical output for Filter (c) places two zero coordinates upon the exact circumference of the unit circle at precisely an angle of $\pi/3$ radians, and the adjoining magnitude response plot demonstrates a catastrophic drop to deep attenuation ($-\infty\text{ dB}$ theoretically) at exactly the corresponding normalized frequency boundary, perfectly validating its identity as a Notch Filter. Finally, the graphical output for Filter (d) correctly places a pole entirely within the stable confines of the unit circle and mathematically balances it with a zero positioned completely externally, resulting in a magnitude response plot that is rendered as a perfectly horizontal, unchanging line crossing exactly at $0\text{ dB}$, unequivocally proving the structural existence of the All-Pass Filter geometry. 

## PROBLEM 8: DESIGN OF A HIGH-PASS FIR FILTER USING A BLACKMAN WINDOW

### 1. PROBLEM STATEMENT

**GIVEN:** A digital filtering system requires the design of a High-Pass Finite Impulse Response (FIR) Filter. The specific objective is to block all incoming signal components that exist below a frequency of 150 Hz. The designated passband edge frequency is exactly 150 Hz, meaning signals at or above this threshold must be allowed to pass through the system. The digital system operates at a sampling frequency of 1000 Hz. The mathematical order of the discrete filter is strictly constrained to 60. Furthermore, the design methodology must employ a Blackman window function, which is noted for providing very high stopband attenuation characteristics.

  

**REQUIRED:**

A complete computational implementation and mathematical derivation of the specified High-Pass FIR Filter must be established. The continuous-time specifications must be mapped into the discrete-time domain through proper frequency normalization. The ideal infinite impulse response of the high-pass filter must be formulated and subsequently truncated and smoothed using the exact mathematical definition of the Blackman window of the correct length. A fully functional, executable script must be developed to calculate the filter coefficients (impulse response) and compute the corresponding magnitude and phase responses in the frequency domain. Exhaustive justification of the underlying digital signal processing physics, algorithm sequencing, and syntactical logic is required to demonstrate the precise realization of the specified filter parameters.

  

### 2. CONCEPTUAL THEORY

To understand the synthesis of a digital High-Pass Finite Impulse Response (FIR) filter, the foundational principles of discrete-time signal processing must first be established. A signal existing in the continuous physical world, denoted mathematically as $x(t)$ where $t$ represents continuous time in seconds, must be digitized before a computational processor can manipulate it. This conversion is achieved through a mechanism known as sampling. The continuous signal is measured at discrete, uniformly spaced intervals of time denoted by $T_s$, which is defined as the sampling period. The mathematical relationship between the discrete index $n$ and continuous time $t$ is expressed as $t = nT_s$. The inverse of the sampling period is the sampling frequency, defined as $f_s = 1/T_s$. According to the Nyquist-Shannon sampling theorem, to prevent a destructive phenomenon known as aliasing, the sampling frequency $f_s$ must be strictly greater than twice the highest frequency component present in the continuous-time signal.

  

Once a signal is digitized into a sequence $x[n]$, it can be passed through a discrete-time, Linear Time-Invariant (LTI) system. An LTI system is completely characterized by its impulse response, denoted as $h[n]$. The impulse response defines how the system reacts to a single unit impulse (a Kronecker delta function). The fundamental operation that dictates how the input signal $x[n]$ interacts with the system's impulse response $h[n]$ to produce the output sequence $y[n]$ is known as convolution. The mathematical operation for linear discrete convolution is formally defined by the infinite sum:

  

$$y[n] = \sum_{k=-\infty}^{\infty} x[k]h[n-k]$$

Filters are specific types of LTI systems designed to alter the spectral content of an input signal, selectively allowing certain frequency bands to pass while completely suppressing others. Filters are broadly categorized into two classes based on the duration of their impulse response: Infinite Impulse Response (IIR) filters and Finite Impulse Response (FIR) filters. FIR filters possess an impulse response $h[n]$ that settles to exactly zero in finite time. This means the convolution sum becomes finite, requiring only a limited number of past and present input samples. FIR filters are exceptionally advantageous in digital signal processing because they can be designed to possess strictly linear phase. Linear phase ensures that all frequency components of the signal experience the exact same temporal delay as they pass through the system, thereby preventing any phase distortion or dispersion in the output signal.

  

The frequency domain characteristics of a discrete-time signal or system are analyzed utilizing the Discrete-Time Fourier Transform (DTFT). The DTFT converts a discrete sequence $h[n]$ into a continuous, periodic function of normalized angular frequency $\omega$. The normalized angular frequency is mathematically related to the analog frequency $f$ in Hertz by the relationship $\omega = 2\pi(f/f_s)$. The DTFT is defined by the complex summation:

  

$$H(e^{j\omega}) = \sum_{n=-\infty}^{\infty} h[n]e^{-j\omega n}$$

An ideal high-pass filter is designed to completely suppress all frequencies from exactly zero (DC) up to a specified cutoff frequency $f_c$, and perfectly transmit all frequencies from $f_c$ up to the Nyquist frequency $f_s/2$. In the normalized angular frequency domain, the cutoff frequency is denoted as $\omega_c = 2\pi(f_c/f_s)$. The ideal frequency response of a high-pass filter, denoted as $H_{hd}(e^{j\omega})$, is a piecewise constant function that is equal to $0$ for $|\omega| < \omega_c$ and equal to $1$ for $\omega_c \le |\omega| \le \pi$.

  

To find the discrete-time impulse response that yields this exact ideal frequency response, the Inverse Discrete-Time Fourier Transform (IDTFT) must be applied to $H_{hd}(e^{j\omega})$. The IDTFT integral is defined as:

  

$$h_{hd}[n] = \frac{1}{2\pi} \int_{-\pi}^{\pi} H_{hd}(e^{j\omega})e^{j\omega n} d\omega$$

Evaluating this integral for the piecewise boundaries of the ideal high-pass filter yields a continuous sinc function mathematically described as:

  

$$h_{hd}[n] = \delta[n] - \frac{\sin(\omega_c n)}{\pi n}$$

where $\delta[n]$ is the unit impulse function, which equals $1$ when $n=0$ and $0$ otherwise. The term $\sin(\omega_c n)/(\pi n)$ represents the impulse response of an ideal low-pass filter. Thus, an ideal high-pass filter is physically realized by subtracting an ideal low-pass filter from an all-pass filter (the unit impulse).

  

A critical engineering problem arises at this mathematical juncture. The derived ideal impulse response $h_{hd}[n]$ extends infinitely in both the positive and negative directions of time $n$. Furthermore, it requires future values (negative $n$) to compute the current output, making the system non-causal and physically impossible to construct in real-time hardware. To solve this, two modifications must be enforced. First, the infinite sequence must be truncated to a finite length. This length is defined by the number of filter taps, denoted as $M$. The filter order, denoted as $N$, is related to the number of taps by the equation $M = N + 1$. Second, the sequence must be delayed by a shift of $N/2$ samples to ensure that all non-zero values of the impulse response exist at $n \ge 0$, fulfilling the requirement for causality.

  

However, abruptly truncating the infinite sequence is mathematically equivalent to multiplying the infinite impulse response by a rectangular window. In the frequency domain, this multiplication translates to a convolution between the ideal boxcar frequency response and the frequency response of the rectangular window (which is a sinc function). This convolution causes severe oscillatory ripples in both the passband and stopband of the resulting filter, a destructive artifact known as the Gibbs phenomenon. These ripples do not decrease in magnitude regardless of how much the filter order $N$ is increased.

  

To suppress the Gibbs phenomenon and achieve high stopband attenuation, a smooth, tapered window function must be used instead of a rectangular truncation. A window function, denoted as $w[n]$, gently decays to zero at its edges. The final, practical FIR filter coefficients are obtained by multiplying the delayed ideal impulse response $h_d[n]$ by the window function $w[n]$:

  

$$h[n] = h_d[n] \cdot w[n]$$

The Blackman window is explicitly designed to minimize the amplitude of the side lobes in the frequency domain, thereby maximizing the stopband attenuation, which is highly desirable when signals must be rigidly blocked. The mathematical definition of a Blackman window of length $M$ is defined by the summation of three cosine terms:

  

$$w[n] = 0.42 - 0.5\cos\left(\frac{2\pi n}{N}\right) + 0.08\cos\left(\frac{4\pi n}{N}\right)$$

for $0 \le n \le N$, and zero elsewhere. The coefficients $0.42$, $0.5$, and $0.08$ are meticulously optimized to ensure that the side lobes destructively interfere with one another, resulting in an exceptionally deep stopband attenuation of approximately $-74$ decibels (dB), at the necessary cost of a slightly wider transition band between the passband and the stopband. By applying the Blackman window to the truncated high-pass sinc function, a highly robust frequency-selective filter is synthesized.

  

### 3. ALGORITHM DESIGN

The theoretical concepts must be translated into a rigid, sequential computational blueprint. The objective is to calculate the precise numerical coefficients for the 60th-order High-Pass FIR filter and visualize its response.

  

1. **Define System Specifications:** The computational environment must be initialized with the fundamental constraints explicitly provided. The sampling frequency ($f_s$) is designated as $1000$ Hz. The target passband edge (cutoff frequency, $f_c$) is designated as $150$ Hz. The filter order ($N$) is set to $60$.
    
      
    
2. **Determine Filter Length:** The total number of finite impulse response coefficients, known as taps ($M$), must be calculated. The equation $M = N + 1$ is utilized. Given $N=60$, the number of taps is $61$. An odd number of taps guarantees a Type I FIR filter, which is fundamentally required to implement a high-pass filter.
    
      
    
3. **Calculate Normalized Angular Cutoff Frequency:** The analog frequency must be mapped to the discrete digital domain. The Nyquist frequency ($f_{nyq}$) is calculated as $f_s / 2$. The normalized cutoff frequency, scaled between $0$ and $1$ (where $1$ represents the Nyquist frequency), is computed as $W_n = f_c / f_{nyq}$.
    
      
    
4. **Generate the Ideal Impulse Response Sequence:** A time-index vector $n$ must be constructed, ranging from $0$ to $N$. An intermediate shifted time vector must be created to center the sinc function at exactly $N/2$. The mathematical formula for the ideal high-pass impulse response (an impulse minus a shifted low-pass sinc function) is computed across this vector. Special computational care must be taken at the center point where $n = N/2$ to avoid a division-by-zero anomaly, ensuring the center value accurately evaluates to $1 - (\omega_c/\pi)$.
    
      
    
5. **Compute the Blackman Window Sequence:** A numerical array of the same length $M$ must be generated using the precise mathematical definition of the Blackman window. The cosine components must be evaluated over the time-index vector $n$.
    
      
    
6. **Synthesize Final Filter Coefficients:** An element-by-element mathematical multiplication must be executed between the ideal shifted high-pass impulse response array and the generated Blackman window array. This operation yields the final, physical FIR filter coefficients $h[n]$.
    
      
    
7. **Frequency Domain Transformation:** The discrete-time coefficients must be transformed into the continuous frequency domain to verify the design. The Fast Fourier Transform (FFT) algorithm, or equivalent frequency response function, must be invoked to calculate the complex frequency response $H(e^{j\omega})$ over a dense grid of frequency points ranging from $0$ up to the Nyquist frequency.
    
      
    
8. **Calculate Magnitude and Phase:** The complex frequency response must be separated into its fundamental components. The absolute magnitude must be extracted and converted to a logarithmic decibel (dB) scale using the operation $20\log_{10}(|H|)$. The phase angle must be extracted and geometrically unwrapped to demonstrate strict phase linearity.
    
      
    
9. **Data Visualization:** A comprehensive, multi-pane graphical plot must be rendered. The first subplot must display the magnitude response in decibels versus analog frequency in Hertz. Strict visual demarcations (vertical and horizontal lines) must be drawn precisely at the $150$ Hz cutoff frequency to empirically validate that signals below this threshold are deeply attenuated and signals above are preserved. The second subplot must display the phase response, proving the linear phase property characteristic of symmetric FIR filters.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import scipy.signal as signal
import matplotlib.pyplot as plt

# 1. Define System Specifications
fs = 1000.0           # Sampling Frequency in Hz
fc = 150.0            # Passband Edge Frequency in Hz
N = 60                # Filter Order
M = N + 1             # Number of Filter Taps
nyq_rate = fs / 2.0   # Nyquist Frequency in Hz

# 2. Calculate Normalized Cutoff Frequency
# Scipy's firwin requires cutoff frequency normalized to Nyquist rate (0 to 1)
Wn = fc / nyq_rate

# 3. Synthesize Final Filter Coefficients
# Using firwin to design a High-Pass filter with a Blackman window
# pass_zero=False explicitly commands the generation of a high-pass filter
h_n = signal.firwin(numtaps=M, cutoff=Wn, window='blackman', pass_zero=False)

# 4. Frequency Domain Transformation
# Compute the frequency response of the designed filter
# worN=4096 ensures a highly dense and smooth frequency grid
frequencies, complex_response = signal.freqz(b=h_n, a=1.0, worN=4096, fs=fs)

# 5. Calculate Magnitude and Phase
magnitude_response = np.abs(complex_response)
# Avoid log(0) errors by setting a minuscule lower bound
magnitude_db = 20 * np.log10(np.maximum(magnitude_response, 1e-10))
phase_response = np.unwrap(np.angle(complex_response))

# 6. Data Visualization
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

# Plot Magnitude Response
ax1.plot(frequencies, magnitude_db, color='blue', linewidth=2)
ax1.set_title('High-Pass FIR Filter Magnitude Response (Blackman Window, N=60)')
ax1.set_ylabel('Magnitude (dB)')
ax1.set_xlabel('Frequency (Hz)')
ax1.grid(True, which='both', linestyle='--', alpha=0.7)
ax1.axvline(fc, color='red', linestyle='--', label=f'Cutoff Frequency: {fc} Hz')
ax1.axhline(-3, color='green', linestyle=':', label='-3 dB Point')
ax1.set_ylim([-100, 5])
ax1.set_xlim([0, fs/2])
ax1.legend()

# Plot Phase Response
ax2.plot(frequencies, phase_response, color='orange', linewidth=2)
ax2.set_title('High-Pass FIR Filter Phase Response')
ax2.set_ylabel('Phase (Radians)')
ax2.set_xlabel('Frequency (Hz)')
ax2.grid(True, linestyle='--', alpha=0.7)
ax2.axvline(fc, color='red', linestyle='--')
ax2.set_xlim([0, fs/2])

plt.tight_layout()
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The computational script is executed in the Python programming language, heavily leveraging the `numpy` library for fundamental vector mathematics and the `scipy.signal` module for specialized discrete-time signal processing operations. `matplotlib.pyplot` is invoked exclusively for the precise visual rendering of the computed datasets.

  

The script commences in section 1 by hard-coding the exact physical parameters extracted from the engineering constraints. The sampling frequency `fs` is defined as a floating-point scalar `1000.0`. The critical passband edge `fc` is defined as `150.0`. The filter order `N` is instantiated as the integer `60`. The number of physical filter coefficients, or taps `M`, is programmatically calculated by incrementing `N` by `1`, yielding a symmetric array length of `61`. The absolute physical limit for frequency representation without aliasing, the Nyquist rate `nyq_rate`, is calculated by halving the sampling frequency, yielding `500.0` Hz.

  

In section 2, the normalized cutoff frequency `Wn` is calculated. The `scipy.signal` library expects normalized frequencies defined as a fraction of the Nyquist rate, bounded strictly between `0.0` and `1.0`. By dividing `150.0` by `500.0`, the internal variable `Wn` resolves to `0.3`. This value mathematically maps the analog frequency domain to the discrete digital domain.

  

Section 3 represents the core mathematical synthesis. The function `signal.firwin` is explicitly called. This function encapsulates the entire convolution operation of generating an ideal sinc impulse response and applying a discrete window function in a single highly optimized routine. The `numtaps` argument is provided the variable `M` (`61`). The `cutoff` argument is provided the normalized frequency `Wn`. The critical argument `window='blackman'` explicitly dictates that the mathematical Blackman formulation defined in the theory section must be utilized to taper the sequence. Finally, the boolean flag `pass_zero=False` is fundamentally necessary; it instructs the algorithm that the zero-frequency (DC) component must be blocked, mathematically enforcing a high-pass topology rather than a low-pass topology. The output array `h_n` stores the exact 61 discrete filter coefficients.

  

Section 4 transitions the data from the discrete-time domain to the continuous frequency domain. The `signal.freqz` function calculates the discrete-time frequency response. The argument `b=h_n` passes the calculated FIR coefficients as the numerator of the transfer function, while `a=1.0` defines the denominator, confirming the system is strictly non-recursive (FIR) with no feedback poles. The `worN=4096` argument forces the function to evaluate the frequency response over an extremely dense grid of 4096 individual frequency bins, guaranteeing a perfectly smooth graphical output without interpolation artifacts. The `fs=fs` argument informs the function to scale the output frequency array directly into analog Hertz, rather than normalized angular frequency. Two arrays are returned: `frequencies`, containing the x-axis grid, and `complex_response`, containing the complex vectors defining magnitude and phase.

  

Section 5 isolates the raw data for analysis. The absolute magnitude of the complex response is extracted using `np.abs()`. Because human perception of signal strength is logarithmic, and stopband attenuation must be measured precisely, the raw magnitude is converted to decibels. The operation `20 * np.log10()` is utilized. To prevent a fatal mathematical domain error caused by calculating the logarithm of absolute zero in deep stopbands, `np.maximum(magnitude_response, 1e-10)` strictly limits the minimum calculable value to a minuscule floor. The phase response is extracted using `np.angle()`, which returns results bounded strictly between $-\pi$ and $\pi$. The `np.unwrap()` function geometrically removes artificial $2\pi$ phase jump discontinuities, revealing the perfectly straight, linear progression of the phase response over frequency.

  

Section 6 constructs a rigorous academic plot. A dual-axis layout is created. On the top plot, the frequency magnitude is drawn. A vertical red dashed line is explicitly drawn at exactly 150 Hz to serve as a strict visual proof. The curve visibly remains buried near -74 dB in the stopband (due to the Blackman window) and rises sharply, crossing the red line and settling uniformly at 0 dB (unity gain) for all frequencies exceeding 150 Hz, perfectly validating the High-Pass constraint. The bottom plot visualizes the phase, which presents as a perfectly straight descending line, empirically proving the linear phase property guaranteed by the symmetric 61-tap sequence.

  

## PROBLEM 9: DESIGN OF A BAND-STOP FIR FILTER USING A KAISER WINDOW

### 1. PROBLEM STATEMENT

**GIVEN:** An engineering specification demands the design of a Band-Stop Finite Impulse Response (FIR) Filter. The explicit purpose of this filter is to reject, or notch out, a specific range of frequencies spanning strictly between 45 Hz and 55 Hz. This specific frequency band is frequently targeted to aggressively eliminate 50 Hz or 60 Hz electrical power line noise interference from sensitive data streams. The system operates continuously at a designated sampling frequency of 300 Hz. The numerical order of the filter is required to be exactly 120. Furthermore, the design must be executed utilizing a Kaiser window. The Kaiser window formulation necessitates a specific beta shape parameter ($\beta$), which must be strictly set to $\beta = 8.0$ to guarantee exceptionally high rejection characteristics within the specified stopband.

  

**REQUIRED:**

A highly detailed computational model and mathematical exposition of the designated Band-Stop FIR Filter must be established. The underlying physics of band-stop frequency selection must be derived by mathematically summing low-pass and high-pass characteristics. The precise mathematical formulation of the Kaiser window, including the utilization of modified Bessel functions, must be explained and applied to truncate the ideal impulse response. A fully self-contained, executable script must be written to systematically compute the 121 discrete filter coefficients. The generated script must subsequentally analyze the frequency response to definitively prove that the signal magnitude specifically between 45 Hz and 55 Hz is deeply attenuated, while all other frequencies from zero to the Nyquist limit are passed uniformly.

  

### 2. CONCEPTUAL THEORY

To fully comprehend the structural design of a digital Band-Stop Finite Impulse Response (FIR) filter, the fundamental principles governing discrete-time signals and systems must be independently established. A signal existing in continuous physical reality, denoted as $x(t)$, cannot be directly processed by a digital computer. It must undergo sampling, a procedure where instantaneous measurements are recorded at a constant temporal interval known as the sampling period, $T_s$. The relationship between the discrete sample index $n$ and continuous time $t$ is defined as $t = nT_s$. The sampling frequency, denoted as $f_s$, is inversely proportional to the sampling period ($f_s = 1/T_s$). The Nyquist-Shannon sampling theorem dictates that to retain the true informational integrity of the continuous signal without destructive aliasing, $f_s$ must exceed twice the highest frequency present in the analog signal. The absolute maximum frequency that a digital system can represent is exactly $f_s / 2$, universally known as the Nyquist frequency.

  

Digital filtering is accomplished through discrete mathematical convolution. A digital filter is a specialized Linear Time-Invariant (LTI) system characterized by its impulse response, $h[n]$. Convolution describes how an input sequence $x[n]$ is processed by the impulse response $h[n]$ to create a filtered output sequence $y[n]$, defined by the summation:

  

$$y[n] = \sum_{k=-\infty}^{\infty} x[k]h[n-k]$$

A Finite Impulse Response (FIR) filter is characterized by an impulse response that possesses a finite number of non-zero terms. The duration of this response is dictated by the number of filter taps, $M$. The mathematical filter order is denoted as $N$, where the fundamental relationship is $M = N + 1$. The paramount advantage of constraining a filter to a finite length and enforcing exact coefficient symmetry is the guaranteed realization of strictly linear phase. A linear phase response ensures that all harmonic frequency components of a signal are delayed in time by the exact same amount, preserving the true morphological shape of complex waveforms, which is utterly critical in sensitive domains like biomedical signal processing or audio engineering.

  

The spectral behavior of the filter is analyzed in the frequency domain via the Discrete-Time Fourier Transform (DTFT). The DTFT translates a discrete sequence $h[n]$ into a continuous function of normalized angular frequency $\omega$. The mapping from continuous frequency $f$ to normalized angular frequency is strictly defined by $\omega = 2\pi(f/f_s)$, placing the Nyquist limit precisely at $\omega = \pi$.

  

An ideal band-stop filter is mathematically designed to flawlessly transmit frequencies from DC ($\omega = 0$) up to a lower cutoff frequency $\omega_{c1}$, completely annihilate all frequencies between the lower cutoff $\omega_{c1}$ and an upper cutoff frequency $\omega_{c2}$, and perfectly transmit all frequencies from $\omega_{c2}$ up to the Nyquist frequency $\pi$. The ideal frequency response, $H_{bsd}(e^{j\omega})$, is essentially a constant value of $1$ everywhere except within the defined stopband $\omega_{c1} < |\omega| < \omega_{c2}$, where it is precisely $0$.

  

The mathematical realization of an ideal band-stop filter is constructed by combining the characteristics of an ideal low-pass filter and an ideal high-pass filter. Specifically, the system is designed to pass everything below $\omega_{c1}$ (a low-pass operation) and pass everything above $\omega_{c2}$ (a high-pass operation). In the discrete-time domain, this addition of frequency responses is directly equivalent to the addition of their respective impulse responses.

  

To determine these time-domain sequences, the Inverse Discrete-Time Fourier Transform (IDTFT) is applied. The ideal, continuous-time impulse response for a band-stop filter is the linear summation of the ideal low-pass and high-pass sinc functions, resulting in a mathematical structure defined as:

  

$$h_{bsd}[n] = \frac{\sin(\omega_{c1} n)}{\pi n} + \left( \delta[n] - \frac{\sin(\omega_{c2} n)}{\pi n} \right)$$

where $\delta[n]$ represents the unit impulse function.

  

This ideal mathematical formulation presents an absolute physical impossibility. The derived sequence $h_{bsd}[n]$ requires infinite discrete samples spanning from negative infinity to positive infinity. Because the calculation of the current output would demand knowledge of signal samples from the infinite future (negative $n$), the system is non-causal. To forge a physically realizable system, the infinite sequence must be strictly truncated to a finite length of $M$ samples. Subsequently, the entire sequence must be shifted forward in time by exactly $N/2$ discrete samples to ensure the impulse response solely exists for $n \ge 0$.

  

However, abrupt rectangular truncation of an infinite sequence in the time domain creates extreme distortions in the frequency domain. Due to the properties of mathematical convolution, the sharp cutoff boundaries are heavily corrupted by violent oscillatory ripples that extend deep into both the passbands and the stopband. This unyielding physical artifact is known as the Gibbs phenomenon.

  

To effectively suppress these destructive ripples and enforce a smooth transition into the deep rejection notch required for a band-stop filter, the truncated sequence must be multiplied element-by-element by an advanced mathematical windowing function, $w[n]$.

  

The Kaiser window is universally regarded as one of the most powerful and flexible windowing functions in digital signal processing due to its mathematically parameterized nature. Unlike fixed windows (such as Hamming or Blackman), the Kaiser window utilizes a continuous tuning parameter, beta ($\beta$), which allows the engineer to continuously trade off the width of the main lobe (transition band steepness) against the maximum amplitude of the side lobes (stopband attenuation depth). The exact formulation of a Kaiser window of length $M$ is defined utilizing the modified Bessel function of the first kind and zeroth order, denoted as $I_0(\cdot)$:

  

$$w[n] = \frac{I_0\left(\beta \sqrt{1 - \left(\frac{2n - N}{N}\right)^2}\right)}{I_0(\beta)}$$

for $0 \le n \le N$. The denominator $I_0(\beta)$ serves as a strict normalization constant ensuring the peak of the window is exactly $1$.

  

When $\beta$ is increased, the window tapers much more aggressively towards its edges. Setting $\beta = 8.0$ configures the Bessel function to heavily penalize the extremities of the impulse response sequence. This extreme tapering forces a dramatic destructive interference of side lobes in the frequency domain, establishing an immensely deep stopband attenuation capable of plunging below $-80$ decibels. This intense rejection floor is perfectly suited for the complete annihilation of pervasive narrowband electrical interference, such as $50$ Hz or $60$ Hz power line noise. By applying this specific Kaiser window to the shifted, ideal band-stop impulse response, the final precisely tuned filter coefficients are resolved.

  

### 3. ALGORITHM DESIGN

The theoretical derivations must be meticulously structured into an executable computational algorithm. The objective is to calculate the precise numerical arrays defining the 120th-order Band-Stop FIR filter and rigorously validate its spectral rejection capabilities.

  

1. **Define System Constants:** The computational space must be initialized with the parameters extracted from the engineering directive. The universal sampling frequency ($f_s$) is designated as $300$ Hz. The strict lower stopband boundary ($f_{c1}$) is defined as $45$ Hz, and the upper stopband boundary ($f_{c2}$) is defined as $55$ Hz. The overall mathematical order of the filter ($N$) is fixed at $120$. The Kaiser shape parameter ($\beta$) is strictly defined as $8.0$.
    
      
    
2. **Determine Physical Tap Count:** The precise number of mathematical weights required to calculate the convolution must be defined. The equation $M = N + 1$ is employed. With $N=120$, the total number of sequential filter taps is definitively $121$.
    
      
    
3. **Execute Frequency Normalization:** The continuous analog frequency boundaries must be mapped into the bounded digital domain. The Nyquist frequency ($f_{nyq}$) is established as exactly half of the sampling frequency, yielding $150$ Hz. The lower and upper cutoff frequencies must be divided by this Nyquist rate to generate normalized values $W_{n1}$ and $W_{n2}$, producing a numerical array precisely representing the targeted noise band scaled between $0$ and $1$.
    
      
    
4. **Compute the Kaiser Window Array:** A discrete array of length $121$ must be formulated representing the Kaiser tapering function. The algorithm must evaluate the modified Bessel function of the first kind and zeroth order, utilizing the specified beta value of $8.0$, across a normalized time index vector mathematically centered at zero.
    
      
    
5. **Synthesize Final Filter Coefficients:** The ideal impulse response calculation and the windowing operation must be executed simultaneously. An algorithm specifically engineered for FIR synthesis must be employed. It must take the defined tap length ($121$), the normalized boundary array ($[W_{n1}, W_{n2}]$), and the mathematically generated Kaiser window. A specific topological command must be passed to force the algorithm to treat the boundaries as an exclusionary zone (band-stop), thereby guaranteeing DC and high frequencies are passed while the specified notch is suppressed. This generates the exact physical coefficient sequence $h[n]$.
    
      
    
6. **Execute Frequency Domain Transformation:** To mathematically prove the filter's efficacy, the time-domain coefficients must be evaluated in the frequency domain. The Fast Fourier Transform (FFT) equivalent operation must be invoked over a highly granular distribution of frequency bins (e.g., 4096 bins) spanning from zero up to the defined $300$ Hz sampling rate, yielding complex spectral data.
    
      
    
7. **Calculate Decibel Magnitude and Phase:** The raw complex data must be separated. The absolute vector length at each frequency bin must be calculated to determine magnitude, then mathematically transformed into a standardized logarithmic decibel scale to clearly expose the depth of the rejection notch. A geometric bounding logic must be applied to prevent logarithmic singularities. The angle of the complex data must be extracted and unwrapped to plot the phase trajectory.
    
      
    
8. **Render Visual Proof:** A dual-plot canvas must be constructed. The top graphical unit must trace the decibel magnitude across the continuous analog frequency spectrum from $0$ to $150$ Hz. Strict vertical demarcation lines must be drawn exactly at $45$ Hz and $55$ Hz. This will visually prove that the signal strength plummets severely exactly between these lines while remaining flat at $0$ dB everywhere else. The bottom graphical unit must trace the phase angle across the same frequency domain, visually confirming that despite the extreme amplitude manipulation in the notch, the phase progression remains strictly linear, preventing waveform distortion.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import scipy.signal as signal
import scipy.special as special
import matplotlib.pyplot as plt

# 1. Define System Constants
fs = 300.0             # Sampling Frequency in Hz
fc_low = 45.0          # Lower Stopband Boundary in Hz
fc_high = 55.0         # Upper Stopband Boundary in Hz
N = 120                # Filter Order
M = N + 1              # Number of Filter Taps
beta_val = 8.0         # Kaiser Window Beta Parameter
nyq_rate = fs / 2.0    # Nyquist Frequency in Hz

# 2. Execute Frequency Normalization
# Normalize the cutoff frequencies to the Nyquist rate (0 to 1 scale)
Wn_band = [fc_low / nyq_rate, fc_high / nyq_rate]

# 3. Synthesize Final Filter Coefficients
# Using firwin to design a Band-Stop filter with a Kaiser window.
# The 'window' parameter accepts a tuple for parameterized windows.
# pass_zero=True combined with an array of cutoffs forces a band-stop topology.
h_n = signal.firwin(numtaps=M, cutoff=Wn_band, window=('kaiser', beta_val), pass_zero=True)

# 4. Execute Frequency Domain Transformation
# Calculate the complex frequency response with extreme precision (4096 points)
frequencies, complex_response = signal.freqz(b=h_n, a=1.0, worN=4096, fs=fs)

# 5. Calculate Decibel Magnitude and Phase
magnitude_response = np.abs(complex_response)
# Apply maximum function to establish an absolute noise floor, preventing math domain errors
magnitude_db = 20 * np.log10(np.maximum(magnitude_response, 1e-10))
phase_response = np.unwrap(np.angle(complex_response))

# 6. Render Visual Proof
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

# Plot Magnitude Response
ax1.plot(frequencies, magnitude_db, color='purple', linewidth=2)
ax1.set_title(r'Band-Stop FIR Filter Magnitude Response (Kaiser Window, $\beta=8.0$, N=120)')
ax1.set_ylabel('Magnitude (dB)')
ax1.set_xlabel('Frequency (Hz)')
ax1.grid(True, which='both', linestyle='--', alpha=0.7)
ax1.axvline(fc_low, color='red', linestyle='--', label=f'Lower Edge: {fc_low} Hz')
ax1.axvline(fc_high, color='red', linestyle='--', label=f'Upper Edge: {fc_high} Hz')
ax1.set_ylim([-100, 5])
ax1.set_xlim([0, nyq_rate])
ax1.legend()

# Plot Phase Response
ax2.plot(frequencies, phase_response, color='teal', linewidth=2)
ax2.set_title('Band-Stop FIR Filter Phase Response')
ax2.set_ylabel('Phase (Radians)')
ax2.set_xlabel('Frequency (Hz)')
ax2.grid(True, linestyle='--', alpha=0.7)
ax2.axvline(fc_low, color='red', linestyle='--', alpha=0.5)
ax2.axvline(fc_high, color='red', linestyle='--', alpha=0.5)
ax2.set_xlim([0, nyq_rate])

plt.tight_layout()
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The computational sequence is instantiated via the Python programming language. The architecture depends heavily on the robust mathematical frameworks provided by `numpy` for core array manipulations and `scipy.signal` for the rigorous synthesis and analysis of the discrete-time digital filter. The module `scipy.special` is intrinsically invoked by the signal library to calculate the complex modified Bessel functions required by the Kaiser window topology. Finally, `matplotlib.pyplot` is commanded to generate the quantitative graphical visualizations required for strict engineering validation.

  

The execution begins in section 1 by precisely establishing the global environment variables explicitly ordered by the design specification. The scalar variable `fs` is strictly cast as a float representing $300.0$ Hz. The operational boundary frequencies bounding the targeted noise band are assigned to `fc_low` ($45.0$) and `fc_high` ($55.0$). The exact filter order `N` is enforced as integer $120$. To resolve the total convolution length, $1$ is added to $N$, assigning the absolute physical tap count `M` to $121$. The specialized Kaiser parameter `beta_val` is isolated and explicitly set to $8.0$. The absolute frequency ceiling of the digital system, `nyq_rate`, is mathematically derived as exactly half of the sampling frequency, yielding $150.0$ Hz.

  

In section 2, the continuous analog frequencies are rigorously scaled into the bounded fractional space required by standard signal processing algorithms. The continuous boundaries $45.0$ Hz and $55.0$ Hz are systematically divided by the Nyquist limit of $150.0$ Hz. This operation generates a precisely ordered Python list named `Wn_band`, structurally represented as `[0.3, 0.3666...]`. This array serves as the strict fractional coordinates where the mathematical characteristics of the transfer function must drastically shift.

  

Section 3 represents the paramount algorithmic synthesis. The `scipy.signal.firwin` function is systematically invoked to calculate the precise numerical array of length 121. The parameter `numtaps` is bounded by `M`. The critical `cutoff` argument is passed the normalized boundary array `Wn_band`. To structurally force the algorithm into a band-stop configuration rather than a band-pass configuration, the absolute boolean command `pass_zero=True` is defined. This specific command dictates that the continuous frequency band starting at exact zero (DC) must be permitted to pass unaffected, thus ensuring the rejection zone solely exists between the bounds of `Wn_band`. Finally, the `window` argument is passed a rigidly structured Python tuple `('kaiser', beta_val)`. This specific syntactical format commands the internal backend to dynamically evaluate the zeroth-order modified Bessel function of the first kind utilizing the exact beta parameter of $8.0$ across all 121 time indices. The final sequence is stored in memory as `h_n`.

  

Section 4 translates the time-domain impulse response array into its continuous frequency representation. The `signal.freqz` function is passed the synthesized coefficients array `h_n` as the system numerator (`b`), and an absolute scalar `1.0` as the system denominator (`a`), strictly ensuring the absence of infinite recursive feedback paths. The resolution parameter `worN=4096` ensures the resulting spectral data array is massively dense, preventing visual aliasing in the final rendered curve. By declaring `fs=fs`, the continuous frequency output array is mathematically mapped directly back to true analog Hertz, discarding the normalized angular space for human readability.

  

Section 5 performs the terminal data processing. The raw complex vectors mapped in `complex_response` are separated into pure amplitude and angle. The absolute length of the complex vector at each of the 4096 frequency bins is extracted using `np.abs()`. Because true engineering analysis of stopbands requires a logarithmic perspective to ascertain the true depth of attenuation, the linear magnitude is systematically converted to decibels. The strictly bounding expression `np.maximum(..., 1e-10)` acts as an impenetrable mathematical floor, absolutely preventing the function from attempting to calculate the base-10 logarithm of zero in regions of theoretically perfect signal annihilation. The raw geometric phase angle is calculated and then seamlessly processed through the `np.unwrap()` operation. This crucial step sequentially removes absolute jumps of $2\pi$ radians that mathematically occur due to arctangent domain wrapping, visually exposing the underlying smooth geometric continuity of the system's phase progression.

  

Section 6 constructs the rigorous final physical proof. A multi-pane plotting matrix is instantiated. Within the upper pane, a solid curve graphs the frequency magnitude in decibels. Precise vertical red dashed indicators are rigorously plotted exactly at $45$ Hz and $55$ Hz. The rendered plot physically proves the algorithmic success: the transfer function maintains exactly $0$ dB from DC up to $45$ Hz, then brutally plunges downward, crossing $-80$ dB within the specified notch due strictly to the aggressive $\beta=8.0$ Kaiser weighting, before returning symmetrically to $0$ dB above $55$ Hz. The lower pane graphs the processed phase response over the exact same frequency domain. The graphical output manifests as a rigidly perfect straight line of negative slope, conclusively demonstrating that while violent amplitude suppression occurs, the filter retains flawless linear phase integrity.

  

## PROBLEM 10: DESIGN OF A LOW-PASS FIR FILTER USING A RECTANGULAR WINDOW TO HIGHLIGHT GIBBS PHENOMENON

### 1. PROBLEM STATEMENT

**GIVEN:** A digital analysis task requires the computational construction of a Low-Pass Finite Impulse Response (FIR) Filter. The engineering objective is strictly limited to allowing signals up to a defined cutoff frequency of 20 kHz to pass completely unaltered. The system operates under a defined high-speed sampling frequency of 100 kHz. The filter order is rigidly constrained to an exact value of 40. Furthermore, a specific pedagogical constraint demands the utilization of a basic Rectangular window function. It is explicitly noted that this specific window choice is deliberately intended to highlight its incredibly narrow transition band, at the severe cost of inducing immense and visually explicit high passband ripple (Gibbs phenomenon).

  

**REQUIRED:**

A thorough mathematical exposition and computational synthesis of the designated Low-Pass FIR Filter must be achieved. The foundational theory explaining the synthesis of ideal low-pass systems from continuous sinc functions must be detailed. An exhaustive mathematical and physical explanation of the Gibbs phenomenon must be provided, defining exactly why abrupt rectangular truncation in the discrete-time domain causes permanent oscillatory corruption in the frequency domain. An executable script must be designed to calculate the exact 41 filter coefficients. The generated output must rigorously plot the magnitude response specifically to visually expose and highlight the destructive ripples oscillating around the unity gain passband and the heavily degraded stopband attenuation directly caused by the rectangular boundary conditions.

  

### 2. CONCEPTUAL THEORY

To fully grasp the intricate physics governing the design of a digital Low-Pass Finite Impulse Response (FIR) filter and the inevitable artifacts introduced by fundamental mathematical limitations, a foundational review of discrete-time signal processing is strictly required. Signals residing in the physical analog domain, denoted continuously as $x(t)$, must undergo a stringent sampling process to be computationally analyzed. This process records the continuous amplitude at exact, discrete, and uniform time intervals determined by the sampling period, $T_s$. The mathematical relationship is expressed as $t = nT_s$, where $n$ represents the integer index of the discrete sample. The sampling frequency, fundamentally defined as $f_s = 1/T_s$, determines the operational speed of the digital system. Adhering to the Nyquist-Shannon sampling theorem, the sampling frequency must rigidly exceed twice the absolute maximum frequency component existing within the continuous analog signal. Consequently, the absolute highest frequency limit representable within this digital system is bound at $f_s / 2$, known universally as the Nyquist boundary.

  

Digital signal modification is executed by routing a discrete sequence $x[n]$ through a Linear Time-Invariant (LTI) system. The sole and complete identifier of an LTI system's behavior is its impulse response, defined mathematically as $h[n]$. The continuous interaction between the input sequence and the system's impulse response is mathematically realized through linear convolution:

  

$$y[n] = \sum_{k=-\infty}^{\infty} x[k]h[n-k]$$

A Finite Impulse Response (FIR) filter specifically defines a system where the sequence $h[n]$ fundamentally contains a mathematically finite number of non-zero elements. The total count of these individual discrete coefficients is defined as the filter length, or tap count, $M$. The mathematical filter order $N$ strictly relates to the tap count via the equation $M = N + 1$. FIR filters are universally deployed across digital architecture due to their capacity to maintain a perfectly linear phase response, provided that the physical coefficient sequence exhibits absolute spatial symmetry. Linear phase guarantees that the entire spectrum of frequency components passes through the algorithm with an identical time delay, utterly eliminating phase distortion.

  

The true spectral behavior of any discrete sequence is isolated by transforming the data into the frequency domain utilizing the Discrete-Time Fourier Transform (DTFT). The DTFT translates a discrete time sequence into a continuous, perfectly periodic representation over a normalized angular frequency space $\omega$, calculated as $\omega = 2\pi(f/f_s)$.

  

An ideal low-pass filter is designed with perfect selective capability. It flawlessly preserves every frequency component residing from exactly zero frequency (DC) up to a rigid mathematical cutoff frequency $f_c$, while entirely annihilating any and all signal energy existing above $f_c$ up to the Nyquist limit. When represented in normalized angular frequency, $\omega_c = 2\pi(f_c/f_s)$. The idealized, theoretical frequency response $H_{lpd}(e^{j\omega})$ forms a perfect mathematical rectangle: exactly $1.0$ for $\vert{}\omega\vert{} \le \omega_c$, and exactly $0.0$ for $\omega_c < \vert{}\omega\vert{} \le \pi$.

  

To discover the exact numerical time-domain sequence required to produce this flawless frequency response, the Inverse Discrete-Time Fourier Transform (IDTFT) must be evaluated. The formal mathematical evaluation of the IDTFT integral over the continuous rectangular boundaries of the ideal low-pass filter unequivocally results in the unnormalized sinc function:

  

$$h_{lpd}[n] = \frac{\sin(\omega_c n)}{\pi n}$$

At the precise index of $n=0$, L'Hôpital's rule must be applied to evaluate the mathematical limit, resolving strictly to $\omega_c/\pi$. However, a severe, unavoidable physical paradox materializes. The continuous mathematical sine function oscillates eternally. Consequently, the ideal sequence $h_{lpd}[n]$ fundamentally exists from negative infinity to positive infinity. Because the mathematical calculation of an output relies on future inputs (negative $n$), the system inherently defies causality and is impossible to code into a physical processor. To synthesize a usable system, the infinitely oscillating sequence must be artificially truncated to a set length $M$, and mathematically shifted forward by $N/2$ samples to ensure zero values exist before $n=0$.

  

The act of abruptly terminating the infinite sinc sequence at exactly $M$ samples is mathematically identical to multiplying the infinite sequence by a rectangular window. A rectangular window sequence $w[n]$ equals exactly $1.0$ for $0 \le n \le N$, and exactly $0.0$ elsewhere. While computationally simplistic, this abrupt hard boundary introduces catastrophic spectral consequences fundamentally rooted in Fourier theory.

  

Multiplication in the discrete-time domain dictates a mathematical convolution in the continuous frequency domain. Therefore, the perfect rectangular shape of the ideal low-pass filter must be convolved with the frequency domain representation of the rectangular window itself. The DTFT of a rectangular window is precisely a periodic sinc function (also known as a Dirichlet kernel), which features a narrow central main lobe surrounded by extensive, highly energetic side lobes.

  

When the ideal frequency box is convolved with this Dirichlet kernel, the sharp perfect edges of the ideal filter are totally destroyed. In their place, violent, undulating oscillations appear both immediately before the cutoff boundary (within the passband) and immediately after the cutoff boundary (within the stopband). This specific mathematical degradation is universally classified as the Gibbs phenomenon.

  

The Gibbs phenomenon demonstrates a profound mathematical truth concerning the non-uniform convergence of Fourier series near discontinuities. As the filter order $N$ is increased, the oscillatory ripples physically squeeze closer toward the cutoff discontinuity, decreasing the width of the transition band. However, the absolute maximum amplitude of these ripples will stubbornly refuse to decrease. The peak amplitude of the passband ripple perpetually remains locked at approximately $9\%$ of the main signal amplitude, regardless of how computationally massive the filter order $N$ becomes. Simultaneously, the maximum theoretical stopband attenuation achievable when utilizing a rectangular window is brutally capped at merely $-21$ decibels. This means that while a rectangular window provides the steepest possible transition from passband to stopband for a given order, the inherent high-amplitude Gibbs ripples completely corrupt the signal amplitude inside the passband and severely compromise the ability to block high-frequency noise.

  

### 3. ALGORITHM DESIGN

The structural theory outlining the synthesis of a low-pass system corrupted by the Gibbs artifact must be mapped into a stringent computational sequence. The objective is to calculate the precise numerical array defining the 40th-order filter and rigorously generate visualizations explicitly proving the existence of the expected ripples.

  

1. **Define Core Physical Constraints:** The simulation architecture must be strictly initialized according to the specific parameters. The total sampling frequency ($f_s$) is defined as a massive $100$ kHz ($100,000$ Hz). The absolute threshold limit, or cutoff frequency ($f_c$), is fixed precisely at $20$ kHz ($20,000$ Hz). The mathematical order of the algorithm ($N$) is rigidly locked at $40$. The system is constrained to solely utilize a simple Rectangular window topology.
    
      
    
2. **Determine Algorithmic Tap Boundary:** The total volume of discrete mathematical coefficients required to execute the convolution must be established. Using the fundamental relationship $M = N + 1$, substituting $N=40$ resolves exactly to $41$ individual filter taps.
    
      
    
3. **Execute Boundary Normalization:** The true physical frequency values must be mathematically squashed into a normalized fractional index. The absolute Nyquist frequency limit ($f_{nyq}$) is determined by dividing the sampling rate by two, yielding $50$ kHz. The cutoff boundary of $20$ kHz is systematically divided by $50$ kHz to yield the strictly dimensionless normalized cutoff scalar $W_n$.
    
      
    
4. **Compute Transformed Filter Coefficients:** An advanced digital filter synthesis function must be mathematically deployed. The function must accept the exact tap length of $41$ and the calculated normalized scalar limit $W_n$. Critically, a specific topological override must be submitted to force the algorithm to apply a raw rectangular bounding box ('boxcar' in Python/SciPy nomenclature) rather than a smooth tapered window. This forces the mathematical truncation that ensures the Gibbs phenomenon physically manifests in the output coefficient sequence $h[n]$.
    
      
    
5. **Calculate Spectral Transformation:** The discrete 41-element time sequence must undergo a continuous frequency domain transformation to mathematically expose the filter's performance. The Fast Fourier Transform equivalent operation must be forcefully invoked over a dense matrix of continuously evaluated frequency points bounded strictly between absolute zero and the Nyquist limit of $50$ kHz.
    
      
    
6. **Extract Decibel Amplitude and Geometrical Phase:** The generated complex dataset must be separated into viewable axes. The absolute real magnitude is computationally separated from the complex plane. To precisely calculate and expose the shallow stopband characteristics, the raw linear magnitude is translated into a logarithmic decibel structure. The geometric angular phase sequence is separated, and any mathematically artificial integer jumps in the radian data are recursively unwrapped and smoothed.
    
      
    
7. **Render Visual Gibbs Artifacts:** A stringent dual-axis graphical model must be rendered explicitly to expose the expected mathematical flaws. The upper axis will graph the absolute frequency magnitude against true Hertz. Strict visual limiters will be plotted to zoom closely onto the unity gain ($0$ dB) line. A severe, oscillating wave pattern physically undulating around the $0$ dB mark exactly before the $20$ kHz boundary must be explicitly visualized, unequivocally confirming the presence of the Gibbs phenomenon passband ripple. The shallow stopband floor, stubbornly sitting near $-21$ dB, will explicitly demonstrate the poor rejection capabilities of the rectangular window.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import scipy.signal as signal
import matplotlib.pyplot as plt

# 1. Define Core Physical Constraints
fs = 100000.0          # Sampling Frequency in Hz (100 kHz)
fc = 20000.0           # Cutoff Frequency in Hz (20 kHz)
N = 40                 # Filter Order
M = N + 1              # Number of Filter Taps
nyq_rate = fs / 2.0    # Nyquist Frequency in Hz (50 kHz)

# 2. Execute Boundary Normalization
# Map the physical cutoff frequency strictly to a 0 to 1 scale
Wn = fc / nyq_rate

# 3. Compute Transformed Filter Coefficients
# Using firwin to synthesize a Low-Pass FIR filter.
# The window parameter is explicitly set to 'boxcar' which rigorously 
# applies a uniform Rectangular window, guaranteeing Gibbs ripples.
# pass_zero=True combined with a single scalar guarantees Low-Pass topology.
h_n = signal.firwin(numtaps=M, cutoff=Wn, window='boxcar', pass_zero=True)

# 4. Calculate Spectral Transformation
# Evaluate the system complex response across 4096 individual bins
frequencies, complex_response = signal.freqz(b=h_n, a=1.0, worN=4096, fs=fs)

# 5. Extract Decibel Amplitude and Geometrical Phase
magnitude_response = np.abs(complex_response)
magnitude_db = 20 * np.log10(np.maximum(magnitude_response, 1e-10))
phase_response = np.unwrap(np.angle(complex_response))

# 6. Render Visual Gibbs Artifacts
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

# Plot Magnitude Response with restricted Y-axis to highlight ripples
ax1.plot(frequencies, magnitude_db, color='darkred', linewidth=2)
ax1.set_title('Low-Pass FIR Filter Magnitude Response (Rectangular Window, N=40) - GIBBS RIPPLES EXPOSED')
ax1.set_ylabel('Magnitude (dB)')
ax1.set_xlabel('Frequency (Hz)')
ax1.grid(True, which='both', linestyle='--', alpha=0.7)
ax1.axvline(fc, color='black', linestyle='--', label=f'Cutoff Edge: {fc} Hz')
# Set Y-axis severely tight to visually expose the roughly 9% (~0.75 dB) passband ripple and shallow stopband
ax1.set_ylim([-60, 5]) 
ax1.set_xlim([0, nyq_rate])
ax1.legend()

# Plot Phase Response
ax2.plot(frequencies, phase_response, color='darkblue', linewidth=2)
ax2.set_title('Low-Pass FIR Filter Phase Response')
ax2.set_ylabel('Phase (Radians)')
ax2.set_xlabel('Frequency (Hz)')
ax2.grid(True, linestyle='--', alpha=0.7)
ax2.axvline(fc, color='black', linestyle='--', alpha=0.5)
ax2.set_xlim([0, nyq_rate])

plt.tight_layout()
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The computational sequence is explicitly engineered using the Python syntax architecture. The script strictly relies upon the high-performance numerical routines encapsulated within the `numpy` mathematical framework, and the specialized digital filtering classes native to the `scipy.signal` library. Accurate, quantitative graphical rendering is strictly managed by `matplotlib.pyplot`.

  

The algorithm is initialized in section 1 by embedding the hard physical constants detailed by the engineering prompt into isolated memory variables. The master sampling rate scalar `fs` is strictly instantiated as $100000.0$ Hz. The critical passage boundary parameter `fc` is defined precisely as $20000.0$ Hz. The exact complexity integer, filter order `N`, is locked to $40$. To calculate the total discrete coefficient volume necessary for convolution, the integer $1$ is added to $N$, resolving the tap count `M` strictly to $41$. The absolute computational boundary for aliasing, `nyq_rate`, is calculated seamlessly as half of `fs`, strictly isolating the maximum evaluable frequency to $50000.0$ Hz.

  

Section 2 processes the analog constraint into the digital domain. The strict requirement of standard synthesis algorithms is a dimensionless scalar bounded strictly between $0.0$ and $1.0$. The $20000.0$ Hz cutoff frequency is systematically divided by the Nyquist limit of $50000.0$ Hz. The resultant internal variable `Wn` precisely evaluates to $0.4$. This fractional value represents the exact digital coordinate where the transfer function must drastically plummet toward absolute zero.

  

Section 3 forms the fundamental mathematical core of the script. The robust `scipy.signal.firwin` function is systematically engaged to synthesize the discrete sequence `h_n`. The parameter `numtaps` is strictly assigned the variable `M` ($41$). The `cutoff` point is provided with the fractional scalar `Wn` ($0.4$). The pivotal syntactical choice rests in the `window` argument. By forcing this argument strictly to the string `'boxcar'`, the internal synthesis framework is commanded to entirely bypass complex tapering algorithms (like Blackman or Kaiser) and brutally apply a perfect rectangular boundary vector of ones and zeros. This syntactical command directly enforces the hard truncation of the internal continuous sinc function, thereby guaranteeing the physical manifestation of the Gibbs phenomenon artifact. The `pass_zero=True` boolean inherently defaults the topology to a low-pass state, maintaining DC integrity.

  

Section 4 continuously transforms the resulting finite sequence vector into a continuous frequency spectrum. The function `signal.freqz` calculates the complex plane response. The generated vector sequence `h_n` defines the system numerator `b`. A strictly static denominator `a=1.0` confirms that the calculated sequence acts independently as a non-recursive FIR matrix. The precision argument `worN=4096` forces an ultra-dense calculation grid preventing visual artifacts and rendering the expected high-frequency ripples flawlessly. Scaling is forced to true Hertz by supplying the `fs=fs` parameter.

  

Section 5 breaks down the resulting complex dataset into physically reviewable parameters. Absolute lengths of the complex vector map precisely to magnitude and are stored using `np.abs()`. Because true engineering observation of filter leakage demands logarithmic scaling, the magnitude values are multiplied by $20$ after calculating the base-10 logarithm. A strict `np.maximum()` floor prevents infinite domain calculation errors where theoretically perfect nulls reside. The raw geometric phase sequence is simultaneously extracted and passed strictly through the `np.unwrap()` modifier. This automatically detects large absolute discontinuous phase jumps (typically $2\pi$ bounds from the arctangent sequence) and mathematically sews them together to project a perfectly continuous trace.

  

Section 6 constructs the rigorous final physical proof. A multi-pane plot is systematically structured. The upper graphical canvas explicitly charts the frequency magnitude. Because the pedagogical constraint of this specific problem mandates the highlighting of the Gibbs phenomenon, the vertical decibel limiters (`set_ylim`) are severely squashed, isolating the range exclusively between $-60$ dB and $+5$ dB. By zooming tightly into the zero-decibel ceiling, the visual plot brutally exposes a severe sequence of undulating ripples oscillating fiercely exactly before the $20000$ Hz boundary, conclusively validating the mathematical reality of Fourier series non-uniform convergence caused by the `'boxcar'` argument. The lower canvas precisely traces the geometric phase response, ensuring that despite the severe magnitude corruption, the symmetrical 41-tap structure rigidly maintained linear phase characteristics from exactly $0$ Hz to $50000$ Hz. 

