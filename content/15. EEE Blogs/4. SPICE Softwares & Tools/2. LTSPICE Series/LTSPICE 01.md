# The Architecture and Simulation Engine of LTspice

## Introduction

Electronic Design Automation (EDA) serves as the foundational bedrock of modern semiconductor and hardware engineering, providing the indispensable capability to predict the physical behavior of complex circuits before fabrication. At the theoretical and computational core of this discipline lies the circuit simulator, an algorithmic engine tasked with predicting the non-linear behavior of interconnected electronic components under transient, alternating current, and direct current stimuli. Since its inception, the Simulation Program with Integrated Circuit Emphasis (SPICE) has functioned as the de facto academic and industrial standard for this purpose. However, standard Berkeley SPICE and its direct commercial derivatives have historically struggled with the extreme non-linearities, stiff differential equations, and high-frequency harmonic content inherent in Switch-Mode Power Supplies (SMPS) and modern high-speed mixed-signal System-on-Chip (SoC) designs.

LTspice, originally conceived as SwitcherCAD and developed by Linear Technology (subsequently integrated into Analog Devices), represents a radical architectural departure from legacy SPICE implementations . It is not merely a derivative of the Berkeley SPICE3f5 codebase; rather, it is a proprietary, ground-up rewrite of the simulation engine specifically optimized to resolve the catastrophic convergence failures and excruciatingly slow execution times associated with switching regulators and highly stiff network matrices . Over the decades, LTspice has evolved into a hyper-optimized, multithreaded, and hardware-vector-accelerated computational engine capable of simulating complex analog networks containing tens of thousands of active devices with unprecedented fidelity.

The fundamental mathematical objective of the LTspice engine is to solve a system of non-linear Differential Algebraic Equations (DAEs) formulated via Modified Nodal Analysis (MNA) . This overarching system can be generalized mathematically as:

$F(x(t), \dot{x}(t), t) = 0$

In this generalized formulation, $x(t)$ represents the vector of unknown node voltages and branch currents, $\dot{x}(t)$ is its time derivative representing the dynamic behavior of energy-storage elements, and $t$ represents continuous time. To resolve this continuous-time DAE system into a discrete numerical solution, the engine must perform three nested, highly interdependent computational operations. First, it must apply a numerical integration algorithm (such as Trapezoidal or Gear) to discretize time and approximate the derivative $\dot{x}(t)$. Second, it must utilize Newton-Raphson (NR) iterative methods to linearize the non-linear device equations at each discrete time step . Third, it must perform sparse LU decomposition to solve the resulting localized linear system $A \cdot x = b$ at every single iteration until convergence criteria are satisfied .

This exhaustive technical report deconstructs the latest LTspice 26 architecture. It rigorously dissects the engine's approach to Modified Nodal Analysis, numerical integration, sparse matrix factorization, dynamic memory allocation, and advanced convergence algorithms. By examining the transition to 64-bit and ARM64 instruction set architectures, the implementation of Single Instruction Multiple Data (SIMD) vectorization, and proprietary solver bifurcations, this document serves as a definitive architectural reference for the internal mechanics of the LTspice simulation engine.

## Chapter 1: History and Evolution of SPICE to LTspice 26

### 1.1 The Genesis of SPICE and the Discontinuity Crisis

To comprehensively understand the architectural decisions embedded within the modern LTspice 26 engine, one must first examine the mathematical and algorithmic limitations of its predecessors. The original SPICE1 program, developed at the University of California, Berkeley in the early 1970s, relied on classical Nodal Analysis. This initial formulation possessed severe topological limitations, primarily its inability to accommodate floating ideal voltage sources, inductors, or current-controlled components. The subsequent release of SPICE2 introduced Modified Nodal Analysis (MNA), allowing for the integration of voltage-defined components by appending branch currents as explicit unknown variables in the matrix formulation . SPICE3 later transitioned the codebase from Fortran to C, introducing a more modular, albeit highly imperfect, software architecture.

However, the Berkeley SPICE3f5 engine, which forms the basis for numerous commercial pay-for-SPICE implementations (including early versions of PSpice), was plagued by inherent mathematical flaws in its fundamental semiconductor models . Specifically, the empirical models used for diodes, Bipolar Junction Transistors (BJTs), and Metal-Oxide-Semiconductor Field-Effect Transistors (MOSFETs) were often formulated with discontinuous current-voltage (I-V) or capacitance-voltage (C-V) curves. A notable historical example is the Meyer capacitance model, which failed to conserve charge and exhibited severe discontinuities across the transistor operating regions. 

The Newton-Raphson algorithm, the primary multidimensional root-finding method utilized in all SPICE engines to solve non-linear DAEs, demands continuous first derivatives to ensure mathematical convergence . The Newton-Raphson update equation is defined iteratively as:

$x^{(k+1)} = x^{(k)} - \left[ J(x^{(k)}) \right]^{-1} F(x^{(k)})$

Where $J(x^{(k)})$ is the Jacobian matrix (the matrix of all first-order partial derivatives) evaluated at the current state vector guess $x^{(k)}$. If the device models contain slope discontinuities (a lack of $C^1$ continuity), the Jacobian determinant can abruptly collapse to zero, rendering the matrix singular. Alternatively, the algorithm may oscillate infinitely between two adjacent states across the discontinuity boundary, causing the simulation to halt with a "Timestep too small" error .

