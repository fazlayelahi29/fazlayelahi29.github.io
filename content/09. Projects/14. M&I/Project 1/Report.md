
# SERVO MOTOR POSITION CONTROLLER AND TESTER USING A 555 TIMER IC BASED CIRCUIT




Course No.: EEE 2212
Course Title: Measurement and Instrumentation Lab.


Experiment No.: Open Ended Lab Project
Experiment Name: Servo Motor Position Controller and Tester using a 555 Timer IC based Circuit

Date of Performance: September 26, 2024 (Thursday) Date of Submission: September 26, 2024 
(Thursday)



Submitted by:

AUST ID: 20220105232, 20220105233, 20220105234,
20220105235, 20220105236

Department: Electrical and Electronic Engineering Program: BSc (Engg.) in EEE
Session: Fall 2023 Year: 2ⁿᵈ Semester: 2ⁿᵈ Section: D
Section Group: D2 Lab Group (Table): 3



**Abstract**—A comprehensive architectural and functional analysis of a servo motor position controller and testing apparatus is presented in this document. The paradigm of open-loop and closed-loop electromechanical actuation is fundamentally dependent upon precise signal modulation, specifically through the generation of high-fidelity Pulse Width Modulated (PWM) waveforms. In this exhaustive investigation, the deployment of a classic 555 Timer Integrated Circuit (IC), specifically the NE555P variant, is leveraged in an astable multivibrator configuration to synthesize deterministic timing pulses required for servomechanism control. The primary performance bottlenecks addressed herein revolve around the precise alteration of duty cycles necessary to command actuator arm displacement, avoiding the utilization of computationally heavy microcontrollers. By synthesizing an analog control network utilizing discrete passive components—namely resistors of 220K, 56K, and 10K, coupled with a 100nF timing capacitor and a 1N4148 PN junction steering diode—a bistate manual interface is successfully established. A thorough examination of the underlying semiconductor physics, device modeling of the 555 timer's internal comparator stages, and the electro-mechanical dynamics of the SG90 servo motor is conducted. Empirical parameters dictate that a 1ms high-state pulse width commands a 0-degree angular position, while a 3ms high-state pulse width commands a 180-degree angular position, with a consistently maintained 18ms low-state interval. Through the actuation of dual momentary push-button switches, discrete resistive pathways are activated, thereby altering the RC time constant of the charge cycle and dynamically shifting the servomotor's mechanical orientation. A strict adherence to operating voltage constraints is observed, noting that the application of 12V to a 5V-rated servo architecture induces instantaneous catastrophic dielectric and thermal failure. Ultimately, this research elucidates the profound efficacy of fundamental analog circuitry in fulfilling complex motion control requirements across vast engineering disciplines, ranging from industrial automation and cyber-physical robotics to medical prosthetics and aerospace communications.

  

**Index Terms**—Astable Multivibrator, Electro-Mechanical Actuation, NE555P Integrated Circuit, Pulse Width Modulation, Semiconductor Device Modeling, Servomechanism Control.

  

# I. INTRODUCTION AND ACADEMIC CONTEXT

The domain of electrical and electronic engineering is heavily predicated upon the seamless integration of solid-state semiconductor devices with dynamic electro-mechanical actuators. A meticulous exploration of a servo motor position controller and tester is documented, originating from an open-ended laboratory project within a Measurement and Instrumentation curriculum. The architectural framework relies upon the venerable 555 Timer IC, a device whose historical significance and enduring utility in modern Very Large Scale Integration (VLSI) contexts cannot be overstated. The fundamental objective of the synthesized circuitry is the generation of control signals requisite for the manual operation and diagnostic testing of servo motors.

  

Through the strategic configuration of the NE555P IC into an astable oscillatory mode, a continuous stream of Pulse Width Modulated (PWM) signals is produced. The utilization of an analog timing circuit for motor control circumvents the necessity for complex digital signal processing algorithms, thereby reducing parasitic latency and offering a highly deterministic control paradigm. An exhaustive analysis of the system requires a deep dive into the underlying physics of the components utilized, including the internal transistor-level mechanics of the timer, the charge-storage dynamics of the capacitive elements, and the electromagnetic torque generation principles inherent to the interconnected servo motor.

  

