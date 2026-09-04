
# 1) FinFET Short-Channel Effects Analysis

## PROJECT TITLE / TOPIC
14 nm FinFET Short-Channel Effects (SCE) Analysis

## PROJECT DOMAIN
Nanoelectronics, CMOS scaling, 3D electrostatics

## PROJECT STATEMENT OR PROJECT SUMMARY
Quantify the suppression of short-channel effects in a tri-gate FinFET relative to a planar MOSFET at the same gate length. The key physical observables are threshold-voltage roll-off, drain-induced barrier lowering, subthreshold swing, and the confinement of inversion charge inside a narrow fin.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- Silicon FinFET
- Gate length:
  $$
  L_G = 14~\text{nm}
  $$
- Fin width:
  $$
  W_{fin} = 8~\text{nm}
  $$
- Fin height:
  $$
  H_{fin} = 34~\text{nm}
  $$
- Equivalent oxide thickness:
  $$
  EOT \approx 0.8~\text{nm}
  $$
- Heavy source/drain doping, lightly doped channel
- Planar MOSFET for reference

## REQUIRED SOFTWARE / TOOLS
Synopsys Sentaurus TCAD N-2017:
- Sentaurus Structure Editor
- Sentaurus Device
- Sentaurus Visual

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$

Use drift-diffusion plus quantum correction and mobility degradation:
$$
\texttt{Mobility(DopingDep HighFieldSaturation Enormal)}
$$
and quantum correction via:
$$
\texttt{eQuantumPotential}
$$
or
$$
\texttt{DensityGradient}
$$
Include SRH recombination and Fermi statistics where appropriate.

## REQUIRED SIMULATION TYPE
3D DC sweeps:
- linear region at low drain bias
- saturation region at higher drain bias
- cutline analysis through the fin center and corners

## REQUIRED OUTPUTS
- $I_D$--$V_{GS}$ curves
- $I_D$--$V_{DS}$ curves
- $V_{th}$
- $SS$
- $DIBL$
- electron density contours
- electrostatic potential contours

## REQUIRED PARAMETER SWEEPS
- $V_{GS}$ from off-state to inversion
- $V_{DS} = 0.05~\text{V}$
- $V_{DS} = 0.8~\text{V}$
- optional fin-width sweep:
  $$
  W_{fin} \in \{5,8,10\}~\text{nm}
  $$

## REQUIRED CONSTRAINTS
- mesh below 1 nm near fin corners
- oxide interface finely resolved
- source/drain must not dominate electrostatics

## REQUIRED METRIC TARGETS
- smaller $SS$
- smaller $DIBL$
- larger $I_{ON}/I_{OFF}$
- better gate control than planar MOSFET

## SPECIAL INSTRUCTIONS
Use the planar MOSFET only as a benchmark. The important interpretation is the reduction in barrier lowering at the source-channel junction.

---

# 2) Vertical Nanowire Gate-All-Around FET

## PROJECT TITLE / TOPIC
Vertical Nanowire Gate-All-Around FET Volume-Inversion Study

## PROJECT DOMAIN
Nanoelectronics, cylindrical electrostatics, quantum confinement

## PROJECT STATEMENT OR PROJECT SUMMARY
Study a gate-all-around nanowire transistor and demonstrate the transition from surface inversion to volume inversion as the wire diameter shrinks. The central goal is to show that the electron density peak migrates from the surface toward the wire center when confinement becomes sufficiently strong.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- Cylindrical silicon nanowire
- Diameters:
  $$
  D \in \{10,7,5\}~\text{nm}
  $$
- Surround gate metal
- Source/drain contacts at the ends
- Lightly doped or nearly intrinsic channel

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Structure Editor
- Sentaurus Device
- Sentaurus Visual
- Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$

Use the standard semiconductor equations plus quantum correction:
$$
\texttt{eQuantumPotential}
$$
or
$$
\texttt{DensityGradient}
$$
Include mobility dependence, Fermi statistics, and SRH recombination.

The charge centroid can be written as:
$$
r_c
=
\frac{\int_0^R n(r)\,r\,dr}{\int_0^R n(r)\,dr}
$$


## REQUIRED SIMULATION TYPE
- transfer sweep
- cross-sectional density mapping
- radial cutline analysis