### 1.2 The SwitcherCAD Paradigm: Enforcing Mathematical Continuity

LTspice was initially conceptualized and developed under the moniker SwitcherCAD to support the design and verification of monolithic switching regulators manufactured by Linear Technology. Switch-Mode Power Supply (SMPS) circuits are notoriously "stiff" from a mathematical perspective, meaning their operation involves widely separated time constants that must be resolved simultaneously. A standard switching regulator might exhibit switching transients on the order of hundreds of megahertz (requiring sub-nanosecond integration timesteps to resolve the edge transitions accurately) while simultaneously possessing a thermal or feedback loop time constant on the order of tens of milliseconds.

Standard Berkeley SPICE simulators handle this stiffness exceptionally poorly, as the rapid traversal across non-linear device regions constantly triggers the aforementioned slope discontinuities . The Principal Architects of LTspice recognized that algorithmic robustness and convergence reliability depend strictly on two unyielding physical and mathematical constraints. First, all circuit element I-V and C-V transfer functions must be strictly continuous in both absolute value and slope under all conceivable bias conditions . Second, all non-linear elements must be bypassed with minute parasitic capacitances; this ensures that the discrete solution from the previous timestep remains a highly accurate seed for the Newton-Raphson iteration of the current timestep, smoothing the transition matrix .

To satisfy these constraints, LTspice entirely rewrote the core semiconductor device equations. It completely eliminated the non-physical piecewise-linear discontinuities present in Berkeley SPICE by replacing abrupt regional transitions with continuously differentiable smoothing functions, frequently employing hyperbolic tangents, logarithmic exponentials, and customized spline interpolations . 

Consider the fundamental representation of a diode in a legacy SPICE netlist compared to its execution in LTspice. In a standard legacy netlist, one might observe convergence failures during a simple DC voltage sweep due to abrupt I-V transitions as the junction transitions from reverse bias to forward conduction:

```spice
* Legacy SPICE Diode Discontinuity Example
* Generates Jacobian singularities near 0V crossing
V1 N001 0 0
D1 N001 0 D
.dc V1 -0.3 -0.2 2u
.probe
.model D D(Is=10n)
.end
```

In commercial derivatives like PSpice, this diode model exhibits a discontinuous first derivative in both value and slope . LTspice's engine intercepts this primitive model syntax and maps it to its proprietary, internally smoothed junction formulation, ensuring that the Jacobian determinant maintains numeric stability through the zero-crossing, thereby providing a numerical proof that the correct, continuous solution of the circuit is found .

### 1.3 The 64-Bit Transition and Floating-Point Precision Algorithms

As VLSI (Very Large Scale Integration) processes advanced and board-level simulations incorporated massively parallel architectures, the memory requirements for EDA tools expanded exponentially. The historical 32-bit memory address limit, which restricted software to typically 2 GB to 4 GB of addressable RAM per process, became a hard computational bottleneck. A 32-bit pointer integer simply cannot allocate the massive, contiguous memory blocks required to store the sparse LU factorization trees of a netlist containing millions of nodes and parasitic elements. Consequently, LTspice transitioned its core architecture to a native 64-bit memory model, effectively eliminating the 4 GB RAM barrier and permitting matrix dimensions limited solely by the physical host memory available to the operating system .

Beyond the expansion of memory addressing, LTspice introduces a critical, defining bifurcation in its mathematical pipeline: the dynamic choice of floating-point arithmetic precision in its core matrix compilers. LTspice incorporates two entirely distinct sparse matrix solvers: the Normal Solver and the Alternate Solver .

| Architectural Feature | Normal Solver | Alternate Solver |
| :--- | :--- | :--- |
| **Underlying Data Type** | 64-bit Double Precision (IEEE 754) | 80-bit Extended Precision (x87 FPU) |
| **Mantissa (Fraction) Size** | 53 bits (52 explicit + 1 implicit) | 64 bits explicit |
| **Relative Machine Precision** | $\approx 1.11 \times 10^{-16}$ | $\approx 1.08 \times 10^{-19}$ |
| **Simulation Speed Penalty** | Baseline ($1\times$) | Typically $0.5\times$ to $0.7\times$ speed  |
| **Internal Accuracy Scaling** | High Precision | $1,000\times$ greater internal precision  |
| **Primary Engineering Use Case** | Standard SMPS, digital logic, general AC/DC | High dynamic range, extremely stiff matrices  |
| **CPU Instruction Support (x86)** | SSE2, AVX, AVX2, AVX-512 Accelerated | Legacy x87 FPU Stack / Unvectorized |
| **ARM64 Native Support** | Fully Supported (NEON Accelerated) | Emulated/Unsupported (Requires x87 translation)  |

The Normal solver strictly utilizes standard 64-bit double-precision floating-point arithmetic compliant with the IEEE 754 specification . This format dedicates 1 bit for the sign, 11 bits for the exponent, and 52 bits for the fractional mantissa, yielding approximately 15 to 17 significant decimal digits of precision. For the vast majority of SMPS and analog networks, this precision is entirely sufficient. Crucially, 64-bit floats align perfectly with modern hardware architectures, allowing the solver to heavily utilize SIMD (Single Instruction, Multiple Data) instructions to process multiple matrix elements concurrently, yielding exceptional simulation speeds .

