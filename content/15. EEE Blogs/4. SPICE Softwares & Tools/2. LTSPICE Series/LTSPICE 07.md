# Advanced Computational Dynamics and Architectural Paradigms in the LTspice 24/26 Simulation Engine

## Introduction

The simulation of analog and mixed-signal electronic circuits relies fundamentally on the numerical resolution of nonlinear, time-dependent differential equations. Since the inception of the Simulation Program with Integrated Circuit Emphasis (SPICE) at the University of California, Berkeley, the electronic design automation (EDA) industry has continuously sought to balance computational speed, numerical stability, and simulation accuracy. The LTspice engine, up through iterations 24 and 26, represents a pinnacle in this evolutionary trajectory. By addressing the inherent mathematical discontinuities present in legacy Berkeley SPICE models, implementing proprietary numerical integration methods, and utilizing a self-authoring sparse matrix solver, LTspice fundamentally circumvents the classical limitations of matrix evaluation and numerical oscillation. This report exhaustively documents the deep architectural nuances, algorithmic implementations, and mathematical frameworks governing the LTspice 24/26 engine, providing an encyclopedic analysis of its Modified Nodal Analysis (MNA) core, multithreading strategies, integration heuristics, and memory allocation paradigms.

## Chapter 1: History, Evolution, and the Shift to 64-bit Architecture

The genesis of SPICE-like simulators began with the foundational work of Donald Pederson and Laurence Nagel in the 1970s, which introduced standard Nodal Analysis in SPICE1 and subsequently Modified Nodal Analysis (MNA) in SPICE2 to accommodate inductors and voltage sources . The subsequent release of SPICE3 transitioned the underlying codebase from Fortran to the C programming language, introducing polynomial capacitors, inductors, and voltage-controlled sources while eliminating several early convergence issues . Despite these advancements, SPICE3 and its commercial derivatives (such as PSpice) inherited fundamental mathematical flaws—most notably, discontinuities in the derivative of the current-voltage (I-V) curves in semiconductive device models . 

In legacy SPICE environments, devices such as diodes and bipolar junction transistors frequently exhibit discontinuities in both their calculated value and their slope. This flaw is devastating to the Newton-Raphson iteration algorithm, which operates by expanding each nonlinear circuit device's I-V curve as a Taylor series, retaining only the first two terms . Because the Newton-Raphson method inherently relies on continuous derivatives to converge upon a solution, discontinuous models trap the solver in non-convergent iterative loops. LTspice, architected primarily by Mike Engelhardt, was explicitly engineered to eradicate these mathematical discontinuities . Every semiconductive device model within the LTspice engine was rigorously rewritten to ensure continuous derivatives across all operating regimes, guaranteeing that Newton-Raphson iterations converge upon a reliable numerical proof of the circuit's true state rather than failing due to modeling artifacts .

As circuit complexity exploded with modern integrated circuit design and massive switched-mode power supplies, the 32-bit architecture of early LTspice iterations encountered insurmountable memory walls. The 32-bit address space inherently limits an application to 2 GB (or 4 GB with large-address awareness) of random access memory (RAM). In highly complex transient analyses involving millions of time steps and dense matrices, this ceiling routinely truncated simulations or forced the operating system into aggressive disk paging, which decelerated execution times by orders of magnitude. 

The transition to a pure 64-bit architecture in LTspice 24 and LTspice 26 fundamentally shattered this barrier. Utilizing 64-bit pointers and optimized ARM64 instruction sets for modern multicore processors, LTspice can now address virtually infinite virtual memory, dynamically allocating vast expanses of RAM to hold massive sparse matrices and raw waveform data without paging to disk. This architectural shift not only eliminates transient memory limits but also optimizes vectorization operations across CPU registers, dramatically accelerating matrix evaluation algorithms that are structurally bound by floating-point operations. The larger memory space allows for the retention of massive Jacobian matrices in the primary memory hierarchy, minimizing cache misses and maximizing thread-equivalent utilization across modern processors.

## Chapter 2: The Modified Nodal Analysis (MNA) Framework

At the core of the LTspice solver is the Modified Nodal Analysis (MNA) formulation, which maps the topological connections of a circuit into a massive, structurally symmetric system of linear equations . Standard Nodal Analysis utilizes Kirchhoff’s Current Law (KCL) to formulate an admittance matrix, which is highly efficient for circuits composed solely of passive resistors and independent current sources. However, standard Nodal Analysis fails to handle ideal voltage sources and inductors, as the currents through these elements are not solely functions of their terminal voltages . MNA augments the standard admittance matrix to accommodate these elements by introducing branch currents as additional unknown state variables .

The standard MNA equation evaluates the dynamic state of the circuit using a partitioned matrix structure that takes the form:

$\begin{bmatrix} Y_R & B \\ C & D \end{bmatrix} \begin{bmatrix} \mathbf{v} \\ \mathbf{i} \end{bmatrix} = \begin{bmatrix} \mathbf{j} \\ \mathbf{e} \end{bmatrix}$

