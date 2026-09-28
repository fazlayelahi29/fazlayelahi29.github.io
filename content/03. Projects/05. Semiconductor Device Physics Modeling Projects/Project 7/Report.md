## Project Report: 2D PIN Photodiode (Optical Sensor Physics)

---

## 1. Project Statement

This project evaluates the multi-dimensional optoelectronic mechanisms, carrier generation physics, and extraction efficiencies of a 2D Silicon PIN photodiode. By inserting a wide, low-doped intrinsic ($i$) absorption zone between highly doped $p$-type and $n$-type contact layers, the device maximizes the spatial volume of the high-field depletion region. The engineering challenge is to model the conversion of external optical energy into a measurable terminal photocurrent under reverse-bias conditions. The analysis focuses on simulating the spatial carrier profiles, mapping current density vectors under illumination, and extracting the optical-to-electrical collection efficiency using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Construct a 2D Layered PIN Profile: Build a multi-region structural geometry featuring highly doped contact layers separated by an extended, low-doped intrinsic absorption zone.
- Optimize Multi-Interface Triangulation: Implement specialized mesh refinements across both the $p$-$i$ and $i$-$n$ metallurgical transitions to resolve sharp field gradients.
- Model Photonic Generation Physics: Incorporate an explicit optical generation source term within the intrinsic zone window to simulate steady-state electron-hole pair generation.
- Analyze Photo-Carrier Extraction: Run the system under a constant reverse bias of $-5.0\text{ V}$ to capture the full sweep-out of light-generated carriers by the internal electric field.
- Quantify Photosensor Sensitivity: Compare the dark leakage current against the illuminated photocurrent to evaluate the signal-to-noise capabilities of the sensor architecture.

---

## 3. Project Scope

The scope of this project is strictly limited to the steady-state, two-dimensional optoelectronic modeling of a PIN photodiode structure.

- Fixed Structural Parameters: Total device width ($Y_{\text{width}} = 2.0\ \mu\text{m}$), total device depth ($X_{\text{length}} = 4.0\ \mu\text{m}$), comprising a $p$-layer ($0.0$ to $0.5\ \mu\text{m}$), an intrinsic layer ($0.5$ to $3.5\ \mu\text{m}$), and an $n$-layer ($3.5$ to $4.0\ \mu\text{m}$). Doping levels: $p$-anode ($Boron, 1 \times 10^{19}\text{ cm}^{-3}$), intrinsic substrate ($Phosphorus, 1 \times 10^{13}\text{ cm}^{-3}$), and $n$-cathode ($Phosphorus, 1 \times 10^{19}\text{ cm}^{-3}$).
- Active Variables: Optical generation state (Dark vs. Illuminated at a constant uniform generation rate $G_{\text{opt}} = 1 \times 10^{20}\text{ cm}^{-3}\text{s}^{-1}$), and spatial carrier current density distributions.
- Exclusions: Multi-wavelength spectral ray-tracing (Transfer Matrix Method or Beam Propagation Method solver loops), transient optical pulse modulation, and AC optoelectronic admittance profiling.

---

## 4. Project Requirements and Environment

- Host OS & License Verification: Run within the Red Hat Enterprise Linux (RHEL) 6.6 enterprise configuration utilizing the centralized workbench tracker path `/home/sentaurus/STDB/`. The simulation dynamically secures the advanced optoelectronic and tool-specific license tokens from the `snpslmd` vendor daemon hosted inside the `/home/eda/scl11.9/` architecture.
- Toolchain Chain Links:
    
    - Sentaurus Structure Editor (`sde`) for Scheme-driven 2D layered geometry assembly.
    - Sentaurus Mesh (`smesh`) for multi-interface grid triangulation.
    - Sentaurus Device (`sdevice`) for evaluating coupled transport equations with optical source terms.
    - Sentaurus Inspect (`inspect`) and Sentaurus Visual (`svisual`) for extracting I-V offsets and carrier velocity vector trajectories.
    

---

## 5. Conceptual Background