Conversely, in highly stiff circuits—such as those containing macroscopic high-voltage nodes directly coupled to microscopic, low-voltage precision analog measurement nodes—the condition number of the Jacobian matrix, denoted as $\kappa(J)$, becomes exceedingly large. The condition number is defined as:

$\kappa(J) = \| J \| \cdot \| J^{-1} \|$

When $\kappa(J)$ approaches the inverse of the machine epsilon ($1 / \epsilon_{\text{mach}}$), the successive LU factorization steps suffer from catastrophic roundoff error . To combat this numerical instability, the Alternate Solver utilizes 80-bit extended precision floating-point numbers . This historical format, native to the x86 x87 Floating-Point Unit (FPU), allocates 1 sign bit, 15 exponent bits, and 64 mantissa bits, producing roughly 19 significant decimal digits. This thousand-fold theoretical increase in internal precision drastically reduces the cumulative roundoff error generated during the billions of multiply-accumulate operations required for the matrix inversion . It is specifically designed to resolve topologies where microvolt-level differentials (e.g., $6.5 \mu V$) are superimposed on kilovolt-level common-mode voltages (e.g., $325 V$), which would normally be truncated into noise by a 64-bit solver . 

Because 80-bit extended precision floats do not easily align into modern 128-bit or 256-bit SIMD vector registers, the Alternate Solver must process calculations sequentially through the x87 stack, resulting in a substantial speed penalty . To force the LTspice engine to invoke the Alternate solver, the following directive must be declared prior to netlist parsing:

```spice
.options solver=alt
```

Furthermore, resolving these microscopic differentials visually requires expanding the output file precision. By default, LTspice uses a proprietary compressed single-precision binary format for its `.raw` waveform files to conserve disk space. To ensure the `.raw` file captures the Alternate solver's extended precision rather than truncating it back to standard precision upon save, the user must explicitly elevate the data export parameter:

```spice
.options numdgt=15
```

Setting `numdgt > 6` forces the LTspice waveform writer to save dependent variable data in uncompressed double-precision binary format, allowing the Waveform Viewer to accurately render micro-volt perturbations .

### 1.4 Multithreading Architecture and Matrix Factorization

A defining and proprietary characteristic of the modern LTspice architecture is its approach to multi-core processing and symmetric multiprocessing (SMP). In any SPICE simulation, the computational workload is divided into two primary, cyclical phases executed during each Newton-Raphson iteration:

1.  **Model Evaluation Phase (Device Load):** The engine calculates the non-linear equations for every physical device in the netlist to generate the localized conductances and terminal currents. These localized values are then mapped and "stamped" into the global Modified Nodal Analysis Jacobian matrix and the Right-Hand Side (RHS) current vector .
2.  **Matrix Solution Phase:** The engine performs a highly optimized sparse LU factorization ($A = L \cdot U$) followed by forward and backward substitution algorithms to solve the linearized algebraic system for the unknown node voltages .

The Model Evaluation phase is inherently parallelizable. Because device equations (such as computing the complex charge-conserving equations of a BSIM4 submicron MOSFET) are largely independent of one another at a given timestep, the LTspice engine efficiently partitions the netlist components across all available logical CPU threads.

However, the Matrix Solution phase represents a severe, historical bottleneck that is highly resistant to multithreading. SPICE matrices are hyper-sparse, often containing greater than 99% zero entries, and are highly asymmetric . Performing a sparse LU decomposition involves traversing a strict data dependency graph; the factorization and elimination of a subsequent column depend absolutely on the fill-in elements generated by the factorization of previous columns .

To overcome this, LTspice eschews legacy right-looking algorithms in favor of highly optimized sparse factorization routines akin to the Gilbert-Peierls algorithm and KLU methodologies tailored specifically for circuit simulation . The global MNA matrix is first pre-ordered to minimize matrix fill-in using heuristics such as Approximate Minimum Degree (AMD) ordering and is permuted into a Block Triangular Form (BTF).

For a sparse matrix $A$, the factorization engine seeks to compute the lower triangular matrix $L$ and the upper triangular matrix $U$:

$P A Q = L U$

Where $P$ and $Q$ represent row and column permutation matrices determined via localized Markowitz pivoting strategies. Markowitz pivoting minimizes the operation count by dynamically selecting pivot elements that possess the fewest non-zero entries in their respective rows and columns, balancing numerical stability against fill-in proliferation .

Within this framework, the LTspice multithreading scheduler isolates independent sub-graphs within the LU dependency tree. By constructing a Directed Acyclic Graph (DAG) of column dependencies, the engine identifies distinct, disjointed matrix branches that do not share immediate fill-in dependencies . This allows distinct CPU threads to factorize independent submatrices simultaneously. The threads execute asynchronously until they encounter a shared parent node in the elimination tree, at which point they synchronize to resolve the dense frontal matrices. Despite these massive algorithmic improvements, sparse matrix solvers remain heavily memory-bandwidth bound due to the non-sequential, random-access nature of retrieving non-zero elements. Therefore, LTspice's memory allocation architecture is meticulously cache-aware, ensuring that matrix pointers and index arrays remain strictly localized within the CPU's L2 and L3 hardware caches to prevent devastating pipeline memory stalls.

