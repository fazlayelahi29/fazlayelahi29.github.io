# Synergistic Physics-Informed Machine Learning and Semi-Empirical Compact Modeling for Sub-2nm Monolithic CFET DTCO

## The Angstrom-Era Imperative and the Compact Modeling Bottleneck

As semiconductor logic scaling penetrates the deep sub-2nm (Angstrom) regime, traditional multi-gate architectures, including standard FinFETs and planar Gate-All-Around (GAA) Nanosheet FETs (NSFETs), face insurmountable geometric, parasitic, and thermodynamic limits. The continuous demand for higher transistor density, driven by artificial intelligence, edge computing, and high-performance computing, requires a transition from single-tier two-dimensional scaling to true three-dimensional integration. The Complementary Field-Effect Transistor (CFET), which features an n-type FET stacked vertically over a p-type FET (or vice versa) while sharing a common gate, has emerged as the definitive architecture for advanced technology nodes. By folding the traditional CMOS inverter footprint in half, CFET architectures offer a viable path to standard cell standard track heights of 4T or even 3T, unlocking unprecedented area scaling without severely compromising drive current.

  

However, realizing the full power-performance-area-cost (PPAC) benefits of CFET technology mandates a rigorous Design-Technology Co-Optimization (DTCO) process. This process must account for highly complex Front-End-of-Line (FEOL) physics and extraordinarily dense Middle-of-Line (MOL) parasitic networks. At the core of this DTCO workflow lies the compact model: a sophisticated mathematical abstraction that acts as the bridge between fundamental Technology Computer-Aided Design (TCAD) simulations and circuit-level Simulation Program with Integrated Circuit Emphasis (SPICE) evaluations. The industry-standard framework for this task is the Berkeley Short-channel IGFET Model for Common Multi-Gate (BSIM-CMG). While BSIM-CMG is highly robust and rigorously grounded in surface-potential and quasi-ballistic transport physics, its purely semi-empirical nature becomes a critical liability when applied to the extreme physical complexities of monolithic CFETs.

  

Capturing the quantum confinement, process variations, complex capacitance coupling, and severe localized self-heating of a monolithic CFET requires expanding the BSIM-CMG parameter set into the thousands. The manual extraction and optimization of these parameters from TCAD data suffer from highly non-convex loss landscapes, often trapping traditional derivative-free optimizers in local minima and requiring months of engineering effort. Furthermore, the resulting models typically exhibit narrow operational coverage, poor extrapolation integrity outside their calibrated design space, and debilitating SPICE simulation runtimes.

  

To overcome these fundamental barriers, the electronic design automation ecosystem is pivoting toward Hybridized Framework Compact Models. This paradigm integrates Physics-Informed Machine Learning (PIML) and symbolic regression neural architectures with foundational semi-empirical compact models. By synergistically leveraging deep learning for dynamic non-linear fitting and physics-based equations for analytical stability and extrapolation integrity, these hybrid frameworks preserve the accuracy of high-fidelity TCAD models while achieving the inference speed and standard compliance required for next-generation SPICE integration.

  

## Monolithic CFET Architectures and Angstrom-Era Scaling Dynamics

Before establishing the requirements for a hybridized compact model, it is crucial to fully deconstruct the architectural evolution and the physical complexities of the CFET operating at the A10 (10 Angstrom / 1nm), A5, and A3 technology nodes. CFETs can generally be categorized into two primary integration schemes: sequential CFETs and monolithic CFETs (mCFETs).

  

The sequential CFET approach utilizes wafer bonding technology, fabricating the bottom device first, bonding a new channel material layer, and subsequently processing the top device. This allows for independent optimization of the top and bottom channels, lower thermal budget constraints for the bottom device during top-device processing, and the integration of highly heterogeneous materials, such as combining a silicon (Si) bottom channel with a germanium (Ge) or two-dimensional transition metal dichalcogenide (2D-TMD) top channel. It also simplifies the realization of split-gate configurations, which are advantageous for complex sequential standard cells (e.g., flip-flops, multiplexers) by allowing independent control of the top and bottom channels, often resulting in 15% to 20% smaller area in specific complex cells. However, the dual-active and dual-gate layer processing results in high manufacturing costs and challenging gate-to-gate interconnect requirements.

  

