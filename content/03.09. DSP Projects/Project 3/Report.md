# DFT, CFT, FFT, CTFT, DTFT in Digital Signal Processing using Python 

## PROBLEM 1: COMPUTATION AND RECONSTRUCTION OF DISCRETE-TIME SEQUENCES USING THE DISCRETE FOURIER TRANSFORM MATRIX

### 1. PROBLEM STATEMENT

**GIVEN:** A discrete-time signal sequence, defined as $x[n] = \{1, 1, 1, 1\}$, with a sequence length of $N = 4$. The mathematical formulation of the Discrete Fourier Transform (DFT) is provided in matrix notation as $X_N = W_N x_N$, where $W_N$ represents the $N \times N$ complex Twiddle factor matrix (also known as the DFT matrix), and $x_N$ is the column vector of the input sequence. The complex conjugate matrix $W_N^*$ is required for the Inverse Discrete Fourier Transform (IDFT) operation, formulated as $x_N = \frac{1}{N} W_N^* X_N$.

  

**REQUIRED:** The algorithmic computation of the forward 4-point Discrete Fourier Transform (DFT) of the sequence $x[n]$ to yield the frequency domain representation $X[k]$, utilizing explicit matrix multiplication between the DFT matrix $W_N$ and the input vector. Subsequently, the exact reconstruction of the original time-domain sequence $x[n]$ from the computed frequency-domain coefficients $X[k]$ must be executed via the Inverse Discrete Fourier Transform (IDFT) matrix multiplication. A programmatic implementation using Python, specifically leveraging the `scipy.linalg` and `numpy` libraries, must be designed to validate the theoretical outputs, which are expected to be $X[k] = \{4, 0, 0, 0\}$ and reconstructed $x[n] = \{1, 1, 1, 1\}$.

  

### 2. CONCEPTUAL THEORY

In the domain of digital signal processing, the analysis of discrete-time signals inherently requires a mathematical transformation from the time domain into the frequency domain. This transformation facilitates the observation of the spectral components—namely, the amplitudes and phases of the underlying sinusoidal basis functions that constitute the signal. For a discrete-time signal of finite length $N$, this transformation is rigorously defined by the Discrete Fourier Transform (DFT).

  

The forward Discrete Fourier Transform calculates the frequency domain representation of aperiodic signals within a given time interval by mathematically assuming their periodic extension. For a generic signal $x[n]$ of length $N$, the DFT is mathematically defined as:

  

$$X[k] = \sum_{n=0}^{N-1} x[n] e^{-j \frac{2\pi}{N} k n}$$

where $k = 0, 1, 2, \dots, N-1$ represents the discrete frequency bins. The term $e^{-j \frac{2\pi}{N}}$ is of paramount importance; it represents a primitive $N$-th root of unity in the complex plane and is commonly denoted as the "Twiddle factor," $W_N$. Thus, the fundamental equation can be rewritten as:

  

$$X[k] = \sum_{n=0}^{N-1} x[n] W_N^{kn}$$

Because the DFT is a fundamentally linear operation mapping an $N$-dimensional vector $x[n]$ to another $N$-dimensional vector $X[k]$, it can be elegantly expressed as a linear algebraic operation. This involves defining an $N \times N$ transformation matrix, $W_N$, whose entries are defined by $W_N^{kn}$. For a general $N$-point system, the matrix formulation takes the structure:

  

$$X_N = W_N x_N$$

Where $X_N$ is the resulting $N \times 1$ column vector containing the frequency components, $x_N$ is the $N \times 1$ column vector of time-domain samples, and $W_N$ is structured as follows:

  

$$W_N = \begin{bmatrix} 1 & 1 & 1 & \dots & 1 \\ 1 & W_N^1 & W_N^2 & \dots & W_N^{N-1} \\ 1 & W_N^2 & W_N^4 & \dots & W_N^{2(N-1)} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & W_N^{N-1} & W_N^{2(N-1)} & \dots & W_N^{(N-1)(N-1)} \end{bmatrix}$$

For the specific case given in the problem where $N=4$, the Twiddle factor is evaluated as $W_4 = e^{-j \frac{2\pi}{4}} = e^{-j \frac{\pi}{2}} = -j$. Substituting this primitive root into the matrix structure yields the 4-point DFT matrix:

  

$$W_4 = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & -j & -1 & j \\ 1 & -1 & 1 & -1 \\ 1 & j & -1 & -j \end{bmatrix}$$

When the input sequence $x[n] = \{1, 1, 1, 1\}$ is multiplied by this matrix, the projection of the signal onto each complex sinusoidal basis function is calculated. Because the signal is a constant DC value (Direct Current, zero frequency), all spectral energy will perfectly accumulate in the $k=0$ frequency bin (yielding a magnitude of 4), while orthogonal cancellations will occur for all higher frequency bins (yielding magnitudes of 0).

  

To reverse this process and reconstruct the original sequence from the frequency domain, the Inverse Discrete Fourier Transform (IDFT) must be utilized. The fundamental equation for the IDFT is:

  

$$x[n] = \frac{1}{N} \sum_{k=0}^{N-1} X[k] W_N^{-kn}$$

In linear algebraic terms, this is achieved by taking the complex conjugate of the original DFT matrix, denoted as $W_N^*$. The inverse matrix relationship is defined rigorously as:

  

$$x_N = \frac{1}{N} W_N^* X_N$$

The scaling factor $\frac{1}{N}$ is mathematically required to normalize the magnitudes, as the forward matrix multiplication scales the inherent energy of the sequence by a factor of $N$. The complex conjugate matrix $W_N^*$ simply reverses the direction of the phase rotation, effectively re-synthesizing the time-domain waveform from the superposition of the orthogonal frequency components.

  

### 3. ALGORITHM DESIGN

The theoretical matrix operations must be mapped into a highly optimized computational pipeline. The exact chronological sequence of operations is defined as follows:

  

1. **Environment Initialization:** The necessary numerical computation libraries must be imported into the execution space. Specifically, `numpy` is required for array manipulation and vector instantiation, while the `dft` function from `scipy.linalg` is required to automatically construct the exact mathematical $W_N$ matrix.
    
      
    
2. **System Parameterization:** The sequence length parameter $N$ must be explicitly defined as the integer 4, corresponding to the requested 4-point transformations.
    
      
    
3. **Vector Instantiation:** The time-domain input sequence $x[n]$ must be initialized as an $N$-dimensional array consisting of unitary values $\{1, 1, 1, 1\}$.
    
      
    
4. **Matrix Generation:** The $N \times N$ DFT transformation matrix, $W_N$, must be procedurally generated utilizing the specialized library function, which evaluates the $e^{-j 2\pi k n / N}$ exponents for all indices $k$ and $n$.
    
      
    
5. **Forward Transformation (Matrix Multiplication):** The continuous forward discrete transformation must be computed by executing a formal mathematical dot product between the generated $W_N$ matrix and the input vector $x$.
    
      
    
6. **Magnitude Extraction:** Because the output frequency components are inherently complex numbers (containing real and imaginary parts), the absolute magnitude of the spectrum must be extracted to evaluate the physical amplitude at each frequency bin.
    
      
    
7. **Spectrum Output:** The computed magnitude vector must be displayed to confirm the expected theoretical output of $\{4, 0, 0, 0\}$.
    
      
    
8. **Inverse DFT Parameterization:** A new array representing the computed spectral coefficients, $X = \{4, 0, 0, 0\}$, must be explicitly initialized to serve as the input for the reconstruction phase.
    
      
    
9. **Inverse Transformation (Matrix Multiplication):** The IDFT must be executed. This involves evaluating the complex conjugate of the previously generated $W_N$ matrix, multiplying it by the frequency vector $X$ via a dot product, and scaling the entire resulting vector by the normalization factor $\frac{1}{N}$.
    
      
    
10. **Reconstruction Extraction and Output:** The absolute magnitude of the reconstructed time-domain signal must be extracted to eliminate infinitesimal floating-point complex errors, and the finalized reconstructed signal must be outputted to verify perfect agreement with the original input.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
from scipy.linalg import dft

# ==========================================
# PART 1: FORWARD DISCRETE FOURIER TRANSFORM
# ==========================================

# 1. Define sequence length N
N = 4

# 2. Instantiate the input time-domain sequence x[n]
x = np.ones(N)

# 3. Generate the NxN DFT Matrix W_N
W_N = dft(N)

# 4. Perform matrix multiplication for Forward DFT
# Using the @ operator for exact matrix dot product
X = W_N @ x

# 5. Extract the magnitude of the complex frequency vector
MagX = np.abs(X)

# 6. Output the Forward DFT Results
print("=== Forward DFT Computation ===")
print(f"Input Sequence x[n] : {x}")
print(f"DFT Matrix W_{N}:\n{np.round(W_N, 2)}")
print(f"Output Spectrum X[k]: {MagX}\n")

# ==========================================
# PART 2: INVERSE DISCRETE FOURIER TRANSFORM
# ==========================================

# 7. Instantiate the frequency-domain coefficients X[k]
X_coeffs = np.array([4.0, 0.0, 0.0, 0.0])

# 8. Perform matrix multiplication for Inverse DFT
# The complex conjugate of W_N is achieved via the .conj() method
# The scaling factor 1/N is applied to the final dot product
x_reconstructed = (W_N.conj() @ X_coeffs) / N

# 9. Extract the magnitude to resolve floating point residual imaginaries
MagX_reconstructed = np.abs(x_reconstructed)

# 10. Output the Inverse DFT Results
print("=== Inverse DFT Computation ===")
print(f"Input Spectrum X[k]       : {X_coeffs}")
print(f"Reconstructed Signal x[n] : {MagX_reconstructed}")
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The provided computational script executes the prescribed matrix mathematics with high precision by leveraging highly optimized underlying C-based array architectures.

  

The script commences with the importation of `numpy as np` and `dft` from `scipy.linalg`. NumPy is fundamental for the allocation of contiguous memory blocks for array operations, whereas the SciPy library is specifically chosen because it contains a highly optimized `dft(N)` subroutine. This subroutine prevents the necessity of manually coding nested `for`-loops to calculate Euler's formula for every matrix entry, thereby vastly increasing programmatic efficiency and reducing vulnerability to transcription errors.

  

In Part 1, the variable `N` is constrained to the integer `4`. The time-domain vector is created using `np.ones(N)`, which generates a 64-bit floating-point array of ones: `[1., 1., 1., 1.]`. The execution of `W_N = dft(N)` dynamically constructs the exact $4 \times 4$ complex matrix derived in the theoretical section. The critical calculation is handled by the operation `X = W_N @ x`. The `@` symbol in Python invokes the `__matmul__` operator, ensuring a rigorous mathematical dot product between a matrix and a vector, taking the row-by-column summations precisely as dictated by linear algebra. Because the elements in `W_N` are complex numbers (represented as `complex128` data types in NumPy), the resulting vector `X` also possesses complex data types. To convert this into a physically interpretable amplitude, `np.abs(X)` is invoked, which calculates the Euclidean norm $\sqrt{a^2 + b^2}$ for each complex element $a + jb$, yielding `[4.0, 0.0, 0.0, 0.0]`.

  

In Part 2, the methodology is reversed to establish the IDFT. A new sequence representing the previously computed spectrum is forced into the variable `X_coeffs` via `np.array([4.0, 0.0, 0.0, 0.0])`. The mathematical inverse equation $x_N = \frac{1}{N} W_N^* X_N$ is translated precisely into the syntax `(W_N.conj() @ X_coeffs) / N`. The `.conj()` method traverses the $4 \times 4$ DFT matrix in memory and flips the sign of every imaginary component, transforming $-j$ to $+j$. The `@` operator then performs the matrix multiplication against the spectral vector, and the result is element-wise divided by $N$ (`4`).

  

Due to the nature of standard floating-point arithmetic (IEEE 754), operations involving irrational constants like $\pi$ (used internally to generate the matrix) can leave infinitesimally small imaginary residuals (e.g., $+ 1.22 \times 10^{-16}j$). To eliminate these non-physical artifacts and present the pure real time-domain signal, `np.abs()` is applied to the reconstruction. The script concludes by printing the verified, reconstructed output of `[1.0, 1.0, 1.0, 1.0]`, proving the mathematical idempotence of the forward and inverse DFT matrix operations.

  

## PROBLEM 2: SPECTRAL ANALYSIS AND N-POINT FAST FOURIER TRANSFORM OF A BANDLIMITED SINC FUNCTION

### 1. PROBLEM STATEMENT

**GIVEN:** A continuous-time, unnormalized signal defined by the mathematical expression $x(t) = \text{sinc}(100t)$. The temporal observation window for this signal is defined with a total duration of $t_0 = 0.2$ seconds. The continuous signal is to be discretized (sampled) using a specific sampling period of $t_s = 8.3333 \times 10^{-4}$ seconds, equating to a sampling frequency of $f_s = 1 / t_s$ Hz. The discrete time vector spans symmetrically from $-t_0/2$ to $t_0/2 - t_s$.

  

**REQUIRED:** The algorithmic generation of the sampled discrete-time array for the provided sinc pulse. Following discretization, the N-point Fast Fourier Transform (FFT) algorithm must be leveraged to compute the frequency spectrum of the sampled signal. An exact, zero-centered frequency axis must be constructed to correctly map the spectral energy. Finally, a robust programmatic visualization must be generated using Matplotlib, containing three tightly layered subplots: the time-domain Sinc Pulse, the zero-centered Magnitude Spectrum, and the corresponding Phase Spectrum.

  

### 2. CONCEPTUAL THEORY

To understand the spectral analysis of continuous functions via digital computers, one must meticulously traverse the principles of discretization and algorithmic frequency transformations.

  

The function provided is the mathematically fundamental "sinc" function. In signal processing physics, the unnormalized sinc function is defined as:

  

$$\text{sinc}(x) = \frac{\sin(\pi x)}{\pi x}$$

The sinc pulse holds a position of supreme importance in linear system theory because it forms a Fourier transform pair with the rectangular function (a perfect low-pass filter). Specifically, a sinc pulse in the time domain corresponds to a perfectly flat, infinitely sharp bandlimited rectangular pulse in the frequency domain. As the pulse becomes narrower in the time domain, its spectral footprint expands in the frequency domain, a phenomenon dictated by the time-scaling property of the Fourier Transform.

  

Because digital computers process finite, discrete arrays rather than continuous analog variables, the continuous time variable $t$ must be replaced by a discrete time variable $n t_s$, where $t_s$ is the sampling interval. According to the Nyquist-Shannon sampling theorem, the sampling frequency $f_s = 1/t_s$ must be strictly greater than twice the highest frequency component present in the analog signal to prevent an irreversible corruption known as aliasing.

  

Once the signal is safely captured into an array of $N$ discrete points, its spectrum must be analyzed. While the standard matrix-based Discrete Fourier Transform (DFT) possesses a computational complexity of $O(N^2)$, making it egregiously slow for massive arrays, the Fast Fourier Transform (FFT) algorithm mathematically factorizes the DFT matrix into sparse sub-matrices. This paradigm, most commonly realized through the Cooley-Tukey algorithm, drastically reduces the necessary computational operations to $O(N \log_2 N)$.

  

When the FFT is computed, the resulting complex frequency array is strictly ordered from zero frequency (DC) up to the Nyquist frequency ($f_s/2$), followed immediately by the negative frequencies descending from $-f_s/2$ back toward zero. This inherently asymmetric data structure is non-intuitive for physical spectral observation. Therefore, an algorithmic shift must be applied to cyclically rotate the array, placing the zero frequency precisely at the center of the array, with negative frequencies on the left and positive frequencies on the right.

  

The frequency spectrum itself consists of complex variables $X[k] = A + jB$. The physical representation of this energy is divided into two separate spectra. The Magnitude Spectrum represents the absolute amplitude of the constituent sinusoidal waves and is calculated via the Pythagorean formulation:

  

$$\vert{}X[k]\vert{} = \sqrt{A^2 + B^2}$$

The Phase Spectrum represents the temporal offset or time delay of those sinusoidal waves, computed using the four-quadrant inverse tangent function:

  

$$\angle X[k] = \arctan\left(\frac{B}{A}\right)$$

By generating these two specific spectra alongside the original discretized time-domain signal, a complete, holistic mathematical characterization of the sinc pulse is achieved.

  

### 3. ALGORITHM DESIGN

To accurately discretize the signal and extract its spectrum, the following strict algorithmic procedure must be implemented:

  

1. **Parameter Initialization:** The critical variables dictating the physical limits of the system must be defined. The total duration $t_0$ is set to $0.2$, and the sampling period $t_s$ is set to $0.00083333$.
    
      
    
2. **Time Vector Generation:** A linearly spaced array must be constructed to represent the discrete time steps. The array must span from negative to positive time, specifically $[-t_0/2, t_0/2)$, incrementing by exactly $t_s$ for each element.
    
      
    
3. **Signal Formulation:** The discrete signal array $x[n]$ must be evaluated by passing the generated time vector into a programmatic sinc function. Because computational libraries often define the sinc function inherently with a factor of $\pi$, the argument must be carefully scaled. The mathematical formulation $100t$ is applied directly.
    
      
    
4. **Array Dimension Extraction:** The total number of sampled points, $N$, must be extracted dynamically from the generated time vector to ensure the FFT algorithm receives the correct dimensional parameter.
    
      
    
5. **Fast Fourier Transform Execution:** The $N$-point 1-dimensional discrete Fourier transform must be computed using the highly optimized FFT algorithm, producing the raw, unshifted complex frequency spectrum $X$.
    
      
    
6. **Frequency Axis Generation:** A corresponding discrete frequency vector must be generated based on the total points $N$ and the sampling period $t_s$. This ensures that the indices of the FFT output map to accurate physical frequencies in Hertz.
    
      
    
7. **Zero-Centering (Spectral Shifting):** Both the raw complex FFT array and the corresponding frequency axis array must be cyclically shifted so that the zero-frequency (DC) component resides exactly at the geometrical center of the arrays.
    
      
    
8. **Magnitude and Phase Extraction:** The absolute magnitude of the shifted complex array must be extracted. Simultaneously, the angular phase must be extracted in radians and mathematically converted into degrees by scaling with a factor of $180 / \pi$.
    
      
    