## REQUIRED OUTPUTS
- $I_D$--$V_{GS}$ for each diameter
- $n(r)$ profiles
- centroid shift
- threshold variation with diameter

## REQUIRED PARAMETER SWEEPS
- $V_{GS}$ sweep
- diameter sweep
- optional oxide-thickness sweep

## REQUIRED CONSTRAINTS
- mesh below 1 nm radially
- wire boundary must be resolved
- symmetry should be preserved

## REQUIRED METRIC TARGETS
- volume inversion for small diameters
- stronger gate control at smaller diameter
- improved subthreshold behavior

## SPECIAL INSTRUCTIONS
The key result is the radial movement of the inversion charge.

---

# 3) Steep-Slope Tunnel FET

## PROJECT TITLE / TOPIC
Steep-Slope TFET Band-to-Band Tunneling Study

## PROJECT DOMAIN
Steep-slope devices, tunneling transport, low-power electronics

## PROJECT STATEMENT OR PROJECT SUMMARY
Simulate a TFET that switches by band-to-band tunneling instead of thermionic emission. The source is heavily doped $p$-type and the channel is intrinsic or lightly doped. When the gate aligns the source valence band with the channel conduction band, the tunnel barrier collapses and current increases sharply.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- $p^+$ source
- intrinsic channel
- $n^+$ drain
- optional SiGe source enhancement

Example source doping:
$$
N_A \sim 10^{20}~\text{cm}^{-3}
$$

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Structure Editor
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$


Use Kane-type BTBT:
$$
R_{BTBT}(x)
=
A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$
Include:
- Poisson equation
- continuity equations
- Fermi statistics
- bandgap narrowing
- BTBT model
- high numerical precision

A practical Sentaurus-style block is:
$$
\texttt{Recombination(Band2Band(Model=Kane))}
$$

## REQUIRED SIMULATION TYPE
- logarithmic transfer curve
- band-diagram extraction
- tunneling generation profile
- subthreshold swing extraction

## REQUIRED OUTPUTS
- log-scale $I_D$--$V_{GS}$
- minimum $SS$
- band edge profile
- BTBT generation map

## REQUIRED PARAMETER SWEEPS
- $V_{GS}$ sweep
- small $V_{DS}$ for subthreshold
- larger $V_{DS}$ for on-state
- source material or source doping variation

## REQUIRED CONSTRAINTS
- very fine mesh at tunneling junction
- stable Newton solving
- high precision arithmetic

## REQUIRED METRIC TARGETS
- steep subthreshold region
- measurable current rise from tunneling
- clear off/on separation

## SPECIAL INSTRUCTIONS
The band diagram is the most important diagnostic.

---

# 4) Junctionless Nanowire Transistor

## PROJECT TITLE / TOPIC
Junctionless Accumulation-Mode Nanowire Transistor

## PROJECT DOMAIN
Nanoelectronics, depletion physics, uniformly doped transistors

## PROJECT STATEMENT OR PROJECT SUMMARY
Study a transistor with no source/drain junctions. The channel is uniformly doped and the gate depletes the entire nanowire at zero bias. Conduction begins when the gate drives the channel into accumulation.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- uniformly doped silicon nanowire
- heavy doping throughout source, channel, drain
- high-workfunction gate
- small diameter wire

Example channel doping:
$$
N_D = 10^{19}~\text{cm}^{-3}
$$

Gate workfunction:
$$
\Phi_M \approx 5.0~\text{eV}
$$

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Structure Editor
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$


Use drift-diffusion, depletion electrostatics, and mobility corrections:
$$
\texttt{Mobility(Enormal DopingDep)}
$$
and for heavy doping:
$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

## REQUIRED SIMULATION TYPE
- electrostatic potential at $V_G=0$
- transfer sweep from negative to positive gate bias

## REQUIRED OUTPUTS
- $I_D$--$V_{GS}$
- zero-bias potential map
- depletion profile
- turn-on under positive gate bias

## REQUIRED PARAMETER SWEEPS
- $V_G \in [-1,1]~\text{V}$
- gate workfunction sweep
- doping sweep

## REQUIRED CONSTRAINTS
- gate must fully deplete at $V_G=0$
- wire must be thin enough for full depletion

