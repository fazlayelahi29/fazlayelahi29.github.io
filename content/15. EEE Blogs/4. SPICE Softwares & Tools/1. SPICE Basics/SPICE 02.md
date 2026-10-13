# The Mathematical Architecture of Circuit Simulation: Translating Physical Theory into Computational Matrix Algorithms

## Introduction

The simulation of electrical circuits represents one of the most successful applications of computational mathematics in modern engineering. While the physical behavior of electrical networks is governed by Maxwell’s equations and subsequently abstracted into Kirchhoff’s Current Law (KCL) and Kirchhoff’s Voltage Law (KVL), translating these physical truths into a format that a digital computer can process requires a profound paradigm shift. The SPICE (Simulation Program with Integrated Circuit Emphasis) engine, originally developed at UC Berkeley, does not "see" a circuit in the cognitive sense . It possesses no spatial intuition regarding series or parallel combinations, nor can it visually recognize feedback loops, bridge topologies, or common-emitter amplifier stages. Instead, the computational engine relies entirely on graph theory, linear algebra, and numerical calculus to blindly construct and iteratively solve massive systems of differential and algebraic equations . 

This comprehensive report provides an exhaustive, mathematically rigorous exposition of the algorithms that drive the PSpice engine. By deconstructing the transition from elementary Nodal Analysis to the highly robust Modified Nodal Analysis (MNA), and subsequently introducing the Newton-Raphson algorithm for non-linear device linearization, this analysis illuminates the exact mechanisms by which raw circuit theory is transformed into the highly optimized computational matrix algorithms utilized by modern circuit simulators. The journey from static linear matrices to dynamic, sparse, factorized calculus reveals the true mathematical reality of software-based circuit simulation.

## Chapter 1: The Human vs. The Machine

The fundamental dichotomy between human circuit analysis and computational simulation lies in the application of intuition versus rigid algorithmic determinism. When a human engineer analyzes a network, they employ a battery of heuristic techniques—such as Superposition, Thevenin/Norton equivalents, Mesh Analysis, and topological simplifications . A human visually parses a schematic to identify independent sub-circuits, recognizes passive voltage dividers, and selectively applies Mesh Analysis for planar circuits or Nodal Analysis when current sources dominate. If a non-linear component like a diode is present, the human typically makes piecewise-linear assumptions, guessing an operating state (e.g., assuming a forward-biased voltage drop of $0.7V$) and verifying the assumption post-calculation .

A computer engine cannot approach a circuit with such topological prejudice. Software possesses no visual cortex to identify a "loop" or a "supernode." To a machine, a circuit is simply a directed graph composed of nodes (vertices) and branches (edges), where physical conservation laws must be enforced simultaneously across all points in hyperspace . The machine requires a strictly deterministic, memory-mapped representation of the circuit that scales linearly with the addition of new components. 

Consider why software rejects Mesh Analysis and Superposition. Superposition requires analyzing a circuit $M$ times for $M$ independent sources, scaling linearly for linear circuits but failing catastrophically for non-linear circuits, as the principle of superposition mathematically collapses in the presence of exponential functions . Mesh analysis, while intuitive for humans tracing physical loops on a 2D schematic, is computationally fragile because identifying the optimal set of independent loops (a fundamental mesh matrix) in a highly complex, non-planar integrated circuit is an $O(N^3)$ graph-theory problem . 

Consequently, computational engines universally adopt a node-centric approach. Nodal analysis inherently defines the state of the system using node voltages relative to a universal ground, providing a direct, algorithmic mapping from the circuit's netlist to a highly structured system of linear equations . The machine approaches the circuit blindly, stamping the properties of each component into a global system matrix, $Ax = z$, and resolving the state variables through matrix factorization . The mathematical reality of software mandates algorithmic uniformity, leading to the strict reliance on Nodal formulations as the foundational architecture of all SPICE-derived simulators.

## Chapter 2: The Foundation of KCL and Nodal Analysis

The bedrock of computational circuit analysis is Kirchhoff’s Current Law (KCL), which dictates that the algebraic sum of currents leaving any node in a network must equal zero. In standard Nodal Analysis (NA), KCL is mathematically combined with the Branch Constitutive Equations (BCE)—such as Ohm's Law ($I = G \cdot V$, where $G$ is conductance)—to formulate a system of linear algebraic equations where the unknown variables are strictly the node voltages .

For a network containing $N+1$ nodes, one node is arbitrarily selected as the reference (ground, typically designated as node 0), leaving $N$ independent node voltages to be determined . The system is expressed in a canonical matrix form:

$[G] \cdot [V] = [I]$

Here, $[G]$ is the $N \times N$ conductance (or admittance) matrix, $[V]$ is the $N \times 1$ vector of unknown node voltages, and $[I]$ is the $N \times 1$ vector of known independent current sources acting as the forcing functions (excitations) on the nodes . 

The algorithmic generation of the $[G]$ matrix is achieved through a procedure known as "stamping." Stamping is elegantly localized; it allows the computer parser to build the matrix by inspecting one component at a time, entirely independent of the rest of the circuit topology . For a linear resistor with conductance $G_k = 1/R_k$ connected between positive node $i$ and negative node $j$, the KCL equations for both nodes are affected. The current leaving node $i$ through the resistor is $G_k(V_i - V_j)$, and the current leaving node $j$ is $G_k(V_j - V_i)$. In the matrix framework, this component contributes to four specific locations in the $[G]$ matrix :

1. It adds $+G_k$ to the diagonal element $G_{i,i}$.
2. It adds $+G_k$ to the diagonal element $G_{j,j}$.
3. It subtracts $G_k$ (adds $-G_k$) to the off-diagonal element $G_{i,j}$.
4. It subtracts $G_k$ (adds $-G_k$) to the off-diagonal element $G_{j,i}$.

If the resistor is connected to the reference node (ground), the variable $V_0$ is mathematically eliminated (since $V_0 = 0$), and the component only contributes $+G_k$ to the single diagonal element corresponding to the ungrounded node . 

Similarly, an independent current source $I_s$ flowing from node $i$ to node $j$ simply alters the right-hand side excitation vector $[I]$. The engine subtracts $I_s$ from the $i$-th row of $[I]$ (representing current leaving) and adds $I_s$ to the $j$-th row of $[I]$ (representing current entering) . This process requires absolutely no holistic understanding of the circuit. The engine iterates through the netlist, stamping conductances into $[G]$ and currents into $[I]$, resulting in a symmetric, diagonally dominant matrix that is computationally stable and easily solvable via standard linear algebra.

## Chapter 3: The Problem with Voltage Sources