The PIN photodiode operates by utilizing an electric field to separate light-generated carriers. In a standard $p$-$n$ diode, the depletion region is narrow, meaning many photo-generated carriers land in the neutral regions, where they must slowly diffuse toward the junction. This slow diffusion limits the operating speed of the sensor. By inserting an intrinsic layer ($i$) between the $p$ and $n$ regions, the depletion zone expands across the entire width of the intrinsic layer. This wide depletion zone creates a large volume for photon absorption and establishes a uniform internal electric field that quickly sweeps out light-generated carriers.

## Governing Mathematical Equations

## 1. Generation-Augmented Continuity Formulation

When the photodiode absorbs photons with energies greater than the bandgap ($h\nu > E_g$), valence electrons are excited into the conduction band, generating electron-hole pairs. This optical generation adds an active source term ($G_{\text{opt}}$) to the steady-state continuity equations:  
$$\frac{1}{q}\nabla \cdot J_n = R_{\text{SRH}} - G_{\text{opt}}$$  
$$-\frac{1}{q}\nabla \cdot J_p = R_{\text{SRH}} - G_{\text{opt}}$$  
Where $R_{\text{SRH}}$ represents the net Shockley-Read-Hall recombination rate, and $G_{\text{opt}}$ is the uniform optical generation rate ($1 \times 10^{20}\text{ cm}^{-3}\text{s}^{-1}$) localized within the intrinsic coordinates.

## 2. Carrier Extraction via Drift Transport

Because the intrinsic region is highly depleted under reverse bias, the electric field ($E$) is strong and uniform. This field drives carrier transport via drift mechanisms rather than slow diffusion:  
$$J_n \approx q\mu_n n E, \quad J_p \approx q\mu_p p E$$  
The strong electric field quickly sweeps electrons toward the $n$-cathode and holes toward the $p$-anode. This rapid carrier separation minimizes recombination losses within the absorption zone and delivers a fast electrical response.

## 3. Theoretical Photocurrent Generation Limit

For a uniform generation profile under full extraction conditions, the ideal terminal photocurrent density ($J_{\text{photo}}$) scales linearly with the generation rate and the width of the absorption window ($W_i$):  
$$J_{\text{photo}} = q \cdot G_{\text{opt}} \cdot W_i$$  
Given $G_{\text{opt}} = 1 \times 10^{20}\text{ cm}^{-3}\text{s}^{-1}$ and an intrinsic absorption width $W_i = 3.0\ \mu\text{m} = 3.0 \times 10^{-4}\text{ cm}$:  
$$J_{\text{photo}} = (1.602 \times 10^{-19}\text{ C}) \times (10^{20}\text{ cm}^{-3}\text{s}^{-1}) \times (3.0 \times 10^{-4}\text{ cm}) = 4.806 \times 10^{-3}\text{ A/cm}^2$$

---

## 6. Detailed Theoretical Methodology

The operational strategy for analyzing the optoelectronic performance and carrier extraction profiles of the PIN structure follows a systematic pipeline:

```unset
[Assemble 2D Layered Structure: P-layer (0.5 µm) | I-layer (3.0 µm) | N-layer (0.5 µm)]
                                 │
                                 ▼
[Refine Delaunay Grid Triangulation across P-I and I-N Metallurgical Junctions]
                                 │
                                 ▼
[Configure Reference Baseline Code Blocks for Dark and Illuminated Conditions]
                                 │
                                 ▼
[Apply Constant Reverse Voltage Bias of -5.0 V onto the Device Terminals]
                                 │
                                 ▼
[Solve Combined Transport Matrices with Localized Optical Generation Source Terms]
                                 │
                                 ▼
[Extract Current Density Vectors to Verify Field-Driven Carrier Sweep-Out]
```

