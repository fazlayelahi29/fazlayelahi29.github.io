## Project Report: 1D Schottky Barrier Diode (Metal-Semiconductor Interface)

---

## 1. Project Statement

This project evaluates the electrostatic behavior and electronic transport mechanisms of a 1D Schottky barrier diode. By replacing the traditional p-n homojunction with a direct interface between a high-work-function metal and an n-type silicon substrate, this simulation models a majority-carrier device. The engineering challenge centers on accurately defining the non-ohmic boundary conditions at the contact interface. The analysis focuses on simulating the forward-bias current-voltage (I-V) characteristics driven by thermionic emission and verifying the reduced turn-on voltage threshold compared to a standard p-n junction using the Synopsys Sentaurus TCAD (Version N-2017.09) Ecosystem.

---

## 2. Project Objectives

- Establish a Metal-Semiconductor Interface: Construct a 1D spatial profile joining an ideal boundary metal to an n-type silicon layer.
- Implement Non-Ohmic Boundary Conditions: Define an explicit metal work function ($\Phi_m$) to establish a physical Schottky barrier height ($\Phi_{Bn}$).
- Activate Thermionic Emission Transport Mechanics: Solve the coupled transport equations using thermionic boundary conditions rather than simple ohmic approximations.
- Extract Forward Conduction Metrics: Run a steady-state voltage sweep from 0.0 V to 1.0 V to capture the diode's forward current turn-on behavior.
- Perform a Comparative Benchmarking Analysis: Overlay the Schottky I-V response against the p-n diode results from Project 2 to contrast minority-carrier injection with majority-carrier thermionic emission.

---

## 3. Project Scope

The scope of this project is strictly limited to a steady-state one-dimensional spatial geometry (X = 0.0 to 5.0 μm) modeling a metal-semiconductor interface.

- Fixed Parameters: Total device length (5.0 μm), uniform semiconductor bulk doping (Phosphorus, $N_D = 1 \times 10^{16}\text{ cm}^{-3}$), metal work function ($\Phi_m = 4.8\text{ eV}$), and constant ambient temperature (T = 300 K).
- Active Variables: External forward bias voltage sweep on the Schottky anode contact ($V_{\text{anode}} = 0.0\text{ V}$ to 1.0 V), and thermionic emission carrier boundary currents.
- Exclusions: Image force barrier lowering (Schottky effect), field-assisted quantum tunneling (field emission), reverse-bias breakdown mechanics, and transient switching configurations.

---

## 4. Project Requirements and Environment

- Host OS & Disk Space Management: Run within the Red Hat Enterprise Linux (RHEL) 6.6 environment managed inside `/home/sentaurus/STDB/`. Using a 1D spatial architecture keeps the total storage footprint minimal, preventing any unintended storage consumption on the `/dev/sda` virtual SCSI drive.
- Toolchain Chain Links:
    
    - Sentaurus Structure Editor (`sde`) for 1D structural geometry initialization.
    - Sentaurus Mesh (`smesh`) for executing the localized grid discretization.
    - Sentaurus Device (`sdevice`) for evaluating the majority-carrier transport matrices using specific contact boundary configurations.
    - Sentaurus Inspect (`inspect`) for plotting comparative electrical curves.
    

---

## 5. Conceptual Background

When a metal and an n-type semiconductor are brought into contact, their Fermi levels must align at thermodynamic equilibrium. If the work function of the metal ($\Phi_m$) is greater than the work function of the semiconductor ($\Phi_s$), electrons flow from the semiconductor into the metal to equalize the electrochemical potential. This migration leaves behind uncompensated ionized donors ($N_D^+$), creating a depletion region and bending the semiconductor energy bands upward.

## Governing Mathematical Equations

## 1. Schottky Barrier Height ($\Phi_{Bn}$)

