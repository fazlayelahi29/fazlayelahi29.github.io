# Exhaustive Research Investigation into Simulation Program with Integrated Circuit Emphasis (SPICE) Architectures

## Section 1: The Global SPICE Taxonomy – FOSS vs. Commercial Ecosystems

The landscape of analog and mixed-signal circuit simulation is fundamentally divided into two distinct but deeply interconnected ecosystems: Free and Open-Source Software (FOSS) SPICE engines, and Commercial/Proprietary Electronic Design Automation (EDA) simulation suites. The evolutionary trajectory of these simulators spans over five decades, originating from early academic mainframes utilizing static memory allocation and culminating in the massively parallel, cloud-distributed matrix solvers of the modern era. This section provides an exhaustive, low-level technical decomposition of every major SPICE variant up to the year 2026, analyzing their core architectures, repository dynamics, compilation toolchains, and the deeply entrenched technical friction surrounding proprietary foundry Process Design Kits (PDKs). 

### 1.1 Comprehensive FOSS Directory: The Open-Source Simulation Ecosystem

The open-source SPICE ecosystem is anchored by foundational academic research and propelled by decentralized, highly specialized engineering communities. These engines must continually adapt to ingest complex, nonlinear semiconductor models while optimizing matrix solution algorithms for hardware architectures that scale from single-board computers to distributed high-performance computing (HPC) clusters.

#### The Academic Baseline: Berkeley SPICE 2g6 and 3f5
The Simulation Program with Integrated Circuit Emphasis (SPICE) was born at the University of California, Berkeley, and its evolutionary milestones are distinctly marked by two major architectural epochs: SPICE2 and SPICE3. The earliest incarnation, SPICE1, presented in 1973, was coded in FORTRAN and utilized basic nodal analysis to construct circuit equations with a highly restrictive fixed-timestep transient analysis algorithm . The architectural maturity required for widespread industrial adoption arrived with SPICE 2g6 in 1975. Coded entirely in FORTRAN, SPICE 2g6 introduced dynamic time-step control and robust Modified Nodal Analysis (MNA), allowing for the accurate simulation of ideal voltage sources and inductors without triggering matrix singularity conditions that plagued earlier standard nodal analysis frameworks . 

However, FORTRAN's static memory allocation limitations bottlenecked the simulation of large-scale very-large-scale integration (VLSI) designs. As transistor counts scaled exponentially, the fixed array dimensions of SPICE2 became a critical computational liability. This necessitated the creation of SPICE 3f5, a complete architectural rewrite in the C programming language . SPICE3 transitioned the engine to dynamic memory allocation using complex pointer-driven data structures (C-structs), which fundamentally decoupled the matrix solver from hardcoded array limits. Furthermore, SPICE 3f5 established the standard input netlist parsing syntax still broadly in use today and introduced polynomial controlled sources. Despite its robustness, the state-based topology of SPICE3 exhibited mathematical deficiencies in transient analysis when evaluating lossy transmission lines, an issue later addressed by specific academic forks such as KSpice . Ultimately, the baseline SPICE 3f5 engine remains the foundational genetic material for nearly all subsequent open-source mixed-signal simulators.

#### Ngspice: The Definitive Community Standard
Ngspice represents the most active, functionally dense continuation of the original Berkeley SPICE 3f5 codebase. It is not merely a circuit simulator; it is a composite engine that integrates three major external computational frameworks into a single unified binary: standard SPICE3, XSPICE, and CIDER . 

The integration of XSPICE—developed originally at the Georgia Institute of Technology—transforms Ngspice into a true mixed-mode simulator . XSPICE introduces a highly optimized event-driven algorithm parallel to the continuous-time analog solver. It allows the instantiation of Code Models, which are external modules written in C that can process digital events without invoking the continuous-time Newton-Raphson solver . This is critical for mixed-signal Integrated Circuits (ICs), as digital nodes are evaluated instantaneously through event queues rather than through computationally brutal and continuous matrix inversions. XSPICE seamlessly bridges the digital and analog domains using automatic insertion of analog-to-digital and digital-to-analog node bridges, maintaining exact voltage-level translation without forcing the analog solver to truncate its timesteps drastically during sub-nanosecond digital clock edges .

Furthermore, Ngspice integrates CIDER, a 1D and 2D numerical device simulator built directly upon the SPICE3 architecture . While standard SPICE relies on compact analytical models (such as BSIM empirical equations), CIDER solves Poisson's equation and the carrier continuity equations across a physical finite-element mesh, allowing for Technology Computer-Aided Design (TCAD) level physical accuracy directly within the transient SPICE simulation. Recently, the Ngspice core architecture was heavily refactored to enable the KLU sparse matrix solver for CIDER during DC, Operating Point (OP), and Transient (TRAN) analyses, drastically reducing simulation time for physical mesh evaluations .

The matrix solver architecture of Ngspice has seen significant modernizations to handle VLSI density. Historically reliant on the venerable Sparse 1.3 direct solver library, modern Ngspice distributions (post version 42) strictly default to the KLU matrix solver from the SuiteSparse library . KLU is explicitly optimized for the highly asymmetric, highly sparse matrix topologies characteristic of analog circuit simulations. It utilizes threshold partial pivoting and Approximate Minimum Degree (AMD) ordering algorithms to minimize non-zero fill-in during Lower-Upper (LU) factorization, yielding orders-of-magnitude speedups for circuits exceeding 10,000 nodes . 