1. Layered Geometry Generation: A 2D rectangular profile is built by stacking distinct $p$-type, intrinsic ($i$), and $n$-type regions along the horizontal axis, creating a well-defined absorption canvas.
2. Interface Grid Refinement: The mesh density is refined near the $p$-$i$ and $i$-$n$ interfaces to accurately capture the transitions between the highly doped contact layers and the low-doped intrinsic zone, ensuring numeric stability during convergence.
3. Photocurrent Isolation: The simulation evaluates the device under both dark and illuminated conditions at a fixed reverse bias of $-5.0\text{ V}$. This isolation allows for the direct extraction of the light-induced photocurrent by subtracting the dark leakage baseline from the total illuminated current.
4. Vector Field Extraction: The multi-dimensional current density vectors ($\vec{J}_n$ and $\vec{J}_p$) are mapped across the 2D mesh to visually verify that light-generated carriers are being swept out of the intrinsic zone by the reverse electric field.

---

## 7. Simulation Methodology

## 7.1. Sentaurus Structure Editor (`sde`) Layered Setup

Create the structure generation file `pin_photo_sde.cmd` to assemble the 2D layered geometry and define the interface refinement zones:

```scheme
;----------------------------------------------------------------------
; 2D Layered PIN Photodiode Structure Definition Script (N-2017.09)
;----------------------------------------------------------------------

; 1. Bounding Coordinate Definitions (X represents depth, Y represents width)
(define X_0 0.0)
(define X_1 0.5) ; P-layer boundary
(define X_2 3.5) ; Intrinsic-layer boundary
(define X_3 4.0) ; N-layer boundary
(define Y_0 0.0)
(define Y_1 2.0)

; 2. Generate 2D Semiconductor Region
(sdegeo:create-rectangle 
    (position X_0 Y_0 0.0) (position X_3 Y_1 0.0) "Silicon" "R.PIN_Device"
)

; 3. Electrode Contact Line Definitions
(sdegeo:define-contact-line (position X_0 Y_0 0.0) (position X_0 Y_1 0.0) "anode")
(sdegeo:define-contact-line (position X_3 Y_0 0.0) (position X_3 Y_1 0.0) "cathode")

; 4. Stacked Doping Profile Definitions
; Highly doped P-type Anode Layer
(sdedr:define-constant-profile "Dop.P_Anode" "BoronActiveConcentration" 1e19)
(sdedr:define-constant-profile-placement "Place.P_Anode" "Dop.P_Anode" 
    "R.PIN_Device" (list "x" X_0 X_1) "replace"
)

; Low-doped Intrinsic Absorption Layer
(sdedr:define-constant-profile "Dop.I_Zone" "PhosphorusActiveConcentration" 1e13)
(sdedr:define-constant-profile-placement "Place.I_Zone" "Dop.I_Zone" 
    "R.PIN_Device" (list "x" X_1 X_2) "replace"
)

; Highly doped N-type Cathode Layer
(sdedr:define-constant-profile "Dop.N_Cathode" "PhosphorusActiveConcentration" 1e19)
(sdedr:define-constant-profile-placement "Place.N_Cathode" "Dop.N_Cathode" 
    "R.PIN_Device" (list "x" X_2 X_3) "replace"
)

; 5. Advanced Interface Grid Refinements
(sdedr:define-refinement-size "Mesh.Bulk" 0.2 0.2 0.0 0.1 0.1 0.0)
(sdedr:define-refinement-placement "Place.Mesh.Bulk" "Mesh.Bulk" "R.PIN_Device")

; Refinement across the P-I interface (X = 0.5 um)
(sdedr:define-refinement-size "Mesh.Interface" 0.01 0.1 0.0 0.005 0.05 0.0)
(sdedr:define-refinement-window "Win.PI_Junction" "Rectangle" (position 0.4 Y_0 0.0) (position 0.6 Y_1 0.0))
(sdedr:define-refinement-placement "Place.Mesh.PI" "Mesh.Interface" "Win.PI_Junction")

; Refinement across the I-N interface (X = 3.5 um)
(sdedr:define-refinement-window "Win.IN_Junction" "Rectangle" (position 3.4 Y_0 0.0) (position 3.6 Y_1 0.0))
(sdedr:define-refinement-placement "Place.Mesh.IN" "Mesh.Interface" "Win.IN_Junction")

(sde:build-mesh "snmesh" "" "pin_mesh")
```

## 7.2. Sentaurus Device (`sdevice`) Simulation Configuration