According to the ideal Schottky-Mott rule, the barrier height for an electron moving from the metal into the conduction band of an n-type semiconductor is given by:  
$$\Phi_{Bn} = \Phi_m - \chi$$  
Where χ is the electron affinity of the semiconductor substrate. For Silicon, χ ≈ 4.05 eV. Given a metal work function $\Phi_m = 4.8\text{ eV}$ (such as Gold or Palladium):  
$$\Phi_{Bn} = 4.8\text{ eV} - 4.05\text{ eV} = 0.75\text{ eV}$$

## 2. Thermionic Emission Boundary Condition

Unlike a p-n junction, where current is limited by the diffusion of minority carriers into neutral regions, current transport across a Schottky barrier is dominated by majority carriers overcoming the interface energy barrier. The boundary condition at the contact interface is modeled using the thermionic emission theory:  
$$J_n = A^* T^2 \exp\left( -\frac{q\Phi_{Bn}}{k_B T} \right) \left[ \exp\left( \frac{qV_a}{k_B T} \right) - 1 \right]$$  
Where $A^*$ is the effective Richardson constant for the semiconductor material. For n-type Silicon, $A^* \approx 112\text{ A/cm}^2\text{K}^2$.

## 3. Total Majority Carrier Current Expression

The thermionic emission equation can be rewritten in standard diode format:  
$$J = J_s \left[ \exp\left( \frac{qV_a}{\eta k_B T} \right) - 1 \right]$$  
Where $J_s = A^* T^2 \exp\left( -q\Phi_{Bn} / k_B T \right)$ is the saturation current density. Because majority carriers dominate this transport mechanism, the storage of minority carriers is negligible. This eliminates diffusion capacitance delays, allowing Schottky diodes to switch much faster than traditional p-n junctions.

---

## 6. Detailed Theoretical Methodology

The operational strategy for setting up and benchmarking the metal-semiconductor interface follows a structured pipeline:

```unset
[Define 1D Line Geometry: 0.0 µm to 5.0 µm]
                 │
                 ▼
[Set Anode Interface at X = 0.0 µm | Set Cathode Interface at X = 5.0 µm]
                 │
                 ▼
[Apply Constant N-type Substrate Doping across the Bulk Layer]
                 │
                 ▼
[Inject Metal Work Function (4.8 eV) & Thermionic Emission Models at Anode]
                 │
                 ▼
[Execute Forward Bias Sweep & Overlay Results against Project 2 Data]
```

1. Interface Boundary Redefinition: The anode interface at X = 0.0±μm is configured as a non-ohmic boundary condition by assigning an explicit metal work function, replacing the default ideal ohmic contact assumption.
2. Transport Model Activation: Activating the thermionic emission model instructs the solver to evaluate carrier fluxes at the interface using Richardson's equations. The drift-diffusion equations continue to govern transport within the neutral semiconductor bulk (X > 0).
3. Comparative Turn-On Evaluation: Because the saturation current density ($J_s$) for thermionic emission across a Schottky barrier is several orders of magnitude larger than that of a p-n junction (J₀), the Schottky diode requires a much lower forward bias to achieve a given current level, resulting in a significantly reduced turn-on voltage.

---

## 7. Simulation Methodology

## 7.1. Sentaurus Structure Editor (`sde`) Command File Setup

Create the structure script `schottky_sde.cmd` to define the 1D geometry and configure the contact boundaries:

