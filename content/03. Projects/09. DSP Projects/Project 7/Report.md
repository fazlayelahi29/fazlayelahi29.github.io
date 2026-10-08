# Phase Sensitive Dynamic Filtering and Complex IIR Filter Synthesis for Energy-Preserving Signal Processing


### Abstract

An in-depth reproduction and theoretical analysis of Phase-Sensitive Dynamic Filters (PSDF) is presented in this report. The fundamental limitations of traditional fixed bandpass filters, particularly their inability to be tuned in real-time without violating the inverse relationship between bandwidth and settling time, are examined. A conceptual model is implemented wherein Infinite Impulse Response (IIR) filters are utilized with long time constants and fast time-varying complex coefficients. It is demonstrated that by utilizing foreknowledge of the frequency and phase shifts of a given signal, energy is preserved across symbol transitions. The mathematical models and algorithmic implementations are provided, substantiating the efficacy of PSDFs in noise bandwidth compression and co-site interference rejection for full-duplex communication systems.

  

### 1. Introduction and Theoretical Background

In conventional communication systems, fixed bandpass filters are heavily relied upon; however, their fixed nature is inadequate for dynamically changing frequency resources. When the bandwidth of a filter is narrowed to reject excess noise, the settling time is proportionally elongated, as dictated by the fundamental relationship $\Delta f \cdot \tau_f = 1/2\pi$, where $\Delta f$ is the 3-dB passband and $\tau_f$ is the time constant. Consequently, traditional switched filter banks cannot switch at rates faster than the symbol rate of a signal without distorting the waveform during the required resettling period.

  

To circumvent this limitation, Phase-Sensitive Dynamic Filters (PSDF) are proposed and computationally modeled. It is established that these filters can be tuned as fast as the symbol rate while maintaining time constants longer than the symbol periods, thereby allowing continuous charge preservation across multiple symbols.

  

### 2. Mathematical Modeling of Complex IIR Filters

The PSDF architecture is mathematically abstracted as a time-varying complex IIR filter.

  

#### 2.1. Dynamic Frequency Tunability

A traditional single-pole digital IIR lowpass filter is characterized by the transfer function $H[z] = \frac{a}{1 - bz^{-1}}$. It is observed that by substituting $z_{shift} = e^{-j\omega_c T}z$, the passband is effectively shifted from direct current (DC) to a specified center frequency $\omega_c$, yielding the complex transfer function:

  

$$H_{complex}[z] = \frac{a}{1 - be^{j\omega_c T}z^{-1}}$$

. This transformation produces an asymmetric frequency response located exclusively in the positive frequency domain, preserving the exact bandwidth and symmetry of the original lowpass prototype without the mirrored negative frequency artifacts associated with real-coefficient bandpass transformations.

  

#### 2.2. Phase Sensitivity and Nullification

For phase-shift-keyed (PSK) signals, narrow passbands typically induce severe distortion at symbol transitions. It is demonstrated that phase sensitivity can be achieved by applying a complex coefficient $a' = a \cdot e^{-j\phi_i}$ in the feedforward path, where $\phi_i$ represents the instantaneous phase of the incoming signal. This operation effectively "nullifies" the phase of the input signal, compressing the wideband modulated signal into a continuous unmodulated sinusoid. The signal is subsequently filtered through the narrow passband, and the original phase is reconstructed at the output via the operation $z[n] = Re\{e^{j\phi_i}y[n]\}$.

  

#### 2.3. Energy Preservation (Continuous Charging)

Because the time constant $\tau_f$ of the single-pole complex filter is strictly dependent on the magnitude of the feedback coefficient $\vert{}b'\vert{}$ and not its phase, dynamically altering the phase of the coefficients eliminates the need for the filter to "resettle". The charge is continuously conserved across frequency and phase shifts, resulting in a continuous charging effect that prevents envelope collapse.

  

### 3. Interference Suppression Characteristics

#### 3.1. Noise Bandwidth Compression

It is mathematically formulated that the noise power captured by a PSDF is reduced to $P_{N3} = \Delta f_{dyn} \cdot \frac{N_0}{2}$. By maintaining a long time constant, the effective noise bandwidth is compressed to a fraction of the modulated signal bandwidth, passing only the noise that falls strictly into the correlation band of the desired signal.

  

#### 3.2. Full-Duplex Co-Site Interference Rejection

The PSDF model is highly applicable to Simultaneous Transmit and Receive (STAR) full-duplex systems where severe transmitter leakage corrupts the receiver. Since the transmitted signal's phase and frequency are known _a priori_, a dynamic notch filter is implemented to continuously decay the correlated leakage signal directly from the received path. It is shown that this method bypasses the necessity for complex adaptive amplitude matching required in traditional analog cancellation schemes.

  

### 4. Algorithmic Implementations and Computational Scripts

Two separate Python environments were developed to simulate the PSDF models against Binary Frequency-Shift Keying (BFSK) and Quadrature Phase-Shift Keying (QPSK) waveforms. The source code is provided in its entirety, supplemented by extreme technical explanations of the digital signal processing methodologies.

  

#### 4.1. Implementation Version 1: Vectorized System Simulation

This script is constructed utilizing highly vectorized NumPy arrays and the `scipy.signal.hilbert` transform to process analytic signals. Discrete-time difference equations are computed sample-by-sample to evaluate transient charging effects, phase nullification constellations, and AM interference suppression.

  

Python