## REQUIRED METRIC TARGETS
- near-zero current at $V_G=0$
- sharp turn-on at positive gate bias

## SPECIAL INSTRUCTIONS
The zero-bias electrostatic potential map is the proof of the junctionless operating principle.

---

# 5) AlGaN/GaN HEMT

## PROJECT TITLE / TOPIC
AlGaN/GaN HEMT Polarization-Induced Two-Dimensional Electron Gas Study

## PROJECT DOMAIN
Wide-bandgap power electronics, heterostructures, polarization physics

## PROJECT STATEMENT OR PROJECT SUMMARY
Study the formation of a two-dimensional electron gas at the AlGaN/GaN interface. The key physical mechanism is polarization: spontaneous and piezoelectric polarization generate fixed sheet charge and induce a high-density electron channel.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- Al$_{0.25}$Ga$_{0.75}$N barrier
- GaN channel/buffer
- SiC or sapphire substrate
- barrier thickness near:
  $$
  t_{barrier} \approx 25~\text{nm}
  $$

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$


The total polarization charge is:
$$
\sigma_{pol} = \sigma_{sp} + \sigma_{pz}
$$
Include:
- polarization
- strain
- hydrodynamic or thermodynamic transport
- high precision arithmetic

A practical requirement is:
$$
\texttt{ExtendedPrecision}
$$

## REQUIRED SIMULATION TYPE
- zero-bias solution
- vertical band diagram
- transfer and output curves

## REQUIRED OUTPUTS
- conduction-band notch
- 2DEG density map
- sheet density:
  $$
  n_{2D} = \int n(z)\,dz
  $$
- $I_D$--$V_{GS}$ and $I_D$--$V_{DS}$

## REQUIRED PARAMETER SWEEPS
- gate bias
- drain bias
- barrier thickness
- aluminum fraction

## REQUIRED CONSTRAINTS
- sharp heterointerface
- active polarization model
- stable high-precision solving

## REQUIRED METRIC TARGETS
- strong $n_{2D}$
- visible triangular well
- realistic high-field current

## SPECIAL INSTRUCTIONS
The interface charge sheet and the conduction-band well are the main physical signatures.

---

# 6) 4H-SiC Schottky Barrier Diode

## PROJECT TITLE / TOPIC
4H-SiC Schottky Barrier Diode Forward Drop and Reverse Breakdown Study

## PROJECT DOMAIN
Power electronics, wide-bandgap transport, avalanche breakdown

## PROJECT STATEMENT OR PROJECT SUMMARY
Study a Schottky barrier diode on 4H-SiC to analyze the trade-off between low forward drop and high reverse breakdown voltage. The forward branch is governed by the contact barrier, while the reverse branch is governed by the electric field in the drift region.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- Schottky anode
- 4H-SiC drift region
- ohmic cathode
- drift doping:
  $$
  N_D = 5\times 10^{15}~\text{cm}^{-3}
  $$
- drift length:
  $$
  L_{drift} = 10~\mu\text{m}
  $$

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$


Use:
$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$
for avalanche.
Use Schottky barrier lowering and, if needed, tunneling.

A practical Sentaurus-style setup uses:
$$
\texttt{Recombination(Avalanche(Okuto))}
$$

## REQUIRED SIMULATION TYPE
- forward I--V sweep
- reverse breakdown sweep
- temperature sweep

## REQUIRED OUTPUTS
- forward voltage drop
- reverse breakdown voltage
- electric field distribution
- I--V curves at multiple temperatures

## REQUIRED PARAMETER SWEEPS
- reverse bias to breakdown
- temperature:
  $$
  T \in \{300,400,500\}~\text{K}
  $$
- barrier height variation

## REQUIRED CONSTRAINTS
- drift region must be thick enough
- avalanche model must be SiC-appropriate
- high precision arithmetic required

## REQUIRED METRIC TARGETS
- high breakdown voltage
- controlled forward drop
- temperature-dependent breakdown shift

## SPECIAL INSTRUCTIONS
The reverse-field profile is the most important diagnostic.

---

# 7) LDMOS with Self-Heating

## PROJECT TITLE / TOPIC
LDMOS Self-Heating Effect and Hotspot Formation Study

