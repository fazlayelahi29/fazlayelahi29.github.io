## Project: Electrothermal Coupled 2D LDMOS (Self-Heating & Hotspots)

## 1. Project Statement / Summary

Examine the physical coupling between current flow, electrical degradation, and localized power dissipation by evaluating an electrothermal 2D Lateral Double-Diffused MOSFET (LDMOS). High current densities under sustained bias generate significant Joule heating, which locally raises lattice temperatures and reduces carrier mobility. This simulation couples electrical transport equations with thermodynamic heat equations to isolate and map the drain-side hotspot zone.

## 2. Required Device Architecture & Materials

- 2D Planar LDMOS Layout Canvas: Active channel length under the gate = 1.5 μm, extended n-type drift region spacing = 4.0 μm.
- Thermal Boundary Conditions: A dedicated thermal contact is assigned along the base edge of the substrate block, acting as an ideal external copper heat sink held at a fixed temperature boundary ($T_L = 300\text{ K}$).

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Structure Editor (`sde`) with specialized grid refinement windows positioned across the high-field drain-side field plate drift boundary.
- Sentaurus Device (`sdevice`) executing fully coupled electrothermal solvers.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Recombination( SRH(DopingDep) )
  Mobility( DopingDep Enormal HighFieldSaturation )
}
Solve {
  * Activate thermodynamic heat equations globally
  Coupled { Poisson Electron Hole Thermodynamic }
}
```

## 5. Simulation Type & Execution Pipeline

- High-Bias Electrothermal Output Sweeps: Fix the gate voltage to a strong on-state condition ($V_{GS} = 5.0\text{ V}$) and sweep the drain voltage from 0.0 V to 20.0 V using the coupled thermodynamic solver matrix.

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Plot and compare the $I_D$--$V_{DS}$ characteristics with and without the `Thermodynamic` thermal solver activated to isolate self-heating effects. Load the high-bias output file into `svisual` to inspect the 2D lattice temperature contour map ($T_L$) and pinpoint the exact hotspot location.
- Target Performance: Observe a distinct negative differential conductance (current roll-off) at high drain biases on the thermodynamic curve, directly linked to a localized temperature spike exceeding $T_L \ge 420\text{ K}$ at the drain-side gate edge.

---
