# The State of Free and Open-Source Silicon (FOSS) EDA: Toolchains, Workflows, PDKs, and Silicon Provenance

## Executive Technical Abstract

The electronic design automation (EDA) ecosystem is undergoing a structural paradigm shift driven by the maturation of Free and Open-Source Silicon (FOSS) tooling. Historically relegated to academic novelties, FOSS EDA toolchains have recently demonstrated industrial viability, enabling multiple successful tapeouts at advanced technology nodes. These toolchains currently provide primary support for fully open-source Process Design Kits (PDKs) at 130nm (SkyWater), 180nm (GlobalFoundries), and 130nm BiCMOS (IHP), fundamentally lowering the barrier to entry for full-custom ASIC design. This comprehensive report critically evaluates the complete VLSI hardware compilation and silicon provenance stack, spanning from High-Level Synthesis (HLS) and intermediate representations (IR) to logic synthesis, physical design, parasitic extraction, signoff, and board-level bring-up.

By dissecting the algorithmic underpinnings of the And-Inverter Graph (AIG) optimizations in Yosys, the timing models within OpenSTA, the routing heuristics of TritonRoute, and the LLVM-based Intermediate Representation (MLIR) compilation of Chisel/FIRRTL via the CIRCT project, this document provides an exhaustive gap analysis between open-source and commercial EDA equivalents. The resulting evaluation isolates persistent deficiencies in advanced FinFET multi-patterning support, complex clock-tree synthesis (CTS), and dynamic IR-drop analysis, while illuminating the immense value of transparent, API-driven, machine learning-accelerated workflows such as OpenLane 2 and SiliconCompiler. This inaugural module establishes the foundation by analyzing the modern constructive hardware description languages (HDLs) and intermediate representations that form the front-end ingestion point for the modern open-source silicon compiler pipeline.

## Master Table of Contents

**MODULE 1: High-Level Exploration, Modern HDLs, and Front-End Synthesis**
1.1 The Shift to Constructive HDLs and Meta-Programming
1.2 Chisel, FIRRTL, and the CIRCT MLIR Compiler Infrastructure
1.3 Bluespec SystemVerilog (BSV): Guarded Atomic Actions and Conflict Matrices
1.4 Google XLS: Accelerated HLS, Mid-Level Synthesis, and Graph-Based ECOs
1.5 SpinalHDL, PyMTL3, and Alternative Generator Frameworks
1.6 Front-End Ingestion: GHDL for VHDL and Early Yosys Integration

**MODULE 2: Logic Synthesis, Technology Mapping, and the Yosys Ecosystem**
2.1 RTL Intermediate Language (RTLIL) and Netlist Lowering
2.2 Yosys Synthesis Pipelines: `proc`, `fsm`, `memory`, and `opt` passes
2.3 Boolean Logic Optimization: ABC, And-Inverter Graphs (AIG), and `techmap`
2.4 Standard Cell Liberty File Format and Flip-Flop Inference
2.5 Comparative Benchmarks vs. Commercial Synthesis Tools

**MODULE 3: Verification, Simulation, Formal Equivalence, and Emulation**
3.1 Cycle-Accurate Execution: Verilator C++ Lowering and Multi-Threading
3.2 Event-Driven Simulation: Icarus Verilog and Python Testbenches (Cocotb)
3.3 Formal Verification: SymbiYosys, Bounded Model Checking (BMC), and k-induction
3.4 Hardware Emulation and FPGA-Accelerated Testing Workflows

**MODULE 4: Physical Design Foundation and Automated Place-and-Route (OpenROAD)**
4.1 The OpenDB/OpenROAD Data Model and Architecture
4.2 Floorplanning, PDN Generation, and Macro Placement (RePlace)
4.3 Clock Tree Synthesis (TritonCTS) and Skew Optimization
4.4 Global and Detailed Routing: FastRoute and TritonRoute Heuristics

**MODULE 5: End-to-End Automated Push-Button Flows**
5.1 OpenLane 1.x vs. OpenLane 2: Tcl Monoliths to Modular Python APIs
5.2 Execution Flow: Configuration Parsing, Steps, and Flow State Management
5.3 SiliconCompiler: Distributed and Scalable Hardware Compilation
5.4 Alternative Frameworks: Coriolis2 and the Tiny Tapeout Workflow