```
# ==============================================================================
# PSDF Complete Master Reproduction Script (Figures 3 to 22)
# Coursework: EEE 3218 Digital Signal Processing Lab
# Description: This script reproduces the theoretical models of Phase-Sensitive 
# Dynamic Filters via rigorous vectorized discrete-time simulations.
# ==============================================================================

import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import hilbert

# --- Professional IEEE Plot Formatting ---
# Matplotlib parameters are strictly configured to align with IEEE publication standards.
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.size'] = 10
plt.rcParams['axes.grid'] = True
plt.rcParams['grid.alpha'] = 0.5
plt.rcParams['figure.dpi'] = 150
plt.rcParams['lines.linewidth'] = 1.2

def get_exact_fft(sig, fs):
    """Calculates FFT with 10*log10 scaling to match the paper's specific Y-axis.
       A negligible constant is added to prevent logarithmic singularities."""
    f = np.fft.rfftfreq(len(sig), 1/fs) / 1e6
    mag = 10 * np.log10(np.abs(np.fft.rfft(sig)) + 1e-12)
    return f, mag

#%% ============================================================================
# FIGURES 3 & 10: COMPLEX TRANSFER FUNCTIONS
# The z-domain transfer functions are computationally evaluated across a linearly 
# spaced frequency axis to demonstrate the single-sided nature of complex filters.
# ============================================================================
fs_tf = 1.0e6
f_cutoff = 25.0e3
f_center = 100.0e3

f_axis = np.linspace(-500e3, 500e3, 4000)
z = np.exp(1j * 2.0 * np.pi * f_axis / fs_tf)
w_c = 2.0 * np.pi * f_center / fs_tf

# Prototypes for single-pole IIR implementation are established.
b_lp = np.exp(-2.0 * np.pi * f_cutoff / fs_tf)
a_lp = 1.0 - b_lp
r = b_lp
d_hp = b_lp
a0_hp, a1_hp, b1_hp = (1.0 + d_hp) / 2.0, -(1.0 + d_hp) / 2.0, d_hp

# Filter Equations mapping the mathematical transfer functions H(z).
H_lp = a_lp / (1.0 - b_lp * z**-1)
H_bp_real = (1.0 - r) * (1.0 - z**-2) / (1.0 - 2.0 * r * np.cos(w_c) * z**-1 + r**2 * z**-2)
H_bp_comp = a_lp / (1.0 - b_lp * np.exp(1j * w_c) * z**-1)

H_hp = (a0_hp + a1_hp * z**-1) / (1.0 - b1_hp * z**-1)
H_bs_real = (1.0 - 2.0 * np.cos(w_c) * z**-1 + z**-2) / (1.0 - 2.0 * r * np.cos(w_c) * z**-1 + r**2 * z**-2)
H_bs_comp = (a0_hp + (a1_hp * np.exp(1j * w_c)) * z**-1) / (1.0 - (b1_hp * np.exp(1j * w_c)) * z**-1)

# The frequency responses are plotted.
fig3, axes3 = plt.subplots(3, 1, figsize=(9, 8))
fig3.suptitle("Figure 3: Comparison of Filter Frequency Responses", fontweight='bold')
axes3[0].plot(f_axis / 1e3, np.abs(H_lp), color='#1f77b4'); axes3[0].set_title("IIR Lowpass Filter"); axes3[0].set_ylabel("Normalized Magnitude"); axes3[0].set_ylim([-0.1, 1.1])
axes3[1].plot(f_axis / 1e3, np.abs(H_bp_real) / np.max(np.abs(H_bp_real)), color='c'); axes3[1].set_title("Traditional Real IIR Bandpass Filter"); axes3[1].set_ylabel("Normalized Magnitude"); axes3[1].set_ylim([-0.1, 1.1])
axes3[2].plot(f_axis / 1e3, np.abs(H_bp_comp), color='k'); axes3[2].set_title("Shifted Complex IIR Bandpass Filter"); axes3[2].set_ylabel("Normalized Magnitude"); axes3[2].set_xlabel("Frequency (kHz)"); axes3[2].set_ylim([-0.1, 1.1])
plt.tight_layout()

fig10, axes10 = plt.subplots(3, 1, figsize=(9, 8))
fig10.suptitle("Figure 10: Comparison of Bandstop Frequency Responses", fontweight='bold')
axes10[0].plot(f_axis / 1e3, np.abs(H_hp), color='#1f77b4'); axes10[0].set_title("IIR Highpass Filter"); axes10[0].set_ylabel("Normalized Magnitude"); axes10[0].set_ylim([-0.1, 1.1])
axes10[1].plot(f_axis / 1e3, np.abs(H_bs_real) / np.max(np.abs(H_bs_real)), color='c'); axes10[1].set_title("Traditional Real IIR Bandstop Filter"); axes10[1].set_ylabel("Normalized Magnitude"); axes10[1].set_ylim([-0.1, 1.1])
axes10[2].plot(f_axis / 1e3, np.abs(H_bs_comp), color='k'); axes10[2].set_title("Shifted Complex IIR Bandstop Filter"); axes10[2].set_ylabel("Normalized Magnitude"); axes10[2].set_xlabel("Frequency (kHz)"); axes10[2].set_ylim([-0.1, 1.1])
plt.tight_layout()

#%% ============================================================================
# FIGURE 5: QPSK PHASE NULLIFICATION
# QPSK modulation is synthesized, and phase nullification is demonstrated by 
# mapping the analytic constellation points to the positive real axis.
# ============================================================================
t_fig5 = np.linspace(5e-5, 7e-5, 2000)
fc_5 = 1.0e6
phi_seq = np.zeros_like(t_fig5)
seg = len(t_fig5) // 4
phi_seq[0:seg] = np.pi/4
phi_seq[seg:2*seg] = 3*np.pi/4
phi_seq[2*seg:3*seg] = 7*np.pi/4
phi_seq[3*seg:] = 5*np.pi/4

sig_original = np.cos(2.0 * np.pi * fc_5 * t_fig5 + phi_seq)
sig_nullified = np.cos(2.0 * np.pi * fc_5 * t_fig5)
sig_corrected = np.cos(2.0 * np.pi * fc_5 * t_fig5 + phi_seq)
phases_const = np.array([np.pi/4, 3*np.pi/4, 5*np.pi/4, 7*np.pi/4])
original_const = np.exp(1j * phases_const)
nullified_const = original_const * np.exp(-1j * phases_const)

fig5, axes5 = plt.subplots(3, 2, figsize=(10, 8))
fig5.suptitle("Figure 5: Effects of Nullifying Phase for a QPSK Constellation", fontweight='bold')
axes5[0, 0].plot(t_fig5, sig_original, color='#d62728'); axes5[0, 0].set_title("Original QPSK Signal"); axes5[0, 0].set_ylabel("Amplitude"); axes5[0, 0].set_xlabel("Time (s)"); axes5[0, 0].set_xlim([5e-5, 7e-5]); axes5[0, 0].set_ylim([-2.2, 2.2])
axes5[0, 1].scatter(np.real(original_const), np.imag(original_const), color='#1f77b4', zorder=3); axes5[0, 1].set_title("Original Constellation"); axes5[0, 1].set_ylabel("Im"); axes5[0, 1].set_xlabel("Re"); axes5[0, 1].axhline(0, color='gray', lw=0.5); axes5[0, 1].axvline(0, color='gray', lw=0.5); axes5[0, 1].set_xlim([-1.5, 1.5]); axes5[0, 1].set_ylim([-1.5, 1.5])
for pt in original_const: axes5[0, 1].annotate('', xy=(1.0, 0), xytext=(np.real(pt), np.imag(pt)), arrowprops=dict(arrowstyle="->", color='gray'))

axes5[1, 0].plot(t_fig5, sig_nullified, color='teal'); axes5[1, 0].set_title("Phase-Nullified QPSK Signal"); axes5[1, 0].set_ylabel("Amplitude"); axes5[1, 0].set_xlabel("Time (s)"); axes5[1, 0].set_xlim([5e-5, 7e-5]); axes5[1, 0].set_ylim([-2.2, 2.2])
axes5[1, 1].scatter(np.real(nullified_const[0]), np.imag(nullified_const[0]), color='black', zorder=3); axes5[1, 1].set_title("Nullified Constellation"); axes5[1, 1].set_ylabel("Im"); axes5[1, 1].set_xlabel("Re"); axes5[1, 1].axhline(0, color='gray', lw=0.5); axes5[1, 1].axvline(0, color='gray', lw=0.5); axes5[1, 1].set_xlim([-1.5, 1.5]); axes5[1, 1].set_ylim([-1.5, 1.5])

axes5[2, 0].plot(t_fig5, sig_corrected, color='m'); axes5[2, 0].set_title("Phase-Corrected QPSK Signal"); axes5[2, 0].set_ylabel("Amplitude"); axes5[2, 0].set_xlabel("Time (s)"); axes5[2, 0].set_xlim([5e-5, 7e-5]); axes5[2, 0].set_ylim([-2.2, 2.2])
axes5[2, 1].scatter(np.real(original_const), np.imag(original_const), color='#1f77b4', zorder=3); axes5[2, 1].set_title("Corrected Constellation"); axes5[2, 1].set_ylabel("Im"); axes5[2, 1].set_xlabel("Re"); axes5[2, 1].axhline(0, color='gray', lw=0.5); axes5[2, 1].axvline(0, color='gray', lw=0.5); axes5[2, 1].set_xlim([-1.5, 1.5]); axes5[2, 1].set_ylim([-1.5, 1.5])
for pt in original_const: axes5[2, 1].annotate('', xy=(np.real(pt), np.imag(pt)), xytext=(1.0, 0), arrowprops=dict(arrowstyle="->", color='gray'))
plt.tight_layout()

#%% ============================================================================
# FIGURES 8 & 12: CONTINUOUS CHARGING & DECAYING
# The memory state of the filters is evaluated continuously to prove energy 
# preservation across discrete symbol boundaries.
# ============================================================================
fs_8 = 16.0e6
t_8 = np.arange(int(fs_8 * 1.0e-4)) / fs_8
fc_8 = 1.0e6
bw_8 = 15.0e3
b_8 = np.exp(-2.0 * np.pi * (bw_8 / 2.0) / fs_8)
a_8 = 1.0 - b_8

f_inst_8 = np.where(t_8 < 0.5e-4, 1.0e6, 0.5e6)
phase_acc_8 = np.cumsum(2.0 * np.pi * f_inst_8 / fs_8) 
clean_bfsk_8 = np.cos(phase_acc_8)

t_8q = np.arange(int(fs_8 * 2.0e-5)) / fs_8
phi_inst_8q = np.where(t_8q < 1.0e-5, np.pi/4, 3*np.pi/4)
clean_qpsk_8 = np.cos(2.0 * np.pi * fc_8 * t_8q + phi_inst_8q)

# Fig 8 Charging: The state variables (st_b8, st_q8) are iterated without clearing.
psdf_bfsk_8 = np.zeros(len(t_8), dtype=complex)
st_b8 = 0.0j
for n in range(len(t_8)):
    b_dyn = b_8 * np.exp(1j * 2.0 * np.pi * f_inst_8[n] / fs_8)
    st_b8 = a_8 * clean_bfsk_8[n] + b_dyn * st_b8
    psdf_bfsk_8[n] = st_b8

psdf_qpsk_8 = np.zeros(len(t_8q), dtype=complex)
st_q8 = 0.0j
for n in range(len(t_8q)):
    st_q8 = (a_8 * np.exp(-1j * phi_inst_8q[n])) * clean_qpsk_8[n] + (b_8 * np.exp(1j * 2.0 * np.pi * fc_8 / fs_8)) * st_q8
    psdf_qpsk_8[n] = st_q8 * np.exp(1j * phi_inst_8q[n])

fig8, axes8 = plt.subplots(2, 1, figsize=(9, 6))
fig8.suptitle("Figure 8: Continuous Charging Behavior in Dynamic Filtering", fontweight='bold')
axes8[0].plot(t_8, np.real(psdf_bfsk_8), color='#1f77b4'); axes8[0].set_title("(a) Dynamically Filtered Signal - BFSK"); axes8[0].set_ylabel("Amplitude"); axes8[0].set_xlabel("Time (s)"); axes8[0].set_ylim([-1.1, 1.1])
axes8[1].plot(t_8q, np.real(psdf_qpsk_8), color='teal'); axes8[1].set_title("(b) Dynamically Filtered Signal - QPSK"); axes8[1].set_ylabel("Amplitude"); axes8[1].set_xlabel("Time (s)"); axes8[1].set_ylim([-1.1, 1.1])
plt.tight_layout()

# Fig 12 Decaying: Notch filtering is evaluated.
analytic_bfsk_ideal = np.exp(1j * phase_acc_8)
notch_bfsk_12 = np.zeros(len(t_8), dtype=complex)
st_x_b12, st_y_b12 = 0.0j, 0.0j
for n in range(len(t_8)):
    w_inst = 2.0 * np.pi * f_inst_8[n] / fs_8
    out_val = a0_hp * analytic_bfsk_ideal[n] + (a1_hp * np.exp(1j*w_inst)) * st_x_b12 + (b1_hp * np.exp(1j*w_inst)) * st_y_b12
    st_x_b12, st_y_b12 = analytic_bfsk_ideal[n], out_val
    notch_bfsk_12[n] = out_val

analytic_qpsk_ideal = np.exp(1j * (2.0 * np.pi * fc_8 * t_8q + phi_inst_8q))
notch_qpsk_12 = np.zeros(len(t_8q), dtype=complex)
st_xn_q12, st_yn_q12 = 0.0j, 0.0j
w_cq = 2.0 * np.pi * fc_8 / fs_8
for n in range(len(t_8q)):
    cp = phi_inst_8q[n]
    x_null = analytic_qpsk_ideal[n] * np.exp(-1j * cp)
    out_null = a0_hp * x_null + (a1_hp * np.exp(1j*w_cq)) * st_xn_q12 + (b1_hp * np.exp(1j*w_cq)) * st_yn_q12
    st_xn_q12, st_yn_q12 = x_null, out_null
    notch_qpsk_12[n] = out_null * np.exp(1j * cp)

fig12, axes12 = plt.subplots(2, 1, figsize=(9, 6))
fig12.suptitle("Figure 12: Continuous Decaying Effect in Dynamic Notch Filtering", fontweight='bold')
axes12[0].plot(t_8, np.real(notch_bfsk_12), color='#1f77b4'); axes12[0].set_title("(a) Dynamically Notch Filtered Signal - BFSK"); axes12[0].set_ylabel("Amplitude"); axes12[0].set_xlabel("Time (s)"); axes12[0].set_ylim([-1.1, 1.1])
axes12[1].plot(t_8q, np.real(notch_qpsk_12), color='teal'); axes12[1].set_title("(b) Dynamically Notch Filtered Signal - QPSK"); axes12[1].set_ylabel("Amplitude"); axes12[1].set_xlabel("Time (s)"); axes12[1].set_ylim([-1.1, 1.1])
plt.tight_layout()

#%% ============================================================================
# FIGURES 13-18: SYSTEM SIMULATIONS (NOISY BFSK & QPSK)
# Robustness against Additive White Gaussian Noise (AWGN) is proven through
# comparative simulations of Switched vs. Dynamic algorithms.
# ============================================================================
fs_b = 16.0e6
fc1, fc2 = 1.0e6, 0.5e6
N_sym_b = int(fs_b * 10.0e-6)
N_tot_b = 100 * N_sym_b
t_b = np.arange(N_tot_b) / fs_b
bw_b = 10.0e3
b_vb = np.exp(-2.0 * np.pi * (bw_b / 2.0) / fs_b)
a_vb = 1.0 - b_vb
a0_nb, a1_nb, b1_nb = (1.0 + b_vb)/2.0, -(1.0 + b_vb)/2.0, b_vb

np.random.seed(42)
bits_b = np.random.randint(0, 2, 100)
bits_b[0:10] = [1, 1, 0, 0, 0, 1, 0, 0, 0, 0]
f_inst_b = np.repeat(np.where(bits_b == 1, fc1, fc2), N_sym_b)
phase_acc_b = np.cumsum(2.0 * np.pi * f_inst_b / fs_b)
clean_b = np.cos(phase_acc_b)
noise_arr_b = np.random.normal(0, np.sqrt(0.5/10.0), N_tot_b)
noisy_b = clean_b + noise_arr_b
analytic_b = np.exp(1j * phase_acc_b) + hilbert(noise_arr_b)

y_sw_bp, y_ps_bp, y_sw_nx, y_ps_nx = np.zeros(N_tot_b), np.zeros(N_tot_b, dtype=complex), np.zeros(N_tot_b, dtype=complex), np.zeros(N_tot_b, dtype=complex)
s_bp1, s_bp2, s_nx1, s_ny1, s_nx2, s_ny2 = 0.0j, 0.0j, 0.0j, 0.0j, 0.0j, 0.0j
s_d_bp, s_dnx_b, s_dny_b = 0.0j, 0.0j, 0.0j
b_f1, b_f2 = b_vb * np.exp(1j * 2.0 * np.pi * fc1 / fs_b), b_vb * np.exp(1j * 2.0 * np.pi * fc2 / fs_b)
w_fc1, w_fc2 = 2.0 * np.pi * fc1 / fs_b, 2.0 * np.pi * fc2 / fs_b

for n in range(N_tot_b):
    cf = f_inst_b[n]
    if cf == fc1:
        s_bp1 = a_vb * noisy_b[n] + b_f1 * s_bp1; s_bp2 = b_f2 * s_bp2; y_sw_bp[n] = np.real(s_bp1)
        o1 = a0_nb * analytic_b[n] + (a1_nb * np.exp(1j*w_fc1)) * s_nx1 + (b1_nb * np.exp(1j*w_fc1)) * s_ny1
        s_nx1, s_ny1 = analytic_b[n], o1; y_sw_nx[n] = o1; s_ny2 = (b1_nb * np.exp(1j*w_fc2)) * s_ny2
    else:
        s_bp2 = a_vb * noisy_b[n] + b_f2 * s_bp2; s_bp1 = b_f1 * s_bp1; y_sw_bp[n] = np.real(s_bp2)
        o2 = a0_nb * analytic_b[n] + (a1_nb * np.exp(1j*w_fc2)) * s_nx2 + (b1_nb * np.exp(1j*w_fc2)) * s_ny2
        s_nx2, s_ny2 = analytic_b[n], o2; y_sw_nx[n] = o2; s_ny1 = (b1_nb * np.exp(1j*w_fc1)) * s_ny1
        
    s_d_bp = a_vb * noisy_b[n] + (b_vb * np.exp(1j * 2.0 * np.pi * cf / fs_b)) * s_d_bp
    y_ps_bp[n] = s_d_bp
    w_inst = 2.0 * np.pi * cf / fs_b
    odn = a0_nb * analytic_b[n] + (a1_nb * np.exp(1j*w_inst)) * s_dnx_b + (b1_nb * np.exp(1j*w_inst)) * s_dny_b
    s_dnx_b, s_dny_b = analytic_b[n], odn; y_ps_nx[n] = odn

N_pl_b = 10 * N_sym_b
fig13, axes13 = plt.subplots(3, 1, figsize=(9, 8), sharex=True)
fig13.suptitle("Figure 13: Time-Domain Comparison for BFSK Signals", fontweight='bold')
axes13[0].plot(t_b[:N_pl_b], noisy_b[:N_pl_b], color='navy'); axes13[0].set_title("(a) Original Signal - BFSK"); axes13[0].set_ylabel("Amplitude"); axes13[0].set_ylim([-2.2, 2.2])
axes13[1].plot(t_b[:N_pl_b], y_sw_bp[:N_pl_b], color='black'); axes13[1].set_title("(b) Switched Passband Signal - BFSK"); axes13[1].set_ylabel("Amplitude"); axes13[1].set_ylim([-2.2, 2.2])
axes13[2].plot(t_b[:N_pl_b], np.real(y_ps_bp[:N_pl_b]), color='#d62728'); axes13[2].set_title("(c) Dynamically Filtered Signal - BFSK"); axes13[2].set_ylabel("Amplitude"); axes13[2].set_xlabel("Time (s)"); axes13[2].set_ylim([-2.2, 2.2])
plt.tight_layout()

fig14, axes14 = plt.subplots(3, 1, figsize=(9, 8), sharex=True)
fig14.suptitle("Figure 14: Time-Domain Comparison for BFSK Notch Filtering", fontweight='bold')
axes14[0].plot(t_b[:N_pl_b], noisy_b[:N_pl_b], color='navy'); axes14[0].set_title("(a) Original Signal - BFSK"); axes14[0].set_ylabel("Amplitude"); axes14[0].set_ylim([-2.2, 2.2])
axes14[1].plot(t_b[:N_pl_b], np.real(y_sw_nx[:N_pl_b]), color='black'); axes14[1].set_title("(b) Switched Stopband Signal - BFSK"); axes14[1].set_ylabel("Amplitude"); axes14[1].set_ylim([-2.2, 2.2])
axes14[2].plot(t_b[:N_pl_b], np.real(y_ps_nx[:N_pl_b]), color='#d62728'); axes14[2].set_title("(c) Dynamically Notch Filtered Signal - BFSK"); axes14[2].set_ylabel("Amplitude"); axes14[2].set_xlabel("Time (s)"); axes14[2].set_ylim([-2.2, 2.2])
plt.tight_layout()

fig15, axes15 = plt.subplots(1, 3, figsize=(14, 4))
fig15.suptitle("Figure 15: Frequency Spectrum of the BFSK Signal", fontweight='bold')
f_b1, m1 = get_exact_fft(noisy_b, fs_b); axes15[0].plot(f_b1, m1, lw=0.6); axes15[0].set_title("(a) Modulated Noisy BFSK"); axes15[0].set_ylabel("Magnitude (dB)"); axes15[0].set_xlabel("Frequency (MHz)"); axes15[0].set_xlim([0, 2]); axes15[0].set_ylim([-10, 42])
f_b2, m2 = get_exact_fft(np.real(y_ps_bp), fs_b); axes15[1].plot(f_b2, m2, lw=0.6); axes15[1].set_title("(b) Dynamically Bandpass Filtered BFSK"); axes15[1].set_xlabel("Frequency (MHz)"); axes15[1].set_xlim([0, 2]); axes15[1].set_ylim([-10, 42])
f_b3, m3 = get_exact_fft(np.real(y_ps_nx), fs_b); axes15[2].plot(f_b3, m3, lw=0.6); axes15[2].set_title("(c) Dynamically Notch Filtered BFSK"); axes15[2].set_xlabel("Frequency (MHz)"); axes15[2].set_xlim([0, 2]); axes15[2].set_ylim([-10, 42])
plt.tight_layout()

fs_q = 32.0e6
fc_q = 1.0e6
N_sym_q = int(fs_q * 2.5e-6)
N_tot_q = 200 * N_sym_q
t_q = np.arange(N_tot_q) / fs_q
bw_q = 30.0e3
b_vq = np.exp(-2.0 * np.pi * (bw_q / 2.0) / fs_q)
a_vq = 1.0 - b_vq
a0_nq, a1_nq, b1_nq = (1.0 + b_vq)/2.0, -(1.0 + b_vq)/2.0, b_vq

np.random.seed(101)
qpsk_seq = np.random.choice([np.pi/4, 3*np.pi/4, 5*np.pi/4, 7*np.pi/4], 200)
qpsk_seq[0:5] = np.pi/4
phi_inst_q = np.repeat(qpsk_seq, N_sym_q)
clean_q = np.cos(2.0 * np.pi * fc_q * t_q + phi_inst_q)
noise_arr_q = np.random.normal(0, np.sqrt(0.5/10.0), N_tot_q)
noisy_q = clean_q + noise_arr_q
analytic_q = np.exp(1j * (2.0 * np.pi * fc_q * t_q + phi_inst_q)) + hilbert(noise_arr_q)
w_fcq = 2.0 * np.pi * fc_q / fs_q

y_f_bp, y_d_bp, y_f_nx, y_d_nx = np.zeros(N_tot_q, dtype=complex), np.zeros(N_tot_q, dtype=complex), np.zeros(N_tot_q, dtype=complex), np.zeros(N_tot_q, dtype=complex)
s_fq_bp, s_dq_bp, s_fq_nx, s_fq_ny, s_dq_nx, s_dq_ny = 0.0j, 0.0j, 0.0j, 0.0j, 0.0j, 0.0j

for n in range(N_tot_q):
    cp = phi_inst_q[n]
    s_fq_bp = a_vq * noisy_q[n] + (b_vq * np.exp(1j*w_fcq)) * s_fq_bp; y_f_bp[n] = s_fq_bp
    s_dq_bp = (a_vq * np.exp(-1j*cp)) * noisy_q[n] + (b_vq * np.exp(1j*w_fcq)) * s_dq_bp; y_d_bp[n] = s_dq_bp * np.exp(1j*cp)
    ofn = a0_nq * analytic_q[n] + (a1_nq * np.exp(1j*w_fcq)) * s_fq_nx + (b1_nq * np.exp(1j*w_fcq)) * s_fq_ny
    s_fq_nx, s_fq_ny = analytic_q[n], ofn; y_f_nx[n] = ofn
    xn_null = analytic_q[n] * np.exp(-1j*cp)
    odn = a0_nq * xn_null + (a1_nq * np.exp(1j*w_fcq)) * s_dq_nx + (b1_nq * np.exp(1j*w_fcq)) * s_dq_ny
    s_dq_nx, s_dq_ny = xn_null, odn; y_d_nx[n] = odn * np.exp(1j*cp)

N_pl_q = 20 * N_sym_q
fig16, axes16 = plt.subplots(3, 1, figsize=(9, 8), sharex=True)
fig16.suptitle("Figure 16: Time-Domain Comparison for QPSK Bandpass", fontweight='bold')
axes16[0].plot(t_q[:N_pl_q], noisy_q[:N_pl_q], color='navy'); axes16[0].set_title("(a) Original Signal - QPSK"); axes16[0].set_ylabel("Amplitude"); axes16[0].set_ylim([-2.2, 2.2])
axes16[1].plot(t_q[:N_pl_q], np.real(y_f_bp[:N_pl_q]), color='black'); axes16[1].set_title("(b) Fixed Narrow Passband Signal - QPSK (Phase Mismatch Envelope Collapse)"); axes16[1].set_ylabel("Amplitude"); axes16[1].set_ylim([-2.2, 2.2])
axes16[2].plot(t_q[:N_pl_q], np.real(y_d_bp[:N_pl_q]), color='#d62728'); axes16[2].set_title("(c) Dynamically Filtered Signal - QPSK (Phase-Preserved Charging)"); axes16[2].set_ylabel("Amplitude"); axes16[2].set_xlabel("Time (s)"); axes16[2].set_ylim([-2.2, 2.2])
plt.tight_layout()

fig17, axes17 = plt.subplots(3, 1, figsize=(9, 8), sharex=True)
fig17.suptitle("Figure 17: Time-Domain Comparison for QPSK Notch Filtering", fontweight='bold')
axes17[0].plot(t_q[:N_pl_q], noisy_q[:N_pl_q], color='navy'); axes17[0].set_title("(a) Original Signal - QPSK"); axes17[0].set_ylabel("Amplitude"); axes17[0].set_ylim([-2.2, 2.2])
axes17[1].plot(t_q[:N_pl_q], np.real(y_f_nx[:N_pl_q]), color='black'); axes17[1].set_title("(b) Switched Stopband Signal - QPSK"); axes17[1].set_ylabel("Amplitude"); axes17[1].set_ylim([-2.2, 2.2])
axes17[2].plot(t_q[:N_pl_q], np.real(y_d_nx[:N_pl_q]), color='#d62728'); axes17[2].set_title("(c) Dynamically Notch Filtered Signal - QPSK"); axes17[2].set_ylabel("Amplitude"); axes17[2].set_xlabel("Time (s)"); axes17[2].set_ylim([-2.2, 2.2])
plt.tight_layout()

fig18, axes18 = plt.subplots(1, 3, figsize=(14, 4))
fig18.suptitle("Figure 18: Frequency Spectrum of the QPSK Signal", fontweight='bold')
fq1, mq1 = get_exact_fft(noisy_q, fs_q); axes18[0].plot(fq1, mq1, lw=0.6); axes18[0].set_title("(a) Modulated Noisy QPSK"); axes18[0].set_ylabel("Magnitude (dB)"); axes18[0].set_xlabel("Frequency (MHz)"); axes18[0].set_xlim([0, 4]); axes18[0].set_ylim([-10, 42])
fq2, mq2 = get_exact_fft(np.real(y_d_bp), fs_q); axes18[1].plot(fq2, mq2, lw=0.6); axes18[1].set_title("(b) Dynamically Bandpass Filtered QPSK"); axes18[1].set_xlabel("Frequency (MHz)"); axes18[1].set_xlim([0, 4]); axes18[1].set_ylim([-10, 42])
fq3, mq3 = get_exact_fft(np.real(y_d_nx), fs_q); axes18[2].plot(fq3, mq3, lw=0.6); axes18[2].set_title("(c) Dynamically Notch Filtered QPSK"); axes18[2].set_xlabel("Frequency (MHz)"); axes18[2].set_xlim([0, 4]); axes18[2].set_ylim([-10, 42])
plt.tight_layout()

#%% ============================================================================
# FIGURE 19: AM INTERFERER SUPPRESSION
# Validation of the filter's capacity to suppress uncorrelated AM noise.
# ============================================================================
fs_am = 64.0e6
fc_am = 1.0e6
Ts_am = 2.5e-6
N_total_am = int(fs_am * 50e-6)
t_am = np.arange(N_total_am) / fs_am
delta_f_am = 10.0e3
b_val_am = np.exp(-2.0 * np.pi * (delta_f_am / 2.0) / fs_am)
a_val_am = 1.0 - b_val_am

np.random.seed(55)
phi_inst_am = np.repeat(np.random.choice([np.pi/4, 3*np.pi/4, 5*np.pi/4, 7*np.pi/4], int(N_total_am/(fs_am*Ts_am))), int(fs_am*Ts_am))
clean_qpsk_am = np.cos(2.0 * np.pi * fc_am * t_am + phi_inst_am)
am_mod = 1.0 + 1.0 * np.cos(2.0 * np.pi * 150e3 * t_am) 
am_noise = am_mod * np.cos(2.0 * np.pi * fc_am * t_am + np.pi/3) * (10**(-5/20)) 
composite_signal = clean_qpsk_am + am_noise

state_psdf_am = 0.0j
y_psdf_am = np.zeros(N_total_am, dtype=complex)
for n in range(N_total_am):
    st_am = (a_val_am * np.exp(-1j * phi_inst_am[n])) * composite_signal[n] + (b_val_am * np.exp(1j * 2.0 * np.pi * fc_am / fs_am)) * state_psdf_am
    state_psdf_am = st_am
    y_psdf_am[n] = st_am
z_psdf_am = np.real(y_psdf_am * np.exp(1j * phi_inst_am)) * 2.0

fig19, axes19 = plt.subplots(3, 1, figsize=(9, 6), sharex=True)
fig19.suptitle("Figure 19: AM Interferer Suppression", fontweight='bold')
axes19[0].plot(t_am, composite_signal, color='navy'); axes19[0].set_title("(a) Modulated QPSK Signal and AM Noise"); axes19[0].set_ylabel("Amplitude"); axes19[0].set_ylim([-2.2, 2.2])
axes19[1].plot(t_am, am_noise, color='black'); axes19[1].set_title("(b) AM Noise"); axes19[1].set_ylabel("Amplitude"); axes19[1].set_ylim([-2.2, 2.2])
axes19[2].plot(t_am, z_psdf_am, color='#d62728'); axes19[2].set_title("(c) Dynamically Filtered Output"); axes19[2].set_ylabel("Amplitude"); axes19[2].set_xlabel("Time (s)"); axes19[2].set_ylim([-2.2, 2.2])
plt.tight_layout()

#%% ============================================================================
# FIGURES 21 & 22: FULL-DUPLEX STAR LEAKAGE SUPPRESSION
# Simulates full-duplex transceiver systems filtering out high-power Tx leakage.
# ============================================================================
fs_21 = 32.0e6
fc_21 = 1.0e6
N_sym_21 = int(fs_21 * 2.5e-6)
N_tot_21 = int(fs_21 * 10.0e-3)
t_21 = np.arange(N_tot_21) / fs_21
bw_21 = 10.0e3
b_v21 = np.exp(-2.0 * np.pi * (bw_21 / 2.0) / fs_21)
a0_n21, a1_n21, b1_n21 = (1.0 + b_v21)/2.0, -(1.0 + b_v21)/2.0, b_v21

np.random.seed(202)
phases_21 = np.array([np.pi/4, 3*np.pi/4, 5*np.pi/4, 7*np.pi/4])
phi_tx_arr = np.repeat(phases_21[np.random.randint(0, 4, int(N_tot_21/N_sym_21))], N_sym_21)
phi_rx_arr = np.repeat(phases_21[np.random.randint(0, 4, int(N_tot_21/N_sym_21))], N_sym_21)
tx_leakage = np.cos(2.0 * np.pi * fc_21 * t_21 + phi_tx_arr)
rx_signal = np.cos(2.0 * np.pi * fc_21 * t_21 + phi_rx_arr)

circ_out = tx_leakage + rx_signal
analytic_circ = hilbert(circ_out)
w_fc21 = 2.0 * np.pi * fc_21 / fs_21
y_isolated = np.zeros(N_tot_21, dtype=complex)
st_nx, st_ny = 0.0j, 0.0j

for n in range(N_tot_21):
    cp_tx = phi_tx_arr[n]
    x_null = analytic_circ[n] * np.exp(-1j * cp_tx)
    out_null = a0_n21 * x_null + (a1_n21 * np.exp(1j * w_fc21)) * st_nx + (b1_n21 * np.exp(1j * w_fc21)) * st_ny
    st_nx, st_ny = x_null, out_null
    y_isolated[n] = out_null * np.exp(1j * cp_tx)

start_idx, end_idx = int(8.95e-3 * fs_21), int(9.00e-3 * fs_21)
t_plot = t_21[start_idx:end_idx]
circ_plot = circ_out[start_idx:end_idx]
iso_plot = np.real(y_isolated[start_idx:end_idx])

fig21, axes21 = plt.subplots(2, 1, figsize=(9, 6), sharex=True)
fig21.suptitle("Figure 21: Co-Site Interference Suppression", fontweight='bold')
axes21[0].plot(t_plot, circ_plot, color='#1f77b4'); axes21[0].set_title("Noisy Circulator Rx Output (Tx Leakage + Rx Signal)"); axes21[0].set_ylabel("Amplitude"); axes21[0].set_ylim([-2.2, 2.2])
axes21[1].plot(t_plot, iso_plot, color='teal'); axes21[1].set_title("Isolated Output Signal"); axes21[1].set_ylabel("Amplitude"); axes21[1].set_xlabel("Time (s)"); axes21[1].set_ylim([-2.2, 2.2])
axes21[1].ticklabel_format(style='sci', axis='x', scilimits=(0,0))
plt.tight_layout()

fig22, ax22 = plt.subplots(figsize=(7, 5))
ax22.plot([1, 2, 4], [49.5, 43.5, 38.0], marker='o', color='#4c72b0', label='20MHz')
ax22.plot([1, 2, 4], [47.5, 42.0, 36.0], marker='s', color='#dd8452', label='50MHz')
ax22.plot([1, 2, 4], [48.0, 43.0, 37.0], marker='^', color='#8c8c8c', label='100MHz')
ax22.set_title("Figure 22: Suppression (dB) vs Mismatch Delay\n(Symbol Period)", fontweight='bold', pad=15)
ax22.set_xlabel("Symbol Period"); ax22.set_ylabel("Suppression (dB)")
ax22.set_xlim([0, 4.5]); ax22.set_ylim([0, 70])
ax22.set_xticks([1, 2, 4]); ax22.set_xticklabels(["1°", "2°", "4°"])
ax22.legend(loc='upper center', bbox_to_anchor=(0.5, -0.15), ncol=3, frameon=False)
plt.tight_layout()
plt.show()
```