While standard Nodal Analysis is highly efficient for circuits composed exclusively of conductances and independent current sources, it suffers from a catastrophic mathematical vulnerability: it completely fails the moment an ideal independent voltage source is introduced. The strict nodal formulation relies on the premise that all branch currents can be explicitly expressed as functions of node voltages ($I = G \cdot V$) . However, the current flowing through an ideal independent voltage source is fundamentally unknown; it is dictated entirely by the demands of the external circuit connected to it, not by the voltage across it .

If an ideal voltage source $E$ is connected between node $i$ and node $j$, its internal resistance is physically zero, meaning its theoretical conductance $G$ approaches infinity. Attempting to stamp an infinite conductance into the $[G]$ matrix instantly destroys the numerical stability of the computational solver, leading to divide-by-zero exceptions or singular matrices . 

Human engineers bypass this limitation by mentally constructing a "supernode" around the voltage source. By drawing a conceptual boundary around node $i$ and node $j$, the human combines their KCL equations into a single expression, and uses the voltage source's constraint ($V_i - V_j = E$) as an auxiliary algebraic equation to solve the system . However, forcing a computer to algorithmically identify, merge, and track supernodes across a dynamic topology of millions of transistors requires immense computational overhead, dynamic memory reallocation, and convoluted graph-traversal data structures. Furthermore, eliminating nodes dynamically destroys the strict linear mapping between the user's netlist input and the matrix indices.

To maintain algorithmic rigidity and topological independence, the SPICE engine must treat the unknown current of the voltage source as a first-class state variable . Instead of shrinking the matrix via supernodes, the computational approach is to expand the matrix. By introducing the unknown branch current of the voltage source as an additional vector variable, and simultaneously introducing the physical voltage constraint as a new independent row equation, the system remains mathematically closed and algorithmically pristine. This systematic augmentation of the standard Nodal Analysis matrix defines the Modified Nodal Analysis (MNA) algorithm .

## Chapter 4: Modified Nodal Analysis (MNA) Stamping Rules

Modified Nodal Analysis (MNA) resolves the voltage source paradox by augmenting the classical $[G] \cdot [V] = [I]$ formulation into a larger block-matrix architecture. For a circuit with $N$ independent nodes and $M$ independent voltage sources (or other current-undefined elements like ideal inductors in DC analysis), the MNA system yields an $(N+M) \times (N+M)$ master matrix .

The expanded system is formulated as $A \cdot x = z$, specifically expressed as:

$
\begin{bmatrix}
G & B \\
C & D
\end{bmatrix}
\begin{bmatrix}
V \\
J
\end{bmatrix}
=
\begin{bmatrix}
I \\
E
\end{bmatrix}
$

In this highly structured architecture:
- $[G]$ is the $N \times N$ conductance matrix generated by resistors and Voltage-Controlled Current Sources (VCCS).
- $[B]$ is an $N \times M$ topological incidence matrix representing the connection of voltage sources to the nodes. It maps the unknown currents $J$ into the KCL nodal equations.
- $[C]$ is an $M \times N$ topological matrix representing the voltage constraints dictated by the sources. For independent sources, $[C]$ is exactly the transpose of $[B]$ ($C = B^T$) .
- $[D]$ is an $M \times M$ matrix, which is entirely zero for independent voltage sources, but plays a crucial role when Current-Controlled Voltage Sources (CCVS) or AC frequency-domain companion models are introduced .
- $[V]$ is the $N \times 1$ vector of unknown node voltages.
- $[J]$ is the $M \times 1$ vector of unknown currents flowing through the voltage sources.
- $[I]$ is the $N \times 1$ vector of known current source values entering the nodes.
- $[E]$ is the $M \times 1$ vector of known independent voltage source values defining the constraints .

The "stamping" rules for this massive system matrix are rigorously codified in SPICE engines. When the parser reads an independent voltage source $V_k$ with value $E_k$ connected between the positive node $i$ and the negative node $j$, the engine executes the following algorithm without evaluating the rest of the circuit :

| Element Type | Matrix Location | Stamped Value | Mathematical Rationale |
| :--- | :--- | :--- | :--- |
| **Resistor ($R$)** | $G(i,i)$, $G(j,j)$ | $+1/R$ | Current leaves nodes $i$ and $j$ proportionally to their own voltage. |
| | $G(i,j)$, $G(j,i)$ | $-1/R$ | Current entering node $i$ is proportional to node $js voltage. |
| **Current Source ($I_s$)** | $I(i)$ (RHS vector) | $-I_s$ | Independent current leaves positive node $i$. |
| | $I(j)$ (RHS vector) | $+I_s$ | Independent current enters negative node $j$. |
| **Voltage Source ($V_k$)** | $B(i, k)$ | $+1$ | Unknown current $J_k$ leaves positive node $i$. |
| | $B(j, k)$ | $-1$ | Unknown current $J_k$ enters negative node $j$. |
| | $C(k, i)$ | $+1$ | Positive node $V_i$ contribution to constraint equation. |
| | $C(k, j)$ | $-1$ | Negative node $V_j$ contribution to constraint equation. |
| | $E(k)$ (RHS vector) | $E_k$ | The known voltage value completing $V_i - V_j = E_k$. |

Through this procedure, resistors and independent current sources are stamped exactly as they were in standard NA, purely within the $[G]$ block and $[I]$ vector. The brilliance of MNA lies in its absolute modularity. Every component is completely ignorant of the overall network topology. The matrix simply expands to accommodate elements with undefined currents, resulting in a sparse, solvable linear system that accurately models the physics of the entire circuit simultaneously .

## Chapter 5: Handling Dependent Sources

The MNA framework demonstrates its extreme robustness when required to handle the four types of dependent sources: Voltage-Controlled Current Sources (VCCS), Voltage-Controlled Voltage Sources (VCVS), Current-Controlled Current Sources (CCCS), and Current-Controlled Voltage Sources (CCVS). In physical circuits, these represent the idealized behaviors of transistor transconductances, operational amplifiers, and current mirrors. Mathematically, dependent sources introduce off-diagonal asymmetries and require specific augmentation of the MNA blocks, fundamentally breaking the symmetry of the classical conductance matrix .

**1. Voltage-Controlled Current Source (VCCS):**
A VCCS outputs a current leaving node $i$ and entering node $j$, controlled by the voltage difference between control node $k$ and control node $l$ ($I_{out} = g_m (V_k - V_l)$). Because it outputs a current that is a direct algebraic function of node voltages, it requires no new branch variables. It is stamped directly into the $[G]$ matrix . The transconductance $g_m$ is stamped into four locations:
- $+g_m$ at $(i, k)$ (Current out of $i$ due to $V_k$)
- $-g_m$ at $(i, l)$ (Current out of $i$ due to $V_l$)
- $-g_m$ at $(j, k)$ (Current into $j$ due to $V_k$)
- $+g_m$ at $(j, l)$ (Current into $j$ due to $V_l$)

