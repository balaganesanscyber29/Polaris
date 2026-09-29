// POLARIS: Component Deep-Dive Inspector Modal
// Shows granular telemetry, AI health diagnostics, wear index, and manual control overrides

import React from 'react';
import { X, ShieldAlert, Cpu, Wrench, Thermometer, Wind, Zap, Battery, Flame, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ComponentInspectorModal({
  componentId,
  station,
  onClose,
  onToggleDeIcing,
  isDeIcing
}) {
  if (!componentId) return null;

  let title = 'Polar Asset Telemetry';
  let badge = 'Operational';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let content = null;

  if (componentId.startsWith('turbine') || componentId === 'wind-array') {
    title = 'Polar Ruggedized VAWT-1 (Vertical Axis Wind Turbine)';
    const turbine = station.energySystem.windTurbines[0];
    content = (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Rotor Speed</div>
            <div className="text-lg font-bold text-cyan-400">142 RPM</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Cold Air Boost</div>
            <div className="text-lg font-bold text-emerald-400">+18.4%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Blade Icing</div>
            <div className="text-lg font-bold text-amber-400">{turbine.bladeIcingPct}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Bearing Temp</div>
            <div className="text-lg font-bold text-slate-200">-12°C</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> AI Predictive Health & Vibration Analysis
          </div>
          <p className="text-xs text-slate-300">
            FFT vibration harmonic spectrum is within ISO-10816 class II tolerance. Mechanical gearbox oil viscosity heated to maintain 15 cSt at sub-zero temperatures. Aerodynamic polar airfoil profile operating at Cp = 0.44.
          </p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div>
            <div className="text-xs font-semibold text-amber-300">Internal Electro-Thermal Blade De-Icer</div>
            <div className="text-[11px] text-slate-400">Draws 1.8 kW to prevent aerodynamic drag freeze</div>
          </div>
          <button
            onClick={onToggleDeIcing}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              isDeIcing
                ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 text-amber-300 border border-amber-500/50 hover:bg-amber-950/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            {isDeIcing ? 'DE-ICER ACTIVE' : 'TRIGGER DE-ICER'}
          </button>
        </div>
      </div>
    );

  } else if (componentId === 'solar-pv') {
    title = 'Bifacial Snow-Albedo Solar PV Array';
    content = (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Total Capacity</div>
            <div className="text-lg font-bold text-amber-400">{station.energySystem.solarPV.capacityKwp} kWp</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Ground Albedo</div>
            <div className="text-lg font-bold text-cyan-300">0.86 (Snow)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Bifacial Gain</div>
            <div className="text-lg font-bold text-emerald-400">+28%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Array Tilt</div>
            <div className="text-lg font-bold text-slate-200">65° Polar</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> AI Solar MPPT & Snow Shedding Status
          </div>
          <p className="text-xs text-slate-300">
            Vertical steep mounting angle sheds 92% of blowing blizzard snow automatically. Bifacial rear cells capture reflected radiation from surrounding Antarctic ice sheet, providing continuous generation during 24-hour midnight sun.
          </p>
        </div>
      </div>
    );

  } else if (componentId === 'bess-bank') {
    title = 'Thermally Conditioned LiFePO4 BESS Storage';
    const bess = station.energySystem.bess;
    content = (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">State of Charge</div>
            <div className="text-lg font-bold text-emerald-400">{bess.currentSocPct}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Core Temp</div>
            <div className="text-lg font-bold text-cyan-400">{bess.batteryTempC}°C</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">State of Health</div>
            <div className="text-lg font-bold text-emerald-300">{bess.sohPct}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Round-Trip Eff</div>
            <div className="text-lg font-bold text-slate-200">92%</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4" /> Battery Thermal Conditioning Circuit
          </div>
          <p className="text-xs text-slate-300">
            LiFePO4 cells are maintained in an insulated container heated by genset CHP heat recovery loop to prevent lithium plating and sub-zero capacity degradation. BMS enforces optimal 20%-90% cycling envelope to extend battery life to 12+ years.
          </p>
        </div>
      </div>
    );

  } else if (componentId === 'genset-plant') {
    title = 'Penta Multi-Fuel Polar Genset & CHP Heat Recovery';
    const gen = station.energySystem.dieselGensets[0];
    content = (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Power Rating</div>
            <div className="text-lg font-bold text-orange-400">{gen.capacityKw} kW</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">CHP Heat Rec.</div>
            <div className="text-lg font-bold text-amber-400">42% (85 kWth)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Min Load Floor</div>
            <div className="text-lg font-bold text-cyan-300">35% (Anti-Soot)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Health Index</div>
            <div className="text-lg font-bold text-emerald-400">{gen.healthScore}/100</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> AI Anti-Wet Stacking & Soot Elimination Control
          </div>
          <p className="text-xs text-slate-300">
            AI MILP dispatch guarantees generator never operates below 35% load where unburnt fuel creates hazardous wet-stacking deposits. Water-jacket and exhaust gas heat exchangers route 80°C hot water directly into station living quarters.
          </p>
        </div>
      </div>
    );

  } else {
    title = 'Bharati Central Research Pod & Critical Life-Support';
    content = (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Base Population</div>
            <div className="text-lg font-bold text-cyan-400">{station.occupancy.current} Crew</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Interior Temp</div>
            <div className="text-lg font-bold text-amber-300">+21.2°C</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Water Plant</div>
            <div className="text-lg font-bold text-emerald-400">1,200 L/Day</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] text-slate-400">Comms Link</div>
            <div className="text-lg font-bold text-teal-400">GSAT Polar High-Speed</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tier 1 Guaranteed Life-Support System
          </div>
          <p className="text-xs text-slate-300">
            Dual redundant hydronic heating loops, fresh snow melter water plant, and satellite telemetry links have 100% priority in the AI microgrid dispatch matrix under any contingency or blizzard condition.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-cyan-500/40 p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400 font-mono">{station.name} | Subsystem ID: {componentId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${badgeColor}`}>
              {badge}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {content}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