To ingest modern semiconductor models, Ngspice has spearheaded the adoption of the Open-Source Device Interface (OSDI) and the OpenVAF Verilog-A compiler . By compiling Verilog-A behavioral models (such as the complex BSIM-CMG for FinFETs) via OpenVAF into dynamic OSDI shared libraries, Ngspice achieves near-native execution speeds for state-of-the-art foundry models . This bypasses the extreme latency of legacy interpreted Verilog-A frameworks like ADMS. Compiling Ngspice from source requires strict dependency management using GNU Autotools. By passing specific flags during the `./configure` stage—such as `--enable-xspice`, `--enable-cider`, and `--enable-openmp`—developers can trigger OpenMP multithreading, which is specifically optimized for parallelizing the evaluation of massive BSIM3.3.0 and BSIM4.6.0 model arrays across multi-core symmetric multiprocessing (SMP) systems . 

#### Xyce: The Massively Parallel DAE Powerhouse
Developed by Sandia National Laboratories, Xyce deviates entirely from the Berkeley SPICE genetic tree . It was constructed from scratch in C++ to address the simulation of extreme-scale circuits containing millions of highly coupled nodes—scales that permanently choke traditional shared-memory SPICE engines. Xyce's architecture is built fundamentally around distributed-memory parallel computing paradigms, specifically leveraging the Message Passing Interface (MPI) to scale computations across thousands of high-performance computing (HPC) processor cores .

The mathematical formulation of Xyce differs drastically from legacy SPICE tools. Traditional SPICE encodes specific analytical evaluations directly into individual device subroutines, deeply entangling the device physics with the matrix stamping algorithms. Xyce utilizes a rigorous Differential-Algebraic Equation (DAE) formulation framework . This abstraction layer completely isolates the semiconductor device physics package from the non-linear solver and the time-integration algorithms. Consequently, introducing a new physical device model does not require modifying the overarching numerical algorithms; the same generic device load functions interface seamlessly with DC, Transient, and Harmonic Balance analysis methods .

To execute the matrix inversions across distributed networks, Xyce heavily leverages Trilinos, a community-driven open-source C++ framework for large-scale engineering and scientific problems developed internally at Sandia . Trilinos provides Xyce with advanced preconditioned iterative solvers (such as GMRES and AztecOO) alongside distributed direct solvers (like Amesos and parallel KLU variants) . When executing transient analysis on a distributed cluster, Xyce partitions the circuit's adjacency graph using hypergraph partitioning algorithms via the Zoltan package. This distributes the highly coupled sub-matrices across physical cluster nodes to minimize internode MPI communication bandwidth, avoiding the classic parallelization bottleneck where data-transfer overhead eclipses computational gain .

#### Gnucap, QSPICE, and Specialized Academic Variants
Gnucap (GNU Circuit Analysis Package) operates on a completely divergent simulation paradigm compared to Berkeley descendants. While it supports standard MNA matrices, its internal architecture is distinctly object-oriented (C++) and heavily relies on a state-variable behavioral modeling approach rather than hardcoded nodal evaluation matrices . Gnucap implements a deeply modular plugin architecture via its `modelgen` compiler, allowing developers to load device models dynamically at runtime. This modularity prevents the monolithic executable bloat seen in legacy SPICE and allows for mixed-level simulation where macro-models and atomic transistor models dynamically swap based on requisite accuracy.

QSPICE, created by Mike Engelhardt (the original architect of LTspice for Linear Technology/Analog Devices), represents a modern micro-architectural revolution in simulation performance. Distributed under the Qorvo banner, QSPICE is a proprietary freeware engine that heavily integrates with the FOSS mindset by natively generating human-readable C++ and Verilog code for behavioral models. QSPICE explicitly abandons legacy GPU offloading in favor of aggressively optimized CPU cache-line utilization and modern Single Instruction, Multiple Data (SIMD) CPU instructions. Its proprietary solver algorithm achieves nearly jitter-free transient timesteps, making it uncharacteristically stable for wide-bandgap (Silicon Carbide and Gallium Nitride) switched-mode power supplies that generate severe discontinuous $dv/dt$ transients that traditionally fracture Newton-Raphson continuity .

Further niche specialization is seen in SpiceOpus, Macspice, Oregano, and KSpice. SpiceOpus, an academic tool maintained by the University of Ljubljana, is coded in C/C++ and explicitly designed for iterative circuit optimization . It wraps the standard SPICE engine in a complex mathematical optimization heuristic framework, utilizing downhill simplex algorithms and simulated annealing to drive automated analog parameter synthesis . KSpice, an early offshoot of SPICE3E2, specifically optimized the Newton-Raphson convergence for lossy transmission line simulations, replacing standard state-based analysis with robust time-domain integration techniques tailored for complex interconnect delay models; its transmission line models (`txl` and `cpl`) were eventually backported into Ngspice . Macspice provides a purely native, highly optimized port for Apple operating systems, while Oregano serves primarily as a GNOME-based schematic capture frontend that seamlessly wraps either Ngspice or Gnucap execution engines in Unix environments .