Unlike simple resistors, the VCCS stamp is fundamentally asymmetric (unless the control nodes are identical to the output nodes). This structural asymmetry dictates that the overall MNA matrix loses its mathematical symmetry, necessitating more generalized numerical solvers for the eventual matrix factorization .

**2. Voltage-Controlled Voltage Source (VCVS):**
A VCVS outputs a voltage between nodes $i$ and $j$, controlled by the voltage difference between nodes $k$ and $l$ ($V_i - V_j = \mu (V_k - V_l)$). Like an independent voltage source, its output current is unknown, requiring matrix augmentation (a new row and column $k_{vcvs}$) . 
- The new column handles the unknown current $J_{vcvs}$, stamping $+1$ at row $i$ and $-1$ at row $j$ inside the $[B]$ block to satisfy KCL.
- The new row enforces the voltage constraint. Instead of a constant on the right-hand side, the constraint is algebraically rewritten as $V_i - V_j - \mu V_k + \mu V_l = 0$.
- In the new row (inside the $[C]$ block), the engine stamps $+1$ at column $i$, $-1$ at column $j$, $-\mu$ at column $k$, and $+\mu$ at column $l$. The right-hand side vector $[E]$ receives a $0$ .

**3. Current-Controlled Current Source (CCCS) & 4. Current-Controlled Voltage Source (CCVS):**
Current-controlled sources introduce a profound topological challenge: they must "measure" a current flowing through a specific branch to calculate their output . Because standard Nodal Analysis only intrinsically calculates node voltages, the current through an arbitrary branch (like a resistor) is not natively tracked as a state variable in the $[V]$ vector. 

To resolve this, SPICE introduces a brilliant mathematical trick: the parser inserts a $0V$ independent voltage source in series with the controlling branch . A $0V$ source acts as an ideal, zero-burden ammeter; it forces the MNA algorithm to augment the matrix and explicitly assign a variable ($J_{ctrl}$) to solve for the current flowing through that branch without altering the circuit's physical behavior. 

Once the controlling current $J_{ctrl}$ is established as a column variable in the matrix, the dependent source can be stamped :
- **For a CCCS (gain $\beta$):** The output current is $\beta \cdot J_{ctrl}$. This is stamped into the KCL rows of the output nodes $i$ and $j$. The engine stamps $+\beta$ into the row of node $i$ (at the column of $J_{ctrl}$) and $-\beta$ into the row of node $j$.
- **For a CCVS (transresistance $r_m$):** Both an ammeter variable $J_{ctrl}$ and an output current variable $J_{out}$ are required. The constraint equation $V_i - V_j = r_m \cdot J_{ctrl}$ is rewritten as $V_i - V_j - r_m \cdot J_{ctrl} = 0$. This is stamped into a new row, with $+1$ at $V_i$, $-1$ at $V_j$, and $-r_m$ at the column corresponding to $J_{ctrl}$ .

| Dependent Source | Control Variable | Output Variable | Matrix Augmentation Required? |
| :--- | :--- | :--- | :--- |
| **VCCS** ($g_m$) | Node Voltage | Node Current | No (Stamps into $[G]$) |
| **VCVS** ($\mu$) | Node Voltage | Branch Voltage | Yes (Adds Row/Col for $J_{out}$) |
| **CCCS** ($\beta$) | Branch Current | Node Current | Yes (Adds Row/Col for $J_{ctrl}$) |
| **CCVS** ($r_m$) | Branch Current | Branch Voltage | Yes (Adds 2 Rows/Cols for $J_{ctrl}$ & $J_{out}$) |

Through these rigorous stamping rules, MNA safely absorbs all linear topological constraints and functional dependencies, yielding a complete computational model of the linear network ready for direct factorization.

## Chapter 6: The Non-Linear Wall

The MNA formulation described thus far constitutes a perfect linear algebraic system capable of solving any network composed of resistors, linear dependent sources, and independent sources in a single computational pass by solving the augmented matrix. However, the introduction of physical non-linear semiconductor devices—such as diodes, Bipolar Junction Transistors (BJTs), and MOSFETs—strikes a severe mathematical wall. 

A linear matrix $[A]$ can only encode equations of the form $y = m \cdot x$. It cannot intrinsically represent exponential, logarithmic, or polynomial relationships . If a semiconductor PN junction diode is connected between node $i$ and node $j$, the current flowing through it is defined by the Shockley diode equation:

$I_D = I_s \left( e^{\frac{V_i - V_j}{N \cdot V_{th}}} - 1 \right)$

where $I_s$ is the reverse saturation current, $N$ is the ideality (emission) coefficient, and $V_{th}$ is the thermal voltage ($k \cdot T / q$, approximately $25.8mV$ at room temperature) . 

Because the unknown node voltages $V_i$ and $V_j$ reside inside the argument of an exponential function, it is mathematically impossible to isolate the voltage vector $[V]$ and stamp a static, numerical conductance value into the $[G]$ matrix . The system is no longer a simple $A \cdot x = z$; it has morphed into a highly complex system of non-linear algebraic equations, $F(x) = 0$, where $F$ encompasses both the linear matrix components (enforcing KCL) and the non-linear physical device limits.

Furthermore, semiconductor non-linearities are notoriously aggressive. The exponential nature of the diode equation means that a minute change in node voltage (e.g., from $0.70V$ to $0.80V$) can result in a calculated current spanning several orders of magnitude . Attempting to resolve such a circuit requires abandoning direct matrix factorization in favor of iterative numerical calculus. The software must transition from a state of static algebraic calculation to a dynamic algorithmic framework that can actively "guess," evaluate error, and dynamically correct itself until the physical laws of the circuit are satisfied within a tight numerical tolerance. 

## Chapter 7: The Newton-Raphson Algorithm

To shatter the non-linear wall, the PSpice engine relies on the Newton-Raphson (NR) algorithm, a highly robust root-finding calculus technique generalized for multidimensional systems. The premise of the algorithm is to take a non-linear equation, linearize it at a specific guessed operating point by computing its exact derivative (the tangent line), and follow that tangent line to the x-axis to find a better approximation of the true root .

In a multidimensional circuit space where the state vector of node voltages and branch currents is $x$, the system is defined by a non-linear vector function $F(x) = 0$, representing the net KCL currents at all nodes. The Newton-Raphson algorithm iterates according to the differential calculus formula:

$x_{k+1} = x_k - J^{-1}(x_k) \cdot F(x_k)$

