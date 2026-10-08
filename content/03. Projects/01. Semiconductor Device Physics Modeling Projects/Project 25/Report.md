## Project: 1D Vertical AlGaN/GaN Heterostructure (Polarization & 2DEG Physics)

## 1. Project Statement / Summary

Examine the spontaneous and piezoelectric polarization mechanics, band offsets, and sheet carrier densities that govern wide-bandgap heterostructures by simulating a 1D vertical AlGaN/GaN HEMT stack. This 1D model avoids heavy 2D/3D mesh matrices while capturing the formation of a high-density Two-Dimensional Electron Gas (2DEG) inside a sharp triangular quantum well without requiring intentional material doping.

## 2. Required Device Architecture & Materials

- 1.5D Vertical Heterostructure Stack Canvas: An upper layer of $\text{Al}_{0.25}\text{Ga}_{0.75}\text{N}$ (25 nm thick barrier layer) deposited directly over a thick GaN substrate/buffer layer (1.5 μm thick).
- Doping Profiles: Both wide-bandgap layers are kept entirely intrinsic or lightly n-type background doped (1 × 10¹⁴ cm⁻³).

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Device (`sdevice`) leveraging advanced multi-material parameters for group-III nitrides.
- Sentaurus Visual (`svisual`) for high-resolution vertical band-edge profiling.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  * Activate spontaneous and piezoelectric crystal strain models
  Piezoelectricity( Polarization Strain )
  Recombination( SRH )
}
Math {
  * Highly recommended flag to handle wide bandgap convergence limits
  ExtendedPrecision
}
```

## 5. Simulation Type & Execution Pipeline

- Static Thermodynamic Equilibrium Solver: Compute the zero-bias self-consistent potential matrix to capture polarization charge sheets at the heterostructure boundary interface.

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Map the conduction band energy profile vertically through the heterointerface to inspect the triangular potential well. Integrate the electron concentration across the well interface layer to extract the total 2DEG sheet density ($n_{2D}$):  
    $$n_{2D} = \int_{\text{interface}} n(z) \cdot dz$$
- Target Performance: Extract a stable, high-density 2DEG sheet concentration plateau exceeding $n_{2D} \ge 1 \times 10^{13}\text{ cm}^{-2}$ at the abrupt AlGaN/GaN interface, validating polarization modeling accuracy.

---