9. **Graphical Instantiation:** A multi-panel graphical figure must be initialized with specific dimensional parameters to ensure visual clarity. Three distinct subplots are required.
    
      
    
10. **Data Plotting and Formatting:**
    
      
    - Subplot 1 (Top): The original time-domain Sinc pulse must be plotted as a continuous line graph against time.
        
          
        
    - Subplot 2 (Middle): The zero-centered magnitude spectrum must be plotted using a stem plot (discrete vertical lines terminating in markers) against the true frequency axis.
        
          
        
    - Subplot 3 (Bottom): The zero-centered phase spectrum must be plotted using a discrete stem plot against the true frequency axis.
        
          
        
    - All axes must be rigorously labeled, grids activated, and the entire figure tightly formatted to prevent topological overlap before execution.
        
          
        

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt

# 1. Parameter Initialization
t0 = 0.2                     # Duration of sinc pulse in seconds
ts = 8.3333e-4               # Sampling period in seconds
fs = 1 / ts                  # Sampling frequency in Hz

# 2. Time Vector Generation
# Spanning from -t0/2 to t0/2 - ts
t = np.arange(-t0 / 2, t0 / 2, ts)

# 3. Signal Formulation
# The argument 100*t is scaled correctly for the desired pulse width
# Note: np.sinc(x) calculates sin(pi * x) / (pi * x)
x = np.sinc(100 * t)

# 4. Array Dimension Extraction
N = len(t)                   # Number of discrete sample points for the DFT

# 5. Fast Fourier Transform Execution
X_raw = np.fft.fft(x, N)

# 6. Frequency Axis Generation
# Generates the standard unshifted frequency bin locations
freq_raw = np.fft.fftfreq(N, ts)

# 7. Zero-Centering (Spectral Shifting)
# shift the zero-frequency component to the center of the spectrum
X_shifted = np.fft.fftshift(X_raw)
freq_shifted = np.fft.fftshift(freq_raw)

# 8. Magnitude and Phase Extraction
# Magnitude is scaled by N to normalize the DFT output
Magnitude = np.abs(X_shifted) / N

# Phase is extracted in radians, and converted mathematically to degrees
Phase_rad = np.angle(X_shifted)
Phase_deg = Phase_rad * (180 / np.pi)

# 9. Graphical Instantiation
plt.figure(figsize=(10, 8))

# 10. Data Plotting and Formatting
# --- Subplot 1: Time Domain Signal ---
plt.subplot(3, 1, 1)
plt.plot(t, x, 'b-', linewidth=2)
plt.title('Sinc Pulse')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)

# --- Subplot 2: Magnitude Spectrum ---
plt.subplot(3, 1, 2)
plt.stem(freq_shifted, Magnitude)
plt.title('Magnitude Spectrum')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.grid(True)

# --- Subplot 3: Phase Spectrum ---
plt.subplot(3, 1, 3)
plt.stem(freq_shifted, Phase_deg)
plt.title('Phase Spectrum')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Phase (Degrees)')
plt.grid(True)

# Finalize and display plot securely
plt.tight_layout()
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The algorithmic implementation seamlessly fuses numerical signal generation with advanced Fourier computational techniques, utilizing Python's most robust mathematical libraries.

  

The script initiates by mapping physical quantities to variables. The `np.arange` function constructs a half-open interval `[-0.1, 0.1)`. Because `np.arange` calculates its bounds dynamically based on the step size `ts`, it perfectly constructs an array representing discrete sampling instances without missing the endpoints. The temporal array `t` is then passed directly into `np.sinc(100 * t)`. It must be explicitly noted that NumPy's internal formulation of `sinc(x)` computes the normalized mathematical expression $\frac{\sin(\pi x)}{\pi x}$. By providing `100 * t`, the internal evaluation perfectly aligns with the requested bandwidth parameters of the system, creating a highly oscillatory pulse that decays away from $t=0$.

  

The Fast Fourier Transform is invoked via `np.fft.fft(x, N)`. The parameter `N` explicitly forces the FFT algorithm to evaluate exactly across the length of the sampled signal. This operation mathematically applies the Cooley-Tukey decimation-in-time algorithm to the array, drastically lowering execution time compared to naive matrix multiplication. However, the output array `X_raw` possesses an index structure starting from $0$ Hz, escalating to the Nyquist limit, and instantly jumping to the negative Nyquist limit and approaching zero from below.

  

To resolve this visual incoherence, the script dynamically calculates the exact physical frequency corresponding to each array bin using `np.fft.fftfreq(N, ts)`. This specialized function ingests the array size and the time between samples to output an array of physical Hertz values. Subsequently, `np.fft.fftshift()` is applied identically to both the frequency axis array and the complex FFT data array. The `fftshift` operation performs a cyclic permutation, splitting the array exactly in half and swapping the left and right sectors. This operation is non-destructive to the data but crucially realigns the DC component (0 Hz) to the absolute center of the data structures.

  

Magnitude extraction is handled via `np.abs(X_shifted) / N`. The division by $N$ is computationally mandatory to normalize the spectral power; without it, the resulting magnitude would scale improperly based solely on the density of the sampling rate rather than the true energy of the signal. The phase is extracted using `np.angle`, which executes the four-quadrant $\arctan2$ function on the real and imaginary components of the complex spectral array. Because engineers typically evaluate phase in degrees rather than radians, the vector is element-wise multiplied by the conversion factor `180 / np.pi`.

  

The data visualization block leverages `matplotlib.pyplot`. The `plt.subplot(3, 1, x)` paradigm divides the graphical figure into 3 rows and 1 column, iterating the active drawing zone `x` downward. The time-domain signal is plotted as a continuous vector using `plt.plot` with a solid blue line style `'b-'`, creating a visually fluid curve. Conversely, the frequency domains are plotted using `plt.stem`, which is the universally accepted standard for discrete spectral representations, illustrating the energy bins as distinct vertical lines ending in markers. The `plt.tight_layout()` function is strategically invoked prior to rendering to dynamically calculate the geometric bounding boxes of the three subplots, ensuring that titles and axis labels do not collide or render illegibly, thus producing pristine, textbook-grade output.

  

## PROBLEM 3: COMPUTATION OF LINEAR CONVOLUTION VIA FREQUENCY DOMAIN MULTIPLICATION USING DISCRETE FOURIER TRANSFORMS

### 1. PROBLEM STATEMENT

**GIVEN:** Two discrete-time, finite-length signal sequences. The first sequence is the primary signal $x[n] = \{2, 1, 2, 1\}$ with a length of $L_x = 4$. The second sequence represents the impulse response of an arbitrary discrete system, defined accurately as $h[n] = \{1, 2, 3, 4, 3\}$ with a length of $L_h = 5$.

  

**REQUIRED:** The mathematical computation of the exact linear convolution sum $y[n] = x[n] * h[n]$ utilizing strictly frequency-domain transformation methods. This requires the application of the Fast Fourier Transform (FFT) rather than standard time-domain iterative summation. The algorithm must automatically calculate the requisite zero-padding length required to prevent circular convolution aliasing artifacts. Forward FFTs must be applied to the padded signals, their complex spectral arrays must be multiplied element-wise, and the time-domain result must be recovered via the Inverse Fast Fourier Transform (IFFT). The algorithmic output must yield exactly $y[n] = \{2, 5, 10, 16, 18, 14, 10, 3\}$ and be dynamically verified against a built-in standard time-domain convolution function.

  

### 2. CONCEPTUAL THEORY

Convolution is arguably the most critical mathematical operation in linear systems engineering. It defines how the shape of one signal is modified by another. For Linear Time-Invariant (LTI) discrete systems, the output $y[n]$ is uniquely determined by the linear convolution of the input signal $x[n]$ and the system's inherent impulse response $h[n]$.

  

In the pure time domain, linear convolution is mathematically defined by the infinite summation:

  

$$y[n] = \sum_{m=-\infty}^{\infty} x[m] h[n-m]$$

This operation requires a "slide and multiply" methodology. The impulse response $h[n]$ is time-reversed (flipped), shifted step-by-step across the input signal $x[n]$, and at each overlapping interval, the products of the intersecting points are summed. For digital processors, computing this nested summation requires $O(L_x \cdot L_h)$ operations, which becomes prohibitively slow for large audio, seismic, or image arrays.

  

A far more computationally efficient pathway is established by the Convolution Theorem of the Fourier Transform. The theorem unequivocally proves that linear convolution in the time domain is mathematically identical to point-by-point multiplication in the frequency domain:

  

$$x[n] * h[n] \longleftrightarrow X[k] \cdot H[k]$$

However, a severe mathematical trap exists when utilizing the Discrete Fourier Transform (DFT or FFT) for this purpose. The standard DFT assumes the finite signals are fundamentally periodic. Therefore, multiplying two unpadded DFTs in the frequency domain inherently computes a _circular_ convolution, not a _linear_ convolution. In circular convolution, as the flipped signal slides past the boundary of the original sequence, it wraps around the end of the array (modulo arithmetic), contaminating the data with devastating aliasing.

  

To force the inherently periodic DFT to compute a pure, unaliased linear convolution, zero-padding must be meticulously applied. The theoretical required length of a linear convolution result, $N_{\text{linear}}$, for two sequences of length $L_x$ and $L_h$ is defined rigorously as:

  

$$N_{\text{linear}} = L_x + L_h - 1$$

To prevent aliasing, both input sequences $x[n]$ and $h[n]$ must be artificially extended by appending trailing zeros until they both reach an identical length exactly equal to $N_{\text{linear}}$. By injecting these regions of zero amplitude, the sliding circular multiplication wraps into empty space, completely mirroring the mechanics of linear convolution.

  

Once padded, the $N_{\text{linear}}$-point FFT of both sequences is computed, generating $X[k]$ and $H[k]$. These two complex arrays are multiplied precisely element-by-element to yield the convolved spectrum $Y[k]$. Finally, the Inverse Fast Fourier Transform (IFFT) is applied to $Y[k]$ to reconstruct the time-domain convolution $y[n]$. Utilizing the FFT for this frequency-domain multiplication pipeline reduces the algorithmic complexity from $O(N^2)$ to $O(N \log_2 N)$, a foundational acceleration utilized universally in digital filtering algorithms.

  

### 3. ALGORITHM DESIGN

The required methodology dictates a precise sequence of logical and mathematical operations to ensure absolute fidelity of the linear convolution output:

  

1. **Array Instantiation:** The two provided discrete sequences must be explicitly initialized into one-dimensional numerical arrays. $x[n]$ is defined with 4 elements, and $h[n]$ is defined with 5 elements based on the exact problem parameters.
    
      
    
2. **Constraint Calculation:** The total required convolution length, defined as `conv_len`, must be dynamically evaluated using the mathematical relation: Length of $x$ + Length of $h$ - 1.
    
      
    
3. **Zero-Padding Application:** Both input sequences must be physically appended with zeroes. The number of zeroes required for sequence $x$ is exactly `conv_len` minus its original length. The identical logic applies to sequence $h$. The padded vectors are stored in separate memory registers.
    
      
    
4. **Spectral Transformation (FFT):** The highly optimized Fast Fourier Transform algorithm must be executed independently on both padded time-domain arrays, strictly utilizing the dynamically calculated `conv_len` as the transform size constraint, yielding the complex vectors $X$ and $H$.
    
      
    
5. **Frequency Domain Multiplication:** A direct element-wise multiplication operation must be executed between the complex arrays $X$ and $H$. This yields a third complex array, $Y$, representing the complete spectral profile of the convoluted sequence.
    
      
    
6. **Inverse Reconstruction (IFFT):** The inverse FFT must be executed upon the spectral array $Y$, again strictly constrained to `conv_len`, returning the data back to the discrete time domain.
    
      
    
7. **Data Sanitization:** Because minor floating-point inaccuracies during complex spectral multiplication inevitably generate microscopic imaginary artifacts, the purely real component of the resulting IFFT array must be explicitly extracted to guarantee a clean mathematical output.
    
      
    
8. **Output Display Pipeline:** The padded signals must be logged to the console to visually prove the padding operation succeeded. The calculated convolution array must then be printed.
    
      
    
9. **Verification Engine:** To guarantee absolute algorithmic correctness, a completely separate, standard numerical convolution operation must be executed upon the pure, unpadded input signals using a built-in direct summation function. This verified array is printed and juxtaposed against the FFT-derived array to prove flawless mathematical equivalence.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np

# 1. Array Instantiation
x = np.array([2, 1, 2, 1])               # Primary signal sequence x[n] (Length = 4)
h = np.array([1, 2, 3, 4, 3])            # Impulse response sequence h[n] (Length = 5)

# 2. Constraint Calculation for Linear Convolution
L_x = len(x)
L_h = len(h)
conv_len = L_x + L_h - 1                 # Minimum length to avoid circular aliasing: 4 + 5 - 1 = 8

# 3. Zero-Padding Application
# np.pad adds values to the edges of an array. 
# Syntax: (zeros_before, zeros_after). 
x_padded = np.pad(x, (0, conv_len - L_x))
h_padded = np.pad(h, (0, conv_len - L_h))

# 4. Spectral Transformation (FFT)
# Perform forward DFT on both zero-padded sequences
X_freq = np.fft.fft(x_padded, conv_len)
H_freq = np.fft.fft(h_padded, conv_len)

# 5. Frequency Domain Multiplication
# Element-wise multiplication of complex arrays
Y_freq = X_freq * H_freq

# 6. Inverse Reconstruction (IFFT)
y_time_complex = np.fft.ifft(Y_freq, conv_len)

# 7. Data Sanitization
# Extract the real part to discard floating-point computational artifacts
y_time_real = np.real(y_time_complex)

# 8. Output Display Pipeline
print("=== Linear Convolution via FFT ===")
print(f"Signal x                 : {x}")
print(f"Signal h                 : {h}")
print(f"Padded signal x          : {x_padded}")
print(f"Padded signal h          : {h_padded}")
print(f"Required Convolution Len : {conv_len}")
# Round output for clean terminal presentation
print(f"Result of Convolution (y): {np.round(y_time_real, 2)}")

# 9. Verification Engine
# Verify utilizing NumPy's internal time-domain convolution function
y_verified = np.convolve(x, h)
print(f"Result verified with func: {y_verified}")
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

This script provides an unyielding, mathematically rigorous implementation of linear convolution by exploiting the computationally superior Fourier frequency space.

  

The execution begins by securely binding the data to the variables `x` and `h` utilizing `np.array()`. It is immediately crucial to observe that `h` is constructed with 5 elements. The algorithmic constraint `conv_len = L_x + L_h - 1` natively assesses the integers $4$ and $5$, dynamically computing the absolute minimum safe array size of $8$.

  

The zero-padding operation utilizes `np.pad()`. The syntax requires the target array, followed by a tuple denoting how many elements to append `(before, after)`. By supplying `(0, conv_len - L_x)`, the logic commands the interpreter to attach strictly $0$ elements to the front of sequence `x`, and precisely $8 - 4 = 4$ zeroes to the rear. The output array `x_padded` thus becomes `[2, 1, 2, 1, 0, 0, 0, 0]`. The identical operation pads `h` with $8 - 5 = 3$ zeroes, ensuring that both arrays are extended to exactly identical 8-point lengths in memory.

  

Transformation into the frequency domain is executed by passing the padded sequences into `np.fft.fft()`. Because NumPy operates via vectorized C-routines, the operation `X_freq * H_freq` does not perform mathematically restrictive matrix multiplication; instead, it executes hyper-efficient element-wise multiplication. Element 0 of array $X$ is multiplied by Element 0 of array $H$, up through element 7. This singular line of code collapses the entirety of the $O(N^2)$ time-domain shifting and summing loops into a single, instantaneous $O(N)$ operation within the frequency bounds.

  

The mathematical inversion occurs via `np.fft.ifft()`, mapping the convoluted spectrum `Y_freq` back to a discrete-time sequence `y_time_complex`. The inverse transform involves complex exponentials and divisions by irrational denominators, inherently leaving behind non-physical imaginary values (e.g., $18.0 + 3.42 \times 10^{-16}j$). Because physical linear sequences possess solely real amplitudes, `np.real()` is executed to instantly strip the imaginary floating-point anomalies, rendering an exact, purely real array.

  

The console output pipeline systematically lays bare the internal state changes, explicitly printing the raw sequences, the padded arrays, and the computed length $8$. The computed FFT convolution array is generated: `[ 2. 5. 10. 16. 18. 14. 10. 3.]`.

  

Finally, the verification engine is executed using `np.convolve(x, h)`. This built-in function operates purely in the time domain, applying the traditional slide-and-multiply summation loops directly on the unpadded sequences. By juxtaposing the verified output against the FFT methodology output, the script undeniably proves the fundamental principle of discrete signals: linear convolution in the time domain is perfectly mathematically isomorphic to aliasing-suppressed multiplication in the frequency domain. 


## PROBLEM 4: FREQUENCY DOMAIN MODULATION AND DEMODULATION OF A DISCRETE-TIME SIGNAL USING THE FAST FOURIER TRANSFORM

### 1. PROBLEM STATEMENT

**GIVEN:** A baseband message signal is defined as a continuous-time sinc function, mathematically formulated as $m(t) = \text{sinc}(100t)$ for a domain restricted by $\vert{}t\vert{} \le t_0$. The bounding duration parameter is strictly established as $t_0 = 0.1s$. A discrete sampling period is prescribed as $t_s = 0.001$, which systematically yields the sampling frequency of the discrete system. Additionally, an oscillatory carrier waveform is defined as $c(t) = \cos(2\pi f_c t)$, where the specific carrier frequency is established as $f_c = 250Hz$. The spectral analysis of these waveforms mandates the utilization of a Fast Fourier Transform (FFT) algorithm configured with an exact bin size of $N = 1024$. Furthermore, a frequency-domain low-pass filtering mechanism must be synthesized, characterized by a specific cutoff frequency of $fcut = 200 Hz$, and must incorporate an exact gain parameter of 2 to successfully retrieve the original amplitude of the baseband message signal.

  

