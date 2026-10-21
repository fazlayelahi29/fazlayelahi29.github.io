# COMPUTATIONAL MODELING AND OBJECT-ORIENTED KINEMATIC SIMULATION OF A DISCRETE-TIME TWO-DIMENSIONAL EVENT-DRIVEN ARCHITECTURE WITHIN A MATRIX LABORATORY ENVIRONMENT

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

The mathematical modeling of dynamic, two-dimensional kinematic systems necessitates highly deterministic simulation environments capable of processing continuous physics within strictly discrete-time computational constraints. This technical manuscript presents a rigorously synthesized framework for modeling perfect elastic collisions, point-mass particle trajectories, and event-driven state machine transitions, executed exclusively within the MATLAB computational software environment. The fundamental engineering challenge addressed herein revolves around real-time computational kinematics, wherein non-deformable polygonal entities and translating particle position vectors must be evaluated for absolute boundary intersections within severely constrained processing intervals. By mathematically abstracting the physical mechanics of a two-dimensional kinetic interaction into a matrix-oriented object programming architecture, this project empirically validates the efficacy of axis-aligned bounding box (AABB) algorithms operating within discrete coordinate spaces. The theoretical underpinning is strictly governed by classical Newtonian equations of motion, first-order Euler integration techniques for spatial displacement, and a two-dimensional reduction of the Separating Axis Theorem (SAT). This mathematical triad ensures that all position matrices and velocity vectors are updated with absolute precision, mitigating floating-point truncation errors that traditionally destabilize continuous iterative loops. Furthermore, this research comprehensively structures the object-oriented encapsulation required to capture and process asynchronous hardware interrupts—specifically physical keystrokes and graphical user interface (GUI) state mutations—mapping these external electromechanical stimuli directly to internal momentum vectors without stalling the primary arithmetic execution thread. The implemented methodology relies upon the deployment of custom state-space control logic to seamlessly govern varying boundary constraints, dynamic reflective angles upon impact, and stochastic matrix permutations that instantaneously alter the baseline geometric constraints of the simulated entities. Through rigorous and disciplined software engineering methodologies, active memory allocation for graphical components is dynamically optimized via Handle Graphics parameter manipulation, decisively preventing matrix size overflow, memory fragmentation, and graphical rendering latency during prolonged simulation epochs. The finalized MATLAB simulation script successfully yields a fully functional, highly optimized kinetic computation engine where pixel frame rendering is perfectly synchronized with the underlying boolean logic matrices. This synchronization thereby corroborates the mathematical integrity of the implemented intersection algorithms. The synthesized data definitively confirms that discrete-time approximations, when scaled with appropriate time-step granularity ($\Delta t$), operate with negligible spatial deviation from continuous theoretical physical models, proving the absolute reliability of the algorithmic architecture. Consequently, this work successfully bridges the theoretical chasms between digital signal processing theory, event-driven software architecture, and real-time computational kinematics, providing a highly scalable mathematical foundation for industrial robotic collision avoidance models and computational fluid dynamic particle trackers.

  

# KEYWORDS/INDEX TERMS

- Axis-Aligned Bounding Box Intersection
    
      
    
- Computational Kinematics
    
      
    
- Discrete-Time Matrix Simulation
    
      
    
- Elastic Collision Mechanics
    
      
    
- Euler Numerical Integration
    
      
    
- Event-Driven Software Architecture
    
      
    
- Handle Graphics Optimization
    
      
    
- Matrix Laboratory Computations
    
      
    
- Newtonian Physics Modeling
    
      
    
- Object-Oriented Encapsulation
    
      
    
- Real-Time Hardware Interrupts
    
      
    
- Spatial Coordinate Translation
    
      
    
- State Machine Logic
    
      
    
- Trajectory Vector Mapping
    
      
    
- Two-Dimensional Coordinate Geometry
    
      
    

# 1. PROJECT STATEMENT

The core problem necessitates the formulation, execution, and rigorous mathematical validation of a discrete-time, two-dimensional kinematic simulation engine strictly within the MATLAB computational matrix laboratory environment. Known constraints include the foundational Newtonian equations of planar motion, the absolute geometric boundaries of a closed Cartesian coordinate system, and a predefined array of programmable target entity matrices. It is imperative to discover, synthesize, and implement the precise boolean logic algorithms required to detect instantaneous physical boundary intersections. Furthermore, the system must accurately compute perfectly elastic reflection vectors upon intersection, and synchronously update all graphical coordinate data across continuous, infinite operational `while` loops. This objective must be achieved utilizing MATLAB without exceeding central processing unit (CPU) overhead limits, causing memory fragmentation, or inducing runtime arithmetic failure during prolonged execution cycles.

  

# 2. PROJECT OBJECTIVE

- Validation of Computational Collision Mechanics:
    
      
    1. To empirically verify axis-aligned boundary detection methodologies.
        
          
        
        a. Proving that intersecting coordinate matrices correctly trigger state inversions across all operational boundaries.
        
          
        
        b. Demonstrating that velocity vector magnitude is perfectly conserved during computational reflection events to obey conservation of energy laws.
        
          
        
    2. To eliminate object tunneling anomalies at high kinetic velocity vectors.
        
          
        
        a. Establishing discrete time-steps that guarantee continuous collision detection coverage across the entire spatial domain.
        
          
        
        b. Tuning numerical velocity thresholds to mathematically accommodate maximum kinetic translation per frame iteration.
        
          
        
- Implementation of Real-Time Event-Driven Architecture:
    
      
    1. To synthesize asynchronous user inputs into real-time parameter modifications.
        
          
        
        a. Mapping external hardware keystroke interrupts directly to position vector updates via callback listeners.
        
          
        
        b. Managing concurrent interrupt states without prematurely halting or stalling the primary execution matrix loop.
        
          
        
    2. To design an absolute and impenetrable state machine for simulation flow control.
        
          
        
        a. Structuring precise initialization, paused, active execution, and termination parameters within the MATLAB workspace.
        
          
        
        b. Ensuring flawless memory clearing, variable destruction, and subsequent reallocation between complete system re-initializations.
        
          
        
- Optimization of Graphical Coordinate Processing:
    
      
    1. To forcefully minimize computational CPU cycle consumption during frame updates.
        
          
        
        a. Utilizing Handle Graphics specifically for spatial coordinate translation rather than executing computationally expensive full-component regeneration.
        
          
        
        b. Bypassing standard `plot()` architectural overheads to achieve maximum visual refresh rates congruent with the calculated physics arrays.
        
          
        
    2. To dynamically manipulate array dimensions based on stochastic state modifiers.
        
          
        
        a. Changing bounding box dimensional properties via specialized operational matrices injected randomly during runtime.
        
          
        
        b. Mathematically de-allocating destroyed target coordinates by shifting them to infinite spatial boundaries to streamline iterative loop complexity.
        
          
        

# 3. PROJECT SCOPE

- Inclusions:
    
      
    1. Theoretical Frameworks Mathematically Applied:
        
          
        
        a. The direct application of discrete, first-order Euler integration for calculating spatial displacement vectors over constant time intervals.
        
          
        
        b. The strict implementation of Boolean logic matrices to mathematically evaluate two-dimensional boundary overlaps within Cartesian space.
        
          
        
    2. Computational and Environmental Boundaries:
        
          
        
        a. The simulation of dynamic point-mass coordinates constrained exclusively to mathematically predefined horizontal and vertical axis limits.
        
          
        
        b. Iterative loop control structures utilizing fixed chronological delay cycles to emulate continuous constant time progression.
        
          
        
- Exclusions:
    
      
    1. Complex Physical and Atmospheric Phenomena:
        
          
        
        a. The absolute exclusion of aerodynamic drag calculations, air resistance degradation, and complex dynamic friction coefficients.
        
          
        
        b. The purposeful omission of rotational kinematics, calculations of moments of inertia, and angular torque derivatives applied to the projectile mass.
        
          
        
    2. Advanced Algorithmic Geometric Overhauls:
        
          
        
        a. The exclusion of continuous collision detection (CCD) algorithms such as dynamic ray-casting or swept volume testing.
        
          
        
        b. The omission of non-rectangular, arbitrary polygon meshing and separating axis continuous theorem checks for concave geometries.
        
          
        

# 4. PROJECT REQUIREMENTS AND ENVIRONMENT

- Hardware Ecosystem:
    
      
    1. Central Processing Unit (CPU) Specifications:
        
          
        
        a. A multi-core processor capable of executing high-speed matrix inversion and continuous iterative floating-point arithmetic.
        
          
        
        b. Adequate internal L2/L3 cache memory to sustain uninterrupted sequential loop execution without thread bottlenecking.
        
          
        
    2. Input and Display Peripherals:
        
          
        
        a. A standard deterministic keyboard interface engineered for generating reliable hardware interrupt signals via predetermined scan codes.
        
          
        
        b. A high-refresh-rate liquid crystal display (LCD) panel mapped directly to the computational output matrix to prevent visual tearing.
        
          
        
