# The Open-Source Silicon Engineering Handbook

## CHAPTER 1: MODERN HDL & HARDWARE CONSTRUCTION ARCHITECTURES

The discipline of digital Very-Large-Scale Integration (VLSI) design has fundamentally shifted from traditional, event-driven hardware simulation languages to structurally generated, compiler-driven methodologies. Historically, standard languages were engineered primarily to model simulation behavior rather than strictly to define physical hardware synthesis. This legacy architecture necessitates a complex semantic interpretation during logic synthesis, often leading to deep discrepancies between the simulated event-driven model and the final structural netlist. In response, the open-source Electronic Design Automation (EDA) ecosystem has cultivated a new tier of Hardware Construction Languages (HCLs) and multi-level Intermediate Representations (IRs). These modern paradigms decouple hardware parameterization and meta-programming from the underlying structural instantiation, providing robust type systems, mathematically verifiable timing semantics, and deterministic compiler architectures. 

The underlying trend across the semiconductor industry indicates that as System-on-Chip (SoC) complexity scales into the billions of transistors, the cognitive load of tracking clock-domain crossings, pipeline scheduling, and structural parameterization exceeds human capacity. Modern open-source tooling directly addresses these bottlenecks by migrating digital design away from the manual transcription of logic gates and toward the programmatic compilation of hardware ASTs (Abstract Syntax Trees).

### The Semantic Gap: SystemVerilog-2017 and Legacy Paradigms

SystemVerilog-2017 (IEEE 1800-2017) remains the predominant standard for final-stage register-transfer level (RTL) representation and verification toolchain interoperability . However, its dual nature as both an event-driven simulator language and a structural synthesis language introduces severe semantic ambiguity into the hardware design process. The language's internal data structures are heavily laden with procedural constructs—such as `always_ff`, `always_comb`, and `initial` blocks—that synthesis tools must parse, pattern-match, and heuristically lower into physical registers and combinatorial gates. 

In the open-source toolchain ecosystem, SystemVerilog ingestion is managed by advanced parser frameworks such as Slang, Surelog, and the Rust-based `sv-parser` . These tools face an immense computational burden: they must resolve complex scoping rules, execute unrolled generative blocks, and linearize multi-dimensional packed arrays before passing the structural intent to a downstream synthesis engine like Yosys. The fundamental limitation of SystemVerilog lies in its inability to natively support higher-order functions, functional data structures, and object-oriented inheritance for hardware generation. Parameterization within standard SystemVerilog is strictly restricted to static module `parameter` definitions and simplistic `generate` loops. This lack of advanced meta-programming means that developing scalable, heavily configurable Intellectual Property (IP) cores—such as coherent cache interconnects, network-on-chip (NoC) routers, or variable-precision vector arithmetic logic units (ALUs)—requires brittle external scripting or deeply nested preprocessor macros.

When RTL designs rely on these standard HDL abstractions, they become inherently susceptible to timing hazards and structural misconfigurations. The root cause is that SystemVerilog abstracts state but fails to natively encode the temporal constraints of that state across multiple clock cycles . To bridge this semantic gap, modern hardware construction relies on general-purpose host languages, such as Scala, Python, and Rust, to serve as meta-programming environments . The execution of a program in these host languages performs an elaboration step, programmatically instantiating nodes in a memory-resident hardware graph. This deterministic AST is then serialized into an intermediate representation or directly into a highly constrained, synthesis-friendly subset of SystemVerilog.

### Scala-Based Hardware Construction: Chisel and SpinalHDL

The transition to embedded Hardware Construction Languages (eHDLs) leverages the Turing-complete nature of modern software languages to compute the structure of the hardware at compile time. The output is a rigorously defined structural graph, free of the event-driven ambiguities present in traditional HDLs. Scala, running on the Java Virtual Machine (JVM), provides an optimal foundation for these HCLs due to its robust functional features, static typing, and object-oriented paradigms. 

SpinalHDL and Chisel are the premier Scala-based generators in the open-source ecosystem . Rather than writing static logic, engineers write Scala programs that generate logic. The abstraction level remains at the RTL domain, but the *construction* of that RTL is vastly accelerated . 

#### Type Systems and Data Structures

In SpinalHDL, hardware topologies are constructed by extending the base `Component` class . A component acts as a strictly bounded piece of logic where the only accessible signals are its explicitly defined inputs and outputs . This encapsulation forces clean hierarchical design. 

The language enforces a rigorous static type system composed of five base types: `Bool`, `Bits`, `UInt` (unsigned integers), `SInt` (signed integers), and `Enum` . These types carry deep semantic meaning during elaboration. For example, assigning an unsigned integer to a raw bit-vector requires an explicit cast, preventing the silent truncation and zero-extension bugs common in weakly-typed Verilog. Furthermore, SpinalHDL supports advanced arithmetic operations that automatically infer the width of the resulting hardware. Multiplying a 16-bit `UInt` by an 8-bit `UInt` yields a mathematically guaranteed 24-bit `UInt` . 

Complex interfaces are aggregated using the `Bundle` composite type, which functions analogously to a VHDL record or a C-struct, but with the added capability of polymorphic method definitions and dynamic directional inversion . An engineer can define an Advanced Peripheral Bus (APB) interface as a single `Bundle`, complete with data width and address width parameters. A single method call, such as `asMaster()` or `asSlave()`, automatically sets the appropriate input/output directions for all sub-signals within the bundle, eliminating hundreds of lines of error-prone port mappings .

| Data Type | Abstraction Level | Primary Use Case in SpinalHDL |
| :--- | :--- | :--- |
| `Bool` | Base Type | Single-bit logic, conditional guards, multiplexer selection . |
| `Bits` | Base Type | Untyped bit vectors, arbitrary data payloads, bitwise operations . |
| `UInt` / `SInt` | Base Type | Unsigned/Signed mathematical arithmetic, automatic width inference . |
| `Enum` | Base Type | State machine encodings, strongly typed configuration states . |
| `Bundle` | Composite Type | Grouping heterogeneous signals into standard interfaces (e.g., AXI4, APB) . |
| `Vec` | Composite Type | Addressable arrays of identical hardware elements, supporting dynamic indexing . |