## PROJECT DOMAIN
Power MOSFETs, electrothermal coupling, reliability

## PROJECT STATEMENT OR PROJECT SUMMARY
Study self-heating in a lateral double-diffused MOSFET. At high current, Joule heating raises lattice temperature, mobility decreases, and current distribution changes. The goal is to identify the drain-side hotspot and quantify the electrical degradation.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- lateral LDMOS
- drift region
- drain-side field crowding region
- thermal boundary beneath substrate

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$


Use the thermodynamic heat equation:
$$
\nabla\cdot(\kappa \nabla T_L) + \mathbf{J}\cdot\mathbf{E} = 0
$$
with temperature-dependent mobility.

A practical model is:
$$
\texttt{Thermodynamic}
$$

## REQUIRED SIMULATION TYPE
- high-bias DC sweep
- pulsed stress simulation
- temperature map analysis

## REQUIRED OUTPUTS
- lattice temperature contour
- hotspot location
- current reduction due to heating
- $I_D$--$V_D$ with and without heating

## REQUIRED PARAMETER SWEEPS
- high $V_G$
- sweep $V_D$
- optional pulse width and duty cycle

## REQUIRED CONSTRAINTS
- thermal boundary must be defined
- mesh must resolve hotspot
- substrate must conduct heat realistically

## REQUIRED METRIC TARGETS
- visible hotspot
- measurable degradation of current

## SPECIAL INSTRUCTIONS
The temperature contour is the most important output.

---

# 8) IGBT Latch-Up

## PROJECT TITLE / TOPIC
IGBT Parasitic Thyristor Latch-Up Study

## PROJECT DOMAIN
Power semiconductor reliability, regenerative conduction, high-level injection

## PROJECT STATEMENT OR PROJECT SUMMARY
Study latch-up in a vertical IGBT. The device contains a parasitic $p$-$n$-$p$-$n$ path that can become regenerative under strong injection. The key result is the current level where gate control is lost.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- vertical IGBT
- $p^+$ emitter
- $n^-$ drift region
- $p$ base
- $n^+$ collector

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$



Use:
$$
\texttt{Recombination(Auger SRH)}
$$
with high-level injection, conductivity modulation, and parasitic thyristor behavior.

## REQUIRED SIMULATION TYPE
- collector current stress sweep
- quasi-static or transient latch search

## REQUIRED OUTPUTS
- collector current
- current density map
- latch-up threshold
- loss of gate control

## REQUIRED PARAMETER SWEEPS
- collector stress sweep
- temperature variation

## REQUIRED CONSTRAINTS
- full parasitic structure must exist
- current drive must be sufficient for feedback
- solver must be robust near transition

## REQUIRED METRIC TARGETS
- identifiable latch-up threshold
- strong current runaway

## SPECIAL INSTRUCTIONS
Interpret the result as regenerative conduction.

---

# 9) Tandem Solar Cell

## PROJECT TITLE / TOPIC
Tandem Solar Cell Optical Generation and Photovoltaic Performance Study

## PROJECT DOMAIN
Optoelectronics, photovoltaics, optical generation

## PROJECT STATEMENT OR PROJECT SUMMARY
Study a tandem solar cell with a wide-bandgap top absorber and a lower-bandgap bottom absorber. If the intended top absorber is unavailable, use a physically similar analog such as GaAs/Si.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- wide-bandgap top cell
- lower-bandgap bottom cell
- tunnel junction or recombination interconnect

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$



Use optical generation with TMM:
$$
\texttt{OpticalGeneration(TMM)}
$$
under:
$$
\texttt{AM1.5G}
$$

Optical generation can be represented as:
$$
G(z) = \int \alpha(\lambda)\Phi(\lambda)e^{-\alpha(\lambda)z}\,d\lambda
$$

## REQUIRED SIMULATION TYPE
- illuminated $J$--$V$
- absorption profile extraction
- subcell comparison

## REQUIRED OUTPUTS
- $J$--$V$
- $J_{SC}$
- $V_{OC}$
- efficiency
- generation profile

## REQUIRED PARAMETER SWEEPS
- layer thickness
- illumination conditions
- spectral variation

