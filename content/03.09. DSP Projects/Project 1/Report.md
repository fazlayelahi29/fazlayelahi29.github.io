# Sampling and Quantization in Digital Signal Processing using Python 

## PROBLEM 1: MULTI-FREQUENCY SIGNAL SAMPLING AND NYQUIST-SHANNON ALIASING ANALYSIS

### 1. PROBLEM STATEMENT

**GIVEN:** An analog, continuous-time, multi-frequency mathematical signal defined by the equation $x(t) = 10 \cos(120\pi t) + 5 \sin(100\pi t + 30^\circ) + 4 \sin(150\pi t + 45^\circ)$. The signal comprises three distinct sinusoidal components with varying amplitudes, angular frequencies, and phase shifts.

**REQUIRED:** The maximum frequency content of the given signal, denoted as $F_0$, must be extracted analytically. Subsequently, the continuous-time signal must be discretized (sampled) at three distinct sampling frequencies: (i) $F_s = 4F_0$, (ii) $F_s = 2F_0$, and (iii) $F_s = F_0$. A computational script must be formulated to visualize both the original continuous-time signal and its discrete-time sampled representations on a single figure. The visualization must be strictly constrained to display exactly three fundamental cycles of the composite continuous-time signal.

### 2. CONCEPTUAL THEORY

To computationally process real-world analog signals, a transformation from the continuous-time domain to the discrete-time domain is fundamentally required. A continuous-time signal, mathematically denoted as $x(t)$, exists for every real-valued instant of time $t$. In the domain of electrical engineering and computational physics, complex signals are frequently constructed through the superposition of fundamental sinusoidal waves, a principle derived from Fourier analysis. A standard sinusoidal function is defined by the generalized equation:


$$x(t) = A \cos(2\pi f t + \phi)$$


where $A$ represents the peak amplitude, $f$ represents the linear frequency measured in Hertz (Hz), $t$ represents the continuous time variable in seconds, and $\phi$ represents the phase shift in radians.

The given multi-component signal is expressed as:


$$x(t) = 10 \cos(120\pi t) + 5 \sin(100\pi t + 30^\circ) + 4 \sin(150\pi t + 45^\circ)$$


To determine the maximum frequency content, $F_0$, the angular frequency of each independent component must be isolated and converted to linear frequency. The relationship between angular frequency $\omega$ (measured in radians per second) and linear frequency $f$ is given by the equality $\omega = 2\pi f$.

Analyzing the first component, $10 \cos(120\pi t)$, the angular frequency is $\omega_1 = 120\pi$. By equating this to $2\pi f_1$, the linear frequency is extracted as $f_1 = 60$ Hz.
Analyzing the second component, $5 \sin(100\pi t + 30^\circ)$, the angular frequency is $\omega_2 = 100\pi$. Equating to $2\pi f_2$ yields $f_2 = 50$ Hz.
Analyzing the third component, $4 \sin(150\pi t + 45^\circ)$, the angular frequency is $\omega_3 = 150\pi$. Equating to $2\pi f_3$ yields $f_3 = 75$ Hz.

The maximum frequency content present within the composite signal is the highest of the individual component frequencies. Therefore, $F_0$ is determined to be $75$ Hz.

To visualize exactly three fundamental cycles of the composite signal, the fundamental period of the entire signal must be established. The fundamental frequency of a composite periodic signal is defined as the greatest common divisor (GCD) of the linear frequencies of all its individual periodic components. The frequencies are $60$ Hz, $50$ Hz, and $75$ Hz. The GCD of $60$ and $50$ is $10$. The GCD of $10$ and $75$ is $5$. Consequently, the fundamental frequency of the composite signal, $f_{fund}$, is $5$ Hz. The fundamental period, $T_{fund}$, is the reciprocal of the fundamental frequency, calculated as $T_{fund} = \frac{1}{f_{fund}} = \frac{1}{5} = 0.2$ seconds. To fulfill the requirement of displaying exactly three cycles, the total time duration for observation must be exactly $3 \times 0.2 = 0.6$ seconds.

The process of analog-to-digital conversion begins with sampling, which maps continuous time into discrete intervals. Mathematically, sampling is modeled as the multiplication of the continuous-time signal $x(t)$ by an infinite periodic train of Dirac delta functions, often referred to as an impulse train or a Dirac comb. The impulse train is expressed as:


$$s(t) = \sum_{n=-\infty}^{\infty} \delta(t - nT_s)$$


where $T_s$ is the sampling period. The resulting sampled signal, $x_s(t)$, is the product:


$$x_s(t) = x(t)s(t) = \sum_{n=-\infty}^{\infty} x(nT_s)\delta(t - nT_s)$$


This equation mathematically demonstrates that the continuous signal is extracted strictly at integer multiples of the sampling period $T_s$.

The integrity of this conversion is governed by the Nyquist-Shannon Sampling Theorem. The theorem dictates that for a bandlimited continuous-time signal with a maximum frequency component $F_0$, the signal can be uniquely reconstructed from its discrete samples if and only if the sampling frequency $F_s$ is strictly greater than or equal to twice the maximum frequency. This critical threshold, $2F_0$, is formally designated as the Nyquist rate.


$$F_s \geq 2F_0$$

If this condition is violated ($F_s < 2F_0$), a phenomenon known as aliasing occurs. In the frequency domain, the sampling operation causes the spectrum of the original continuous-time signal to be duplicated and shifted at integer multiples of the sampling frequency $F_s$. If $F_s$ is insufficiently large, these replicated spectral copies will physically overlap with one another. High-frequency components will systematically fold back into the lower frequency spectrum, adopting the identity of lower frequency aliases. Once this spectral overlapping occurs, it becomes mathematically impossible to isolate and recover the original high-frequency components, resulting in permanent distortion of the digital signal.

The three sampling scenarios presented in the problem statement must be evaluated against this theorem:

1. **Oversampling ($F_s = 4F_0 = 300$ Hz):** The sampling rate vastly exceeds the Nyquist rate of $150$ Hz. The spectral copies in the frequency domain are widely separated, and no aliasing occurs. The time-domain reconstruction will appear visually smooth and highly accurate.
2. **Nyquist Rate Sampling ($F_s = 2F_0 = 150$ Hz):** The sampling rate exactly equals the Nyquist limit. While theoretically sufficient for perfect reconstruction under ideal conditions, in practical time-domain visual plotting, sampling exactly at the Nyquist rate can sometimes capture only zero-crossings depending on the phase, resulting in a poor visual representation without proper sinc-interpolation.


3. **Undersampling ($F_s = F_0 = 75$ Hz):** The sampling rate is fundamentally below the Nyquist rate of $150$ Hz. Severe aliasing is mathematically guaranteed to manifest. Specifically, the $75$ Hz component will alias directly to $0$ Hz (DC). The $60$ Hz component will alias to $|60 - 75| = 15$ Hz. The $50$ Hz component will alias to $|50 - 75| = 25$ Hz. The sampled sequence will represent a completely different, lower-frequency signal than the original $x(t)$.



### 3. ALGORITHM DESIGN

