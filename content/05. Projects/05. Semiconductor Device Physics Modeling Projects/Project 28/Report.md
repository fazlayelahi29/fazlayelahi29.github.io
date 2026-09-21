## Project: 2D Vertical IGBT Parasitic Thyristor Latch-Up Dynamics

## 1. Project Statement / Summary

Examine high-power reliability thresholds and regenerative failure mechanisms by evaluating latch-up inside a 2D vertical Insulated Gate Bipolar Transistor (IGBT). Under extreme high-level injection conditions, the internal hole current flowing through the p-base region can forward-bias the emitter-base junction of the inherent parasitic p-n-p-n thyristor structure. This simulation tracks the critical current threshold where gate control is lost and destructive current runaway occurs.

## 2. Required Device Architecture & Materials

- 2D Vertical IGBT Cell Geometry: Cell width = 10 μm, total vertical structure thickness = 60 μm.
- Internal Multi-Layer Layout: n⁺ emitter zones embedded inside a p-base surface well, positioned over a thick, low-doped n⁻ drift region, terminating on a highly doped p⁺ collector substrate layer at the bottom.

## 3. Required TCAD Tools & Ecosystem

- Sentaurus Structure Editor (`sde`) to map out the complete parasitic multi-layer structure.
- Sentaurus Device (`sdevice`) utilizing robust direct solver iterations near non-linear transition limits.

## 4. Active Physics Models & Command Syntax

```text
Physics {
  Fermi
  Mobility( DopingDep HighFieldSaturation )
  Recombination(
    SRH(DopingDep)
    * Mandatory Auger recombination model for high injection regimes
    Auger
  )
}
```

## 5. Simulation Type & Execution Pipeline

- Quasistationary High-Level Collector Sweeps: Ground the emitter and gate contacts ($V_{GS} = 15\text{ V}$), and perform a highly controlled step sweep on the collector voltage from 0.0 V up to the latching threshold.

## 6. Data Extraction, Visualization, & Metric Targets

- Outputs & Target Bounds: Plot collector current density versus collector voltage. Isolate the latch-up snapback threshold point where the electrical matrix switches to regenerative conduction. Map the 2D total current density vectors to view the redirection of current paths during latch-up.
- Target Performance: Pinpoint the exact current trigger limit where the gate loses electrostatic control, shifting conduction from controlled channel transport to parasitic thyristor latch-up.

---
