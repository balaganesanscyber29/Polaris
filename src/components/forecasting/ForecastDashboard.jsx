// POLARIS: AI Multi-Horizon Load & Renewable Forecasting Dashboard
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  BrainCircuit,
  Sun,
  Wind,
  Zap,
  TrendingUp,
  CloudSnow,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Thermometer,
  Eye
} from 'lucide-react';
import { generate7DayOutlook } from '../../algorithms/forecastingEngine';

export default function ForecastDashboard({
  station,
  forecastData,
  weatherState
}) {
  const [activeMetric, setActiveMetric] = useState('all');
  const [showConfidenceBounds, setShowConfidenceBounds] = useState(true);
  const sevenDayOutlook = generate7DayOutlook(station);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl border border-cyan-500/40 text-xs shadow-xl space-y-1 font-mono">
          <div className="font-bold text-cyan-300 pb-1 border-b border-slate-700">Time: {label}</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value} {entry.unit || 'kW'}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Physics-Informed ML Engine Status */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-300">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Physics-Informed Deep Neural Forecaster (Multi-Horizon BiLSTM)
              <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                P10 / P50 / P90 Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Station: {station.name} | Dynamic Cold-Air Density Coupling & Ground Snow Albedo Correction
            </p>
          </div>
        </div>

        {/* Forecast Filter Toggles */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowConfidenceBounds(!showConfidenceBounds)}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              showConfidenceBounds
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Confidence Envelope (P10-P90)
          </button>
        </div>
      </div>

      {/* Main 24-Hour Forecast Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/25 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              24-Hour Ahead Lookahead: Station Demand vs. Renewable Generation
            </h3>
            <p className="text-xs text-slate-400">
              Synchronized multi-variable hourly forecast with automated uncertainty quantification
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Wind
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Solar
            </span>
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Total Load
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Net Deficit
            </span>
          </div>
        </div>

        <div className="h-[360px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="loadBandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              
              {/* P10 - P90 Uncertainty Shading */}
              {showConfidenceBounds && (
                <Area
                  type="monotone"
                  dataKey="loadP90"
                  stroke="none"
                  fill="url(#loadBandGrad)"
                  name="Uncertainty Range (P90)"
                />
              )}

              {/* Solar PV Area */}
              <Area
                type="monotone"
                dataKey="solarGenerationKw"
                fill="url(#solarGrad)"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Solar PV (Bifacial)"
              />

              {/* Wind Generation Line */}
              <Line
                type="monotone"
                dataKey="windGenerationKw"
                stroke="#00f2fe"
                strokeWidth={2.5}
                dot={false}
                name="Wind Array"
              />

              {/* Expected Station Load (P50) */}
              <Line
                type="monotone"
                dataKey="loadP50"
                stroke="#c084fc"
                strokeWidth={3}
                dot={{ r: 3, fill: '#c084fc' }}
                name="Station Load (P50)"
              />

              {/* Net Load Deficit */}
              <Line
                type="monotone"
                dataKey="netLoadKw"
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
                name="Net Deficit (Genset/BESS Required)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Physics Model Feature Attribution & Weather Influence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Feature 1: Cold Air Density Wind Gain */}
        <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
              <Wind className="w-4 h-4" /> Cold Air Density Coupling
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">+18.2% Power</span>
          </div>
          <p className="text-xs text-slate-300">
            Air at {weatherState.baseTemp}°C is denser (1.44 kg/m³ vs 1.22 kg/m³ std). AI applies ideal gas law density scaling to raw anemometer telemetry.
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full w-[82%]" />
          </div>
        </div>

        {/* Feature 2: Bifacial Snow Albedo Gain */}
        <div className="glass-panel rounded-2xl p-4 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <Sun className="w-4 h-4" /> Snow Albedo Reflection
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">+28% Gain</span>
          </div>
          <p className="text-xs text-slate-300">
            Antarctic ice sheet albedo α = 0.86 reflects diffused radiation onto vertical rear PV faces, extending generation during low-angle polar sun.
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[78%]" />
          </div>
        </div>

        {/* Feature 3: Heating Degree Days (HDD) Coupling */}
        <div className="glass-panel rounded-2xl p-4 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold">
              <Thermometer className="w-4 h-4" /> Thermal Infiltration Load
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">ΔT = 49°C</span>
          </div>
          <p className="text-xs text-slate-300">
            Thermal heat loss scales dynamically with wind speed infiltration: Q = U·A·ΔT · (1 + 0.022·V_wind).
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full w-[65%]" />
          </div>
        </div>

      </div>

      {/* 7-Day Polar Weather & Storm Risk Outlook */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/25 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            7-Day Synoptic Weather & Renewable Outlook
          </h3>
          <span className="text-xs font-mono text-slate-400">
            NCPOR Polar Numerical Weather Model Integration
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {sevenDayOutlook.map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                day.riskLevel === 'CRITICAL'
                  ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-950/40'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{day.day}</span>
                {day.riskLevel === 'CRITICAL' && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <div className="text-[11px] text-slate-400 mb-2 truncate" title={day.condition}>
                {day.condition}
              </div>

              <div className="space-y-1 text-xs font-mono">
                <div className="text-slate-300">
                  {day.tempLow}° / <span className="text-cyan-300">{day.tempHigh}°C</span>
                </div>
                <div className="text-cyan-400 text-[11px]">
                  💨 {day.maxWindKmh} km/h
                </div>
                <div className="text-emerald-400 text-[11px] font-bold">
                  🌱 {day.estimatedRenewableFractionPct}% Clean
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
