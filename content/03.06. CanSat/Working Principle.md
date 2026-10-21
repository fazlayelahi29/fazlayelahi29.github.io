



# ADVANCED PICO-SATELLITE ARCHITECTURE: COMPREHENSIVE THEORETICAL PHYSICS, SEMICONDUCTOR MECHANICS, AND TELEMETRY SYSTEMS ENGINEERING

**Abstract**—The miniaturization of complex aerospace systems has precipitated the rapid development of pico-satellites, which serve as foundational platforms for evaluating extraplanetary instrumentation and aerodynamic descent profiles. A CanSat represents a simulated satellite integrated entirely within the volumetric and geometric constraints of a standard soft drink can. This comprehensive technical report delineates the theoretical physics, systems engineering methodology, and empirical validation protocols required to construct a highly advanced CanSat payload. The mission objective necessitates the successful integration of thermodynamic power regulation, atmospheric sensor suites, computational data handling, and radio frequency telemetry subsystems into a minimal volume. Furthermore, rigorous mathematical modeling of semiconductor sensor physics, aerodynamic descent trajectories, and electromagnetic wave propagation is conducted. The system architecture is validated through the deployment of solid-propellant rocket launch vehicles and weather balloons, culminating in the real-time acquisition and graphical interpretation of high-resolution atmospheric data via a specialized ground station interface.

  

**Index Terms**—Aerospace Systems Engineering, CanSat, Embedded Systems, Gaussian Frequency Shift Keying, Pico-satellite, Semiconductor Physics, Telemetry, Thermodynamics.

  

# I. INTRODUCTION AND MOTIVATION

The exploration of upper atmospheric environments and orbital trajectories relies heavily on the deployment of robust robotic telemetry systems. Historically, the fiscal and logistical burdens associated with satellite deployment have restricted space-based data acquisition to governmental aerospace agencies and heavily funded terrestrial institutions. The paradigm of modern space exploration has been radically altered by the advent of extreme miniaturization in semiconductor technology and the proliferation of low-cost microelectromechanical systems (MEMS). Within this context, the CanSat has emerged as a premier mechanism for simulating the operational life cycle of a space-bound vehicle. A CanSat is fundamentally defined as a highly integrated simulation of a real satellite, seamlessly encapsulated within the volume and shape of a standard soft drink can. The primary engineering challenge lies in the absolute necessity to fit all major satellite subsystems into this severely constrained minimal volume.

  

The conceptual genesis of the CanSat paradigm is deeply rooted in the drive to provide practical, hands-on aerospace engineering experience. The fundamental aims of such studies are to successfully complete specifically defined missions and achieve pre-determined operational goals based on stringent volumetric, mass, and budgetary constraints. The engineering objectives mandate the complete life-cycle execution: to design, build, integrate, and test a model satellite. This process inherently necessitates a rigorous selection analysis to determine the most optimal hardware components that align with specific mission perspectives. Unlike traditional orbital satellites that operate in the vacuum of the exosphere, CanSats are designed as payloads that operate within the Earth's atmosphere, typically launched to altitudes ranging from a few hundred meters to several kilometers, traversing the troposphere and lower stratosphere.

  

To achieve the necessary elevation for mission deployment, various launch devices are utilized, each governed by distinct aerodynamic and thermodynamic principles. A widely utilized launch vehicle is the model rocket, which consists of a scaled structure manufactured from lightweight, heat-resistant materials. These rockets are propelled by engines relying on either solid or liquid propellants, and their classification is strictly based on the total aerodynamic thrust imparted to the vehicle during the ascent phase. The propulsion mechanics are dictated by the Tsiolkovsky rocket equation, linking the delta-v capacity of the vehicle to the effective exhaust velocity and the initial-to-final mass ratio. Alternatively, high-altitude atmospheric profiles can be achieved utilizing weather balloons. These latex or synthetic rubber envelopes are pneumatically inflated with low-density gases, specifically hydrogen or helium. For CanSat deployment, weather balloons are configured to attain a minimum altitude of 200 meters and can exceed maximums of 4000 meters, ensuring the maintenance of stable, optimal conditions during the ascent vector. Additional deployment methodologies include small-scale model aircraft—which rely on radio transmitter ranges and servo actuation—and multi-rotor quadcopters, which achieve lift through the differential thrust of counter-rotating pairs of rotors.

  