A rigid computational algorithm is required to simulate the continuous-time signal, perform the periodic sampling at multiple rates, and visualize the comparative results. The algorithm must be structured sequentially as follows:

1. **Dependency Initialization:** The numerical computation library `numpy` must be imported to handle high-performance matrix and vector operations. The data visualization library `matplotlib.pyplot` must be imported to generate the required two-dimensional plots.


2. **Parameter Definition:** The fundamental frequencies extracted during the theoretical analysis ($f_1 = 60$, $f_2 = 50$, $f_3 = 75$) must be declared as computational variables.
3. **Maximum Frequency and Nyquist Calculation:** The maximum frequency variable $F_0$ must be defined as $75$ Hz. The fundamental period $T_{fund}$ must be calculated as $0.2$ seconds based on the greatest common divisor logic. The total observation duration must be set to exactly $3 \times T_{fund} = 0.6$ seconds to satisfy the constraints of the problem statement.


4. **Continuous-Time Array Generation:** A highly dense array of time values must be generated to simulate mathematical continuity. The `numpy.linspace` function must be utilized to create thousands of uniformly spaced temporal points between $0$ and $0.6$ seconds.


5. **Continuous Signal Computation:** The composite mathematical function $x(t)$ must be mapped across the continuous-time array. The phase angles defined in degrees must be programmatically converted to radians using appropriate scaling factors or library constants prior to computing the sine and cosine functions.
6. **Sampling Scenario 1 ($F_{s1} = 4F_0$):**
* The first sampling frequency must be calculated and assigned to a variable.
* The corresponding sampling period $T_{s1}$ must be computed as $1 / F_{s1}$.
* A discrete time vector for the sampled points must be generated using `numpy.arange`, stepping by $T_{s1}$.


* The signal equation must be re-evaluated using this discrete time vector to yield the sampled amplitudes.


7. **Sampling Scenario 2 ($F_{s2} = 2F_0$):**
* The second sampling frequency must be calculated.
* The corresponding sampling period $T_{s2}$ must be computed as $1 / F_{s2}$.
* A discrete time vector must be generated stepping by $T_{s2}$.
* The signal equation must be evaluated to capture the Nyquist-rate samples.


8. **Sampling Scenario 3 ($F_{s3} = F_0$):**
* The third sampling frequency must be defined, deliberately violating the Nyquist theorem.
* The corresponding sampling period $T_{s3}$ must be calculated as $1 / F_{s3}$.
* A discrete time vector must be generated stepping by $T_{s3}$.
* The signal equation must be evaluated to capture the undersampled, aliased data points.




9. **Visualization Subsystem Configuration:** A unified figure containing three distinct subplots stacked vertically must be instantiated using `matplotlib.pyplot.subplots`.
10. **Data Plotting Execution:**
* In each subplot, the simulated continuous-time signal must be plotted as a solid reference line using the `plot` function.


* In each corresponding subplot, the discretely sampled points must be overlaid using the `stem` function, which visually represents the discrete time mapping via vertical lines originating from the zero axis.




11. **Aesthetic Formatting:** Grid lines must be enabled for analytical clarity. Descriptive titles, x-axis labels ("Time (s)"), y-axis labels ("Amplitude"), and legends must be explicitly added to each subplot to ensure the visualization is academically rigorous. A tight layout function must be called to prevent overlapping of labels before the final rendering.



### 4. PROGRAM/SCRIPT/CODE

```python
import numpy as np
import matplotlib.pyplot as plt

# 1. Parameter Definition based on theoretical extraction
f1 = 60
f2 = 50
f3 = 75
F_0 = max(f1, f2, f3) # Maximum frequency content

# Fundamental frequency is GCD of 60, 50, 75 which is 5 Hz
f_fund = 5
T_fund = 1 / f_fund
total_duration = 3 * T_fund # Exactly 3 cycles

# 2. Continuous-Time Array Generation
# Utilizing 5000 points to simulate a true analog continuum
t_cont = np.linspace(0, total_duration, 5000)

# 3. Continuous Signal Computation
# Note: Phase angles in degrees (30 and 45) must be converted to radians
x_cont = (10 * np.cos(2 * np.pi * f1 * t_cont) + 
          5 * np.sin(2 * np.pi * f2 * t_cont + np.radians(30)) + 
          4 * np.sin(2 * np.pi * f3 * t_cont + np.radians(45)))

# 4. Sampling Scenario Executions
# Scenario (i): Fs = 4*F0 (Oversampling)
Fs1 = 4 * F_0
Ts1 = 1 / Fs1
n_ts1 = np.arange(0, total_duration, Ts1)
x_sampled1 = (10 * np.cos(2 * np.pi * f1 * n_ts1) + 
              5 * np.sin(2 * np.pi * f2 * n_ts1 + np.radians(30)) + 
              4 * np.sin(2 * np.pi * f3 * n_ts1 + np.radians(45)))

# Scenario (ii): Fs = 2*F0 (Nyquist Rate)
Fs2 = 2 * F_0
Ts2 = 1 / Fs2
n_ts2 = np.arange(0, total_duration, Ts2)
x_sampled2 = (10 * np.cos(2 * np.pi * f1 * n_ts2) + 
              5 * np.sin(2 * np.pi * f2 * n_ts2 + np.radians(30)) + 
              4 * np.sin(2 * np.pi * f3 * n_ts2 + np.radians(45)))

# Scenario (iii): Fs = F0 (Undersampling / Aliasing)
Fs3 = F_0
Ts3 = 1 / Fs3
n_ts3 = np.arange(0, total_duration, Ts3)
x_sampled3 = (10 * np.cos(2 * np.pi * f1 * n_ts3) + 
              5 * np.sin(2 * np.pi * f2 * n_ts3 + np.radians(30)) + 
              4 * np.sin(2 * np.pi * f3 * n_ts3 + np.radians(45)))

# 5. Visualization Subsystem
plt.figure(figsize=(12, 12))

# Plotting Scenario (i)
plt.subplot(3, 1, 1)
plt.plot(t_cont, x_cont, color='blue', alpha=0.5, label='Continuous Signal')
plt.stem(n_ts1, x_sampled1, linefmt='r-', markerfmt='ro', basefmt=" ", label=f'Sampled at Fs=4F0 ({Fs1} Hz)')
plt.title('Sampling at 4 times Maximum Frequency (Oversampling)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend(loc='upper right')

# Plotting Scenario (ii)
plt.subplot(3, 1, 2)
plt.plot(t_cont, x_cont, color='blue', alpha=0.5, label='Continuous Signal')
plt.stem(n_ts2, x_sampled2, linefmt='g-', markerfmt='go', basefmt=" ", label=f'Sampled at Fs=2F0 ({Fs2} Hz)')
plt.title('Sampling exactly at Nyquist Rate')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend(loc='upper right')

# Plotting Scenario (iii)
plt.subplot(3, 1, 3)
plt.plot(t_cont, x_cont, color='blue', alpha=0.5, label='Continuous Signal')
plt.stem(n_ts3, x_sampled3, linefmt='m-', markerfmt='mo', basefmt=" ", label=f'Sampled at Fs=F0 ({Fs3} Hz)')
plt.title('Sampling below Nyquist Rate (Aliasing)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend(loc='upper right')

plt.tight_layout()
plt.show()

```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The execution of the provided Python script systematically transforms the abstract mathematical theories of continuous-time modeling and Nyquist-Shannon sampling into a concrete computational framework. The foundational numerical architecture is heavily dependent upon the `numpy` library, abbreviated as `np`. This library is specifically selected because it facilitates vectorized array operations, which are computationally superior and strictly avoid the severe performance penalties associated with imperative `for` loops in standard Python syntax.