# II. COMPONENT ACQUISITION AND HARDWARE INVENTORY

The successful realization of the servo motor controller necessitates a highly specific array of active and passive solid-state components. The precise selection of these elements dictates the stability, thermal resilience, and timing accuracy of the generated PWM waveforms.

  
![[Pasted image 20260831183911.png|203]]




![[Pasted image 20260831183949.png|221]]





![[Pasted image 20260831184021.png|229]]







![[Pasted image 20260831184045.png|269]]







![[Pasted image 20260831184115.png|288]]





![[Pasted image 20260831184134.png|348]]



![[Pasted image 20260831184159.png|368]]



![[Pasted image 20260831184232.png|367]]





## _A. Active Semiconductor Devices_

- The primary oscillation engine is established via the NE555P Timer Integrated Circuit.
    
      
    
- A steering mechanism for current flow during the capacitive charge/discharge cycles is facilitated by a singular PN junction diode, specifically the 1N4148 fast-switching model.
    
      
    
- The electro-mechanical transducer utilized for physical output is the SG90 Servo Motor, characterized by its integrated feedback loop and precise angular resolution.
    
      
    

## _B. Passive Components and Interconnects_

- A highly calibrated resistive network is deployed, featuring resistors with impedance values of 220KΩ, 56KΩ, and 10KΩ to dictate the temporal characteristics of the RC timing loop.
    
      
    
- Temporal state storage is achieved through the utilization of a 100nF dielectric capacitor.
    
      
    
- Human-machine interfacing is accomplished via two momentary push-button switches.
    
      
    
- The physical substrate for rapid prototyping is a standard breadboard, interconnected utilizing appropriately gauged jumper wires and breadboard connectors.
    
      
    
- The energetic requirements of the system are satisfied by a direct current power supply capable of delivering a potential difference between 5V and 9V, strictly adapted to the specific maximum voltage rating of the utilized servo motor.
    
      
    

# III. THEORETICAL FOUNDATIONS OF PULSE WIDTH MODULATION

The operational nucleus of servo motor manipulation is entirely dependent upon the mathematical and physical constructs of Pulse Width Modulation (PWM). PWM is structurally defined as a continuous series of discrete high-voltage and low-voltage pulses. The logic high state is mathematically designated as '1', while the logic low state is designated as '0'.

  

## _A. Mathematical Representation of Duty Cycle_

The temporal translation of the actuator is explicitly governed by the duration of the high pulse, technically defined as the pulse 'width'.

  

$$D = \frac{t_{ON}}{t_{ON} + t_{OFF}} \times 100\% \quad \quad (1)$$

The variable $D$ represents the duty cycle as a percentage. The variable $t_{ON}$ denotes the temporal duration wherein the signal maintains a logical high state. The variable $t_{OFF}$ specifies the temporal duration of the logical low state. The summation of $t_{ON}$ and $t_{OFF}$ constitutes the fundamental period, $T$, of the generated waveform.

  

$$f = \frac{1}{T} = \frac{1}{t_{ON} + t_{OFF}} \quad \quad (2)$$

The variable $f$ denotes the frequency of the oscillatory signal in Hertz. For standard servo actuation, the fundamental frequency is typically constrained to approximately 50 Hz, which correlates to a total period $T$ of 20 milliseconds.

  

## _B. Temporal Angular Mapping_

The mechanical orientation of the servo armature is a direct mathematical function of the $t_{ON}$ parameter.

  

1. _Zero-Degree Actuation:_ A pulse width of exactly 1ms commands the internal error amplifier of the servo to align the mechanical armature to the 0-degree coordinate.
    
      
    
