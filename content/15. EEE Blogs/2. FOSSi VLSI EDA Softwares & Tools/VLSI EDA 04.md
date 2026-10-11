# Open-Source EDA Flow Orchestration Platforms and Toolchains: From RTL to GDSII

## CHAPTER 1: Introduction to FOSSi and the Taxonomy of EDA Systems

### Historical Evolution of Free and Open Source Silicon (FOSSi)
The semiconductor industry has historically operated within a paradigm of extreme propriety, dominated by a highly consolidated oligopoly of Electronic Design Automation (EDA) software vendors. For decades, the realization of Application-Specific Integrated Circuits (ASICs) and System-on-Chip (SoC) architectures was restricted by multimillion-dollar licensing fees, stringent Non-Disclosure Agreements (NDAs), and closed-source binary execution models that obscured algorithmic implementation details. This closed ecosystem severely stifled academic research, throttled the educational pipeline for physical design engineers, and restricted small-to-medium enterprises from iterating on custom silicon designs. The democratization of open-source silicon fundamentally shifted this paradigm, catalyzed predominantly by the DARPA Intelligent Design of Electronic Assets (IDEA) and Posh Open Source Hardware (POSH) programs . The IDEA program established the ambitious mandate of achieving a 24-hour, no-human-in-the-loop (NHIL) automated layout generation pipeline with zero loss of power, performance, and area (PPA) quality . 

Concurrently, a watershed moment occurred in 2020 when Google and SkyWater Technology released the SKY130 Process Design Kit (PDK) under an open-source license . This was subsequently followed by the GlobalFoundries GF180MCU PDK and the IHP SG13G2 BiCMOS process, which boasts the world's fastest silicon-germanium transistors . By decoupling the foundry manufacturing rules, standard cell libraries, and parasitic extraction tables from proprietary NDAs, the open-source community was finally able to build, benchmark, and tape-out physical silicon using a completely unrestricted software stack . This confluence of open foundry data and DARPA-funded EDA research birthed the modern FOSSi ecosystem.

### The Structural Open-Source Taxonomy
To comprehend the modern FOSSi landscape, one must architecturally distinguish between the four fundamental tiers of the open-source EDA software stack. The first tier consists of Fragmented Point Tools. Historically, open-source EDA consisted of highly fragmented applications strictly constrained to a singular algorithmic task. Tools such as Yosys for logic synthesis, Magic VLSI for physical layout and Design Rule Checking (DRC), and Netgen for Layout vs. Schematic (LVS) validation operate in completely isolated memory spaces . These binaries require explicit file-based disk I/O to communicate. A point tool parses an input file, constructs its own internal graph or geometric data structure, executes its optimization pass, and serializes the result back to disk. This fragmentation introduces massive parsing overhead, data precision loss during format conversion, and the absolute inability to perform cross-domain optimization, such as simultaneous logic restructuring and physical placement.

The second tier comprises Native Unified Database Application Binaries. To solve the disk I/O and data-silo bottlenecks, the academic and industrial communities transitioned to unified in-memory databases, best exemplified by the OpenROAD project and its underlying OpenDB architecture . Instead of passing text files between isolated algorithms, OpenROAD compiles disparate physical design engines into a single, shared-memory C++ executable. All algorithmic sub-engines query and mutate a singular, persistent instance of the OpenDB schema . This architecture eradicates the disk read/write penalty during the critical iterations between placement, parasitic extraction, and Static Timing Analysis (STA), enabling instantaneous feedback loops essential for rapid timing closure.

The third tier encompasses Flow Orchestration Platforms and Automated Toolchains. An orchestration platform acts as the automated general contractor, executing complex directed acyclic graphs (DAGs) of tool invocations. Platforms like OpenLane 2 and SiliconCompiler do not place gates or route wires themselves; rather, they manage the intricate plumbing, dependency resolution, configuration state, and intermediate data transformations required to drive point tools and unified databases . They abstract away the massive complexity of thousands of discrete variables, providing a hermetic, reproducible execution environment that marches Register-Transfer Level (RTL) code through synthesis, floorplanning, placement, routing, and signoff verification autonomously .

The fourth tier involves Pre-Packaged Containerized Operating Environments. Because open-source EDA relies on bleeding-edge C++ compilers, specific Python dependencies, and heavily patched libraries, compilation drift across different host operating systems causes catastrophic failure rates . Containerized environments, such as IIC-OSIC-TOOLS, encapsulate the entire compiled EDA toolchain, the orchestration platforms, and the open-source PDKs within Docker or Podman images . This completely normalizes the execution environment, ensuring that the identical binary bits are executed regardless of whether the host is a Linux server or a macOS workstation.

### The Automation Paradigm Shift
Manual tool-stitching relies heavily on human intuition and bespoke shell scripts, introducing severe structural mathematics and time penalties. Generating an intermediate Design Exchange Format (DEF) file from a placer, writing it to a solid-state drive, reading it into a router, parsing the ASCII text into an internal spatial tree, and resolving syntax discrepancies routinely consumes the majority of total runtime in a fragmented flow. Furthermore, manual execution lacks automated feedback loops. If a detailed router encounters congestion, a manual flow requires a human to pause, revert to placement, adjust padding variables, and re-run the layout. Automated platform orchestration fundamentally shifts this paradigm by implementing closed-loop programmatic controllers that mathematically analyze overflow metrics, adjust cell padding densities dynamically, and recursively execute localized resynthesis without human intervention .

## CHAPTER 2: Exhaustive Engineering Analysis of Top-Tier All-in-One Orchestrators

### OpenLane & OpenLane 2
Originally developed by Efabless to support the SkyWater 130nm multi-project wafer (MPW) shuttles, OpenLane evolved from a monolithic Tcl-based script wrapper into OpenLane 2, a highly rigorous, object-oriented Python infrastructure . OpenLane 2 completely reimagines flow orchestration through strict architectural enforcement of immutability and hermeticity . The software architecture is predicated on the `openlane.state.State` object, which encapsulates an immutable mapping of Design Formats to absolute file paths . Because the state object cannot be mutated in place, every discrete execution block—defined as an `openlane.steps.Step`—must take an input `State` and a `Config` object, and emit a distinctly new output `State` . 

Steps are executed within isolated, dedicated step directories, operating as secure scratch spaces. OpenLane 2 enforces rigid execution strictures: a step cannot modify files outside its step directory, cannot modify its input configuration, and cannot rely on filesystem paths absent from the configuration object . This guarantees absolute reproducibility; if the flow fails at a late stage, the physical design engineer can programmatically rewind the execution pipeline to the precise immutable output of any previous step, inject a localized configuration mutation, and resume execution without compromising the integrity of the data provenance .

### OpenROAD
The OpenROAD application is a natively unified C++ binary serving as the core engine for digital place and route . The fundamental enabling technology within OpenROAD is OpenDB, a high-performance in-memory database schema originally based on Cadence LEF/DEF 5.6 constructs . OpenDB separates implementation from interface; for example, the class `dbInst` provides the public API accessors, while `_dbInst` holds the private memory fields . 

Crucially, OpenDB circumvents traditional pointer-chasing overhead by allocating objects in dynamically resizable tables composed of pages containing precisely 128 objects each . This schema stores the actual bodies of the structs sequentially in memory rather than utilizing double-linked lists of pointers. This architectural decision eliminates 16 bytes of pointer overhead per object and enables high-speed cache-local iteration across millions of standard cells . Objects are referenced via a persistent 32-bit Object Identifier (OID), allowing the entire internal memory layout of a multi-million gate chip to be flushed to a highly compressed binary disk format and reloaded instantaneously . OpenROAD embeds Tcl as its control plane, wrapping the underlying C++ libraries via SWIG (Simplified Wrapper and Interface Generator), allowing users to execute commands that invoke deeply integrated sub-engines .

### SiliconCompiler
SiliconCompiler introduces a generalized, hardware-agnostic compilation framework inspired by the LLVM software compiler infrastructure . Rather than hardcoding tool execution sequences, SiliconCompiler utilizes a robust, unified Schema Graph API to define data schemas, targets, and tool mappings . It abstracts execution environments allowing workloads to be parallelized across local multiprocessors, distributed Slurm clusters, or multi-cloud execution strategies seamlessly. SiliconCompiler distinguishes itself by generalizing the flow to target both ASICs and FPGAs. It standardizes the schema so that swapping the synthesis target from a Sky130 ASIC to a Lattice iCE40 FPGA requires mutating only a single configuration parameter, while the orchestrator dynamically resolves the divergent underlying toolchains and intermediate representation graphs.