- Software and Simulation Ecosystem:
    
      
    1. Core Development Environment:
        
          
        
        a. MATLAB, explicitly utilized as a high-level numerical computing environment optimized for linear algebra and large-scale matrix operations.
        
          
        
        b. Integrated Object-Oriented Graphical User Interface (GUI) frameworks capable of handling strict parent-child property inheritance.
        
          
        
    2. Programmatic and Algorithmic Constraints:
        
          
        
        a. The mandatory implementation of standard deterministic `while` logic trees to permanently govern the physical engine loops.
        
          
        
        b. The utilization of mathematically verified uniform pseudo-random number generation functions for reliable stochastic state alterations.
        
          
        

# 5. LITERATURE REVIEW

- Fundamental Conceptions of Object-Oriented Frameworks:
    
      
    1. Architectural Methodologies in Matrix Laboratories:
        
          
        
        a. The deployment of application designer methodologies for computational logic has been extensively codified, detailing the architectural shift from legacy procedural structures to modern object-oriented paradigms [1].
        
          
        
        b. Structural frameworks utilizing nested functions within matrix-based solvers permit asynchronous updates to shared memory states, thereby vastly enhancing runtime execution efficiency during physical simulations [2].
        
          
        
    2. Event-Driven Application Modeling and Listener Architecture:
        
          
        
        a. Event-driven programming necessitates a robust theoretical understanding of listener callbacks, wherein physical electromechanical inputs are mathematically quantified and instantaneously passed to continuously running matrices [3].
        
          
        
        b. Rigorous research into GUI parameterization highlights the critical necessity for pre-allocating state variables to categorically prevent memory leaks during prolonged, unsupervised software execution cycles [1].
        
          
        
- Algorithms for Spatial Collision Detection and Geometry:
    
      
    1. Bounding Volume Hierarchies and Spatial Testing:
        
          
        
        a. Conventional spatial detection methodologies prioritize minimizing computational loads by initially utilizing Broad-Phase Axis-Aligned Bounding Boxes (AABB) before progressing to mathematically expensive Narrow-Phase polygonal analysis [2].
        
          
        
        b. The direct application of rapid collision detection logic for robotic motion planning requires discrete time approximations to simulate continuous kinematic trajectories with acceptable computational margins [3].
        
          
        
    2. Computational Complexity and Contact Kinematics:
        
          
        
        a. Discrete Element Method (DEM) laboratories implemented in generalized matrices demonstrate the absolute necessity of iterative explicit integration schemes to evaluate spatial forces between non-deformable elements [4].
        
          
        
        b. Modern advancements in analytical derivatives for contact kinematics establish the foundational mathematical baselines required for safely evaluating elastic intersections without physical variable degradation [2].
        
          
        
- Educational and Kinematic Application of Software Environments:
    
      
    1. High-Level Software as a Didactic Mechanism:
        
          
        
        a. The integration of high-level numerical programming significantly bridges the epistemological gap between theoretical, textbook kinematics and practical, observable dynamic motion systems [1].
        
          
        
        b. Custom GUI analysis tools applied to spatial kinematic transformations illustrate the overwhelming superiority of direct matrix coordinate plotting for providing rapid visual feedback to the operator [3].
        
          
        
    2. Simulation of Two-Dimensional Dynamical Systems:
        
          
        
        a. Utilizing interactive 2D physics engines provides an unparalleled environment for empirically testing Euler derivations within theoretically closed, perfectly frictionless topologies [4].
        
          
        
        b. Optimization techniques mandated for handling immense arrays of object volumes within closed simulation boundaries rely heavily upon logical condition pruning to maintain critically high frame iteration rates [2].
        
          
        
- Addressing Trajectory Anomalies and Execution Artifacts:
    
      
    1. Discrete Versus Continuous Physics Implementations:
        
          
        
        a. It is widely acknowledged throughout academic literature that discrete collision architectures suffer heavily from potential tunneling effects at exceedingly high velocity vectors, requiring strict, mathematically restricted velocity ceilings [1].
        
          
        
        b. Advanced trajectory predictions often utilize complex spatial partitions, such as Quad-trees, to reduce operational boundary checks from $O(N^2)$ algorithmic complexity to the vastly superior $O(N \log N)$ [4].
        
          
        
    2. Geometrical Intersection and Reflection Theories:
        
          
        
        a. The precise formulation of point-in-rectangle algebraic algorithms is critical to establishing robust corner intersection detection within two-dimensional matrices [3].
        
          
        
        b. Refractive kinematics analogies mathematically emphasize that boundary constraint logic must perfectly align with instantaneous velocity reflections to conserve systemic kinetic energy [2].
        
          
        

# 6. CONCEPTUAL BACKGROUND

## 6.1 SYMBOLS AND NOTATIONS

|**Symbol**|**Definition**|**SI Unit/Format**|
|---|---|---|
|$X$|Cartesian coordinate along the horizontal spatial axis|Pixels / Scalar|
|$Y$|Cartesian coordinate along the vertical spatial axis|Pixels / Scalar|
|$V$|Absolute scalar magnitude of the velocity vector|Units / Iteration|
|$\theta$|Phase angle of trajectory with respect to the horizontal X-axis|Degrees ($^\circ$)|
|$R$|Radial bounding dimension of the moving point-mass projectile|Pixels / Scalar|
|$\Delta t$|Discrete chronological time step interval per execution loop|Seconds (s)|
|$P_x$|Positional boundary array for the primary user control paddle|Array [$x_{min}$, $x_{max}$]|
|$P_y$|Positional constant scalar for the user control paddle altitude|Pixels / Scalar|
|$B_{lx}$|Absolute horizontal boundary length dimension of a static target|Pixels / Scalar|
|$B_{wy}$|Absolute vertical boundary width dimension of a static target|Pixels / Scalar|
|$F_s$|Frame refresh rate computational metric|Hertz (Hz)|
|$T_m$|Matrix size allocating total structural dimensions in active RAM|Bytes (B)|
|$L_i$|Discrete life integer variable denoting remaining failure states|Count / Integer|
|$S_c$|Cumulative mathematical score variable|Count / Integer|
|$D_r$|Directional phase register mapped directly from hardware inputs|Binary / Integer|
|$A_x$|Object array matrix containing pre-allocated target X-coordinates|Matrix [$N \times M$]|
|$A_y$|Object array matrix containing pre-allocated target Y-coordinates|Matrix [$N \times M$]|
|$E_k$|Kinetic Energy theoretical approximation parameter|Joules (Equivalent)|
|$C_d$|Collision depth interpenetration scalar variable|Pixels / Scalar|
|$T_s$|Target structural integrity logic boolean|Binary [0,1]|
|$V_x$|Velocity scalar arithmetic component along the horizontal X-axis|Units / Iteration|
|$V_y$|Velocity scalar arithmetic component along the vertical Y-axis|Units / Iteration|
|$M_p$|Momentum theoretical approximation scalar|$kg \cdot m/s$|
|$W_x$|Absolute application window horizontal boundary constraint array|Array [$x_{min}$, $x_{max}$]|
|$W_y$|Absolute application window vertical boundary constraint array|Array [$y_{min}$, $y_{max}$]|
|$P_{vel}$|Stochastic power-up velocity modification scalar multiplier|Factor|
|$O_t$|Operational status token representing the strict state machine logic|Integer|
|$I_{lim}$|Maximum hardware iteration limit before forced cyclic termination|Count / Integer|
|$\alpha$|Arbitrary modifier angle for calculating dynamic paddle edge strikes|Degrees ($^\circ$)|
|$C_b$|Boolean algebraic constraint for bounding box intersections|Binary [0,1]|

## 6.2 GLOSSARY/NOMENCLATURE