Initially, physical constants defining the signal's properties are instantiated. The frequencies $f_1$, $f_2$, and $f_3$ are strictly assigned their extracted values of 60, 50, and 75 respectively. The built-in Python `max()` function is leveraged to automatically resolve $F_0$, guaranteeing mathematical accuracy if the source frequencies were to be dynamically altered. The fundamental period logic mapped out in the algorithm design is explicitly coded, resulting in a `total_duration` variable that guarantees exactly three complete temporal cycles will be modeled.

To emulate a continuous analog domain within a discrete computer environment, a dense pseudo-continuous array is manufactured. The command `np.linspace(0, total_duration, 5000)` creates an array of 5,000 equidistant floating-point values bounded by zero and $0.6$. This extreme density is required so that when the array is mapped to pixel coordinates by the plotting library, it visually appears as a perfectly smooth curve, free of disjointed linear interpolations.

The calculation of the `x_cont` vector represents the core mathematical transformation. The NumPy mathematical functions `np.cos` and `np.sin` are utilized. Because the arguments to trigonometric functions in standard computational libraries mathematically demand radians rather than degrees, the given phase shifts of $30^\circ$ and $45^\circ$ cannot be directly inputted. The `np.radians()` conversion utility is explicitly invoked to convert these scalar angle degrees into their accurate radian equivalents before evaluation. Through NumPy's vectorization capabilities, the entire array `t_cont` is processed simultaneously to generate an identical-length array of continuous signal amplitudes `x_cont`.

The script then branches into the three distinct sampling directives mandated by the problem statement. For the first scenario, oversampling is implemented. The sampling frequency variable `Fs1` is assigned the product of 4 and $F_0$, resulting in 300 Hz. The corresponding time domain spacing between discrete samples, `Ts1`, is derived as the inverse of `Fs1`. To generate the specific, discretized time instances at which the continuous signal is intercepted by the mathematical impulse train, `np.arange(0, total_duration, Ts1)` is executed. Unlike `linspace` which defines a fixed number of total points, `arange` defines a strict numerical step size between points, which maps perfectly to the concept of a constant sampling period $T_s$. The identical trigonometric equation used for the continuous signal is subsequently reapplied, but the independent variable is replaced with the discrete time vector `n_ts1`. This perfectly mirrors the mathematical concept of evaluating $x(nT_s)$.

This identical block architecture is duplicated for the remaining two scenarios. The second scenario evaluates the critical Nyquist boundary where the sampling frequency `Fs2` equals $150$ Hz. The discrete time vector `n_ts2` is synthesized with a step size of $1/150$ seconds. The third block deliberately establishes a system destined for catastrophic aliasing by assigning `Fs3` to strictly $75$ Hz, severely violating the Nyquist constraint.

Following the raw data generation, the `matplotlib.pyplot` module is utilized to synthesize the visual evidence. The command `plt.figure(figsize=(12, 12))` spawns a high-resolution, blank canvas space mathematically proportioned to accommodate multiple data series without crowding. A vertical stack of subplots is created iteratively using the `plt.subplot(3, 1, k)` structure, where 3 represents the number of rows, 1 represents the column, and k is the active index.

Within each subplot, a layering methodology is employed. The simulated continuous data (`t_cont`, `x_cont`) is projected using the standard `plt.plot()` command. To visually differentiate the sampled data points from the continuous curve, the `plt.stem()` command is rigorously chosen. The `stem` function draws vertical lines from the zero-amplitude baseline directly to the calculated sampled data point, terminating in a marker. This specific visual formatting is strictly utilized in Digital Signal Processing literature to signify a discrete sequence derived from continuous space.

Formatting directives such as `plt.title()`, `plt.xlabel()`, and `plt.ylabel()` inject necessary metadata directly into the spatial fields. Finally, `plt.tight_layout()` is summoned prior to the `plt.show()` rendering command. This specific function algorithmically adjusts the padding parameters of the bounding boxes containing the subplots, ensuring that mathematical labels from the upper plots do not physically intersect or occlude the titles of the lower plots, guaranteeing textbook-quality output formatting.

---

## PROBLEM 2: DISCRETE SEQUENCE CONVERSION AND STEM VISUALIZATION OF PHASE-SHIFTED SIGNALS

### 1. PROBLEM STATEMENT

**GIVEN:** A mathematical equation describing a continuous-time signal characterized by phase-shifted sinusoidal components: $x(t) = 10 \cos(250\pi t + 60^\circ) + 5 \sin(200\pi t + 75^\circ)$.

**REQUIRED:** An appropriate sampling frequency must be determined analytically to ensure the signal can be digitized without suffering aliasing distortion. Once the sampling frequency is selected, the continuous-time signal $x(t)$ must be mathematically converted into a purely discrete numerical sequence designated as $x[n]$. A multi-stage visualization script must be engineered to plot the signal across a specific index range defined strictly as $-10 \leq n \leq 10$. The script must generate a four-panel figure displaying: (i) the approximated continuous original signal, (ii) the sampled signal plotted against the continuous time axis, (iii) the pure discrete signal plotted against the integer index $n$, and (iv) a superimposed final output combining all previous visualizations.

### 2. CONCEPTUAL THEORY

The mathematical divide between analog and digital environments is governed by the conceptual mapping of an independent variable describing time. A continuous-time signal is defined strictly as a mathematical function of a continuous, real-valued independent variable $t$, spanning across an infinite spectrum of infinitesimal subdivisions. Therefore, $x(t)$ processes physical phenomena smoothly without discontinuity.

To digitize the analog model, a transformation mathematically known as discretization must be executed. This relies on selecting a fixed interval known as the sampling period $T_s$. The continuous temporal continuum is discarded in favor of discrete snapshots acquired at uniform intervals mathematically mapped as integer multiples of the sampling period. When $t$ is explicitly substituted by $nT_s$, the continuous function $x(t)$ transforms into the sampled function $x(nT_s)$.

The true discrete sequence is symbolized mathematically as $x[n]$. It is imperative to understand that $n$ is not a physical unit of time measured in seconds; it is a dimensionless integer representing sequence index or sample number. The mathematical linkage between continuous time $t$ and integer index $n$ is defined by the core equation:


$$t = nT_s = \frac{n}{F_s}$$


where $F_s$ represents the linear sampling frequency in samples per second (Hertz).

Prior to implementing the mapping from $x(t)$ to $x[n]$, the physical properties of the target signal must be scrutinized to select a mathematically valid sampling frequency $F_s$. The given signal is:


