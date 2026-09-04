
## Project 1: Nanometer CMOS Inverter VTC and Noise Margin Extraction

- The Code Setup & Strategy: Open a blank text file to write a raw HSpice netlist. Include the official `45nm_bulk.pm` Predictive Technology Model (PTM) text file using the `.include` command. Declare an NMOS transistor (`m1`) and a PMOS transistor (`m2`) scaled to typical IC dimensions (e.g., $W_{n} = 90\text{nm}$, $W_{p} = 180\text{nm}$, $L_{n} = L_{p} = 45\text{nm}$). Set a stable voltage rail supply line: `Vdd vdd 0 1.0V`.
- Simulation Commands: Add a DC sweep directive to step the input voltage node across the full supply range: `.dc Vin 0 1.0V 0.001V`. Run the HSpice simulator via the command-line interface.
- What to Document in Your Google Doc: Copy and paste your exact HSpice text netlist code into your document using a clear code font block. Plot the resulting Voltage Transfer Curve (VTC). Teach your readers how to calculate the exact derivatives ($d(V_{out})/d(V_{in}) = -1$) to extract the critical input/output voltage coordinates ($V_{IL}, V_{IH}, V_{OL}, V_{OH}$) and use them to calculate the high and low Noise Margins ($NM_H, NM_L$).

## Project 2: Scaling and Propagation Delay Analysis of CMOS Inverter Chains

- The Code Setup & Strategy: Extend the netlist structure from Project 1 to link three independent CMOS inverter stages together in series (the output of Stage 1 drives the gate input of Stage 2, and so on). Connect a capacitive load ($C_{load} = 5\text{fF}$) to the final output node of Stage 3 to model standard circuit fan-out loading.
- Simulation Commands: Define the input source as a high-speed pulse generator: `Vin in 0 PULSE(0 1.0 0ns 0.1ns 0.1ns 1ns 2ns)`. Place a transient evaluation directive: `.tran 0.01ns 4ns`. Run HSpice and open the waveform data in your visualization tool.
- What to Document in Your Google Doc: Paste your multi-stage netlist. Plot the transient waveforms of the input pulse alongside the output transitions of all three stages. Use the measurement utilities to calculate the propagation delay times ($t_{pHL}$ and $t_{pLH}$) at the $50\%$ voltage crossing points. Write a detailed analysis section explaining how transistor channel widths alter switching speeds and dynamic power consumption. [15]

## Project 3: High-Swing Cascode Current Mirror Matrix

- The Code Setup & Strategy: Write an HSpice netlist implementing a four-transistor cascode current mirror configuration using 45nm CMOS parameters. This architecture uses two transistors stacked vertically as the reference generation column, paired with an identical stacked transistor column forming the output current branch.
- Simulation Commands: Feed the reference column using an ideal constant input current source (`Iref 0 ref_node 20uA`). Add a DC sweep command to vary the voltage hitting the final output node from $0\text{V}$ up to the full $1.0\text{V}$ rail line: `.dc Vout 0 1.0V 0.01V`.
- What to Document in Your Google Doc: Document your raw current mirror netlist text lines. Plot the output current ($I_{out}$) against the output voltage ($V_{out}$). Teach your readers how to calculate the output resistance ($R_{out} = \Delta V_{out} / \Delta I_{out}$) from the flat saturation region of the plot, explicitly proving how the cascode stack layout minimizes channel-length modulation effects.

## Project 4: Active-Load Common-Source Integrated Amplifier Stage

- The Code Setup & Strategy: Construct an integrated Common-Source amplifier netlist. Place an NMOS transistor with its source pin tied to ground, its gate tied to an AC signal source, and its drain connected directly to the output node. Instead of using a basic resistor, connect a PMOS current mirror assembly to the drain node to act as an active high-impedance load block.
- Simulation Commands: Define the input source properties to include a small-signal AC amplitude: `Vin in 0 DC 0.45V AC 1`. Run an alternating current frequency sweep directive: `.ac dec 20 10Hz 10GHz`.
- What to Document in Your Google Doc: Copy your HSpice code into the report. Plot the resulting wideband Bode magnitude ($\text{dB}$) and phase curves. Show readers how to calculate the low-frequency open-loop voltage gain equation ($A_v = -g_{m1}(r_{o1} \parallel r_{o2})$) and trace how the simulation results match this mathematical model.

## Project 5: CMOS Differential Pair with Active Current Mirror Load

- The Code Setup & Strategy: Design a standard differential input stage netlist. Wire two identical source-coupled NMOS transistors ($M_1, M_2$) forming the differential input pair. Connect their shared source node to ground across a lower NMOS current source transistor providing a stable bias current ($I_{tail} = 50\mu\text{A}$). Connect a PMOS current mirror across their drain terminals to serve as the active load network.
- Simulation Commands: Set up twin input AC voltage sources to execute two separate evaluation runs. Run 1 applies a differential signal input (`Vin1` and `Vin2` configured $180^\circ$ out of phase) combined with an `.ac` sweep. Run 2 applies an identical common-mode signal across both inputs to evaluate common-mode gain.
- What to Document in Your Google Doc: Include the complete differential pair netlist. Plot the differential gain curve and the common-mode gain curve on the same frequency plot axis. Show the step-by-step math to calculate the Common-Mode Rejection Ratio ($\text{CMRR} = \vert{}A_d / A_c\vert{}$), proving how this stage isolates clean signals from common environmental noise. [16]