### 1.5 The Advent of LTspice 26 and ARM64 Architecture

The release of LTspice version 26 marks a watershed moment in the software's architectural history, primarily due to the introduction of native ARM64 (AArch64) support . As the global semiconductor and computing industries witness a massive paradigm shift toward ARM-based Instruction Set Architectures in desktop and workstation computing (exemplified by Apple Silicon M-series processors and Qualcomm Snapdragon X Elite for Windows 11 ARM64), porting a heavily x86-assembly-optimized SPICE engine to an Advanced RISC Architecture required a complete overhaul of the engine's vectorization backend.

#### 1.5.1 SIMD on x86 versus ARM64 NEON Integration

In legacy x86 architectures, LTspice relied exhaustively on SSE2, AVX, and AVX-512 intrinsic instructions to perform SIMD operations. SIMD allows the CPU's Arithmetic Logic Unit (ALU) to execute a single mathematical operation (e.g., a floating-point multiply-add) on a contiguous array of data simultaneously, rather than sequentially.

In the ARM64 architecture, this same parallel execution is achieved via the NEON Advanced SIMD extension . NEON introduces 32 architectural 128-bit vector registers (designated `v0` through `v31`). A single 128-bit NEON register can accommodate four 32-bit single-precision floating-point numbers (`float32x4_t`) or two 64-bit double-precision floating-point numbers (`float64x2_t`) .

During the mathematically dense Model Evaluation phase of a transient simulation, LTspice 26 directly leverages C-level NEON intrinsics to compute independent device equations concurrently. Consider the evaluation of a massive resistive grid where thousands of branch currents $i = G \cdot v$ must be calculated. A standard scalar implementation processes a single branch iteration per clock cycle. Conversely, the ARM64 NEON vectorized implementation processes two 64-bit double-precision branch equations simultaneously, effectively halving the instruction count and maximizing the FPU pipeline utilization.

*Algorithmic Pseudocode for Vectorized Device Evaluation (ARM64 NEON Implementation):*
```c
#include <arm_neon.h>

// Evaluate 2 double-precision device conductances simultaneously via NEON
void evaluate_conductances_neon(double* v_diff, double* G, double* i_out, int num_devices) {
    // Loop unrolled for 128-bit vector chunks
    for (int i = 0; i < num_devices; i += 2) {
        // Load two 64-bit voltage differences into a 128-bit NEON register
        float64x2_t v_vec = vld1q_f64(&v_diff[i]);
        
        // Load two 64-bit conductances into a second 128-bit NEON register
        float64x2_t g_vec = vld1q_f64(&G[i]);
        
        // Perform fused vectorized hardware multiply: i_vec = v_vec * g_vec
        float64x2_t i_vec = vmulq_f64(v_vec, g_vec);
        
        // Store the two computed branch currents sequentially back to host memory
        vst1q_f64(&i_out[i], i_vec);
    }
}
```

The transition to ARM64 in LTspice 26 yields profound hardware-specific performance implications . Modern ARM processors possess exceptionally wide memory interfaces and massive unified caches (or heavily integrated on-package LPDDR5 memory). Because sparse matrix solvers are notoriously limited by memory latency and cache miss penalties rather than raw Floating Point Operations Per Second (FLOPS), the ARM64 architecture's high-bandwidth memory subsystem drastically reduces the processor stall time required to fetch sparse matrix pointers during the LU factorization phase.

However, a critical limitation exists within this new paradigm. The `.options solver=alt` directive (the 80-bit extended precision solver) relies exclusively on the legacy x86 x87 floating-point hardware stack. The ARM64 architecture does not support 80-bit extended precision natively; it strictly adheres to either 64-bit double precision or utilizes 128-bit quad precision handled strictly in software logic. Consequently, the Alternate solver is fundamentally incompatible with native hardware execution on ARM64 processors and must either be heavily emulated via costly translation layers or disabled entirely, resulting in severe performance penalties . For this reason, LTspice 26 on ARM64 prioritizes the Normal solver, pushing the boundaries of simulation convergence through algorithmic graph-theory improvements rather than relying on brute-force machine bit precision.

### 1.6 Netlist Execution, Syntax Evolution, and File Hierarchies

LTspice 26 extends beyond a mere computational backend upgrade; it introduces vital structural modifications to how the engine parses netlist syntax and interacts with the host operating system's filesystem. The LTspice parser operates strictly as a two-pass compiler. The first pass evaluates parameter scoping, recursive subcircuit expansion, and mathematical expression evaluation, while the second pass generates the physical topological MNA matrix structure.

#### 1.6.1 Hierarchical Directory and Environment Variable Support

Prior to Version 26, LTspice users were constrained to place third-party `.lib` and `.sub` behavioral models either in the exact same directory as the `.asc` schematic file or in a monolithic, globally defined system library path. This rigid structure made version control integration (e.g., Git) and complex enterprise-level system design extraordinarily cumbersome.

LTspice 26 completely revolutionizes file management by introducing true hierarchical directory support for symbol search paths and schematic parsing . More importantly, the engine's parser now explicitly resolves operating system environment variables directly within the netlist text . This is a critical enhancement for enterprise EDA environments where model libraries are mapped to dynamic network drives or localized continuous integration pipelines.