| Engine Name | License Type | Implementation Language | Original Ancestry | Active Repository / Host | Primary Maintenance Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Berkeley SPICE 3f5** | BSD | C | SPICE 2g6 (FORTRAN) | Univ. of California (Archived) | UC Berkeley (Historical) |
| **Ngspice** | BSD / GPL (parts) | C / C++ | SPICE 3f5 | SourceForge / Git | Ngspice Development Team |
| **Xyce** | GNU GPL v3 | C++ | Native / Original (Trilinos) | GitHub / Sandia Labs | Sandia National Laboratories |
| **Gnucap** | GNU GPL v3 | C++ | Native / Original | Savannah (GNU Project) | Albert Davis / GNU Community |
| **SpiceOpus** | Freeware / Academic | C / C++ | SPICE 3f5 | University of Ljubljana Web | University of Ljubljana |
| **KSpice** | Academic Freeware | C | SPICE 3E2 | UC Berkeley (Archived) | UC Berkeley (Historical) |
| **QSPICE** | Proprietary Freeware | C++ / Assembly | Native / Original | Qorvo Website | Qorvo / Mike Engelhardt |
| **Macspice** | Freeware (Closed) | C / C++ | SPICE 3f5 | Macspice Website | Charles O. |
| **Oregano** | GNU GPL | C (Frontend only) | N/A (Wrapper) | GitHub | GNU / GNOME Community |

### 1.2 Comprehensive Commercial & Proprietary Directory: Enterprise Grade Execution

Commercial EDA simulators differentiate themselves from FOSS engines through aggressive hardware-specific micro-optimizations, domain-decomposition solver scaling, absolute compliance with industrial safety standards, and guaranteed fidelity with fully encrypted proprietary foundry PDKs. 

#### Synopsys HSPICE: The Golden Foundry Standard
Synopsys HSPICE remains the semiconductor industry's uncompromising benchmark for pre-layout and post-layout verification, particularly for densely packed memory arrays and advanced-node standard cells. Its dominance stems from its extreme numerical precision, proprietary extensions to dynamic timestep control, and deeply ingrained relationships with tier-one silicon foundries. 

HSPICE's integration engine is highly parameterized to combat Local Truncation Error (LTE) and numerical oscillation. For high-gain, high-dynamic-range analog designs (such as high-speed comparators), HSPICE invokes specialized transient algorithms, specifically utilizing the `LVLTIM=3` parameter in conjunction with `DVDT=2` . The `DVDT` dynamic timestep algorithm tightly correlates the delta-time progression with the maximum allowable nodal voltage derivatives across the entire matrix. To prevent numerical instability during stiff differential equations, HSPICE implements highly sensitive timestep reversal mechanisms governed by strict tolerance variables such as `ABSVAR` . If a convergent Newton-Raphson iteration yields a voltage step exceeding the `ABSVAR` threshold (defaulting to 0.5V), HSPICE assumes the trajectory is numerically hazardous, discards the solution vector entirely, violently truncates the timestep, and re-factors the matrix from the previous safe time-point . Furthermore, parameters such as `IMIN` and `IMAX` tightly bound the number of iterations allowed before a time-point is forced into expansion or contraction, giving IC designers forensic-level control over convergence parameters in stiff topological networks .

#### Cadence Spectre: APS, Spectre X, and Domain Decomposition
Cadence's Spectre Circuit Simulator is the undisputed leader in Radio Frequency Integrated Circuit (RFIC) and complex Mixed-Signal IC design. Unlike traditional SPICE tools that bolt on RF capabilities as an afterthought, Spectre was architected from its inception to support harmonic balance-based analyses and Periodic Steady State (PSS) shooting methods directly, bypassing the need to extract RF frequency responses strictly from transient time-domain integration .

To handle massive post-layout simulations fraught with millions of extracted parasitic RC elements, Cadence introduced Spectre APS (Accelerated Parallel Simulator) . By executing the `+mt` multithreading command-line argument, Spectre APS segments the device evaluation and matrix loading phases across symmetric multiprocessing (SMP) hardware . 

Spectre X represents the absolute pinnacle of Cadence's parallelization logic, executing massively distributed multi-processing via the `+xdp` command-line switch . Spectre X abandons single large monolithic matrices, utilizing sophisticated graph-theoretic domain decomposition. The circuit is sliced into loosely coupled sub-domains; local sub-matrices are solved locally on individual CPU cores (or distributed across a network via LSF systems), and the boundary conditions are resolved globally using Schur complements. Furthermore, Spectre X tightly integrates GPU acceleration (invoked via `+gpu`). By offloading dense arithmetic subroutines and highly regular BSIM device evaluations to massively parallel CUDA cores, Spectre X achieves up to 8X speedups for ultra-conservative accuracy simulations (using `errpreset=conservative`) on massive standard-cell characterizations and post-layout verification workloads . 

