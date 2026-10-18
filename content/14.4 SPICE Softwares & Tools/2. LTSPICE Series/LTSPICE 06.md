# AI Surrogate Modeling and Bayesian Optimization in LTspice

## Introduction

As the electronic design automation (EDA) industry navigates the complexities of the 2026 technological landscape, the paradigms governing analog, mixed-signal, and radio-frequency (RF) circuit simulation have reached a critical inflection point. For over five decades, the foundational algorithmic architecture of circuit simulation has remained anchored to the mathematical frameworks established by the original SPICE (Simulation Program with Integrated Circuit Emphasis) . While semiconductor fabrication has aggressively scaled into the angstrom regime and heterogeneous integration has birthed unprecedented multi-physics packaging complexities, the core numerical engines relying on Modified Nodal Analysis (MNA) and Newton-Raphson (NR) iterative solvers have remained fundamentally unchanged . This algorithmic stagnation has resulted in a severe simulation bottleneck. Verifying modern high-frequency systems, deeply scaled CMOS mixed-signal blocks, or complex power topologies utilizing wide-bandgap (WBG) devices such as Gallium Nitride (GaN) and Silicon Carbide (SiC) now requires an exorbitant expenditure of computational time and memory resources .

The necessity to bridge the widening chasm between circuit complexity and simulation throughput has catalyzed the integration of Artificial Intelligence (AI) and Machine Learning (ML) directly into the analog EDA workflow. The maturation of deep learning frameworks, most notably PyTorch, coupled with advanced mathematical optimization libraries such as BoTorch, has provided the necessary infrastructure to bypass traditional transient and steady-state differential equation solvers . By synthesizing deep neural networks that function as highly accurate surrogate models, the industry is executing a paradigm shift from computationally expensive numerical matrix integration to deterministic, highly parallelized tensor multiplications . 

This comprehensive technical report establishes a definitive, production-grade methodology for coupling LTspice, the industry's predominant analog simulator, with state-of-the-art deep learning and Bayesian Optimization (BO) architectures. Through the utilization of `PyLTSpice` and its underlying `spicelib` core—a robust Python toolchain designed for LTspice, Ngspice, and QSPICE automation—the historical barrier isolating AI environments from traditional SPICE netlists has been systematically dismantled . This synthesis permits the creation of programmatic, closed-loop pipelines where structural device parameters, parasitic elements, and environmental process-voltage-temperature (PVT) corners are continuously managed by a Python ecosystem . The massive datasets generated through headless, highly parallelized SPICE runs serve as the empirical ground truth for training Physics-Informed Neural Networks (PINNs), advanced extended Long Short-Term Memory (xLSTM) architectures, and Transformer-based behavioral surrogates . 

The subsequent chapters of this report delineate the rigorous transition from standard numerical transient analysis to AI-driven surrogate prediction and automated circuit tuning. The discourse will thoroughly dissect the methodologies required to engineer high-fidelity datasets from raw SPICE output files (`.raw`), construct neural architectures capable of capturing high-frequency non-linear transients without suffering from spectral bias, and deploy Gaussian Process (GP) models to execute multi-objective transistor sizing via Bayesian Optimization . Ultimately, this framework defines the future of analog design, replacing stochastic trial-and-error heuristic tuning with deterministic, AI-guided mathematical convergence.

## Chapter 1: The SPICE Bottleneck and the Rise of AI Surrogates in Analog EDA

### 1.1 The Algorithmic Foundation of SPICE: Modified Nodal Analysis and Newton-Raphson

To fundamentally grasp the necessity of AI-driven surrogate models, one must first deconstruct the algorithmic foundation that dictates traditional SPICE engine performance. The core of any SPICE-like simulation relies on Modified Nodal Analysis (MNA), an algorithm that constructs a system of non-linear differential-algebraic equations (DAEs) to precisely represent the circuit topology . Unlike standard nodal analysis, which strictly solves for node voltages and fails when presented with voltage-defined components, MNA introduces branch currents for ideal voltage sources, inductors, and current-controlled elements as independent state variables . 

The generalized MNA formulation for a non-linear dynamic circuit is mathematically expressed as:

$C(x)\frac{dx}{dt} + G(x)x + f(x) = B u(t)$