**REQUIRED:** A highly precise programmatic methodology must be established and executed to computationally simulate the complete modulation, spectral analysis, and demodulation lifecycle of the provided signals. The discrete-time sequences for the message and carrier signals must be systematically generated across the predefined temporal bounds. The message signal must be amplitude-modulated by the carrier wave, a process strictly known to shift the original spectrum of the signal to the positive and negative coordinates of the carrier frequency. The frequency-domain spectrum of both the isolated baseband message signal and the resulting modulated signal must be computationally extracted and plotted. Following modulation, synchronous demodulation must be executed by multiplying the modulated signal with the identical carrier waveform. The resultant dual-frequency spectrum must be isolated utilizing the prescribed low-pass filter, applied exclusively in the frequency domain. Finally, an inverse spectral transform must be executed to reconstruct the original continuous-time equivalent signal entirely in the time domain, guaranteeing that the reconstructed temporal plot matches the original signal characteristics perfectly.

  

### 2. CONCEPTUAL THEORY

The mathematical analysis of dynamic physical systems fundamentally relies on the precise representation of varying quantities over an independent continuous parameter, predominantly time. When a physical quantity is represented as a continuous-time signal, it implies that the independent temporal variable possesses an infinite resolution, allowing the signal magnitude to be theoretically measured at any infinitesimally narrow temporal coordinate. However, the architecture of modern computational intelligences and digital signal processing hardware mandates that these continuous analog constructs be discretely quantized. The transformation from a continuous-time domain to a computationally viable discrete-time domain is systematically governed by foundational sampling theory. Discretization is achieved by recording the magnitude of the continuous signal at strictly uniform intervals, denoted as the sampling period. The mathematical inverse of this sampling period establishes the sampling frequency, which dictates the rate of discrete data point generation per temporal second. To prevent the catastrophic corruption of data known as spectral aliasing, the sampling frequency must strictly exceed twice the highest frequency component natively present within the continuous signal.

  

Once a signal is properly discretized, it may be mathematically manipulated. A foundational manipulation in transmission systems is amplitude modulation. Baseband signals, such as the provided sinc function, fundamentally possess low-frequency spectral energy. Transmitting low-frequency energy through physical propagation channels is highly inefficient due to severe electromagnetic attenuation and massive antenna size requirements. Amplitude modulation circumvents this physical limitation by functionally translating the baseband spectral energy to a substantially higher frequency band. This translation is mathematically achieved in the time domain through the point-wise multiplication of the discrete message signal by a high-frequency sinusoidal sequence, explicitly defined as the carrier signal.

  

To fully comprehend the effects of this multiplicative modulation, the time-domain sequence must be translated into the frequency domain. The Discrete Fourier Transform (DFT) serves as the primary analytical operator for this transformation. The DFT systematically correlates the discrete time-domain array against a basis of complex exponentials, effectively decomposing the signal into an array of isolated frequency magnitude bins. Because the pure mathematical execution of the DFT inherently scales with a computational complexity proportional to the square of the sample size, the highly optimized Fast Fourier Transform (FFT) algorithm is universally deployed. The FFT leverages symmetric recursive reductions to exponentially decrease computational processing times, provided the total number of analytical bins is optimally constrained to a power of two.

  

When the time-domain multiplication of the message and carrier signals is evaluated through the lens of Fourier theory, a profound property is revealed: multiplication in the discrete time domain maps directly to a convolution operation in the complex frequency domain. By rigorously expanding the modulation formula utilizing Euler's identity, the cosine carrier wave can be mathematically decomposed into two distinct complex exponential vectors rotating in opposite directions. Consequently, the modulation operation mathematically manifests as $x(n)\cos(\omega_0 n) \xleftrightarrow{DTFT} \frac{1}{2}[X(e^{j(\omega+\omega_0)}) + X(e^{j(\omega-\omega_0)})]$. This foundational theorem explicitly proves that the modulation operation divides the baseband spectral magnitude by a factor of two and identically shifts these halved energy densities to precisely align with the positive and negative carrier frequencies. After modulation, it is mathematically mandated that the original signal's spectrum will shift to $250Hz$ and $-250Hz$.

  

The retrieval of the original baseband data from this high-frequency modulated state necessitates a strictly coordinated mathematical process known as synchronous demodulation. Synchronous demodulation physically requires multiplying the modulated time-domain signal by the exact, phase-aligned carrier waveform utilized during the initial modulation phase. When a signal centered at the carrier frequency is multiplied by the carrier frequency a second time, the spectral energy is subjected to a secondary convolution. Mathematically, this secondary shift splits the existing spectrums again, shifting one set of energies down to the absolute zero-frequency coordinate—commonly referred to as the Direct Current (DC) or baseband center—while simultaneously shifting the remaining energy into an extreme high-frequency band positioned exactly at double the carrier frequency.

  

To fully finalize the demodulation process and isolate the desired data, all superfluous high-frequency energy must be annihilated. This objective is achieved through the architectural synthesis of a discrete low-pass filter. A low-pass filter is computationally defined as a mathematical masking array that exclusively permits the transmission of frequency bins whose magnitudes fall below a predefined critical threshold, strictly defined as the cutoff frequency. Bins associated with frequencies exceeding this threshold are multiplied by absolute zero, effectively erasing them from the spectral record. Because the sequential modulation and demodulation multiplicative operations organically attenuate the baseband signal magnitude to exactly one-quarter of its original amplitude, a corrective gain parameter must be applied. A low-pass filter with a gain of 2 is mathematically required to partially restore this amplitude, ensuring the final reconstruction remains highly accurate.

  

Upon the successful isolation and scaling of the baseband spectral energy, the frequency-domain array must be returned to the human-readable time domain. This transformation is executed utilizing the Inverse Fast Fourier Transform (IFFT). The IFFT algorithm mathematically performs the identical summation mechanics as the forward FFT but utilizes conjugate complex exponentials and normalizes the accumulated sums. This effectively maps the filtered, isolated frequency bins back into sequential chronological amplitudes, allowing for the direct reconstruction of the original continuous-time morphology from purely discrete components.

  

### 3. ALGORITHM DESIGN

1. The necessary computational libraries dedicated to highly optimized numerical array manipulation and two-dimensional geometric rendering are systematically imported into the operational environment.
    
      
    
2. The fundamental independent variables governing the simulated temporal environment are declared. The bounding signal duration, sampling period, and carrier frequency are strictly assigned their specified floating-point scalar values.
    
      
    
3. The derived system parameters are calculated mathematically. The discrete sampling frequency is derived by calculating the algebraic inverse of the sampling period.
    
      
    
4. A symmetric, discrete time-axis array is computationally generated, bounded by the negative and positive halves of the total specified duration and structurally spaced by the specific sampling period parameter.
    
      
    
5. The original continuous-time message signal is generated natively within the discrete environment by applying the normalized mathematical sinc function across the entirety of the time-axis array, followed by extreme-value scaling.
    
      
    
6. The high-frequency carrier signal array is instantiated by calculating the cosine of the product of the time-axis array, the angular frequency constant, and the specific carrier frequency parameter.
    
      
    
7. Amplitude modulation is computationally executed via the element-wise multiplication of the message signal array against the carrier signal array.
    
      
    
8. The parameters governing the spectral transformation are defined, specifically locking the Fast Fourier Transform algorithmic bin size parameter to the explicitly provided constant.
    
      
    
9. An aligned frequency-domain axis array is mathematically generated to establish the precise horizontal mapping coordinates required for accurate physical plotting.
    
      
    
10. The forward Fast Fourier Transform is executed independently upon both the raw message signal array and the newly modulated signal array. The resultant complex matrices are immediately scaled down by dividing them by the previously calculated sampling frequency scalar.
    
      
    
11. The spectral magnitude of both signals is rendered graphically. The complex outputs are subjected to a mathematical absolute-value extraction, followed by a systemic frequency-shifting operation designed to chronologically center the zero-frequency coordinate for symmetric visualization.
    
      
    
12. Synchronous demodulation is initiated algorithmically by multiplying the modulated signal array against the carrier signal array a second consecutive time.
    
      
    
13. The newly generated demodulated array is transformed into the frequency domain utilizing an identical, dynamically scaled Fast Fourier Transform operation.
    
      
    
14. The discrete low-pass filter architecture is parameterized. The continuous-frequency cutoff threshold is divided by the native frequency resolution of the FFT bins, and the resultant floating-point value is floored to isolate the exact integer bin index corresponding to the cutoff boundary.
    
      
    
15. The frequency-domain mathematical filter is instantiated as an array of absolute zeros, perfectly matching the total FFT bin size length.
    
      
    
16. The specific indices corresponding to the positive and negative low-frequency passbands are targeted within the array, and their numeric states are overwritten with the requisite corrective gain parameter.
    
      
    
17. The filter is dynamically applied to the demodulated spectrum via a direct element-wise multiplication, successfully annihilating all high-frequency spectral artifacts residing beyond the cutoff parameter.
    
      
    
18. The isolated, filtered baseband spectrum is rendered graphically to verify the absolute removal of the double-carrier frequency harmonic components.
    
      
    
19. The mathematically inverse transformation algorithm is invoked upon the filtered spectral array. The input array is pre-scaled by the sampling frequency to maintain energy equivalence, and the algorithm is executed to pull the data back into the discrete temporal domain.
    
      
    
20. The complex artifacts generated inherently by computational floating-point rounding errors are stripped away by enforcing a strict real-number mathematical extraction on the IFFT output sequence.
    
      
    
21. The final, reconstructed time-domain signal is graphically plotted directly alongside the original baseband message signal, definitively proving the lossless nature of the applied algorithmic lifecycle.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt

# --- 1. Signal and System Parameters ---
t0 = 0.1
ts = 0.001
fc = 250
fs = 1 / ts

t = np.arange(-t0 / 2, t0 / 2, ts)

# --- 2. Signal Generation and Modulation ---
m = np.sinc(100 * t)
c = np.cos(2 * np.pi * fc * t)
u = m * c

# --- 3. Spectral Analysis using FFT ---
N = 1024
freq = np.fft.fftfreq(N, d=1/fs)
M_fft = np.fft.fft(m, N) / fs
U_fft = np.fft.fft(u, N) / fs

# --- 4. Plotting: Message and Modulated Spectra ---
plt.figure(figsize=(10, 8))
plt.subplot(2, 1, 1)
plt.plot(np.fft.fftshift(freq), np.abs(np.fft.fftshift(M_fft)), linewidth=2)
plt.title('Spectrum of the Message Signal')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.grid(True)

plt.subplot(2, 1, 2)
plt.plot(np.fft.fftshift(freq), np.abs(np.fft.fftshift(U_fft)), linewidth=2)
plt.title('Spectrum of the Modulated Signal')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.grid(True)
plt.tight_layout()
plt.show()

# --- 5. Demodulation and Filtering ---
y = u * c
Y_fft = np.fft.fft(y, N) / fs

fcut = 200
ncut = int(np.floor(fcut / (fs / N)))

H_filter = np.zeros(N, dtype=np.float64)
H_filter[0:ncut] = 2
H_filter[N-ncut:N] = 2

U_filtered = Y_fft * H_filter

# --- 6. Plotting: Demodulated and Filtered Spectra ---
plt.figure(figsize=(10, 8))
plt.subplot(2, 1, 1)
plt.plot(np.fft.fftshift(freq), np.abs(np.fft.fftshift(Y_fft)), linewidth=2)
plt.title('Spectrum of Demodulated Signal')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.grid(True)

plt.subplot(2, 1, 2)
plt.plot(np.fft.fftshift(freq), np.abs(np.fft.fftshift(U_filtered)))
plt.title('Spectrum of Filtered Demodulated Signal')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.grid(True)
plt.tight_layout()
plt.show()

# --- 7. Reconstructed Time-Domain Signal ---
u_reconstructed = np.real(np.fft.ifft(U_filtered * fs))

plt.figure(figsize=(10, 8))
plt.subplot(2, 1, 1)
plt.plot(t, m, linewidth=2)
plt.title('Original Message Signal')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)

plt.subplot(2, 1, 2)
plt.plot(t, u_reconstructed[:len(t)])
plt.title('Reconstructed Signal')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True)
plt.tight_layout()
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The programmatic execution is formally initiated through the binding of the foundational numerical processing library, explicitly designated as `numpy`, alongside the geometric rendering engine, designated as `matplotlib.pyplot`. These libraries provide the heavily optimized underlying C-level memory structures required to perform massive array computations without invoking the severe performance penalties organically present within native Python iterative loops.

  

In the primary initialization block, the physical parameters of the simulated environment are explicitly instantiated as standardized floating-point scalar variables in computer memory. The bounding variable `t0` is strictly allocated the value of `0.1`, representing the physical time bounds in seconds. The discrete sampling period, `ts`, is assigned `0.001`, which subsequently allows for the dynamic computation of the sampling frequency, `fs`, via a direct mathematical inversion operation.

  

The discrete time-domain axis, `t`, is subsequently synthesized through the invocation of the `np.arange` algorithmic command. This specific command is parameterized to establish an array starting exactly at the negative midpoint of the duration parameter (`-t0 / 2`) and terminating at the positive midpoint, utilizing the highly precise `ts` parameter as its iterational step size. Following the creation of this foundational temporal axis, the baseband message signal array, `m`, is procedurally generated using the `np.sinc` function. It must be explicitly noted that the `numpy` numerical implementation of the sinc mathematical construct inherently normalizes the input by multiplying it internally by the mathematical constant pi; thus, the direct coefficient of `100` mathematically satisfies the precise requirement of the provided analog waveform. Simultaneously, the carrier waveform sequence, `c`, is generated by projecting the time axis array across a cosine trigonometric function, utilizing the `fc` parameter structurally locked at `250` Hz. The core amplitude modulation process is then definitively executed by commanding an element-wise array multiplication, generating the fully modulated signal array, `u`.

  

To mathematically transition the data into the complex frequency domain, the Fast Fourier Transform algorithm is systematically parameterized. The fundamental bin size parameter, `N`, is explicitly assigned the exact integer value of `1024`. To allow for accurate visual interpretation of the resultant data, the `np.fft.fftfreq` function is deployed to computationally construct a parallel frequency axis array, geometrically spaced according to the sampling frequency bounds. The core spectral analysis is strictly executed by passing the respective time-domain arrays, `m` and `u`, into the highly optimized `np.fft.fft` computational routine. The raw complex data arrays returned by this routine are systematically scaled down via a mathematical division utilizing the `fs` scalar constant. This division is physically required to normalize the discrete energy levels, thereby preventing the resulting spectral magnitudes from falsely inflating proportionately with the sampling density. The resultant sequences are rendered visually utilizing a structured `subplot` matrix. To generate symmetric, physically interpretable graphs, the `np.fft.fftshift` routine is heavily utilized during the plotting phase. The native output of an FFT algorithm stores the zero-frequency DC component exactly at index zero, effectively wrapping the negative frequency components to the absolute tail end of the array. The `fftshift` routine systematically bifurcates the array and swaps the halves, forcing the zero-frequency coordinate to the geometric center of the visual axis. The `np.abs` routine is subsequently run to extract the raw Pythagorean magnitude from the complex vectors.

  

Following the initial visualization, the script proceeds strictly into the demodulation phase. The algorithm initiates demodulation through a secondary element-wise multiplication of the `u` array and the `c` array, dynamically generating the raw demodulated sequence, `y`. This signal immediately undergoes an identical scaled FFT transformation, generating the `Y_fft` array. Because this array physically contains severe harmonic distortion centered at exactly twice the carrier frequency, a digital masking mechanism must be dynamically created.

  

The low-pass filter algorithm begins by establishing the continuous cutoff boundary, strictly parameterized as `fcut = 200` Hz. This analog frequency coordinate must be mathematically mapped to a discrete array index. This mapping is executed algebraically by dividing the cutoff frequency by the strict resolution of a single frequency bin (calculated dynamically as `fs / N`). The resultant fractional bin number is systematically truncated to an exact integer index via the `np.floor` routine. The filter matrix, `H_filter`, is strictly initialized as an array of highly precise 64-bit floating-point absolute zeros, perfectly matching the `N=1024` length constraint. Because the `H_filter` array is constructed in the native, un-shifted FFT format, the positive frequency passband is sequentially targeted by indexing from coordinate `0` up to `ncut`. Concurrently, due to the inherent mathematically periodic nature of the discrete Fourier continuum, the corresponding negative frequencies are systematically mapped to the tail bounds of the array, specifically bounded from `N-ncut` to `N`. The numeric states at these exact locations are aggressively overwritten with the strict constant integer `2`. This integer serves as a structural gain coefficient required to mathematically compensate for the absolute spectral amplitude loss incurred through the dual modulation-demodulation multiplications. The filter is mathematically applied to the demodulated spectrum via straightforward element-wise multiplication (`U_filtered = Y_fft * H_filter`), instantaneously zeroing out all extraneous spectral artifacts while precisely scaling the remaining baseband core.

  

In the final execution phase, the algorithm commands the `np.fft.ifft` routine to reverse the transform operation entirely. The filtered frequency domain array is first multiplied by `fs` to counteract the preliminary scaling utilized during the initial transformation. Because minor mathematical anomalies natively present in floating-point operations can generate minuscule, physically impossible imaginary components during the inverse transform algorithm, the `np.real` command is systematically enforced to violently strip away any residual imaginary vectors. The perfectly reconstructed array is subsequently visualized directly against the original mathematically perfect sinc function, demonstrating conclusively that the structural integrity of the original data was perfectly maintained across the entire modulation and filtration lifecycle.

  

## PROBLEM 5: Z-TRANSFORM ANALYSIS, PARTIAL FRACTION EXPANSION, AND DIFFERENCE EQUATION COMPUTATION FOR DISCRETE-TIME LTI SYSTEMS

### 1. PROBLEM STATEMENT

