
## Project 1: Non-Linear Diode Wave-Shaping (Clippers and Clampers)

- The Circuit Structure: Build two separate sub-circuits. Circuit 1 is a symmetrical clipper (an input AC source passed through a $1\text{ k}\Omega$ resistor, capped by two parallel, oppositely-facing standard 1N4148 diodes tied to ground). Circuit 2 is a positive clamper (a series $1\mu\text{F}$ capacitor followed by a shunt 1N4148 diode tied to ground, with a parallel $100\text{ k}\Omega$ bleeder resistor).
- Simulation & Analysis: Apply a $10\text{V}_{\text{peak}}$, $100\text{Hz}$ sine wave input. Run a `.tran 30m` simulation. For the clipper, plot $V_{out}$ vs. $V_{in}$ to generate an X-Y voltage transfer characteristics curve showing sharp clipping thresholds at $\pm 0.7\text{V}$. For the clamper, observe how the output waveform is completely shifted upwards, riding entirely above the $0\text{V}$ ground baseline.
- Google Doc Focus: Show the clipped transfer curve and the shifted DC baseline waveforms. Explain the mathematical step-by-step charging process of the clamper capacitor during the negative half-cycle of the input signal to help students visualize diode switching states. [5]

## Project 2: Full-Wave Bridge Rectifier with Ripple Filtering

- The Circuit Structure: Arrange four 1N4007 power diodes in a standard diamond bridge configuration. Connect the input terminals to a $12\text{V}_{\text{peak}}$, $50\text{Hz}$ AC source. Connect the output terminals to a parallel combination of a load resistor ($R_L = 220\Omega$) and a smoothing electrolytic capacitor ($C_{\text{filter}} = 470\mu\text{F}$).
- Simulation & Analysis: Run a `.tran 100m` analysis. Measure the peak-to-peak ripple voltage ($\Delta V$) writing across the DC output. Next, change the load resistor to a much lower value ($47\Omega$) to increase the current draw, and watch the ripple voltage expand dramatically.
- Google Doc Focus: Insert screenshots of the filtered output voltage under light versus heavy current loads. Write down the engineering formula for ripple voltage ($V_{\text{ripple}} = I_{\text{load}} / (2 f C)$) and show how the LTspice simulation directly validates the mathematical relationship between load current and filter capacitance. [6]

## Project 3: Zener Diode Shunt Regulation and Line/Load Analysis

- The Circuit Structure: Connect a variable DC source to a series current-limiting resistor ($R_s = 270\Omega$), followed by a shunt 1N4733A Zener diode (a real-world $5.1\text{V}$ regulator device) connected to ground. Connect a load resistor ($R_L$) across the Zener diode.
- Simulation & Analysis: Execute two distinct evaluations. First, perform a Line Regulation test: set $R_L = 1\text{ k}\Omega$ and run a `.dc V1 0 15 0.1` sweep to track how the Zener voltage stabilizes at exactly $5.1\text{V}$ once the input climbs past the breakdown threshold. Second, perform a Load Regulation test: fix the input voltage at $10\text{V}$ and run a `.dc param RL 50 1000 10` sweep to find the minimum load resistance before the Zener shuts off.
- Google Doc Focus: Plot the line regulation curve and the load regulation curve. Write a safety guide tutorial instructing readers how to calculate the maximum power dissipation metrics so they do not accidentally burn out a physical Zener diode in real lab environments.

## Project 4: Q-Point Thermal Stability Across BJT Biasing Networks

- The Circuit Structure: Place three isolated 2N2222 NPN transistor configurations side-by-side. Circuit 1 uses a Fixed-Bias network. Circuit 2 uses an Emitter-Stabilized Bias network. Circuit 3 uses a self-biasing Voltage-Divider network. Tune all three circuits so they start with an identical collector current ($I_C = 2\text{mA}$) at a standard room temperature of $25^\circ\text{C}$.
- Simulation & Analysis: Insert the directive `.temp 0 25 75 125` alongside a basic `.op` analysis command. Run the simulation. Track the drift of the DC Operating Point (Q-point coordinates: $I_C$ and $V_{CE}$) for all three circuits across the four temperature steps.
- Google Doc Focus: Compile a structured data table logging the drift of $I_C$ across temperature variations for all three biasing styles. Use this data to explicitly prove to readers why the Voltage-Divider bias provides superior negative feedback stability compared to the highly erratic Fixed-Bias network. [7, 8]