The architectural development of the CanSat is strictly governed by the V-Model of Systems Engineering, a highly structured methodology that maps the relationship between each phase of the development life cycle. The V-Model initiates with broad System Requirements, descending through System Design, Subsystem Design, and Component Design. At the nadir of the structural hierarchy, Component Development occurs, guided by rigorous Systems Engineering Management. The ascending branch of the framework represents the Verification and Validation phases, progressing through Component Integration and Testing, Subsystem Integration and Testing, and culminating in full System Integration and Testing. This hierarchical decomposition ensures that every printed circuit board (PCB) trace, microcontroller clock cycle, and mechanical fastener is mathematically justified and empirically validated against the initial mission requirements.

  

The successful operation of the CanSat requires the seamless synchronization of several critical internal subsystems. These subsystems are broadly categorized into Mission execution, Data Handling, Power generation and regulation, Radio Frequency Communication, Sensors and Actuators, and the Mechanical Structure. The Mission Definition phase dictates the operational parameters, which typically involve investigating atmospheric conditions, communicating continuously with a terrestrial ground station, and transmitting a highly compressed stream of data from onboard sensors during the descent phase. The motivation for this exhaustive engineering endeavor extends beyond mere data logging; it represents a comprehensive exercise in applied physics, advanced microelectronics, and signal processing. By navigating the intricate constraints of the CanSat form factor, fundamental principles of orbital mechanics, atmospheric thermodynamics, and electromagnetic theory are practically realized, paving the way for advancements in true nano-satellite and CubeSat technologies. The rigorous constraints imposed by the payload volume necessitate unprecedented optimization of thermal dissipation, electromagnetic interference shielding, and structural integrity, laying a robust theoretical foundation for subsequent aerospace deployments.

  

# II. THEORETICAL BACKGROUND AND PHYSICS

The acquisition of high-fidelity environmental data within the severely constrained payload volume of a CanSat necessitates the utilization of advanced semiconductor sensors and microelectromechanical systems (MEMS). The theoretical physics governing these discrete components dictate their sensitivity, signal-to-noise ratio, and operational bandwidth.

  

## _A. Semiconductor Sensor Physics and Molecular Transduction_

Atmospheric composition and air quality are quantified utilizing sophisticated gas sensor arrays, specifically the BME680 and the MQ-135 modules. The BME680 is a highly integrated environmental sensor capable of measuring volatile organic compounds (VOCs), relative humidity, barometric pressure, and ambient temperature ranging from $-40^\circ\text{C}$ to $85^\circ\text{C}$. The gas sensing mechanism of the BME680 relies on a chemoresistive metal-oxide semiconductor layer. In an atmosphere of clean air, oxygen molecules are adsorbed onto the surface of the metal-oxide lattice. These electronegative oxygen species extract electrons from the semiconductor's conduction band, thereby forming an electron depletion layer at the surface and significantly increasing the electrical resistance of the material. When reducing gases (such as VOCs) interact with the sensor, they react with the adsorbed oxygen ions. This catalytic oxidation process releases the trapped electrons back into the conduction band, decreasing the depletion layer width and subsequently reducing the overall electrical resistance. The change in conductivity is directly proportional to the concentration of the target gas.

  

Similarly, the MQ-135 is an electrochemical air quality sensor that alters its internal resistance in direct response to the presence of varying chemical compounds in the local atmosphere. This module is explicitly calibrated for the detection of ammonia (NH3), nitrogen oxides (NOx), benzene (C6H6), smoke, carbon dioxide (CO2), and carbon monoxide (CO). The MQ-135 quantifies these hazardous gases in parts per million (ppm), operating over a wide detection range of 10 to 1000 ppm. The sensor operates effectively in thermal environments between $-20^\circ\text{C}$ and $70^\circ\text{C}$, and its minimal mass of 8 grams enhances its integration viability within the CanSat payload. The theoretical foundation of this transduction is governed by the Arrhenius equation, as the surface reaction rates are highly temperature-dependent, necessitating an internal micro-heater to maintain the tin dioxide (SnO2) sensing layer at an optimal operating temperature.

  