2. _Maximum Deflection Actuation:_ A pulse width expanded to 3ms commands the servomechanism to traverse to its maximum angular limit, designated as the 180-degree position.
    
      
    
3. _Quiescent State Maintenance:_ The low-state temporal duration, $t_{OFF}$, is rigorously maintained at a constant duration of approximately 18ms to ensure internal capacitor discharge within the motor's comparator circuitry.
    
      
    

# IV. SEMICONDUCTOR PHYSICS AND THE NE555P INTERNAL ARCHITECTURE

A rigorous academic dissection of the NE555P Timer IC is mandated to comprehend the genesis of the aforementioned PWM signals. The device is manufactured using a complex monolithic silicon substrate, heavily relying upon Bipolar Junction Transistor (BJT) logic families or, in modern low-power variants, Complementary Metal-Oxide-Semiconductor (CMOS) architectures.

  

## _A. Voltage Divider Network and Reference Levels_

The internal topography of the 555 timer is characterized by a high-precision voltage divider network comprised of three identical 5kΩ resistors. This network establishes two critical reference voltages derived directly from the primary supply voltage, $V_{CC}$.

  

$$V_{ref1} = \frac{2}{3} V_{CC} \quad \quad (3)$$

The upper reference voltage, $V_{ref1}$, is routed to the inverting terminal of the internal threshold comparator.

  

$$V_{ref2} = \frac{1}{3} V_{CC} \quad \quad (4)$$

The lower reference voltage, $V_{ref2}$, is connected to the non-inverting terminal of the internal trigger comparator.

  

## _B. Comparator Logic and Flip-Flop Dynamics_

The architectural integrity of the timer relies upon the differential amplification capabilities of its internal comparators.

  

- **Threshold Comparator:** When the external voltage applied to the Threshold pin (Pin 6) exceeds $V_{ref1}$, the comparator outputs a logic high, which subsequently sets the internal Set-Reset (SR) flip-flop.
    
      
    
- **Trigger Comparator:** Conversely, when the voltage at the Trigger pin (Pin 2) drops below $V_{ref2}$, a logic high is generated by this second comparator, invoking a reset state within the SR flip-flop.
    
      
    
- **Discharge Transistor:** The inverted output of the SR flip-flop directly drives the base terminal of an NPN discharge transistor connected to Pin 7. When the flip-flop is in a set state, the transistor is driven into deep saturation, providing a low-impedance pathway to ground for the external timing capacitor.
    
      
    

# V. ASTABLE MULTIVIBRATOR CIRCUIT DESIGN AND MATHEMATICAL MODELING

The configuration of the servo controller circuit utilizes the 555 timer in an astable multivibrator topology. This specific arrangement is engineered to autonomously oscillate between high and low logic states without external triggering, thereby generating the continuous PWM stream demanded by the SG90 actuator.

  

## _A. The Role of the 1N4148 Steering Diode_

A standard astable 555 configuration restricts the duty cycle to values strictly greater than 50% due to the fact that the charging current must traverse both primary timing resistors, whereas the discharging current only traverses one. To achieve the highly asymmetrical duty cycle required for servo control (where $t_{ON}$ is 1ms to 3ms and $t_{OFF}$ is 18ms), an alternate current pathway must be established.

  

A 1N4148 PN junction diode is strategically implemented across the secondary timing resistor. During the charging phase of the 100nF capacitor, the diode becomes forward-biased.

  

$$I_D = I_S \left( e^{\frac{qV_D}{nkT}} - 1 \right) \quad \quad (5)$$

The equation defines the diode current $I_D$, where $I_S$ is the reverse saturation current, $V_D$ is the voltage across the diode, $q$ is the elementary charge, $k$ is the Boltzmann constant, and $T$ is the absolute temperature. The forward-biased diode provides a low-impedance bypass route, effectively removing the secondary resistor from the charge time constant equation.

  

## _B. Resistor-Capacitor (RC) Time Constant Derivations_