## REQUIRED CONSTRAINTS
- planar geometry for TMM
- correct optical constants
- physically consistent interfaces

## REQUIRED METRIC TARGETS
- improved efficiency versus single-junction reference

## SPECIAL INSTRUCTIONS
Optical absorption is the first-order physics.

---

# 10) CMOS Image Sensor Crosstalk

## PROJECT TITLE / TOPIC
CMOS Image Sensor Crosstalk and Minority Carrier Diffusion Study

## PROJECT DOMAIN
Imaging devices, optoelectronics, diffusion transport

## PROJECT STATEMENT OR PROJECT SUMMARY
Quantify crosstalk in a two-pixel CMOS image sensor by illuminating one pixel and measuring how much charge diffuses into the neighboring pixel. The objective is to evaluate the suppression effect of deep trench isolation.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- two adjacent pixels
- deep trench isolation
- separate readout contacts
- pixel size around:
  $$
  5~\mu\text{m}\times 5~\mu\text{m}
  $$

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$



Use optical generation with ray tracing:
$$
\texttt{OpticalGeneration(RayTracing)}
$$
and carrier diffusion/recombination.

Crosstalk is:
$$
\text{Crosstalk} = \frac{I_{pixel2}}{I_{pixel1}}
$$

## REQUIRED SIMULATION TYPE
- illuminate pixel 1 only
- measure pixel 2 current
- extract diffusion map

## REQUIRED OUTPUTS
- crosstalk ratio
- pixel-to-pixel current transfer
- carrier density spread
- trench effectiveness

## REQUIRED PARAMETER SWEEPS
- illumination position
- wavelength
- trench depth
- pixel spacing

## REQUIRED CONSTRAINTS
- light must be localized
- trench must be explicit
- pixels must be separate

## REQUIRED METRIC TARGETS
- low crosstalk
- clear DTI improvement

## SPECIAL INSTRUCTIONS
The key result is the neighboring pixel current.

---

# 11) Single Event Upset in SRAM

## PROJECT TITLE / TOPIC
Single Event Upset in SRAM Under Heavy-Ion Strike

## PROJECT DOMAIN
Radiation effects, memory reliability, transient semiconductor physics

## PROJECT STATEMENT OR PROJECT SUMMARY
Study how a heavy-ion strike injects charge into an SRAM node and causes a transient voltage collapse. The goal is to determine whether the node recovers or flips state.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- simplified six-transistor SRAM cell
- sensitive storage node
- localized ion track

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$



Use a transient generation source:
$$
G_{ion}(x,y,z,t)
$$
with linear energy transfer:
$$
LET
$$

## REQUIRED SIMULATION TYPE
- transient simulation
- ion strike at a fixed time
- recovery analysis

## REQUIRED OUTPUTS
- node voltage versus time
- collected charge
- upset threshold
- recovery or failure to recover

## REQUIRED PARAMETER SWEEPS
- LET sweep
- strike location sweep
- track-radius sweep
- strike-time sweep

## REQUIRED CONSTRAINTS
- very small time steps
- sensitive node must be properly located
- mesh must resolve the track

## REQUIRED METRIC TARGETS
- visible voltage collapse
- recovery or bit flip
- critical LET

## SPECIAL INSTRUCTIONS
This is a transient charge-collection study.

---

# 12) BJT Gummel Plot and Bandgap Narrowing

## PROJECT TITLE / TOPIC
BJT Gummel Plot and Bandgap Narrowing Study

## PROJECT DOMAIN
Fundamental device physics, bipolar transport, doping-dependent material effects

## PROJECT STATEMENT OR PROJECT SUMMARY
Study how heavy emitter doping changes the base current and gain of a silicon BJT through bandgap narrowing. The objective is to compare Gummel plots with and without the OldSlotboom model.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- silicon npn BJT
- heavily doped emitter
- thin base
- moderate collector doping

Example:
$$
N_E \sim 10^{19}~\text{cm}^{-3},\quad
N_B \sim 5\times 10^{17}~\text{cm}^{-3},\quad
N_C \sim 10^{16}~\text{cm}^{-3}
$$

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$



Use:
$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$
to activate bandgap narrowing.

The gain is:
$$
\beta = \frac{I_C}{I_B}
$$