**MODULE 6: Custom Layout, Analog/Mixed-Signal (AMS), and RF Co-Design**
6.1 Layout Editors and Cornerstones: Magic and KLayout
6.2 Schematic Capture and SPICE Netlisting (Xschem)
6.3 Open-Source SPICE Engines (Ngspice) and RF Simulation (Quc-s)
6.4 Programmatic Layout Generation and PyCell Alternatives

**MODULE 7: Physical Verification (DRC/LVS) and Parasitic Extraction (PEX)**
7.1 Design Rule Checking (DRC) Algorithms in Magic and KLayout
7.2 Layout vs. Schematic (LVS) Extraction and Netgen
7.3 Parasitic Extraction (PEX): OpenRCX, FastCap/FastHenry methodologies
7.4 3D Field Solvers and High-Frequency Validation

**MODULE 8: Static Timing Analysis (STA), Signoff, and Power/IR Integrity**
8.1 OpenSTA: Path-Level Timing, Arrival Times, and Slack Analysis
8.2 Non-Linear Delay Models (NLDM) and Composite Current Source (CCS) Support
8.3 Multi-Mode Multi-Corner (MMMC) Optimization and Variation
8.4 Power Integrity, EM/IR Drop Analysis, and Dynamic Supply Signoff

**MODULE 9: Open Process Design Kits (PDKs) and Silicon Foundry Provenance**
9.1 SkyWater SKY130: 130nm Standard Cells, SRAM, and High-Voltage Nodes
9.2 GlobalFoundries GF180MCU and IHP SG13G2 (BiCMOS)
9.3 PDK Tooling and Version Control: Open_PDKs and Volare
9.4 DFM, Dummy Fill, and Foundry Qualification Hurdles

**MODULE 10: Advanced Packaging, Board-Level Co-Design, and Industrial Viability Gap Analysis**
10.1 Packaging Workflows: KiCad Integration and Carrier PCB Architecture
10.2 IO Ring Generation: Caravel Harness and chipIgnite
10.3 The Industrial Viability Gap: Advanced Nodes (FinFET, <22nm) and Deficiencies
10.4 Strategic Roadmap for FOSS EDA Scaling

---

## MODULE 1: High-Level Exploration, Modern HDLs, and Front-End Synthesis

### 1.1 The Shift to Constructive HDLs and Meta-Programming

Traditional Register Transfer Level (RTL) languages like SystemVerilog and VHDL provide highly explicit control over localized hardware constructs but severely lack the robust software engineering principles—such as object-oriented inheritance, functional programming paradigms, and parametric generator scaling—required to manage multi-million gate System-on-Chip (SoC) complexity. The modern open-source EDA stack begins with Hardware Construction Languages (HCLs) and High-Level Synthesis (HLS) frameworks that function essentially as meta-programming layers . These frameworks evaluate a high-level software model, emit an Intermediate Representation (IR), apply compiler optimization passes, and ultimately lower the design to synthesizable Verilog or VHDL target files. 

This methodological shift aims to address the limitations of standard HLS approaches to non-trivial problems, which frequently abstract away micro-architectural decisions without yielding insight into the resulting synthesized logic . Modern FOSS HCLs strike a deliberate balance between succinct behavioral expression and explicit physical realization, transferring the validation burden from late-stage logic simulation to early-stage software compilation.

### 1.2 Chisel, FIRRTL, and the CIRCT MLIR Compiler Infrastructure

Chisel (Constructive Hardware Design Language), originally developed at UC Berkeley and embedded within Scala, is an industry-proven HCL utilized heavily in the RISC-V ecosystem (e.g., RocketChip, BOOM, SiFive cores). Maintained primarily by the Chisel open-source community and SiFive, the foundational algorithm behind Chisel’s success is its emission of FIRRTL (A Flexible Intermediate Representation for RTL) . FIRRTL provides a strictly defined, formal elaborated graph of the hardware prior to any simplification. By establishing structural invariants that can be enforced before and after each compilation stage, FIRRTL ensures a more robust compiler framework and a highly structured mechanism for logic simplification and micro-passes .

