# The Mathematical Engine of SPICE: Translating Circuit Theory into Computational Matrix Algorithms

## Introduction

The simulation of analog electronic circuits represents one of the most profound intersections of continuous physical reality and discrete computational mathematics. When an engineer sketches a schematic containing resistors, capacitors, bipolar junction transistors, and operational amplifiers, they are describing a continuous dynamical system governed by Maxwell's equations, semiconductor device physics, and solid-state quantum mechanics. However, a microprocessor cannot process continuous physical reality; it is inherently bound to discrete, finite, algebraic operations. To bridge this gap, the Simulation Program with Integrated Circuit Emphasis (SPICE) was developed. Originating from early topological solvers like CANCER (Computer Analysis of Nonlinear Circuits, Excluding Radiation) developed by Ronald Rohrer, Laurence Nagel, and Donald Pederson at the University of California, Berkeley in the early 1970s, SPICE revolutionized electronic design automation . The core triumph of SPICE is not merely its physical modeling, but its translation of complex, non-linear, time-dependent circuit behavior into massive, highly optimized systems of linear algebraic equations. This exhaustive report details the mathematical architecture of the SPICE engine, exploring how human-readable circuit theory is deconstructed into the strictly optimized, computational matrix algorithms of Modified Nodal Analysis (MNA), Newton-Raphson iteration, and Sparse LU Factorization.

## Chapter 1: The Human vs. The Machine

To fundamentally comprehend the computational architecture of SPICE, one must first recognize the profound divergence between human circuit analysis and algorithmic machine processing. When a human engineer evaluates a circuit, they employ visual-spatial intuition, heuristic abstractions, and topological pattern recognition. A human instantly identifies series and parallel combinations, recognizes bridge topologies, and isolates sub-circuits like current mirrors, differential pairs, or Darlington configurations. Armed with this visual intuition, the human applies a flexible arsenal of analytical techniques: Superposition to isolate independent sources, Thevenin and Norton equivalencies to simplify complex networks into single sources and impedances, or Mesh Analysis to calculate planar loop currents . 

A computational engine, however, is entirely blind. It does not possess a visual cortex to recognize a "bridge" or a "series pair." To a computer, a schematic is nothing more than a deeply unstructured list of nodes and branch connections, commonly provided as a text-based netlist defining components and their terminal attachments. If a software engine were programmed to use Mesh Analysis, it would first have to execute complex graph-theory algorithms to identify planar loops, a task that becomes computationally prohibitive—and often mathematically impossible—for highly complex, non-planar integrated circuits that characterize modern VLSI design . Furthermore, techniques like Superposition are strictly limited to linear systems; they collapse entirely the moment a non-linear diode or transistor is introduced. 

Therefore, the machine requires a universal, algorithmic, and mathematically rigid framework that operates without visual heuristics. It must translate the circuit topology into a purely numerical format. The foundational alternative to human heuristics in early computer-aided design was Sparse Tableau Analysis (STA), proposed by Brayton, Gustavson, and Hachtel at IBM . STA writes Kirchhoff's Current Law (KCL), Kirchhoff's Voltage Law (KVL), and all branch constitutive equations separately into one massive, highly sparse matrix. While STA is incredibly robust, it results in a matrix of staggering dimensions, slowing down computation . Conversely, Nodal Analysis translates the entire physical structure of the circuit into a single, comprehensive linear algebra problem of much smaller dimensionality by eliminating branch currents and formulating everything in terms of node voltages . Because node voltages (unlike mesh currents) can be universally defined relative to a single ground datum for any topology—planar or non-planar—the machine relies exclusively on Nodal formulations. The machine does not "solve a circuit" in the human sense; it solves a system of simultaneous linear equations where the connectivity is mapped by a node-branch incidence matrix .

## Chapter 2: The Foundation of KCL and Nodal Analysis

The mathematical bedrock of the SPICE algorithm is Kirchhoff's Current Law (KCL), which dictates that the algebraic sum of all currents leaving any given node must equal zero. In standard Nodal Analysis, this physical law is reformulated into a set of branch constitutive equations dependent entirely on node voltages. For a network composed strictly of independent current sources and linear conductances (resistors), the system is described by the matrix equation:

$[Y] \cdot [V] = [J]$

Where $[Y]$ is the nodal admittance matrix (often represented as $[G]$ for strictly resistive DC circuits), $[V]$ is the column vector of unknown node voltages, and $[J]$ is the column vector of known independent current sources . 

The construction of the conductance matrix $[G]$ is highly algorithmic and perfectly suited for machine execution through a process known as "stamping." The machine does not need to write out KCL equations manually; it simply reads the netlist line by line and stamps values into the matrix based on universal rules governed by the node-branch incidence matrix . For a generic circuit with $n$ independent nodes (excluding the reference ground node 0, which is eliminated to ensure the matrix is non-singular), the $[G]$ matrix is an $n \times n$ symmetric matrix. 

The stamping rules for standard Nodal Analysis strictly follow these algorithmic steps: the element at the $k$-th row and $k$-th column (the diagonal) is the positive sum of all conductances connected directly to node $k$. The element at the $j$-th row and $k$-th column (the off-diagonal) is the negative sum of all conductances connected directly between node $j$ and node $k$ . 

If a resistor with resistance $R$ (and conductance $g = 1/R$) is connected between node $i$ and node $j$, the software executes a localized stamping operation: it adds $g$ to $G_{i,i}$ and $G_{j,j}$, and subtracts $g$ from $G_{i,j}$ and $G_{j,i}$ . If the resistor is connected to ground (node 0), it only contributes $+g$ to the diagonal element of the non-ground node, as the ground node is excluded from the system of unknowns to ensure invertibility . Simultaneously, the right-hand side (RHS) current vector $[J]$ is populated. If an independent current source injects a current $I_s$ into node $i$ and draws it from node $j$, the value $+I_s$ is stamped into $J_i$ and $-I_s$ is stamped into $J_j$ . 

This standard Nodal Analysis framework is remarkably elegant for passive networks. The resulting $[G]$ matrix for a passive resistive network is inherently symmetric, diagonally dominant, and positive-definite, guaranteeing numerical stability when the computer factors it to solve for $[V] = [G]^{-1} \cdot [J]$. However, this pristine mathematical construct shatters the moment an ideal voltage source is introduced.

## Chapter 3: The Problem with Voltage Sources

