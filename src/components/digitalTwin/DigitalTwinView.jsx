// POLARIS: Central Polar Base & Microgrid Command Digital Twin View
import React, { useState } from 'react';
import {
  Globe,
  Layers,
  Activity,
  Zap,
  BatteryCharging,
  Thermometer,
  ShieldCheck,
  Fuel,
  Maximize2
} from 'lucide-react';
import PolarStation3D from './PolarStation3D';
import PolarSynopticView from './PolarSynopticView';
import ComponentInspectorModal from './ComponentInspectorModal';

export default function DigitalTwinView({
  station,
  weatherState,
  forecastData,
  optimizationResults,
  isDeIcing,
  onToggleDeIcing
}) {
  const [viewMode, setViewMode] = useState('3d'); // '3d' or '2d'
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const currentDispatch = optimizationResults?.optimizedSteps?.[0] || {};
  const metrics = optimizationResults?.metrics || {};

  return (
    <div className="space-y-6">
      
      {/* Real-Time Polar Microgrid Telemetry KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Total Demand */}
        <div className="glass-panel rounded-2xl p-3.5 border border-cyan-500/20">
          <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
            <span>Total Station Load</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {currentDispatch.loadKw || 65} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
            Critical: {Object.values(station.criticalLoads).reduce((a, b) => a + b, 0)} kW (100%)
          </div>
        </div>

        {/* Metric 2: Renewable Penetration */}
        <div className="glass-panel rounded-2xl p-3.5 border border-emerald-500/20">
          <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
            <span>Clean Penetration</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {metrics.renewableFractionPct || 78}%
          </div>
          <div className="text-[10px] text-emerald-300 font-mono mt-0.5">
            Solar + Wind Cold Air Boost
          </div>
        </div>

        {/* Metric 3: Battery SoC */}
        <div className="glass-panel rounded-2xl p-3.5 border border-teal-500/20">
          <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
            <span>BESS Battery Bank</span>
            <BatteryCharging className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-bold font-mono text-teal-300">
            {currentDispatch.bessSocPct || 68}% <span className="text-xs font-normal text-slate-400">SoC</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Temp: {station.energySystem.bess.batteryTempC}°C (Heated)
          </div>
        </div>

        {/* Metric 4: Thermal Heating Demand */}
        <div className="glass-panel rounded-2xl p-3.5 border border-orange-500/20">
          <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
            <span>Hydronic Heat Loop</span>
            <Thermometer className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-bold font-mono text-orange-400">
            {currentDispatch.thermalDemandKwth || 75} <span className="text-xs font-normal text-slate-400">kW(th)</span>
          </div>
          <div className="text-[10px] text-amber-300 font-mono mt-0.5">
            CHP Exhaust Heat: {currentDispatch.chpThermalKwth || 0} kWth
          </div>
        </div>

        {/* Metric 5: Fuel Autonomy Days */}
        <div className="glass-panel rounded-2xl p-3.5 border border-purple-500/20 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
            <span>Days of Autonomy</span>
            <Fuel className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-300">
            {Math.round(station.energySystem.fuelStorage.currentFuelLiters / (metrics.totalFuelOptimizedL || 145))} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            +42% Extended by AI EMS
          </div>
        </div>

      </div>

      {/* Mode Switcher & Viewport Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            {station.name} Digital Twin & Synoptic Power Flow
          </h3>
          <p className="text-xs text-slate-400">
            Interactive polar base physics simulation, microgrid bus routing, and equipment telemetry
          </p>
        </div>

        {/* 3D vs 2D Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            3D Base Twin (WebGL)
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === '2d'
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            2D Synoptic SLD
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="w-full">
        {viewMode === '3d' ? (
          <div className="w-full h-[520px]">
            <PolarStation3D
              station={station}
              windSpeedKmh={Math.round(weatherState.baseWindSpeed * 3.6)}
              isKatabaticStorm={weatherState.isKatabaticStorm}
              isPolarNight={weatherState.dayOfYear >= 150 && weatherState.dayOfYear <= 210}
              isDeIcing={isDeIcing}
              onSelectComponent={setSelectedComponentId}
              activeComponentId={selectedComponentId}
            />
          </div>
        ) : (
          <PolarSynopticView
            station={station}
            currentDispatch={currentDispatch}
            onSelectComponent={setSelectedComponentId}
            activeComponentId={selectedComponentId}
          />
        )}
      </div>

      {/* Equipment Inspector Modal */}
      <ComponentInspectorModal
        componentId={selectedComponentId}
        station={station}
        onClose={() => setSelectedComponentId(null)}
        onToggleDeIcing={onToggleDeIcing}
        isDeIcing={isDeIcing}
      />

    </div>
  );
}