In this rigorous formulation, $Y_R$ represents the nodal conductance matrix of size $N \times N$, containing the stamps of voltage-controlled elements such as resistors and transconductances. The vector $\mathbf{v}$ is the $N \times 1$ column matrix of unknown node voltages, while $\mathbf{i}$ is the $M \times 1$ vector of unknown branch currents for voltage sources and inductors. The matrix $B$ is an $N \times M$ incidence matrix mapping the unknown currents to their respective nodes, and $C$ is an $M \times N$ matrix defining the branch equations. For passive, reciprocal networks, it is generally true that $C = B^T$. The matrix $D$ is an $M \times M$ matrix representing the relations among the branch currents themselves, which is exactly zero for ideal independent voltage sources. Finally, $\mathbf{j}$ and $\mathbf{e}$ represent the vectors of known independent current and voltage sources, respectively.

When LTspice evaluates an energy-storage element such as an inductor in the time domain, it must apply a numerical integration rule to discretize the continuous-time differential equation $v_L(t) = L \frac{di_L(t)}{dt}$. This yields a companion model representing the inductor as a parallel combination of a discrete-time conductance and a history-dependent current source . For a time step $h_n = t_n - t_{n-1}$, the inductor stamp in the MNA matrix utilizing the Trapezoidal rule introduces an augmented row and column corresponding to the new branch current variable. The discretized equation for the inductor becomes:

$i_L(t_n) = i_L(t_{n-1}) + \frac{h_n}{2L} \left( v_L(t_n) + v_L(t_{n-1}) \right)$

This relationship is mapped directly into the MNA matrix structure. The specific stamping operation for an inductor connected between nodes $k$ and $j$ involves updating the global Jacobian matrix. The augmented matrix system for this specific branch is defined as:

$
\begin{bmatrix} 
\dots & \dots & \dots & 1 \\ 
\dots & \dots & \dots & -1 \\ 
1 & -1 & \dots & -\frac{2L}{h_n} 
\end{bmatrix}
\begin{bmatrix} 
v_k(t_n) \\ 
v_j(t_n) \\ 
\vdots \\ 
i_L(t_n) 
\end{bmatrix}
=
\begin{bmatrix} 
0 \\ 
0 \\ 
\vdots \\ 
-i_L(t_{n-1}) - \frac{h_n}{2L} (v_k(t_{n-1}) - v_j(t_{n-1}))
\end{bmatrix}
$

This matrix formulation requires continual reformulation and refactorization at every Newton-Raphson iteration. The introduction of the companion model and the companion transformation allows the solver to uniquely determine the discrete states, as the number of unknowns exactly equals the number of equations . To achieve high computational throughput, LTspice meticulously structures the G-matrix to ensure structural symmetry wherever possible, allowing the sparse matrix solver to optimize memory access patterns during lower-upper (LU) decomposition.

## Chapter 3: Numerical Integration Methods

Because a SPICE simulation maps continuous reactive elements (capacitors and inductors) into the discrete-time domain, the choice of numerical integration algorithm is arguably the most critical parameter governing simulation fidelity. The Dahlquist barrier mathematically dictates that no linear multi-step method of order greater than two can be unconditionally A-stable . Consequently, LTspice predominantly employs second-order implicit integration methods to ensure stability across stiff differential equations .

The Trapezoidal (Trap) method computes the state variable using the arithmetic mean of the derivatives at the current and previous time steps. For an ordinary differential equation of the form $\dot{x} = f(x, t)$, the Trapezoidal update rule is:

$x_{n} = x_{n-1} + \frac{h_n}{2} \left( \dot{x}_{n} + \dot{x}_{n-1} \right)$

While Trap is highly accurate and inherently minimizes the local truncation error (LTE), it is highly susceptible to "Trap ringing"—an artificial numerical oscillation that occurs when the integration engine encounters a discontinuous derivative or a highly non-linear switching event in the circuit waveforms. When the solver steps over a discontinuity, the Trapezoidal rule effectively bounces back and forth across the true solution, creating non-physical ringing artifacts . 

Historically, commercial solvers like PSpice addressed this instability by defaulting to the Gear integration method, specifically Gear's second-order backward differentiation formula (BDF2):

$x_{n} = \frac{4}{3} x_{n-1} - \frac{1}{3} x_{n-2} + \frac{2}{3} h_n \dot{x}_{n}$

While Gear integration is heavily damped and entirely eliminates Trapezoidal ringing, it introduces severe artificial numerical damping into the simulation. This damping fundamentally alters the AC characteristics of high-Q resonant tanks and oscillator start-up conditions, inappropriately masking physical instability in circuit topologies and leading to false-positive stability conclusions .