## REQUIRED SIMULATION TYPE
- $V_{BE}$ sweep
- Gummel plot extraction
- with/without BGN comparison

## REQUIRED OUTPUTS
- $I_C(V_{BE})$
- $I_B(V_{BE})$
- $\beta(V_{BE})$

## REQUIRED PARAMETER SWEEPS
- base-emitter voltage sweep
- temperature variation
- BGN on/off

## REQUIRED CONSTRAINTS
- emitter must be heavily doped
- same numerical setup should be used for both runs

## REQUIRED METRIC TARGETS
- visible base-current change
- reduced gain with BGN enabled

## SPECIAL INSTRUCTIONS
The difference between the two model runs is the key result.

---

# 13) SOI MOSFET Floating-Body Effect

## PROJECT TITLE / TOPIC
SOI MOSFET Floating-Body Kink Effect Study

## PROJECT DOMAIN
SOI devices, impact ionization, output characteristics

## PROJECT STATEMENT OR PROJECT SUMMARY
Study the floating-body effect in a partially depleted SOI MOSFET. Under high drain bias, impact ionization generates holes near the drain. Because the body is isolated by the buried oxide, these holes accumulate and raise body potential, causing the kink in the output curve.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- partially depleted SOI MOSFET
- buried oxide:
  $$
  t_{BOX} = 100~\text{nm}
  $$
- floating body

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$



Use impact ionization:
$$
G_{II}(x)\propto \alpha(E)J
$$
with drift-diffusion transport and floating-body electrostatics.

## REQUIRED SIMULATION TYPE
- $I_D$--$V_{DS}$ sweep at fixed $V_{GS}$
- body potential extraction
- impact-generation mapping

## REQUIRED OUTPUTS
- kinked $I_D$--$V_{DS}$
- body potential versus $V_{DS}$
- hole generation near the drain
- threshold shift

## REQUIRED PARAMETER SWEEPS
- drain voltage sweep
- gate voltage sweep
- optional grounded-body comparison

## REQUIRED CONSTRAINTS
- body must remain floating
- impact ionization must be active
- drain field must be strong enough

## REQUIRED METRIC TARGETS
- clear kink onset
- visible body potential rise
- reduced threshold voltage

## SPECIAL INSTRUCTIONS
The kink must be directly linked to hole accumulation.

---

# 14) Schottky Barrier MOSFET

## PROJECT TITLE / TOPIC
Schottky-Barrier MOSFET Transport and Contact-Tunneling Study

## PROJECT DOMAIN
Contact physics, nanoscale MOS variants

## PROJECT STATEMENT OR PROJECT SUMMARY
Study a MOSFET in which metal or silicide source/drain contacts replace conventional doped junctions. The main goal is to show how the source barrier controls carrier injection and how tunneling through the barrier affects turn-on current.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- MOSFET with metal source
- MOSFET with metal drain
- silicon channel
- explicit Schottky barrier

Example barrier height:
$$
\Phi_B \approx 0.7~\text{eV}
$$

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$




Use Schottky contact transport:
$$
\texttt{Contact(Type=Schottky)}
$$
with tunneling enabled where needed.

## REQUIRED SIMULATION TYPE
- $I_D$--$V_{GS}$ sweep
- barrier profile extraction
- comparison with ohmic reference

## REQUIRED OUTPUTS
- transfer curve
- source barrier profile
- contact-limited current
- comparison against conventional MOSFET

## REQUIRED PARAMETER SWEEPS
- gate voltage sweep
- barrier-height sweep
- effective-mass sweep

## REQUIRED CONSTRAINTS
- metal-semiconductor interface must be explicit
- tunneling model must be active

## REQUIRED METRIC TARGETS
- visible barrier-limited turn-on
- reduced current relative to an ohmic-source device

## SPECIAL INSTRUCTIONS
The source barrier is the dominant physics element.

---

# 15) Impact-Ionization MOS

## PROJECT TITLE / TOPIC
Impact-Ionization MOS Abrupt Switching Study

## PROJECT DOMAIN
Steep-slope devices, avalanche physics, nonlinear switching

## PROJECT STATEMENT OR PROJECT SUMMARY
Study an I-MOS structure that turns on abruptly when the local electric field triggers impact ionization. The gate controls the breakdown region, and once the threshold field is reached, avalanche multiplication causes a sudden current jump.

