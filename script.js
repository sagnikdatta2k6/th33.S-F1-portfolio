document.addEventListener('DOMContentLoaded', () => {
    const biosLog = document.getElementById('bios-log');
    const loader = document.getElementById('bios-loader');
    const carModel = document.querySelector('#bg-car');
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const radio = document.getElementById('team-radio');
    const overlay = document.getElementById('warning-overlay');
    const waveformPath = document.getElementById('waveform-path');

    let isHeatAlertActive = false; 
    let startTime;
    
    // NEW: Security & Degradation Variables
    let dataLogBuffer = []; // Buffers raw telemetry for Benford Analysis
    let tyreLife = 100;

    // 1. BIOS ENGINE
    const bootSequence = [
        "[  OK  ] MOUNTING /ASSETS/F1-CAR.GLB...",
        "[  OK  ] LOADING TECH_STACK: HTML_CSS_JS...",
        "[  OK  ] BOOTING SYSTEM: TEAM TH33.S HUD v3.0",
        "SYSTEM START IN 3... 2... 1..."
    ];
    let b = 0;
    const bootInterval = setInterval(() => {
        if (b < bootSequence.length) {
            biosLog.innerHTML += `<br>${bootSequence[b]}`;
            b++;
        } else {
            clearInterval(bootInterval);
            setTimeout(() => {
                loader.classList.add('loader-finished');
                window.scrollTo(0, 0); 
                startTime = Date.now(); 
                showMenu();
                startPaddockScan(); 
            }, 800);
        }
    }, 400);

    // 2. SESSION UPTIME
    function updateUptime() {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        const uptimeEl = document.getElementById('uptime-val');
        if (uptimeEl) uptimeEl.innerText = `${h}:${m}:${s}`;
    }

    // 3. DYNAMIC WAVEFORM ENGINE
    let dataPoints = Array(40).fill(50); 
    function updateWaveform() {
        const jitter = isHeatAlertActive ? 0 : (Math.random() * 40 - 20); 
        const newPoint = 50 + jitter;
        
        dataPoints.push(newPoint);
        dataPoints.shift();

        let pathData = "M 0 " + dataPoints[0];
        for (let i = 1; i < dataPoints.length; i++) {
            pathData += ` L ${(i * 10)} ${dataPoints[i]}`;
        }
        if (waveformPath) waveformPath.setAttribute('d', pathData);
    }

    // 4. MULTI-CITY MAP & SENSOR ENGINE
    // Added mapX and mapY for SVG Geospatial tracking
    const locations = [
        { name: "VELLORE", temp: 34, humid: 45, gps: "12.9165° N, 79.1325° E", mapX: 85, mapY: 180 },
        { name: "PATNA", temp: 38, humid: 60, gps: "25.5941° N, 85.1376° E", mapX: 120, mapY: 90 },
        { name: "KOLKATA", temp: 30, humid: 75, gps: "22.5726° N, 88.3639° E", mapX: 135, mapY: 110 },
        { name: "MUMBAI", temp: 31, humid: 82, gps: "19.0760° N, 72.8777° E", mapX: 60, mapY: 140 }
    ];
    let currentIdx = 0;

    function updateCoreStream() {
        const bitrate = Math.floor(Math.random() * 500) + 1200;
        const latency = Math.floor(Math.random() * 15) + 5;
        document.getElementById('bit-rate').innerText = `${bitrate} kbps`;
        document.getElementById('latency').innerText = `${latency} ms`;
        
        // Push leading digit of network packets to buffer for Benford Analysis
        dataLogBuffer.push(parseInt(bitrate.toString()[0]));
        if(dataLogBuffer.length > 100) dataLogBuffer.shift(); // Keep buffer from overflowing
    }

    function triggerRadio(caller, message) {
        document.getElementById('radio-caller').innerText = caller;
        document.getElementById('radio-text').innerText = message;
        radio.classList.add('radio-active');
        setTimeout(() => { radio.classList.remove('radio-active'); }, 5000);
    }

    function updateWeather(manualIdx = null, silent = true) {
        if (manualIdx !== null) currentIdx = manualIdx;
        const loc = locations[currentIdx];
        const airTemp = loc.temp + Math.floor(Math.random() * 3);
        const roadTemp = airTemp + 3;

        document.getElementById('location-name').innerText = loc.name;
        document.getElementById('temp-val').innerText = `${airTemp}°C`;
        document.getElementById('road-temp-val').innerText = `${roadTemp}°C`;
        document.getElementById('humid-val').innerText = `${loc.humid}%`;
        document.getElementById('gps-val').innerText = loc.gps;
        
        let track = loc.humid > 70 ? "WET" : loc.humid > 55 ? "DAMP" : "DRY";
        document.getElementById('track-val').innerText = track;
        document.getElementById('tyre-val').innerText = track === "WET" ? "WET (BLUE)" : track === "DAMP" ? "INTER (GREEN)" : "SOFT (C5)";

        // UPDATE GEOSPATIAL MAP
        const scanner = document.getElementById('active-scanner');
        if (scanner) {
            scanner.setAttribute('cx', loc.mapX);
            scanner.setAttribute('cy', loc.mapY);
        }
        document.querySelectorAll('.node-point').forEach(p => p.classList.remove('node-active'));
        const activePoint = document.getElementById(`node-${loc.name}`);
        if (activePoint) activePoint.classList.add('node-active');

        // ALERTS & DEGRADATION
        isHeatAlertActive = roadTemp >= 41;
        overlay.style.display = isHeatAlertActive ? 'block' : 'none';
        
        if (isHeatAlertActive && !silent) addLog(`> [SYSTEM]: CRITICAL HEAT DETECTED. TELEMETRY FLATLINED.`);

        const content = document.getElementById('weather-box');
        if(content) {
            content.classList.remove('pulse-active');
            void content.offsetWidth; 
            content.classList.add('pulse-active');
        }

        if (!silent) {
            // Simulate predictive maintenance
            tyreLife -= Math.floor(Math.random() * 8) + 2;
            if (tyreLife < 25 && tyreLife > 0) {
                setTimeout(() => triggerRadio("STRATEGIST", "Tyre degradation critical. Box this lap."), 4000);
            }
            triggerRadio("ENGINEER", `Syncing ${loc.name} network. Heat Safety: ${isHeatAlertActive ? 'ACTIVE' : 'READY'}.`);
            addLog(`> [PADDOCK_SYNC]: MANUAL OVERRIDE SUCCESSFUL. LINKED TO ${loc.name}.`);
        }
        
        if (manualIdx === null) currentIdx = (currentIdx + 1) % locations.length;
    }

    function startPaddockScan() {
        updateWeather(null, true);
        setInterval(() => { updateWeather(null, true); }, 10000); 
        setInterval(updateCoreStream, 2000); 
        setInterval(updateWaveform, 100); 
        if(document.getElementById('uptime-val')) setInterval(updateUptime, 1000);
    }

    // 5. TOUCH & SCROLL INTERACTIONS
    let lastTouchX = 0;
    let currentRotation = 0;

    window.addEventListener('touchstart', (e) => { lastTouchX = e.touches[0].clientX; });

    window.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - lastTouchX;
        currentRotation += deltaX * 0.5;
        carModel.setAttribute('camera-orbit', `${currentRotation}deg 75deg 115%`);
        lastTouchX = touchX;
    });

    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.offsetHeight - window.innerHeight);
        carModel.setAttribute('camera-orbit', `${scrollPercent * 180}deg 75deg 115%`);
    });

    // 6. COMMAND CONSOLE
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(terminalInput.value.trim().toUpperCase());
            terminalInput.value = "";
        }
    });

    function showMenu() {
        addLog(`
> --- HUD COMMAND CENTER v3.0 ---
> SYNC [CITY]: Manual Node Override
> BENFORD SCAN: Audit Data Integrity
> PITCH: View Architecture Logic
> STEALTH [ON/OFF], STATUS CHECK, CLEAR
> --- GPS NETWORK: ONLINE ---`);
    }

    function processCommand(cmd) {
        if (cmd === "PITCH") {
            addLog(`> [TECHNICAL PITCH]: High-frequency IoT Telemetry Layer. Features Geospatial RTK Mapping, an SVG Waveform Engine with Thermal Flatlining, and Benford's Law Data Auditing.`);
        }
        else if (cmd === "BENFORD SCAN") {
            addLog("> [AUDIT]: INITIATING BENFORD'S LAW NETWORK PACKET ANALYSIS...");
            setTimeout(() => {
                if (dataLogBuffer.length < 5) return addLog("> [ERROR]: INSUFFICIENT DATA BUFFER. AWAITING MORE PACKETS.");
                const ones = dataLogBuffer.filter(d => d === 1).length;
                const ratio = (ones / dataLogBuffer.length) * 100;
                addLog(`> [RESULT]: LEADING DIGIT '1' FREQUENCY: ${ratio.toFixed(1)}%`);
                if(ratio > 50) addLog("> [STATUS]: NETWORK INTEGRITY VERIFIED (NATURAL DISTRIBUTION).");
                else addLog("> [WARNING]: STATISTICAL ANOMALY. POTENTIAL NODE SPOOFING OR PACKET TAMPERING.");
            }, 1500);
        }
        else if (cmd === "STEALTH ON") {
            document.body.classList.add('stealth-active');
            addLog("> [SYSTEM]: STEALTH MODE ACTIVE. MINIMIZING POWER DRAW.");
        }
        else if (cmd === "STEALTH OFF") {
            document.body.classList.remove('stealth-active');
            addLog("> [SYSTEM]: FULL POWER HUD RESTORED.");
        }
        else if (cmd.startsWith("SYNC ")) {
            const city = cmd.replace("SYNC ", "");
            const idx = locations.findIndex(l => l.name === city);
            if (idx !== -1) updateWeather(idx, false);
            else addLog("> [ERROR]: NODE UNREACHABLE.");
        }
        else if (cmd === "STATUS CHECK") {
            addLog(`> [DIAGNOSTIC]: TYRE LIFE: ${tyreLife}% | SIGNAL: STABLE | HEAT_LOCK: ${isHeatAlertActive ? 'ENGAGED' : 'STANDBY'}.`);
        }
        else if (cmd === "CLEAR") { terminalHistory.innerHTML = ""; }
        else if (cmd === "HELP") { showMenu(); }
        else addLog(`> [ERROR]: UNKNOWN COMMAND '${cmd}'.`);
    }

    function addLog(text) {
        const div = document.createElement('div');
        div.innerText = text;
        terminalHistory.appendChild(div);
        terminalHistory.scrollTop = terminalHistory.scrollHeight;
    }
});