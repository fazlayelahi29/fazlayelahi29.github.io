# The Physics of Simulation: Architecting Advanced Semiconductor Device Models in the PSpice Ecosystem

## Introduction: The Mathematical Foundation of Physical Simulation

The fundamental triumph and enduring challenge of SPICE (Simulation Program with Integrated Circuit Emphasis) lie in its mandate to translate the continuous, deeply complex phenomena of quantum mechanics, solid-state physics, and electromagnetism into discrete, solvable macroscopic equations. The very foundation of PSpice relies entirely on the mathematical accuracy of the models fed into its core simulation engine. At its heart, a SPICE simulator is a non-linear ordinary differential equation (ODE) solver that relies on the Newton-Raphson iterative method to resolve nodal admittance matrices. If the mathematical models describing the semiconductor devices lack continuous first and second derivatives—such as transconductance ($g_m$) and output conductance ($g_{ds}$)—the Jacobian matrix becomes ill-conditioned, and the simulation will fail to converge. 

Modeling sub-nanometer physics using macroscopic equations is a monumental task. As semiconductor nodes shrink past the 3nm threshold, traditional drift-diffusion equations collapse under the weight of quantum confinement, velocity overshoot, and quasi-ballistic transport . The physicist is therefore tasked with capturing non-classical behaviors—such as quantum tunneling, subband energy splitting, and deep trapping dynamics—using behavioral equations that compute rapidly enough to allow for the simulation of integrated circuits containing millions of transistors . Every parameter extracted, every empirical curve fitted, and every thermal coefficient assigned in the PSpice environment must strike a precarious balance between computational efficiency and rigorous physical fidelity. Device models must be continuous across all regions of operation—from subthreshold to strong inversion, and from the linear region to deep saturation. This exhaustive report details the architecture, extraction, validation, and future of these models within the Cadence PSpice ecosystem, demonstrating the profound interplay between foundry fabrication and pre-silicon digital simulation.

## Chapter 1: The PSpice Model Editor Ecosystem

The transition from a silicon foundry's raw experimental data to a fully functional circuit simulation requires a robust, integrated software ecosystem. The PSpice Model Editor serves as the critical bridge in this workflow, systematically translating physical behaviors and raw datasheet curves into structured, often encrypted `.lib` files. When semiconductor foundries characterize a new process node, they generate thousands of data points detailing current-voltage (I-V) and capacitance-voltage (C-V) relationships across extreme temperature ranges and process corners. This empirical data forms the basis of the Process Design Kit (PDK). The accuracy of the PDK dictates the success of pre-silicon validation, ensuring that billion-dollar integrated circuit designs function as intended before any physical prototyping or photolithography is undertaken .

Within the Cadence design environment, the PSpice Model Editor provides an automated framework for this translation. It accepts device characteristic curves and utilizes sophisticated numerical algorithms to generate the native SPICE syntax required for simulation. The editor allows physicists to seamlessly manage heterogeneous and homogeneous parts, attaching complex mathematical SPICE models directly to schematic symbols used in OrCAD Capture . This linkage is crucial for signal integrity analysis and printed circuit board (PCB) layout, as the model editor automatically creates the necessary schematic parts for all models in a library, ensuring that the physical footprint, the pin mapping, and the mathematical model are perfectly synchronized . 

The generation of these libraries is not merely a data entry task; it requires a deep understanding of the device's physical operation. Foundries rely on extraction tools that parse raw silicon measurements into parameter sets like BSIM3 or BSIM4 . The PSpice Model Editor supports editing these highly complex models through direct text edits or via template-based model creation . The physicist must provide initial parameter estimates to the software's optimization algorithms to ensure the resulting models are physically meaningful . This ecosystem thus transforms statistical variations in process technologies into deterministic mathematical frameworks, enabling circuit designers to explore complex behaviors using DC, AC, noise, and transient analyses without loss of accuracy .

## Chapter 2: Extracting Parameters from Datasheet Curves

The digitization of datasheet graphs into mathematical SPICE parameters is driven by advanced curve-fitting algorithms, most notably the Levenberg-Marquardt optimization algorithm . This algorithm provides a robust numerical solution to the problem of minimizing a non-linear function, effectively acting as a hybrid between the Gauss-Newton algorithm and the method of gradient descent. When extracting parameters from empirical I-V or C-V curves, the PSpice Model Editor utilizes this optimization algorithm to adjust model parameters iteratively until the simulated response converges with the measured data. 

The extraction process begins by defining an objective function, which quantifies the root mean square error (RMSE) between the simulated nodal currents and the experimental data points. Because semiconductor equations are highly non-linear, the parameter space is riddled with local minima. A naive extraction algorithm might mathematically fit the curve while producing physically impossible parameters—such as a negative junction capacitance, a threshold voltage that violates Fermi-Dirac statistics, or a mobility degradation coefficient that implies infinite carrier velocity. Therefore, the device physicist must provide bounded initial estimates based on the physical device structure . 