To resolve the dichotomy between Trap ringing and Gear damping, LTspice utilizes a proprietary algorithm known as Modified Trap . Modified Trap acts as a dynamically de-tuned variant of the Trapezoidal rule, designed explicitly to dampen the computational pole that causes numerical ringing without introducing the catastrophic phase errors associated with Gear integration . The local truncation error for Modified Trap remains proportional to the third derivative of the solution, bounded by the equation:

$LTE_{n} = C_K \cdot h_n^3 \cdot \frac{d^3 x(\xi)}{dt^3}$

where $C_K$ is a proprietary coefficient slightly adjusted from the pure Trap coefficient of $-\frac{1}{12}$. By defaulting to Modified Trap, LTspice successfully simulates complex switched-mode topologies without artificially damping physical resonance or succumbing to computational oscillations . It is mathematically possible to manually detune the integration using an undocumented SPICE directive `.options trapdamp=0.01`, though this is heavily discouraged as the native Modified Trap engine dynamically handles this damping automatically . 

## Chapter 4: Sparse Matrix Solvers and Memory Allocation

The evaluation of the Jacobian matrix during the Newton-Raphson iteration yields a system of linear equations mathematically denoted as $A \mathbf{x} = \mathbf{b}$, where $A$ is an incredibly sparse matrix (often containing $>99\%$ zeros for large, macroscopic circuits) . To solve this, LTspice employs sparse LU factorization, decomposing the active matrix such that $A = LU$, where $L$ is a lower triangular matrix and $U$ is an upper triangular matrix. The solution for the state vector $\mathbf{x}$ is then sequentially found via forward substitution ($L\mathbf{y} = \mathbf{b}$) and backward substitution ($U\mathbf{x} = \mathbf{y}$) .

A critical mathematical vulnerability in sparse LU factorization is "fill-in," a phenomenon where previously zero elements in the original matrix $A$ become non-zero in the $L$ or $U$ matrices during Gaussian elimination. Excessive fill-in leads to memory explosion and exponential slowdowns in processing time. To strictly mitigate this, LTspice utilizes a highly advanced implementation of the Markowitz pivoting algorithm . The Markowitz criterion actively selects the pivot element $a_{i,j}$ that minimizes the upper bound on the potential fill-in, defined by the cost function:

$\text{Cost}_{i,j} = (r_i - 1)(c_j - 1)$

where $r_i$ and $c_j$ denote the number of non-zero entries in row $i$ and column $j$ of the active submatrix, respectively . By minimizing this product, the algorithm drastically reduces the requisite floating-point operations.

However, even with optimal pivoting, locating data pointers scattered across hierarchical memory structures dynamically induces severe cache misses in the CPU, stalling the Floating Point Unit (FPU). To circumvent this hardware limitation, LTspice operates as a self-authoring, self-assembling, and self-linking compiler at runtime . Once the topology of the circuit is parsed and the matrix memory is explicitly allocated (and the exact memory addresses returned from `malloc()` are known), LTspice writes custom, inline assembly code directly to the CPU's instruction cache. This late-authored code resolves concrete matrix element addresses in-line, completely bypassing the need for indirection arrays or pointer chasing. By streaming data flawlessly directly to the FPU, LTspice achieves computational speeds that are physically unmatched by static, generalized matrix solver libraries like KLU or Intel's MKL Pardiso .

## Chapter 5: Convergence Algorithms and DC Operating Point

Prior to executing a transient analysis, the engine must mathematically compute the DC operating point (OP). For highly nonlinear circuits containing complex semiconductor topologies, the standard Newton-Raphson algorithm often fails to converge, trapping the solver in local minima or triggering singular matrix exceptions . LTspice utilizes a rigorously defined, multi-tiered fallback architecture to guarantee convergence.

If the basic DC iteration fails after the limit defined by `itl1` (default 100 iterations) , LTspice automatically deploys Gmin stepping. By default, a minute parasitic conductance, `gmin` (default $10^{-12}$ S), is placed across all nonlinear semiconductor junctions . In Gmin stepping, the solver artificially increases this conductance to heavily linearize the circuit, achieves a trivial mathematical solution, and then steps the conductance back down towards $10^{-12}$ S logarithmically over a series of steps (defined by `gminsteps`, default 25) . The nonlinear equation modified during this process is:

$F(\mathbf{x}) + G_{step} \cdot \mathbf{x} = 0$

If Gmin stepping fails to achieve convergence, the engine falls back to Source stepping (governed by the parameter `itl6` or `srcsteps`). In this methodology, the magnitudes of all independent voltage and current sources are mathematically scaled back to near-zero, solving the heavily damped state, and incrementally ramping them up to 100% . 

The ultimate fail-safe in LTspice is Pseudo-Transient Analysis (PTA) . When standard DC methodologies completely fail, the solver temporarily converts the DC operating point calculation into a transient simulation. Virtual capacitors are placed in parallel with current sources, and virtual inductors are inserted in series with voltage sources . The algorithm integrates the system of ordinary differential equations (ODEs):