#### Siemens EDA Eldo: Automotive and Reliability Mastery
Siemens EDA's Eldo occupies a massive structural footprint in automotive analog verification, driven largely by its innate ISO 26262 compliance tracking and robust reliability simulation frameworks . Eldo utilizes advanced matrix solver algorithms equipped with extensive convergence rescuing heuristics, including continuous Gmin stepping, source stepping, and Pseudo-Transient Analysis (PTA) to resolve intractable DC operating points . 

Eldo introduces highly distinct analytical methodologies for evaluating parasitic network impact without resorting to brute-force transient simulation. For routing optimization, it constructs sensitivity circuit models utilizing Taylor series expansions of voltage responses in the complex Laplace domain: $V(s) = m_0 + m_1s + m_2s^2 + m_3s^3 + \dots$ . By isolating the moments ($m_i$) of a linear RC system, Eldo precisely estimates parasitic degradation and interconnect delay. Furthermore, Eldo implements highly specialized deterministic and probabilistic algorithms for analog defect injection and fault simulation, ensuring rigorous verification against single-event upsets (SEUs) and wear-out failures required for space and automotive deployment .

#### SIMetrix/SIMPLIS: Piecewise Linear Topologies
While Newton-Raphson solvers dominate IC design, they frequently collapse or suffer massive timestep attenuation (computational stuttering) when evaluating the brutal discontinuous voltage transitions inherent to Switched-Mode Power Supplies (SMPS). SIMPLIS (SIMulation of Piecewise LInear Systems) bypasses the continuous Modified Nodal Analysis architecture entirely . 

Instead of iterating through continuous non-linear models (which create numerically ill-conditioned Jacobians during rapid switching events), SIMPLIS models semiconductor devices as sequences of straight-line, piecewise linear (PWL) segments . When a power MOSFET switches, the SIMPLIS engine does not attempt to resolve the infinitesimal crossover analog derivatives using infinitesimal timesteps; it instantaneously calculates the new linear circuit topology . This absolute topological transition eliminates convergence failures during high-frequency pulse-width modulation (PWM) switching, providing highly accurate steady-state AC Bode plots for switching converters in a fraction of the time required by standard SPICE, which must wait for transient start-up stabilization .

#### The Desktop and Prosumer Giants: Micro-Cap, TINA, PSpice, and LTspice
Micro-Cap, developed by Spectrum Software, evolved over nearly 40 years from a primitive Apple II environment into a highly potent Windows-based SPICE simulator . Reaching version 12 before the company closed and released it as freeware, Micro-Cap v12 encompasses immense capability, including fully dynamic DC operating point sweeps, built-in active filter synthesis, multidimensional parameter stepping, and complex behavioral modeling utilizing Lambert W functions and Legendre polynomials . It excels in digital stimulus injection; specifically, requiring deterministic `.IC` (initial conditions) initialization for complex feedback logic loops like SR and JK flip-flops to prevent indeterminate matrix locking .

TINA (Toolkit for Interactive Network Analysis) by DesignSoft represents a versatile mixed-signal platform, prominently visible in its Texas Instruments-branded version (TINA-TI) . Modern iterations of TINA leverage deep multi-core threading to accelerate HDL/SPICE co-simulation and extend into cloud-based distributed computation via TINACloud . TINA implements proprietary netlist dialects optimized for mechatronics, optoelectronics, and RF communication, seamlessly parsing legacy PSpice syntax to dominate the PCB-level power electronics evaluation space . 

PSpice, natively integrated into Cadence Orcad, remains a powerhouse for board-level design, utilizing its own expansive libraries and syntax dialects that frequently conflict with standard SPICE3 conventions, requiring translation layers in FOSS engines . Finally, LTspice (Analog Devices) remains the industry's most ubiquitous proprietary freeware, renowned for its highly optimized switching-regulator macro-models and phenomenally fast proprietary solver techniques that manipulate matrix structures specifically to favor analog power electronics over dense VLSI ICs .

| Vendor / Engine | Licensing Model | Host OS Support | Cloud / Distributed Deployment | Primary Target Industry |
| :--- | :--- | :--- | :--- | :--- |
| **Synopsys HSPICE** | Commercial (FlexLM) | Linux / Windows | High (LSF/Grid Engine Support) | IC Foundry / Standard Cell / Memory |
| **Cadence Spectre X** | Commercial (FlexLM) | Linux | Very High (Native Cloudburst / LSF) | RFIC / Advanced Node Analog IC |
| **Siemens EDA Eldo** | Commercial (FlexLM) | Linux / Windows | High (Clustered MPI execution) | Automotive / Reliability / AMS |
| **SIMetrix/SIMPLIS** | Commercial (Dongle/MAC) | Windows | Local Multi-Core | Power Electronics / SMPS |
| **Cadence PSpice** | Commercial | Windows | Local Multi-Core | PCB-Level Mixed Signal |
| **Spectrum Micro-Cap** | Freeware (Closed Source) | Windows | None (Local execution only) | Broad Electronics / Educational |
| **DesignSoft TINA** | Commercial / TI Freeware | Windows / Web | TINACloud (Web Browser execution) | Mixed-Signal / Mechatronics |
| **Altium Mixed Sim** | Commercial | Windows | None (Local execution only) | PCB Design / General Electronics |
| **ADI LTspice** | Proprietary Freeware | Windows / macOS | None (Local execution only) | Power Electronics / Discrete Analog |

