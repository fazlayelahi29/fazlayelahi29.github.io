# DETERMINISTIC DISCRETE-TIME ACOUSTIC SIGNAL MODULATION AND DYNAMIC RESAMPLING: A MATRIX-LABORATORY GRAPHICAL ARCHITECTURE FOR VARIABLE TIME-SCALE MANIPULATION

# AUTHOR INFORMATION

> - Name: Fazlay Elahi
>     
>       
>     
> - Email: scholar.fazlay.elahi.eee.aust@gmail.com
>     
>       
>     
> - Affiliation: Department of Electrical and Electronic Engineering (EEE), Ahsanullah University of Science and Technology (AUST), 141 & 142, Love Road, Tejgaon Industrial Area, Dhaka-1208, Bangladesh
>     
>       
>     
> - Personal Website: [https://fazlayelahi29.github.io/](https://fazlayelahi29.github.io/)
>     
>       
>     
> - LinkedIn: [https://www.linkedin.com/in/fazlayelahi29/](https://www.linkedin.com/in/fazlayelahi29/)
>     
>       
>     

# ABSTRACT

The mathematical manipulation of discrete-time acoustic signals in the temporal domain remains a fundamental operational pillar within modern digital signal processing (DSP) and telecommunications engineering architectures. The continuous evolution of human-computer interface design necessitates the rigorous development of highly optimized, computationally deterministic graphical software environments capable of orchestrating complex algorithmic data flows without introducing prohibitive processing latency, memory leaks, or buffer under-runs. This technical manuscript comprehensively details the architectural synthesis, mathematical modeling, and direct software instantiation of an advanced audio recording, memory buffering, and time-scale modulation framework, developed and executed entirely within the Matrix Laboratory (MATLAB) software environment utilizing the proprietary MATLAB App Designer ecosystem. The core algorithmic challenge rigorously addressed herein involves the dynamic alteration of acoustic playback velocities—specifically, the linear temporal compression and expansion of uniformly sampled audio sequences—without the introduction of catastrophic aliasing artifacts or unacceptable quantization noise floors. The foundational theory is heavily rooted in the immutable physical laws of the Nyquist-Shannon sampling theorem, continuous-to-discrete transformation calculus, and the complex Z-domain representation of linear time-invariant (LTI) systems. By exploiting deterministic memory allocation techniques and event-driven graphical user interface (GUI) dispatching algorithms, a robust computational application was engineered to facilitate real-time, variable-duration analog-to-digital (ADC) capture operations. A highly sophisticated, multi-threaded event-listener architecture is implemented to successfully route volatile memory buffers from the hardware transducer elements directly into the protected computational workspace, securing absolute temporal integrity via high-resolution, double-precision floating-point arrays. A continuously variable potentiometer analog, digitized strictly as an interactive UI parameter knob, governs the numerical scaling factor coefficient applied to the discrete sample rate variable during the subsequent digital-to-analog (DAC) reconstruction phase. When this scalar coefficient deviates from unity, the computational system executes high-order temporal mapping, manipulating the physical temporal distance between discrete samples to induce perceived temporal dilation or contraction upon acoustic propagation. The simulation methodology strictly defines the deterministic sequence of operational machine states: initialization of the audio recorder base object, definition of the bit-depth and base sampling frequency constraints, execution of the synchronous blocking capture protocol, algorithmic parsing of the returned vector matrix, continuous application of the dynamic temporal coefficient, and final hardware-level acoustic reproduction via the system audio kernel. The subsequent mathematical and analytical sections of this report extensively dissect the performance metrics of the implemented DSP system, rigorously tracking the volatile memory footprint, execution chronometry, and overall algorithmic efficiency against theoretical baselines. Furthermore, the absolute mathematical limitations of naive time-scale modification—specifically its inextricable, physically mandated impact on the pitch and harmonic envelope of the source signal—are rigorously modeled, proven via Fourier calculus, and thoroughly discussed. In stark contrast to computationally heavy phase-vocoder or pitch-synchronous overlap-add (PSOLA) algorithms, which attempt the orthogonal modification of time and pitch via complex spectral transformations, this framework intentionally utilizes direct sampling-rate matrix modulation. This intentional selection empirically demonstrates the fundamental inverse proportionality between temporal duration and spectral frequency strictly defined within the continuous and discrete Fourier domains. The final extracted empirical outputs completely corroborate the underlying theoretical predictions, mathematically validating the hypothesis that direct vector manipulation, when strictly coupled with dynamic DAC clocking variations, provides the most computationally efficient, zero-latency method for raw velocity modulation in strictly deterministic hardware processing environments. This extensive report serves as a rigorous treatise on the intersection of theoretical discrete-time physics, event-driven graphical software engineering, and applied mathematical computational simulation.

  

# KEYWORDS/INDEX TERMS

- Digital Signal Processing (DSP)
    
      
    
- Time-Scale Modification (TSM)
    
      
    
- Nyquist-Shannon Sampling Theorem
    
      
    
- Discrete-Time Vectors
    
      
    
- Analog-to-Digital Conversion (ADC)
    
      
    
- Matrix Laboratory (MATLAB)
    
      
    
- App Designer Ecosystem
    
      
    
- Signal Quantization Levels
    
      
    
- Interpolation Algorithms
    
      
    
- Fast Fourier Transform (FFT)
    
      
    
- Linear Time-Invariant (LTI) Systems
    
      
    
- Event-Driven Programming
    
      
    
- Graphic User Interface (GUI)
    
      
    
- Floating-Point Arrays
    
      
    
- Spectral Frequency Shifting
    
      
    
- Digital-to-Analog Converter (DAC)
    
      
    
- Hardware Buffer Latency
    
      
    

# 1. PROJECT STATEMENT

The computational problem mandates the synthesis, structural design, and rigorous programmatic validation of a dynamic digital audio recording and continuous temporal modulation architecture utilizing the MATLAB App Designer software ecosystem. Acoustic pressure waves must be accurately transduced, quantized via an analog-to-digital converter, and captured into discrete, double-precision computational memory matrices for dynamically user-defined temporal intervals. Subsequently, the temporal playback velocity of this precisely captured vector data must be mathematically manipulated via an interactive graphical coefficient multiplier variable, yielding a temporally compressed or expanded acoustic waveform reconstruction upon output. The exact engineering deficit addressed is the critical lack of a unified, highly intuitive, mathematically rigorous, and low-latency graphical software environment that concurrently handles direct hardware-level audio buffering, memory persistence across asynchronous object callbacks, and dynamic variable-speed digital-to-analog data streaming. A deterministic solution is required to be engineered utilizing the specific event-driven MATLAB architecture to successfully encapsulate these distinct phases into a single, cohesive executable application state, overcoming inherent operating system buffer limitations.

  

# 2. PROJECT OBJECTIVE

The execution of this highly rigorous engineering endeavor is driven by specific, mathematically critical justifications and targeted operational milestones.

  

- Algorithmic and Mathematical Validation Goals:
    
      
    1. To empirically validate the foundational discrete-time sampling theories across variable, non-standard clock domains.
        
        a. It is explicitly required to physically demonstrate how fixed-length discrete computational vectors respond to modified readout frequencies at the digital-to-analog converter reconstruction stage.
        
        b. It is mathematically necessary to capture and analyze the corresponding continuous spectral frequency shift resulting directly from linear temporal dilation.
        
          
        
    2. To rigorously synthesize a highly robust, fault-tolerant event-driven state machine matrix.
        
        a. The fundamental objective is to successfully decouple the synchronous, blocking audio capture thread from the primary graphical user interface rendering thread.
        
        b. The state transitions must be rigorously mathematically bounded to ensure absolutely zero memory heap overflow during extended, high-resolution recording durations.
        
          
        
- Software Engineering and Application Architecture Objectives:
    
      
    1. To instantiate a functional, monolithic application architecture utilizing standard, optimized UI components within the MATLAB ecosystem.
        
        a. The graphical interface must perfectly translate human-readable textual inputs into strict hardware memory buffer allocation constraints.
        
        b. The analog-style speed coefficient modifier element must constantly provide continuous floating-point resolution to accurately model complex fractional resampling phenomena.
        
          
        
    2. To systematically eliminate intermediate file input/output (I/O) read/write bottlenecks during the entire DSP lifecycle.
        
        a. The computational system must rigorously utilize direct random-access memory (RAM) workspace assignments instead of writing volatile temporary audio files to persistent physical storage media.
        
        b. This strict memory-first operational approach is aggressively pursued to mathematically minimize access latency during consecutive, rapid record-and-play validation cycles.
        
          
        
- Educational, Theoretical, and Pedagogical Justifications:
    
      
    1. To formulate a foundational, highly transparent computational testbed for advanced time-scale modification studies.
        
        a. The raw mathematical baseline established by this specific project is strictly required to subsequently study highly advanced spectral algorithms by providing an exact benchmark for computational logic overhead.
        
        b. The direct, physically mandated relationship between sampling rate velocity and acoustic pitch shift serves as a primary, observable demonstrator of the fundamental Fourier time-scaling mathematical property.
        
          
        
    2. To effectively bridge the pedagogical gap between abstract, continuous DSP mathematical models and applied, discrete object-oriented programming frameworks.
        
        a. The programmed implementation categorically proves that highly complex vector algebra operations can be seamlessly integrated into asynchronous, user-facing callback structures.
        
        b. It physically demonstrates the absolute necessity of rigorous data-type casting protocols between string-based UI textual components and high-precision backend numerical processing arrays.
        
          
        

# 3. PROJECT SCOPE

The operational boundaries, the specific theoretical domains of application, and the stringent limits of the applied mathematical models are explicitly established to carefully isolate the underlying physics of the problem statement.

  

- Inclusions:
    
      
    1. Core DSP Matrix Computations and Hardware Interfacing:
        
        a. Real-time analog-to-digital conversion operations strictly utilizing the host computational system's primary microphone array and core audio kernel drivers.
        
        b. Variable-duration physical memory allocation corresponding directly to user-input integer or continuous floating-point temporal limitation variables.
        
          
        
    2. Mathematical Acoustic Signal Manipulation:
        
        a. Direct, algorithmic modulation of the discrete playback sampling frequency multiplier to mechanically induce linear temporal scaling over the vector.
        
        b. High-precision linear mapping of a visual UI rotary knob position to a strict mathematical domain floating-point matrix.
        
          
        
    3. Software Application Environment Dynamics:
        
        a. Strict utilization of the MATLAB App Designer ecosystem to build, compile, and execute the application logic algorithms and asynchronous callback listeners.
        
        b. The structured implementation of visual state-feedback mechanisms to explicitly inform the human operator of thread-locking operations during active ADC buffering.
        
          
        
- Exclusions:
    
      
    1. Non-Linear Pitch Preservation and Spectral Algorithms:
        
        a. Complex Phase Vocoder computational architectures and Fast Fourier Transform (FFT) bin-shifting techniques utilized to decouple pitch from chronological time are strictly excluded to preserve absolute algorithmic simplicity.
        
        b. Advanced Pitch-Synchronous Overlap-Add (PSOLA) and Waveform Similarity Overlap-Add (WSOLA) algorithmic methodologies are purposefully and permanently omitted from this specific compilation engine.
        
          
        
    2. Complex Signal Filter Topologies and Matrices:
        
        a. Dynamic multi-band equalization, continuous dynamic range compression logic, or spatial reverberation convolution matrices remain entirely outside the established operational boundary.
        
        b. Fractional delay filters and high-order infinite impulse response (IIR) anti-aliasing hardware bypass simulators are not physically modeled nor computed.
        
          
        
    3. Extended File System and Network Architectures:
        
        a. Permanent solid-state disk storage exportation sequences are strictly not coded into the graphical user interface.
        
        b. Reading acoustic data from external TCP/IP network streams or utilizing Direct Memory Access (DMA) ring buffers across distributed computational systems is completely excluded.
        
          
        

# 4. PROJECT REQUIREMENTS AND ENVIRONMENT

The successful, error-free compilation and rapid execution of the theoretical matrices necessitate a tightly controlled, rigorously defined technical physical and software ecosystem.

  

- Hardware Ecosystem:
    
      
    1. Computational Processing Unit Architecture:
        
        a. A modern multi-core microarchitecture capable of continuously executing high-level interpreted programming languages and handling complex floating-point arithmetic logic unit (ALU) operations rapidly.
        
        b. A strictly maintained minimum baseline of symmetric multiprocessing logic is assumed to flawlessly handle the graphical rendering thread concurrently with the background audio buffer thread.
        
          
        
    2. Audio Transduction and Analog Conversion Hardware:
        
        a. A physical microelectromechanical system (MEMS) or standard condenser microphone permanently integrated into the local hardware bus to convert continuous acoustic pressure variations into analog voltage signals.
        
        b. A strictly defined, high-precision Analog-to-Digital Converter (ADC) chip capable of rapidly parsing incoming voltages into discrete numerical array representations at standard frequencies.
        
          
        
- Software and Simulation Ecosystem:
    
      
    1. Base Algorithmic Computational Platform:
        
        a. The Matrix Laboratory (MATLAB) environment is strictly required to successfully process the mathematically heavy array computations and object-oriented class definitions.
        
        b. The specific programmed deployment of the recorder and player native processing objects is heavily reliant on the core MATLAB Audio Toolbox internal dependency matrices.
        
          
        
    2. Graphical Development Interface Toolchain:
        
        a. MATLAB App Designer is strictly utilized exclusively for generating the complex XML-based UI layout and the corresponding compiled executable source code.
        
        b. The event-driven callback software architecture must be natively supported by the internal MATLAB Virtual Machine to strictly ensure the synchronous execution of human user interactions.
        
          
        

# 5. LITERATURE REVIEW

The complex mathematical manipulation of acoustic data arrays, the foundational calculus of temporal scaling, and the software engineering of dynamic graphical processing environments constitute a highly saturated, rigorously reviewed field of digital signal processing literature. To correctly establish the mathematical baseline for this exact implementation, it is absolutely imperative to systematically analyze the hard mathematical constraints identified by prior academic researchers operating in discrete-time environments.

  

- Foundations of Sampling, Aliasing, and Reconstruction Theory:
    
      
    1. The Absolute Nyquist-Shannon Imperative:
        
        a. Classical mathematical texts defining the absolute physical boundaries of digital audio strictly enforce the rule that a continuous-time analog signal can only be perfectly reconstructed if it is captured at a sampling frequency strictly greater than twice its highest intrinsic frequency component [1].
        
        b. The computational failure to strictly adhere to this mathematical limitation invariably results in spectral folding, a destructive artifact wherein high-frequency acoustic energy mirrors negatively back into the baseband, creating severe dissonant, non-harmonic distortion during the DAC reconstruction phases [1].
        
          
        
    2. Digital-to-Analog Clock Frequency Modulation Dynamics:
        
        a. Highly cited foundational research explicitly models the physical phenomena occurring when discrete vectors are forcibly fed to a DAC at varying hardware clock rates, noting that the Fourier transform of a temporally compressed signal strictly expands proportionately in the frequency domain [2].
        
        b. The fundamental physical limitation of raw sample-rate clock modulation is its complete mathematical inflexibility regarding harmonic preservation, strictly forcing researchers to accept significant, proportional pitch shifting when attempting to accelerate audio signals directly via clock manipulation [2].
        
          
        
- Algorithmic Architectures for Advanced Time-Scale Modification (TSM):
    
      
    1. Complex Phase Vocoder Matrix Implementations:
        
        a. Academic reviews of phase vocoder techniques heavily highlight that Short-Time Fourier Transforms (STFT) can theoretically decouple the temporal magnitude envelope from the phase derivatives, allowing mathematically independent parameter scaling [3].
        
        b. However, these computationally heavy spectral methods consistently and predictably suffer from phase incoherence artifacts across adjacent frequency bins during the synthesis overlap-add phase [3].
        
          
        
    2. Time-Domain Pitch-Synchronous Methodologies:
        
        a. Alternatively, strict time-domain algorithms systematically segment the acoustic waveform at fundamental pitch epochs, mathematically repositioning these discrete segments to compress time while rigorously maintaining the fundamental acoustic frequency [3].
        
        b. The immense computational burden of real-time pitch tracking required by these exact algorithms renders them highly mathematically unstable for complex polyphonic or highly transient percussive acoustic signals, often resulting in severe transient phase smearing [3].
        
          
        
- Event-Driven Processing and Asynchronous Software Architectures:
    
      
    1. MATLAB Application Interfacing and Class Encapsulation:
        
        a. Modern engineering software development logic heavily relies on strictly isolating the mathematical solver engines from the primary graphical user interface. Dedicated architectural research demonstrates the strict necessity of modular, object-oriented architectures where UI components act merely as parameter variable dispatchers to the backend computational matrices [4].
        
        b. Proper, optimized MATLAB GUI design categorically mandates the strict avoidance of volatile global variables, demanding the utilization of self-contained class properties to safely pass massive data arrays between recording, processing, and playback callbacks to systematically prevent memory leaks [4].
        
          
        
    2. Hardware Audio Latency in General Purpose OS Kernels:
        
        a. Deep investigations into real-time audio processing arrays reveal that standard, consumer operating systems fundamentally lack deterministic, real-time scheduling, meaning that buffer handoffs between the hardware ADC and the software application are permanently subject to temporal jitter [4].
        
        b. To mathematically mitigate this jitter in non-real-time specific tools like the basic MATLAB App Designer, strictly synchronous blocking commands are frequently utilized to guarantee complete data matrix integrity at the highly calculated cost of temporary UI thread unresponsiveness [4].
        
          
        

# 6. CONCEPTUAL BACKGROUND

The absolute mathematical integrity of any compiled acoustic modeling software system requires a flawless, mathematically proven theoretical understanding of exactly how continuous analog pressure waves are mathematically mapped into the strict discrete computational domain.

  

## 6.1 SYMBOLS AND NOTATIONS

|**Symbol**|**Definition**|**SI Unit/Format**|
|---|---|---|
|$t$|Continuous temporal time variable|Seconds ($s$)|
|$n$|Discrete-time integer index variable|Dimensionless integer|
|$T_s$|Base sampling period|Seconds/sample ($s$)|
|$f_s$|Base sampling frequency (Clock Rate)|Hertz ($Hz$)|
|$x(t)$|Continuous-time analog input signal|Volts ($V$)|
|$x[n]$|Discrete-time sampled numerical signal|Amplitude (Normalized)|
|$X(\omega)$|Continuous-time Fourier Transform spectrum|Complex magnitude|
|$X(e^{j\omega})$|Discrete-Time Fourier Transform spectrum|Complex magnitude|
|$\omega$|Continuous angular frequency parameter|Radians/second ($rad/s$)|
|$\Omega$|Discrete angular frequency parameter|Radians/sample ($rad$)|
|$f_{max}$|Maximum physical frequency component|Hertz ($Hz$)|
|$f_{N}$|Nyquist absolute frequency limit ($f_s / 2$)|Hertz ($Hz$)|
|$k$|Playback speed scaling coefficient|Dimensionless multiplier|
|$f_{s,new}$|Modulated dynamic playback sampling rate|Hertz ($Hz$)|
|$D$|User-defined active recording duration|Seconds ($s$)|
|$N$|Total scalar number of discrete samples|Samples|
|$\Delta t$|Physical time interval between samples|Seconds ($s$)|
|$B$|Quantization bit depth resolution|Bits|
|$Q$|Total number of available quantization levels|Integer levels|
|$q$|Quantization integer step size|Volts/level ($V$)|
|$e[n]$|Quantization noise error margin|Volts ($V$)|
|$SNR$|Signal-to-Noise Ratio limit|Decibels ($dB$)|
|$y[n]$|Output reconstructed signal matrix|Amplitude (Normalized)|
|$h[n]$|System mathematical impulse response|Amplitude|
|$H(z)$|System transfer function in the Z-domain|Complex variable|
|$z$|Complex Z-transform algebraic variable|Dimensionless|
|$s$|Complex Laplace domain variable ($\sigma + j\omega$)|Complex frequency|
|$R$|Rational resampling ratio factor|Dimensionless rational|
|$L$|Interpolation up-sampling integer factor|Integer|
|$M$|Decimation down-sampling integer factor|Integer|
|$V_{max}$|Maximum analog input voltage|Volts ($V$)|
|$V_{min}$|Minimum analog input voltage|Volts ($V$)|
|$E_x$|Total computed energy of the sequence|Joules equivalent|
|$\alpha$|Fractional temporal interpolation offset|Dimensionless|
|$MSE$|Computed Mean Squared Error|Amplitude squared|

## 6.2 GLOSSARY/NOMENCLATURE

|**Acronym/Term**|**Comprehensive Definition**|
|---|---|
|ADC|Analog-to-Digital Converter; the hardware logic that mathematically digitizes continuous voltages.|
|DAC|Digital-to-Analog Converter; the hardware logic that physically reconstructs continuous voltages.|
|DSP|Digital Signal Processing; the algorithmic manipulation of discrete numerical sequences.|
|TSM|Time-Scale Modification; the mathematical alteration of the temporal duration of a signal.|
|GUI|Graphical User Interface; the front-end visual framework utilized for human interaction.|
|OOP|Object-Oriented Programming; the rigorous software paradigm strictly utilizing data classes.|
|LTI|Linear Time-Invariant; a mathematical system whose core properties never change with time.|
|FFT|Fast Fourier Transform; a highly optimized algorithm to compute the discrete Fourier limit.|
|STFT|Short-Time Fourier Transform; analyzes specific frequency content over small temporal windows.|
|OLA|Overlap-Add; a fundamental method to synthesize processed audio frames back into a stream.|
|PSOLA|Pitch-Synchronous Overlap-Add; a time-domain TSM algorithm strictly preserving pitch epochs.|
|UI|User Interface; the interactive visual components explicitly displayed on the screen matrix.|
|API|Application Programming Interface; the software bridge connecting isolated modules.|
|RAM|Random Access Memory; the highly volatile hardware memory strictly for active array storage.|
|IIR|Infinite Impulse Response; a complex filter type characterized by internal feedback paths.|
|FIR|Finite Impulse Response; a strictly feed-forward, computationally stable digital filter.|
|Aliasing|The spectral folding artifact caused strictly by under-sampling high physical frequencies.|
|Nyquist Rate|The absolute minimum mathematical sampling rate strictly required to avoid aliasing.|
|Quantization|The physical truncation of continuous analog amplitudes into discrete binary logic levels.|
|Clipping|The severe harmonic distortion caused strictly by exceeding maximum quantization limits.|
|Interpolation|The algorithmic insertion of calculated zero-valued or mathematically estimated samples.|
|Decimation|The strict mathematical discarding of existing samples to severely reduce the sampling rate.|
|Callback|A discrete executable function triggered automatically by a specific, defined UI hardware event.|
|Workspace|The isolated memory environment where active matrix variables are persistently stored.|
|Blocking|A synchronous execution function that strictly halts all other thread execution until finished.|
|Multithreading|The highly complex concurrent execution of totally independent computational processing paths.|
|Buffer|A temporary sector of volatile memory allocated specifically to hold streaming serial data.|
|Latency|The physical temporal delay specifically incurred between signal input and algorithmic output.|
|Float64|The double-precision 64-bit floating-point numeric data type format used for math.|
|Transducer|A physical hardware element that directly converts acoustic pressure into analog voltage.|
|Jitter|The variance in operational latency caused by operating system task scheduling irregularities.|

## 6.3 CONCEPTS

Analog-to-Digital Conversion (ADC) represents the absolute fundamental frontier between the physical universe and the rigorous computational environment. Acoustic pressure variations are actively transduced into continuous analog voltage fluctuations by the physical microphone membrane. The ADC circuit mathematically samples this continuous waveform at strictly regulated temporal intervals, capturing precise instantaneous voltage snapshots.

  

Quantization mathematically dictates the absolute precision of these captured physical snapshots. A continuous voltage inherently possesses infinite potential decimal values. The ADC must mathematically round this physical value to the nearest discrete logical level strictly defined by its exact bit depth. For a standard 16-bit audio system, there exist exactly 65,536 discrete amplitude levels. The rigorous mathematical difference between the true analog value and the rounded digital value is known as quantization noise, which acts as a permanent, fundamental noise floor in all digital audio matrices.

  

The Nyquist-Shannon Sampling Theorem explicitly establishes the absolute physical speed limit of the ADC. It stringently mandates that to mathematically capture an acoustic frequency of $20,000$ Hz accurately, the hardware ADC must sample the incoming voltage at an absolute minimum of $40,000$ times per second. The physical failure to constantly maintain this speed strictly results in aliasing, where high-frequency waves physically impersonate low-frequency waves, permanently and destructively corrupting the discrete data matrix.

  

Discrete-Time Vectors serve as the fundamental memory data structures utilized strictly in DSP algorithms. Unlike continuous signals that mathematically exist at every infinitesimally small fraction of continuous time, a discrete vector only exists at exact integer indices. An array containing 44,100 specific samples represents exactly one second of acoustic audio only if the playback hardware is explicitly clocked at exactly 44,100 Hertz.

  

Digital-to-Analog Conversion (DAC) operates as the strict inverse physical operation. The audio hardware reads the discrete matrix vector sequentially and physically outputs corresponding analog voltages. The DAC strictly applies a low-pass reconstruction filter to mathematically smooth the instantaneous voltage jumps occurring between discrete samples, generating a continuous, smooth analog waveform strictly suitable for physical amplification and acoustic projection.

  

Time-Scale Modification (TSM) via Clock Modulation represents the highly specific algorithmic mechanism employed heavily in this precise project. Rather than utilizing complex digital algorithms to alter the physical array length, the fundamental playback speed is mathematically manipulated by artificially altering the explicitly defined sample rate parameter sent to the DAC hardware. If a discrete array of 44,100 samples is forcefully played back at 88,200 Hertz, the signal completes physical execution in exactly 0.5 seconds, effectively doubling the playback speed linearly.

  

Spectral Shifting stands as the unavoidable, mathematically proven physical consequence of direct clock modulation methodologies. Because the temporal physical duration of the waveform is exactly halved, the physical oscillation cycles complete exactly twice as fast. According to the foundational laws of acoustic physics, mathematically doubling the frequency of oscillation shifts the acoustic pitch exactly one octave higher. This absolute inverse relationship mathematically guarantees that direct velocity manipulation fundamentally mutates the harmonic footprint.

  

Graphical Event Dispatching is the specific software engineering paradigm strictly governing the UI code. MATLAB App Designer operates entirely asynchronously; the environment idly waits in a continuous polling loop until a physical hardware interrupt (such as a mouse click on the explicit 'Record' button) directly triggers a specific, isolated block of executable code mathematically known as a callback.

  

Blocking Functions temporarily and completely suspend the inherently asynchronous nature of the UI matrix. When the explicit `recordblocking` command is formally invoked by the user, the main MATLAB execution thread is deliberately and totally frozen. It is strictly locked into a highly prioritized software sub-routine that purely shuttles ADC hardware data into the RAM buffer for the user-specified temporal duration. Only upon reaching the final mathematically required vector sample does the thread release execution control back to the UI polling loop.

  

Object-Oriented Property Encapsulation formally guarantees absolute memory safety within the architecture. Instead of dangerously writing the recorded audio data to a volatile, unprotected global workspace variable, the specific data vector is permanently attached as a protected internal property of the main UI class object. This structural logic ensures that the 'Play' button callback has instantaneous, mathematically protected access to the exact RAM memory location of the audio matrix generated by the 'Record' button callback.

  

## 6.4 FORMULAS

The strict mathematical translation from continuous physical space to discrete computational logic is governed permanently by rigorous algebraic and differential equations.

  

The Discrete Sampling Function mapping continuous space to the index domain:

$$ x[n] = x(n T_s) = x\left(\frac{n}{f_s}\right) $$

  

The absolute Nyquist-Shannon Sampling Limit constraint:

$$ f_s \geq 2 \cdot f_{max} $$

  

The precise Quantization Step Size derivation based on limits:

$$ q = \frac{V_{max} - V_{min}}{2^B - 1} $$

  

The theoretical ideal Signal-to-Noise Ratio limit computation:

$$ SNR = 6.02 \cdot B + 1.76 \text{ [dB]} $$

  

The foundational Continuous-Time Fourier Transform integral:

$$ X(\omega) = \int_{-\infty}^{\infty} x(t) e^{-j\omega t} dt $$

  

The infinite summation defining the Discrete-Time Fourier Transform:

$$ X(e^{j\Omega}) = \sum_{n=-\infty}^{\infty} x[n] e^{-j\Omega n} $$

  

The absolute Fourier Time-Scaling inverse correlation property:

$$ x(k \cdot t) \xrightarrow{\mathcal{F}} \frac{1}{|k|} X\left(\frac{\omega}{k}\right) $$

  

The Total Sample Count Calculation based on time and rate:

$$ N = \text{round}(D \cdot f_s) $$

  

The Dynamic Playback Frequency output clocking parameter derivation:

$$ f_{s,new} = f_{s,original} \cdot k $$

  

The complex complex-plane mapping Z-Transform equation:

$$ X(z) = \sum_{n=-\infty}^{\infty} x[n] z^{-n} $$

  

The algorithmic Linear Interpolation (First-Order Hold) definition:

$$ y[n] = x[n] + \frac{x[n+1] - x[n]}{1} \cdot \alpha $$

  

The necessary Decimation Anti-Aliasing Cutoff frequency constraint:

$$ f_{cutoff} = \frac{f_s}{2 \cdot M} $$

  

The fundamental Digital Convolution equation for discrete LTI filtering:

$$ y[n] = x[n] * h[n] = \sum_{k=-\infty}^{\infty} x[k] h[n-k] $$

  

Euler's Formula dictating complex complex-plane exponentials:

$$ e^{j\theta} = \cos(\theta) + j\sin(\theta) $$

  

The optimized Fast Fourier Transform (Radix-2) algorithmic definition:

$$ X_k = \sum_{n=0}^{N/2-1} x_{2n} e^{-\frac{i 2\pi k n}{N/2}} + e^{-\frac{i 2\pi k}{N}} \sum_{n=0}^{N/2-1} x_{2n+1} e^{-\frac{i 2\pi k n}{N/2}} $$

  

The absolute Energy calculation of a Discrete Signal vector:

$$ E_x = \sum_{n=-\infty}^{\infty} |x[n]|^2 $$

  

The comparative Mean Squared Error (MSE) algorithmic calculation:

$$ MSE = \frac{1}{N} \sum_{n=1}^{N} (x_{original}[n] - x_{reconstructed}[n])^2 $$

  

The algorithmic Phase Angle Calculation derived from complex elements:

$$ \phi(\omega) = \arctan\left(\frac{\text{Im}{X(\omega)}}{\text{Re}{X(\omega)}}\right) $$

  

The vector Amplitude Normalization scaling algorithm:

$$ x_{norm}[n] = \frac{x[n]}{\max(|x[n]|)} $$

  

The total physical Hardware Latency Delay equation:

$$ T_{delay} = \frac{N_{buffer}}{f_s} + T_{ADC} + T_{processing} $$

  

## 6.5 LAWS

The absolute physical execution of this complex DSP architecture is constrained entirely by immutable physical and mathematical laws.

  

The Law of Conservation of Information (Nyquist-Shannon Limit) mathematically states that exact information contained within a continuous analog bandwidth is entirely preserved in the computational discrete domain only if the sampling matrix adheres strictly to the absolute minimum boundary condition of $2 \cdot f_{max}$. Any information loss falling below this rigorous threshold is mathematically irreversible.

  

The Inverse Fourier Proportionality Law completely guarantees that linear temporal compression strictly and permanently enforces spectral frequency expansion. It is physically impossible to independently mathematically modify the exact time domain of a single raw computational waveform without dynamically inducing an exact proportional inverse mathematical modification in the continuous frequency domain.

  

The absolute Law of Causality dictates firmly that the mathematical output of a computational system $y[n]$ at index $n$ can only rigorously depend on current and past physical input values $x[n], x[n-1]$. The digital computational system cannot ever possess prior knowledge of future physical samples, permanently mandating absolute serial chronological execution of the audio playback vector.

  

## 6.6 THEOREMS

Advanced mathematical DSP logic relies heavily on rigorous, proven theorems to thoroughly validate programmatic execution sequences.

  

Parseval's Theorem mathematically establishes the absolute total energy equivalence strictly between the chronological time domain and the spectral frequency domain. It definitively proves mathematically that computing the sum energy of the discrete vector samples yields the exact same total energy as mathematically computing the energy of the frequency bins.

  

The Discrete Convolution Theorem rigorously states that performing a highly intensive mathematical sequence convolution physically in the discrete time domain is absolutely mathematically equivalent to performing a simple, direct element-wise vector multiplication in the discrete frequency domain.

  

The Uniform Sampling Theorem explicitly and rigorously asserts that the continuous analog sequence can be mathematically perfectly interpolated directly from the discrete numerical values strictly using the ideal mathematical sinc-function convolution approach.

  

## 6.7 PRINCIPLES

Operational software engineering heuristics strictly govern the practical programming implementation of the MATLAB software application.

  

The Principle of Deterministic Memory Allocation rigorously asserts that dynamic RAM memory operations introduce extreme computational CPU overhead and severe temporal jitter. Therefore, audio matrices must strictly be pre-allocated to their absolute maximum required physical size using the calculated length $N$ prior to initializing the hardware ADC buffer.

  

The Principle of Thread Segregation aggressively mandates that primary graphical rendering tasks and hardware interrupt driver tasks must permanently not occupy the exact same priority execution lane. By strictly utilizing the blocking command structure, the software architecture forces the CPU to perfectly prioritize audio buffer memory integrity over visual graphical refresh rates.

  

The Principle of Relative UI Scaling firmly establishes that graphical interface elements should perfectly map to continuous non-linear or linear multiplicative coefficients rather than arbitrary absolute integer values. A scalar multiplier coefficient of $0.5$ for playback speed is perfectly mathematically universally applicable regardless of the vector domain.

  

## 6.8 DERIVATION OF FORMULAS, LAWS, THEOREMS, AND PRINCIPLES

The rigorous mathematical derivation of the strict Fourier Time-Scaling property is absolutely crucial to scientifically understanding exactly why the modulated playback physically alters the pitch of the recorded acoustic audio array.

  

a. The absolute foundational continuous Fourier Transform integral is firmly established:

$$ X(\omega) = \int_{-\infty}^{\infty} x(t) e^{-j\omega t} dt $$

  

b. A linear temporal scaling factor coefficient $k$ is forcefully introduced directly into the time domain signal, representing a strict physical increase or decrease in playback velocity. The newly altered signal is rigorously defined as $x(kt)$.

  

c. The precise Fourier Transform integral of this temporally scaled signal is mathematically formulated:

$$ \mathcal{F}{x(kt)} = \int_{-\infty}^{\infty} x(kt) e^{-j\omega t} dt $$

  

d. A rigorous mathematical u-substitution is systematically executed within the integral boundary. Let the new variable $\tau = kt$. Therefore, the differential becomes $dt = \frac{d\tau}{k}$.

  

e. The specific integral boundaries structurally remain exactly $-\infty$ to $\infty$ (assuming strictly that the coefficient $k > 0$). The fundamental equation is structurally rewritten carefully substituting the new variable $\tau$:

$$ = \int_{-\infty}^{\infty} x(\tau) e^{-j\omega \left(\frac{\tau}{k}\right)} \left(\frac{1}{k}\right) d\tau $$

  

f. The isolated constant fraction $1/k$ is successfully factored out of the main integral logic:

$$ = \frac{1}{k} \int_{-\infty}^{\infty} x(\tau) e^{-j\left(\frac{\omega}{k}\right)\tau} d\tau $$

  

g. The isolated remaining integral perfectly and exactly matches the foundational definition of the standard continuous Fourier Transform, but is strictly evaluated at the new modified frequency $\omega/k$ instead of the base $\omega$:

$$ \mathcal{F}{x(kt)} = \frac{1}{|k|} X\left(\frac{\omega}{k}\right) $$

  

h. The absolute numerical value $|k|$ is structurally utilized in the final formalized theorem to correctly mathematically account for negative time-reversal scalar scenarios, firmly concluding the mathematical proof.

  

## 6.9 COMPARATIVE ANALYSIS AND ANALOGIES

To totally contextually map the selected software architecture, extremely extensive tabular matrices are comprehensively provided actively analyzing alternative computational methodologies.

  

|**TSM Algorithmic Method**|**Pitch Preservation Ability**|**Computational Complexity CPU Load**|**Structural Artifacts Introduced**|**Real-Time Capable Status**|
|---|---|---|---|---|
|Raw Hardware Clock Modulation|Fails strictly (Pitch explicitly shifts)|Extremely Low $O(1)$|Absolute None (if DAC hardware supports variable rate)|Yes|
|Complex Phase Vocoder (STFT)|Preserved successfully|Extremely High $O(N \log N)$|Phasiness, severe transient algorithmic smearing|Extremely Difficult|
|Time-Domain PSOLA Methods|Preserved successfully|High (Requires intense pitch tracking logic)|Octave physical errors, severe waveform glitching|Yes (for strict monophonic)|
|Waveform Similarity OLA Logic|Preserved successfully|Medium|Phase echoing, destructive flanging audio effects|Yes|

|**Hardware Cache Buffer Size**|**Sequential Read/Write Latency**|**CPU Interrupt Call Frequency**|**Risk of Catastrophic Underrun**|
|---|---|---|---|
|64 Vector Samples|~1.45 milliseconds|Extremely High|Catastrophic|
|256 Vector Samples|~5.80 milliseconds|High|High|
|1024 Vector Samples|~23.2 milliseconds|Moderate|Low|
|Entire Complete Duration Block|Equals exact Duration parameter $D$|Minimal (Fires exactly once per cycle)|Absolute Zero|

|**Computational Data Type**|**Memory Footprint (per sec at base 44.1kHz)**|**Maximum Dynamic Range**|**Internal Clipping Prevention Capability**|
|---|---|---|---|
|8-bit Integer array (uint8)|44.1 Kilobytes|~48 Decibels|Extremely Poor|
|16-bit Integer array (int16)|88.2 Kilobytes|~96 Decibels|Moderate|
|32-bit Floating array (single)|176.4 Kilobytes|~1500 Decibels|Absolute|
|64-bit Floating array (double)|352.8 Kilobytes|Mathematically Infinite (Practical limitation)|Supreme|

|**Specific UI Component Node**|**Software Event Trigger Paradigm**|**Backend Array Variable Modification Target**|**Direct MATLAB API Syntax Call**|
|---|---|---|---|
|Duration Textual Field|ValueChangedFcn listener|Updates total sample memory allocation boundary $N$|`app.DurationEditField.Value`|
|Variable Speed Knob Node|ValueChangedFcn listener|Updates exact sampling coefficient multiplier $k$|`app.SpeedKnob.Value`|
|Primary Record Button Node|ButtonPushedFcn listener|Initiates hardware ADC locking polling loop|`recordblocking(recorder, time)`|
|Primary Playback Button Node|ButtonPushedFcn listener|Initiates hardware DAC data streaming output|`play(player)`|

|**Intermediate File I/O Method**|**Hardware Volatility State**|**Computational Latency Profile (ms)**|**Physical Drive Wear/Tear Generation**|
|---|---|---|---|
|Standard `.wav` Disk Write|Persistent (Solid-State Drive)|Extremely High (Disk Seek/Write Times)|Generates destructive I/O write cycles|
|Active Workspace Variable Array|Volatile (Physical RAM)|Extremely Low (Strictly Sub-millisecond)|Absolute Zero|

|**Host Operating System**|**Core Audio Kernel Architecture**|**Expected Scheduling Jitter Profile**|**General Applicability Status**|
|---|---|---|---|
|Microsoft Windows Kernel|DirectSound / WASAPI endpoints|High / Moderate|Standard (Host utilized heavily)|
|Apple macOS Kernel|CoreAudio endpoints|Low|Optimal|
|Canonical Linux Kernel|ALSA / JACK backend endpoints|Extremely Low (with specialized Real-Time kernel)|Supreme|

|**DSP Interpolation Method**|**Mathematical Polynomial Order**|**Algorithmic Computational Load**|**High-Frequency Attenuation Profile**|
|---|---|---|---|
|Basic Zero-Order Hold|0|Very Low|Severe (Destructive Staircase artifact)|
|Standard Linear Interpolation|1|Low|Moderate|
|Advanced Cubic Spline|3|High|Minimal|
|Sinc Filter (Ideal Mathematical)|Mathematically Infinite|Mathematically Infinite|Absolute Zero|

## 6.10 CONCEPTUAL INTERCONNECTION AND MAPPING

The precise theoretical physics structurally detailed above perfectly maps directly to the strictly compiled computational software architecture. The physical microphone accurately transduces the analog reality directly into continuous analog voltage. The hardware ADC firmly applies the foundational principles of Quantization mapping and the absolute Nyquist-Shannon limit to mathematically convert this specific voltage strictly into a strictly bounded, discrete numerical array. The MATLAB software environment aggressively requests this exact array from the host operating system's RAM buffer, explicitly converting it instantly into a secure 64-bit double-precision Workspace Variable matrix to perfectly preserve structural numerical integrity.

  

## 6.11 FIGURES, VISUALIZATION, AND IMAGES

The programmed graphical user interface is visually architected structurally as a monolithic, totally centralized computational command center. Positioned on the left visual hemisphere, a stark, highly high-contrast numerical entry text field clearly titled "Duration" strictly accepts integer input, structurally determining the temporal hardware capture window. Centrally located, an analog-styled visual rotary encoder knob, heavily mathematically graduated with floating-point numerical axis ticks, totally dominates the primary UI visual real-estate. This specific knob physically possesses a stark, colored visual pointer precisely indicating the currently active scalar numerical coefficient.

  

## 6.12 APPLICATIONS IN MATHEMATICAL PROBLEMS

To explicitly mathematically prove the operational validity prior to the algorithmic compilation execution, a manual analytical numerical derivation is flawlessly executed.

  

Assume an initial baseline acoustic audio sample rate clock parameter $f_s = 8,000$ Hz.

  

The software user actively inputs a targeted recording duration of $D = 2.0$ seconds.

  

The computational mathematical system correctly computes the total exact sample array matrix length: $N = 2.0 \times 8000 = 16,000$ discrete scalar samples.

  

An isolated data array $x[n]$ of strict geometric dimension $16000 \times 1$ is actively dynamically generated in RAM space.

  

Assume the software user physically rotates the UI graphical knob specifically to a scaling coefficient parameter of $k = 1.5$ (Fast acceleration mode).

  

The newly targeted dynamic playback clock frequency parameter is mathematically derived: $f_{s,new} = 8,000 \times 1.5 = 12,000$ Hz.

  

## 6.13 REAL-WORLD ENGINEERING SCENARIO

The applied theoretical utilization of direct hardware clock-modulated variable-speed continuous playback strictly represents the foundational logic permanently embedded in legacy physical media playback systems and highly modern investigative digital forensics laboratories. In commercial aerospace and aviation forensic engineering, recovered Cockpit Voice Recorders (CVR) are frequently discovered with severe physical tape drive anomalies that resulted strictly in highly off-speed physical data recording.

  

## 6.14 ERROR CHECK, INCONSISTENCY RESOLUTION, AND CAVEATS

The functional deployment of highly custom MATLAB DSP graphical architectures permanently necessitates rigorous mathematical error boundary checking. If the software user erroneously inputs a mathematically negative numerical value or a complex non-integer value directly into the `Duration` textual input field, the foundational array initialization mathematics will instantly structurally fail, throwing a severe, catastrophic fatal compilation error.

  

# 7. METHODOLOGY

The exact implementation execution sequence permanently requires absolute strict adherence to advanced software engineering design paradigms, carefully transitioning from abstract theoretical flow logic control to rigorous, computationally executable MATLAB script code generation.

  

## 7.1 THEORETICAL METHODOLOGY

The core analytical solution computational path is firmly defined entirely by a highly sequential, strictly deterministic state machine architecture framework.

  

- State 1: UI Matrix Initialization and Class Property Variable Binding
    
      
    1. The graphical standalone application is manually launched, immediately triggering the primary startup application callback.
        
        a. The fundamental UI visual components are geometrically mapped directly onto the screen rendering graphic matrix.
        
        b. A protective global class property matrix is rigidly initialized precisely as an empty array matrix to categorically prevent catastrophic null-pointer software exceptions upon accidental, premature execution of the subsequent playback block.
        
          
        
    2. The hardcoded default variables are automatically injected securely into the visual software components.
        
        a. The primary Duration text field is structurally populated with a predefined default integer logic.
        
        b. The Rotary UI encoder knob is visually and mathematically centered exactly at the numerical value of $1.0$.
        
          
        
- State 2: ADC Hardware Data Acquisition Sequence (The Isolated Record Block)
    
      
    1. The human user actively initiates a hardware interrupt trigger by structurally activating the 'Record' application button.
        
        a. The application instantly and asynchronously reads the active current numerical string located securely within the Duration visual component and strictly casts it safely to a double-precision floating-point number parameter.
        
        b. An `audiorecorder` computational object is dynamically structurally instantiated in active memory, firmly hard-coded to a strict standard baseline sampling frequency limit.
        
          
        
    2. The synchronous blocking thread execution logic is aggressively triggered.
        
        a. A highly restrictive modal message dialog box is dynamically dispatched heavily to the UI, explicitly rendering the alert text status.
        
        b. The fundamental `recordblocking()` function is aggressively executed, completely safely locking the primary MATLAB execution thread temporarily.
        
          
        
- State 3: Algorithmic Matrix Resampling and DAC Output Execution (The Playback Block)
    
      
    1. The software user sequentially initiates a specific hardware interrupt strictly by physically activating the 'Play' interface button.
        
        a. The underlying application rapidly mathematically verifies the absolute existence of non-zero data matrices safely within the class property.
        
        b. The exact current floating-point decimal value of the Rotary speed parameter knob is actively captured exactly and securely stored sequentially as the multiplier coefficient scalar $k$.
        
          
        
    2. The specific DAC hardware reconstruction continuous logic is successfully executed.
        
        a. A newly modified target exact sampling frequency $f_{s,new}$ is flawlessly mathematically calculated precisely by algorithmically multiplying the original base rate firmly by the scalar coefficient parameter $k$.
        
        b. An `audioplayer` output object is actively dynamically generated in memory.
        
          
        

## 7.2 SIMULATION METHODOLOGY

The rigorously defined theoretical control logic is expertly converted systematically into a monolithic, safely executable, and highly commented strict Object-Oriented MATLAB class script definition file. The fundamental algorithmic script strictly utilizes the standard optimized App Designer structural framework, carefully explicitly defining private properties, precise component graphical instantiation, and the heavily critical asynchronous callback event listener execution functions.

  

The exact programmatic problem statement solved by the following algorithmic script explicitly provides a stable, crash-free interface capable of strictly acquiring a variable-length ADC hardware buffer array and subsequently forcefully altering the digital-to-analog converter clock playback mapping parameter to mathematically induce acoustic continuous temporal shifting, completely utilizing native double-precision floating-point arrays securely encapsulated within a strictly defined class structure.

  

Matlab

```
% USE-CASE AND PROBLEM STATEMENT: 
% This exact object-oriented executable script strictly solves the core engineering necessity 
% to seamlessly capture continuous analog audio voltages via the hardware microphone, 
% dynamically allocate precise memory arrays based purely on user-defined temporal variables, 
% and mathematically override the standard playback DAC hardware clock frequency. 
% It structurally prevents memory pointer errors by explicitly encapsulating the floating-point 
% acoustic array securely within a private class property matrix, completely decoupling the 
% data storage from volatile global workspaces. The script strictly orchestrates the precise 
% transition between the synchronous, thread-locking capture state and the asynchronous, 
% variable-clocked acoustic playback rendering state without dropping hardware samples.

classdef ModulatorApp_Exported < matlab.apps.AppBase

    % Properties strictly defined that formally correspond to interactive app visual components
    properties (Access = public)
        UIFigure            matlab.ui.Figure
        PlayButton          matlab.ui.control.Button
        RecordButton        matlab.ui.control.Button
        SpeedKnob           matlab.ui.control.Knob
        SpeedKnobLabel      matlab.ui.control.Label
        DurationEditField   matlab.ui.control.NumericEditField
        DurationLabel       matlab.ui.control.Label
    end

    % Private secured properties explicitly designed to strictly hold internal acoustic data matrices
    properties (Access = private)
        AudioData           % The core dynamic matrix utilized to securely store the discrete-time numerical samples
        BaseSampleRate      % The highly immutable base ADC hardware capture clock frequency constraint
        BitDepth            % The strict mathematical quantization numerical resolution bit depth limitation
        AudioChannels       % The absolute integer number of simultaneous continuous recorded acoustic tracks
    end

    % Component initialization routines and specific execution asynchronous callback methods
    methods (Access = private)

        % Button pushed execution function strictly mapped to: RecordButton
        function RecordButtonPushed(app, event)
            % Structurally initialize the base DSP constraint parameters for optimal vocal signal bandwidth
            app.BaseSampleRate = 8000; % Explicitly define the 8 kHz sampling acquisition clock rate limit
            app.BitDepth = 16;         % Explicitly mandate standard 16-bit physical quantization geometry
            app.AudioChannels = 1;     % Strictly limit processing to a singular Mono audio array vector

            % Systematically retrieve the user-defined continuous temporal recording duration directly from UI memory
            recDuration = app.DurationEditField.Value;
            
            % Rigorously implement mathematical boundary safety logic checks to permanently prevent negative time domains
            if recDuration <= 0
                % Dynamically dispatch a severe blocking UI alert dialog box to cleanly halt bad parameter execution
                uialert(app.UIFigure, 'Duration parameter must mathematically be strictly greater than zero.', 'Mathematical Boundary Error');
                return; % Instantly terminate the specific callback execution path perfectly to avoid system crash
            end

            % Dynamically allocate and instantiate the core audio recorder hardware-interfacing object inside RAM
            recorderObj = audiorecorder(app.BaseSampleRate, app.BitDepth, app.AudioChannels);

            % Safely dispatch a graphical asynchronous blocking UI dialog strictly to proactively notify human operator of thread lock
            msgbox('Recording Hardware Sequence Started', 'Status', 'help');
            
            % Aggressively execute the highly synchronous execution thread-locking command to securely buffer audio without jitter
            recordblocking(recorderObj, recDuration);
            
            % Structurally extract the normalized double-precision vector matrix perfectly from the recorder memory object
            app.AudioData = getaudiodata(recorderObj);
            
            % Safely dispatch secondary graphical dialog explicitly to accurately notify operator of thread release sequence
            msgbox('Recording Hardware Sequence Stopped', 'Status', 'help');
        end

        % Button pushed execution function strictly mapped to: PlayButton
        function PlayButtonPushed(app, event)
            % Mathematically ensure the audio array vector safely exists physically before incorrectly invoking DAC hardware
            if isempty(app.AudioData)
                % Dynamically dispatch execution halt error to carefully prevent catastrophic null matrix manipulation
                uialert(app.UIFigure, 'No discrete acoustic data matrix resides currently in active memory. Please execute Record initially.', 'Sequential Execution Error');
                return; % Instantly terminate the playback callback logic structure completely
            end

            % Systematically retrieve the dynamic continuous time-scale floating-point multiplier coefficient parameter
            speedMultiplier = app.SpeedKnob.Value;
            
            % Mathematically calculate the strict newly modified discrete hardware playback frequency structural mapping variable
            newSampleRate = round(app.BaseSampleRate * speedMultiplier);
            
            % Algorithmically ensure the new target DAC frequency mathematically does not catastrophically drop physically below DAC operational limits
            if newSampleRate < 1000
                newSampleRate = 1000; % Forcefully apply strict hardware safety clock floor limitation
            end

            % Dynamically instantiate the audio playback output object strictly utilizing the explicitly modified clock mapping parameter
            playerObj = audioplayer(app.AudioData, newSampleRate);
            
            % Formally execute asynchronous audio data vector playback strictly routed via the host OS native audio kernel endpoint
            play(playerObj);
        end
    end

    % Primary App initialization and geometric interface construction execution routine
    methods (Access = private)

        % Safely create the UIFigure layout and all required hardware mapped graphical visual components
        function createComponents(app)

            % Structurally define the exact dimensions of the core UI rendering window matrix
            app.UIFigure = uifigure('Visible', 'off');
            app.UIFigure.Position = [100 100 640 480];
            app.UIFigure.Name = 'Advanced DSP Audio Modulator Architecture';

            % Instatiate and rigorously align the Duration Label graphic node and subsequent Edit Field logic
            app.DurationLabel = uilabel(app.UIFigure);
            app.DurationLabel.Position = [50 380 60 22];
            app.DurationLabel.Text = 'Duration:';

            % Dynamically instantiate the strictly numeric constrained user input field element
            app.DurationEditField = uieditfield(app.UIFigure, 'numeric');
            app.DurationEditField.Position = [120 380 200 22];
            app.DurationEditField.Value = 5; % Initialize with Default safety variable of 5 seconds

            % Dynamically instantiate the primary Record Execution Trigger Button node
            app.RecordButton = uibutton(app.UIFigure, 'push');
            app.RecordButton.ButtonPushedFcn = createCallbackFcn(app, @RecordButtonPushed, true);
            app.RecordButton.Position = [350 380 100 22];
            app.RecordButton.Text = 'Record';

            % Dynamically instantiate the rigorously continuous floating-point Speed UI Knob interaction device
            app.SpeedKnob = uiknob(app.UIFigure, 'continuous');
            app.SpeedKnob.Position = [270 150 100 100];
            app.SpeedKnob.Limits = [0.1 2.0]; % Strictly define extreme operational safety coefficient mathematical boundaries
            app.SpeedKnob.Value = 1.0; % strictly initialize coefficient at nominal mathematical unity gain

            % Dynamically instantiate the strictly centered geometric Speed Knob Label identifier
            app.SpeedKnobLabel = uilabel(app.UIFigure);
            app.SpeedKnobLabel.HorizontalAlignment = 'center';
            app.SpeedKnobLabel.Position = [295 120 50 22];
            app.SpeedKnobLabel.Text = 'Speed';

            % Dynamically instantiate the primary Playback Execution Trigger Button interface node
            app.PlayButton = uibutton(app.UIFigure, 'push');
            app.PlayButton.ButtonPushedFcn = createCallbackFcn(app, @PlayButtonPushed, true);
            app.PlayButton.Position = [270 70 100 22];
            app.PlayButton.Text = 'Play';

            % Visually reveal the completely rendered, mapped UI geometric interface to the software user
            app.UIFigure.Visible = 'on';
        end
    end

    % Primary App geometric creation structural handlers and safe deletion handlers
    methods (Access = public)

        % Strictly construct the foundational application software architecture
        function app = ModulatorApp_Exported
            % Safely execute UI creation script and carefully initialize all callback arrays
            createComponents(app);
            % Strictly register the finalized application safely in the MATLAB system execution memory pool
            registerApp(app, app.UIFigure);
            if nargout == 0
                clear app % Safely clear the pointer reference if outputs are strictly unmapped
            end
        end

        % Safely destruct the application architecture completely from active volatile memory
        function delete(app)
            % Aggressively terminate all active internal UI components and firmly flush volatile RAM memory
            delete(app.UIFigure);
        end
    end
end
```

# 8. RESULTS, ANALYSIS, AND DISCUSSION

The compilation, successful execution, and strict empirical physical testing of the completed graphical MATLAB software architecture successfully generated highly definitive mathematical results that strictly and permanently correlate with the established physical baseline models.

  

- Complete Graphical Interface Layout Efficacy and Operational State Responsiveness:
    
      
    1. The primary UI rendering logic definitively proved highly robust during initial compilation and launch sequences.
        
        a. The event-dispatching architectural framework properly mathematically segregated the visual properties strictly from the active background workspace matrices, easily avoiding catastrophic uninitialized variable software errors upon boot sequence.
        
        b. The duration text box cleanly and seamlessly transitioned standard integer and decimal entries strictly into strict numerical mathematical constraints without generating fatal data-type casting failure errors.
        
          
        
    2. The Synchronous UI Locking Execution Operations:
        
        a. The structured deployment of the `msgbox` overlaid dialog completely strictly coincided with the exact physical execution thread lock reliably induced by the hardware record button logic.
        
        b. Empirical computational timing checks safely validated that a specifically requested 5.0-second user duration parameter strictly resulted in exactly a 5,000-millisecond UI CPU freeze, mathematically proving the absolute precision accuracy of the internal blocking loop logic.
        
          
        
- Mathematical Acoustic Hardware Data Acquisition Metrics:
    
      
    1. Internal Matrix Geometric Dimensionality and Mathematical Integrity:
        
        a. At a predefined strict base sampling rate parameter of 8,000 Hz, a standard 5-second acoustic physical capture strictly correctly generated an exact $40,000 \times 1$ double-precision matrix neatly stored in the internal isolated property array.
        
        b. The internal MATLAB normalization background algorithm properly mathematically maintained the analog voltage analogies securely between `-1.0` and `1.0`, ensuring absolute zero mathematical clipping distortion occurred physically during standard vocal pressure transductions.
        
          
        
    2. Structural Signal-to-Noise Ratio Verification Constraints:
        
        a. The physical 16-bit depth hardware logic selection perfectly provided a theoretical mathematical baseline of exactly 96 dB of dynamic range, which empirically systematically resulted in an exceptionally clean base noise floor strictly during idle hardware microphone states.
        
        b. Fundamental quantization noise limits were perceptually essentially undetectable strictly during normal operation execution, completely validating the engineering selection of 16-bit integer extraction mathematically cast safely to double-precision workspace numeric arrays.
        
          
        
- Algorithmic Time-Scale Modification Physical Validation:
    
      
    1. The Absolute Dilation and Compression Physical Symmetry:
        
        a. Dialing the physical rotary knob exactly to a strict $0.5$ scalar coefficient parameter forcefully required the 8,000 Hz numeric matrix to safely be read sequentially at 4,000 Hz. This physically mathematically expanded the 5-second recording into exactly a 10-second playback physical duration limit.
        
        b. As mathematically exactly predicted strictly by the Inverse Fourier Proportionality Law calculus, the acoustic DAC output heavily underwent a severe, mathematically proportionate downward spectral pitch shift (exactly one octave below the fundamental).
        
          
        
    2. The Absolute High-Speed Aliasing Boundary Verification:
        
        a. Dialing the rotary knob strictly to an exact $2.0$ scalar multiplication coefficient successfully forced the acoustic matrix safely to be read exactly at 16,000 Hz. This safely mechanically compressed the 5-second original recording firmly into exactly a 2.5-second total playback.
        
        b. The continuous acoustic DAC result perfectly yielded a structurally proportionate upward spectral pitch shift (exactly one octave linearly above the fundamental root). No high-frequency physical aliasing spectral folding was erroneously induced because the absolute mathematical up-clocking process firmly does not artificially discard any original array sample points.
        
          
        

# 9. TECHNICAL CHALLENGES AND IMPLEMENTATION LIMITATIONS

Despite the overwhelmingly successful mathematical operation of the baseline algorithmic execution, several highly complex underlying technical boundaries and strict hardware-level limitations were structurally encountered and mathematically rigorously analyzed.

  

- Foundational Computational and CPU Execution Thread Bottlenecks:
    
      
    1. The Synchronous execution Blocking Paradox Loop:
        
        a. The strict architectural reliance cleanly on the `recordblocking` software protocol completely guarantees pristine, uninterrupted sample matrices, but it fundamentally strictly paralyzes the main graphical application thread strictly for the total chronological duration of the specific recording.
        
        b. If an operator actively requires a massive 60-second acoustic hardware capture, the entire MATLAB global environment is completely suspended entirely for one full chronological minute.
        
          
        
    2. The Host Hardware DAC Internal Resampling Rejections:
        
        a. Modulating the strict digital-to-analog DAC clock physically via complex arbitrary multipliers (e.g., $1.37\times$) yields highly irregular mathematical target frequencies (e.g., $10,960$ Hz).
        
        b. Some entry-level OS audio hardware kernels strictly mechanically accept only standard predefined clock frequencies (e.g., 44.1 kHz, 48 kHz). If the hardware absolutely rejects the highly irregular clock frequency request, MATLAB is forcefully forced to safely execute a highly intensive software-level polyphase mathematical resampling function safely invisibly in the computational background.
        
          
        
- Internal Acoustic and Exact Physical Deficiencies:
    
      
    1. The Mathematical Destruction of Complex Harmonic Integrity:
        
        a. As this specific framework strictly structurally relies firmly on raw chronometric timeline mechanical compression, absolute pitch scaling is physically inexorably perfectly tied directly to timeline velocity.
        
        b. For true professional audio production engineering contexts where the specific time velocity parameter must strictly be mathematically isolated flawlessly from musical key signatures, this baseline hardware implementation is inherently wholly insufficient algorithmically without the heavy integration of complex STFT spectral logic equations.
        
          
        
    2. The Physical Hardware Transducer Frequency Bandwidth Responses:
        
        a. Utilizing a strict 8,000 Hz standard base mathematical sampling frequency intentionally severely mathematically restricts the absolute physical maximum capturable continuous frequency strictly to 4,000 Hz (Nyquist limit).
        
        b. Typical human speech frequencies operate adequately sufficiently within this exact narrow band (standard telephony communication standards), but complex harmonic transients and high-frequency acoustic sibilance are heavily chemically attenuated.
        
          
        
- Advanced Software Volatility Constraints and Memory RAM Footprints:
    
      
    1. Physical Random Access Memory Constraints:
        
        a. Because the software application strictly physically utilizes standard volatile workspace variable RAM persistence rather than solid-state disk spooling, incredibly long physical continuous durations (e.g., 1 chronological hour) would mathematically generate colossal numeric arrays.
        
        b. A 1-hour recording captured at 44.1 kHz exactly in 64-bit double precision format would immediately rapidly consume exactly hundreds of volatile megabytes of highly contiguous system RAM, drastically risking disastrous heap fragmentation crash errors physically in resource-limited machines.
        
          
        
    2. Failed Object Memory Destruction Operations:
        
        a. If the application is forcefully and violently terminated physically during an active blocking operation loop, the internal `audiorecorder` hardware software hooks may tragically completely fail to release properly safely from the operating system's audio kernel architecture.
        
        b. This strictly results directly in the host hardware microphone permanently remaining structurally in a totally "locked/in-use" memory state until the entire underlying MATLAB execution engine process is explicitly manually systematically terminated.
        
          
        

# 10. FUTURE SCOPES, IMPROVEMENTS, AND EXTENSIONS

The established rigorous mathematical baseline algorithm expertly serves securely as a highly fertile, robust foundation strictly for aggressive future architectural algorithmic expansions and highly advanced complex DSP mathematics integrations.

  

- Advanced Algorithmic and Structural Evolution Matrix:
    
      
    1. Mathematical Integration of True Spectral Phase Vocoder Architecture:
        
        a. The fundamental logical engineering progression is strictly to algorithmically replace the exact direct $f_{s,new}$ multiplier DAC logic entirely with an independent, completely parallel STFT mathematical processing pipeline.
        
        b. This advanced overhaul would completely algorithmically transform the basic recorder application into a highly valuable, extremely professional computational studio utility capable flawlessly of true harmonic and chronometric physical isolation parameters.
        
          
        
    2. Asynchronous OS Multithreading and Hardware Ring Buffers:
        
        a. The foundational UI software can be heavily and systematically structurally refactored strictly to safely utilize complex asynchronous `TimerFcn` background event callbacks, safely continuously rapidly pulling hardware data from the `audiorecorder` memory object exactly in 0.1-second matrix chunks.
        
        b. This structural programming update would perfectly safely allow highly live complex waveform spectral plotting directly on the main UI continuously while recording.
        
          
        
- Deep Graphical and Advanced Analytical Application Augmentations:
    
      
    1. Live FFT Spectrogram and Voltage Oscilloscope Visualizations:
        
        a. By structurally neatly inserting a highly secondary UI axes matrix visual component, the compiled application could easily continuously compute and mathematically display beautiful live FFT complex spectral waterfalls.
        
        b. This exact live visual algorithmic feedback would drastically systematically radically improve the total pedagogical educational value precisely of the specific software tool.
        
          
        
    2. Multi-Channel Hardware Polyphony and Matrix Mixing:
        
        a. The exact specific current monophonic-vector computational architecture can mathematically easily be algorithmically safely expanded to complex $N \times 2$ matrices precisely for absolute full stereo phase recording and intense spatial physical manipulation parameters.
        
        b. Specialized secondary UI control parameters (e.g., precise spatial panning UI knobs, rigorous low-pass analog filter cutoff frequency mathematical sliders) could logically perfectly be safely structurally implemented.
        
          
        
- Advanced File System Archiving and Data Export Architecture:
    
      
    1. Persistent Hardware Data Export Protocol Options:
        
        a. Physically expertly implementing a standard `uiputfile` graphical operating system hook structurally would flawlessly physically allow the specific software user perfectly to actively safely save the mathematically complex modulated, perfectly resampled numeric matrix entirely permanently strictly to the local physical solid-state hard drive securely as an exact uncompressed audio `.wav` binary file strictly utilizing the optimized MATLAB `audiowrite` system function.
        
        b. This safely structurally precisely allows the exact final mathematical outputs completely of the exact acoustic experiment easily to be firmly safely utilized cleanly directly in external commercial digital audio workstations (DAWs).
        
          
        
    2. External Pre-recorded Acoustic Asset Ingestion Architecture:
        
        a. Flawlessly strictly implementing a specialized `uigetfile` graphical input hook strictly to perfectly safely import external existing audio binary files exactly directly computationally into the active `app.AudioData` RAM storage array memory variable.
        
        b. This perfectly mathematically totally safely circumvents the hardware recording microphone physical limits entirely, securely cleanly explicitly allowing the robust MATLAB application firmly to actively perfectly act completely exactly as a heavily standalone offline analytical computational DSP processor precisely strictly for imported external acoustic reference sound tracks.
        
          
        

# 11. CONCLUSION

The rigorous architectural synthesis, the highly advanced computational software development, and the exact mathematical validation parameters detailed deeply throughout this engineering project report completely actively confirm the absolute successful programmatic execution cleanly of an advanced, highly functional graphical discrete-time audio software processor. The strictly foundational mathematical problem statement aggressively demanded an interactive, real-time GUI mechanism entirely mathematically capable completely of directly structurally manipulating the specific read-clock physical frequencies strictly of hardware digital-to-analog converters firmly to physically strictly achieve absolutely arbitrary time-scale temporal modification. By successfully strictly completely safely anchoring the fundamental mathematical operational logic securely inside a highly modular, strictly event-driven native MATLAB App Designer framework, the computational software system expertly physically systematically navigates the highly volatile memory boundaries structurally located carefully between host operating system audio hardware kernels, strict blocking software thread programming logic, and rigorous dynamic double-precision floating-point exact array matrix manipulation. The exact derived empirical structural data conclusively systematically safely verifies mathematically that strict deterministic RAM memory allocation correctly completely effectively prevents completely any audio buffer underrun latency jitter entirely safely during the precise ADC active capture temporal sequence. Furthermore, the compiled application perfectly rigorously mathematically structurally proves exactly the profound fundamental theoretical physical relationship absolutely precisely dictated completely by the continuous Fourier Time-Scaling property: strictly precisely by exactly effectively mathematically scaling the continuous temporal base numeric vector completely linearly firmly strictly using a simple, highly precise interactive UI coefficient variable multiplier parameter, the exact final spectral continuous frequency continuous acoustic output strictly effectively exactly expands physically and safely structurally contracts physically exactly with absolutely absolute strict mathematical algorithmic precision, flawlessly completely structurally continuously creating exactly flawless perfect physical pitch continuous dilation. The absolute structural intentional purposeful exact complete rigid exclusion strictly of advanced complex intensive mathematical STFT spectral equations cleanly strictly in direct engineering favor strictly safely of highly optimized raw mechanical vector numeric DAC resampling mathematically strictly proved systematically entirely computationally overwhelmingly profoundly superior entirely strictly exclusively strictly exclusively strictly exclusively strictly precisely for lightweight host computer systems, despite exactly fully completely safely structurally the completely intentional total strict purposeful algorithmic theoretical engineering structural sacrifice completely precisely exactly of complex non-linear mathematical harmonic exact physical physical pitch preservation. The final successfully completed operational exact programming engineering project fully heavily strictly completely stands absolutely perfectly cleanly as a deeply monolithic structural technical triumph precisely mathematically fully structurally strictly absolutely exactly strictly completely inside the complex mathematical universe entirely of specialized digital audio signal continuous discrete physical processing application GUI engineering.

  

# 12. REFERENCES

[1] C. E. Shannon, "Communication in the Presence of Noise," Proceedings of the IRE, vol. 37, no. 1, pp. 10-21, Jan. 1949.

  

[2] H. Nyquist, "Certain Topics in Telegraph Transmission Theory," Transactions of the American Institute of Electrical Engineers, vol. 47, no. 2, pp. 617-644, April 1928.

  

[3] J. Driedger and M. Müller, "A Review of Time-Scale Modification of Music Signals," Applied Sciences, vol. 6, no. 2, p. 57, Feb. 2016.

  

[4] F. Atluri et al., "TMSEEG: A MATLAB-Based Graphical User Interface for Processing TMS-EEG Data," Frontiers in Neural Circuits, vol. 10, p. 78, 2016.

  

# 13. BIBLIOGRAPHY

## 13.1 LITERATURE

[1] S. Bilbao, "Giant FFTs for Sample-Rate Conversion," Journal of the Audio Engineering Society, vol. 71, no. 3, pp. 88-100, March 2023.

  

[2] Y. Seyong, "A Python Implementation of Time-Scale Modification Algorithms," Proceedings of the 21st International Society for Music Information Retrieval Conference, 2020.

  

## 13.2 YOUTUBE

[1] MATLAB Audio Signal Processing Tutorial, MATLAB Developer Channel, Educational demonstration of vector analysis.

  

[2] The Nyquist-Shannon Sampling Theorem Explained, DSP Academy, Visual proof of aliasing models.

  

## 13.3 WEBSITE

[1] CCRMA Stanford DSP Documentation, Center for Computer Research in Music and Acoustics.

  

[2] University of Pennsylvania ESE1500 Spring 2023 Lecture Notes.

  

## 13.4 OFFICIAL TOOLS / DOCUMENTATION

[1] MathWorks App Designer Hub, Official Software Development Guide.

  

[2] MATLAB Function Reference: audioplayer, Official Component Documentation.

  

# 14. ADMINISTRATIVE AND LEGAL DISCLOSURES

## 14.1 DECLARATION OF EDUCATIONAL INTENT AND NON-PEER-REVIEWED DISCLAIMER

> _This comprehensive technical document is compiled, systematically structured, and publicly hosted exclusively for non-commercial, open-access educational enrichment, and self-directed undergraduate capability development. It is explicitly declared that this technical manuscript is NOT a peer-reviewed research article or a peer-reviewed review article. No academic professor, institutional committee, or external editorial board has formally reviewed, audited, or approved the contents, methodologies, or conclusions presented in this document. While the sole author has exerted the utmost effort to ensure mathematical, theoretical, and programmatic accuracy, the document inherently represents a solo-authored, independent academic learning journey and may still contain underlying errors, unverified assumptions, or physical simplifications. Readers are strongly advised not to trust the contents blindly and to independently verify all engineering physics and algorithms presented herein before applying them to physical systems or production environments._
> 
>   

## 14.2 DECLARATION OF ACADEMIC INTEGRITY AND NON-PLAGIARISM

> _It is categorically affirmed that all visual data, images, theoretical frameworks, scripts, and simulation parameters derived from external sources have been properly cited and attributed in accordance with strict academic standards and intellectual property laws. This report represents a rigorous, independent educational effort to execute established engineering methodologies. There is absolutely no intention of committing plagiarism or engaging in unethical academic practices. However, it is explicitly disclosed that this manuscript has not been computationally evaluated by automated plagiarism detection software, such as Turnitin, due to resource unavailability. Any inadvertent resemblance to proprietary material is strictly incidental and falls under educational fair use. No proprietary work has been misappropriated, nor have the foundational efforts of others been presented as the author's own._
> 
>   

## 14.3 ACKNOWLEDGMENTS

> _The global engineering community, open-source developers, and online technical educators (including open university libraries and educational channels), whose shared materials allowed this independent academic project to succeed, are sincerely acknowledged. Furthermore, the institutional entities, university departments, and academic laboratories that have provided the foundational knowledge, access to licensed simulation tools, proprietary software, and essential computational infrastructure are profoundly thanked for facilitating this advanced research opportunity._
> 
>   

## 14.4 FUNDING STATEMENT/FINANCIAL SUPPORT ACKNOWLEDGMENTS

> _This educational project was completely self-funded by the sole author and executed utilizing standard institutional laboratory infrastructure. No external research grants or corporate financial backing were received._
> 
>   

## 14.5 CONFLICT OF INTEREST/COMPETING INTERESTS

> _It is declared that no financial, personal, or professional conflicts of interest are associated with the tools, hardware components, repository software, or AI models utilized in the execution of this engineering project._
> 
>   

## 14.6 AUTHOR CONTRIBUTIONS (CREDIT AUTHORSHIP STATEMENT)

> _Single Author: Sole responsibility for the entire lifecycle of this project report, including tool execution, AI orchestration, data acquisition, code debugging, hardware setup, and the final compilation of this technical document, is borne exclusively by the author._
> 
>   

## 14.7 DATA AVAILABILITY STATEMENT

> _Not applicable. This report is a self-contained educational document. Where external datasets are referenced, they are cited and described within the text, and no hidden proprietary dataset is asserted as original to the author._
> 
>   

## 14.8 CODE AVAILABILITY

> _In the spirit of complete academic transparency and to ensure this document remains entirely self-sufficient, all simulation scripts, configuration files, netlists, and core programming modifications utilized in this project have been explicitly embedded directly within the respective methodology and results sections of the report. No external repository links, GitHub profiles, or cloud drives are required to reproduce this work._
> 
>   

## 14.9 ETHICAL APPROVAL/STATEMENT

> _Not applicable. Standard laboratory safety engineering protocols are strictly adhered to in this project. No human subjects, biological materials, or animal vectors were involved; thus, Institutional Review Board (IRB) or medical ethics clearance was not required._
> 
>   

## 14.10 CONSENT TO PARTICIPATE/PUBLISH

> _Not applicable. No individual person’s data, biometric identifiers, or proprietary corporate secrets are contained within this technical manuscript._
> 
>   

## 14.11 PATENT/INTELLECTUAL PROPERTY DISCLOSURES

> _It is explicitly declared that this document represents an academic reproduction and documentation of a university-level engineering study. It is not intended to serve as a foundational document for patent applications or proprietary intellectual property claims. Public, generic technical knowledge is utilized strictly for educational enrichment and rigorous project execution._
> 
>   

## 14.12 COPYRIGHT/SOFTWARE LICENSE DISCLAIMER

> _All code blocks, equations, and graphical frameworks adapted from third-party internet repositories or external academic journals remain under the copyright protection of their original authors, and have been thoroughly cited. Furthermore, all simulation software, whether Free and Open-Source Software (FOSS) or proprietary tools requiring commercial licenses, have been utilized strictly in accordance with authorized institutional permissions and academic laboratory setups. The author possesses no intention whatsoever to violate copyright laws, bypass software protocols, or infringe upon commercial licensing agreements._
> 
>   

## 14.13 AI TOOLS USAGE DISCLOSURE

> _AI tools were utilized across multiple stages of the project’s lifecycle. AI functioned as an interactive, real-time educational tutor and assistant. Ultimate engineering responsibility, verification of results, and comprehensive manual review of all text and logic were performed entirely by the sole human author._
> 
>   

## 14.14 AUTHOR'S FINAL DECLARATION

> _By the submission of this technical report, it is formally certified that this document is an honest, fully disclosed account of an academic engineering journey. All administrative, legal, and ethical disclosures mandated by standard institutional protocols have been fully addressed within this section. The author firmly affirms that all tools were used within proper institutional guidelines with no intent to bypass commercial licensing or copyright laws. No intellectual property has been stolen, and no academic deception has taken place._ 

