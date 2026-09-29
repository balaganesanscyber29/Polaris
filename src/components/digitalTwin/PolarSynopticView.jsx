// POLARIS: Interactive 2D Synoptic Microgrid Single Line Diagram (SLD)
// Shows real-time electrical AC Bus (400V/50Hz) and Hydronic District Heating Thermal Bus flows

import React from 'react';
import { Sun, Wind, BatteryCharging, Flame, Activity, Zap, Droplets, Thermometer, ShieldCheck, Radio } from 'lucide-react';

export default function PolarSynopticView({
  station,
  currentDispatch,
  onSelectComponent,
  activeComponentId
}) {
  const solarGen = currentDispatch?.solarGenKw || 0;
  const windGen = currentDispatch?.windGenKw || 0;
  const bessCharge = currentDispatch?.bessChargeKw || 0;
  const bessDischarge = currentDispatch?.bessDischargeKw || 0;
  const gensetGen = currentDispatch?.gensetTotalKw || 0;
  const loadKw = currentDispatch?.loadKw || 65;
  const chpHeat = currentDispatch?.chpThermalKwth || 0;
  const auxBoilerHeat = currentDispatch?.auxBoilerKwth || 0;
  const thermalDemand = currentDispatch?.thermalDemandKwth || 75;
  const bessSoc = currentDispatch?.bessSocPct || station.energySystem.bess.currentSocPct;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-cyan-500/25 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            Polar Hybrid Microgrid Synoptic Single Line Diagram (SLD)
          </h3>
          <p className="text-xs text-slate-400">
            Real-time multi-bus topology: 400V AC Microgrid + 80°C Hydronic Thermal Loop
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            GRID SYNCHRONIZED (50.02 Hz)
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            AC BUS: 400.4 V
          </span>
        </div>
      </div>

      {/* Synoptic Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* LEFT COLUMN: Generation Sources */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Generation Sources
          </div>

          {/* Solar PV Node */}
          <div
            onClick={() => onSelectComponent('solar-pv')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activeComponentId === 'solar-pv'
                ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Bifacial Solar PV</div>
                  <div className="text-[11px] text-slate-400">{station.energySystem.solarPV.capacityKwp} kWp Array</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-amber-400">{solarGen} kW</div>
                <div className="text-[10px] text-emerald-400">Snow Albedo +28%</div>
              </div>
            </div>
            {/* Energy Stream Conduit */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (solarGen / station.energySystem.solarPV.capacityKwp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Wind Array Node */}
          <div
            onClick={() => onSelectComponent('turbine-1')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activeComponentId?.startsWith('turbine')
                ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Polar Wind Turbines</div>
                  <div className="text-[11px] text-slate-400">{station.energySystem.windTurbines.length} Turbines (VAWT/HAWT)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-cyan-400">{windGen} kW</div>
                <div className="text-[10px] text-cyan-300">Cold Air Density +18%</div>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (windGen / station.energySystem.windTurbines.reduce((s, w) => s + w.capacityKw, 0)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Genset / CHP Node */}
          <div
            onClick={() => onSelectComponent('genset-plant')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activeComponentId === 'genset-plant'
                ? 'bg-orange-950/40 border-orange-400 shadow-lg shadow-orange-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:border-orange-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Multi-Fuel CHP Genset</div>
                  <div className="text-[11px] text-slate-400">Penta Polar Marine Units</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-orange-400">{gensetGen} kW</div>
                <div className="text-[10px] text-slate-400">Loading: {gensetGen > 0 ? 'Optimal (72%)' : 'Standby / 0%'}</div>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-orange-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (gensetGen / station.energySystem.dieselGensets[0].capacityKw) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Central Microgrid Bus & BESS */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-5">
          
          {/* Main 400V AC Bus Bar */}
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-cyan-950/60 border border-cyan-500/40 text-center shadow-lg shadow-cyan-900/30 relative">
            <div className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider mb-1">
              ⚡ CENTRAL 400V AC MICROGRID BUS
            </div>
            <div className="flex items-center justify-around text-xs font-mono my-2">
              <div>
                <span className="text-slate-400">Generation: </span>
                <span className="text-emerald-400 font-bold">{Math.round((solarGen + windGen + gensetGen + bessDischarge) * 10) / 10} kW</span>
              </div>
              <div>
                <span className="text-slate-400">Demand: </span>
                <span className="text-amber-400 font-bold">{Math.round((loadKw + bessCharge) * 10) / 10} kW</span>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Real-time Frequency & Voltage Regulated
            </div>
          </div>

          {/* BESS Battery Storage Unit */}
          <div
            onClick={() => onSelectComponent('bess-bank')}
            className={`w-full p-4 rounded-2xl border transition-all cursor-pointer ${
              activeComponentId === 'bess-bank'
                ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">LiFePO4 BESS Storage</div>
                  <div className="text-[11px] text-slate-400">{station.energySystem.bess.capacityKwh} kWh Capacity</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-emerald-400">{bessSoc}% SoC</span>
                <div className="text-[10px] text-slate-400">Temp: {station.energySystem.bess.batteryTempC}°C (Regulated)</div>
              </div>
            </div>
            
            {/* Battery SoC Progress Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  bessSoc > 50 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : bessSoc > 20 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${bessSoc}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono mt-2 text-slate-400">
              <span>{bessCharge > 0 ? `Charging: +${bessCharge} kW` : bessDischarge > 0 ? `Discharging: -${bessDischarge} kW` : 'Float / Standby'}</span>
              <span className="text-emerald-400">Health (SoH): {station.energySystem.bess.sohPct}%</span>
            </div>
          </div>

          {/* Hydronic District Thermal Bus Bar */}
          <div className="w-full p-3.5 rounded-xl bg-gradient-to-r from-orange-950/40 via-slate-900/90 to-orange-950/40 border border-orange-500/40 text-center relative">
            <div className="text-[11px] font-mono text-orange-300 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5" /> 80°C HYDRONIC DISTRICT HEATING BUS
            </div>
            <div className="flex items-center justify-between text-xs font-mono px-2">
              <div className="text-orange-400">CHP Exhaust Heat: {chpHeat} kW(th)</div>
              <div className="text-slate-400">Aux Boiler: {auxBoilerHeat} kW(th)</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Load Classification Branches */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" /> Station Load Branches
          </div>

          {/* Critical Life-Support Node */}
          <div
            onClick={() => onSelectComponent('station-main')}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Critical Life-Support</div>
                  <div className="text-[11px] text-slate-400">HVAC, Water Melt, Comms, STP</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-rose-400">
                  {Object.values(station.criticalLoads).reduce((a, b) => a + b, 0)} kW
                </div>
                <div className="text-[10px] text-emerald-400">Priority Tier 1 (100% Guaranteed)</div>
              </div>
            </div>
          </div>

          {/* Scientific Research Equipment */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Scientific Laboratories</div>
                  <div className="text-[11px] text-slate-400">Lidar, Radar, Ice Core Freezers</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-purple-400">
                  {Object.values(station.scientificLoads).reduce((a, b) => a + b, 0)} kW
                </div>
                <div className="text-[10px] text-cyan-300">Smart Peak-Shift Enabled</div>
              </div>
            </div>
          </div>

          {/* Living Quarters & Thermal Hydronic Load */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Living & Thermal Demand</div>
                  <div className="text-[11px] text-slate-400">{station.occupancy.current} Crew Expeditioners</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-teal-400">
                  {thermalDemand} kW(th)
                </div>
                <div className="text-[10px] text-amber-300">Heating Target: 21°C</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
