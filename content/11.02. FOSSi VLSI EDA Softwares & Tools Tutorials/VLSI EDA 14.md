# Architectural Analysis of the Open-Source EDA Ecosystem and VLSI Research Contributions from Dhaka, Bangladesh

## The Paradigm Shift in Electronic Design Automation

The design and fabrication of Very Large Scale Integration (VLSI) systems have historically been constrained by the astronomical costs associated with proprietary Electronic Design Automation (EDA) software. For decades, the algorithmic complexity required to translate a high-level hardware description into billions of perfectly routed nanometer-scale polygons meant that only a handful of commercial vendors could supply the necessary tooling. This proprietary model severely restricted access to application-specific integrated circuit (ASIC) design for academic institutions, independent researchers, and small-to-medium enterprises, effectively forcing them to rely on field-programmable gate arrays (FPGAs) for hardware prototyping . 

However, the electronic design landscape is currently undergoing a renaissance, catalyzed by the democratization of open-source silicon technologies. The release of manufacturable open-source Process Design Kits (PDKs)—most notably the SKY130 PDK by SkyWater Technology and Google, the GF180MCU PDK by GlobalFoundries, and the IHP130 PDK—has provided the manufacturing baselines necessary for custom silicon . Concurrently, advanced predictive research PDKs like ASAP7 (a 7nm FinFET technology model from Arizona State University) have enabled researchers to study extreme deep-submicron physics without requiring non-disclosure agreements .

To utilize these PDKs, the open-source community, heavily backed by initiatives such as the DARPA IDEA program, has engineered complete RTL-to-GDSII digital implementation flows . The foundational text provided for this analysis accurately models this ecosystem as a sophisticated three-tiered architecture. It correctly asserts that modern open-source EDA is not a single monolithic application written from scratch, but rather a deeply integrated collection of highly specialized, distinct tools connected via automated orchestrators and shared memory databases . This report provides an exhaustive architectural verification of this ecosystem—from containerized environments to non-linear placement mathematics—and subsequently investigates how this infrastructure has catalyzed advanced VLSI research in emerging technology hubs, specifically focusing on contributions from Dhaka, Bangladesh.

## Tier 1: The Environment and Containerized Distribution

The foundational layer of the open-source silicon ecosystem addresses the chronic issue of software dependency management, often referred to within the computational sciences as "dependency hell." EDA tools are notoriously fragile regarding their host environments; a physical design pipeline requires an intricate matrix of C++ compilers, Python interpreters, Tcl scripting engines, matrix mathematics solvers, and graphical libraries. Furthermore, different tools within the pipeline may depend on conflicting versions of the same shared system libraries. 

The reference text accurately identifies Tier 1 as the environment or container distribution layer, highlighting projects such as IIC-OSIC-TOOLS (Integrated Infrastructure for Collaborative Open Source IC Tools) . Curated by the Department for Integrated Circuits at Johannes Kepler University (JKU), IIC-OSIC-TOOLS is not an EDA algorithm itself, nor is it a flow orchestrator. Instead, it operates as a comprehensive environmental wrapper, utilizing Docker and Podman containerization technologies to encapsulate the entire open-source silicon toolchain . 

By operating at the operating system level, this tier provides a unified, isolated Linux filesystem—currently based on Ubuntu 24.04 LTS—that guarantees the execution environment is perfectly reproducible across completely disparate host machines . The container architecture natively supports both x86_64/amd64 and aarch64/arm64 instruction sets, allowing researchers to run complex VLSI flows on standard Windows workstations, macOS laptops, or enterprise Linux servers without undergoing the arduous process of compiling over fifty individual EDA tools from source code . 

Beyond mere binary distribution, the Tier 1 environment fundamentally solves graphical user interface (GUI) forwarding, which is essential for interactive layout editors like Magic and KLayout. The IIC-OSIC-TOOLS container natively bundles a full XFCE desktop environment accessible via a virtual network computing (VNC) server or a browser-based noVNC client, while also supporting direct local X11 server window forwarding . It manages critical filesystem permissions, mounting user design directories seamlessly via environment variables (such as `DESIGNS` and `CONTAINER_USER`), and even provides workarounds for memory management inefficiencies inherent in the Windows Subsystem for Linux (WSL2) to prevent out-of-memory kernel panics during high-intensity routing algorithms . Therefore, the characterization of Tier 1 as the "toolbox suitcase" is architecturally accurate; it provides the stabilized physical workspace within which the factory assembly line operates.

## Tier 2: Flow Orchestration and Pipeline Automation

If Tier 1 is the factory building, Tier 2 is the factory manager. The reference text correctly identifies the Flow Orchestrator—exemplified by OpenLane and its architectural successor, LibreLane—as the master pipeline manager . The orchestrator contains no inherent knowledge of how to mathematically optimize a boolean logic graph or route a physical metal wire to avoid short circuits. Its sole responsibility is operational scheduling, data translation, configuration management, and exit-status monitoring .

The OpenLane architecture delegates the RTL-to-GDSII process across a rigid sequence of specialized stages, converting high-level human intent into manufacturing data through sequential tool invocation. The flow begins with design entry, where the orchestrator ingests the user's Register Transfer Level (RTL) Verilog or SystemVerilog files alongside a configuration file (often JSON-based) that defines universal constraints such as the target clock period, absolute die area, core utilization density, and the specific PDK variant . 

