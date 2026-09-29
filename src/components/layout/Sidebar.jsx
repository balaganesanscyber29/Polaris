// POLARIS: Navigation Sidebar
import React from 'react';
import {
  Globe,
  BrainCircuit,
  Cpu,
  CloudSnow,
  Fuel,
  FileText,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export default function Sidebar({
  activeView,
  onSelectView,
  madridScore = 96,
  isKatabatic = false
}) {
  const navItems = [
    { id: 'twin', label: 'Command Digital Twin', icon: Globe, badge: '3D/2D' },
    { id: 'forecast', label: 'AI Forecasting Engine', icon: BrainCircuit, badge: 'BiLSTM' },
    { id: 'optimizer', label: 'Microgrid Optimizer', icon: Cpu, badge: 'MILP/MPC' },
    { id: 'sandbox', label: 'Contingency Sandbox', icon: CloudSnow, badge: isKatabatic ? 'ALERT' : 'Live' },
    { id: 'logistics', label: 'Fuel Logistics & Autonomy', icon: Fuel, badge: 'Madrid' },
    { id: 'reports', label: 'MoES Audit & Reports', icon: FileText, badge: 'PDF' },
  ];

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-cyan-500/20 p-4 flex flex-col justify-between space-y-6">
      
      {/* Navigation Links */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono text-cyan-400/80 px-3 uppercase tracking-wider font-bold mb-2">
          Control Modules
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                  item.badge === 'ALERT'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-900 text-slate-500'
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Station Status Pill & Madrid Compliance */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Madrid Protocol:</span>
            <span className="text-emerald-400 font-bold">{madridScore}/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${madridScore}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Antarctic Treaty Madrid Annex IV
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono text-center">
          POLARIS AI Core v2.4 • MoES / SIH26061
        </div>
      </div>

    </aside>
  );
}