$$x(t) = 10 \cos(250\pi t + 60^\circ) + 5 \sin(200\pi t + 75^\circ)$$


The angular frequencies are explicitly defined within the arguments of the trigonometric functions. The first component is defined by $\omega_1 = 250\pi$. Extracting the linear frequency yields $f_1 = \frac{250\pi}{2\pi} = 125$ Hz. The second component is defined by $\omega_2 = 200\pi$. Extracting the linear frequency yields $f_2 = \frac{200\pi}{2\pi} = 100$ Hz.

The maximum frequency content contained within the signal, denoted as $F_{max}$ or $F_0$, is therefore $125$ Hz. The fundamental rule of signal processing, the Nyquist-Shannon Sampling Theorem, mandates that the sampling frequency must strictly exceed twice the maximum frequency to allow for perfect signal preservation and to eliminate the possibility of aliasing. The absolute minimum threshold, the Nyquist rate, is calculated as $2 \times 125 = 250$ Hz.

Selecting a sampling frequency exactly at the Nyquist boundary ($250$ Hz) is theoretically sound but often produces degenerate visual plots because the sampled points might strictly align with the zero-crossings of the highest frequency sinusoidal wave. To guarantee visual fidelity and robust mathematical analysis in the time domain, a process called oversampling is instituted. An "appropriate sampling frequency" must be chosen that is significantly higher than the Nyquist bound. For this specific scenario, a sampling frequency of $F_s = 500$ Hz is mathematically selected. This corresponds to an oversampling ratio of 2 relative to the Nyquist rate, which will yield a clear representation of the waveform. The corresponding discrete sampling period is evaluated as $T_s = \frac{1}{500} = 0.002$ seconds.

The problem specifically requires mapping the signal into the discrete domain for an index range spanning from $n = -10$ to $n = 10$. The absolute time equivalent of this discrete span must be calculated to properly bound the continuous-time representation.
At the lower bound, $n = -10$, continuous time $t_{start} = -10 \times 0.002 = -0.02$ seconds.
At the upper bound, $n = 10$, continuous time $t_{end} = 10 \times 0.002 = 0.02$ seconds.

Substituting the mapping $t = nT_s$ into the foundational continuous equation yields the analytical discrete-time sequence expression:


$$x[n] = 10 \cos(250\pi (nT_s) + 60^\circ) + 5 \sin(200\pi (nT_s) + 75^\circ)$$


When generating the computational visualization, there exists a critical pedagogical distinction between a sampled signal plotted in continuous time versus a pure discrete sequence. A sampled signal plotted over a continuous time axis ($x(nT_s)$ versus $t$) highlights the temporal location in seconds where the samples were extracted. In stark contrast, a pure discrete sequence plot ($x[n]$ versus $n$) completely abstracts away physical time. The independent variable on the abscissa is simply the integer sequence number, and the spacing between consecutive points is defined unitarily.

### 3. ALGORITHM DESIGN

A rigid procedure is synthesized to transition from analog physics to digital structures while generating the four strictly mandated subplots.

1. **Environment and Constants Initialization:** The `numpy` and `matplotlib.pyplot` dependencies are established. The extracted highest frequency $F_0 = 125$ Hz is defined as a constant.


2. **Sampling Parameters Configuration:** The sampling frequency $F_s$ must be programmatically set to $500$ Hz to ensure high fidelity oversampling. The corresponding sampling period $T_s$ is subsequently derived.
3. **Discrete Index Array Generation:** An integer array named $n$ must be generated spanning exactly from $-10$ to $10$ inclusive, as strictly dictated by the problem statement. The `numpy.arange` function must be utilized with appropriate boundary integers.


4. **Time Domain Vector Mapping:**
* The corresponding time instances where samples occur must be mathematically computed by multiplying the discrete index array $n$ by the sampling period $T_s$. This produces the array $t_{discrete}$.
* To serve as the analog reference backdrop, a highly dense, pseudo-continuous time vector $t_{cont}$ must be mapped bridging the start and end values of $t_{discrete}$. The `numpy.linspace` function with high point density is required.




5. **Signal Sequence Computation:**
* The continuous-time signal array $x_{cont}$ must be processed by mapping the given equation across $t_{cont}$. Degrees must be systematically converted to radians using `np.radians` or multiplying by $\frac{\pi}{180}$ prior to trigonometric evaluation.
* The true discrete sequence array $x\_n$ must be generated by mapping the same mathematical logic over the $t_{discrete}$ vector. Because $t_{discrete} = nT_s$, this strictly satisfies the definition of $x[n]$.


6. **Graphic Multi-Panel Architecture Generation:** A unified figure with a two-by-two grid of subplots must be instantiated to cleanly separate the required visual stages.
7. **Panel 1: Original Continuous Signal Output:** Within the first upper quadrant, the dense $x_{cont}$ versus $t_{cont}$ arrays must be plotted using a standard line plotting methodology to visually mimic an analog oscilloscope trace.


8. **Panel 2: Sampled Signal Visualization:** Within the second upper quadrant, the $x\_n$ array must be plotted against the $t_{discrete}$ array strictly using the mathematical `stem` function. The x-axis must retain physical units of seconds, visually proving the exact temporal origin of the discretized points.


9. **Panel 3: Pure Discrete Sequence Validation:** Within the lower-left quadrant, the core discretization concept must be displayed. The $x\_n$ array must be plotted exclusively against the integer array $n$ using the `stem` function. Physical time must be aggressively stripped from the x-axis, replaced entirely by integer sequence indices.
10. **Panel 4: Composite Superposition Overlay:** Within the final lower-right quadrant, all computed arrays must be overlaid. The continuous signal curve must serve as the background reference. The discrete points representing the sampled instance must be plotted over the continuous line using `stem` markers mapped onto physical time, proving the geometric interception points are flawless.


11. **Final Presentation Directives:** Grid lines, precise titles reflecting the mathematical state of each plot, defined axis labels, and tight layout geometry adjustments must be rigidly applied prior to display generation.



### 4. PROGRAM/SCRIPT/CODE

