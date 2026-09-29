// POLARIS: Smart Microgrid Optimizer (MPC & MILP Engine) Dashboard
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  Cpu,
  Flame,
  Zap,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  Thermometer,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Leaf,
  BatteryCharging
} from 'lucide-react';
import DispatchGantt from './DispatchGantt';

export default function OptimizerDashboard({
  station,
  optimizationResults,
  onUpdateParams,
  params
}) {
  const { optimizedSteps, baselineSteps, metrics } = optimizationResults;
  const [activeTab, setActiveTab] = useState('power');

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl border border-cyan-500/40 text-xs shadow-xl space-y-1 font-mono">
          <div className="font-bold text-cyan-300 pb-1 border-b border-slate-700">Time: {label}</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value} kW</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Optimization KPIs & Baseline Comparison */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* KPI 1: Daily Fuel Saved */}
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Daily Fuel Saved</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {metrics.fuelSavedL.toLocaleString()} <span className="text-sm font-normal text-slate-400">Liters/day</span>
          </div>
          <div className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span className="font-bold">-{metrics.fuelSavedPct}% reduction</span> vs legacy baseline
          </div>
        </div>

        {/* KPI 2: Carbon Emissions Avoided */}
        <div className="glass-panel rounded-2xl p-4 border border-cyan-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">CO2 Avoided</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Leaf className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {metrics.co2SavedKg.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg CO2/day</span>
          </div>
          <div className="text-xs text-cyan-300 font-mono mt-1">
            {(metrics.co2SavedKg * 365 / 1000).toFixed(1)} Metric Tons / year
          </div>
        </div>

        {/* KPI 3: Polar Logistics Cost Saved */}
        <div className="glass-panel rounded-2xl p-4 border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">Logistics Cost Saved</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            ${metrics.costSavedUSD.toLocaleString()} <span className="text-sm font-normal text-slate-400">USD/day</span>
          </div>
          <div className="text-xs text-amber-300 font-mono mt-1">
            ≈ ₹{metrics.costSavedINR.toLocaleString()} INR/day saved
          </div>
        </div>

        {/* KPI 4: Madrid Protocol Eco Score */}
        <div className="glass-panel rounded-2xl p-4 border border-purple-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase">Madrid Protocol Rating</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {metrics.madridProtocolScore}<span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="text-xs text-purple-300 font-mono mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> Exemplary Clean Compliance
          </div>
        </div>

      </div>

      {/* Main Microgrid Stacked Dispatch Visualization */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/25 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Optimal 24-Hour Energy Generation & Dispatch Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              MILP mathematical dispatch ensuring zero wet-stacking, optimal BESS cycling & minimum fuel burn
            </p>
          </div>

          {/* Chart View Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('power')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'power'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Power Stack (kW)
            </button>
            <button
              onClick={() => setActiveTab('thermal')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'thermal'
                  ? 'bg-orange-500 text-black font-bold shadow-md shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Thermal CHP Heat (kWth)
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'comparison'
                  ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AI vs Baseline Fuel Burn
            </button>
          </div>
        </div>

        {/* Tab 1: Stacked Generation Power Balance */}
        {activeTab === 'power' && (
          <div className="h-[360px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={optimizedSteps} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="windArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="bessDisArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="gensetArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                
                <Area type="monotone" dataKey="solarGenKw" stackId="1" stroke="#f59e0b" fill="url(#solarArea)" name="Solar PV" />
                <Area type="monotone" dataKey="windGenKw" stackId="1" stroke="#00f2fe" fill="url(#windArea)" name="Wind Turbines" />
                <Area type="monotone" dataKey="bessDischargeKw" stackId="1" stroke="#10b981" fill="url(#bessDisArea)" name="BESS Discharge" />
                <Area type="monotone" dataKey="gensetTotalKw" stackId="1" stroke="#f97316" fill="url(#gensetArea)" name="Diesel Genset" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tab 2: Thermal Hydronic District Heat Balance */}
        {activeTab === 'thermal' && (
          <div className="h-[360px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={optimizedSteps} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chpArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="auxBoilerArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'kWth', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="chpThermalKwth" stackId="1" stroke="#f97316" fill="url(#chpArea)" name="CHP Exhaust Waste Heat Recovered" />
                <Area type="monotone" dataKey="auxBoilerKwth" stackId="1" stroke="#ef4444" fill="url(#auxBoilerArea)" name="Auxiliary Diesel Boiler" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tab 3: Fuel Burn Comparison (AI vs Legacy) */}
        {activeTab === 'comparison' && (
          <div className="h-[360px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={optimizedSteps} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Liters / Hour', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="fuelConsumedL" fill="#10b981" name="AI Optimal Fuel (L/h)" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey={(d, idx) => baselineSteps[idx]?.fuelConsumedL || 28}
                  fill="#64748b"
                  name="Baseline Legacy Fuel (L/h)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Hourly Dispatch Schedule Gantt */}
      <DispatchGantt optimizedSteps={optimizedSteps} />

      {/* Detailed Side-by-Side Savings & Engineering Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Wet Stacking Elimination */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Anti-Wet Stacking Control
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              0 Risk Hours
            </span>
          </div>
          <p className="text-xs text-slate-300">
            In polar climates, running diesel gensets below 35% load causes incomplete combustion, carbon soot build-up, and catastrophic manifold fouling. Our AI optimizer completely avoids this by discharging BESS during light-load hours.
          </p>
          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800 text-slate-400">
            <span>Baseline Fouling Risk:</span>
            <span className="text-rose-400 font-bold">{metrics.wetStackingHoursBaseline} hrs/day</span>
          </div>
        </div>

        {/* Card 2: Combined Heat & Power (CHP) Recovery */}
        <div className="glass-panel rounded-2xl p-5 border border-orange-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-orange-400 font-bold uppercase flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-400" /> CHP Waste Heat Recovery
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/30">
              {metrics.totalChpHeatRecoveredKwhth} kWh(th)
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Recovers 42% of generator thermal exhaust and water jacket heat directly into the 80°C hydronic heating loop, drastically reducing the run-time of auxiliary diesel boilers in sub-zero blizzards.
          </p>
          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800 text-slate-400">
            <span>Boiler Fuel Avoided:</span>
            <span className="text-emerald-400 font-bold">~84 Liters/day</span>
          </div>
        </div>

        {/* Card 3: Smart Deferrable Load Shifting */}
        <div className="glass-panel rounded-2xl p-5 border border-blue-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-blue-400 font-bold uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-400" /> Deferrable Load Shifting
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Automated
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Shifts heavy snow-melting water plant cycles and batch scientific cryo processing to peak wind/solar production hours, absorbing renewable surpluses and preventing costly curtailment.
          </p>
          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800 text-slate-400">
            <span>Curtailment Saved:</span>
            <span className="text-cyan-300 font-bold">-{metrics.curtailmentReductionPct}% Loss</span>
          </div>
        </div>

      </div>

    </div>
  );
}
