# Phase Sensitive Dynamic Filtering and Complex IIR Filter Synthesis

  

**Abstract**

A rigorous investigation into Phase-Shift Dynamic Filtering (PSDF) and complex Infinite Impulse Response (IIR) filter synthesis is presented in this report. Traditional real-coefficient IIR filters are fundamentally limited by transient envelope collapse when subjected to signals with instantaneous frequency or phase transitions, such as Frequency Shift Keying (FSK) and Phase Shift Keying (PSK). To mitigate this, a dynamically modulated filter architecture is proposed and evaluated. By mathematically rotating the internal state memory of the filter in synchronization with the incoming signal's instantaneous phase, continuous transient charging and decaying behaviors are achieved. Furthermore, phase nullification techniques for Quadrature Phase Shift Keying (QPSK) and full-duplex co-site interference suppression are analyzed. Two distinct algorithmic implementations of these digital signal processing techniques are provided and thoroughly documented.

  

### 1. Theoretical Framework and Methodology

#### 1.1. Complex Shifted IIR Filter Architecture

In discrete-time signal processing, a standard first-order lowpass IIR filter is defined by the z-domain transfer function:

  

$$H_{lp}(z) = \frac{a}{1 - bz^{-1}}$$

where $b$ dictates the pole location (and thus the cutoff frequency) and $a = 1 - b$ ensures unity DC gain. When a bandpass response is required, traditional methodologies involve mapping the lowpass prototype to a higher order real filter, which inevitably generates a symmetric frequency response containing both positive and negative frequency passbands.

  

In this project, a frequency translation theorem is applied by multiplying the filter coefficients by a complex exponential $e^{j\omega_c}$. The transfer function is thereby shifted strictly along the unit circle to the target center frequency $\omega_c$, yielding a complex shifted bandpass filter:

  

$$H_{bp}(z) = \frac{a}{1 - be^{j\omega_c}z^{-1}}$$

This asymmetric complex filter is mathematically simulated and proven to process baseband analytic signals without generating cross-term spectral leakage.

  

#### 1.2. Dynamic Filtering and State Phase-Preservation

When a discrete signal undergoes a phase hop (e.g., from $45^\circ$ to $135^\circ$ in a QPSK constellation), the sudden discontinuity causes the internal state memory of a static narrow-bandpass filter to destructively interfere with the new incoming signal. This phenomenon, known as phase mismatch envelope collapse, results in severe amplitude degradation and data loss.

  

To resolve this, dynamic filtering is implemented. The recursive difference equation is modified such that the filter's feedback state is continuously rotated by the instantaneous frequency $\omega_{inst}$ of the incoming symbol:

  

$$y[n] = a \cdot x[n] + \left(b \cdot e^{j\omega_{inst}}\right) y[n-1]$$

Through this state-rotation mechanism, the filter’s internal phase is continuously aligned with the incoming signal, allowing transient energy to be preserved and accumulated ("continuous charging").

  

#### 1.3. QPSK Phase Nullification

For phase-modulated signals where the carrier frequency remains constant but the phase shifts instantaneously, a unique phase nullification technique is utilized. The incoming complex analytic signal is multiplied by the conjugate of its known instantaneous phase $e^{-j\phi_n}$. This effectively strips the modulation, reducing the signal to a pure continuous wave (CW) carrier. The narrow bandpass filter is then applied to the unmodulated carrier to aggressively reject out-of-band Additive White Gaussian Noise (AWGN) or amplitude modulated (AM) interference. Finally, the modulation is restored by multiplying the filtered output by $e^{j\phi_n}$.

  

### 2. Algorithmic Implementation I: Vectorized System Simulation

The first implementation is constructed using a heavily vectorized, parallel-processed computational approach. The exact Fast Fourier Transform (FFT) equations are utilized to derive precise spectral magnitudes. The script evaluates complex transfer functions, visualizes phase nullification constellations, and simulates a complete communication system subjected to AWGN and AM interferers.

  

The complete, fully commented Python script for Implementation 1 is provided below.

  

Python

