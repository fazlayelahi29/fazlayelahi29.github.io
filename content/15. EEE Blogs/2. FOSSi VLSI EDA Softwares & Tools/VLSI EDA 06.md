# The Architecture and Evolution of Open-Source VLSI Physical Design Automation

## Introduction: The Democratization of Silicon and the DARPA IDEA Program

For decades, the design and fabrication of Application-Specific Integrated Circuits (ASICs) and Systems-on-a-Chip (SoCs) remained heavily restricted by the prohibitive costs of proprietary Electronic Design Automation (EDA) software, complex licensing agreements, and the necessity of highly specialized engineering expertise. The transition from abstract logic to manufacturable physical layouts—a process involving synthesis, placement, routing, and signoff—historically required multi-million-dollar software ecosystems. Today, the landscape has been fundamentally altered by the advent of open-source physical design flows, driven largely by initiatives such as the DARPA IDEA (Intelligent Design of Electronic Assets) program . The overarching objective of these initiatives has been the realization of "Hardware Compilers 2.0": the automated generation of design-rule-clean, manufacturable silicon layout from a given hardware description language within twenty-four hours, with zero human intervention in the loop .

The realization of this vision is not embodied in a single, monolithic piece of software written from scratch. Instead, projects like OpenLane and OpenROAD are fundamentally collections of separate, specialized open-source tools integrated through highly sophisticated automated plumbing . Understanding how this ecosystem works requires distinguishing between the orchestrator (the project manager), the physical design engine (the factory), and the fragmented point tools (the specialized machines) . Through a combination of unified shared-memory databases, advanced placement algorithms grounded in electrostatic physics, and community-driven flow orchestration, open-source VLSI design has achieved tapeout-proven maturity. This development has not only democratized access to hardware innovation for researchers and small-to-medium enterprises but has also catalyzed the emergence of localized semiconductor design ecosystems in developing economies, shifting the geopolitical dynamics of digital hardware engineering.

## The Three-Tier Architectural Hierarchy of Open-Source EDA

To accurately conceptualize the open-source physical design ecosystem, it must be analyzed through a distinct three-tier architectural hierarchy. This structural model clarifies the abstraction levels and design intents of each component, preventing the conflation of environment management, procedural orchestration, and algorithmic computation . A helpful analogy for understanding this ecosystem is to view Tier 1 as the toolbox suitcase, Tier 2 as the automated assembly line manager, and Tier 3 as the combination of a large mechanical assembly unit and individual precision instruments .

### Tier 1: The Environment and Container Distribution

The foundation of the ecosystem is the environment layer, which standardizes the operating system, resolves dependency conflicts, and packages the necessary compilers and libraries. In the open-source EDA domain, the vast array of distinct tools—many written in varying languages such as C++, Python, Tcl, and Rust—creates highly fragile dependency trees. 

The most prominent solution to this challenge is IIC-OSIC-TOOLS, which functions as the aforementioned "toolbox suitcase" . IIC-OSIC-TOOLS is not an EDA tool or an orchestrator; rather, it is simply an Ubuntu/Debian container image bundling everything together within a Docker container . Curated by Harald Pretl and his research team at the Department for Integrated Circuits (ICD), Johannes Kepler University (JKU) Linz, this container standardizes the operating environment natively across both x86_64/amd64 and aarch64/arm64 CPU architectures . 

The container installs compilers, software dependencies, OpenLane, analog schematic tools like Xschem and Ngspice, layout viewers, and Process Design Kits (PDKs) so that the end-user does not face debilitating dependency conflicts . By providing access via Virtual Network Computing (VNC) or X11 forwarding directly to a user's local machine, IIC-OSIC-TOOLS eliminates the friction of building source code from highly fragmented repositories, allowing designers to focus strictly on circuit synthesis rather than software engineering configurations .

### Tier 2: The Flow Orchestrator

Sitting above the container environment is the pipeline orchestrator, functioning as the automated assembly line manager. Examples of this tier include OpenLane and its successor, LibreLane. The orchestrator is a master pipeline manager written in higher-level languages like Python and Tcl; it does not know how to route a wire, evaluate routing congestion, or verify a physical transistor on its own . 

Instead, the orchestrator's role is entirely procedural. It takes the user's behavioral Verilog code, creates configuration flags, and triggers the Tier 3 tools step-by-step . It converts data from one file format to another (for example, translating Verilog into an intermediate LEF/DEF database, and eventually into a final GDSII stream) and systematically checks if any stage in the pipeline has failed . The orchestrator schedules operations, handles data transfer, standardizes error reporting, and manages the overall progression of the chip's physical implementation.

### Tier 3: The Point Tools and Sub-Engines

The actual mathematical optimization, physics simulation, and graph theory processing take place at the third tier: the point tools and sub-engines. These include software like Yosys, OpenROAD, Magic, and Netgen . These are the actual algorithmic workhorses that perform floating-point mathematics, graph optimization, and physics checks . 

Within this tier, OpenROAD acts as the large mechanical assembly unit handling layout, placement, and routing internally . Surrounding this large assembly unit are the individual precision instruments—Yosys, Magic, Netgen, and KLayout—that handle synthesis, geometric rule checking, circuit equivalence verification, and file export . The fragmented nature of these precision tools is a historical artifact of academic research, where individual PhD candidates and research groups would develop highly optimized point tools for a single task without building an entire end-to-end suite.