For instance, when extracting the parameters for a standard power MOSFET, the optimization algorithm must simultaneously fit the linear region (dominated by the on-state resistance, $R_{DS(on)}$), the saturation region (dominated by velocity saturation and channel length modulation), and the subthreshold region (dominated by diffusion currents). By isolating specific bias regions and extracting subsets of parameters sequentially, the PSpice Model Editor ensures that the resulting parameters reflect the true underlying physics. In modern methodologies, parameter scaling is often employed. Data is normalized using z-score normalization to ensure that exponential currents and linear capacitances are weighted appropriately during the extraction process . Min-max scaling restricts the extracted parameters to valid physical boundaries, preventing the Levenberg-Marquardt solver from diverging . The meticulous execution of this extraction workflow ensures that the final macro-model perfectly predicts both the static and dynamic characteristics of the physical transistor.

## Chapter 3: Advanced BJT and Diode Modeling

While planar MOSFETs and FinFETs dominate modern high-density digital logic, analog and mixed-signal designs heavily rely on the precision of Bipolar Junction Transistor (BJT) and diode models. The Gummel-Poon model remains the industry standard for BJT simulation in SPICE, significantly extending the basic Ebers-Moll model by incorporating base-width modulation (the Early effect), high-level injection, and dynamic transit times. 

The physics of the Early effect are parameterized by the forward and reverse Early voltages ($V_{AF}$ and $V_{AR}$). As the collector-base reverse bias increases, the depletion region extends deeper into the metallurgical base, narrowing the effective neutral base width. This increases the gradient of the minority carrier concentration, causing the collector current to rise despite a constant base-emitter voltage. In the PSpice Model Editor, extracting $V_{AF}$ requires identifying the intercept of the extrapolated output characteristic curves ($I_C$ versus $V_{CE}$) in the active region. 

Furthermore, the Gummel-Poon model accurately captures beta degradation (current gain roll-off) at both low and high injection levels. At low collector currents, recombination in the emitter-base space-charge region dominates, stealing carriers that would otherwise reach the collector. This is modeled by parameters such as the base-emitter leakage saturation current ($I_{SE}$) and the non-ideal emission coefficient ($N_E$). At high currents, the injected minority carrier density approaches or exceeds the background majority carrier doping concentration of the base. This initiates the Webster effect (which reduces the effective diffusion constant) and the Kirk effect (base push-out, where the effective base widens into the collector), leading to a sharp drop in current gain ($\beta$). These phenomena are mathematically captured by the forward high-current knee parameter ($I_{KF}$). 

Finally, dynamic switching behavior is governed by the forward and reverse transit times ($\tau_F$ and $\tau_R$), which dictate the amount of minority carrier charge stored in the base region during forward conduction. Accurate extraction of these transit times is essential for modeling the reverse recovery characteristics of high-speed switching diodes and the high-frequency cutoff ($f_T$) of RF BJTs. Without precise parameterization of the junction capacitance and transit times, SPICE simulations will fail to accurately predict the bandwidth limitations and switching delays inherent to bipolar analog circuits.

## Chapter 4: Deep Submicron and FinFET Models

As semiconductor technology scaled below the 100nm threshold, the traditional empirical models became increasingly inadequate. BSIM3 and BSIM4 models introduced extensive parameterization to handle deep submicron physics, specifically addressing the effective gate oxide thickness ($EOT$). In BSIM4, the model accepts electrical gate oxide thickness ($TOXE$) and physical gate oxide thickness ($TOXP$), calculating their difference ($DTOX$) to account for quantum mechanical charge-layer thickness . To model high-$\kappa$ dielectrics, BSIM4 allows designers to specify the dielectric constant ($EPSROX$), calculating an equivalent oxide thickness that prevents extreme gate leakage while maintaining high gate capacitance . 

However, as nodes approached 22nm and shrank further to 3nm, 3D multi-gate architectures such as FinFETs and Gate-All-Around FETs (GAAFETs) replaced planar transistors. This required a revolutionary leap in compact modeling, resulting in the BSIM-CMG (Common Multi-Gate) standard . The parameterization of BSIM-CMG models fundamentally shifts from empirical curve fitting to surface-potential-based physics. Unlike threshold-voltage-based models, BSIM-CMG solves Poisson's equation explicitly across the channel, providing a continuous evaluation of terminal currents and charges from subthreshold to strong inversion without relying on artificial smoothing functions .

Modeling sub-3nm nodes introduces immense physical challenges, primarily quantum confinement and severe short-channel effects like Drain-Induced Barrier Lowering (DIBL). In FinFETs and nanosheets, the cross-sectional area of the channel is so small that the continuous energy bands split into discrete subbands . The 2D density of states must be modeled to accurately calculate the inversion charge. BSIM-CMG accounts for this by integrating quantum mechanical effects into its core framework, utilizing parameters that tune the effective mass for up to three distinct subbands depending on the electrostatic dimension of the device . The density of states for the $i$-th subband is calculated relative to the Fermi energy and Fermi integrals, mapping electrostatics directly to quantum states .