The temporal metrics of the resulting PWM signal are dictated by the physical values of the resistive and capacitive elements. The circuit employs discrete resistors of 56KΩ and 10KΩ to alternate between two highly specific ON pulse widths.

  

1. _Charge Phase Dynamics (Logic High):_ The actuation of the momentary push switches dictates the inclusion of either the 56KΩ or the 10KΩ resistor in the charging pathway. The voltage across the charging capacitor, $V_C(t)$, is modeled by the standard exponential charge equation.
    
      
    

$$V_C(t) = V_{initial} + (V_{CC} - V_{initial}) \left(1 - e^{-\frac{t}{R_{charge}C}}\right) \quad \quad (6)$$

The duration required for the capacitor voltage to ascend from $1/3 V_{CC}$ to $2/3 V_{CC}$ defines the high pulse width, $t_{ON}$.

  

$$t_{ON} = \ln(2) \cdot R_{charge} \cdot C \approx 0.693 \cdot R_{charge} \cdot C \quad \quad (7)$$

When a specific button is depressed, a 1ms ON time is generated, steering the armature to 0 degrees. Alternatively, the depression of the secondary switch engages an alternate resistive path, generating a 3ms ON time and steering the armature to 180 degrees.

  

2. _Discharge Phase Dynamics (Logic Low):_ Upon the capacitor potential reaching $2/3 V_{CC}$, the internal discharge transistor is activated. The diode becomes reverse-biased, forcing the discharge current strictly through the 220KΩ timing resistor.
    
      
    

$$t_{OFF} = \ln(2) \cdot R_{discharge} \cdot C \approx 0.693 \cdot R_{discharge} \cdot C \quad \quad (8)$$

Given the 100nF capacitance and the chosen discharge resistance, the OFF time is mathematically constrained to remain constant at approximately 18ms, fulfilling the strict operational prerequisites of the SG90 servomechanism.

  

# VI. ELECTRO-MECHANICAL TRANSDUCTION AND CLOSED-LOOP FEEDBACK

While the 555 timer circuit operates as an open-loop signal generator, the SG90 servo motor intrinsically functions as a sophisticated closed-loop control system. The incoming PWM signal is merely a positional reference command, which must be transduced into physical torque and angular displacement.

  

## _A. Internal Servo Architecture_

The internal cavity of the servo actuator houses three critical subsystems: a miniature brushed Direct Current (DC) motor, a high-ratio nylon gear reduction train, and a localized closed-loop feedback control circuit.


a) *The Potentiometric Transducer:* A precision rotary potentiometer is mechanically coupled to the final output spline of the gear train. As the DC motor rotates the output shaft, the wiper of the potentiometer sweeps across a resistive track, generating a variable analog voltage proportional to the absolute mechanical angle.

b) *Error Amplification:* The internal circuitry features an error amplifier—often implemented via a specialized integrated circuit—that compares the analog voltage derived from the internal potentiometer against a reference voltage internally generated by decoding the incoming PWM pulse width.

c) *H-Bridge Motor Drive:* The magnitude and polarity of the computed error signal direct an H-Bridge motor driver. If the error is positive, current is driven through the DC motor armature in a forward orientation. If the error is negative, the polarity is reversed, inducing counter-rotation. As the output shaft approaches the commanded angle, the error signal approaches zero, proportionately reducing the motor torque until physical equilibrium is achieved. 


## _B. Torque and Back Electromotive Force (EMF)_

The generation of mechanical torque, $\tau$, within the internal DC motor is directly proportional to the armature current, $I_a$.

  

$$\tau = K_t \cdot I_a \quad \quad (9)$$

The parameter $K_t$ represents the motor torque constant. Concurrently, as the armature rotates within the permanent magnetic field, a back Electromotive Force (EMF), $E_b$, is induced, which opposes the supply voltage.

  

$$E_b = K_e \cdot \omega \quad \quad (10)$$