Conversely, the monolithic CFET integrates both the n-type and p-type nanosheet channels concurrently on a single starting substrate. This fully self-aligned process is widely considered the most viable path to high-volume manufacturing due to its tighter gate connections, elimination of complex inter-tier bonding, and significantly lower cost per wafer. Monolithic integration offers a superior reduction in total gate capacitance and parasitic resistance between gate contacts, allowing monolithic CFET-based ring oscillators to achieve higher operating frequencies than both standard CMOS and sequential equivalents.

  

### Interconnect Topologies and 3D SRAM Innovations

To fully leverage the density of monolithic CFETs, the industry is revolutionizing standard cell routing and Static Random Access Memory (SRAM) design. Traditional CFET configurations demand a holistic reconsideration of multi-row structures to maximize area benefits, given the limited in-cell routing tracks caused by the reduced cell height. Using advanced Satisfiability Modulo Theories (SMT)-based physical synthesis frameworks, multi-row 2.5T CFET architectures utilizing specific Upper/Lower M0A/PC routing schemes can achieve over 20% reduced cell areas compared to 3.5T baseline CFETs.

  

Furthermore, standard 6T-SRAM designs face significant scaling walls. To circumvent this, engineers are introducing novel Double-Side Cross-Coupled Interconnect (DSCI) techniques. DSCI separates the complex cross-coupling logic across both the frontside and backside of the wafer, optimizing via placement and reducing routing congestion. Simulated monolithic CFET SRAMs employing DSCI at the A5 node achieve up to a 28% bit-cell area reduction compared to standard single-sided CFET SRAM designs. The transition to backside power delivery networks (BSPDN) combined with direct backside contacts (DBC) for the bottom device allows the frontside Middle-of-Line (MOL) layers to be dedicated entirely to signal routing.

  

Pushing integration further, researchers have demonstrated theoretical three-tier and four-tier stacked CFET SRAM topologies. By extending the vertical stacking to allocate the pull-up (PU), pull-down (PD), and pass-gate (PG) transistors onto separate tiers within the same nanosheet stack, high-density (HD) A5 and A3 node designs achieve massive area reductions. A 3-tier 3D SRAM can yield up to a 70% reduction in cell area relative to equivalent planar configurations, maintaining compliance with aggressive A5 design rules while relaxing metal widths and via connections.

  

## FEOL Physics, MOL Parasitics, and Electrothermal Challenges

The unparalleled density of the monolithic CFET introduces distinct physical and parasitic challenges that a compact model must accurately resolve to ensure functional circuit design. These challenges are broadly categorized into Middle Dielectric Isolation (MDI) parasitics, process-induced variation, and self-heating effects.

  

### Middle-of-Line (MOL) Parasitic Extraction and Conformal Mapping

The Middle-of-Line (MOL) parasitic capacitance represents the most critical performance bottleneck in vertically stacked CFETs. In traditional lateral devices, source/drain contacts and vias are spread horizontally. In a monolithic CFET, the signal vias, power vias, and local interconnects for both the top and bottom devices must be routed through the identical vertical footprint. To physically isolate the top and bottom active regions and manage these intense vertical electric fields, advanced structures such as the inner spacer and Middle Dielectric Isolation (MDI) modules are employed. The inner spacer, sometimes tailored into complex geometries like the "dog-bone" shape utilized in TSMC's designs, is critical to extending the extension length and isolating parasitic bottom transistor effects.

  