## The Anatomy of OpenLane: The Six Stages of the RTL-to-GDSII Pipeline

When a user executes a command such as `./flow.tcl -design my_design` within an orchestrator like OpenLane, the software delegates tasks across a suite of dedicated sub-tools in a highly deterministic, six-stage sequence . The journey from behavioral Verilog to a geometric GDSII file passes through several distinct computational domains, transitioning the design from abstract intent to physical reality.

### Stage 1: RTL Synthesis and Logic Optimization

The pipeline begins with the ingestion of the user's RTL Verilog, immediately passing it to Yosys and ABC for synthesis and logic optimization . Yosys operates as a front-end synthesis framework that parses Verilog-2005 hardware descriptions, mapping high-level behavioral constructs (such as adders, multiplexers, and state machines) into an intermediate generic netlist of logic gates . Depending on the orchestrator's configurations, specialized arithmetic structures like ripple-carry adders or carry-select adders can be instantiated during this phase . 

Because synthesis is a distinct computational domain from physical geometry, ABC—a specialized algorithmic research tool developed at UC Berkeley—is plugged directly into Yosys for deeper netlist simplification . ABC performs logic optimization, Boolean technology mapping, and LUT/gate assignment, utilizing directed acyclic graphs to minimize the Boolean logic and map it directly onto the specific standard cells provided by the foundry's target Process Design Kit (PDK) .

### Stage 2: Static Timing Analysis (Pre-layout)

Before any physical placement occurs, the synthesized gate-level netlist must be verified to ensure it theoretically meets the designer's timing constraints. This pre-layout Static Timing Analysis (STA) is conducted by OpenSTA, a timing verification engine developed by Parallax Software . OpenSTA performs rigorous setup and hold checks based on the ideal delays of the logic gates provided in the foundry's Liberty (`.lib`) files . If the design fails to meet the target clock frequency at this theoretical stage, the flow halts, as the addition of physical wiring parasitics later in the flow will only degrade timing further.

### Stage 3: Physical Implementation via OpenROAD

The third stage represents the most computationally demanding phase of the flow: physical implementation. OpenLane delegates this entire middle-layer directly to the OpenROAD binary . This stage is composed of ten distinct sub-engines that execute sequentially to build the physical chip. 

The process begins with TritonFPlan, the floorplanning engine responsible for die sizing, defining the core area, and establishing the placement grid . Next, the ioPlacer and pad modules handle the assignment and placement of I/O pads and exterior pins along the die boundary . To power the millions of logic gates, the pdn module generates the Power Distribution Network, creating a robust grid of horizontal and vertical metal straps that deliver power and ground connections across the entire die without significant voltage (IR) drop . The tapcell module then inserts well-taps and tie-cells to bias the substrate and prevent latch-up conditions .

With the floorplan established, RePlAce acts as the global cell placement engine, calculating optimal approximate locations for all logic gates across the die to minimize wirelength and prevent extreme congestion . Because placement alters the physical distances between gates, the Resizer (rsz) module analyzes the layout to perform buffer insertion and gate sizing, fixing any maximum slew or maximum capacitance violations . OpenDP then serves as the detailed placement engine, taking the continuous floating-point coordinates from RePlAce and snapping the cells strictly into the legal manufacturing grid rows to ensure no physical overlaps occur .

Following detailed placement, TritonCTS executes Clock Tree Synthesis, building branching buffer networks to distribute the clock signal evenly to every sequential element on the die, thereby avoiding clock skew . Finally, routing is bifurcated into two engines. FastRoute (or CU-GR) acts as the global routing engine, evaluating routing congestion globally and creating routing guides (g-cells) . TritonRoute then functions as the detailed physical metal router, connecting all wires layer by layer, dropping vias, and ensuring no short circuits or spacing violations occur .

### Stage 4: Parasitic Extraction (RCX)

The physical metal shapes mapped during detailed routing possess inherent resistance (R) and capacitance (C) that impede signal propagation. To account for this, the flow triggers OpenRCX (also historically known as SPEF-Extractor) . This engine analyzes the exact geometric widths, lengths, and layer distances of all routed metal to extract the wire capacitance and resistance values, outputting them into a Standard Parasitic Exchange Format (SPEF) file . 

### Stage 5: Final Timing Closure

With the real-world parasitic data extracted, the flow invokes OpenSTA for a final, post-routing timing signoff . OpenSTA recalculates the delays of every path in the design using the extracted SPEF data, verifying that the physical routing did not introduce excessive RC delays that would cause setup or hold violations under real operating conditions .

### Stage 6: Streaming Out and Physical Verification

The final stage validates the physical geometries for manufacturing and exports the data. Magic VLSI, developed by Prof. John Ousterhout at UC Berkeley, reads the layout data down to the physical sub-micron geometries and performs Design Rule Checking (DRC) to ensure every spacing, width, and area rule mandated by the foundry is met. Magic then handles the final GDSII stream-out . 

Concurrently, Netgen, developed by Tim Edwards, performs Layout vs. Schematic (LVS) verification, comparing the geometrical transistors placed by Magic against the logical gate connections generated by Yosys to prove absolute equivalence . CVC (the Circuit Validity Checker), developed by Mitch Bailey, flags electrical rule errors, such as improper voltage connections or device floating terminals . Finally, KLayout, developed by Matthias Köfferlein, acts as a high-speed layout viewer capable of fast geometric Boolean operations and secondary DRC verification, allowing developers to visually inspect the massive, multi-gigabyte final clean GDSII file .