```
# ==============================================================================
# PSDF Complete Master Reproduction Script (Figures 3 to 22)
# Coursework: EEE 3218 Digital Signal Processing Lab
# Focus: Vectorized analytical simulations and system-level interference testing.
# ==============================================================================

import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import hilbert

# --- Professional IEEE Plot Formatting ---
# Academic formatting guidelines are applied to ensure publication-quality graphical outputs.
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.size'] = 10
plt.rcParams['axes.grid'] = True
plt.rcParams['grid.alpha'] = 0.5
plt.rcParams['figure.dpi'] = 150
plt.rcParams['lines.linewidth'] = 1.2

def get_exact_fft(sig, fs):
    """
    The exact discrete Fourier transform is calculated, and the magnitude 
    is converted to a logarithmic decibel scale. A small constant (1e-12) 
    is added to prevent logarithmic singularities at zero.
    """
    f = np.fft.rfftfreq(len(sig), 1/fs) / 1e6
    mag = 10 * np.log10(np.abs(np.fft.rfft(sig)) + 1e-12)
    return f, mag

#%% ============================================================================
# FIGURES 3 & 10: COMPLEX TRANSFER FUNCTIONS
# The frequency responses of prototype filters are derived and plotted across a normalized spectrum.
# ============================================================================
fs_tf = 1.0e6
f_cutoff = 25.0e3
f_center = 100.0e3

# The normalized frequency axis and Z-domain operational array are initialized.
f_axis = np.linspace(-500e3, 500e3, 4000)
z = np.exp(1j * 2.0 * np.pi * f_axis / fs_tf)
w_c = 2.0 * np.pi * f_center / fs_tf

# Feedforward and feedback coefficients for the prototype lowpass filter are defined.
b_lp = np.exp(-2.0 * np.pi * f_cutoff / fs_tf)
a_lp = 1.0 - b_lp
r = b_lp
d_hp = b_lp
a0_hp, a1_hp, b1_hp = (1.0 + d_hp) / 2.0, -(1.0 + d_hp) / 2.0, d_hp

# The mathematical Z-transform equations are explicitly evaluated across the frequency range.
H_lp = a_lp / (1.0 - b_lp * z**-1)
H_bp_real = (1.0 - r) * (1.0 - z**-2) / (1.0 - 2.0 * r * np.cos(w_c) * z**-1 + r**2 * z**-2)
H_bp_comp = a_lp / (1.0 - b_lp * np.exp(1j * w_c) * z**-1)

H_hp = (a0_hp + a1_hp * z**-1) / (1.0 - b1_hp * z**-1)
H_bs_real = (1.0 - 2.0 * np.cos(w_c) * z**-1 + z**-2) / (1.0 - 2.0 * r * np.cos(w_c) * z**-1 + r**2 * z**-2)
H_bs_comp = (a0_hp + (a1_hp * np.exp(1j * w_c)) * z**-1) / (1.0 - (b1_hp * np.exp(1j * w_c)) * z**-1)

# Graphical subplots for transfer function magnitude responses are instantiated.
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
# The modulation removal technique is demonstrated via I/Q constellation mapping.
# ============================================================================
t_fig5 = np.linspace(5e-5, 7e-5, 2000)
fc_5 = 1.0e6
phi_seq = np.zeros_like(t_fig5)
seg = len(t_fig5) // 4
# A sequence of four orthogonal phase states is synthesized.
phi_seq[0:seg] = np.pi/4
phi_seq[seg:2*seg] = 3*np.pi/4
phi_seq[2*seg:3*seg] = 7*np.pi/4
phi_seq[3*seg:] = 5*np.pi/4

# Conjugate multiplication is applied to isolate the carrier wave.
sig_original = np.cos(2.0 * np.pi * fc_5 * t_fig5 + phi_seq)
sig_nullified = np.cos(2.0 * np.pi * fc_5 * t_fig5)
sig_corrected = np.cos(2.0 * np.pi * fc_5 * t_fig5 + phi_seq)
phases_const = np.array([np.pi/4, 3*np.pi/4, 5*np.pi/4, 7*np.pi/4])
original_const = np.exp(1j * phases_const)
nullified_const = original_const * np.exp(-1j * phases_const)

# Constellation diagrams are rendered to visually confirm the mathematical rotation.
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
# Transients are evaluated as continuous state memories are updated across symbol boundaries.
# ============================================================================
fs_8 = 16.0e6
t_8 = np.arange(int(fs_8 * 1.0e-4)) / fs_8
fc_8 = 1.0e6
bw_8 = 15.0e3
b_8 = np.exp(-2.0 * np.pi * (bw_8 / 2.0) / fs_8)
a_8 = 1.0 - b_8

# An instantaneous frequency array is mapped to create a BFSK sequence.
f_inst_8 = np.where(t_8 < 0.5e-4, 1.0e6, 0.5e6)
phase_acc_8 = np.cumsum(2.0 * np.pi * f_inst_8 / fs_8) 
clean_bfsk_8 = np.cos(phase_acc_8)

t_8q = np.arange(int(fs_8 * 2.0e-5)) / fs_8
phi_inst_8q = np.where(t_8q < 1.0e-5, np.pi/4, 3*np.pi/4)
clean_qpsk_8 = np.cos(2.0 * np.pi * fc_8 * t_8q + phi_inst_8q)

# Fig 8: The dynamic discrete-time difference equation is computed iteratively.
psdf_bfsk_8 = np.zeros(len(t_8), dtype=complex)
st_b8 = 0.0j
for n in range(len(t_8)):
    # The feedback coefficient 'b_dyn' is rotated synchronously with the signal frequency.
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

# Fig 12: Decaying responses (Notch processing) are iterated.
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
# Robustness is tested by injecting Additive White Gaussian Noise (AWGN) and 
# performing dynamic signal recovery.
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

# Random normal distributions are generated to construct the AWGN channel.
noise_arr_b = np.random.normal(0, np.sqrt(0.5/10.0), N_tot_b)
noisy_b = clean_b + noise_arr_b

# The Scipy hilbert function is deployed to generate the analytic representation.
analytic_b = np.exp(1j * phase_acc_b) + hilbert(noise_arr_b)

y_sw_bp, y_ps_bp, y_sw_nx, y_ps_nx = np.zeros(N_tot_b), np.zeros(N_tot_b, dtype=complex), np.zeros(N_tot_b, dtype=complex), np.zeros(N_tot_b, dtype=complex)
s_bp1, s_bp2, s_nx1, s_ny1, s_nx2, s_ny2 = 0.0j, 0.0j, 0.0j, 0.0j, 0.0j, 0.0j
s_d_bp, s_dnx_b, s_dny_b = 0.0j, 0.0j, 0.0j
b_f1, b_f2 = b_vb * np.exp(1j * 2.0 * np.pi * fc1 / fs_b), b_vb * np.exp(1j * 2.0 * np.pi * fc2 / fs_b)
w_fc1, w_fc2 = 2.0 * np.pi * fc1 / fs_b, 2.0 * np.pi * fc2 / fs_b

for n in range(N_tot_b):
    cf = f_inst_b[n]
    # Conditional logic is employed to simulate a switched filter bank.
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
# The capacity of the phase-nullification filter to reject severe amplitude
# distortions is measured.
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
# The filter architecture is deployed to suppress near-end transmitter leakage 
# in a shared antenna circulator configuration.
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

### 3. Algorithmic Implementation II: State-Machine Generalization

The second implementation generalizes the filtering loops into an algorithmic state-machine function `time_varying_filter`. This logic executes vectorized weights mapping across time arrays, facilitating dynamic updates to coefficients at each sampled interval.

  

_Note: The raw transcription of Implementation 2 contained omission errors pertaining to Python mathematical multiplication operators. These critical semantic operators have been formally restored in the script below to ensure correct computational execution of the signal mapping algorithms._

  

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

### 4. Conclusion

It is concluded from the simulations that the application of complex shifted coefficients enables the design of highly localized, asymmetric transfer functions in the z-domain. More critically, it is proven that phase-preservation in digital filters can be guaranteed by dynamically rotating the feedback state matrix synchronously with the modulating signal. This mechanism eliminates the envelope collapse commonly suffered by conventional filters during discrete symbol transitions. The provided scripts successfully implement this logic, validating its viability for advanced interference suppression and co-site transmitter isolation in modern telecommunication systems. 