However, even with optimized MDI, the dense routing introduces profound parasitic capacitance that heavily impacts AC performance. Extracting this capacitance requires modeling multi-path electrostatic interactions. A standard TCAD-calibrated modeling framework for a 3-nm monolithic CFET assumes base parameters such as a physical gate length ($L_g$) of 16 nm, nanosheet width ($W_{nsh}$) of 20 nm, top-to-bottom device separation ($D_{n/pFET}$) of 30 nm, and a contact poly pitch (CPP) of 45 nm to 60 nm.

  

Under these parameters, integrating MOL parasitics into the compact model increases the total parasitic capacitance of the CFET by approximately 20%. To avoid the prohibitive computational cost of 3D TCAD simulations during circuit evaluation, modern BSIM-CMG frameworks integrate analytical conformal mapping techniques. Conformal mapping uses Schwarz-Christoffel transformations to decompose the complex 3D MOL multi-path interactions into well-defined analytical 2D boundary regions.

  

|**Capacitance Component**|**Geometric Coupling Region**|**Impact on Total CFET Capacitance (FO1)**|
|---|---|---|
|Gate-to-Drain ($C_{gd}$)|Planar and Fringing fields across spacer|High|
|Gate-to-nFET-Source ($C_{gs,n}$)|FEOL / MOL interface|Moderate|
|Gate-to-pFET-Source ($C_{gs,p}$)|FEOL / MOL interface through MDI|Moderate|
|MOL Via Coupling ($C_{MOL,via}$)|Regions 7, 8, 12, 14, 18, 19, 27, 28, 29, 33-40|Dominant (>50% at FO1)|

Table 1: Decomposition of parasitic capacitance components in monolithic CFET structures using conformal mapping parameters.

  

Capacitances corresponding to specific geometric local regions (e.g., $C_{7,7}$, $C_{29,29}$, $C_{7,16}$, $C_{27,28}$) represent perpendicular, co-planar, and offset parallel plate couplings between the dense via arrays and the shared gate. Post-layout analysis reveals a severe dependency on geometric scaling: increasing the power via width ($W_{PV}$) or signal via width ($W_{SV}$) expands localized coupling regions (like Regions 19 and 7), increasing the $C_{MOL,via}$ fractional contribution. Furthermore, capacitance analysis demonstrates that under low fan-out conditions (FO1), the MOL domain accounts for more than half of the total device parasitics. As the fan-out increases in multi-stage ring oscillators, the performance degradation driven by MOL capacitance scales exponentially. A robust compact model must continuously evaluate these conformal mapping equations dynamically during SPICE runtime to ensure accurate RC delay predictions.

  

### Process-Induced Variations and Stochastic Reliability

Monolithic CFETs exhibit unique sensitivities to manufacturing process variations. To tune the threshold voltage ($V_{th}$) for both the top and bottom devices independently within the shared gate trench, complex dual-metal gate deposition and selective etching are required. This introduces severe Gate Edge Roughness (GER), Line Edge Roughness (LER), and Work-Function Variation (WFV).

  

Unlike traditional non-stacked NSFETs, the GER in monolithic CFETs demonstrates a unique negative correlation with the p-type work-function (p-WF) liner thickness. The shared gate volume and extreme geometric confinement mean that variations in the poly-silicon or metal grain sizes have asymmetric impacts on the stacked devices. Through calibrated statistical TCAD simulations modeling a nominal 5 nm metal grain size, researchers observed that the coefficient-of-variance (CV) for the bottom pFET (2.19) is significantly higher than that of the top nFET (1.45). This asymmetric variability severely degrades the read/write margins of standard cells; HSPICE Monte Carlo simulations incorporating these stochastic fluctuations predict a -10% to +20% variation in power consumption for standard NOR2 gates.

  

### Self-Heating Effects (SHE) and Electrothermal Dynamics

The three-dimensional architecture of the monolithic CFET inherently degrades heat dissipation. In planar or basic FinFET architectures, the massive silicon substrate acts as a highly efficient thermal sink. In a monolithic CFET, the upper channel (typically the nFET) is suspended within layers of highly insulating low-k dielectrics, resulting in extreme thermal resistance ($R_{th}$).

  