## Project 5: The Small-Signal Common-Emitter Audio Voltage Amplifier

- The Circuit Structure: Build a classic Common-Emitter amplifier using a 2N2222 BJT. Wire a Voltage-Divider network to the base ($R_1 = 33\text{ k}\Omega$, $R_2 = 10\text{ k}\Omega$), place a collector resistor ($R_C = 2.2\text{ k}\Omega$), an emitter resistor ($R_E = 1\text{ k}\Omega$), an emitter bypass capacitor ($C_E = 47\mu\text{F}$), and AC-coupling capacitors ($10\mu\text{F}$) at the input and output ports.
- Simulation & Analysis: Inject a $10\text{mV}_{\text{peak}}$, $1\text{kHz}$ AC sine wave at the input port. Run a transient simulation (`.tran 5m`). Measure the peak-to-peak voltage gain ($A_v = V_{out}/V_{in}$) and observe the $180^\circ$ phase inversion. Next, delete the bypass capacitor $C_E$ and re-run the trace to see the gain drop while input linearity improves.
- Google Doc Focus: Show the phase-inverted input and output waveforms superimposed on the same axis. Write a step-by-step guide explaining the hybrid-pi model parameters ($g_m, r_\pi$) and show how deleting the bypass capacitor introduces emitter degeneration feedback. [9]

## Project 6: The Emitter Follower (Common-Collector) Current Buffer

- The Circuit Structure: Setup a 2N2222 BJT configured as a Common-Collector amplifier. Connect the collector terminal directly to the stable $+12\text{V}$ power rail. Connect the output terminal to the emitter node across a $1\text{ k}\Omega$ emitter resistor ($R_E$), passing through a $10\mu\text{F}$ AC-coupling capacitor to a low-resistance load ($100\Omega$).
- Simulation & Analysis: Run a `.ac dec 100 10 100kHz` sweep to measure voltage gain, which should stabilize just under unity ($\approx 0.98\text{V/V}\digital\_logic$). To demonstrate current buffering, plot the total current drawn from the input signal source versus the current delivered to the load resistor to calculate the overall current gain.
- Google Doc Focus: Plot the input voltage vs. output voltage to show the near-unity gain tracking. Detail the step-by-step mathematical impedance transformations, proving how this circuit acts as a vital bridge to drive heavy, low-impedance loads without overloading fragile sensor input stages.

## Project 7: The Common-Base High-Frequency Amplifier RF Stage

- The Circuit Structure: Design a Common-Base amplifier circuit where the base terminal of a 2N2222 BJT is tied directly to AC ground using a large $10\mu\text{F}$ bypass capacitor. Feed the input signal directly into the emitter terminal across an AC coupling capacitor, and extract the output signal from the collector terminal node.
- Simulation & Analysis: Wire an identical Common-Emitter amplifier stage right next to it. Run a wideband frequency analysis command: `.ac dec 50 100 100MHz`. Plot the frequency response curves for both configurations on the same graph and locate their upper $-3\text{dB}$ high-frequency roll-off limits.
- Google Doc Focus: Screenshot the side-by-side high-frequency frequency response curves. Write an advanced explanation teaching students about internal transistor parasitic capacitances ($C_{\mu}, C_{\pi}$) and explain how the Common-Base topology bypasses the gain-multiplying Miller Effect to achieve wide high-frequency bandwidth.

## Project 8: MOSFET DC Drain/Transfer Curves & $V_{th}$ Extraction

- The Circuit Structure: Place a standard discrete N-channel enhancement-mode MOSFET (such as the generic `2N7002` model available in the native LTspice library) on the canvas. Connect a DC voltage source ($V_{DS}$) across the drain-source pins and a separate DC voltage source ($V_{GS}$) across the gate-source pins.
- Simulation & Analysis: Run a nested DC sweep directive: `.dc VDS 0 10 0.1 VGS 2 5 0.5`. This will sweep the drain voltage while stepping the gate voltage to generate a family of characteristic drain current curves. Next, clear that command and run a simple sweep on the gate voltage: `.dc VGS 0 5 0.01` while fixing $V_{DS}$ at a high value ($5\text{V}$) to plot the transfer curve.
- Google Doc Focus: Include screenshots of both the family of drain curves (marking Triode vs. Saturation boundaries) and the single transfer curve. Teach your readers how to visually extrapolate the exact threshold voltage ($V_{th}$) from the curve where the drain current begins to rise above zero.

