## Project: 2D Uniformly Doped Junctionless Accumulation-Mode Transistor

## 1. Project Statement / Summary

Evaluate the depletion physics and conduction mechanics of a 2D planar junctionless accumulation-mode transistor. Unlike standard devices, this structure eliminates metallurgical junctions entirely, using a single uniform doping concentration from source to drain. The design uses a high-workfunction metal gate to fully deplete the heavily doped thin silicon channel film at zero bias, restoring conduction by driving the channel into accumulation under a positive gate voltage.

## 2. Required Device Architecture & Materials

- Thin-Film Silicon 2D Strip Geometry: Active channel film thickness = 8 nm, gate length $L_G = 20\text{ nm}$, gate insulator thickness = 1.5 nm.
- Doping Profiles: Symmetrically uniform n-type Phosphorus doping throughout the source, channel, and drain regions, fixed at a heavy baseline of 1 × 10¹⁹ cm⁻³.
- Gate Material: Symmetrical top/bottom gate contacts assigned a heavy platinum-type high workfunction ($\Phi_M = 5.1\text{ eV}$).

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Mesh (`smesh`) utilizing fine, uniform vertical mesh spacing (Δ y = 0.5 nm) across the thin film.
- Sentaurus Device (`sdevice`) evaluating uncoupled depletion electrostatics.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Mobility( DopingDep Enormal )
  Bandgap( OldSlotboom )
  Recombination( SRH(DopingDep) )
}
```

## 5. Simulation Type & Execution Pipeline

- Static Zero-Bias Control and Transfer Sweeps: First, compute a zero-bias equilibrium solution ($V_{GS} = 0.0\text{ V}$) to verify full channel depletion. Then, run a gate voltage sweep from -0.5 V up to +1.0 V at a fixed drain linear bias of 50 mV.

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Map the 2D spatial electrostatic potential profile at zero bias to verify complete depletion. Plot the linear $I_D$--$V_{GS}$ curve to extract the accumulation-mode turn-on threshold.
- Target Performance: Confirm an extremely low off-state current floor ($I_{\text{off}} < 1\times 10^{-11}\text{ A}$) at $V_{GS} = 0.0\text{ V}$, demonstrating effective electrostatic shutoff of a junctionless channel.

---