Command-line execution parameters have been simultaneously enhanced to ingest these dynamic search paths. A typical headless invocation of the LTspice 26 engine designed for an enterprise simulation cluster utilizes the `-I` (Include) switch to map multiple symbol hierarchies dynamically :

```bash
LTspice.exe -b -run -I "C:\Enterprise_Models\Power_Stages" -I "%USERPROFILE%\Custom_Sym" SMPS_Top.net
```

Within the actual netlist, the engine seamlessly resolves directives such as `.inc %MODEL_PATH%\custom_mosfet.lib`, dynamically expanding the environment variable during the first pass parsing phase, preventing hard-coded path breakages . Additionally, LTspice 26 permanently enforces the European numeric syntax format, dictating that the engine always accepts "3k4" notation strictly as 3.4k, removing previous ambiguities in parsing passive component values .

#### 1.6.2 State Saving and Dynamic Parameter Stepping

A major computational bottleneck in evaluating complex power electronics or large-scale phase-locked loops (PLLs) is the simulation "startup" phase. A complex SMPS may require 10 milliseconds of simulated time to stabilize its output voltage and allow all error amplifiers to reach equilibrium. Simulating this startup may consume hours of CPU time, simply for the engineer to analyze a 10-microsecond load step transient occurring at the 10.01 ms mark.

LTspice 26 remedies this vast inefficiency by introducing the `.savestate` and `.loadstate` simulator directives . This sophisticated feature allows the engine to serialize the exact numerical state of the entire MNA matrix—including all node voltages, branch currents, inductor flux linkages, and internal subcircuit operating points—into a highly compressed binary file at a predefined simulation time. Mathematically, it freezes the state vector $x(t_{save})$ and the localized historical derivative vectors required for the backward differentiation formulas (BDF) used in the integration step.

```spice
* Save the full mathematical matrix state exactly at 10ms
.savestate 10m SMPS_steady_state.sst

* In a subsequent simulation, bypass the grueling startup phase entirely:
.loadstate SMPS_steady_state.sst
.tran 0 10.05m 10m
```

Furthermore, the engine now natively supports dynamic string parameters, allowing arbitrary text strings to be passed into subcircuits to dynamically toggle underlying models during a `.step` command execution . This functional addition bridges the historical gap between traditional SPICE and modern Hardware Description Languages (HDLs), enabling programmatic and procedural instantiation of varied component architectures in a single simulation run.

#### 1.6.3 Debugging the Transient Engine

To directly assist Principal Architects and design engineers in diagnosing mathematical stiffness or matrix singularities during failed transient runs, LTspice 26 introduces the highly verbose `.option debugtran` directive . 