## The Evolution of Flow Orchestration: From OpenLane to LibreLane

While OpenLane served as the standard automated RTL-to-GDSII flow manager for the initial wave of open-source tapeouts, its architecture ultimately revealed severe scalability limitations. OpenLane was revolutionary for its time, prioritizing ease-of-install and ease-of-use above all else, and was the primary vehicle for the Google-sponsored multi-project wafer (MPW) shuttles operated by Efabless Corporation . However, under the hood, OpenLane was largely a monolithic collection of Tcl and Bash scripts that haphazardly manipulated global states and called tools via stringly-typed commands . This lack of a codified structure made debugging complex failures, running individual isolated steps, or integrating custom tools exceptionally difficult . 

Following the closure of Efabless Corporation in early 2025, the orchestrator underwent a massive architectural rewrite, transitioning to the FOSSi Foundation under the name LibreLane . LibreLane is a modern, Python-based infrastructure designed as the direct successor to OpenLane, retaining backward compatibility with legacy OpenLane configuration files while providing a far more flexible architecture .

| Feature | OpenLane | LibreLane |
| :--- | :--- | :--- |
| **Primary Architecture** | Monolithic Tcl/Bash scripts . | Plugin-based Python architecture . |
| **State Management** | Global variable mutation . | Object-oriented, decoupled state schemas . |
| **Dependency Management** | Bundled Docker only . | Nix package manager (native) and Docker . |
| **Execution Modularity** | Difficult to isolate specific steps . | Arbitrary step execution and flow customization . |
| **Maintainer** | Efabless Corporation (Deprecated) . | FOSSi Foundation (Active) . |
| **Specialized Flows** | Classic RTL-to-GDSII flow only . | Classic flow, plus "Chip flow" for pad-ring generation . |

LibreLane utilizes a strictly type-checked Python codebase, decoupling the flow graph definition from the execution logic . It leverages a step-based manifest schema where inputs (PDK definitions, tool paths, environment variables) and outputs (database writes, log files, metrics) are explicitly defined and validated before execution . The introduction of standardized metrics and status reporting at every step ensures that when a failure occurs, the user knows exactly where and why, effectively resolving the opacity of the original Tcl-based OpenLane . Furthermore, LibreLane introduced automated padframe generation via its "Chip flow," addressing one of the most error-prone manual steps in top-level ASIC integration by automatically handling I/O pad insertion and configuration .

## What Exactly is OpenROAD? The Paradigm Shift to OpenDB

A common point of confusion in the open-source EDA ecosystem is that OpenROAD is frequently referred to as both an orchestrator and a tool . To understand what OpenROAD exactly is, one must examine the historical bottlenecks of physical design.

Around 2018 to 2019, physical design tools in the academic open-source sphere were heavily fragmented. A standalone program would perform placement (e.g., RePlAce), calculate the coordinates of the cells, and write a massive text file to the hard drive. A completely separate tool would then read that file, parse it into its own memory structures, perform clock tree synthesis (e.g., TritonCTS), and write another massive file to the hard drive. Finally, a third tool would read that file to perform routing (e.g., TritonRoute) . This continuous serialization and deserialization of gigabytes of text-based layout data created severe file I/O overhead that slowed computational pipelines down dramatically, making rapid, iterative design space exploration impossible .

The OpenROAD Project, led by researchers at UC San Diego as part of the DARPA IDEA program, addressed this systemic inefficiency by assembling these disparate standalone academic tools under one unified C++ codebase . The foundational innovation that enabled this unification is an in-memory database called OpenDB . OpenDB is a highly optimized physical design data model capable of natively storing all the netlist connectivity and geometric information contained in the LEF and DEF standards . 

Within the OpenDB architecture, design elements are structured under the `odb` namespace, utilizing object hierarchies such as `dbTech` for technology rules, `dbChip` for the overarching die context, and `dbBlock` for specific logical hierarchies . Because of this unified architecture, OpenLane and LibreLane can delegate the entire physical design middle-layer—Floorplan, Placement, CTS, and Routing—directly to a single OpenROAD binary . The shared-memory paradigm allows TritonFPlan, RePlAce, OpenDP, TritonCTS, FastRoute, and TritonRoute to modify the exact same graph in RAM simultaneously . 

Crucially, OpenSTA, the static timing engine, is embedded directly inside OpenROAD and tightly coupled with OpenDB . This allows for incremental optimizations; if the resizer module inserts a buffer to alleviate a slew violation, OpenSTA instantly updates the parasitic delay values in memory without requiring a file export, enabling highly efficient timing-driven physical design .

## Breakdown of the Underlying Point Tools

To fully map the ecosystem, it is essential to understand the origins and specific roles of the primary point tools that plug into the orchestrator and surround the OpenROAD engine.