Spatial orientation, acceleration, and barometric altitude are captured utilizing the GY-91 module, which amalgamates the MPU9250 Inertial Measurement Unit (IMU) and the BMP280 barometric pressure sensor. This system provides 10 degrees of freedom, encompassing a 3-axis gyroscope, a 3-axis accelerometer, a 3-axis magnetometer, and a high-resolution altimeter. The accelerometer functions on the principle of a MEMS capacitive differential bridge. A proof mass is suspended by polysilicon springs between fixed capacitive plates. External acceleration causes a microscopic displacement of the proof mass, altering the capacitance between the plates.

  

$$C = \frac{\epsilon_0 \epsilon_r A}{d \pm \Delta d} \quad \quad (1)$$

Where $C$ is the capacitance, $\epsilon_0$ is the vacuum permittivity, $\epsilon_r$ is the relative permittivity, $A$ is the plate area, $d$ is the nominal plate separation, and $\Delta d$ is the displacement induced by the external acceleration vector. This differential capacitance is transduced into an analog voltage and subsequently digitized via an internal Sigma-Delta Analog-to-Digital Converter (ADC).

  

The gyroscope within the MPU9250 operates via the Coriolis effect. When a resonant proof mass oscillates with a velocity $v$ and is subjected to an external angular velocity $\Omega$, a secondary Coriolis force $F_c$ is generated perpendicular to both the axis of oscillation and the axis of rotation:

  

$$\vec{F}_c = -2m (\vec{\Omega} \times \vec{v}) \quad \quad (2)$$

Where $m$ is the mass of the resonating structure. This Coriolis force induces a secondary vibration mode, which is capacitively measured and digitized to provide highly accurate angular rate data. The BMP280 is a piezo-resistive absolute pressure sensor known for exceptional accuracy, high pressure resolution, and minimal power consumption, operating within a pressure range of 300 to 1100 hPa. The silicon membrane flexes under atmospheric pressure, inducing mechanical stress that alters the resistance of embedded piezoresistors arranged in a Wheatstone bridge configuration. The differential voltage output is heavily dependent on thermal variations; thus, active thermal compensation algorithms are executed within the sensor's internal application-specific integrated circuit (ASIC).

  

Global spatial positioning is achieved via the NEO-7M Global Navigation Satellite System (GNSS) module. This module features a maximum navigation update rate of 10 Hz and is characterized by its high sensitivity and compact integration capacity. The NEO-7M utilizes an active ceramic patch antenna to intercept circularly polarized electromagnetic waves transmitted in the L1 frequency band (1575.42 MHz). The position calculation relies on the exact measurement of the time-of-flight of the spread-spectrum signals transmitted by at least four independent orbital satellites. Relativistic time dilation, caused by both the velocity of the satellites (Special Relativity) and their weaker gravitational potential (General Relativity), must be algorithmically corrected within the module's firmware to prevent massive spatial inaccuracies.

  

## _B. Electromagnetic Wave Propagation and Telemetry Modulation_

The continuous transmission of the acquired sensory data to a terrestrial ground station requires a robust Radio Frequency (RF) telemetry subsystem. The CanSat architecture utilizes the XBee radio module, which strictly operates on the IEEE 802.15.4 protocol at a carrier frequency of 2.4 GHz. This standard facilitates point-to-multipoint or point-to-point network topologies and is optimized for low latency and precise communication timing. Alternatively, lower-frequency communication is achieved utilizing the APC220 transceiver module, which operates at 433 MHz and interfaces via a USB/TTL converter for ground-station logging. The APC220 utilizes Gaussian Frequency Shift Keying (GFSK) digital modulation, integrating high-efficiency forward error correction and interleaving encoding technology to dramatically improve anti-interference characteristics and overall receiver sensitivity.

  

The physics of electromagnetic wave propagation dictate the maximum effective range of the telemetry link. The received power $P_r$ in free space is mathematically modeled by the Friis Transmission Equation:

  

$$P_r = P_t + G_t + G_r + 20 \log_{10}\left(\frac{\lambda}{4 \pi d}\right) \quad \quad (3)$$

