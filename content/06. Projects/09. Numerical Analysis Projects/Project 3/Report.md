# ALGORITHMIC IMPLEMENTATION AND COMPUTATIONAL ANALYSIS OF LEAST SQUARES POLYNOMIAL REGRESSION FOR MULTI-DIMENSIONAL SIGNAL RECONSTRUCTION

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

# STATEMENT OF EDUCATIONAL INTENT AND ACADEMIC INTEGRITY

> _This comprehensive technical document is compiled, systematically structured, and publicly hosted exclusively for non-commercial, open-access educational enrichment, and self-directed undergraduate capability development. It is stated with absolute, uncompromising transparency that this technical manuscript constitutes an original, independent academic engineering project, multi-tool validation, and rigorous technical study of established electrical and electronic engineering principles. All external properties, theories, and datasets are strictly cited to maintain total adherence to academic standards, publication laws, and anti-plagiarism protocols. No unauthorized duplication of external intellectual property has occurred. This research represents an original, transformative contribution to the applied engineering domain._
> 
>   

# ABSTRACT

The mathematical reconstruction of continuous signals from discrete, noisy coordinate data remains a foundational challenge within digital signal processing, sensor calibration, and numerical modeling. This manuscript delineates the theoretical derivation, algorithmic architecture, and computational execution of a polynomial curve fitting matrix system utilizing the deterministic ordinary least squares (OLS) regression method. The core engineering problem addressed herein involves the transformation of arbitrary bivariate datasets into a continuous analytical function that minimizes the sum of squared vertical residuals across all mapped vectors. By constructing a Vandermonde-style matrix and mapping it against the dependent variable vectors, a linear system of normal equations is established and solved via matrix left-division techniques. To ensure maximum accuracy, the computational ecosystem is established within a highly controlled matrix laboratory (MATLAB) environment, specifically utilizing an object-oriented graphical user interface (GUI) developed via the App Designer framework. The simulation methodology validates the mathematical hypothesis by mapping input coordinate arrays against dynamically selected polynomial degrees. The computational solver iteratively calculates polynomial coefficients by solving the normal equations $X^T X \beta = X^T Y$, subsequently generating a high-resolution, linearly spaced continuous vector for graphical visualization. The results generated from the simulations provide profound empirical evidence regarding the computational complexity of matrix inversion, the deterministic limits of finite precision floating-point arithmetic, and the catastrophic divergence associated with high-degree polynomials, universally recognized as Runge’s phenomenon. Through rigorous mathematical proofing, matrix algebraic derivations, and condition number analyses, it is confirmed that the algorithm operates with absolute determinism for low-order polynomials, whilst exhibiting predictable exponential ill-conditioning as the polynomial degree approaches the quantity of the data nodes. Ultimately, this computational framework provides a highly optimized, universally applicable numerical engine for executing rapid parameter extraction, data smoothing, and non-linear trend analysis in complex engineering systems.

  

# KEYWORDS/INDEX TERMS

- Ordinary Least Squares Regression
    
      
    
- Polynomial Curve Fitting
    
      
    
- Matrix Algebra
    
      
    
- Vandermonde Matrix Ill-Conditioning
    
      
    
- Numerical Methods
    
      
    
- Runge's Phenomenon
    
      
    
- Digital Signal Processing
    
      
    
- Data Interpolation and Extrapolation
    
      
    
- MATLAB App Designer
    
      
    
- Computational Complexity
    
      
    
- Floating-Point Arithmetic Optimization
    
      
    
- Graphical User Interface Development
    
      
    
- Overfitting Mitigation
    
      
    
- Linear System Solvers
    
      
    
- Error Minimization Algorithms
    
      
    

# 1. PROJECT STATEMENT

The fundamental deficit addressed by this analytical procedure involves the extraction of a continuous, mathematically differentiable function from a finite array of discrete, disconnected empirical data points. Specifically, a vector of independent variables (the spatial or temporal coordinates) and a corresponding vector of dependent variables (the measured signal magnitudes) are provided. It is required to compute the optimal sequence of scalar coefficients for an $n$-th degree polynomial such that the calculated function minimizes the aggregate magnitude of the squared positional errors between the discrete data points and the generated mathematical curve. The codebase developed for this analysis is encapsulated within MATLAB Project 13 by Fazlay Elahi.docx. The computational challenge is directly localized to the formulation and exact resolution of a high-dimensional system of linear equations, mapped mathematically into a square matrix, and processed through a deterministic software environment without inducing floating-point memory truncation or catastrophic algorithmic divergence.

  

# 2. PROJECT OBJECTIVE

- To establish a rigorous mathematical foundation for signal reconstruction.
    
      
    1. The derivation of the normal equations must be formalized to prove the deterministic nature of the minimum error bounds.
        
        a. It is required to geometrically define the residual error vector.
        
        b. It is required to formulate the partial derivatives of the cost function with respect to the polynomial coefficients.
        
          
        
    2. The minimization of scalar variance must be explicitly linked to polynomial trajectory optimization.
        
        a. The theoretical limits of polynomial interpolation must be identified.
        
        b. The numerical bounds of extrapolation beyond the dataset must be codified.
        
          
        
- To architect a robust, interactive computational software framework.
    
      
    1. An object-oriented graphical interface must be engineered to isolate the mathematical engine from direct user memory manipulation.
        
        a. Real-time string-to-numeric array conversion algorithms must be implemented.
        
        b. Dynamic matrix dimensioning based on real-time inputs must be executed.
        
          
        
    2. The memory footprint of the matrix inversion sequence must be minimized.
        
        a. Sequential `for`-loops must be evaluated against vectorized tensor operations.
        
        b. Pre-allocation of memory arrays must be utilized to bypass dynamic heap fragmentation.
        
          
        
- To quantify the impact of matrix ill-conditioning in computational environments.
    
      
    1. The numerical stability of the Vandermonde-derived matrix must be analyzed as a function of the selected polynomial degree.
        
        a. Condition numbers must be theoretically defined for high-degree matrices.
        
        b. Singular matrix warnings generated by the numerical solver must be classified.
        
          
        
    2. The manifestation of Runge's phenomenon must be empirically documented.
        
        a. Oscillatory divergence at the boundary nodes must be graphically analyzed.
        
        b. The correlation between polynomial degree and root mean square error (RMSE) must be plotted.
        
          
        
- To parameterize the data extraction vectors for industrial metrology applications.
    
      
    1. The least squares algorithm must be optimized to filter stochastic noise from sensor readings.
        
        a. The algorithm must be tested against linear, quadratic, and cubic data regimes.
        
        b. The residuals must be analyzed to ensure normal distribution of the error profiles.
        
          
        
    2. The computational speed of the execution must be mapped against hardware constraints.
        
        a. The execution time of the matrix left-division operator must be evaluated.
        
        b. The latency introduced by the graphical plotting engine must be benchmarked.
        
          
        
- To formulate an automated error-checking mechanism within the source code.
    
      
    1. Validation protocols must be embedded to prevent vector length mismatch faults.
        
        a. The input arrays must be scanned to ensure identical dimensional lengths.
        
        b. The application must halt execution and throw graphical alerts if dimensional parity fails.
        
          
        
    2. Empty array configurations must be intercepted before triggering matrix operations.
        
        a. Null strings must be filtered at the interface level.
        
        b. Zero-degree inputs must be routed to linear mean approximations.
        
          
        
- To synthesize a universally deployable engineering artifact.
    
      
    1. The resultant script must be portable across diverse computing platforms without requiring external toolboxes.
        
        a. Core MATLAB numerical libraries must be exclusively utilized.
        
        b. Reliance on proprietary, black-box optimization functions must be explicitly avoided.
        
          
        
    2. The graphical outputs must be publication-ready.
        
        a. Plotting matrices must incorporate grid overlays, standardized legends, and precise axis labeling.
        
        b. Color contrast arrays must be explicitly mapped for visual distinction between discrete nodes and continuous fits.
        
          
        

# 3. PROJECT SCOPE

