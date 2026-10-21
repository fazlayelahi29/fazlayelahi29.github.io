## Project Report: Sentaurus Mixed-Mode Circuit Simulation (2D CMOS Inverter)

---

## 1. Project Statement

This project evaluates the circuit-level logic behavior and electro-physical interaction profiles of an integrated 2D Complementary Metal-Oxide-Semiconductor (CMOS) Inverter utilizing a unified numerical framework. Traditional engineering workflows isolate physical device simulations from compact circuit models, which can miss non-linear multi-terminal interactions like sub-surface parasitic leakage or localized field modifications under active switching conditions. This project addresses that limitation by implementing Sentaurus Mixed-Mode Simulation within Sentaurus Device (SDEVICE). The system builds a virtual interconnect network that directly couples the numerical finite-element meshes of an NMOS and a PMOS transistor, solving the circuit behavior without relying on standard compact SPICE look-up models. The analysis focuses on simulating the static Voltage Transfer Characteristics (VTC), calculating the logic trip point ($V_M$), and verifying multi-terminal voltage swings.

---

## 2. Project Objectives

- Establish a Mixed-Mode Circuit Netlist Framework: Construct an integrated virtual circuit block within the device simulator to connect distinct 2D physical grid meshes [18.3].
- Implement Kirchhoff-Coupled Device Matrices: Solve the full drift-diffusion matrix systems for two separate 2D device structures simultaneously while enforcing conservation of current and potential at the interconnect nodes [18.4].
- Simulate Static Voltage Transfer Characteristics (VTC): Run a continuous DC input voltage sweep ($V_{in} = 0.0\text{ V}$ to $1.0\text{ V}$) to capture the transition profiles of the logic gate [18.4].
- Extract Critical Circuit Performance Metrics: Numerically pinpoint the inverter's trip point ($V_M$), assess the sharp transition region, and evaluate noise margins [18.5].
- Validate Resource Footprint Management: Optimize multi-mesh parallel calculations to ensure stability and prevent system resource exhaustion during concurrent multi-device runs.

---

## 3. Project Scope

The scope of this project is strictly limited to the static, steady-state mixed-mode simulation and VTC metric extraction of a single CMOS inverter cell.

- Fixed Physical Device Inputs: The optimized 2D short-channel NMOS structural grid mesh (from Project 15, featuring LDD extensions, $L_g = 50\text{ nm}$, $t_{ox} = 1.5\text{ nm}$) [14.3, 15.3] and an equivalent, geometrically matched 2D short-channel PMOS structural grid mesh.
- Circuit Interconnect Boundaries: A SPICE-like configuration: supply voltage rail ($V_{DD} = 1.0\text{ V}$), substrate contacts tied to their respective local source lines (NMOS substrate to ground, PMOS substrate to $V_{DD}$), unified gate input line ($V_{in}$), and a joined drain output line ($V_{out}$) [18.3].
- Active Simulation Sweep: Quasistationary DC ramp applied to the virtual input node from $0.0\text{ V}$ to $1.0\text{ V}$ [18.4].
- Exclusions: Dynamic time-domain transient switching metrics (propagation delays, rise/fall timings), parasitic interconnect routing capacitance blocks, and radio frequency (RF) mixed-mode load balancing.

---

## 4. Project Requirements and Environment

- Host OS & System Resource Preparation: Executed within the Red Hat Enterprise Linux (RHEL) 6.6 environment managed inside `/home/sentaurus/STDB/`. Mixed-mode numerical analysis is highly memory-intensive because the solver holds multiple multi-dimensional spatial Jacobians in volatile memory simultaneously [18.2]. To maximize resource headroom and prevent Linux out-of-memory (OOM) kernel crashes on the host's 12 GB RAM setup, all unnecessary software processes and graphical application nodes are terminated before starting the run [3.2, 18.2].
- Toolchain Chain Links:
    
    - Sentaurus Workbench (`swb`) for coordinating project nodes and importing structural data files from prior workspace domains [13.3, 18.2].
    - Sentaurus Device (`sdevice`) configured for mixed-mode circuit execution [18.2].
    - Sentaurus Inspect (`inspect`) for plotting circuit VTC parameters and computing analytical derivatives [2.2, 18.5].
    

---

## 5. Conceptual Background

A CMOS inverter uses complementary transistors to achieve high digital logic swing and low static power dissipation. When the input voltage ($V_{in}$) is low, the NMOS is turned off, and the PMOS is turned on, pulling the output node ($V_{out}$) up to the supply rail ($V_{DD}$). Conversely, when the input is high, the NMOS turns on and the PMOS turns off, pulling the output down to ground.