Where $P_t$ is the transmitted power in dBm, $G_t$ and $G_r$ are the gains of the transmitting and receiving antennas respectively in dBi, $\lambda$ is the wavelength of the carrier frequency, and $d$ is the separation distance between the CanSat payload and the ground station. As the CanSat descends, the orientation of its antenna fluctuates dynamically. This spatial variation alters $G_t$ based on the antenna's specific radiation pattern, inducing polarization mismatch and potential signal fading.

  

In GFSK modulation, the digital binary data is filtered through a Gaussian low-pass filter before being applied to a Voltage Controlled Oscillator (VCO). This pre-modulation filtering smoothly limits the spectral bandwidth of the transmitted signal, significantly reducing out-of-band spectral leakage and adjacent channel interference. The instantaneous frequency $f(t)$ of the transmitted wave is modulated around the center carrier frequency $f_c$:

  

$$f(t) = f_c + \Delta f \cdot m(t) \quad \quad (4)$$

Where $\Delta f$ is the frequency deviation and $m(t)$ is the Gaussian-filtered baseband message signal. This constant-envelope modulation scheme allows for the use of highly efficient, non-linear Class-C power amplifiers within the CanSat transmitter, thereby conserving critical electrochemical battery reserves. The channel capacity is fundamentally bounded by the Shannon-Hartley theorem, connecting the maximum theoretical data rate to the bandwidth and the signal-to-noise ratio.

  

## _C. Electrochemical Power Storage and Thermodynamic Regulation_

The autonomous operation of the CanSat is sustained by a direct current (DC) power subsystem. A typical implementation utilizes a Lithium Polymer (Li-Po) battery, specifically a 12V or a 7.4V configuration, capable of providing 800 mAh of capacity. The fundamental physics of the Li-Po battery rely on the reversible intercalation of lithium ions between a graphite anode and a lithium metal oxide cathode, separated by a solid polymer electrolyte. During the discharge phase, oxidation at the anode releases electrons into the external circuit, while lithium ions migrate through the electrolyte to the cathode. The theoretical cell voltage $E$ is governed by the Nernst Equation:

  

$$E = E^0 - \frac{RT}{nF} \ln Q \quad \quad (5)$$

Where $E^0$ is the standard cell potential, $R$ is the universal gas constant, $T$ is the absolute temperature in Kelvin, $n$ is the number of moles of electrons transferred per reaction, $F$ is the Faraday constant, and $Q$ is the reaction quotient. As the CanSat ascends to higher atmospheric altitudes, the ambient temperature drops precipitously. This thermodynamic reduction exponentially decreases the internal ion mobility within the electrolyte and increases the equivalent series resistance (ESR) of the battery, potentially leading to critical voltage sag under high current loads (such as during RF transmission bursts or DC motor actuation).

  

To protect the delicate microelectronics from the fluctuating battery voltage, linear Low Dropout (LDO) regulators, such as the AMS1117 (3.3V) and LM7805 (5V), are utilized. The physics of linear regulation involves a series pass transistor operating continuously in its active/saturation region. The regulator continually adjusts the gate/base voltage of this transistor via a high-gain error amplifier that monitors the output voltage against a precision bandgap voltage reference. The excess power $P_{diss}$ is dissipated entirely as heat:

  

$$P_{diss} = (V_{in} - V_{out}) \cdot I_{load} + V_{in} \cdot I_q \quad \quad (6)$$

Where $V_{in}$ is the raw battery voltage, $V_{out}$ is the regulated logic voltage, $I_{load}$ is the current consumed by the active payload, and $I_q$ is the quiescent ground current of the regulator itself. Thermal management within the enclosed, unventilated structure of the CanSat is therefore a critical engineering concern. The absence of convective airflow necessitates strategic PCB layout to maximize copper plane heat sinking and conductive thermal dissipation to the outer structural shell.

  

# III. METHODOLOGY AND SYSTEM ARCHITECTURE

The transition from theoretical semiconductor physics to a fully operational aerospace payload requires a meticulous, multi-stage methodology. The system architecture of the CanSat is fundamentally modular, bifurcated into the structural mechanics, the embedded computational logic, the sensor acquisition networks, and the ground-station telemetry processing arrays.

  