During AC transient operation (such as within a CMOS inverter), modifying the vertical spacing between the nFET and pFET ($D_{n/pFET}$) illustrates a critical DTCO trade-off. Reducing $D_{n/pFET}$ from 30 nm to 10 nm yields a 3.4% reduction in dynamic power loss and an 11.9% improvement in operating frequency due to shorter local interconnects and reduced MOL via capacitance. However, this dense integration induces an 11.2% higher rise in peak device temperature ($T_{max}$) due to intense thermal cross-talk between the channels.

  

Elevated temperatures drastically alter carrier mobility, subthreshold swing, and leakage currents, while simultaneously accelerating aging mechanisms like bias temperature instability (BTI) and electromigration. At the circuit level, temperature fluctuations significantly impact memory stability. When the operating temperature of a 6T-SRAM array is increased from 300 K to 398 K, the Read Static Noise Margin (RSNM) and Hold Static Noise Margin (HSNM) degrade by 13.7% and 6.37%, respectively. Paradoxically, the Write Static Noise Margin (WSNM) improves by 18.3% due to thermally-induced shifts in transistor drive strength ratios. Consequently, any accurate compact model must seamlessly integrate dynamic electrothermal self-heating networks capable of executing inside SPICE without creating convergence failures.

  

## Limitations of Baseline Semi-Empirical Models (BSIM-CMG)

The foundation of modern device modeling is the Berkeley Short-channel IGFET Model – Common Multi-Gate (BSIM-CMG). BSIM-CMG uses a surface-potential-based core that self-consistently solves Poisson's equation and carrier continuity equations across the drift-diffusion and quasi-ballistic transport regimes. It applies sophisticated corrections for quantum capacitance via density-gradient models, accounts for thin-layer mobility degradation, integrates velocity saturation for high drain bias, and explicitly separates Schottky barrier injection from channel transport when modeling advanced contacts.

  

While theoretically rigorous, mapping BSIM-CMG to the monolithic CFET introduces three critical bottlenecks that disrupt the DTCO flow:

  

1. **Parameter Explosion and Extraction Difficulty:** To account for the asymmetric variability, unique inner spacer MDI fringe fields, and localized SHE, the BSIM-CMG parameter card must expand to include thousands of interdependent empirical fitting coefficients. Extracting these parameters using traditional optimization algorithms (e.g., Levenberg-Marquardt or genetic algorithms) involves navigating a highly non-convex, multidimensional error surface. The optimizer routinely becomes trapped in local minima, necessitating continuous manual intervention and heuristic tuning by modeling experts—a process that can consume months for a single technology node.
    
      
    
2. **Simulation Turn-Around Time (TAT):** Evaluating the core surface-potential algorithms, heavily modified by conformal mapping calculations and electrothermal networks for every device during every picosecond of a transient simulation, induces massive computational overhead. In large-scale SRAM array or statistical Monte Carlo simulations, this analytical complexity causes SPICE evaluation speeds to plummet to unacceptable levels, directly bottlenecking the time-to-market for sub-2nm chip designs.
    
      
    
3. **Extrapolation and Narrow Design Space:** Because the parameter extraction is so fragile, semi-empirical models are often narrowly calibrated to a restricted set of nominal voltages, temperatures, and gate lengths. When statistical circuit optimizers push device dimensions into highly scaled, uncalibrated regions (out-of-distribution), the rigid mathematical formulation of the localized empirical fitting parameters breaks down, leading to inaccurate I-V and C-V predictions.
    
      
    

## Physics-Informed Machine Learning (PIML) and Neural Advancements

To overcome the calibration and runtime limits of semi-empirical models, the industry initially experimented with pure Artificial Neural Networks (ANNs), such as Multi-Layer Perceptrons (MLPs), to directly map device inputs to currents and charges. While extremely fast, these black-box models lack physical constraints. Standard ANNs routinely violate fundamental thermodynamic laws—such as predicting non-zero currents at zero drain bias or failing Gummel symmetry tests—rendering them unreliable for robust circuit simulation. Furthermore, standard ANNs suffer catastrophic prediction failures when asked to extrapolate beyond the boundaries of their training data.

  

