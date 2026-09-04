
## Project 1: 4-Bit Structural Ripple Carry Adder and Subtractor Unit

- The Design Blueprint: Write three distinct Verilog structural files. File 1 defines a gate-level Half Adder. File 2 instantiates two Half Adders and an `OR` gate to form a structural Full Adder. File 3 acts as the top-level module, cascading four Full Adder blocks together while using an array of `XOR` gates on the $B$ input lines linked to a control pin (`Mode`) to allow both addition ($Mode=0$) and subtraction ($Mode=1$).
- Quartus Tasks & Compilation: Create a new project targeting a generic Cyclone IV FPGA chip. Load your Verilog files, set File 3 as the top-level entity, and hit compile. Once completed, navigate to `Tools -> Netlist Viewers -> RTL Viewer` to inspect the generated layout.
- What to Document in Your Google Doc: Paste your complete, commented structural Verilog source code. Include a high-resolution screenshot of the compiled architecture from the Quartus RTL Viewer. Write a conceptual analysis explaining how the propagation delay grows as bits ripple sequentially from the least significant bit (LSB) up to the most significant bit (MSB). [19]

## Project 2: 4-to-16 Line Decoder and 16-to-1 Multiplexer Data Routing

- The Design Blueprint: Implement behavioral modeling in Verilog. For the 4-to-16 Decoder, write a module that takes a 4-bit input binary vector and drives a 16-bit output vector using a single dense behavioral `case` statement. For the 16-to-1 Multiplexer, write a module that takes sixteen independent 1-bit data lines and roots one single bit to the output terminal based on the state of a 4-bit selection vector.
- Quartus Tasks & Compilation: Compile the logic inside Quartus. Use the built-in University Program VWF (Vector Waveform File) simulator tool to construct a functional testbench matrix, manually setting the input lines to toggle across various combinations.
- What to Document in Your Google Doc: Include the complete Verilog code for both modules. Insert screenshots of the simulation timing waveforms showing how the decoder activates a single output line while the multiplexer successfully routes a selected data bit. Explain the operational difference between combinational selection logic and sequential routing states to your readers.

## Project 3: 4-Bit Binary Magnitude Comparator Logic Block

- The Design Blueprint: Write a behavioral Verilog module that accepts two unsigned 4-bit input arrays labeled as `A` and `B`. Inside an `always @(*)` block, implement conditional branching loops (`if`, `else if`, `else`) to drive three independent, 1-bit active-high output pins: `A_gt_B`, `A_lt_B`, and `A_eq_B`.
- Quartus Tasks & Compilation: Run the full design compiler toolchain inside Quartus Prime. Open the compilation report summaries to log the exact number of Logic Elements (LEs) and Look-Up Tables (LUTs) used by the FPGA fabric to implement your conditional loops.
- What to Document in Your Google Doc: Copy and paste your behavioral Verilog code. Include screenshots of the Quartus compilation reports showcasing the physical resource allocation metrics. Write an optimization section teaching readers how the synthesis tool automatically translates basic algebraic comparison operators ($>$, $<$, $=$) into optimized hardware gate matrices.

## Project 4: 4-Bit Universal Shift Register (SISO, SIPO, PISO, PIPO)

- The Design Blueprint: Design a synchronous sequential register module that contains a 4-bit internal storage register array, a 4-bit parallel data input bus, a 1-bit serial data input pin, a 2-bit control mode selection bus (`S1, S0`), a system clock input pin (`clk`), and a synchronous master reset pin.
- Quartus Tasks & Compilation: Implement an internal behavioral `case` block inside an `always @(posedge clk)` register assignment loop. Program the state choices so that: `00` holds the current data, `01` executes a right shift, `10` executes a left shift, and `11` executes an instantaneous parallel load of the 4-bit input bus.
- What to Document in Your Google Doc: Paste your universal shift register Verilog code. Include timing diagram screenshots from your simulation showing data bits entering serially and then expanding outwards across all four parallel outputs simultaneously. Explain the importance of synchronous edge-aligned registration in high-speed digital buses to your readers.

## Project 5: Synchronous Modulo-10 (BCD) Up/Down Counter with Synchronous Reset

- The Design Blueprint: Create a sequential logic module that tracks binary numbers from $0000$ (0) up to $1001$ (9). The module must include a master clock input, a synchronous clear button, an active-high enable pin, and a single-bit control line labeled `UpDown`.
- Quartus Tasks & Compilation: Implement an edge-triggered tracking loop. Write conditional logic specifying that if `UpDown = 1`, the internal counter increases by one on each rising edge of the clock until it hits 9, where it automatically rolls back to 0. Conversely, if `UpDown = 0`, it decrements down to 0 and wraps back up to 9.
- What to Document in Your Google Doc: Include the complete, commented Verilog source code. Show simulation screenshots tracking the counter incrementing sequentially up to 9, rolling over to 0, and switching directions smoothly when the control line is toggled. Write a tutorial paragraph teaching readers how to prevent illegal out-of-bounds states (such as numbers 10 through 15) in standard BCD systems.