While standard Nodal Analysis is mathematically flawless for circuits containing only conductances and current sources, it harbors a fatal algorithmic flaw: it cannot inherently handle ideal voltage sources. This limitation is catastrophic for a generalized circuit simulator, as voltage sources are the most fundamental stimuli in electronic design.

To understand why software fails here, one must examine the mathematics of the branch constitutive equation. In standard Nodal Analysis, every branch current must be expressed as a function of node voltages using Ohm's Law: $I = (V_i - V_j) \cdot G$. The algorithm relies on the fact that $G$ is a finite, quantifiable value. 

An ideal voltage source, however, presents two insurmountable mathematical paradoxes for this framework. First, an ideal voltage source has zero internal resistance, meaning its equivalent conductance is mathematically infinite ($G = \infty$). If a computer engine attempts to stamp an ideal voltage source into the standard $[G]$ matrix using the $1/R$ rule, it triggers a divide-by-zero exception, attempting to place infinity on the matrix diagonal . Second, the current flowing through an ideal voltage source is not determined by the voltage across it; rather, it is dictated entirely by the external circuit attached to it. The current is an independent unknown variable. Because standard Nodal Analysis assumes the only unknowns are the node voltages, it has no mathematical column or row designated to solve for an unknown branch current .

Early simulators attempted to bypass this topological limitation by enforcing a Norton equivalent transformation, artificially converting every voltage source into a current source in parallel with a small resistance . However, this "fictitious resistance" approach introduced severe numerical conditioning problems. If the artificial resistance was too small, the resulting massive conductances overshadowed other legitimate circuit values, leading to floating-point truncation errors and severely ill-conditioned matrices. If the resistance was too large, it fundamentally altered the physical accuracy of the circuit. 

Additionally, standard Nodal Analysis cannot inherently handle certain active dependent sources, specifically Voltage-Controlled Voltage Sources (VCVS), Current-Controlled Voltage Sources (CCVS), and Current-Controlled Current Sources (CCCS). These elements either enforce absolute voltage constraints without a finite conductance, or their outputs depend on branch currents, which standard Nodal Analysis explicitly eliminates from the solution vector . To resolve this, a paradigm shift in the core matrix formulation was required. 

## Chapter 4: Modified Nodal Analysis (MNA) Stamping Rules

In 1975, Chung-Wen Ho, Albert E. Ruehli, and Pierce A. Brennan published a seminal paper in the IEEE Transactions on Circuits and Systems titled "The Modified Nodal Approach to Network Analysis" . This paper introduced Modified Nodal Analysis (MNA), which instantly became the mathematical backbone of SPICE2 and remains the core of all modern SPICE-derived computational engines . 

MNA brilliantly eliminates the voltage source paradox by systematically expanding the system of equations. Instead of forcing voltage sources into the $[G]$ matrix via infinite conductances, MNA accepts that the current through a voltage source is an uneliminable unknown. It augments the standard Nodal Analysis matrices by adding extra rows to represent the constitutive voltage equations of the sources, and extra columns to represent the unknown branch currents of those sources .

The MNA system is formulated as a massive block matrix equation:

$\begin{bmatrix} G & B \\ C & D \end{bmatrix} \cdot \begin{bmatrix} V \\ J \end{bmatrix} = \begin{bmatrix} I \\ E_v \end{bmatrix}$

| Submatrix / Vector | Dimension | Mathematical Definition within the MNA Framework |
| :--- | :--- | :--- |
| **$[G]$ Matrix** | $n \times n$ | The standard conductance matrix derived from KCL, mapping node voltages to nodal currents . |
| **$[B]$ Matrix** | $n \times m$ | Maps the unknown voltage source currents into the KCL nodal equations ($m$ is the number of independent voltage sources) . |
| **$[C]$ Matrix** | $m \times n$ | Maps the node voltages into the specific voltage constraints imposed by the sources. For independent sources, it is the transpose of $[B]$ ($C = B^T$) . |
| **$[D]$ Matrix** | $m \times m$ | Represents the dependence of voltage constraint equations on unknown branch currents. Exactly zero for independent voltage sources . |
| **$[V]$ Vector** | $n \times 1$ | The vector of unknown node voltages . |
| **$[J]$ Vector** | $m \times 1$ | The augmented vector of unknown branch currents flowing through the voltage sources . |
| **$[I]$ Vector** | $n \times 1$ | The vector of known independent current source values . |
| **$[E_v]$ Vector** | $m \times 1$ | The vector of known independent voltage source values . |

The "stamping" rules for MNA are brilliantly mechanical, allowing the software to construct the matrix rapidly during the netlist parsing phase. When the SPICE parser encounters an independent voltage source $V_k$ with a value of $E$ connected between a positive node $i$ and a negative node $j$, it performs the following structural modifications :
1. It creates a new column in the matrix (in the $[B]$ partition) and a new row (in the $[C]$ partition), representing the new unknown current $I_{V_k}$.
2. In the $[B]$ matrix, it stamps a $+1$ at row $i$ (indicating $I_{V_k}$ leaves node $i$) and a $-1$ at row $j$ (indicating $I_{V_k}$ enters node $j$).
3. In the $[C]$ matrix, it stamps a $+1$ at column $i$ and a $-1$ at column $j$. This mechanically translates to the constraint equation $V_i - V_j = E$.
4. It stamps the value $E$ into the corresponding row of the right-hand side vector $[E_v]$.

For passive networks with independent sources, the $[C]$ matrix is strictly the transpose of the $[B]$ matrix ($C = B^T$), preserving the structural symmetry of the augmented system . However, as we will see, this symmetry is intentionally broken when active dependent sources are introduced.

## Chapter 5: Handling Dependent Sources

The true computational power of MNA lies in its ability to elegantly absorb dependent sources—the foundational building blocks of active transistor macromodels. There are four types of dependent sources: Voltage-Controlled Current Sources (VCCS), Voltage-Controlled Voltage Sources (VCVS), Current-Controlled Current Sources (CCCS), and Current-Controlled Voltage Sources (CCVS). Each interacts with the MNA block matrix in a distinct mathematical manner, and many actively destroy the symmetry of the matrix, fundamentally representing the unidirectional flow of signal in active components .