## Project 9: Discrete Common-Source Enhancement-MOSFET Amplifier

- The Circuit Structure: Build a Common-Source voltage amplifier using a 2N7002 NMOS transistor. Implement a high-value Voltage-Divider network to set the gate bias ($R_1 = 1\text{ M}\Omega$, $R_2 = 330\text{ k}\Omega$). Place a drain resistor ($R_D = 4.7\text{ k}\Omega$), an emitter-equivalent source resistor ($R_S = 1\text{ k}\Omega$), a source bypass capacitor ($C_S = 22\mu\text{F}$), and standard input/output AC coupling capacitors.
- Simulation & Analysis: Drive the gate with a $20\text{mV}_{\text{peak}}$, $2\text{kHz}$ AC sine wave. Run a `.tran 3m` simulation. Measure the output amplitude to compute the total voltage gain. Increase the input signal amplitude to $500\text{mV}$ to watch the output waveform flatten out, showing clipping distortion due to saturation and cutoff limits.
- Google Doc Focus: Plot the clean amplified sine wave alongside the distorted, clipped waveform. Write a comparison section explaining the operational differences between BJT transconductance ($g_m = I_C/V_T$) and MOSFET square-law transconductance ($g_m = 2k_n(V_{GS}-V_{th})$).

## Project 10: High-Power MOSFET Logic Switching and Inductive Kickback

- The Circuit Structure: Select a high-current power MOSFET (like the `IRF540N`). Connect the gate to a $0\text{V}$-to-$5\text{V}$ square-wave pulse generator modeling a digital microcontroller output pin. Connect the drain terminal to a $+24\text{V}$ power rail across a heavy $100\text{mH}$ inductor that has a $10\Omega$ series internal winding resistance (this configuration models a physical DC motor or relay coil).
- Simulation & Analysis: Set the pulse source frequency to $500\text{Hz}$ and run a transient analysis (`.tran 10m`). Observe the huge inductive voltage spike (often climbing to hundreds of volts) hitting the drain node the exact instant the MOSFET switches from an ON state to an OFF state. Now, place a 1N4007 flywheel diode in parallel with the inductor (cathode facing the positive power rail) and re-run the trace.
- Google Doc Focus: Show the massive, dangerous voltage spike waveform alongside the clean, safe voltage-clamped waveform. Write an industrial safety guide teaching students how flyback diodes protect sensitive solid-state switching components from destructive inductive kickback events.

## Project 11: Mathematical Operators (Inverting, Non-Inverting, and Summing Amplifiers)

- The Circuit Structure: Place three independent op-amp circuit blocks on a single sheet using an ideal op-amp macromodel component (the `UniversalOpAmp2` found in LTspice). Block 1 is an Inverting Amplifier ($R_f = 10\text{ k}\Omega, R_{in} = 1\text{ k}\Omega$). Block 2 is a Non-Inverting Amplifier ($R_f = 9\text{ k}\Omega, R_1 = 1\text{ k}\Omega$). Block 3 is a two-input Summing Amplifier stage.
- Simulation & Analysis: Inject a $1\text{V}_{\text{peak}}$ sine wave into Blocks 1 and 2. Run a `.tran 5m` simulation and check the output gains (Block 1 should show $-10\text{V/V}$, Block 2 should show $+10\text{V/V}$). For Block 3, feed a $1\text{V}$ static DC voltage into Input 1 and a $2\text{V}$ static DC voltage into Input 2 to verify that the output yields the exact inverted sum ($-3\text{V}$).
- Google Doc Focus: Include clear screenshots of the input/output signals for all three mathematical operations. Write down the ideal op-amp golden rules (zero input current, virtual ground tracking) and show how they are used to derive these textbook equations.

## Project 12: Active Sallen-Key Low-Pass and High-Pass Filters