where $x(t) \in \mathbb{R}^N$ represents the composite state vector of unknown node voltages and branch currents, $C(x)$ is the non-linear capacitance and inductance matrix, $G(x)$ is the non-linear conductance matrix, $f(x)$ represents the vector of non-linear voltage-current relationships governing active devices (such as the exponential drift-diffusion characteristics of diodes and the complex surface potentials of MOSFETs), $B$ is the input mapping matrix, and $u(t)$ contains the independent transient stimuli .

In transient analysis, this continuous-time DAE formulation must be discretized into a series of time steps using implicit numerical integration methods to guarantee A-stability, thereby preventing unbounded numerical oscillations. Utilizing the Backward Euler (BE) or Trapezoidal (TR) rule, the derivative operator $\frac{dx}{dt}$ is replaced by a finite difference approximation . Assuming the application of the Backward Euler method for robust convergence, the time derivative is approximated as:

$\frac{dx}{dt} \approx \frac{x_{t+h} - x_t}{h}$

Substituting this approximation into the MNA equation yields a non-linear algebraic system that must be resolved at every single discrete time step $t+h$:

$\frac{C(x_{t+h})}{h} (x_{t+h} - x_t) + G(x_{t+h})x_{t+h} + f(x_{t+h}) - B u(t+h) = 0$

To solve this highly non-linear root-finding problem, SPICE mandates the use of the Newton-Raphson (NR) iterative algorithm . The NR method requires the continuous calculation, stamping, and inversion of the system's Jacobian matrix $J$, which encapsulates the partial derivatives of all non-linear device equations with respect to the state variables . The iterative update at step $k$ is computed as:

$J(x^{(k)}) \Delta x^{(k)} = -F(x^{(k)})$
$x^{(k+1)} = x^{(k)} + \Delta x^{(k)}$

where $F(x^{(k)})$ is the residual error vector at iteration $k$, and the Jacobian matrix is explicitly defined as:

$J(x) = \frac{C(x)}{h} + G(x) + \nabla_x f(x)$

This mathematical structure dictates that the performance of the simulation is entirely bound by the time required to evaluate $\nabla_x f(x)$ and subsequently invert the Jacobian matrix $J(x)$ .

### 1.2 The Simulation Bottleneck and the Accuracy-Speed-Capacity Trilemma

The fundamental bottleneck of SPICE resides within the sequential, iterative nature of the NR algorithm and the matrix factorization of the Jacobian. At every iteration, for every time step, the simulator must evaluate highly complex, physics-based device models. In the context of modern power electronics and RF design, the adoption of Wide-Bandgap (WBG) devices such as GaN High-Electron-Mobility Transistors (HEMTs) has exacerbated this computational burden drastically .

The Advanced SPICE Model for HEMTs (ASM-HEMT), which is the industry standard surface-potential-based model for GaN devices, requires the calculation of 2-Dimensional Electron Gas (2DEG) charge densities, Fermi-levels, and Schrödinger-Poisson solutions at each NR iteration . Furthermore, GaN devices exhibit severe current collapse and kink effects due to electron trapping in the buffer and surface layers . To accurately model these transient phenomena, the drain-source current $I_{ds}$ requires calculating dynamic threshold voltage corrections based on internal device states:

$V_{off}' = V_{off} \left(1 + C_K(V_{ds}, V_{gs})\right)$
$C_K(V_{ds}, V_{gs}) = d_0 \cdot \tanh(d_1 \cdot (V_{ds} - V_{ds-k}))$

where $V_{ds-k}$ represents the drain-source voltage at which the kink effect manifests, modeled as a polynomial function of $V_{gs}$ . Evaluating these hyperbolic tangents, polynomial expansions, and temperature-dependent mobility degradations to stamp the Jacobian matrix $\nabla_x f(x)$ consumes immense CPU cycles .

Once the Jacobian is stamped, solving the linear system $J \Delta x = -F$ requires sparse LU factorization. While SPICE matrices are topologically sparse, the computational complexity of sparse LU decomposition scales non-linearly—generally between $\mathcal{O}(N^{1.2})$ and $\mathcal{O}(N^{1.5})$, where $N$ is the matrix dimension representing the number of nodes and branch currents . For large post-layout netlists containing thousands of active GaN devices and millions of extracted parasitic RLC elements, factorization time thoroughly dominates the simulation profile. 

