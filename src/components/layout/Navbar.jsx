// POLARIS: Top Header Navbar & Station Switcher
import React, { useState, useEffect } from 'react';
import {
  Compass,
  Thermometer,
  Wind,
  Sun,
  Moon,
  Clock,
  Download,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  Zap,
  Radio,
  FileText
} from 'lucide-react';
import { STATIONS } from '../../data/stationsData';

export default function Navbar({
  currentStationId,
  onSelectStation,
  weatherState,
  onDownloadReport,
  activeView
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stationMenuOpen, setStationMenuOpen] = useState(false);

  const currentStation = STATIONS[currentStationId] || STATIONS.bharati;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utcString = currentTime.toUTCString().slice(17, 25) + ' UTC';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand & Station Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-blue-600/20 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-cyan-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider text-white font-sans">POLARIS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  SIH26061
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                AI Polar Energy Management System (MoES / NCPOR)
              </div>
            </div>
          </div>

          {/* Station Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStationMenuOpen(!stationMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold text-white transition-all shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentStation.name.split(' ')[0]} Base</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${stationMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {stationMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-mono text-cyan-400 px-3 py-1 uppercase font-bold tracking-wider">
                  Select Polar Station
                </div>
                {Object.values(STATIONS).map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onSelectStation(st.id);
                      setStationMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                      st.id === currentStationId
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{st.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{st.location}</div>
                    </div>
                    {st.id === currentStationId && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Real-Time Polar Weather Telemetry HUD */}
        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            <span>{weatherState.baseTemp}°C</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span>{Math.round(weatherState.baseWindSpeed * 3.6)} km/h</span>
            {weatherState.isKatabaticStorm && (
              <span className="text-rose-400 font-bold animate-pulse">(BLIZZARD)</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            {weatherState.dayOfYear >= 150 && weatherState.dayOfYear <= 210 ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300">Polar Night</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Midnight Sun</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-3">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{utcString}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onDownloadReport}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MoES Audit PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
}