| BSIM-CMG Parameter | Physical Significance | Impact on Sub-3nm Simulation |
| :--- | :--- | :--- |
| `GEOMOD` | Geometry selector (FinFET vs. GAAFET) | Dictates the analytical calculation of effective channel width ($W_{eff}$) and volume . |
| `BULKMOD` | Substrate configuration (SOI vs. Bulk) | Models substrate leakage paths and bulk charge effects . |
| `NFIN` | Number of fins/nanosheets per transistor | Multiplier for global binning parameters; defines total drive strength . |
| `EOT` | Equivalent Oxide Thickness | Defines the electrostatic coupling strength across high-$\kappa$ gate stacks . |
| `SHMOD` | Self-Heating Mode selector | Activates internal Cauer network to simulate mobility degradation due to heat . |

Additionally, modeling gate tunneling in extremely thin high-$\kappa$ dielectrics requires sophisticated equations for gate-to-channel ($I_{GCS}$, $I_{GCD}$) and gate-to-body ($I_{GB}$) currents . The BSIM-CMG model includes explicit quantum tunneling parameters (`AIGC`, `AIGS`, `AIGD`) that capture direct tunneling and Fowler-Nordheim tunneling dynamically based on the localized surface potential . Furthermore, velocity saturation ($v_{sat}$) and mobility degradation ($\mu_{eff}$) are heavily modulated by the transverse electric field and silicon thickness, captured by parameters like `U0`, `UA`, `UD`, and `VSAT` . To handle random process variations, BSIM-CMG uses global scaling parameters (`LMIN`, `LMAX`, `DLBIN`) that allow foundry PDKs to utilize binning, ensuring the model remains accurate across all drawn dimensions and structural variations during Monte Carlo simulations .

## Chapter 5: Wide-Bandgap (WBG) Devices

The proliferation of high-power electronics and electric vehicle drivetrains has driven the adoption of Wide-Bandgap (WBG) materials, specifically Gallium Nitride (GaN) and Silicon Carbide (SiC). Modeling these devices in SPICE requires a radical departure from silicon-centric physics. GaN High Electron Mobility Transistors (HEMTs) do not rely on a doped channel; instead, they operate via a two-dimensional electron gas (2DEG) formed by spontaneous and piezoelectric polarization at the AlGaN/GaN heterojunction interface . 

The most critical challenge in GaN HEMT modeling is capturing the dynamic $R_{DS(on)}$ phenomenon, also known as current collapse. When a GaN HEMT sustains a high off-state drain-to-source voltage ($V_{DS}$), electrons are injected and trapped in defect sites within the carbon-doped GaN buffer layer and at the surface interfaces . A higher off-state voltage causes more carriers to tunnel into these interface traps . When the device is subsequently turned on, the trapped electrons act as a virtual negative gate, repelling the 2DEG electrons and significantly increasing the on-resistance . This trapping and detrapping process is highly dynamic and depends on the switching frequency, duty cycle, and whether the converter operates under hard or soft switching conditions .

Under hard-switching conditions, the simultaneous presence of high voltage and high current induces hot-electron injection, exacerbating the dynamic $R_{DS(on)}$ degradation . Conversely, soft-switching techniques—such as Zero Voltage Switching (ZVS) or Quasi-Resonant Modes (QRM)—drastically reduce the hot-electron effect, mitigating the resistance increase and minimizing crossover power losses . 

To accurately simulate this in PSpice, state-of-the-art subcircuit models employ behavioral current sources and RC trapping networks governed by voltage-dependent time constants. These networks modify the nominal static $R_{DS(on)}$ in real-time during a transient simulation, acting as state variables that track the history of the applied stress . By embedding coefficients for voltage ($k_{dv}$), frequency ($k_{df}$), and temperature ($k_{th}$) into the conductive power loss equations, power electronics engineers can accurately predict conduction losses and thermal runaway in high-frequency MHz-range converters . Similarly, SiC MOSFET modeling requires unified physical subcircuits that carefully characterize parasitic inductances ($L_{cs}$) in the gate loop and non-linear junction capacitances ($C_{oss}$), which dominate switching transients and cause severe ringing if not accurately parameterized .

## Chapter 6: Modeling Non-Ideal Passives

The mathematical accuracy of active semiconductor models is rendered futile if the surrounding passive components are modeled ideally. In high-frequency power delivery networks, Multi-Layer Ceramic Capacitors (MLCCs) and ferromagnetic inductors exhibit profound non-linearities. MLCCs constructed with Class II dielectrics (such as X7R or Y5V) suffer from severe capacitance derating when subjected to a DC bias voltage, sometimes losing up to 70% of their nominal bulk capacitance . In PSpice, this phenomenon cannot be simulated with a standard linear capacitor. Instead, the MLCC is modeled using a behavioral charge source. The model integrates a Piecewise Linear (PWL) table of voltage-charge point pairs, accurately reflecting the physical integration of the voltage-dependent capacitance curve: $Q(v) = \int C(v) dv$ . This ensures that as the power supply rail fluctuates, the ripple voltage calculations remain physically accurate.

Inductor modeling presents an even greater mathematical challenge, requiring the meticulous calculation of high-frequency core losses, which consist of hysteresis loss, eddy current loss, and anomalous loss. The empirical Steinmetz equation is commonly utilized to estimate these losses based on the magnetic flux density ($B_m$) and frequency ($f$): 

$P_v = k \cdot f^\alpha \cdot (B_m)^\beta$