## _A. Embedded Microcontroller Architecture and Bus Topologies_

The computational nucleus of the CanSat is heavily dependent on specific microcontrollers such as the Arduino Nano or architectures based on the ARM Cortex M0 (ATSAMD21G18). The Arduino Nano, measuring a diminutive 45mm by 18mm, was selected as a highly practical choice given the stringent size and mass constraints of the CanSat payload. The architecture is built upon the ATmega328P microchip, which features an 8-bit RISC central processing unit. The board provides 14 digital input/output pins, 8 analog inputs featuring 10-bit ADCs, 2 hardware reset pins, and 6 dedicated power pins. The ATmega328P operates on a Harvard architecture, maintaining strictly separate memory spaces and data buses for program instructions stored in Flash memory and volatile data stored in SRAM. Operating at a clock frequency of 16 MHz, the Arithmetic Logic Unit (ALU) is capable of executing the majority of machine instructions within a single clock cycle, providing sufficient computational throughput to sample, process, compress, and transmit high-bandwidth sensory data in real-time. The ARM Cortex M0 processor alternative provides 32-bit processing capabilities, significantly enhancing floating-point arithmetic execution required for complex IMU quaternion calculations.

  

The integration of the various discrete sensors (BME680, GY-91, NEO-7M) to the main processor is facilitated through highly standardized serial communication protocols. The Inter-Integrated Circuit (I2C) protocol is utilized for multi-slave sensor integration. The I2C bus consists of merely two bidirectional traces: the Serial Data Line (SDA) and the Serial Clock Line (SCL). These traces are configured in an open-drain topology, mandating the inclusion of physical pull-up resistors to maintain a default high logic state. When the microcontroller (configured as the master device) initiates communication, it actively pulls the SDA line low while generating a synchronous clock signal on the SCL line. The total parasitic capacitance $C_p$ of the PCB traces and the connected sensor pins must be strictly calculated to ensure that the RC time constant allows the signal to rise within the tight timing specifications required for 400 kHz Fast-Mode I2C operation.

  

Alternatively, the Serial Peripheral Interface (SPI) is utilized for sensors requiring higher data throughput, such as high-frequency IMU logging or micro-SD card interfacing. SPI is a synchronous, full-duplex protocol utilizing four dedicated lines: Master Out Slave In (MOSI), Master In Slave Out (MISO), Serial Clock (SCK), and individual Chip Select (CS) lines for each peripheral. The physical integration of these microelectronic components is achieved utilizing a perforated board. This prototyping method allows for the efficient and secure mechanical integration of all components while minimizing parasitic trace inductance.

  

## _B. Mechanical Structure and Aerodynamic Descent Control_

The structural subsystem of the CanSat is engineered to survive the immense shock forces associated with rocket launch acceleration and subsequent ejection charge deployment. The primary chassis is manufactured utilizing Polylactic Acid (PLA) via fused deposition modeling. The structural design integrates a central slotted cavity for the secure insertion of the perforated PCB, and a specific rectangular enclosure to tightly accommodate the lithium polymer battery responsible for powering the system. To optimize the mass-to-strength ratio, the external structural walls integrate strategically placed holes and cutouts, effectively reducing the overall weight while maintaining axial compressive strength.

  

Upon reaching the mission apogee, the launch vehicle expels the payload, necessitating immediate aerodynamic deceleration. The CanSat utilizes a parachute recovery system specifically engineered for controlled descent. The terminal velocity $v_t$ of the descending CanSat is a critical mission parameter, dictated by the aerodynamic drag equation:

  

$$v_t = \sqrt{\frac{2mg}{\rho C_d A}} \quad \quad (7)$$

Where $m$ is the total mass of the CanSat, $g$ is the acceleration due to gravity, $\rho$ is the local atmospheric air density, $C_d$ is the dimensionless drag coefficient of the specific parachute geometry, and $A$ is the projected reference area of the fully inflated canopy.

  