The paradigm-shifting solution is Physics-Informed Machine Learning (PIML). PIML frameworks directly embed the fundamental partial differential equations (PDEs) of semiconductor physics into the architecture and loss function of the neural network.

  

In a Physics-Informed Neural Network (PINN), the loss function ($\mathcal{L}_{Total}$) mathematically fuses a data-driven mean-squared error term ($\mathcal{L}_{Data}$) with a physics-based residual term ($\mathcal{L}_{Physics}$), enforcing physical laws as soft constraints via regularization. PIML leverages the automatic differentiation engines intrinsic to modern deep learning frameworks (e.g., PyTorch, TensorFlow) to exactly compute spatial and temporal derivatives (such as mobility gradients and capacitive displacement currents) without relying on discrete numerical mesh generation.

  

### Mitigating Spectral Bias with $\Psi$-xLSTM and PIGNs

A primary challenge in applying PINNs to high-frequency transient SPICE simulations is "spectral bias"—the tendency of standard neural networks to easily learn low-frequency macroscopic shapes while failing to resolve rapid, high-frequency transient dynamics essential for AC logic modeling.

  

To resolve spectral bias, researchers have developed advanced recurrent architectures, notably the distilled physics-informed extended Long Short-Term Memory ($\Psi$-xLSTM) framework. This architecture utilizes a Recurrent Relation-Aware Distillation (RRAD) strategy. By applying structural compression to the dense matrix memory (mLSTM) of the network, the framework proves that the governing physics of high-frequency device dynamics actually resides in a low-rank subspace. The continuous, opaque gate values are clustered and replaced with sparse, physically interpretable time constants (relaxation times). This allows the dense memory matrices to collapse into a few dominant eigen-modes, achieving the spectral fidelity of full recurrent networks while reducing the total parameter count by up to 84%. Validations of the $\Psi$-xLSTM framework on high-frequency transient dynamics demonstrate exceptional accuracy, generating SPICE-compatible outputs with a mean absolute error of just 0.40 mA and simulating 7.6$\times$ faster than standard PINNs.

  

For modeling the intricate spatial variations of device-to-device interactions, Physics-Informed Graph Networks (PIGNs) have also emerged. PIGNs apply message-passing algorithms across dynamic relational graphs representing the physical structure of the CFET, capturing the highly correlated variations between the adjacent nFET and pFET channels better than rigid grid-based models.

  

### Neural Self-Heating and Variability Modeling

PIML elegantly handles device variability and electrothermal modeling. By treating variations in metal grain size or nanosheet thickness as perturbed input vectors and utilizing noise injection during training, the network generalizes across diverse geometries, exhibiting deep resilience to process-induced variability.

  

Regarding self-heating, advanced PIML frameworks replace the cumbersome analytical thermal resistance iterative loops with a single-pass neural temperature relaxation model. By training the network using ambient temperature measurements alongside thermal time constants, the network internally infers the electrothermal mapping. These neural thermal models achieve roughly 98.5% accuracy for drain current prediction and 99% accuracy for temperature profiling across varying voltages and geometries, entirely bypassing the need for semi-empirical thermal equations during simulation.

  

## The Hybridized Framework: Synergizing AI and Analytical Models

While PIML is powerful, purely neural structures can still struggle with the absolute baseline stability required by foundry Process Design Kits (PDKs). The definitive methodology for Angstrom-era CFET DTCO is the Hybridized Framework Compact Model, which explicitly merges an analytical core (BSIM-CMG) with AI-driven parameter generation and correction algorithms.

  

### Autoencoder-Driven Parameter Extraction

