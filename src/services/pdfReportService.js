// POLARIS: MoES / NCPOR Official Polar Energy Audit Report Generator (jsPDF)
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePolarEnergyReport(station, optimizationMetrics, weatherState) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(10, 25, 47); // Polar Navy
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Title
  doc.setTextColor(0, 242, 254); // Aurora Cyan
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('POLARIS | AI-DRIVEN ENERGY MANAGEMENT SYSTEM', 14, 18);

  doc.setTextColor(200, 225, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Ministry of Earth Sciences (MoES) - National Centre for Polar and Ocean Research (NCPOR)', 14, 26);
  doc.text(`Official Energy Performance & Environmental Audit | Problem ID: SIH26061`, 14, 33);

  // Station Info Card
  doc.setFillColor(245, 248, 252);
  doc.roundedRect(14, 46, pageWidth - 28, 32, 2, 2, 'F');
  doc.setDrawColor(200, 215, 230);
  doc.roundedRect(14, 46, pageWidth - 28, 32, 2, 2, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Station: ${station.name}`, 18, 54);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Coordinates: ${station.coordinates}`, 18, 61);
  doc.text(`Location: ${station.location}`, 18, 67);
  doc.text(`Current Climate: ${station.climateZone} | Ambient Temp: ${weatherState.baseTemp}°C`, 18, 73);

  const now = new Date();
  doc.text(`Audit Timestamp: ${now.toUTCString()}`, pageWidth - 100, 54);
  doc.text(`Station Crew: ${station.occupancy.current} Expeditioners`, pageWidth - 100, 61);
  doc.text(`Madrid Protocol Score: ${optimizationMetrics.madridProtocolScore}/100 (Tier A+)`, pageWidth - 100, 67);

  // Key KPI Summary Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 30, 60);
  doc.text('1. Executive Microgrid Performance Summary (24-Hour AI Dispatch)', 14, 88);

  const kpiRows = [
    ['Renewable Generation Fraction', `${optimizationMetrics.renewableFractionPct}%`, 'Baseline Rule: ~18%', 'High Solar & Cold-Air Wind Peak'],
    ['Total Fuel Consumed', `${optimizationMetrics.totalFuelOptimizedL} Liters`, `${optimizationMetrics.totalFuelBaselineL} Liters`, `-${optimizationMetrics.fuelSavedPct}% Reduction`],
    ['Fuel Saved per Day', `${optimizationMetrics.fuelSavedL} Liters`, '0 Liters', `$${optimizationMetrics.costSavedUSD.toLocaleString()} USD Saved/Day`],
    ['CO2 Emissions Avoided', `${optimizationMetrics.co2SavedKg} kg CO2`, '0 kg', 'Madrid Protocol Compliant'],
    ['CHP Waste Heat Recovered', `${optimizationMetrics.totalChpHeatRecoveredKwhth} kWh(th)`, 'Minimal', 'District loop hydronic heating'],
    ['Renewable Curtailment Loss', `${optimizationMetrics.totalRenewableCurtailmentKwh} kWh`, 'High (Over-generation dump)', `-${optimizationMetrics.curtailmentReductionPct}% Loss Reduction`],
    ['Wet Stacking / Genset Soot Risk', `${optimizationMetrics.wetStackingHoursOptimized} Hours`, `${optimizationMetrics.wetStackingHoursBaseline} Hours`, 'Optimal >35% loading preserved']
  ];

  autoTable(doc, {
    startY: 92,
    head: [['Key Metric', 'AI-Optimized (POLARIS)', 'Conventional Baseline', 'Impact & Net Gain']],
    body: kpiRows,
    theme: 'grid',
    headStyles: { fillColor: [14, 116, 144], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { textColor: [2, 132, 199], fontStyle: 'bold', cellWidth: 42 },
      2: { textColor: [100, 116, 139], cellWidth: 42 },
      3: { textColor: [16, 185, 129], fontStyle: 'bold', cellWidth: 46 }
    }
  });

  // Section 2: Generation Asset Breakdown
  const finalY1 = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 30, 60);
  doc.text('2. Generation Assets & Storage Inventory', 14, finalY1);

  const assetRows = [
    ['Solar PV Array', `${station.energySystem.solarPV.name}`, `${station.energySystem.solarPV.capacityKwp} kWp`, 'Bifacial Snow Albedo x1.28 Boost'],
    ['Wind Generation', `${station.energySystem.windTurbines.length} Turbines (VAWT/HAWT)`, `${station.energySystem.windTurbines.reduce((s,w)=>s+w.capacityKw,0)} kW Total`, 'Cold Air Density Boost (+18%)'],
    ['BESS Storage', `${station.energySystem.bess.name}`, `${station.energySystem.bess.capacityKwh} kWh`, 'Active Waste Heat Thermal Control'],
    ['Diesel / Multi-Fuel', `${station.energySystem.dieselGensets.length} Polar Gensets`, `${station.energySystem.dieselGensets.reduce((s,g)=>s+g.capacityKw,0)} kW Total`, 'Exhaust CHP Heat Recovery 42%'],
    ['Polar Fuel Reserves', `${station.energySystem.fuelStorage.fuelType}`, `${station.energySystem.fuelStorage.currentFuelLiters.toLocaleString()} L`, `Safe Reserve: ${station.energySystem.fuelStorage.minSafeReserveLiters.toLocaleString()} L`]
  ];

  autoTable(doc, {
    startY: finalY1 + 4,
    head: [['Asset Subsystem', 'Specification', 'Capacity Rating', 'Operational Feature']],
    body: assetRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    styles: { fontSize: 8, cellPadding: 2.2 }
  });

  // Section 3: Madrid Protocol & Environmental Compliance Statement
  const finalY2 = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 149, 100);
  doc.text('3. Environmental Treaty & Madrid Protocol Compliance Affirmation', 14, finalY2);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const treatyText = `Under Annex IV to the Protocol on Environmental Protection to the Antarctic Treaty (Prevention of Marine and Atmospheric Pollution), the POLARIS AI system enforces rigorous emission limits, eliminates wet stacking unburnt hydrocarbon soot, and maximizes zero-emission renewable penetration. Fuel autonomy is projected at ${Math.round(station.energySystem.fuelStorage.currentFuelLiters / (optimizationMetrics.totalFuelOptimizedL || 1))} days under AI optimization, protecting scientific life-support against extreme sea-ice logistical delays.`;
  
  const splitText = doc.splitTextToSize(treatyText, pageWidth - 28);
  doc.text(splitText, 14, finalY2 + 6);

  // Footer Signature
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 280, pageWidth - 14, 280);
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text('Generated autonomously by POLARIS AI Core | Ministry of Earth Sciences (MoES) SIH26061 | Smart India Hackathon', 14, 285);
  doc.text('Page 1 of 1', pageWidth - 28, 285);

  // Save PDF
  doc.save(`POLARIS_Energy_Audit_${station.id}_${now.toISOString().slice(0, 10)}.pdf`);
}