The parameter $K_e$ signifies the electrical back-EMF constant, and $\omega$ represents the angular velocity of the rotor. The dynamic interplay between applied voltage, back-EMF, and armature resistance dictates the transient response and settling time of the servo arm as it transitions from the 0-degree coordinate to the 180-degree coordinate.

  

# VII. POWER DISTRIBUTION AND THERMAL MANAGEMENT PROTOCOLS

The operational stability of both the analog timer circuitry and the electromechanical load is acutely sensitive to power supply integrity. Extreme diligence is required when architecting the power distribution network for mixed-signal systems.

  

## _A. Voltage Constraints and Dielectric Breakdown_

The system is designed to accommodate a supply voltage ranging from 5V to 12V; however, this specification is strictly contingent upon the maximum absolute ratings of the attached servo motor. The utilization of a 9G servo motor necessitates a strict 5V power supply regulation.

  

A critical engineering caveat must be observed: powering a 5V-rated servomechanism with a 12V potential will induce instantaneous failure. The application of such excessive electromotive force forces the internal DC motor to draw stall currents far exceeding the thermal dissipation capabilities of its enameled copper windings. The resulting Joule heating causes rapid pyrolytic degradation of the insulation, leading to internal short circuits. Furthermore, the internal control silicon is highly susceptible to destructive oxide breakdown at elevated voltages.

  

## _B. Decoupling and Parasitic Inductance Mitigation_

The sudden activation of the servo motor's internal H-Bridge draws massive transient current spikes from the power rail. These di/dt events interact with the parasitic inductance of the breadboard jumper wires, generating severe voltage droops and high-frequency ringing that can destabilize the internal comparators of the NE555P IC. While not explicitly detailed in the foundational schematic, standard engineering practice dictates the placement of low-Equivalent Series Resistance (ESR) bypass capacitors in close physical proximity to the power pins of both the timer IC and the servo header to shunt these high-frequency transients to the ground plane.

  

# VIII. COMPREHENSIVE APPLICATION PARADIGMS IN CYBER-PHYSICAL SYSTEMS

The seemingly rudimentary combination of a 555 timer and a servo actuator forms the foundational bedrock for an immense variety of complex cyber-physical systems. The versatility of the designed controller circuit allows for its immediate integration into diverse professional and hobbyist engineering disciplines.

  

## _A. Advanced Robotics and Kinematics_

The control of robotic appendages and articulated movable parts is heavily reliant upon precise angular actuation. In multi-axis robotic manipulators, individual joints are driven by cascaded servomechanisms. The presented 555-based controller can be utilized as an external diagnostic tool to isolate mechanical bindings or calibration errors in specific joints without requiring the activation of the primary robotic operating system.

  

## _B. Radio-Controlled (RC) Avionic and Terrestrial Vehicles_

The genesis of modern servo technology is deeply rooted in the Radio-Controlled (RC) device industry. Precise PWM signaling is essential for the manipulation of steering linkages in terrestrial RC cars, the hydrodynamic adjustment of rudders in maritime vessels, and the aerodynamic deflection of ailerons, elevators, and flaps in fixed-wing avionic platforms.

  

## _C. Optical Tracking and Camera Stabilization_

Cinematographic and surveillance infrastructures utilize complex pan and tilt mechanisms to ensure smooth, jitter-free optical tracking. Servomotors, driven by highly calibrated PWM streams, provide the requisite micro-stepping and holding torque necessary to stabilize heavy optical payloads against environmental perturbations.

  

## _D. Telecommunications and Antenna Positioning_

Optimal signal-to-noise ratios in point-to-point microwave and satellite telecommunications necessitate exact physical alignment of parabolic transceivers. Servo controllers are deployed to adjust antennas dynamically, compensating for terrestrial shifts or tracking non-geostationary orbital satellites to maintain optimal signal reception metrics.

  

## _E. Smart Home Automation Infrastructures_

The integration of electro-mechanical actuators into domestic environments facilitates the automated actuation of window blinds, the engagement of biometric door locking mechanisms, and the manipulation of HVAC zoning dampers. The low-power footprint of the 555 timer circuit makes it highly suitable for embedded battery-operated automation nodes.

  