Historically, Chisel utilized the Scala FIRRTL Compiler (SFC) to compile designs into Verilog . However, compiling massive SoC designs in a Scala-based execution environment posed significant heap memory and compilation speed bottlenecks. The ecosystem has subsequently transitioned to the MLIR-based FIRRTL Compiler (MFC), implemented as a core component of the CIRCT (Circuit IR Compilers and Tools) LLVM incubator project . The CIRCT compiler architecture operates by parsing the Scala-emitted `.fir` file and iteratively lowering it through a sequence of specific MLIR dialects, translating abstract constructs into structurally accurate hardware descriptions .

+----------------+       +-------------------+       +-----------------+

| Chisel (Scala) | ----> | CHIRRTL (High IR) | ----> | FIRRTL Dialect |
+----------------+       +-------------------+       +-----------------+
|
                                                     [firrtl-lower-types]
                                                     [lower-firrtl-to-hw]
|
+----------------+       +-------------------+       +-----------------+

| Verilog/SV | <---- | SV Dialect | <---- | HW Dialect |
+----------------+       +-------------------+       +-----------------+

The lowering process invokes highly specific MLIR passes engineered to strip abstraction while preserving logical intent. For instance, the `firrtl-lower-types` pass replaces complex bundle or struct types with flat scalars . During this pass, each scalar field is prepended with the original bundle name (e.g., replacing a bundle named `myreg` containing `a` and `b` with `myreg_a` and `myreg_b`) to maintain human readability . Subsequently, the `lower-firrtl-to-hw` pass translates FIRRTL semantics into the hardware (`hw`) dialect structures, mapping logical modules and aggregate memory configurations . Memory constructs in this dialect retain complex attributes such as mask bitwidth, read latency, and read-under-write behaviors until explicit extraction . Finally, the `export-verilog` pass converts the SystemVerilog (`sv`) dialect nodes into synthesizable RTL text strings . 

**File Format I/O Chain:** Scala Source `.scala` $\rightarrow$ CHIRRTL `.fir` $\rightarrow$ MLIR Data Structures $\rightarrow$ Synthesizable SystemVerilog `.v` / `.sv`.

*Execution recipe mapping FIRRTL to Verilog using `firtool`:*
```bash
firtool \
  --format=fir \
  --export-module-hierarchy \
  -O=release \
  --preserve-values=named \
  input_design.fir > output_design.v
```

**Tapeout Validation and Known Failure Modes:**
Toolchains utilizing CIRCT and Chisel have achieved massive industrial validation, powering commercial silicon from SiFive and Google. However, failure modes exist predominantly around the preservation of internal signal names during aggressive optimization. Without the `-O=debug` or `--preserve-values=named` flags, the compiler routinely deletes unobservable or purely combinatorial nodes, leading to mismatch errors during post-route verification or waveform debugging . Furthermore, because the FIRRTL dialect requires strict def-before-use dominance for module bodies instead of allowing arbitrary graph cycles, unintentional combinatorial loops generated in Scala will fail at the FIRRTL validation stage rather than during synthesis . 

### 1.3 Bluespec SystemVerilog (BSV): Guarded Atomic Actions and Conflict Matrices

While Chisel leverages meta-programming to emit structural graphs, Bluespec SystemVerilog (BSV) introduces an entirely different algorithmic paradigm: Guarded Atomic Actions (GAA) . Maintained by B-Lang.org (originally developed as a proprietary tool by Bluespec Inc., now fully open-source), the `bsc` compiler enforces a methodology where the hardware designer explicitly defines state elements and the indivisible, atomic "rules" that mutate that state .

In BSV, the hardware datapath is described explicitly, but the control path is automatically synthesized. Every rule possesses a condition (the guard). When the guard evaluates to true, the rule executes atomically, with all state reads observing the state as it existed immediately prior to the rule's execution, and all state writes occurring simultaneously at the rule's conclusion . 

| Feature | Traditional Verilog | Bluespec SystemVerilog (BSV) |
| :--- | :--- | :--- |
| **Control Logic** | Explicitly defined state machines | Implicitly generated via Conflict Matrix |
| **Concurrency** | Non-blocking assignments (`<=`) | Guarded Atomic Actions (Rules) |
| **Race Conditions** | Common, requires manual sensitivity list checks | Inherently prevented by atomic execution semantics |
| **Modularity** | Weak parameterization | Strong typing, interfaces, and monadic binds (`<-`) |

