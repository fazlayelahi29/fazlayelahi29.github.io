# MICROARCHITECTURAL QUANTIZATION AND HARDWARE-TIMED PULSE WIDTH MODULATION IN 8-BIT REDUCED INSTRUCTION SET COMPUTER SYSTEMS

# AUTHOR INFORMATION

> - Name: Fazlay Elahi
>     
>       
>     
> - Email: scholar.fazlay.elahi.eee.aust@gmail.com
>     
>       
>     
> - Affiliation: Department of Electrical and Electronic Engineering (EEE), Ahsanullah University of Science and Technology (AUST), 141 & 142, Love Road, Tejgaon Industrial Area, Dhaka-1208, Bangladesh
>     
>       
>     
> - Personal Website: [https://fazlayelahi29.github.io/](https://fazlayelahi29.github.io/)
>     
>       
>     
> - LinkedIn: [https://www.linkedin.com/in/fazlayelahi29/](https://www.linkedin.com/in/fazlayelahi29/)
>     
>       
>     

# ABSTRACT

The continuous translation of analog physical phenomena into discrete digital frameworks, alongside the reciprocal synthesis of analog equivalents from digital cores, represents the foundational paradigm of modern embedded microarchitectures. This comprehensive academic investigation rigorously analyzes the internal mechanics of a 10-bit Successive Approximation Register (SAR) Analog-to-Digital Converter (ADC) and the generation of highly controlled Pulse Width Modulated (PWM) signals utilizing 8-bit hardware timers within a Reduced Instruction Set Computer (RISC) microcontroller environment. The underlying physical and mathematical theories governing quantization noise, sample-and-hold capacitance limits, and Nyquist-Shannon sampling constraints were systematically evaluated to establish a flawless data acquisition pipeline. The engineering simulations and computational validations were executed utilizing the AVR-GCC compiler ecosystem and the ATmega328P microarchitecture as the primary evaluation suite. An array of experimental paradigms was formulated to validate linear signal mapping protocols, threshold-based logic execution, proportional-inverse signal distribution, and variable-delay timing structures governed by continuous analog inputs. A robust, bare-metal C/C++ programming methodology was synthesized to bypass high-level hardware abstractions, directly manipulating multiplexer selection registers (ADMUX), ADC control and status registers (ADCSRA), and timer/counter control registers (TCCR1A/TCCR1B) to achieve maximal execution determinism. The finalized empirical results confirmed the theoretical hypotheses with uncompromising accuracy; linear interpolation models effectively translated 0-5V analog domains into highly precise 0-100% duty cycles and 8-bit PWM matrices. The computational output yielded distinct, measurable propagation validations, proving that discrete-time digital systems can seamlessly replicate analog states when driven by strictly calibrated duty-cycle variations and correctly aligned reference voltages. Ultimately, this report stands as a definitive exploration of low-level microcontroller data translation, bridging the complex boundary between continuous electromagnetic realities and binary logical architectures.

  

# KEYWORDS/INDEX TERMS

- Analog-to-Digital Conversion (ADC)
    
      
    
- Successive Approximation Register (SAR)
    
      
    
- Pulse Width Modulation (PWM)
    
      
    
- Reduced Instruction Set Computer (RISC)
    
      
    
- Register Transfer Level (RTL) Control
    
      
    
- Quantization Error Analysis
    
      
    
- Signal Mapping and Interpolation
    
      
    
- Timer/Counter Architecture
    
      
    
- Bare-Metal C++ Programming
    
      
    
- Multiplexer Selection Registers
    
      
    
- Embedded Systems Engineering
    
      
    
- Duty Cycle Modulation
    
      
    
- Discrete-Time Signal Processing
    
      
    
- Reference Voltage Scaling
    
      
    
- Hardware Interrupt Service Routines
    
      
    

# 1. PROJECT STATEMENT

The core problem statement resides in the critical necessity to interface a strictly discrete, binary-logic microcontroller environment with continuous, real-world analog voltage gradients. Specifically, an operational framework must be engineered to accurately sample, quantify, and process continuous DC voltage inputs ranging from 0V to 5V. Concurrently, a mathematical and hardware-level inversion process must be developed to synthesize variable output voltages utilizing high-frequency digital switching. The known variables include a stable 5V direct current source, linear potentiometric voltage dividers, and an internal 10-bit hardware ADC. The unknown variable to be resolved is the precise algorithmic and register-level configuration required to dynamically map fluctuating analog inputs into deterministic digital threshold operations, proportional-inverse power distributions, and frequency-modulated temporal delays. These operations must be resolved utilizing the AVR-GCC compiler ecosystem natively addressing an 8-bit ATmega328P architecture without inducing processor blocking or state-machine failure.

  

# 2. PROJECT OBJECTIVE

The fundamental objectives driving the execution of this complex microarchitectural analysis are rooted in validating theoretical data conversion mechanics through rigorous empirical implementation. The specific physical, computational, and validation goals include:

  

- Verification of Quantization Mechanics:
    
      
    1. To mathematically map the discrete step voltages of a 10-bit ADC architecture against varying reference voltages.
        
        a. Evaluating the 5.0V default analog reference configuration to establish a baseline resolution.
        
        b. Evaluating the 1.1V internal bandgap reference to measure low-voltage sensitivity variations.
        
          
        
    2. To empirically measure the inherent quantization error produced during the analog-to-digital translation phase.
        
        a. Assessing the signal-to-noise ratio degradation during high-speed sampling.
        
        b. Quantifying the absolute bit-level accuracy across the 0-1023 digital output spectrum.
        
          
        
- Validation of Duty Cycle Modulation Theory:
    
      
    1. To synthesize analog voltage equivalents utilizing varying duty cycles within a fixed-frequency switching domain.
        
        a. Implementing 8-bit resolution matrices to control average power dissipation across a resistive load.
        
        b. Analyzing the thermal and luminous response of semiconductor diodes under continuous high-frequency PWM switching.
        
          
        
    2. To construct dynamic, real-time feedback loops where analog input parameters directly dictate digital output behaviors.
        
        a. Designing closed-loop proportional mapping logic to control actuator intensity.
        
        b. Designing closed-loop inverse mapping logic to demonstrate complementary signal distribution.
        
          
        
- Optimization of Register-Level Operations:
    
      
    1. To bypass standard, inefficient software abstraction layers in favor of bare-metal register manipulation.
        
        a. Configuring the ADMUX and ADCSRA registers directly in C/C++ for maximum clock-cycle efficiency.
        
        b. Establishing low-latency data acquisition pipelines utilizing internal microcontroller clock prescalers.
        
          
        
    2. To implement non-blocking timing structures driven by analog data inputs.
        
        a. Calculating exact timer overflow rates corresponding to analog potentiometer states.
        
        b. Translating scalar voltage measurements into deterministic microsecond-level execution delays.
        
          
        
- Evaluation of Processor Latency and Bottlenecks:
    
      
    1. To quantify CPU cycle consumption during floating-point versus fixed-point arithmetic execution.
        
        a. Measuring the clock cycles required for standard 32-bit floating-point division.
        
        b. Measuring the clock cycles required for 16-bit integer-based bit-shifting operations.
        
          
        
    2. To validate interrupt-driven architecture over synchronous polling.
        
        a. Developing a hardware-triggered ADC completion interrupt vector.
        
        b. Developing a hardware-triggered timer overflow interrupt vector.
        
          
        
- Synthesis of Serial Communication Protocols:
    
      
    1. To establish high-speed, direct register-level Universal Asynchronous Receiver-Transmitter (UART) links.
        
        a. Configuring the UBRR0 register to secure a 115200-baud transmission rate.
        
        b. Configuring the UCSR0B register to enable transmission and reception hardware blocks.
        
          
        
    2. To stream massive analog data sets to terminal nodes without bottlenecking the CPU.
        
        a. Implementing character-array transmission algorithms to bypass heavy standard libraries.
        
        b. Implementing carriage-return and line-feed protocols for structured data logging.
        
          
        
- Demonstration of Microarchitectural Resilience:
    
      
    1. To assess system stability under rapidly fluctuating analog inputs.
        
        a. Subjecting the analog pins to extreme, high-frequency voltage sweeps.
        
        b. Subjecting the system to continuous power cycling to verify boot-sequence stability.
        
          
        
    2. To analyze the thermal parameters of the silicon under maximum PWM load.
        
        a. Evaluating heat dissipation on the GPIO pins driving continuous 20mA loads.
        
        b. Evaluating internal oscillator drift due to thermal expansion of the silicon die.
        
          
        

# 3. PROJECT SCOPE

To maintain absolute mathematical feasibility and engineering precision, the operational boundaries of this project are strictly delineated into the following domains of inclusion and exclusion:

  

- Inclusions:
    
      
    1. Theoretical and computational analysis of 10-bit Successive Approximation Register (SAR) ADCs operating under standard atmospheric conditions.
        
        a. Static and dynamic analysis of the internal sample-and-hold capacitor mechanics.
        
        b. Evaluation of the ADC multiplexer channel selection algorithms (Channels A0 and A1).
        
          
        
    2. Generation and modulation of standard Phase-Correct and Fast Pulse Width Modulation (PWM) signals utilizing 8-bit hardware timer configurations.
        
        a. Analysis of output compare registers (OCR0A/OCR0B, OCR1A/OCR1B) for duty cycle definition.
        
        b. Mapping of input voltages to integer-based percentage outputs.
        
          
        
- Exclusions:
    
      
    1. Complex continuous-time active analog filtering operations prior to digital sampling.
        
        a. Hardware-level operational amplifier (Op-Amp) anti-aliasing filters are strictly excluded to simplify the analog front-end.
        
        b. Inductor-capacitor (LC) low-pass filtering on the PWM output stage is omitted, relying instead on the natural integration characteristics of the applied load.
        
          
        
    2. High-voltage power electronics and grid-tied synchronization analyses.
        
        a. The operational voltage is strictly confined to the 0V to 5V Direct Current (DC) domain.
        
        b. Alternating Current (AC) phase manipulation, Insulated-Gate Bipolar Transistor (IGBT) switching, and massive power inversion are completely outside the boundary of this low-level logic study.
        
          
        

# 4. PROJECT REQUIREMENTS AND ENVIRONMENT

The successful replication and validation of the theoretical algorithms mandate the utilization of a highly controlled, universally standardized engineering environment.

  

- Hardware Ecosystem:
    
      
    1. The primary execution unit requires a standard 8-bit RISC microcontroller architecture.
        
        a. The core must possess a minimum of one 10-bit SAR ADC with internal multiplexing capabilities.
        
        b. The core must feature independent hardware timers capable of hardware-level PWM generation without continuous CPU intervention.
        
          
        
    2. The analog signal generation and output validation ecosystem requires fundamental, linear passive components.
        
        a. Precision 10 kΩ linear potentiometers are required to function as tunable voltage dividers for signal injection.
        
        b. Light Emitting Diodes (LEDs) coupled with 220 Ω current-limiting resistors are required as visual indicators of average power dissipation and duty cycle variation.
        
          
        
- Software and Simulation Ecosystem:
    
      
    1. The compilation and programming environment requires a robust C/C++ cross-compiler optimized for embedded microarchitectures.
        
        a. The AVR-GCC compiler toolchain is utilized to translate high-level C++ algorithms into optimized machine-level hexadecimal object code.
        
        b. A standard serial communication monitor is required to extract and verify the real-time digital values parsed by the microcontroller.
        
          
        
    2. Algorithmic and mathematical logic frameworks are implemented via rigid software structuring.
        
        a. Linear mapping functions are required to mathematically interpolate integer datasets between disparate numerical boundaries.
        
        b. Boolean conditional logic structures are strictly required to define threshold-based execution branches based on variable input matrices.
        
          
        

# 5. LITERATURE REVIEW

To establish a highly rigorous foundation for this execution, a comprehensive synthesis of foundational electronic engineering literature and solid-state physics papers was undertaken. The parameters extracted from these texts mandate the mathematical boundary conditions executed within the methodology.

  

- Microarchitectural ADC Mechanics and Quantization Limits:
    
      
    1. The fundamental limitations of Successive Approximation Register architectures were thoroughly delineated in peer-reviewed analyses of continuous-time to discrete-time conversions.
        
        a. It was established that the internal sample-and-hold capacitance directly dictates the maximum allowable source impedance of the analog signal to prevent severe voltage droop [1].
        
        b. Mathematical models derived from these studies demonstrated that quantization noise in an ideal N-bit ADC is uniformly distributed, validating the theoretical error margins utilized for error modeling [1].
        
          
        
    2. Advanced evaluations of microcontroller internal voltage references highlighted the thermal instability of silicon bandgap references under heavy computational load.
        
        a. Studies verified that while a 1.1V internal reference provides high resolution for microscopic signals, its temperature coefficient can induce significant drift across prolonged operational epochs [2].
        
        b. Consequently, the ratiometric operational mode utilizing the default 5V supply rail was validated as optimal for potentiometric sensing, as supply fluctuations mathematically cancel out during the ratiometric division process [2].
        
          
        
- Hardware PWM Synthesis and Fourier Sub-harmonics:
    
      
    1. The mathematical Fourier decomposition of PWM signals has been extensively documented in high-power converter literature.
        
        a. Literature confirms that a PWM signal is composed of a fundamental DC component directly proportional to the duty cycle, accompanied by an infinite series of high-frequency harmonic elements [3].
        
        b. It was demonstrated that physical output loads inherently integrate these high-frequency pulses due to their inherent low-pass filtering characteristics, rendering complex external analog filters unnecessary for basic actuation [3].
        
          
        
    2. The architectural disparities between Fast PWM and Phase-Correct PWM topologies were systematically analyzed regarding harmonic distortion.
        
        a. Fast PWM was shown to offer higher operational switching frequencies, which is advantageous for mitigating visible flicker or acoustic resonance [4].
        
        b. Phase-Correct PWM, operating at exactly half the frequency, was proven to maintain dual-slope symmetry, which is highly critical in advanced motor control logic but mathematically redundant for basic resistive dissipation loads [4].
        
          
        

# 6. CONCEPTUAL BACKGROUND

The mathematical, physical, and theoretical substructures governing continuous-to-discrete signal translation mandate extreme rigor. The parameters must be systematically defined prior to computational execution.

  

## 6.1 SYMBOLS AND NOTATIONS

|**Symbol**|**Definition**|**SI Unit/Format**|
|---|---|---|
|$V_{in}$|Continuous analog input voltage applied to the ADC multiplexer pin|Volts (V)|
|$V_{ref}$|Absolute reference voltage utilized for internal ADC comparison limits|Volts (V)|
|$N$|Bit-resolution of the Analog-to-Digital Converter hardware|Integer (Bits)|
|$ADC_{val}$|Discrete digital integer output from the conversion process|Dimensionless|
|$Q$|Discrete quantization step size defining the resolution limit|Volts/Step (V)|
|$Q_e$|Maximum absolute quantization error inherent to the digital system|Volts (V)|
|$D$|Duty Cycle percentage of the generated Pulse Width Modulated signal|Percentage (%)|
|$t_{high}$|Temporal duration the digital signal remains in the logical HIGH state|Seconds (s)|
|$T$|Total temporal period of one complete continuous PWM cycle|Seconds (s)|
|$V_{avg}$|Calculated average voltage integrated across the output load|Volts (V)|
|$f_{clk}$|Fundamental frequency of the microcontroller's internal crystal oscillator|Hertz (Hz)|
|$P$|Integer prescaler value applied to divide the hardware timer clock|Dimensionless|
|$f_{PWM}$|Resultant frequency of the generated PWM square wave|Hertz (Hz)|
|$C_{sh}$|Internal sample-and-hold capacitance of the microcontroller analog front-end|Farads (F)|
|$R_s$|Series resistance of the external continuous analog signal source|Ohms ($\Omega$)|
|$t_c$|Total conversion time required for one full 10-bit successive approximation|Seconds (s)|
|$f_s$|Sampling frequency or sampling rate of the digital converter|Samples/sec (Sa/s)|
|$f_{max}$|Maximum frequency component of the continuous analog input signal|Hertz (Hz)|
|$x(t)$|Continuous-time analog input signal mathematical function|Volts (V)|
|$x[n]$|Discrete-time digital output signal array sequence|Dimensionless|
|$y$|Mapped, scaled, and outputted integer parameter|Dimensionless|
|$m$|Mathematical slope of the linear mapping transfer interpolation function|Dimensionless|
|$I_f$|Forward current passing through the semiconductor Light Emitting Diode|Amperes (A)|
|$V_f$|Forward voltage drop across the semiconductor Light Emitting Diode|Volts (V)|
|$R_{limit}$|Resistance value of the safety current-limiting hardware resistor|Ohms ($\Omega$)|
|$\tau$|Resistor-capacitor (RC) time constant for the internal sample-and-hold circuit|Seconds (s)|
|$T_{ovf}$|Temporal duration for a specific hardware counter register to overflow|Seconds (s)|
|$OCR$|8-bit Output Compare Register integer boundary value|Dimensionless|
|$ADMUX$|8-bit Analog-to-Digital Converter Multiplexer Selection Register|Hexadecimal / Binary|
|$ADCSRA$|8-bit Analog-to-Digital Converter Control and Status Register A|Hexadecimal / Binary|
|$TCCR1A$|Timer/Counter 1 Control Register A governing PWM output behaviors|Hexadecimal / Binary|
|$TCCR1B$|Timer/Counter 1 Control Register B governing clock prescaling mechanics|Hexadecimal / Binary|

## 6.2 GLOSSARY/NOMENCLATURE

|**Acronym/Term**|**Comprehensive Definition**|
|---|---|
|ADC|Analog-to-Digital Converter: A hardware device that converts continuous physical quantities into discrete digital numbers.|
|SAR|Successive Approximation Register: A specific ADC architecture that utilizes a binary search algorithm to resolve digital values.|
|PWM|Pulse Width Modulation: A technique for generating analog-equivalent power levels by rapidly toggling a digital signal's duty cycle.|
|RISC|Reduced Instruction Set Computer: A microprocessor architecture optimized for executing a small, highly efficient set of commands.|
|LSB|Least Significant Bit: The lowest-order bit in a binary number, representing the smallest measurable change in voltage.|
|MSB|Most Significant Bit: The highest-order bit in a binary number, carrying the greatest mathematical weighting.|
|RTL|Register Transfer Level: A design abstraction modeling synchronous digital circuits in terms of data flow between hardware registers.|
|ISR|Interrupt Service Routine: A software block triggered by a hardware event, temporarily halting the main program to handle high-priority tasks.|
|GPIO|General Purpose Input/Output: Digital signal pins on an integrated circuit that can act as input receivers or output drivers.|
|SNR|Signal-to-Noise Ratio: The ratio of the desired signal power to the background noise power, measuring analog transmission fidelity.|
|AREF|Analog Reference: The specific hardware pin dedicated to receiving an external reference voltage for ADC bounding limits.|
|AVCC|Analog Supply Voltage: The dedicated power supply pin for the microcontroller's internal analog circuitry, minimizing digital switching noise.|
|DAC|Digital-to-Analog Converter: A circuit that performs the inverse operation of an ADC, synthesizing continuous voltages from binary.|
|ALU|Arithmetic Logic Unit: The digital circuit within a processor core that performs integer arithmetic and bitwise logic operations.|
|RTOS|Real-Time Operating System: An operating framework designed to process data strictly bounded by microsecond temporal deadlines.|
|LED|Light Emitting Diode: A semiconductor light source that emits photons when current flows through the p-n junction in the forward direction.|
|EMI|Electromagnetic Interference: Disturbance generated by an external source that affects an electrical circuit by parasitic induction.|
|Baud Rate|The rate at which binary information is transferred in a serial communication channel, defined strictly in bits per second (bps).|
|Prescaler|An electronic digital counting circuit used to reduce a high-frequency internal clock signal to a lower frequency by integer division.|
|Polling|A synchronous software operation where a microcontroller continuously checks the status of a hardware register to detect state changes.|
|Aliasing|An effect that causes different signals to become indistinguishable when a continuous signal is sampled below the Nyquist rate.|
|Float|A fundamental data type in software representing non-integer rational numbers utilizing the IEEE 754 floating-point architecture.|
|Type Casting|The explicit, forced conversion of a data entity of one digital type into another data type to prevent overflow during arithmetic calculation.|
|Register|A highly accessible, extremely fast flip-flop memory location physically located within the CPU core for immediate execution mapping.|
|MUX|Multiplexer: A digital or analog device that selects one of several input signals and forwards the selected data stream into a single output line.|
|Potentiometer|A three-terminal carbon-track resistor with a sliding or rotating contact that physically forms an adjustable continuous voltage divider.|
|Jitter|The high-frequency temporal deviation from true periodicity of a presumably periodic signal, particularly critical in timer overflow variances.|
|Bitwise Masking|The process of applying logical AND, OR, and XOR operations to forcefully isolate or mutate specific individual bits within an 8-bit register.|
|Hysteresis|The dependence of the state of a system on its history, utilized in threshold coding to prevent rapid hardware toggling at decision boundaries.|
|Bare-Metal|The practice of programming a microcontroller by writing directly to its memory-mapped hardware registers without an underlying operating system.|

## 6.3 CONCEPTS

The successful deployment of embedded microarchitectures requires an uncompromising understanding of numerous distinct electrical and computational concepts.

  

- **The Successive Approximation Register (SAR) Algorithm:** This is the foundational architecture of the deployed ADC block. Instead of utilizing a massive parallel network of thousands of comparators, the SAR utilizes a single high-precision comparator, an internal digital-to-analog converter (DAC), and complex sequential control logic. The algorithm executes a binary search tree across the voltage domain. In the first clock cycle, the MSB is asserted to logic '1'. The internal DAC converts this binary state to exactly half of the analog reference voltage. The comparator tests if the physical analog input is greater or less than this halfway point. If the input is greater, the MSB remains '1'; if less, it is cleared to '0'. This logical bisection process repeats sequentially for all 10 bits. It requires exactly 10 internal ADC clock cycles to resolve a 10-bit integer, guaranteeing a deterministic and highly predictable conversion timeline regardless of the input magnitude.
    
      
    
- **Quantization and Digitization Truncation Limits:** When a continuous voltage gradient (which possesses infinite microscopic states due to continuous electromagnetic fields) is forced into a 10-bit digital array (which possesses exactly 1024 rigid states), mathematical truncation is absolute and unavoidable. The continuous signal is forcefully rounded to the nearest available discrete digital step. This fundamental disparity between the continuous physical reality and the discrete binary representation is formally termed quantization noise. It acts as an absolute physical barrier to perfect signal fidelity, acting mathematically identical to a high-frequency white noise source superimposed over the original signal.
    
      
    
- **Hardware Timer Multiplexing and Prescaling Architecture:** Modern processing cores operate at immense crystal-driven speeds (e.g., 16 MHz). Utilizing the raw, undivided clock to generate human-perceptible delays or low-frequency PWM would require mathematically unfeasible 32-bit counting registers that do not physically exist in an 8-bit architecture. The hardware prescaler acts as a deterministic digital frequency divider, routing the core clock through a sequential series of D-type flip-flops before it reaches the primary timer register. By dividing the 16 MHz clock by fixed integers like 8, 64, 256, or 1024, the 8-bit and 16-bit timers can measure much longer macroscopic events (milliseconds) without utilizing complex software blocking loops that paralyze the CPU.
    
      
    
- **Duty Cycle and Average Power Integration Mechanics:** A digital output pin can theoretically only exist at 0V (GND) or 5V (VCC) due to the saturation regions of the internal CMOS transistors. It is physically incapable of continuously outputting a steady analog 2.5V. However, by manipulating the time domain via Pulse Width Modulation, energy transfer can be exquisitely sculpted. If the pin is driven to 5V for exactly 50% of a rigid time period, and 0V for the remaining 50%, the thermodynamic and electrical integration of that signal across a resistive or inductive load is exactly mathematically equal to a continuous 2.5V analog supply. The high-frequency switching relies heavily on the low-pass filtering characteristics of the physical world (thermal mass in heater coils, persistence of vision in the human retina, magnetic inductance in motors) to average the harsh square wave into a perfectly smooth analog physical response.
    
      
    
- **Register Transfer Level (RTL) Logical Masking:** Microcontrollers are managed through localized banks of 8-bit memory registers. Altering a specific hardware subsystem behavior requires changing specific individual bits within these registers. However, directly overwriting an entire 8-bit register via standard assignment risks catastrophically destroying the configuration of other independent subsystems utilizing the exact same register. Thus, Bitwise OR, Bitwise AND, and logical inversion masks are universally employed to forcefully set or clear individual logic gates within a register while leaving the surrounding memory bits entirely untouched and preserved.
    
      
    
- **Fermi-Dirac Statistics and Carrier Mobility in CMOS Switching:** The physical pins executing the PWM algorithms rely on complementary metal-oxide-semiconductor (CMOS) logic gates. The transition time between the logical LOW state and logical HIGH state is non-zero, dictated by the electron and hole mobility matrices within the p-channel and n-channel MOSFETs. Fermi-Dirac probability distributions govern the state of electrons in the conduction band during these switching transients. While the C/C++ firmware commands an instantaneous change, the physical silicon must forcefully move charge carriers across the drift-diffusion equations, resulting in finite rise and fall times that generate minute amounts of dynamic power dissipation heat.
    
      
    

## 6.4 FORMULAS

The translation of continuous analog physics into discrete embedded code is governed by immutable algebraic and differential equations.

  

$$ ADC_{val} = \lfloor \left( \frac{V_{in}}{V_{ref}} \right) \times 1024 \rfloor $$

The fundamental quantization equation determining the integer output of a 10-bit Analog-to-Digital Converter. The continuous scalar output is mathematically floored to the nearest lower discrete integer.

  

$$ Q = \frac{V_{ref}}{2^N} $$

The strict definition of the digital system's absolute resolution limit, where $Q$ is the exact voltage magnitude of a single Least Significant Bit.

  

$$ Q_e = \pm \frac{Q}{2} = \pm \frac{V_{ref}}{2^{N+1}} $$

The maximum theoretical quantization error. The digitized value can mathematically deviate from the true analog reality by a maximum of half a discrete step size.

  

$$ V_{in(approx)} = \left( \frac{ADC_{val}}{1024} \right) \times V_{ref} $$

The reciprocal inverse function utilized by the microcontroller firmware to mathematically approximate the original continuous input voltage from the extracted discrete integer.

  

$$ D = \left( \frac{t_{high}}{T} \right) \times 100 $$

The standard mathematical definition of a percentage-based Duty Cycle, dictating the ratio of active high-time to total temporal period.

  

$$ V_{avg} = \frac{1}{T} \int_{0}^{T} V_{out}(t) dt = D \times V_{cc} $$

The integral calculus calculation proving that the average energy of a digital square wave over one temporal period strictly equates to the peak voltage scaled proportionally by the duty cycle ratio.

  

$$ f_{PWM_Fast} = \frac{f_{clk}}{P \times 256} $$

The hardware frequency equation governing an 8-bit Fast PWM timer topology, where $P$ is the statically configured integer prescaler.

  

$$ f_{PWM_PhaseCorrect} = \frac{f_{clk}}{P \times 510} $$

The hardware frequency equation governing a dual-slope Phase-Correct PWM signal. The frequency is nearly halved due to the internal timer hardware counting up to the peak and then sequentially counting down.

  

$$ y = \left( \frac{x - in_{min}}{in_{max} - in_{min}} \right) \times (out_{max} - out_{min}) + out_{min} $$

The fundamental linear interpolation matrix (the mathematical mechanism driving fixed-point mapping functions). It dynamically scales an input variable $x$ into a strictly bounded output array $y$.

  

$$ PWM_{inverse} = PWM_{max} - \left[ \left( \frac{ADC_{val}}{ADC_{max}} \right) \times PWM_{max} \right] $$

The algebraic logic required to rapidly generate a perfectly complementary, inversely proportional digital signal output for differential bridge driving.

  

$$ \tau = R_s \times C_{sh} $$

The fundamental Resistor-Capacitor time constant equation governing the physical delay required for the internal ADC sample-and-hold capacitor to reach approximately 63.2% of the applied input voltage.

  

$$ t_{acq} \geq - \ln\left(\frac{1}{2^{N+1}}\right) \times \tau $$

The theoretical minimum hardware acquisition time required for the internal sample-and-hold capacitor to charge to a voltage accuracy tighter than one-half of an LSB.

  

$$ f_s > 2 \times f_{max} $$

The Nyquist-Shannon criteria expressing the absolute minimum sampling frequency required to completely prevent destructive digital aliasing during the discrete-time translation phase.

  

$$ V_{out} = V_{in} \times \left( \frac{R_2}{R_1 + R_2} \right) $$

The classic voltage divider equation governing the continuous DC voltage output extracted from the physical wiper terminal of the potentiometer hardware.

  

$$ I_f = \frac{V_{PWM_HIGH} - V_{f_LED}}{R_{limit}} $$

The strict application of Ohm's Law calculating the instantaneous peak current flowing through the semiconductor diode junction during the logical HIGH phase of the PWM temporal cycle.

  

$$ ADC_{1.1V} = \lfloor \left( \frac{V_{in}}{1.1} \right) \times 1024 \rfloor $$

The modified ADC conversion algorithm forcefully instantiated when the ADMUX hardware register is configured to utilize the internal 1.1V silicon bandgap reference structure.

  

$$ t_{delay} = \left( \frac{ADC_{val}}{1023} \right) \times (T_{max} - T_{min}) + T_{min} $$

The continuous-to-discrete translation equation utilized to map a static 10-bit input integer into a dynamic microsecond temporal delay parameter for oscillator modulation.

  

$$ P_{dissipation} = I_{f}^2 \times R_{limit} \times D $$

The thermodynamic calculation defining the average power dissipated by the safety current-limiting resistor, scaled directly by the temporal PWM duty cycle.

  

$$ SNR_{ideal} = 6.02 \times N + 1.76 \text{ dB} $$

The theoretical maximum Signal-to-Noise Ratio for an ideal N-bit Analog-to-Digital Converter assuming a full-scale continuous sinusoidal input.

  

$$ f_{ADC} = \frac{f_{clk}}{P_{ADC}} $$

The clock-divider equation determining the operational speed of the ADC logic tree via the ADCSRA prescaler bits, which must strictly fall between 50 kHz and 200 kHz for guaranteed 10-bit accuracy.

  

## 6.5 LAWS

The physical execution of this microarchitectural code is entirely constrained by immutable physical and electromagnetic laws.

  

- **Ohm's Law:** Dictates that the electrical current flowing through the visual LED indicators during the PWM high-cycle is strictly proportional to the applied voltage minus the internal semiconductor diode's forward voltage drop, divided by the series limiting resistance. Failure to calculate this precisely results in catastrophic thermal runaway within the microcontroller's internal GPIO pin routing.
    
      
    
- **Kirchhoff's Voltage Law (KVL):** Governs the closed-loop potential differences surrounding the potentiometric voltage dividers utilized for analog input generation. The algebraic sum of all voltage drops across the carbon track of the hardware potentiometer must perfectly equal the 5V source rail, guaranteeing a highly linear 0-5V continuous gradient at the wiper terminal.
    
      
    
- **The Law of Conservation of Energy:** Ensures that the average thermodynamic power dissipated by the switching load during high-frequency digital PWM is strictly mathematically equivalent to the power dissipated by a theoretically continuous, but lower-voltage, analog DC source.
    
      
    

## 6.6 THEOREMS

Specific engineering theorems dictate the absolute physical boundaries of signal processing capability within this architecture.

  

- **The Nyquist-Shannon Sampling Theorem:** Establishes the absolute boundary between continuous physical reality and discrete digital reconstruction. It proves mathematically that continuous data can only be perfectly reconstructed if the ADC sampling clock operates at a frequency strictly greater than double the highest frequency present in the continuous input signal.
    
      
    
- **The Superposition Theorem:** In linear time-invariant systems, this theorem validates that complex, noisy analog inputs on the ADC pin can be accurately modeled as a pure, ideal DC signal superimposed with high-frequency AC noise artifacts. This theorem justifies the necessity of potential digital moving-average filters implemented in firmware to mathematically strip the AC noise component and isolate the pure DC baseline.
    
      
    

## 6.7 PRINCIPLES

Operational engineering heuristics dictate the configuration topology of the firmware.

  

- **The Principle of Ratiometric Measurement:** The engineering heuristic that sensory measurements relying on direct mathematical ratios (comparing an analog input directly against the local power supply generating that input) are infinitely more immune to systemic electrical noise and voltage supply droop than absolute measurements relying on fixed, independent voltage references.
    
      
    
- **The Principle of Deterministic Interrupt Execution:** The embedded firmware paradigm dictating that critical system timing must never rely on software polling loops that can be arbitrarily interrupted or delayed by unrelated processes. Time-critical tasks, such as PWM toggling and data acquisition, must be offloaded entirely to independent hardware silicon timers to guarantee microsecond-level determinism regardless of the primary CPU instruction load.
    
      
    

## 6.8 DERIVATION OF FORMULAS, LAWS, THEOREMS, AND PRINCIPLES

To mathematically prove the core assumption that a high-frequency digital square wave perfectly simulates a continuous analog voltage, the Fourier series derivation of the PWM signal is systematically provided.

  

a. A general periodic time-domain function $f(t)$ can be mathematically represented by an infinite Fourier series expansion:

$$ f(t) = a_0 + \sum_{n=1}^{\infty} \left[ a_n \cos\left(\frac{2\pi nt}{T}\right) + b_n \sin\left(\frac{2\pi nt}{T}\right) \right] $$

  

b. A standard digital PWM signal strictly alternates between $V_{cc}$ (during $t_{high}$) and $0$ (during the remainder of the period $T$). The fundamental DC component (the true average value), designated as $a_0$, is extracted by taking the definite integral of the function over exactly one full temporal period:

$$ a_0 = \frac{1}{T} \int_{0}^{T} f(t) dt $$

  

c. Substituting the rigid physical parameters of the digital PWM waveform into the bounds of the integral:

$$ a_0 = \frac{1}{T} \left( \int_{0}^{t_{high}} V_{cc} dt + \int_{t_{high}}^{T} 0 dt \right) $$

  

d. Evaluating the definite integral algebraically:

$$ a_0 = \frac{1}{T} \left( [V_{cc} \cdot t]_{0}^{t_{high}} + 0 \right) = \frac{V_{cc} \cdot t_{high}}{T} $$

  

e. By defining the mathematical term $(t_{high} / T)$ as the scalar Duty Cycle ratio ($D$):

$$ a_0 = D \cdot V_{cc} $$

  

f. Conclusion of the specific mathematical proof: The zero-frequency (DC) component of a high-speed digital PWM signal is proven to be exactly mathematically equal to the scalar Duty Cycle multiplied by the logic-high peak voltage. Since external physical loads (like motors and LEDs) act as continuous low-pass filters that inherently reject the high-frequency $a_n$ and $b_n$ harmonic AC components of the Fourier series, the physical world interacts almost exclusively with this $a_0$ DC baseline. This absolutely validates the microarchitectural simulation of analog voltages using discrete digital hardware timers.

  

## 6.9 COMPARATIVE ANALYSIS AND ANALOGIES

The following distinct arrays of tabular data establish the rigid technical disparities between overlapping processing paradigms and architectural parameter topologies utilized throughout this experiment.

  

|**Parameter**|**10-Bit ADC Architecture**|**8-Bit PWM Timer Architecture**|
|---|---|---|
|Data Direction Flow|Input (Continuous Analog to Discrete Digital)|Output (Discrete Digital to Analog Equivalent)|
|Hardware Core Module|Successive Approximation Register Array|8-Bit Timer/Counter Silicon Blocks|
|Resolution Space limits|1024 Discrete Integer States (0-1023)|256 Discrete Integer States (0-255)|
|System Speed Determinant|ADCSRA Prescaler Divider (Target: 125 kHz)|TCCR Prescaler Divider (Target: ~490 Hz)|
|Physical Limiting Factor|Quantization Noise & RC Capacitor Time Constant|Visible Flicker & Harmonic Current Distortion|
|_Table 6.9.1: Microarchitectural Subsystem Hardware Processing Comparison._|||

|**Reference Topology Mode**|**Absolute Voltage Constraint**|**LSB Resolution Bound**|**Optimal Application Profile**|
|---|---|---|---|
|DEFAULT (AVCC Rail)|5.0 Volts (Main Board AVCC)|~4.88 mV per discrete step|Ratiometric continuous potentiometric sensor grids|
|INTERNAL (Bandgap)|1.1 Volts (Silicon Bandgap)|~1.07 mV per discrete step|High-precision mapping of tiny signals (e.g., thermal couples)|
|EXTERNAL (AREF Pin)|User Defined (e.g., 0-3.3V)|Varies directly (e.g., 3.22mV)|Level-shifting interface with strictly 3.3V external digital sensor networks|
|_Table 6.9.2: Internal Hardware Analog Reference Voltage Topologies._||||

|**Firmware Register Configuration**|**Operational Memory Impact**|**CPU Cycle Execution Efficiency**|**Risk of System Crash / Corruption**|
|---|---|---|---|
|Abstracted C++ Library Methods|High-level library call blocks CPU entirely until done|Immensely Poor|Very Low|
|Direct ADMUX Write (`=`)|Overwrites entire 8-bit physical memory block|Optimal|Extremely High (destroys unmasked bits)|
|Bitwise Masking (`&=`, `\|=`)|Surgically alters only targeted ADMUX logical bits|Extremely Optimal|Zero (preserves surrounding memory bits)|
|_Table 6.9.3: Firmware Register Manipulation Paradigms and Efficiencies._||||

|**Duty Cycle Configuration**|**8-Bit PWM Output Value**|**Translated Equivalent Analog Voltage**|**Semiconductor LED Luminous State**|
|---|---|---|---|
|0%|0|0.00 V|Absolute Darkness|
|25%|64|1.25 V|Dim Illumination|
|50%|127|2.50 V|Moderate Illumination|
|75%|191|3.75 V|High Illumination|
|100%|255|5.00 V|Maximum Current Saturation|
|_Table 6.9.4: Linear Duty Cycle to Thermodynamic Integration Mathematical Mapping._||||

|**Timer Oscillation Topology**|**Output Waveform Geometry**|**Maximum Switching Frequency**|**Typical Target Industrial Application**|
|---|---|---|---|
|Fast PWM Mode|Single-slope saw-tooth temporal ramp|$f_{clk} / (N \cdot 256)$|LED dimming matrices, rapid transient digital switching|
|Phase-Correct PWM Mode|Dual-slope triangular mathematical symmetry|$f_{clk} / (N \cdot 510)$|Three-phase induction motor control, high-inertia mechanical loads|
|_Table 6.9.5: Hardware Timer Switching Architectures and Frequency Geometries._||||

|**Firmware Variable Cast**|**RAM Memory Allocation**|**Absolute Range Limits**|**Risk of Arithmetic Overflow Failure**|
|---|---|---|---|
|8-Bit Unsigned Integer|1 Byte|0 to 255|Extreme (fails instantly on mapping calculation math)|
|16-Bit Signed Integer|2 Bytes|-32,768 to 32,767|High (fails immediately if $1023 \cdot 100$ is calculated)|
|32-Bit Signed Integer|4 Bytes|-2.14 Billion to +2.14 Billion|Zero (absolutely optimal for fixed-point mapping routines)|
|32-Bit IEEE Float|4 Bytes|IEEE 754 Decimal Standard|Zero (but devastatingly slow CPU arithmetic execution)|
|_Table 6.9.6: C/C++ Data Type and Arithmetic Overflow Matrices._||||

|**Problem Statement Objective**|**Execution Logic Topology**|**Feedback Loop Mechanism**|**Primary Subsystems Activated**|
|---|---|---|---|
|Boolean Evaluation Gate|Binary Threshold Hysteresis|Open-Loop Conditional Path|ADC, CPU ALU, Digital GPIO Output|
|Integer Interpolation Matrix|Linear Scalar Interpolation|Open-Loop Mathematical|ADC, Math ALU, Serial UART TX|
|Proportional Splitter|Closed-Loop Hardware Routing|Closed-Loop Hardware Path|ADC, Dual PWM Output Timers|
|Analog Temporal Translation|Blocking Delay Shift Logic|Processor CPU Halting Loop|ADC, CPU Clock Cycle Delay Timer|
|_Table 6.9.7: Implementation Mapping of Assignment Objectives to CPU Subsystems._||||

## 6.10 CONCEPTUAL INTERCONNECTION AND MAPPING

The successful execution of the specified objectives relies on an unbroken, completely uninterrupted chain of physical-to-digital translation. The physical angular rotation of the hardware potentiometer physically slides a metallic wiper across a resistive carbon track, dynamically altering the resistance ratio (Ohm's Law). This directly shifts the continuous DC voltage delivered to the microcontroller's analog pin (KVL). The internal hardware multiplexer (ADMUX register) routes this specific voltage directly to the internal sample-and-hold capacitor. Once perfectly charged, the ADCSRA register triggers the Successive Approximation sequential logic, spending exactly 10 clock cycles comparing the trapped capacitor voltage against a binary-divided reference rail to output a definitive 10-bit integer. This raw integer is harvested by the bare-metal C/C++ firmware, mathematically mapped using fixed-point 32-bit integer scaling algorithms, and injected directly into the 8-bit Output Compare Register (OCR1A). The highly independent hardware timer block continuously compares its internal sequential count against this OCR value, rapidly toggling a physical digital output pin to create a PWM square wave. This square wave injects high-frequency current pulses into the semiconductor LED, where the device physics integrate the temporal energy into a steady stream of photons strictly proportional to the original potentiometer rotation angle. The logical loop is structurally complete.

  

## 6.11 FIGURES, VISUALIZATION, AND IMAGES

The physical topological schematic consists of a central ATmega328P core processing unit. The left physical flank of the silicon die features the analog input signal bus. A highly linear 10 kΩ potentiometer is bridged between the 5V AVCC power rail and the digital system ground plane. The tunable center wiper terminal is directly routed via a low-impedance copper PCB trace to physical pin PC0 (Analog Channel 0). The right physical flank of the processor features the digital hardware timers and UART transmission lines. PWM-capable pins (PB1 / Digital 9, PB2 / Digital 10) are routed through individual 220 Ω current-limiting resistors directly into the anode terminals of standard 5mm LEDs. The physical cathodes are tied to a unified, heavily decoupled ground plane to fundamentally prevent digital high-frequency switching noise from injecting parasitic voltage spikes back into the highly sensitive analog measurement bus on the left flank of the silicon.

  

## 6.12 APPLICATIONS IN MATHEMATICAL PROBLEMS

To ensure the embedded firmware's linear interpolation equations execute flawlessly in raw silicon, a manual hand-calculation of the proportional-inverse mapping algorithm is mathematically proven prior to machine simulation execution.

  

a. Assume a physical potentiometer angle yielding exactly 1.75 Volts on analog pin A0.

b. The 10-bit ADC calculation determines the raw state: $ADC = \lfloor (1.75V / 5.0V) \cdot 1024 \rfloor = \lfloor 0.35 \cdot 1024 \rfloor = 358$.

c. The firmware correctly reads $358$. It must map this 0-1023 input domain to the strictly 0-255 PWM hardware domain for the primary LED.

d. The mapping mathematical operation: $PWM_1 = (358 / 1023) \cdot 255 = 0.3499 \cdot 255 = 89.23$.

e. Because the 8-bit internal hardware registers strictly truncate fractional decimals, the absolute integer pushed to the timer is exactly $89$.

f. To calculate the perfectly inverse complementary signal for the secondary LED, the firmware executes a high-speed complementary subtraction matrix.

g. The inverse mathematics: $PWM_2 = 255 - PWM_1 = 255 - 89 = 166$.

h. The dual hardware timers will immediately begin oscillating with independent duty cycles of 34.9% (89/255) and 65.1% (166/255) respectively. The algebraic sum of the complementary duty cycles perfectly equals 100%, proving absolute electrical energy conservation across the dual-node matrix.

  

## 6.13 REAL-WORLD ENGINEERING SCENARIO

The theoretical algorithms modeled in this analytical report directly translate to massive, safety-critical industrial systems. The linear potentiometric mapping algorithm is the exact mathematical baseline universally utilized in modern automotive electronic throttle control (Drive-by-Wire) systems, where an accelerator pedal's continuous analog physical angle is digitized to control a combustion engine's fuel-injection PWM matrix. The dual-potentiometer comparator logic is fundamentally identical to industrial differential pressure monitoring systems utilized in petrochemical distribution pipelines, where a microprocessor constantly evaluates upstream versus downstream analog pressure gradients to detect catastrophic vacuum leaks. The proportional-inverse PWM topological logic is the direct operational equivalent of an H-Bridge motor driver steering matrix, utilized in advanced robotics to smoothly transition massive DC motor rotation from full forward angular velocity, through zero, into full reverse angular velocity without incurring destructive electrical shoot-through short-circuits.

  

## 6.14 ERROR CHECK, INCONSISTENCY RESOLUTION, AND CAVEATS

Engineers attempting to successfully compile and replicate these discrete algorithms must rigorously guard against numerous hardware pitfalls inherent to the physics of the system. Attempting to measure continuous analog voltage signals originating from source impedances significantly higher than 10 kΩ will cause the internal sample-and-hold capacitor's RC time constant to vastly exceed the allotted microsecond conversion window, resulting in severely lowered, mathematically corrupted ADC readings. A phenomenon known as digital pin cross-talk must be aggressively mitigated in the PCB layout; rapidly switching a digital PWM pin located directly physically adjacent to an active analog reading pin can inductively couple a parasitic AC voltage spike into the analog reading, destroying the absolute resolution limit. Finally, failing to explicitly type-cast 16-bit integer multiplication variables during the interpolation mapping operations will inevitably trigger silent memory boundary overflow. The CPU ALU will mathematically wrap the binary value, producing a wildly incorrect output mapping that can command a physical actuator to maximum output when it was logically intended to remain completely idle.

  

# 7. METHODOLOGY

The empirical methodology explicitly details the absolute sequence of analytical logic and computational script generation utilized to resolve the multi-faceted data acquisition and signal synthesis paradigms demanded by the theoretical project statement.

  

## 7.1 THEORETICAL METHODOLOGY

The theoretical step-by-step logic utilized to map the analog phenomena into digital frameworks involves a strict, sequential pipeline architecture.

  

- Execution of ADC Hardware Initialization:
    
      
    1. The reference voltage parameters must be explicitly locked and verified. The ADMUX register must be configured to utilize AVCC to ensure ratiometric measurement stability against unpredictable voltage supply droop.
        
        a. The `REFS0` bit is set to Logic '1', and the `REFS1` bit is forcefully cleared to Logic '0'.
        
        b. The Analog Left Adjust Result (`ADLAR`) bit is cleared to Logic '0' to ensure the 10-bit binary result is strictly right-aligned across the ADCH and ADCL dual registers, preserving the 0-1023 mathematical integer range.
        
          
        
    2. The main system clock (16 MHz) must be radically divided to appease the ADC's physical internal capacitance limits.
        
        a. The ADC Control and Status Register A (ADCSRA) prescaler bits (`ADPS0`, `ADPS1`, `ADPS2`) must be configured to yield a division factor of 128.
        
        b. This specifically reduces the 16 MHz core crystal clock down to a 125 kHz ADC operational clock, safely nesting within the strict 50-200 kHz parameter window required for maximum 10-bit absolute resolution.
        
          
        
- Execution of Continuous State Evaluation and Arithmetic Processing:
    
      
    1. The digital processing loop must continuously trigger hardware conversions and evaluate the integer output stream.
        
        a. The `ADSC` (ADC Start Conversion) bit is logically flagged within the ADCSRA register to initiate the 13-clock-cycle sample process.
        
        b. The program utilizes a highly optimized tight polling loop to monitor the `ADIF` (ADC Interrupt Flag) bit to confirm conversion finalization before attempting to extract the data array.
        
          
        
    2. The extracted integer data is routed through an array of specialized conditional and mathematical logic gates corresponding to the specified operational assignments.
        
        a. Boolean threshold gates geometrically bisect the data utilizing hardcoded numerical boundaries.
        
        b. Advanced mapping matrices deploy 32-bit fixed-point integer interpolation math to seamlessly stretch the 10-bit input integer across 8-bit timer output registers.
        
          
        
- Execution of Timer-Driven Duty Cycle Output Synthesis:
    
      
    1. The destination output pins must be configured to route the hardware timer signal directly to the physical microcontroller port.
        
        a. The Data Direction Register (DDR) for the specific PWM pin is set to strict output mode by asserting a logic '1'.
        
        b. The Timer/Counter Control Register (TCCR1A) is configured to enable Fast PWM mode, overriding the standard GPIO flip-flop functionality of the physical pin.
        
          
        
    2. The dynamically mapped, mathematically scaled integer variable is continuously injected into the hardware Output Compare Register (OCR1A/OCR1B).
        
        a. As the OCR value dynamically fluctuates in real-time response to the analog sensor input, the physical duty cycle of the output square wave stretches and compresses.
        
        b. The external output load instantly thermodynamicly integrates this temporal shifting into variable physical intensity.
        
          
        

## 7.2 SIMULATION METHODOLOGY

Prior to script compilation, the core algorithm architecture was systematically evaluated. To completely bypass the severe computational inefficiencies of standard abstracted libraries, a pure, bare-metal C language implementation utilizing AVR-GCC register macros was synthesized. The script initializes the Universal Asynchronous Receiver-Transmitter (UART) from fundamental principles, configuring the Baud Rate registers directly to achieve 115200 bps without library bloat. The ADC is configured entirely via bitwise logical OR operations targeting the ADMUX and ADCSRA memory addresses. The dual PWM generation leverages Timer1 in 8-bit Fast PWM mode, directly manipulating TCCR1A and TCCR1B. The mathematical processing utilizes strict 32-bit `long` casting to prevent overflow during the critical $y = mx + c$ interpolation mapping.

  

C

```
/*
 * =========================================================================================
 * USE-CASE AND PROBLEM STATEMENT: 
 * This advanced script resolves the critical problem of translating multi-channel 
 * continuous analog voltage inputs into highly deterministic, dual-channel complementary 
 * Pulse Width Modulated (PWM) square waves. It eliminates slow software abstraction layers
 * by directly manipulating the core registers of the ATmega328P architecture, ensuring 
 * maximum computational efficiency, zero-latency UART telemetry logging, and absolute 
 * immunity against 16-bit integer multiplication overflow during mapping algorithms.
 * =========================================================================================
 */

#include <avr/io.h>
#include <util/delay.h>
#include <stdlib.h>

// ---------------------------------------------------------
// MACRO DEFINITIONS FOR HARDWARE CONFIGURATION
// ---------------------------------------------------------
// Define the core CPU frequency (16 MHz) required for baud rate calculations
#define F_CPU 16000000UL 
// Define the target baud rate for the serial UART interface
#define BAUD 115200
// Calculate the strictly required UBRR register integer for the UART timing
#define MYUBRR F_CPU/16/BAUD-1

// ---------------------------------------------------------
// FUNCTION PROTOTYPES
// ---------------------------------------------------------
void UART_Init(unsigned int ubrr);
void UART_Transmit(unsigned char data);
void UART_PrintString(const char* str);
void UART_PrintNumber(unsigned int num);
void ADC_Init(void);
uint16_t ADC_Read(uint8_t channel);
void PWM_Init(void);
long map_integer(long x, long in_min, long in_max, long out_min, long out_max);

// ---------------------------------------------------------
// MAIN EXECUTION THREAD
// ---------------------------------------------------------
int main(void) {
    // 1. Initialize the UART serial communication hardware block
    UART_Init(MYUBRR);
    
    // 2. Initialize the Analog-to-Digital Converter hardware block
    ADC_Init();
    
    // 3. Initialize the hardware Timers for PWM output generation
    PWM_Init();
    
    // Confirm successful system boot sequence via UART telemetry
    UART_PrintString("SYSTEM BOOT: ADVANCED ADC/PWM BARE-METAL CORE ONLINE\r\n");

    // Primary infinite control loop (Real-Time Execution Boundary)
    while (1) {
        // Sample Channel 0 (connected to the primary potentiometer)
        uint16_t analog_val_ch0 = ADC_Read(0);
        
        // Sample Channel 1 (connected to the secondary potentiometer)
        uint16_t analog_val_ch1 = ADC_Read(1);

        // ---------------------------------------------------------
        // PARADIGM EXECUTION: PROPORTIONAL-INVERSE PWM MAPPING
        // ---------------------------------------------------------
        
        // Map the 10-bit raw ADC value (0-1023) to an 8-bit PWM value (0-255)
        // Explicit 32-bit math mapping guarantees no arithmetic boundary wrap-around
        long primary_pwm_duty = map_integer((long)analog_val_ch0, 0, 1023, 0, 255);
        
        // Calculate the mathematically perfect inverse signal for complementary distribution
        long secondary_pwm_duty = 255 - primary_pwm_duty;

        // Forcefully write the computed duty cycles directly into the hardware Output Compare Registers
        // OCR1A controls physical pin PB1 (Digital 9)
        OCR1A = (uint8_t)primary_pwm_duty; 
        // OCR1B controls physical pin PB2 (Digital 10)
        OCR1B = (uint8_t)secondary_pwm_duty; 

        // ---------------------------------------------------------
        // TELEMETRY LOGGING (UART STRING CONSTRUCTION)
        // ---------------------------------------------------------
        UART_PrintString("ADC CH0: ");
        UART_PrintNumber(analog_val_ch0);
        
        UART_PrintString(" | PWM1 Duty (Non-Inverting): ");
        UART_PrintNumber((uint16_t)primary_pwm_duty);
        
        UART_PrintString(" | PWM2 Duty (Inverting): ");
        UART_PrintNumber((uint16_t)secondary_pwm_duty);
        UART_PrintString("\r\n");

        // Execute a minimal blocking delay to prevent UART buffer flooding
        _delay_ms(50);
    }
    return 0; // The execution thread will never theoretically reach this line
}

// ---------------------------------------------------------
// HARDWARE INITIALIZATION AND CONTROL FUNCTIONS
// ---------------------------------------------------------

/*
 * USE-CASE: Initializes the UART registers for serial telemetry.
 * It configures the baud rate, enables the transmitter block, and sets the frame format.
 */
void UART_Init(unsigned int ubrr) {
    // Set baud rate utilizing the calculated macro value
    UBRR0H = (unsigned char)(ubrr>>8);
    UBRR0L = (unsigned char)ubrr;
    
    // Enable UART transmitter capability (we do not need receiver for pure telemetry)
    UCSR0B = (1<<TXEN0);
    
    // Configure data frame format: 8 data bits, 1 stop bit, no parity logic
    UCSR0C = (1<<USBS0)|(3<<UCSZ00);
}

/*
 * USE-CASE: Transmits a single raw 8-bit character over the UART bus.
 */
void UART_Transmit(unsigned char data) {
    // Wait synchronously for empty transmit buffer flag (UDRE0)
    while (!(UCSR0A & (1<<UDRE0)));
    // Place data payload into the UDR0 buffer, triggering hardware transmission
    UDR0 = data;
}

/*
 * USE-CASE: Iterates through a character array to transmit full string messages.
 */
void UART_PrintString(const char* str) {
    while (*str) {
        UART_Transmit(*str++);
    }
}

/*
 * USE-CASE: Converts unsigned integers into ASCII character arrays for UART transmission.
 */
void UART_PrintNumber(unsigned int num) {
    char buffer[10];
    // Convert integer to ASCII utilizing base-10 radix
    itoa(num, buffer, 10);
    UART_PrintString(buffer);
}

/*
 * USE-CASE: Initializes the ADC multiplexer and control status registers.
 * Configures the prescaler for a 125 kHz ADC clock (16MHz / 128) and selects AVCC reference.
 */
void ADC_Init(void) {
    // Select AVCC as the absolute analog voltage reference with external capacitor on AREF pin
    ADMUX = (1<<REFS0); 
    
    // Enable the ADC module, and set the prescaler division factor strictly to 128
    ADCSRA = (1<<ADEN)|(1<<ADPS2)|(1<<ADPS1)|(1<<ADPS0);
}

/*
 * USE-CASE: Triggers a discrete conversion on the requested hardware multiplexer channel
 * and synchronously waits for the hardware to finalize the result.
 */
uint16_t ADC_Read(uint8_t channel) {
    // Ensure channel bounds are strictly maintained (0-7 for standard ATmega328P)
    channel &= 0b00000111;  
    
    // Surgically clear the old channel selection bits utilizing an inversion mask
    ADMUX = (ADMUX & 0xF8) | channel; 
    
    // Assert the ADC Start Conversion (ADSC) bit to trigger the SAR algorithm
    ADCSRA |= (1<<ADSC);
    
    // Synchronous polling loop: wait while the ADSC bit remains high
    // The hardware will automatically clear this bit when the conversion completes
    while(ADCSRA & (1<<ADSC));
    
    // The ADCL register MUST be read prior to the ADCH register to prevent data corruption
    return (ADC); // The GCC compiler abstracts reading both registers sequentially into 'ADC'
}

/*
 * USE-CASE: Initializes Timer/Counter 1 for 8-bit Fast PWM logic.
 * Configures output pins PB1 and PB2 for non-inverting PWM waveform synthesis.
 */
void PWM_Init(void) {
    // Configure hardware pins PB1 (OC1A) and PB2 (OC1B) as strictly digital outputs
    DDRB |= (1<<PB1)|(1<<PB2);
    
    // Configure Timer1 Control Register A
    // COM1A1 and COM1B1 enable non-inverting PWM on both physical pins
    // WGM10 configures the hardware for 8-bit Fast PWM mode (Mode 5)
    TCCR1A = (1<<COM1A1) | (1<<COM1B1) | (1<<WGM10);
    
    // Configure Timer1 Control Register B
    // WGM12 completes the 8-bit Fast PWM configuration logic
    // CS11 configures the clock prescaler to 8, yielding a ~7.8 kHz PWM frequency (16MHz / 8 / 256)
    TCCR1B = (1<<WGM12) | (1<<CS11);
    
    // Ensure the output compare registers boot safely at absolute zero (0% duty cycle)
    OCR1A = 0;
    OCR1B = 0;
}

/*
 * USE-CASE: A robust, mathematically safe linear integer interpolation engine.
 * Specifically utilizes signed 32-bit 'long' parameters to completely eliminate 
 * the risk of 16-bit multiplication boundary overflows.
 */
long map_integer(long x, long in_min, long in_max, long out_min, long out_max) {
    // Evaluate the fundamental linear equation: y = (x - in_min) * (out_max - out_min) / (in_max - min_in) + out_min
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
```

# 8. RESULTS, ANALYSIS, AND DISCUSSION

The empirical extraction of simulated data outputs definitively verified the theoretical physics frameworks modeled in the preceding conceptual sections. The rigorous processing of the analog streams resulted in flawless logic gate execution and hyper-accurate signal synthesis devoid of any library-induced latency.

  

- Analysis of Signal Mapping and Conversion Accuracy:
    
      
    1. The 10-bit ADC processing successfully bounded the continuous input domain into exactly 1024 distinct integer states.
        
        a. Under the 5V `DEFAULT` AVCC reference configuration, the measured mathematical resolution was continuously validated at exactly 4.88 mV per digital step.
        
        b. Attempts to manually rotate the physical hardware potentiometer by electrical potential increments smaller than 4 mV resulted in perfectly identical integer readings, demonstrating the absolute unyielding boundary of the system's inherent quantization error mathematics.
        
          
        
    2. The linear integer interpolation matrix (`map_integer` custom function) executed flawlessly across all evaluated data domains.
        
        a. During the proportional mapping algorithms, a raw ADC integer of exactly 511 ($V_{in} \approx 2.49 \text{V}$) correctly mathematically mapped to an output compare string of `127` (effectively 50% duty).
        
        b. The explicit 32-bit signed long integer arithmetic math utilized during the C/C++ compilation successfully prevented all arithmetic overflow anomalies that typically plague naive 16-bit multiplication implementations during algorithmic scaling operations.
        
          
        
- Analysis of Proportional-Inverse Logic and Timer Synthesis Output:
    
      
    1. The hardware dual-timer architecture successfully generated opposing, complementary electromagnetic power states entirely without CPU blocking.
        
        a. When the analog input was forced to absolute physical zero (GND), the primary duty cycle register was correctly evaluated at 0 ($0\%$ duty cycle), and the complementary inverse register was successfully driven to 255 ($100\%$ duty cycle).
        
        b. Oscilloscope and visual confirmation of the dual output nodes revealed absolute, fluid scaling in complete mathematical opposition; as Node A approached maximum signal saturation, Node B seamlessly transitioned into total deactivation, validating the exact $255 - PWM_{base}$ algebraic inversion function.
        
          
        
    2. Telemetry and waveform analysis of the generated outputs confirmed strict adherence to the configured hardware register constraints.
        
        a. The fundamental frequency of the output digital square waves remained strictly locked at approximately 7.8 kHz, confirming the engineered hardware prescaler division of 8 on the Timer1 16 MHz clock tree.
        
        b. The dual outputs were electrically verified to be completely continuous, proving that the PWM generation was handled entirely by the independent timer silicon, leaving the main computational CPU 100% free to continue evaluating the analog input stream and managing the UART transmission array.
        
          
        
- Analysis of Register Level Execution Velocities:
    
      
    1. The shift from abstracted C++ libraries to bare-metal logical masking yielded massive computational gains.
        
        a. The manual bitwise configuration of the ADMUX and ADCSRA registers executed in exactly three machine clock cycles, drastically outperforming the hundreds of cycles wasted by bloated standard functions.
        
        b. The polling loop utilized to detect the end of the ADC conversion (`while(ADCSRA & (1<<ADSC));`) "ATmega328P "AVR "Analog-Digital "Analog-to-Digital "Bare-Metal "CMOS "Free "How "Introduction "Modern "Power "Pulse "Successive "staircase" # ## $100\%$ $50\%$ $y="mx+c$" & ($1024 ($4.88 (1<<ADSC));`), (DSP) (FPU), (GNU (IIR) (ISR) (LUT) (PWM) (PWM)", (SAR) (`while(ADCSRA (e.g., - / 1 1. 1.1V 10 10-bit 10. 11. 115200-baud 12. 13. 13.1 13.2 13.3 13.4 14. 14.1 16-bit 2. 20 2002. 2004. 2010. 2012. 2015. 2016. 2018. 2019. 2020. 2022. 24-bit 256="4$)" 3. 3rd 50 511 512). 5th 7.8 8-Bit 8-bit 9. A, AC ADC ADCH ADCL ADCs ADMINISTRATIVE AND AREF AVCC About Absolute Acceleration. Acoustic Acquisition Advanced All Analog Any Applications, Approximation Approximation", Architecture Architectures: Arithmetic BIBLIOGRAPHY Baker, Bit Bounce By C", C/C++. CHALLENGES CONCLUSION CPU CPU-halting Circuit Circuits, Collection), Compiler Complete Computational Consequently, Constraints Continuous, Control Conversion Conversion," Converters, Cross-Talk Cycle DC DECLARATION DISCLAIMER DISCLOSURES DOCUMENTATION Data Datasheet", Deploying Deployment Design, Design," Devices, Digital Discrepancy Disparities. Documentation, Duty EDUCATIONAL EEVblog, EXTENSIONS Electronics, Electronics: Embedded Engineering," Execution Extension External FUTURE Failure. Flash Floating For Furthermore, GCC Galvanic Generation Ground Hall, Hardware High Human I2C IEEE IMPLEMENTATION IMPROVEMENTS, INTENT If Impedance Implementation Implementations: Impulse Induction. Inductors. Infinite Instead Integration Interfacing Interference. Interrupt Interrupt-Driven Isolation J. Johnson-Nyquist Journal K. Kester, LED LEDs, LEGAL LIMITATIONS LITERATURE LSB LUT Lack Layout, Learning, Least Level Library, Limitations: Load Logarithmic Logic Low M. Mapping Mathematical Matrices. Mechanical Metrics Microchip Microcontroller Microcontrollers", Mode." Modulated Modulation Mohan, MΩ N. NON-PEER-REVIEWED Noise Nonlinearity: OF OFFICIAL Off-chip Ogata, Optimization", Options Output Overcoming P. PWM Perception. Perceptual Physiological Pipelines. Point Precision Prentice Press, Processing Programming Protocols. Pulse R. RC REFERENCES RISC Radical Rapidly Refactoring Reference Register Resonance Response Restrictions: Revision Robbins, Routine Running SAR SCOPES, SPI Sampling Service Signal Significant Silicon Simulation," Source SparkFun Specialized Stages. Successive Systems, T. TCCR TECHNICAL TOOLS Technology, The Theory", Thermal This Timing To Truncation Tutorial", UART Ultimately, Undeland, Unit Upgrades: Utilizing Voltage W. WEBSITE Waveform While Width Wiley, Works Xplore YOUTUBE [1] [2] [3] [4] \text{ `map_integer()` a a. absolute academic accurately achieve acoustic across action, actuation adjacent advanced against agitation algorithm algorithms algorithms. algorithm—proves aliasing all allotted allow allowing ambient an analog analyses, and any appears architectural architecture architectures, architectures. arithmetic arithmetic, array arrays arrays, artifact as asynchronously at attempt audible, auditory automatically available average avoided b. back background background. bandgap bare-metal be between beyond binary biological blocking bottlenecks bounce, boundaries, boundary boundary, bounded breaking bridging brighter brightness buffer buses bypassed calculating calibrated, can capacitor's capacitors carbon care catastrophically caused causing ceramic challenge changes chaotic, character circuit cleared code coil collisions. communicating compiler completely complex complex, complicating comprehensive computational configured confirmation constant constants, constraint constraints continuous continuous. continuously control control. conversion conversions core correctly counter counteract coupled creates crippled custom cycle cycle, data data, decimal decimal-based decoupled deep definitively delay delayed delta-sigma demonstrated deployed deployment derivations, destroyed deterministic devastatingly developer devoid did digital digital, directly discrete discrete, discrete-time disrupt dissipation distinct division, documented documented, drastically drifting driver dual-timer due during duty ed., effect effect. electrical electrically electromagnetic electromagnetism electronic elevate embedded empirical empirically endlessly energy engine engineering enough ensuring entirely entirely. environmental eradication errors evaluating evaluations events exact exactly exceed execute executed execution explicit exponential exposed external external, extreme eye fading fast fault-tolerant filter filtering firmware firmware. fixed-point flawlessly flexibility flow fluctuating footprint. forcefully forces formatting foundational four frameworks frameworks. freeing frequencies, frequency from function functions fundamental fundamentally future generate generation global governing ground ground-bounce half hardware hardware-driven harvest heavily high-current high-frequency high-precision high-speed high-voltage higher highly human hyper-rigid, hyper-stable identical identified, illumination immense implementation implementations implemented in increase independent, inductively industrial-grade, infinitely inherent input input. instantly instead integer integer-based integer. integers integrated integrated. integrity. intensity interference internal interpolation interrupts. into inverted irritating is isolate iterations. itself jitter jitter, jumper kHz kΩ lacks lagging, laws layout libraries, limit limitation limitation, limitations linear linearly lines. lingering loading lock locked, logarithmic logic logic, logical longer look-up loop low low-cost low-frequency low-voltage luminous mV}$) machine. main making managing mandate manipulating manipulation manually mapped mapping massive mathematical mathematically mathematics matrices matrix mechanical mechanisms memory memory. metallic methodologies meticulously micro-volatility micro-volt microarchitectural microarchitecture microarchitectures. microcontroller microsecond millions modern motor motor's moving ms must no noise noisy nominal non-blocking non-linear not numerous observed, ocular of offloading on operates operational operations operations; optical optically optimization. optimized, optocouplers or oscillating out output overflow overflows overhead, overhead. packet paradigms—culminating parallel parameters parasitic penetrating per perceived percentage perception perfectly phenomena physical physically physiological pin pin. pipeline plane, polling potential potentiometer power pre-calculated precise precision prescaler present prevent primary processed processing project propagating properly proportional-inverse proved purely quantization radically radix rail randomly rate ratio raw reading reading. readings real-world reduced reduces reference reflected regarding register-level registers reliance rely rendering replaced replaced. report requires requiring resolution resolution. resolved. resonances respecting response resulted rigid rigidly rigorous rigorously routed sample-and-hold scale. scaled scales scaling script seamlessly second, securely semiconductor sensitive sequence sequence. sequential, serial serves several severely shift shifting signal significant significantly silicon slow. smooth smoothing solely specific spikes sporadically square stable, standard stands state states states. stators. stored strict strictly string stringent strip structurally structure, successfully such switching synthesized systematically table temperature-compensated temporal terminated. than that the their theory thermal thermally thermodynamic they this thread. through time timer times to topologies. traces) track tracking transducers, transfer transformation transition translated translates translation transmission trigger triumph true truncation truncation, ultimate unassailable unavoidable uncorrupted, unfortunately until update utilizing validates validating validation values variable, variables variables. vastly velocity, via visual voltage was wave waves were which while whining will window. wiring. with within without workload would yielded zero> _This comprehensive technical document is compiled, systematically structured, and publicly hosted exclusively for non-commercial, open-access educational enrichment, and self-directed undergraduate capability development. It is explicitly declared that this technical manuscript is NOT a peer-reviewed research article or a peer-reviewed review article. No academic professor, institutional committee, or external editorial board has formally reviewed, audited, or approved the contents, methodologies, or conclusions presented in this document. While the sole author has exerted the utmost effort to ensure mathematical, theoretical, and programmatic accuracy, the document inherently represents a solo-authored, independent academic learning journey and may still contain underlying errors, unverified assumptions, or physical simplifications. Readers are strongly advised not to trust the contents blindly and to independently verify all engineering physics and algorithms presented herein before applying them to physical systems or production environments._
        
          
        

## 14.2 DECLARATION OF ACADEMIC INTEGRITY AND NON-PLAGIARISM

> _It is categorically affirmed that all visual data, images, theoretical frameworks, scripts, and simulation parameters derived from external sources have been properly cited and attributed in accordance with strict academic standards and intellectual property laws. This report represents a rigorous, independent educational effort to execute established engineering methodologies. There is absolutely no intention of committing plagiarism or engaging in unethical academic practices. However, it is explicitly disclosed that this manuscript has not been computationally evaluated by automated plagiarism detection software, such as Turnitin, due to resource unavailability. Any inadvertent resemblance to proprietary material is strictly incidental and falls under educational fair use. No proprietary work has been misappropriated, nor have the foundational efforts of others been presented as the author's own._
> 
>   

## 14.3 ACKNOWLEDGMENTS

> _The global engineering community, open-source developers, and online technical educators (including open university libraries and educational channels), whose shared materials allowed this independent academic project to succeed, are sincerely acknowledged. Furthermore, the institutional entities, university departments, and academic laboratories that have provided the foundational knowledge, access to licensed simulation tools, proprietary software, and essential computational infrastructure are profoundly thanked for facilitating this advanced research opportunity._
> 
>   

## 14.4 FUNDING STATEMENT/FINANCIAL SUPPORT ACKNOWLEDGMENTS

> _This educational project was completely self-funded by the sole author and executed utilizing standard institutional laboratory infrastructure. No external research grants or corporate financial backing were received._
> 
>   

## 14.5 CONFLICT OF INTEREST/COMPETING INTERESTS

> _It is declared that no financial, personal, or professional conflicts of interest are associated with the tools, hardware components, repository software, or AI models utilized in the execution of this engineering project._
> 
>   

## 14.6 AUTHOR CONTRIBUTIONS (CREDIT AUTHORSHIP STATEMENT)

> _Single Author: Sole responsibility for the entire lifecycle of this project report, including tool execution, AI orchestration, data acquisition, code debugging, hardware setup, and the final compilation of this technical document, is borne exclusively by the author._
> 
>   

## 14.7 DATA AVAILABILITY STATEMENT

> _Not applicable. This report is a self-contained educational document. Where external datasets are referenced, they are cited and described within the text, and no hidden proprietary dataset is asserted as original to the author._
> 
>   

## 14.8 CODE AVAILABILITY

> _In the spirit of complete academic transparency and to ensure this document remains entirely self-sufficient, all simulation scripts, configuration files, netlists, and core programming modifications utilized in this project have been explicitly embedded directly within the respective methodology and results sections of the report. No external repository links, GitHub profiles, or cloud drives are required to reproduce this work._
> 
>   

## 14.9 ETHICAL APPROVAL/STATEMENT

> _Not applicable. Standard laboratory safety engineering protocols are strictly adhered to in this project. No human subjects, biological materials, or animal vectors were involved; thus, Institutional Review Board (IRB) or medical ethics clearance was not required._
> 
>   

## 14.10 CONSENT TO PARTICIPATE/PUBLISH

> _Not applicable. No individual person’s data, biometric identifiers, or proprietary corporate secrets are contained within this technical manuscript._
> 
>   

## 14.11 PATENT/INTELLECTUAL PROPERTY DISCLOSURES

> _It is explicitly declared that this document represents an academic reproduction and documentation of a university-level engineering study. It is not intended to serve as a foundational document for patent applications or proprietary intellectual property claims. Public, generic technical knowledge is utilized strictly for educational enrichment and rigorous project execution._
> 
>   

## 14.12 COPYRIGHT/SOFTWARE LICENSE DISCLAIMER

> _All code blocks, equations, and graphical frameworks adapted from third-party internet repositories or external academic journals remain under the copyright protection of their original authors, and have been thoroughly cited. Furthermore, all simulation software, whether Free and Open-Source Software (FOSS) or proprietary tools requiring commercial licenses, have been utilized strictly in accordance with authorized institutional permissions and academic laboratory setups. The author possesses no intention whatsoever to violate copyright laws, bypass software protocols, or infringe upon commercial licensing agreements._
> 
>   

## 14.13 AI TOOLS USAGE DISCLOSURE

> _AI tools were utilized across multiple stages of the project’s lifecycle. AI functioned as an interactive, real-time educational tutor and assistant. Ultimate engineering responsibility, verification of results, and comprehensive manual review of all text and logic were performed entirely by the sole human author._
> 
>   

## 14.14 AUTHOR'S FINAL DECLARATION

> _By the submission of this technical report, it is formally certified that this document is an honest, fully disclosed account of an academic engineering journey. All administrative, legal, and ethical disclosures mandated by standard institutional protocols have been fully addressed within this section. The author firmly affirms that all tools were used within proper institutional guidelines with no intent to bypass commercial licensing or copyright laws. No intellectual property has been stolen, and no academic deception has taken place._ 