**GIVEN:** A highly complex suite of discrete-time signal parameters and linear time-invariant system models must be mathematically evaluated. The foundational discrete-time sequences subject to symbolic transformation are explicitly defined as the unit sample sequence $\delta[n]$ and the unit step sequence $us(n)$. Additional sequences requiring evaluation are formulated mathematically as a complex exponential sequence $x[n] = e^{jn}u[n]$, a strictly sinusoidal sequence $x[n] = \cos(n)$, and a geometrically decaying sequence characterized as $x[n] = (1/2)^n u[n]$. A separate analytical objective presents a highly structured complex rational Z-transform transfer function explicitly defined mathematically as $X(z) = \frac{1 + 2z^{-1} - z^{-2}}{1 - z^{-1} + 0.3561z^{-2}}$. Furthermore, the operational evaluation requires the temporal resolution of two distinct linear constant coefficient difference equations. The fundamental difference equation representing the general discrete-time system relationship is structured explicitly as $\sum_{k=0}^{N} a_k y[n-k] = \sum_{k=0}^{M} b_k x[n-k]$. Utilizing this architectural format, the first specific target system is strictly formulated as $y[n] - \frac{1}{2}y[n-1] = x[n]$. The second specific target system is defined by the discrete difference formulation $y[n] = x[n] + y[n-1]$.

  

**REQUIRED:** A comprehensive computational algorithm must be orchestrated to simultaneously analyze the given signals and systems across both the complex Z-domain and the discrete time-domain. First, symbolic linear circuit analysis routines must be deployed to execute the forward Z-transform mathematically upon the specific basic discrete-time sequences defined in the parameters. Following the forward transforms, specific mathematical inverse transform commands must be executed against fundamental rational expressions, specifically $z^{-1}$ and $\frac{z}{z-1}$. The complex rational Z-transform expression $X(z)$ must subsequently be algorithmically decomposed utilizing a rigorous partial fraction expansion methodology. The programmatic execution of this expansion must explicitly calculate and isolate the complex fractional residues, the mathematical system poles, and the scalar direct terms natively embedded within the polynomial structure. Utilizing these isolated outputs, the original mathematical polynomials governing the numerator and denominator of the transfer function must be programmatically reconstructed. Finally, the discrete time-domain behavioral characteristics of the provided LTI systems must be mathematically simulated utilizing digital filtration operators. The response of the first target system must be comprehensively simulated when subjected to a continuous unit step input signal. The operational behavior of the second target system must be analyzed specifically to compute its impulse response, defined as the system's reaction when the applied input is strictly a unit sample input signal. All temporal system responses must be precisely plotted as discrete mathematical stem graphs to conclude the exhaustive analysis.

  

### 2. CONCEPTUAL THEORY

The mathematical architecture governing modern discrete-time digital processing heavily depends upon advanced functional transformations. When physical systems are digitized, the resultant input and output behaviors form a discrete sequence of numeric magnitudes bound sequentially in a linear array. The transformational behavior between these discrete input arrays and output arrays dictates the fundamental nature of the discrete-time system. If the system mathematically guarantees that a scaled and shifted input will yield a perfectly scaled and identically shifted output without introducing nonlinear distortions or temporal variations, the system is strictly defined as Linear and Time-Invariant (LTI). An LTI discrete-time system is a fundamentally critical mathematical construct because its absolute total behavior from a state of total rest to infinite time is completely characterized by a single unique array: the impulse response. The impulse response is rigorously defined as the explicit, measurable reaction of the LTI discrete-time system when stimulated by a solitary, instantaneous unit sample input signal perfectly located at the zero-th chronological index. Conversely, the step response characterizes the system's absolute accumulative reaction to a mathematically continuous unit step input sequence stretching out uniformly to positive infinity.

  

Because the entire behavior of the system is permanently locked within the structural DNA of its impulse response, the output of the LTI system to any arbitrary, highly complex input sequence is mathematically obtained strictly through the execution of a convolution operation. This operation mathematically slides the reversed impulse response sequence across the target input array, accumulating the multiplied overlapping boundaries to calculate each sequential output coordinate. To achieve this convolution operation iteratively within practical microprocessor boundaries, the mathematical relationship between the input sequence and the output sequence is permanently mapped to a linear constant coefficient difference equation (LCCDE). The LCCDE mathematically dictates that the current instantaneous value of the output sequence is derived by calculating a strictly weighted sum of the current and historical input sequences, minus the weighted sum of historical output sequences. The coefficients weighting the historical outputs are formally designated as output coefficients ($a_k$), whereas the constants weighting the inputs are formally defined as the input coefficients ($b_k$). The difference equation establishes a recursive geometric topology that directly controls the system dynamics.

  

However, resolving highly complex, deeply nested difference equations entirely within the raw temporal domain is mathematically tedious and frequently computationally prohibitive. To entirely circumvent the mathematical complexity of iterative temporal convolutions, signals and systems are systematically mapped into an infinite complex frequency space utilizing the Z-transform. The Z-transform acts as a profoundly critical tool in analyzing the behaviors of discrete-time systems because it maps discrete sequential vectors onto a continuous complex plane. Unlike the foundational Discrete Fourier Transform—which mathematically restricts analysis to strictly finite-length signals oscillating at specific physical frequencies—the Z-transform provides a dramatically broader analytical framework capable of evaluating digital sequences across the entire infinite complex geometry. This enables the rigorous mathematical analysis of rapidly exponentially diverging, computationally infinite, or highly unstable sequences that the Fourier operator simply cannot mathematically process due to lack of convergence.

  

The mathematical execution of the Z-transform operates precisely as an infinite power series expansion, definitively established mathematically by the summation equation $X(z) = \sum x[n]z^{-n}$. The summation variable, $z$, strictly represents an arbitrary complex scalar possessing both magnitude and rotational phase. Because the operator relies on an infinite power summation, the resulting mathematical transformation strictly exists only for specific geometric values of the complex parameter $z$ where the infinite series absolutely converges to a finite mathematical total. This mathematically bounded two-dimensional geometric plane outlining convergence is systematically defined as the Region of Convergence (ROC).

  

When the discrete time-domain difference equations are passed entirely through the Z-transform operator, the complex shifting theorems cause the temporal delays to transform directly into mathematical algebraic polynomials constructed entirely of $z^{-1}$ elements. Consequently, the complete LTI system collapses into an elegant algebraic complex rational transfer function mathematically defined strictly by a numerator polynomial divided by a denominator polynomial. The roots extracted from the numerator polynomial geometrically define the system's mathematical 'zeros', while the fundamental roots extracted from the denominator polynomial geometrically define the critical system 'poles'.

  

Transforming these complex rational polynomials back to the temporal domain requires massive algebraic manipulation. Direct inverse transformation is mathematically impossible for high-order polynomials; thus, the algebraic fraction must be structurally shattered into a summation of elementary constituent fractions through the mathematical mechanism known strictly as partial fraction expansion. The execution of partial fraction expansion forces the isolation of individual geometric system poles alongside their corresponding complex amplitude scalar residues. Once isolated, these independent microscopic fractions can be systematically mapped backward across the transform boundary utilizing the established base definitions of primitive signals such as unit steps and exponentials, thereby easily reverse-engineering the native LCCDE parameters from an entirely different mathematical dimension.

  

### 3. ALGORITHM DESIGN

1. The computational script structurally imports the required multidimensional numerical manipulation libraries, the geometric plotting dependencies, and the specialized symbolic linear circuit analytical packages.
    
      
    
2. The complex mathematical scalar imaginary constant is formally defined within the Python environment to ensure that strict rotational mathematics can be executed without native symbolic errors.
    
      
    
3. The computational logic flow formally begins the symbolic evaluation phase. The independent discrete temporal variable parameter, mathematically defined as $n$, is instantiated alongside the foundational complex frequency variable parameter, defined as $z$.
    
      
    
4. The exact unit sample sequence is symbolically constructed within the linear analysis engine and subjected to the forward Z-transform procedural call. The resultant constant scalar is exported to the standard output buffer.
    
      
    
5. The unit step sequence is symbolically instantiated, mathematically constrained to zero at all negative indices, and mapped through the Z-transform algorithm.
    
      
    
6. The mathematical complex exponential expression is constructed by passing the product of the temporal parameter and the defined complex scalar into the symbolic exponentiation routine, followed immediately by the transform mapping.
    
      
    
7. The strict trigonometric cosine sequence and the exponentially decaying geometric sequence are successively instantiated symbolically, mathematically transformed into the complex frequency domain, and structurally validated via console printing.
    
      
    
8. The script architecture abruptly pivots from forward mappings to reverse mappings. A strictly isolated inverse variable term, formatted directly as $z$ raised to the negative first power, is mathematically constructed and passed through the symbolic inverse Z-transform execution command.
    
      
    
9. A foundational rational algebraic structure, representing the known transfer function of a basic causal unit step sequence, is instantiated entirely in the complex Z-domain and dynamically inverted mathematically to retrieve the discrete temporal sequence.
    
      
    
10. Following the cessation of the symbolic phase, numerical partial fraction expansion is computationally initiated. The target mathematical coefficients of the high-order transfer function numerator are arrayed linearly in strict descending numerical order.
    
      
    
11. The target mathematical coefficients of the complex high-order transfer function denominator are similarly mapped to a highly precise sequential 1D floating-point array.
    
      
    
12. The specific numerical mathematical `signal.residuez` algorithm is invoked, parameterized heavily by the previously established numerator and denominator coefficient arrays.
    
      
    
13. The internal procedural execution mathematically disintegrates the complex polynomial. It systematically calculates the complex roots of the denominator polynomial, successfully extracting the system's geometric poles.
    
      
    
14. The internal subroutine further isolates the specific mathematical magnitude constants corresponding to each extracted pole, dynamically exporting them to the resultant residue array variable. Any purely mathematical polynomial remainders are strictly allocated to the direct terms matrix array.
    
      
    
15. The exact structural results of the expansion, encompassing the residues, the physical poles, and the remnant mathematical direct scalars, are systematically passed to standard output for strict academic validation.
    
      
    
16. The structural process is perfectly reversed by supplying the isolated residues and poles into the inverse reconstruction subroutine, which computationally recalculates and prints the foundational coefficients belonging to the exact initial rational polynomials.
    
      
    
17. The analytical algorithm transitions strictly into discrete time-domain simulation. The temporal parameters dictating the discrete constraints of the first target LTI system are initialized, strictly bounding the sample index array from zero to four.
    
      
    
18. The unit step input sequence required to measure the targeted system step response is numerically generated by instantiating a flat mathematical array of absolute floating-point ones, identically scaled to match the physical length of the index array.
    
      
    
19. The mathematically critical feedforward input coefficients ($b_k$) and the feedback output coefficients ($a_k$) intrinsic to the specific difference equation bounding the first LTI system are instantiated within numerical matrices.
    
      
    
20. The complex temporal dynamics of the targeted system are algorithmically simulated by passing the defined input arrays and the constant coefficient arrays through the highly optimized, C-level recursive difference equation solver routine, mathematically generating the fully simulated step response.
    
      
    
21. The parameters required to evaluate the second target LTI system are formally initialized. A dedicated algorithmic sub-routine is computationally constructed specifically to generate the purely isolated mathematical unit impulse array across an expanded temporal coordinate index ranging mathematically up to fifty.
    
      
    
22. The isolated impulse array is successfully cast strictly into a floating-point data construct to satisfy the rigorous data-typing demands inherent within the recursive computational filter engine.
    
      
    
23. The uniquely isolated input and output parameter coefficients defining the second difference equation are formalized in memory.
    
      
    
24. The difference equation algorithm is executed iteratively utilizing the isolated impulse array, perfectly simulating the exact native impulse response structurally characterizing the secondary system model.
    
      
    
25. The resultant discrete temporal outputs representing the isolated LCCDE step response and the isolated impulse response are graphically rendered sequentially using geometric stem plots, strictly highlighting the discrete, quantized mathematical nature of the generated data streams.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
from lcapy import n, z, delta, us, exp, cos

# Explicit definition of the imaginary complex unit for symbolic operations
j = 1j 

# --- PART A: Forward Z-Transforms of Fundamental Sequences ---
x_delta = delta(n)
Xz_delta = x_delta.ZT()
print("--- Forward Z-Transforms ---")
print("Z-Transform of Unit Sample (delta(n)):")
print(Xz_delta)

x_us = us(n)
Yz_us = x_us.ZT()
print("Z-Transform of Unit Step (us(n)):")
print(Yz_us)

x1 = exp(j*n)
X1 = x1.ZT()
print("Z-Transform of exp(j*n)u[n]:")
print(X1)

x2 = cos(n)
X2 = x2.ZT()
print("Z-Transform of cos(n)u[n]:")
print(X2)

x3 = (1/2)**n * us(n)
X3 = x3.ZT()
print("Z-Transform of (1/2)^n u[n]:")
print(X3)

# --- PART B: Inverse Z-Transforms of Rational Expressions ---
print("\n--- Inverse Z-Transforms ---")
X_inv1 = z**(-1)
x_inv1 = X_inv1.IZT()
print("Inverse Z-Transform of z^-1:")
print(x_inv1)

Y_inv2 = 1 / (1 - z**(-1))
y_inv2 = Y_inv2.IZT()
print("Inverse Z-Transform of 1/(1 - z^-1):")
print(y_inv2)

# --- PART C: Partial Fraction Expansion of High-Order Polynomials ---
# Rational Expression: X(z) = (1 + 2z^-1 - z^-2) / (1 - z^-1 + 0.3561z^-2)
num = [1, 2, -1]
den = [1, -1, 0.3561]
r, p, k = signal.residuez(num, den)

print("\n--- Partial Fraction Expansion Results ---")
print("Residues (r):")
print(r)
print("Poles (p):")
print(p)
print("Direct terms (k):")
print(k)

num_rc, den_rc = signal.invresz(r, p, k)
print("\nReconstructed Numerator Polynomial:")
print(num_rc)
print("Reconstructed Denominator Polynomial:")
print(den_rc)

# --- PART D: Simulation of Discrete-Time Linear Time-Invariant Systems ---
# System 1: Step Response Simulation
# Difference Equation: y[n] - 0.5*y[n-1] = x[n]
n_arr = np.arange(0, 5)
x_arr = np.ones(len(n_arr))
coeff_x = [1]
coeff_y = [1, -1/2]
y_arr = signal.lfilter(coeff_x, coeff_y, x_arr)

plt.figure(figsize=(10, 8))
plt.subplot(2, 1, 1)
plt.stem(n_arr, y_arr)
plt.xlabel('n')
plt.ylabel('y[n]')
plt.title('Step Response of First LTI System')
plt.grid(True)

# System 2: Impulse Response Simulation
# Difference Equation: y[n] = x[n] + y[n-1] -> algebraically formatted to y[n] - y[n-1] = x[n]
def unit_impulse(n0, n1, n2):
    n_imp = np.arange(n1, n2 + 1, 1)
    x_imp = (n_imp == n0)
    return x_imp, n_imp

n0 = 0
n1 = 0
n2 = 50
x_imp_bool, n_imp_arr = unit_impulse(n0, n1, n2)
x_imp_float = x_imp_bool.astype(float)

coeff_x_imp = [1]
coeff_y_imp = [1, -1]
h_arr = signal.lfilter(coeff_x_imp, coeff_y_imp, x_imp_float)

plt.subplot(2, 1, 2)
plt.stem(n_imp_arr, h_arr)
plt.xlabel('n')
plt.ylabel('h[n]')
plt.title('Impulse Response (h[n]) of Second LTI System')
plt.grid(True)

plt.tight_layout()
plt.show()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The computational sequence explicitly begins by mounting the standard structural foundations required for numerical logic and graphical visualization mapping (`numpy` and `matplotlib.pyplot`), rapidly followed by the extraction of the advanced mathematical subroutine repository dedicated strictly to discrete signal analysis (`scipy.signal`). To successfully accomplish the symbolic dimensional transformations, the programmatic script systematically incorporates discrete mapping elements and operators heavily sourced from the sophisticated `lcapy` computational framework. To strictly enforce proper resolution when managing continuous trigonometric geometries, the mathematical imaginary unit scalar is actively initialized in the script variable directory strictly as the highly complex floating-point constant `1j`.

  

The core operational block algorithmically attacks the forward transform requirements. The symbolic representation of the native discrete unit sample signal is generated by explicitly passing the isolated, dimensionless symbolic independent variable parameter `n` directly into the initialized `delta()` algorithmic generator. This structurally constructs an idealized temporal mathematical pulse occurring exclusively at index zero. The forward mapping is achieved rigorously by triggering the embedded `.ZT()` operator routine, physically forcing the algebraic evaluation algorithm to geometrically collapse the infinite power summation into its strict converging ratio, resulting in the mathematically pure transformation factor of scalar one. This identical structural pipeline is sequentially iterated upon the step sequence generation operator `us(n)`, yielding the strict rational transform $\frac{z}{z-1}$. When applied to the dynamically generated complex exponential operand configured algorithmically as `exp(j*n)`, the internal mathematical mechanics aggressively apply Euler's trigonometric expansion theorems to accurately map the infinite geometric series into its precise algebraic equivalent across the Z-plane parameter space.

  

Following the completion of the forward algebraic mappings, the script instantly directs the complex mathematical architecture to operate in strictly absolute reverse. The basic complex variable entity `z` is subjected to a mathematical negative exponentiation, simulating an absolute single-unit temporal signal delay inherently encoded directly within the mathematical transfer domain. This purely symbolic construct is subjected precisely to the `.IZT()` object-oriented inversion command, successfully forcing the mathematical matrix architecture to recompile the algebraic parameter directly backward across the mathematical transform boundaries, yielding the exact temporal manifestation of a shifted impulse.

  

The algorithmic focus subsequently transitions toward the systematic fracturing of complex multi-order polynomials. The given mathematical difference equations dictating the operational topology of the provided transfer system possess strictly defined constant coefficients. These exact sequential integer scalar constraints are sequentially deposited directly into the rigidly defined discrete linear arrays designated dynamically as `num` and `den`. These linear arrays correspond strictly to the descending power matrix factors dictating the discrete delay magnitudes in the transform equation. The `signal.residuez` algorithm evaluates these sequential arrays explicitly. Under the computational hood, this mathematical mechanism computationally seeks the precise roots of the denominator polynomial by invoking a proprietary highly optimized eigenvalue polynomial solver. This process definitively yields the exact geometric locations of the system poles mapped across the discrete complex geometry. The internal algorithmic logic simultaneously determines the residual coefficients linked to each isolated root location through highly recursive polynomial evaluation mechanisms. The isolated outputs—which strictly correspond identically to the residues (`r`), the system poles (`p`), and the direct algebraic constants (`k`)—are computationally returned and aggressively pushed to the standard interface terminal array. To entirely prove the mathematical reversibility of the structural operation, the isolated components are instantly pushed backward into the inverse mapping routine strictly designated as `signal.invresz`. This routine geometrically recompiles the components by forcing mathematical rational summation operations iteratively across common denominators until the perfect reconstruction of the initial arrays is computationally finalized.

  

