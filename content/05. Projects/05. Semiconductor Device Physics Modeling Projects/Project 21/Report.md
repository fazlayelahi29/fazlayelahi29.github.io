## Project: 2D Symmetrical Double-Gate FinFET Cross-Section (Short-Channel Scaling)

## 1. Project Statement / Summary

Quantify the suppression of short-channel effects (SCE) in a scaled multigate transistor relative to a planar bulk MOSFET by simulating a highly optimized 2D horizontal cross-sectional plane sliced through the middle of a 14 nm FinFET architecture. This 2D model captures the critical dual-gate side-wall electrostatic squeeze across a thin silicon fin body. This approach bypasses heavy 3D mesh matrices while resolving threshold-voltage roll-off, drain-induced barrier lowering (DIBL), and subthreshold swing compression.

## 2. Required Device Architecture & Materials

- Silicon Fin Channel Film (2D Symmetrical Double-Gate Slicing): Equivalent physical fin thickness $W_{\text{fin}} = 8\text{ nm}$, gate length $L_G = 14\text{ nm}$, equivalent gate oxide thickness EOT = 0.8 nm.
- Doping Profiles: Symmetrically placed, highly doped n⁺ source/drain extensions (1 × 10²⁰ cm⁻³) terminating abruptly against a nearly intrinsic or lightly doped p-type channel fin core (1 × 10¹⁵ cm⁻³).

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Structure Editor (`sde`) & Sentaurus Mesh (`smesh`) for axis-aligned 2D tensor mesh creation.
- Sentaurus Device (`sdevice`) & Sentaurus Visual (`svisual`) for coupled solver sweeps and field mapping.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Recombination( SRH(DopingDep) )
  Mobility( DopingDep HighFieldSaturation Enormal )
  Bandgap( OldSlotboom )
}
```

- _Quantum Correction Addendum:_ Insert `DensityGradient` or `eQuantumPotential` to track carrier distribution offsets away from the rough oxide interface walls.

## 5. Simulation Type & Execution Pipeline

- Quasistationary DC Sweeps: Run two parallel gate voltage transfer loops ($V_{GS} = 0.0\text{ V}$ to 0.8 V): first at a linear low drain bias ($V_{DS} = 0.05\text{ V}$) and second at full saturation bias ($V_{DS} = 0.8\text{ V}$).

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Plot semi-log and linear $I_D$--$V_{GS}$ profiles. Extract the subthreshold swing (SS) and DIBL.
- Target Performance: Maintain a steep subthreshold swing (SS < 70 mV/decade) and compressed DIBL (< 50 mV/V), verifying superior multi-gate electrostatic control.

---