The first layer of this hybridization addresses the parameter extraction bottleneck. Rather than manually tuning the BSIM-CMG equations, deep learning autoencoders act as surrogate global optimizers. The autoencoder network ingests the complete experimental or TCAD-simulated $I_d-V_g$ and $C_{gg}-V_g$ characteristics of the CFET. The encoder layers compress these continuous curves down to a dense, low-dimensional latent space bottleneck consisting of merely a few neurons, which encapsulate the essential fundamental factors of physical variation.

  

The decoder network then maps this latent representation directly to the hundreds of required BSIM-CMG parameters. Trained using backward propagation on vast datasets generated via Monte Carlo forward-simulations of BSIM-CMG, this AI model learns the complex, multidimensional inverse-mapping function. Once trained, the deep learning extractor evaluates novel CFET TCAD structures instantly, generating BSIM-CMG parameter sets that yield an exceptional 0.16% RMS error in C-V characteristics and 6.1% RMS error in I-V characteristics (0.69% in the critical above-threshold regime). This reduces a multi-month extraction effort into a sub-second inference task.

  

### Multi-Fidelity Neural Networks (MFNN) and Active Learning

The second layer of hybridization involves direct predictive modeling using Multi-Fidelity Neural Networks (MFNNs). Generating High-Fidelity (HF) 3D TCAD data for CFETs—involving self-consistent solutions of density-gradient quantum equations, Boltzmann transport, and electrothermal dynamics—is astronomically resource-intensive.

  

The MFNN circumvent this by utilizing a massive foundation of computationally cheap Low-Fidelity (LF) data to guide the neural network toward the High-Fidelity target. The uncalibrated or roughly-fitted BSIM-CMG analytical model serves as the Low-Fidelity source, providing the network with the correct fundamental physical trajectories, thermodynamic boundaries, and asymptotic curve shapes. The TCAD simulator serves as the sparse, High-Fidelity data source.

  

The MFNN loss function is precisely designed to balance these dual data streams:

  

$$\text{Loss} = \frac{1}{N} \sum_{t=1}^{N} \left[ W_A \left( Y_{TCAD}(X_t) - y_{LFNN}(X_t) \right) - W_P \left( y_{MFNN}(X_t) - y_{LFNN}(X_t) \right) \right]^2$$

In this formulation, $Y_{TCAD}$ represents the true high-fidelity values, $y_{LFNN}$ represents the analytical BSIM predictions, and $y_{MFNN}$ represents the hybrid model's prediction. The user-defined hyperparameters $W_A$ and $W_P$ dictate the weight applied to the actual TCAD target versus the network's predictive offset. By actively updating the LFNN model via transfer learning as new data arrives, the network seamlessly bridges the gap between empirical approximations and quantum reality.

  

To further minimize required TCAD simulations, the hybridized framework abandons passive, space-filling sampling algorithms like Latin Hypercube Sampling (LHS). LHS distributes simulation points evenly across the design space but fails to account for output correlations or localized non-linearities. Instead, the framework utilizes Gaussian Process Regression-based Active Learning. Active learning is an adaptive, sequential methodology; it evaluates the network's current confidence interval and selectively queries the TCAD engine to simulate only those specific CFET geometries or bias conditions where the prediction uncertainty is highest.

  

The synergistic combination of MFNNs and Active Learning yields staggering improvements in data efficiency and model footprint.

  

|**Compact Model & Sampling Strategy**|**NMOS Required TCAD Samples**|**PMOS Required TCAD Samples**|**Network Architecture (Hidden Layers, Neurons)**|
|---|---|---|---|
|Standard ANN + LHS|840|760|3 HL, 30 HN (NMOS) / 25 HN (PMOS)|
|Standard ANN + Active Learning|720|600|3 HL, 25 HN (NMOS) / 20 HN (PMOS)|
|MFNN + LHS|680|560|3 HL, 20 HN (NMOS) / 15 HN (PMOS)|
|**MFNN + Active Learning (Hybrid)**|**400**|**360**|**3 HL, 15 HN (both NMOS/PMOS)**|