where $k$, $\alpha$, and $\beta$ are material-specific parameters (e.g., specific to iron powder or nanocrystalline cores) . However, the classical Steinmetz equation assumes sinusoidal excitation, which is completely invalid for the triangular or trapezoidal current waveforms found in hard-switching PWM converters .

Consequently, advanced SPICE subcircuits employ the Jiles-Atherton (J-A) model to capture the true nonlinear magnetic hysteresis mathematically. The J-A model uses coupled differential equations to calculate the total magnetization ($M$) as the sum of reversible ($M_{rev}$) and irreversible ($M_{irr}$) components . The anhysteretic magnetization ($M_{an}$) is modeled using the Langevin function, which describes the ideal thermodynamic alignment of magnetic domains .

| Jiles-Atherton Parameter | SPICE Symbol | Physical Meaning | Impact on Simulation |
| :--- | :--- | :--- | :--- |
| Saturation Magnetization | $M_s$ | Maximum alignment of magnetic dipoles | Dictates the absolute peak flux density before hard saturation . |
| Domain Wall Density | $A$ | Shape parameter for anhysteretic curve | Controls the slope of the B-H curve near the origin . |
| Domain Pinning | $K$ | Energy required to overcome pinning sites | Directly controls the coercive force and the width of the hysteresis loop . |
| Reversibility | $C$ | Ratio of reversible to irreversible change | Dictates the initial permeability during minor loop excursions . |
| Interdomain Coupling | $\alpha$ | Effective magnetic field interaction | Modifies the effective field ($H_e = H + \alpha M$) . |

By solving these ordinary differential equations dynamically in SPICE, utilizing directional parameters ($\delta = \text{sgn}(dH/dt)$) to track the trajectory of the magnetizing field, the model naturally produces the correct hysteresis loop area . This allows PSpice to compute precise instantaneous hysteresis power loss ($P_{core} = V_e \oint B dH$) regardless of the specific time-domain current waveform, eliminating the inherent errors of the basic Steinmetz approximation .

## Chapter 7: Thermal Modeling and Self-Heating