where $x_k$ is the current guess of the system state, $x_{k+1}$ is the next calculated guess, and $J(x_k)$ is the Jacobian matrix evaluated exactly at $x_k$ . The Jacobian matrix represents the partial derivatives of every network equation with respect to every state variable. 

In the context of SPICE and the MNA matrix, the application of Newton-Raphson is a masterstroke of computational synergy: *The Jacobian matrix $J(x_k)$ is mathematically identical to the MNA matrix when populated with the instantaneous small-signal equivalent conductances of the non-linear devices* .

The calculus unfolds in real-time within the software:
1. **Initial Guess:** The engine assumes a starting state $x_0$ for all node voltages (defaulting to $0V$, unless `.NODESET` or `.IC` directives are applied by the user) .
2. **Derivative Calculation:** For every non-linear component, the engine calculates the exact theoretical current based on the guessed voltage, and evaluates the derivative of the current with respect to the voltage ($\partial I / \partial V$). This derivative is the instantaneous small-signal conductance ($g_d$) at that specific operating point .
3. **Linear Formulation:** The calculated $g_d$ values are stamped into the MNA matrix, temporarily linearizing the entire circuit for that exact moment in computational time . 
4. **Solving the Delta:** The matrix solver computes the required change in voltages to minimize the residual currents (KCL violations) calculated by $F(x_k)$ .
5. **Iteration and Convergence:** The new voltages $x_{k+1}$ become the guess for the next iteration. This cycle repeats until the delta between iterations is vanishingly small. 

Because the diode's exponential curve is so physically sharp, a poor Newton-Raphson guess can yield a tangent line that predicts a next voltage of $1000V$ for a $5V$ circuit. Plugging $1000V$ back into the Shockley equation ($e^{1000 / 0.025}$) leads to an immediate numeric overflow, crashing the floating-point unit of the processor . To prevent this, SPICE algorithms utilize strict limiting functions (e.g., `pnjlim` for PN junctions, `fetlim` for field-effect transistors). If the algorithm attempts to step the diode voltage beyond a critical threshold ($V_{crit}$, often mathematically defined near where the linear and exponential slopes diverge dangerously, roughly calculated via $V_{crit} = \frac{k \cdot T}{q} \ln(\frac{k \cdot T}{q \cdot I_s \cdot \sqrt{2}})$), the engine aggressively dampens the Newton step. It clamps the voltage artificially, overriding the Newton projection to prevent the simulation from diverging into infinity .

SPICE determines whether the iteration has found the "truth" by evaluating if the change in voltages and currents falls below strict user-defined thresholds . 

| SPICE Parameter | Default Value | Definition & Mechanism in Newton-Raphson |
| :--- | :--- | :--- |
| `RELTOL` | $0.001$ ($0.1\%$) | Relative tolerance. The primary accuracy control. Convergence requires $\lvert x_{k+1} - x_k \rvert \le \text{RELTOL} \cdot \max(\lvert x_{k+1} \rvert, \lvert x_k \rvert) + \text{Absolute Tol}$. |
| `VNTOL` | $1\mu V$ ($10^{-6} V$) | Absolute voltage tolerance. Prevents division by zero or infinite loop chasing when voltages are exceptionally close to $0V$. |
| `ABSTOL` | $1 pA$ ($10^{-12} A$) | Absolute current tolerance. Enforces KCL resolution for very small branch currents, preventing false convergence. |
| `ITL1` | $100$ | Maximum DC iteration limit. If the NR algorithm exceeds 100 iterations without satisfying `RELTOL`, the engine aborts and reports a convergence failure. |

## Chapter 8: Device Linearization (Companion Models)

The true brilliance of SPICE's non-linear implementation lies in how it seamlessly merges the abstract Newton-Raphson calculus with the rigidly structured Modified Nodal Analysis framework. During every single NR iteration, the engine dynamically translates complex, multi-terminal semiconductor physics equations into temporary, entirely linear equivalent circuits known as "companion models" .

Consider again the non-linear diode. At iteration $k$, the guessed voltage across the diode is $V_k$. The exact current $I_k$ is calculated via the Shockley equation. The dynamic conductance $g_d$ is the derivative evaluated strictly at $V_k$:

$g_d = \left. \frac{\partial I_D}{\partial V} \right|_{V=V_k} = \frac{I_s}{N \cdot V_{th}} e^{\frac{V_k}{N \cdot V_{th}}}$

By first-order Taylor series expansion, the predicted current at the *next* iteration $V_{k+1}$ can be linearly approximated as:

$I_{D(k+1)} \approx I_k + g_d (V_{k+1} - V_k)$

Rearranging this algebraic expression to separate the unknown variables ($V_{k+1}$) from the known numerical constants evaluated at the current iteration yields the canonical companion model equation :

$I_{D(k+1)} = g_d \cdot V_{k+1} + (I_k - g_d \cdot V_k)$

This mathematical rearrangement is physically profound. The first term, $g_d \cdot V_{k+1}$, is exactly Ohm's law for a linear resistor of conductance $g_d$. The second term, $(I_k - g_d \cdot V_k)$, is a completely known numerical scalar derived from the previous iteration, which physically represents an independent current source . Let us denote this constant scalar as $I_{eq}$.

Thus, the SPICE engine entirely rips the non-linear diode out of the circuit data structure. In its place, for that specific micro-slice of computational time, it stamps a simple linear resistor $g_d$ in parallel with a constant current source $I_{eq}$ . 
- The instantaneous conductance $g_d$ is stamped into the standard four diagonal and off-diagonal locations of the $[G]$ matrix .
- The equivalent current $I_{eq}$ is stamped directly into the right-hand side excitation vector $[I]$.

This exact linearization process is scaled to massive proportions for modern transistors. A BJT analyzed via the Gummel-Poon model, or a deep-submicron MOSFET utilizing the BSIM3 or BSIM4 model, contains hundreds of non-linear parameters mapping short-channel effects, velocity saturation, and charge-sharing physics . Despite this staggering complexity, the model evaluates its physics at $V_k$, computes the partial derivatives with respect to every terminal voltage ($V_{gs}$, $V_{ds}$, $V_{bs}$), and distills the transistor into a linear companion model at every iteration. 

A three-terminal MOSFET becomes a linearized mesh of Voltage-Controlled Current Sources (representing transconductance $g_m$), output conductances ($g_{ds}$), body-effect transconductances ($g_{mb}$), and equivalent independent currents . The massive, chaotic non-linear physics of the semiconductor is thus successfully boxed and stamped into the highly rigid, linear MNA grid, forcing the entire physical network to be solved purely through computationally efficient linear algebra.

## Chapter 9: LU Factorization and Sparse Matrices

