## Project: 2D Planar Two-Pixel CMOS Image Sensor (Optical Crosstalk)

## 1. Project Statement / Summary

Quantify the optoelectronic performance and optical isolation capabilities of an imaging array by simulating a 2D planar two-pixel CMOS Image Sensor (CIS) architecture. The project focuses on measuring minority carrier diffusion crosstalk between adjacent collection nodes. By illuminating only one pixel, the simulation tracks how much photogenerated charge diffuses laterally into the unilluminated neighboring pixel, evaluating the isolation effectiveness of a Deep Trench Isolation (DTI) structure.

## 2. Required Device Architecture & Materials

- Symmetrical Two-Pixel 2D Layout: Two adjacent pixels (5 μm × 5 μm area each) separated by a centralized, 2 μm deep Silicon Dioxide Deep Trench Isolation (DTI) slot barrier.
- Collection Elements: Symmetrically placed n-type photodiode collection regions (1 × 10¹⁷ cm⁻³) embedded within a shared p-type silicon substrate buffer matrix (1 × 10¹⁵ cm⁻³).

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Device (`sdevice`) using localized optoelectronic source blocks.
- Sentaurus Visual (`svisual`) for mapping 2D carrier generation and lateral diffusion contours.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Recombination( SRH(DopingDep) Auger )
}
* Inject a localized optical source window positioned strictly over Pixel 1
Optics {
  OpticalGeneration(
    Value = 1e21
    Window = [0.0 0.0 4.5 5.0] * Bounding box excluding Pixel 2
  )
}
```

## 5. Simulation Type & Execution Pipeline

- Steady-State Illuminated Collection Sweeps: Apply a fixed reverse bias voltage of -3.0 V to both collection node contacts, activate the localized optical generation window, and solve the steady-state transport matrix.

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Extract the terminal photocurrent responses for both collection nodes from the tabular current data file. Calculate the absolute optical crosstalk factor using the following ratio macro within `inspect`:  
    $$\text{Crosstalk Ratio} = \frac{I_{\text{Pixel 2 (Dark)}}}{I_{\text{Pixel 1 (Illuminated)}}}$$
- Target Performance: Confirm that the DTI structure compresses the crosstalk ratio (< 1%), verifying effective lateral suppression of minority carrier diffusion.

---
