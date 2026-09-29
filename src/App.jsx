// POLARIS: AI-Driven Smart Energy Management System for Polar Research Stations
// SIH26061 | Ministry of Earth Sciences (MoES) - National Centre for Polar and Ocean Research (NCPOR)

import React, { useState, useMemo } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import DigitalTwinView from './components/digitalTwin/DigitalTwinView';
import ForecastDashboard from './components/forecasting/ForecastDashboard';
import OptimizerDashboard from './components/optimizer/OptimizerDashboard';
import ExtremeWeatherSandbox from './components/sandbox/ExtremeWeatherSandbox';
import FuelLogisticsView from './components/logistics/FuelLogisticsView';
import EnergyAuditReport from './components/reports/EnergyAuditReport';

import { STATIONS } from './data/stationsData';
import { generate24HourForecast } from './algorithms/forecastingEngine';
import { solveOptimalMicrogridDispatch } from './algorithms/microgridOptimizer';
import { generatePolarEnergyReport } from './services/pdfReportService';

export default function App() {
  const [stationId, setStationId] = useState('bharati');
  const [activeView, setActiveView] = useState('twin');

  // Weather & Polar Atmospheric State
  const [weatherState, setWeatherState] = useState({
    baseTemp: -28,
    tempVariation: 6,
    baseWindSpeed: 12, // ~43 km/h
    cloudCover: 18,
    isKatabaticStorm: false,
    bladeIcing: 4,
    dayOfYear: 345 // Antarctic Summer
  });

  // De-icing heater active state
  const [isDeIcing, setIsDeIcing] = useState(false);

  // Microgrid Optimization Parameters
  const [optimizerParams, setOptimizerParams] = useState({
    enableSmartLoadShifting: true,
    spinningReservePct: 20,
    dieselCostPerLiter: 5.80,
  });

  // Current Station Object
  const currentStation = useMemo(() => {
    return STATIONS[stationId] || STATIONS.bharati;
  }, [stationId]);

  // Reactive 24-Hour AI Forecast
  const forecastData = useMemo(() => {
    return generate24HourForecast(currentStation, weatherState);
  }, [currentStation, weatherState]);

  // Reactive MILP / MPC Optimal Microgrid Dispatch
  const optimizationResults = useMemo(() => {
    return solveOptimalMicrogridDispatch(currentStation, forecastData, optimizerParams);
  }, [currentStation, forecastData, optimizerParams]);

  // Weather Controller Handlers
  const handleUpdateWeather = (newWeather) => {
    setWeatherState(prev => ({ ...prev, ...newWeather }));
  };

  const handleResetWeather = () => {
    setWeatherState({
      baseTemp: currentStation.winterTempRange[0] + 15,
      tempVariation: 6,
      baseWindSpeed: 11,
      cloudCover: 20,
      isKatabaticStorm: false,
      bladeIcing: 4,
      dayOfYear: 345
    });
  };

  const handleToggleDeIcing = () => {
    setIsDeIcing(prev => !prev);
    if (!isDeIcing) {
      // Blade icing clears when de-icer is turned on
      setWeatherState(prev => ({ ...prev, bladeIcing: 0 }));
    }
  };

  const handleDownloadPDF = () => {
    generatePolarEnergyReport(currentStation, optimizationResults.metrics, weatherState);
  };

  return (
    <div className="min-h-screen bg-[#070b14] polar-grid-bg text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Header Navbar */}
      <Navbar
        currentStationId={stationId}
        onSelectStation={setStationId}
        weatherState={weatherState}
        onDownloadReport={handleDownloadPDF}
        activeView={activeView}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1720px] w-full mx-auto p-4 lg:p-6 gap-6">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          madridScore={optimizationResults.metrics.madridProtocolScore}
          isKatabatic={weatherState.isKatabaticStorm}
        />

        {/* Dynamic Viewport Content */}
        <main className="flex-1 min-w-0">
          {activeView === 'twin' && (
            <DigitalTwinView
              station={currentStation}
              weatherState={weatherState}
              forecastData={forecastData}
              optimizationResults={optimizationResults}
              isDeIcing={isDeIcing}
              onToggleDeIcing={handleToggleDeIcing}
            />
          )}

          {activeView === 'forecast' && (
            <ForecastDashboard
              station={currentStation}
              forecastData={forecastData}
              weatherState={weatherState}
            />
          )}

          {activeView === 'optimizer' && (
            <OptimizerDashboard
              station={currentStation}
              optimizationResults={optimizationResults}
              onUpdateParams={setOptimizerParams}
              params={optimizerParams}
            />
          )}

          {activeView === 'sandbox' && (
            <ExtremeWeatherSandbox
              station={currentStation}
              weatherState={weatherState}
              onUpdateWeather={handleUpdateWeather}
              onResetWeather={handleResetWeather}
              isDeIcing={isDeIcing}
              onToggleDeIcing={handleToggleDeIcing}
            />
          )}

          {activeView === 'logistics' && (
            <FuelLogisticsView
              station={currentStation}
              dailyFuelBurnLiters={optimizationResults.metrics.totalFuelOptimizedL || 145}
            />
          )}

          {activeView === 'reports' && (
            <EnergyAuditReport
              station={currentStation}
              optimizationResults={optimizationResults}
              weatherState={weatherState}
            />
          )}
        </main>
      </div>

    </div>
  );
}