## Project 6: Hexadecimal BCD-to-7-Segment Display Decoder

- The Design Blueprint: Design an hardware translation block that takes a 4-bit binary input nibble and maps it to a 7-bit output bus vector (`seg[0:6]`) configured to illuminate the standard individual segments ($a$ through $g$) of a common-cathode physical 7-segment display.
- Quartus Tasks & Compilation: Use a highly structured behavioral `case` statement to explicitly map out all sixteen hexadecimal character shapes ($0$ through $9$ and $A$ through $F$). Compile the design and use the pin planner tool window inside Quartus to see how logical outputs map to physical output pin assignments.
- What to Document in Your Google Doc: Document your complete lookup table Verilog code. Provide a graphic diagram showing which segments must turn ON or OFF to sketch each individual alphanumeric character. Write a section teaching students how to alter this code to support common-anode displays by applying bitwise inversion operations. [20, 21]

## Project 7: Mealy and Moore Finite State Machine (FSM) Traffic Controller

- The Design Blueprint: Build a complete intersection controller that shifts state patterns between Green, Yellow, and Red signals based on a single sensor input line (`car_present`). Write two separate Verilog versions of this project. Version 1 is a Moore machine where the output depends solely on the active state register. Version 2 is a Mealy machine where the output timing changes instantly if an input variable shifts while inside a state.
- Quartus Tasks & Compilation: Use standard parameters to define your states (`S_GREEN`, `S_YELLOW`, `S_RED`). Implement the canonical 3-block FSM style code in Verilog: block 1 handles state transitions, block 2 defines the next-state logic, and block 3 drives the output combinations. Compile both versions.
- What to Document in Your Google Doc: Paste the code for both the Mealy and Moore implementations. Include screenshots of the state transition graphs generated automatically by the Quartus State Machine Viewer tool. Write a detailed comparative summary detailing why Mealy machines respond faster but can introduce dangerous asynchronous glitches compared to Moore setups.

## Project 8: Digital Combination Electronic Security Lock FSM

- The Design Blueprint: Design an electronic lock state engine that monitors a 2-bit input bus where users type code entries. The FSM must remain locked until it receives a precise sequence of four consecutive inputs (e.g., Code 1, then Code 3, then Code 2, then Code 0). Any incorrect entry must immediately reset the sequence back to the baseline start state.
- Quartus Tasks & Compilation: Map out a highly linear sequence of five states tracking the user's progress (`IDLE`, `STAGE_1`, `STAGE_2`, `STAGE_3`, `UNLOCKED`). Compile the logic and run functional vector simulations to test the lock under correct inputs and various broken or failed code sequence paths.
- What to Document in Your Google Doc: Paste the behavioral FSM Verilog code. Include simulation trace screenshots showing the `Unlock` output line jumping to a logic-high level only when the exact numeric sequence is executed. Write a step-by-step tutorial section explaining how to handle debouncing logic boundaries when dealing with real-world physical buttons.

## Project 9: Real-Time Digital Clock with Cascading Frequency Dividers

- The Design Blueprint: Create a multi-module timing system. Module 1 is a frequency divider that acts as a binary counter tracking an internal high-speed $50\text{ MHz}$ board clock, outputs a single brief pulse every time it hits 50,000,000, creating an accurate $1\text{ Hz}$ clock tick. Module 2 contains three cascading counters that tap this $1\text{ Hz}$ tick to track seconds (0-59), minutes (0-59), and hours (0-23).
- Quartus Tasks & Compilation: Interconnect your sub-modules using structural wiring inside a master top-level Verilog file. Compile the entire system and review the timing analysis compilation reports to ensure the design can run reliably at the intended clock rates without introducing timing violations.
- What to Document in Your Google Doc: Include the complete multi-file Verilog code listings. Show structural block diagram screenshots of the cascading counters. Write a comprehensive section teaching readers how to use conditional logic to reset the seconds/minutes counters back to zero the instant they hit the value 60.

## Project 10: 8-Bit Arithmetic Logic Unit (ALU) with Processor Flag Registers

- The Design Blueprint: Build the ultimate computational core block of an 8-bit central processing unit. Design a module that accepts two 8-bit data vectors (`A` and `B`) and a 3-bit operation selection bus (`OpCode`).
- Quartus Tasks & Compilation: Implement behavioral execution code covering 8 operations: Addition, Subtraction, Bitwise AND, Bitwise OR, Bitwise XOR, Logical Left Shift, Logical Right Shift, and a direct Magnitude Pass. Program an independent block to evaluate and update four status flags: Carry (`C`), Zero (`Z`), Negative (`N`), and Overflow (`V`).
- What to Document in Your Google Doc: Paste your master ALU Verilog code accompanied by extensive descriptive comments. Include functional simulation screenshots demonstrating arithmetic operations and showing how the flag registers trip under boundary conditions (like an operation resulting in exactly zero or crossing into signed negative territory). [22]