| Point Tool Name | Developer / Origin | Its Specific Role in the Flow | Why It Was Kept Separate |
| :--- | :--- | :--- | :--- |
| **Yosys** | Claire Wolf (YosysHQ) | Front-end synthesis; parses Verilog code into logic gates. | Synthesis is a distinct domain from geometry; Yosys is the industry-standard front-end for open silicon. |
| **ABC** | UC Berkeley | Logic optimization, Boolean mapping, LUT/gate assignment. | A specialized algorithmic research tool plugged directly into Yosys for netlist gate-level simplification. |
| **OpenROAD** | UCSD, DARPA IDEA Program | Complete physical layout engine (P&R). | Acts as the shared-memory backend engine for almost all placement and routing tasks. |
| **Magic VLSI** | Prof. John Ousterhout (UC Berkeley) | Physical DRC and extraction to SPICE for verification. | Magic reads layout data down to physical sub-micron geometries and checks every design rule. |
| **Netgen** | Tim Edwards (Open Circuit Design) | LVS (Layout vs. Schematic) comparison. | Verifies whether the geometrical transistors placed by Magic match the gate connections generated by Yosys. |
| **KLayout** | Matthias Köfferlein | High-speed layout viewer, geometric Boolean ops, DRC. | Fast visualization and generation of massive multi-gigabyte GDSII/OASIS files. |
| **CVC** | Mitch Bailey | Circuit Validity Checker. | Flags electrical rule errors, such as improper voltage connections or device floating terminals. |

## Deep Dive into Algorithmic Optimization: Electrostatics and Routing

The sub-engines within OpenROAD rely on highly sophisticated mathematical and physical models to solve the NP-hard problems associated with placing and connecting millions of microscopic transistors. 

The RePlAce global placement engine formulates the arrangement of standard cells as a continuous, non-linear analytical optimization problem. To resolve the competing objectives of minimizing total wirelength while preventing logic gates from overlapping, RePlAce utilizes a novel electrostatics-based analogy . In this mathematical model, standard cells are treated as electrically charged particles, and the placement area is treated as an electric field. The objective function minimizes wirelength while simultaneously applying a density penalty to enforce an even distribution of cells across the die . 

This density penalty is computed by solving the Poisson equation, where the charge density corresponds to the physical area overlap of the logic gates . RePlAce solves this partial differential equation rapidly using Fast Fourier Transforms (FFTs) . The resulting "electric field" repels cells away from highly congested areas. To iteratively update the cell coordinates and find the global minimum of this energy function, RePlAce employs Nesterov’s accelerated gradient descent method, which converges significantly faster than traditional conjugate gradient techniques . 

During the detailed routing phase, TritonRoute must operate within the strict physical limitations dictated by the foundry's design rules. One of the most computationally intensive checks performed by TritonRoute involves mitigating process antenna violations . Antenna violations occur during plasma etching manufacturing steps when a long, un-terminated metal wire acts as a literal antenna, collecting static electrical charge. If this charge exceeds the threshold of the thin oxide layer of a connected transistor gate, the resulting discharge will destroy the device . TritonRoute calculates the ratio of the metal wire area to the connected gate area. If the router detects high antenna ratios, OpenROAD's repair routines dynamically insert diode cells to safely discharge the accumulated voltage into the substrate, or force the router to jump to a higher metal layer to break the antenna's conductive continuity before the vulnerable gate is fabricated .

## Managing Complexity: Multi-PDK Support and Ecosystem Interoperability

A critical factor in the viability of the open-source EDA ecosystem is its decoupling from any single proprietary foundry. Historically, Process Design Kits (PDKs) were closely guarded under stringent Non-Disclosure Agreements, providing the device models, design rules, and standard cells necessary to manufacture a chip. The open-source ecosystem rapidly matured following the release of several foundry-supported, openly licensed manufacturing nodes. LibreLane and OpenROAD have established abstractions that allow the same RTL design to be mapped to entirely different physical geometries by simply altering the target PDK configuration . 

Three primary open-source PDKs dominate this landscape, each serving distinct engineering requirements:

| Open-Source PDK | Foundry / Partner | Node Details | Primary Use Cases |
| :--- | :--- | :--- | :--- |
| **SkyWater SKY130** | SkyWater Technology / Google | 130nm mixed-signal CMOS . | The baseline for early MPW shuttles; general-purpose digital and analog design . |
| **GF180MCU** | GlobalFoundries | 180nm CMOS with 5V/6V tolerance . | Automotive, industrial microcontrollers, and IoT applications requiring higher voltages . |
| **IHP SG13G2 (and SG13CMOS5L)** | IHP Microelectronics | 130nm SiGe BiCMOS . | Radio Frequency (RF) and high-frequency analog designs; features heterojunction bipolar transistors . |

The integration of these diverse technologies presents profound software challenges for the orchestrator. Different PDKs designate their power pins with varying nomenclature, handle substrate bulk/well-taps distinctly, and utilize different geometric scaling factors. For example, LibreLane must handle complex configuration matrices that normalize macro power configurations—such as mapping `vpwr` and `vgnd` standard pins to top-level `vccd1` grids—before passing the standard cell data to OpenROAD . The modular Python architecture of LibreLane ensures that the underlying logic can elegantly swap between the high-density standard cells of Sky130 and the heterojunction bipolar transistors of the IHP PDK without breaking the flow .

## Global Impact and Regional Ecosystems: The Case of Bangladesh

The decoupling of IC design from multi-billion dollar fabrication facilities has profound macroeconomic implications. Because the entire EDA toolchain is now freely available via projects like LibreLane and OpenROAD, the barrier to entry has shifted from massive capital expenditure to intellectual capital. The design phase of VLSI is extraordinarily knowledge-intensive, requiring deep expertise in mathematics, logic, and physics, but requires little more than standard compute hardware to execute. This paradigm has enabled developing economies to establish sophisticated semiconductor design ecosystems without needing to build physical wafer fabs .