#### Clock Domain Encapsulation and Safety

A critical architectural advantage of SpinalHDL over raw SystemVerilog is the explicit, first-class treatment of clock domains. In traditional HDLs, clock and reset signals are routed manually as standard wires, making it trivially easy to accidentally clock a register with a data signal or route a reset to the wrong module. 

SpinalHDL resolves this by introducing the `ClockDomain` object, which encapsulates the clock signal, reset signal, and an optional clock-enable signal . Hardware instantiated within a `ClockingArea` block is automatically bound to the specified domain . The compiler structurally prevents the assignment of signals across different clock domains unless an explicit synchronization primitive, such as a dual-clock FIFO or a multi-stage `RegNext` synchronizer, is implemented . If a designer attempts to read a register driven by an asynchronous clock domain without applying a `crossClockDomain` tag, the elaboration engine halts and emits a compile-time error . This mechanism categorically eliminates vast classes of metastability failures before simulation even begins.

#### Advanced Parameterization and the Plugin Pattern

Parameterization in Scala-based HDLs is achieved through object-oriented instantiation. Designers pass Scala `case classes` containing configuration data directly into a hardware module's constructor . Because this configuration occurs at elaboration time, the designer has access to the full standard library of the host JVM. 

This enables arbitrary hardware calculation. An engineer can use a Scala `for` loop iterating over a dynamically generated `List` to proceduralize the instantiation of parallel digital signal processing (DSP) slices . If a specific configuration flag evaluates to false, the Scala `if` statement entirely omits the generation of that hardware chunk, resulting in a cleaner netlist without the overhead of dead logic . This extreme configurability has led to the development of the "Plugin Pattern," utilized heavily in projects like the VexRiscV processor. In this architecture, the base CPU component is an empty pipeline shell. Functionality—such as multiplication units, MMUs, or floating-point coprocessors—is injected into the pipeline dynamically at elaboration time via independent plugins . The result is a highly modular ecosystem where hardware capabilities can be mixed and matched with the fluidity of software dependency injection.

### Python-Driven Ecosystems: Amaranth HDL

While the JVM provides immense power, it also introduces overhead and a steep learning curve associated with functional Scala programming. Amaranth HDL (formerly nMigen) operates on structural principles similar to Chisel and SpinalHDL but fundamentally targets the Python ecosystem . Amaranth leans heavily on Python's dynamic typing, list comprehensions, and rapid prototyping capabilities to democratize hardware generation.

The Amaranth framework builds a memory-resident AST composed of `Signal` and `Module` objects. Combinational and sequential logic are explicitly delineated using assignment domains. A designer assigns combinational logic via `m.d.comb`, which the compiler guarantees will synthesize into pure boolean logic gates. Synchronous state assignments are mapped to `m.d.sync`, which the framework binds to the module's active clock domain. The Python interpreter elaborates the hardware hierarchy, resolving dynamic widths and array sizes before invoking an internal lowering pass. Amaranth natively targets the Yosys RTL Intermediate Language (RTLIL), allowing for extremely tight integration with open-source synthesis tools without ever needing to emit or parse intermediate SystemVerilog.

### Guarded Atomic Actions: Bluespec SystemVerilog (BSV)

While Scala and Python HDLs focus predominantly on structural generation and meta-programming, other modern paradigms focus on abstracting scheduling algorithms and mathematically proving sequential correctness.

Bluespec SystemVerilog (BSV) and its functional counterpart, Bluespec Haskell, elevate the abstraction level by modeling hardware state evolution through Guarded Atomic Actions rather than cycle-by-cycle procedural blocks . In traditional RTL, engineers must manually design complex Finite State Machines (FSMs) to govern control flow, explicitly managing stall signals, bypass paths, and pipeline bubbles. This manual scheduling is notoriously error-prone, particularly when multiple parallel modules compete for shared resources like memory ports or interconnect buses.

In BSV, designers define explicit hardware state elements, such as registers, SRAMs, and FIFOs, and encapsulate the state transition logic within `rule` blocks . Each rule is equipped with a boolean guard condition . The fundamental axiom of BSV is that a rule may only execute ("fire") when its guard condition is mathematically true, and when it fires, it executes atomically . 

The Bluespec compiler algorithms treat these rules as atomic transactions. During compilation, an advanced scheduling algorithm analyzes all rules within the system for read/write dependencies and resource conflicts. It then automatically generates the necessary combinational multiplexing, clock-enables, and stall logic to ensure that overlapping resource accesses are safely arbitrated . 

Interfaces in BSV are treated with equal rigor. Instead of raw wire ports, modules expose methods categorized as `Action`, `Value`, or `ActionValue` . 
*   **Action Methods:** Take input data and modify the internal state of the module .
*   **Value Methods:** Return internal state data without modifying it .
*   **ActionValue Methods:** Perform both a state modification and return a value (e.g., popping data from a FIFO) .

Crucially, these methods contain implicit guards. If a higher-level module calls an `Action` method to push data into a sub-module's FIFO, and that FIFO is currently full, the guard fails . The rule in the higher-level module that initiated the call is automatically stalled by the compiler . This abstraction completely eliminates the need for manual pipeline scheduling, guaranteeing that concurrent operations execute safely and logically sequentially.

### Temporal Type Systems and Static Timing Resolution: Filament

A pervasive vulnerability across traditional HDLs, and even within modern structural generators like Chisel and Amaranth, is the inability to express dynamic timing behaviors and physical temporal constraints within the language's formal type signature . When hardware modules are composed in SystemVerilog, the compiler ensures that a 32-bit output is connected to a 32-bit input. However, the compiler possesses zero semantic knowledge of the required cycle latency between data ingress and egress . If an integer multiplier requires three clock cycles to compute a result, the engineer must manually delay the corresponding control signals (using shift registers or explicit state machines) to match the datapath latency. If the multiplier IP is later swapped for an optimized one-cycle multiplier, the surrounding control logic will fail silently, leading to disastrous functional bugs.