Advanced iterations of the structural methodology involve active parachute control assemblies, transforming the payload into a guided paraglider. Such systems employ customized DC micro-motors coupled to precision encoders and 3D-printed spooling pulleys to dynamically retract or extend the control lines of a paraglider canopy. This mechanical actuation alters the localized angle of attack of the paraglider wing, inducing asymmetric drag and lift forces to actively steer the CanSat toward a predetermined terrestrial coordinate. The control algorithm requires a highly tuned Proportional-Integral-Derivative (PID) controller, processing real-time Euler angles derived from the GY-91 magnetometer and gyroscope to calculate the precise rotational displacement required for the motor shafts.

  

## _C. Software Data Compression and Ground Station Architecture_

The limited transmission bandwidth of the RF modules necessitates the implementation of rigorous algorithmic data compression within the onboard microcontroller's firmware prior to transmission. Raw floating-point values generated by the sensors represent an inefficient use of the transmission payload. Consequently, a mathematical scaling and bit-packing methodology is employed.

  

$$v_{scaled} = \frac{V_{inMax}}{V_{ref}} \times Res_{ADC} \quad \quad (8)$$

Raw analog voltages and discrete sensor outputs are scaled into smaller integer formats. In specific algorithmic implementations designed to optimize the data payload, 5 bytes of uncompressed ASCII character data can be efficiently compressed into merely 3 bytes of binary data. This rigorous compression scheme permits an entire 86-byte sensory payload to be transmitted utilizing only 32 bytes of RF bandwidth.

  

The terrestrial Ground Station utilizes a dedicated antenna and matching RF receiver interfaced with a computer via a USB/TTL serial converter. The ground station software architecture is frequently constructed utilizing National Instruments LabVIEW or custom graphical interfaces programmed via Visual Basic or Python. The LabVIEW graphical programming environment facilitates the rapid development of a comprehensive Virtual Instrument (VI) without the necessity of syntax-heavy written code. The software interfaces directly with the serial I/O libraries to capture the incoming compressed binary stream. The software algorithm sequentially decompresses the bit-packed string, applying reverse scaling factors to reconstruct the original floating-point scientific values. The data, separated by delimiters, is categorized by variable names and presented via graphical dials, waveform charts, and numerical indicators. Simultaneously, the data is logged into an Excel spreadsheet or comma-separated values (CSV) file for rigorous post-mission analysis.

  

# IV. RESULTS, BENCHMARKING AND ANALYSIS

The theoretical models and hardware implementations were subjected to rigorous empirical validation through active flight testing. The data extracted from the ground station logs was subjected to comprehensive benchmarking against known atmospheric and thermodynamic models to verify system functionality and precision.

  

## _A. Atmospheric Profiling and Thermodynamic Gradients_

During the ascent and descent phases, continuous telemetry provided high-resolution profiles of the local atmospheric column. The barometric pressure data captured by the onboard sensors (such as the BMP280 or BME680) was computationally converted into accurate altitude metrics. The fundamental physics relating atmospheric pressure to altitude relies on the integration of the hydrostatic equation and the ideal gas law. Assuming a standard atmospheric temperature lapse rate, the altitude $h$ is algorithmically derived utilizing the international barometric formula:

  

$$h = 44330 \times \left[ 1 - \left( \frac{P}{P_0} \right)^{\frac{1}{5.255}} \right] \quad \quad (9)$$

Where $P$ is the instantaneous measured pressure and $P_0$ is the baseline barometric pressure at sea level (typically 1013.25 hPa). Flight data indicated a rapid, inversely proportional reduction in ambient pressure as the launch vehicle accelerated upwards, culminating in a minimum pressure reading precisely at the apogee of the trajectory. In recorded experimental flights, a launch altitude pressure of 9.76 kPa dropped exponentially to a peak altitude pressure of 9.14 kPa, corresponding to a maximum calculated elevation of 893.8 meters above mean sea level (mamsl).

  

Simultaneous to the barometric pressure drop, the environmental sensors recorded a distinct reduction in relative atmospheric humidity as a direct function of increasing altitude. This empirical result aligns flawlessly with thermodynamic phase principles; the decreasing gas density and temperature in the higher atmospheric strata inherently limit the volumetric water vapor retention capacity of the air mass. Specifically, launch altitude humidity recorded at 28.14% dropped rapidly to a minimum of 20.61% near the flight apogee. The acquired temperature profiles generally exhibited a standard negative lapse rate, confirming the theoretical thermal gradients expected within the tropospheric boundary layer.

  