```python
import numpy as np
import matplotlib.pyplot as plt

# 1. Frequency Analysis and Parameter Definition
f1 = 125
f2 = 100
F_0 = max(f1, f2) # Max frequency is 125 Hz

# 2. Selecting Appropriate Sampling Frequency (Oversampling)
Fs = 500  # Chosen to be > 2*F0 (250 Hz) for clear visualization
Ts = 1 / Fs

# 3. Generating Discrete Index Range as requested (-10 <= n <= 10)
n_index = np.arange(-10, 11) # 11 is exclusive, stops at 10

# 4. Mapping Discrete Index to Physical Time
t_discrete = n_index * Ts

# Bounding limits for the continuous reference signal
t_start = t_discrete[0]
t_end = t_discrete[-1]

# Generating a high-density continuous time array for analog approximation
t_cont = np.linspace(t_start, t_end, 2000)

# 5. Signal Evaluation
# Note: Degrees must be converted to radians
phase1_rad = np.radians(60)
phase2_rad = np.radians(75)

# Continuous-time approximation calculation
x_cont = 10 * np.cos(2 * np.pi * f1 * t_cont + phase1_rad) + \
         5 * np.sin(2 * np.pi * f2 * t_cont + phase2_rad)

# True discrete sequence calculation x[n] mapped via n*Ts
x_n = 10 * np.cos(2 * np.pi * f1 * t_discrete + phase1_rad) + \
      5 * np.sin(2 * np.pi * f2 * t_discrete + phase2_rad)

# 6. Structuring Visualization Geometry
plt.figure(figsize=(14, 10))

# Subplot (i): Original Signal 
plt.subplot(2, 2, 1)
plt.plot(t_cont, x_cont, 'b-', label='Analog x(t)')
plt.title('i) Original Continuous-Time Signal')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend()

# Subplot (ii): Sampled Signal on Time Axis
plt.subplot(2, 2, 2)
plt.stem(t_discrete, x_n, linefmt='r-', markerfmt='ro', basefmt=" ", label='Sampled x(nT_s)')
plt.title('ii) Sampled Signal (Plotted against Time)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend()

# Subplot (iii): Discrete Signal Sequence on Index Axis
plt.subplot(2, 2, 3)
plt.stem(n_index, x_n, linefmt='g-', markerfmt='go', basefmt=" ", label='Discrete sequence x[n]')
plt.title('iii) Discrete Signal Sequence')
plt.xlabel('Sample Index (n)') # Axis is strictly integer indices, not time
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend()

# Subplot (iv): Final Output Overlay
plt.subplot(2, 2, 4)
plt.plot(t_cont, x_cont, 'b-', alpha=0.5, label='Original x(t)')
plt.stem(t_discrete, x_n, linefmt='k-', markerfmt='ko', basefmt=" ", label='Extracted x[n]')
plt.title('iv) Final Output Overlay (Continuous + Discrete)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend(loc='lower right')

plt.tight_layout()
plt.show()

```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The underlying methodology of this specific script demonstrates the core separation between physical temporal reality and abstract integer-based sequence processing in computational mathematics. The initial parameter extraction establishes the core frequency dynamics without direct physical simulation.

The first pivotal code execution occurs when `n_index = np.arange(-10, 11)` is declared. The `np.arange` function in NumPy generates arrays spanning a defined interval. It is inclusive of the starting boundary parameter but rigorously exclusive of the stopping boundary parameter. Therefore, to ensure that the strict condition of $-10 \leq n \leq 10$ is met as delineated by the problem constraints, the stop argument must be defined as $11$. This fundamental integer array forms the backbone of the sequence domain.

The temporal transformation is subsequently enacted mathematically by the scalar multiplication `t_discrete = n_index * Ts`. This operation is implicitly vectorized by the NumPy library, applying the mapping formula $t = nT_s$ simultaneously across all 21 elements of the index sequence without manual iterative loops. To synthesize the mathematical analog reference required for juxtaposition, the bounding box of the continuous domain is extracted using standard array indexing: `t_start = t_discrete[0]` extracts the initial boundary, and `t_discrete[-1]` fetches the final element. A dense domain `t_cont` consisting of $2000$ perfectly spaced coordinate points is built using `np.linspace` between these derived bounds.

The continuous and discrete amplitude arrays, `x_cont` and `x_n`, are generated precisely through equivalent trigonometric formulas mapped across their respective independent vectors (`t_cont` and `t_discrete`). The `np.radians` function ensures computational correctness, rectifying the user's base-$360$ degree input into the natural radian framework required by underlying $C$-based math libraries utilized by Python.

The multi-panel visualization mapping dictates the structural logic of the Matplotlib subroutine. The canvas is geometrically partitioned utilizing `plt.subplot(2, 2, k)`. This explicitly creates a $2 \times 2$ structural grid.

* In the first grid location (`k=1`), `plt.plot(t_cont, x_cont)` strictly executes standard continuous interpolation, drawing straight line segments between adjacent dense coordinates in the array to present an analog illusion.


* In the second grid location (`k=2`), the array `x_n` is plotted against `t_discrete` using the `plt.stem()` function. The format strings `linefmt='r-'` and `markerfmt='ro'` designate red vertical lines culminating in circular red markers. Here, the temporal reality is highlighted.


* The fundamental conceptual leap is isolated in the third grid location (`k=3`). The exact same amplitude array `x_n` is processed through the `stem` function, but the independent axis array provided is `n_index`. The visual output completely sheds any concept of seconds, milliseconds, or physical sampling rates. The x-axis ticks simply represent pure mathematical position integers ($-10$, $0$, $5$, etc.). This perfectly satisfies the academic definition of generating a discrete signal sequence $x[n]$.


* The final superposition block (`k=4`) layers the output for conclusive visual proof. The continuous curve is plotted first, with an alpha transparency modifier (`alpha=0.5`) applied to dim its physical presence. The discrete data is overlaid with black markers (`'ko'`). By utilizing the physical time vector `t_discrete` as the basis for the stem plot within this combined view, it provides geometric confirmation that every single mathematically extracted discrete sample falls directly upon the theoretically computed continuous waveform curve, validating the precision of the mapping structure.



---

## PROBLEM 3: SINC-INTERPOLATION RECONSTRUCTION AND MATHEMATICAL DERIVATION OF ALIASED COMPONENTS

### 1. PROBLEM STATEMENT

**GIVEN:** A continuous-time, multi-frequency signal defined as $x(t) = \frac{1}{2} \sin(14\pi t) + \frac{1}{3} \sin(18\pi t) + \frac{1}{5} \sin(24\pi t) + \frac{1}{7} \sin(30\pi t)$. The signal processing interval is strictly bounded to the time domain subset $0 \leq t \leq 2$. The signal is subjected to two distinct mathematical sampling protocols: (i) sampling at a frequency $F_s = 5F_0$, and (ii) sampling at a frequency $F_s = 1.5F_0$, where $F_0$ specifies the highest frequency component inherent to the original waveform.

**REQUIRED:** The discrete samples from both defined sampling scenarios must be utilized to computationally reconstruct the original analog signal. This reconstruction process must be implemented utilizing the Whittaker-Shannon ideal sinc interpolation mathematical formula. Furthermore, as an alternative methodology, the Python native built-in utility `resample()` must be simultaneously coded to execute the same reconstruction protocol. Additionally, for the specific sampling scenario resulting in an undersampled framework (case ii), a comprehensive analytical derivation must be supplied to deduce the exact time-domain mathematical expression of the resulting corrupted alias signal.

### 2. CONCEPTUAL THEORY

Converting a discrete numerical sequence back into a continuous physical analog reality is conceptually recognized as signal reconstruction or digital-to-analog conversion. Unlike elementary hold interpolation paradigms (such as zero-order hold which creates jagged stair-step artifacts, or first-order hold which connects samples via rigid linear segments), theoretically flawless reconstruction requires mathematically complex non-linear curve fitting.