Once initialized, the orchestrator triggers Tier 3 point tools step-by-step. It executes synthesis and logic optimization, static timing analysis, physical floorplanning, power distribution network (PDN) generation, global and detailed placement, clock tree synthesis, global and detailed routing, parasitic extraction, and final physical sign-off verification . At each stage, the orchestrator generates specialized command-line flags and script instructions tailored to the specific sub-tool, feeds the output of the previous stage into the next, and meticulously checks error logs to ensure no stage has silently failed or violated user constraints .

### The Evolution from OpenLane to LibreLane

The architectural maturity of the Tier 2 orchestrator has evolved significantly. The original OpenLane 1 framework was built primarily using a combination of Tcl (Tool Command Language), Makefiles, and bash scripts . While this architecture was revolutionary in lowering the barrier to entry for digital multi-project wafer (MPW) runs, it suffered from severe scalability and software engineering limitations. Tcl procedures manipulated global state variables haphazardly, making it exceptionally difficult to encapsulate states, execute concurrent tasks, or implement complex, non-linear flow logic (such as dynamic rewinding for engineering change orders) .

To resolve these structural deficiencies, the orchestration layer was rewritten from scratch, resulting in OpenLane 2 and its community-driven fork, LibreLane, maintained by the FOSSi Foundation . This next-generation architecture abandons the monolithic Tcl methodology in favor of a strictly object-oriented Python 3 framework . 

The LibreLane architecture introduces two foundational programmatic abstractions: `Step` and `Flow`. A `Step` acts as a discrete encapsulation of a single transformation, such as invoking `Yosys.Synthesis` or `OpenROAD.DetailedRouting` . Crucially, the architecture enforces strict immutability. Steps are programmatically prohibited from mutating input files or altering global configurations in place. Instead, a `Step` receives an immutable `State` object—containing references to the current design formats like the netlist and the layout database—executes its underlying algorithmic binary in an isolated directory, and emits an entirely new `State` object representing the transformed design . 

This immutability ensures perfect reproducibility and traceability. Because states are never discarded or overwritten, the orchestrator can rewind the entire physical design flow to any specific programmatic point, enabling complex design space exploration and precise debugging . Furthermore, LibreLane leverages the Nix package manager to provide hermetic builds, locking every dependency to a specific cryptographic hash . This ensures that the orchestrator behaves identically regardless of external operating system updates, achieving a level of deterministic flow control previously reserved for highly expensive proprietary EDA environments.

## The Metamorphosis of Data: Inter-Tool File Formats

To fully comprehend the orchestrator's function, one must analyze the intermediate data representations used to transfer state between the specialized Tier 3 tools. Because the tools are authored by different academic and industrial groups, they rely on standardized, vendor-neutral file formats .

The pipeline initiates with behavioral Verilog, representing the logical intent of the circuit. Following logic synthesis by Yosys, this behavioral code is transformed into a gate-level Verilog netlist, where the generic logic is mapped directly to specific standard cells (e.g., NAND, NOR, and D-Flip-Flops) defined by the target PDK . 