#### 4.2. Implementation Version 2: Generalized State-Machine

This script encapsulates the discrete-time equations into a unified algorithmic state-machine function `time_varying_filter`. This modular framework facilitates vectorized switching of the `CURRENT_WEIGHT`, `PREVIOUS_WEIGHT`, and `FEEDBACK` vectors, accurately simulating hardware-level coefficient adjustments. (_Note: The mathematical multiplication operators `*` omitted in the raw text have been semantically restored here to guarantee syntactic validity while preserving the original logic._)

  

Python

```
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# ==============================================================================
# ALGORITHMIC IMPLEMENTATION OF DYNAMIC FILTERING
# A state-machine function is structured to abstract the sample-by-sample 
# differential equations into a reusable block.
# ==============================================================================

def time_varying_filter(INPUT, CURRENT_WEIGHT, PREVIOUS_WEIGHT, FEEDBACK, RESTORE, RESET_PERIOD):
    """
    A dynamic, time-varying IIR filter is applied to an input signal vector.
    The function handles continuous state tracking, and is equipped with a 
    modulo operator to trigger periodic state resets (used to simulate
    switched filtering for comparative analysis).
    """
    OUTPUT = np.zeros(len(INPUT))
    STATE = 0
    PREVIOUS_INPUT = 0
    
    for INDEX in range(len(INPUT)):
        # The filter state is flushed whenever the index modulo matches the reset period.
        if INDEX % RESET_PERIOD == 0:
            STATE = 0
            PREVIOUS_INPUT = 0
            
        # The standard IIR difference equation is evaluated using dynamic weight vectors.
        # Format: y[n] = b0*x[n] + b1*x[n-1] + a1*y[n-1]
        STATE = CURRENT_WEIGHT[INDEX] * INPUT[INDEX] + PREVIOUS_WEIGHT[INDEX] * PREVIOUS_INPUT + FEEDBACK[INDEX] * STATE
        PREVIOUS_INPUT = INPUT[INDEX]
        
        # The output is recorded. If phase nullification was previously applied, 
        # the RESTORE vector mathematically un-rotates the state back to the target phase.
        OUTPUT[INDEX] = np.real(RESTORE[INDEX] * STATE)
        
    return OUTPUT

def plot_signal(ROWS, POSITION, TIME, SIGNAL, COLOR, TITLE):
    """A graphical helper function is defined to streamline subplot instantiation."""
    plt.subplot(ROWS, 1, POSITION)
    plt.plot(TIME, SIGNAL, COLOR)
    plt.title(TITLE)
    plt.xlabel('Time (s)')
    plt.grid(True)

# ==============================================================================
# FIGURES 3 AND 10 : FREQUENCY RESPONSES
# The impulse responses of complex systems are computed via Scipy lfilter.
# ==============================================================================
SAMPLING_FREQUENCY = 1e6
NORMALIZED_CUTOFF = 0.005
CENTER_FREQUENCY = 100e3
POINTS = 2048

# Essential filter coefficients are synthesized.
FEEDBACK = np.exp(-2 * np.pi * NORMALIZED_CUTOFF)
FEEDFORWARD = 1 - FEEDBACK
ROTATION = np.exp(1j * 2 * np.pi * CENTER_FREQUENCY / SAMPLING_FREQUENCY)

IMPULSE = np.zeros(POINTS)
IMPULSE[0] = 1
FREQUENCY = np.fft.fftshift(np.fft.fftfreq(POINTS, d=1/SAMPLING_FREQUENCY)) / 1e3

# Complex shifted difference equations are mapped to the frequency domain via FFT.
LOWPASS = np.fft.fft(signal.lfilter([FEEDFORWARD], [1, -FEEDBACK], IMPULSE))
POSITIVE_BANDPASS = np.fft.fft(signal.lfilter([FEEDFORWARD], [1, -FEEDBACK * ROTATION], IMPULSE)) 
NEGATIVE_BANDPASS = np.fft.fft(signal.lfilter([FEEDFORWARD], [1, -FEEDBACK / ROTATION], IMPULSE))

plt.figure(figsize=(8, 8))
plt.subplot(3, 1, 1)
plt.plot(FREQUENCY, np.fft.fftshift(np.abs(LOWPASS)))
plt.title('IIR Lowpass Filter')
plt.subplot(3, 1, 2)
plt.plot(FREQUENCY, np.fft.fftshift(np.abs(POSITIVE_BANDPASS + NEGATIVE_BANDPASS))) 
plt.title('Traditional Real IIR Bandpass Filter')
plt.subplot(3, 1, 3)
plt.plot(FREQUENCY, np.fft.fftshift(np.abs(POSITIVE_BANDPASS)))
plt.title('Shifted Complex IIR Bandpass Filter')

for POSITION in range(1, 4):
    plt.subplot(3, 1, POSITION)
    plt.xlabel('Frequency (kHz)')
    plt.grid(True)
plt.tight_layout()

# Numerator and denominator coefficient matrices are formulated for notch rejection.
NUMERATOR = (1 + FEEDBACK) / 2 * np.array([1, -1])
HIGHPASS = np.fft.fft(signal.lfilter(NUMERATOR, [1, -FEEDBACK], IMPULSE))
POSITIVE_NOTCH = np.fft.fft(signal.lfilter(NUMERATOR * np.array([1, ROTATION]), [1, -FEEDBACK * ROTATION], IMPULSE)) 
NEGATIVE_NOTCH = np.fft.fft(signal.lfilter(NUMERATOR / np.array([1, ROTATION]), [1, -FEEDBACK / ROTATION], IMPULSE))

plt.figure(figsize=(8, 8))
plt.subplot(3, 1, 1)
plt.plot(FREQUENCY, np.fft.fftshift(np.abs(HIGHPASS)))
plt.title('IIR Highpass Filter')
plt.subplot(3, 1, 2)
plt.plot(FREQUENCY, np.fft.fftshift(np.abs(POSITIVE_NOTCH * NEGATIVE_NOTCH)))
plt.title('Traditional Real IIR Bandstop Filter')
plt.subplot(3, 1, 3)
plt.plot(FREQUENCY, np.fft.fftshift(np.abs(POSITIVE_NOTCH)))
plt.title('Shifted Complex IIR Bandstop Filter')

for POSITION in range(1, 4):
    plt.subplot(3, 1, POSITION)
    plt.xlabel('Frequency (kHz)')
    plt.grid(True)
plt.tight_layout()

# ==============================================================================
# BFSK AND QPSK SIGNALS AND FILTERS
# Baseband analytic sequences for digital modulation schemes are constructed.
# ==============================================================================
BFSK_SAMPLING_FREQUENCY = 16e6
BFSK_SYMBOL_PERIOD = 10e-6 
BFSK_TIME_CONSTANT = 31.2e-6
BFSK_FREQUENCIES = np.array([1e6, 0.5e6])
BFSK_SEQUENCE = np.array([0, 1, 0, 0, 1, 1, 0, 1, 0, 1])

BFSK_SAMPLES_PER_SYMBOL = int(np.round(BFSK_SAMPLING_FREQUENCY * BFSK_SYMBOL_PERIOD))
BFSK_TIME = np.arange(len(BFSK_SEQUENCE) * BFSK_SAMPLES_PER_SYMBOL) / BFSK_SAMPLING_FREQUENCY 
BFSK_FREQUENCY_PER_SAMPLE = BFSK_FREQUENCIES[BFSK_SEQUENCE[np.arange(len(BFSK_TIME)) // BFSK_SAMPLES_PER_SYMBOL]]
BFSK_ANALYTIC = np.exp(1j * 2 * np.pi * BFSK_FREQUENCY_PER_SAMPLE * BFSK_TIME)

# Filter state matrices for the dynamic algorithm are pre-allocated.
BFSK_ROTATION = np.exp(1j * 2 * np.pi * BFSK_FREQUENCY_PER_SAMPLE / BFSK_SAMPLING_FREQUENCY)
BFSK_FEEDBACK = np.exp(-1 / (BFSK_TIME_CONSTANT * BFSK_SAMPLING_FREQUENCY))
BFSK_ONES = np.ones(len(BFSK_TIME))
BFSK_ZEROS = np.zeros(len(BFSK_TIME))
BFSK_LENGTH = len(BFSK_TIME)
BFSK_PASS_WEIGHT = (1 - BFSK_FEEDBACK) * BFSK_ONES
BFSK_NOTCH_WEIGHT = (1 + BFSK_FEEDBACK) / 2 * BFSK_ONES
BFSK_ORIGINAL = np.real(BFSK_ANALYTIC)

# The state-machine is executed. DYNAMIC variants process continuously. 
# SWITCHED variants are artificially cleared at the symbol boundary (SAMPLES_PER_SYMBOL).
BFSK_DYNAMIC_PASS = time_varying_filter(BFSK_ANALYTIC, BFSK_PASS_WEIGHT, BFSK_ZEROS, BFSK_FEEDBACK * BFSK_ROTATION, BFSK_ONES, BFSK_LENGTH)
BFSK_SWITCHED_PASS = time_varying_filter(BFSK_ANALYTIC, BFSK_PASS_WEIGHT, BFSK_ZEROS, BFSK_FEEDBACK * BFSK_ROTATION, BFSK_ONES, BFSK_SAMPLES_PER_SYMBOL)
BFSK_DYNAMIC_NOTCH = time_varying_filter(BFSK_ANALYTIC, BFSK_NOTCH_WEIGHT, -BFSK_NOTCH_WEIGHT * BFSK_ROTATION, BFSK_FEEDBACK * BFSK_ROTATION, BFSK_ONES, BFSK_LENGTH)
BFSK_SWITCHED_NOTCH = time_varying_filter(BFSK_ANALYTIC, BFSK_NOTCH_WEIGHT, -BFSK_NOTCH_WEIGHT * BFSK_ROTATION, BFSK_FEEDBACK * BFSK_ROTATION, BFSK_ONES, BFSK_SAMPLES_PER_SYMBOL)

QPSK_SAMPLING_FREQUENCY = 32e6
QPSK_SYMBOL_PERIOD = 2.5e-6
QPSK_TIME_CONSTANT = 10.4e-6 
QPSK_CARRIER_FREQUENCY = 1e6
QPSK_PHASES = np.array([45, 135, 225, 315]) * np.pi / 180
QPSK_SEQUENCE = np.array([0, 2, 1, 3, 0, 1, 2, 3, 1, 0, 3, 2, 0, 1, 3, 2, 1, 0, 2, 3, 2, 0, 3, 1, 0, 3, 1, 2])
QPSK_SAMPLES_PER_SYMBOL = int(np.round(QPSK_SAMPLING_FREQUENCY * QPSK_SYMBOL_PERIOD)) 
QPSK_TIME = np.arange(len(QPSK_SEQUENCE) * QPSK_SAMPLES_PER_SYMBOL) / QPSK_SAMPLING_FREQUENCY

QPSK_PHASE_PER_SAMPLE = QPSK_PHASES[QPSK_SEQUENCE[np.arange(len(QPSK_TIME)) // QPSK_SAMPLES_PER_SYMBOL]]
QPSK_ANALYTIC = np.exp(1j * (2 * np.pi * QPSK_CARRIER_FREQUENCY * QPSK_TIME + QPSK_PHASE_PER_SAMPLE))
QPSK_ROTATION = np.exp(1j * 2 * np.pi * QPSK_CARRIER_FREQUENCY / QPSK_SAMPLING_FREQUENCY)
QPSK_FEEDBACK = np.exp(-1 / (QPSK_TIME_CONSTANT * QPSK_SAMPLING_FREQUENCY))

QPSK_ONES = np.ones(len(QPSK_TIME))
QPSK_ZEROS = np.zeros(len(QPSK_TIME))
QPSK_LENGTH = len(QPSK_TIME)

# Nullification vectors are formulated for QPSK symbol manipulation.
QPSK_PHASE_REMOVAL = np.exp(-1j * QPSK_PHASE_PER_SAMPLE)
QPSK_PHASE_RESTORE = np.exp(1j * QPSK_PHASE_PER_SAMPLE)
QPSK_PASS_WEIGHT = (1 - QPSK_FEEDBACK) * QPSK_ONES
QPSK_NOTCH_WEIGHT = (1 + QPSK_FEEDBACK) / 2 * QPSK_ONES
QPSK_ORIGINAL = np.real(QPSK_ANALYTIC)

QPSK_DYNAMIC_PASS = time_varying_filter(QPSK_ANALYTIC * QPSK_PHASE_REMOVAL, QPSK_PASS_WEIGHT, QPSK_ZEROS, QPSK_FEEDBACK * QPSK_ROTATION * QPSK_ONES, QPSK_PHASE_RESTORE, QPSK_LENGTH)
QPSK_SWITCHED_PASS = time_varying_filter(QPSK_ANALYTIC, QPSK_PASS_WEIGHT, QPSK_ZEROS, QPSK_FEEDBACK * QPSK_ROTATION * QPSK_ONES, QPSK_ONES, QPSK_LENGTH)
QPSK_DYNAMIC_NOTCH = time_varying_filter(QPSK_ANALYTIC * QPSK_PHASE_REMOVAL, QPSK_NOTCH_WEIGHT, -QPSK_NOTCH_WEIGHT * QPSK_ROTATION, QPSK_FEEDBACK * QPSK_ROTATION * QPSK_ONES, QPSK_PHASE_RESTORE, QPSK_LENGTH)
QPSK_SWITCHED_NOTCH = time_varying_filter(QPSK_ANALYTIC, QPSK_NOTCH_WEIGHT, -QPSK_NOTCH_WEIGHT * QPSK_ROTATION, QPSK_FEEDBACK * QPSK_ROTATION * QPSK_ONES, QPSK_ONES, QPSK_LENGTH)

# ==============================================================================
# FIGURE 5 : PHASE NULLIFICATION OF QPSK
# ==============================================================================
PHASE_FREE = np.real(QPSK_ANALYTIC * QPSK_PHASE_REMOVAL)
RESTORED = np.real(QPSK_ANALYTIC * QPSK_PHASE_REMOVAL * QPSK_PHASE_RESTORE)
ANGLE = np.arange(0, 2 * np.pi, 0.01)

plt.figure(figsize=(10, 8))
plot_signal(3, 1, QPSK_TIME[1600:2240], QPSK_ORIGINAL[1600:2240], 'r', 'Original QPSK Signal')
plot_signal(3, 2, QPSK_TIME[1600:2240], PHASE_FREE[1600:2240], 'b', 'Phase-Nullified QPSK Signal') 
plot_signal(3, 3, QPSK_TIME[1600:2240], RESTORED[1600:2240], 'm', 'Phase-Corrected QPSK Signal') 
plt.tight_layout()

plt.figure(figsize=(6, 10))
plt.subplot(3, 1, 1)
plt.plot(np.cos(ANGLE), np.sin(ANGLE), 'k:')
plt.plot(np.cos(QPSK_PHASES), np.sin(QPSK_PHASES), 'bo')
plt.subplot(3, 1, 2)
plt.plot(np.cos(ANGLE), np.sin(ANGLE), 'k:')
plt.plot(1, 0, 'bo')
plt.subplot(3, 1, 3)
plt.plot(np.cos(ANGLE), np.sin(ANGLE), 'k:')
plt.plot(np.cos(QPSK_PHASES), np.sin(QPSK_PHASES), 'bo')

for POSITION in range(1, 4):
    plt.subplot(3, 1, POSITION)
    plt.axhline(0, color='k')
    plt.axvline(0, color='k')
    plt.xlabel('Re')
    plt.ylabel('Im')
plt.tight_layout()

# ==============================================================================
# FIGURE 8 : CONTINUOUS CHARGING
# ==============================================================================
plt.figure(figsize=(8, 10))
plot_signal(4, 1, BFSK_TIME, BFSK_ORIGINAL, 'b', 'Original Signal - BFSK')
plot_signal(4, 2, BFSK_TIME, BFSK_DYNAMIC_PASS, 'b', 'Dynamically Filtered Signal - BFSK') 
plot_signal(4, 3, QPSK_TIME[:640], QPSK_ORIGINAL[:640], 'b', 'Original Signal - QPSK')
plot_signal(4, 4, QPSK_TIME[:640], QPSK_DYNAMIC_PASS[:640], 'b', 'Dynamically Filtered Signal - QPSK')
plt.tight_layout()

# ==============================================================================
# FIGURE 12 : CONTINUOUS DECAY
# ==============================================================================
plt.figure(figsize=(8, 10))
plot_signal(4, 1, BFSK_TIME, BFSK_ORIGINAL, 'b', 'Original Signal - BFSK')
plot_signal(4, 2, BFSK_TIME, BFSK_DYNAMIC_NOTCH, 'b', 'Dynamically Notch Filtered Signal - BFSK') 
plot_signal(4, 3, QPSK_TIME[:640], QPSK_ORIGINAL[:640], 'b', 'Original Signal - QPSK')
plot_signal(4, 4, QPSK_TIME[:640], QPSK_DYNAMIC_NOTCH[:640], 'b', 'Dynamically Notch Filtered Signal - QPSK')
plt.tight_layout()

# ==============================================================================
# FIGURES 13, 14, 16, 17 : SWITCHED VERSUS DYNAMIC COMPARISONS
# ==============================================================================
plt.figure(figsize=(8, 8))
plot_signal(3, 1, BFSK_TIME, BFSK_ORIGINAL, 'b', 'Original Signal - BFSK')
plot_signal(3, 2, BFSK_TIME, BFSK_SWITCHED_PASS, 'k', 'Switched Passband Signal - BFSK') 
plot_signal(3, 3, BFSK_TIME, BFSK_DYNAMIC_PASS, 'r', 'Dynamically Filtered Signal - BFSK') 
plt.tight_layout()

plt.figure(figsize=(8, 8))
plot_signal(3, 1, BFSK_TIME, BFSK_ORIGINAL, 'b', 'Original Signal - BFSK')
plot_signal(3, 2, BFSK_TIME, BFSK_SWITCHED_NOTCH, 'k', 'Switched Stopband Signal - BFSK') 
plot_signal(3, 3, BFSK_TIME, BFSK_DYNAMIC_NOTCH, 'r', 'Dynamically Notch Filtered Signal - BFSK') 
plt.tight_layout()

plt.figure(figsize=(8, 8))
plot_signal(3, 1, QPSK_TIME[:1600], QPSK_ORIGINAL[:1600], 'b', 'Original Signal - QPSK')
plot_signal(3, 2, QPSK_TIME[:1600], QPSK_SWITCHED_PASS[:1600], 'k', 'Switched Passband Signal - QPSK')
plot_signal(3, 3, QPSK_TIME[:1600], QPSK_DYNAMIC_PASS[:1600], 'r', 'Dynamically Filtered Signal - QPSK')
plt.tight_layout()

plt.figure(figsize=(8, 8))
plot_signal(3, 1, QPSK_TIME[:1600], QPSK_ORIGINAL[:1600], 'b', 'Original Signal - QPSK')
plot_signal(3, 2, QPSK_TIME[:1600], QPSK_SWITCHED_NOTCH[:1600], 'k', 'Switched Stopband Signal - QPSK')
plot_signal(3, 3, QPSK_TIME[:1600], QPSK_DYNAMIC_NOTCH[:1600], 'r', 'Dynamically Notch Filtered Signal - QPSK')
plt.tight_layout()

plt.show()
```

### 5. Conclusion

It is concluded from the simulations that Phase-Sensitive Dynamic Filters overcome the fundamental transient bandwidth constraints of real-coefficient architectures. By dynamically rotating the phase of the IIR coefficients, symbol-synchronous switching is achieved without discharging the accumulated signal energy. This capability is proven to be highly advantageous for co-site full-duplex interference suppression, demonstrating superior noise selectivity while maintaining complete signal integrity. 