According to the rigid proofs of the Nyquist-Shannon Sampling Theorem, a bandlimited continuous signal that was digitized at a sampling rate structurally exceeding the Nyquist rate ($F_s \geq 2F_0$) can be perfectly and infinitely recovered through the deployment of an ideal low pass filter in the frequency domain. In the time domain, the mathematical equivalent of filtering is defined by the operation of convolution. The impulse response of a theoretically perfect ideal low pass filter configured with a sharp cut-off frequency strictly set at half the sampling rate ($\frac{F_s}{2}$) is the normalized sinc function.

The normalized sinc function is mathematically articulated as:


$$h_r(t) = \text{sinc}\left(\frac{t}{T_s}\right) = \frac{\sin\left(\pi \frac{t}{T_s}\right)}{\pi \frac{t}{T_s}}$$


To reconstruct the continuous signal, every single discrete sample in the recorded sequence is multiplied by a uniquely time-shifted variant of this fundamental sinc function. The shift corresponds directly to the precise temporal location where the discrete sample was originally captured ($nT_s$). The resulting infinite series of overlapping sinc pulses is linearly summated across all sample locations to precisely reform the physical waveform. This core principle is formalized as the Whittaker-Shannon interpolation formula:


$$x_r(t) = \sum_{n=-\infty}^{\infty} x[n] \, \text{sinc}\left(\frac{t - nT_s}{T_s}\right)$$


where $x_r(t)$ denotes the reconstructed continuous approximation.

Prior to computational evaluation, the exact parameters of the provided signal must be deconstructed. The equation is:


$$x(t) = \frac{1}{2} \sin(14\pi t) + \frac{1}{3} \sin(18\pi t) + \frac{1}{5} \sin(24\pi t) + \frac{1}{7} \sin(30\pi t)$$


The specific linear frequencies are analytically derived by dividing each angular frequency by $2\pi$.
Component 1: $f_1 = \frac{14\pi}{2\pi} = 7$ Hz.
Component 2: $f_2 = \frac{18\pi}{2\pi} = 9$ Hz.
Component 3: $f_3 = \frac{24\pi}{2\pi} = 12$ Hz.
Component 4: $f_4 = \frac{30\pi}{2\pi} = 15$ Hz.

The maximum frequency entity is strictly isolated as $F_0 = 15$ Hz. Consequently, the minimum required Nyquist sampling rate for flawless preservation is $2F_0 = 30$ Hz.

The problem necessitates mathematical analysis of two separate sampling protocols:
**Protocol (i): $F_{s1} = 5F_0 = 75$ Hz.**
Because $75 \text{ Hz} > 30 \text{ Hz}$, the fundamental theorem is definitively satisfied. Sinc interpolation will yield a reconstructed signal $x_r(t)$ that is a mathematically identical clone of the original $x(t)$.

**Protocol (ii): $F_{s2} = 1.5F_0 = 22.5$ Hz.**
Because $22.5 \text{ Hz} < 30 \text{ Hz}$, the fundamental theorem is fundamentally violated, guaranteeing the creation of mathematically catastrophic aliasing distortion. The precise analytical time-domain identity of the resulting corrupted alias signal must be derived.
When sampling occurs at $F_s$, the physical frequency spectrum conceptually folds symmetrically around the Nyquist boundary, also known as the folding frequency. The folding boundary for this system is precisely $\frac{F_s}{2} = 11.25$ Hz. Any pure frequency content natively residing above $11.25$ Hz will forcefully fold back into the region below $11.25$ Hz, masquerading as a lower frequency alias.

The generalized analytical formula mapping a continuous analog frequency $f_{in}$ to its fundamental alias frequency $f_{alias}$ after sampling is defined by determining the integer multiple $k$ that minimizes the absolute difference:


$$f_{alias} = \vert{}f_{in} - kF_s\vert{}$$


where $f_{alias}$ is strictly bounded such that $0 \leq f_{alias} \leq \frac{F_s}{2}$.

Analyzing the specific sinusoidal components under the sampling condition $F_s = 22.5$ Hz:

1. **7 Hz Component:** Since $7 < 11.25$, it safely resides below the folding boundary. No aliasing occurs. The component remains mathematically unaltered as $\frac{1}{2} \sin(14\pi t)$.
2. **9 Hz Component:** Since $9 < 11.25$, it safely resides below the folding boundary. No aliasing occurs. The component remains completely unaltered as $\frac{1}{3} \sin(18\pi t)$.
3. **12 Hz Component:** Since $12 > 11.25$, extreme aliasing is guaranteed. The alias frequency is computed as $f_{alias, 3} = \vert{}12 - (1 \times 22.5)\vert{} = \vert{}-10.5\vert{} = 10.5$ Hz.
However, defining purely the frequency magnitude is insufficient; phase physics must be conserved. The mathematical mechanics of sampling a sinusoid dictating phase behavior must be leveraged. When $t = nT_s = \frac{n}{22.5}$, the discrete sample evaluation acts as follows:

$$\sin(2\pi (12) n / 22.5)$$



By mathematical manipulation, $12 = -10.5 + 22.5$. Substituting this yields:

$$\sin(2\pi (-10.5 + 22.5) n / 22.5) = \sin\left(-\frac{2\pi (10.5) n}{22.5} + 2\pi n\right)$$



The fundamental mathematical properties of trigonometric periodicity state that adding $2\pi n$ to a phase angle exerts zero net effect on the outcome. Furthermore, the odd symmetry physics of the sine function dictate that $\sin(-\theta) = -\sin(\theta)$. Therefore:

$$\sin\left(-\frac{2\pi (10.5) n}{22.5}\right) = -\sin\left(2\pi (10.5) \frac{n}{F_s}\right)$$



Transitioning this back to the continuous aliased approximation yields a final continuous component of $-\frac{1}{5} \sin(2\pi(10.5)t) = -\frac{1}{5} \sin(21\pi t)$.
4. **15 Hz Component:** Since $15 > 11.25$, extreme aliasing occurs. The alias magnitude is computed as $f_{alias, 4} = \vert{}15 - (1 \times 22.5)\vert{} = \vert{}-7.5\vert{} = 7.5$ Hz.
Applying similar phase preservation logic:

$$\sin(2\pi (15) n / 22.5)$$



Mathematically manipulating the term gives $15 = -7.5 + 22.5$.

$$\sin(2\pi (-7.5 + 22.5) n / 22.5) = \sin\left(-\frac{2\pi (7.5) n}{22.5} + 2\pi n\right) = -\sin\left(2\pi (7.5) \frac{n}{F_s}\right)$$



Transitioning this back to the continuous aliased analog approximation yields a component of $-\frac{1}{7} \sin(2\pi(7.5)t) = -\frac{1}{7} \sin(15\pi t)$.

By algorithmically summating all surviving and newly aliased physical components, the exact analytical time-domain mathematical expression of the completely corrupted signal is derived as:


$$x_{alias}(t) = \frac{1}{2} \sin(14\pi t) + \frac{1}{3} \sin(18\pi t) - \frac{1}{5} \sin(21\pi t) - \frac{1}{7} \sin(15\pi t)$$