To map these un-timed, atomic transactions into clocked RTL, the `bsc` compiler's scheduler analyzes the read-and-write action sets of every rule. It constructs a **Conflict Matrix** to identify rules that attempt to update the same state concurrently or cause structural hardware hazards . If a conflict is irresolvable within the same clock cycle, the compiler enforces mutual exclusion based on user-defined urgency attributes. The compiler automatically generates the requisite muxing and `enable` signals for the underlying hardware registers . 

**File Format I/O Chain:** Bluespec Source `.bsv` $\rightarrow$ BSC AST $\rightarrow$ Synthesizable Verilog `.v` (or C++ for simulation).

**Tapeout Validation and Known Failure Modes:**
BSV has been validated in highly complex commercial tapeouts, most notably serving as the hardware definition language for the AWS Nitro security enclaves and multiple RISC-V cores (e.g., Flute, Piccolo). The primary failure mode in BSV development is rule starvation and schedule deadlocks. If a developer fails to properly configure the conflict matrix urgencies, a rule may never fire because its guard remains persistently blocked by a higher-priority rule, leading to pipeline stalls that are often difficult to trace without utilizing the Bluespec Development Workstation (BDW) schedule visualizations . 

### 1.4 Google XLS: Accelerated HLS, Mid-Level Synthesis, and Graph-Based ECOs

Google XLS (Accelerated Hardware Synthesis) represents a modern approach to software-driven hardware design, self-described as a "Mid-Level Synthesis" tool . Maintained primarily by Google and integrated heavily with the Bazel build system, XLS seeks to rectify the limitations of traditional HLS tools (e.g., Vivado HLS or Intel HLS Compiler) which heavily abstract clock cycle boundaries . Rather than acting as a black box, XLS provides explicit configuration over pipeline stages, SRAM insertion channels, and acceptable worst-case throughput targets . It supports both C++ front-ends and DSLX, a Rust-like domain-specific language that provides significant productivity advantages and is JIT-compiled via LLVM for exceptionally fast native-speed software execution .

The underlying algorithm relies on translating high-level code into XLS IR, an intermediate representation optimized exclusively for dataflow computation and Static Single Assignment (SSA) properties . The IR natively supports `procs`—stateful, concurrent processes acting as multi-cycle concurrent elements that communicate over synchronized channels, bridging the gap between always-blocks and software loops . 

A highly novel feature of the XLS ecosystem is its graph-based Engineering Change Order (ECO) methodology. Late-stage RTL changes are historically difficult in HLS because minute high-level code changes cause massive structural shifts in the emitted RTL. The XLS ECO flow parses the XLS IR into a NetworkX `MultiDiGraph` structure, where nodes represent arithmetic operations and edges represent static data flow . By computing the Graph Edit Distance (GED) between the original and modified IR graphs, the tool isolates structural differences and generates a minimal ECO patch. The patch applier then surgically modifies the target IR without disturbing the unchanged logic, drastically reducing the verification burden for late-stage pipeline modifications .

**File Format I/O Chain:** DSLX/C++ $\rightarrow$ XLS IR `.ir` $\rightarrow$ Optimized IR $\rightarrow$ Verilog `.v` $\rightarrow$ DEF/GDSII (via OpenROAD).

*Execution recipe mapping XLS IR to Verilog via pipeline generation:*
```bash
# Compile DSLX to IR, optimize, and generate pipeline Verilog
opt_main input.ir > optimized.ir
codegen_main optimized.ir \
  --generator=pipeline \
  --pipeline_stages=4 \
  --module_name=mac_engine > mac_engine.v
```

**Tapeout Validation and Known Failure Modes:**
XLS is validated in Google's internal IP blocks and has demonstrated viability in OpenROAD tapeouts targeting the SKY130 and ASAP7 PDKs . It is heavily adopted for algorithmically complex designs like Run-Length Encoding (RLE) blocks and AI accelerator synthesis via `hls4ml` . The primary known failure mode is tied to its "experimental" status; the maintainers openly admit it contains "bugs and sharp edges" . Specifically, scaling massive stateful `procs` with deeply nested synchronization barriers can overwhelm the scheduling optimizer, resulting in sub-optimal pipeline register insertion compared to hand-optimized RTL .