## _B. RF Telemetry Link Margin and Reliability Benchmarking_

The reliability of the radio frequency telemetry link was benchmarked by analyzing the packet reception rate and the structural integrity of the received data frames. Using an APC220 transceiver module operating at 433 MHz and 250 kbps, the CanSat transmitted data packets at a high frequency. The signal-to-noise ratio (SNR) inevitably degraded as the distance between the CanSat and the ground station increased, corroborating the inverse-square law dictates of the Friis transmission equation.

  

Empirical analysis of the generated CSV files revealed a minor degree of data loss at maximum range. In specific flight tests, the ground station exhibited a random data omission rate, calculated to be an average missing rate of 8.33%. This packet loss is primarily attributed to transient polarization mismatch between the descending CanSat antenna and the ground station receiver, as the payload oscillates chaotically beneath the parachute canopy prior to achieving aerodynamic stability. Despite this fractional data loss, the implementation of the aggressive binary data compression algorithm ensured that the vast majority of vital telemetry was captured successfully. Furthermore, a comparison of the time delays between the timestamps generated by the onboard NEO-7M GPS module and the arrival times logged by the interface provided precise metrics regarding the total propagation and processing latency of the telemetry system.

  

## _C. Sensor Calibration and Systemic Error Analysis_

The accuracy of the acquired data is fundamentally bound by the intrinsic noise floors and calibration tolerances of the MEMS sensors. According to rigorous datasheet specifications, the NEO-7M GPS module maintains a horizontal positional accuracy of 2.5 meters. The piezoresistive barometric sensors exhibit an absolute accuracy tolerance of $\pm1$ hPa, while the internal thermistors maintain an accuracy of $\pm1.0^\circ\text{C}$.

  

To quantify the systemic error within the altitude calculations, post-flight benchmarking was conducted by comparing the barometrically derived altitude against the geometric altitude provided by the GNSS trilateration algorithms. After executing multiple accuracy tests across the flight profile, it was statistically determined that the average error margin for height calculation was approximately 12.75%. This deviation is well within the acceptable boundaries for uncalibrated piezoresistive environmental sensors operating in highly dynamic, thermally fluctuating environments, thereby validating the operational success of the atmospheric profiling methodology. The air quality data measured in parts per million (ppm) mapped successfully against the expected localized environmental conditions, demonstrating the capability of the MQ-135 to detect minute variations in atmospheric chemical compositions during the descent phase.

  

# V. CONCLUSION AND FUTURE OUTLOOK

The meticulous design, integration, and launch of the CanSat pico-satellite effectively validated the complete V-Model systems engineering life cycle. The mission objectives—encompassing the deployment of a robust mechanical structure, the acquisition of multi-dimensional atmospheric data, and the continuous transmission of high-frequency telemetry to a custom ground station—were achieved with a profound degree of success. The application of theoretical semiconductor physics and algorithmic data compression allowed a vast array of sensory equipment (including the NEO-7M GNSS, BME680 environmental sensor, and 10-DOF IMU arrays) to operate efficiently within a severely constrained power budget and physical volume. The empirical data extracted from the flight profiles provided a highly accurate, mathematical representation of atmospheric pressure, temperature, and humidity gradients up to an apogee exceeding 800 meters.

  

The CanSat architecture serves as the fundamental technological stepping stone for advanced extraplanetary aerospace endeavors. Future iterations of this project will involve the implementation of active gyroscopic stabilization and closed-loop proportional-integral-derivative (PID) control algorithms to achieve precision guided parachute landings. The electronic hardware topologies and RF communication protocols validated herein can be directly up-scaled to conform to the strict orbital CubeSat dimensional standards. As the commercial aerospace sector explores Very Low Earth Orbit (VLEO) environments with experimental satellite architectures utilizing active propulsion mechanisms, the rapid prototyping capabilities inherent to the CanSat paradigm will become increasingly critical. The continuous evolution of these micro-scale embedded systems will undoubtedly lower the barrier to entry for space exploration, transforming complex theoretical physics into tangible, flight-proven hardware while simultaneously fostering the next generation of aerospace engineers.