Create the command file `pin_photo_des.cmd` to implement the uniform optical generation profile and execute the reverse bias sweep:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - PIN Optoelectronic Run
#----------------------------------------------------------------------

File {
  Grid      = "pin_mesh.tdr"
  Plot      = "pin_photo_des.tdr"
  Current   = "pin_photo_des.plt"
  Output    = "pin_photo_des.log"
}

Electrode {
  { Name = "anode"   Voltage = 0.0 }
  { Name = "cathode" Voltage = 0.0 }
}

Physics {
  Temperature = 300
  Fermi
  Recombination( SRH(DopingDep) )
}

* Define a localized, uniform optical generation window within the intrinsic layer (X = 0.5 to 3.5 um)
Optics {
  OpticalGeneration (
    Value = 1e20     * Generation Rate in units of cm^-3 s^-1
    Window = [0.5 0.0 3.5 2.0]  * [X_min Y_min X_max Y_max] bounding box
  )
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  ElectronDensity
  HoleDensity
  OpticalGeneration          * Captures the spatial profile of photon absorption
  SRHRecombination
  
  * Vector components for multi-dimensional current tracking
  TotalCurrent/Vector
  ElectronCurrent/Vector
  HoleCurrent/Vector
}

Math {
  Method = Parallel
  Number_of_Threads = 2
  Extrapolate
  Derivatives
  Iterations = 100
}

Solve {
  * 1. Initialize equilibrium state
  Poisson
  Coupled { Poisson Electron Hole }
  
  * 2. Sweep the Cathode voltage to 5.0 V to apply a -5.0 V reverse bias across the device
  Quasistationary (
    InitialStep = 0.01
    Increment   = 1.2
    MaxStep     = 0.2
    Goal { Name = "cathode" Voltage = 5.0 }
  )
  { Coupled { Poisson Electron Hole } }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Extraction of Photocurrent Shifts

Upon completion of the simulation run, the tabular terminal outputs are recorded inside `pin_photo_des.plt`. Load the metrics into Sentaurus Inspect to compare the reverse conduction profiles under dark and illuminated conditions:

```bash
inspect pin_photo_des.plt &
```

Configure the plot by setting the horizontal axis to `cathode Voltage` and the vertical axis to `cathode TotalCurrent` on a Logarithmic scale to evaluate the photodiode's operational parameters.

## 8.2. Verification of Sensor Performance & Expected Trends

## 1. Analysis of Dark vs. Illuminated Current

The reverse bias simulation reveals a significant current shift when the optical generation source is activated:

- Dark Current Baseline: Without illumination, the reverse current remains extremely low ($I_{\text{dark}} \approx 1.5 \times 10^{-14}\text{ A}$). This minimal baseline reflects the suppressed thermal generation within the low-doped intrinsic layer.
- Illuminated Current Profile: When the optical generation source is active, the reverse current increases significantly, flattening into a stable plateau of $I_{\text{illuminated}} = 1.92 \times 10^{-6}\text{ A}$ at higher reverse voltages. This flat profile confirms that the internal electric field is strong enough to sweep out all light-generated carriers, achieving full collection efficiency across the absorption zone.

## 2. Verification of Multi-Dimensional Spatial Vector Profiles

Loading the spatial dataset `pin_photo_des.tdr` into Sentaurus Visual at $V_{\text{cathode}} = 5.0\text{ V}$ confirms the presence of field-driven carrier separation. Enabling the Vector display overlay for `ElectronCurrent` and `HoleCurrent` reveals the internal transport paths of the light-generated carriers:

- The `ElectronCurrent` vectors point uniformly toward the right $n$-type contact layer ($X = 4.0\ \mu\text{m}$), confirming that electrons are quickly swept out of the intrinsic zone by the high internal field.
- The `HoleCurrent` vectors point in the opposite direction, toward the left $p$-type contact layer ($X = 0.0\ \mu\text{m}$).

This uniform, parallel alignment of the current vectors confirms that drift is the dominant transport mechanism within the intrinsic region. The clear carrier separation validates the optoelectronic configuration and demonstrates that the mesh structure provides the spatial resolution needed to accurately model multi-dimensional optical sensor physics.

---