Power dissipation in semiconductors strictly dictates performance; carrier mobility degrades, threshold voltages shift, and leakage currents rise exponentially with temperature. Therefore, modern device modeling requires the encapsulation of the electrical SPICE model within a thermal `.SUBCKT` wrapper. This subcircuit exposes an auxiliary "thermal pin" that outputs a voltage analogous to the dynamic junction temperature ($T_j$), while accepting a current analogous to the instantaneous power dissipation ($P_{loss}$) . The laws of thermodynamics are thus simulated using electrical equivalents (Ohm's law for thermal resistance, capacitance for heat capacity). If the `SHMOD` parameter in advanced models like BSIM-CMG is activated, the core physics engine natively reads this thermal node to dynamically degrade mobility and shift subthreshold slopes .

The thermal impedance of the physical device packaging is modeled using equivalent RC networks, primarily categorized into Cauer and Foster topologies . 

| Thermal Topology | Network Structure | Physical Meaning | Primary Application |
| :--- | :--- | :--- | :--- |
| **Foster Network** | Series-connected parallel RC tanks | Purely mathematical extraction via partial fraction expansion | Easy to extract from measured thermal step-response cooling curves . |
| **Cauer Network** | Cascaded series R, shunt C ladder | Direct discretization of the 1D heat conduction equation | Physical nodes correspond directly to material layers (die, solder, heatsink) . |

While semiconductor manufacturers frequently provide Foster network parameters because they are easily derived from non-destructive thermal transient testing, the internal nodes of a Foster network have no physical significance . A capacitor in a Foster network cannot be tapped to find the temperature of the die-attach solder. In contrast, every node in a Cauer network represents a physical thermal mass. 

Because finite element analysis (FEA) and exact boundary conditions demand physical nodes, the PSpice simulator and associated model editors utilize mathematical transformation matrices (such as continued fraction expansions) to convert empirical Foster parameters into physically meaningful Cauer networks . This transformation allows the simulator to calculate the dynamic thermal heat flow, capturing both the ultra-fast thermal time constants of the 3nm silicon fin and the slow thermal mass of the external copper heatsink. Consequently, engineers can accurately predict thermal runaway and junction failure during transient load steps or short-circuit fault conditions .

## Chapter 8: Encrypting Models for IP Protection

The transition from theoretical device physics to commercial foundry implementation involves the expenditure of billions of dollars in research and development. The finely tuned parameters of a 3nm BSIM-CMG model or the proprietary trapping coefficients of a discrete GaN HEMT represent highly sensitive intellectual property (IP). If a foundry were to distribute its `.lib` SPICE files in plain text, competitors could easily reverse-engineer the physical attributes of the process technology, exposing proprietary oxide thicknesses, complex doping profiles, fin dimensions, and mobility enhancement techniques.

To prevent this, IC manufacturers utilize Cadence tools to encrypt their proprietary library files before releasing them to fabless design houses. The PSpice model encryption utility processes the plain text netlists, obscuring the physical parameters and subcircuit hierarchies using advanced asymmetric cryptographic algorithms . Models can be encrypted to bind them strictly to specific simulation tools or vendors, preventing unauthorized porting. When the simulation is executed, PSpice decrypts the models dynamically in volatile memory, allowing the mathematical engine to access the underlying equations and parameters without ever exposing the raw syntax or physical constants to the end user . This encryption ecosystem ensures that digital and analog designers can perform accurate signal integrity, timing, and power analyses, while the foundry's underlying sub-nanometer quantum physics and material science remain strictly protected from industrial espionage.

## Chapter 9: Verifying Model Fidelity

A SPICE model is only as useful as its correlation to physical reality. Therefore, a strict, standardized methodology for verifying model fidelity is essential before releasing a PDK. Verification relies on constructing automated PSpice testbenches that stress the model across all operating quadrants and comparing the output against measured hardware data. 

For steady-state validation, multiple DC sweeps are executed to verify the output characteristics ($I_D-V_{DS}$) and transfer characteristics ($I_D-V_{GS}$) across varying ambient temperatures. The accuracy of the fit is quantified using statistical metrics, such as the Root Mean Square Error (RMSE). In complex nonlinear scenarios—such as magnetic core hysteresis—simple point-to-point error is insufficient. Instead, the Hausdorff distance is calculated to measure the geometric mismatch between the extremities of the simulated and empirical minor hysteresis loops. This is coupled with calculations of the total loop area mismatch ($\Delta A$) to verify that core loss integrations are accurate .

Transient validation is particularly critical for wide-bandgap devices operating at high frequencies. Double-pulse test (DPT) circuit testbenches are constructed in SPICE to replicate hardware switching environments . By closely matching the $dv/dt$ and $di/dt$ slew rates, the non-linear voltage-dependent parasitic capacitances ($C_{iss}, C_{oss}, C_{rss}$) and the dynamic $R_{DS(on)}$ trapping models are rigorously verified . If the time-domain waveforms exhibit discrepancies in turn-on delay, peak overshoot, or reverse recovery charge ($Q_{rr}$), the physicist must iteratively refine the interelectrode capacitance models or the transit time parameters . Ultimately, a model is only certified when the simulated switching energy ($E_{on}$ and $E_{off}$) perfectly mirrors the physical component's response under both hard and soft switching conditions.

## Chapter 10: The Future of Device Modeling

The relentless scaling of transistor geometries and the increasing complexity of quantum mechanical effects are pushing traditional mathematical compact models to their computational limits. Evaluating the massive arrays of transcendental equations required for BSIM-CMG or advanced GaN models consumes substantial CPU time, creating a bottleneck for the transient simulation of large-scale systems-on-chip (SoCs). The future of device modeling lies in the integration of Artificial Intelligence, specifically Physics-Informed Neural Networks (PINNs) and Multi-Task Learning (MTL) algorithms .

Rather than calculating physical parameters through complex analytical equations during every Newton-Raphson iteration, a PINN is trained on highly calibrated 3D TCAD (Technology Computer-Aided Design) data and Monte Carlo simulations . By embedding the governing physical laws—such as charge conservation, Ampere's loop law, and Poisson’s equation—directly into the loss function of the neural network, the model is forced to yield physically realistic predictions rather than purely statistical correlations . 

Furthermore, MTL algorithms are currently being deployed to perform real-time extraction of BSIM-CMG parameters for varying structural dimensions. Traditional sequential artificial neural networks (ANNs) extract C-V and I-V parameters in isolated steps, leading to high Root Mean Square Relative Errors (RMSREs) . In contrast, MTL utilizing a shared representation structure simultaneously trains on multiple physical characteristics (e.g., gate length $L_g$, nanosheet thickness $T_{ns}$, and channel width $W_{ns}$) alongside scaled current ($I_{d,scale}$) and capacitance ($C_{gg}$) data . 

When deployed inside a SPICE engine via Verilog-A, these machine learning models replace complex trigonometric, hyperbolic, and exponential math with highly optimized matrix multiplications. This hybrid AI-physics approach promises to drastically accelerate transient simulation times while preserving the quantum-mechanical accuracy required to design the next generation of sub-nanometer integrated circuits, permanently altering the landscape of semiconductor device physics and foundry architecture. 



## Sources

- [**jommpublish.org** BSIM-CMG compact model for IC CAD: from FinFET to Gate-All](https://www.jommpublish.org/p/59/)
- [**researchgate.net** BSIM-CMG Compact Model for IC CAD: from FinFET to Gate-All](https://www.researchgate.net/publication/348381489_BSIM-CMG_Compact_Model_for_IC_CAD_from_FinFET_to_Gate-All-Around_FET_Technology)
- [**mdpi.com** Pre-Silicon Accurate SPICE Modeling of Trench MOSFETs via](https://www.mdpi.com/2072-666x/16/8/955)
- [**mikrocontroller.net** Complete.PCB.Design.Using.OrCAD.Capture ... - Mikrocontroller.net](https://www.mikrocontroller.net/attachment/353954/Complete.PCB.Design.Using.OrCAD.Capture.And.PCB.Editor_2009.pdf)
- [**guiyuntech.com** Allegro PSpice System Designer_Guiyun Electronics](https://www.guiyuntech.com/lists/details/id/78/view/pro)
- [**kolegite.com** PSpice User Guide](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%B0%D0%BD%D0%B5%D1%82%D0%BE%20%D0%B2%20%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0%D1%82%D0%B0/PSpice%2017.2%20User%20Guide%20%28pspug%29.pdf)
- [**researchgate.net** Modeling of Wide-Bandgap Power Semiconductor Devices—Part II](https://www.researchgate.net/publication/318727444_Modeling_of_Wide-Bandgap_Power_Semiconductor_Devices-Part_II)
- [**mdpi.com** Design of a Laser Driver and Its Application in Gas Sensing - MDPI](https://www.mdpi.com/2076-3417/12/12/5883)
- [**researchgate.net** (PDF) Numerical determination of Jiles‐Atherton model parameters](https://www.researchgate.net/publication/235263208_Numerical_determination_of_Jiles-Atherton_model_parameters)
- [**oasis.postech.ac.kr** Multi-Task Learning for Real-Time BSIM-CMG Parameter Extraction](https://oasis.postech.ac.kr/bitstream/2014.oak/125412/1/Multi-Task_Learning_for_Real-Time_BSIM-CMG_Parameter_Extraction_of_NSFETs_With_Multiple_Structural_Variations.pdf)
- [**scribd.com** Bsim4 Manual | PDF - Scribd](https://www.scribd.com/doc/101441431/bsim4-manual)
- [**scribd.com** BSIM4 Manual | PDF | Mosfet | Dielectric - Scribd](https://www.scribd.com/document/41887274/BSIM4-Manual)
- [**academia.edu** (PDF) BSIM—SPICE Models Enable FinFET and UTB IC Designs](https://www.academia.edu/98591178/BSIM_SPICE_Models_Enable_FinFET_and_UTB_IC_Designs)
- [**scribd.com** BSIM-CMG 112.0.0beta2 Technical Manual | PDF - Scribd](https://www.scribd.com/document/808293021/BSIM-CMG-112-0-0beta2-Technical-Manual)
- [**simplis.com** BSIM-CMG MOSFET (FinFET) - Simulator Reference - SIMPLIS](https://simplis.com/documentation/simetrix/simulator_reference/topics/analogdevicereference_bsimcmgmosfet.htm)
- [**scribd.com** BSIMCMG108 0 0manual | PDF | Field Effect Transistor - Scribd](https://www.scribd.com/document/815575200/BSIMCMG108-0-0Manual)
- [**scribd.com** Slide | PDF | Electrical Resistance And Conductance - Scribd](https://www.scribd.com/document/1049790338/Slide)
- [**scribd.com** BSIM6.1.1 Technical Manual | PDF | Field Effect Transistor - Scribd](https://www.scribd.com/document/815575202/BSIM6-1-1-Technical-Manual)
- [**preprints.org** An Analytical Model of Dynamic Power Losses in eGaN HEMT](https://www.preprints.org/manuscript/202307.0804)
- [**pmc.ncbi.nlm.nih.gov** An Analytical Model of Dynamic Power Losses in eGaN HEMT](https://pmc.ncbi.nlm.nih.gov/articles/PMC10456439/)
- [**pure.coventry.ac.uk** Characterisation and Modeling of Gallium Nitride Power](https://pure.coventry.ac.uk/ws/portalfiles/portal/28015376/Binder4.pdf)
- [**researchgate.net** A Review of GaN HEMT Dynamic ON-Resistance ... - ResearchGate](https://www.researchgate.net/publication/374124502_A_Review_of_GaN_HEMT_Dynamic_ON-Resistance_and_Dynamic_Stress_Effects_on_Field_Distribution)
- [**eevblog.com** GaN HEMT "Dynamic Rdson" - EEVblog](https://www.eevblog.com/forum/projects/gan-hemt-dynamic-rdson/)
- [**powerelectronicsnews.com** Demonstrating GaN-HEMT Based Dynamic Rds(on) Resistance in](https://www.powerelectronicsnews.com/demonstrating-gan-hemt-based-dynamic-rdson-resistance-in-high-frequency-power-converter/)
- [**mdpi.com** A GaN-HEMT Compact Model Including Dynamic RDSon Effect for](https://www.mdpi.com/1996-1073/14/8/2092)
- [**research.unipd.it** Reliability and dynamic properties of GaN devices](https://www.research.unipd.it/retrieve/e14fb26f-dd06-3de1-e053-1705fe0ac030/Alessandro_Barbato_tesi.pdf)
- [**researchgate.net** (PDF) An Overview of Strengths and Weaknesses in Using MOSFET](https://www.researchgate.net/publication/373876006_An_Overview_of_Strengths_and_Weaknesses_in_Using_MOSFET_Experience_for_Modeling_GaN_HEMT)
- [**home.cc.umanitoba.ca** Design, Implementation, and Validation of Electro-Thermal](https://home.cc.umanitoba.ca/~honm3/Journals/41_2021_Xu_SiC_PSCAD.pdf)
- [**sound-au.com** Capacitor Characteristics - Elliott Sound Products](https://sound-au.com/articles/capacitors.htm)
- [**vtechworks.lib.vt.edu** Load-Indepedent Class-E Power Conversion - VTechWorks](https://vtechworks.lib.vt.edu/bitstream/handle/10919/97601/Zhang_L_D_2020.pdf?sequence=1&isAllowed=y)
- [**simplistechnologies.com** Multi-Level PWL Capacitor w/ Level 0-3 (Version 8.0+) - SIMPLIS](https://www.simplistechnologies.com/documentation/simplis/sp_00_master/topics/multi_level_pwl_capacitor.htm)
- [**researchgate.net** (PDF) Modelling the power losses in the ferromagnetic materials](https://www.researchgate.net/publication/318903925_Modelling_the_power_losses_in_the_ferromagnetic_materials)
- [**mdpi.com** SPICE-Aided Models of Magnetic Elements—A Critical Review - MDPI](https://www.mdpi.com/1996-1073/16/18/6568)
- [**semanticscholar.org** Comprehensive SPICE Model for Power Inductor Losses](https://www.semanticscholar.org/paper/Comprehensive-SPICE-Model-for-Power-Inductor-Losses-Ehrlich-Joffe/c03d0b7f3c8604a51c53b78b9edab7ba02b4a877)
- [**researchgate.net** (PDF) Jiles-Atherton Magnetic Hysteresis Parameters Identification](https://www.researchgate.net/publication/234037268_Jiles-Atherton_Magnetic_Hysteresis_Parameters_Identification)
- [**mdpi.com** Modeling of Magnetic Elements Including Losses—Application to](https://www.mdpi.com/1996-1073/13/8/1865)
- [**mdpi.com** Improved Jiles–Atherton Magnetic Core Model and Its SPICE ... - MDPI](https://www.mdpi.com/2079-9292/15/5/1009)
- [**researchgate.net** Hysteresis loops obtained from known parameters - ResearchGate](https://www.researchgate.net/figure/Hysteresis-loops-obtained-from-known-parameters-M-s-14-1-470-000-A-m-a-14-40-A-m-a-14_fig1_235263208)
- [**zenodo.org** Study and Modeling of Ferromagnetic Hysteresis - Zenodo](https://zenodo.org/records/1270560/files/article.pdf)
- [**researchgate.net** Modelling thermal properties of large LED modules - ResearchGate](https://www.researchgate.net/publication/337985378_Modelling_thermal_properties_of_large_LED_modules)
- [**mdpi.com** Measurements and Computations of Internal Temperatures ... - MDPI](https://www.mdpi.com/2079-9292/10/2/210)
- [**dokumen.pub** Theory and Practice of Thermal Transient Testing of Electronic](https://dokumen.pub/theory-and-practice-of-thermal-transient-testing-of-electronic-components-9783030861735-9783030861742.html)
- [**iris.univr.it** Fault-based Analysis of Industrial Cyber-Physical Systems - IRIS](https://iris.univr.it/retrieve/47406128-c39f-4825-bf20-4f36f678da8a/2023_PhD_Thesis_Nicola_DallOra.pdf)
- [**researchgate.net** Extracted RC component model and its comparison with the 3-D](https://www.researchgate.net/figure/Extracted-RC-component-model-and-its-comparison-with-the-3-D-FEM-and-the-RCCM-a_fig4_3423348)
- [**researchgate.net** Electronic Engineering - Science topic - ResearchGate](https://www.researchgate.net/topic/Electronic-Engineering)
- [**oth-aw.de** Forschungsbericht-2015.pdf - OTH Amberg-Weiden](https://www.oth-aw.de/files/oth-aw/Aktuelles/Veroeffentlichungen/Forschungsbericht/Forschungsbericht-2015.pdf)
- [**ieeexplore.ieee.org** Accurate Measurement of Dynamic ON-State Resistances of GaN](https://ieeexplore.ieee.org/iel7/63/9088165/09000652.pdf)
- [**scribd.com** Sazz Converter | PDF | Field Effect Transistor | Capacitor - Scribd](https://www.scribd.com/document/421600991/Sazz-Converter)
- [**youtube.com** Deep Learning 35. Physics-Informed Neural Networks (PINN)](https://www.youtube.com/watch?v=8RwgcwxcpZo)
- [**books.google.com** FinFET/GAA Modeling for IC Simulation and Design: Using the BSIM](https://books.google.com/books/about/FinFET_GAA_Modeling_for_IC_Simulation_an.html?id=SZ4bEQAAQBAJ)
- [**youtube.com** FinFET Modeling for IC Simulation and Design - YouTube](https://www.youtube.com/watch?v=yqc6EYofqIs)
- [**research.chalmers.se** Parameter Extraction and SPICE Modeling of Packaged GaN Power](https://research.chalmers.se/publication/552294/file/552294_Fulltext.pdf)
- [**scribd.com** Thermal Modeling of Planar Magnetics | PDF | Heat Transfer - Scribd](https://www.scribd.com/document/644573382/Thermal-Modeling-of-Planar-Magnetics-pdf)
- [**simtool.com** SPICE Circuit Simulation: Transient Analysis for Power Supply Design](https://www.simtool.com/article/spice-circuit-simulation-transient-analysis-for-power-supply-design/)
- [**ieeexplore.ieee.org** IBIS Summit Holds First Meeting at IEEE EMC+SIPI Symposium](https://ieeexplore.ieee.org/iel7/5962381/9241528/09241569.pdf)
- [**ibis.org** IBIS Open Forum Minutes](https://ibis.org/minutes/min2020/m082820.pdf)
- [**passive-components.eu** Inductor Simulation with LTSpice - Passive Components Blog](https://passive-components.eu/inductor-simulation-with-ltspice/)
- [**kahedu.edu.in** FACULTY OF ENGINEERING](https://kahedu.edu.in/n/wp-content/uploads/2026/01/PG-VLSI-Final-to-upload-in-website.pdf)
- [**engineering.upenn.edu** PSpice User's Guide - Penn Engineering](https://www.engineering.upenn.edu/~jan/spice/PSpice_UserguideOrCAD.pdf)
- [**sites.google.com** Clemson Cadence Project - Jarrett's Guides (Compiled)](https://sites.google.com/g.clemson.edu/clemson-cadence-project/by-students/student-written-guides/jarretts-guides-compiled)
- [**karadev.net** Complete PCB Design Using OrCad Capture and Layout - karadev.net](http://karadev.net/uroci/filespdf/files/Complete_PCB_design_using_orcad_capture_and_layout.pdf)
- [**dokumen.pub** Simulation of Power Electronics Converters Using PLECS](https://dokumen.pub/simulation-of-power-electronics-converters-using-plecs-0128173645-9780128173640.html)
- [**scribd.com** IGBT Handbook | PDF | Bipolar Junction Transistor | Mosfet - Scribd](https://www.scribd.com/document/229159865/IGBT-Handbook)
- [**plexim.com** PLECS - User Manual - Plexim](https://www.plexim.com/sites/default/files/plecsmanual.pdf)
- [**pmc.ncbi.nlm.nih.gov** Power Losses Models for Magnetic Cores: A Review - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8954854/)
- [**pubs.aip.org** Calculation of core hysteresis loss resistance for Buntenbach's](https://pubs.aip.org/aip/adv/article-pdf/doi/10.1063/5.0162212/18297106/015116_1_5.0162212.pdf)
- [**scribd.com** BSIM-SOI 4.6.0 Technical Manual | PDF | Mosfet - Scribd](https://www.scribd.com/document/569971153/BSIM-SOI-4-6-0-Technical-Manual)
- [**vdoc.pub** Finfet Modeling For Ic Simulation And Design: Using The Bsim-cmg](https://vdoc.pub/documents/finfet-modeling-for-ic-simulation-and-design-using-the-bsim-cmg-standard-5teikr79jg00)
- [**mdpi.com** SPICE-Aided Compact Electrothermal Model of Impulse Transformers](https://www.mdpi.com/2076-3417/11/19/8894)
- [**oar.princeton.edu** How MagNet: Machine Learning Framework for Modeling Power](https://oar.princeton.edu/bitstream/88435/pr1rv0d10n/1/HowMagNet.pdf)
- [**scribd.com** HSPICE® Reference Manual Elements and Device Models - Scribd](https://www.scribd.com/document/568418834/HSPICE-Reference-Manual-Elements-and-Device-Models)
- [**web.stanford.edu** Star-Hspice Manual - Stanford University](https://web.stanford.edu/class/archive/ee/ee371/ee371.1066/tools/hspice.pdf)
- [**eprints.soton.ac.uk** University of Southampton Research Repository ePrints Soton](https://eprints.soton.ac.uk/id/eprint/368484/1/prw_phd.pdf)
- [**hpc.mtech.edu** The AC/DC Module User's Guide](http://hpc.mtech.edu/comsol/pdf/ACDC_Module/ACDCModuleUsersGuide.pdf)
- [**doc.comsol.com** The AC/DC Module User's Guide - COMSOL Documentation](https://doc.comsol.com/6.3/doc/com.comsol.help.acdc/ACDCModuleUsersGuide.pdf)
- [**sites.units.it** SPICE: - PHP 8.2.31 - UniTS](https://sites.units.it/carrato/didatt/doc/spice.pdf)
- [**rincon-mora.gatech.edu** PSpice Reference Manual](https://rincon-mora.gatech.edu/spice/pspice.pdf)
- [**researchgate.net** Dynamic on-state resistance evaluation of GaN devices under hard](https://www.researchgate.net/publication/324618791_Dynamic_on-state_resistance_evaluation_of_GaN_devices_under_hard_and_soft_switching_conditions)
- [**powerelectronicsnews.com** GaN HEMTs: Some Device Characteristics and Application Tradeoffs](https://www.powerelectronicsnews.com/gan-hemts-some-device-characteristics-and-application-tradeoffs/)
- [**publikationen.bibliothek.kit.edu** Improved Test Circuit for Characterization of the Dynamic On](https://publikationen.bibliothek.kit.edu/1000176527/155655990)
- [**ams-publications.ee.ethz.ch** The Impact of Multi-MHz Switching Frequencies on Dynamic On](https://www.ams-publications.ee.ethz.ch/uploads/tx_ethpublications/6_DynamicRon_MHzFrequencies_FINAL_Zulauf.pdf)
- [**peardrop.co.uk** File menu commands - Glade Reference Manual](https://peardrop.co.uk/docs/file_menu.htm)