### 1.3 Licensing, IP, and Foundry Access Friction: The PDK Bottleneck

The deepest, most intractable schism between the FOSS and Commercial SPICE ecosystems is not mathematical or algorithmic, but profoundly legal and cryptographic. As semiconductor geometries scale relentlessly toward 3nm and 2nm Gate-All-Around (GAA) architectures, foundries (TSMC, Intel, Samsung) require extremely complex mathematical models, specifically BSIM-CMG (Common Multi-Gate), to capture quantum confinement, ballistic velocity overshoot, Multi-Gate fringing fields, and extreme Short Channel Effects (SCE) . 

The exact parameter sets defining these advanced nodes—often containing thousands of highly correlated physical coefficients extracted via advanced TCAD simulations and empirical wafer measurements—represent the absolute highest-value Intellectual Property of the foundry . To protect this critical IP from competitors, foundries encrypt their SPICE models, standard cell definitions, and subcircuits using stringent cryptographic protocols, most notably the IEEE 1735 encryption standard for electronic design IP . 

This creates an insurmountable technical barrier for FOSS SPICE engines like Ngspice and Xyce. Commercial simulators like HSPICE, Spectre, and Eldo possess native decryption engines physically tied to their FlexLM license daemons and non-disclosure agreements (NDAs). The foundries directly provide Synopsys, Cadence, and Siemens with the proprietary cryptographic keys required to silently decrypt the netlists in volatile memory during matrix parsing, ensuring the end-user never sees the plaintext parameters, but the simulator can instantiate the matrices perfectly. 

Open-source simulators, structurally incapable of hiding a decryption key in a globally visible C/C++ Git repository, cannot natively load standard TSMC, Samsung, or Intel advanced-node PDKs. The open-source community's mitigation relies on two distinct vectors. First, the emergence of Open PDKs (such as the Skywater 130nm or IHP OpenPDK) which provide completely unencrypted, open-source BSIM4 and PSP parameter sets directly compatible with Ngspice and Xyce, allowing for unencumbered academic research and tape-outs on mature nodes . Second, the usage of the OSDI and OpenVAF toolchain to abstract behavioral Verilog-A models allows researchers to generate highly complex BSIM-CMG topologies locally without requiring encrypted foundry distribution . While this bypasses legacy parser incompatibilities and allows theoretical simulation of FinFET architectures in open-source tools, the actual empirical data-fitting parameters required for a physical tape-out remain fundamentally gated by the physical fabrication facility's cryptographic infrastructure.

| Engine | PDK Encryption Handling | BSIM-CMG / FinFET Support | Model Binning Capability | IEEE 1735 Compliance | Commercial Integration Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HSPICE** | Native Decryption (FlexLM) | Native (Full Foundry Spec) | Advanced (Multi-dimensional) | Full Compliance | Tier 1 Foundry Standard |
| **Spectre X** | Native Decryption (FlexLM) | Native (Full Foundry Spec) | Advanced (Multi-dimensional) | Full Compliance | Tier 1 Foundry Standard |
| **Eldo** | Native Decryption (FlexLM) | Native (Full Foundry Spec) | Advanced (Multi-dimensional) | Full Compliance | Tier 1 Foundry Standard |
| **Ngspice** | Cannot Read Encrypted IP | Supported via OpenVAF/OSDI | Basic (L/W parameter bounds) | Non-Compliant | FOSS / Open PDKs (Skywater/IHP) |
| **Xyce** | Cannot Read Encrypted IP | Supported via ADMS/C++ | Basic (L/W parameter bounds) | Non-Compliant | Sandia Restricted / Open PDKs |
| **Gnucap** | Cannot Read Encrypted IP | Custom via `modelgen` | Manual implementation | Non-Compliant | Academic / FOSS |
| **SIMPLIS** | Custom encrypted format | Incompatible (Topological PWL) | N/A | Non-Compliant | Component Vendor Models Only |
| **Micro-Cap** | Cannot Read Encrypted IP | BSIM3 / BSIM4 only | Basic (L/W parameter bounds) | Non-Compliant | Prosumer Desktop |
| **LTspice** | Custom encrypted format | Basic capability via subcircuits | Basic | Non-Compliant | Component Vendor Models Only |

---

## Sources