When this debug mode is invoked, the engine writes an exhaustive diagnostic algorithmic trail directly to the SPICE Error Log (`.log` file). This trail details the exact Newton-Raphson iteration counts per timestep, identifies the specific semiconductor nodes and non-linear junctions failing to mathematically converge, and logs the real-time local truncation error of the active integration algorithm. This functionality essentially transitions the LTspice engine from an opaque "black box" solver into a transparent mathematical tool. It allows engineers to definitively pinpoint whether simulation convergence failures are the result of local truncation errors (which necessitate a change in the numerical integration method) or due to discontinuous physical model derivatives (which necessitate patching the manufacturer's SPICE model).


## Sources

- [**agnd.net** LTspice - agnd.net](https://agnd.net/valpo/341/LTspiceHelpXVII.pdf)
- [**ema-eda.com** LTSpice vs PSpice: Comparison Guide - EMA Design Automation](https://www.ema-eda.com/ema-resources/blog/ltspice-vs-pspice-comparison-emd/)
- [**en.wikipedia.org** Modified nodal analysis - Wikipedia](https://en.wikipedia.org/wiki/Modified_nodal_analysis)
- [**desi.iteso.mx** The Modified Nodal Analysis (MNA) Method - iteso](https://desi.iteso.mx/erayas/documents/cad_course/lectures/FORMULATION_CIR_EQ/MNA_method.pdf)
- [**spicesharp.github.io** Modified Nodal Analysis](https://spicesharp.github.io/SpiceSharp/articles/custom_components/modified_nodal_analysis.html)
- [**researchgate.net** Parallel Sparse Matrix Solution for Circuit Simulation on FPGAs](https://www.researchgate.net/publication/273397513_Parallel_Sparse_Matrix_Solution_for_Circuit_Simulation_on_FPGAs)
- [**uom.lk** modified nodal analysis](https://uom.lk/sites/default/files/elect/files/ee321s3.3.pdf)
- [**scribd.com** LTspice: Advanced Integration Methods | PDF - Scribd](https://www.scribd.com/document/450254440/LTSpice-Numerical-Methods)
- [**ltwiki.org** SPICE: - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/SPICE_.htm)
- [**groups.io** LTspice@groups.io | Difference of Normal solver and Alternate solver](https://groups.io/g/LTspice/topic/difference_of_normal_solver/50201116)
- [**reddit.com** LTSpice - Accuracy and optimal settings : r/ElectricalEngineering](https://www.reddit.com/r/ElectricalEngineering/comments/1csnz84/ltspice_accuracy_and_optimal_settings/)
- [**ez.analog.com** LTSpice Accuracy - Q&A - EngineerZone - Analog Devices](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/582782/ltspice-accuracy)
- [**ieee.li** Getting the Most from LTspice (and a Quick Look at LTpowerCAD)](https://www.ieee.li/pdf/viewgraphs/getting-the-most-from-ltspice.pdf)
- [**ltwiki.org** Undocumented LTspice - LTwiki](https://ltwiki.org/?title=Undocumented_LTspice)
- [**github.com** Arm Vector Instructions: SVE and NEON - GitHub](https://github.com/NVIDIA/grace-cpu-benchmarking-guide/blob/main/src/developer/vectorization.md)
- [**eevblog.com** SPICE Generates nonsense with near-zero resistor values. - EEVblog](https://www.eevblog.com/forum/chat/spice-generates-nonsense-with-near-zero-resistor-values/)
- [**eprints.soton.ac.uk** Parallel Sparse Matrix Solution for Circuit Simulation on FPGAs](https://eprints.soton.ac.uk/364713/1/paper.pdf)
- [**osti.gov** Basker: A Threaded Sparse LU Factorization Utilizing Hierarchical](https://www.osti.gov/servlets/purl/1332050)
- [**people.engr.tamu.edu** A survey of direct methods for sparse linear systems](https://people.engr.tamu.edu/davis/publications_files/survey_tech_report.pdf)
- [**analog.com** LTspice - Analog Devices](https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html)
- [**ez.analog.com** Latest Download & Release Notes - FAQs/Docs - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs/FD560/latest-download-release-notes)
- [**adaptivesupport.amd.com** NEON intrinsics for SIMD vectorization are by default enabled for](https://adaptivesupport.amd.com/s/question/0D52E000079rKvySAE/neon-intrinsics-for-simd-vectorization-are-by-default-enabled-for-zynq-embedded-aarch64-petalinux?language=en_US)
- [**researchgate.net** (PDF) Use of SIMD Vector Operations to Accelerate Application](https://www.researchgate.net/publication/261272772_Use_of_SIMD_Vector_Operations_to_Accelerate_Application_Code_Performance_on_Low-Powered_ARM_and_Intel_Platforms)
- [**ez.analog.com** Latest Download and Release Notes - FAQs/Docs - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs)
- [**analog.com** ltspice-keyboard-shortcuts.pdf - Analog Devices](https://www.analog.com/media/en/news-marketing-collateral/solutions-bulletins-brochures/ltspice-keyboard-shortcuts.pdf?modelType=spice-models)
- [**spiceman.net** LTspice-Control Panel Setting - Spiceman](https://spiceman.net/ltspice-control-panel-setting/)
- [**embedded.com** LTspice 26: Faster, Smarter Simulation - Embedded](https://www.embedded.com/ltspice-26-faster-smarter-simulation/)
- [**youtube.com** LTspice 26: Faster, Smarter Simulation - YouTube](https://www.youtube.com/watch?v=zCEakRoPHYE)
- [**ez.analog.com** LTSpice v26.0.1 convergence / stability issues after upgrading from](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/602015/ltspice-v26-0-1-convergence-stability-issues-after-upgrading-from-v26-0-0)
- [**ez.analog.com** LTSpice Version Differences - Q&A - EngineerZone - Analog Devices](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/602966/ltspice-version-differences)
- [**facebook.com** LTspice 26: Faster, Smarter Simulation - Facebook](https://www.facebook.com/embeddedcom/posts/ltspice-26-faster-smarter-simulationexplore-improved-simulation-convergence-and-/1519606243460839/)
- [**ltwiki.org** Integration Methods - LTwiki](https://ltwiki.org/files/LTspiceHelp.chm/html/integration_method_issues.htm)
- [**forum.digikey.com** LTspice Tips - Mathematical Integration - DigiKey TechForum](https://forum.digikey.com/t/ltspice-tips-mathematical-integration/13334)
- [**we-online.com** LTspice examples](https://www.we-online.com/files/pdf1/ltspice-examples.pdf)
- [**forum.allaboutcircuits.com** LTspice Integration Method -- Warning! | All About Circuits](https://forum.allaboutcircuits.com/threads/ltspice-integration-method-warning.183216/)
- [**ez.analog.com** How to use modified trap by setting a .option for it? - Q&A - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/571510/how-to-use-modified-trap-by-setting-a-option-for-it)
- [**ni.com** SPICE Simulation Options - NI - National Instruments](https://www.ni.com/en/shop/electronic-test-instrumentation/application-software-for-electronic-test-and-instrumentation-category/what-is-multisim/spice-simulation-fundamentals/spice-simulation-options.html)
- [**groups.io** LTspice Tolerance - Groups.io](https://groups.io/g/LTspice/topic/ltspice_tolerance/106562874)
- [**designers-guide.org** Simulator Options - Designer's Guide Community](https://designers-guide.org/analysis/dg-spice/chA.pdf)
- [**edaboard.com** LTspice .OPTION settings for faster simulations? - EDABoard.com](https://www.edaboard.com/threads/ltspice-option-settings-for-faster-simulations.418266/)
- [**rohmfs-rohm-com-cn.oss-cn-shanghai.aliyuncs.com** How to Use LTspice Models: Tips for Improving Convergence](https://rohmfs-rohm-com-cn.oss-cn-shanghai.aliyuncs.com/en/products/databook/applinote/common/how_to_use_ltspice_models_tips_for_improving_convergence_an-e.pdf)
- [**ecircuitcenter.com** Nodal Analysis - eCircuit Center](https://www.ecircuitcenter.com/SpiceTopics/Nodal%20Analysis/Nodal%20Analysis.htm)
- [**epsilon.ece.gatech.edu** Modified Nodal Analysis Framework](https://epsilon.ece.gatech.edu/publications/2006/04115367.pdf)
- [**note.com** About the MNA Method｜すきまエンジニア - note](https://note.com/sukimaengineer/n/n5f2b4caf65c2?hl=en)
- [**scribd.com** Modified Nodal Analysis in Circuit Simulation | PDF - Scribd](https://www.scribd.com/document/277142543/MNA-Stamp)
- [**ieeexplore.ieee.org** A New Second Order Nonlinear Formulation for Fast-SPICE Circuit](https://ieeexplore.ieee.org/iel7/6287639/10380310/10440347.pdf)
- [**web.engr.oregonstate.edu** ECE 521 - College of Engineering | Oregon State University](https://web.engr.oregonstate.edu/~karti/ece521/Lectures.pdf)
- [**math.libretexts.org** 6.3: Local Versus Global Error - Mathematics LibreTexts](https://math.libretexts.org/Bookshelves/Applied_Mathematics/Numerical_Methods_(Chasnov)/06%3A_Integration/6.03%3A_Local_Versus_Global_Error)
- [**researchgate.net** Overview of SPICE-like circuit simulation algorithms - ResearchGate](https://www.researchgate.net/publication/3348837_Overview_of_SPICE-like_circuit_simulation_algorithms)
- [**cseweb.ucsd.edu** CSE245: Computer-Aided Circuit Simulation and Verification](https://cseweb.ucsd.edu/classes/sp23/cse245-a/slides/letInteg.pdf)
- [**eng.biu.ac.il** Behind the scenes of the SPICE Circuit Simulator](https://www.eng.biu.ac.il/temanad/files/2022/04/Lecture-3-Behind-the-scenes-of-SPICE.pdf)
- [**docs.lib.purdue.edu** A STUDY OF NUMERICAL INTEGRATION TECHNIQUES FOR USE](https://docs.lib.purdue.edu/cgi/viewcontent.cgi?article=1301&context=ecetr)
- [**electronics-lab.com** Trapezoidal - gear - modified trap | Electronics Forums](https://www.electronics-lab.com/forums/threads/trapezoidal-gear-modified-trap.42694/)
- [**ntrs.nasa.gov** NI\SI\ - NASA Technical Reports Server (NTRS)](https://ntrs.nasa.gov/api/citations/19860007475/downloads/19860007475.pdf)
- [**digital-library.theiet.org** Parallel sparse-matrix solution for direct circuit ... - IET Digital Library](https://digital-library.theiet.org/doi/pdf/10.1049/ip-cds%3A19971566?download=true)
- [**rle.mit.edu** Reducing the parallel Solution Time of Sparse Circuit ... - MIT RLE](https://www.rle.mit.edu/cpg/publications/pub86.pdf)
- [**kilthub.cmu.edu** ASP - CMU's KiltHub](https://kilthub.cmu.edu/articles/journal_contribution/ASP_an_interactive_APL_circuit_simulation_package/6468356/files/11896907.pdf)
- [**epubs.siam.org** An Asynchronous Parallel Supernodal Algorithm for Sparse](https://epubs.siam.org/doi/10.1137/S0895479897317685)
- [**technav.ieee.org** Circuit analysis | IEEE Technology Navigator](https://technav.ieee.org/topic/circuit-analysis/)
- [**technav.ieee.org** Circuit analysis computing | IEEE Technology Navigator](https://technav.ieee.org/topic/circuit-analysis-computing/)
- [**mdpi.com** A Systematic Taxonomy and Comparative Analysis of Mixed-Signal](https://www.mdpi.com/2079-9292/15/8/1687)
- [**researchgate.net** Modified nodal analysis: An essential addition to electrical circuit](https://www.researchgate.net/publication/3406448_Modified_nodal_analysis_An_essential_addition_to_electrical_circuit_theory_and_analysis)
- [**etd.auburn.edu** SPICE model implementation of a quantum phase-slip junction](https://etd.auburn.edu/bitstream/handle/10415/4742/Thesis_final_Uday%20Goteti.pdf?sequence=2&isAllowed=y)
- [**researchgate.net** The modified nodal approach to network analysis - ResearchGate](https://www.researchgate.net/publication/3184759_The_modified_nodal_approach_to_network_analysis)
- [**osti.gov** Benefits of Sparse Tableau over Nodal Admittance Formulation for](https://www.osti.gov/servlets/purl/1799061)
- [**ee.iitb.ac.in** Techniques for circuit simulation - Electrical Engineering](https://www.ee.iitb.ac.in/~sequel/circuit_sim_1.pdf)
- [**ez.analog.com** LTspice solver selection - Q&A - EngineerZone](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/538781/ltspice-solver-selection)
- [**ltwiki.org** Fast Access File Format - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/Fast_Access_File_Format.htm)
- [**spiceman.net** LTspice -- Limit the Quantity of Saved Data - Spiceman](https://spiceman.net/ltspice-command-save/)
- [**ltwiki.org** Exporting Waveform Data - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/Exporting_Waveform_Data.htm)
- [**groups.io** LTspice@groups.io | Exporting Waveform as Text](https://groups.io/g/LTspice/topic/exporting_waveform_as_text/82576400)
- [**analog.com** LTspice: Plotting a Parameter Against Something Other Than Time](https://www.analog.com/en/resources/technical-articles/ltspice-plotting-a-parameter-against-something-other-than-time-e-g-resistance.html)
- [**gist.github.com** ltspice options for high precision simulation/data export - GitHub Gist](https://gist.github.com/turingbirds/c90672c3b126d0d5f37f90494d5057cb)
- [**analog.com** LTspice: Importing & Exporting PWL Data - Analog Devices](https://www.analog.com/en/resources/technical-articles/ltspice-importing-exporting-pwl-data.html)
- [**youtube.com** Saving Schematics & Graphs | LTspice Turorial | Khetz Tutorials](https://www.youtube.com/watch?v=Q6H7paz4850)
- [**electronics.stackexchange.com** Is there a spice directive to export waveform data in LTspice?](https://electronics.stackexchange.com/questions/124666/is-there-a-spice-directive-to-export-waveform-data-in-ltspice)
- [**youtube.com** LT Spice Tutorial - EP 3 - How to save data to Excel file - YouTube](https://www.youtube.com/watch?v=PF_g-ICggwU)
- [**analog.com** LTspice® How-to: Using the .STEP Directive to Perform Repeated](https://www.analog.com/en/resources/technical-articles/ltspice-using-the-step-command-to-perform-repeated-analysis.html)
- [**groups.io** LTspice@groups.io | Pseudo transient analysis - endless :(](https://groups.io/g/LTspice/topic/pseudo_transient_analysis/98021634)
- [**courses.egr.uh.edu** LTSpice Basic Tutorial](https://courses.egr.uh.edu/ECE/ECE3355/Honors%20Electronics%20LTSpice/LTSpice%20Tutorials/LTspice_Basics.pdf)
- [**spiceman.net** LTspice-Transient Analysis(.tran) - Spiceman](https://spiceman.net/ltspice-transient-analysis/)
- [**cde.nus.edu.sg** LTSpice tutorial](https://cde.nus.edu.sg/ece/wp-content/uploads/sites/3/2024/09/LTSpicetutorial.pdf)
- [**allaboutcircuits.com** How to Perform Transient Analysis and Noise Source Simulation](https://www.allaboutcircuits.com/technical-articles/how-to-perform-transient-analysis-noise-simulation-LTspice/)
- [**ltwiki.org** .OPTIONS -- Set simulator options - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_OPTIONS_Set_simulator_options.htm)
- [**eecg.utoronto.ca** Beginner's Guide to LTSpice Pages 1&2 Commands & techniques](https://www.eecg.utoronto.ca/~ali/spice/LTspice/LTSpiceShortGuide.pdf)
- [**youtube.com** LTspice Basics Part Three: Transient Simulations - YouTube](https://www.youtube.com/watch?v=1rUBBHD8XyI)
- [**scribd.com** Use of SIMD Vector Operations To Accelerate Application Code](https://www.scribd.com/document/1042630204/a)
- [**developer.arm.com** How to Use Arm SIMD to Achieve Huge Performance Gains](https://developer.arm.com/servers-and-cloud-computing/arm-simd)
- [**youtube.com** SIMD Everywhere Optimization from ARM NEON to RISC-V Vector](https://www.youtube.com/watch?v=puvnghbIAV4)
- [**blog.yiningkarlli.com** Comparing SIMD on x86-64 and arm64 - Code & Visuals](https://blog.yiningkarlli.com/2021/09/neon-vs-sse.html)
- [**ltspicehelpmanual.azurewebsites.net** Set Simulator Options - Introduction](https://ltspicehelpmanual.azurewebsites.net/options--setsimulatoroptions.htm)
- [**ltwiki.org** Convergence problems? - LTwiki-Wiki for LTspice](https://ltwiki.org/index.php?title=Convergence_problems%3F)
- [**electronics.stackexchange.com** Improving LT Spice DC sweep convergence time](https://electronics.stackexchange.com/questions/314848/improving-lt-spice-dc-sweep-convergence-time)
- [**community.infineon.com** Resolving convergence challenges in LTspice](https://community.infineon.com/t5/Knowledge-Base-Articles/Resolving-convergence-challenges-in-LTspice/ta-p/1053215)
- [**groups.io** LTspice Convergence - Groups.io](https://groups.io/g/LTspice/topic/ltspice_convergence/71423362)
- [**ez.analog.com** Unexpected V1 output value in `.op` analysis (LTspice V26.0.0) - Q&A](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/601574/unexpected-v1-output-value-in-op-analysis-ltspice-v26-0-0)
- [**mikrocontroller.net** LTSpice Stepping Source/ Damped Pseudo-Transient Analysis](https://www.mikrocontroller.net/topic/189333)
- [**youtube.com** L-01 Transient Analysis | LtSpice for Hardware Engineers | Ampnics](https://www.youtube.com/watch?v=UxgSS5Y-sLE)