To execute signal reconstruction computationally, aside from programming the manual sinc summation block, the `scipy.signal.resample` library utility can be deployed. This specific algorithm operates entirely in the frequency domain, mathematically executing a Fast Fourier Transform (FFT) on the sequence $x[n]$, expanding the spectral density array by padding it strictly with zeros to enhance temporal resolution, and performing an Inverse Fast Fourier Transform (IFFT) back to the temporal domain to manufacture the reconstructed continuum.

### 3. ALGORITHM DESIGN

A rigid computational architecture is required to synthesize the signals, compute manual mathematical convolution for sinc interpolation, and execute the secondary `resample` function.

1. **Dependencies Implementation:** `numpy`, `matplotlib.pyplot`, and `scipy.signal.resample` modules must be imported into the computational environment.


2. **Fundamental Initialization:** The four discrete linear frequencies must be declared based on theoretical extraction ($f_1 = 7, f_2 = 9, f_3 = 12, f_4 = 15$). Maximum frequency $F_0 = 15$ must be assigned. The simulation timeline is established via generating a highly dense array ranging strictly from $t=0$ to $t=2$ utilizing `numpy.linspace` with thousands of points.
3. **Continuous Signal Simulation:** The four-component analog equation $x(t)$ must be mathematically evaluated across the continuous timeline variable to form the reference source array.
4. **Sampling Scenario 1 Process (Oversampling, $Fs = 75$ Hz):**
* The sampling frequency $F_{s1}$ is set to $5 \times 15 = 75$ Hz. The discrete period $T_{s1}$ is calculated.
* A rigid time matrix corresponding to exact sampling instants must be generated utilizing `numpy.arange(0, 2 + Ts1, Ts1)`. Adding $T_{s1}$ to the stop limit guarantees inclusion of the terminal time boundary $t=2$.
* The original mathematical equation $x(t)$ must be evaluated utilizing the new discrete matrix to isolate sampled numerical sequence $x\_s1$.


5. **Manual Sinc Interpolation Execution (Protocol 1):**
* A one-dimensional matrix initialized entirely with zero values (`numpy.zeros`) must be manufactured strictly matching the length dimension of the highly dense continuous timeline array. This acts as an accumulator sequence.


* A massive computational loop must iterate through every discrete indexed data point in the sequence $x\_s1$.


* For every sampled instance located at $t_{current} = n \times T_{s1}$, a mathematically isolated, shifted sinc function must be explicitly constructed across the entire dense continuous time axis. The specific functional form must be exactly $x\_s1[n] \times \text{sinc}((t_{cont} - t_{current}) / T_{s1})$. It is critical to note that the `numpy.sinc` function implicitly includes a multiplicative factor of $\pi$ within its internal mathematical core definition, demanding careful argument manipulation.


* This dynamically constructed pulse must be aggressively summated directly into the initialized accumulator matrix, iteratively rebuilding the waveform layer by layer.


6. **Library-Assisted Interpolation Executions (Protocol 1):**
* The `resample` function must be mathematically invoked. The target output length parameter is rigorously defined by calculating the length of the highly dense continuous time matrix. This generates a reconstructed sequence array.




7. **Sampling Scenario 2 Process (Undersampling, $Fs = 22.5$ Hz):**
* The entire sampling timeline extraction process (step 4) and manual sinc summation convolution algorithm (step 5) must be independently and completely replicated using the severely crippled sampling frequency $F_{s2} = 1.5 \times 15 = 22.5$ Hz to forcefully generate a corrupted aliased waveform.




8. **Aliased Waveform Analytical Implementation:**
* The complex mathematical time-domain expression derived manually in the theoretical section must be explicitly coded into the numerical simulation across the dense time array $t_{cont}$ to act as an exact analytical overlay for the flawed reconstruction.


9. **Visual Validation Directives:** A comprehensive visual layout must be constructed with four individual panels utilizing Matplotlib subplotting logic. Plot combinations consisting of standard continuous tracing (`plot`) and discrete integer mapping (`stem`) must be used to prove mathematical alignment across the successful reconstruction, the heavily corrupted aliased reconstruction, and the exact equivalence between manual convolution and the built-in FFT `resample` method.



### 4. PROGRAM/SCRIPT/CODE

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import resample

# 1. Parameter extraction based on theoretical derivation
f1 = 7
f2 = 9
f3 = 12
f4 = 15
F_0 = max(f1, f2, f3, f4)

# 2. Dense Continuous-Time Simulation Array (strictly bounded 0 to 2 seconds)
# Density of 2000 ensures smooth analog visual approximation
t_cont = np.linspace(0, 2, 2000)

# 3. Continuous Analog Signal Construction
x_cont = (1/2)*np.sin(2*np.pi*f1*t_cont) + \
         (1/3)*np.sin(2*np.pi*f2*t_cont) + \
         (1/5)*np.sin(2*np.pi*f3*t_cont) + \
         (1/7)*np.sin(2*np.pi*f4*t_cont)

# =========================================================================
# Case (i): Fs = 5*F0 (Nyquist theorem rigorously satisfied)
# =========================================================================
Fs1 = 5 * F_0 # 75 Hz
Ts1 = 1 / Fs1

# Ensure the boundary value 2.0 is included in sampling
n_ts1 = np.arange(0, 2 + Ts1, Ts1)

# Sequence extraction
x_s1 = (1/2)*np.sin(2*np.pi*f1*n_ts1) + \
       (1/3)*np.sin(2*np.pi*f2*n_ts1) + \
       (1/5)*np.sin(2*np.pi*f3*n_ts1) + \
       (1/7)*np.sin(2*np.pi*f4*n_ts1)

# Manual Sinc Convolution Interpolation Algorithm
x_recon_manual_1 = np.zeros(len(t_cont))
for n in range(len(n_ts1)):
    t_shift = n * Ts1
    # Note: np.sinc(x) mathematically computes sin(pi * x) / (pi * x)
    sinc_pulse = x_s1[n] * np.sinc((t_cont - t_shift) / Ts1)
    x_recon_manual_1 += sinc_pulse

# Built-in scipy resample function
x_recon_resample_1 = resample(x_s1, len(t_cont))

# =========================================================================
# Case (ii): Fs = 1.5*F0 (Nyquist theorem severely violated -> Aliasing)
# =========================================================================
Fs2 = 1.5 * F_0 # 22.5 Hz
Ts2 = 1 / Fs2
n_ts2 = np.arange(0, 2 + Ts2, Ts2)

# Sequence extraction
x_s2 = (1/2)*np.sin(2*np.pi*f1*n_ts2) + \
       (1/3)*np.sin(2*np.pi*f2*n_ts2) + \
       (1/5)*np.sin(2*np.pi*f3*n_ts2) + \
       (1/7)*np.sin(2*np.pi*f4*n_ts2)

# Manual Sinc Convolution Interpolation Algorithm
x_recon_manual_2 = np.zeros(len(t_cont))
for n in range(len(n_ts2)):
    t_shift = n * Ts2
    sinc_pulse = x_s2[n] * np.sinc((t_cont - t_shift) / Ts2)
    x_recon_manual_2 += sinc_pulse