In the final simulation phase, the mathematical logic formally tackles the iterative evaluation of recursive digital difference equations. To execute the specific temporal simulation required by the foundational system $y[n] - \frac{1}{2}y[n-1] = x[n]$, a sequential matrix `n_arr` is generated strictly tracking from bounds zero through four. The corresponding discrete input is populated algorithmically via the `np.ones` matrix allocation routine, structurally forging the discrete characteristics of the unit step input sequence required perfectly. The exact mathematical input and output factors dictate the parameters `coeff_x` and `coeff_y`. The crucial minus sign applied strictly to the one-half value is mandated by mathematical convention: because the difference equation logically offsets output terms negatively when transposed strictly to the left side of the equality, the exact corresponding algorithmic coefficient natively tracking the delay must reflect this exact mathematical inversion. These precise architectural constraints are funneled forcefully into the robust `signal.lfilter` recursive numerical mechanism. This optimized routine initiates a strictly sequential temporal loop, structurally multiplying the historical data limits by the isolated scalar coefficients and appending the results linearly to generate the final temporal output sequence array `y_arr`.

  

To conclude the analysis entirely, the impulse response of the secondary targeted recursive system mathematically formalized as $y[n] = x[n] + y[n-1]$ is completely simulated. The custom sub-routine designated `unit_impulse` operates by physically generating an exact Boolean sequence structure wherein all positional coordinates explicitly evaluate logically true solely when matching the exact physical constraint parameter designated `n0`. This isolated Boolean logical response is brutally forced into strict numerical conformity by executing the `astype(float)` programmatic conversion, establishing the precise unit impulse mathematical array. The recursive calculation block `lfilter` is invoked a final consecutive time. Utilizing mathematical coefficients rigidly establishing perfect integration characteristics (strictly `[1, -1]`), the algorithmic operation forces the convolution operation systematically over fifty individual indices. The output array natively perfectly aligns with the fundamental theoretical impulse response matrix characteristics mathematically defining the integration system model structure. 


## PROBLEM 6: COMPUTATION AND VISUALIZATION OF THE POLE-ZERO MAP FOR A DISCRETE-TIME TRANSFER FUNCTION

### 1. PROBLEM STATEMENT

**GIVEN:** A discrete-time linear time-invariant (LTI) system is defined by a rational transfer function in the Z-domain. The specific transfer function to be analyzed is expressed in terms of negative powers of the complex variable $z$, denoted as $H(z) = \frac{1 + 2z^{-1} - z^{-2}}{1 - z^{-1} + 0.3561z^{-2}}$. The coefficients for the numerator polynomial $B(z)$ are defined sequentially as $[1, 2, -1]$, corresponding to the zero-th, first, and second-order delays, respectively. The coefficients for the denominator polynomial $A(z)$ are correspondingly defined as $[1, -1, 0.3561]$.

  

**REQUIRED:** An exhaustive algorithmic methodology and a corresponding programmatic implementation must be developed to mathematically model this discrete-time system. The computational script must utilize the Python programming language, specifically leveraging the `control` systems engineering library, to define the transfer function object. Subsequently, the script must compute the roots of the numerator polynomial (zeros) and the roots of the denominator polynomial (poles) in the complex Z-plane. Finally, a graphical representation known as a pole-zero plot must be generated, wherein poles are explicitly demarcated by cross symbols ($\times$) and zeros are demarcated by circle symbols ($\circ$). The plot must include the unit circle as a reference boundary to facilitate system stability analysis.

  

### 2. CONCEPTUAL THEORY

The foundational premise of discrete-time signal processing relies upon the representation of signals as sequences of numbers, denoted as $x[n]$, where $n$ represents a discrete integer time index. When such a sequence is processed by a Linear Time-Invariant (LTI) system characterized by an impulse response $h[n]$, the resulting output sequence $y[n]$ is computed via the fundamental convolution sum operation, expressed mathematically as $y[n] = \sum_{k=-\infty}^{\infty} x[k]h[n-k]$. While the time-domain convolution provides a direct method for calculating the system output, it is computationally intensive and analytically cumbersome for complex systems. To alleviate this complexity, transformations are employed to map the time-domain sequences into a complex frequency domain.

  

The Z-transform serves as the discrete-time equivalent of the Laplace transform used in continuous-time systems. By applying the Z-transform, the time-domain convolution operation is fundamentally simplified into an algebraic multiplication operation in the Z-domain. The generalized Z-transform of a discrete-time sequence $x[n]$ is defined as an infinite power series in a complex variable $z$, formulated as $X(z) = \sum_{n=-\infty}^{\infty} x[n]z^{-n}$. When this transformation is applied to the convolution sum equation, the relationship between the input signal $X(z)$, the output signal $Y(z)$, and the system's impulse response $H(z)$ is established as $Y(z) = X(z)H(z)$. In this context, $H(z)$ is formally defined as the transfer function of the discrete-time LTI system, calculated as the ratio of the output Z-transform to the input Z-transform, $H(z) = \frac{Y(z)}{X(z)}$.

  

For a vast majority of physically realizable discrete-time systems, particularly those implemented via linear constant-coefficient difference equations, the transfer function $H(z)$ is mathematically structured as a rational function. A rational transfer function is formulated as the ratio of two polynomials, denoted as $B(z)$ for the numerator and $A(z)$ for the denominator, such that $H(z) = \frac{B(z)}{A(z)}$. This rational expression can be expanded in terms of negative powers of $z$, which directly represent discrete time delays in digital hardware implementations. The expanded polynomial representation is given by the equation $H(z) = \frac{b_0 + b_1z^{-1} + b_2z^{-2} + \dots + b_Mz^{-M}}{a_0 + a_1z^{-1} + a_2z^{-2} + \dots + a_Nz^{-N}}$, where $b_k$ represent the feedforward coefficients and $a_k$ represent the feedback coefficients of the system.

  

The characteristics of the complex variable $z$ dictate that it can be expressed in polar coordinates as $z = re^{j\omega}$, where $r$ is the magnitude (distance from the origin) and $\omega$ is the angular frequency (angle with the positive real axis). The position of any specific value of $z$ on the complex plane is thus governed by these two parameters. The foundational properties of the transfer function $H(z)$ are entirely governed by the specific values of $z$ that cause the function to evaluate to zero or to diverge to infinity. The roots of the numerator polynomial, $B(z) = 0$, dictate the values of $z$ for which the entire transfer function evaluates to zero, $H(z) = 0$; these specific complex frequencies are formally defined as the "zeros" of the system. Conversely, the roots of the denominator polynomial, $A(z) = 0$, dictate the values of $z$ for which the transfer function evaluates to infinity, $H(z) = \infty$; these specific complex frequencies are formally defined as the "poles" of the system.

  

To comprehensively analyze the system's behavior without calculating the inverse Z-transform, the rational transfer function is frequently converted into a factored form. Assuming the system has $M$ finite zeros located at $z = z_1, z_2, \dots, z_M$ and $N$ finite poles located at $z = p_1, p_2, \dots, p_N$, the transfer function can be rewritten as $H(z) = \frac{b_0}{a_0} z^{N-M} \frac{(z-z_1)(z-z_2)\dots(z-z_M)}{(z-p_1)(z-p_2)\dots(z-p_N)}$. This mathematical reformulation is of paramount importance because it explicitly isolates the exact locations of the system's critical points in the complex Z-plane.

  

The physical significance of these poles and zeros is profound, particularly concerning the internal stability and dynamic response of the LTI system. The temporal behavior of the output signal generated by the discrete-time system is strictly predicated upon the spatial locations of the poles relative to a critical geometric boundary known as the unit circle. The unit circle is defined as the locus of all points in the complex plane where the magnitude of $z$ is exactly unity, expressed mathematically as $|z| = 1$. This specific circle is highly significant because evaluating the Z-transform precisely along this boundary yields the Discrete-Time Fourier Transform (DTFT) of the system.

  

System stability criteria are rigorously assessed through the Region of Convergence (ROC) associated with the system transfer function. By definition, the Region of Convergence must not contain any poles, as the function diverges at these coordinates. For an LTI system to be classified as causal—meaning the system's output depends exclusively on present and past inputs, never on future inputs—the Region of Convergence must extend outward from the largest magnitude pole to infinity, mathematically defined as the exterior of a circle $|z| > r$, where $r$ is the radius of the outermost pole. Furthermore, for the system to achieve Bounded-Input Bounded-Output (BIBO) stability, the discrete-time impulse response sequence must be absolutely summable. In the Z-domain, this rigorous stability condition mandates that the Region of Convergence must explicitly include the unit circle. Combining these two principles yields the fundamental theorem of discrete-time system stability: a causal LTI system is guaranteed to be fully stable if and only if all of the poles of its transfer function $H(z)$ lie strictly inside the interior of the unit circle.

  

The exact positional mapping of poles dictates the temporal progression of the signal. If a given pole is located inside the unit circle ($\vert{}z\vert{} < 1$), the corresponding signal component will exponentially decay over time, representing a stable transient response. If a pole is positioned exactly on the unit circle ($\vert{}z\vert{} = 1$), the signal will maintain a constant amplitude over time (or exhibit sustained, non-decaying sinusoidal oscillations if it is a complex conjugate pair), a condition classified as marginally stable. If any pole is located outside the unit circle ($\vert{}z\vert{} > 1$), the corresponding signal amplitude will exhibit unbounded, exponential growth over time, leading to severe instability. Furthermore, complex conjugate pairs of poles result in exponentially weighted sinusoidal signals; if the radial distance $r > 1$, the oscillatory amplitude grows, whereas if $r < 1$, the oscillatory amplitude decays towards zero. A graphical visualization called a pole-zero plot maps these entities onto the complex plane, employing explicit symbology where the precise location of a pole is denoted by a cross ($\times$) and the location of a zero is denoted by a circle ($\circ$). The unit circle is conventionally rendered as a dotted or dashed line to visually separate the stable and unstable regions of the complex domain.

  

### 3. ALGORITHM DESIGN

The computational procedure necessary to define the system and generate the requisite pole-zero plot requires a meticulously structured algorithmic approach. The process involves mathematical modeling, object instantiation, root-finding computations, and graphical rendering.

  

1. **Environment Initialization and Library Importation:**
    
    The operational environment must first be primed by importing the necessary computational libraries. The standard Python environment lacks native structures for LTI system analysis. Therefore, the `control` library must be imported. This specific library contains highly optimized classes for polynomial mathematical operations and linear system modeling. The library is to be imported under an abbreviated alias to streamline subsequent programmatic calls.
    
      
    
2. **Definition of the Numerator Polynomial Coefficients:** The transfer function is provided in the format of a rational polynomial utilizing negative powers of $z$. The numerator is given as $1 + 2z^{-1} - z^{-2}$. The algorithm requires these coefficients to be extracted and stored in a sequential, one-dimensional array or list structure. The sequence of coefficients must meticulously preserve the order corresponding to the descending powers of $z^{-1}$. The resulting numerical array must be exactly parameterized as $[1, 2, -1]$.
    
      
    
3. **Definition of the Denominator Polynomial Coefficients:** Following the exact methodology utilized for the numerator, the denominator polynomial $1 - z^{-1} + 0.3561z^{-2}$ must be parsed. The coefficients must be extracted while strictly maintaining their respective arithmetic signs. This data must be encapsulated within a secondary one-dimensional array. The resulting numerical parameterization must be established as $[1, -1, 0.3561]$.
    
      
    
4. **Instantiation of the Discrete-Time Transfer Function Object:**
    
    The raw polynomial coefficient arrays must be synthesized into a formalized mathematical object that the computational environment can recognize as an LTI system. An instantiation function provided by the `control` library (specifically the transfer function constructor) must be invoked. The previously defined numerator array and denominator array must be passed as the primary functional arguments. Crucially, a specific Boolean flag must be triggered during this instantiation to explicitly declare that the underlying physical system operates in the discrete-time domain rather than the continuous-time domain. This flag forces the library to evaluate the polynomials in the Z-domain instead of the Laplace S-domain.
    
      
    
5. **Execution of the Root-Finding and Graphical Plotting Routine:** Once the digital transfer function object is successfully compiled in memory, an automated mapping function native to the `control` library must be called to compute the poles and zeros. This function will mathematically compute the exact roots of both the numerator and denominator polynomials using highly robust numerical eigenvalue routines (such as finding the eigenvalues of the companion matrix associated with the polynomials). After the complex roots are calculated, the algorithm must automatically generate a two-dimensional Cartesian coordinate system representing the complex Z-plane. The real components of the roots will be mapped to the horizontal axis, and the imaginary components will be mapped to the vertical axis. The algorithm must overlay a unit circle, precisely centered at the origin $(0,0)$ with a radius of $1.0$, rendered using a dotted line style to act as the stability threshold. Finally, the algorithm will place circle markers ($\circ$) at the computed zero coordinates and cross markers ($\times$) at the computed pole coordinates. A secondary parameter must be passed to this plotting routine to suppress the default title generation, ensuring a minimalist graphical output.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
# Import the Python control systems library and assign it the alias 'ct'
import control as ct

# Define the coefficients for the numerator polynomial in descending powers of z^-1
num = [1, 2, -1]

# Define the coefficients for the denominator polynomial in descending powers of z^-1
den = [1, -1, 0.3561]

# Instantiate the discrete-time linear time-invariant transfer function object
# The dt=True flag explicitly defines the system within the discrete Z-domain
sys = ct.tf(num, den, dt=True)

# Compute the roots (poles and zeros) and render the pole-zero map on the complex Z-plane
# The title=False argument suppresses the automatic generation of a plot header
ct.pzmap(sys, title=False)
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The provided computational script is engineered to construct and analyze a discrete-time linear time-invariant system strictly based on its polynomial transfer function coefficients. The execution begins with the directive `import control as ct`. The `control` module is a specialized open-source Python library designed specifically for the analysis and design of feedback control systems, providing native support for complex algebraic operations required for Z-domain mathematical manipulations. By importing it under the localized namespace alias `ct`, subsequent function calls are syntactically shortened, minimizing verbosity while maintaining strict programmatic clarity.

  

Following the environmental initialization, the foundational data structures are declared. The transfer function represents the ratio of two polynomials. In digital signal processing libraries, polynomials are conventionally represented by continuous one-dimensional lists containing their scalar coefficients. The variable `num` is instantiated as a Python list containing the integer values `[1, 2, -1]`. These numerical values correspond with absolute precision to the coefficients of the numerator polynomial $1 + 2z^{-1} - z^{-2}$. The position of the integer within the list inherently defines the order of the delay operator $z^{-1}$. Similarly, the variable `den` is instantiated as a list containing the floating-point values `[1, -1, 0.3561]`. This precisely maps to the denominator polynomial $1 - z^{-1} + 0.3561z^{-2}$, which governs the feedback characteristics and the location of the system's poles.

  

The critical mathematical synthesis occurs in the subsequent line, `sys = ct.tf(num, den, dt=True)`. Here, the `tf` (transfer function) method from the `control` library is invoked. This method operates as an object constructor. It ingests the raw sequential lists `num` and `den` and structurally converts them into a formalized State-Space or rational polynomial internal representation. The inclusion of the keyword argument `dt=True` is an absolute imperative. By default, such control libraries assume continuous-time evaluation within the Laplace domain ($s$-plane). By explicitly setting the `dt` (discrete-time) flag to boolean `True`, the underlying mathematical engine is forced to evaluate the coefficients as a Z-transform system, thereby applying discrete-time mathematical rules, bounds, and stability criteria to the generated object, which is then assigned to the memory variable `sys`.

  

The culmination of the script is executed by the command `ct.pzmap(sys, title=False)`. The `pzmap` function is a highly specialized visualization routine. Upon execution, the function accesses the internal structure of the `sys` object. It extracts the numerator and denominator polynomials and executes a highly optimized root-finding algorithm (typically based on computing the eigenvalues of a companion matrix derived from the polynomial coefficients). The roots of the numerator are classified as zeros, and the roots of the denominator are classified as poles.

  

Once these complex roots are numerically isolated, the `pzmap` function interfaces with the underlying matplotlib rendering engine to construct a complex two-dimensional Cartesian plane. The horizontal axis represents the real component of the complex variable, and the vertical axis represents the imaginary component. To facilitate stability analysis, the rendering engine automatically superimposes a reference boundary: the unit circle, explicitly delineated using a dotted line format. This geometric construct is defined mathematically as the set of all points $z$ to which the Z-transform perfectly equates to the Discrete-Time Fourier Transform (DFT). The computed zeros are algorithmically mapped onto this complex plane using circular symbol markers ($\circ$), while the computed poles are mapped utilizing cross symbol markers ($\times$). Because discrete-time polynomials with real coefficients will invariably yield complex roots in perfect conjugate pairs, any poles or zeros not located perfectly on the real axis will be rendered symmetrically across the horizontal plane. The auxiliary argument `title=False` is passed to bypass the default string generation, ensuring the resulting graphical output remains rigorously focused on the plotted geometric data. Through this localized script execution, the abstract coefficients of a discrete-time difference equation are successfully translated into a concrete geometric representation of dynamic system stability.

  

## PROBLEM 7: COMPUTATION AND VISUALIZATION OF THE FREQUENCY RESPONSE FOR A DISCRETE-TIME NOTCH FILTER

### 1. PROBLEM STATEMENT