## REQUIRED DEVICE / SYSTEM / MATERIAL
- gated $p$-$i$-$n$ or avalanche-triggered structure
- intrinsic or lightly doped channel
- gate-controlled high-field region

## REQUIRED SOFTWARE / TOOLS
- Sentaurus Device
- Sentaurus Visual
- Synopsys Sentaurus TCAD N-2017

## REQUIRED PHYSICS / MODELS 


## Governing equations

$$
\nabla \cdot \left(\varepsilon \nabla \psi\right)
=
-q\left(p-n+N_D^+-N_A^-\right)
$$

$$
\frac{\partial n}{\partial t}
=
\frac{1}{q}\nabla\cdot\mathbf{J}_n + G_n - R_n
$$

$$
\frac{\partial p}{\partial t}
=
-\frac{1}{q}\nabla\cdot\mathbf{J}_p + G_p - R_p
$$

$$
\mathbf{J}_n = q\mu_n n \mathbf{E} + qD_n \nabla n,
\qquad
\mathbf{J}_p = q\mu_p p \mathbf{E} - qD_p \nabla p
$$

$$
\mathbf{E} = -\nabla \psi
$$

$$
SS = \left(\frac{d\log_{10}(I_D)}{dV_{GS}}\right)^{-1}
$$

$$
DIBL
=
\frac{V_{th}(V_{DS,low}) - V_{th}(V_{DS,high})}
{V_{DS,high}-V_{DS,low}}
$$

For heavily doped regions, use:

$$
\texttt{EffectiveIntrinsicDensity(OldSlotboom)}
$$

For narrow devices, use:

$$
\texttt{eQuantumPotential}
\quad \text{or} \quad
\texttt{DensityGradient}
$$

For thermal coupling, use:

$$
\texttt{Thermodynamic}
$$

For avalanche, use:

$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

For BTBT, use:

$$
R_{BTBT}(x) = A|E(x)|\exp\!\left(-\frac{B}{|E(x)|}\right)
$$



Use:
$$
G_{av}(x) \propto \alpha(E)J
$$
with
$$
\alpha(E) = aE\exp\!\left(-\frac{b}{E}\right)
$$

Include:
- drift-diffusion
- avalanche generation
- SRH recombination
- optional Auger recombination

## REQUIRED SIMULATION TYPE
- drain bias near breakdown
- gate sweep to trigger avalanche
- abrupt transition analysis

## REQUIRED OUTPUTS
- steep $I_D$--$V_{GS}$
- avalanche generation map
- electric-field profile
- switching slope

## REQUIRED PARAMETER SWEEPS
- $V_{DS}$ slightly below breakdown
- $V_{GS}$ trigger sweep
- optional geometry variation

## REQUIRED CONSTRAINTS
- field must be high enough for avalanche
- ordinary MOS inversion should not dominate
- solver must remain stable near breakdown

## REQUIRED METRIC TARGETS
- extremely steep switching
- strong current jump
- clear avalanche-triggered conduction

## SPECIAL INSTRUCTIONS
Treat this as a controlled breakdown switch.

---

# Recommended Project Order

1. FinFET short-channel analysis  
2. GAA nanowire volume inversion  
3. junctionless nanowire transistor  
4. TFET  
5. Schottky barrier MOSFET  
6. BJT Gummel plot  
7. SOI floating-body effect  
8. LDMOS self-heating  
9. 4H-SiC Schottky diode  
10. AlGaN/GaN HEMT  
11. tandem solar cell  
12. CMOS image sensor crosstalk  
13. SRAM single-event upset  
14. IGBT latch-up  
15. I-MOS switching

# Final Note

The strongest N-2017 project set is the one that directly maps to the Sentaurus physics blocks:

$$
\texttt{OldSlotboom},\;
\texttt{DensityGradient},\;
\texttt{Thermodynamic},\;
\texttt{Okuto},\;
\texttt{Kane},\;
\texttt{TMM},\;
\texttt{RayTracing},\;
\texttt{HeavyIon},\;
\texttt{Schottky},\;
\texttt{ExtendedPrecision}
$$