A prominent example of this geopolitical shift is occurring in Bangladesh. Historically dependent on the Ready-Made Garment (RMG) sector, industrial conglomerates in Bangladesh are aggressively diversifying into high-tech domains. The DBL Group, a major RMG conglomerate, founded Neural Semiconductor with the explicit goal of capturing a segment of the global chip design market . By focusing strictly on physical design, verification, and backend RTL-to-GDSII flow services, companies like Neural Semiconductor, Ulkasemi, and Prime Silicon Technology are building a localized VLSI cluster in Dhaka .

This industry push is heavily supported by academic curriculum reform. The Bangladesh University of Engineering and Technology (BUET) has deeply integrated VLSI physical design into its undergraduate and postgraduate coursework. The EEE 468 "VLSI Circuits and Design Laboratory" trains engineering students on industry-level projects covering the entire pipeline from RTL synthesis to layout optimization . Competitions such as the EEE Day VLSI Design Competition at BUET—sponsored by domestic firms like Neural Semiconductor—actively cultivate this talent pool . 

The national strategy involves training a milestone cohort of thousands of specialized VLSI engineers and establishing shared EDA facilities . Because the open-source EDA stack removes the financial barrier for academic institutions to teach tapeout-capable physical design, BUET graduates enter the workforce with practical layout experience . The government actively supports these initiatives by providing import incentives for IC design startups and promoting a "design-first" semiconductor statecraft, proving that open-source tooling is a direct catalyst for high-tech economic development .

## Future Outlook: Artificial Intelligence and Autonomous Layout

While the open-source ecosystem has reached production readiness, the future of physical design lies in the integration of artificial intelligence and machine learning. As semiconductor scaling slows, the heuristic approximations used in traditional routing and placement are insufficient to extract maximum Power, Performance, and Area (PPA) improvements from advanced nodes.

The OpenROAD project serves as the foundational infrastructure for The Institute for Learning-enabled Optimization at Scale (TILOS), a National Science Foundation AI institute . TILOS researchers are pioneering "EDA 2.0," utilizing learning-to-optimize frameworks and Graphical Neural Networks (GNNs) to predict routing congestion before placement is finished . By replacing static tuning parameters with deep reinforcement learning models, OpenROAD is evolving toward true autonomous layout optimization . 

Furthermore, the complexity of orchestrating these tools is being addressed by Large Language Model (LLM) agents. Frameworks like AuDoPEDA leverage intelligent agents to autonomously modify OpenROAD source code, utilizing DSPy pipelines to compile literature-grounded algorithmic plans into executable C++ and Python code. These agents run closed-loop evaluations, executing OpenROAD implementations, analyzing the resulting timing and congestion metrics, and iteratively refining their code based on objective PPA feedback, demonstrating that the future of EDA tool development itself may become highly automated .

## Conclusion

The open-source VLSI physical design ecosystem is not merely a collection of free scripts; it is a meticulously engineered, three-tier hierarchy that replicates and, in several areas, innovates upon commercial proprietary methodologies. At the base, environments like IIC-OSIC-TOOLS provide the necessary stability to bridge highly fragmented software dependencies. At the orchestration layer, the transition from OpenLane to LibreLane highlights a critical maturation in software engineering practices, moving from procedural string-based script execution to strictly typed, object-oriented, and reproducible pipeline management. At the core, the OpenROAD project and its underlying OpenDB architecture have solved the historical latency of file I/O, allowing sophisticated mathematical engines—such as RePlAce's electrostatic placement and TritonRoute's DRC-aware pathfinding—to manipulate a shared physical graph in real-time.

By coupling these powerful backend algorithmic engines with open-source manufacturing PDKs like Sky130, GF180MCU, and IHP-SG13G2, the barrier to silicon fabrication has been fundamentally shattered. The implications of this extend far beyond academic research; it has enabled countries like Bangladesh to forge a new, knowledge-based semiconductor industry centered entirely around physical design expertise, circumventing the need for localized foundry infrastructure. As machine learning models and intelligent agents begin to interface directly with OpenROAD's metrics and codebase, the vision of a self-driving, 24-hour hardware compiler is rapidly transitioning from a theoretical goal into an operational reality.



## Sources