# Analytical expression of the theoretically derived alias signal
x_alias_analytical = (1/2)*np.sin(2*np.pi*7*t_cont) + \
                     (1/3)*np.sin(2*np.pi*9*t_cont) - \
                     (1/5)*np.sin(2*np.pi*10.5*t_cont) - \
                     (1/7)*np.sin(2*np.pi*7.5*t_cont)

# =========================================================================
# Graphic Plotting Architecture
# =========================================================================
plt.figure(figsize=(15, 14))

# Panel 1: Successful Sinc Reconstruction (Fs = 5F0)
plt.subplot(4, 1, 1)
plt.plot(t_cont, x_cont, 'b-', alpha=0.6, linewidth=3, label='Original x(t)')
plt.stem(n_ts1, x_s1, linefmt='r-', markerfmt='ro', basefmt=" ", label='Samples (Fs=75Hz)')
plt.plot(t_cont, x_recon_manual_1, 'k--', label='Manual Sinc Reconstruction')
plt.title('Case i: Perfect Sinc Reconstruction (Nyquist Satisfied)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend(loc='upper right')

# Panel 2: Verification of resample() function
plt.subplot(4, 1, 2)
plt.plot(t_cont, x_cont, 'b-', alpha=0.6, linewidth=3, label='Original x(t)')
plt.plot(t_cont, x_recon_resample_1, 'g--', linewidth=2, label='scipy resample() Reconstruction')
plt.title('Case i: Reconstruction using built-in resample() function')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend(loc='upper right')

# Panel 3: Failed Reconstruction (Fs = 1.5F0, Aliasing Manifestation)
plt.subplot(4, 1, 3)
plt.plot(t_cont, x_cont, 'b-', alpha=0.3, linewidth=2, label='Original x(t) [Hidden reference]')
plt.stem(n_ts2, x_s2, linefmt='m-', markerfmt='mo', basefmt=" ", label='Samples (Fs=22.5Hz)')
plt.plot(t_cont, x_recon_manual_2, 'r-', linewidth=2, label='Sinc Reconstruction (Heavily Distorted)')
plt.title('Case ii: Failed Reconstruction due to Aliasing (Nyquist Violated)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend(loc='upper right')

# Panel 4: Mathematical Validation of Derived Alias Equation
plt.subplot(4, 1, 4)
plt.plot(t_cont, x_recon_manual_2, 'r-', linewidth=4, alpha=0.5, label='Numerical Sinc Reconstruction')
plt.plot(t_cont, x_alias_analytical, 'k--', linewidth=2, label='Theoretical Alias Expression Derivation')
plt.title('Case ii: Validation of Derived Alias Mathematical Expression')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend(loc='upper right')

plt.tight_layout()
plt.show()

```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The execution paradigm for the third script encompasses complex, computationally intensive mapping routines explicitly mirroring physical Digital-to-Analog mathematical principles. To expand mathematical functionality, the module `from scipy.signal import resample` is explicitly sourced into the namespace. This specific module employs extreme low-level $C$ code libraries to execute optimized Fast Fourier Transform arrays, sidestepping the severe inefficiencies present in iterative convolution arrays.

Initial conditions strictly bound the spatial environment. The highly dense matrix structure `t_cont` is established spanning zero to two seconds. Generating the initial mathematical analog truth table `x_cont` requires evaluating four distinct sine elements linearly added together.

The primary sequence processing initiates with the oversampling block, `Fs1 = 75`. The boundary mapping sequence `n_ts1` is engineered utilizing `np.arange(0, 2 + Ts1, Ts1)`. Adding `Ts1` to the stop condition forces NumPy logic, which otherwise strictly excludes upper limits, to mathematically contain the final time instance at $t=2.0$ seconds precisely. This prevents the ultimate rightmost reconstruction boundary from abruptly truncating and generating calculation errors.

The core algorithmic manifestation of the Whittaker-Shannon interpolation formula is rigorously engineered within the manual iterative loop construct. Prior to looping, an empty numeric placeholder matrix structurally identical in size to `t_cont` is fabricated using `np.zeros(len(t_cont))`. This matrix behaves mathematically as a geometric accumulation tank. The structural `for n in range(len(n_ts1))` iteratively scans through every independent discrete index. During a specific mathematical iteration, the temporal instance $nT_s$ is isolated as `t_shift`.

The generation of the shifting pulse utilizes fundamental NumPy architectural design. The command `np.sinc((t_cont - t_shift) / Ts1)` mathematically computes a continuous interpolation curve strictly centered on `t_shift` and extending mathematically across the entire continuous framework matrix `t_cont`. It is conceptually imperative to recognize that the standard `np.sinc` function internalizes the constant $\pi$. It natively evaluates $\frac{\sin(\pi x)}{\pi x}$. Thus, multiplying the interior argument by $\pi$ manually would systematically corrupt the interpolation period. The newly constructed mathematical pulse curve is scaled globally by the singular exact sampled amplitude coefficient `x_s1[n]`. Finally, the `+=` algebraic logic executes an overlapping geometric summation, incrementally fusing the scaled sinc curve directly into the massive `x_recon_manual_1` accumulator block.

By stark contrast, solving the exact same oversampled reconstruction protocol via the `resample` function completely eliminates convolution block structures. The script merely calls `resample(x_s1, len(t_cont))`. This algorithm mathematically converts the discrete sequence directly into an FFT array, injects zeroes corresponding precisely to the difference in matrix lengths between the sampled array and continuous target array, and deploys an Inverse FFT protocol to instantly extrude a completed high-density array.

The undersampled sequence generation mirrors the previous methodology strictly but replaces the sampling variable with `Fs2 = 22.5` Hz. The manual sinc convolution is explicitly mapped over these new aliased coordinates, generating a dramatically corrupted temporal construct mathematically stored in `x_recon_manual_2`. Furthermore, to provide absolute validation of the theoretically sourced conceptual alias dynamics, the completely un-sampled, pure mathematical continuous formula derived previously in the analysis is forcefully evaluated into `x_alias_analytical`.

The presentation architecture mandates a substantial geometric layout to resolve four densely populated graphical frames. The `plt.subplot(4, 1, k)` structure sequentially orders the data visualization stack. Frame 1 displays the physical equivalence of manual interpolation alongside the originating continuous trace. A dashed line format (`'k--'`) is utilized so the continuous ground truth curve beneath the reconstruction is visibly verified through the gaps. Frame 2 identically maps the continuous truth against the FFT-processed built-in `resample` results. Frame 3 forces visual comparison of the mathematically distorted aliased reconstruction line traversing severely off-target pathing relative to the faintly plotted continuous truth line. The ultimate verification is processed in Frame 4, where the mathematically calculated manual sinc-convoluted output sequence is visually overlapped perfectly by the explicit, continuous evaluation of the theoretically derived analytical formula. This exact dimensional alignment definitively proves the strict conceptual linkage connecting discrete temporal violations, symmetric frequency aliasing boundaries, trigonometric phase shift mechanics, and Whittaker-Shannon convolution processing. 