Table 2: Comparison of dataset requirements and model compression to achieve a target prediction error of <1.5% for sub-3nm device compact modeling.

  

As detailed above, the hybrid MFNN utilizing active learning slashes the required TCAD simulation volume by over 52% (from 840 to 400 NMOS samples) compared to standard LHS-driven neural networks. Furthermore, the final deployed model is compressed to an exceptionally lightweight architecture of merely 3 hidden layers and 15 neurons, enabling massive acceleration of SPICE evaluation runtimes.

  

## Kolmogorov-Arnold Networks (KAN) and Symbolic Regression for Extrapolation Integrity

While MFNNs are highly efficient, deploying standard multi-layer perceptron weights inside legacy SPICE circuit simulators presents a fundamental incompatibility. Standard SPICE engines are heavily optimized for solving systems of explicit algebraic and non-linear differential equations via Newton-Raphson iterations, not for executing massive matrix multiplications of neural weights. Integrating black-box weights creates severe computational bottlenecks and completely obscures the underlying device behavior from circuit designers.

  

The resolution to this incompatibility is the implementation of the Kolmogorov-Arnold Network (KAN) for transistor compact modeling. Unlike traditional Multi-Layer Perceptrons (MLPs) which place fixed, static activation functions (such as ReLU or Sigmoid) on the computational nodes and use learnable scalar weights on the connecting edges, KANs invert this topology. Drawing on the Kolmogorov-Arnold representation theorem, KANs place learnable, parameterized activation functions directly on the edges of the network.

  

Specifically, these edge activation functions are parameterized as $k$-order B-spline curves, denoted as $\phi(x)$, utilizing learnable coefficients $c_i$ corresponding to distinct B-spline basis functions $B_i$. This architectural innovation provides two revolutionary capabilities for CFET compact modeling:

  

1. **Adaptive Physics-Based Non-Linearity:** The highly flexible B-spline formulations allow the network to dynamically adapt its internal non-linear activation shapes to perfectly match the highly complex, physics-based functions of transistor electrostatics. Empirical benchmarking against golden industry-standard BSIM models demonstrates that KANs and Fourier-KANs (FKANs) achieve vastly superior prediction accuracy for critical derivative figures of merit, notably gate current ($I_g$), drain charge ($Q_d$), and source charge ($Q_s$), compared to rigid MLPs.
    
      
    
2. **Symbolic Regression and "Gray-Box" Modeling:** Because the network is constructed from parameterized polynomial spline functions rather than opaque weight matrices, the entire trained KAN architecture can be analytically collapsed. The KAN leverages symbolic regression to translate the learned data patterns directly into explicit, human-readable mathematical formulas.
    
      
    

This symbolic regression is transformative for ensuring Extrapolation Integrity. When an optimization algorithm pushes a circuit simulation into an uncalibrated design corner (e.g., severe voltage overshoot), a traditional black-box ANN will output chaotic, non-physical predictions because the weight matrix has no mathematical anchoring outside its training distribution. Conversely, a symbolic equation derived from a KAN maintains the asymptotic trajectory of the underlying physical trend.

  

By embedding these explicit mathematical expressions directly into the SPICE framework, the KAN creates a "gray-box" model. It provides the lightning-fast, automated fitting capability of an artificial neural network while maintaining the absolute transparency, strict physical symmetry (e.g., exact $I_d-V_{ds}$ curve symmetry around $V_{ds}=0$), and computational efficiency of a traditional formula-based analytical model. When KAN-derived explicit I-V models are embedded into a 12 nm FinFET SPICE environment, 11-stage ring oscillator simulations demonstrate accuracy comparable to the original complex SPICE models but with massively accelerated SPICE generation and evaluation speeds, paving the way for seamless CFET application.

  

## SPICE Standards Integration: Verilog-A and OMI