### 1.5 SpinalHDL, PyMTL3, and Alternative Generator Frameworks

While Chisel relies on the CIRCT MLIR infrastructure to perform lowering, SpinalHDL, another prominent Scala-based HCL, takes a more direct compilation approach. Maintained by Charles Papon and an active open-source community, SpinalHDL constructs an Abstract Syntax Tree (AST) in memory during Scala elaboration . It then traverses this AST to natively resolve scoping and connectivity, directly emitting synthesizable VHDL (1993/2008), Verilog (2001), or SystemVerilog without the need for external compiler intermediaries .

SpinalHDL’s architecture natively tracks signal scope and safely handles clock domains at the type level, effectively eliminating combinatorial loops and cross-domain timing hazards during elaboration . Furthermore, the SpinalHDL ecosystem boasts deep integration with analysis frameworks such as Spade and the Waveform Analysis Language (WAL) . By utilizing pragmas such as `#[wal_traceable]`, users can embed simulation probes at the AST level. This guarantees that post-synthesis waveform databases (VCD/FST) remain perfectly correlated to the original high-level code, significantly enhancing debugging productivity . SpinalHDL has seen extensive real-world tapeout success, primarily through the VexRiscv core and the SaxonSoc framework . The chief limitation remains the dependency on the JVM environment, which can consume massive amounts of heap memory when elaborating multi-million gate SoC topologies.

Conversely, PyMTL3, maintained by Cornell University, shifts the meta-programming paradigm to Python. PyMTL3 functions as a unified framework for hardware modeling, simulation, and hardware generation. It leverages Python's dynamic typing and meta-programming capabilities to generate an in-memory AST that is then translated into Verilog. A key advantage of PyMTL3 is its ability to utilize Python's extensive testing frameworks (like `pytest`) and Just-In-Time (JIT) translation for high-speed cycle-accurate simulation prior to RTL emission. It has been validated in academic tapeouts such as the Celerity SoC. However, a primary failure mode of PyMTL3 centers on the Python Global Interpreter Lock (GIL), which can severely bottleneck simulation performance for massive designs compared to compiled C++ equivalents, alongside occasional runtime errors stemming from dynamic typing mismatches prior to elaboration.

### 1.6 Front-End Ingestion: GHDL for VHDL and Early Yosys Integration

Regardless of the HLS or HDL generator utilized, the ultimate goal of the front-end flow is successful ingestion into a logic synthesis engine. While Verilog is universally parsed by the Yosys Open SYnthesis Suite, VHDL historically lacked reliable FOSS support . This structural deficiency is rectified by GHDL, an open-source VHDL 1987/1993/2002/2008 analyzer, compiler, and simulator authored and maintained by Tristan Gingold . 

GHDL translates VHDL directly into executable machine code for high-speed simulation, supporting GCC, LLVM, or mcode backends . To bridge the gap into the logic synthesis flow, the ecosystem relies on the `ghdl-yosys-plugin` . When invoked, GHDL processes the VHDL files, checks syntax, and constructs an internal AST. The plugin then transverses this AST and maps the logic directly into Yosys' internal RTLIL (RTL Intermediate Language) . 

| Tool / Framework | Native Language | Internal AST / IR | Synthesis Bridge |
| :--- | :--- | :--- | :--- |
| **Chisel** | Scala | FIRRTL / MLIR Dialects | CIRCT `export-verilog` $\rightarrow$ Yosys |
| **Bluespec (BSV)** | BSV | bsc AST / Conflict Matrix | bsc Verilog emission $\rightarrow$ Yosys |
| **XLS** | C++ / DSLX | XLS IR / MultiDiGraph | XLS Codegen $\rightarrow$ Yosys |
| **SpinalHDL** | Scala | Spinal AST | Verilog/VHDL emission $\rightarrow$ Yosys/GHDL |
| **GHDL** | VHDL | GHDL AST | `ghdl-yosys-plugin` $\rightarrow$ Yosys RTLIL |