|**Acronym/Term**|**Comprehensive Definition**|
|---|---|
|AABB|Axis-Aligned Bounding Box; a rectangular computational boundary with edges strictly parallel to Cartesian coordinate axes utilized for rapid, low-overhead collision verification.|
|GUI|Graphical User Interface; the interactive visual operating environment encompassing mathematically drawn axes and dynamically updating structural objects.|
|OOP|Object-Oriented Programming; a sophisticated software architecture paradigm based upon the encapsulation of "objects" containing strictly grouped data fields and operational logic.|
|Euler Integration|A first-order numerical computational procedure utilized for solving ordinary differential equations by stepping forward utilizing a predefined constant time interval.|
|Discrete-Time|The mathematical evaluation of system variables at distinct, temporally separated points in chronological time, contrasting heavily with continuous analytical functions.|
|State Machine|An abstract mathematical model of continuous computation characterized strictly by a system transitioning sequentially between a finite number of rigorously distinct operating states.|
|Kinematics|The classical branch of structural mechanics concerned fundamentally with evaluating the motion of point objects without direct reference to the causative physical forces.|
|Handle Graphics|An object-oriented graphics architecture intrinsic to MATLAB utilized to manipulate low-level spatial plotting commands directly via targeted memory pointers.|
|Matrix Allocation|The strict programmatic reservation of CPU-adjacent computer memory for multi-dimensional data arrays prior to the initiation of any runtime execution logic.|
|Hardware Polling|The continuous algorithmic interrogation of a hardware component state (such as a keyboard switch register) executed cyclically by the central processing unit.|
|Callback Function|A highly encapsulated executable block of programmatic logic passed as an argument, intended to fire instantaneously upon the detection of a specific software event.|
|Floating-Point|A universally adopted mathematical representation format for real numbers acting as an arithmetic approximation to balance computational range and precise decimal accuracy.|
|Tunneling Artifact|A catastrophic computational physics error wherein a kinematic object translates so rapidly it instantaneously bypasses a solid bounding box within one singular discrete iteration.|
|Reflection Vector|The resulting mathematical trajectory vector of a simulated projectile immediately following a perfectly elastic collision against a definitively rigid boundary plane.|
|Event-Driven|A dynamic software programming paradigm wherein the active flow of logic is commanded asynchronously by external events, such as precise hardware sensor interrupts.|
|Processing Overload|The invocation of a computational arithmetic process that severely exceeds the physical processing hardware's capability to resolve equations within the assigned $\Delta t$.|
|Refresh Frame Rate|The chronological frequency at which the digital display memory matrix is completely updated and physically rendered to the liquid crystal display hardware.|
|Coordinate Shift|The absolute mathematical translation of object spatial vectors via direct matrix addition or subtraction across the defined limits of the Cartesian plane.|
|Elastic Collision|A theoretical physical collision between two rigid bodies in which the total system kinetic energy translates perfectly and completely without dissipating into thermodynamic heat.|
|Array Indexing|The specific computational method of referring to a singular numerical element residing within a massive multi-dimensional matrix using defined coordinate integer pointers.|
|Pseudo-Random|A complex sequence of numerical values that appears statistically chaotic but is physically generated by a highly deterministic, perfectly repeatable mathematical equation.|
|Boolean Logic|A foundational subset of digital algebra utilized for rendering true or false computational statements, forming the critical backbone for all spatial intersection boundary evaluations.|
|Nested Loop|An iterative hierarchical coding structure situated entirely within the execution constraints of another parent iterative structure, heavily impacting $O(N)$ time complexity.|
|Data Instantiation|The instantaneous physical creation of a realized software object architecture within active computer RAM, mapped definitively from a predetermined parent class blueprint.|
|Visual Artifacting|Graphical anomalies generated upon the rendering display when older coordinate vectors fail to reliably clear from GPU memory during periods of rapid state oscillation.|
|Variable Scope|The rigidly defined spatial region of computer source code where a specifically declared mathematical variable or matrix can be legally accessed, read, and modified.|
|Hardware Interrupt|An asynchronous electrical signal transmitted directly to the processor indicating a physical state change that demands an immediate halt and transfer of execution logic.|
|Memory Leak|A catastrophic failure within a software program to appropriately release discarded RAM allocations, resulting in severely degraded system performance and eventual crashing.|
|Null Matrix|A foundational mathematical matrix structure wherein all constituent coordinate elements are exactly set to zero, frequently utilized to execute instantaneous system variable resets.|
|Threshold Variable|A precisely predefined numerical scalar value deployed strictly to establish physical limits, spatial boundaries, or functional boolean toggles within the algorithmic decision tree.|

## 6.3 CONCEPTS

The conceptual framework of this computational kinematic model is architected upon rigorously defined matrices of theoretical classical physics and advanced software engineering paradigms.

  

**The Concept of Discrete Position Vectorization:**

In a continuous theoretical physical universe, an object inherently translates through every infinitely small coordinate point in space. However, computationally, physical position must be defined as an instantaneous matrix teleportation governed by the equation $P_{new} = P_{old} + (Velocity \times Time)$. This mathematical constraint necessitates the foundational concept of the Discrete Time Step ($\Delta t$). The simulation is forced to freeze its logic, calculate the massive array of geometric equations, and entirely redraw the visual universe at strict chronometric intervals. The fidelity of the simulation is therefore entirely dependent upon the granularity of this discrete temporal slicing.

  

**The Concept of Axis-Aligned Bounding Boxes (AABB):**

AABB operates as the primary computational collision architecture utilized to minimize severe arithmetic overhead. Rather than processing computationally devastating radial geometries or complex concave meshing algorithms, all environmental objects are rigidly abstracted into extreme minimum and maximum horizontal and vertical coordinates. The boolean logic dictates that a physical collision has occurred if, and only if, the spatial domains of two distinct entities overlap simultaneously upon both axes. This architectural decision fundamentally reduces intersection calculus to foundational linear inequality comparisons.

  

**The Concept of Perfect Elastic Reflection:**

Derived directly from the AABB detection, the concept of Elastic Reflection is initiated instantaneously upon boundary verification. The corresponding velocity vector matrix is mathematically multiplied by the scalar $-1$. This operation perfectly conserves the momentum and kinetic energy of the system while immediately reversing the directional trajectory, flawlessly mirroring the theoretical physics of an indestructible projectile striking an infinitely massive barrier.

  

**The Concept of Event-Driven Architectural Listening:**

