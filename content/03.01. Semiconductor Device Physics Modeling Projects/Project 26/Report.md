## Project: 2D Vertical 4H-SiC Power Schottky Barrier Diode (Breakdown Trade-Offs)

## 1. Project Statement / Summary

Evaluate the fundamental design trade-offs between low forward voltage drop and high reverse breakdown voltage in wide-bandgap power electronics by constructing a 2D vertical 4H-SiC Schottky Barrier Diode (SBD). The simulation maps the forward thermionic emission current, monitors the internal electric field distribution under reverse bias, and tracks high-voltage avalanche failure thresholds.

## 2. Required Device Architecture & Materials

- 2D Vertical 4H-SiC Substrate Layout: Active drift region length $L_{\text{drift}} = 10\ \mu\text{m}$. Symmetrical lateral cell width is fixed at a coarse 2.0 μm to conserve node counts.
- Doping Profiles: Low-doped n-type 4H-SiC drift layer (doped with Nitrogen at 5 × 10¹⁵ cm⁻³), terminating on a highly doped n⁺ substrate cathode layer (1 × 10¹⁹ cm⁻³).
- Anode Interface: Schottky contact configuration assigned a baseline metal barrier height = 1.2 eV.

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Mesh (`smesh`) with coarse grid parameters across the bulk drift region to protect RAM limits, combined with a highly dense horizontal mesh layer right along the Schottky anode interface boundary.
- Sentaurus Device (`sdevice`) using specialized wide-bandgap ionization coefficients.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Recombination(
    SRH(DopingDep)
    * Activate advanced avalanche ionization mechanics for 4H-SiC
    Avalanche( Okuto )
  )
}
Physics(Name="anode") { Thermionic }
```

## 5. Simulation Type & Execution Pipeline

- Dual-Branch Quasistationary Sweeps: Run a forward bias anode sweep from 0.0 V to 1.5 V to capture turn-on characteristics. In a separate simulation node, ramp the reverse cathode voltage deeply until avalanche multiplication triggers current runaway.

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Extract the forward knee voltage drop ($V_F$) and map the maximum breakdown voltage asymptote ($V_{BR}$) on a semi-log current scale. Plot the internal electric field profile along the drift layer under high reverse bias to inspect the field gradients.
- Target Performance: Achieve a reverse breakdown voltage threshold exceeding $V_{BR} \ge 1200\text{ V}$ while maintaining a low forward conduction drop ($V_F \le 1.0\text{ V}$ at 100 A/cm²), verifying the performance advantages of wide-bandgap 4H-SiC architectures.

---