$\mathbf{D} \dot{\mathbf{x}}(t) = -F(\mathbf{x}(t), t)$

using the Backward Euler method, marching through "pseudo-time" until the dynamic derivatives approach absolute zero ($\dot{\mathbf{x}}(t) \approx 0$), successfully isolating the true DC state . If a singular matrix error occurs, it is generally indicative of an isolated floating node (a node with no DC path to ground). Troubleshooting this mathematically requires appending the SPICE directive `.options gfloat=1e-12`, which explicitly forces a minimal topology check and clamps isolated sub-matrices to ground using a one-pico-siemens conductance .

## Chapter 6: Multithreading and CPU Performance Scaling

Modern processor architectures heavily rely on multi-core threading to execute operations, but SPICE simulations present unique challenges to parallelization, often encountering strict bottlenecks defined by Amdahl's Law. A standard SPICE iteration is bisected into two distinct computational phases: device equation evaluation and the subsequent matrix solution . 

The mathematical evaluation of nonlinear device models (e.g., calculating the instantaneous transconductance $g_m$ and voltage-dependent junction capacitances of a BSIM4 MOSFET) is a trivially parallelizable task. LTspice dynamically partitions the parsed netlist, dispatching subsets of device evaluations across all available logical threads. Each thread computes the localized I-V derivatives and constructs its local Jacobian matrix stamps entirely independently. 

Conversely, the LU factorization of the resulting global sparse matrix is fundamentally iterative and highly interdependent, severely limiting thread-equivalent utilization. To mitigate this structural bottleneck, LTspice utilizes Block Triangular Form (BTF) algorithms, which algorithmically reorganize the matrices to identify mutually exclusive sub-matrices that can be factorized concurrently without structural collision . By isolating independent circuit blocks (for example, decoupled stages of a multi-stage operational amplifier separated by ideal buffers), the engine launches parallel factorization routines. The threads synchronize only at the final forward-backward substitution nodes, achieving maximum possible thread utilization for a fundamentally serial mathematical process.

## Chapter 7: Simulation Speed Optimizations

The integration time step $h_n$ in LTspice is dynamically scaled during transient simulation to optimize speed while strictly adhering to user-defined error boundaries. The engine calculates the Local Truncation Error (LTE) for all reactive components at each micro-step. If the computed LTE exceeds the allowable threshold, the time step is forcibly rejected, $h_n$ is halved, and the iteration repeats. The acceptable error bound for any given state variable is mathematically defined as:

$E_{max} = \text{reltol} \cdot \max(|x_n|, |x_{n-1}|) + \text{abstol}$

LTspice relies on a suite of rigorously defined tolerance parameters, manageable via the `.options` directive, to govern this calculation. The primary parameters and their defaults are defined below:

| Tolerance Parameter | Default Value | Mathematical Definition |
| :--- | :--- | :--- |
| `reltol` | 0.001 (0.1%) | The maximum relative error allowed in the computation of continuous voltages and currents . |
| `abstol` | 1 pA ($10^{-12}$ A) | The absolute error tolerance for resolving current vectors . |
| `vntol` | 1 $\mu$V ($10^{-6}$ V) | The absolute error tolerance for resolving voltage vectors . |
| `chgtol` | 10 fC ($10^{-14}$ C) | The absolute error tolerance for charge conservation calculations . |
| `trtol` | 2.0 | An overarching transient error tolerance multiplier adjusting the aggressivity of the time-step estimation . |

By decreasing `reltol` (e.g., from the default `0.001` to `1e-4`), the user forces vastly tighter convergence, yielding higher analytical accuracy at the expense of exponentially longer computational times. Conversely, increasing `abstol` and `vntol` can dramatically accelerate simulation speeds for macroscopic power electronics where picoampere and microvolt resolution is computationally wasteful and mathematically irrelevant to the macro-behavior of the circuit . The `trtol` parameter directly dictates how much the engine overestimates the truncation error; a lower value forces smaller integration steps, highly useful for chaotic oscillators .

## Chapter 8: Waveform Viewer Architecture and Data Compression

As the solver engine evaluates millions of time points during a long transient analysis, recording the 64-bit state vector for every single node directly to disk can rapidly consume gigabytes of storage, aggressively bottlenecking I/O subsystems. LTspice circumvents this limitation via dynamic marching waveforms and proprietary lossy compression algorithms embedded natively within the `.raw` file architecture .

The compression engine operates in real-time as the matrix is solved, utilizing the `plotwinsize` parameter, which defaults to 300 data points . Rather than saving every computed integration step, the algorithm buffers up to `plotwinsize` sequential data points. It mathematically computes a linear or quadratic vector intersecting the absolute start and end points of the evaluation window. If the intermediate data points fall within the error bounds dictated by the specific compression tolerances (`plotreltol` = 0.0025, `plotvntol` = 10 $\mu$V, and `plotabstol` = 1 nA), the intermediate points are permanently discarded, and only the defining endpoints are written to the binary `.raw` file . This technique can reliably yield a 50x reduction in file size without visible degradation to macroscopic waveform inspection .