This establishes the pervasive "accuracy-speed-capacity trilemma" of mixed-signal simulation . Increasing accuracy by tightening the local truncation error (LTE) tolerances or utilizing advanced physics models like ASM-HEMT exponentially increases simulation time and restricts the maximum capacity of the simulated circuit. Conversely, increasing simulation speed by deploying highly abstracted models severely compromises the physical accuracy necessary to detect high-frequency parasitic-induced oscillations. 

| Simulation Methodology | Core Mechanism | Computational Complexity | Physical Accuracy | Primary Limitation |
| :--- | :--- | :--- | :--- | :--- |
| Traditional SPICE | MNA + Newton-Raphson | $\mathcal{O}(N^{1.5})$ per iteration | Absolute (Ground Truth) | Severe latency; LU factorization bottlenecks scaling. |
| Behavioral Verilog-A | Piecewise / Functional | $\mathcal{O}(N)$ per time step | Low to Moderate | Fails to capture complex parasitics and 2DEG physics. |
| AI Neural Surrogate | Tensor Matrix Multiplication | $\mathcal{O}(1)$ forward pass time | Highly Accurate (if trained) | Requires massive upfront dataset generation. |

Attempts to parallelize the SPICE engine across multi-core CPUs provide rapidly diminishing returns . The NR iterations and numerical time-stepping are intrinsically sequential; the state of the circuit at time $t+h$ strictly and unconditionally depends on the successful convergence of the state at time $t$. 

### 1.3 The Advent of Physics-Informed Neural Networks (PINNs) in Circuit EDA

To circumvent the fundamental limitations of the NR bottleneck, EDA researchers initially turned to deep learning. Early approaches utilized purely data-driven Multi-Layer Perceptrons (MLPs) or Convolutional Neural Networks (CNNs) to map circuit parameters directly to output waveforms . However, these "black box" models proved physically oblivious; they frequently generated predictions that violated fundamental thermodynamic principles and Kirchhoff's Current and Voltage Laws (KCL, KVL) when evaluated outside of their immediate training distributions .

The introduction of Physics-Informed Neural Networks (PINNs) marked a foundational shift in computational EDA . A PINN completely replaces the iterative NR solver with a continuous, differentiable neural network $\mathcal{N}_{\theta}(t)$ parameterized by learned weights $\theta$. Instead of strictly relying on massive datasets, PINNs embed the circuit's governing physical laws directly into the neural network's loss function during the backpropagation training phase . 

The composite loss function of a PINN applied to transient circuit simulation is defined as:

$\mathcal{L}(\theta) = \mathcal{L}_{data} + \lambda_{KCL}\mathcal{L}_{KCL} + \lambda_{KVL}\mathcal{L}_{KVL} + \lambda_{device}\mathcal{L}_{device}$

where:
*   $\mathcal{L}_{data} = \frac{1}{N_{data}} \sum_{i=1}^{N_{data}} ||\hat{x}(t_i) - x_{true}(t_i)||^2$ is the standard mean squared error against available SPICE ground-truth data .
*   $\mathcal{L}_{KCL} = \frac{1}{M_{nodes}} \sum_{j=1}^{M_{nodes}} ||\sum i_{node_j}(\hat{x}(t))||^2$ penalizes the network heavily if the sum of predicted currents entering any node diverges from zero, enforcing charge conservation .
*   $\mathcal{L}_{KVL}$ ensures the sum of predicted branch voltages around any closed loop equals zero.
*   $\mathcal{L}_{device}$ forces the relationship between the predicted branch voltages and currents to strictly adhere to the non-linear constitutive equations of the active components (e.g., ensuring the predicted drain current of a GaN HEMT correctly follows the surface-potential definitions of the ASM-HEMT model) .

While PINNs represented a theoretical breakthrough by ensuring physical compliance, they encountered a severe mathematical roadblock in practical high-frequency EDA applications: spectral bias. Neural networks trained via gradient descent inherently prioritize learning the low-frequency components of a target function before capturing high-frequency details . In advanced analog design, where phenomena like fast switching transients, gate-drain charge injection, and high-frequency parasitic ringing dictate system stability and switching loss, standard PINNs fail catastrophically. They smooth over the critical high-frequency edges and nanosecond transients that analog designers desperately need to model, rendering them inadequate for modern WBG power converter optimization .

### 1.4 Overcoming Spectral Bias: The xLSTM and Structure-Informed Architectures

To address the strict latency requirements of hardware simulation and the debilitating spectral bias of PINNs, the focus of 2026 EDA research evolved toward Physics Structure-Informed Neural Networks ($\Psi$-NN) and advanced recurrent architectures, specifically the extended Long Short-Term Memory (xLSTM) networks . 