**GIVEN:** A discrete-time signal processing system acts as a highly specialized band-stop filter, explicitly designated as a notch filter. The Z-domain rational transfer function for this specific notch filter is provided mathematically as $H(z) = \frac{1 - 1.6180z^{-1} + z^{-2}}{1 - 1.5371z^{-1} + 0.9025z^{-2}}$. The system operates under a fixed digital sampling frequency denoted as $Fs$, which is established at $512$ Hz. Furthermore, the computational resolution for the frequency analysis is defined by a vector length parameter $N$, which is fixed at $256$ independent evaluation points.

  

**REQUIRED:** An exhaustive algorithmic methodology and a strict programmatic implementation must be developed to compute and visually graph the frequency response of this specific discrete-time notch filter. The solution must utilize the Python programming language, heavily leveraging the `numpy`, `matplotlib.pyplot`, and `scipy.signal` computational libraries. The algorithm must mathematically evaluate the given transfer function along the unit circle to extract both the magnitude response and the phase response. The magnitude response must be mathematically converted into a logarithmic scale, expressed in decibels (dB). The phase response must be extracted and converted from radians into degrees. Finally, the algorithm must generate a highly structured, dual-pane graphical output plotting both the Magnitude Response (in dB) and Phase Response (in degrees) plotted explicitly against a calibrated physical frequency axis (in Hz).

  

### 2. CONCEPTUAL THEORY

While the pole-zero plot offers a robust geometric visualization of system stability within the complex Z-plane, comprehensive engineering analysis requires a rigorous understanding of how a discrete-time system reacts to varying frequencies of steady-state sinusoidal input signals. This steady-state characteristic is formally defined as the frequency response of the system.

  

Fundamentally, evaluating the frequency response of a discrete-time system is strictly equivalent to mathematically evaluating its generalized Z-domain transfer function, $H(z)$, exclusively along the precise boundary of the unit circle. As established in complex variable theory, points on the unit circle are defined by a magnitude of exactly one ($r=1$) and an arbitrary angle $\omega$. Therefore, the complex variable $z$ is substituted with the complex exponential $e^{j\omega}$, where $j$ is the imaginary unit and $\omega$ is the continuous normalized digital angular frequency in radians per sample.

  

By executing this specific substitution, the generalized Z-transform equation structurally collapses into the Discrete-Time Fourier Transform (DTFT). The mathematical relationship is formalized as $H(e^{j\omega}) = H(z)\vert{}_{z=e^{j\omega}}$. Using this fundamental methodology, the generic transfer function of a discrete-time system, previously considered in the polynomial format $H(z) = \frac{b_0 + b_1z^{-1} + \dots + b_Mz^{-M}}{a_0 + a_1z^{-1} + \dots + a_Nz^{-N}}$, can be directly remapped into a complex-valued frequency-dependent function. Because $H(e^{j\omega})$ is inherently a complex quantity, it is universally decomposed into two distinct, physically meaningful components: the magnitude response and the phase response.

  

The magnitude response, denoted mathematically as $\vert{}H(e^{j\omega})\vert{}$, represents the absolute amplitude scaling factor that the filter applies to an incoming sinusoidal signal at a specific frequency $\omega$. In professional engineering contexts, linear amplitude scales are insufficient due to the vast dynamic range of signals. Therefore, the magnitude is almost universally converted into a logarithmic scale utilizing the decibel (dB) unit. The transformation to decibels is calculated using the formula $20 \log_{10}(\vert{}H(e^{j\omega})\vert{})$. Conversely, the phase response, denoted mathematically as $\angle H(e^{j\omega})$, dictates the temporal shift or delay introduced by the filter at that specific frequency, typically calculated using the arctangent of the ratio of the imaginary component to the real component of the complex frequency response vector.

  

To estimate and compute this frequency response in practical digital hardware or software environments, an algorithmic approach based on the Fast Fourier Transform (FFT) is strictly necessary. Continuous evaluation along the infinite points of the unit circle is computationally impossible; thus, the unit circle is discretely sampled at $N$ evenly spaced frequency intervals between $0$ and the Nyquist frequency.

  

The specific system under analysis is categorized as a notch filter. A notch filter is classified as an extremely specialized sub-category of a band-stop filter. The primary operational objective of a notch filter is to synthesize a very sharp, profoundly narrow rejection band. This means the filter is designed to permit almost all frequencies to pass through completely unaltered, except for a highly localized, singular target frequency which is aggressively attenuated or "notched" out of the signal.

  

The geometric architecture of a notch filter in the Z-plane is achieved by placing a pair of complex conjugate zeros precisely upon the unit circle ($\vert{}z\vert{}=1$) at the exact angular frequency corresponding to the target rejection frequency. Because zeros dictate where the transfer function evaluates to null, placing them on the unit circle guarantees that the magnitude response will plummet to absolute zero (or negative infinity in logarithmic decibels) at that exact coordinate. To ensure that the rejection band remains incredibly narrow—leaving surrounding frequencies virtually untouched—a pair of complex conjugate poles is strategically placed precisely behind the zeros, sharing the exact same angular frequency but positioned slightly inside the unit circle ($\vert{}z\vert{} < 1$).

  

The proximity of these poles to the zeros dictates the sharpness of the filter. The width and absolute depth of this resultant notch are entirely governed by adjusting the coefficients of the filter's denominator polynomial, which strictly controls the radial location of the poles in the complex Z-plane, thereby allowing for the precise mathematical tuning of the notch's sharpness and Quality factor (Q-factor).

  

In highly practical equipment engineering, this specific filter architecture is overwhelmingly crucial for eliminating persistent power line hum. Electrical circuits and unshielded cables frequently act as antennas, inadvertently absorbing electromagnetic interference generated by standard utility power grids. In many regions, this mains noise operates at a continuous, dominating frequency of $50$ Hz. By engineering a notch filter with an aggressive, sudden dip precisely centered at the $50$ Hz center frequency, the offending electrical hum is surgically removed from the signal path while preserving the integrity of the underlying baseband data. The visual confirmation of this localized attenuation is provided by graphing the magnitude response, which confirms the filter's function by exhibiting a deep, precipitous dive strictly at the targeted center frequency.

  

### 3. ALGORITHM DESIGN

To computationally synthesize the frequency response and extract the necessary phase and logarithmic magnitude data, a highly sequential, multi-stage matrix processing algorithm must be designed. The procedure will ingest polynomial coefficients, apply discrete Fourier analysis, execute complex arithmetic conversions, and generate multi-pane data visualizations.

  

1. **Library Importation and Environment Configuration:**
    
    The algorithm initiates by loading heavily optimized scientific computing libraries. The `numpy` library is required for high-speed, vectorized complex array mathematics. The `matplotlib.pyplot` library is required to render the two-dimensional cartesian data plots. Most critically, the `signal` sub-package from the `scipy` (Scientific Python) library must be explicitly imported, as it contains the pre-compiled, highly specialized Fast Fourier Transform algorithms required to evaluate digital transfer functions.
    
      
    
2. **Definition of System Transfer Function Arrays:** The mathematical coefficients defining the filter architecture must be declared. A primary vector array representing the numerator polynomial coefficients must be parameterized exactly as $[1, -1.6180, 1]$. A secondary vector array representing the denominator polynomial coefficients must be parameterized exactly as $[1, -1.5371, 0.9025]$. These coefficients intrinsically dictate the pole and zero locations responsible for the notch filter geometry.
    
      
    
3. **Definition of Sampling and Computational Resolution Parameters:** The digital environment variables must be established to map normalized digital frequencies back to physical real-world frequencies. The system sampling frequency, defined as the variable $Fs$, must be strictly set to the scalar integer $512$. This value represents the rate at which continuous time is discretized. The computational resolution, defined as the variable $N$, dictates the number of distinct frequency evaluation points computed between zero and the Nyquist limit; this parameter must be strictly set to the scalar integer $256$.
    
      
    
4. **Execution of Frequency Response Computation:** The `freqz` function from the `scipy.signal` package must be executed. This function will receive the numerator array, the denominator array, the point resolution variable $N$, and the sampling frequency variable $Fs$ as functional arguments. Using a highly optimized Fast Fourier Transform (FFT) backend approach, the function will compute the frequency response by evaluating the rational polynomials along $256$ points of the unit circle. The function will return two distinct one-dimensional arrays: a vector containing the physical frequency points evaluated (in Hertz), and a vector containing the raw, complex-valued transfer function outputs at each corresponding frequency point.
    
      
    
5. **Data Extraction and Logarithmic Conversion:** The raw complex response vector must be decomposed. First, the absolute magnitude of every complex floating-point number in the array must be computed using `numpy.abs`. Because linear scales obscure extreme attenuations, these raw magnitudes must be converted into decibels. This is achieved by computing the base-10 logarithm of the magnitude array using `numpy.log10` and subsequently multiplying the entire vector by the constant scalar $20$.
    
      
    
6. **Phase Extraction and Angular Conversion:** Simultaneously, the angular phase data must be extracted from the raw complex response vector. The mathematical angle of each complex coordinate must be computed. To ensure intuitive engineering analysis, a boolean flag must be passed during the angle computation to force the resulting output vector into degrees rather than radians.
    
      
    
7. **Graphical Rendering of Magnitude Response:** A localized rendering window must be subdivided to accommodate two distinct plots. The upper subplot panel must be activated. The calculated physical frequency array must be mapped to the horizontal X-axis, and the calculated logarithmic magnitude array (in dB) must be mapped to the vertical Y-axis. String labels must be algorithmically applied to properly title the plot and explicitly declare the physical units of both axes. A dashed grid overlay must be activated to facilitate precise visual extraction of the notch depth.
    
      
    
8. **Graphical Rendering of Phase Response:** The lower subplot panel must be subsequently activated. The exact same physical frequency array must be mapped to the horizontal X-axis, ensuring alignment with the magnitude plot. The computed angular phase array (in degrees) must be mapped to the vertical Y-axis. Identical strict labeling and grid overlay procedures must be applied to this secondary plot. Finally, a tight layout algorithm must be invoked to automatically adjust the structural padding between the two rendered plots, preventing topological overlap before the final image is pushed to the display buffer.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
# Import core scientific libraries for matrix math, plotting, and signal processing
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Define the numerator coefficients of the notch filter transfer function
num = [1, -1.6180, 1]

# Define the denominator coefficients of the notch filter transfer function
den = [1, -1.5371, 0.9025]

# Establish the digital sampling frequency (in Hertz)
Fs = 512

# Establish the computational resolution (number of frequency evaluation points)
N = 256

# Compute the frequency response utilizing an FFT-based evaluation along the unit circle
# Returns the physical frequency vector (w) and the complex frequency response vector (h)
w, h = signal.freqz(num, den, worN=N, fs=Fs)

# Initialize a multi-pane plot and activate the upper subplot panel for magnitude
plt.subplot(2, 1, 1)

# Extract the absolute magnitude of the complex response and convert entirely to decibels (dB)
magnitude_db = 20 * np.log10(np.abs(h))

# Plot the physical frequencies against the logarithmic magnitude response
plt.plot(w, magnitude_db)
plt.title('Magnitude Response')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude (dB)')
plt.grid(True, linestyle='--')

# Activate the lower subplot panel for phase rendering
plt.subplot(2, 1, 2)

# Extract the angular phase from the complex response and automatically convert to degrees
phase_degrees = np.angle(h, deg=True)

# Plot the physical frequencies against the extracted phase response
plt.plot(w, phase_degrees)
plt.title('Phase Response')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Phase (Degrees)')
plt.grid(True, linestyle='--')

# Algorithmically adjust inter-plot spacing to prevent textual overlapping
plt.tight_layout()
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The presented programmatic implementation is a highly optimized script designed to rigorously extract and visualize the complex frequency characteristics of a customized digital notch filter. The code initiates by establishing its dependency architecture through three vital import statements. The `numpy` library is imported and bound to the alias `np`. `numpy` is the foundational tensor and array computation matrix for Python, providing the underlying C-compiled architecture necessary to process thousands of complex floating-point calculations instantly. Next, `matplotlib.pyplot` is imported and bound to the alias `plt`; this is the standard state-machine based rendering engine utilized for scientific 2D graphing. Finally, the specific `signal` module is extracted directly from the `scipy` (Scientific Python) library, granting immediate access to advanced digital signal processing algorithms and filter design toolkits.

  

The physical architecture of the filter is strictly defined by declaring two localized Python lists. The variable `num` is instantiated to hold the floating-point values `[1, -1.6180, 1]`. These values mathematically represent the numerator polynomial $1 - 1.6180z^{-1} + z^{-2}$. The leading and trailing ones dictate that the zeros are positioned exactly on the unit circle, ensuring absolute zero transmission (an infinite depth notch) at the target frequency. The variable `den` is instantiated to hold the values `[1, -1.5371, 0.9025]`, which strictly represent the denominator polynomial $1 - 1.5371z^{-1} + 0.9025z^{-2}$. These coefficients place the stabilizing poles directly behind the zeros in the complex plane, physically controlling the width and selectivity of the rejection band.

  

To map these dimensionless mathematical abstractions into physical reality, temporal boundary variables must be established. The variable `Fs` is set to integer `512`, defining the digital sampling rate of the system as $512$ samples per second (Hertz). The variable `N` is strictly set to `256`. This scalar variable dictates the numerical density of the evaluation; it commands the subsequent functions to calculate exactly $256$ independent frequency coordinates between $0$ Hz and the Nyquist limit (which is precisely $\frac{Fs}{2}$, or $256$ Hz).

  

The computational core of the algorithm is executed by the line `w, h = signal.freqz(num, den, worN=N, fs=Fs)`. The `freqz` function is a highly specialized routine that computes the frequency response of a discrete-time system utilizing a heavily optimized Fast Fourier Transform (FFT) based approach. The function ingests the `num` and `den` polynomial vectors. The argument `worN=N` instructs the function to compute the response across $N=256$ evenly distributed frequencies. Crucially, by passing the sampling frequency `fs=Fs`, the function natively scales its output into physical units rather than normalized digital radians. The function terminates by returning two distinct one-dimensional arrays: `w`, representing the calculated array of frequencies at which the response was computed (in the same physical units as $Fs$), and `h`, representing the raw, complex-valued frequency response array evaluated precisely at those specific frequencies.

  

Because the response vector `h` contains raw complex numbers (combining both amplitude scaling and phase shifting in a single $a + jb$ format), it must be mathematically fractured into observable components. To visualize the filter's magnitude attenuation, a dual-stage calculation is performed on the array: `magnitude_db = 20 * np.log10(np.abs(h))`. First, the `np.abs(h)` function executes a vectorized computation to calculate the absolute Euclidean distance (magnitude) of every complex point from the origin. Because the notch filter introduces a sudden, extreme dip in amplitude specifically engineered to eliminate 50 Hz power line hum, a linear scale would completely obscure the localized depth of the attenuation. Therefore, the resulting magnitude vector is instantly pushed through a base-10 logarithmic transformation via `np.log10`, and scaled by $20$ to convert the entire dataset into rigorous acoustic/electrical decibels (dB).

  

Concurrently, the script prepares the visual canvas. The `plt.subplot(2, 1, 1)` directive instructs the matplotlib engine to divide the rendering window into a matrix containing $2$ rows and $1$ column, and explicitly activates the upper $1$st panel. The `plt.plot(w, magnitude_db)` command renders the decibel vector directly against the physical frequency vector. The subsequent `plt.title`, `plt.xlabel`, and `plt.ylabel` commands inject precisely formatted string labels directly onto the axes, definitively identifying the physical units as "Frequency (Hz)" and "Magnitude (dB)". The `plt.grid(True, linestyle='--')` command forcefully overlays a dashed cartesian grid, allowing engineers to visually verify that the deep, sudden dip (the "notch") occurs perfectly and precisely at the critical $50$ Hz center coordinate.

  

The script proceeds to extract the secondary temporal metric: phase. The lower subplot panel is initialized via `plt.subplot(2, 1, 2)`. The raw complex vector `h` is processed a second time using the `np.angle(h, deg=True)` function. This vectorized numpy operation calculates the mathematical angle (the inverse tangent of the imaginary over real components) for every element in the array. The explicit inclusion of the keyword argument `deg=True` forces the underlying C-engine to bypass standard radian output and automatically convert the resulting matrix into standard degrees, storing the output in the memory variable `phase_degrees`.

  

This angular data is subsequently graphed against the exact same physical frequency axis using `plt.plot(w, phase_degrees)`. The identical strict labeling procedures are applied to define the Y-axis strictly as "Phase (Degrees)", and identical dashed grid lines are applied. The plot reveals a violent phase transition precisely localized at the $50$ Hz threshold, structurally consistent with a perfect conjugate zero crossing on the unit circle. The script terminates with the `plt.tight_layout()` command. This critical final algorithmic step forces the rendering engine to evaluate the bounding boxes of all text labels across both subplots and dynamically recalculate the internal padding margins, ensuring that the X-axis label of the upper magnitude plot does not graphically collide with the title of the lower phase plot before the final image matrix is rasterized to the display hardware. 


## PROBLEM 8: ANALYSIS AND COMPUTATION OF IMPULSE RESPONSE FOR A SECOND-ORDER CAUSAL LINEAR TIME-INVARIANT SYSTEM

### 1. PROBLEM STATEMENT

**GIVEN:** A causal, Linear Time-Invariant (LTI) system is definitively characterized by the following second-order constant-coefficient difference equation: $y[n] - 4y[n-1] + 4y[n-2] = x[n] - x[n-1]$. Furthermore, an input signal is provided for processing, defined mathematically as: $x[n] = (5 + 3\cos(0.2\pi n) + 4\sin(0.6\pi n))u[n]$.

  

**REQUIRED:**

The analytical and computational extraction of the system's fundamental properties is required. Specifically, the following objectives must be achieved:

  

1. The impulse response of the system must be determined analytically through the direct algebraic solution of the provided difference equation.
    
      
    
2. The impulse response must be determined programmatically utilizing the standard recursive filtering function, specifically identified as the `lfilter` function.
    
      
    
3. The numerical output of the impulse response must be calculated and displayed over the specific discrete-time interval defined by $-20 \le n \le 25$.
    
      
    
4. The final output of the discrete-time system, denoted as $y[n]$, must be computed and demonstrated when the specific composite sinusoidal input signal, $x[n] = (5 + 3\cos(0.2\pi n) + 4\sin(0.6\pi n))u[n]$, is applied to the system.
    
      
    