As the flow transitions into the physical domain, the orchestrator relies on the Library Exchange Format (LEF) and the Design Exchange Format (DEF). LEF files act as abstract geometric dictionaries. To conserve computational memory, routing and placement algorithms do not load the full transistor-level polygon data for every standard cell . Instead, a LEF file provides a simplified bounding box (defining the cell's physical width and height on the manufacturing grid) alongside the exact coordinates and metal layers of the input and output pins . If LEF provides the vocabulary, DEF provides the manuscript. The DEF file contains the exact placement coordinates of every instantiated standard cell across the die, as well as the topological geometry of the metal interconnects routed between them . 

Following detailed routing, the physical metal wires introduce parasitic resistance and capacitance (RC) based on their length, width, and proximity to neighboring wires. Tier 3 extraction tools read the DEF and generate a Standard Parasitic Exchange Format (SPEF) file . The SPEF file explicitly models these RC values as a highly complex electrical network, which is then fed back into timing analysis tools to compute highly accurate signal propagation delays .

The final output of the flow is the GDSII (Graphic Design System II) or OASIS file. Unlike the abstract LEF/DEF representations, the GDSII stream format is a massive binary file containing the absolute geometric coordinates of every polygon on every layer of the silicon wafer, from the lowest diffusion layers to the highest metal power grids . This is the exact blueprint transmitted to the semiconductor foundry for photolithographic mask production.

| File Format | Full Name | Role in the EDA Pipeline | Consuming/Producing Tools |
| :--- | :--- | :--- | :--- |
| **Verilog (.v)** | Hardware Description Language | Defines behavioral logic and gate-level netlists. | Yosys, OpenSTA, Verilator |
| **LEF (.lef)** | Library Exchange Format | Provides abstract bounding boxes and pin locations for standard cells to conserve RAM. | OpenROAD, Magic, QRouter |
| **DEF (.def)** | Design Exchange Format | Records the absolute placement coordinates and wire topologies across the chip die. | OpenROAD, Magic, KLayout |
| **SPEF (.spef)** | Standard Parasitic Exchange Format | Stores extracted resistance and capacitance (RC) values for interconnect wires. | OpenRCX, OpenSTA |
| **GDSII (.gds)** | Graphic Design System II | Contains the final, full-geometry polygonal data for all silicon and metal manufacturing masks. | Magic, KLayout, Foundry |

## Tier 3: The Algorithmic Workhorses and the OpenROAD Architecture

The true computational heavy lifting of the ecosystem resides in Tier 3. The reference text astutely highlights a historical bottleneck in academic EDA tools from circa 2018. Before the DARPA IDEA program, physical design required chaining together highly fragmented, standalone academic binaries . A dedicated placement tool would load a massive DEF file into memory, run its optimization algorithm, write a new DEF file to the hard drive, and terminate. A separate clock tree synthesis tool would then read that massive file back from the hard drive, perform its logic, and write it out again . This relentless file I/O overhead crippled execution speeds and prevented academic tools from scaling to multi-million gate SoC designs.

The OpenROAD project systematically eliminated this bottleneck by unifying the disparate academic tools—floorplanning, placement, clock tree synthesis, and routing—into a single compiled C++ binary . This unified application architecture enables all physical design stages to operate sequentially on a highly optimized, shared in-memory data model, bypassing disk I/O entirely until the flow is complete .

### OpenDB: The C++ In-Memory Database Core

The architectural foundation of OpenROAD's performance is OpenDB, a sophisticated design database originally developed by Athena Design Systems and subsequently open-sourced by Nefelus Inc. . OpenDB provides a binary serialization format that loads design states exponentially faster than parsing ASCII-based LEF and DEF files .

The most critical engineering achievement of OpenDB lies in its custom memory management architecture. Standard C++ dynamic memory allocation (utilizing `new`, `malloc`, or standard template library containers like `std::vector`) is fundamentally unsuited for large-scale VLSI databases. A modern chip design requires the instantiation of tens of millions of microscopic C++ objects representing logic instances, terminals, and routing segments. Standard allocation of these objects results in catastrophic memory fragmentation, where the operating system's heap becomes riddled with small, non-contiguous blocks of free memory . Furthermore, traversing a highly fragmented heap using standard 64-bit pointers introduces massive processor cache-miss penalties.

To achieve extreme performance, OpenDB bypasses the standard operating system allocator and implements a highly tuned page allocator located in `dbTable.hpp` . Within OpenDB, objects are allocated in dynamically resizable tables composed of distinct pages, where each page contains exactly 128 contiguous objects . The database stores the raw structural body of the objects directly in these tables rather than maintaining arrays of pointers to scattered heap locations .

Crucially, objects within OpenDB do not reference each other using 64-bit memory addresses. Instead, the database employs 32-bit Object Identifiers (OIDs) . An OID acts as a highly compact indexing mechanism: the lowest 7 bits of the identifier specify the object's index within a specific page, while the higher bits specify the page number itself . 

This OID-based architecture yields two profound architectural benefits. First, it eliminates the need for doubly-linked lists and pointer chasing, saving exactly 16 bytes of overhead per object, which translates to gigabytes of saved RAM on large designs . Second, because OIDs represent static table indices rather than ephemeral operating system RAM addresses, the exact memory layout of the entire chip database remains perfectly deterministic and persistent across disk save and restore operations . The complex private data structures (`_dbInst`, `_dbNet`) are hidden behind simplified public API facades (`dbInst`, `dbNet`), which are automatically wrapped using SWIG (Simplified Wrapper and Interface Generator) to provide instantaneous bindings for Tcl and Python scripts .

### RePlAce: Electrostatics-Based Global Placement

With the memory infrastructure established, OpenROAD executes global placement via RePlAce. Global placement is a highly constrained, non-linear optimization problem that seeks to map millions of standard cells to specific physical coordinates on the die. The primary objective is to minimize total wirelength to reduce signal delay and power consumption, while simultaneously satisfying strict density constraints to ensure that no two physical cells overlap .

Traditional algorithmic approaches to global placement, such as simulated annealing or min-cut partitioning, fail to scale efficiently to modern node sizes . RePlAce, inheriting its core mathematics from the earlier ePlace algorithm, treats the layout entirely as a continuous analytical mathematics problem . However, standard wirelength calculations based on Half-Perimeter Wirelength (HPWL) are mathematically non-differentiable (due to absolute value and max/min functions), making them invisible to standard gradient descent calculus. RePlAce solves this by employing a continuously differentiable Log-Sum-Exp (LSE) approximation of HPWL, creating a smooth mathematical topography that gradient solvers can navigate .

The revolutionary insight of RePlAce lies in its handling of cell density constraints through the physical analogy of electrostatics. The algorithm divides the entire silicon floorplan into a grid of discrete bins. Each logic cell is mathematically modeled as a positively charged physical particle, where the magnitude of the electric charge is directly proportional to the cell's physical silicon area . 

If too many logic cells are placed into the same geometric bin, the localized concentration of charge generates a mathematically high electric potential. According to Poisson's equation, this uneven potential distribution induces an electric field. In the context of placement, this electric field acts as a continuous repulsive force, naturally pushing the "charged" cells away from highly congested, overlapping regions and propelling them toward lower-density, empty regions of the die .

Calculating this electric field across millions of interacting particles would normally require $O(N^2)$ computational complexity, which is practically impossible for modern CPUs. RePlAce overcomes this by utilizing the Fast Fourier Transform (FFT). By transforming the spatial density distribution into the frequency domain, it solves Poisson's equation rapidly with $O(N \log N)$ complexity, allowing the repulsive forces to be updated dynamically at every iteration of the solver .

Furthermore, to traverse this complex mathematical terrain and find the absolute minimum wirelength, RePlAce utilizes Nesterov's accelerated gradient descent method rather than traditional Conjugate Gradient techniques . Nesterov optimization introduces a mathematical "momentum" term that remembers the trajectory of previous placement iterations. This prevents the solver from getting trapped in local minimums and drastically accelerates the convergence of the algorithm, effectively spreading heterogeneous mixtures of giant macro blocks and tiny standard cells across the die smoothly .

### TritonRoute: DRC-Clean Detailed Routing

Following placement and clock tree synthesis, the exact coordinates of every cell are locked. The final major challenge for OpenROAD is detailed routing, handled by the TritonRoute engine developed by researchers at the University of California, San Diego . TritonRoute must translate the abstract, logical connections between cells into exact geometric metal wire segments and layer-transitioning vias, all while strictly adhering to the foundry's microscopic Design Rule Checks (DRC) to prevent short circuits and manufacturing defects .

TritonRoute achieves a DRC-clean routing solution through a sequence of highly optimized stages:
1.  **Pin Access Analysis:** In deep submicron standard cells, the metal pins are incredibly small and often obstructed by neighboring geometries. TritonRoute features a "Pin Access Oracle" that analyzes every cell prior to routing, pre-calculating all physically legal access points and via dropping locations, ensuring the router does not trap itself when attempting to connect to a dense logic gate .
2.  **Track Assignment:** The algorithm projects a massive three-dimensional grid graph over the entire silicon die . It utilizes highly optimized, lightweight lookup tables to rapidly assign specific horizontal and vertical metal routing tracks to individual net topologies, systematically evaluating and resolving track-sharing conflicts before actual wire geometry is generated .
3.  **Detailed Routing and Search & Repair:** For the final connection, TritonRoute employs advanced maze-routing algorithms (heavily modified A* search variants) to draw the physical wires along the assigned tracks . Crucially, TritonRoute integrates an internal DRC engine. If a newly drawn wire segment violates a minimum spacing rule or a minimum area rule, the engine immediately flags the conflict, rips up the offending wire segment, and executes a localized search-and-repair algorithm to find an alternative, legally compliant path without disrupting the rest of the chip's routing .

### OpenSTA: Sign-Off Timing Analysis

Physical design is inherently useless if the resulting silicon cannot propagate electrical signals fast enough to meet the required clock frequency. OpenSTA, developed by Parallax Software, is a sign-off quality Static Timing Analysis (STA) engine embedded directly into the OpenROAD database architecture .

Unlike dynamic timing simulation, which requires the user to write exhaustive test benches to toggle specific inputs, STA mathematically analyzes the signal propagation delay of every possible topological path through the circuit simultaneously . OpenSTA constructs a massive directed acyclic graph representing the netlist. It calculates the total path delay by summing the intrinsic gate delays (read from characterized Liberty `.lib` files) and the interconnect wire delays (calculated from the extracted SPEF resistance and capacitance values) .

OpenSTA rigorously verifies two fundamental timing constraints defined in the user's SDC (Synopsys Design Constraints) file:
*   **Setup Time Checks:** The engine calculates the maximum signal arrival time through the longest path to ensure that data arrives at a sequential flip-flop a specific amount of time *before* the active clock edge strikes. If the signal propagates too slowly due to excessive wire capacitance or weak drive strength, the arrival time exceeds the required time, resulting in a negative Setup Slack (a timing violation) .
*   **Hold Time Checks:** Conversely, the engine calculates the minimum signal arrival time through the shortest path to ensure that data remains perfectly stable for a required duration *after* the clock edge. If a signal races through a path too quickly, it can corrupt the logic state intended for the subsequent clock cycle, resulting in a negative Hold Slack .

Because OpenSTA is linked directly to OpenDB, OpenROAD performs timing-driven placement. During the global placement phase, RePlAce can dynamically query OpenSTA to identify paths suffering from negative setup slack. RePlAce responds by assigning higher mathematical weights to the nets on those critical paths (or injecting virtual two-pin nets), which increases the localized electrostatic attractive force and actively pulls those specific timing-critical logic gates physically closer together on the silicon die, reducing wire capacitance and closing timing automatically .

## The Peripheral Precision Instruments

While OpenROAD acts as the massive central assembly unit, the OpenLane orchestrator relies on highly specialized point tools to bookend the flow, confirming the reference text's architectural categorization .

*   **Yosys and ABC:** Operating at the very front of the flow, Yosys (developed by Claire Wolf at YosysHQ) parses the behavioral Verilog RTL and translates it into an abstract logic graph . Integrated directly into Yosys is ABC, an algorithmic synthesis engine developed at UC Berkeley. ABC performs complex boolean logic optimization and maps the generic logic graph to the specific, physical standard cells provided by the target PDK, outputting the gate-level netlist required by OpenROAD .
*   **Magic VLSI and Netgen:** Operating at the end of the flow, Magic (developed by Prof. John Ousterhout) handles the final streaming of the GDSII file . It performs exhaustive, full-geometry Design Rule Checking (DRC) on the microscopic polygonal shapes to ensure manufacturing viability . Magic also extracts the final physical SPICE netlist from the layout, which is handed to Netgen. Netgen performs Layout Versus Schematic (LVS) comparison, rigorously mathematically proving that the geometric transistors physically drawn by Magic perfectly match the logical gate connections originally requested by Yosys .
*   **KLayout and CVC:** KLayout provides high-speed, hardware-accelerated visualization of the multi-gigabyte GDSII files, capable of rapid geometric boolean operations . CVC (Circuit Validity Checker) serves as the final electrical rule checker, scanning the database for fatal electrical violations, such as floating transistor terminals or logic gates incorrectly shorted directly to the high-voltage power grids .

## The Global Democratization of Silicon: VLSI Research in Dhaka

The architectural sophistication of the open-source EDA ecosystem, combined with the availability of open PDKs, has fundamentally dismantled the financial barriers to advanced semiconductor research. Historically, academic institutions in developing nations were relegated to FPGA-based hardware research because proprietary ASIC toolchains carried licensing fees scaling into the millions of dollars per year, and commercial foundries guarded their PDKs behind strict non-disclosure agreements .

The open-source silicon paradigm has catalyzed a global research renaissance. A rigorous analysis of contemporary academic literature and institutional repositories reveals that this exact tooling infrastructure is being deployed for advanced ASIC research in Dhaka, Bangladesh. Significant VLSI contributions utilizing OpenROAD, OpenLane, and Yosys are currently emerging from three leading institutions: Ahsanullah University of Science and Technology (AUST), Bangladesh University of Engineering and Technology (BUET), and BRAC University.

### Ahsanullah University of Science and Technology (AUST)

At AUST, researchers in the Department of Electrical and Electronic Engineering are actively leveraging the OpenROAD and Yosys architectures to execute physical design research at the extreme edges of Moore's Law. Notably, research spearheaded by Saeed Hossen Rakib and Professor Satyen Biswas has successfully demonstrated the complete physical design (PD) of an Internet of Things (IoT) hardware device optimized specifically for vehicle detection systems .

Rather than utilizing older, planar 130nm technology nodes, the AUST researchers explicitly targeted the ASAP7 PDK . ASAP7 is a predictive 7nm FinFET process design kit developed by Arizona State University, featuring advanced node patterning technologies, single diffusion breaks, and highly restrictive dense crossover rules . The research addressed the severe power, performance, and area (PPA) constraints endemic to edge-deployed IoT endpoints. By orchestrating the flow through Yosys and the OpenROAD C++ database, the AUST team iteratively swept design constraints to minimize dynamic power consumption while maximizing clock frequency . This work proves that the open-source EDA ecosystem is sufficiently robust to allow academic researchers in Dhaka to perform highly relevant physical design research targeting modern, sub-10nm FinFET architectures.

### Bangladesh University of Engineering and Technology (BUET)

BUET maintains a long-standing legacy of advanced cryptographic hardware research. Early iterations of this research, led by faculty such as Md. Liakot Ali, Niranjan Roy, and Fakir Sharif Hossain, focused heavily on designing ultra-high-speed Advanced Encryption Standard (AES) crypto-processors . While these early designs were highly optimized to resist differential cryptanalysis and achieve multi-gigabit throughput, they were largely constrained to FPGA implementations for physical validation .

The advent of the OpenLane flow has empowered BUET researchers to transition these complex designs into true ASIC implementations. Recent projects deposited in BUET repositories document the complete RTL-to-GDSII physical design of modular 32-bit Carry Look-Ahead Adders utilizing the SkyWater 130nm PDK . These projects exhibit a sophisticated mastery of the OpenLane orchestrator. The BUET researchers utilized SystemVerilog for modular design (separating generate-propagate and base4-carry units) and achieved comprehensive functional verification using 1024-bin coverage models scaling up to 240,000 transactions . 

Crucially, the researchers pushed the design through the physical implementation engines, orchestrating parameter sweeps to optimize operational frequencies ranging from 1MHz up to 1GHz . The final physical design metrics extracted from OpenROAD—including a core design density of 23.96%, an absolute silicon area of 169 μm², and a successfully closed timing model with a positive slack of 8.541 ns—demonstrate that BUET is successfully utilizing open-source tools to execute fully verified, tapeout-ready physical designs . Furthermore, this ecosystem is actively supported by regional industry initiatives like the Silicon Valley VLSI Vision Academy, which utilizes these exact open-source flows to train fresh graduates from BUET, RUET, and CUET in advanced physical design methodologies, bridging the gap between academic theory and semiconductor industry demands .

### BRAC University

BRAC University has contributed significantly to the open-source silicon movement through the implementation of complex, heterogeneous System-on-a-Chip (SoC) architectures. A premier example of this is the "Ibtida" project, representing the cutting edge of agile hardware design methodologies .

Rather than utilizing traditional Verilog RTL, the BRAC researchers, including Md. Shyeem Rahman, utilized Chisel (Constructing Hardware in a Scala Embedded Language) as their primary hardware generator . The Ibtida SoC features a fully functioning 5-stage pipelined 32-bit RISC-V processor core (RV32IM architecture) integrated seamlessly with a custom 4x4 Convolutional Neural Network (CNN) Multiply-Accumulate (MAC) array accelerator . 

Following logic simulation via Verilator, the Chisel-generated RTL was pushed through the entire OpenLane pipeline targeting the SkyWater 130nm node . The research documented the successful execution of automated placement and routing for the entire microprocessor and neural network accelerator complex, culminating in a DRC-clean GDSII layout . This thesis work highlights the true paradigm shift enabled by the open-source EDA ecosystem: the ability of a small team of academic researchers in Bangladesh to design, verify, and physically implement custom silicon microprocessors and AI accelerators—a feat that, a decade ago, would have required the massive engineering budgets and proprietary tooling of a major semiconductor corporation.

| Academic Institution | Key Open-Source Tools Deployed | Target PDK | Focus of VLSI Research |
| :--- | :--- | :--- | :--- |
| **Ahsanullah University of Science and Technology (AUST)** | Yosys, OpenROAD | ASAP7 (7nm FinFET) | Physical design of IoT vehicle detection systems; extreme PPA constraint optimization. |
| **Bangladesh University of Engineering and Technology (BUET)** | OpenLane, OpenROAD, SystemVerilog | SkyWater 130nm | High-speed arithmetic units (Carry Look-Ahead Adders) and AES crypto-processors; extensive physical parameter sweeping. |
| **BRAC University** | Chisel, Verilator, OpenLane | SkyWater 130nm | "Ibtida" SoC; integration of a 5-stage 32-bit RISC-V CPU core with a hardware CNN MAC array accelerator. |

## Conclusion

The open-source electronic design automation ecosystem, verified through this deep architectural analysis, represents a triumph of modern software engineering applied to hardware synthesis. The three-tiered architecture accurately models the immense complexity of VLSI implementation by strictly dividing responsibilities. By isolating the operating system environment through containerization tools like IIC-OSIC-TOOLS, ensuring perfect state reproducibility through Python-based orchestrators like LibreLane, and centralizing the physical geometry manipulation within the C++ OpenROAD engine, the ecosystem achieves industrial-grade reliability and scalability. 

The algorithmic innovations embedded within Tier 3—ranging from OpenDB's highly optimized, OID-based memory paging allocator, to RePlAce's FFT-driven electrostatic density optimization, and TritonRoute's DRC-clean maze routing methodologies—rival the mathematical sophistication of commercial proprietary toolchains. 

Ultimately, the most profound impact of this architectural robustness is its democratizing effect on the global semiconductor industry. The empirical evidence from Dhaka, Bangladesh, clearly demonstrates that academic institutions such as AUST, BUET, and BRAC University are actively leveraging tools like Yosys, OpenROAD, and OpenLane to execute highly complex, advanced-node ASIC research, ranging from 7nm IoT hardware to custom RISC-V microprocessors. The proliferation of this open-source infrastructure has successfully transformed regions formerly constrained by software licensing barriers into highly capable, active contributors to the global silicon design landscape. 


## Sources

- [**idus.us.es** On the Use of Open-Source EDA Tools for Teaching and Learning](https://idus.us.es/bitstreams/0e42b0a7-a361-4a08-9944-9f45cdb56dc9/download)
- [**pmc.ncbi.nlm.nih.gov** Design of a BIST implemented AES crypto-processor ASIC - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8594793/)
- [**en.wikipedia.org** Placement (electronic design automation) - Wikipedia](https://en.wikipedia.org/wiki/Placement_(electronic_design_automation))
- [**github.com** GitHub - iic-jku/IIC-OSIC-TOOLS](https://github.com/iic-jku/iic-osic-tools)
- [**dspace.bracu.ac.bd** development of custom risc-v central processing unit (cpu) with open](https://dspace.bracu.ac.bd/bitstreams/1ba6c922-a65f-44c1-92e5-b12459976944/download)
- [**crowdsupply.com** Easier Design Flow: LibreLane & the gf180mcu Project Template](https://www.crowdsupply.com/wafer-space/gf180mcu-run-1/updates/librelane-template)
- [**researchgate.net** Implementing Yosys & OpenROAD for Physical Design (PD) of an](https://www.researchgate.net/publication/390581827_Implementing_Yosys_OpenROAD_for_Physical_Design_PD_of_an_IoT_Device_for_Vehicle_Detection_via_ASAP7_PDK)
- [**github.com** GitHub - The-OpenROAD-Project/OpenDB: Database and Tool](https://github.com/The-OpenROAD-Project/OpenDB)
- [**woset-workshop.github.io** OpenDB, OpenROAD's Database - woset-workshop](https://woset-workshop.github.io/PDFs/2019/a6.pdf)
- [**github.com** iic-osic-tools - GitHub](https://github.com/chiplicity/iic-osic-tools)
- [**research.jku.at** IIC-OSIC-TOOLS - JKU & KUK Research Portal](https://research.jku.at/en/publications/iic-osic-tools/)
- [**pypi.org** librelane - PyPI](https://pypi.org/project/librelane/)
- [**armleo-openlane.readthedocs.io** OpenLane Documentation - Read the Docs](https://armleo-openlane.readthedocs.io/en/merge-window-4/)
- [**openlane2.readthedocs.io** Newcomers - OpenLane Documentation](https://openlane2.readthedocs.io/en/latest/getting_started/newcomers/index.html)
- [**anysilicon.com** The Ultimate Guide to Open Source EDA Tools - AnySilicon](https://anysilicon.com/the-ultimate-guide-to-open-source-eda-tools/)
- [**github.com** OpenLANE-Sky130-Physical-Design-Workshop - GitHub](https://github.com/AngeloJacobo/OpenLANE-Sky130-Physical-Design-Workshop)
- [**woset-workshop.github.io** OpenLane 2: Making the Most Popular Open Source ASIC Flow](https://woset-workshop.github.io/PDFs/2024/17_OpenLane_2_Making_the_Most_.pdf)
- [**github.com** GitHub - chipfoundry/openlane2: The next generation of OpenLane](https://github.com/chipfoundry/openlane2)
- [**fossi-foundation.org** Announcing the Release of LibreLane - FOSSi Foundation](https://fossi-foundation.org/blog/2025-08-17-librelane)
- [**colab.research.google.com** notebook.ipynb - OpenLane Colab](https://colab.research.google.com/github/efabless/openlane2/blob/main/notebook.ipynb)
- [**github.com** GitHub - KanishR1/Physical-Design-Using-Openlane](https://github.com/KanishR1/Physical-Design-Using-Openlane)
- [**arxiv.org** AiEDA: An Open-Source AI-Aided Design Library for Design-to-Vector](https://arxiv.org/pdf/2511.05823)
- [**github.com** Physical-Design-with-OpenLANE-using-SKY130-PDK - GitHub](https://github.com/shariethernet/Physical-Design-with-OpenLANE-using-SKY130-PDK)
- [**imm.dtu.dk** Introduction to Chip Design](https://www.imm.dtu.dk/~masca/chip-design-book.pdf)
- [**researchgate.net** (PDF) IBTIDA: Fully open-source ASIC implementation of Chisel](https://www.researchgate.net/publication/355058347_IBTIDA_Fully_open-source_ASIC_implementation_of_Chisel-generated_System_on_a_Chip)
- [**springerprofessional.de** Open-source design of integrated circuits | springerprofessional.de](https://www.springerprofessional.de/en/open-source-design-of-integrated-circuits/26612082)
- [**woset-workshop.github.io** OpenLANE: The Open-Source Digital ASIC Implementation Flow](https://woset-workshop.github.io/PDFs/2020/a21.pdf)
- [**researchgate.net** Building OpenLANE: a 130nm openroad-based tapeout-proven flow](https://www.researchgate.net/publication/347688459_Building_OpenLANE_a_130nm_openroad-based_tapeout-proven_flow)
- [**handwiki.org** Engineering:OpenROAD Project - HandWiki](https://handwiki.org/wiki/Engineering:OpenROAD_Project)
- [**openroad.readthedocs.io** OpenDB - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/odb/README.html)
- [**medium.com** Memory Management in C++ - Medium](https://medium.com/@lfoster49203/memory-management-in-c-4702b7a0a708)
- [**developer.ibm.com** Building your own memory manager for C/C++ projects](https://developer.ibm.com/tutorials/au-memorymanager/)
- [**vlsicad.ucsd.edu** RePlAce: Advancing Solution Quality and Routability Validation in](https://vlsicad.ucsd.edu/Publications/Journals/j126.pdf)
- [**mdpi.com** Progress of Placement Optimization for Accelerating VLSI Physical](https://www.mdpi.com/2079-9292/12/2/337)
- [**cse.cuhk.edu.hk** Evolution of Optimization Algorithms for Global Placement via Large](https://www.cse.cuhk.edu.hk/~byu/papers/J185-TCAD2026-EvoPlace.pdf)
- [**researchgate.net** (PDF) ePlace: Electrostatics-Based Placement Using Fast Fourier](https://www.researchgate.net/publication/279291310_ePlace_Electrostatics-Based_Placement_Using_Fast_Fourier_Transform_and_Nesterov's_Method)
- [**semanticscholar.org** TritonRoute: The Open-Source Detailed Router - Semantic Scholar](https://www.semanticscholar.org/paper/TritonRoute%3A-The-Open-Source-Detailed-Router-Kahng-Wang/082500e127a061f8cd13d5fa0e609da66ce42ee2)
- [**github.com** The-OpenROAD-Project/TritonRoute: UCSD Detailed Router - GitHub](https://github.com/the-openroad-project/tritonroute)
- [**vlsicad.ucsd.edu** An Initial Detailed Router for Advanced VLSI Technologies](https://vlsicad.ucsd.edu/Publications/Conferences/363/c363.pdf)
- [**openroad.readthedocs.io** Detailed Routing - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/drt/README.html)
- [**github.com** ABKGroup/TritonRoute-WXL - GitHub](https://github.com/ABKGroup/TritonRoute-WXL)
- [**vlsicad.ucsd.edu** TritonRoute: The Open Source Detailed Router](https://vlsicad.ucsd.edu/Publications/Journals/j133.pdf)
- [**github.com** Static Timing Analysis (STA) using OpenSTA - GitHub](https://github.com/16chaurasiaprakhar-stack/Static-Timing-Analysis_-STA-)
- [**vlsiguru.com** Beginner's Static Timing Analysis Guide | STA Explained Simply](https://vlsiguru.com/blog/beginners-static-timing-analysis-guide-sta-explained)
- [**past.date-conference.com** Electrostatics-Based Analytical Global Placement for Timing](https://past.date-conference.com/proceedings-archive/2024/DATA/304_pdf_upload.pdf)
- [**siliconpath.in** Setup Time, Hold Time & Slack: Static Timing Analysis | SiliconPath](https://siliconpath.in/learn/static-timing-analysis/setup-hold-slack-analysis)
- [**youtube.com** Introduction & Tutorial | Open-Source Tools for Digital Designs](https://www.youtube.com/watch?v=AiFTwKdS2V4)
- [**journals.sru.ac.ir** Implementing Yosys & OpenROAD for Physical Design (PD) of an](https://journals.sru.ac.ir/article_2315.html)
- [**researchgate.net** Satyen BISWAS | Ph.D. in Electrical and Systems Engineering](https://www.researchgate.net/profile/Satyen-Biswas-2)
- [**researchgate.net** Saeed Hossen Rakib B.Sc. in Electrical and Electronic Engineering](https://www.researchgate.net/profile/Saeed-Rakib)
- [**researchgate.net** Niranjan Roy's research works | Bangladesh University of](https://www.researchgate.net/scientific-contributions/Niranjan-Roy-69608841)
- [**github.com** This repository contains a 16-bit Carry-Lookahead Adder ... - GitHub](https://github.com/anindyakchoudhury/ASIC-Project-Carry-Look-Ahead-Adder)
- [**facebook.com** Silicon Valley VLSI Vision Academy VLSI Design Training Program](https://www.facebook.com/siliconvalleyvlsivisionacademy/videos/unlock-your-career-in-the-semiconductor-industry-with-our-industry-standard-vlsi/1760208204531777/)
- [**datasetcatalog.nlm.nih.gov** OpenLane SKY130A Parameter Sweep Dataset: 1,440-Run RTL-to](https://datasetcatalog.nlm.nih.gov/dataset?q=0003327999)
- [**github.com** Markov-Chains/crunchbase.txt at master - GitHub](https://github.com/bradjasper/Markov-Chains/blob/master/crunchbase.txt)
- [**github.com** Tweets-Classification-NLP/test.csv at main - GitHub](https://github.com/IMvision12/Tweets-Classification-NLP/blob/main/test.csv)
- [**github.com** jobdating/companylist.py at master - GitHub](https://github.com/imlocle/jobdating/blob/master/companylist.py)
- [**openroad.com.bd** Openroad](https://openroad.com.bd/)
- [**skywaterbangladesh.com** Our Projects Areas - Sky Water Bangladesh](https://skywaterbangladesh.com/home/our-projects-areas/)
- [**riscv.org** Improving the OpenLane ASIC build flow with open source](https://riscv.org/blog/improving-the-openlane-asic-build-flow-with-open-source-systemverilog-support-antmicro/)
- [**skywaterbangladesh.com** Sky Water Bangladesh – …for health happiness and peace](https://skywaterbangladesh.com/home/)
- [**skywatertechnology.com** Privacy Policy | SkyWater Technology](https://www.skywatertechnology.com/privacy-policy/)
- [**waterforum.jp** Interim report on AQUA PROGRAM 2025-2026！ | 日本水フォーラム](https://www.waterforum.jp/en/news/24426/)
- [**farimah.ece.ufl.edu** People – Farimah Farahmandi, Ph.D. - University of Florida](https://farimah.ece.ufl.edu/people/)
- [**ulab.edu.bd** Bashirul Azam Biswas | ULAB - University of the future](https://ulab.edu.bd/faculty/bashirul-azam-biswas)
- [**aust.edu** Dr. Fakir Sharif Hossain - AUST](https://www.aust.edu/eee/faculty_member/dr_fakir_sharif_hossain)
- [**github.com** OpenDB/LICENSE at master - The-OpenROAD-Project - GitHub](https://github.com/The-OpenROAD-Project/OpenDB/blob/master/LICENSE)
- [**escholarship.org** UC San Diego Electronic Theses and Dissertations - eScholarship.org](https://escholarship.org/content/qt0tk5z26h/qt0tk5z26h.pdf)
- [**librelane.readthedocs.io** Built-in Steps and their Configuration Variables](https://librelane.readthedocs.io/en/stable/reference/step_config_vars.html)
- [**scribd.com** UG Electronics & Telecommunication Courses | PDF - Scribd](https://www.scribd.com/document/943413781/UG-ETCE-Details-Syllabus-2025-29)
- [**scribd.com** Sharing Research via TechRxiv | PDF | Electrical Engineering - Scribd](https://www.scribd.com/document/672697018/IEEE-Solid-States-Circuits-Magazine-Vol-15-No-2-Spring-2023)
- [**scribd.com** B.E. Electrical & Electronics Syllabus 2022 | PDF | Engineering](https://www.scribd.com/document/865076415/BE-SYLLABUS)
- [**wichita.edu** Asaduzzaman - Wichita State University](https://www.wichita.edu/academics/engineering/ECE/research/CAPPLab/_documents/HTML/Asaduzzaman_CV.htm)
- [**static.fossee.in** eSim Summer Fellowship 2026 - FOSSEE](https://static.fossee.in/fossee/reports-2026/Fellowship-2026/eSim/Deepika.pdf)
- [**openlane2.readthedocs.io** OpenLane Documentation](https://openlane2.readthedocs.io/)
- [**youtube.com** Webinar: OpenLane 2 & LibreLane Updates - YouTube](https://www.youtube.com/watch?v=nA9UMsEA_KY)
- [**scribd.com** Openroad Readthedocs Io en Latest | PDF - Scribd](https://www.scribd.com/document/761917989/openroad-readthedocs-io-en-latest)
- [**yibolin.com** Optimizing Routability via Unified Placement and Routing Formulation](https://yibolin.com/publications/papers/PLACE_DAC2025_Chen.pdf)
- [**circuit.quest** What TritonRoute Actually Does | Circuit Quest](https://circuit.quest/courses/rtl-to-gds-openlane/module-06/06-02-detailed-routing/01-what-tritonroute-actually-does/)
- [**vlsicad.ucsd.edu** TritonRoute-WXL: The Open Source Router with Integrated DRC](https://vlsicad.ucsd.edu/Publications/Journals/j136.pdf)
- [**par.nsf.gov** TritonRoute: The Open Source Detailed Router | NSF Public Access](https://par.nsf.gov/biblio/10171008-tritonroute-open-source-detailed-router)
- [**cse.cuhk.edu.hk** High-Performance Detailed Routing With Route-Based ILP and](https://www.cse.cuhk.edu.hk/~byu/papers/J193-TCAD2026-DRoute.pdf)
- [**docs.o3de.org** Using Memory Allocators in O3DE - Open 3D Engine](https://docs.o3de.org/docs/user-guide/programming/memory/allocators/)
- [**slideshare.net** C++ Advanced Memory Management With Allocators - Slideshare](https://www.slideshare.net/slideshow/c-advanced-memory-management-with-allocators/230393446)
- [**research.google** Learning-based Memory Allocation for C++ Server Workloads](https://research.google/pubs/learning-based-memory-allocation-for-c-server-workloads/)
- [**forum.osdev.org** Example page allocator & virtual memory manager? - OSDev.org](https://forum.osdev.org/viewtopic.php?t=57578)
- [**vlsisystemdesign.com** Sign-off Timing Analysis - Basics to Advanced using OpenSTA](https://www.vlsisystemdesign.com/sign-off-timing-analysis-basics-to-advanced/)