The traditional LSTM struggles with the continuous, multi-timescale nature of transient analog waveforms. The xLSTM architecture modernizes the classic approach by introducing exponential gating and matrix memory (mLSTM). In a physical electronic system, the decay of states—such as a parasitic capacitor discharging or a trap state relaxing in a GaN buffer layer—is strictly governed by exponential decay functions defined by relaxation time constants, $e^{-t/\tau}$ . 

The xLSTM naturally mirrors this physical reality. For a given time-series input $x_t$ (representing stimulus voltages or currents), the scalar xLSTM (sLSTM) block updates its internal state via exponential gating mechanisms:

$i_t = \exp(W_i x_t + b_i)$
$f_t = \sigma(W_f x_t + b_f) \quad \text{or} \quad \exp(W_f x_t + b_f)$
$c_t = f_t \odot c_{t-1} + i_t \odot \tanh(W_c x_t + b_c)$

By replacing standard linear or sigmoid gates with exponential functions, the xLSTM acts as an adaptive, trainable high-pass filter. The weights within the exponential gates physically cluster around the mathematical inverses of the relaxation time constants ($1/\tau$) of the analog device under test . This structural alignment allows the network to natively capture the sharp, nanosecond-scale transients of switching memristors, RF power amplifiers, or GaN inverters without suffering from the spectral bias inherent to standard PINNs . When deployed in inference mode via PyTorch, the xLSTM evaluates the waveform matrix operations orders of magnitude faster than a traditional SPICE Newton-Raphson iteration, entirely eliminating the LU factorization bottleneck .

### 1.5 The EDA Bridge: LTspice and AI Integration via PyLTSpice

Despite the computational supremacy of AI surrogates in forward-inference speed, the initialization, training, and continuous validation of these models require an immense volume of highly accurate ground-truth data. Surrogate models must be exposed to sweeping Process, Voltage, and Temperature (PVT) corners, vast parametric variations, and randomized topological states to generalize effectively . Generating 100,000+ simulation data points manually via a graphical interface is a logistical impossibility. 

To bridge this data acquisition gap, Python acts as the supreme orchestrator, relying on the `spicelib` and `PyLTSpice` libraries . PyLTSpice establishes a programmatic I/O layer surrounding the LTspice engine, allowing an AI script to manipulate netlists (`.net` or `.asc`), execute massive parallel batch simulations headless, and parse the resulting binary `.raw` files directly into PyTorch tensors .

The `PyLTSpice` framework operates through three primary module classes:
1.  **SpiceEditor**: Responsible for parsing the original SPICE netlist. It can programmatically manipulate component values, override device models (e.g., dynamically swapping a basic `BSIM4` parameter for a highly complex GaN `ASM-HEMT` subcircuit), and inject dynamic simulation instructions like `.param`, `.step`, or `.tran` directly into the netlist memory buffer .
2.  **SimRunner**: The execution environment. It spawns multiple simulator threads, bypasses the LTspice GUI, and dispatches batch simulations asynchronously across available CPU cores, tracking simulation success and failure logs .
3.  **RawRead**: The critical data extraction class. Traditional LTspice output binaries (`.raw` files) are heavily compressed and structurally opaque. `RawRead` decodes these binary files, extracting multi-dimensional arrays representing time (or frequency) vectors and node voltages/branch currents using trace name mapping .

By binding these components, an AI pipeline can dynamically explore the analog design space autonomously. The following code demonstrates a highly advanced, production-grade PyTorch `Dataset` class integrated directly with `PyLTSpice`. This class dynamically modifies a SPICE netlist on the fly, launches a batch simulation using `SimRunner`, reads the output using the `RawRead.get_trace().get_wave()` methodology, and formats the result as a normalized multi-channel PyTorch tensor suitable for training an xLSTM or Transformer surrogate model .