### 2. CONCEPTUAL THEORY

To fully comprehend the mechanics of the given discrete-time system, the fundamental axioms of digital signal processing must be systematically established. A discrete-time signal is defined as a sequence of complex or real numbers mathematically represented as $x[n]$, where the independent variable $n$ represents an integer index. A system is defined as a mathematical transformation applied to an input signal $x[n]$ to yield an output signal $y[n]$.

  

The system under investigation is specified as a Linear Time-Invariant (LTI) system. Linearity dictates that the system obeys the principle of superposition. If an input $x_1[n]$ produces output $y_1[n]$ and $x_2[n]$ produces $y_2[n]$, then an input of $ax_1[n] + bx_2[n]$ will universally produce an output of $ay_1[n] + by_2[n]$, where $a$ and $b$ are arbitrary scalar constants. Time-invariance dictates that a temporal shift in the input signal directly results in an identical temporal shift in the output signal; thus, if $x[n]$ yields $y[n]$, then $x[n-k]$ yields $y[n-k]$ for any integer $k$.

  

Because the system is LTI, it is entirely characterized by its impulse response, universally denoted as $h[n]$. The impulse response is defined as the output of the system when the input is precisely the Kronecker delta function, $\delta[n]$, which equals $1$ at $n=0$ and $0$ everywhere else. For any arbitrary input $x[n]$, the output $y[n]$ is computed via the discrete convolution sum:

  

$$y[n] = x[n] * h[n] = \sum_{k=-\infty}^{\infty} x[k]h[n-k]$$

The system is also declared to be causal. A causal system is strictly non-anticipatory, meaning the current output $y[n]$ depends only on current and past input values (e.g., $x[n], x[n-1]$) and past output values (e.g., $y[n-1]$), but never on future values. For an LTI system, causality manifests mathematically as the condition that the impulse response must be zero for all negative time indices: $h[n] = 0$ for $n < 0$.

  

The specific mathematical model governing the system is a linear constant-coefficient difference equation. The provided equation is:

  

$$y[n] - 4y[n-1] + 4y[n-2] = x[n] - x[n-1]$$

To solve this analytically, the bilateral Z-transform is utilized. The Z-transform converts discrete-time difference equations into algebraic equations in the complex $z$-domain. The fundamental definition of the Z-transform for a signal $x[n]$ is:

  

$$X(z) = \sum_{n=-\infty}^{\infty} x[n]z^{-n}$$

A critical property of the Z-transform utilized in solving difference equations is the time-shifting property. Assuming zero initial conditions, a delay in the time domain corresponds to a multiplication by $z^{-1}$ in the $z$-domain. Therefore, the Z-transform of $x[n-k]$ is rigorously defined as $z^{-k}X(z)$.

  

Applying this property to the given difference equation yields:

  

$$Y(z) - 4z^{-1}Y(z) + 4z^{-2}Y(z) = X(z) - z^{-1}X(z)$$

Factoring the common terms provides the algebraic relationship:

  

$$Y(z) [1 - 4z^{-1} + 4z^{-2}] = X(z) [1 - z^{-1}]$$

The system transfer function, universally defined as $H(z) = \frac{Y(z)}{X(z)}$, is thereby isolated:

  

$$H(z) = \frac{1 - z^{-1}}{1 - 4z^{-1} + 4z^{-2}}$$

To determine the impulse response $h[n]$, the inverse Z-transform of $H(z)$ must be computed. This requires factorization of the denominator polynomial to identify the system poles. The denominator is $1 - 4z^{-1} + 4z^{-2}$, which is a perfect square polynomial equivalent to $(1 - 2z^{-1})^2$.

  

$$H(z) = \frac{1 - z^{-1}}{(1 - 2z^{-1})^2}$$

To facilitate the inverse Z-transform via standard look-up tables, the expression is linearly decomposed.

  

$$H(z) = \frac{1}{(1 - 2z^{-1})^2} - \frac{z^{-1}}{(1 - 2z^{-1})^2}$$

The standard Z-transform pair for a polynomial multiplied by an exponential sequence is defined as:

  

$$\mathcal{Z}\{(n+1)a^n u[n]\} = \frac{1}{(1 - az^{-1})^2}$$

Applying this standard property to the first term where $a=2$:

  

$$\mathcal{Z}^{-1}\left\{\frac{1}{(1 - 2z^{-1})^2}\right\} = (n+1)2^n u[n]$$

For the second term, the time-shifting property is applied. A multiplication by $z^{-1}$ signifies a time delay of $1$ sample.

  

$$\mathcal{Z}^{-1}\left\{z^{-1} \frac{1}{(1 - 2z^{-1})^2}\right\} = ((n-1)+1)2^{n-1} u[n-1] = n 2^{n-1} u[n-1]$$

Therefore, the precise analytical expression for the impulse response is derived as:

  

$$h[n] = (n+1)2^n u[n] - n 2^{n-1} u[n-1]$$

Given that $n 2^{n-1}$ evaluates to $0$ at $n=0$, the unit step function $u[n-1]$ can be seamlessly replaced with $u[n]$ to consolidate the expression.

  

$$h[n] = \left( (n+1)2^n - n 2^{n-1} \right) u[n]$$

To further simplify, the term $n 2^{n-1}$ is rewritten as $\frac{n}{2} 2^n$.

  

$$h[n] = \left( n + 1 - \frac{n}{2} \right) 2^n u[n] = \left( \frac{n}{2} + 1 \right) 2^n u[n]$$

This represents the exact, closed-form mathematical solution for the impulse response.

  

### 3. ALGORITHM DESIGN

The translation of the aforementioned theoretical derivations into an executable computational algorithm requires a highly structured sequence of numerical operations.

  

1. **Environment Initialization:** The computational workspace must be provisioned with numerical processing libraries capable of handling multidimensional arrays, recursive filtering, and graphical plotting.
    
      
    
2. **Vector Definition for Impulse Response Extraction:** To satisfy the requirement of calculating the impulse response within the precise bounds of $-20 \le n \le 25$, an integer sequence array must be generated representing the independent time variable $n$.
    
      
    
3. **Impulse Signal Generation:** A discrete unit impulse function, $\delta[n]$, must be synthesized over the generated time vector. This is computationally achieved by initializing an array of zeros of equivalent length to the time vector, and assigning a value of strictly $1.0$ at the exact index where the temporal variable $n$ equals $0$.
    
      
    
4. **Coefficient Array Formulation:** The constant coefficients of the given difference equation must be extracted and formatted into arrays required by the recursive filtering algorithm.
    
      
    - The feedforward coefficients (numerator of $H(z)$) correspond to the $x$ terms: $b = [1, -1, 0]$.
        
          
        
    - The feedback coefficients (denominator of $H(z)$) correspond to the $y$ terms: $a = [1, -4, 4]$.
        
          
        
5. **Recursive Filtering (lfilter Execution):** The algorithmic function equivalent to `lfilter` is invoked using the formulated coefficient arrays $b$ and $a$, applied directly to the synthetic unit impulse signal array. This operation recursively computes $y[n]$ at each step according to the difference equation, effectively yielding the computational impulse response $h[n]$.
    
      
    
6. **Composite Input Signal Construction:** The problem mandates processing a specific input signal: $x[n] = (5 + 3\cos(0.2\pi n) + 4\sin(0.6\pi n))u[n]$. A new, extended time vector is computationally generated (starting from $n=0$ due to the $u[n]$ term) to provide a sufficient observation window for the system's dynamic response. The sinusoidal and constant mathematical components are executed programmatically to populate the input signal array.
    
      
    
7. **System Output Computation:** The formulated input signal array is passed through the same `lfilter` algorithmic structure utilizing the identical $b$ and $a$ coefficient arrays. This generates the ultimate discrete-time output array, representing the system's complete forced response to the multi-frequency sinusoidal input.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import scipy.signal as signal
import matplotlib.pyplot as plt

# ---------------------------------------------------------
# Part (i) & (ii): Determine impulse response and show for -20 <= n <= 25
# ---------------------------------------------------------

# Define the discrete time vector exactly as requested
n_impulse = np.arange(-20, 26)

# Generate the unit impulse signal delta[n]
# The impulse occurs exactly where n == 0
impulse_signal = np.where(n_impulse == 0, 1.0, 0.0)

# Define the difference equation coefficients
# y[n] - 4y[n-1] + 4y[n-2] = x[n] - x[n-1]
# Numerator coefficients (b) for x[n]: 1, -1, 0
b_coeffs = np.array([1.0, -1.0, 0.0])
# Denominator coefficients (a) for y[n]: 1, -4, 4
a_coeffs = np.array([1.0, -4.0, 4.0])

# Compute the impulse response using the lfilter function
h_computed = signal.lfilter(b_coeffs, a_coeffs, impulse_signal)

# ---------------------------------------------------------
# Part (iii): Show output for the specified input signal x[n]
# ---------------------------------------------------------

# Define a time vector for the input signal, constrained by u[n] (n >= 0)
# A length of 50 samples is chosen to adequately visualize the waveforms
n_input = np.arange(0, 50)

# Generate the specific input signal: x[n] = 5 + 3cos(0.2*pi*n) + 4sin(0.6*pi*n)
x_n = 5.0 + 3.0 * np.cos(0.2 * np.pi * n_input) + 4.0 * np.sin(0.6 * np.pi * n_input)

# Compute the system output using the lfilter function
y_n_output = signal.lfilter(b_coeffs, a_coeffs, x_n)

# ---------------------------------------------------------
# Output Visualization and Display
# ---------------------------------------------------------

# Print numerical values for verification
print("--- IMPULSE RESPONSE COMPUTATION ---")
for i, n_val in enumerate(n_impulse):
    if -5 <= n_val <= 10:  # Truncated print output for brevity in console
        print(f"n = {n_val:2d} | h[n] = {h_computed[i]:.2f}")

print("\n--- SYSTEM OUTPUT FOR COMPOSITE SINUSOIDAL INPUT ---")
for i, n_val in enumerate(n_input[:10]): # Print first 10 values
    print(f"n = {n_val:2d} | x[n] = {x_n[i]:.2f} | y[n] = {y_n_output[i]:.2f}")
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The computational script provided in the preceding section is engineered precisely to resolve the specified problem constraints through sequential programmatic logic.

  

The initial phase of the script handles the importation of the requisite numerical libraries. The `numpy` library is utilized for matrix and vector operations, which form the bedrock of digital signal array representations. The `scipy.signal` library is imported to access rigorous, optimized digital signal processing routines, explicitly the `lfilter` command necessitated by the problem statement.

  

A temporal vector `n_impulse` is explicitly synthesized using `np.arange(-20, 26)` to strictly adhere to the designated calculation boundaries of $-20 \le n \le 25$. This array maps precisely to the independent variable $n$ in the theoretical discrete-time domain. Following this, the theoretical Kronecker delta function is physically realized in code using the `np.where` conditional routing function, ensuring that the `impulse_signal` array contains zeros everywhere except at the exact coordinate where the underlying `n_impulse` array evaluates to zero, whereupon a value of $1.0$ is injected.

  

The transfer function mapping is subsequently configured. The parameters $b\_coeffs$ and $a\_coeffs$ are instantiated as floating-point arrays. The array `b_coeffs = [1.0, -1.0, 0.0]` perfectly mirrors the right-hand side of the difference equation $x[n] - x[n-1]$, corresponding to $1 - z^{-1}$ in the $z$-domain. The array `a_coeffs = [1.0, -4.0, 4.0]` perfectly mirrors the left-hand autoregressive side $y[n] - 4y[n-1] + 4y[n-2]$, corresponding to $1 - 4z^{-1} + 4z^{-2}$.

  

The `signal.lfilter(b_coeffs, a_coeffs, impulse_signal)` function is then executed. This function algorithmically implements the Direct Form II transposed realization of the LTI difference equation. As the synthetic `impulse_signal` passes through the recursive loop dictated by the coefficients, the resultant output array stored in `h_computed` perfectly mirrors the analytical impulse response $h[n]$. Because the system represents an unstable configuration (poles at $z=2$), the values of $h[n]$ will be observed to grow exponentially for $n \ge 0$, whilst remaining identically zero for $n < 0$, thereby successfully confirming both system causality and the analytical derivation.

  

The secondary phase addresses the composite input signal evaluation. The independent time array `n_input` is defined starting strictly at zero, which programmatically enforces the theoretical unit step function $u[n]$ multiplier appended to the mathematical definition of $x[n]$. The mathematical function $x[n] = (5 + 3\cos(0.2\pi n) + 4\sin(0.6\pi n))u[n]$ is mapped line-for-line into vectorized Python arithmetic leveraging `np.cos`, `np.sin`, and `np.pi`. This generates a discretized, synthesized waveform array stored in the variable `x_n`.

  

Finally, the simulated input vector `x_n` is filtered through the identical LTI system framework via a secondary invocation of `signal.lfilter`. This outputs the completely resolved forced response array `y_n_output`. A formatted console print structure is deployed at the termination of the script to extract and display the exact numerical magnitudes of both the simulated impulse response and the composite waveform response across the specified temporal intervals, completely satisfying all problem directives.

  

## PROBLEM 9: DETERMINATION OF FREQUENCY RESPONSE FOR A SECOND-ORDER DIGITAL FILTER SYSTEM

### 1. PROBLEM STATEMENT

**GIVEN:** A discrete-time linear dynamic system is explicitly described by its system transfer function in the complex Z-domain. The specified mathematical representation of this transfer function is: $H(z) = \frac{z^{-1} + \frac{1}{2}z^{-2}}{1 - \frac{3}{5}z^{-1} + \frac{2}{25}z^{-2}}$.

  

**REQUIRED:** The fundamental objective is the comprehensive analytical and mathematical determination of the frequency response of the stated discrete-time system. This mandates the rigorous mapping of the given Z-domain transfer function into the continuous frequency domain, resulting in an expression characterizing the system's magnitude and phase alterations applied to incident sinusoidal signals.

  

### 2. CONCEPTUAL THEORY

To successfully extract the frequency response from a generalized Z-domain transfer function, the geometric relationship between the complex Z-plane and the discrete-time frequency domain must be thoroughly defined.

  

The Z-transform of a discrete-time signal sequence $h[n]$ is universally defined as a power series over a complex variable $z$:

  

$$H(z) = \sum_{n=-\infty}^{\infty} h[n]z^{-n}$$

The complex variable $z$ is typically expressed in polar form as $z = re^{j\omega}$, where $r$ denotes the radial distance from the origin of the complex plane, and $\omega$ dictates the continuous angle in radians. In the specific context of discrete-time signal processing, this angle $\omega$ directly represents the normalized discrete-time frequency, measured in units of radians per sample.

  

The Discrete-Time Fourier Transform (DTFT) provides the continuous frequency spectrum of a discrete-time sequence and is mathematically defined as:

  

$$H(e^{j\omega}) = \sum_{n=-\infty}^{\infty} h[n]e^{-j\omega n}$$

Through direct inspection and comparison of the $H(z)$ and $H(e^{j\omega})$ summations, a fundamental geometric correspondence is revealed. If the complex radial magnitude $r$ is constrained to unity ($r = 1$), the generic complex variable $z = re^{j\omega}$ degenerates precisely to $z = e^{j\omega}$. In the complex Z-plane, the locus of points where $r=1$ traces an exact circle of radius one centered at the origin, canonically referred to as the "unit circle."

  

Therefore, a profound theoretical theorem in digital signal processing dictates that the frequency response of a discrete-time Linear Time-Invariant system is algebraically equivalent to its Z-domain transfer function strictly evaluated precisely along the contour of the unit circle, provided the unit circle is fully encapsulated within the Region of Convergence (ROC) of the transfer function. This relationship is formalized mathematically as:

  

$$H(e^{j\omega}) = H(z)\Big\vert{}_{z = e^{j\omega}}$$

The transfer function provided for analysis is formulated as a ratio of polynomial expressions in negative powers of $z$:

  

$$H(z) = \frac{z^{-1} + 0.5z^{-2}}{1 - 0.6z^{-1} + 0.08z^{-2}}$$

(Note: The fractional constants $\frac{1}{2}$, $\frac{3}{5}$, and $\frac{2}{25}$ from the given equation have been equivalently transcribed to decimal formats $0.5$, $0.6$, and $0.08$ for notational clarity).

  

To extract the exact mathematical expression for the frequency response, the substitution axiom $z = e^{j\omega}$ must be systematically applied to every instance of the $z$ variable within the algebraic fraction. The fundamental rules of complex exponentiation state that $(e^{j\omega})^{-k} = e^{-j\omega k}$. Applying this mapping explicitly to the specified transfer function yields the continuous frequency response equation:

  

$$H(e^{j\omega}) = \frac{e^{-j\omega} + 0.5e^{-j2\omega}}{1 - 0.6e^{-j\omega} + 0.08e^{-j2\omega}}$$

This resultant algebraic fraction fully characterizes the frequency response of the system. For any given input frequency $\omega_0$, evaluating this complex function will yield a specific complex number. The absolute magnitude of this complex number, $\vert{}H(e^{j\omega_0})\vert{}$, governs the system's amplitude scaling at that frequency (magnitude response), while the angular argument, $\angle H(e^{j\omega_0})$, governs the temporal phase shift induced by the system at that frequency (phase response).

  

### 3. ALGORITHM DESIGN

The conversion of the derived continuous analytical frequency response equation into an operational computational script requires the discretization of the continuous frequency variable $\omega$ and the vectorized evaluation of complex mathematical arrays.

  

1. **Computational Library Importation:** High-performance numerical computation libraries specifically designed for array manipulation and complex arithmetic must be loaded into the memory space.
    
      
    
2. **Filter Coefficient Extraction:** The numerical coefficients of the polynomials in the Z-domain transfer function must be isolated and loaded into discrete computational arrays.
    
      
    - The numerator polynomial from $H(z) = \frac{z^{-1} + 0.5z^{-2}}{\dots}$ dictates the feedforward coefficients. Since there is no constant term $z^0$, the zero-th coefficient is identically $0$. Thus, array $b = [0.0, 1.0, 0.5]$.
        
          
        
    - The denominator polynomial from $H(z) = \frac{\dots}{1 - 0.6z^{-1} + 0.08z^{-2}}$ dictates the feedback coefficients. Thus, array $a = [1.0, -0.6, 0.08]$.
        
          
        