- The Circuit Structure: Construct a 2nd-order active Sallen-Key low-pass filter branch using a UniversalOpAmp2 block, two matching resistors ($R_1 = R_2 = 10\text{ k}\Omega$), and two matching capacitors ($C_1 = C_2 = 1.5\text{nF}$). Right next to it, swap the component positions to build an identical 2nd-order Sallen-Key high-pass filter.
- Simulation & Analysis: Setup an AC voltage source feeding both networks. Place the directive `.ac dec 100 10 100kHz` to run a frequency sweep. Plot the output responses on a log scale. Use the cursor tool to measure the attenuation slope past the cutoff corner frequency.
- Google Doc Focus: Show the overlapping Bode plots of the low-pass and high-pass filters. Teach your readers how to calculate the attenuation roll-off rate, proving that a 2nd-order active filter drops at a sharp rate of $-40\text{dB/decade}$, which is twice as fast as a basic passive RC network. [10, 11]

## Project 13: The 3-Op-Amp Instrumentation Amplifier

- The Circuit Structure: Replicate the structural topology of a professional instrumentation amplifier using three discrete op-amp blocks. Two op-amps act as the high-input-impedance differential input stage buffer, linked by a gain resistor ($R_g = 1\text{ k}\Omega$). The third op-amp is configured as a standard differential subtractor stage using four perfectly matched $10\text{ k}\Omega$ resistors.
- Simulation & Analysis: Configure two input voltage sources. Source 1 injects a tiny $50\text{mV}$, $1\text{kHz}$ differential signal. Source 2 acts as an environmental noise generator, injecting a massive $5\text{V}$, $50\text{Hz}$ common-mode sine wave across both input pins simultaneously. Run a transient simulation (`.tran 100m`).
- Google Doc Focus: Plot the messy, noise-corrupted raw input signals alongside the clean, amplified output signal. Explain the concept of Common-Mode Rejection Ratio (CMRR) to your readers and show how this specific three-op-amp structure strips away common-mode noise while preserving tiny sensor data.

## Project 14: Op-Amp Slew Rate and Gain-Bandwidth Performance Boundaries

- The Circuit Structure: Build a basic non-inverting op-amp amplifier block tuned for a voltage gain of $+2\text{V/V}$ ($R_f = R_1 = 10\text{ k}\Omega$). For this project, do not use an ideal model; instead, select a real physical component model from the library that has noticeable non-ideal traits, such as the classic `LM741`.
- Simulation & Analysis: Run two distinct test scenarios. Test 1: feed a $100\text{kHz}$ square wave into the input and run a `.tran 50u` simulation. Look closely at the output edges to see how they turn into flat diagonal slopes instead of vertical lines due to Slew Rate Limiting. Test 2: change the feedback resistor to $1\text{ M}\Omega$ to increase the target gain to $100,000\text{V/V}$ and run an `.ac` sweep to watch the system bandwidth shrink down to a few Hertz.
- Google Doc Focus: Include screenshots showing the triangular distortion caused by slew rate limits and the shifting frequency corners caused by Gain-Bandwidth Product (GBW) constraints. Write a guide instructing students how to read these performance ceilings on an industrial component datasheet. [12]

## Project 15: The Class AB Push-Pull Power Output Stage

- The Circuit Structure: Connect a complementary pair of high-power transistors—a `TIP31` (NPN) and a `TIP32` (PNP)—sharing a common emitter output node tied to an $8\Omega$ speaker load resistor. Drive their base pins using a $5\text{V}_{\text{peak}}$, $1\text{kHz}$ AC sine wave source.
- Simulation & Analysis: Run two configurations. Configuration 1: tie the two bases directly together to form a raw Class B amplifier and run a `.tran 5m` simulation. Look closely at the output waveform to see the dead-zone flatline around the $0\text{V}$ crossing point caused by Crossover Distortion. Configuration 2: separate the bases by inserting two 1N4148 biasing diodes in series alongside matching constant current source bias networks to form a Class AB amplifier.
- Google Doc Focus: Show close-up, zoomed-in screenshots comparing the crossover-distorted Class B output waveform against the clean, continuous Class AB output waveform. Explain the operational handoff mechanics that occur between the NPN and PNP transistors during the zero-crossing transition to guide your readers. [13, 14]