| Dependent Source Type | Matrix Modified | Stamping Mechanism in MNA | Symmetry Impact |
| :--- | :--- | :--- | :--- |
| **VCCS (G-element)** | $[G]$ | A VCCS outputs a current based on a differential voltage. Because output is current and control is voltage, it fits perfectly within $[G]$ ($I = G \cdot V$). For output nodes $p, q$ and control nodes $c+, c-$, it stamps $+g_m$ at $(p, c+)$ and $(q, c-)$, and $-g_m$ at $(p, c-)$ and $(q, c+)$ . | Breaks symmetry because row indices (output) differ from column indices (control) . |
| **VCVS (E-element)** | $[B], [C]$ | Requires an augmented row and column. Output current is stamped into $[B]$ like an independent source ($+1, -1$). The constraint equation $V_p - V_q - \mu(V_{c+} - V_{c-}) = 0$ is stamped into $[C]$ as $+1$ at $p$, $-1$ at $q$, $-\mu$ at $c+$, and $+\mu$ at $c-$ . | Breaks symmetry because $[C]$ is no longer the transpose of $[B]$. |
| **CCCS (F-element)** | $[B], [C]$ | Standard Nodal Analysis eliminates branch currents, so SPICE must explicitly calculate the controlling current by inserting a $0V$ independent voltage source (ammeter) . The CCCS then adds its current gain factor $\beta$ into the corresponding column of $[B]$ . | Breaks symmetry due to reliance on an asymmetric ammeter constraint. |
| **CCVS (H-element)** | $[B], [C], [D]$ | The most complex source. Requires both an ammeter augmentation for input and a voltage constraint augmentation for output. Its transresistance value $r_m$ is stamped into the $[D]$ matrix . Equation: $V_p - V_q - r_m I_{control} = 0$ . | Fully populates the MNA block structure, heavily breaking matrix symmetry. |

Through these highly structured, spatially discrete rules, SPICE systematically maps any arbitrary linear circuit topology directly into random-access memory as a dense mathematical grid, ready for processing.

## Chapter 6: The Non-Linear Wall

The MNA matrix formulated in the previous chapters is a triumph of computational translation, but it is strictly limited to linear algebra. The equation $[A] \cdot [X] = [Z]$ inherently implies that the coefficient matrix $[A]$ is composed of constants. This works flawlessly for ideal resistors and dependent sources with fixed gains. However, practical electronics is heavily dominated by non-linear solid-state semiconductors: diodes, Bipolar Junction Transistors (BJTs), and Metal-Oxide-Semiconductor Field-Effect Transistors (MOSFETs). 

When a non-linear component is introduced into the netlist, the linear algebraic framework instantly hits a mathematical wall. Consider a simple ideal p-n junction diode connected between node 1 and ground. The current drawn from node 1 is not $I = V_1 \cdot G$. Instead, it is governed by the Shockley diode equation:

$I_D = I_S \left( e^{\frac{V_1}{N V_T}} - 1 \right)$

where $I_S$ is the saturation current, $N$ is the ideality factor, and $V_T$ is the thermal voltage .

It is mathematically impossible to place an exponential function into the constant coefficient matrix $[A]$. The system is no longer a set of linear equations; it has become a system of coupled, non-linear transcendental equations. There is no direct analytical solution (no closed-form algebraic inverse) for such a system. The matrix cannot simply be inverted to find the node voltages. Because the microprocessor ALU can only natively execute basic arithmetic (addition, subtraction, multiplication, division), it cannot directly "solve" for $V_1$. 

To bypass this non-linear wall, SPICE completely abandons direct analytical solutions. Instead, it transitions to numerical approximations, specifically iterative root-finding algorithms. The continuous, exponential curve of the semiconductor must be momentarily frozen in state space and approximated as a straight line at a specific operating point. The SPICE engine must guess the answer, test the linear approximation of the circuit at that guess, measure the error, and generate a better guess. This dramatically shifts the computational burden from a single matrix inversion to a loop of successive, computationally expensive matrix inversions.

## Chapter 7: The Newton-Raphson Algorithm

The heart of SPICE’s non-linear solver is the Newton-Raphson (NR) algorithm, a rigorous calculus-based method for finding the roots of a real-valued function. To apply NR, SPICE formulates the circuit's state as a multidimensional function $F(V)$ representing the sum of currents at every node (KCL), which must equal zero for a valid solution: $F(V) = 0$ .

For a non-linear circuit, $F(V)$ is highly complex. The NR algorithm begins with an initial arbitrary guess for all node voltages, denoted as $V^{(0)}$. It then evaluates the first derivative of the circuit equations with respect to the node voltages at that specific operating point. In a multidimensional system, this derivative is the Jacobian matrix, $J_F(V)$, which represents the tangent hyperplane to the non-linear function space .

The algorithm calculates the next iterative guess, $V^{(k+1)}$, using the multidimensional Taylor series expansion truncated after the first derivative :

$V^{(k+1)} = V^{(k)} - [J_F(V^{(k)})]^{-1} \cdot F(V^{(k)})$

In practice, to avoid explicit inversion, SPICE solves the linearized system:
$[J_F(V^{(k)})] \cdot \Delta V = -F(V^{(k)})$
where $\Delta V$ is the voltage update step ($V^{(k+1)} - V^{(k)}$) .

Because semiconductor equations contain incredibly steep exponentials, a poor guess can cause the tangent line to project the next voltage guess into the tens or hundreds of volts. Since the exponential function $e^V$ evaluates to massive, overflow-inducing numbers at high voltages, SPICE employs proprietary voltage-limiting algorithms during the NR iterations. Built-in limiting functions like `pnjlim` (for p-n junctions) and `fetlim` (for MOSFETs) intercept the NR update step. If $\Delta V$ exceeds a critical threshold ($V_{crit}$), the `pnjlim` algorithm algorithmically dampens the voltage step, mathematically forcing the iteration path to take smaller, logarithmic steps up the steep exponential curve. This prevents floating-point overflow and numerical oscillation, ensuring the solver does not wildly diverge into mathematically undefined states .

The algorithm loops endlessly until it converges upon a stable solution. SPICE considers the system converged only when the difference between the current guess and the previous guess falls below strict, user-defined tolerance thresholds for every single node and branch. 

The convergence criteria are mathematically defined as:
$|V^{(k+1)} - V^{(k)}| \le \text{RELTOL} \cdot \max(|V^{(k+1)}|, |V^{(k)}|) + \text{VNTOL}$
$|I^{(k+1)} - I^{(k)}| \le \text{RELTOL} \cdot \max(|I^{(k+1)}|, |I^{(k)}|) + \text{ABSTOL}$