*Execution recipe for VHDL synthesis through GHDL into Yosys:*
```tcl
# Yosys synthesis script (synth.ys)
# Ingest VHDL via GHDL plugin, elaborating the top module
ghdl --std=08 input_design.vhd -e top_module
# Execute Yosys optimization pipeline
proc; opt;
fsm; opt;
memory; opt;
techmap; opt;
write_verilog synth_output.v
```

This tight, programmatic integration ensures that the multi-language outputs of modern architectural exploration frameworks can converge successfully onto the AIG optimization pipelines of Yosys, facilitating a unified backend logic synthesis methodology . The reliance on community-maintained plugins occasionally leads to version mismatch failures (e.g., mismatched libghdl headers resulting in failed plugin compilation), necessitating strict environment management using containerized execution or the conda-eda ecosystem .


## Sources

- [**docs.altera.com** Intel HLS Compiler: Fast Design, Coding, and Hardware](https://docs.altera.com/api/khub/documents/BwlgXsLT0I97b6xnheQFqQ/content)
- [**bar.eecs.berkeley.edu** UCB-BAR: FIRRTL](https://bar.eecs.berkeley.edu/projects/firrtl.html)
- [**scribd.com** Compiler-Driven HDL Waveform Analysis | PDF - Scribd](https://www.scribd.com/document/981120906/Enhancing-Compiler-Driven-HDL-Design-with)
- [**antmicro.com** Accelerating digital block design with Google's open source Mid](https://antmicro.com/blog/2023/09/accelerating-digital-block-design-with-googles-xls)
- [**chipyard.readthedocs.io** 4.2. FIRRTL — Chipyard 1.11.0 documentation](https://chipyard.readthedocs.io/en/stable/Tools/FIRRTL.html)
- [**chipyard.readthedocs.io** 6.14. Adding a Firrtl Transform — Chipyard 1.11.0 documentation](https://chipyard.readthedocs.io/en/stable/Customization/Firrtl-Transforms.html)
- [**github.com** Library to compile Chisel circuits using LLVM/MLIR (CIRCT) · GitHub](https://github.com/sifive/chisel-circt)
- [**woset-workshop.github.io** MLIR as Hardware Compiler Infrastructure - woset-workshop](https://woset-workshop.github.io/PDFs/2021/a06-slides.pdf)
- [**circt.llvm.org** 'firrtl' Dialect - CIRCT](https://circt.llvm.org/docs/Dialects/FIRRTL/)
- [**circt.llvm.org** Passes - CIRCT](https://circt.llvm.org/docs/Passes/)
- [**cameronfdurbin.com** 123 CIRCT firrtl Dialect – MLIR Reference Manual](https://www.cameronfdurbin.com/mlir-reference-manual/chapters/circt-firrtl)
- [**circt.llvm.org** FIRRTL Dialect Rationale - CIRCT](https://circt.llvm.org/docs/Dialects/FIRRTL/RationaleFIRRTL/)
- [**discourse.llvm.org** CIRCT: Lowering Upstream MLIR into Verilog - LLVM Discourse](https://discourse.llvm.org/t/circt-lowering-upstream-mlir-into-verilog/84076)
- [**arxiv.org** Research Note: An Open Source Bluespec Compiler - arXiv](https://arxiv.org/pdf/1905.03746)
- [**csg.csail.mit.edu** GAA-to-RTL Synthesis using the Bluespec Compiler - MIT](https://csg.csail.mit.edu/6.375/6_375_2006_www/handouts/tutorials/tut8-bsc.pdf)
- [**github.com** B-Lang-org/bsc: Bluespec Compiler (BSC) - GitHub](https://github.com/B-Lang-org/bsc)
- [**yehowshuaimmanuel.com** An Interesting Consequence of Bluespec's One Rule at a Time](https://yehowshuaimmanuel.com/posts/oraat-fifo/)
- [**medium.com** 5 Years of Thinking In Rules - Medium](https://medium.com/@talktokarthikbk/5-years-of-thinking-in-rules-fc6314a2d786)
- [**ocw.mit.edu** Bluespec Tutorial: Rule Scheduling and Synthesis](https://ocw.mit.edu/courses/6-884-complex-digital-systems-spring-2005/01e06522cd4ab035dbbbd38279045351_t03_bluespec.pdf)
- [**woset-workshop.github.io** The Open-Source Bluespec bsc Compiler and Reusable Example](https://woset-workshop.github.io/PDFs/2021/a02.pdf)
- [**summerofcode.withgoogle.com** Integrating Support for Google XLS in hls4ml](https://summerofcode.withgoogle.com/archive/2025/projects/Mv9bV0rM)
- [**google.github.io** XLS: Accelerated HW Synthesis - Google](https://google.github.io/xls/)
- [**arxiv.org** Graph-Based ECO and Patch Generation for High-Level Synthesis](https://arxiv.org/pdf/2604.14248)
- [**hepsoftwarefoundation.org** Integrating Support for Google XLS in HLS4ML](https://hepsoftwarefoundation.org/gsoc/2025/proposal_ML4EP_Google_XLS_in_hls4ml.html)
- [**github.com** GitHub - cjacker/opensource-toolchain-fpga](https://github.com/cjacker/opensource-toolchain-fpga)
- [**scribd.com** (System) Verilog To Chisel Translation For Faster Hardware Design](https://www.scribd.com/document/638497788/System-Verilog-to-Chisel-Translation-for-Faster-Hardware-design)
- [**eprints.cs.univie.ac.at** DISSERTATION / DOCTORAL THESIS - EPrints - Universität Wien](https://eprints.cs.univie.ac.at/7343/1/paulweber2022phd.pdf)
- [**mediatum.ub.tum.de** Model-based Generation of Highly Configurable RTL ... - mediaTUM](https://mediatum.ub.tum.de/doc/1706183/1706183.pdf)
- [**spade-lang.org** Enhancing Compiler-Driven HDL Design with Automatic Waveform](https://spade-lang.org/fdl2023.pdf)
- [**nlnet.nl** All projects - NLnet Foundation](https://nlnet.nl/project/)
- [**abopen.com** CRU: RISC-V Soft-Core Contest, Wuthering Bytes Programme, Plan](https://abopen.com/news/cru-risc-v-soft-core-contest-wuthering-bytes-programme-plan-9-for-raspberry-pi-and-more/)
- [**yosyshq.net** Yosys Open SYnthesis Suite :: About - YosysHQ](https://yosyshq.net/yosys/)
- [**digitalcommons.usu.edu** Field-Programmable Gate Array Implementation of a Scalable](https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=1850&context=etd)
- [**digikogu.taltech.ee** Pyha - Object-Oriented Hardware Description Language - Digikogu](https://digikogu.taltech.ee/en/Download/6b620fef-1a76-40f2-9f28-b4f2e49cb32a)
- [**github.com** make fails · Issue #149 · ghdl/ghdl-yosys-plugin - GitHub](https://github.com/ghdl/ghdl-yosys-plugin/issues/149)
- [**repository.cern** System-level verification and testing of a safety-critical SoC using](https://repository.cern/records/p8pkj-nt716/files/CERN-THESIS-2022-083.pdf)
- [**upcommons.upc.edu** A Framework to Enable RTL Models Inside a Full-System Simulator](https://upcommons.upc.edu/bitstreams/b157ba39-6a45-4191-8488-d3f41bcfbf49/download)
- [**github.com** GitHub - YosysHQ/yosys: Yosys Open SYnthesis Suite](https://github.com/yosyshq/yosys)
- [**scribd.com** Yosys Open Synthesis Suite Manual | PDF - Scribd](https://www.scribd.com/document/403648769/yosys-manual-pdf)
- [**researchgate.net** Toward Developing High-Performance RISC-V Processors Using](https://www.researchgate.net/publication/370664288_Toward_Developing_High-Performance_RISC-V_Processors_Using_Agile_Methodology)
- [**orconf.org** ORConf 2019](https://orconf.org/2019)
- [**par.nsf.gov** RTL-Repair: Fast Symbolic Repair of Hardware Design Code](https://par.nsf.gov/servlets/purl/10561674)
- [**d-nb.info** Design, Implementation, and Test of a Tri-Mode Ethernet MAC on an](https://d-nb.info/1185073698/34)
- [**mdpi.com** A Virtual Device for Simulation-Based Fault Injection - MDPI](https://www.mdpi.com/2079-9292/9/12/1989)
- [**yosyshq.readthedocs.io** synth - generic synthesis script - YosysHQ Yosys 0.46 documentation](https://yosyshq.readthedocs.io/projects/yosys/en/0.46/cmd/synth.html)
- [**yosyshq.readthedocs.io** YosysHQ Yosys](https://yosyshq.readthedocs.io/_/downloads/yosys/en/0.38/pdf/)
- [**yosyshq.readthedocs.io** Synthesis in detail - YosysHQ Yosys 0.69-dev documentation](https://yosyshq.readthedocs.io/projects/yosys/en/latest/using_yosys/synthesis/index.html)
- [**youtube.com** Yosys Tutorial: Practical Guide to Synthesis - YouTube](https://www.youtube.com/watch?v=MRMKAOReHZI)
- [**eureka.patsnap.com** Comparing Algorithms for Auto-Routing vs Manual Circuit Design](https://eureka.patsnap.com/report-comparing-algorithms-for-auto-routing-vs-manual-circuit-design)
- [**scribd.com** OpenROAD: Evaluating Open-Source EDA Tools | PDF - Scribd](https://www.scribd.com/document/740911511/Opensource-EDA)
- [**eccsubmit.com** AI-Enhanced Design Automation for Next-Gen Electronics](https://eccsubmit.com/index.php/congress/article/download/19/238/509)
- [**ijisae.org** intelligent systems and applications in engineering - ijisae.org](https://www.ijisae.org/index.php/IJISAE/article/download/7807/6825/13238)
- [**shipxu123.github.io** Prerouting Timing Prediction Across Different Technology Nodes](https://shipxu123.github.io/papers/J7-TCAD2025-AdaTimer.pdf)
- [**vlsicad.ucsd.edu** PPA-Relevant Clustering-Driven Placement for Large-Scale VLSI](https://vlsicad.ucsd.edu/Publications/Conferences/410/c410.pdf)
- [**jics.org.br** Towards a Reference Place and Route Flow for Academic Research](https://jics.org.br/ojs/index.php/JICS/article/download/648/426/2983)
- [**proceedings.iclr.cc** CIRCUITNET 2.0: AN ADVANCED DATASET FOR PRO](https://proceedings.iclr.cc/paper_files/paper/2024/file/464917b6103e074e1f9df7a2bf3bf6ba-Paper-Conference.pdf)
- [**yibolin.com** GPU Acceleration for Versatile Buffer Insertion - Yibo Lin](https://yibolin.com/publications/papers/OPT_ICCAD2025_Pu.pdf)
- [**yibolin.com** HeteroPower: A CPU-GPU Heterogeneous Engine to Accelerate](https://yibolin.com/publications/papers/POWER_ISEDA2026_Shi.pdf)
- [**date24.date-conference.com** Programme | DATE 2024](https://date24.date-conference.com/programme)
- [**arxiv.org** EDA-Schema-V2: A Multimodal Schema, Open Datasets, and ... - arXiv](https://arxiv.org/html/2605.06952v1)
- [**arxiv.org** HeteroSTA: A CPU-GPU Heterogeneous Static Timing Analysis](https://arxiv.org/pdf/2511.11660)
- [**escholarship.org** UC San Diego Electronic Theses and Dissertations - eScholarship.org](https://escholarship.org/content/qt0tk5z26h/qt0tk5z26h.pdf)
- [**researchgate.net** (PDF) SDN Controllers: Benchmarking & Performance Evaluation](https://www.researchgate.net/publication/331061878_SDN_Controllers_Benchmarking_Performance_Evaluation)
- [**woset-workshop.github.io** OpenLane 2: Making the Most Popular Open Source ASIC Flow](https://woset-workshop.github.io/PDFs/2024/17_OpenLane_2_Making_the_Most_.pdf)
- [**github.com** GitHub - chipfoundry/openlane2: The next generation of OpenLane](https://github.com/chipfoundry/openlane2)
- [**wafer.space** Easier Design Flow: LibreLane & the gf180mcu Project Template](https://wafer.space/news/librelane-template)
- [**scribd.com** Greyhound: Open-Source RISC-V SoC Design | PDF - Scribd](https://www.scribd.com/document/967803898/90087)
