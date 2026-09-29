// POLARIS: Hourly Microgrid Dispatch Schedule & Gantt View
import React from 'react';
import { Clock, Cpu, CheckCircle, Flame, Battery, Zap, Droplets } from 'lucide-react';

export default function DispatchGantt({ optimizedSteps }) {
  if (!optimizedSteps || !optimizedSteps.length) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          24-Hour Automated Asset Commitment & Dispatch Schedule
        </h3>
        <span className="text-xs font-mono text-cyan-300">
          MILP Optimal Status Matrix
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px] space-y-3 font-mono text-xs">
          
          {/* Header Hours Row */}
          <div className="grid grid-cols-25 gap-1 text-[10px] text-slate-400 pb-1 border-b border-slate-800">
            <div className="col-span-3 text-left">Asset / Subsystem</div>
            {optimizedSteps.map((s, idx) => (
              <div key={idx} className="text-center">{s.time.slice(0, 2)}</div>
            ))}
          </div>

          {/* Genset 1 Row */}
          <div className="grid grid-cols-25 gap-1 items-center">
            <div className="col-span-3 text-slate-300 font-sans flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Genset 1 (Base)
            </div>
            {optimizedSteps.map((s, idx) => (
              <div
                key={idx}
                title={`Hour ${s.time}: ${s.genset1Kw} kW`}
                className={`h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                  s.genset1Kw > 0
                    ? 'bg-orange-500/80 text-black shadow-sm shadow-orange-500/30'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
              >
                {s.genset1Kw > 0 ? `${Math.round(s.genset1Kw)}` : 'OFF'}
              </div>
            ))}
          </div>

          {/* BESS Storage Row */}
          <div className="grid grid-cols-25 gap-1 items-center">
            <div className="col-span-3 text-slate-300 font-sans flex items-center gap-1.5">
              <Battery className="w-3.5 h-3.5 text-emerald-400" /> BESS LiFePO4
            </div>
            {optimizedSteps.map((s, idx) => {
              const isCh = s.bessChargeKw > 0;
              const isDis = s.bessDischargeKw > 0;
              return (
                <div
                  key={idx}
                  title={`Hour ${s.time}: SoC ${s.bessSocPct}% (${isCh ? `+${s.bessChargeKw} kW` : isDis ? `-${s.bessDischargeKw} kW` : 'Float'})`}
                  className={`h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                    isCh
                      ? 'bg-emerald-500/80 text-black'
                      : isDis
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isCh ? 'CHG' : isDis ? 'DIS' : 'FLT'}
                </div>
              );
            })}
          </div>

          {/* Renewable Penetration Row */}
          <div className="grid grid-cols-25 gap-1 items-center">
            <div className="col-span-3 text-slate-300 font-sans flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Clean Penetration
            </div>
            {optimizedSteps.map((s, idx) => {
              const renPct = Math.min(100, Math.round((s.totalRenewableKw / (s.loadKw || 1)) * 100));
              return (
                <div
                  key={idx}
                  title={`Hour ${s.time}: ${renPct}% Clean Energy`}
                  className={`h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                    renPct >= 90
                      ? 'bg-cyan-400 text-black'
                      : renPct >= 50
                      ? 'bg-cyan-700 text-cyan-100'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {renPct}%
                </div>
              );
            })}
          </div>

          {/* Snow Melter Scheduled Load */}
          <div className="grid grid-cols-25 gap-1 items-center">
            <div className="col-span-3 text-slate-300 font-sans flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" /> Snow Melter Shift
            </div>
            {optimizedSteps.map((s, idx) => {
              const isPeakMelt = s.hour === 6 || s.hour === 18 || s.totalRenewableKw > s.loadKw;
              return (
                <div
                  key={idx}
                  title={`Hour ${s.time}: Water Production ${isPeakMelt ? 'Active' : 'Low'}`}
                  className={`h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                    isPeakMelt
                      ? 'bg-blue-500/70 text-white'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  {isPeakMelt ? 'MELT' : 'IDLE'}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