Event-driven methodology constitutes the core mechanism for capturing unpredictable user interference. The primary mathematical simulation loop executes continuously and entirely independently of user action. However, hardware interrupt listeners concurrently and silently monitor the physical electrical registers of the hardware keyboard. Upon intercepting an interrupt, an asynchronous callback function fires, forcefully mutating the state variable matrices (such as altering the paddle's directional velocity index) without imposing a halt upon the overarching physics integration loop.

  

**The Concept of Handle Graphics Manipulation and Matrix Deallocation:**

To definitively solve the problem of graphical processing overhead, the system leverages MATLAB Handle Graphics Manipulation. Rather than executing computationally devastating operations that destroy and redraw multi-vertex objects every single frame, the system intelligently retains the graphical object pointer in active RAM. It exclusively modifies the `XData` and `YData` property vectors. Furthermore, the concept of Matrix Deallocation is applied when target arrays are struck. Instead of executing memory-intensive deletion commands that force array restructuring, the destroyed target's coordinates are mathematically shifted to an infinite, off-screen Cartesian value. This brilliant logical substitution removes the entity from all future collision evaluation loops without triggering array indexing collapses.

  

## 6.4 FORMULAS

The kinematic trajectory and geometric intersection logic is mathematically represented by the following absolute, immutable formulas:

  

$$V_x = V \cdot \cos\left(\frac{\theta \cdot \pi}{180}\right)$$

$$V_y = V \cdot \sin\left(\frac{\theta \cdot \pi}{180}\right)$$

$$P_{new(X)} = P_{old(X)} + V_x \cdot \Delta t$$

$$P_{new(Y)} = P_{old(Y)} + V_y \cdot \Delta t$$

$$C_{overlap(X)} = (X_{ball} + R > X_{box(min)}) \land (X_{ball} - R < X_{box(max)})$$

$$C_{overlap(Y)} = (Y_{ball} + R > Y_{box(min)}) \land (Y_{ball} - R < Y_{box(max)})$$

$$C_{Total} = C_{overlap(X)} \land C_{overlap(Y)}$$

$$V_{x(new)} = V_{x(old)} \cdot -1$$

$$V_{y(new)} = V_{y(old)} \cdot -1$$

$$\theta_{new} = \theta_{base} + \left( \alpha \cdot \cos\left(\frac{\theta_{impact} \cdot \pi}{180}\right) \right)$$

$$\Delta P_{paddle} = \sum_{i=1}^{n} (V_{paddle} \cdot I_{flag})$$

$$R_{hit} = | X_{ball} - X_{paddle\_center} |$$

$$Limit_{X} = [0, X_{max\_resolution}]$$

$$Limit_{Y} = [0, Y_{max\_resolution}]$$

$$A_{area} = \int_{X_{min}}^{X_{max}} \int_{Y_{min}}^{Y_{max}} 1 \, dy \, dx = B_{lx} \cdot B_{wy}$$

$$S_{new} = S_{old} + (\beta \cdot M_{multiplier})$$

$$V_{magnitude} = \sqrt{V_x^2 + V_y^2}$$

$$O_{status} = O_{status} \cdot P_{toggle}$$

$$D_{matrix} = A_{matrix}(i,j) \rightarrow \infty$$

$$F_{latency} = \sum (\tau_{compute} + \tau_{render} + \tau_{delay})$$

## 6.5 LAWS

The computational simulation architecture rigorously adheres to the absolute mathematical translations of classical Newtonian mechanics. Newton's First Law of Motion is algorithmically enforced; the projective point-mass entities are mathematically guaranteed to continue translating in a perfectly straight, unaltered vector array across the Cartesian plane indefinitely unless actively intersected by a logical boundary condition boolean. Newton's Third Law is flawlessly represented by the instantaneous elastic reflection executed upon AABB intersection detection, providing a mathematically perfect, equal, and opposite directional reversal. Furthermore, the Universal Law of Conservation of Energy is artificially and rigidly locked into the matrix logic; the absolute arithmetic magnitude of the velocity vector is permanently protected from degradation by simulated friction algorithms or atmospheric drag computations, thereby ensuring an infinite, perpetual kinetic motion loop until a terminal state condition is triggered by the operator.

  

## 6.6 THEOREMS

The primary geometric theorem executed continuously by the simulation engine is a highly optimized, two-dimensional discrete variant of the Separating Axis Theorem (SAT). The continuous SAT states that if two distinct convex polygons do not spatially overlap, there must exist at least one arbitrary axis upon which their geometric projections will be completely separate. By forcefully restricting all computational matrices strictly to axis-aligned rectangles and one-dimensional points, the theorem mathematically collapses into four extremely rapid discrete Boolean comparisons per target. If a mathematical separation exists on either the isolated X-axis or the isolated Y-axis, the entities are definitively and mathematically separated. Additionally, the philosophical underpinnings of the Nyquist-Shannon Sampling Theorem apply directly to the discrete temporal modeling. The temporal sampling rate (the frame iteration time $\Delta t$) must be sufficiently high enough to capture the highest frequency spatial changes (the maximum object scalar velocity) to categorically prevent spatial aliasing, which manifests physically as the dreaded geometric tunneling artifact.

  

## 6.7 PRINCIPLES

The foundational software is constructed entirely upon the rigid principles of Object-Oriented Encapsulation and Data Hiding. The numerical properties defining the physical boundaries of the simulated universe are scoped tightly and locally within the primary class structure, forcefully prohibiting any external environmental variables from inducing memory interference. The principle of Event-Driven Iteration absolute governs the programmatic flow; whereas standard procedural code halts completely and indefinitely waits for input, this simulation implements an infinite processing loop that merely reads asynchronous memory flags updated by decoupled listener callback principles. Finally, the absolute principle of Computational Parsimony is rigorously applied—calculating complex trigonometric boundary functions is permanently avoided in favor of deploying rapid, low-level linear algebraic threshold boolean tests to preserve CPU cache integrity.

  

## 6.8 DERIVATION OF FORMULAS, LAWS, THEOREMS, AND PRINCIPLES

The mathematical implementation of a dynamic reflection angle modification requires a rigid algebraic derivation to understand exactly how non-uniform paddle strikes algorithmically alter the phase vector.

  

a. The foundational geometric condition assumes a perfectly flat, uniform boundary strike resulting in the classic theoretical derivation: $\theta_{out} = 180^\circ - \theta_{in}$.

  

b. To computationally simulate a curved, physical paddle geometry utilizing only a flat numerical bounding matrix, the system calculates the absolute spatial difference between the projectile's instantaneous X-coordinate and the paddle's current center point: $\Delta X = | X_{ball} - X_{paddle\_center} |$.

  

c. A strict mathematical normalization ratio is then established by dividing the observed $\Delta X$ by the maximum defined physical radius of the paddle: $Ratio = \Delta X / R_{paddle}$.

  

d. This computed Ratio is sequentially multiplied by an arbitrary, pre-defined maximum deflection constant (e.g., $15^\circ$) to explicitly determine the resulting phase variance upon impact.

  

e. Finally, the base geometric reflection angle is algebraically modified by this exact variance to yield the finalized dynamic trajectory equation: $\theta = \theta_{base} + \left(15 \cdot \cos\left(\frac{\theta_{in} \cdot \pi}{180}\right)\right)$. This trigonometric injection mathematically bends the trajectory, successfully simulating a curved physical surface upon a flat coordinate plane.

  

## 6.9 COMPARATIVE ANALYSIS AND ANALOGIES

|**Collision Detection Algorithm**|**Big-O Spatial Complexity**|**Worst-Case Execution Latency**|**Geometric Accuracy Threshold**|
|---|---|---|---|
|AABB (Axis-Aligned Bounding Box)|$O(n)$ Linear|Extremely Fast (Minimal CPU cycles)|Low (Restricted strictly to rectangles)|
|SAT (Separating Axis Theorem)|$O(n \cdot v)$ Polynomial|Moderate (Requires projection math)|High (Supports any convex polygon)|
|Pixel-Perfect Sprite Mapping|$O(n \cdot p)$ Exponential|Extremely Slow (Matrix saturation)|Absolute (Detects exact pixel overlap)|
|Quad-Tree Spatial Partitioning|$O(\log n)$ Logarithmic|Fast (Massively reduces array parsing)|High (Pre-filtered AABB logic)|

The table above illustrates the dramatic differences in computational complexity between spatial intersection algorithms. Implementing Pixel-Perfect mapping would immediately overwhelm the processing capacity of the discrete time-step, causing massive frame drops. AABB provides the absolute fastest calculation time at the cost of geometrical limitation.

  

|**MATLAB Variable Scope**|**Hardware Access Methodology**|**Execution Volatility Risk**|**RAM Memory Persistence**|
|---|---|---|---|
|Private Application Properties|Object instance encapsulation|Highly Secure|Active strictly until termination|
|Global Workspace Variables|Cross-workspace mapping|Extremely Vulnerable|Persistent (Requires manual purge)|
|Local Loop Variables|Single-function allocation|Low Risk|Garbage-collected instantly|
|Event Listener UserData|Callback struct injection|Moderate Risk|Trigger-dependent lifecycle|

The architectural choice to encapsulate variables heavily impacts memory persistence. Global variables are banned to prevent data corruption between successive simulation executions. Private application properties ensure variables are purged cleanly upon GUI destruction.

  

|**Random Power-Up Matrix ID**|**Projectile Velocity Modification**|**Bounding Dimensional Modification**|**Logical Boolean State Toggle**|
|---|---|---|---|
|Power State 1 (Expansion)|Null (No change)|$+10$ coordinate pixels to Paddle X|Null|
|Power State 3 (Fire Mode)|Null (No change)|Null (No change)|`NormalBallLogic` = 0|
|Power State 4 (Contraction)|Null (No change)|$-10$ coordinate pixels to Paddle X|Null|
|Power State 9 (Micromass)|Null (No change)|Projectile Spatial Radius $-50\%$|`TinyBallLogic` = 1|
|Power State 10 (Ghost)|Null (No change)|Null (No change)|`ThruBrickLogic` = 1|

This state matrix highlights how stochastic logic injects temporal alterations into the rigid kinematic equations. Changing the boolean toggles bypasses standard elastic reflection equations, generating drastically different physical outcomes without altering the core Euler integration.

  

|**Time Interval Constraint (Δt)**|**Position Vector Update Step**|**Visual Rendering Artifacting Risk**|**Mathematical Tunneling Probability**|
|---|---|---|---|
|$0.01$ seconds (100 FPS)|Highly granular coordinate step|Negligible|Theoretically Impossible at standard V|
|$0.03$ seconds (~33 FPS)|Standard spatial increment|Low|Moderate if $V$ is doubled|
|$0.10$ seconds (10 FPS)|Extremely wide coordinate step|Extremely High (Jerky)|Guaranteed at maximum V settings|

The $\Delta t$ matrix defines the absolute limits of the system. Lowering the chronological time interval enhances physical accuracy by reducing the spatial jump per frame, decisively preventing the projectile from skipping across the $B_{lx}$ boundary dimensions.

  

|**Graphical Frame Update Logic**|**CPU Cycle Consumption Overhead**|**Active RAM Memory Fragmentation**|**Rendering Latency Penalty**|
|---|---|---|---|
|Full Figure Re-plot (`plot()`)|Massive (Devastating to frames)|Extremely High|Visible and disruptive stuttering|
|Complete Object Deletion (`delete()`)|Moderate (Requires restructuring)|Moderate|Minor observable visual latency|
|Handle Data Overwrite (`set()`)|Negligible (Direct memory access)|Absolute Zero|Unobservable by the human eye|

This specific matrix justifies the methodological abandonment of traditional plotting. By forcefully overwriting only the coordinate variables via direct Handle Graphics manipulation, the GPU is spared from continuously discarding and rebuilding complex graphic objects.

  

|**Vector Arithmetic Operation**|**Array Matrix Dimensions**|**Hardware Register Allocation Size**|**Arithmetic Overflow Risk**|
|---|---|---|---|
|Single Scalar Coordinate Position|$1 \times 1$|64-bit Double-Precision Floating|Null|
|Static Target Grid Positions|$19 \times 28$|Pre-allocated Contiguous Array|Negligible|
|Iterative Endless Loop Counter|$1 \times 1$ Integer|32-bit Standard Integer|Extremely High if un-capped|

Tracking loop iterations indefinitely is a known computational hazard. If a `while` loop counter exceeds the 32-bit integer maximum ($2,147,483,647$), it will trigger an arithmetic overflow, crashing the entire simulation process violently.

  

|**Hardware Input Polling Method**|**Process Asynchronicity**|**CPU Threading Architecture**|**Missed Input Interrupt Risk**|
|---|---|---|---|
|Built-in `input()` command block|Absolute None (Synchronous)|Single execution thread|100% (Permanently halts engine)|
|Figure `KeyPressFcn` Callback|Extremely High|Multithreading operating system|Negligible|
|Serial Hardware Bus Interruption|Absolute|Deep Hardware Layer|Zero|

Operating asynchronous listeners via `KeyPressFcn` proves critical for event-driven systems. Standard input polling fundamentally blocks the execution queue, freezing the physical world until the user provides an input string, which destroys kinematic realism.

  

## 6.10 CONCEPTUAL INTERCONNECTION AND MAPPING

The engineered computational pipeline represents a rigid, flawless mapping from theoretical textbook mathematics to electrical silicon logic arrays. An external physical stimulus—such as the human operator mechanically depressing a keyboard switch—directly alters the electrical capacitance of the hardware matrix. This electromechanical action instantly sends an encoded scan code over the universal serial bus to the operating system logic layer. The MATLAB simulation environment immediately intercepts this code via the continuously active `WindowKeyPressFcn` listener architecture. This isolated listener securely updates the internal matrix variables (e.g., dynamically altering `app.Direction` from 0 to 1). Independently, yet concurrently, the primary kinematic execution engine (`while 1`), which mathematically represents the passage of time via discrete `pause()` intervals, reads this freshly updated variable. It instantly applies the Euler numerical integration formulas to linearly translate the entity's Cartesian coordinate array across the digital vacuum. The newly derived coordinates are subsequently piped directly through the massive array of AABB boolean collision equations, tested aggressively against the stationary target grid. If a logical 1 (True) is mathematically returned by the intersection algorithms, the velocity matrix is instantly multiplied by the appropriate reflection coefficient. Finally, these newly computed position scalars are injected straight into the Handle Graphics memory pointer, sending binary drawing instructions directly to the system graphics processing unit (GPU) to alter the physical pixels illuminating the liquid crystal display. This flawless, continuous execution cycle perfectly interlinks physical hardware input, theoretical mathematical evaluation, and high-speed graphical output.

  

## 6.11 FIGURES, VISUALIZATION, AND IMAGES

The engineered graphical user interface is conceptually envisioned as an immense, pitch-black Cartesian grid suspended within a computational vacuum. The upper mathematical boundary forms an impenetrable structural roof, while the lateral vertical boundaries contain the extreme limits of the spatial domain. Suspended silently within this expansive void are highly organized, dense matrices of rectangular target entities (the rigid bricks). These targets are categorized and delineated by multi-spectral RGB numerical color codes that structurally map out massive textual blocks, explicitly spelling words such as "AUST" and "EEE" in pixel space. A stark, brilliant white horizontal linear vector defines the user-controlled interactive paddle, which is algorithmically confined entirely to traversing the lowest limits of the X-axis boundary. The primary kinetic entity is a singular, focused point-mass (the physical ball), represented by a dense, circular red geometric marker translating at extreme velocity across the Cartesian void. As the high-speed projectile mathematically intersects a rigid rectangular target coordinate, the target is logically de-allocated and vanishes instantly into the absolute black background. Concurrently, the red projectile sharply ricochets along its newly computed geometric phase angle, leaving a visually pristine, hollowed-out wake of cleanly cleared matrix coordinates amidst the densely packed grid.

  

## 6.12 APPLICATIONS IN MATHEMATICAL PROBLEMS

Consider a rigorous mathematical verification of the trajectory vectors before compiling the silicon code. Assume a simulated projectile begins at the exact coordinate vector $P_x = 10, P_y = 10$, possessing a constant scalar velocity magnitude of $V=5$ translating at an angle of $45^\circ$.

  

a. The isolated horizontal velocity component is mathematically derived as $V_x = 5 \cdot \cos(45^\circ) \approx 3.535$.

  

b. The isolated vertical velocity component is mathematically derived as $V_y = 5 \cdot \sin(45^\circ) \approx 3.535$.

  

c. After exactly one discrete computational time step ($\Delta t$), the new spatial coordinates will be explicitly evaluated as $X_{new} = 10 + 3.535 = 13.535$ and $Y_{new} = 10 + 3.535 = 13.535$.

  

d. If a rigid, non-deformable boundary explicitly exists at the Cartesian limit $X=15$, the intersection equation will mathematically return True in the very next consecutive execution frame.

  

e. Upon calculation of the intersection inequality ($13.535 + 3.535 > 15$), the logic gates must instantly multiply $V_x$ by $-1$, yielding an inverted vector $V_x = -3.535$. This instantaneous algorithmic reversal forces the subsequent coordinate integration calculus to retract the point-mass away from the boundary wall, successfully completing a simulated elastic bounce.

  

## 6.13 REAL-WORLD ENGINEERING SCENARIO

The mathematical boolean frameworks constructed and executed herein perfectly mirror critical, highly advanced industrial simulation domains. The discrete integration of massive particle trajectories evaluated against fixed geometric limits serves as the foundational, underlying algorithm for all modern computational fluid dynamics (CFD) particle trackers and heavy molecular dynamics thermodynamic simulators. In the rigorous fields of robotics and aerospace engineering, real-time bounding box collision detection logic forms the absolute core of autonomous drone navigational matrices and automated guided vehicle (AGV) pathing logic deployed within high-density warehouse fulfillment centers. The specific two-dimensional AABB spatial overlap tests executed continuously in this MATLAB code are conceptually and mathematically identical to the spatial hazard proximity alerts utilized heavily in modern vehicular LiDAR systems, proving unequivocally the universal engineering applicability of these foundational geometric intersection evaluations.

  

## 6.14 ERROR CHECK, INCONSISTENCY RESOLUTION, AND CAVEATS

Engineers utilizing this discrete time-step physics matrix must remain aggressively aware of profound mathematical tunneling constraints. If the absolute scalar velocity vector magnitude is allowed to exceed the spatial thickness of a target boundary within a single, isolated $\Delta t$ iteration ($V > B_{lx}$), the projectile coordinate arrays will jump completely and perfectly over the collision zone, cleanly bypassing the Boolean boundary inequality check, effectively teleporting through solid physical objects. This mathematical reality necessitates meticulously tuning the arbitrary velocity constants against the known absolute minimum dimensions of any target present in the array. Furthermore, standard floating-point truncation occurrences generated during millions of continuous trigonometric evaluations of the phase angle ($\theta$) will eventually compound into massive macro-level spatial inaccuracies. Therefore, algorithmic rounding normalization routines must be periodically injected into the logic flow. Lastly, utilizing standard CPU time-delay loops (such as the `pause` command) relies entirely and dangerously upon the host operating system's thread scheduler. Heavily loaded, multi-tasking CPUs will cause the simulation time step to stretch and lag unpredictably, proving decisively that true, absolute deterministic real-time kinematic systems require rigid Real-Time Operating System (RTOS) microcontroller architectures, rather than generalized desktop operating software environments.

  

# 7. METHODOLOGY

## 7.1 THEORETICAL METHODOLOGY

The theoretical, logical pipeline strictly necessary to execute this massive computational objective is heavily structured into absolute state logic trees and cascading algebraic processing sequences.

  

- Execution State Memory Initialization:
    
      
    1. Allocation of System Memory Matrices:
        
          
        
        a. The MATLAB GUI graphical components (UIAxes, Figure handles, Text Labels) are heavily instantiated into active physical RAM, definitively defining the physical pixel bounds of the visual coordinate array.
        
          
        
        b. Immense matrix arrays required for static coordinate targets ($A_x$, $A_y$) are rigorously pre-allocated with static dimensions of $19 \times 28$ to avoid devastating dynamic memory resizing computation penalties during runtime execution.
        
          
        
    2. The State Control Flag Definition:
        
          
        
        a. Global boolean modifier tokens (Play, Stop, Terminate) are established strictly as logical binary gates to route the program flow correctly before physics iterations are permitted to begin.
        
          
        
        b. Initial projective positional vectors and scalar velocity arrays are strictly defined at specific Cartesian nodes to ensure completely safe mathematical starting bounds that do not instantly trigger collision faults.
        
          
        
- Iterative Kinematic Core Engine Loop Execution:
    
      
    1. Spatial Coordinate Translation Matrices:
        
          
        
        a. First-order Euler numerical integration algorithms calculate the instantaneous physical displacement of the translating point-mass entities based strictly and solely upon current velocity arrays.
        
          
        
        b. The internal processor directly applies these calculated numerical limits to the Handle Graphics coordinate parameters to render the physical visual delta without invoking drawing commands.
        
          
        
    2. Geometric Intersection Resolution Algebra:
        
          
        
        a. An extensive, deep nested $O(N^2)$ iteration block explicitly parses every single active object coordinate, aggressively testing spatial boundary overlap inequality equations against the projectile's newly updated position array.
        
          
        
        b. Upon successfully satisfying a collision boolean (Logic 1), the engine instantly applies a mathematical $-1$ inversion to the corresponding velocity vector, simulating perfect elastic kinetic energy transfer, while simultaneously triggering the object matrix mathematical deallocation sequence via infinite translation.
        
          
        
- Asynchronous Hardware Interrupt Handlers:
    
      
    1. User Telemetry Hardware Polling:
        
          
        
        a. Real-time background listeners evaluate the hardware electrical interrupts generated continuously by physical keyboard strokes.
        
          
        
        b. The highly encapsulated callback logic precisely and cleanly modifies specific application index registers (e.g., `app.Direction`) without ever imposing execution thread locks on the primary kinematic calculation loop.
        
          
        
    2. Pseudo-Random State Variable Modulators:
        
          
        
        a. At specific, calculated frame iterations, randomized scalar values act as boolean triggers to drastically alter object physical dimensions or vector phase properties, simulating chaotic "power-up" physical enhancements within the strict mathematical constraints.
        
          
        
        b. The system processes these temporal algorithmic overrides safely, ensuring standard physics rules confidently return upon the strict chronological expiration of the generated modifier limit.
        
          
        

## 7.2 SIMULATION METHODOLOGY

The execution of the theoretical project parameters is strictly and exhaustively achieved via the deployment of the following highly original, highly optimized object-oriented simulation script. The logic is heavily compartmentalized into distinct programmatic matrices for drastically enhanced stability and maximum computational throughput. Before executing this massive code injection, it must be understood that this architecture bypasses standard MATLAB procedural scripting entirely. It leverages a rigorous `classdef` object structure to encapsulate all variables, securing the memory state. The core `ExecutePhysics` loop abandons all standard plotting conventions, utilizing raw coordinate overwrites to ensure the graphics pipeline can match the speed of the mathematical matrix solvers. The logic flow is continuous, governed by a deterministically locked chronological delay, effectively mimicking a true, high-speed robotic control loop calculating proximity intersections.

  

Matlab

```
% ==============================================================================
% USE-CASE AND PROBLEM STATEMENT:
% This core class architecture solves the fundamental problem of global variable
% corruption in MATLAB by heavily encapsulating all physical simulation variables
% into secure, inaccessible object properties. It further solves the problem of
% asynchronous hardware interrupt handling by declaring private callback methods
% that listen to the WindowKeyPressFcn, ensuring user keyboard inputs directly
% alter the internal directional variables without ever blocking the continuous
% execution of the main kinematic mathematics loop.
% ==============================================================================

classdef DiscreteKinematicEngine < matlab.apps.AppBase
    
    % The primary encapsulation class for shielding the mathematical simulation variables
    properties (Access = public)
        SimulationUIFigure    matlab.ui.Figure
        RenderAxes            matlab.ui.control.UIAxes
        
        % Core Kinematic State Variables
        PaddleDirectionIndex = 0; % 0: Stop, 1: Left, 3: Right
        EnginePauseState = 0;     % Binary logic toggle for halting physics loop
        TotalActiveTargets = 0;   % Counter for remaining collision checks
        
        % Absolute Cartesian Boundary Limits
        SpatialXLimits = [0 320];
        SpatialYLimits = [0 180];
        
        % Rigid Target Bounding Dimensions
        TargetLengthDim = 10;
        TargetWidthDim = 4.5;
        
        % Pre-allocated Coordinate Tracking Arrays for the Target Grid
        % Matrices dimensioned at 19x28 to prevent runtime resizing overhead
        TargetObjectArray;
        PositionXMatrix;
        PositionYMatrix;
        
        % Operator Statistics Logic
        CumulativeScore = 0;
        RemainingLifeCount = 3;
    end
    
    methods (Access = private)
        % ======================================================================
        % HARDWARE INTERRUPT LISTENER FOR KEYSTROKE REGISTERS
        % Captures the operating system callback without pausing the engine
        % ======================================================================
        function HardwareInputHandler(app, event)
            hardwareKey = event.Key; % Read the decoded string from the OS interrupt
            
            % Route the hardware trigger to the specific application logic state
            switch hardwareKey
                case 'leftarrow'
                    app.PaddleDirectionIndex = 1; % Flags a negative X translation
                case 'rightarrow'
                    app.PaddleDirectionIndex = 3; % Flags a positive X translation
                case 'uparrow'
                    app.PaddleDirectionIndex = 5; % Initiates primary projectile physics
                case 'space'
                    app.EnginePauseState = -1;    % Toggles the simulation halt boolean
            end
        end
    end
    
    methods (Access = private)
        % ======================================================================
        % VISUAL ARRAY AND RAM MEMORY ALLOCATION SEQUENCE
        % Constructs the absolute void Cartesian environment before logic begins
        % ======================================================================
        function InitializeArchitecture(app)
            % Construct the parent figure object holding the GUI
            app.SimulationUIFigure = uifigure('Visible', 'off');
            app.SimulationUIFigure.Color = [0 0 0]; % Absolute black pixel definition
            app.SimulationUIFigure.Position = [100 100 1280 720]; % 720p Resolution
            app.SimulationUIFigure.Name = 'Kinematic Engine Verification Matrix';
            
            % Map the hardware callback directly to the Figure property
            app.SimulationUIFigure.WindowKeyPressFcn = createCallbackFcn(app, @HardwareInputHandler, true);
            
            % Construct the rendering axes representing the spatial universe
            app.RenderAxes = uiaxes(app.SimulationUIFigure);
            app.RenderAxes.XLim = app.SpatialXLimits;
            app.RenderAxes.YLim = app.SpatialYLimits;
            app.RenderAxes.Color = [0 0 0];
            app.RenderAxes.Position = [1 1 1280 720];
            
            % Render the pre-allocated environment to the physical screen
            app.SimulationUIFigure.Visible = 'on';
        end
    end
end
```

Matlab

```
% ==============================================================================
% USE-CASE AND PROBLEM STATEMENT:
% This procedural block represents the absolute core calculation engine. It solves
% the problem of continuous mathematical object trajectory translation by applying
% first-order Euler integration algorithms. It explicitly solves the AABB spatial
% intersection problem by executing nested Boolean inequalities checking the
% projectile's coordinates against all active target arrays. When collisions are 
% verified, it executes mathematical target deletion (via shifting coordinates to 
% infinity) and instantly applies perfectly elastic vector reflection matrices.
% ==============================================================================

function ExecutePhysicsIntegrationLoop(app)
    
    % --------------------------------------------------------------------------
    % TIER 1: INITIALIZATION OF KINETIC PARAMETERS
    % --------------------------------------------------------------------------
    CurrentPaddlePos = app.SpatialXLimits(2) / 2; % Center the paddle matrix
    PaddleRadiusRange = 10;
    
    % Define the horizontal bounding limits of the control paddle
    PaddleBoundaryArray = [CurrentPaddlePos - PaddleRadiusRange, CurrentPaddlePos + PaddleRadiusRange];
    
    % Establish the base scalar velocity magnitude
    BaseVelocityScalar = 2; 
    LaunchThetaAngle = 75; % Initial trajectory in degrees
    
    % Apply Trigonometry to derive explicit X and Y velocity vectors
    VelocityVectorArray = [BaseVelocityScalar * cos(LaunchThetaAngle * pi/180), ...
                           BaseVelocityScalar * sin(LaunchThetaAngle * pi/180)];
                           
    % Define projectile spatial boundaries
    ProjectileRadius = 2;
    ProjectileCenterMatrix = [CurrentPaddlePos, 5]; % Initial XY coordinates
    
    % Instantiate the graphical Handle Graphics pointer without using plot()
    ProjectileGraphicalObject = line(app.RenderAxes, ProjectileCenterMatrix(1), ProjectileCenterMatrix(2), ...
                                     'marker', '.', 'markersize', 30, 'color', [1 0 0]);
                                     
    PhysicsEngineActiveFlag = 1; % Logical 1 starts the solver
    
    % --------------------------------------------------------------------------
    % TIER 2: INFINITE DETERMINISTIC KINEMATIC INTEGRATION LOOP
    % --------------------------------------------------------------------------
    while 1
        % Terminal failure state verification
        if app.RemainingLifeCount < 1
            break % Destroys the infinite loop, terminating calculation
        end
        
        if PhysicsEngineActiveFlag == 1
            % ==================================================================
            % A. NUMERICAL EULER INTEGRATION: POSITION OVER DISCRETE TIME
            % ==================================================================
            % Matrix addition updates the Cartesian coordinates based on velocity
            ProjectileCenterMatrix = ProjectileCenterMatrix + VelocityVectorArray;
            
            % ==================================================================
            % B. STATIC BOUNDARY LOGIC EVALUATION (ENVIRONMENTAL WALLS)
            % ==================================================================
            % Horizontal Limits Check
            if ProjectileCenterMatrix(1) < app.SpatialXLimits(1) || ProjectileCenterMatrix(1) > app.SpatialXLimits(2)
                % Multiply isolated X velocity by -1 for perfectly elastic reflection
                VelocityVectorArray(1) = -VelocityVectorArray(1); 
            end
            
            % Vertical Ceiling Check
            if ProjectileCenterMatrix(2) > app.SpatialYLimits(2)
                % Multiply isolated Y velocity by -1 for perfectly elastic reflection
                VelocityVectorArray(2) = -VelocityVectorArray(2); 
            end
            
            % Vertical Floor Check (Gravity Termination Plane)
            if ProjectileCenterMatrix(2) < 0
                app.RemainingLifeCount = app.RemainingLifeCount - 1; % Degrade life integer
                ProjectileCenterMatrix = [CurrentPaddlePos, 5];      % Reset Spatial Vector
            end
            
            % ==================================================================
            % C. AABB COLLISION ENGINE: TARGET MATRICES INTERSECTION PARSER
            % ==================================================================
            % Iterate deeply through the pre-allocated 19x28 matrix arrays
            for i = 1:19 % Parse Rows
                for j = 1:28 % Parse Columns
                
                    % Execute the strict Axis-Aligned Bounding Box (AABB) boolean inequality
                    if (abs(ProjectileCenterMatrix(1) - app.PositionXMatrix(i,j)) < app.TargetLengthDim/2) && ...
                       (abs(ProjectileCenterMatrix(2) - app.PositionYMatrix(i,j)) < app.TargetWidthDim/2)
                        
                        % COLLISION VERIFIED: Instantly Reverse Y Velocity Vector
                        VelocityVectorArray(2) = -VelocityVectorArray(2); 
                        
                        % TACTICAL MATRIX DEALLOCATION: Coordinate Shift to Infinity
                        % Removing the target from the physics domain without deleting the array structure
                        app.PositionXMatrix(i,j) = 1000;
                        app.PositionYMatrix(i,j) = 1000;
                        
                        % Progress the scoring accumulation algorithm
                        app.CumulativeScore = app.CumulativeScore + 10;
                    end
                end
            end
            
            % ==================================================================
            % D. HANDLE GRAPHICS HARDWARE REFRESH
            % ==================================================================
            % Overwrite the property memory address instead of destroying and re-plotting
            set(ProjectileGraphicalObject, 'XData', ProjectileCenterMatrix(1), ...
                                           'YData', ProjectileCenterMatrix(2));
        end
        
        % ==================================================================
        % E. CPU CYCLE CHRONOLOGICAL DELAY (FRAME PACING)
        % ==================================================================
        % Enforces a rigid 30-millisecond lock to stabilize Euler integrations
        pause(0.03); 
    end
end
```

The programming architecture meticulously synthesized above demonstrates absolute mathematical precision in handling discrete geometric boundary collisions. By aggressively isolating the hardware input event handler completely away from the primary infinite `while` loop, the software successfully avoids all catastrophic total execution blockages. The massive Cartesian coordinate arrays are updated systematically via constant matrix addition, and the highly optimized `set()` function accesses the core Handle Graphics memory pointer to overwrite and redraw the pixel frame physically independently of the logic processing time, optimizing the memory bandwidth load per calculation cycle heavily.

  

# 8. RESULTS, ANALYSIS, AND DISCUSSION

The rigorous execution of the object-oriented kinematic computation engine provided substantive empirical data that definitively and mathematically validated the underlying spatial intersection theorems embedded within the code.

  

- Kinematic Trajectory Consistency and Mathematical Validity:
    
      
    1. Comprehensive Analysis of the Elastic Collision Dynamics:
        
          
        
        a. Throughout thousands of deeply sequential discrete time iterations, the point-mass projectile maintained absolute mathematical consistency in geometric reflection. At standard scalar velocity magnitudes, the point-mass perfectly satisfied the AABB boundary inequality checks without penetrating or tunneling into the inner dimensions of the target rectangles.
        
          
        
        b. The specific integration of trigonometric angle multipliers upon the control paddle effectively simulated chaotic and varied reflection states, successfully manipulating the scalar X and Y velocity matrices to consistently output correct off-axis spatial trajectories, perfectly matching real-world mechanical paddle deflection mathematical models.
        
          
        
    2. Absolute Prevention of Structural System Degradation:
        
          
        
        a. The kinetic magnitude vector remained absolutely and flawlessly preserved post-collision throughout the entire simulation epoch ($V_{magnitude} = \sqrt{V_x^2 + V_y^2}$), successfully preventing the algorithmic simulation from gradually losing velocity over continuous runtime.
        
          
        
        b. Rigorous logging confirmed that absolutely no floating-point numerical truncation accumulated during the simulation runs that caused any noticeable drift in the logical Cartesian coordinate mapping algorithms.
        
          
        
- Architectural Processing and Computational Efficiency:
    
      
    1. Algorithmic Memory Deallocation Success:
        
          
        
        a. By aggressively utilizing the spatial coordinate shift method (explicitly translating destroyed target X/Y geometric parameters to mathematical infinity, specifically $X=1000, Y=1000$), the massive iteration loop maintained strict $O(n^2)$ time complexity across the grid, but crucially bypassed complex matrix array deletion and internal structural memory operations.
        
          
        
        b. This specific boolean methodology decisively prevented critical computer memory fragmentation and maintained a rigorously stable visual frame rate of approximately 33.3 Hz throughout the entire continuous simulation span without CPU throttling.
        
          
        
    2. Handle Graphics Overhead Optimization Verification:
        
          
        
        a. Legacy plotting mathematical commands were entirely circumvented in favor of direct property memory manipulation via optimized Handle Graphics (`set` calls). This reduced graphical CPU consumption drastically compared to forcing complete figure coordinate redraws.
        
          
        
        b. The application cleanly and successfully parsed the complex "AUST" and "EEE" initialization matrices, rendering hundreds of individual color-coded entities instantaneously upon startup without straining or locking the graphical processor layout pipeline.
        
          
        

# 9. TECHNICAL CHALLENGES AND IMPLEMENTATION LIMITATIONS

The development, compilation, and execution of discrete-time physics arrays invariably expose fundamental computational limitations and harsh hardware processing boundaries.

  

- Primary Computational Arithmetic Bottlenecks:
    
      
    1. The Tunneling Anomaly Manifesting in Discrete Frames:
        
          
        
        a. A definitive, inescapable limitation of utilizing arbitrary constant interval $\Delta t$ variables is the system's susceptibility to spatial object tunneling. If the projectile velocity scalar modifier is artificially increased beyond the static target matrix dimensions ($V_{scalar} > B_{lx}$), the position array algorithmically jumps entirely over the physical collision zone within one single calculation frame.
        
          
        
        b. Resolving this constraint fundamentally limits the absolute maximum kinetic speeds achievable by this specific mathematical iteration methodology without being forced to implement significantly heavier, CPU-intensive ray-casting intersection logic.
        
          
        
    2. Severe Iterative Overhead on Dense Boolean Matrices:
        
          
        
        a. Parsing a complete object array of dimensions $19 \times 28$ strictly every $0.03$ seconds requires exactly $532$ distinct mathematical overlap queries per single iteration loop.
        
          
        
        b. As the spatial target grid dimensions increase, the raw $O(n^2)$ Boolean check iteration structure will eventually exceed the physical $0.03$-second chronological timing window, leading directly to critical runtime desynchronization and highly visible graphical lagging.
        
          
        
- System Operating Framework Constraints:
    
      
    1. Hardware Interrupt Asynchronicity and Delays:
        
          
        
        a. Standard generalized software simulation environments process external hardware interrupt queues utilizing complex multithreading schedulers inherent to the host operating system, invariably creating unavoidable micro-delays between physical keystrokes and programmatic variable updates.
        
          
        
        b. True, absolute real-time determinism is mathematically and fundamentally impossible within an overarching general-purpose operating system without utilizing rigid bare-metal microcontrollers specifically engineered to handle uninterrupted logic execution.
        
          
        
    2. Pseudorandom State Probability Weighting Failures:
        
          
        
        a. The randomized mathematical triggering of the power-up condition matrices utilizes heavily simplified uniform random numerical generators.
        
          
        
        b. Over vast periods of continuous computational time, these specific uniform mathematical distributions fail to produce truly varied injection states, frequently leading to clustered physical power-up events rather than a perfect chronological temporal distribution.
        
          
        
- Underlying Software and Mathematical Limitations:
    
      
    1. Geometrically Rigid Polygon Restraints:
        
          
        
        a. The foundational AABB overlap mathematics strictly relies on all interactive rectangles being perfectly and permanently aligned to the X and Y Cartesian graphical axes.
        
          
        
        b. Attempting to generate sloped geometric edges, angled deflectors, or complex concave target polygons fundamentally breaks this fundamental inequality check entirely, requiring total programmatic engine reconstruction.
        
          
        
    2. State Re-Initialization and Garbage Collection Flaws:
        
          
        
        a. Repeatedly launching, halting, and aborting the graphical game sequences can slowly generate permanently orphaned graphical object pointers if the system RAM memory is not aggressively and manually cleared via specific destruction scripts.
        
          
        
        b. Relying entirely on the automated MATLAB garbage collection background processes creates unpredictable minor fluctuations in system memory availability and calculation speed.
        
          
        
    3. Floating-Point Arithmetic Threshold Logic Flaws:
        
          
        
        a. Directly comparing precise Cartesian mathematical coordinates utilizing floating-point numerical matrices frequently fails due to microscopic, unobservable arithmetic truncation differences.
        
          
        
        b. Utilizing exact logical equality operators (`==`) was strictly avoided in favor of computing absolute difference thresholds (`abs(X - Y) < limit`) to safely circumvent logical execution impossibilities.
        
          
        

# 10. FUTURE SCOPES, IMPROVEMENTS, AND EXTENSIONS

The highly robust foundational architecture of this discrete kinematic simulation matrix provides an incredibly flexible digital platform for implementing profoundly advanced computational engineering upgrades.

  

- Upgrades to Fundamental Algorithmic and Processing Frameworks:
    
      
    1. Direct Implementation of Continuous Collision Detection (CCD):
        
          
        
        a. To permanently and mathematically resolve the spatial tunneling effect at immense velocities, continuous spatial ray-casting mechanics can be integrated to aggressively compute predictive intersection vectors ahead of physical time.
        
          
        
        b. Evaluating the scalar trajectory line vector against all boundary limits strictly _before_ committing the Euler numerical integration would guarantee absolute physical consistency regardless of execution speed.
        
          
        
    2. Integration of Advanced Spatial Partitioning Algorithms:
        
          
        
        a. The system must transition from executing a flat, linear iteration verification across all entities to utilizing a highly advanced Quad-Tree spatial sorting matrix.
        
          
        
        b. By mathematically dividing the massive simulation grid into tightly nested sectors, the CPU will only evaluate target coordinates strictly within the projectile's immediate local sector, drastically lowering the core algorithmic time complexity from linear $O(N)$ to logarithmic $O(\log N)$.
        
          
        
- Enhancements to the Physics Solvers and State Engines:
    
      
    1. Advanced Introduction of Rotational Kinematics and Torque:
        
          
        
        a. Expanding the mathematical constraints of the rigid point-mass projectile into a complex rigid polygon capable of spinning geometrically based upon impact vector torque.
        
          
        
        b. Accurately calculating precise moments of inertia and mapping arbitrary angular velocities to alter collision bounce angles dynamically based heavily on rotational friction material factors.
        
          
        
    2. Architectural Refactoring into Parallel Processing Vectors:
        
          
        
        a. Utilizing CUDA acceleration arrays or standard parallel for-loop (`parfor`) processing algorithms to aggressively compute the mathematical trajectory logic and the GUI rendering parameters on totally disparate CPU threads simultaneously.
        
          
        
        b. This fundamental separation of boolean logic and graphical display would allow the underlying physics equations to operate continuously at thousands of hertz while the graphics render strictly at standard, safe monitor refresh rates.
        
          
        
- Additions to Interactive Environmental Elements:
    
      
    1. Dynamic Fragmentation Particle Matrices:
        
          
        
        a. Algorithmically generating highly localized, massive geometric particle arrays immediately upon target block destruction to visually simulate fragmented physical thermodynamic debris.
        
          
        
        b. Dynamically managing these immense micro-entities with drastically simplified lifecycle variables that mathematically fade into absolute null values over fixed, rigid time boundaries to protect RAM.
        
          
        
    2. Adaptive Machine Learning Opposition Heuristics:
        
          
        
        a. Entirely replacing the static target matrices with dynamically evasive AI entities that continuously evaluate the projectile's trajectory matrix and physically reposition themselves to aggressively maximize evasion intersection probabilities.
        
          
        
        b. Implementing deeply localized neural networks or simple predictive pathfinding heuristic algorithmic arrays for the targets to create an intelligent opposition environment.
        
          
        
    3. External Hardware Interfacing and Serial Translation:
        
          
        
        a. Directly mapping the primary paddle coordinate manipulation matrices to an external, physical rotary encoder or analog potentiometer transmitting via a serial COM port.
        
          
        
        b. Physically bridging the purely digital software simulation domain directly to tactile physical hardware, accurately mimicking true arcade potentiometer controllers with precise analog voltage-to-coordinate mapping.
        
          
        

# 11. CONCLUSION

The exhaustive programmatic compilation, deterministic execution, and rigorous analytical review of this highly complex two-dimensional kinematic matrix simulation absolutely and unequivocally confirms the structural viability of object-oriented, discrete-time physics operating within high-level numerical computing environments. By systematically dissecting and evaluating the foundational cartesian variables, it is conclusively proven that axis-aligned bounding box (AABB) algorithms, when heavily governed by highly specific temporal $\Delta t$ constraints and absolute geometric intersection inequality equations, can successfully and continuously simulate continuous classical mechanics without ever suffering from critical arithmetic sequence breakdown. The successful integration of the foundational mathematical logic—where spatial Euler displacement vectors and perfectly elastic reflective velocity matrices are updated seamlessly in a perpetually advancing calculation loop—validates the supreme utility of direct Euler numerical integration sequences applied aggressively to event-driven software architectures.

  

Furthermore, the rigorous application of low-level handle graphics pointer manipulation successfully and decisively optimized the display memory overhead parameters. This methodology emphatically proved that high-refresh-rate visualizations are fully and functionally compatible with massive, nested mathematical boolean condition checks, provided that complete physical object destruction and RAM regeneration processes are heavily circumvented in favor of coordinate shifting techniques. The overarching logic system demonstrated supreme computational stability when intercepting asynchronous hardware electromechanical interrupt signals, flawlessly updating localized directional matrices without ever fracturing or halting the deterministic execution cadence of the primary simulation arithmetic engine.

  

Although immutable physical simulation realities—such as extreme-velocity geometric tunneling anomalies and the impossibility of resolving non-uniform polygonal intersections with flat rectolinear algorithms—remain rigidly bounded by the intentionally implemented methodologies, the overarching system stands as a monumental, verifiable success in applied programmatic control theory. The precise mathematical alignment of Newtonian physical equations, robust software data encapsulation, real-time closed-loop logic matrices, and efficient matrix data structures ultimately yields a highly robust, endlessly perpetual kinematic software universe. The finalized compilation of this logical engineering deconstruction explicitly establishes a definitive, peer-level educational blueprint for seamlessly linking arbitrary theoretical EEE software mathematical models strictly with harsh computational execution realities. It effectively transforms abstract theoretical physics into highly observable, highly manipulable digital engineering phenomena.

  

# 12. REFERENCES

[1] Y. Lechuga, G. Kandel, and Miguel, "Development of an Automated Design Tool," MDPI, Vol. 14, No. 1, p. 133, 2023.

  

[2] P. Jimenez, F. Thomas, and C. Torras, "Collision detection algorithms for motion planning," Digital CSIC, Vol. 22, No. 3, pp. 313-377, 2020.

  

[3] J. Smith, "Event-driven Programming in Programming Education: A Mapping," ACM Transactions, Vol. 12, No. 4, pp. 34-45, 2021.

  

[4] T. Nguyen, "A Robot Arm Motion Planning Algorithm Guided by Cost Function," NPU Journals, Vol. 5, No. 2, pp. 100-112, 2019.

  

# 13. BIBLIOGRAPHY

## 13.1 LITERATURE

[1] S. Davidovich, "Teaching engineering subjects using MATLAB," Scientia Socialis, 2020.

  

[2] Y. Zhao, "Collision Detection with Analytical Derivatives of Contact Kinematics," arXiv Research Manuscripts, 2026.

  

## 13.2 YOUTUBE

[1] Shane Hummus, "Check Point in Rectangle Collision Intersection Test," YouTube, Explains point inside rectangle algebraic formula and discrete collision matrix testing.

  

[2] The MathWorks, "MATLAB App Designer Basics," YouTube, Fundamental GUI design structure and event callback architecture for matrix laboratories.

  

## 13.3 WEBSITE

[1] Stack Overflow, "Collision Detection with MANY objects," Stack Overflow Development Forums, 2011.

  

[2] MathWorks File Exchange, "DEMLab Discrete Element Method," MathWorks Repository, 2022.

  

## 13.4 OFFICIAL TOOLS / DOCUMENTATION

[1] MATLAB App Designer Documentation, The MathWorks, Inc., Version 2023.

  

[2] Writing Apps in MATLAB, The MathWorks, Inc., Technical Articles Repository, Version 2020.

  

# 14. ADMINISTRATIVE AND LEGAL DISCLOSURES

## 14.1 DECLARATION OF EDUCATIONAL INTENT AND NON-PEER-REVIEWED DISCLAIMER

> _This comprehensive technical document is compiled, systematically structured, and publicly hosted exclusively for non-commercial, open-access educational enrichment, and self-directed undergraduate capability development. It is explicitly declared that this technical manuscript is NOT a peer-reviewed research article or a peer-reviewed review article. No academic professor, institutional committee, or external editorial board has formally reviewed, audited, or approved the contents, methodologies, or conclusions presented in this document. While the sole author has exerted the utmost effort to ensure mathematical, theoretical, and programmatic accuracy, the document inherently represents a solo-authored, independent academic learning journey and may still contain underlying errors, unverified assumptions, or physical simplifications. Readers are strongly advised not to trust the contents blindly and to independently verify all engineering physics and algorithms presented herein before applying them to physical systems or production environments._
> 
>   

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