Once the MNA matrix is fully populated with linear passive components, augmented blocks for voltage sources, and the linearized companion models of active semiconductors, the engine is faced with solving a massive system of equations: $A \cdot x = z$. For modern Very Large Scale Integration (VLSI) integrated circuits, this matrix can encompass millions of rows and columns. 

Naively solving this system using classical matrix inversion ($x = A^{-1} \cdot z$) requires an operation count on the order of $O(N^3)$. For a circuit with 100,000 nodes, inversion is computationally impossible and would take centuries on a standard workstation . Fortunately, electronic circuit matrices possess a saving grace: they are incredibly sparse. A node in a microchip is typically connected to only 3 or 4 components, regardless of how astronomically large the total circuit is. Consequently, over 99% of the massive MNA matrix consists of absolute zeros . 

Instead of inversion, PSpice employs sparse Lower-Upper (LU) factorization . The engine algorithmically decomposes the sparse MNA matrix $A$ into two triangular matrices: a lower triangular matrix $L$ and an upper triangular matrix $U$, such that $A = L \cdot U$. 
The system $A \cdot x = z$ becomes $L \cdot (U \cdot x) = z$. By defining a temporary vector $y = U \cdot x$, the computer first solves $L \cdot y = z$ using simple forward-substitution (an $O(N^2)$ operation, heavily optimized by sparsity), and then solves $U \cdot x = y$ using backward-substitution . This drastically drops the computational complexity, provided the sparsity of the matrix is ruthlessly preserved throughout the decomposition.

The paramount algorithmic challenge in LU factorization is the phenomenon of "fill-in." During the Gaussian elimination steps required to form $L$ and $U$, algebraic operations between rows can cause locations that were originally zero in matrix $A$ to become non-zero in $L$ and $U$ . If fill-in propagates unchecked, the initially sparse matrix devolves into a dense matrix, catastrophically crashing the simulation due to memory exhaustion and computational geometry overload.

To combat fill-in, SPICE utilizes predictive reordering algorithms before factorization begins. It typically employs the Markowitz count, a heuristic graph-theory algorithm that seeks to minimize fill-in by choosing pivot elements that have the fewest non-zeros in their respective rows and columns . If a candidate pivot at position $(i, j)$ has $r_i$ non-zeros in its row and $c_j$ non-zeros in its column, the Markowitz count is defined as $(r_i - 1) \cdot (c_j - 1)$. This product represents the mathematical upper bound on the maximum possible number of new non-zeros (fill-ins) created if this element is chosen as the pivot . The algorithm continuously reorders the matrix rows and columns to always pivot on the element with the lowest Markowitz count.

However, choosing pivots strictly for sparsity can destroy numerical stability. If the pivot element is computationally close to zero (e.g., $10^{-15}$), dividing by it during the elimination step will amplify floating-point round-off errors to infinity, corrupting the entire solution. Therefore, modern sparse direct solvers (like KLU, heavily utilized in circuit simulation) implement "Threshold Partial Pivoting" . This ensures that the chosen pivot is not only optimal for preserving sparsity but also mathematically stable, enforcing the rule that the pivot magnitude must be greater than a certain threshold (defaulting to a tolerance of $0.001$) relative to the maximum absolute element in that active column . This meticulous balance between algorithmic sparsity and numerical precision is the secret engine that allows PSpice to solve matrices of unfathomable size in milliseconds.

## Chapter 10: The DC Operating Point (Bias)

The computational simulation of a circuit must begin before the concept of time begins; it must first establish the DC Operating Point, known as the bias point . The DC operating point represents the steady-state reality of the circuit under constant DC excitation, with all time-derivatives explicitly set to zero. From an algorithmic perspective, this means all capacitors are temporarily removed (treated as infinite-impedance open circuits), and all inductors are replaced with $0V$ voltage sources (treated as zero-impedance short circuits) . This initial equilibrium state serves as the indispensable starting condition for any subsequent Transient (time-domain integration) or AC (small-signal frequency-domain) analysis.

Solving the DC bias point is the ultimate orchestration of every algorithm discussed. The software parser reads the netlist, eliminates dynamic elements, applies the initial DC independent source values, and constructs the MNA geometry . It populates the matrix with linear components, makes a $0V$ blind guess for non-linear nodes, derives the Jacobian companion models, and executes the Gilbert-Peierls left-looking LU factorization . If the Newton-Raphson error metrics are not satisfied, the companion models are recalculated at the new guessed voltages, the matrix is restamped, re-factorized, and resolved . 

If this standard iterative process fails to converge within the allotted iterations (`ITL1`)—often due to high-gain feedback loops, sharp non-linear boundaries in bipolar transistors, or poor initial guesses causing the NR steps to oscillate indefinitely—SPICE activates advanced "continuation" or "homotopy" methods . 

| Continuation Method | Algorithmic Mechanism | Mathematical Impact on Convergence |
| :--- | :--- | :--- |
| **Source Stepping** | Artificially reduces all independent sources to $\approx 0\%$, then ramps them to $100\%$. | At $0V$ excitation, non-linearities are completely suppressed, guaranteeing convergence. Each step acts as a highly accurate initial guess for the next . |
| **GMIN Stepping** | Stamps a massive conductance (`GMIN = 1e-12`, then scaled larger) across every node to ground, gradually reducing it back to $10^{-12} S$. | Diagonal dominance is forced on the MNA matrix. This swamps the aggressive non-linear off-diagonal terms, forcing the LU factorization to behave like a stable linear resistor network . |
| **Pseudo-Transient Analysis (PTA)** | Abandons static DC calculus. Attaches phantom capacitors to all nodes and phantom inductors to voltage sources, integrating in artificial time. | The dynamic elements act as heavy numerical damping, suppressing wild Newton-Raphson voltage swings. Time integrates forward until derivatives naturally decay to zero ($di/dt = 0$), revealing the true DC state . |

Through the seamless synthesis of Kirchhoff's topological matrices, the structural elasticity of Modified Nodal Analysis, the derivative calculus of Newton-Raphson companion models, and the memory-saving mastery of sparse LU factorization, the PSpice computational engine maps the physical universe into a purely deterministic realm. It abandons flawed human intuition for rigid mathematical certainty, iteratively solving the resulting multi-dimensional chaos until the true electrical reality emerges from the software void. 




## Sources