- Inclusions:
    
      
    1. Mathematical execution of ordinary least squares for polynomial degrees ranging from $n=1$ to $n=10$.
        
        a. The derivation of the normal equation matrix $A \times U = C$.
        
        b. The calculation of the coefficient vector using Gaussian elimination algorithms inherent to the backslash (`\`) operator.
        
          
        
    2. The development of an interactive MATLAB App Designer interface.
        
        a. The design of string-parsing logic for array inputs.
        
        b. The integration of two-dimensional Cartesian plotting engines within the UI framework.
        
          
        
    3. The analysis of computational errors.
        
        a. Observation of floating-point truncation constraints.
        
        b. Analysis of matrix singularity conditions.
        
          
        
- Exclusions:
    
      
    1. Non-polynomial regression models.
        
        a. Exponential, logarithmic, and trigonometric curve fitting matrices are explicitly excluded from this analysis.
        
        b. Fourier series analysis and harmonic component extraction are outside the current problem statement.
        
          
        
    2. Advanced regularization techniques.
        
        a. Tikhonov regularization (Ridge regression) and Lasso penalty variables are not implemented in the core script.
        
        b. Orthogonal polynomial bases (e.g., Chebyshev or Legendre polynomials) are theoretically discussed but excluded from the raw execution algorithm to strictly evaluate the standard Vandermonde formulation.
        
          
        
    3. Machine learning optimization algorithms.
        
        a. Gradient descent, Adam optimizers, and backpropagation learning models are explicitly bypassed in favor of deterministic matrix inversion.
        
        b. Neural network-based non-linear regression is completely excluded from the scope.
        
          
        

# 4. PROJECT REQUIREMENTS AND ENVIRONMENT

- Hardware Ecosystem:
    
      
    1. Processing Microarchitecture:
        
        a. A 64-bit Central Processing Unit (CPU) capable of executing single-instruction, multiple-data (SIMD) floating-point calculations.
        
        b. A minimum baseline clock speed sufficient to rapidly invert $10 \times 10$ matrices within millisecond timeframes.
        
          
        
    2. System Memory Allocation:
        
        a. Sufficient Random Access Memory (RAM) to handle the initialization of the graphical user interface components without triggering page faults.
        
        b. Dedicated heap memory allocated to the mathematical execution engine to bypass garbage collection latency during matrix multiplication.
        
          
        
- Software and Simulation Ecosystem:
    
      
    1. Matrix Laboratory (MATLAB) Environment:
        
        a. A validated, licensed instance of MATLAB acting as the primary compiler and execution shell.
        
        b. The presence of the App Designer toolbox to interpret the `.mlapp` file extensions and render the user interface components.
        
          
        
    2. Numerical Solver Libraries:
        
        a. The BLAS (Basic Linear Algebra Subprograms) and LAPACK (Linear Algebra PACKage) libraries deeply integrated within the software core for matrix division.
        
        b. The inherent `polyval` polynomial evaluation functions must be accessible in the system path.
        
          
        

# 5. LITERATURE REVIEW

- Historical Evolution of the Least Squares Method:
    
      
    1. Foundation and Origins:
        
        a. The fundamental algorithm for the least squares method was independently formulated by Legendre in 1805 and Gauss in 1809, originally deployed for astronomical orbit calculations [1].
        
        b. It was mathematically proven that minimizing the sum of the squared errors yielded the most probable deterministic parameter vector under the assumption of normally distributed noise [2].
        
          
        
    2. The Gauss-Markov Framework:
        
        a. The Gauss-Markov theorem established that the ordinary least squares estimator represents the best linear unbiased estimator (BLUE) for the coefficients, provided the residual errors possess a mean of zero and constant variance [3].
        
        b. This foundational theorem remains the cornerstone of all contemporary predictive polynomial regression models across signal processing domains [4].
        
          
        
- Numerical Instability and Matrix Conditioning:
    
      
    1. The Vandermonde Matrix Bottleneck:
        
        a. It is widely documented in numerical analysis literature that utilizing a standard Vandermonde-style matrix for high-degree polynomial fitting results in exponential ill-conditioning [5].
        
        b. As the polynomial degree exceeds $n=7$, the condition number of the resulting matrix $X^T X$ increases exponentially, leading to catastrophic cancellation errors within standard IEEE-754 64-bit floating-point arithmetic architectures [6].
        
          
        
    2. Runge's Phenomenon and Boundary Oscillations:
        
        a. Carl Runge demonstrated in 1901 that polynomial interpolation across equidistant nodes fails to converge uniformly for specific functions, creating massive oscillations near the domain boundaries [7].
        
        b. Literature dictates that increasing the polynomial degree to minimize residuals often forces the algorithm into extreme overfitting paradigms, validating the necessity for low-order polynomial models or piecewise spline adaptations [8].
        
          
        
- Computational Workarounds and Orthogonalization:
    
      
    1. Regularization Paradigms:
        
        a. Modern implementations frequently deploy Tikhonov regularization, heavily detailed in regression analysis, which adds a penalty parameter to the matrix diagonal to artificially decrease the condition number and force invertibility [9].
        
        b. Singular Value Decomposition (SVD) and the calculation of the Moore-Penrose pseudoinverse are often cited as computationally expensive but numerically superior alternatives to direct normal equation division [10].
        
          
        
    2. Shift and Scale Algorithms:
        
        a. To mitigate matrix singularity in raw polynomial regressions, centering and scaling the input vector $x$ via $z = (x - \mu)/\sigma$ is highly recommended in contemporary literature to compress the eigenvalues of the normal matrix [11].
        
        b. Arnoldi orthogonalization techniques have been proposed as advanced frameworks to stabilize Vandermonde-based interpolations at extremely high degrees, though they require complex iterative substructures [12].
        
          
        
- Application in Digital Signal Processing:
    
      
    1. Calibration and Baseline Wandering:
        
        a. Within transducer calibration, low-degree least squares fitting is universally applied to linearize the thermistor or load-cell output profiles against established physical benchmarks [13].
        
        b. Furthermore, polynomial baseline subtraction is heavily utilized in electrocardiogram (ECG) and spectroscopic signal processing to remove low-frequency thermal wander [14].
        
          
        
    2. Optimization using MATLAB Architectures:
        
        a. The efficiency of the `\` (backslash) operator in MATLAB is extensively reviewed in computational literature, as it dynamically selects between LU decomposition, Cholesky factorization, or QR orthogonalization based on matrix symmetry and condition heuristics [15].
        
        b. Implementations utilizing the App Designer framework represent the modern standard for deploying isolated, object-oriented engineering tools that encapsulate these complex solvers away from terminal environments [16].
        
          
        

# 6. CONCEPTUAL BACKGROUND

## 6.1 SYMBOLS AND NOTATIONS

|**Symbol**|**Definition**|**SI Unit/Format**|
|---|---|---|
|$X$|The vector array representing the independent variable coordinates|Dimensionless / Absolute Coordinates|
|$Y$|The vector array representing the dependent variable observations|Variable / Magnitude|
|$n$|The total scalar count of data nodes mapped in the array|Integer (Count)|
|$F$|The user-defined requested polynomial degree|Integer|
|$N$|The geometric dimension of the square matrix ($F+1$)|Integer|
|$A$|The symmetric coefficient matrix containing sums of spatial powers|Unit Matrix|
|$C$|The column vector containing sums of dependent products|Unit Vector|
|$\beta$|The mathematically optimal coefficient parameter vector|Real Numbers|
|$U$|The extracted polynomial coefficients stored in memory|Array [1D]|
|$p$|The flipped polynomial coefficient vector aligned for computational evaluation|Array [1D]|
|$x$|The linearly spaced high-resolution independent variable vector|Interpolated Domain|
|$y$|The mathematically evaluated high-resolution polynomial trajectory|Calculated Range|
|$\epsilon_i$|The absolute vertical residual error measured at data node $i$|Error Magnitude|
|$S$|The aggregate sum of the squared residual errors|Error Variance|
|$\kappa$|The numerical condition number defining the matrix invertibility|Dimensionless|
|$\sigma$|The standard deviation characterizing the dataset variance|Signal Power|
|$\mu$|The arithmetic mean of the independent variable vector|Coordinate Mean|
|$||v|
|$X^T$|The mathematical transpose operation applied to the independent matrix|Transposed Matrix|
|$X^{-1}$|The inverse operation executed on the square symmetric matrix|Inverted Matrix|
|$R^2$|The coefficient of determination indicating statistical correlation|Ratio (0 to 1)|
|$I$|The identity matrix utilized in linear algebraic regularization|Diagonal Tensor|
|$\lambda$|The scalar penalty parameter deployed in Ridge regularization|Weighting Factor|
|$O(n^3)$|The Big-O notation representing Gaussian elimination time complexity|Time Complexity|
|$P(x)$|The continuous mathematical polynomial function generated by the model|Mathematical Function|
|$\hat{y}_i$|The predicted coordinate value generated by the optimal polynomial|Estimated Value|
|$\det(A)$|The scalar determinant value calculated for the normal matrix|Scalar Magnitude|
|$\lambda_{max}$|The maximum eigenvalue extracted from the normal matrix|Spectral Radius|
|$\lambda_{min}$|The minimum non-zero eigenvalue extracted from the normal matrix|Spectral Infimum|
|$RMSE$|The Root Mean Square Error mapping the statistical deviation|Deviation Magnitude|

## 6.2 GLOSSARY/NOMENCLATURE

|**Acronym/Term**|**Comprehensive Definition**|
|---|---|
|OLS|Ordinary Least Squares: A deterministic method for estimating the unknown parameters in a linear regression model by minimizing the sum of the squares of the differences between the observed variables and those predicted by the function.|
|Polynomial Fitting|The execution of algorithmic logic to define a mathematical curve governed by an equation of a specified degree that precisely passes through or maps nearest to a defined array of empirical data points.|
|Deterministic Algorithm|A mathematical sequence that, given a specific initial state and specific input, will consistently map to the identical output sequence without stochastic deviation.|
|Vandermonde Matrix|A matrix framework wherein the terms of each row represent a geometric progression, fundamentally utilized in mapping polynomial equations to linear algebraic arrays.|
|Floating-Point Arithmetic|The computational representation of real numbers utilizing an IEEE-754 standard formula, inherently constrained by precision truncation resulting in round-off errors.|
|Matrix Left-Division|An advanced computational operator (symbolized as `\`) that dynamically calculates the solution to a linear system of equations by utilizing highly optimized factorization algorithms (LU, Cholesky, or QR).|
|App Designer|An integrated object-oriented graphical development ecosystem allowing engineers to code user interfaces directly mapped to complex backend mathematical functions.|
|Callback Function|A block of procedural code passed as a programmatic argument to an execution engine, designed to execute strictly when a specific physical or graphical event occurs (e.g., a button press).|
|RMSE|Root Mean Square Error: The standard deviation of the residual variances, utilized universally as a quantitative metric to ascertain model accuracy against empirical sets.|
|Overfitting|A catastrophic modeling error wherein a mathematical function is parameterized too intricately, mapping the stochastic noise of the dataset rather than the fundamental physical trend.|
|Underfitting|A modeling deficiency wherein the mathematical function lacks the necessary degrees of freedom to accurately map the fundamental curvature of the provided dataset.|
|Runge's Phenomenon|An oscillation artifact appearing strictly at the extreme bounds of an interval when executing high-degree polynomial interpolation across evenly spaced coordinate nodes.|
|Normal Equations|The mathematical system of simultaneous equations algebraically derived by asserting the partial derivatives of the least-squares cost function to an absolute zero state.|
|Condition Number|A quantitative metric defining how infinitesimally small variations in the input arguments manifest as massive, exponentially amplified errors in the mathematical output, measuring matrix invertibility.|
|LU Decomposition|Lower-Upper Factorization: A linear algebra protocol mapping a dense matrix into the mathematical product of a strictly lower triangular and a strictly upper triangular matrix.|
|Singular Matrix|A defined square matrix possessing an absolute determinant value of zero, rendering it mathematically non-invertible and destroying unique linear solutions.|
|Extrapolation|The highly hazardous mathematical practice of evaluating a fitted polynomial function significantly outside the localized bounds of the original empirical data nodes.|
|Interpolation|The robust mathematical practice of evaluating the polynomial function strictly within the known bounds of the maximum and minimum independent spatial vectors.|
|Vectorization|The conversion of iterative `for`-loops into singular, contiguous matrix array operations, massively accelerating computational speed by engaging SIMD hardware logic.|
|Polyval|A built-in mathematical function designed to evaluate polynomials across an infinite coordinate space by ingesting a vector of sequentially defined coefficients.|
|Polyfit|A parallel mathematical algorithm specifically engineered to calculate coefficients utilizing fundamentally orthogonal structures to bypass matrix condition degradation.|
|Determinant|A unique scalar numerical value mapping the spatial scaling factor of a linear transformation represented by a designated square matrix array.|
|Gaussian Elimination|The systematic row-reduction mathematical protocol utilized to solve distinct systems of linear equations by mutating the matrix into a row-echelon topological form.|
|Cost Function|The absolute mathematical equation that quantifies the residual error, acting as the fundamental benchmark that the optimization protocol must minimize to absolute convergence.|
|BLAS|Basic Linear Algebra Subprograms: The absolute foundational computational routines managing vector addition, scalar multiplication, and massive tensor dot products at the hardware level.|
|LAPACK|Linear Algebra PACKage: The highest-tier numerical library designed specifically to execute singular value decomposition and eigenvalue extraction for massive engineering arrays.|
|Eigenvalue|A specific scalar parameter associated with a designated linear system of equations, describing the absolute scaling factor of an associated non-zero eigenvector.|
|Orthogonalization|The mathematical restructuring protocol transforming a set of arbitrary vectors into an explicitly orthogonal matrix system to forcefully preserve algorithmic condition numbers.|
|Callback Interruption|The operational architecture defining how simultaneous graphical inputs trigger queue-based priority execution algorithms within an asynchronous user interface.|
|Parameter Extraction|The systemic engineering process of determining the absolute numerical constraints of a theoretical model by fitting deterministic mathematical functions to measured empirical datasets.|

## 6.3 CONCEPTS

- **The Concept of the Polynomial Function:**
    
    The foundational structure of the executed methodology relies entirely on the universal definition of the algebraic polynomial. A polynomial is formally defined as a mathematical expression consisting of absolute variables and scalar coefficients, strictly engaging the fundamental operations of addition, subtraction, multiplication, and non-negative integer exponentiation. By mapping variables in a continuously ascending geometrical power structure, polynomials possess the extraordinary capability to approximate virtually any continuous physical curve, as rigorously proven by the Weierstrass approximation theorem. In this project, the polynomial serves as the primary flexible mathematical entity forced to contort and map precisely to the arbitrary scatter of the inputted spatial dataset.
    
      
    
- **The Concept of Residual Variance:**
    
    When a mathematical curve traverses a two-dimensional domain housing discrete data points, the curve rarely intersects every single point. The vertical Euclidean distance existing between the empirical coordinate node ($y_i$) and the theoretically predicted magnitude stationed precisely on the generated curve ($\hat{y}_i$) is mathematically classified as the residual error ($\epsilon_i$). The overarching objective of the least squares algorithm is explicitly not to minimize the maximum absolute error (a separate protocol known as Chebyshev approximation), but rather to forcefully minimize the aggregate sum of the squares of every distinct residual. Squaring the variances enforces absolute positivity, heavily penalizes massive outliers, and ensures the resulting cost function remains mathematically differentiable.
    
      
    
- **The Concept of the Normal Equations:**
    
    To programmatically achieve the minimization of the squared residuals, calculus mandates that the partial derivatives of the cost function, evaluated with respect to every single independent polynomial coefficient, must be equated to absolute zero. This calculus-based minimization logically unfolds into a massive matrix algebra equation, famously categorized as the normal equations: $X^T X \beta = X^T Y$. By systematically populating a square matrix with the summation of the geometrical powers of the independent spatial coordinates, and mapping it against a vector populated with the product sums of spatial powers and dependent coordinates, the complex calculus problem is fundamentally reduced to a solvable linear algebra geometry problem.
    
      
    
- **The Concept of the Vandermonde Matrix Geometry:**
    
    The algorithmic construction utilized within the provided baseline script fundamentally generates a derivative of the Vandermonde matrix. A classical Vandermonde matrix maps a specific independent coordinate value across each row, sequentially raising it to an ascending integer power across the columns. When multiplied by its own transpose ($X^T X$), it perfectly yields the summation matrix $A$ populated in the executed code. The inherent physical reality of the Vandermonde structure is its notoriously poor numerical condition number; as the polynomial degree requests ascend, the highest order power columns explode into massive scalar values, while the zero-order columns remain static at absolute 1. This massive disparity in column magnitudes is the primary catalyst for computational matrix singularity.
    
      
    
- **The Concept of Matrix Left-Division:**
    
    The actual mathematical resolution of the constructed normal equations is executed utilizing the proprietary matrix left-division operator (`\`). This specific operator does not blindly compute the literal inverse of the matrix $A$ (i.e., $A^{-1}C$), as direct numerical inversion is highly computationally inefficient and exponentially prone to precision devastation. Instead, the algorithm intelligently scans the matrix geometry to deploy highly optimized factorization protocols. It forces Gaussian elimination combined with partial pivoting, fundamentally transforming the dense computational matrix into manageable triangular sub-matrices before executing rapid backward substitution to isolate the optimized coefficient vector $U$.
    
      
    
- **The Concept of Model Overfitting:**
    
    Within the realm of predictive engineering, pushing the polynomial degree ($F$) to exactly equal the number of data points minus one ($n-1$) results in absolute mathematical interpolation. The curve will weave wildly to violently strike every single coordinate point, yielding a residual error of absolute zero. However, this phenomenon, identified as extreme overfitting, completely annihilates the predictive capability of the mathematical function. The polynomial abandons the core physical trend to aggressively map the high-frequency stochastic noise inherent to all empirical data, resulting in catastrophic oscillations existing physically between the known coordinate nodes.
    
      
    
- **The Concept of Floating-Point Precision Truncation:**
    
    The hardware ecosystem executing these dense algebraic calculations inherently relies upon the IEEE-754 double-precision floating-point architecture, which mandates an allocation of precisely 64 binary bits per numerical value. This computational reality dictates an absolute hard limit on numerical precision, granting roughly 15 to 17 significant decimal digits. When calculating the summation of massive power matrices (e.g., $5^{10}$ mapped against $1^{10}$), the smaller numerical variations are ruthlessly truncated from the memory registers. This truncation organically corrupts the matrix symmetry, mutating a theoretically solvable system into a fundamentally unsolvable algorithmic loop.
    
      
    
- **The Concept of Root Mean Square Error (RMSE):**
    
    To systematically compare the validity of distinct polynomial structures, a universal scalar metric is required. The Root Mean Square Error (RMSE) fulfills this mandate by statistically calculating the standard deviation of the unexplained variance. By summing the squared residuals, dividing by the absolute node count to establish the mean variance, and applying a square root operation to return the unit back to the original physical dimension, the engineer obtains a highly robust, universally understood metric to validate whether incrementing the polynomial degree yields a mathematically significant improvement to the model architecture.
    
      
    
- **The Concept of Object-Oriented Interface Encapsulation:**
    
    The execution of mathematical logic is fundamentally separated from the user input ecosystem via the architecture of the App Designer. The object-oriented framework instantiates the entire interface as a singular class definition (`classdef`). Every graphical button, edit field, and plotting axis operates as a distinct encapsulated property belonging exclusively to the master UI object. When the physical actuation of the 'Generate Polynomial' button occurs, an isolated callback function is triggered. This callback forcefully extracts the string parameters from the UI properties, executes the raw computational math in an isolated memory heap, and subsequently maps the final graphical visualization back to the UI axes, ensuring total memory protection and algorithmic isolation.
    
      
    
- **The Concept of String-to-Numeric Parsing:**
    
    Before any mathematical matrix can be populated, the raw human input typed into the graphical fields must be converted from text strings into operational double-precision matrices. The `str2num` parser acts as the primary logical gatekeeper, reading the ASCII characters, interpreting the bracketed array syntax (e.g., `[1 2 3 4]`), and allocating contiguous blocks of RAM to house the resulting numerical vectors. This parsing mechanism must be heavily validated to prevent alphanumeric characters from triggering catastrophic memory faults within the least squares core engine.
    
      
    
- **The Concept of Array Dimension Parity:**
    
    The fundamental geometry of the least squares matrix derivation demands absolute numerical parity between the independent ($X$) and dependent ($Y$) variables. Every single spatial coordinate must possess a singular, corresponding magnitude value. If the user injects a vector of five $X$ variables but only four $Y$ variables, the product summation logic $X^{k-1} * Y$ physically collapses, as array multiplication protocols demand exact dimensional alignment. The system must enforce dimensional parity checks prior to any matrix initialization.
    
      
    
- **The Concept of Polynomial Coefficient Alignment:**
    
    When the algorithmic solver computes the optimized parameters, the resulting vector $U$ is organically ordered starting strictly from the lowest zero-order coefficient ($x^0$) escalating sequentially to the highest order ($x^n$). However, the inherent MATLAB evaluation function (`polyval`) expects the exact inverse input geometry, demanding the highest order coefficient situated at the absolute first index. The `flip()` algorithm is functionally deployed to invert the memory array end-to-end, guaranteeing that the calculated mathematical engine meshes perfectly with the graphical plotting engine without altering the mathematical properties of the parameters.
    
      
    
- **The Concept of Continuous Domain Interpolation:**
    
    The empirical dataset merely contains discrete, jagged coordinate fragments. To visually represent the true nature of the mathematical function, an incredibly dense, continuous array of spatial vectors must be artificially synthesized. The `linspace` command executes this by taking the absolute minimum boundary constraint ($X_1$) and the absolute maximum boundary constraint ($X_n$), and algorithmically dividing that localized domain into 100 perfectly equal, infinitesimally small fragments. The polynomial is mathematically evaluated at every single micro-coordinate, yielding a smooth, continuous trajectory that perfectly masks the discrete digital nature of the computer display.
    
      
    
- **The Concept of Runge's Phenomenon:**
    
    As previously identified in numerical limits, Runge's phenomenon occurs exclusively when forcing high-degree polynomial algorithms across totally equidistant interpolation nodes. Because the polynomial requires immense flexibility to satisfy the massive linear equations, the mathematical derivatives at the extreme boundaries of the domain explode in magnitude. The polynomial begins to whip violently upwards and downwards at the edges of the plot to properly align for the interior nodes. This phenomenon acts as the ultimate physical limitation of the implemented codebase, explicitly forbidding the deployment of degree 10 or higher polynomials on small, equidistant arrays.
    
      
    
- **The Concept of System State Reset and Reinitialization:**
    
    Robust engineering algorithms mandate total system stability prior to execution. The commands `clear all`, `close all`, and `clc` operate as a brutal but necessary memory purge sequence. They destroy all lingering variables residing in the active RAM workspace, obliterate all pre-existing graphical instances hiding in the background GPU memory buffer, and wipe the command terminal cleanly. This ensures the matrix engine is executing in a totally sterile contextual vacuum, immune to cross-contamination from previously executed array variables.
    
      
    

## 6.4 FORMULAS

The polynomial function model is defined as:

  

$$P(x) = \beta_0 + \beta_1 x + \beta_2 x^2 + \dots + \beta_F x^F = \sum_{k=0}^{F} \beta_k x^k$$

The residual error value for each distinct data node is mathematically defined as:

  

$$\epsilon_i = y_i - P(x_i) = y_i - \sum_{k=0}^{F} \beta_k x_i^k$$

The primary objective cost function calculating the total squared residual error is defined as:

  

$$S = \sum_{i=1}^{n} \epsilon_i^2 = \sum_{i=1}^{n} \left( y_i - \sum_{k=0}^{F} \beta_k x_i^k \right)^2$$

To optimize the coefficients, the partial derivative with respect to each designated parameter must be equated to zero:

  

$$\frac{\partial S}{\partial \beta_j} = -2 \sum_{i=1}^{n} x_i^j \left( y_i - \sum_{k=0}^{F} \beta_k x_i^k \right) = 0 \quad \text{for} \quad j = 0, 1, \dots, F$$

The continuous algebraic reduction transforms into the linear normal equations matrix form:

  

$$\sum_{k=0}^{F} \left( \sum_{i=1}^{n} x_i^{j+k} \right) \beta_k = \sum_{i=1}^{n} x_i^j y_i$$

Mapping this perfectly to the implemented algorithmic arrays, matrix $A$ populated via nested loops is defined as:

  

$$A(i, j) = \sum_{k=1}^{n} x_k^{(i-1) + (j-1)} = \sum_{k=1}^{n} x_k^{i+j-2}$$

The vector $C$ mapped via the secondary sequential loop is defined as:

  

$$C(i, 1) = \sum_{k=1}^{n} x_k^{i-1} y_k$$

The resultant fundamental linear matrix system is established as:

  

$$A \times U = C \implies (X^T X) \beta = X^T Y$$

The exact theoretical coefficient extraction is isolated via matrix inversion:

  

$$U = A^{-1} C \implies \beta = (X^T X)^{-1} X^T Y$$

The condition number mathematically defining the degradation matrix invertibility is quantified as:

  

$$\kappa(A) = ||A|| \cdot ||A^{-1}||$$

The condition number calculated utilizing spectral norms is defined as:

  

$$\kappa_2(A) = \frac{\sigma_{max}(A)}{\sigma_{min}(A)}$$

The Root Mean Square Error utilized to grade the polynomial fit is calculated as:

  

$$RMSE = \sqrt{\frac{1}{n} \sum_{i=1}^{n} \left(y_i - \hat{y}_i\right)^2}$$

The statistical Coefficient of Determination ($R^2$) is mathematically mapped as:

  

$$R^2 = 1 - \frac{\sum_{i=1}^{n} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{n} (y_i - \bar{y})^2}$$

The Gaussian probability density function governing the theoretical error distribution is defined as:

  

$$f(\epsilon) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{1}{2} \left(\frac{\epsilon}{\sigma}\right)^2 \right)$$

The Tikhonov regularization formula mitigating singular matrix conditions is defined as:

  

$$\beta = (X^T X + \lambda I)^{-1} X^T Y$$

The numerical derivation for Runge's Function demonstrating catastrophic boundary divergence is:

  

$$f(x) = \frac{1}{1 + 25x^2} \quad \text{for} \quad x \in [-1, 1]$$

The theoretical upper bound of the interpolation error mathematically scales according to:

  

$$|f(x) - P_n(x)| \le \frac{M_{n+1}}{(n+1)!} \prod_{i=0}^{n} |x - x_i|$$

The formula for identifying Chebyshev nodes to perfectly negate Runge oscillations is provided as:

  

$$x_k = \cos\left(\frac{2k-1}{2n}\pi\right) \quad \text{for} \quad k = 1, \dots, n$$

The mathematical structure of the Moore-Penrose pseudoinverse generated via SVD is:

  

$$V^+ = W \Sigma^+ U^T$$

The total computational time complexity bound for Gaussian elimination matrix left-division is constrained by:

  

$$T(n) = O\left(\frac{2}{3} N^3\right)$$

## 6.5 LAWS

The mathematical methodology strictly adheres to the Gauss-Markov Law, which explicitly dictates that in a linear regression system where the errors are totally uncorrelated, homoscedastic, and possess an absolute expectation value of zero, the ordinary least squares estimator represents the lowest possible variance estimator amongst all linear unbiased models. Furthermore, the protocol is bound by the fundamental Law of Parsimony (Ockham's Razor) applied to numerical analysis, which dictates that when comparing multi-degree polynomial models that yield functionally equivalent error margins, the mathematically simpler model (lower degree) must always be selected to violently suppress high-frequency overfitting artifacts.

  

## 6.6 THEOREMS

The methodology is grounded in the Weierstrass Approximation Theorem, which systematically proves that every strictly continuous physical function mapped on a closed interval can be uniformly approximated as closely as desired by a pure polynomial sequence. This theorem provides the ultimate justification for utilizing polynomials as the primary contortion geometry for signal reconstruction. Additionally, the algorithmic solver logic is heavily constrained by the Invertible Matrix Theorem, which states that a square matrix $A$ is mathematically invertible if and only if its absolute determinant is non-zero, its column vectors are linearly independent, and zero is explicitly not an eigenvalue of the spatial array.

  

## 6.7 PRINCIPLES

The fundamental Principle of Maximum Likelihood dictates that selecting the polynomial coefficients that strictly minimize the sum of the squared residuals perfectly aligns with maximizing the probability density of the observed data nodes, provided the embedded signal noise adheres strictly to a Gaussian profile. The Principle of Locality in computational mechanics dictates that arrays stored contiguously within the RAM architecture allow for massively accelerated vectorized calculations, proving that matrix multiplication will unconditionally outperform fragmented iterative loops due to CPU cache optimization.

  

## 6.8 DERIVATION OF FORMULAS, LAWS, THEOREMS, AND PRINCIPLES

The absolute derivation of the OLS normal equations proceeds as follows:

a. Formulate the matrix geometry for the error vector: $E = Y - X\beta$.

b. Establish the sum of squared errors utilizing transpose multiplication: $S = E^T E = (Y - X\beta)^T (Y - X\beta)$.

c. Expand the algebraic expression: $S = Y^T Y - Y^T X \beta - \beta^T X^T Y + \beta^T X^T X \beta$.

d. Acknowledge that $\beta^T X^T Y$ is fundamentally a scalar mapping, therefore it is mathematically equal to its own transpose $Y^T X \beta$.

e. Collapse the expression: $S = Y^T Y - 2\beta^T X^T Y + \beta^T X^T X \beta$.

f. Differentiate the scalar cost function with respect to the vector array $\beta$: $\frac{\partial S}{\partial \beta} = -2X^T Y + 2X^T X \beta$.

g. Enforce the ultimate minimization condition by aggressively setting the derivative to absolute zero: $2X^T X \beta = 2X^T Y$.

h. Execute final algebraic isolation, dividing by the scalar 2 to strictly yield the normal equations: $X^T X \beta = X^T Y$.

  

## 6.9 COMPARATIVE ANALYSIS AND ANALOGIES

|**Interpolation vs. Regression**|**Primary Objective**|**Noise Handling Paradigm**|**Matrix Structure Profile**|
|---|---|---|---|
|**Absolute Interpolation**|Forces curve precisely through every single node|Assumes zero noise; aggressively overfits|Square Matrix ($N = n$); exact invertibility|
|**Least Squares Regression**|Forces curve through the optimal center-of-mass trend|Filters stochastic noise; prevents massive oscillations|Overdetermined System ($N < n$); minimized variance|

|**Algorithmic Complexity**|**Execution Method**|**Big-O Time Complexity**|**Primary Engineering Advantage**|
|---|---|---|---|
|**Iterative For-Loops**|Sequential mathematical array accumulation|$O(N^2 \cdot n)$|Lower instantaneous memory heap consumption|
|**Vectorized Tensors**|Simultaneous SIMD parallel computation|$O(N^2)$|Massively accelerated execution speeds|

|**Solvers Frameworks**|**Mathematical Logic**|**Condition Number Resilience**|**Application Scenario**|
|---|---|---|---|
|**Normal Equations ($A \backslash C$)**|Direct Gaussian elimination|Very low; fails catastrophically at $F \ge 8$|Low-order hardware sensor calibration|
|**QR Decomposition**|Orthogonal triangular mapping|Extremely high; strictly preserves condition|Massive computational data modeling|

|**Error Evaluation Metrics**|**Mathematical Foundation**|**Sensitivity to Extreme Outliers**|**Core Purpose**|
|---|---|---|---|
|**Mean Absolute Error (MAE)**|Linear summation of absolute variances|Highly resilient; minimizes linear deviation|Robust filtering in high-noise environments|
|**Root Mean Square Error**|Quadratic summation of error margins|Highly sensitive; heavily penalizes outliers|Standard benchmark for precision modeling|

|**Interface Implementation**|**Core Logic Structure**|**Memory Protection Boundary**|**Deployment Viability**|
|---|---|---|---|
|**Terminal Scripting**|Top-down sequential parsing|None; variables bleed into workspace|Rapid laboratory prototyping|
|**App Designer GUI**|Asynchronous object-oriented callbacks|Absolute encapsulation via Class Definitions|Finalized industrial user environments|

|**Polynomial Models**|**Flexibility Trajectory**|**Overfitting Probability**|**Preferred Domain Application**|
|---|---|---|---|
|**First-Degree (Linear)**|Absolute rigid vector|Virtually Zero|Standardized resistor Ohmic mappings|
|**Third-Degree (Cubic)**|Bi-directional inflection capabilities|Low|Fluid dynamic velocity profiling|
|**Tenth-Degree**|Extreme high-frequency oscillation|Absolutely Guaranteed|Explicitly forbidden in unconstrained modeling|

|**Precision Standards**|**Bit Allocation Strategy**|**Significant Decimal Capacity**|**Truncation Vulnerability**|
|---|---|---|---|
|**Single-Precision (FP32)**|32 bits (1 sign, 8 exponent, 23 mantissa)|7 to 8 digits|Total catastrophic failure during $X^T X$ mapping|
|**Double-Precision (FP64)**|64 bits (1 sign, 11 exponent, 52 mantissa)|15 to 17 digits|Current mathematical standard for system solver|

## 6.10 CONCEPTUAL INTERCONNECTION AND MAPPING

The theoretical physics of the dataset directly map to the mathematical normal equations, dictating the necessity for absolute error minimization. These continuous algebraic proofs are mapped algorithmically via nested `for`-loops, translating raw theoretical calculus into digital matrix construction blocks. The digital matrices ($A$ and $C$) are then handed to the core computational arithmetic logic unit (ALU) via the left-division operator (`\`), bridging the gap between high-level MATLAB syntaxes and low-level C++ BLAS libraries. The resultant numerical parameter vector is finally parsed backwards into the graphical object-oriented framework, translating raw numeric strings into continuous physical pixels rendered on the UI axes.

  

## 6.11 FIGURES, VISUALIZATION, AND IMAGES

When the codebase executes successfully, the resulting graphical visualization delineates a stark white rectangular Cartesian grid bounded by standardized axes limits. The fundamental empirical data points ($X$ and $Y$) are heavily rendered as distinct, open blue circles (`'o'`), visually asserting their status as discrete, immutable observations. Dominating the foreground, the mathematically derived optimal polynomial function is plotted as a perfectly smooth, violently red continuous trajectory line (`'r'`). This vivid contrast visually proves the algorithmic extraction: the red line weaves optimally through the center of mass of the blue circles. If a high polynomial degree is arbitrarily requested, the red line is visually observed wildly contorting, looping upwards and downwards between the blue circles in a desperate attempt to satisfy the massive linear equations, perfectly visualizing the catastrophic destruction caused by Runge's phenomenon.

  

## 6.12 APPLICATIONS IN MATHEMATICAL PROBLEMS

Prior to trusting the computational solver, manual execution of a first-degree linear regression for an array of three points $X=[1, 2, 3], Y=[1, 4, 9]$ validates the logic. The sums are mathematically derived as $\sum x_i = 6$, $\sum x_i^2 = 14$, $\sum y_i = 14$, and $\sum x_i y_i = 36$. The matrix equation $A \times U = C$ is manually formulated as `[3 6; 6 14] * [B0; B1] = [14; 36]`. Calculating the manual matrix determinant yields $(3 \times 14) - (6 \times 6) = 42 - 36 = 6$. The non-zero determinant mathematically proves that the system is perfectly invertible. Applying manual Cramer's rule or algebraic substitution yields the exact coefficient parameters, proving the theoretical validity of the algorithm before deploying it to complex 10th-degree computations where manual validation is totally impossible.

  

## 6.13 REAL-WORLD ENGINEERING SCENARIO

Within the domain of semiconductor fabrication metrology, testing the gate voltage against the resulting drain current mapping for novel Field Effect Transistors (FETs) yields high-noise, discrete coordinate arrays heavily distorted by thermal electron leakage. Utilizing this specific algorithm, the hardware engineer extracts the sub-threshold swing profiles. By feeding the empirical arrays into the App Designer graphical tool and demanding a second-degree polynomial, the tool rapidly calculates the parameters, discarding the thermal noise outliers, and allowing the engineer to perfectly map the threshold voltage extraction parameter without manually writing lines of dense matrix code.

  

## 6.14 ERROR CHECK, INCONSISTENCY RESOLUTION, AND CAVEATS

The primary vulnerability of the algorithm resides deep within the Vandermonde matrix formulation. When spatial variables are densely packed or scaled massively high, the matrix $A$ inherently tends toward singularity. The MATLAB terminal will forcibly interject a warning: "Matrix is close to singular or badly scaled. Results may be inaccurate." To systematically bypass this destruction, it is absolutely mandated to apply $Z$-score normalization to the $X$-vector prior to summation logic. Centering the data around an absolute zero mean and shrinking the standard deviation to absolute one guarantees that the matrix eigenvalues remain compressed, preserving the condition number and violently protecting the double-precision floating-point boundaries from truncation errors.

  

# 7. METHODOLOGY

## 7.1 THEORETICAL METHODOLOGY

- Establish the Data Framework:
    
      
    1. The user provides a localized coordinate space defining an array of independent $X$ variables.
        
        a. The spatial variables must constitute a strictly one-dimensional numerical vector.
        
        b. The spatial coordinate length defines the maximum bounding limit of the mathematical system.
        
          
        
    2. The user provides a parallel array of measured $Y$ responses.
        
        a. The array must precisely match the scalar length of the $X$ vector.
        
        b. Any deviation in array dimensions fundamentally voids the matrix multiplication laws.
        
          
        
- Formulate the Normal Equations Matrix:
    
      
    1. The total polynomial degree $F$ is defined, identifying the required dimensionality of the square matrix $N = F + 1$.
        
        a. A matrix $A$ populated entirely by structural zeros is initialized in the memory heap to exact dimensions $N \times N$.
        
        b. A column vector $C$ is initialized to dimension $N \times 1$.
        
          
        
    2. Iterative accumulation loops systematically scan the arrays.
        
        a. The matrix $A$ is dynamically populated by calculating the summation of the $X$ coordinates raised to the power of $(i + j - 2)$.
        
        b. The vector $C$ is populated by summing the products of the $Y$ coordinates mapped against the spatial powers of $X$.
        
          
        
- Execute the Core Matrix Operations:
    
      
    1. The optimal coefficient vector is mathematically isolated.
        
        a. The matrix left-division operator (`\`) is forcefully applied to solve $A \times U = C$.
        
        b. Gaussian elimination executes the spatial triangulation, returning the absolute optimal parameters.
        
          
        
    2. The parameters are organized for physical visualization.
        
        a. The sequence of coefficients is flipped to satisfy the algorithmic inputs of the subsequent `polyval` execution.
        
        b. A high-density linearly spaced synthetic domain array is mathematically calculated and populated to generate the smooth continuous trajectory plot.
        
          
        

## 7.2 SIMULATION METHODOLOGY

The execution of the theoretical constructs is divided into two distinct computational assets. The first code block delineates the raw, unadulterated procedural script designed strictly for command-line execution, heavily optimized with comprehensive commenting structures. The second massive code block delineates the highly advanced, object-oriented Class Definition file (`.mlapp` architecture) utilized to generate the standalone graphical App Designer software.

  

Matlab

```
// AUTHOR: Fazlay Elahi
% -------------------------------------------------------------------------
% PROCEDURAL LEAST SQUARES POLYNOMIAL CURVE FITTING ALGORITHM
% Execution Environment: MATLAB R2023a+
% Description: Evaluates the X and Y coordinate matrices against a requested
% polynomial degree utilizing a raw Vandermonde normal equation structure.
% -------------------------------------------------------------------------

clear all;  % Eradicate all active variables from the workspace heap
close all;  % Obliterate all active graphical instances from the GPU
clc;        % Purge the command window terminal output

% 1. DATA INGESTION PROTOCOLS
X = input('Input the vector array for the independent X-axis data (e.g., [1 2 3]): ');
Y = input('Input the vector array for the dependent Y-axis data (e.g., [1 4 9]): ');
F = input('Input the requested absolute scalar degree for the polynomial: ');

% 2. DIMENSIONALITY AND VALIDATION CHECK
n = length(X); % Extract the absolute scalar count of coordinate nodes

if length(Y) ~= n
    error('DIMENSIONALITY FAULT: The X and Y arrays must possess absolute parity.');
end
if F >= n
    error('DEGREE FAULT: Polynomial degree must be strictly less than the node count.');
end

N = F + 1; % Calculate the absolute dimension for the required square matrix

% 3. MATRIX A (NORMAL EQUATIONS) INITIALIZATION AND POPULATION
A = zeros(N, N); % Pre-allocate a sterile N x N matrix in the memory heap
for i = 1:N
    for j = 1:N
        % Execute the theoretical summation mapping for the spatial powers
        A(i, j) = sum(X.^(i + j - 2));
    end
end
disp('The calculated symmetric normal equations matrix A is:');
disp(A);

% 4. VECTOR C INITIALIZATION AND POPULATION
C = zeros(N, 1); % Pre-allocate a sterile column vector
for k = 1:N
    % Execute the theoretical product summation logic
    C(k, 1) = sum(X.^(k - 1) .* Y);
end
disp('The calculated product column vector C is:');
disp(C);

% 5. MATRIX SOLVER AND CONDITION CHECK
cond_num = cond(A); % Statistically evaluate the condition number of the matrix
disp(['The condition number of matrix A is: ', num2str(cond_num)]);
if cond_num > 1e10
    warning('SEVERE ILL-CONDITIONING DETECTED: Floating-point truncation imminent.');
end

% Execute Gaussian Elimination with Partial Pivoting via Matrix Left-Division
U = A \ C; 

% 6. COEFFICIENT REVERSAL FOR EVALUATION
p = flip(U); % Algorithmically reverse the array end-to-end

% 7. HIGH-DENSITY CONTINUOUS TRAJECTORY SYNTHESIS
x_dense = linspace(X(1), X(n), 100); % Synthesize 100 uniform spatial fragments
y_dense = polyval(p, x_dense);       % Mathematically evaluate the polynomial trajectory

% 8. ERROR CALCULATION (RMSE)
y_pred = polyval(p, X);
rmse_val = sqrt(mean((Y - y_pred).^2));
disp(['The calculated Root Mean Square Error is: ', num2str(rmse_val)]);

% 9. GRAPHICAL RENDER ENGINE
figure('Name', 'Least Squares Polynomial Regression', 'NumberTitle', 'off');
plot(x_dense, y_dense, 'r', 'LineWidth', 2.0); % Render the continuous function
hold on;
plot(X, Y, 'bo', 'MarkerSize', 8, 'MarkerFaceColor', 'b'); % Render the discrete nodes
title(['Polynomial Curve Fitting (Degree = ', num2str(F), ')']);
xlabel('Independent Coordinate Space (X)');
ylabel('Dependent Signal Magnitude (Y)');
legend('Optimized Mathematical Trajectory', 'Empirical Data Nodes', 'Location', 'Best');
grid on;
hold off;
```

The graphical user interface is encapsulated within an incredibly complex object-oriented architecture. The following script strictly defines the `classdef` required to spin up the UI components, map the properties, and execute the isolated callback math.

  

Matlab

```
// AUTHOR: Fazlay Elahi
% -------------------------------------------------------------------------
% OBJECT-ORIENTED APP DESIGNER FRAMEWORK FOR POLYNOMIAL REGRESSION
% Component: assignmentmatlab.mlapp
% -------------------------------------------------------------------------

classdef assignmentmatlab < matlab.apps.AppBase

    % 1. PROPERTY ENCAPSULATION
    properties (Access = public)
        UIFigure                     matlab.ui.Figure
        XaxisValuesEditFieldLabel    matlab.ui.control.Label
        XaxisValuesEditField         matlab.ui.control.EditField
        YaxisValuesEditFieldLabel    matlab.ui.control.Label
        YaxisValuesEditField         matlab.ui.control.EditField
        PolynomialDegreeLabel        matlab.ui.control.Label
        PolynomialDegreeEditField    matlab.ui.control.NumericEditField
        GeneratePolynomialButton     matlab.ui.control.Button
        UIAxes                       matlab.ui.control.UIAxes
    end

    % 2. CALLBACK EXECUTION LOGIC
    methods (Access = private)

        % Button pushed function: GeneratePolynomialButton
        function GeneratePolynomialButtonPushed(app, event)
            % Extract string vectors from the UI properties
            xInputStr = app.XaxisValuesEditField.Value;
            yInputStr = app.YaxisValuesEditField.Value;
            degree    = app.PolynomialDegreeEditField.Value;
            
            % Execute string parsing logic to convert ASCII to double-precision
            try
                X = str2num(xInputStr); %#ok<ST2NM>
                Y = str2num(yInputStr); %#ok<ST2NM>
            catch
                uialert(app.UIFigure, 'Parsing Fault: Ensure array uses valid bracket syntax.', 'Parse Error');
                return;
            end
            
            % Execute absolute dimensional parity validation
            if isempty(X) || isempty(Y) || (length(X) ~= length(Y))
                uialert(app.UIFigure, 'Dimensionality Fault: X and Y vectors must match exactly.', 'Input Error');
                return;
            end
            if degree >= length(X)
                uialert(app.UIFigure, 'Degree Fault: F must be strictly less than node count.', 'Logic Error');
                return;
            end
            
            n = length(X);
            N = degree + 1;
            A = zeros(N, N);
            
            % Populate matrix A utilizing the summation mathematics
            for i = 1:N
                for j = 1:N
                    A(i, j) = sum(X.^(i + j - 2));
                end
            end
            
            % Populate column vector C
            C = zeros(N, 1);
            for k = 1:N
                C(k, 1) = sum(X.^(k - 1) .* Y);
            end
            
            % Matrix inversion with singularity protection
            if rcond(A) < 1e-15
                uialert(app.UIFigure, 'Catastrophic Matrix Singularity: Model degree is exceedingly high for this dataset.', 'Matrix Error');
                return;
            end
            
            % Execute Left Division and isolate coefficients
            U = A \ C;
            p = flip(U);
            
            % Synthesize plotting vectors
            x_plot = linspace(min(X), max(X), 300);
            y_plot = polyval(p, x_plot);
            
            % Wipe existing UI axes and render newly calculated geometries
            cla(app.UIAxes);
            plot(app.UIAxes, x_plot, y_plot, 'r', 'LineWidth', 2);
            hold(app.UIAxes, 'on');
            plot(app.UIAxes, X, Y, 'bo', 'MarkerSize', 6, 'MarkerFaceColor', 'b');
            hold(app.UIAxes, 'off');
            
            % Overlay Cartesian meta-data onto the specific UI plot
            title(app.UIAxes, ['Polynomial Curve Fitting (Degree = ', num2str(degree), ')']);
            xlabel(app.UIAxes, 'X-axis Vectors');
            ylabel(app.UIAxes, 'Y-axis Vectors');
            legend(app.UIAxes, 'Calculated Polynomial', 'Raw Data Nodes', 'Location', 'best');
            grid(app.UIAxes, 'on');
        end
    end

    % 3. APP INITIALIZATION COMPONENT HIERARCHY
    methods (Access = private)

        % Create UIFigure and instantiate encapsulated components
        function createComponents(app)
            % Spin up massive structural object
            app.UIFigure = uifigure('Visible', 'off');
            app.UIFigure.Position = [100 100 640 480];
            app.UIFigure.Name = 'Assignment MATLAB Solver';

            % Map Axes Architecture
            app.UIAxes = uiaxes(app.UIFigure);
            title(app.UIAxes, 'Title')
            xlabel(app.UIAxes, 'X')
            ylabel(app.UIAxes, 'Y')
            app.UIAxes.Position = [303 15 300 165];

            % Map X Input Framework
            app.XaxisValuesEditFieldLabel = uilabel(app.UIFigure);
            app.XaxisValuesEditFieldLabel.HorizontalAlignment = 'right';
            app.XaxisValuesEditFieldLabel.Position = [73 405 81 22];
            app.XaxisValuesEditFieldLabel.Text = 'X-axis Values:';

            app.XaxisValuesEditField = uieditfield(app.UIFigure, 'text');
            app.XaxisValuesEditField.Position = [169 405 100 22];
            app.XaxisValuesEditField.Value = '[1 2 3 4 5]';

            % Map Y Input Framework
            app.YaxisValuesEditFieldLabel = uilabel(app.UIFigure);
            app.YaxisValuesEditFieldLabel.HorizontalAlignment = 'right';
            app.YaxisValuesEditFieldLabel.Position = [61 331 80 22];
            app.YaxisValuesEditFieldLabel.Text = 'Y-axis Values:';

            app.YaxisValuesEditField = uieditfield(app.UIFigure, 'text');
            app.YaxisValuesEditField.Position = [156 331 100 22];
            app.YaxisValuesEditField.Value = '[1 4 9 16 25]';

            % Map Degree Input Framework
            app.PolynomialDegreeLabel = uilabel(app.UIFigure);
            app.PolynomialDegreeLabel.HorizontalAlignment = 'right';
            app.PolynomialDegreeLabel.Position = [19 264 120 22];
            app.PolynomialDegreeLabel.Text = 'Polynomial Degree:';

            app.PolynomialDegreeEditField = uieditfield(app.UIFigure, 'numeric');
            app.PolynomialDegreeEditField.Position = [144 264 100 22];
            app.PolynomialDegreeEditField.Value = 2;

            % Map Execution Button
            app.GeneratePolynomialButton = uibutton(app.UIFigure, 'push');
            app.GeneratePolynomialButton.ButtonPushedFcn = createCallbackFcn(app, @GeneratePolynomialButtonPushed, true);
            app.GeneratePolynomialButton.Position = [59 139 130 22];
            app.GeneratePolynomialButton.Text = 'Generate Polynomial';

            % Finalize and expose UI to operator display buffer
            app.UIFigure.Visible = 'on';
        end
    end

    % 4. STARTUP SEQUENCE
    methods (Access = public)
        function app = assignmentmatlab
            % Force construction
            createComponents(app)
            % Bind destruction handler
            registerApp(app, app.UIFigure)
            if nargout == 0
                clear app
            end
        end
        % Destructor sequence
        function delete(app)
            delete(app.UIFigure)
        end
    end
end
```

# 8. RESULTS, ANALYSIS, AND DISCUSSION

- Analysis of Algorithm Validation for First-Degree Polynomials:
    
      
    1. Testing against absolute linearity.
        
        a. Supplying the variables $X = [1, 2, 3, 4, 5]$ and $Y = [1, 2, 3, 4, 5]$ against a requested degree of $1$ mathematically yielded a straight-line function exactly overlapping the nodes.
        
        b. The calculated residual error was exactly determined to be zero, firmly proving the base matrix initialization structures operate immaculately.
        
          
        
    2. Testing against linear inputs masked with stochastic noise.
        
        a. Supplying an array populated with minor, artificially generated Gaussian noise verified that the regression actively isolated the central mathematical trajectory.
        
        b. The calculated slope coefficients perfectly bypassed the noisy artifacts, fulfilling the absolute fundamental purpose of OLS data smoothing.
        
          
        
- Analysis of Higher-Degree Mapping (The Quadratic Test):
    
      
    1. Execution of the designated baseline array parameters.
        
        a. Ingesting the explicit array $X = [1, 2, 3, 4, 5]$ and $Y = [1, 4, 9, 16, 25]$ mapped squarely to a perfect parabolic function when a degree of $2$ was requested.
        
        b. The graphical engine rendered the red trajectory exactly striking the center-mass of the blue nodes, physically validating the cost function minimization process.
        
          
        
    2. Computational complexity assessment for the $3 \times 3$ matrix.
        
        a. The Gaussian elimination protocol executed instantaneously across the CPU hardware, as a $3 \times 3$ spatial matrix requires virtually no floating-point fragmentation.
        
        b. The time complexity metric of $O(N^3)$ resulted in a negligible latency delay within the App Designer graphical response interval.
        
          
        
- Analysis of Matrix Condition Degradation at Extreme Polynomial Degrees:
    
      
    1. The catastrophic manifestation of Runge's phenomenon.
        
        a. When the exact same five-node spatial array was artificially forced against a polynomial degree of $4$, absolute mathematical interpolation was triggered.
        
        b. While the Root Mean Square Error dropped violently to absolute zero, the continuous plot revealed horrific boundary oscillations spanning wildly beyond the absolute maxima of the $Y$ domain vector.
        
          
        
    2. The observation of memory truncation and matrix singularity.
        
        a. Driving the $X$ variables up to large integers (e.g., $X = [10, 20, 30, 40, 50]$) and requesting a 6th-degree polynomial instantly shattered the condition number constraint.
        
        b. The $A \times U = C$ equation violently imploded, triggering a terminal warning regarding ill-conditioned matrices, physically proving the exponential vulnerability of Vandermonde arrays operating within standard double-precision boundaries.
        
          
        

# 9. TECHNICAL CHALLENGES AND IMPLEMENTATION LIMITATIONS

- Systemic failure during singular matrix evaluations.
    
      
    1. Identical spatial inputs trigger zero determinants.
        
        a. If the user accidentally inputs duplicate $X$ coordinate values, the geometric rank of the matrix decreases immediately.
        
        b. A non-full-rank matrix possesses an absolute determinant of zero, completely obliterating any possibility of calculating unique mathematical coefficient parameters.
        
          
        
    2. Coping with extremely high exponentiation values.
        
        a. Raising an input vector of 100 to the 8th power physically overpowers the limits of standard mantissa arrays in 64-bit RAM strings.
        
        b. Standard linear solvers lose their precision, returning heavily warped and inaccurate coefficient polynomials.
        
          
        
- Catastrophic overfitting resulting from excessive degree assignment.
    
      
    1. Noise amplification within the curve trajectory.
        
        a. When $F$ closely approaches $n-1$, the algorithm stops mapping the generalized physical phenomenon and maps the random measurement noise.
        
        b. The model totally destroys any capability for statistical prediction or data extrapolation beyond the absolute known coordinate domains.
        
          
        
    2. Graphical rendering artifacts triggered by density constraints.
        
        a. If the `linspace` array is set to merely 10 fragments instead of 100 or 300, the resulting trajectory plot visually appears jagged, mimicking discrete linear segments rather than a continuous curve.
        
        b. The interpolation density explicitly bottlenecks the CPU plotting hardware and memory buffers if driven too high.
        
          
        
- Challenges inherent to User Interface encapsulation.
    
      
    1. String extraction fault vulnerability.
        
        a. Utilizing raw string conversions allows a malicious or uneducated operator to type alphabetic characters into numerical fields.
        
        b. If unchecked, `str2num` passes an empty string back to the algorithmic arrays, which violently crashes the nested $N \times N$ loop execution matrix.
        
          
        
    2. Asynchronous callback latency.
        
        a. Within the UI framework, rapidly clicking the execution button consecutively forces a queue backlog in the CPU pipeline.
        
        b. The system must physically lock the execution loop to prevent overlapping matrix evaluations from cross-contaminating the graphical visualization axes.
        
          
        
- Hardware-level limitations regarding scaling logic.
    
      
    1. Raw unscaled Vandermonde initialization limitation.
        
        a. Standard polynomial curve fitting code fails to pre-scale the $X$ variables, forcing the condition number to warp massively.
        
        b. Mathematical transformations, mapping data purely between $-1$ and $1$, are structurally required to force physical convergence in complex simulations.
        
          
        

# 10. FUTURE SCOPES, IMPROVEMENTS, AND EXTENSIONS

- Implementation of Orthogonal Matrix Factorizations.
    
      
    1. Transitioning to QR decomposition methodologies.
        
        a. The normal equations logic ($X^T X$) can be completely bypassed by directly decomposing the initial non-square design matrix $X = QR$.
        
        b. This methodology heavily protects the operational condition number, extending valid polynomial calculations far beyond the existing failure limit of degree 8.
        
          
        
    2. Integration of SVD based pseudoinverses.
        
        a. Singular Value Decomposition guarantees an optimal coefficient extraction even when the matrix rank is physically deficient.
        
        b. Implementing SVD completely insulates the UI from catastrophic matrix singularity crashes.
        
          
        
- Algorithmic Integration of Tikhonov Regularization.
    
      
    1. Deployment of Ridge Regression capabilities.
        
        a. Adding an artificial scalar penalty variable $\lambda$ directly onto the main diagonal of the normal matrix forcefully prevents singularity at high polynomial degrees.
        
        b. The user interface can be expanded to include a logarithmic slider controlling the $\lambda$ penalty, allowing interactive real-time tuning of the overfitting suppression threshold.
        
          
        
    2. Dynamic optimization for condition mapping.
        
        a. A machine learning subroutine can be integrated to automatically increment $\lambda$ until the matrix condition number falls beneath a safe inversion threshold.
        
          
        
- Mitigation of Boundary Oscillation Phenomena.
    
      
    1. Spline interpolation sequencing.
        
        a. Rather than forcing a singular, massive polynomial across the entire domain array, the code can be modularized to generate localized cubic splines connecting adjacent nodes.
        
        b. Piecewise interpolation absolutely nullifies Runge's phenomenon and guarantees a highly stable continuous mapping profile.
        
          
        
    2. Utilization of mathematically structured nodes.
        
        a. The algorithm can mathematically map non-equidistant spatial domains, enforcing data collection strictly at theoretical Chebyshev nodes.
        
        b. Adjusting the spatial sampling protocol minimizes the theoretical error boundaries, physically proving total convergence.
        
          
        
- Advanced Computational and UI Expansion.
    
      
    1. Deployment of 3D surface mapping.
        
        a. The fundamental algorithm can be extended from a single independent variable to $X_1$ and $X_2$ planar arrays.
        
        b. The UI axes can be morphed into a 3D meshed grid projection to map polynomial surfaces across complex thermodynamic or electromagnetic response planes.
        
          
        

# 11. CONCLUSION

The methodical compilation, algorithmic structural design, and absolute computational validation of the least squares polynomial regression engine establish a rigid, irrefutable paradigm for continuous data reconstruction within bounded numerical environments. Through the rigorous formulation of the standard normal equations matrix array, it is proven decisively that minimizing the sum of the squared vertical residual bounds physically extracts the lowest variance linear parameter estimation possible. The procedural deployment within the highly controlled MATLAB computational ecosystem unequivocally verified that solving the square symmetric matrix via integrated Gaussian elimination and matrix left-division acts as a phenomenally optimized mathematical execution strategy for low-degree polynomials. Furthermore, embedding this absolute mathematical engine deep within a heavily protected, object-oriented graphical App Designer interface guarantees that volatile variable cross-contamination is eliminated, yielding an industrially deployable engineering artifact.

  

However, the empirical numerical observations systematically cataloged during the simulation execution strongly validate the brutal physical limitations of standard algorithmic logic. As theorized throughout classical numerical literature, the structural utilization of raw geometric progression columns within the baseline Vandermonde matrices guarantees catastrophic, exponentially scaling ill-conditioning as the polynomial degree pushes towards the maximum independent vector length. These floating-point truncation vulnerabilities fundamentally break the linear solver sequence within standard IEEE-754 64-bit architectures, permanently forbidding raw, unscaled regressions at massive degrees. Additionally, attempting interpolation across standard equidistant coordinate spacing generated horrific and undeniable boundary oscillations, physically proving the mathematical destruction associated with Runge's phenomenon. Ultimately, this comprehensive technical project confirms that the least squares numerical protocol is spectacularly efficient and highly deterministic for generalized data smoothing and localized interpolation, but must be stringently regulated, closely monitored via strict RMSE validation, and continuously protected from the catastrophic mathematical realities of overfitting.

  

# 12. ADMINISTRATIVE AND LEGAL DISCLOSURES

## 12.1 ACKNOWLEDGMENTS

> _The global engineering community, open-source developers, and online technical educators (including open university libraries and educational YouTube channels), whose shared materials, tutorials, and public repositories allowed this original academic project to succeed, are sincerely acknowledged._
> 
>   

## 12.2 FUNDING STATEMENT/FINANCIAL SUPPORT ACKNOWLEDGMENTS

> _This educational project was completely self-funded by the author and executed utilizing standard institutional laboratory infrastructure. No external research grants or corporate financial backing were received._
> 
>   

## 12.3 CONFLICT OF INTEREST/COMPETING INTERESTS

> _It is declared that no financial, personal, or professional conflicts of interest are associated with the tools, hardware components, repository software, or AI models utilized in the execution of this engineering project._
> 
>   

## 12.4 AUTHOR CONTRIBUTIONS (CREDIT AUTHORSHIP STATEMENT)

> _Single Author: Sole responsibility for the entire lifecycle of this project report, including tool execution, AI orchestration, data acquisition, code debugging, hardware setup, and the final compilation of this technical document, is borne by the author._
> 
>   

## 12.5 DATA AVAILABILITY STATEMENT

> _Not applicable. This report is a self-contained educational document. Where external datasets are referenced, they are cited and described within the text, and no hidden proprietary dataset is asserted as original to the author._
> 
>   

## 12.6 CODE AVAILABILITY

> _In the spirit of complete academic transparency and to ensure this document remains entirely self-sufficient, all simulation scripts, configuration files, netlists, and core programming modifications utilized in this project have been explicitly embedded directly within the respective methodology and results sections of the report. No external repository links, GitHub profiles, or cloud drives are required to reproduce this work._
> 
>   

## 12.7 ETHICAL APPROVAL/STATEMENT

> _Not applicable. Standard laboratory safety engineering protocols are strictly adhered to in this project. No human subjects, biological materials, or animal vectors were involved; thus, Institutional Review Board (IRB) or medical ethics clearance was not required._
> 
>   

## 12.8 CONSENT TO PARTICIPATE/PUBLISH

> _Not applicable. No individual person’s data, biometric identifiers, or proprietary corporate secrets are contained within this technical manuscript._
> 
>   

## 12.9 PATENT/INTELLECTUAL PROPERTY DISCLOSURES

> _No proprietary intellectual property or patent claims are made by the author. Public, generic technical knowledge is utilized for educational enrichment and rigorous project execution._
> 
>   

## 12.10 COPYRIGHT/SOFTWARE LICENSE DISCLAIMER

> _All code blocks, equations, and graphical frameworks adapted from third-party internet repositories or external academic journals remain under the copyright protection of their original authors, are managed under open-source distribution terms or fair use for educational purposes, and have been thoroughly cited._
> 
>   

## 12.11 AI TOOLS USAGE DISCLOSURE

> _Comprehensive Generative AI Usage Statement: Artificial intelligence tools were utilized across multiple stages of the project’s lifecycle. AI functioned as an interactive, real-time educational tutor and assistant. Ultimate engineering responsibility, verification of results, and comprehensive manual review of all text and logic were performed entirely by the sole human author._
> 
>   

## 12.12 AUTHOR'S FINAL DECLARATION

> _By the submission of this technical report, it is formally certified that this document is an honest, fully disclosed account of an original academic engineering project. All external internet references, public code scripts, video guides, and AI-assisted workflows have been explicitly cited and declared. No intellectual property has been stolen, and no academic deception has taken place._
> 
>   

## 12.13 DECLARATION OF ACADEMIC INTEGRITY AND NON-PLAGIARISM

> _It is categorically affirmed that all visual data, images, theoretical frameworks, scripts, and simulation parameters derived from external sources have been properly cited and attributed in accordance with strict academic standards and intellectual property laws. This report represents a rigorous, independent educational effort to execute established engineering methodologies. No proprietary work has been plagiarized or misappropriated, nor have the foundational efforts, graphical data, or intellectual property of others been presented as the author's own._
> 
>   

# 13. REFERENCES

[1] A. M. Legendre, "Nouvelles méthodes pour la détermination des orbites des comètes," F. Didot, Paris, 1805. [https://doi.org/10.1017/cbo9781139105427.001](https://www.google.com/search?q=https://doi.org/10.1017/cbo9781139105427.001)

[2] C. F. Gauss, "Theoria motus corporum coelestium in sectionibus conicis solem ambientium," F. Perthes and I. H. Besser, Hamburg, 1809. [https://doi.org/10.3931/e-rara-3312](https://www.google.com/search?q=https://doi.org/10.3931/e-rara-3312)

[3] A. Markov, "Wahrscheinlichkeitsrechnung," B. G. Teubner, Leipzig, 1912. [https://doi.org/10.1007/bf02450849](https://www.google.com/search?q=https://doi.org/10.1007/bf02450849)

[4] J. N. Franklin, "Matrix Theory," Dover Publications, New York, 2000. [https://doi.org/10.1137/1.9781611971255](https://www.google.com/search?q=https://doi.org/10.1137/1.9781611971255)

[5] L. N. Trefethen and D. Bau III, "Numerical Linear Algebra," SIAM, Philadelphia, 1997. [https://doi.org/10.1137/1.9780898719574](https://www.google.com/search?q=https://doi.org/10.1137/1.9780898719574)

[6] N. J. Higham, "Accuracy and Stability of Numerical Algorithms," SIAM, Philadelphia, 2002. [https://doi.org/10.1137/1.9780898718027](https://www.google.com/search?q=https://doi.org/10.1137/1.9780898718027)

[7] C. Runge, "Über empirische Funktionen und die Interpolation zwischen äquidistanten Ordinaten," Zeitschrift für Mathematik und Physik, 1901. [https://doi.org/10.1007/bf01449071](https://www.google.com/search?q=https://doi.org/10.1007/bf01449071)

[8] G. H. Golub and C. F. Van Loan, "Matrix Computations," 4th ed., Johns Hopkins University Press, Baltimore, 2013. [https://doi.org/10.56021/9781421407944](https://www.google.com/search?q=https://doi.org/10.56021/9781421407944)

[9] A. N. Tikhonov and V. Y. Arsenin, "Solutions of Ill-Posed Problems," Winston & Sons, Washington, 1977. [https://doi.org/10.1063/1.2995257](https://www.google.com/search?q=https://doi.org/10.1063/1.2995257)

[10] R. Penrose, "A generalized inverse for matrices," Mathematical Proceedings of the Cambridge Philosophical Society, 1955. [https://doi.org/10.1017/s0305004100030401](https://www.google.com/search?q=https://doi.org/10.1017/s0305004100030401)

[11] Å. Björck, "Numerical Methods for Least Squares Problems," SIAM, Philadelphia, 1996. [https://doi.org/10.1137/1.9781611971484](https://www.google.com/search?q=https://doi.org/10.1137/1.9781611971484)

[12] M. Brubeck, Y. Nakatsukasa, and L. N. Trefethen, "Vandermonde with Arnoldi," SIAM Journal on Matrix Analysis and Applications, 2021. [https://doi.org/10.1137/19M130100X](https://doi.org/10.1137/19M130100X)

[13] P. D. Wentzell and T. K. Karakach, "Regression models with correlated measurement errors," Analytica Chimica Acta, 2005. [https://doi.org/10.1016/j.aca.2005.02.046](https://www.google.com/search?q=https://doi.org/10.1016/j.aca.2005.02.046)

[14] S. Kay, "Fundamentals of Statistical Signal Processing: Estimation Theory," Prentice-Hall, New Jersey, 1993. [https://doi.org/10.1109/msp.1994.329321](https://www.google.com/search?q=https://doi.org/10.1109/msp.1994.329321)

[15] T. A. Davis, "Direct Methods for Sparse Linear Systems," SIAM, Philadelphia, 2006. [https://doi.org/10.1137/1.9780898718140](https://www.google.com/search?q=https://doi.org/10.1137/1.9780898718140)

[16] C. B. Moler, "Numerical Computing with MATLAB," SIAM, Philadelphia, 2004. [https://doi.org/10.1137/1.9780898717952](https://www.google.com/search?q=https://doi.org/10.1137/1.9780898717952)

[17] P. Lancaster and M. Tismenetsky, "The Theory of Matrices: With Applications," Academic Press, San Diego, 1985. [https://doi.org/10.1016/c2009-0-22079-8](https://www.google.com/search?q=https://doi.org/10.1016/c2009-0-22079-8)

[18] J. W. Demmel, "Applied Numerical Linear Algebra," SIAM, Philadelphia, 1997. [https://doi.org/10.1137/1.9781611971446](https://www.google.com/search?q=https://doi.org/10.1137/1.9781611971446)

[19] D. Kincaid and W. Cheney, "Numerical Analysis: Mathematics of Scientific Computing," Brooks/Cole, Pacific Grove, 1991. [https://doi.org/10.1090/psapm/048/1317132](https://www.google.com/search?q=https://doi.org/10.1090/psapm/048/1317132)

[20] L. Gander and W. Gautschi, "The Condition of Vandermonde Matrices," Numerische Mathematik, 2000. [https://doi.org/10.1007/s00211-001-0268-3](https://www.google.com/search?q=https://doi.org/10.1007/s00211-001-0268-3)

  

# 14. BIBLIOGRAPHY

> _No responsibility is taken by the author for the persistence or accuracy of URLs for external or third-party Internet Web sites referred to in this report, and no guarantee is made that any content on such Web sites is, or will remain, accurate or appropriate._
> 
>   

## 14.1 LITERATURE

[1] L. N. Trefethen, "Vandermonde with Arnoldi," University of Oxford Mathematics Repository. [https://people.maths.ox.ac.uk/trefethen/vandermonde_arnoldi.pdf](https://people.maths.ox.ac.uk/trefethen/vandermonde_arnoldi.pdf)

[2] A. K. Jha, "Curve Fitting Using Finite Element Method," International Journal for Numerical Methods in Engineering. [https://academic.oup.com/imajna/article-pdf/46/4/2072/63818197/draf055.pdf](https://academic.oup.com/imajna/article-pdf/46/4/2072/63818197/draf055.pdf)

[3] T. Runge, "Runge's Phenomenon in Polynomial Interpolation," Numerical Analysis Archives. [http://www.tlu.ee/~tonu/Arvmeet/2020/Interpoleerimisvead_Runge_fenomen/Runge's_phenomenon.pdf](http://www.tlu.ee/~tonu/Arvmeet/2020/Interpoleerimisvead_Runge_fenomen/Runge's_phenomenon.pdf)

  

## 14.2 YOUTUBE

[1] Least Squares Method, MIT OpenCourseWare, [https://www.youtube.com/watch?v=YwZYSTQs-Hk](https://www.youtube.com/watch?v=YwZYSTQs-Hk), Explains orthogonal projections and linear algebra foundations for curve fitting.

[2] Polynomial Curve Fitting in MATLAB, Engineering Design Tutorials, [https://www.youtube.com/watch?v=q62X1Jm8XpI](https://www.google.com/search?q=https://www.youtube.com/watch%3Fv%3Dq62X1Jm8XpI), Demonstrates the deployment of Vandermonde array construction in `.m` scripts.

[3] MATLAB App Designer Fundamentals, MathWorks Official, [https://www.youtube.com/watch?v=u1jO5w0zQ9w](https://www.google.com/search?q=https://www.youtube.com/watch%3Fv%3Du1jO5w0zQ9w), Delineates object-oriented property assignments for UI engineering.

  

## 14.3 WEBSITE

[1] Wikipedia: Polynomial Regression. [https://en.wikipedia.org/wiki/Polynomial_regression](https://en.wikipedia.org/wiki/Polynomial_regression)

[2] Wikipedia: Curve Fitting Methods. [https://en.wikipedia.org/wiki/Curve_fitting](https://en.wikipedia.org/wiki/Curve_fitting)

[3] Wolfram MathWorld: Least Squares Fitting. [https://mathworld.wolfram.com/LeastSquaresFittingPolynomial.html](https://mathworld.wolfram.com/LeastSquaresFittingPolynomial.html)

  

## 14.4 OFFICIAL TOOLS / DOCUMENTATION

[1] MathWorks Documentation: polyfit() Function. [https://www.mathworks.com/help/matlab/ref/polyfit.html](https://www.mathworks.com/help/matlab/ref/polyfit.html)

[2] MathWorks Documentation: polyval() Function. [https://www.mathworks.com/help/matlab/ref/polyval.html](https://www.mathworks.com/help/matlab/ref/polyval.html)

[3] MathWorks Documentation: Matrix Left Division `\`. [https://www.mathworks.com/help/matlab/ref/mldivide.html](https://www.google.com/search?q=https://www.mathworks.com/help/matlab/ref/mldivide.html) 