### iEDA / iPD
Developed as an AI-native, industrial-grade open-source infrastructure by the OSCC Project, iEDA provides a high-reliability C++ alternative to the OpenROAD ecosystem . iEDA encompasses a proprietary unified data model serving distinct C++ modules: iPL for placement, iCTS for clock tree synthesis, iRT for routing, and iSTA for static timing analysis . Unlike script-heavy wrappers, iEDA is architected specifically to support extreme-scale gate counts, enabling tapeouts exceeding 1.5 million gates at the 28nm node . The iPL engine leverages advanced non-linear multi-electrostatics systems for placement, utilizing self-adaptive quadratic density penalties to stabilize mathematical convergence . Furthermore, iEDA exposes specific memory-mapped hooks for deep learning and reinforcement learning agents to directly interface with the physical database, facilitating next-generation AI-driven floorplanning and parameter tuning without Inter-Process Communication latency .

### Qflow
Qflow represents the pioneering legacy reference flow for open-source digital synthesis, curated by Tim Edwards . Written primarily in Tcl and Bash, Qflow established the feasibility of an open-source pipeline by orchestrating Yosys for logic synthesis, Graywolf for placement, Qrouter for detailed maze routing, and Magic VLSI for verification . While lacking the in-memory integration of modern tools—it relies heavily on serializing and parsing ASCII DEF files at every juncture—Qflow remains highly relevant for educational instruction, rapid prototyping of smaller microcontroller cores like the RISC-V or OpenMSP430, and environments where compiling massive monolithic C++ binaries is computationally prohibitive .

### Orchestration Platform Structural Comparison

| Platform Name | Primary Execution Language | Internal Database / Schema Structure | Multi-threading Capacity | Cloud / Grid Readiness | Native PDK Compatibilities | Core System Architecture |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **OpenLane 2** | Python 3.8+ / Tcl | JSON / Immutable `State` Objects | Inherited from sub-tools | High (via Docker/Nix) | Sky130, GF180MCU | Hermetic step execution, DAG-based configuration builder, strictly encapsulated I/O. |
| **OpenROAD** | C++17 / Tcl | Native OpenDB (Binary Page Tables) | Extensive (OpenMP threads for STA/Routing) | Medium (Cloud-native execution wrappers) | Sky130, GF180MCU, ASAP7, TSMC65 | Monolithic shared-memory application; sub-engines operate directly on unified pointers. |
| **SiliconCompiler**| Python | Standardized LLVM-style Graph API | Extensive (Parallel tool execution) | Extremely High (Native Slurm/Cloud support) | Sky130, ASIC/FPGA targets | Abstracted compiler toolchain; dynamically maps logical steps to physical node execution. |
| **iEDA / iPD** | C++17 / Python | Modular C++ Data Structures | High (Custom C++ Thread Pools) | Medium | 110nm, 28nm, Sky130 | AI-native framework with direct memory-mapped hooks for Reinforcement Learning agents. |
| **Qflow** | Bash / Tcl | Fragmented (Filesystem driven) | Low (Single-threaded binaries) | Low (Local script execution) | OSU035, Sky130 | Sequential bash shell execution invoking isolated single-task point tools. |

## CHAPTER 3: The Underlying Anatomy & Complete Point-Tool Mapping

To understand flow orchestration, one must completely deconstruct the pipeline into its constituent mathematical and algorithmic engines. Every phase of the physical design pipeline relies on discrete mathematical solvers.

### Front-End Synthesis & Optimization
Yosys, developed by Clifford Wolf, is the foundational RTL synthesis framework. It mathematically parses high-level structural and behavioral Verilog and SystemVerilog into an internal Abstract Syntax Tree (AST) . Through a series of optimization passes, Yosys translates the AST into a technology-independent netlist comprised of internal coarse-grain cells . Yosys serializes this logic and passes it to the Berkeley Logic Synthesis and Verification Group's ABC engine. ABC operates on And-Inverter Graphs (AIGs) or Majority-Inverter Graphs (MIGs) to perform aggressive Boolean logic optimization . During technology mapping, ABC utilizes advanced cut-enumeration algorithms, such as FlowMap, to compute the mathematically optimal mapping of the AIG nodes into discrete standard cells defined in the foundry's Liberty models, optimizing for either minimal logic depth or minimal area . The synthesized gate-level netlist is returned to Yosys and emitted as structural Verilog for the physical design tools.

### Physical Planning & Geometry Optimization (OpenROAD Sub-Engines)
Once the gate-level netlist enters the OpenROAD C++ database, a sequence of highly specialized sub-engines manipulates the physical geometry. 

TritonFPlan computes the fundamental die area, absolute core bounding box, and standard cell row definitions based on user-defined target utilization and aspect ratio parameters . Subsequently, ioPlacer operates autonomously to assign external netlist pins to exact geometric coordinates along the die boundary, executing optimization algorithms to minimize the bounding-box wirelength between the I/O pads and their connected internal logic gates . The power distribution network (PDN) generator programmatically creates the complex mesh of overlapping metal power and ground straps. It calculates precise stripe widths, track pitches, and layer promotion to guarantee sufficient electron flow and mitigate IR drop across the silicon die . The tapcell engine calculates the maximum permissible distance between substrate connections dictated by latch-up foundry design rules and surgically inserts well-tap and tie-high/tie-low cells into the standard cell rows .

Global placement is handled by RePlAce, which executes analytic placement utilizing advanced, non-linear continuous electrostatics algorithms . RePlAce treats standard cells as electrically charged particles and models the placement region as an electrostatic system. By analytically solving Poisson's equation $\nabla \cdot \nabla \psi(x,y) = -\rho(x,y)$ via spectral methods and Fast Fourier Transforms (FFT), it calculates a potential energy field that naturally repels overlapping cells while minimizing the net wirelength modeled as attractive spring forces . As an alternative, DREAMPlace casts this exact same analytic placement problem as a neural network training problem . Utilizing the PyTorch deep learning framework on Nvidia GPUs, DREAMPlace achieves over 30x speedups in massive global placements by treating wirelength and density costs as differentiable loss functions during backpropagation-style gradient descent .

The Resizer (rsz) acts as an in-flight optimization engine repairing electrical rule violations . It identifies signal nets exhibiting maximum capacitance, maximum fanout, or maximum transition violations. Resizer autonomously traverses the netlist graph, cloning logic, resizing underpowered driving gates, and interpolating buffer trees into long interconnect routes to close timing requirements . Following global placement, OpenDP performs detailed legalization . Because analytic placers operate in continuous floating-point coordinate space, cells may slightly overlap. OpenDP utilizes bipartite matching and localized snapping algorithms to force every standard cell into strict alignment with the discrete legal layout sites and standard cell rows dictated by the LEF technology definitions .

TritonCTS synthesizes the clock distribution network using H-tree or generalized clock tree topologies to minimize clock skew across thousands of sequential flip-flops . TritonCTS 2.0 characterizes clock buffers on-the-fly and recursively partitions sinks, inserting precisely sized buffers to ensure identical signal propagation latency from the clock root to all endpoints . Following clock tree synthesis, FastRoute executes fast global routing . It overlays a coarse three-dimensional grid graph across the die and assigns nets to specific grid tiles, evaluating routing capacity against demand to generate a congestion heat map and initial route guides .

The final physical implementation engine is TritonRoute, which performs fully multi-threaded detailed routing . TritonRoute ingests the coarse global route guides and formulates the exact geometric metal tracks and interconnecting vias. It utilizes Integer Linear Programming (ILP) formulations to parallelize routing across partitioned intra-layer panels, optimizing for minimal wirelength while strictly adhering to design rules . TritonRoute contains a highly sophisticated Pin Access Oracle to guarantee DRC-clean entry into complex standard cell pin geometries and rigorously navigates minimum spacing, short, and minimum area design rules .

### Parasitic Extraction & Timing Signoff
OpenRCX functions as a 2.5D field solver and parasitic extraction engine. It geometrically parses the absolute coordinates of all intersecting and parallel routed metal wires, applying mathematical lookup tables to calculate the exact parasitic resistance and capacitance of the physical interconnects, outputting this data as a Standard Parasitic Exchange Format (SPEF) file . 