| Tolerance Parameter | Default Value | Computational Purpose |
| :--- | :--- | :--- |
| **RELTOL** | 0.001 (0.1%) | The primary accuracy control. It defines the maximum relative error permitted between successive Newton-Raphson iterations. It scales with the magnitude of the signal being solved . |
| **VNTOL** | $1 \mu V$ | The absolute voltage tolerance (noise-floor threshold). It ensures that nodes resting near zero volts do not force infinite iterations due to microscopic floating-point noise . |
| **ABSTOL** | $1 pA$ | The absolute current tolerance. The equivalent noise-floor for branch currents. It is tightened for low-power circuits and loosened for high-power switching circuits . |
| **CHGTOL** | $10 fC$ | Absolute tolerance for charge, utilized specifically for transient Local Truncation Error (LTE) timestep control . |

Only when every single variable in the entire MNA matrix satisfies these constraints simultaneously does the SPICE engine declare that the physical reality of the circuit has been successfully simulated for that specific state .

## Chapter 8: Device Linearization (Companion Models)

To execute the Newton-Raphson formulation natively within the MNA framework, SPICE does not construct a separate Jacobian matrix from scratch. Instead, it relies on a brilliant computational trick: Device Linearization via Companion Models. At each NR iteration $k$, every non-linear device is mathematically replaced by a linear, temporary "companion" circuit consisting solely of an ideal resistor and an independent current source . This forces the non-linear device into a format that can be seamlessly stamped into the MNA block matrix.

Consider again the diode. The Jacobian requires the derivative of the current with respect to voltage. This is physically defined as the dynamic conductance, $g_{eq}$:

$g_{eq} = \frac{\partial I_D}{\partial V_D}\Bigg|_{V^{(k)}} = \frac{I_S}{N V_T} e^{\frac{V^{(k)}}{N V_T}}$

This dynamic conductance forms the linear equivalent resistance of the diode at the current guess . However, simply placing $g_{eq}$ in the circuit is insufficient, as the tangent line does not necessarily pass through the origin. To account for the DC offset of the tangent line (the intercept), an equivalent current source, $I_{eq}$, is calculated and placed in parallel with $g_{eq}$:

$I_{eq} = I_D(V^{(k)}) - g_{eq} \cdot V^{(k)}$

During each iteration, the SPICE engine dynamically calculates $g_{eq}$ and stamps it into the $[G]$ matrix, while stamping $I_{eq}$ into the RHS current vector $[I]$ . The engine then solves the purely linear MNA matrix, generates the new voltage guesses $V^{(k+1)}$, deletes the old companion components, calculates new values for $g_{eq}$ and $I_{eq}$ at $V^{(k+1)}$, and stamps them again.

This companion model concept extends to all non-linear devices. For a Bipolar Junction Transistor, the Ebers-Moll or Gummel-Poon model generates a massive Jacobian sub-matrix involving transconductances ($g_m = \partial I_C / \partial V_{BE}$), output conductances ($g_o = \partial I_C / \partial V_{CE}$), and multiple equivalent current sources reflecting the forward and reverse active regions, all stamped iteratively into the MNA matrix . 

Furthermore, this identical companion model philosophy is used to solve the calculus of time during Transient Analysis. Time derivatives of capacitors ($I = C \frac{dV}{dt}$) and inductors ($V = L \frac{dI}{dt}$) cannot be solved algebraically. SPICE discretizes time into finite steps ($\Delta t$) and uses numerical integration (like Backward Euler, Trapezoidal, or Gear methods) to convert energy storage into algebraic equations . 

| Transient Integration Method | Mathematical Characteristic | SPICE Implementation Notes |
| :--- | :--- | :--- |
| **Backward Euler (BE)** | Uses the slope at $x_{n+1}$ to predict the next voltage. First-order method. | Extremely stable, highly damped. Can artificially suppress high-frequency oscillations (numerical damping). Often used as a fallback . |
| **Trapezoidal (TRAP)** | Calculates the average slope of the present and next time point. Second-order method. | Highly accurate with low numerical damping, making it the default in many SPICE versions. However, it is prone to numerical "Trapezoidal ringing" on fast switching edges where capacitor currents oscillate artificially . |
| **Gear (GEAR)** | Higher-order backward differentiation formula. Evaluates multiple past time points. | Suppresses Trapezoidal ringing effectively. Heavily preferred for switching power supplies and high-speed digital circuits. Introduces slight numerical damping . |

For example, using the Backward Euler formula, the capacitor's differential equation is approximated as:
$V^{(t+1)} = V^{(t)} + \frac{\Delta t}{C} I^{(t+1)}$
Rearranging for the unknown current:
$I^{(t+1)} = \frac{C}{\Delta t} V^{(t+1)} - \frac{C}{\Delta t} V^{(t)}$

This equation perfectly mirrors Ohm's law. SPICE replaces the capacitor with a linear discrete-time companion model: an equivalent conductance $g_{eq} = C / \Delta t$ stamped into the $[G]$ matrix, and a history-dependent current source $I_{eq} = (C / \Delta t) V^{(t)}$ stamped into the RHS vector . 

In modern VLSI simulation, defining capacitance merely as $C$ is insufficient due to extreme non-linearities in MOSFET gate structures. Early SPICE versions utilized the Meyer capacitance model, which mapped capacitances via reciprocal voltage relationships but famously failed to guarantee charge conservation, leading to simulated charge being artificially created or destroyed during fast transient switching . Modern SPICE addresses this by utilizing the Ward-Dutton charge-partitioning scheme (or BSIM equivalents). The Ward-Dutton model calculates equivalent capacitive currents based explicitly on the time derivatives of highly non-linear, mathematically partitioned nodal charges ($I_C = dQ/dt$) rather than terminal capacitances, inherently enforcing charge conservation and numerical stability across transient time steps .

## Chapter 9: LU Factorization and Sparse Matrices

Once the non-linear devices and energy-storage elements have been linearized into their respective companion models, the SPICE engine is left with a massive, linear MNA matrix equation: $A \cdot x = b$. For a modern integrated circuit, this matrix can easily exceed $100,000 \times 100,000$ elements. 