3. **Frequency Array Discretization:** The continuous normalized frequency variable $\omega$, theoretically spanning the continuous interval from $-\pi$ to $\pi$, must be simulated by generating a dense linear space of discrete numerical values bounded between $0$ and $\pi$ radians/sample (representing the positive frequency spectrum up to the Nyquist limit).
    
      
    
4. **Frequency Response Execution (`freqz`):** A specialized optimized algorithm designed to evaluate rational transfer functions along the unit circle must be invoked. The standard digital filtering library function `freqz` takes the $b$ and $a$ coefficient arrays alongside the chosen resolution length, computing the exact complex array representing $H(e^{j\omega})$.
    
      
    
5. **Magnitude and Phase Decomposition:** The output array from the `freqz` computation consists of raw complex numbers. These must be mathematically processed using absolute value functions (to extract the magnitude $\vert{}H(e^{j\omega})\vert{}$) and complex angle functions (to extract the phase $\angle H(e^{j\omega})$ in radians or degrees).
    
      
    
6. **Data Visualization:** The decomposed magnitude and phase arrays must be graphically plotted against the discretized continuous frequency axis to visually verify the analytical derivation.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import scipy.signal as signal
import matplotlib.pyplot as plt

# Define the coefficients of the transfer function H(z)
# Numerator: z^-1 + 0.5*z^-2  => [0, 1, 0.5]
b_coeffs = np.array([0.0, 1.0, 0.5])

# Denominator: 1 - (3/5)z^-1 + (2/25)z^-2 => [1, -0.6, 0.08]
a_coeffs = np.array([1.0, -0.6, 0.08])

# Compute the frequency response using scipy.signal.freqz
# worN=1024 specifies the number of frequency points to compute between 0 and pi
w_freqs, h_complex_response = signal.freqz(b_coeffs, a_coeffs, worN=1024)

# Calculate the magnitude response (absolute value of the complex response)
# Often converted to decibels (dB) for engineering analysis: 20 * log10(magnitude)
magnitude_response = np.abs(h_complex_response)
magnitude_db = 20 * np.log10(np.maximum(magnitude_response, 1e-10))

# Calculate the phase response (angle of the complex response in radians)
phase_response_rad = np.angle(h_complex_response)

# Print confirmation of the calculated arrays
print("Frequency Response successfully computed.")
print(f"Evaluated across {len(w_freqs)} discrete frequency points from 0 to pi.")
print(f"Max Magnitude (Linear): {np.max(magnitude_response):.4f}")
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The computational procedure architected above executes the exact mathematical unit-circle evaluation mandated by the theory of frequency response extraction.

  

The essential numerical processing is initiated by explicitly translating the mathematical fractions contained within the problem statement into vectorized formats compatible with digital computing algorithms. The numerator polynomial is defined programmatically as `b_coeffs = np.array([0.0, 1.0, 0.5])`. It is a critical syntactical necessity in digital filter algorithms that polynomial coefficient arrays correspond to ascending negative powers of $z$, beginning identically with $z^0$. Because the given numerator lacks a constant scalar term and begins directly with $z^{-1}$, a structural $0.0$ must strictly be inserted at the zero-th index of the $b$ array to maintain algorithmic alignment. Similarly, the denominator fractions $3/5$ and $2/25$ are numerically translated to their strict floating-point equivalents, yielding `a_coeffs = np.array([1.0, -0.6, 0.08])`.

  

The functional core of the script rests upon the `signal.freqz()` method. This function is a highly optimized subroutine that executes the polynomial evaluation $H(e^{j\omega}) = \frac{\sum b_k e^{-j\omega k}}{\sum a_k e^{-j\omega k}}$. The parameter `worN=1024` instructs the subroutine to divide the upper half of the unit circle (from $\omega=0$ to $\omega=\pi$) into $1024$ equidistant angular increments, effectively simulating a continuous frequency sweep. The function yields two output vectors: `w_freqs`, which contains the precise angular coordinates of evaluation, and `h_complex_response`, which houses the resulting sequence of raw, unformatted complex numbers representing the ratio of the evaluated polynomials at each discrete frequency point.

  

Because raw complex arrays cannot be intuitively interpreted, mathematical decomposition functions are applied. The `np.abs()` function is executed iteratively across the entire `h_complex_response` array, mapping each complex coordinate geometrically to its scalar distance from the complex origin. This isolates the physical magnitude response of the system. For advanced engineering utility, this linear magnitude is passed through a logarithmic transformation using `20 * np.log10()` to project the data into standard Decibel (dB) format. Concurrently, the `np.angle()` mathematical routine scans the complex array, calculating the standard inverse tangent of the ratio of the imaginary component to the real component, successfully isolating the precise phase alteration enacted by the system at every evaluated frequency point.

  

## PROBLEM 10: POLE-ZERO MAPPING AND STABILITY ANALYSIS OF A THIRD-ORDER DIGITAL SYSTEM

### 1. PROBLEM STATEMENT

**GIVEN:** A discrete-time linear dynamical system is strictly defined by a rational Z-domain transfer function mathematically represented as: $H(z) = \frac{z^3 - 2z^2 + 2z - 1}{(z-1)(z-0.5)(z-0.2)}$. Simultaneously, the physical Region of Convergence (ROC) associated with this specific mathematical Z-transform is unequivocally asserted and given by the strict algebraic inequality: $\vert{}z\vert{} > 2$.

  

**REQUIRED:**

A comprehensive stability and geometric analysis must be performed on the specified system, targeting two exact operational directives:

  

1. The physical generation and display of the pole-zero diagram for the provided system transfer function $H(z)$ must be shown.
    
      
    
2. A definitive, mathematically supported conclusion must be provided answering the query: Is the system stable?. This conclusion must be rigorously justified based on the interplay between the determined pole locations and the explicitly given Region of Convergence condition $\vert{}z\vert{} > 2$.
    
      
    

### 2. CONCEPTUAL THEORY

The complete theoretical comprehension of a linear discrete-time system's behavioral characteristics is profoundly rooted in the mathematical analysis of its Z-domain representation, specifically focusing on the roots of its constituent polynomials and the spatial boundaries of its Region of Convergence.

  

The generalized transfer function of a digital system, $H(z)$, is universally constructed as a rational function—a ratio of a numerator polynomial $N(z)$ and a denominator polynomial $D(z)$.

  

$$H(z) = \frac{N(z)}{D(z)}$$

The mathematical roots of the numerator polynomial $N(z) = 0$ define the exact coordinates in the complex Z-plane known as the "zeros" of the system. At these specific complex coordinates, the entire transfer function evaluates to mathematically zero, signifying that inputs composed of these complex exponential frequencies are entirely nullified or suppressed by the system structure. Conversely, the exact mathematical roots of the denominator polynomial $D(z) = 0$ dictate the complex coordinates known uniformly as the "poles" of the system. At these complex locations, the transfer function mathematically diverges toward infinity. Poles are the ultimate determinators of the system's fundamental dynamic behavior, transient response, and overall structural stability.

  

The pole-zero diagram is a fundamental geometric visualization tool. It consists of plotting the complex Z-plane—a two-dimensional Cartesian grid where the horizontal axis maps the real component of the complex variable $z$ and the vertical axis maps the imaginary component. On this grid, zeros are universally marked using an 'O' symbol, while poles are strictly marked using an 'X' symbol. A critical reference boundary drawn on every pole-zero diagram is the unit circle, defined by the strict equality $\vert{}z\vert{} = 1$.

  

Beyond the geometric coordinates of poles and zeros, the complete mathematical validity of any given Z-transform is utterly dependent on its Region of Convergence (ROC). The Z-transform is fundamentally an infinite power series summation. This summation does not mathematically converge to a finite numerical value for all possible arbitrary complex values of $z$. The ROC is rigorously defined as the continuous, localized geometric region within the complex Z-plane wherein the magnitude of the infinite summation strictly evaluates to a finite integer value (i.e., the series absolutely converges).

  

The mathematical relationship between system poles, system causality, and system stability is governed by exact geometric boundaries concerning the ROC:

  

1. **Causality Theorem:** For a system to be rigorously classified as physically causal (meaning it cannot react to future inputs), its specific impulse response $h[n]$ must equal zero for all $n < 0$. In the Z-domain, this physical constraint mandates that the Region of Convergence must geometrically extend outward from the largest magnitude pole toward complex infinity. Mathematically, the ROC for a causal system assumes the strict format $\vert{}z\vert{} > \max(\vert{}p_i\vert{})$, representing the exterior area surrounding a circle intersecting the outermost pole.
    
      
    
2. **Stability Theorem:** For a discrete-time LTI system to be unconditionally classified as Bounded-Input Bounded-Output (BIBO) stable, any applied bounded input sequence must mathematically guarantee a bounded output sequence. In the Z-domain, this stringent physical requirement mandates that the Region of Convergence must fundamentally encompass the unit circle constraint $\vert{}z\vert{} = 1$. If the complex boundary $\vert{}z\vert{}=1$ lies outside the specified valid ROC geometry, the system is fundamentally unstable.
    
      
    

To analyze the specific provided system:

  

$$H(z) = \frac{z^3 - 2z^2 + 2z - 1}{(z-1)(z-0.5)(z-0.2)}$$

The exact coordinates of the system poles are immediately extractable by forcing the factored denominator components to zero:

  

$$z - 1 = 0 \implies p_1 = 1$$

$$z - 0.5 = 0 \implies p_2 = 0.5$$

$$z - 0.2 = 0 \implies p_3 = 0.2$$

The zeros must be extracted by locating the mathematical roots of the cubic numerator polynomial $N(z) = z^3 - 2z^2 + 2z - 1$. Through standard algebraic factorization techniques or the Rational Root Theorem, it is evident that evaluating $N(1)$ yields $1 - 2 + 2 - 1 = 0$. Therefore, $(z - 1)$ is definitively a mathematical factor of the cubic polynomial. Executing standard polynomial long division of the cubic function by $(z-1)$ yields a residual quadratic equation:

  

$$z^3 - 2z^2 + 2z - 1 = (z-1)(z^2 - z + 1)$$

Consequently, the system transfer function is accurately rewritten as:

  

$$H(z) = \frac{(z-1)(z^2 - z + 1)}{(z-1)(z-0.5)(z-0.2)}$$

A critical mathematical observation is the presence of an identical algebraic factor, $(z-1)$, existing simultaneously in both the numerator and the denominator matrices. In fundamental theoretical analysis, this phenomenon mathematically dictates a localized "pole-zero cancellation" occurring precisely at the complex coordinate $z = 1$. The ultimate roots of the remaining quadratic $z^2 - z + 1 = 0$ determine the final two complex zeros. Using the quadratic formula:

  

$$z = \frac{1 \pm \sqrt{1 - 4(1)(1)}}{2} = 0.5 \pm j\frac{\sqrt{3}}{2}$$

To conclude the stability investigation, the explicit parameters mandated by the problem statement must be evaluated. The problem strictly declares: "ROC of the z transform is given by: $\vert{}z\vert{} > 2$". The mathematical stability constraint dictates that a system is BIBO stable exclusively if its active ROC completely surrounds the unit circle contour defined precisely by $\vert{}z\vert{} = 1$. Since the stipulated, mathematically binding Region of Convergence geometry strictly confines valid values to $\vert{}z\vert{} > 2$, the subset of complex points defined by $\vert{}z\vert{} = 1$ is unequivocally excluded from the convergent operational zone. Therefore, adhering strictly to the constraints outlined in the provided text, the system is categorically demonstrated to be mathematically unstable.

  

### 3. ALGORITHM DESIGN

The conversion of pole-zero extraction and stability analysis into an automated computational procedure requires the execution of numerical root-finding algorithms and structured scatter-plot generation.

  

1. **Polynomial Array Initialization:** The numerical coefficients characterizing both the numerator cubic polynomial and the denominator factored polynomial must be encoded into digital arrays. While the numerator $z^3 - 2z^2 + 2z - 1$ is readily available as an array $[1, -2, 2, -1]$, the denominator is provided in factored format $(z-1)(z-0.5)(z-0.2)$. The denominator coefficients must be calculated by algebraically expanding these discrete factors into a single comprehensive polynomial array.
    
      
    
2. **Root Extraction Algorithm (`np.roots`):** The numerical coordinates of the zeros and poles must be calculated by processing the constructed coefficient arrays through specialized eigenvalue-based root-finding subroutines. These algorithms will output two distinct arrays of complex coordinates: one representing zero locations, and one representing pole locations.
    
      
    
3. **Pole-Zero Geometry Plotting:** A two-dimensional geometric plane must be programmatically generated. A fundamental geometric reference—a perfect circle of unit radius centered exactly at the zero origin—must be numerically drawn to symbolize the critical unit circle boundary.
    
      
    
4. **Symbolic Coordinate Placement:** The complex arrays derived from the root-finding step must be physically mapped onto the generated geometric plane. The array representing zero locations must be plotted utilizing circular scatter markers ('o'). The array representing pole locations must be plotted utilizing cross scatter markers ('x'). The axes must be mathematically scaled equally to prevent spatial distortion of the unit circle geometry.
    
      
    
5. **Automated Stability Logic Check:** An automated logical verification algorithm must be encoded to check the absolute mathematical magnitude of every detected pole coordinate. The script must search for any scalar pole magnitude matching or exceeding $1.0$.
    
      
    

### 4. PROGRAM/SCRIPT/CODE

Python

```
import numpy as np
import matplotlib.pyplot as plt

# Define the coefficients for the numerator polynomial
# N(z) = z^3 - 2z^2 + 2z - 1
num_coeffs = np.array([1, -2, 2, -1])

# The denominator is given in factored form: (z-1)(z-0.5)(z-0.2)
# To find the coefficients of the expanded polynomial, polynomial multiplication is used
# D(z) = (z-1) * (z-0.5) * (z-0.2)
p1 = np.array([1, -1])
p2 = np.array([1, -0.5])
p3 = np.array([1, -0.2])

# Convolve the arrays sequentially to simulate polynomial multiplication
den_coeffs = np.convolve(np.convolve(p1, p2), p3)

# Calculate the roots of the polynomials to find Zeros and Poles
zeros = np.roots(num_coeffs)
poles = np.roots(den_coeffs)

# Generate Pole-Zero Diagram
plt.figure(figsize=(6, 6))

# Plot the unit circle for reference
theta = np.linspace(0, 2*np.pi, 100)
plt.plot(np.cos(theta), np.sin(theta), linestyle='--', color='gray', label='Unit Circle')

# Plot the extracted Zeros ('o' marker) and Poles ('x' marker)
plt.scatter(np.real(zeros), np.imag(zeros), s=100, marker='o', facecolors='none', edgecolors='blue', label='Zeros')
plt.scatter(np.real(poles), np.imag(poles), s=100, marker='x', color='red', label='Poles')

# Format the coordinate plane
plt.axhline(0, color='black', linewidth=1)
plt.axvline(0, color='black', linewidth=1)
plt.grid(True, linestyle=':', alpha=0.7)
plt.title('Pole-Zero Diagram in Complex Z-Plane')
plt.xlabel('Real Axis')
plt.ylabel('Imaginary Axis')
plt.legend(loc='upper right')
plt.axis('equal') # Ensure circular geometry is not distorted

# Display numerical results in console
print("--- POLE AND ZERO LOCATIONS ---")
print("Zeros located at:")
for z in zeros:
    print(f"  {np.round(z, 4)}")
print("Poles located at:")
for p in poles:
    print(f"  {np.round(p, 4)}")
```

### 5. EXPLANATION OF THE PROGRAM/SCRIPT/CODE

The synthesized computational logic specifically designed to parse and visually reconstruct the mathematical dynamics of the specified third-order digital system relies heavily on automated polynomial manipulation.

  

The algorithm immediately constructs the necessary digital representation of the mathematical polynomials. The explicit mathematical numerator equation $z^3 - 2z^2 + 2z - 1$ is mapped linearly into the one-dimensional variable `num_coeffs` as `[1, -2, 2, -1]`. Because the mathematical problem specifies the denominator exclusively in a pre-factored format—$(z-1)(z-0.5)(z-0.2)$—a numerical expansion is mandatory before algorithmic processing can continue. The script assigns discrete sub-arrays `p1`, `p2`, and `p3` to each binomial factor. It subsequently utilizes the `np.convolve` mathematical function—which in the domain of discrete arrays is mathematically analogous to algebraic polynomial multiplication—to recursively multiply the binomials. The resulting combined array is stored in the system variable `den_coeffs`, representing the full cubic expansion of the denominator.

  

The paramount mathematical step—root isolation—is executed by passing both the finalized numerator array and denominator array into the highly specialized `np.roots()` numerical algorithm. This algorithm computes the precise complex eigenvalues of the companion matrix associated with the input polynomial arrays, guaranteeing numerical stability even for higher-order polynomials. The exact resultant complex coordinates are securely deposited into the memory arrays labeled `zeros` and `poles`.

  

The graphical rendering phase utilizes the `matplotlib.pyplot` library to construct the canonical pole-zero interface. To ensure accurate geometric analysis, a simulated continuous parameter `theta` is linearly generated between $0$ and $2\pi$ radians. The foundational trigonometric functions `np.cos(theta)` and `np.sin(theta)` mathematically map this vector into a perfect spatial circle of radius $1.0$, drawing the critical unit circle boundary essential for absolute stability evaluations. The complex data housed within the `zeros` array is functionally split into its constituent real parts (`np.real`) and imaginary parts (`np.imag`) to serve as precise Cartesian X and Y Cartesian coordinates for the scatter plotting algorithm, utilizing open circular markers 'o'. This process is identically repeated for the data housed within the `poles` array, utilizing the standard 'x' coordinate markers. The execution of `plt.axis('equal')` ensures strict spatial proportionality, preventing geometric warping of the critical unit circle. The script concludes by formatting the raw complex data coordinates and printing them identically to standard console output for rigorous tabular verification against the theoretical algebraic derivation. 