OpenSTA acts as an industrial-grade gate-level Static Timing Analysis engine . OpenSTA models the circuit as a massive Directed Acyclic Graph. It calculates signal propagation delays by applying the extracted SPEF parasitics against the Non-Linear Delay Models (NLDM) or Composite Current Source (CCS) models provided in the standard cell libraries. OpenSTA performs rigorous Multi-Corner Multi-Mode (MCMM) analysis to verify Setup (maximum delay) and Hold (minimum delay) constraints across worst-case and best-case process, voltage, and temperature corners . Crucially, OpenSTA implements Common Path Pessimism Removal (CPPR) to mathematically deduct artificial delay pessimism from shared segments of launch and capture clock paths, ensuring accurate and reliable timing signoff .

### Physical Verification & Layout Management
Magic VLSI, originally developed by John Ousterhout, utilizes a highly efficient "corner stitching" data structure . Instead of managing an arbitrary list of polygons, corner stitching represents the layout as a fully tessellated plane of non-overlapping rectangular tiles linked by pointers at their corners . This guarantees extremely fast localized area searches. Magic performs micro-geometric Design Rule Checking and hierarchical layout-to-spice extraction . Netgen acts as an advanced graph-matching algorithmic tool, reading the SPICE netlist extracted from the physical layout and comparing it against the original logical SPICE netlist to execute Layout vs. Schematic verification . The Circuit Validity Checker (CVC) analyzes the extracted netlist for Electrical Rule Check violations, such as floating gates or illegal power domain crossings . Finally, KLayout is utilized in batch mode for high-fidelity boolean mask manipulations and final stream-out of the raw manufacturing data .

## CHAPTER 4: Data Formats, Interoperability, and File Transformations

The FOSSi orchestration pipeline is characterized by a continuous stream of data transformations. The integrity of the automated flow is entirely dependent on the precise serialization and deserialization of highly specialized domain-specific languages and formats.

### Step-by-Step File Transformation Flow Chart

[RTL Source] (.v / .sv) + [Standard Cell Constraints] (.lib) 
|
       v
(Yosys/ABC Logic Synthesis & Tech Mapping)
|
       +--> [Gate-Level Netlist] (.v / .json)
|
[Physical Constraints] (.sdc) + [Macro/Cell Geometries] (.lef)
|
       v
(OpenROAD: Floorplan -> Place -> CTS -> Route)
|
       +--> [Physical Layout Database] (.def / OpenDB binary)
|
(OpenRCX Parasitic Extraction)
|
       +--> [Extracted Parasitics] (.spef)
|
(OpenSTA Timing Analysis) <---+ [Gate Netlist + SPEF + SDC + LIB]
|
(Magic VLSI Layout Generation)
|
       +--> [Extracted Transistor Logic] (.spice)
       +--> [Raw Manufacturing Masks] (.gds / .gdsii / .oas)
|
(Netgen LVS Verification) <---+ [Logical SPICE vs Physical SPICE]

### Frontend Artifacts
The pipeline initiates with Structural and RTL Verilog (`.v`) and SystemVerilog (`.sv`) files, which contain human-readable, behavioral hardware description logic. Post-synthesis, Yosys mutates this behavioral code into a flattened structural netlist consisting solely of instantiated standard cells and their interconnecting wire networks. The Liberty Timing Models (`.lib`) are ASCII files containing the electrical and timing characteristics of the standard cells. These files define absolute cell areas, input pin capacitances, leakage power, and massive multi-dimensional NLDM lookup tables. The NLDM tables compute precise output transition times and cell propagation delays, parameterized by the input transition time and the total output capacitive load . Synthesis metric objects (`.json`) are frequently emitted by orchestrators to log exact gate counts, estimated area, and pre-placement delay estimations for analytical tracking.

### Physical Layout Geometries
The Library Exchange Format (`.lef`) acts as the fundamental physical abstraction file . Technology LEF defines the absolute rules of the silicon foundry, dictating exact routing layer names, electrical resistances, minimum widths, via enclosures, and pitch constraints . Macro LEF defines the physical bounding box and exact coordinates of power and signal pins for standard cells, deliberately omitting internal transistor geometries to minimize parser memory overhead during placement and routing . The Design Exchange Format (`.def`) serves as the absolute blueprint of the chip . The DEF file declares the absolute die boundaries, instantiates every cell with absolute Cartesian coordinates and orientation, defines all power and ground geometries, and explicitly maps out the exact metal segments and vias comprising the final routed interconnects . Synopsys Design Constraints (`.sdc`) dictate the electrical constraints for OpenSTA and OpenROAD . Formatted as a Tcl script, the SDC file mathematically bounds the physical design space using commands like `create_clock` and `set_max_fanout`. The orchestrator engines utilize these strict numeric bounds to drive buffer insertion and placement proximity .

### Signoff & Fabrication Artifacts
The Standard Parasitic Exchange Format (`.spef`) is an ASCII file containing the highly accurate extracted RC network for every net in the design . It represents wires as discrete arrays of resistor and capacitor elements forming Pi or T models, which OpenSTA utilizes to calculate true physical signal degradation . The physical layout-extracted netlist (`.spice` or `.spc`) represents the lowest level of physical truth. Generated via Magic's hierarchical extraction of the final layout, the SPICE file defines every individual NMOS and PMOS transistor, their physical width and length dimensions, and exact nodal connectivity, which Netgen subsequently compares against the synthesized logic . Finally, the Graphic Design System (`.gds` / `.gdsii`) and Open Artwork System Interchange Standard (`.oas`) files represent the ultimate, terminal artifacts of the EDA flow. These binary stream formats contain absolute, microscopic geometric polygons mapped to specific numerical layers. This exact data is transmitted directly to the semiconductor foundry's photomask lithography machines to manufacture the physical silicon chip .

## CHAPTER 5: Comprehensive Step-by-Step Pipeline Execution Blueprint

To demonstrate the full execution capacity of a modern orchestrator, we examine a complete OpenLane 2 configuration schema and analyze how these abstract variables map directly to the underlying mathematical engines.

### Explicit Configuration Architecture: `config.json`
Below is an exhaustive, production-grade OpenLane 2 JSON configuration file representing an advanced timing-driven execution for a RISC-V microprocessor block .

```json
{
  "DESIGN_NAME": "riscv_core_ahb",
  "VERILOG_FILES": [
    "dir::src/alu.v",
    "dir::src/decoder.v",
    "dir::src/register_file.v",
    "dir::src/riscv_core_ahb.v"
  ],
  "CLOCK_PORT": "clk_i",
  "CLOCK_PERIOD": 10.0,
  "VDD_NETS": ["vccd1"],
  "GND_NETS": ["vssd1"],
  "DIE_AREA": [0.0, 0.0, 1500.0, 1500.0],
  "FP_CORE_UTIL": 45,
  "FP_PDN_VPITCH": 15.36,
  "FP_PDN_HPITCH": 15.36,
  "PL_TARGET_DENSITY": 0.55,
  "PL_ROUTABILITY_DRIVEN": true,
  "PL_RESIZER_DESIGN_OPTIMIZATIONS": true,
  "PL_RESIZER_TIMING_OPTIMIZATIONS": true,
  "SYNTH_STRATEGY": "DELAY 1",
  "SYNTH_MAX_FANOUT": 10,
  "CTS_TARGET_SKEW": 200,
  "GRT_REPAIR_ANTENNAS": true,
  "GRT_ALLOW_CONGESTION": false,
  "GRT_MACRO_EXTENSION": 2,
  "DRT_OPT_ITERS": 64,
  "DRT_MIN_FREESPACE": 2,
  "MAGIC_DRC_USE_GDS": true,
  "RUN_CVC": true,
  "LVS_INSERT_POWER_PINS": true,
  "meta": {
    "version": 2
  }
}
```

### Variable Dictionary & Algorithmic Impact

The `CLOCK_PERIOD` variable instructs the OpenSTA engine within the Yosys, RePlAce, and Resizer steps regarding the absolute baseline timing constraint, defined in nanoseconds . Tuning this value downward aggressively forces the ABC technology mapper to select faster, higher-leakage cells and forces the Resizer to inject significantly more buffers to repair setup violations, simultaneously increasing dynamic power consumption and routing congestion . `CLOCK_PORT` explicitly identifies the root node in the netlist for clock tree synthesis, enabling the generation of the SDC timing constraints.