For any hybridized framework—whether utilizing distilled $\Psi$-xLSTM recurrent networks, MFNNs, or symbolic KAN equations—to be adopted by semiconductor foundries and fabless design houses, it must integrate flawlessly into established Electronic Design Automation (EDA) ecosystems. The outputs must be perfectly agnostic to commercial simulation platforms (such as Synopsys HSPICE, Cadence Spectre, or Siemens Eldo).

  

This standardization is achieved by compiling the generated hybrid models directly into **Verilog-A**, the IEEE standard hardware description language for analog and mixed-signal circuits. Behavioral Verilog-A models abstract the physical equations, thermal relaxation networks, and parameterized conformal mapping calculations into standardized blocks. For PINNs or $\Psi$-xLSTM structures, the extracted recurrent relation weights and physical biases are converted into structural Verilog-A symbols, empowering the SPICE simulator to handle dynamic, variable time-stepping autonomously during transient AC evaluations, entirely independent of the rigid discrete steps used during the neural network's initial training.

  

While Verilog-A ensures universal compatibility, executing complex behavioral code through a SPICE engine's internal interpreter can still induce latency. For maximum runtime acceleration during massive full-chip Monte Carlo analysis, modern hybrid models utilize the **Open Model Interface (OMI)**. Standardized and maintained by the Si2 Compact Model Coalition (CMC), OMI is a unified C-level Application Programming Interface (API) that permits external models to be dynamically linked as compiled libraries directly into the core SPICE evaluation engine at runtime.

  

By combining the lightweight, low-parameter matrices of structural MFNNs or the explicitly derived polynomial formulas of KANs with the compiled C-level execution speed of OMI, these hybridized compact models bypass interpreter overhead entirely. The resulting simulation environment achieves processing speeds orders of magnitude faster than evaluating raw TCAD structures or executing unoptimized, parameter-heavy legacy BSIM-CMG cards. This extreme computational efficiency is the foundational enabler for practical, full-scale statistical static timing analysis (SSTA) and yield optimization for complex, vertically stacked Angstrom-era CFET standard cell libraries.

  

## Conclusion

The continuation of Moore's Law into the sub-2nm deep Angstrom era demands an architectural paradigm shift toward the Monolithic Complementary Field-Effect Transistor (CFET). However, realizing the theoretical density advantages of 4T/3T standard cells and multi-tier 3D SRAMs requires conquering immense physical challenges, notably severe Middle Dielectric Isolation (MDI) constraints, dense Middle-of-Line (MOL) parasitic capacitance coupling, asymmetric process-induced stochastic variations, and acute electrothermal self-heating effects.

  

Traditional semi-empirical compact models, exemplified by BSIM-CMG, form the bedrock of semiconductor modeling but lack the agility to efficiently map these immense complexities. The combinatorial explosion of empirical fitting parameters leads to intractable extraction processes, narrow extrapolation limits, and crippling SPICE simulation overhead, directly throttling the Design-Technology Co-Optimization (DTCO) pipeline.

  

The integration of Artificial Intelligence into a Hybridized Framework Compact Model resolves these fundamental limitations. By augmenting the foundational analytical physics of BSIM-CMG with Multi-Fidelity Neural Networks (MFNNs) and Active Learning, the industry can slash computationally expensive 3D TCAD simulations by over 50% while shrinking the final model architecture to a highly efficient footprint. The integration of Physics-Informed Machine Learning (PIML) and distilled recurrent architectures ensures that transient AC simulations respect strict thermodynamic constraints and avoid spectral bias. Crucially, the revolutionary application of Kolmogorov-Arnold Networks (KAN) bridges the gap between deep learning and analytical rigor by utilizing B-spline activation functions to execute symbolic regression. This translates neural patterns into explicit, human-readable mathematical formulas, guaranteeing the extrapolation integrity and symmetric physical stability required for out-of-distribution circuit stress testing. Exported through standardized IEEE Verilog-A and Si2 Open Model Interface (OMI) protocols, these highly optimized hybrid models integrate seamlessly into commercial EDA environments, ensuring the rapid, accurate, and scalable co-optimization of next-generation integrated circuits for decades to come.