## _F. Pedagogical and Educational Instrumentation_

Academic institutions heavily utilize modular servomechanism kits for teaching advanced theories regarding control systems, feedback loops, and analog signal processing. The tactile, highly visual nature of a servo motor responding to a manually adjusted RC time constant provides unparalleled pedagogical value for undergraduate engineering cohorts.

  

## _G. Industrial Automation and Assembly Line Logistics_

High-throughput manufacturing facilities require precise movement paradigms for assembly line operations, robotic welding, and automated optical inspection stations. While heavy industrial lines utilize massive AC servo motors, the fundamental PWM control theory remains mathematically identical to the micro-servo system analyzed herein.

  

## _H. Haptic Feedback in Interactive Gaming Consoles_

Modern immersive gaming controllers employ internal servomechanisms or voice-coil actuators to provide high-fidelity force feedback and haptic resistance. By modulating the PWM signal, varying degrees of physical tension can be simulated within the controller's triggers or steering peripherals.

  

## _I. Biomedical Engineering and Prosthetics_

The precision control of movement within advanced myoelectric prosthetics and assistive exoskeletons requires highly reliable, lightweight actuation systems. The translation of analog muscular electromyography (EMG) signals into digital PWM streams allows for the lifelike articulation of synthetic digits and joints.

  

## _J. Quality Assurance and Component Calibration_

Prior to the integration of any servomechanism into a mission-critical assembly, rigorous calibration and stress testing must be executed. A standalone controller circuit functions as a highly efficient testing apparatus, allowing technicians to verify the maximum slew rate, current draw, and dead-band characteristics of individual servo motors under controlled laboratory conditions.

  

# IX. SYSTEMATIC REVIEW AND PERFORMANCE METRICS

The empirical validation of the constructed circuit reveals a highly deterministic relationship between the localized analog component variations and the resultant mechanical output. The utilization of the 1N4148 fast-recovery diode successfully bifurcates the charge and discharge pathways, allowing for the extreme duty cycle asymmetry required for 1ms and 3ms high-pulses within a massive 20ms total period.

  

The mechanical limitations of the SG90 actuator, particularly the inherent hysteresis within its internal nylon gear train, introduce minor positional errors that are unavoidable in low-cost open-loop command systems. Furthermore, the thermal drift of the 100nF dielectric capacitor and the carbon-film timing resistors can introduce fractional microsecond variations in the generated PWM width. In highly sensitive biomedical or avionic applications, these temperature-dependent variations would necessitate the implementation of a quartz-crystal controlled digital synthesis architecture. However, for foundational diagnostic testing and non-critical automated positioning, the analog 555-based architecture provides an unparalleled ratio of simplicity to efficacy.

  

# X. CONCLUSION

An exhaustive architectural, mathematical, and operational analysis of a servo motor position controller utilizing a 555 Timer IC has been successfully presented. The synthesis of fundamental analog circuit topologies—specifically the astable multivibrator enhanced via diode-steered asymmetric RC time constants—demonstrates the capacity to generate highly precise Pulse Width Modulated control waveforms without the overhead of digital microprocessor architectures. By actively toggling resistive pathways utilizing discrete 56KΩ and 10KΩ components, exact 1ms and 3ms high-state logic pulses were achieved, commanding the attached servomechanism to 0-degree and 180-degree limits, respectively. The rigorous adherence to power distribution constraints, explicitly the mandate to supply exactly 5V to the 9G servo apparatus, prevents catastrophic semiconductor and dielectric failure. Ultimately, this robust, solid-state controller architecture serves as a foundational building block for a myriad of complex electro-mechanical implementations, spanning from deep industrial automation and cyber-physical robotics to pedagogical instrumentation and advanced biomedical prosthetics. The enduring viability of analog timing interfaces in bridging the divide between low-voltage logic structures and high-torque mechanical actuators is decisively reaffirmed.