```scheme
;----------------------------------------------------------------------
; 1D Schottky Barrier Diode Structural Setup (Version N-2017.09)
;----------------------------------------------------------------------

(define X_Start 0.0)
(define X_End   5.0)
(define Y_Top   0.0)
(define Y_Bot   1.0)

; 1. Generate N-type Silicon Substrate Body
(sdegeo:create-rectangle 
    (position X_Start Y_Top 0.0) 
    (position X_End   Y_Bot 0.0) 
    "Silicon" "R.SchottkyBulk"
)

; 2. Define Electrode Contacts
; Left contact assigned as the Schottky Anode
(sdegeo:define-contact-line 
    (position X_Start Y_Top 0.0) 
    (position X_Start Y_Bot 0.0) 
    "anode"
)

; Right contact assigned as the Ohmic Cathode
(sdegeo:define-contact-line 
    (position X_End Y_Top 0.0) 
    (position X_End Y_Bot 0.0) 
    "cathode"
)

; 3. Apply Uniform Phosphorus Doping
(sdedr:define-constant-profile "Doping.N_Sub" "PhosphorusActiveConcentration" 1e16)
(sdedr:define-constant-profile-placement "Place.N_Sub" "Doping.N_Sub" 
    "R.SchottkyBulk" (list "x" X_Start X_End) "replace"
)

; 4. Configure Grid Refinements
(sdedr:define-refinement-size "Mesh.Schottky" 0.005 0.5 0.0 0.001 0.05 0.0)
(sdedr:define-refinement-window "Win.Schottky" "Rectangle" 
    (position X_Start Y_Top 0.0) 
    (position 0.2     Y_Bot 0.0)
)
(sdedr:define-refinement-placement "Place.Mesh.Schottky" "Mesh.Schottky" "Win.Schottky")

(sde:build-mesh "snmesh" "" "schottky_grid")
```

## 7.2. Sentaurus Device (`sdevice`) Transport Command Script

Create the simulation file `schottky_des.cmd` to apply the metal work function and activate the thermionic interface models:

```text
#----------------------------------------------------------------------
# Sentaurus Device Input Command File - Schottky Carrier Transport
#----------------------------------------------------------------------

File {
  Grid      = "schottky_grid.tdr"
  Plot      = "schottky_des.tdr"
  Current   = "schottky_des.plt"
  Output    = "schottky_des.log"
}

Electrode {
  * Define the Schottky barrier contact by assigning the metal work function
  { Name = "anode"   Voltage = 0.0  Barrier = 4.8 }
  { Name = "cathode" Voltage = 0.0 }
}

Physics {
  Temperature = 300
  Fermi
  Recombination( SRH(DopingDep) )
}

Physics (Name="anode") {
  * Activate thermionic emission mechanics at the anode contact interface
  Thermionic
}

Plot {
  Doping
  ElectrostaticPotential
  ElectricField
  ElectronDensity
  HoleDensity
  ConductionBandEnergy
  ValenceBandEnergy
}

Math {
  Extrapolate
  Derivatives
  Iterations = 100
  RelErrControl
  Digits = 6
}

Solve {
  Poisson
  Coupled { Poisson Electron Hole }
  
  * Forward bias voltage sweep on the Schottky Anode
  Quasistationary (
    InitialStep = 0.005
    Increment   = 1.2
    MaxStep     = 0.02
    Goal { Name = "anode" Voltage = 1.0 }
  )
  { Coupled { Poisson Electron Hole } }
}
```

---

## 8. Result Analysis and Discussion

## 8.1. Post-Processing & Comparative Data Plotting

Once the simulation runs successfully, use Sentaurus Inspect to compare the forward-bias electrical performance of the Schottky diode against the p-n homojunction from Project 2:

```bash
inspect schottky_des.plt ../project2/pndiode_forward_des.plt &
```

Configure the display plot by setting the horizontal axis to `anode Voltage` and the vertical axis to `anode TotalCurrent`. Plot both curves on a linear scale to analyze and compare their forward turn-on thresholds.

## 8.2. Verification of Devices Performance & Expected Trends

The comparative forward I-V analysis highlights the fundamental performance differences between the two device architectures:

- The Schottky Barrier Diode Curve: The majority-carrier thermionic emission current begins to rise sharply at $V_a \approx 0.3\text{ V}$. This low turn-on threshold is a direct result of the higher saturation current density ($J_s$) typical of thermionic transport across a metal-semiconductor interface.
- The P-N Homojunction Diode Curve: In contrast, the minority-carrier diffusion-dominated transport requires a higher forward bias, with current rising sharply only after $V_a \approx 0.7\text{ V}$.

This clear difference in conduction thresholds confirms that the non-ohmic boundary conditions and thermionic emission models were successfully applied, demonstrating the unique electrical advantages of Schottky barrier architectures for low-voltage, high-speed applications.

---