The `DIE_AREA` array defines the absolute physical boundary of the chip in micrometers. If specified, it overrides mathematical utilization metrics, forcing the Floorplanner to constrain all logic within this exact geometric perimeter . In contrast, `FP_CORE_UTIL` dictates the percentage of the core area that will be occupied by standard cells . A value of 45 provides massive whitespace for routing tracks and buffer insertion. Increasing this to 70 shrinks the die, saving fabrication cost, but exponentially increases the probability of localized routing congestion and fatal detailed routing DRC shorts .

`PL_TARGET_DENSITY` defines the maximum legal cell density for any given local bin during RePlAce global placement . Setting this to 0.55 limits the electrostatic attractive forces within the Poisson solver, forcing the placer to spread logic out further than strictly necessary. This intentionally creates localized empty space to ensure the subsequent TritonRoute engine has sufficient unblocked routing tracks to drop layer-spanning vias .

`SYNTH_STRATEGY` dictates the exact ABC cut-enumeration script executed during technology mapping . Passing the parameter "DELAY 1" forces ABC to optimize the And-Inverter Graph for shallow logical depth, resulting in faster propagation times but consuming significantly more physical area. Conversely, an "AREA 3" strategy forces maximum logic sharing, minimizing gate count at the expense of longer, slower timing paths .

`PL_RESIZER_TIMING_OPTIMIZATIONS` is a critical boolean flag that triggers the `rsz` engine post-placement . The Resizer dynamically estimates SPEF parasitics based on physical cell distance, executes an internal STA pass, identifies paths with negative slack, and autonomously inserts buffers or up-sizes existing gates to force the timing path to close .

`GRT_REPAIR_ANTENNAS` triggers the insertion of antenna diodes during Global Routing. During fabrication, long disconnected metal tracks act as antennas, accumulating electrostatic plasma charge that physically destroys transistor gate oxides. This variable forces the router to break long nets by hopping to higher metal layers via via insertion or deliberately routing to a reverse-biased protective diode cell near the gate input . Finally, `DRT_OPT_ITERS` defines the maximum number of Search and Repair iterations executed by TritonRoute . Higher numbers force the Integer Linear Programming solver to execute extreme rip-up and reroute algorithms to resolve complex metal spacing DRC violations, drastically increasing runtime but yielding a cleaner manufacturing output .

## CHAPTER 6: Complete Environment Provisioning & Containerized Distributions

Because of the extreme architectural complexity of marrying massive Python orchestration graphs with highly sensitive, heavily patched C++17 engines, relying on native local compilation is an anti-pattern that guarantees build failures and pipeline divergence . These engines natively depend on strict versions of Boost, OpenMP, CMake, SWIG, and Bison. FOSSi mitigates this operational fragility through robust containerization strategies, prominently curated by initiatives like the Johannes Kepler University's IIC-OSIC-TOOLS .

### The Containerization Strategy
Containerization utilizing Docker or Podman isolates the entire compiled application stack, including the EDA tool binaries, orchestration platforms, and hundreds of megabytes of foundry Open_PDK data. The host operating system's kernel is shared, but the userland libraries are completely and hermetically sealed. This guarantees deterministic layout outputs regardless of whether the execution host is running Ubuntu Linux, CentOS, or macOS via virtual machines. By executing within a container, the orchestrator bypasses system compilation drift, ensuring that the identical mathematical solvers are utilized across all deployment targets.

### Deployment Architecture
To provision a completely interactive, graphical, production-ready environment, the developer must pull the container image and mount the appropriate local directories and X11 forwarding sockets using explicit terminal command execution strings.

```bash
docker pull iicjku/iic-osic-tools:latest

docker run -it \
  --name fossi_workspace \
  --hostname fossi_workspace \
  --user $(id -u):$(id -g) \
  --env DISPLAY=$DISPLAY \
  --volume /tmp/.X11-unix:/tmp/.X11-unix:rw \
  --volume ${HOME}/silicon_projects:/foss/designs:rw \
  --volume ${HOME}/.volare:/foss/pdks:rw \
  --cap-add=SYS_ADMIN \
  --shm-size=8g \
  iicjku/iic-osic-tools:latest /bin/bash
```

The `--user $(id -u):$(id -g)` argument forces the container to execute under the exact user and group IDs of the local host machine. If omitted, the orchestrator outputs massive log files, GDS streams, and step directories owned by the root user, requiring complex permission rescues on the host filesystem. The `--env DISPLAY=$DISPLAY` and `--volume /tmp/.X11-unix...` arguments capture the local host's X Window System socket and map it into the containerized filesystem. This allows the user to pause an OpenLane run midway, execute `magic` or `klayout` inside the terminal, and have the GUI seamlessly render on the host's physical monitor for visual debugging of layout congestion.

The `--volume ${HOME}/.volare:/foss/pdks:rw` command explicitly maps the host's PDK installation directory into the container . This isolates the massive, static foundry technology data from the ephemeral project data, preventing the need to re-download the voluminous Sky130 PDK every time a container spins up. Finally, `--shm-size=8g` is critical for performance. RePlAce and TritonRoute utilize massive shared memory allocations for multi-threading via OpenMP . The default Docker shared memory size is 64MB, which will instantly trigger an Out-Of-Memory bus error during global placement. Expanding it to 8 Gigabytes is a mandatory infrastructure requirement for handling heavy VLSI computational loads.

## CHAPTER 7: Advanced Flow Controls: Automated Timing Closure and DRC/LVS Troubleshooting

Modern open-source orchestration platforms represent a profound advancement in programmatic error trapping and autonomous issue resolution. Instead of crashing upon encountering physical design violations, these platforms implement complex feedback loops and computational heuristics.

### Automated Timing Closure
Achieving timing closure demands that the latest actual arrival time of a signal and the earliest actual arrival time satisfy rigorous bounds established by the clock period and component delays . The orchestrator utilizes a multi-phased approach to guarantee closure autonomously. During RePlAce execution, the orchestrator invokes the Resizer in a pre-placement virtual mode . The Resizer dynamically estimates RC topologies, interpolates virtual buffers, and evaluates the timing slack. If paths exhibit deep negative slack, the orchestrator artificially inflates the net weights on those critical paths . This forces the electrostatics engine in RePlAce to prioritize pulling those specific standard cells closer together during the gradient descent optimization, penalizing non-critical paths to ensure overall design viability .

Following actual detailed placement, the physical geometries are locked. The orchestrator triggers another Resizer pass. To resolve Max Capacitance or Max Transition errors, the engine physically swaps standard cells to increase electrical drive strength, or physically splices buffer cells into the netlist to divide long, highly resistive wires into shorter, easily drivable segments . Finally, hold violations cannot be accurately assessed until TritonCTS generates the actual clock insertion delays . Because hold violations indicate that a signal arrives too early, the orchestrator executes a dedicated `repair_timing -hold` pass, which deliberately degrades the signal path by injecting delay buffers or resizing cells to lower drive strengths, slowing down the data propagation and ensuring the receiving flip-flop can safely latch the previous cycle's data .

### DRC/LVS Troubleshooting and State Rewinding
When physical verification fails, an orchestrator relies on automated traps. TritonRoute does not guarantee a clean route on its first pass; it relies on iterative Search and Repair algorithms . If an iteration produces a short circuit or a spacing violation, TritonRoute tags the localized geometric area with a heavy mathematical penalty cost. In the subsequent iteration, the maze router is computationally repelled from utilizing that congested geographic region, forcing it to explore detours through higher, less congested metal layers . If the orchestrator detects that the DRC count plateaus across multiple iterations without reaching zero, it throws a fatal exception.

If an OpenLane 2 run fails with a persistent LVS error, such as Netgen identifying an unrouted net, the engineer utilizes the hermetic architecture for debugging . Because every step preserves an immutable JSON state and an exact snapshot of the OpenDB binary or DEF file, the engineer can bypass running the flow from the beginning . The engineer navigates to the step directory immediately preceding the failure, extracts the preserved layout snapshot, boots the Magic VLSI GUI in an interactive container session, visually analyzes the failing bounding box using the command `:drc find`, manually intervenes to fix the missing via, and injects this modified state back into the orchestrator pipeline to resume signoff . This precise isolation of cause and effect represents the zenith of modern open-source EDA orchestration, blending massive computational automation with surgical human intervention. 