- [**portal.tpu.ru** COMPUTER AIDED DESIGN OF ELECTRONIC DEVICES](https://portal.tpu.ru/SHARED/k/KOZHEMYAK/eng/Teaching/Tab1/Tab/Textbook_CAD_2014_short.pdf)
- [**embedded.eecs.berkeley.edu** Spice - The Donald O. Pederson Center for Electronic Systems Design](https://embedded.eecs.berkeley.edu/pubs/downloads/spice/)
- [**ngspice.sourceforge.io** ngspice-manual.pdf](https://ngspice.sourceforge.io/docs/ngspice-manual.pdf)
- [**ngspice.sourceforge.io** Ngspice User's Manual Version 47+ (ngspice development version)](https://ngspice.sourceforge.io/docs/ngspice-html-manual/manual.xhtml)
- [**manuals.plus** ngspice user manual - Manuals+](https://manuals.plus/m/13635ef162f01e8321011c4d3cb7d94644da202429dbee8ae35b85d23997a22e)
- [**scribd.com** Nanoscale Mixed-Signal System Design | PDF | Electricity - Scribd](https://www.scribd.com/document/784117602/Mohanty-Book-2015-Nanoelectronics-Mixed-Signal-ToC-Preprint)
- [**github.com** ngspice/NEWS at master - GitHub](https://github.com/imr/ngspice/blob/master/NEWS)
- [**ngspice.sourceforge.io** Ngspice, the open source Spice circuit simulator - NEWS](https://ngspice.sourceforge.io/news.html)
- [**archive.fosdem.org** The IHP OpenPDK Initiative - Fosdem](https://archive.fosdem.org/2025/events/attachments/fosdem-2025-5882-the-ihp-openpdk-initiative-status-and-roadmap/slides/238751/WG_OpenPD_9dCyxJt.pdf)
- [**osti.gov** Sparse Linear Solvers for Large-scale Electromagnetic Transient](https://www.osti.gov/servlets/purl/2538302)
- [**researchgate.net** KLU{A HIGH PERFORMANCE SPARSE LINEAR SOLVER FOR](https://www.researchgate.net/publication/250018797_KLUA_HIGH_PERFORMANCE_SPARSE_LINEAR_SOLVER_FOR_CIRCUIT_SIMULATION_PROBLEMS)
- [**github.com** OpenVAF-Reloaded - GitHub](https://github.com/OpenVAF/OpenVAF-Reloaded)
- [**openvaf.semimod.de** Open Source Device Interface (OSDI) Specification - Working Draft](https://openvaf.semimod.de/osdi/osdi_v0p3.pdf)
- [**github.com** ngspice/INSTALL at master - GitHub](https://github.com/ngspice/ngspice/blob/master/INSTALL)
- [**xyce.sandia.gov** About Xyce - Sandia National Laboratories](https://xyce.sandia.gov/about-xyce/)
- [**xyce.sandia.gov** SANDIA REPORT Xyce™ Parallel Electronic Simulator Users' Guide](https://xyce.sandia.gov/files/xyce/Xyce_Users_Guide_7.6.pdf)
- [**arxiv.org** Trilinos: Enabling Scientific Computing across Diverse Hardware](https://arxiv.org/html/2503.08126v2)
- [**xyce.sandia.gov** Building Guide - Xyce - Sandia National Laboratories](https://xyce.sandia.gov/documentation-tutorials/building-guide/)
- [**docs.lib.purdue.edu** A Variable-Structure Variable-Order Simulation ... - Purdue e-Pubs](https://docs.lib.purdue.edu/cgi/viewcontent.cgi?article=2534&context=open_access_dissertations)
- [**researchgate.net** (PDF) Free software support for compact modelling with Verilog-A](https://www.researchgate.net/publication/385420274_Free_software_support_for_compact_modelling_with_Verilog-A)
- [**vbn.aau.dk** Efficient Automated Design and Optimization for Wide-Bandgap](https://vbn.aau.dk/files/752350357/PHD_PPK_ONLINE.pdf)
- [**handwiki.org** Software:SPICE - HandWiki](https://handwiki.org/wiki/Software:SPICE)
- [**iariajournals.org** download vol 3, no 1&2, year 2010 - IARIA Journals](https://www.iariajournals.org/internet_technology/inttech_v3_n12_2010_paged.pdf)
- [**tvsat.com.pl** ICs for Communications - Signal Processing Codec Filter SICOFI](https://tvsat.com.pl/PDF/P/peb2060_inf.pdf)
- [**cse.chalmers.se** HSPICE Quick Reference Guide](https://www.cse.chalmers.se/~perla/ugrad/EDA351/HSPICEQuickRef.pdf)
- [**ece.northeastern.edu** HSPICE User Guide](https://ece.northeastern.edu/courses/eece4525/2018su/Hspice/Hspice_User_Guide.pdf)
- [**rudraj.it** HSPICE Simulation and Analysis User Guide](http://www.rudraj.it/hspice_sa.pdf)
- [**studylib.net** Spectre Circuit Simulator Reference Manual - Studylib](https://studylib.net/doc/27344042/spectreref)
- [**ee.kpi.ua** Spectre Circuit Simulator Reference](https://ee.kpi.ua/~yv/edu/ok/book/spectre_refManual.pdf)
- [**community.cadence.com** Spectre Tech Tips: Optimizing Spectre APS Performance](https://community.cadence.com/cadence_blogs_8/b/cic/posts/spectre-optimizing-spectre-aps-performance)
- [**eng.biu.ac.il** Behind the scenes of the SPICE Circuit Simulator](https://www.eng.biu.ac.il/temanad/files/2022/04/Lecture-3-Behind-the-scenes-of-SPICE.pdf)
- [**community.cadence.com** Spectre Tech Tips: GPU Integration with Analog Circuit Simulation](https://community.cadence.com/cadence_blogs_8/b/cic/posts/spectre-tech-tips-gpu-integration-with-analog-circuit-simulation)
- [**mdpi.com** A Systematic Taxonomy and Comparative Analysis of Mixed-Signal](https://www.mdpi.com/2079-9292/15/8/1687)
- [**doi.org** An Efficient Reinforcement Learning PTA Step Size Policy for Circuit](https://doi.org/10.1109/BDAMEA68159.2025.11406668)
- [**ieeexplore.ieee.org** RC Parasitic-Aware Layout Analysis and Routing Optimization](https://ieeexplore.ieee.org/iel7/6287639/9668973/09870785.pdf)
- [**researchgate.net** Analog Defect Injection and Fault Simulation Techniques](https://www.researchgate.net/publication/372633031_Analog_Defect_Injection_and_Fault_Simulation_Techniques_A_Systematic_Literature_Review)
- [**numdam.org** Rare event simulation for electronic circuit design - Numdam](https://www.numdam.org/item/10.5802/msia.19.pdf)
- [**ltwiki.org** LTspice Genealogy - The Heritage of Simulation Ubiquity - LTwiki](https://ltwiki.org/index.php?title=LTspice_Genealogy_-_The_Heritage_of_Simulation_Ubiquity)
- [**news.ycombinator.com** Bridging the Gap Between PLECS and SPICE - Hacker News](https://news.ycombinator.com/item?id=46752841)
- [**exyucafe.com** SIMetrix/SIMPLIS Elite v8.4 x64 Final - Exyucafe](https://www.exyucafe.com/viewtopic.php?p=110552)
- [**sourceforge.net** Best ModelSim Alternatives & Competitors - SourceForge](https://sourceforge.net/software/product/ModelSim/alternatives)
- [**researchgate.net** (PDF) Assessment of the Current for a Non-Linear Power Inductor](https://www.researchgate.net/publication/367379048_Assessment_of_the_Current_for_a_Non-Linear_Power_Inductor_Including_Temperature_in_DC-DC_Converters)
- [**gotroot.ca** Micro-Cap 12](https://gotroot.ca/spectrum/www.spectrum-soft.com/download/ug12.pdf)
- [**blog.mbedded.ninja** How To Use Micro-Cap | mbedded.ninja](https://blog.mbedded.ninja/electronics/general/circuit-simulation/how-to-use-micro-cap/)
- [**scribd.com** TINA 10 Manual | PDF | Installation (Computer Programs) - Scribd](https://www.scribd.com/document/327701465/TINA-10-Manual)
- [**worldradiohistory.com** Electronics-World-1997-11.pdf](https://www.worldradiohistory.com/UK/Wireless-World/90s/Electronics-World-1997-11.pdf)
- [**arxiv.org** Physics-Regularized Iterative Symbolic Modeling of 3nm FinFETs](https://arxiv.org/pdf/2609.13200)
- [**webthesis.biblio.polito.it** Gate-All-Around FET - POLITECNICO DI TORINO](https://webthesis.biblio.polito.it/26737/1/tesi.pdf)
- [**mdpi.com** ResNet Modeling for 12 nm FinFET Devices to Enhance DTCO](https://www.mdpi.com/2079-9292/13/20/4040)
- [**cordis.europa.eu** D4.10 Report on EUROSOI+ Workshop held in Granada, 17-19](https://cordis.europa.eu/docs/projects/cnect/3/216373/080/deliverables/001-EUROSOID410.pdf)
- [**ihp-open-pdk-docs.readthedocs.io** 2. Installation — IHP OpenPDK b6607d6 documentation](https://ihp-open-pdk-docs.readthedocs.io/en/latest/install/installation.html)
- [**en.wikipedia.org** Sandia National Laboratories - Wikipedia](https://en.wikipedia.org/wiki/Sandia_National_Laboratories)
- [**scribd.com** User Guide | PDF | Copyright | Proprietary Software - Scribd](https://www.scribd.com/document/364940436/User-Guide)
- [**datasheet.hk** View PEF2060_6709023.PDF datasheet online --- IC-ON-LINE](http://www.datasheet.hk/view_online.php?id=1928691&file=0465\pef2060_6709023.pdf)
- [**ktr.or.kr** 의료기기 소프트웨어 밸리데이션 가이드라인 (Guidelines for Software](https://ktr.or.kr/kor/data/%EC%9D%98%EB%A3%8C%EA%B8%B0%EA%B8%B0_%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4%EB%B0%B8%EB%A6%AC%EB%8D%B0%EC%9D%B4%EC%85%98_%EA%B0%80%EC%9D%B4%EB%93%9C%EB%9D%BC%EC%9D%B8.pdf)
- [**semiwiki.com** Cadence adds a new Fast SPICE Circuit Simulator - SemiWiki](https://semiwiki.com/eda/299589-cadence-adds-a-new-fast-spice-circuit-simulator/)
- [**developer.arm.com** Linux Server Software Ecosystem Dashboard for Arm](https://developer.arm.com/ecosystem-dashboard/)
- [**scribd.com** Getting The Most Out of Spectre APS: Maximizing Performance](https://www.scribd.com/document/596921173/APS)
- [**community.cadence.com** Under the Hood of Clarity and Celsius Solvers - Cadence Blogs](https://community.cadence.com/cadence_blogs_8/b/breakfast-bytes/posts/clarity-n-celsius)
- [**scribd.com** Circuit Simulator Functions Explained | PDF | Electrical Network](https://www.scribd.com/document/533755473/ams-lec-03-simulator-v01)
- [**emergentmind.com** Circuit Simulator: Physics with JavaScript Canvas - Emergent Mind](https://www.emergentmind.com/visualizations/circuit-simulator)
- [**books.google.com** Circuit Simulation - Farid N. Najm - Google Books](https://books.google.com/books/about/Circuit_Simulation.html?id=FjhuDwAAQBAJ)
- [**uom.lk** modified nodal analysis](https://uom.lk/sites/default/files/elect/files/ee321s3.3.pdf)
- [**dieei.unict.it** Circuit Models and Simulation of Power Devices - Dieei - UniCt](https://www.dieei.unict.it/courses/lm-29/course-units?seuid=80B02D7E-4565-442D-B5A4-DC23A5C52644)
- [**electronics.stackexchange.com** Modified Nodal Analysis for Diode , Approach?](https://electronics.stackexchange.com/questions/328027/modified-nodal-analysis-for-diode-approach)
- [**dr.lib.iastate.edu** Transient analysis for symbolic simulation of large scale networks](https://dr.lib.iastate.edu/bitstreams/c1b28c1d-9aa5-44d3-8860-083fd7aac9d2/download)
- [**cs.columbia.edu** CircuitSim Design Document - Columbia CS](https://www.cs.columbia.edu/~sedwards/classes/2025/4840-spring/designs/CircuitSim.pdf)
- [**scribd.com** CKTSO: Parallel Sparse Solver for SPICE | PDF | Matrix ... - Scribd](https://www.scribd.com/document/796197420/2411-14082)
- [**pypi.org** sparsax · PyPI](https://pypi.org/project/sparsax/)
- [**aspdac.com** Machine Learning and GPU Accelerated Sparse Linear Solvers for](https://www.aspdac.com/aspdac2024/archive/pdf/1E-4.pdf)
- [**numbda.cs.tsinghua.edu.cn** Advancing Sparse Matrix Solvers via Exploring More Parallelism](https://numbda.cs.tsinghua.edu.cn/papers/asicon25_2.pdf)
- [**ieeexplore.ieee.org** Algorithmic Advancements and a Comparative Investigation of Left](https://ieeexplore.ieee.org/iel7/6287639/9668973/09839490.pdf)
- [**eprints.soton.ac.uk** Parallel Sparse Matrix Solution for Circuit Simulation on FPGAs](https://eprints.soton.ac.uk/364713/1/paper.pdf)
- [**openvaf.semimod.de** Examples | OpenVAF - SemiMod](https://openvaf.semimod.de/docs/getting-started/examples/)
- [**github.com** OSDI/OpenVAF: Verilog-A compact models in ngspice #22 - GitHub](https://github.com/pascalkuthe/OpenVAF/discussions/22)
- [**ams-signals.com** Analog - AMS Signals](https://ams-signals.com/analog/)
- [**electronics.stackexchange.com** ltspice - pseudo transient analysis issue](https://electronics.stackexchange.com/questions/547095/pseudo-transient-analysis-issue)
- [**groups.io** LTspice@groups.io | Please help to speed up simulation](https://groups.io/g/LTspice/topic/please_help_to_speed_up/50251106)
- [**amd.e-technik.uni-rostock.de** Exploration of Technology Parameter Values of Integrated Circuit](https://www.amd.e-technik.uni-rostock.de/veroeff/2015_PAMOS_Exploration.pdf)
- [**arxiv.org** LASANA: Large-Scale Surrogate Modeling for Analog ... - arXiv](https://arxiv.org/html/2507.10748v2)
- [**csiebeta.npu.edu.tw** SPICE (A007)](https://csiebeta.npu.edu.tw/~cyyang/teaching/VLSI/hspice2005.pdf)
- [**web.engr.oregonstate.edu** Chapter 21 Using Transmission Lines](https://web.engr.oregonstate.edu/~moon/ece323/hspice98/files/chapter_21.pdf)
- [**cseweb.ucsd.edu** HSPICE Reference Manual: Commands and Control Options](https://cseweb.ucsd.edu/classes/wi10/cse241a/assign/hspice_cmdref.pdf)
- [**web.stanford.edu** Star-Hspice Manual - Stanford University](https://web.stanford.edu/class/archive/ee/ee371/ee371.1066/tools/hspice.pdf)
- [**ieee-cas.org** A Short History of Circuits and Systems - IEEE CASS](https://ieee-cas.org/files/ieeecass/2022-01/a_short_history_of_circuits_and_systems-_ebook-_web.pdf)
- [**scribd.com** Siemens SW Questa ADMS FS 80836 C1 | PDF - Scribd](https://www.scribd.com/document/1009349964/Siemens-SW-Questa-ADMS-FS-80836-C1)
- [**eet.bme.hu** Eldo RF User's Manual - BME EET](https://www.eet.bme.hu/~szalai/Download/eldo_rf.pdf)
- [**opus.hs-offenburg.de** MPC-Workshop Juli 2013 - OPUS-HSO - Hochschule Offenburg](https://opus.hs-offenburg.de/files/6033/MPC_Workshopband_50.pdf)