## Project 6: Integrated Source-Follower (Common-Drain) Output Stage Analysis

- The Code Setup & Strategy: Design an integrated output buffer stage netlist using a large NMOS transistor ($M_1$) configured in a Common-Drain layout. The gate pin acts as the signal input node, the drain pin connects directly to the $+1.0\text{V}$ rail line, and the source pin connects to the output node, which is biased by a lower NMOS current sink transistor.
- Simulation Commands: Apply a full-rail sinusoidal input signal at a frequency of $10\text{kHz}$ to the gate. Run a transient simulation (`.tran 0.1us 200us`) while attaching various output load capacitors ($10\text{fF}, 100\text{fF}, 1\text{pF}$) to evaluate the stage performance.
- What to Document in Your Google Doc: Paste the source-follower HSpice netlist code. Plot the input and output waveforms on the same graph axis to visually demonstrate the near-unity voltage gain tracking. Create an engineering analysis write-up detailing how heavy capacitive loading causes phase lag and voltage swing compression in integrated circuits.

## Project 7: Design of an Uncompensated Two-Stage CMOS Operational Amplifier

- The Code Setup & Strategy: Combine your previous circuit blocks to build a comprehensive, uncompensated two-stage operational amplifier netlist. Stage 1 is the active-loaded CMOS differential pair from Project 5. The output node of Stage 1 connects directly to the gate input of Stage 2, which consists of an integrated active-loaded Common-Source amplifier from Project 4.
- Simulation Commands: Set the input sources to run a standard open-loop small-signal frequency sweep: `.ac dec 50 1kHz 20GHz`. Run the simulator.
- What to Document in Your Google Doc: Paste the complete multi-transistor uncompensated amplifier netlist. Plot the open-loop Bode magnitude and phase response curves. Instruct your readers how to locate the primary pole and secondary pole frequencies on the plot, and explicitly demonstrate that the total phase shift drops past $-180^\circ$ before the gain line falls to $0\text{dB}$, proving the amplifier is inherently unstable. [17, 18]

## Project 8: Two-Stage CMOS Op-Amp with Miller Frequency Compensation

- The Code Setup & Strategy: Replicate your exact master two-stage op-amp netlist from Project 7. To introduce stability, add two passive elements inside the text file: a frequency compensation capacitor ($C_C = 1\text{pF}$) wired in series with a nulling resistor ($R_Z = 2\text{ k}\Omega$), placed as a negative feedback loop tracking from the final Stage 2 output node back to the Stage 1 output node.
- Simulation Commands: Run the exact same frequency sweep directive used previously: `.ac dec 50 1kHz 20GHz`. Run HSpice.
- What to Document in Your Google Doc: Include your newly modified, compensated op-amp text netlist. Superimpose the frequency response curves of this design directly over the uncompensated curves from Project 7. Teach your readers how this feedback network performs "pole splitting" to push the primary and secondary poles apart, safely raising the Phase Margin above $60^\circ$ to guarantee absolute circuit stability.

## Project 9: Static Noise Margin (SNM) Characterization of a 6T SRAM Bit-Cell

- The Code Setup & Strategy: Construct a standard Six-Transistor (6T) SRAM memory cell layout using text commands. Wire two cross-coupled CMOS inverters to form the internal latch core. Connect two additional access NMOS transistors linking the internal storage nodes (`Q` and `Q_bar`) out to external bit lines (`BL` and `BL_bar`), keeping the access gates tied to a word line node (`WL`).
- Simulation Commands: Lock the word line high (`Vwl wl 0 1.0V`) to simulate the cell in an active read state. Run a dual, nested DC sweep command: `.dc Vnode1 0 1.0V 0.01V Vnode2 0 1.0V 0.01V` to trace the voltage interactions of the cross-coupled nodes simultaneously.
- What to Document in Your Google Doc: Paste your complete 6T SRAM cell netlist. Plot the resulting overlapping voltage transfer curves to generate the famous "Butterfly Curve" graphic. Provide a detailed tutorial explaining how to measure the largest possible nested square that can fit inside the butterfly wing openings to define the exact Static Noise Margin (SNM) of the memory cell.

## Project 10: Temperature-Independent Bandgap Voltage Reference (BGR) Circuit

- The Code Setup & Strategy: Write a precision mixed-signal netlist that combines parasitic bipolar transistors (available inside advanced CMOS foundry files) or customized diode stacks to generate a constant output reference voltage. Connect the components so that a Proportional-to-Absolute-Temperature (PTAT) voltage loop combines with a Complementary-to-Absolute-Temperature (CTAT) voltage loop.
- Simulation Commands: Add a wide temperature sweep directive to test the circuit across extreme environmental fluctuations: `.temp -40 125 5`. Run the HSpice simulator.
- What to Document in Your Google Doc: Copy and paste your master BGR circuit netlist. Plot the final output voltage ($V_{ref}$) on the Y-axis against temperature on the X-axis from $-40^\circ\text{C}$ up to $+125^\circ\text{C}$. Show readers that the voltage curve remains virtually flat near $1.2\text{V}$ across the entire temperature range, providing a world-class capstone project to complete your portfolio website.
