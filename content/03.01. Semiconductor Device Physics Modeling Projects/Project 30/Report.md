## Project: 2D Planar NPN BJT (Heavy Emitter Doping & Bandgap Narrowing)

## 1. Project Statement / Summary

Evaluate the impacts of heavy doping-dependent material non-idealities on bipolar transport mechanics by simulating a 2D planar NPN Bipolar Junction Transistor (BJT). When the emitter region is heavily doped to maximize injection efficiency, the severe carrier concentration triggers band-edge merging, narrowing the forbidden bandgap ($E_g$). This simulation runs comparative Gummel plots with and without bandgap narrowing models active to isolate and evaluate the resulting reduction in common-emitter current gain.

## 2. Required Device Architecture & Materials

- 2D Planar Cross-Sectional BJT Canvas: Total structure width = 5 μm, vertical layout depth = 3 μm.
- Doping Profiles: Heavily doped n-type emitter pocket ($N_E = 1 \times 10^{19}\text{ cm}^{-3}$), a thin p-type base layer ($N_B = 5 \times 10^{17}\text{ cm}^{-3}$), and a moderately doped n-type collector region ($N_C = 1 \times 10^{16}\text{ cm}^{-3}$).

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Structure Editor (`sde`) with highly refined horizontal grid layouts spanning across the thin base interface region.
- Sentaurus Device (`sdevice`) & Sentaurus Inspect (`inspect`) for overlaying multiple model runs.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Mobility( DopingDep HighFieldSaturation )
  Recombination( SRH(DopingDep) Auger )
  * Toggle variable for comparative evaluation loops
  Bandgap( OldSlotboom )
}
```

## 5. Simulation Type & Execution Pipeline

- Comparative DC Gummel Sweeps: Ground the collector and emitter contacts ($V_{CE} = 2.0\text{ V}$), and execute a base-emitter voltage loop sweep ($V_{BE} = 0.0\text{ V}$ to 0.9 V). Run this simulation sequence twice: first with the `OldSlotboom` model active, and second with it disabled.

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Plot the collector current ($I_C$) and base current ($I_B$) profiles together on a semi-log scale to construct the classic Gummel plot configuration. Compute the common-emitter current gain ($\beta = I_C / I_B$) across the voltage sweep.
- Target Performance: Observe a noticeable upward shift in the base current profile ($I_B$) when bandgap narrowing is activated, leading to a significant drop in peak current gain (β) and demonstrating the performance limits of heavily doped emitter regions.

---
