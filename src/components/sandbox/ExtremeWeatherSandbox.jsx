// POLARIS: Extreme Weather & Polar Microgrid Contingency Sandbox
import React, { useState } from 'react';
import {
  CloudSnow,
  Wind,
  Thermometer,
  Zap,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldAlert,
  Flame,
  Moon,
  Sun,
  Radio,
  CheckCircle2
} from 'lucide-react';

export default function ExtremeWeatherSandbox({
  station,
  weatherState,
  onUpdateWeather,
  onResetWeather,
  isDeIcing,
  onToggleDeIcing
}) {
  const [activeDrill, setActiveDrill] = useState(null);
  const [contingencyLogs, setContingencyLogs] = useState([
    { time: '14:22:01 UTC', type: 'INFO', msg: 'POLARIS Microgrid autonomous governor active. Frequency stable at 50.02 Hz.' }
  ]);

  const addLog = (type, msg) => {
    const time = new Date().toTimeString().slice(0, 8) + ' UTC';
    setContingencyLogs(prev => [{ time, type, msg }, ...prev.slice(0, 9)]);
  };

  // Scenario Triggers
  const triggerKatabaticBlizzard = () => {
    setActiveDrill('katabatic');
    onUpdateWeather({
      baseTemp: -52,
      baseWindSpeed: 38,
      cloudCover: 95,
      isKatabaticStorm: true,
      bladeIcing: 35
    });
    addLog('CRITICAL', 'Katabatic Blizzard triggered! Wind speed surging to 137 km/h. Ambient temp dropped to -52°C.');
    addLog('ACTION', 'AI EMS engaging emergency thermal district loop boost (+85 kWth). Spinning reserve primed.');
  };

  const triggerPolarNight = () => {
    setActiveDrill('polar-night');
    onUpdateWeather({
      baseTemp: -38,
      baseWindSpeed: 14,
      cloudCover: 40,
      isKatabaticStorm: false,
      bladeIcing: 10,
      dayOfYear: 180 // Antarctic Winter (June)
    });
    addLog('WARNING', 'Polar Night mode engaged. Solar irradiance = 0 W/m² (Continuous 24h winter darkness).');
    addLog('ACTION', 'AI EMS dispatching Wind + BESS primary balance with scheduled genset minimum runs.');
  };

  const triggerMidnightSun = () => {
    setActiveDrill('midnight-sun');
    onUpdateWeather({
      baseTemp: -8,
      baseWindSpeed: 8,
      cloudCover: 10,
      isKatabaticStorm: false,
      bladeIcing: 0,
      dayOfYear: 355 // Antarctic Summer (December)
    });
    addLog('INFO', '24-Hour Polar Midnight Sun active. High snow albedo reflection α = 0.88 engaged.');
    addLog('ACTION', 'AI EMS maximizing BESS storage charging. Generator commitment reduced to 0 hours.');
  };

  const triggerGeneratorTrip = () => {
    setActiveDrill('gen-trip');
    addLog('CRITICAL', 'SIMULATION: Primary Diesel Genset DG-1 unexpected trip / mechanical failure!');
    addLog('ACTION', 'Seamless BESS millisecond grid-forming inverter takeover. Zero microgrid brownout.');
    addLog('SUCCESS', 'Secondary Genset DG-2 auto-blackstart sequence initiated. Frequency locked at 50.00 Hz.');
  };

  const handleReset = () => {
    setActiveDrill(null);
    onResetWeather();
    addLog('INFO', 'Sandbox weather & grid conditions restored to normal polar baseline.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 border border-rose-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Extreme Polar Contingency & Stress-Testing Sandbox
            </h2>
            <p className="text-xs text-slate-400">
              Simulate Katabatic winds, sub-zero blizzards, turbine icing, and generator trips to evaluate AI microgrid resilience
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          Reset Baseline
        </button>
      </div>

      {/* Preset 1-Click Stress Test Scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Scenario 1: Katabatic Blizzard */}
        <div
          onClick={triggerKatabaticBlizzard}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeDrill === 'katabatic'
              ? 'bg-rose-950/50 border-rose-400 shadow-lg shadow-rose-950/50'
              : 'glass-panel border-slate-800 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <CloudSnow className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
              HIGH STRESS
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Katabatic Blizzard Surge</h4>
          <p className="text-xs text-slate-400 mb-3">
            -52°C Arctic freeze, 137 km/h storm winds, heavy snowdrifts & thermal load spike.
          </p>
          <button className="w-full py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold hover:bg-rose-500/30">
            {activeDrill === 'katabatic' ? 'Drill Active' : 'Run Blizzard Drill'}
          </button>
        </div>

        {/* Scenario 2: Generator Trip & Islanding */}
        <div
          onClick={triggerGeneratorTrip}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeDrill === 'gen-trip'
              ? 'bg-amber-950/50 border-amber-400 shadow-lg shadow-amber-950/50'
              : 'glass-panel border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              N-1 CONTINGENCY
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Genset #1 Trip Failover</h4>
          <p className="text-xs text-slate-400 mb-3">
            Sudden diesel blackout trigger. Evaluates BESS sub-cycle grid forming response.
          </p>
          <button className="w-full py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold hover:bg-amber-500/30">
            {activeDrill === 'gen-trip' ? 'Trip Drill Fired' : 'Simulate Trip'}
          </button>
        </div>

        {/* Scenario 3: Polar Night (Winter) */}
        <div
          onClick={triggerPolarNight}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeDrill === 'polar-night'
              ? 'bg-indigo-950/50 border-indigo-400 shadow-lg shadow-indigo-950/50'
              : 'glass-panel border-slate-800 hover:border-indigo-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Moon className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              SEASONAL
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">24h Polar Night Mode</h4>
          <p className="text-xs text-slate-400 mb-3">
            Total solar absence for 3 months. Tests wind-thermal-diesel co-optimization.
          </p>
          <button className="w-full py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold hover:bg-indigo-500/30">
            {activeDrill === 'polar-night' ? 'Active (Winter)' : 'Simulate Winter'}
          </button>
        </div>

        {/* Scenario 4: Midnight Sun (Summer) */}
        <div
          onClick={triggerMidnightSun}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeDrill === 'midnight-sun'
              ? 'bg-cyan-950/50 border-cyan-400 shadow-lg shadow-cyan-950/50'
              : 'glass-panel border-slate-800 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sun className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              ZERO DIESEL
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">24h Midnight Sun</h4>
          <p className="text-xs text-slate-400 mb-3">
            Continuous summer daylight. Evaluates maximum renewable penetration & zero fuel run.
          </p>
          <button className="w-full py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-cyan-500/30">
            {activeDrill === 'midnight-sun' ? 'Active (Summer)' : 'Simulate Summer'}
          </button>
        </div>

      </div>

      {/* Manual Fine-Tuning Weather Parameter Sliders */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/25 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-cyan-400" />
          Interactive Environmental Telemetry Controllers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Slider 1: Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Ambient Temperature:</span>
              <span className="text-cyan-300 font-bold">{weatherState.baseTemp}°C</span>
            </div>
            <input
              type="range"
              min="-60"
              max="5"
              step="1"
              value={weatherState.baseTemp}
              onChange={(e) => onUpdateWeather({ baseTemp: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-60°C (Deep Freeze)</span>
              <span>+5°C (Polar Summer)</span>
            </div>
          </div>

          {/* Slider 2: Wind Speed */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Wind Velocity:</span>
              <span className="text-cyan-300 font-bold">{Math.round(weatherState.baseWindSpeed * 3.6)} km/h ({weatherState.baseWindSpeed} m/s)</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={weatherState.baseWindSpeed}
              onChange={(e) => onUpdateWeather({ baseWindSpeed: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 km/h (Calm)</span>
              <span>162 km/h (Storm)</span>
            </div>
          </div>

          {/* Slider 3: Cloud & Blizzard Obscuration */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Cloud / Blizzard Cover:</span>
              <span className="text-amber-300 font-bold">{weatherState.cloudCover}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weatherState.cloudCover}
              onChange={(e) => onUpdateWeather({ cloudCover: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Clear Sky)</span>
              <span>100% (Whiteout)</span>
            </div>
          </div>

          {/* Slider 4: Turbine Blade Icing */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Turbine Blade Icing:</span>
              <span className="text-rose-300 font-bold">{weatherState.bladeIcing}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={weatherState.bladeIcing}
              onChange={(e) => onUpdateWeather({ bladeIcing: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Clean)</span>
              <span>80% (Heavy Ice)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Live AI Contingency & Autonomous Action Log */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            POLARIS Autonomous Event Log & Islanded Grid Controller
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High-Speed Sub-Second Telemetry
          </span>
        </div>

        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
          {contingencyLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="text-slate-500">{log.time}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  log.type === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : log.type === 'ACTION'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : log.type === 'SUCCESS'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : log.type === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {log.type}
              </span>
              <span className="text-slate-200">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