- [**vlsicad.ucsd.edu** The OpenROAD Project: Unleashing Hardware Innovation](https://vlsicad.ucsd.edu/Publications/Conferences/383/c383.pdf)
- [**par.nsf.gov** First Learnings from the OpenROAD Project - NSF PAR](https://par.nsf.gov/servlets/purl/10171025)
- [**semanticscholar.org** OpenROAD: Toward a Self-Driving, Open-Source Digital Layout](https://www.semanticscholar.org/paper/OpenROAD%3A-Toward-a-Self-Driving%2C-Open-Source-Layout-Ajayi-Blaauw/34bbd7e2f2c5782a38821274793cfa230c903040)
- [**woset-workshop.github.io** OpenDB, OpenROAD's Database - woset-workshop](https://woset-workshop.github.io/PDFs/2019/a6.pdf)
- [**github.com** librelane/Changelog.md at main - GitHub](https://github.com/librelane/librelane/blob/main/Changelog.md)
- [**mdpi.com** From RTL to Fabrication: Survey of Open-Source EDA Tools and PDKs](https://www.mdpi.com/2079-9292/15/5/1048)
- [**portable-linux-apps.github.io** APPLICATIONS - PORTABLE LINUX APPS](https://portable-linux-apps.github.io/en/apps.html)
- [**vighneshiyer.com** 59th Design Automation Conference (DAC 2022) - Vighnesh Iyer](https://vighneshiyer.com/conference_reviews/dac-2022/)
- [**springerprofessional.de** Open-source design of integrated circuits | springerprofessional.de](https://www.springerprofessional.de/en/open-source-design-of-integrated-circuits/26612082)
- [**research.jku.at** IIC-OSIC-TOOLS - JKU & KUK Research Portal](https://research.jku.at/en/publications/iic-osic-tools/)
- [**kwantaekim.github.io** Setting Up Open Source Tools with Docker - Kwantae Kim](https://kwantaekim.github.io/2024/05/25/OSE-Docker/)
- [**iic-jku.github.io** Analog (Integrated) Circuit Design](https://iic-jku.github.io/analog-circuit-design/)
- [**note.com** IIC-OSICによるオープンソース設計環境のセットアップ - note](https://note.com/akira_tsuchiya/n/nf770aa77b785)
- [**siliconwit.com** From FPGA to ASIC with Sky130 and LibreLane - SiliconWit](https://siliconwit.com/ja/education/fpga-digital-design-verilog/fpga-to-asic-sky130-openlane/)
- [**crowdsupply.com** Easier Design Flow: LibreLane & the gf180mcu Project Template](https://www.crowdsupply.com/wafer-space/gf180mcu-run-1/updates/librelane-template)
- [**vlsicad.ucsd.edu** Connecting the Past, Present and Future of Physical Design Research](https://vlsicad.ucsd.edu/Publications/Journals/j139.pdf)
- [**scribd.com** Openroad Readthedocs Io en Latest | PDF - Scribd](https://www.scribd.com/document/761917989/openroad-readthedocs-io-en-latest)
- [**projectsatbangalore.com** Physical Design in VLSI Project Topics 2026 - Projectsatbangalore](https://www.projectsatbangalore.com/physical-design-in-vlsi/)
- [**garden-of-eda.com** Garden of EDA — Open-Source Electronic Design Automation Tools](https://garden-of-eda.com/)
- [**armleo-openlane.readthedocs.io** Configuration Variables - OpenLane Documentation - Read the Docs](https://armleo-openlane.readthedocs.io/en/latest/docs/source/configuration.html)
- [**escholarship.org** UC San Diego Electronic Theses and Dissertations - eScholarship.org](https://escholarship.org/content/qt0tk5z26h/qt0tk5z26h.pdf)
- [**docs.huihoo.com** Embedded SQL Companion Guide | Ingres 10S - Huihoo](https://docs.huihoo.com/ingres/10s/pdf/embedded-sql-companion-guide.pdf)
- [**gitlab.com** OpenLANE Workshop - Grant Brown - GitLab](https://gitlab.com/gab13c/openlane-workshop)
- [**github.com** Anmol-S314/iiitb_sfifo - GitHub](https://github.com/Anmol-S314/iiitb_sfifo)
- [**github.com** GitHub - VardhanSuroshi/VLSI-Physical-Design-Flow: This project](https://github.com/VardhanSuroshi/VLSI-Physical-Design-Flow)
- [**github.com** GitHub - KanishR1/Physical-Design-Using-Openlane](https://github.com/KanishR1/Physical-Design-Using-Openlane)
- [**lab.chipverify.com** User Guide - ChipVerify Lab](https://lab.chipverify.com/public/pages/guide)
- [**researchgate.net** Building OpenLANE: a 130nm openroad-based tapeout-proven flow](https://www.researchgate.net/publication/347688459_Building_OpenLANE_a_130nm_openroad-based_tapeout-proven_flow)
- [**fossi-foundation.org** Announcing the Release of LibreLane - FOSSi Foundation](https://fossi-foundation.org/blog/2025-08-17-librelane)
- [**fossi-foundation.org** El Correo Libre Issue 96 - FOSSi Foundation](https://fossi-foundation.org/blog/2026-04-14-ecl96)
- [**librelane.readthedocs.io** Frequently-Asked Questions (FAQ) - LibreLane Documentation](https://librelane.readthedocs.io/en/stable/faq.html)
- [**github.com** GitHub - librelane/librelane: ASIC implementation flow infrastructure](https://github.com/librelane/librelane)
- [**github.com** OpenLane is an automated RTL to GDSII flow based on ... - GitHub](https://github.com/The-OpenROAD-Project/openlane)
- [**fossi-foundation.org** El Correo Libre Issue 88 - FOSSi Foundation](https://fossi-foundation.org/blog/2025-08-18-ecl88)
- [**huggingface.co** The-OpenROAD-Project/ORAssistant_Public_Evals - Hugging Face](https://huggingface.co/datasets/The-OpenROAD-Project/ORAssistant_Public_Evals/viewer)
- [**researchgate.net** Evolving Trends in VLSI Physical Design Automation - ResearchGate](https://www.researchgate.net/publication/394997477_From_Classical_Algorithms_to_AI_Evolving_Trends_in_VLSI_Physical_Design_Automation)
- [**researchgate.net** Snapshots of mGP progression in ePlace-MS-WA on the MMS](https://www.researchgate.net/figure/Snapshots-of-mGP-progression-in-ePlace-MS-WA-on-the-MMS-ADAPTEC1-benchmark-with-standard_fig6_273348423)
- [**openroad.readthedocs.io** Detailed Routing - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/drt/README.html)
- [**openroad.readthedocs.io** Global Routing - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/grt/README.html)
- [**ecrionix.org** Routing in VLSI Physical Design — Global, Detailed, DRC & SI](https://ecrionix.org/physical-design/routing/)
- [**huggingface.co** The-OpenROAD-Project/ORAssistant_HumanEval_QA_Pairs at main](https://huggingface.co/datasets/The-OpenROAD-Project/ORAssistant_HumanEval_QA_Pairs/blob/main/data.csv)
- [**drdic26.com** DRDIC'26 — Doctoral Research Days in IC Design | 29–30](https://www.drdic26.com/)
- [**opencircuitdesign.com** Open_PDKs-1.0 Changelog Page - Open Circuit Design](https://opencircuitdesign.com/open_pdks/history.html)
- [**mdpi.com** Comprehensive RTL-to-GDSII Workflow for Custom Embedded](https://www.mdpi.com/2079-9292/14/19/3866)
- [**wafer.space** Easier Design Flow: LibreLane & the gf180mcu Project Template](https://wafer.space/news/librelane-template)
- [**github.com** iic-jku repositories - GitHub](https://github.com/orgs/iic-jku/repositories)
- [**github.com** IIC-OSIC-TOOLS/RELEASE_NOTES.md at main - GitHub](https://github.com/iic-jku/IIC-OSIC-TOOLS/blob/main/RELEASE_NOTES.md)
- [**platform.chipfoundry.io** Marketplace - chipIgnite - ASIC Design Platform](https://platform.chipfoundry.io/marketplace)
- [**inspira-bd.com** Semiconductor Statecraft in Asia: Comparative Insights for Bangladesh](https://inspira-bd.com/semiconductor-statecraft-asia-bangladesh/)
- [**tbsnews.net** Why Bangladesh charts a design-first path into semiconductors](https://www.tbsnews.net/bangladesh/why-bangladesh-charts-design-first-path-semiconductors-ditching-wafer-fabrication-1469936)
- [**tbsnews.net** An RMG sector giant is looking to turn Bangladesh into the next chip](https://www.tbsnews.net/features/panorama/rmg-sector-giant-looking-turn-bangladesh-next-chip-making-hub-327595)
- [**masleap.io** Physical Design | Masleap VLSI](https://www.masleap.io/vlsi/physical-design/)
- [**eee.buet.ac.bd** EEE 468 - VLSI Circuits and Design Laboratory](https://eee.buet.ac.bd/academics/undergraduate/courses/eee468)
- [**eee.buet.ac.bd** Project | Department of EEE, BUET](https://eee.buet.ac.bd/academics/undergraduate/project)
- [**aiub.edu** AIUB Student's Achievement at IEEE Region 10 Young](https://www.aiub.edu/aiub-students-achievement-at-ieee-region-10-young-professionals-upskill---bangladesh-2026)
- [**bracu.ac.bd** Shomen Kundu - BRAC University](https://www.bracu.ac.bd/about/people/shomen-kundu)
- [**facebook.com** Neural Semiconductor - Facebook](https://www.facebook.com/NeuralSemi/posts/%F0%9D%90%81%F0%9D%90%AE%F0%9D%90%A2%F0%9D%90%A5%F0%9D%90%9D%F0%9D%90%A2%F0%9D%90%A7%F0%9D%90%A0-%F0%9D%90%81%F0%9D%90%9A%F0%9D%90%A7%F0%9D%90%A0%F0%9D%90%A5%F0%9D%90%9A%F0%9D%90%9D%F0%9D%90%9E%F0%9D%90%AC%F0%9D%90%A1%F0%9D%90%AC-%F0%9D%90%92%F0%9D%90%A2%F0%9D%90%A5%F0%9D%90%A2%F0%9D%90%9C%F0%9D%90%A8%F0%9D%90%A7-%F0%9D%90%85%F0%9D%90%AE%F0%9D%90%AD%F0%9D%90%AE%F0%9D%90%AB%F0%9D%90%9E-%F0%9D%90%93%F0%9D%90%A1%F0%9D%90%AB%F0%9D%90%A8%F0%9D%90%AE%F0%9D%90%A0%F0%9D%90%A1-%F0%9D%90%86%F0%9D%90%A5%F0%9D%90%A8%F0%9D%90%9B%F0%9D%90%9A%F0%9D%90%A5-%F0%9D%90%82%F0%9D%90%A8%F0%9D%90%A5%F0%9D%90%A5%F0%9D%90%9A%F0%9D%90%9B%F0%9D%90%A8%F0%9D%90%AB%F0%9D%90%9A%F0%9D%90%AD%F0%9D%90%A2%F0%9D%90%A8%F0%9D%90%A7at-the-national-/1434684478471033/)
- [**scribd.com** Bangladesh Semiconductor Industry Overview | PDF - Scribd](https://www.scribd.com/document/849037721/Semiconductor-Industry-Update-Concise)
- [**tbsnews.net** Developing Bangladesh's semiconductor workforce through](https://www.tbsnews.net/thoughts/developing-bangladeshs-semiconductor-workforce-through-educational-reforms-1063786)
- [**scribd.com** Bangladesh's Semiconductor Industry Roadmap | PDF - Scribd](https://www.scribd.com/document/849037939/slidesgo-navigating-the-semiconductor-industry-in-bangladesh-opportunities-and-challenges-20250124210608GBXt)
- [**scribd.com** Leveling Up: A Trajectory of Openroad, Tilos and Beyond: Andrew B](https://www.scribd.com/document/1064026637/3505170-3511479)
- [**arxiv.org** Automated QoR improvement in OpenROAD with coding agents](https://arxiv.org/html/2601.06268v2)
- [**tinytapeout.github.io** Tiny Tapeout SKY 26a Datasheet - GitHub Pages](https://tinytapeout.github.io/tinytapeout-sky-26a/datasheet.pdf)
- [**researchgate.net** A distributed approach to silicon compilation: invited - ResearchGate](https://www.researchgate.net/publication/362896297_A_distributed_approach_to_silicon_compilation_invited)
- [**github.com** GitHub - MihaiHMO/VSDhdp](https://github.com/MihaiHMO/VSDhdp)
- [**research.jku.at** IIC-OSIC-TOOLS - JKU & KUK Forschungsportal](https://research.jku.at/de/publications/iic-osic-tools/)
- [**github.com** IIC-OSIC-TOOLS/start_x.sh at main - GitHub](https://github.com/iic-jku/IIC-OSIC-TOOLS/blob/main/start_x.sh)
- [**researchgate.net** (PDF) Open-source design of integrated circuits: An ... - ResearchGate](https://www.researchgate.net/publication/377271442_Open-source_design_of_integrated_circuits_An_open-sourced_144-MSs_703-mW_12-bit_non-binary_SAR-ADC_using_448-aF_capacitors_in_130-nm_CMOS)
- [**eee.buet.ac.bd** EEE 467 - VLSI Circuits and Design | Department of EEE, BUET](https://eee.buet.ac.bd/academics/undergraduate/courses/eee467)
- [**icece.org.bd** ICECE 2026 — 14th International Conference on Electrical and](https://icece.org.bd/)
- [**scribd.com** Résumé of Nadim Chowdhury, EEE BUET | PDF - Scribd](https://www.scribd.com/document/484564804/CV-BUET-NadimChowdhury-Electrical-Electronic-Engineering-pdf)
- [**awesome.ecosyste.ms** Projects in Awesome Lists tagged with asic | Ecosyste.ms: Awesome](https://awesome.ecosyste.ms/projects?keyword=asic&page=1&per_page=100)
- [**fossi-foundation.org** ORConf 2025 September 12 - 14, Valencia, Spain - FOSSi Foundation](https://fossi-foundation.org/orconf/2025)
- [**github.com** The-OpenROAD-Project - GitHub](https://github.com/The-OpenROAD-Project/OpenROAD)
- [**aiub.edu** Center for VLSI and Embedded Systems (CVES) - AIUB](https://www.aiub.edu/research/research-center/center-for-vlsi-and-embedded-systems-cves)
- [**scholar.google.com** ‪ABM Harun-ur Rashid‬ - ‪Google Scholar‬](https://scholar.google.com/citations?user=C9v4rV0AAAAJ&hl=en)
- [**openroad.org** Publications - OpenROAD project](https://openroad.org/resources/publications.html)
- [**dvcon-proceedings.org** Using Open-Source EDA Tools in an Industrial Design Flow](https://dvcon-proceedings.org/wp-content/uploads/74522-1.pdf)
- [**mik226.github.io** Bridging Academic Open-Source EDA to Real-World Usability](https://mik226.github.io/RovinskiAKW20.pdf)
- [**arxiv.org** AgenticPD: A Stage-Aware Agentic Framework for Closed-Loop](https://arxiv.org/html/2607.04758v3)
- [**mith.ro** The Missing Pieces of Open Design Enablement - Tim 'mithro' Ansell](https://mith.ro/papers/missing-pieces-iccad20.pdf)
- [**github.com** FABulous: an Embedded FPGA Framework - GitHub](https://github.com/FPGA-Research/FABulous)
- [**github.com** GitHub - MenkeTechnologies/zsh-more-completions](https://github.com/MenkeTechnologies/zsh-more-completions)
- [**fossi-foundation.org** ORConf 2026 - FOSSi Foundation](https://fossi-foundation.org/orconf/2026)
- [**scribd.com** Semiconductor Industry Overview & Insights | PDF - Scribd](https://www.scribd.com/document/796281091/Comprehensive-Guide-to-the-Semiconductor-Industry-Suppliers-Processes-and-Market-Insights)
- [**scribd.com** sBIT Ltd and Inc: VLSI Design Expertise | PDF - Scribd](https://www.scribd.com/presentation/898071312/sBIT-Expertise-of-the-Industry-related-to-sub-project)
- [**objectstorage.ap-dcc-gazipur-1.oraclecloud15.com** ICT MASTER PLAN2041](https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-moa/2024/12/a01255f61d29443eabbf948ef97c290e.pdf)
- [**github.com** OpenROAD-flow-scripts/docs/tutorials/FlowTutorial.md at master](https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/blob/master/docs/tutorials/FlowTutorial.md)
- [**scribd.com** OpenROAD Routing and Optimization Guide | PDF - Scribd](https://www.scribd.com/document/933887821/openroadroutingdesignflow-1402)
- [**dspace.bracu.ac.bd** development of custom risc-v central processing unit (cpu) with open](https://dspace.bracu.ac.bd/bitstreams/1ba6c922-a65f-44c1-92e5-b12459976944/download)
- [**eee.buet.ac.bd** BUET EEE](https://eee.buet.ac.bd/)
