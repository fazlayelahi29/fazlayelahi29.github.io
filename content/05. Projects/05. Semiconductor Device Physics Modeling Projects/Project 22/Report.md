## Project: 1D Cylindrical Coordinate Nanowire GAA FET (Volume Inversion Physics)

## 1. Project Statement / Summary

Examine quantum confinement mechanics and map the transition from standard surface inversion to true volume inversion by modeling a Gate-All-Around (GAA) nanowire transistor using a 1D Cylindrical Radial Coordinate Mesh Engine. By solving the coupled physical equations across a single radial coordinate axis (r), this setup avoids 3D multi-axis overhead while proving that the inversion carrier density peak migrates from the dielectric interface directly into the structural center of the wire as the diameter scales downward.

## 2. Required Device Architecture & Materials

- Cylindrical Silicon Nanowire (Radial 1D Mapping Canvas): Run an automated parameter table tracking wire diameters D = 10 nm, 7 nm, and 5 nm. Surrounding gate oxide thickness is fixed at 1.0 nm.
- Doping Profiles: Uniform, near-intrinsic p-type background channel doping (1 × 10¹⁴ cm⁻³) to isolate pure electrostatic inversion properties.

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Structure Editor (`sde`) via specialized cylindrical 1D coordinate commands.
- Sentaurus Device (`sdevice`) & Sentaurus Inspect (`inspect`) for radial macro calculation loops.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Recombination( SRH(DopingDep) )
  * Mandatory multi-dimensional quantum confinement correction
  DensityGradient( eQuantumPotential )
}
```

## 5. Simulation Type & Execution Pipeline

- Radial Equilibrium and Inversion DC Sweeps: Solve for 1D radial electrostatics across a gate voltage range from flat-band up to a strong inversion state ($V_{GS} = 1.0\text{ V}$).

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Extract spatial carrier profiles n(r) across the radius. Formulate a mathematical macro within `inspect` to isolate the charge centroid shift ($r_c$):  
    $$r_c = \frac{\int_0^R n(r) \cdot r \cdot dr}{\int_0^R n(r) \cdot dr}$$
- Target Performance: For the 5 nm diameter wire, verify that the peak of the electron density profile shifts completely to the center point (r = 0), providing numerical proof of volume inversion.

---