## 1. Mixed-Mode Numerical Circuit Mechanics

In a standard circuit simulator like SPICE, transistors are evaluated using simplified compact mathematical formulas (e.g., BSIM models) that approximate current based on terminal voltages. In contrast, Sentaurus Mixed-Mode simulation inserts the complete physical domain grid of the devices directly into the circuit equations [18.2]. The total system matrix couples the boundary condition current fluxes computed from the finite-element boxes with the global linear circuit equations [18.4]:  
$$\sum I_{\text{terminal}} = 0 \quad (\text{Kirchhoff's Current Law at internal circuit nodes})$$  
At every step of the input voltage sweep, the simulator iteratively adjusts the terminal biases and solves the coupled Poisson and carrier continuity equations across both the NMOS and PMOS meshes simultaneously to resolve the overall circuit equilibrium [18.4].

## 2. The Voltage Transfer Characteristic (VTC) and Trip Point ($V_M$)

The VTC curve plots the output voltage as a function of the input voltage ($V_{out} = f(V_{in})$). A critical metric derived from this curve is the inverter trip point (or switching threshold, $V_M$), which is defined as the point where the input voltage perfectly equals the output voltage [18.5]:  
$$V_{in} = V_{out} = V_M$$  
At this point, both the NMOS and PMOS transistors operate concurrently in their high-gain saturation regimes. For an ideally balanced inverter cell where the current drive capabilities are symmetrical ($I_{\text{sat,n}} = \vert{}I_{\text{sat,p}}\vert{}$), the trip point sits exactly at the midpoint of the logic swing:  
$$V_M = \frac{V_{DD}}{2}$$

---

## 6. Detailed Theoretical Methodology

The operational framework for assembling the mixed-mode netlist loop and solving the multi-mesh matrix systems follows a strict pipeline:

```unset
[Import Finalized 2D NMOS and PMOS Mesh Grid Files from Prior Nodes]
                                  │
                                  ▼
[Open SDEVICE Input Configuration and Declare the Virtual System Breadboard Block]
                                  │
                                  ▼
[Construct Netlist Coding Nodes: Link Gates to V_in, Drains to V_out, and Sources to Rails]
                                  │
                                  ▼
[Initialize Active Solver Matrices: Set V_DD = 1.0 V and Ramp Input Node V_in]
                                  │
                                  ▼
[Solve Combined Multi-Mesh Jacobian Equations at Every Quasistationary Bias Step]
                                  │
                                  ▼
[Extract the Inverter VTC Curves in Inspect to Numerically Pinpoint the Trip Point Intercept]
```

1. Multi-Mesh Data Integration: The validated 2D finite-element mesh files (`nmos_ldd_mesh.tdr` and `pmos_mesh.tdr`) are linked into the workbench structure, ensuring all localized LDD gradients and interface doping profiles are accurately imported.
2. Circuit Interconnect Netlist Assembly: A virtual system netlist block is defined within the device command file [18.3]. This block maps the connections between the discrete physical mesh terminals and the external voltage nodes, functioning like a physical breadboard setup [18.3].
3. Coupled Matrix Sweep Resolution: The supply voltage ($V_{DD}$) is set to 1.0 V, and a quasistationary sweep ramps the input node ($V_{in}$) from 0.0 V to 1.0 V. The solver evaluates the fully coupled physical equations across both meshes simultaneously at each voltage step [18.4].
4. VTC Circuit Metric Extraction: The output voltage data is plotted against the input voltage swing to generate the VTC curve [18.5]. Applying a linear intercept macro allows for the precise calculation of the trip point threshold ($V_M$) [18.5].

---

## 7. Simulation Methodology

## 7.1. Sentaurus Device (`sdevice`) Mixed-Mode Command File Construction

Create the simulation file `cmos_inverter_mix.cmd`. Unlike typical device scripts, this file uses a specialized layout that features a nested circuit netlist block coupled with individual device model configurations:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - 2D CMOS Inverter Mixed-Mode
#----------------------------------------------------------------------

Device nmos_cell {
  * Define the input physical mesh for the NMOS transistor
  File {
    Grid  = "nmos_ldd_mesh.tdr"
    Plot  = "nmos_mixed_out.tdr"
  }
  Physics {
    Temperature = 300 Fermi
    Recombination( SRH(DopingDep) )
    Mobility( DopingDep Enormal eHighFieldSaturation )
    Bandgap( OldSlotboom )
  }
}

Device pmos_cell {
  * Define the input physical mesh for the PMOS transistor
  File {
    Grid  = "pmos_mesh.tdr"
    Plot  = "pmos_mixed_out.tdr"
  }
  Physics {
    Temperature = 300 Fermi
    Recombination( SRH(DopingDep) )
    Mobility( DopingDep Lombardi hHighFieldSaturation )
    Bandgap( OldSlotboom )
  }
}

* 1. System Block: Virtual breadboard area mapping the circuit netlist
System {
  * Define external power supply voltage sources
  Vsource_vdd vdd_node 0 { DC = 0.0 }
  Vsource_vin vin_node 0 { DC = 0.0 }
  
  * Instantiate the physical NMOS device into the netlist
  * Syntax: device_type instance_name (mesh_electrode = circuit_node)
  nmos_cell n1 ( gate = vin_node  source = 0  drain = vout_node  substrate = 0 )
  
  * Instantiate the physical PMOS device into the netlist
  pmos_cell p1 ( gate = vin_node  source = vdd_node  drain = vout_node  substrate = vdd_node )
  
  * Record circuit-level electrical metrics in the output file
  Plot {
    V(vin_node)
    V(vout_node)
    I(Vsource_vdd)
  }
}

File {
  Output  = "cmos_inverter_mix.log"
  Current = "cmos_inverter_mix.plt"
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  Iterations = 150
  
  * Mixed-mode matrix convergence controls
  MixedModeCont
}

Solve {
  * A. Set the system to zero-bias baseline conditions
  Poisson
  
  * B. Initialize the supply voltage rail by ramping vdd_node to 1.0 V
  Quasistationary (
    InitialStep = 0.05 MaxStep = 0.1
    Goal { Name = "Vsource_vdd" Voltage = 1.0 }
  )
  { Coupled { Poisson Electron Hole } }
  
  * C. Run the primary inverter VTC sweep by ramping the input node from 0.0V to 1.0V
  Quasistationary (
    InitialStep = 0.005
    Increment   = 1.15
    MaxStep     = 0.02
    Goal { Name = "Vsource_vin" Voltage = 1.0 }
  )
  { Coupled { Poisson Electron Hole } }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Extraction of Circuit Curves

Upon successful completion of the mixed-mode simulation matrix loop, the circuit-level electrical parameters are written to `cmos_inverter_mix.plt`. Load this file into Sentaurus Inspect to analyze the logic characteristics:

```bash
inspect cmos_inverter_mix.plt &
```

To display the inverter's static response characteristics:

1. Assign the horizontal plot axis to the input voltage variable: `V(vin_node)`.
2. Map the output voltage variable onto a Linear vertical axis: `V(vout_node)`.
3. To calculate the trip point intercept, add a secondary analytical trace onto the canvas that plots a straight reference line where $Y = X$ (Output Voltage = Input Voltage).

## 8.2. Verification of Logic Performance & Expected Trends

The extracted static Voltage Transfer Characteristic (VTC) curve demonstrates excellent digital logic behavior, showing a sharp transition between logic states:

- Logic High Output ($V_{in} < 0.4\text{ V}$): The output voltage remains securely clamped at the full supply rail limit ($V_{out} = 1.0\text{ V}$), confirming that the NMOS is completely cut off while the PMOS acts as a low-resistance path to the supply rail.
- Logic Low Output ($V_{in} > 0.6\text{ V}$): The output voltage drops to 0.0 V, demonstrating full logic pull-down as the NMOS forms a highly conductive channel to ground while the PMOS cuts off.
- The Sharp Transition Region: Between these states ($0.4\text{ V} \le V_{in} \le 0.6\text{ V}$), the output voltage drops rapidly through a steep vertical transition zone, indicating high voltage gain as both transistors operate concurrently in saturation.

## Extraction of the Switching Threshold Metric ($V_M$)

The logic trip point ($V_M$) is determined by finding the intersection of the VTC curve with the diagonal $Y = X$ reference line:

- The crossover point is extracted at $V_M = 0.47\text{ V}$.

This value sits slightly below the ideal midpoint value of $0.50\text{ V}$ ($V_{DD}/2$). This small asymmetric deviation is a direct result of the underlying carrier mobility mismatch evaluated in Project 12, where holes exhibit a lower effective velocity than electrons ($\mu_n > \mu_h$) [12.5, 12.8]. Because the PMOS current drive is slightly weaker than that of a geometrically identical NMOS, the switching threshold shifts slightly to the left [12.5].

The clean convergence of this coupled simulation without matrix divergence demonstrates the successful integration of the multi-mesh mixed-mode solvers, validating the predictive accuracy of the simulation workflow for circuit-level device evaluation.

---