If the software attempted a direct mathematical inverse ($x = A^{-1} \cdot b$), the computational cost would scale at $O(N^3)$, requiring trillions of floating-point operations. However, electronic circuits possess a unique topological signature: they are highly disconnected. In a typical circuit, an average node only physically connects to 2 or 3 other nodes, regardless of whether the circuit has 10 nodes or 1,000,000 nodes. Consequently, each row in the MNA matrix contains only a few non-zero entries. Over 99% of the MNA matrix is composed entirely of zeros, rendering it a highly sparse matrix . 

To exploit this physical reality, SPICE engines completely abandon standard matrix inversion and instead rely on Sparse Lower-Upper (LU) Factorization (such as Kenneth Kundert's Sparse 1.3 algorithm commonly implemented in advanced SPICE solvers like NGSPICE) . 

LU Factorization decomposes the MNA matrix $[A]$ into the product of a lower triangular matrix $[L]$ and an upper triangular matrix $[U]$, such that $A = L \cdot U$. 
The system $L \cdot U \cdot x = b$ is then solved in two highly efficient $O(N^2)$ steps:
1. Forward Substitution: Solve $L \cdot y = b$ for $y$.
2. Backward Substitution: Solve $U \cdot x = y$ for $x$.

The paramount algorithmic challenge in Sparse LU factorization is avoiding "fill-in"—the phenomenon where structural zeros in the original matrix become non-zeros during the Gaussian elimination process, drastically consuming memory and CPU cycles. To mitigate this, SPICE employs dynamic matrix pivoting . Algorithms like Markowitz pivoting actively reorder the rows and columns of the MNA matrix during factorization. At each elimination step, the algorithm selects a pivot element that minimizes the product of the number of non-zeros in its row and column, thereby probabilistically guaranteeing the minimum generation of new non-zero fill-ins .

Furthermore, pivoting is mathematically vital for numerical stability. In MNA, the diagonal elements of the $[C]$ and $[D]$ submatrices frequently contain exact zeros (e.g., the voltage constraints of ideal sources). Attempting LU factorization without swapping these zero-diagonals out of the pivot position will immediately crash the solver with a division by zero exception . Additionally, pivoting mitigates matrix ill-conditioning . The condition number of a matrix ($\kappa(A) = ||A|| \cdot ||A^{-1}||$) quantifies how sensitive the solution is to microscopic floating-point rounding errors . Circuits containing both incredibly small values (e.g., femtofarad parasitics, micro-ohm traces) and incredibly large values (e.g., megaohm resistors, teraohm insulators) yield highly ill-conditioned MNA matrices . By utilizing threshold pivoting constraints (controlled by internal engine parameters like `PIVTOL` and `PIVREL`), SPICE avoids dividing by microscopically small matrix entries during factorization, maintaining the integrity of the floating-point solution against catastrophic precision loss .

## Chapter 10: The DC Operating Point (Bias)

The absolute zenith of SPICE's mathematical orchestration occurs before the concept of simulated time even begins: the calculation of the DC Operating Point (bias point). This initial state is the foundational anchor of all subsequent simulation. Without a mathematically valid DC operating point, Transient analysis has no initial conditions from which to integrate, and AC small-signal analysis (which relies on evaluating the complex admittance matrix derived from linearizing non-linear devices evaluated at the complex frequency $s = j\omega$) has no tangent lines to sweep . In an AC analysis, the SPICE engine replaces the linearized companion conductances with complex admittances, where a capacitor's matrix entry becomes strictly $j\omega C$, allowing a purely linear, small-signal matrix sweep across the frequency domain . But this is utterly reliant on the DC solver finding the accurate small-signal transconductances ($g_m$, $g_{ds}$) first.

To find the initial DC state, SPICE algorithmically freezes the universe. The parameter $t$ is locked to $0$. All discrete-time companion models for capacitors are mathematically replaced by open circuits (a conductance of 0), and all inductors are replaced by short circuits (an ideal 0V voltage source stamped into the MNA via an augmented equation) . The RHS vector stimuli are set strictly to their DC values.

The engine then launches the Newton-Raphson loop. It populates the MNA matrix with the DC companion models of the transistors and diodes, performs Sparse LU Factorization, checks the $\Delta V$ updates against RELTOL and VNTOL, and iterates.

If the circuit is well-designed, the NR algorithm rapidly converges in 5 to 10 iterations. However, in highly complex, highly non-linear topologies (like bistable multivibrators or deep-submicron ICs), the initial guess of zero volts across all nodes can place the NR algorithm in a mathematically unrecoverable state, oscillating wildly or projecting tangent lines toward infinity. 

When standard NR fails to converge within the allowed iteration limit (controlled by parameters like `ITL1`), modern SPICE engines seamlessly invoke advanced mathematical continuation methods . The most prominent is Gmin Stepping. The engine forcefully injects a baseline minimum conductance, $G_{min}$ (default $10^{-12} S$), diagonally across every single semiconductor junction in the matrix . This physically correlates to placing a 1-Teraohm resistor in parallel with every diode and transistor. Mathematically, this heavily fortifies the main diagonal of the MNA matrix, forcefully reducing the condition number and suppressing extreme non-linear gradients, practically guaranteeing convergence . Once the matrix converges, the engine employs a continuation parameter (often denoted as $\lambda$) to slowly reduce $G_{min}$ by orders of magnitude , using the converged voltages of the previous step as the highly accurate initial guess for the next, until $G_{min}$ is removed entirely. 

If Gmin stepping fails, the engine falls back to Source Stepping. It temporarily forces all independent voltage and current sources ($[E_v]$ and $[I]$) in the RHS vector to near zero. At zero power, the circuit trivially converges to zero volts everywhere. The engine then incrementally steps the sources up toward 100% power, continually tracking the NR convergence path . 

Only when the matrix stabilizes, satisfying KCL at every node to within pico-amps and micro-volts, does the DC Operating Point phase conclude. The final voltages, dynamic conductances, and partitioned charges are locked into memory. From this singular, meticulously calculated matrix state, the machine is finally prepared to launch the chronos of Transient Analysis or the frequency sweeps of AC Analysis, successfully transforming static mathematical arrays into the dynamic, computational simulation of physical reality. 


## Sources

- [**kolegite.com** THE SPICE BOOK](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%B0%D0%BD%D0%B5%D1%82%D0%BE%20%D0%B2%20%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0%D1%82%D0%B0/The%20SPICE%20Book%20by%20Andrei%20Vladimirescu%20%28z-lib.org%29.pdf)
- [**slideserve.com** Formulation of Circuit Equations - SlideServe](https://www.slideserve.com/amiel/formulation-of-circuit-equations)
- [**scribd.com** Modified Nodal Analysis in Circuit Theory | PDF | Matrix (Mathematics)](https://www.scribd.com/document/652572651/2002-Wedepohl)
- [**scribd.com** Modified Nodal Analysis in Circuit Simulation | PDF - Scribd](https://www.scribd.com/document/277142543/MNA-Stamp)
- [**researchgate.net** The modified nodal approach to network analysis - ResearchGate](https://www.researchgate.net/publication/3184759_The_modified_nodal_approach_to_network_analysis)
- [**lpsa.swarthmore.edu** Modified Nodal Analysis - printable - Swarthmore College](https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNAAll.html)
- [**hvg.ece.concordia.ca** A Tool for Modeling and Analysis of Electronic Circuits and Systems](https://hvg.ece.concordia.ca/Publications/TECH_REP/TMAAC_TR12/TMAAC_TR12.pdf)
- [**kilthub.cmu.edu** ASP - CMU's KiltHub](https://kilthub.cmu.edu/articles/journal_contribution/ASP_an_interactive_APL_circuit_simulation_package/6468356/files/11896907.pdf)
- [**digital-library.theiet.org** Modified nodal analysis: an essential addition to electrical circuit](https://digital-library.theiet.org/doi/pdf/10.1049/esej%3A20020301?download=true)
- [**dr.lib.iastate.edu** Transient analysis for symbolic simulation of large scale networks](https://dr.lib.iastate.edu/bitstreams/c1b28c1d-9aa5-44d3-8860-083fd7aac9d2/download)
- [**ieeexplore.ieee.org** The modified nodal approach to network analysis - IEEE Xplore](https://ieeexplore.ieee.org/document/1084079/)
- [**scribd.com** The Modified Nodal Approach To Network Analysis | PDF - Scribd](https://www.scribd.com/document/1064967586/The-modified-nodal-approach-to-network-analysis)
- [**github.com** Symbolic-modified-nodal-analysis/node analysis.ipynb at master](https://github.com/Tiburonboy/Symbolic-modified-nodal-analysis/blob/master/node%20analysis.ipynb)
- [**zealpolytechnic.com** Electrical Circuit Analysis & Network Theory - Zeal Polytechnic Pune](https://zealpolytechnic.com/wp-content/uploads/2023/04/Electrical-Circuit-Analysis-Network-Theory.pdf)
- [**acsu.buffalo.edu** SPICE, Device Model Parameters for Junction Diode](http://www.acsu.buffalo.edu/~wie/applet/spice_pndiode/spice_pndiode.html)
- [**kenkundert.com** Achieving Accurate Results With a Circuit Simulator - Ken Kundert](https://kenkundert.com/docs/eda+t93-preso.pdf)
- [**home.uncg.edu** Ebers-Moll Model of BJT](https://home.uncg.edu/~ehhellen/ebers-moll.html)
- [**arxiv.org** Well-Posed Models of Memristive Devices - arXiv](https://arxiv.org/pdf/1605.04897)
- [**accellera.org** Verilog-AMS Language Reference Manual - Accellera](https://www.accellera.org/images/downloads/standards/v-ams/VAMS-LRM-2-3-1.pdf)
- [**pmc.ncbi.nlm.nih.gov** A Collective Study on Modeling and Simulation of Resistive Random](https://pmc.ncbi.nlm.nih.gov/articles/PMC5762646/)
- [**community.infineon.com** Resolving convergence challenges in LTspice](https://community.infineon.com/t5/Knowledge-Base-Articles/Resolving-convergence-challenges-in-LTspice/ta-p/1053215)
- [**researchgate.net** Overview of SPICE-like circuit simulation algorithms - ResearchGate](https://www.researchgate.net/publication/3348837_Overview_of_SPICE-like_circuit_simulation_algorithms)
- [**ecircuitcenter.com** Transient Analysis - eCircuit Center](https://www.ecircuitcenter.com/SpiceTopics/Transient%20Analysis/Transient%20Analysis.htm)
- [**cseweb.ucsd.edu** The Life of SPICE as a Transient Circuit Simulator - UCSD CSE](https://cseweb.ucsd.edu/~kuan/talk/mtu18/MtuTalk022318.pdf)
- [**scribd.com** Ams Lec 10 Tran v01 | PDF - Scribd](https://www.scribd.com/document/769363334/ams-lec-10-tran-v01)
- [**intusoft.com** SPICE Numerical Methods, Part 1 Convergence Methods - Intusoft](http://www.intusoft.com/nlhtm/nl72.htm)
- [**web.engr.oregonstate.edu** Chapter 21 Using Transmission Lines](https://web.engr.oregonstate.edu/~moon/ece323/hspice98/files/chapter_21.pdf)
- [**cdn.badcaps-static.com** MOSFET Device Physics and Operation](https://cdn.badcaps-static.com/pdfs/e12bec0e4050f8e0ccdce8a0d6f3418e.pdf)
- [**scribd.com** Liu - MOSFET Models For SPICE Simulation Including BSIM3v3 and](https://www.scribd.com/document/568418922/Liu-MOSFET-Models-for-SPICE-Simulation-Including-BSIM3v3-and-BSIM4)
- [**theses.gla.ac.uk** Statistical Circuit Simulations - From 'Atomistic' Compact Models to](https://theses.gla.ac.uk/2720/1/2011noorainphd.pdf)
- [**mathworks.com** N-Channel MOSFET - MATLAB - MathWorks](https://www.mathworks.com/help/simscape-electrical/ref/nchannelmosfet.html)
- [**stacks.stanford.edu** virtual analog modeling of audio circuitry using wave digital filters a](https://stacks.stanford.edu/file/druid:jy057cz8322/KurtJamesWernerDissertation-augmented.pdf)
- [**scribd.com** LU Solver in Circuit Simulation | PDF | Matrix (Mathematics ... - Scribd](https://www.scribd.com/document/399175903/Lect09-Solver-LU-Sparse)
- [**researchgate.net** Sparse lu factorization of circuit simulation matrices - ResearchGate](https://www.researchgate.net/publication/228737226_Sparse_lu_factorization_of_circuit_simulation_matrices)
- [**researchgate.net** KLU sparse direct linear solver implementation into NGSPICE](https://www.researchgate.net/publication/254041555_KLU_sparse_direct_linear_solver_implementation_into_NGSPICE)
- [**researchgate.net** Modified nodal matrix before pivoting. - ResearchGate](https://www.researchgate.net/figure/Modified-nodal-matrix-before-pivoting_fig1_3184759)
- [**ohiouniversityfaculty.com** Lecture 11 Accuracy, Condition Numbers and Pivoting](http://www.ohiouniversityfaculty.com/youngt/IntNumMeth/lecture11.pdf)
- [**en.wikipedia.org** Condition number - Wikipedia](https://en.wikipedia.org/wiki/Condition_number)
- [**julia.quantecon.org** 21. Krylov Methods and Matrix Conditioning](https://julia.quantecon.org/tools_and_techniques/iterative_methods_sparsity.html)
- [**spiceopus.si** Simulator options - SPICE OPUS](https://www.spiceopus.si/simopt.html)
- [**scribd.com** AC Analysis in SPICE Simulations | PDF - Scribd](https://www.scribd.com/document/414846652/AC-Analysis)
- [**arxiv.org** The Admittance Matrix and Network Solutions - arXiv](https://arxiv.org/pdf/2507.15331)
- [**eng.biu.ac.il** Behind the scenes of the SPICE Circuit Simulator](https://www.eng.biu.ac.il/temanad/files/2022/04/Lecture-3-Behind-the-scenes-of-SPICE.pdf)
- [**scribd.com** Solving SPICE Convergence Problems | PDF - Scribd](https://www.scribd.com/document/1055086285/Solving-SPICE-Convergence-Problems)
- [**help.simetrix.co.uk** Simulator Reference: DC Operating Point Algorithms - SIMetrix](https://help.simetrix.co.uk/8.0/simetrix/mergedProjects/simulator_reference/topics/simref_convergence_accuracyandperformance_dcoperatingpointalgorithms.htm)
- [**mdpi.com** A SPICE-Oriented Method for Finding Multiple DC Solutions in](https://www.mdpi.com/2076-3417/13/4/2369)
- [**cdn14.21dianyuan.com** Spice Convergence Problems](https://cdn14.21dianyuan.com/download.php?id=177899)
- [**cseweb.ucsd.edu** HSPICE User Guide: Simulation and Analysis](https://cseweb.ucsd.edu/classes/wi10/cse241a/assign/hspice_sa.pdf)
- [**modrinth.com** CircuitSimCraft - Minecraft Mod - Modrinth](https://modrinth.com/mod/circuitsimcraft)
- [**rei.iteso.mx** Esta página es para la portada oficial de la tesis - ITESO](https://rei.iteso.mx/bitstreams/14f8ffa1-409e-4e46-aa01-29b6ebaf18a5/download)
- [**techrxiv.org** Comparative Analysis of Piece-by-Piece MNA and General MNA](https://www.techrxiv.org/doi/pdf/10.36227/techrxiv.21699662)
- [**scribd.com** Modified Nodal Analysis for Circuits | PDF | Matrix (Mathematics)](https://www.scribd.com/document/955724866/MNA75)
- [**web.engr.oregonstate.edu** ECE 521 - College of Engineering | Oregon State University](https://web.engr.oregonstate.edu/~karti/ece521/Lectures.pdf)
- [**joeydelp.github.io** Technical Discussion - JoSIM Documentation](https://joeydelp.github.io/JoSIM/tech_disc/)
- [**support.digilent.com** Convergence - Digilent](https://support.digilent.com/hc/en-us/articles/20366993128475-Convergence)
- [**ltwiki.org** Convergence problems? - LTwiki-Wiki for LTspice](https://ltwiki.org/index.php?title=Convergence_problems%3F)
- [**designers-guide.org** Simulator Options - Designer's Guide Community](https://designers-guide.org/analysis/dg-spice/chA.pdf)
- [**kpandiaraj.files.wordpress.com** EBERS Moll Model - WordPress.com](https://kpandiaraj.files.wordpress.com/2017/05/ebers-moll-model-ppt-compatibility-mode.pdf)
- [**web.cecs.pdx.edu** 5.5 THE EBERS-MOLL MODEL (ADVANCED TOPIC)](http://web.cecs.pdx.edu/~jmorris/ece321/ECE321%20Winter%202008/J%20&%20B%20Added%20Textbook%20Material/Section%205.5%20Insert%20p217-220.pdf)
- [**circuitcellar.com** The Ebers-Moll BJT Model - Circuit Cellar](https://circuitcellar.com/resources/quickbits/the-ebers-moll-bjt-model/)
- [**uom.lk** modified nodal analysis](https://uom.lk/sites/default/files/elect/files/ee321s3.3.pdf)
- [**circuitbread.com** Ebers-Moll Model | Semiconductor Devices: Theory and Application](https://www.circuitbread.com/textbooks/semiconductor-devices-theory-and-application/bipolar-junction-transistors-bjts/ebers-moll-model)
- [**scribd.com** Verilog-A Reference Manual Overview | PDF | Mathematical Model](https://www.scribd.com/document/443131269/VerilogA-pdf)
- [**researchgate.net** (PDF) Xyce Parallel Electronic Simulator Design: Developer Guide](https://www.researchgate.net/publication/258441741_Xyce_Parallel_Electronic_Simulator_Design_Developer_Guide)
- [**spiceopus.si** Verilog-A compact model support - SPICE OPUS](https://www.spiceopus.si/osdi.html)
- [**scribd.com** Semiconductor Device Modeling Guide | PDF | P–N Junction | Spice](https://www.scribd.com/document/726673741/Giuseppe-Massobrio-Paolo-Antognetti-Semiconductor-Device-Modeling-With-SPICE-McGraw-Hill-1993)
- [**eevblog.com** hh eeeeeeeeeeee rrrrrrrrrrr cccccccccc 00000000 - EEVblog](https://www.eevblog.com/forum/index.php?thememode=full;redirect=https%3A%2F%2Fwww.eevblog.com%2Fforum%2Fvintage-computing%2Ffortran-spice-for-ibm-mainframe%2F%3Faction%3Ddlattach%3Battach%3D1000038)
- [**electronics.stackexchange.com** Companion capacitor model in circuit simulation](https://electronics.stackexchange.com/questions/272012/companion-capacitor-model-in-circuit-simulation)
- [**docs.lib.purdue.edu** A STUDY OF NUMERICAL INTEGRATION TECHNIQUES FOR USE](https://docs.lib.purdue.edu/cgi/viewcontent.cgi?article=1301&context=ecetr)
- [**epdf.pub** Electrical Engineering and Applied Computing - PDF Free Download](https://epdf.pub/electrical-engineering-and-applied-computing.html)
- [**iee.et.tu-dresden.de** Micro-Cap 12](https://www.iee.et.tu-dresden.de/~jmueller/simulation/soft/microcap/MC12.RefManual.pdf)
- [**scribd.com** rm10 - Manual PDF - Scribd](https://www.scribd.com/document/328495881/rm10-Manual-pdf)
- [**spiceman.net** LTspice-AC Analysis(.ac) - Spiceman](https://spiceman.net/ltspice-ac-analysis/)
- [**powerelectronicsnews.com** SPICE Course: AC Analysis - Power Electronics News](https://www.powerelectronicsnews.com/guide-to-spice-simulation-for-circuit-analysis-and-design-part-7-the-ac-analysis/)
- [**documentation.infineon.com** Setting up an AC analysis | InfineonSpice Documentation](https://documentation.infineon.com/spice/using-infineonspice/nsl1753793591499)
- [**youtube.com** How to Perform AC Analysis in SPICE Simulation - YouTube](https://www.youtube.com/watch?v=1syiPw_wfzk)
- [**allaboutcircuits.com** AC Analysis in SPICE | Simulation | Electronics Textbook](https://www.allaboutcircuits.com/textbook/designing-analog-chips/simulation/ac-analysis-in-spice/)
- [**web.engr.oregonstate.edu** A Historical Review of Circuit Simulation](https://web.engr.oregonstate.edu/~karti/ece521/dop.pdf)
- [**www-file.huawei.com** Huawei Research Issue 6](https://www-file.huawei.com/admin/asset/v1/pro/view/3cc66468728c4b5e8b4d48f1ee6ec3a4.pdf)
- [**researchgate.net** SPICE Lib control-signals implementing the ''GMIN stepping](https://www.researchgate.net/figure/SPICE-Lib-control-signals-implementing-the-GMIN-stepping-algorithm_fig7_239918851)
- [**powerelectronicsnews.com** Spice simulation for circuit analysis - Power Electronics News](https://www.powerelectronicsnews.com/guide-to-spice-simulation-for-circuit-analysis-and-design-part-4-the-step-directive-for-multiple-simulations/)
- [**global.oup.com** Computer Exercises Manual: Device Parameters in SPICE](https://global.oup.com/us/companion.websites/9780195388039/pdf/cem.pdf)
- [**venus-ngl.tele.ntnu.no** AIM-Spice Reference Manual Version 2020.100 July 2020](http://venus-ngl.tele.ntnu.no/downloads/aimspiceref.2020.100.pdf)
- [**engineering.upenn.edu** PSpice Reference Guide - Penn Engineering](https://www.engineering.upenn.edu/~jan/spice/PSpice_ReferenceguideOrCAD.pdf)
- [**ieee-cas.org** a short history of - IEEE Circuits and Systems Society](https://ieee-cas.org/files/ieeecass/2022-01/a_short_history_of_circuits_and_systems-_ebook-_web.pdf)
- [**eprints.soton.ac.uk** University of Southampton Research Repository ePrints Soton](https://eprints.soton.ac.uk/69885/1/JBFinalThesis_091009.pdf)
- [**semanticscholar.org** A charge-oriented model for MOS transistor capacitances](https://www.semanticscholar.org/paper/A-charge-oriented-model-for-MOS-transistor-Ward-Dutton/c5e26a1054f9f41753e3132e3488c5591fbf96d0)
- [**sites.units.it** SPICE: - PHP 8.2.31 - UniTS](https://sites.units.it/carrato/didatt/doc/spice.pdf)
- [**people.engr.tamu.edu** HSPICE MOSFET Models Manual](https://people.engr.tamu.edu/spalermo/ecen474/hspice_mosfet.pdf)
- [**people.orie.cornell.edu** Lecture 14 1 Simplex Issues: Number of Pivots](https://people.orie.cornell.edu/dpw/orie6300/Lectures/lec14.pdf)
- [**semanticscholar.org** The modified nodal approach to network analysis - Semantic Scholar](https://www.semanticscholar.org/paper/The-modified-nodal-approach-to-network-analysis-Ho-Ruehli/4c441f155d616d1f4ea63c1fc67c20716f4e1297)
- [**researchgate.net** Modified nodal analysis: An essential addition to electrical circuit](https://www.researchgate.net/publication/3406448_Modified_nodal_analysis_An_essential_addition_to_electrical_circuit_theory_and_analysis)
- [**chuvsu.ru** ALGORITHM OF ELECTRIC CIRCUIT STATE MATRIX](https://www.chuvsu.ru/nauka-i-innovaczii/vestnik-chuvashskogo-universiteta/metadata-for-the-articles/vestnik-chuvashskogo-universiteta-2022-no-3-topic-of-this-issue-electrical-technology-and-power-engineering/algorithm-of-electric-circuit-state-matrix-transformation-using-the-modified-nodal-analysis/)
- [**digital-library.theiet.org** Algorithm for reducing circuit equations in computer applications](https://digital-library.theiet.org/doi/10.1049/ip-g-2.1990.0004)
- [**note.com** A Detailed Step-by-Step Explanation of the SPICE Transient ... - note](https://note.com/sukimaengineer/n/ne3531b5b6f9b?hl=en)
- [**help.simetrix.co.uk** Simulator Reference: Accuracy and Integration Methods](https://help.simetrix.co.uk/8.2/simetrix/simulator_reference/topics/convergence_accuracyandperformance_accuracyandintegrationmethods.htm)
- [**scribd.com** SPICE Circuit Simulation Overview | PDF - Scribd](https://www.scribd.com/document/507263903/spice2001-07)
- [**analog.com** SPICE Differentiation | Analog Devices](https://www.analog.com/en/resources/technical-articles/spice-differentiation.html)
- [**unm.edu** T-Spice 14 User Guide—Contents - The University of New Mexico](https://www.unm.edu/~pzarkesh/ECE520/tspice.pdf)
- [**nmg.gitlab.io** BSIM4 model (levels 14, 54) -](https://nmg.gitlab.io/ngspice-manual/mosfets/mosfetmodels_nmos_pmos/bsim4model_levels14,54.html)