```python
import os
import numpy as np
import torch
from torch.utils.data import Dataset
from spicelib.editor import SpiceEditor
from spicelib.sim.sim_runner import SimRunner
from spicelib.simulators.ltspice_simulator import LTspice
from spicelib import RawRead

class SPICETensorDataset(Dataset):
    """
    Advanced PyTorch Dataset bridging PyLTSpice to neural network training.
    Dynamically modulates parametric netlists, executes batch simulations,
    and returns (X, Y) tensor pairs for surrogate modeling.
    """
    def __init__(self, base_netlist_path, param_grid, output_dir="./sim_temp", seq_len=2000):
        super().__init__()
        self.netlist_path = base_netlist_path
        self.param_grid = param_grid  # List of dictionaries with parameter sweeps
        self.output_dir = output_dir
        self.seq_len = seq_len
        self.simulator = LTspice
        
        # Initialize the execution environment and verify paths
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
            
        # Spawn SimRunner with parallel execution limits defined by host CPU
        self.runner = SimRunner(output_folder=self.output_dir, simulator=self.simulator)

    def __len__(self):
        return len(self.param_grid)

    def _interpolate_tensor(self, time_axis, waveform):
        """
        LTspice utilizes dynamic time-stepping due to LTE constraints in the NR solver.
        Neural Networks (xLSTM/Transformers) require fixed-length, uniform time-series tensors.
        This function interpolates the non-uniform SPICE output to a uniform temporal grid.
        """
        uniform_time = np.linspace(time_axis[0], time_axis[-1], self.seq_len)
        uniform_wave = np.interp(uniform_time, time_axis, waveform)
        
        # Normalize the waveform to zero-mean, unit-variance for stable gradient descent
        mean = np.mean(uniform_wave)
        std = np.std(uniform_wave) + 1e-8
        normalized_wave = (uniform_wave - mean) / std
        
        return torch.tensor(normalized_wave, dtype=torch.float32)

    def __getitem__(self, idx):
        # 1. Access parameter corner for this specific run
        current_params = self.param_grid[idx]
        
        # 2. Instantiate SpiceEditor and manipulate the netlist in memory
        editor = SpiceEditor(self.netlist_path)
        
        # Inject design variables (e.g., Transistor W/L, compensation caps)
        # SPICE syntax requires exact matching of hierarchical names
        for comp, val in current_params.items():
            if comp.startswith(".param"):
                # Handle global parameter definitions
                param_name = comp.split(" ")[1]
                editor.set_parameters(**{param_name: val})
            elif ":" in comp:
                # Handle subcircuit component modifications (e.g., XU1:C2)
                subckt_name, element = comp.split(":")
                editor.get_subcircuit(subckt_name).set_component_value(element, str(val))
            else:
                # Handle top-level components
                editor.set_component_value(comp, str(val))
                
        # Inject required simulation directives to override existing GUI settings
        editor.add_instructions(
            "; AI Pipeline Override",
            ".tran 0 10u 0 1n",  # Force high-resolution transient analysis
            ".options reltol=1e-4 abstol=1e-11" # Tighten NR solver constraints
        )
                
        # 3. Execute the simulation headless
        self.runner.run(editor)
        self.runner.wait_completion()
        
        # 4. Extract generated .raw file paths
        raw_file_path = None
        for raw, log in self.runner:
            raw_file_path = raw
            break
            
        if raw_file_path is None:
            raise RuntimeError(f"Simulation failed to converge for parameters: {current_params}")

        # 5. Decode the binary RAW file using RawRead
        raw_data = RawRead(raw_file_path)
        
        # Extract independent axis (Time)
        time_data = raw_data.get_axis() 
        
        # Extract features (Stimulus) and targets (Responses)
        # using the robust get_trace().get_wave() methodology
        v_in = raw_data.get_trace("V(in)").get_wave()
        v_out = raw_data.get_trace("V(out)").get_wave()
        i_drain = raw_data.get_trace("I(M1)").get_wave()
        
        # 6. Normalize and align the data arrays to fixed sequence lengths
        tensor_vin = self._interpolate_tensor(time_data, v_in).unsqueeze(1)
        tensor_vout = self._interpolate_tensor(time_data, v_out).unsqueeze(1)
        tensor_idrain = self._interpolate_tensor(time_data, i_drain).unsqueeze(1)
        
        # Feature Matrix X: [seq_len, 1] representing the stimulus
        X = tensor_vin
        # Target Matrix Y: [seq_len, 2] representing the complex non-linear response
        Y = torch.cat((tensor_vout, tensor_idrain), dim=1)
        
        # 7. Cleanup binary data to prevent storage IO bottlenecking across 100,000+ runs
        self.runner.cleanup_files()
        
        return X, Y
```