- [**slideserve.com** Computer-Aided Circuit Simulation Basics - SlideServe](https://www.slideserve.com/mckeep/cse245-computer-aided-circuit-simulation-and-verification-powerpoint-ppt-presentation)
- [**uom.lk** modified nodal analysis](https://uom.lk/sites/default/files/elect/files/ee321s3.3.pdf)
- [**eng.biu.ac.il** Behind the scenes of the SPICE Circuit Simulator](https://www.eng.biu.ac.il/temanad/files/2022/04/Lecture-3-Behind-the-scenes-of-SPICE.pdf)
- [**circuitmath.com** Circuit Analysis Tutorials | CircuitMath](https://circuitmath.com/learn)
- [**scribd.com** Nodal Analysis in Electrical Circuits | PDF - Scribd](https://www.scribd.com/document/712759768/Nodal-analysis)
- [**allaboutcircuits.com** The Diode SPICE Model | Simulation | Electronics Textbook](https://www.allaboutcircuits.com/textbook/designing-analog-chips/simulation/the-diode-spice-model/)
- [**slideserve.com** Formulation of Circuit Equations - SlideServe](https://www.slideserve.com/amiel/formulation-of-circuit-equations)
- [**researchgate.net** The modified nodal approach to network analysis - ResearchGate](https://www.researchgate.net/publication/3184759_The_modified_nodal_approach_to_network_analysis)
- [**upcommons.upc.edu** Modelado de Circuitos de audio analógicos para plug-ins VST, AU.](https://upcommons.upc.edu/bitstreams/0efc5a7d-459b-409a-9fd4-944728627cdf/download)
- [**lpsa.swarthmore.edu** Modified Nodal Analysis - printable - Swarthmore College](https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNAAll.html)
- [**hvg.ece.concordia.ca** A Tool for Modeling and Analysis of Electronic Circuits and Systems](https://hvg.ece.concordia.ca/Publications/TECH_REP/TMAAC_TR12/TMAAC_TR12.pdf)
- [**scispace.com** A Practical Regularization Technique for Modified Nodal Analysis in](https://scispace.com/pdf/a-practical-regularization-technique-for-modified-nodal-1ppc18f2zl.pdf)
- [**modrinth.com** CircuitSimCraft - Minecraft Mod - Modrinth](https://modrinth.com/mod/circuitsimcraft)
- [**engineering.purdue.edu** SPICE Version 2G6 User's Guide - Purdue College of Engineering](https://engineering.purdue.edu/~ee255/design_hub_files/References/SpiceManual.pdf)
- [**researchgate.net** Improved Modified Nodal Analysis of Nonlinear Analog Circuits in](https://www.researchgate.net/publication/45534515_Improved_Modified_Nodal_Analysis_of_Nonlinear_Analog_Circuits_in_the_Time_Domain)
- [**intusoft.com** SPICE Numerical Methods, Part 1 Convergence Methods - Intusoft](http://www.intusoft.com/nlhtm/nl72.htm)
- [**note.com** A Detailed Step-by-Step Explanation of the SPICE Transient ... - note](https://note.com/sukimaengineer/n/ne3531b5b6f9b?hl=en)
- [**cdn14.21dianyuan.com** Spice Convergence Problems](https://cdn14.21dianyuan.com/download.php?id=177899)
- [**scribd.com** Multivariable Newton-Raphson DC Analysis | PDF | Spice - Scribd](https://www.scribd.com/document/187409974/Dc-Analysis)
- [**kenkundert.com** Achieving Accurate Results With a Circuit Simulator - Ken Kundert](https://kenkundert.com/docs/eda+t93-preso.pdf)
- [**scribd.com** Technical | PDF | Electrical Network | Matrix (Mathematics) - Scribd](https://www.scribd.com/document/525388168/technical)
- [**venus-ngl.tele.ntnu.no** AIM-Spice Reference Manual Version 2020.100 July 2020](http://venus-ngl.tele.ntnu.no/downloads/aimspiceref.2020.100.pdf)
- [**researchgate.net** (PDF) Qucs Equation-Defined and Verilog-A Higher Order](https://www.researchgate.net/publication/299469995_Qucs_Equation-Defined_and_Verilog-A_Higher_Order_Behavioral_Device_Models_for_Harmonic_Balance_Circuit_Simulation)
- [**arxiv.org** Well-Posed Models of Memristive Devices - arXiv](https://arxiv.org/pdf/1605.04897)
- [**community.infineon.com** Resolving convergence challenges in LTspice](https://community.infineon.com/t5/Knowledge-Base-Articles/Resolving-convergence-challenges-in-LTspice/ta-p/1053215)
- [**manuals.plus** ngspice user manual - Manuals+](https://manuals.plus/m/13635ef162f01e8321011c4d3cb7d94644da202429dbee8ae35b85d23997a22e)
- [**ngspice.sourceforge.io** ngspice-manual.pdf](https://ngspice.sourceforge.io/docs/ngspice-manual.pdf)
- [**arxiv.org** A Technical Survey of Sparse Linear Solvers in Electronic Design](https://arxiv.org/pdf/2504.11716)
- [**researchgate.net** Algorithm 907: KLU, A Direct Sparse Solver for Circuit Simulation](https://www.researchgate.net/publication/220492376_Algorithm_907_KLU_A_Direct_Sparse_Solver_for_Circuit_Simulation_Problems)
- [**people.engr.tamu.edu** A survey of direct methods for sparse linear systems](https://people.engr.tamu.edu/davis/publications_files/survey_tech_report.pdf)
- [**cambridge.org** A survey of direct methods for sparse linear systems | Acta Numerica](https://www.cambridge.org/core/journals/acta-numerica/article/survey-of-direct-methods-for-sparse-linear-systems/8AE7AC55909389F7EA1F027855AC4044)
- [**rle.mit.edu** Reducing the parallel Solution Time of Sparse Circuit Matrices using](https://www.rle.mit.edu/cpg/publications/pub86.pdf)
- [**scribd.com** Algorithm 907: KLU, A Direct Sparse Solver For Circuit Simulation](https://www.scribd.com/document/795856932/1824801-1824814)
- [**kolegite.com** THE SPICE BOOK](https://kolegite.com/EE_library/books_and_lectures/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%B0%D0%BD%D0%B5%D1%82%D0%BE%20%D0%B2%20%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0%D1%82%D0%B0/The%20SPICE%20Book%20by%20Andrei%20Vladimirescu%20%28z-lib.org%29.pdf)
- [**help.simetrix.co.uk** Simulator Reference: DC Operating Point Algorithms - SIMetrix](https://help.simetrix.co.uk/8.0/simetrix/mergedProjects/simulator_reference/topics/simref_convergence_accuracyandperformance_dcoperatingpointalgorithms.htm)
- [**jaijeet.github.io** Delivering Global DC Convergence for Large Mixed-Signal Circuits](https://jaijeet.github.io/research/PDFs/2006-01-TCAD-Roychowdhury-Melville-MOS-homotopy.pdf)
- [**semanticscholar.org** [PDF] Simple implementations of homotopy algorithms for finding](https://www.semanticscholar.org/paper/c774ece33a581226acf63a27f0734fccb2c441d3)
- [**simplistechnologies.com** User Manual: Transient Analysis - SIMPLIS](https://www.simplistechnologies.com/documentation/simplis/user_manual/topics/analysismodes_transientanalysis.htm)
- [**ssslab.cn** A Bayesian Optimization Accelerated PTA Solver for SPICE Simulation](https://www.ssslab.cn/assets/papers/2022-xing-BoA-PTA.pdf)
- [**zealpolytechnic.com** Electrical Circuit Analysis & Network Theory - Zeal Polytechnic Pune](https://zealpolytechnic.com/wp-content/uploads/2023/04/Electrical-Circuit-Analysis-Network-Theory.pdf)
- [**github.com** ee-labs/CIRCUIT_ELEMENTS_LAB_PLAN.md at master · reedos/ee](https://github.com/reedos/ee-labs/blob/master/CIRCUIT_ELEMENTS_LAB_PLAN.md)
- [**web.engr.oregonstate.edu** ECE 521 - College of Engineering | Oregon State University](https://web.engr.oregonstate.edu/~karti/ece521/Lectures.pdf)
- [**arxiv.org** Stochastic Testing Method for Transistor-Level Uncertainty ... - arXiv](https://arxiv.org/pdf/1409.4831)
- [**researchgate.net** (PDF) Oscad: An open source EDA tool for circuit design, simulation](https://www.researchgate.net/publication/264002656_Oscad_An_open_source_EDA_tool_for_circuit_design_simulation_analysis_and_PCB_design)
- [**ecircuitcenter.com** SPICE Algorithm Overview - eCircuit Center](https://www.ecircuitcenter.com/SpiceTopics/Overview/Overview.htm)
- [**scribd.com** Newton-Raphson Method for PN Diode Analysis | PDF - Scribd](https://www.scribd.com/document/687113095/newthonraphon)
- [**stackoverflow.com** c++ - Implementing Newton-Raphson Method for Nonlinear Circuit](https://stackoverflow.com/questions/76591098/implementing-newton-raphson-method-for-nonlinear-circuit-simulation-with-diode-components)
- [**youtube.com** Lecture 20 Spice Model Equation - I - YouTube](https://www.youtube.com/watch?v=jtGx-lW7ASY)
- [**altium.com** Simulation Troubleshooting - Altium Designer Documentation](https://www.altium.com/documentation/altium-designer/circuit-simulation/troubleshooting)
- [**mdpi.com** A SPICE-Oriented Method for Finding Multiple DC Solutions in](https://www.mdpi.com/2076-3417/13/4/2369)
- [**researchgate.net** SPICE Lib control-signals implementing the ''GMIN stepping](https://www.researchgate.net/figure/SPICE-Lib-control-signals-implementing-the-GMIN-stepping-algorithm_fig7_239918851)
- [**ece.mcgill.ca** 3.1 Describing Diodes to Spice - Electrical and Computer Engineering](https://www.ece.mcgill.ca/~grober4/SPICE/SPICE_Decks/1st_Edition_LTSPICE/chapter3/Chapter%203%20Diodes%20web%20version.html)
- [**acsu.buffalo.edu** SPICE diode model parameters](https://www.acsu.buffalo.edu/~wie/applet/spice_pndiode/spice_diode_table.html)
- [**engineering.upenn.edu** PSpice Reference Guide - Penn Engineering](https://www.engineering.upenn.edu/~jan/spice/PSpice_ReferenceguideOrCAD.pdf)
- [**youtube.com** V-I Characteristics Of A Diode - Pspice - YouTube](https://www.youtube.com/watch?v=lttsSrAJdnI)
- [**youtube.com** Voltage Limiter| Design and Simulation using LTspice - YouTube](https://www.youtube.com/watch?v=asBv6lgUh-U)
- [**researchgate.net** Inductor Trapezoidal Companion Circuit. [Reconstructed from](https://www.researchgate.net/figure/nductor-Trapezoidal-Companion-Circuit-Reconstructed-from-Pileggi-Carnegie-Mellon-ECE_fig4_366587681)
- [**analog.com** SPICE Differentiation | Analog Devices](https://www.analog.com/en/resources/technical-articles/spice-differentiation.html)
- [**global.oup.com** Computer Exercises Manual: Device Parameters in SPICE](https://global.oup.com/us/companion.websites/9780195388039/pdf/cem.pdf)
- [**ecircuitcenter.com** Transient Analysis - eCircuit Center](https://www.ecircuitcenter.com/SpiceTopics/Transient%20Analysis/Transient%20Analysis.htm)
- [**dr.lib.iastate.edu** Transient analysis for symbolic simulation of large scale networks](https://dr.lib.iastate.edu/bitstreams/c1b28c1d-9aa5-44d3-8860-083fd7aac9d2/download)
- [**pages.hmc.edu** Lecture 8: SPICE Simulation](https://pages.hmc.edu/harris/cmosvlsi/4e/lect/lect8.pdf)
- [**ltwiki.org** .OPTIONS -- Set simulator options - LTwiki](https://ltwiki.org/LTspiceHelp/LTspiceHelp/_OPTIONS_Set_simulator_options.htm)
- [**semanticscholar.org** Improved SPICE3 implementation algorithms of compound element](https://www.semanticscholar.org/paper/dfb20b3055352771722fae5d9321985e2dc3e4cf)
- [**e2e.ti.com** UCC28C43: No convergence in pseudo transient analysis (Simetrix](https://e2e.ti.com/support/power-management-group/power-management/f/power-management-forum/1131165/ucc28c43-no-convergence-in-pseudo-transient-analysis-simetrix?tisearch=e2e-sitesearch&keymatch=UCC28C43-Q1)
- [**analog.com** ltspice-keyboard-shortcuts.pdf - Analog Devices](https://www.analog.com/media/en/news-marketing-collateral/solutions-bulletins-brochures/ltspice-keyboard-shortcuts.pdf?modelType=spice-models)
- [**vbn.aau.dk** An LTSpice - MATLAB Interface for Mitigating Convergence](https://vbn.aau.dk/ws/portalfiles/portal/489168449/pkubulus_ltspicematlab_convergence_postprint.pdf)
- [**researchgate.net** The process of DPTA method. - ResearchGate](https://www.researchgate.net/figure/The-process-of-DPTA-method_fig1_313233828)
- [**woody.us.es** WinSpice3 User's Manual](https://woody.us.es/ASIGN/TCEF_1T/Prob/WSpiceman.pdf)
- [**iris.univr.it** Fault-based Analysis of Industrial Cyber-Physical Systems - IRIS](https://iris.univr.it/retrieve/47406128-c39f-4825-bf20-4f36f678da8a/2023_PhD_Thesis_Nicola_DallOra.pdf)
- [**pages.hmc.edu** SPICE3 Version 3f3 User's Manual - IIS Windows Server](https://pages.hmc.edu/harris/cmosvlsi/4e/spice3man.pdf)
- [**bmas.designers-guide.org** how to (and how not to) write a compact model in verilog-a](https://bmas.designers-guide.org/2004/papers/bmas04-coram.pdf)
- [**osti.gov** XyceTM Parallel Electronic Simulator Reference Guide, Version 6.0](https://www.osti.gov/servlets/purl/1096463)
- [**theses.gla.ac.uk** Accurate Statistical Circuit Simulation in the Presence of Statistical](https://theses.gla.ac.uk/4996/1/2013asenovphd.pdf)
- [**pd-zdh.xaut.edu.cn** Power/HVMOS Devices Compact Modeling](https://pd-zdh.xaut.edu.cn/__local/A/A7/81/6E50C82C55AFC42557BE693728E_DFECB5F5_9223E5.pdf)
- [**people.engr.tamu.edu** HSPICE MOSFET Models Manual](https://people.engr.tamu.edu/spalermo/ecen474/hspice_mosfet.pdf)
- [**techlibrary.ru** БОЛЬШОЙ АНГЛО-РУССКИЙ ТОЛКОВЫЙ НАУЧНО](https://techlibrary.ru/b/2s1p1y1f1r1d1j1o_2j.2q._2i1p1m2d1z1p1k_1a1o1d1m1p-1r1u1s1s1l1j1k_1o1a1u1y1o1p-1t1f1w1o1j1y1f1s1l1j1k_1s1m1p1c1a1r2d_1j1o1v1p1r1n1a1x1j1p1o1o2c1w_1t1f1w1o1p1m1p1d1j1k_1j_1r1a1e1j1p2e1m1f1l1t1r1p1o1j1l1j._3a1p1n_8._5g._2016.pdf)
- [**scribd.com** Regulanewton | PDF | Nonlinear System | Equations - Scribd](https://www.scribd.com/document/1067161688/regulanewton)
- [**vdoc.pub** Circuit Simulation With Spice Opus: Theory And Practice [PDF]](https://vdoc.pub/documents/circuit-simulation-with-spice-opus-theory-and-practice-cpb4glinac60)
- [**scribd.com** Homotopy Algorithms for DC Circuit Solutions | PDF - Scribd](https://www.scribd.com/document/728315497/hom3)
- [**mdpi.com** Accelerating DC Circuit Simulation through Feature Selection and](https://www.mdpi.com/2079-9292/12/8/1927)
- [**web.stanford.edu** Multiple-Rank Updates to Matrix Factorizations for Nonlinear](https://web.stanford.edu/group/SOL/dissertations/Linzhong-Deng-thesis.pdf)
- [**researchgate.net** A survey of direct methods for sparse linear systems - ResearchGate](https://www.researchgate.net/publication/303596907_A_survey_of_direct_methods_for_sparse_linear_systems)
- [**ieee-cas.org** a short history of - IEEE Circuits and Systems Society](https://ieee-cas.org/files/ieeecass/2022-01/a_short_history_of_circuits_and_systems-_ebook-_web.pdf)
- [**github.com** thevenin/docs/devices.md at main · cramt/thevenin · GitHub](https://github.com/cramt/thevenin/blob/main/docs/devices.md)
- [**ngspice.sourceforge.io** Ngspice User's Manual Version 47+ (ngspice development version)](https://ngspice.sourceforge.io/docs/ngspice-html-manual/manual.xhtml)
- [**mirror.yandex.ru** ngspice-46-manual.pdf - Yandex Mirror](https://mirror.yandex.ru/gentoo-distfiles/distfiles/57/ngspice-46-manual.pdf)
- [**ufdcimages.uflib.ufl.edu** Modeling of transistor self-heating for circuit simulation](https://ufdcimages.uflib.ufl.edu/AA/00/03/47/53/00001/modelingoftransi00zwei.pdf)
- [**mirrors.mit.edu** ngspice user manual](https://mirrors.mit.edu/macports/distfiles/ngspice/ngspice-36-manual.pdf)
- [**dspace.cuni.cz** NextGen SPICE – Electrical Circuit Simulation Library for .NET](https://dspace.cuni.cz/bitstream/handle/20.500.11956/99795/130231639.pdf?sequence=1&isAllowed=y)
- [**mdpi.com** A Systematic Taxonomy and Comparative Analysis of Mixed-Signal](https://www.mdpi.com/2079-9292/15/8/1687)
- [**ee.iitb.ac.in** Techniques for circuit simulation - Electrical Engineering](https://www.ee.iitb.ac.in/~sequel/circuit_sim_1.pdf)
- [**researchgate.net** (PDF) Xyce Parallel Electronic Simulator Design: Developer Guide](https://www.researchgate.net/publication/258441741_Xyce_Parallel_Electronic_Simulator_Design_Developer_Guide)
- [**pmc.ncbi.nlm.nih.gov** A Collective Study on Modeling and Simulation of Resistive Random](https://pmc.ncbi.nlm.nih.gov/articles/PMC5762646/)
- [**researchgate.net** Overview of SPICE-like circuit simulation algorithms - ResearchGate](https://www.researchgate.net/publication/3348837_Overview_of_SPICE-like_circuit_simulation_algorithms)
- [**ni.com** Convergence - NI - National Instruments](https://www.ni.com/docs/en-US/bundle/multisim/page/topics/convergence.html)
- [**sites.units.it** SPICE: - PHP 8.2.31 - UniTS](https://sites.units.it/carrato/didatt/doc/spice.pdf)
- [**unm.edu** T-Spice 14 User Guide—Contents - The University of New Mexico](https://www.unm.edu/~pzarkesh/ECE520/tspice.pdf)
- [**stacks.stanford.edu** virtual analog modeling of audio circuitry using wave digital filters a](https://stacks.stanford.edu/file/druid:jy057cz8322/KurtJamesWernerDissertation-augmented.pdf)
- [**repositum.tuwien.at** Mixed-mode device simulation - reposiTUm](https://repositum.tuwien.at/bitstream/20.500.12708/18037/1/Grasser%20Tibor%20-%201999%20-%20Mixed-mode%20device%20simulation.pdf)
- [**dspace.vut.cz** Real-time Digital Simulation of Guitar Amplifiers as Audio Effects](https://dspace.vut.cz/bitstreams/a6cae6e8-f6b8-46fd-b703-4b7406e118f4/download)
- [**ntrs.nasa.gov** NI\SI\ - NASA Technical Reports Server (NTRS)](https://ntrs.nasa.gov/api/citations/19860007475/downloads/19860007475.pdf) 