Filament directly resolves this by introducing a novel, mathematically robust temporal type system based on timeline types . In Filament, the availability of a signal is permanently bound to event-relative intervals encoded directly in the type signature. A signal typed as `@[T, T+1]` formally guarantees to the compiler that the value on that wire is stable, valid, and available strictly from clock cycle $T$ to $T+1$ . 

This type system requires designers to write timing specifications, transforming latent, undocumented timing assumptions into verified compile-time invariants . When hardware modules are composed, the Filament compiler interprets these timeline types as a set of possible temporal executions . It generates a System of Difference Constraints (SDC) to model the timing relationships, data-dependency constraints, and resource allocation requirements .

Filament generalizes hardware synthesis across three core dimensions:
1.  **Allocation:** The declaration of available physical resources. Filament uses `pool` declarations to specify sets of component instances, such as `pool M : Mult[32] * 2`, declaring two available 32-bit multipliers . The exact allocation can also be left symbolic (`* ?`), delegating the determination to an underlying SAT/SMT solver .
2.  **Binding:** The algorithmic selection of which instance from a resource pool an operation will utilize. Binding can be explicitly fixed (e.g., `M[0]`), left entirely unspecified for High-Level Synthesis (HLS) scheduling (`M[?]`), or bound via named variables (`M[? u]`) to enforce structural sharing across distinct logic paths .
3.  **Scheduling:** The exact temporal firing of an operation. The type system utilizes relative offset requirements and symbolic time scheduling variables . A start time can be specified as a concrete offset from a global event (e.g., `<'G+3>` denotes an execution exactly 3 cycles after event 'G), or expressed as bounded ranges (e.g., `<'G+[1.. 2]>`) .

By verifying these SDC matrices statically during compilation, Filament allows for "fearless hardware design" . The compiler mathematically guarantees that deep pipelines will not exhibit resource conflicts, structural hazards, or def-use ordering violations . If a designer attempts to read the output of a three-cycle multiplier on the second cycle, the temporal type checker intercepts the violation and halts compilation, moving a traditionally obscure runtime simulation failure into the realm of immediate semantic type errors .

### Intermediate Representations: MLIR, CIRCT, and FIRRTL

Historically, the proliferation of diverse HDLs resulted in highly fractured, monolithic compiler implementations. Each toolchain maintained its own proprietary internal data structures and optimization passes, hindering interoperability. The open-source community solved this via the LLVM-based Circuit IR Compilers and Tools (CIRCT) project, which unifies hardware compilation by utilizing the Multi-Level Intermediate Representation (MLIR) framework . CIRCT applies the highly optimized, mathematically proven software compilation techniques of the LLVM ecosystem directly to digital logic synthesis.

The most prominent ingestion dialect within the CIRCT infrastructure is FIRRTL (Flexible Intermediate Representation for RTL) . Originally architected as the target emission language for Chisel, FIRRTL has evolved into a standardized, language-agnostic intermediary. It abstracts the hardware into a directed acyclic graph composed of modules, memories, conditional execution blocks (`firrtl.when`), and primitive mathematical operations . 

CIRCT does not compile FIRRTL directly to textual Verilog. Instead, it utilizes a sophisticated lowering pipeline, translating the high-level semantic intent through a series of increasingly granular MLIR dialects . This multi-level approach allows for targeted optimizations at the most appropriate level of abstraction.

| MLIR Dialect | Level of Abstraction | Description & Compiler Responsibilities |
| :--- | :--- | :--- |
| `firrtl` | High-Level Graph | Represents unoptimized circuit objects, nested module hierarchies, abstract memory interfaces (`firrtl.mem`), and conditional routing (`firrtl.when`). Maps directly to HCL output . |
| `hw` | Structural Boundary | Defines the rigid structural boundaries of hardware components. Manages parameter resolution, explicit port instantiations, inner symbol attributes, and external module bindings . |
| `comb` | Pure Logic / Math | Represents purely functional, stateless boolean arithmetic and algebraic operations. Lowers higher-order `firrtl` operations into fundamental gates, shifts, and multiplexers (e.g., `comb.add`, `comb.mux`) . |
| `seq` | Temporal Sequential | Represents temporal barriers and synchronous memory elements. Features primitives like `seq.firreg`, modeling a parameterized flip-flop with implicit/explicit clocking and reset logic . |
| `sv` | Textual SystemVerilog | The lowest MLIR abstraction level before textual serialization. Encodes SystemVerilog-specific syntax trees, such as explicit `sv.always_ff` blocks, macro inclusions, and `ifdef` directives . |

During the execution of the CIRCT pass manager, high-level `firrtl.module` structures are systematically lowered. For instance, an abstract `firrtl.regreset` (a state element with an asynchronous reset condition) is isolated and transformed into a `seq.firreg` operation . Simultaneously, the input data paths feeding that register are flattened out of their nested `firrtl.when` conditions and mapped into a purely mathematical `comb` graph comprised of multiplexers and boolean arithmetic . Finally, the entire AST is converted to the `sv` dialect to guarantee strict, predictable, and synthesis-compliant SystemVerilog textual emission, entirely bypassing the semantic ambiguities of hand-written RTL source code.

### Technical Synergy: End-to-End Parameterized Hardware Lowering

To observe the synergistic operation of these paradigms in a production environment, it is necessary to trace the instantiation of a complex hardware component from an advanced HCL down to its structural structural equivalent. The following is an exhaustive end-to-end trace of a synchronous parameterized First-In-First-Out (FIFO) buffer. The generator is implemented using SpinalHDL to leverage its object-oriented parameterization, strict data typing, and explicit clocking semantics.

#### 1. High-Level Meta-Programming (SpinalHDL Generator)

The Scala program below constructs a dynamically sized, type-parameterized FIFO. The payload data type `T` is constrained to extend the fundamental hardware `Data` class (e.g., `UInt`, `Bits`), ensuring type safety. The buffer depth is passed as an elaboration-time hardware parameter. The logic relies on counter mathematics modulo the buffer depth, defined as $W_{ptr} = \lceil \log_{2}(\text{depth}) \rceil$.

```scala
import spinal.core._
import spinal.lib._

// The Payload type T is parameterized, bounded by the hardware Data class.
// The constructor takes the hardware type and the static integer depth.
class ParameterizedFIFO[T <: Data](dataType: T, depth: Int) extends Component {
  require(isPow2(depth), "FIFO depth must be a power of 2 for optimized pointer wrapping without division logic")
  
  // Explicit structural interface definition using the Bundle composite type
  val io = new Bundle {
    // Stream equates to a standard Valid/Ready/Payload handshake protocol
    val push = slave Stream(dataType)  
    val pop  = master Stream(dataType)
  }

  // Memory Instantiation - infers hardware SRAM or LUTRAM based on depth
  val ram = Mem(dataType, depth)

  // State elements automatically mapped to the implicit enclosing ClockDomain
  // log2Up(depth) computes the exact bit-width required for the pointers
  val pushPtr = Reg(UInt(log2Up(depth) bits)) init(0)
  val popPtr  = Reg(UInt(log2Up(depth) bits)) init(0)
  val risingFill = RegInit(False) // Single bit tracking fill direction

  // Combinational status evaluations
  val ptrMatch = pushPtr === popPtr
  val empty = ptrMatch && !risingFill
  val full  = ptrMatch && risingFill

  // Combinational routing for Stream interfaces
  io.push.ready := !full
  io.pop.valid  := !empty
  io.pop.payload := ram.readAsync(popPtr)

  // Synchronous State Updates (automatically mapped to sequential logic)
  when(io.push.valid && io.push.ready) {
    ram.write(pushPtr, io.push.payload)
    pushPtr := pushPtr + 1 // Overflows automatically due to UInt width truncation
  }

  when(io.pop.valid && io.pop.ready) {
    popPtr := popPtr + 1
  }

  // Rising Fill tracking for full/empty disambiguation when pointers match
  when((io.push.valid && io.push.ready) =/= (io.pop.valid && io.pop.ready)) {
    risingFill := (io.push.valid && io.push.ready)
  }
}

object CompileFIFO {
  def main(args: Array[String]): Unit = {
    // Execute elaboration: Target CIRCT/FIRRTL intermediate emission
    SpinalConfig(targetDirectory = "output").generateFirrtl(new ParameterizedFIFO(Bits(32 bits), 16))
  }
}
```

#### 2. Intermediate Representation Lowering (CIRCT FIRRTL Dialect)

When the Scala process executes, the JVM builds the hardware AST and serializes it into a FIRRTL file. The `firrtl` MLIR dialect represents the pure circuit intent, stripped of Scala's object orientation and dynamic parameterization, but maintaining high-level structural semantics. Notice the explicit clock binding and the transformation of the Scala `Stream` interface into flattened port definitions.

```mlir
firrtl.circuit "ParameterizedFIFO" {
  firrtl.module @ParameterizedFIFO(
    in %clk: !firrtl.clock,
    in %reset: !firrtl.asyncreset,
    in %io_push_valid: !firrtl.uint<1>,
    out %io_push_ready: !firrtl.uint<1>,
    in %io_push_payload: !firrtl.uint<32>,
    out %io_pop_valid: !firrtl.uint<1>,
    in %io_pop_ready: !firrtl.uint<1>,
    out %io_pop_payload: !firrtl.uint<32>
  ) {
    // Memory declaration explicitly capturing width (32-bit), depth (16), and latencies
    %ram = firrtl.mem Undefined {depth = 16 : i64, name = "ram", portNames = ["read", "write"], readLatency = 0 : i32, writeLatency = 1 : i32} : !firrtl.bundle<read: bundle<addr: uint<4>, en: uint<1>, clk: clock, data flip: uint<32>>, write: bundle<addr: uint<4>, en: uint<1>, clk: clock, data: uint<32>, mask: uint<1>>>
    
    // Sequential State Definitions with asynchronous resets mapped to the global clock
    %pushPtr = firrtl.regreset %clk, %reset, %c0_ui4 : !firrtl.clock, !firrtl.asyncreset, !firrtl.uint<4>, !firrtl.uint<4>
    %popPtr = firrtl.regreset %clk, %reset, %c0_ui4 : !firrtl.clock, !firrtl.asyncreset, !firrtl.uint<4>, !firrtl.uint<4>
    %risingFill = firrtl.regreset %clk, %reset, %c0_ui1 : !firrtl.clock, !firrtl.asyncreset, !firrtl.uint<1>, !firrtl.uint<1>

    // Combinatorial logical graphs lowered to mathematical nodes
    %ptrMatch = firrtl.eq %pushPtr, %popPtr : (!firrtl.uint<4>, !firrtl.uint<4>) -> !firrtl.uint<1>
    %not_risingFill = firrtl.not %risingFill : (!firrtl.uint<1>) -> !firrtl.uint<1>
    
    // Wire assignments resolving strict logical connections
    %empty = firrtl.and %ptrMatch, %not_risingFill : (!firrtl.uint<1>, !firrtl.uint<1>) -> !firrtl.uint<1>
    %not_full = firrtl.not %full : (!firrtl.uint<1>) -> !firrtl.uint<1>
    firrtl.strictconnect %io_push_ready, %not_full : !firrtl.uint<1>
    
    // Conditional update blocks (these will be flattened into multiplexers in the comb dialect)
    %push_fire = firrtl.and %io_push_valid, %io_push_ready : (!firrtl.uint<1>, !firrtl.uint<1>) -> !firrtl.uint<1>
    firrtl.when %push_fire {
      %next_pushPtr = firrtl.add %pushPtr, %c1_ui4 : (!firrtl.uint<4>, !firrtl.uint<4>) -> !firrtl.uint<5>
      %tail_pushPtr = firrtl.tail %next_pushPtr, 1 : (!firrtl.uint<5>) -> !firrtl.uint<4> // Truncation
      firrtl.strictconnect %pushPtr, %tail_pushPtr : !firrtl.uint<4>
    }
  }
}
```

#### 3. Structural SystemVerilog Emission via MLIR

The CIRCT compiler translates the `firrtl` dialect into the `seq`, `comb`, and `hw` dialects. The final execution pass emits tightly controlled, structurally deterministic SystemVerilog. Unlike hand-written code, the emitted SystemVerilog utilizes standard, strictly defined procedural structures that directly interface with logic synthesis technology mapping (such as Yosys AST parsing), completely eliminating ambiguous execution semantics.

```verilog
module ParameterizedFIFO (
  input         clk,
  input         reset,
  input         io_push_valid,
  output        io_push_ready,
  input  [31:0] io_push_payload,
  output        io_pop_valid,
  input         io_pop_ready,
  output [31:0] io_pop_payload
);

  // Structural memory instantiation (inferred natively by synthesis RAM mapping algorithms)
  reg [31:0] ram [0:15];
  
  // State elements defined with exact bounded bit-widths
  reg [3:0] pushPtr;
  reg [3:0] popPtr;
  reg       risingFill;

  // Combinational intermediate wires generated from the flattened comb dialect graph
  wire ptrMatch = (pushPtr == popPtr);
  wire empty    = ptrMatch & ~risingFill;
  wire full     = ptrMatch & risingFill;
  
  wire push_fire = io_push_valid & io_push_ready;
  wire pop_fire  = io_pop_valid & io_pop_ready;

  // Continuous assignments map directly to logic cell instances
  assign io_push_ready  = ~full;
  assign io_pop_valid   = ~empty;
  assign io_pop_payload = ram[popPtr];

  // Strictly controlled sequential block, structurally isolated from combinational logic
  always_ff @(posedge clk or posedge reset) begin
    if (reset) begin
      pushPtr    <= 4'h0;
      popPtr     <= 4'h0;
      risingFill <= 1'b0;
    end else begin
      if (push_fire) begin
        pushPtr <= pushPtr + 4'h1;
      end
      if (pop_fire) begin
        popPtr <= popPtr + 4'h1;
      end
      if (push_fire != pop_fire) begin
        risingFill <= push_fire;
      end
    end
  end

  // Synchronous Memory Write Port mapping
  always_ff @(posedge clk) begin
    if (push_fire) begin
      ram[pushPtr] <= io_push_payload;
    end
  end

endmodule
```

This end-to-end compilation architecture fundamentally neutralizes the traditional semantic gap that plagues legacy design methodologies. The modern digital engineer operates exclusively at the domain of high-level functional abstraction, interval-based temporal type systems, and algorithm-driven dataflow. The underlying compiler stack absorbs the burden of mathematical constraint verification, multi-dimensional signal resolution, explicit clock routing, and AST graph lowering. The ultimate result is the deterministic production of physical hardware intent, enabling the rapid deployment of silicon at scales previously impossible under legacy paradigms.

[STAGE COMPLETE] System ready for the next chapter. Provide the 'PROCEED' command. 


## Sources

- [**github.com** awesome-hdl/README.md at master - GitHub](https://github.com/drom/awesome-hdl/blob/master/README.md)
- [**github.com** GitHub - pc2/sus-compiler: A new Hardware Design Language that](https://github.com/pc2/sus-compiler)
- [**comp.nus.edu.sg** A General-Purpose Timing-Safe Hardware Description Language](https://www.comp.nus.edu.sg/~tcarlson/pdfs/yu2025aagthdl.pdf)
- [**youtube.com** Charles Papon - SpinalHDL: Software generated hardware - YouTube](https://www.youtube.com/watch?v=Ee7mQDVSHW8)
- [**spinalhdl.github.io** A simple example — SpinalHDL documentation](https://spinalhdl.github.io/SpinalDoc-RTD/master/SpinalHDL/Introduction/A%20simple%20example.html)
- [**cdn.jsdelivr.net** SpinalHDL CheatSheet – Core - jsDelivr](https://cdn.jsdelivr.net/gh/SpinalHDL/SpinalDoc@842d4def61c565a411d7bbe06b308d04c37ca6eb/cheatsheet/cheatSheet_core_oo.pdf)
- [**spinalhdl.github.io** Data types — SpinalHDL documentation](https://spinalhdl.github.io/SpinalDoc-RTD/master/SpinalHDL/Data%20types/index.html)
- [**spinalhdl.github.io** Types — SpinalHDL documentation](https://spinalhdl.github.io/SpinalDoc-RTD/master/SpinalHDL/Developers%20area/types.html)
- [**spinalhdl.github.io** The spinal.core components — SpinalHDL documentation](https://spinalhdl.github.io/SpinalDoc-RTD/master/SpinalHDL/miscelenea/core/core_components.html)
- [**spinalhdl.github.io** Parametrization — SpinalHDL documentation](https://spinalhdl.github.io/SpinalDoc-RTD/master/SpinalHDL/Structuring/parametrization.html)
- [**cl.cam.ac.uk** Logic Synthesis from Guarded Atomic Actions (Bluespec)](https://www.cl.cam.ac.uk/teaching/1718/SysOnChip/materials.d/kg5-hls/zhpf94c7377e.html)
- [**github.com** bsc/README.md at main · B-Lang-org/bsc - GitHub](https://github.com/B-Lang-org/bsc/blob/main/README.md)
- [**scribd.com** Bluespec System Verilog Overview | PDF | Computers - Scribd](https://www.scribd.com/document/618861473/Bluespec-Introduction)
- [**arxiv.org** Modular Hardware Design with Timeline Types - arXiv](https://arxiv.org/pdf/2304.10646)
- [**capra.cs.cornell.edu** Unifying HLS and RTL with Timeline Types - Capra](https://capra.cs.cornell.edu/latte26/paper/latte26-final17.pdf)
- [**github.com** cucapra/filament: Fearless hardware design - GitHub](https://github.com/cucapra/filament)
- [**github.com** filament/README.md at main - GitHub](https://github.com/cucapra/filament/blob/main/README.md)
- [**arch2.mlsysbook.ai** 4 Data, Knowledge, and Representation - Architecture 2.0](https://arch2.mlsysbook.ai/book/contents/chapters/04-representations/)
- [**circt.llvm.org** 'firrtl' Dialect - CIRCT](https://circt.llvm.org/docs/Dialects/FIRRTL/)
- [**circt.llvm.org** FIRRTL Dialect Rationale - CIRCT](https://circt.llvm.org/docs/Dialects/FIRRTL/RationaleFIRRTL/)
- [**research-collection.ethz.ch** Formal Verification of Hardware using MLIR - Research Collection](https://www.research-collection.ethz.ch/bitstreams/32bae539-0d9d-4095-a2e0-855c04460c39/download)
- [**arxiv.org** Timing-Aware Pipeline Optimization at IR-Level for RTL Generation](https://arxiv.org/html/2605.01836v1)
- [**circt.llvm.org** Passes - CIRCT](https://circt.llvm.org/docs/Passes/)
- [**semanticscholar.org** [PDF] Anvil: A General-Purpose Timing-Safe Hardware Description](https://www.semanticscholar.org/paper/cfa7d64b76edb0deaa6fb25daa424db5cbdb1076)
- [**spade-lang.org** A Modern Hardware Description Language - Spade](https://spade-lang.org/spade.typ.pdf)
- [**spinalhdl.github.io** Basics — SpinalHDL documentation](https://spinalhdl.github.io/SpinalDoc-RTD/master/SpinalHDL/Getting%20Started/Scala%20Guide/basics.html)
- [**bar.eecs.berkeley.edu** UCB-BAR: FIRRTL](https://bar.eecs.berkeley.edu/projects/firrtl.html)
- [**chisel-lang.org** Interfaces and Connections - Chisel](https://www.chisel-lang.org/docs/explanations/interfaces-and-connections)
- [**stackoverflow.com** What do decoupled and irrevocable mean in Chisel? - Stack Overflow](https://stackoverflow.com/questions/66289308/what-do-decoupled-and-irrevocable-mean-in-chisel)
- [**chisel-lang.org** Deep Dive into <> and := Connection Operators - Chisel](https://www.chisel-lang.org/docs/explanations/connection-operators)
- [**comp.nus.edu.sg** A General-Purpose Timing-Safe Hardware Description Language](https://www.comp.nus.edu.sg/~tcarlson/pdfs/yu2025aagthdl.pdf)
- [**arxiv.org** Modular Hardware Design with Timeline Types - arXiv](https://arxiv.org/pdf/2304.10646)
- [**filamenthdl.com** Filament | Fearless Hardware Design](https://filamenthdl.com/)
- [**arxiv.org** Episodic Loops: Finitary Event Structures and Operational ... - arXiv](https://arxiv.org/abs/2609.34646)
- [**arxiv.org** A General-Purpose Timing-Safe Hardware Description Language](https://arxiv.org/html/2503.19447v2)
- [**arxiv.org** arXiv:2404.18756v1 [cs.SE] 29 Apr 2024](https://arxiv.org/pdf/2404.18756)
- [**circt.llvm.org** FIRRTL Dialect Rationale - CIRCT](https://circt.llvm.org/docs/Dialects/FIRRTL/RationaleFIRRTL/)
- [**chipyard.readthedocs.io** 6.14. Adding a Firrtl Transform — Chipyard 1.11.0 documentation](https://chipyard.readthedocs.io/en/stable/Customization/Firrtl-Transforms.html)
- [**woset-workshop.github.io** MLIR as Hardware Compiler Infrastructure - woset-workshop](https://woset-workshop.github.io/PDFs/2021/a06-slides.pdf)
- [**research-collection.ethz.ch** Formal Verification of Hardware using MLIR - Research Collection](https://www.research-collection.ethz.ch/bitstreams/32bae539-0d9d-4095-a2e0-855c04460c39/download)
- [**circt.llvm.org** Passes - CIRCT](https://circt.llvm.org/docs/Passes/)
- [**circt.llvm.org** 'firrtl' Dialect - CIRCT](https://circt.llvm.org/docs/Dialects/FIRRTL/)
- [**hc34.hotchips.org** 2022-08-22 HotChips tutorial Circt - HC34](https://www.hc34.hotchips.org/assets/program/tutorials/MLIR/HC2022.SiFive-MSFT.LenharthDemme.v1.pdf)
- [**cse.cuhk.edu.hk** CombRewriter: Enabling Combinational Logic Simplification](https://www.cse.cuhk.edu.hk/~byu/papers/C305-ASPDAC2026-CombRewriter.pdf)
- [**circt.llvm.org** 'seq' Dialect - CIRCT](https://circt.llvm.org/docs/Dialects/Seq/)
- [**circt.llvm.org** Verilog and SystemVerilog Generation - CIRCT](https://circt.llvm.org/docs/VerilogGeneration/)
- [**chisel-lang.org** chisel 7.15.0 - circt.stage.ChiselStage](https://www.chisel-lang.org/api/latest/circt/stage/ChiselStage$.html)
- [**passlab.github.io** Advanced Chisel Topics](https://passlab.github.io/CSCE513/resources/UCB_CS250Spring2016_AdvancedChisel.pdf)
- [**cs.princeton.edu** COS 597E Final Project Modularizing Formal Verification in High](https://www.cs.princeton.edu/~ad4048/pdfs/reports/modular_report.pdf)
- [**docs.chialoops.ai** Release HEAD Berkeley Architecture Research](https://docs.chialoops.ai/_/downloads/en/latest/pdf/)
- [**ndl.iitkgp.ac.in** Automatic purpose-driven basis set truncation for time-dependent](https://ndl.iitkgp.ac.in/re_document/springer_nature_portfolio/springer_nature_portfolio/s41467_022_35694_4)
- [**aip.de** Dynamics and Evolution of a Giant Solar Filament as Observed by](https://www.aip.de/media/thesis/andrea-diercke-bachelorarbeit.pdf)
- [**f1000research.com** A Review Study on the Behavior of Pipelines... | F1000Research](https://f1000research.com/articles/15-1420)
- [**lib.rs** Algorithms — list of Rust libraries/crates // Lib.rs](https://lib.rs/algorithms)
- [**sfa-oxford.com** Critical Minerals in Semiconductors | SFA (Oxford)](https://www.sfa-oxford.com/knowledge-and-insights/critical-minerals-in-low-carbon-and-future-technologies/critical-minerals-in-electronics/critical-minerals-in-semiconductors/)
- [**ndl.iitkgp.ac.in** NDLI: Timing belt in power transmission and conveying system](https://ndl.iitkgp.ac.in/re_document/edpsciences/edpsciences/doi_10_1051_matecconf_201815704001)
- [**reddit.com** Why is reinventing the wheel so prominent in Go? : r/golang - Reddit](https://www.reddit.com/r/golang/comments/18sa4ln/why_is_reinventing_the_wheel_so_prominent_in_go/)
- [**misc.bpdb.gov.bd** Bangladesh Power Development Board](https://misc.bpdb.gov.bd/storage/tender/tender_20903_2.pdf)
- [**gist.github.com** Generic FIFO implemented in verilog. - GitHub Gist](https://gist.github.com/e299230c65b82a87d7fc83579d78b168)
- [**scribd.com** Fifo Implementation in Verilog | PDF | Central Processing Unit - Scribd](https://www.scribd.com/doc/158696080/fifo-implementation-in-verilog)
- [**fpga4student.com** Verilog code for FIFO memory - FPGA4student.com](https://www.fpga4student.com/2017/01/verilog-code-for-fifo-memory.html)
- [**pubs.acs.org** Self-Driving Laboratories for Chemistry and Materials Science](https://pubs.acs.org/chreay/article/124/16/9633/154652/Self-Driving-Laboratories-for-Chemistry-and)
- [**mdpi.com** A Partial Eruption of a Sigmoid Filament in the Small Dipole Active](https://www.mdpi.com/2218-1997/10/1/42)
- [**pmc.ncbi.nlm.nih.gov** Research on Angle-Adaptive Look-Ahead Compensation Method for](https://pmc.ncbi.nlm.nih.gov/articles/PMC13118581/)
- [**www-pub.iaea.org** IAEA Nuclear Security Series No. 40-T](https://www-pub.iaea.org/MTCD/Publications/PDF/PUB1875_web.pdf)
- [**google.github.io** DSLX Reference - XLS - Google](https://google.github.io/xls/dslx_reference/)
- [**blog.cdleary.com** XLS (Accelerated HW Synthesis) Lecture @ UCSC 2024](https://blog.cdleary.com/posts/2024/04/08/xls-accelerated-hw-synthesis-at-ucsc-2024/)
- [**comsec-files.ethz.ch** Detecting Timing Side-Channel Vulnerabilities in High-Level](https://comsec-files.ethz.ch/papers/turboturtle_ccs26.pdf)
- [**openreview.net** HLStrans: Dataset for C-to-HLS Hardware Code Synthesis](https://openreview.net/forum?id=6UaXec8aUt)
- [**panda.deib.polimi.it** Bambu - panda.deib.polimi.it](https://panda.deib.polimi.it/?page_id=31)
- [**docta.ucm.es** Generating Posit-Based Accelerators With High-Level Synthesis](https://docta.ucm.es/bitstreams/18fbbd9e-3ad9-4537-a818-ac58d6cc00ee/download)
- [**re.public.polimi.it** Bambu: an Open-Source Research Framework for the High-Level](https://re.public.polimi.it/retrieve/e0c31c12-1f74-4599-e053-1705fe0aef77/dac21_bambu.pdf)
- [**researchgate.net** Bambu: A modular framework for the high level synthesis of memory](https://www.researchgate.net/publication/261299590_Bambu_A_modular_framework_for_the_high_level_synthesis_of_memory-intensive_applications)
- [**bsg.ai** A Tensor Processing Framework for CPU-Manycore Heterogeneous](https://bsg.ai/papers/cheng-hb-pytorch-tcad2022.pdf)
- [**eng.uwaterloo.ca** ECE Dept. Software - Engineering Computing](http://www.eng.uwaterloo.ca/~praetzel/Software.html)
- [**stars.library.ucf.edu** A Semantic Reasoning Engine For Verilog Via Abstract Interpretation](https://stars.library.ucf.edu/cgi/viewcontent.cgi?article=1151&context=gradstudies_etd_2026)
- [**systemverilog.dev** VPI and DPI](https://systemverilog.dev/9.html)
- [**medium.com** Deep understanding of cocotb's Timing Model (1) | by DatenLord](https://medium.com/@datenlord/deep-understanding-of-cocotbs-timing-model-1-87e256151164)
- [**learncocotb.com** VPI deep dive - learncocotb.com](https://learncocotb.com/docs/cocotb-dev/4-vpi-deep-dive/)
- [**bitsbytesgates.blogspot.com** Adding Task-Based Bus Functional Models to Cocotb](http://bitsbytesgates.blogspot.com/2019/11/adding-task-based-bus-functional-models.html)
- [**scribd.com** Python-Cocotb for Design Verification | PDF - Scribd](https://www.scribd.com/document/882380330/92267)
- [**bitsbytesgates.com** DPI Isn't Enough: Making Python Part of Your SV Testbench](https://bitsbytesgates.com/blog/dpi-isnt-enough-making-python-part-of-your-sv-testbench/)
- [**easychair.org** Enable Reuse of SystemVerilog Verification IPs in cocotb/pyuvm](https://easychair.org/publications/preprint/k8FT/open)
- [**bitwuzla.github.io** Bitwuzla | An SMT solver for bit-vectors, floating-points, arrays and](https://bitwuzla.github.io/)
- [**youtube.com** Section 9b: Maze Routing - YouTube](https://www.youtube.com/watch?v=m8_CDRZHnI8)
- [**github.com** Caravel is a standard SoC template with on chip resources ... - GitHub](https://github.com/efabless/caravel)
- [**github.com** OpenFrame Project Example - GitHub](https://github.com/RTimothyEdwards/caravel_openframe_project)
- [**arxiv.org** Algorithm-Driven On-Chip Integration for High Density and Low Cost](https://arxiv.org/pdf/2512.10089)
- [**mdpi.com** The Genesis of AI by AI Integrated Circuit: Where AI Creates AI - MDPI](https://www.mdpi.com/2079-9292/13/9/1704)
- [**ieeexplore.ieee.org** Democratizing IC Design - IEEE Xplore](http://ieeexplore.ieee.org/iel7/4563670/9620728/09621274.pdf)
- [**sifive-china.oss-cn-zhangjiakou.aliyuncs.com** SiFive TileLink Specification](https://sifive-china.oss-cn-zhangjiakou.aliyuncs.com/TileLink/TileLink-TileLink%20Spec%201.7.1.pdf)
- [**old.hotchips.org** Generating Rocket/BOOM SoCs with Rocket Chip - Hot Chips](https://old.hotchips.org/hc31/HC31_T6_Rocket.pdf)
- [**cecs.uci.edu** Implementation of Different Communication Structures for a Rocket](https://www.cecs.uci.edu/~doemer/publications/MBMV_24.pdf)
- [**chipyard.readthedocs.io** 6.7. MMIO Peripherals — Chipyard 1.11.0 documentation](https://chipyard.readthedocs.io/en/stable/Customization/MMIO-Peripherals.html)
- [**bsg.ai** ©Copyright 2025 Daniel William Ruelas-Petrisko](https://bsg.ai/papers/theses/Petrisko_PhD_2025.pdf)
- [**github.com** The-OpenROAD-Project/OpenRCX - GitHub](https://github.com/The-OpenROAD-Project/OpenRCX)
- [**openroad.readthedocs.io** Parasitics Extraction - OpenROAD documentation - Read the Docs](https://openroad.readthedocs.io/en/latest/main/src/rcx/README.html)
- [**openroad.readthedocs.io** Extraction Rules Generation Flow for OpenRCX](https://openroad.readthedocs.io/en/latest/main/src/rcx/doc/calibration.html)
- [**opencircuitdesign.com** Magic-8.3 How To - Open Circuit Design](https://opencircuitdesign.com/magic/howto.html)
- [**analogicus.com** magic | Magic documentation](https://analogicus.com/magic/)
- [**silvaco.com** Parasitic Extraction Comparison - Silvaco](https://silvaco.com/analog-custom-design/parasitic-extraction-comparison/)
- [**slideshare.net** PARASITICS EXTRACTION.pptx for SPEF generation - Slideshare](https://www.slideshare.net/slideshow/parasitics-extraction-pptx-for-spef-generation/283952932)
- [**synopsys.com** How Parasitic Extraction Can Make or Break Your High-speed Chip](https://www.synopsys.com/blogs/chip-design/parasitic-extraction-high-speed-chip-design.html)
- [**youtube.com** PD Lec 68 - Spef Extraction | VLSI | Physical Design - YouTube](https://www.youtube.com/watch?v=tvBu9ggsW8A)
- [**note.com** Akira Tsuchiya - Parasitic Extraction and Post-Layout Simulation - note](https://note.com/akira_tsuchiya/n/n91283400b24a?hl=en)
- [**github.com** ALIGN-analoglayout/ALIGN-public - GitHub](https://github.com/ALIGN-analoglayout/ALIGN-public)
- [**align-analoglayout.github.io** ALIGN: Analog Layout, Intelligently Generated from Netlists](https://align-analoglayout.github.io/ALIGN-public/)
- [**arxiv.org** [2008.10682] ALIGN: A System for Automating Analog Layout - arXiv](https://arxiv.org/abs/2008.10682)
- [**openfasoc.readthedocs.io** Welcome to the OpenFASoC documentation! — OpenFASoC](https://openfasoc.readthedocs.io/)
- [**scribd.com** Automating Analog Layout with ALIGN | PDF | Amplifier - Scribd](https://www.scribd.com/document/937645769/ALIGN-a-System-for-Automating-Analog-Layout)
- [**github.com** sifive/chisel-circt-demo: Demonstration of a project using ... - GitHub](https://github.com/sifive/chisel-circt-demo)
- [**filamentphp.com** Timeline View by Devletes - Filament](https://filamentphp.com/plugins/devletes-timeline-view)
- [**github.com** Releases · llvm/circt - GitHub](https://github.com/llvm/circt/releases)
- [**youtube.com** Fast and cycle-accurate hardware simulation in CIRCT - YouTube](https://www.youtube.com/watch?v=iwJBlRUz6Vw)
- [**arxiv.org** Parameterized Hardware Design with Latency-Abstract Interfaces](https://arxiv.org/pdf/2401.02570)
- [**arxiv.org** [2304.10646] Modular Hardware Design with Timeline Types - arXiv](https://arxiv.org/abs/2304.10646)
- [**arxiv.org** Anvil: A General-Purpose Timing-Safe Hardware Description ... - arXiv](https://arxiv.org/html/2503.19447v1)
- [**arxiv.org** Anvil: A General-Purpose Timing-Safe Hardware Description ... - arXiv](https://arxiv.org/pdf/2503.19447)
- [**arxiv.org** HDDL 2.1: Towards Defining an HTN Formalism with Time - arXiv](https://arxiv.org/abs/2206.01822)
