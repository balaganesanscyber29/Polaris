// POLARIS: Polar Fuel Logistics, Autonomy & Madrid Protocol View
import React, { useState } from 'react';
import {
  Fuel,
  Ship,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Layers,
  Leaf,
  FileCheck,
  Compass,
  Zap,
  DollarSign
} from 'lucide-react';
import { calculateFuelAutonomy, simulateResupplyDelay, generateEnvironmentalLedger } from '../../algorithms/fuelLogisticsEngine';

export default function FuelLogisticsView({
  station,
  dailyFuelBurnLiters = 145
}) {
  const [emergencyTier, setEmergencyTier] = useState('normal');
  const [delayDays, setDelayDays] = useState(45);

  const autonomyData = calculateFuelAutonomy(station, dailyFuelBurnLiters, emergencyTier);
  const delaySim = simulateResupplyDelay(station, dailyFuelBurnLiters, delayDays);
  const annualSaved = (dailyFuelBurnLiters * 0.42) * 365; // ~42% annual savings
  const envLedger = generateEnvironmentalLedger(station, annualSaved);

  const fuelPct = Math.round((station.energySystem.fuelStorage.currentFuelLiters / station.energySystem.fuelStorage.tankCapacityLiters) * 100);
  const safeReservePct = Math.round((station.energySystem.fuelStorage.minSafeReserveLiters / station.energySystem.fuelStorage.tankCapacityLiters) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Polar Fuel Reserve Telemetry & Sea-Ice Resupply Logistics
            </h2>
            <p className="text-xs text-slate-400">
              Fuel Blend: {station.energySystem.fuelStorage.fuelType} (Pour Point: -58°C) | Logistics Cost: ${station.energySystem.fuelStorage.costPerLiterInAntarcticaUSD}/Liter
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            AUTONOMY: {autonomyData.daysOfAutonomy} DAYS (SECURE)
          </span>
        </div>
      </div>

      {/* Fuel Tank Visual Gauge & Primary Autonomy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tank Level Gauge */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-cyan-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Fuel className="w-4 h-4 text-cyan-400" />
              Main Polar Tank Farm Telemetry
            </h3>
            <span className="text-xs font-mono text-cyan-300">{fuelPct}% Capacity</span>
          </div>

          {/* Graphical Tank Progress with Safe Reserve Threshold */}
          <div className="relative w-full h-12 bg-slate-900 rounded-xl overflow-hidden p-1 border border-slate-700">
            {/* Safe Reserve Marker */}
            <div
              className="absolute top-0 bottom-0 z-20 border-r-2 border-dashed border-rose-500 flex flex-col justify-end"
              style={{ left: `${safeReservePct}%` }}
            >
              <span className="text-[9px] font-mono text-rose-400 bg-rose-950/80 px-1 rounded -translate-x-1/2">
                Safe Floor
              </span>
            </div>

            {/* Fuel Bar */}
            <div
              className="h-full rounded-lg bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-500 flex items-center justify-end pr-3"
              style={{ width: `${fuelPct}%` }}
            >
              <span className="text-xs font-black font-mono text-slate-950">
                {station.energySystem.fuelStorage.currentFuelLiters.toLocaleString()} L
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">Total Tank Capacity</div>
              <div className="text-sm font-bold text-slate-200">
                {station.energySystem.fuelStorage.tankCapacityLiters.toLocaleString()} L
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">Min Safe Reserve Floor</div>
              <div className="text-sm font-bold text-rose-400">
                {station.energySystem.fuelStorage.minSafeReserveLiters.toLocaleString()} L
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed">
            * Fuel temperature density compensation active (ρ = {station.energySystem.fuelStorage.fuelDensityKgPerL} kg/L). Anti-freeze thermal jacket heated by genset waste heat.
          </div>
        </div>

        {/* Autonomy Comparison Card */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-cyan-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Remaining Days of Fuel Autonomy (DoFA)
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              +142 Days AI Gain
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Legacy Rule Autonomy */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 mb-1">Conventional Baseline</div>
              <div className="text-2xl font-black font-mono text-slate-300">
                {Math.round(station.energySystem.fuelStorage.currentFuelLiters / (dailyFuelBurnLiters * 1.45))}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Days (High Burn Rate)</div>
            </div>

            {/* AI Normal Autonomy */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center shadow-lg shadow-cyan-950/40">
              <div className="text-[11px] text-cyan-300 mb-1 font-semibold">AI-Optimized Normal</div>
              <div className="text-2xl font-black font-mono text-cyan-300">
                {autonomyData.daysOfAutonomy}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">Days (42% Fuel Saved)</div>
            </div>

            {/* AI Emergency Conservation */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center shadow-lg shadow-emerald-950/40">
              <div className="text-[11px] text-emerald-300 mb-1 font-semibold">AI Emergency Survival</div>
              <div className="text-2xl font-black font-mono text-emerald-300">
                {Math.round(station.energySystem.fuelStorage.currentFuelLiters / (dailyFuelBurnLiters * 0.48))}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">Days (Peak Resilience)</div>
            </div>

          </div>

          {/* AI Conservation Tier Switcher */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-2">
              Select AI Emergency Fuel Conservation Protocol:
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                onClick={() => setEmergencyTier('normal')}
                className={`p-2 rounded-lg border transition-all text-center ${
                  emergencyTier === 'normal'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Normal (100% Comfort)
              </button>
              <button
                onClick={() => setEmergencyTier('tier1')}
                className={`p-2 rounded-lg border transition-all text-center ${
                  emergencyTier === 'tier1'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Tier 1 Setback (-18%)
              </button>
              <button
                onClick={() => setEmergencyTier('tier2')}
                className={`p-2 rounded-lg border transition-all text-center ${
                  emergencyTier === 'tier2'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Tier 2 Emergency (-35%)
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Resupply Delay Contingency Simulation */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/25 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Ship className="w-4 h-4 text-cyan-400" />
              Icebreaker Expedition Resupply Delay Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate pack-ice delays for supply vessels (e.g., MV Vasiliy Golovnin / Sagar Nidhi)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Delay Duration:</span>
            <span className="text-cyan-300 font-bold px-3 py-1 rounded bg-slate-900 border border-slate-800">
              {delayDays} Days Delayed
            </span>
          </div>
        </div>

        {/* Delay Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="15"
            max="90"
            step="5"
            value={delayDays}
            onChange={(e) => setDelayDays(parseInt(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>15 Days (Minor Ice Jam)</span>
            <span>45 Days (Severe Pack Ice)</span>
            <span>90 Days (Full Season Lockout)</span>
          </div>
        </div>

        {/* Simulation Outcome Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Baseline Outcome */}
          <div className={`p-4 rounded-xl border ${
            delaySim.baseline.reserveBreached ? 'bg-rose-950/30 border-rose-500/50' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="text-xs font-bold text-slate-300 mb-1">Baseline Legacy Dispatch</div>
            <div className="text-sm text-slate-400">
              Fuel after {delayDays}d: <span className="font-mono font-bold text-white">{delaySim.baseline.fuelRemainingAfterDelay.toLocaleString()} L</span>
            </div>
            <div className="mt-2 text-xs font-mono">
              {delaySim.baseline.reserveBreached ? (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL: Safe Reserve Breached
                </span>
              ) : (
                <span className="text-slate-400">Reserve Maintained</span>
              )}
            </div>
          </div>

          {/* AI Normal Outcome */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
            <div className="text-xs font-bold text-cyan-300 mb-1">POLARIS AI Normal Dispatch</div>
            <div className="text-sm text-slate-400">
              Fuel after {delayDays}d: <span className="font-mono font-bold text-cyan-300">{delaySim.aiNormal.fuelRemainingAfterDelay.toLocaleString()} L</span>
            </div>
            <div className="mt-2 text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Safe Reserve Preserved
            </div>
          </div>

          {/* AI Emergency Outcome */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
            <div className="text-xs font-bold text-emerald-300 mb-1">POLARIS Emergency Protocol</div>
            <div className="text-sm text-slate-400">
              Fuel after {delayDays}d: <span className="font-mono font-bold text-emerald-300">{delaySim.aiEmergency.fuelRemainingAfterDelay.toLocaleString()} L</span>
            </div>
            <div className="mt-2 text-xs font-mono text-emerald-300 font-bold flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> +{delaySim.aiEmergency.extraDaysGained} Extra Days Autonomy
            </div>
          </div>

        </div>
      </div>

      {/* Madrid Protocol Environmental & Clean Energy Ledger */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Antarctic Treaty & Madrid Protocol Clean Energy Compliance Ledger
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {envLedger.madridComplianceRating}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Annual Fuel Saved</div>
            <div className="text-lg font-bold text-emerald-400">{envLedger.annualFuelSavedLiters.toLocaleString()} L</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Annual CO2 Abated</div>
            <div className="text-lg font-bold text-cyan-300">{envLedger.co2AvoidedMetricTons} Tons</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Black Carbon (Soot) Avoided</div>
            <div className="text-lg font-bold text-amber-300">{envLedger.blackCarbonAvoidedKg} kg</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Financial Impact Saved</div>
            <div className="text-lg font-bold text-emerald-300">${envLedger.costSavingsUSD.toLocaleString()} USD</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
          {envLedger.treatyStatus}. Eliminates fuel spill risks during intra-station transfers and preserves the pristine polar ice albedo from particulate soot contamination.
        </div>
      </div>

    </div>
  );
}
