## Project: 2D Planar Steep-Slope Tunnel FET (Band-to-Band Tunneling)

## 1. Project Statement / Summary

Simulate a gated, non-equilibrium 2D planar Tunnel Field-Effect Transistor (TFET) that breaks the classical thermionic subthreshold limit of 60 mV/decade at room temperature. The design uses an asymmetric p⁺-i-n⁺ profile where carrier injection is controlled by gate-modulated quantum mechanical band-to-band tunneling (BTBT) across a collapsed source-channel energy barrier.

## 2. Required Device Architecture & Materials

- 2D Planar Silicon Channel Canvas: Gate length $L_G = 30\text{ nm}$, gate dielectric layer thickness = 2.0 nm.
- Doping Profiles: Heavily doped p-type source region (Boron, 1 × 10²⁰ cm⁻³), an ultra-low-doped intrinsic channel body (1 × 10¹⁵ cm⁻³), and a highly doped n-type drain region (Phosphorus, 1 × 10¹⁹ cm⁻³).

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Structure Editor (`sde`) with heavy horizontal grid refinement localized precisely at the abrupt p⁺-channel source interface window.
- Sentaurus Device (`sdevice`) executing highly stable direct matrix solvers.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Bandgap( OldSlotboom )
  Recombination(
    SRH(DopingDep)
    * Activate the non-local Kane band-to-band tunneling formulation
    Band2Band( Model=Kane )
  )
}
```

## 5. Simulation Type & Execution Pipeline

- Steady-State Logarithmic Transfer Sweeps: Perform gate voltage transfer ramps from 0.0 V to 1.0 V at a constant drain voltage bias ($V_{DS} = 0.5\text{ V}$).

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Plot the transfer curve on a semi-log scale to calculate the minimum subthreshold swing ($SS_{\text{min}}$). Load the data into `svisual` to plot energy band profiles along the channel direction, tracking the alignment of the valence and conduction bands.
- Target Performance: Achieve a subthreshold swing slope below the thermionic limit (SS < 45 mV/decade) across at least two decades of current turn-on.

---