## Sources

- [**vlsicad.ucsd.edu** The OpenROAD Project: Unleashing Hardware Innovation](https://vlsicad.ucsd.edu/Publications/Conferences/383/c383.pdf)
- [**darpa.mil** Intelligent Design of Electronic Assets - DARPA](https://www.darpa.mil/research/programs/intelligent-design-of-electronic-assets)
- [**darpa.mil** Posh Open Source Hardware - DARPA](https://www.darpa.mil/research/programs/posh-open-source-hardware)
- [**linux.com** DARPA Drops $35 Million on “Posh Open Source Hardware” Project](https://www.linux.com/topic/embedded-iot/darpa-drops-35-million-posh-open-source-hardware-project/)
- [**openroad.readthedocs.io** Welcome to OpenROAD's documentation! — OpenROAD](https://openroad.readthedocs.io/)
- [**skywatertechnology.com** SKY's the Limit with the SKY130 Open-Source PDK](https://www.skywatertechnology.com/sky130-open-source-pdk/)
- [**opencircuitdesign.com** Open_PDKs - Open Circuit Design](https://opencircuitdesign.com/open_pdks/)
- [**opensource.googleblog.com** Open source PDKs joining the Linux Foundation's CHIPS Alliance](https://opensource.googleblog.com/2023/11/open-source-pdks-joining-linux-foundation-chips-alliance.html)
- [**zerotoasiccourse.com** Excited by silicon! | Zero to ASIC Course](https://www.zerotoasiccourse.com/post/excited_by_silicon/)
- [**tinytapeout.com** Analog Specs - Tiny Tapeout](https://tinytapeout.com/specs/analog/)
- [**en.wikipedia.org** OpenROAD Project - Wikipedia](https://en.wikipedia.org/wiki/OpenROAD_Project)
- [**reddit.com** Globalfoundries PDK GF180MCU Open Source Chip Design Project](https://www.reddit.com/r/chipdesign/comments/1qa2k4l/globalfoundries_pdk_gf180mcu_open_source_chip/)
- [**ijert.org** ASIC Design for a 32-bit RISC-V Processor – IJERT](https://www.ijert.org/asic-design-for-a-32-bit-risc-v-processor)
- [**opencircuitdesign.com** Magic VLSI - Open Circuit Design](https://opencircuitdesign.com/magic/)
- [**opencircuitdesign.com** Magic: A VLSI Layout System - Open Circuit Design](https://opencircuitdesign.com/magic/archive/papers/Magic_A_VLSI_Layout_System.pdf)
- [**huggingface.co** The-OpenROAD-Project/ORAssistant_Public_Evals - Hugging Face](https://huggingface.co/datasets/The-OpenROAD-Project/ORAssistant_Public_Evals/viewer)
- [**github.com** GitHub - The-OpenROAD-Project/OpenDB: Database and Tool](https://github.com/The-OpenROAD-Project/OpenDB)
- [**openroad.readthedocs.io** OpenDB - OpenROAD documentation](https://openroad.readthedocs.io/en/latest/main/src/odb/README.html)
- [**woset-workshop.github.io** OpenDB, OpenROAD's Database - woset-workshop](https://woset-workshop.github.io/PDFs/2019/a6.pdf)
- [**docs.siliconcompiler.com** Welcome to SiliconCompiler's Documentation!](https://docs.siliconcompiler.com/en/v0.37.8/)
- [**woset-workshop.github.io** OpenLane 2: Making the Most Popular Open Source ASIC Flow](https://woset-workshop.github.io/PDFs/2024/17_OpenLane_2_Making_the_Most_.pdf)
- [**openlane2.readthedocs.io** Architectural Overview - OpenLane Documentation](https://openlane2.readthedocs.io/en/latest/reference/architecture.html)
- [**github.com** README.md - The-OpenROAD-Project/TritonRoute - GitHub](https://github.com/The-OpenROAD-Project/TritonRoute/blob/master/README.md)
- [**github.com** The-OpenROAD-Project/TritonRoute: UCSD Detailed Router - GitHub](https://github.com/the-openroad-project/tritonroute)
- [**aws.amazon.com** Solution for Open-Source Chip Design on AWS | AWS for Industries](https://aws.amazon.com/blogs/industries/open-source-chip-design-on-aws/)
- [**semanticscholar.org** OpenROAD: Toward a Self-Driving, Open-Source Digital Layout](https://www.semanticscholar.org/paper/OpenROAD%3A-Toward-a-Self-Driving%2C-Open-Source-Layout-Ajayi-Blaauw/34bbd7e2f2c5782a38821274793cfa230c903040)
- [**platform.chipfoundry.io** LibreLane (formerly OpenLane 2) - Marketplace - ChipFoundry](https://platform.chipfoundry.io/marketplace/item/librelane)
- [**github.com** librelane/Readme.md at main - GitHub](https://github.com/librelane/librelane/blob/main/Readme.md)
- [**gitee.com** iEDA/AiEDA - Gitee](https://gitee.com/oscc-project/AiEDA/blob/master/README.md)
- [**arxiv.org** iEDA: An Open-Source Intelligent Physical Implementation Toolkit](https://arxiv.org/html/2308.01857v1)
- [**github.com** GitHub - OSCC-Project/iEDA: An open-source EDA infrastructure](https://github.com/OSCC-Project/iEDA)
- [**arxiv.org** iEDA: An Open-Source Intelligent Physical Implementation Toolkit](https://arxiv.org/abs/2308.01857)
- [**cse.cuhk.edu.hk** iEDA: An Open-source infrastructure of EDA - CUHK CSE](https://www.cse.cuhk.edu.hk/~byu/papers/C196-ASPDAC2024-iEDA-slides.pdf)
- [**yibolin.com** DREAMPlace 3.0: Multi-Electrostatics Based Robust VLSI ... - Yibo Lin](https://yibolin.com/publications/papers/PLACE_ICCAD2020_Gu.pdf)
- [**ieda.oscc.cc** EDA](https://ieda.oscc.cc/research/awesome/EDA.html)
- [**scribd.com** Qflow for ASIC Design Implementation | PDF | Logic Synthesis - Scribd](https://www.scribd.com/document/930811664/Vlsi-Maven-Report)
- [**opencircuitdesign.com** Qflow 1.3: An Open-Source Digital Synthesis Flow](https://opencircuitdesign.com/qflow/welcome.html)
- [**github.com** Qflow full end-to-end digital synthesis flow for ASIC designs · GitHub](https://github.com/RTimothyEdwards/qflow)
- [**hackaday.io** Existing Tools to build on | Details - Hackaday.io](https://hackaday.io/project/180839/log/198603-existing-tools-to-build-on)
- [**yosyshq.net** Yosys - A Free Verilog Synthesis Suite - YosysHQ](https://yosyshq.net/yosys/files/yosys-austrochip2013.pdf)
- [**yosyshq.readthedocs.io** abc - use ABC for technology mapping - YosysHQ Yosys 0.51](https://yosyshq.readthedocs.io/projects/yosys/en/v0.51/cmd/abc.html)
- [**stackoverflow.com** yosys - Combinatorial synthesis: Better technology mapping results](https://stackoverflow.com/questions/41948709/combinatorial-synthesis-better-technology-mapping-results)
- [**gist.github.com** lut-reading-materials.md - GitHub Gist](https://gist.github.com/Ravenslofty/277fde6b43966f0a83b66c2c74efce92)
- [**arxiv.org** Improving FPGA Technology Mapping with ASIC Mapper - arXiv](https://arxiv.org/pdf/2507.10912)
- [**arxiv.org** Mixed Structural Choice Operator: Enhancing Technology Mapping](https://arxiv.org/pdf/2504.12824)
- [**github.com** OpenROAD/src/pdn/README.md at master - GitHub](https://github.com/The-OpenROAD-Project/OpenROAD/blob/master/src/pdn/README.md)
- [**researchgate.net** Pplace-MS: Methodologically Faster Poisson's Equation-Based](https://www.researchgate.net/publication/374283479_Pplace-MS_Methodologically_Faster_Poisson's_Equation-Based_Mixed-Size_Global_Placement)
- [**medium.com** Macro Placement. This article discloses the… | by Amrut - Medium](https://medium.com/@amrutayan6/macro-placement-a73c399e64fa)
- [**researchgate.net** (PDF) Analytical Solution of Poisson's Equation with Application to](https://www.researchgate.net/publication/372583774_Analytical_Solution_of_Poisson's_Equation_with_Application_to_VLSI_Global_Placement)
- [**cseweb.ucsd.edu** DREAMPlace: Deep Learning Toolkit-Enabled GPU Acceleration for](https://cseweb.ucsd.edu/classes/fa23/cse248-a/papers/placement/dreamplace.pdf)
- [**github.com** GitHub - limbo018/DREAMPlace: Deep learning toolkit-enabled](https://github.com/limbo018/DREAMPlace)
- [**github.com** OpenROAD/src/rsz/README.md at master - GitHub](https://github.com/The-OpenROAD-Project/OpenROAD/blob/master/src/rsz/README.md)
- [**arxiv.org** Recursive Learning-Based Virtual Buffering for Analytical Global](https://arxiv.org/html/2506.17247v2)
- [**openroad-test.readthedocs.io** Gate Resizer - OpenROAD documentation - Read the Docs](https://openroad-test.readthedocs.io/en/latest/main/src/rsz/README.html)
- [**preprints.org** Automated Parameter Tuning for Timing Closure in OpenROAD](https://www.preprints.org/manuscript/202607.0137)
- [**vlsicad.ucsd.edu** OpenROAD: Toward a Self-Driving, Open-Source Digital Layout](https://vlsicad.ucsd.edu/Publications/Conferences/370/c370.pdf)
- [**handwiki.org** Engineering:OpenROAD Project - HandWiki](https://handwiki.org/wiki/Engineering:OpenROAD_Project)
- [**openroad.readthedocs.io** Clock Tree Synthesis - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/cts/README.html)
- [**openroad.readthedocs.io** Detailed Routing - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/drt/README.html)
- [**repository.essex.ac.uk** Improved ILP Models and Heuristics for Solving Routing and](https://repository.essex.ac.uk/40448/1/Improved_ILP_Models_and_Heuristics_for_Solving_Routing_and_Resource_Allocation_Problems_in_Optical_Networks.pdf)
- [**vlsicad.ucsd.edu** TritonRoute: The Open Source Detailed Router](https://vlsicad.ucsd.edu/Publications/Journals/j133.pdf)
- [**researchgate.net** (PDF) Legalized Routing Algorithm Based on Linear Programming](https://www.researchgate.net/publication/374858300_Legalized_Routing_Algorithm_Based_on_Linear_Programming)
- [**projectsatbangalore.com** Physical Design in VLSI Project Topics 2026 - Projectsatbangalore](https://www.projectsatbangalore.com/physical-design-in-vlsi/)
- [**openroad.readthedocs.io** Parallax Static Timing Analyzer - OpenROAD documentation](https://openroad.readthedocs.io/en/latest/main/src/sta/README.html)
- [**researchgate.net** (PDF) Effective Capacitance Modeling Using Graph Neural Networks](https://www.researchgate.net/publication/393476646_Effective_Capacitance_Modeling_Using_Graph_Neural_Networks)
- [**scribd.com** Nptel Week-07 Ai | PDF | Computer Engineering | Electronics - Scribd](https://www.scribd.com/document/1023455384/Nptel-Week-07-Ai)
- [**scribd.com** Comprehensive Guide to Static Timing Analysis | PDF - Scribd](https://www.scribd.com/document/961373956/Learn-All-STA-Static-Timi)
- [**88physicaldesign.blogspot.com** MCMM: Multi-Corner Multi-Mode - VLSI Physical Design](http://88physicaldesign.blogspot.com/2016/08/mcmm-multi-corner-multi-mode.html)
- [**yibolin.com** A Provably Good and Practically Efficient Algorithm for Common](https://yibolin.com/publications/papers/TIMER_DAC2021_Guo.pdf)
- [**icshare.work** VLSI DESIGN - Common Path Pessimism Removal (CPPR) - My Blogs](https://icshare.work/posts/vlsi-design-common-path-pessimism-removal-cppr/)
- [**vlsisystemdesign.com** Common clock path pessimism removal (CPPR) - Part 1](https://www.vlsisystemdesign.com/common-clock-path-pessimism-removal-cppr-part-1/)
- [**semanticscholar.org** An efficient algorithm for partitioning parameterized polygons into](https://www.semanticscholar.org/paper/ae6c7f1994ed6f13dab2d8dd2076001b5decaece)
- [**scribd.com** Magic VLSI - Theory | PDF | Mosfet - Scribd](https://www.scribd.com/document/1022577118/Magic-VLSI-Theory)
- [**openlane2.readthedocs.io** Achieving Timing Closure - OpenLane Documentation](https://openlane2.readthedocs.io/en/latest/usage/timing_closure/index.html)
- [**github.com** openlane2/Changelog.md at main - GitHub](https://github.com/efabless/openlane2/blob/main/Changelog.md)
- [**openlane2.readthedocs.io** OpenLane Documentation](https://openlane2.readthedocs.io/)
- [**pypi.org** openlane - PyPI](https://pypi.org/project/openlane/)
- [**github.com** chipfoundry/openlane-2 - LibreLane - GitHub](https://github.com/chipfoundry/openlane-2)
- [**researchgate.net** DREAMPlace 4.0: Timing-Driven Placement With Momentum-Based](https://www.researchgate.net/publication/367563606_DREAMPlace_40_Timing-driven_Placement_with_Momentum-based_Net_Weighting_and_Lagrangian-based_Refinement)
- [**openroad-test.readthedocs.io** OpenROAD documentation](https://openroad-test.readthedocs.io/_/downloads/en/stable/pdf/)
- [**ijrte.org** On Timing Closure: Hold-Violation Removal using Insertion of](https://www.ijrte.org/wp-content/uploads/papers/v7i4/E1827017519.pdf)
- [**researchgate.net** An Integer-Linear-Programming-Based Routing Algorithm for Flip](https://www.researchgate.net/publication/220402664_An_Integer-Linear-Programming-Based_Routing_Algorithm_for_Flip-Chip_Designs)
- [**openroad.readthedocs.io** ODB Code Generator - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/odb/src/codeGenerator/README.html)
- [**openroad.readthedocs.io** Developer Guide - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/contrib/DeveloperGuide.html)
- [**actian.com** OpenROAD: Rapid Application Development Platform - Actian](https://www.actian.com/openroad/)
- [**github.com** OpenROAD/src/README.md at master - GitHub](https://github.com/The-OpenROAD-Project/OpenROAD/blob/master/src/README.md)
- [**docs.opencart.com** Database Schema - OpenCart Documentation](https://docs.opencart.com/developer-guide/database-schema)
- [**codeling.dev** Python Object Oriented Programming Tutorial - Codeling](https://codeling.dev/blog/python-object-oriented-programming-tutorial/)
- [**scribd.com** Object-Oriented Design in Python | PDF - Scribd](https://www.scribd.com/document/862866839/Conducting-Object-Oriented-Analysis-and-Design-for-Python-Applications-Final)
- [**youtube.com** Object-Oriented Software Architecture: A Detailed Tutorial - YouTube](https://www.youtube.com/watch?v=iB7sRl01uTw)
- [**youtube.com** Mastering OpenLane Development Platform in Chip Design - YouTube](https://www.youtube.com/watch?v=2qy_b8W3xRQ)
- [**arxiv.org** DiffPlace: A Conditional Diffusion Framework for Simultaneous VLSI](https://arxiv.org/html/2510.15897v1)
- [**studocu.vn** AutoDMP: Automated Macro Placement Methodology for VLSI](https://www.studocu.vn/vn/document/truong-dai-hoc-su-pham-ky-thuat-thanh-pho-ho-chi-minh/vlsi-integrated-circuit-design/autodmp-automated-macro-placement-methodology-for-vlsi-design/169887136)
- [**jics.org.br** VLSI Placement Optimization Algorithms - JICS](https://jics.org.br/ojs/index.php/JICS/article/download/645/425/2982)
- [**d1qx31qr3h6wln.cloudfront.net** AutoDMP: Automated DREAMPlace-based Macro Placement](https://d1qx31qr3h6wln.cloudfront.net/publications/AutoDMP.pdf)
- [**mdpi.com** Progress of Placement Optimization for Accelerating VLSI Physical](https://www.mdpi.com/2079-9292/12/2/337)
- [**sigda.org** ICCAD-2018-TOC - ACM Sigda](https://sigda.org/archive/iccad-2018-toc.html)
- [**github.com** GitHub - The-OpenROAD-Project/TritonCTS](https://github.com/The-OpenROAD-Project/TritonCTS)
- [**par.nsf.gov** First Learnings from the OpenROAD Project - NSF PAR](https://par.nsf.gov/servlets/purl/10171025)
- [**openreview.net** BENCHMARKING END-TO-END PERFORMANCE OF AI-BASED](https://openreview.net/pdf?id=cx46JSD2qn)
- [**arxiv.org** Catchup results for Machine Learning on Tue, 28 Jul 2026 - arXiv](https://arxiv.org/catchup/cs.LG/2026-07-28?abs=True&page=1)
- [**cnblogs.com** Static Timing Analysis Basics - joytown - 博客园](https://www.cnblogs.com/zj99/p/18799748)
- [**lab.chipverify.com** User Guide - ChipVerify Lab](https://lab.chipverify.com/public/pages/guide)
- [**tsung-wei-huang.github.io** Accelerating Static Timing Analysis using CPU-GPU Heterogeneous](https://tsung-wei-huang.github.io/papers/tcad-23-sta.pdf)
- [**guozz.cn** GPU-Accelerated Static Timing Analysis - Zizheng Guo](https://guozz.cn/publication/gputimericcad-20/gputimericcad-20.pdf)
- [**yibolin.com** IncreGPUSTA: GPU-Accelerated Incremental Static Timing Analysis](https://yibolin.com/publications/papers/TIMING_ICCAD2025_Liu.pdf)
- [**shijulin.github.io** GPU-Accelerated Current Source Model Based Static Timing Analysis](https://shijulin.github.io/files/430_Camera_Ready_Paper.pdf)
- [**woset-workshop.github.io** Automating GDS Generation in Magic - woset-workshop](https://woset-workshop.github.io/PDFs/2021/a04.pdf)
- [**openbsdhandbook.com** qflow-1.4.83p4 - OpenBSD Handbook](https://www.openbsdhandbook.com/packages/release/cad/qflow/)
- [**vigilia.cc** The cad/qflow port - OpenBSD Ports Readme](https://vigilia.cc/path/cad/qflow)
- [**maaldaar.com** qflow - maaldaar](https://www.maaldaar.com/index.php/vlsi-cad-design-flow/qflow)
- [**muchen.ca** Tutorial 0 - QFlow Installation on Ubuntu - Muchen He](https://www.muchen.ca/documents/ELEC402/t0-qflow.html)
- [**youtube.com** Lecture 56: Open-Source Tool Installation and Qflow - YouTube](https://www.youtube.com/watch?v=pI7nkrrLqLQ)
- [**ieda.oscc.cc** iEDA Software Framework](https://ieda.oscc.cc/en/tools/ieda-platform/iEDA-design-framework.html)
- [**github.com** iEDA/README-CN.md at master · OSCC-Project/iEDA - GitHub](https://github.com/OSCC-Project/iEDA/blob/master/README-CN.md)
- [**ieda.oscc.cc** Softwares](https://ieda.oscc.cc/en/research/achieves/softwares.html)
- [**openroad.org** OpenROAD project](https://openroad.org/)
- [**par.nsf.gov** OpenROAD: Toward a Self-Driving, Open-Source Digital Layout](https://par.nsf.gov/servlets/purl/10171024)
- [**ucsc-ospo.github.io** An Open-Source, Autonomous RTL-GDSII Flow for VLSI Designs](https://ucsc-ospo.github.io/project/osre23/ucsd/openroad/)
- [**today.ucsd.edu** Open-source Semiconductor Chip Design Tool Celebrates Success](https://today.ucsd.edu/story/open-source-semiconductor-chip-design-tool-celebrates-success)
- [**community.cadence.com** The OpenAccess Story - Breakfast Bytes - Cadence Blogs](https://community.cadence.com/cadence_blogs_8/b/breakfast-bytes/posts/a-history-of-openaccess)
- [**vldb.org** An Extensible Object-Oriented Approach to Databases for VLSI/CAD](https://www.vldb.org/conf/1985/P013.PDF)
- [**ijsrd.com** Study and Comparison of Open Source and Licensed VLSI CAD](https://ijsrd.com/Article.php?manuscript=IJSRDV1I9079)
- [**github.com** README.rst - google/skywater-pdk-sky130-raw-data - GitHub](https://github.com/google/skywater-pdk-sky130-raw-data/blob/main/README.rst)
- [**arxiv.org** DC Cryogenic Modeling of Open-Source SkyWater 130 nm ... - arXiv](https://arxiv.org/html/2604.21625v1)
- [**youtube.com** Fully Open Source Manufacturable PDK for a 130nm Process](https://www.youtube.com/watch?v=LVrotb7qKuQ)
- [**openroad.readthedocs.io** Partition Manager — OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/par/README.html)
- [**vlsicad.ucsd.edu** An Initial Detailed Router for Advanced VLSI Technologies](https://vlsicad.ucsd.edu/Publications/Conferences/363/c363.pdf)
- [**scribd.com** Openroad Readthedocs Io en Latest | PDF - Scribd](https://www.scribd.com/document/761917989/openroad-readthedocs-io-en-latest)
- [**youtube.com** 31. Integer Linear Programming (ILP) - YouTube](https://www.youtube.com/watch?v=ERrOvONR1hE)
- [**semanticscholar.org** Performance Analysis and CPU vs GPU Comparison for Deep](https://www.semanticscholar.org/paper/Performance-Analysis-and-CPU-vs-GPU-Comparison-for-Buber-Diri/8cda403bc54cc5d5c79fdfd7e5aead2125fe289e)
- [**researchgate.net** PERFORMANCE COMPARISON OF CPU AND GPU](https://www.researchgate.net/publication/406847757_PERFORMANCE_COMPARISON_OF_CPU_AND_GPU_IMPLEMENTATIONS_FOR_PLACEMENT_AND_ROUTING_ALGORITHMS)
- [**arxiv.org** Comparative Analysis of CPU and GPU Profiling for Deep Learning](https://arxiv.org/html/2309.02521v3)
- [**youtube.com** Optimizing PyTorch on CPU-GPU Coherent Platforms - YouTube](https://www.youtube.com/watch?v=dPULokuSuPQ)
- [**arxiv.org** Evolution of Optimization Algorithms for Global Placement via Large](https://arxiv.org/pdf/2504.17801)
- [**bohrium.com** Multi-Corner Multi-Mode (MCMM) Analysis | Bohrium](https://www.bohrium.com/en/sciencepedia/feynman/keyword/multi_corner_multi_mode_analysis)
- [**vlsiguru.com** Beginner's Static Timing Analysis Guide | STA Explained Simply](https://vlsiguru.com/blog/beginners-static-timing-analysis-guide-sta-explained)
- [**purlsilicon.com** STEP 10 Multi-Mode Multi-Corner (MMMC) STA - Purl Silicon](https://purlsilicon.com/step-10-multi-mode-multi-corner-mmmc-sta/)
- [**arxiv.org** Timing Analysis Agent: Autonomous Multi-Corner Multi-Mode ... - arXiv](https://arxiv.org/html/2504.11502v1)
- [**patents.google.com** Simultaneous multi-corner static timing analysis using samples](https://patents.google.com/patent/WO2012082498A2/en)
- [**scribd.com** Multi-Mode Multi-Corner STA Methodology | PDF - Scribd](https://www.scribd.com/presentation/789517732/Sign-off-Methodology-1)
- [**youtube.com** Overview of Static Timing Analysis in OpenSTA - Akash Levy](https://www.youtube.com/watch?v=PAR54EBQi44)
- [**arxiv.org** HeteroSTA: A CPU-GPU Heterogeneous Static Timing Analysis](https://arxiv.org/pdf/2511.11660)
- [**tsung-wei-huang.github.io** OpenTimer v2: A New Parallel Incremental Timing Analysis Engine](https://tsung-wei-huang.github.io/papers/tcad21-ot2.pdf)
- [**antmicro.com** Timing path information in hierarchical static timing analysis of](https://antmicro.com/blog/2026/02/timing-paths-reports-in-openroad)
- [**arxiv.org** HeteroSTA: A CPU-GPU Heterogeneous Static Timing Analysis](https://arxiv.org/html/2511.11660v1)
- [**yibolin.com** A Journey through Heterogeneous Parallelism for Static Timing](https://yibolin.com/publications/papers/TIMING_ICSICT2024_Guo.pdf)
- [**zenodo.org** Integrated Circuits design using open-source EDA tools ... - Zenodo](https://zenodo.org/records/18008270)
- [**youtube.com** Status OpenPDK and Open Tooling for IHP SG13G2 BiCMOS](https://www.youtube.com/watch?v=Opw-KX3hNRU)
- [**si2.epfl.ch** Technology Mapping and Optimization Algorithms for Logic](https://si2.epfl.ch/demichel/graduates/theses/alessandro.pdf)
- [**mdpi.com** An Efficient Multi-Output LUT Mapping Technique for Field ... - MDPI](https://www.mdpi.com/2079-9292/14/9/1782)
- [**github.com** povik/yosys-abc: ABC: System for Sequential Logic Synthesis and](https://github.com/povik/yosys-abc)
- [**upcommons.upc.edu** AIG transformations to improve LUT mapping for FPGAs](https://upcommons.upc.edu/bitstreams/837c2f9a-3efa-441b-b38b-1ee976294a67/download)
- [**arxiv.org** OpeNPDN: A Neural-network-based Framework for Power Delivery](https://arxiv.org/abs/2110.14184)
- [**github.com** README.md - The-OpenROAD-Project/OpeNPDN - GitHub](https://github.com/The-OpenROAD-Project/OpeNPDN/blob/master/README.md)
- [**openbelt.org.cn** 电网综合 - EDA Wiki](https://openbelt.org.cn/synthesis/power/)
- [**openroad.readthedocs.io** IR Drop Analysis - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/psm/README.html)
- [**ijcaonline.org** Minimizing Skew and Delay with Buffer Resizing and Relocation](https://www.ijcaonline.org/archives/volume95/number23/16737-7023/)
- [**researchgate.net** Buffer Insertion During Timing-Driven Placement | Request PDF](https://www.researchgate.net/publication/408899839_Buffer_Insertion_During_Timing-Driven_Placement)
- [**vlsicad.ucsd.edu** Invited: IEEE DATC RDF-2025: Enabling an EDA Research Ecosystem](https://vlsicad.ucsd.edu/Publications/Conferences/419/c419.pdf)
- [**youtube.com** Mastering Timing Closure with OpenROAD's Evolving Optimizer (M](https://www.youtube.com/watch?v=DSuYAlh0KuE)
- [**ece.umn.edu** OpenROAD: Toward a Self-Driving, Open-Source Digital Layout](http://ece.umn.edu/users/sachin/conf/gomactech19.pdf)
- [**analogicus.com** magic | Magic documentation](https://analogicus.com/magic/)
- [**researchgate.net** (PDF) Magic: a VLSI layout system - ResearchGate](https://www.researchgate.net/publication/221061043_Magic_a_VLSI_layout_system)
- [**raw.githubusercontent.com** Magic VLSI Cheatsheet - GitHub](https://raw.githubusercontent.com/hpretl/iic-osic/main/magic-cheatsheet/magic_cheatsheet.pdf)
- [**ece.iit.edu** IC Layout Using Magic Simple Inverter Tutorial](https://www.ece.iit.edu/~eoruklu/courses/ece429/tutorial/magic.html)
- [**sourceforge.net** Magic VLSI download | SourceForge.net](https://sourceforge.net/projects/magic/)
- [**youtube.com** Creating a Hierarchical Layout in Magic Using the Sky130 PDK](https://www.youtube.com/watch?v=RPppaGdjbj0)
- [**semanticscholar.org** Analytical Solution of Poisson's Equation and Its Application to VLSI](https://www.semanticscholar.org/paper/Analytical-Solution-of-Poisson%27s-Equation-and-Its-Zhu-Huang/c7680dfe5ecb209e1b38f4e2d7ee70088c027ec7)
- [**pubmed.ncbi.nlm.nih.gov** A generalized Poisson solver for first-principles device simulations](https://pubmed.ncbi.nlm.nih.gov/26827208/)
- [**jspf.or.jp** Monte Carlo Solver for Partly Calculating a Solution to the Poisson](https://www.jspf.or.jp/PFR/PDF2022/pfr2022_17-1403029.pdf)
- [**mathworks.com** Poisson Equation for Electrostatic Potential - MathWorks](https://www.mathworks.com/matlabcentral/fileexchange/178404-poisson-equation-for-electrostatic-potential)
- [**arxiv.org** Poisson Energy Formulation for Floorplanning: Variational Analysis](https://arxiv.org/html/2510.08126)
- [**yibolin.com** DREAMPlace 2.0: Open-Source GPU-Accelerated Global ... - Yibo Lin](https://yibolin.com/publications/papers/PLACE_CSTIC2020_Lin.pdf)
- [**open-source-eda-birds-of-a-feather.github.io** iEDA: An Open-source EDA Infrastructure and Toolchain](https://open-source-eda-birds-of-a-feather.github.io/doc/slides_2024/DAC-BoF_iEDA.pdf)
- [**ieda.aieda.cc** Project | iEDA.ai - AiEDA](http://ieda.aieda.cc/en/project/)
- [**mdpi.com** From RTL to Fabrication: Survey of Open-Source EDA Tools and PDKs](https://www.mdpi.com/2079-9292/15/5/1048)
- [**aspdac.com** iEDA: An Open-source infrastructure of EDA - ASP-DAC](https://www.aspdac.com/aspdac2024/archive/pdf/1E-1.pdf)
- [**dvcon-proceedings.org** Using Open-Source EDA Tools in an Industrial Design Flow](https://dvcon-proceedings.org/wp-content/uploads/74522.pdf)
- [**m.economictimes.com** ET Business Growth Summit, Jaipur: Entrepreneurs highlight new growth opportunities](https://m.economictimes.com/small-biz/sme-sector/et-business-growth-summit-jaipur-entrepreneurs-highlight-new-growth-opportunities/articleshow/134256382.cms)
- [**github.com** GitHub - chipfoundry/openlane2: The next generation of OpenLane](https://github.com/chipfoundry/openlane2)
- [**mdpi.com** Legalized Routing Algorithm Based on Linear Programming - MDPI](https://www.mdpi.com/2079-9292/12/20/4338)
- [**researchgate.net** Mixed Integer Linear Programming Models to Solve a Real-Life](https://www.researchgate.net/publication/355212460_Mixed_Integer_Linear_Programming_Models_to_Solve_a_Real-Life_Vehicle_Routing_Problem_with_Pickup_and_Delivery)
- [**researchgate.net** (PDF) Integer Linear Programming (ILP) - ResearchGate](https://www.researchgate.net/publication/300717258_Integer_Linear_Programming_ILP)
- [**arxiv.org** A Comprehensive Survey of Linear, Integer, and Mixed ... - arXiv](https://arxiv.org/html/2502.15585v1)
- [**ijceas.com** A Solution Proposal to Vehicle Routing Problem with Integer Linear](https://www.ijceas.com/ijceas/article/view/257)
- [**researchgate.net** A mixed-integer linear programming model for the selective full](https://www.researchgate.net/publication/353796778_A_mixed-integer_linear_programming_model_for_the_selective_full-truckload_multi-depot_vehicle_routing_problem_with_time_windows)
- [**jlinderoth.github.io** GRIP: Global Routing via Integer Programming - Jeff Linderoth's](https://jlinderoth.github.io/papers/Wu-Davoodi-Linderoth-10-PP.pdf)
- [**scribd.com** Common Clock Path Pessimism Removal | PDF | Algorithms - Scribd](https://www.scribd.com/document/371058030/Common-Clock-Path-Pessimism-Removal-CPPR)
- [**guozz.cn** A Provably Good and Practically Efficient Algorithm for Common](https://guozz.cn/publication/cpprtcad-21/)
- [**tsung-wei-huang.github.io** A Provably Good and Practically Efficient Algorithm for Common](https://tsung-wei-huang.github.io/papers/2022-tcad-cppr.pdf)
- [**openlane2.readthedocs.io** Design Configuration Files - OpenLane Documentation](https://openlane2.readthedocs.io/en/latest/reference/configuration.html)