This structural fusion of LTspice and deep learning environments effectively solves the programmatic data acquisition bottleneck that previously plagued ML EDA efforts . With the `SPICETensorDataset` class instantiated, a PyTorch algorithm can request millions of transient simulations, continuously sweeping multi-dimensional parameter spaces across non-linear device models . This precise, automated infrastructure sets the stage for the mass generation of SPICE tensors—the critical first step required before Bayesian Optimization and Neural Surrogates can definitively overtake the mathematical duties of the Newton-Raphson engine and fundamentally alter the analog design workflow .

## Sources

- [**mdpi.com** A Systematic Taxonomy and Comparative Analysis of Mixed-Signal](https://www.mdpi.com/2079-9292/15/8/1687)
- [**eprints.soton.ac.uk** University of Southampton Research Repository ePrints Soton](https://eprints.soton.ac.uk/387205/1/_soton.ac.uk_ude_personalfiles_users_jo1d13_mydesktop_Darabad.pdf)
- [**researchgate.net** The modified nodal approach to network analysis - ResearchGate](https://www.researchgate.net/publication/3184759_The_modified_nodal_approach_to_network_analysis)
- [**arxiv.org** Computational Graph Representation of Equations System ... - arXiv](https://arxiv.org/html/2407.04206v1)
- [**researching.cn** An improved ASM-HEMT model for kink effect on GaN devices](https://www.researching.cn/articles/OJb3bec5019e5fab4c)
- [**ias.ac.in** GaN HEMTs: Device architectures, analytical models, and](https://www.ias.ac.in/article/fulltext/boms/049/0120)
- [**proceedings.iclr.cc** HIGH-DIMENSIONAL BAYESIAN OPTIMISATION WITH GAUSSIAN](https://proceedings.iclr.cc/paper_files/paper/2025/file/7b6e1905ebe2caa41870fcdcb9898243-Paper-Conference.pdf)
- [**mdpi.com** Traffic Sign Recognition Based on Bayesian Angular Margin Loss](https://www.mdpi.com/2079-9292/12/14/3073)
- [**youspice.com** SPICE Modeling with AI: Powering Electronic Device Modeling](https://youspice.com/spice-modeling-with-ai-powering-electronic-device-modeling/)
- [**iclr.cc** Track: Poster Session 3 Pavilion 3 - ICLR 2027](https://iclr.cc/virtual/2026/session/10021365)
- [**jisu.online** Jisu Mondal](https://www.jisu.online/)
- [**pypi.org** PyLTSpice - PyPI](https://pypi.org/project/PyLTSpice/)
- [**spicelib.readthedocs.io** spicelib documentation](https://spicelib.readthedocs.io/_/downloads/en/latest/pdf/)
- [**pypi.org** spicelib · PyPI](https://pypi.org/project/spicelib/0.4/)
- [**jurj.de** Ψ-xLSTM: Automated Behavioral Verilog-A Generation from Distilled](https://www.jurj.de/psi-xlstm-automated-behavioral-verilog-a-generation-from-distilled-physics-informed-xlstm-networks-for-high-frequency-device-modeling/)
- [**ieeexplore.ieee.org** xLSTM: Automated Behavioral Verilog-A Generation From Distilled](https://ieeexplore.ieee.org/iel8/6287639/11323511/11457604.pdf)
- [**pubs.aip.org** Black-box optimization using factorization and Ising machines](https://pubs.aip.org/aip/apr/article/13/2/021307/3387019/Black-box-optimization-using-factorization-and)
- [**cora.ucc.ie** Bayesian Optimization with Multi-objective Acquisition Function for](https://cora.ucc.ie/server/api/core/bitstreams/2b2ff52d-a0ed-4c21-89be-1049951bd86b/content)
- [**pyltspice.readthedocs.io** Reading Raw Files - PyLTSpice documentation](https://pyltspice.readthedocs.io/en/latest/modules/read_rawfiles.html)
- [**cseweb.ucsd.edu** The Life of SPICE as a Transient Circuit Simulator - UCSD CSE](https://cseweb.ucsd.edu/~kuan/talk/mtu18/MtuTalk022318.pdf)
- [**researchgate.net** (PDF) Xyce Parallel Electronic Simulator Design: Developer Guide](https://www.researchgate.net/publication/258441741_Xyce_Parallel_Electronic_Simulator_Design_Developer_Guide)
- [**scribd.com** ASM-HEMT: GaN HEMT Modeling Insights | PDF | Electronics - Scribd](https://www.scribd.com/document/850259751/Asm-Hemt-Yschauhan)
- [**github.com** GitHub - nunobrum/spicelib: Python library to interact with spice](https://github.com/nunobrum/spicelib)
- [**nunobrum.com** PyLTSpice - LTSpice Raw Reader - NUNO BRUM](https://www.nunobrum.com/pyltspice.html)
- [**github.com** PyLTSpice/README.md at master - GitHub](https://github.com/nunobrum/PyLTSpice/blob/master/README.md)
- [**bib-pubdb1.desy.de** Charge collection studies of MAPS in a 65 nm CMOS imaging process](https://bib-pubdb1.desy.de/record/644987/files/Manuel%208688.pdf?subformat=pdfa)
- [**pyltspice.readthedocs.io** Welcome to PyLTSpice's documentation! — PyLTSpice documentation](https://pyltspice.readthedocs.io/)
- [**preprints.org** EDASYTH: An LLM-in-the-Loop Hardware Design Workflow with](https://www.preprints.org/manuscript/202609.0945)
- [**bib-pubdb1.desy.de** Charge collection studies of MAPS in a 65 nm CMOS imaging process](https://bib-pubdb1.desy.de/record/644987/files/Manuel%208688.pdf?version=1)
- [**nicsefc.ee.tsinghua.edu.cn** A Fast Parallel Sparse Solver for SPICE-based Circuit Simulators](https://nicsefc.ee.tsinghua.edu.cn/%2Fnics_file%2Fpdf%2Fpublications%2F2015%2FDATE15_23.pdf)
- [**tuprints.ulb.tu-darmstadt.de** Transient forward harmonic adjoint sensitivity analysis - TUprints](https://tuprints.ulb.tu-darmstadt.de/bitstreams/7e95f6b0-e366-4228-924e-f3542bddf22b/download)
- [**google.com** EP1915673A2 - Simulation of systems - Google Patents](https://www.google.com/patents/EP1915673A2?cl=en)
- [**anl.gov** Advanced Research Directions on AI for Science, Energy, and Security](https://www.anl.gov/sites/www/files/2024-05/AI4SESReport-2023-v7.pdf)
- [**openscholarship.wustl.edu** Robust Analog Circuit Parameter Optimization with Sampling](https://openscholarship.wustl.edu/cgi/viewcontent.cgi?article=1885&context=eng_etds)
- [**github.com** GitHub - richardcsuwandi/awesome-bo: A curated list of Bayesian](https://github.com/richardcsuwandi/awesome-bo)
- [**fugumt.com** Related papers: Batch Acquisition Function Evaluations and](https://fugumt.com/fugumt/paper_check/2511.13625v2_enmode)
- [**ssslab.cn** A Bayesian Optimization Accelerated PTA Solver for SPICE Simulation](https://www.ssslab.cn/assets/papers/2022-xing-BoA-PTA.pdf)
- [**ieee-cas.org** a short history of - IEEE Circuits and Systems Society](https://ieee-cas.org/files/ieeecass/2022-01/a_short_history_of_circuits_and_systems-_ebook-_web.pdf)
- [**scribd.com** Ngspice 27 Manual | PDF | Bipolar Junction Transistor | Mosfet - Scribd](https://www.scribd.com/document/378557478/Ngspice-27-Manual)
- [**m.youtube.com** # **Inside BSIM4 Evaluation Engine** ## **`bsim4eval.c ... - YouTube](https://m.youtube.com/post/UgkxSfdhCx4M2tnnV2Wa5NU638tbmxSK_tUX)
- [**scribd.com** Technical | PDF | Electrical Network | Matrix (Mathematics) - Scribd](https://www.scribd.com/document/525388168/technical)
- [**context7.com** spicelib (nunobrum/spicelib) - Context7](https://context7.com/nunobrum/spicelib)
- [**pypi.org** PyLTSpice 3.1 - PyPI](https://pypi.org/project/PyLTSpice/3.1/)
- [**pypi.org** PyLTSpice · PyPI](https://pypi.org/project/PyLTSpice/4.0.5/)
- [**ez.analog.com** Low resolution waveforms in exported waveform - Q&A - LTspice](https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/593430/low-resolution-waveforms-in-exported-waveform)
- [**lreee.org** Dr. Haitham Abu-Rub - lreee.org](https://lreee.org/wp-content/uploads/2026/04/IMCET26-Program.pdf)
- [**pmc.ncbi.nlm.nih.gov** Applications and Techniques for Fast Machine Learning in Science](https://pmc.ncbi.nlm.nih.gov/articles/PMC9041419/)
- [**arxiv.org** Catchup results for Machine Learning on Mon, 03 Aug 2026 - arXiv](https://arxiv.org/catchup/cs.LG/2026-08-03?abs=True&page=1)
- [**academic.oup.com** ACCEPTED MANUSCRIPT - Oxford Academic](https://academic.oup.com/ce/advance-article-pdf/doi/10.1093/ce/zkag057/70974906/zkag057.pdf)
- [**scispace.com** Analog circuits optimization based on evolutionary computation](https://scispace.com/papers/analog-circuits-optimization-based-on-evolutionary-3uy2scctl6)
- [**mdpi.com** Recent Developments and Perspectives on Optimization Design](https://www.mdpi.com/2073-8994/17/4/529)
- [**scribd.com** MOEA-D vs. NSGA-II | PDF | Electronic Oscillator - Scribd](https://www.scribd.com/document/1011472753/MOEA-D-vs-NSGA-II)
- [**researchgate.net** Analog Circuit Design Optimization Based on Evolutionary Algorithms](https://www.researchgate.net/publication/270628392_Analog_Circuit_Design_Optimization_Based_on_Evolutionary_Algorithms)
- [**mdpi.com** Deterministic Multi-Objective Optimization of Analog Circuits - MDPI](https://www.mdpi.com/2079-9292/13/13/2510)
- [**lirias.kuleuven.be** Using Probabilistic Model Rollouts to Boost the Sample Efficiency of](https://lirias.kuleuven.be/retrieve/c0839a19-98ec-4da1-9996-4aa473baa1a6)
- [**ieeexplore.ieee.org** Automatic Optimal Design Method for Circuit Sizing Based on CNN](https://ieeexplore.ieee.org/iel8/6287639/10380310/10683687.pdf)
- [**catalogimages.wiley.com** COPYRIGHTED MATERIAL](https://catalogimages.wiley.com/images/db/pdf/9781394289417.excerpt.pdf)
- [**scribd.com** Designing For Stability in High Frequency Circuits | PDF - Scribd](https://www.scribd.com/document/896077676/Designing-for-Stability-in-High-Frequency-Circuits)
- [**mdpi.com** Transistor Frequency-Response Analysis: Recursive Shunt-Circuit](https://www.mdpi.com/2079-9292/14/2/296)
- [**chic.caltech.edu** Generalized Time- and Transfer-Constant Circuit Analysis - CHIC](https://chic.caltech.edu/wp-content/uploads/2014/02/Final-Paper.pdf)
- [**e2e.ti.com** Optimal single resistors damping of input filters - Texas Instruments](https://e2e.ti.com/cfs-file/__key/communityserver-discussions-components-files/196/Optimal_5F00_single_5F00_resistors_5F00_damping_5F00_of_5F00_input_5F00_filters.pdf)
- [**venableinstruments.com** Introduction to the Extra Element Theorem - Venable Instruments](https://www.venableinstruments.com/blog/extra-element-theorem)
- [**kenkundert.com** Striving for small-signal stability - Ken Kundert](https://kenkundert.com/docs/cd2001-01.pdf)
- [**scribd.com** GFT Template User's Manual | PDF | Feedback | Electronic Circuits](https://www.scribd.com/document/126545787/General-Feedback-Theory-Manual)
- [**web.ece.ucsb.edu** Generalized Time- and Transfer-Constant Circuit Analysis](https://web.ece.ucsb.edu/Faculty/rodwell/Classes/mixed_signal/Hajimiri_MOTC.pdf)
- [**intusoft.com** Intusoft Newsletter, May 2003](http://www.intusoft.com/nlhtm/nl70.htm)
- [**opus4.kobv.de** Physics-based trap modeling of GaN HEMTs - OPUS](https://opus4.kobv.de/opus4-btu/files/6933/Petros_Beleniotis.pdf)
- [**research.chalmers.se** Parameter Extraction and SPICE Modeling of Packaged GaN Power](https://research.chalmers.se/publication/552294/file/552294_Fulltext.pdf)
- [**scribd.com** Advanced SPICE Model For GaN HEMTs | PDF - Scribd](https://www.scribd.com/document/765802032/Advanced-SPICE-Model-for-GaN-HEMTs)