However, for high-resolution post-processing—such as Fast Fourier Transforms (FFT) or Total Harmonic Distortion (THD) calculations—this lossy compression introduces severe quantization noise and artificial spectral artifacts. To perform rigorous harmonic analysis, compression must be completely disabled by injecting the following SPICE directive into the netlist:

```spice
.options plotwinsize=0
```

Furthermore, by default, dependent variables in the raw file are stored as single-precision floating-point numbers to conserve disk space. If the required dynamic range of the analysis exceeds this format, the user can force pure 64-bit double precision across all saved variables by invoking:

```spice
.options numdgt=7
```

When the `numdgt` parameter is set to any integer greater than 6, LTspice automatically elevates the data serialization protocol to double precision, ensuring that minuscule harmonic artifacts or microvolt-level perturbations are not permanently masked by binary truncation noise .

## Chapter 9: The GUI, Macros, and Directory Hierarchies

LTspice 24 and 26 introduce strict modernization protocols to file management and directory parsing, a critical architectural evolution for ensuring model portability across large engineering teams. Historically, in LTspice IV and XVII, users frequently modified intrinsic ADI libraries directly, leading to catastrophic merge conflicts during software updates. In LTspice 24/26, intrinsic standard libraries (such as `standard.dio` and `standard.mos`) are housed securely in `%localappdata%\LTspice\Lib\cmp\` and are aggressively overwritten during software updates .

To inject third-party macro-models (`.subckt`), behavioral models, or custom schematic symbols (`.asy`), the engine now mandates a strict user directory hierarchy, defaulting to the `Documents\LTspice` path . When LTspice parses a netlist for a symbol or library definition, it executes a mathematically prioritized recursive search across the file system:

| Search Priority | Directory Target | Description |
| :--- | :--- | :--- |
| 1 (Highest) | Schematic Directory | The local folder containing the executing `.asc` file . |
| 2 | `Documents\LTspice` | The designated repository for user files and custom discrete devices (`user.dio`, `user.mos`) . |
| 3 | Settings > Search Paths | Explicit paths defined globally in the user control panel . |
| 4 (Lowest) | `%localappdata%\LTspice` | The intrinsic ADI library; parsed last to allow user overrides . |

A monumental feature formalized in the LTspice 24.1 update is the native implementation of the `.savestate` and `.loadstate` directives . For highly complex switched-mode power supplies or chaotic systems, the initial start-up transient may take tens of hours of CPU time to reach a steady-state condition. The directive:

```spice
.savestate my_regulator_state.ssf time=10m
```

instructs the engine to dump the exact mathematical state of the entire MNA matrix, all reactive element charges, and instantaneous node voltages to a localized binary file exactly at the 10-millisecond mark. Subsequent parametric sweeps (`.step`) or load-step transient analyses can instantly bypass the initialization sequence using:

```spice
.loadstate my_regulator_state.ssf reset
```

This effectively teleports the solver to the steady-state operating point, resetting the time vector to zero if the `reset` flag is applied, thereby saving exponential computational overhead .

## Chapter 10: Core Engine Limitations and Edge Cases

Despite its peerless mathematical architecture and integration heuristics, the LTspice engine remains fundamentally subject to physical limitations bounded by the IEEE 754 floating-point standard and foundational linear algebra. The numerical dynamic range of a 64-bit double extends broadly from $10^{-308}$ to $10^{308}$, but in practice, attempting to resolve pico-volt nodes operating concurrently with kilo-volt swings leads to catastrophic subtractive cancellation within the LU solver . When subtracting two massive, nearly identical floating-point numbers, the lower-order bits that represent the minute voltage differences are lost to truncation, destroying matrix fidelity.

One of the most persistent and computationally lethal edge cases involves floating node singularities. If a circuit node is completely isolated by ideal capacitors (for instance, an AC-coupled gate drive without a parasitic bleed resistor to ground), the DC admittance matrix row corresponding to that exact node becomes populated entirely by zeros. Attempting to invert this mathematically singular matrix results in an undefined division by zero, immediately crashing the solver and halting simulation . While applying the directive `.options gfloat=1e-12` automatically assigns a minimal leakage path to ground, this can inadvertently skew high-impedance charge-pump simulations by bleeding off critical state charges .

Additionally, in highly resonant $L-C$ circuits (where the quality factor $Q > 10,000$), the default Modified Trap integration may still struggle with truncation error accumulation over millions of integration cycles. In these environments, the local truncation error manifests as a gradual, non-physical amplitude decay or a slight phase shifting of the resonant frequency. In such extreme topological scenarios, the solver's local truncation error limit (`trtol`) must be clamped strictly, and `maxstep` must be explicitly defined in the `.tran` directive to physically prevent the solver from over-accelerating through the high-frequency sinusoidal peaks:

```spice
.tran 0 10m 0 1n
.options trtol=1
```

In conclusion, the LTspice 24/26 simulation engine represents a masterpiece of computational software architecture. By marrying rigorous mathematical derivations of Modified Nodal Analysis with hyper-optimized, cache-aware sparse matrix solvers and the ringing-free Modified Trap integration algorithm, it successfully bypasses the historical pitfalls of legacy SPICE frameworks. Understanding the intricate mechanics of its time-stepping heuristics, direct memory allocation strategies, and convergence fallbacks allows the electronic design architect to wield the engine with absolute mathematical precision, extracting peerless analytical fidelity from the most uncompromising analog and mixed-signal topologies. 



## Sources

- [**indel.etfbl.net** The 40-th Anniversary of the Simulation Program with Integrated](https://www.indel.etfbl.net/2014/resources/Proceedings_2012/xPaper_01.pdf)
- [**analog.com** SPICE Differentiation - Analog Devices](https://www.analog.com/media/en/technical-documentation/technical-articles/x49_en-spice.pdf)
- [**analog.com** LT Journal of Analog Innovation V24N4 - SPICE Differentiation](https://www.analog.com/media/en/technical-documentation/lt-journal-article/ltjournal-v24n4-01-df-spicedifferentiation-mikeengelhardt.pdf)
- [**analog.com** SPICE Differentiation | Analog Devices](https://www.analog.com/en/resources/technical-articles/spice-differentiation.html)
- [**epsilon.ece.gatech.edu** Modeling of realistic on-chip power grid using the FDTD method](https://epsilon.ece.gatech.edu/publications/2002/01032481.pdf)
- [**scribd.com** IEEE Transient Analisis of Power Systems - Solution Technics, Tools](https://www.scribd.com/document/445906405/IEEE-Transient-Analisis-of-Power-Systems-Solution-Technics-Tools-and-Aplications-pdf)
- [**sciopen.com** Electromagnetic Transient Simulations of Very-large-scale Power](https://www.sciopen.com/local/article_pdf/10.17775/CSEEJPES.2025.09070.pdf)
- [**dr.lib.iastate.edu** Transient analysis for symbolic simulation of large scale networks](https://dr.lib.iastate.edu/bitstreams/c1b28c1d-9aa5-44d3-8860-083fd7aac9d2/download)
- [**cseweb.ucsd.edu** The Life of SPICE as a Transient Circuit Simulator - UCSD CSE](https://cseweb.ucsd.edu/~kuan/talk/mtu18/MtuTalk022318.pdf)
- [**ece.iisc.ac.in** HSPICE User Guide: Signal Integrity - ECE, IISc](https://ece.iisc.ac.in/~dipanjan/E8_262/hspice_si.pdf)
- [**scribd.com** LTspice: Advanced Integration Methods | PDF - Scribd](https://www.scribd.com/document/450254440/LTSpice-Numerical-Methods)
- [**researchgate.net** Parallel Sparse Matrix Solution for Circuit Simulation on FPGAs](https://www.researchgate.net/publication/273397513_Parallel_Sparse_Matrix_Solution_for_Circuit_Simulation_on_FPGAs)
- [**kilthub.cmu.edu** ASP - CMU's KiltHub](https://kilthub.cmu.edu/articles/journal_contribution/ASP_an_interactive_APL_circuit_simulation_package/6468356/files/11896907.pdf)
- [**kolegite.com** THE SPICE BOOK](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%B0%D0%BD%D0%B5%D1%82%D0%BE%20%D0%B2%20%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0%D1%82%D0%B0/The%20SPICE%20Book%20by%20Andrei%20Vladimirescu%20%28z-lib.org%29.pdf)
- [**people.engr.tamu.edu** A survey of direct methods for sparse linear systems](https://people.engr.tamu.edu/davis/publications_files/survey_tech_report.pdf)
- [**osti.gov** Basker: A Threaded Sparse LU Factorization Utilizing Hierarchical](https://www.osti.gov/servlets/purl/1332050)
- [**mdpi.com** A SPICE-Oriented Method for Finding Multiple DC Solutions in](https://www.mdpi.com/2076-3417/13/4/2369)
- [**ltspicehelpmanual.azurewebsites.net** Set Simulator Options - Introduction](https://ltspicehelpmanual.azurewebsites.net/options--setsimulatoroptions.htm)
- [**vbn.aau.dk** An LTSpice - MATLAB Interface for Mitigating Convergence](https://vbn.aau.dk/ws/portalfiles/portal/489168449/pkubulus_ltspicematlab_convergence_postprint.pdf)
- [**community.infineon.com** Resolving convergence challenges in LTspice](https://community.infineon.com/t5/Knowledge-Base-Articles/Resolving-convergence-challenges-in-LTspice/ta-p/1053215)
- [**arxiv.org** Reliable SPICE Simulations of Memristors, Memcapacitors ... - arXiv](https://arxiv.org/pdf/1307.2717)
- [**eprints.whiterose.ac.uk** Pseudo adjoint optimization: harnessing the solution curve for](https://eprints.whiterose.ac.uk/id/eprint/227184/1/draft.pdf)
- [**ssslab.cn** Adaptive Stepping PTA for DC Analysis Based on Reinforcement](https://www.ssslab.cn/assets/papers/2022-dong-PTA.pdf)
- [**ltwiki.org** Compression - LTwiki](https://ltwiki.org/LTspiceHelpXVII/LTspiceHelp/html/Compression.htm)
- [**ltspicehelpmanual.azurewebsites.net** Compression - Introduction](https://ltspicehelpmanual.azurewebsites.net/compression.htm)
- [**agnd.net** LTspice - agnd.net](https://agnd.net/valpo/341/LTspiceHelpXVII.pdf)
- [**ez.analog.com** LTSpice .raw data format - Q&A - EngineerZone - Analog Devices](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/107457/ltspice-raw-data-format)
- [**ieee.li** Getting the Most from LTspice (and a Quick Look at LTpowerCAD)](https://www.ieee.li/pdf/viewgraphs/getting-the-most-from-ltspice.pdf)
- [**groups.io** LTspice@groups.io | Understanding user file locations and structure.](https://groups.io/g/LTspice/topic/understanding_user_file/111227407)
- [**ez.analog.com** What's New in LTspice 24.1 - FAQs/Docs - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs/FD561/what-s-new-in-ltspice-24-1)
- [**scribd.com** ltspice-powertools | PDF | Analog Devices | Analog Signal - Scribd](https://www.scribd.com/document/1060871934/ltspice-powertools)
- [**ltspicehelpmanual.azurewebsites.net** Operation - Introduction](https://ltspicehelpmanual.azurewebsites.net/operation.htm)
- [**fscdn.rohm.com** How to Use LTspice Models - ROHM Semiconductor](https://fscdn.rohm.com/en/products/databook/applinote/common/how_to_use_ltspice_models_an-e.pdf)
- [**ez.analog.com** 24.1.9 - possible problems with lib path / locating model sub - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/597084/24-1-9---possible-problems-with-lib-path-locating-model-sub)
- [**electronics.stackexchange.com** LTspice: putting symbol files in "sub folders"](https://electronics.stackexchange.com/questions/601250/ltspice-putting-symbol-files-in-sub-folders)
- [**ez.analog.com** LTsîce 24.1.1 Label Net name : Forbiden caracter "*", LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/592300/ltsice-24-1-1-label-net-name-forbiden-caracter-ltspice-control-library)
- [**ez.analog.com** .lib library not found - Q&A - LTspice - EngineerZone - Analog Devices](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/604481/lib-library-not-found)
- [**ez.analog.com** Latest Download and Release Notes - FAQs/Docs - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs)
- [**ltspicehelpmanual.azurewebsites.net** .INCLUDE — Include Another File - Introduction](https://ltspicehelpmanual.azurewebsites.net/include--includeanotherfile.htm?agt=index)
- [**scribd.com** LTspice Commands and Shortcuts Guide | PDF | Spice - Scribd](https://www.scribd.com/document/858256355/LT-Spice-keyboard-shortcuts)
- [**digipres.org** All known extensions - DigiPres.org](https://www.digipres.org/formats/extensions/)
- [**ngspice.sourceforge.io** ngspice-44-manual.pdf](https://ngspice.sourceforge.io/docs/ngspice-44-manual.pdf)
- [**sourceforge.net** Mismatch at 2nd simulation points - SourceForge](https://sourceforge.net/p/ngspice/discussion/133842/thread/4e1c723f/)
- [**groups.io** LTspice@groups.io | Spice Settings - Could someone shed some](https://groups.io/g/LTspice/topic/spice_settings_could/50162640)
- [**groups.io** LTSpice and Christophe Basso's book - help request - Groups.io](https://groups.io/g/LTspice/topic/ltspice_and_christophe/50190076)
- [**groups.io** raw File format - LTspice - Groups.io](https://groups.io/g/LTspice/topic/raw_file_format/50232221)
- [**spicelib.readthedocs.io** RAW File Structure - spicelib documentation](https://spicelib.readthedocs.io/en/latest/varia/raw_file.html)
- [**groups.io** Reading an LTSpice .RAW file - Groups.io](https://groups.io/g/LTspice/topic/reading_an_ltspice_raw_file/50203395)
- [**ez.analog.com** About LTspice RAW file format - EngineerZone - Analog Devices](https://ez.analog.com/rf/f/q-a/91365/about-ltspice-raw-file-format)
- [**mathworks.com** Fast Import of Compressed Binary .RAW Files Created with LTspice](https://www.mathworks.com/matlabcentral/fileexchange/23394-fast-import-of-compressed-binary-raw-files-created-with-ltspice-circuit-simulator?s_tid=FX_rc2_behav)
- [**youtube.com** Raw data format of transient simulation results from LTspice - YouTube](https://www.youtube.com/watch?v=YIIWFDiZvCE)
- [**jart.icat.unam.mx** apure nodal-analysis method suitable for analog circuits - using](https://jart.icat.unam.mx/index.php/jart/article/view/608/604)
- [**researchgate.net** Sparse lu factorization of circuit simulation matrices - ResearchGate](https://www.researchgate.net/publication/228737226_Sparse_lu_factorization_of_circuit_simulation_matrices)
- [**epubs.siam.org** Sparse Partial Pivoting in Time Proportional to Arithmetic Operations](https://epubs.siam.org/doi/10.1137/0909058)
- [**eprints.soton.ac.uk** Parallel Sparse Matrix Solution for Circuit Simulation on FPGAs](https://eprints.soton.ac.uk/364713/1/paper.pdf)
- [**web.engr.oregonstate.edu** A Historical Review of Circuit Simulation](https://web.engr.oregonstate.edu/~karti/ece521/dop.pdf)
- [**rle.mit.edu** Reducing the parallel Solution Time of Sparse Circuit ... - MIT RLE](https://www.rle.mit.edu/cpg/publications/pub86.pdf)
- [**github.com** Fortran-code-on-GitHub/README.md at main](https://github.com/Beliavsky/Fortran-code-on-GitHub/blob/main/README.md)
- [**docs.lib.purdue.edu** Content Posted in 2011 | Purdue e-Pubs](https://docs.lib.purdue.edu/2011.html)
- [**mdpi.com** A Systematic Taxonomy and Comparative Analysis of Mixed-Signal](https://www.mdpi.com/2079-9292/15/8/1687)
- [**patsnap.com** Machine Learning in TCAD Simulation Convergence - Patsnap](https://www.patsnap.com/resources/blog/articles/machine-learning-fixes-tcad-convergence-with-122000x-speed/)
- [**patsnap.com** Machine learning fixes TCAD simulation convergence issues](https://www.patsnap.com/de/resources/blog/articles/machine-learning-fixes-tcad-simulation-convergence-issues/)
- [**ez.analog.com** Cannot observe supercapacitor discharge cycle in transient simulation](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/601255/cannot-observe-supercapacitor-discharge-cycle-in-transient-simulation)
- [**researchgate.net** Overview of SPICE-like circuit simulation algorithms - ResearchGate](https://www.researchgate.net/publication/3348837_Overview_of_SPICE-like_circuit_simulation_algorithms)
- [**pmc.ncbi.nlm.nih.gov** SPICE Implementation of the Dynamic Memdiode Model for Bipolar](https://pmc.ncbi.nlm.nih.gov/articles/PMC8874538/)
- [**epc-co.com** Circuit Simulation Using EPC Device Models](https://epc-co.com/epc/portals/0/epc/documents/product-training/circuit_simulations_using_spice.pdf)
- [**e2e.ti.com** Simulation, hardware & system design tools - TI E2E support forums](https://e2e.ti.com/support/tools/simulation-hardware-system-design-tools-group/sim-hw-system-design/f/simulation-hardware-system-design-tools-forum/435285/how-do-i-understand-and-control-the-size-of-time-stepping-when-the-defaults-work-poorly-time-steps-are-too-large-to-simulate-circuit-well)
- [**groups.io** Please tell me about the binary format structure of .raw file - Groups.io](https://groups.io/g/LTspice/topic/please_tell_me_about_the/50202511)
- [**studocu.vn** LTspice 26 Keyboard Shortcuts Guide](https://www.studocu.vn/vn/document/dai-hoc-kinh-te-quoc-dan/kinh-te-quoc-te/ltspice-26-keyboard-shortcuts-guide/158811326)
- [**scribd.com** Ltspice Keyboard Shortcuts | PDF | Cursor (User Interface) - Scribd](https://www.scribd.com/document/1056790960/Ltspice-Keyboard-Shortcuts)
- [**analog.com** ltspice-keyboard-shortcuts.pdf - Analog Devices](https://www.analog.com/media/en/news-marketing-collateral/solutions-bulletins-brochures/ltspice-keyboard-shortcuts.pdf?modelType=spice-models)
- [**simetrix.co.uk** SIMETRIX SIMULATOR REFERENCE MANUAL](https://www.simetrix.co.uk/Files/manuals/9.3/SimulatorReference.pdf)
- [**engineering.upenn.edu** PSpice Reference Guide - Penn Engineering](https://www.engineering.upenn.edu/~jan/spice/PSpice_ReferenceguideOrCAD.pdf)
- [**unm.edu** T-Spice 14 User Guide—Contents - The University of New Mexico](https://www.unm.edu/~pzarkesh/ECE520/tspice.pdf)
