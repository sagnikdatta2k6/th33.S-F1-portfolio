# TEAM TH33.S | F1 IoT Engineering HUD 🏎️📡

**A high-frequency IoT Telemetry Ingestion Dashboard designed for real-time edge environments and autonomous racing diagnostics.**

![System Status](https://img.shields.io/badge/System-Nominal-brightgreen) ![Network](https://img.shields.io/badge/GPS_Network-RTK_Fixed-blue) ![Safety](https://img.shields.io/badge/Thermal_Lock-Active-red)

## 📋 Project Overview
This project simulates a Mission Control dashboard receiving high-speed telemetry from distributed IoT paddock nodes (Vellore, Patna, Kolkata, Mumbai). Designed with a mobile-first glassmorphic UI, it demonstrates real-time data parsing, edge-computing safety protocols, and statistical network auditing.

## 🛠️ Engineering Stack
* **Frontend:** HTML5, CSS3 (Advanced Glassmorphism & Responsive CSS Grid)
* **Logic Engine:** Vanilla JavaScript (ES6)
* **3D Rendering:** Google `<model-viewer>` for hardware-accelerated chassis visualization
* **Data Visualization:** Native dynamic SVG pathing for high-refresh rendering

## 🚀 Core IoT Architecture & Features

### 1. 10Hz SVG Waveform Engine & Thermal Flatlining
Unlike static dashboards, this HUD features a reactive telemetry graph plotting network jitter at 10Hz. 
* **Safety Override Protocol:** If environmental sensors detect road temperatures exceeding **40°C**, the system initiates a "Heat Alert" and automatically flatlines the data ingestion stream. This simulates an automated edge-node safety lock to prevent thermal-induced sensor noise from corrupting autonomous racing logic.

### 2. Geospatial Node Mapping (RTK GPS)
* Integrates an interactive vector map that visually tracks the active data-sync location.
* Simulates high-precision Real-Time Kinematic (RTK) GPS fixing, showing exactly which geographical node the dashboard is pulling data from in real-time.

### 3. Benford's Law Data Forensics
* Features a built-in statistical anomaly scanner accessible via the terminal.
* **Logic:** The system buffers incoming network packet bitrates and analyzes the frequency of leading digits against Benford's Law. If the distribution of the digit '1' falls outside natural statistical boundaries, it flags a potential man-in-the-middle data spoofing attack.

### 4. Predictive Degradation & Power Management
* **Tyre Life Analytics:** Calculates predictive wear based on data sync cycles, triggering automated strategic warnings when hardware integrity falls below 25%.
* **Stealth Mode:** A terminal-activated power-saving configuration (`STEALTH ON`) that minimizes display brightness and power draw, mimicking standard IoT battery-conservation techniques.

## 💻 Terminal Command Reference
The built-in command console accepts the following inputs:
* `SYNC [CITY]` - Force a manual data override to a specific node (e.g., SYNC PATNA).
* `BENFORD SCAN` - Run a statistical audit on the network packet buffer.
* `PITCH` - Display the system architecture summary.
* `STEALTH ON/OFF` - Toggle power-saving UI mode.
* `STATUS CHECK` - Output live diagnostic variables (Battery, Heat Lock, Tyre Wear).

## 👥 The Grid (Team)
* **Sagnik Datta** - Lead Architect
* **[Swati Saumya](https://github.com/swatisaumya)** - UX Specialist
* **Shloak Sinha** - Data Systems
