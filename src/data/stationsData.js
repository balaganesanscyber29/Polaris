// POLARIS: Station technical configurations and polar microgrid parameters
// Based on MoES / NCPOR (National Centre for Polar and Ocean Research) Station Specs

export const STATIONS = {
  bharati: {
    id: 'bharati',
    name: 'Bharati Antarctic Research Station',
    location: 'Larsemann Hills, East Antarctica',
    coordinates: '69°24′28″ S, 76°11′14″ E',
    climateZone: 'Antarctic Coastal (Katabatic Wind Regime)',
    winterTempRange: [-45, -18],
    summerTempRange: [-15, 5],
    currentSeason: 'Polar Summer Transition',
    occupancy: {
      summer: 47,
      winter: 24,
      current: 38,
    },
    baseElevated: true, // Elevating main building on stilts to prevent snowdrifts
    energySystem: {
      dieselGensets: [
        { id: 'DG-1', name: 'Volvo Penta Multi-Fuel Genset 1', capacityKw: 100, minLoadingPct: 35, fuelRateLPerKwh: 0.28, chpEfficiency: 0.42, status: 'Running', healthScore: 96, runningHours: 1420 },
        { id: 'DG-2', name: 'Volvo Penta Multi-Fuel Genset 2', capacityKw: 100, minLoadingPct: 35, fuelRateLPerKwh: 0.28, chpEfficiency: 0.42, status: 'Standby', healthScore: 98, runningHours: 890 },
        { id: 'DG-3', name: 'Emergency Polar Genset 3', capacityKw: 60, minLoadingPct: 40, fuelRateLPerKwh: 0.31, chpEfficiency: 0.35, status: 'Standby', healthScore: 99, runningHours: 210 },
      ],
      solarPV: {
        id: 'SOLAR-1',
        name: 'Bifacial Snow-Albedo PV Array',
        capacityKwp: 65,
        tiltAngleDeg: 65, // Steep tilt to shed snow and catch low polar sun
        albedoMultiplier: 1.28, // Ground snow reflection boost
        currentSnowCoverPct: 8,
        status: 'Optimal',
      },
      windTurbines: [
        { id: 'WT-1', name: 'Polar Ruggedized VAWT 1 (Vertical Axis)', capacityKw: 25, cutInSpeedMs: 3.0, ratedSpeedMs: 12.0, cutOutSpeedMs: 30.0, antiIcingHeaterKw: 1.8, isDeIcing: false, status: 'Optimal', bladeIcingPct: 4 },
        { id: 'WT-2', name: 'Polar Ruggedized VAWT 2 (Vertical Axis)', capacityKw: 25, cutInSpeedMs: 3.0, ratedSpeedMs: 12.0, cutOutSpeedMs: 30.0, antiIcingHeaterKw: 1.8, isDeIcing: false, status: 'Optimal', bladeIcingPct: 6 },
        { id: 'WT-3', name: 'Polar Ruggedized HAWT 3 (Horizontal Axis)', capacityKw: 30, cutInSpeedMs: 3.2, ratedSpeedMs: 12.5, cutOutSpeedMs: 32.0, antiIcingHeaterKw: 2.2, isDeIcing: false, status: 'Optimal', bladeIcingPct: 3 },
      ],
      bess: {
        id: 'BESS-1',
        name: 'Thermally Conditioned LiFePO4 Battery Bank',
        capacityKwh: 220,
        maxChargeKw: 60,
        maxDischargeKw: 75,
        roundTripEfficiency: 0.92,
        minSocPct: 15,
        maxSocPct: 95,
        currentSocPct: 68,
        batteryTempC: 18.5, // Container maintained at 18-20°C via waste heat
        targetTempC: 20.0,
        thermalHeaterKw: 4.5,
        sohPct: 98.4,
      },
      thermalSystem: {
        districtHeatingLoopKwth: 120,
        chpHeatRecoveryExchangerKwth: 85,
        auxiliaryDieselBoilerKwth: 50,
        snowMelterPlantKw: 22,
        heatingTargetTempC: 21.0,
      },
      fuelStorage: {
        fuelType: 'Aviation Turbine Fuel (ATF / Jet A-1 Polar Blend)',
        tankCapacityLiters: 180000,
        currentFuelLiters: 124500,
        minSafeReserveLiters: 35000,
        fuelDensityKgPerL: 0.804,
        costPerLiterInAntarcticaUSD: 5.80, // High logistics/shipping cost
      }
    },
    criticalLoads: {
      lifeSupportHvacKw: 28,
      satelliteCommunicationsKw: 12,
      snowMelterWaterKw: 18,
      sewageTreatmentPlantKw: 8,
      foodStorageFreezersKw: 14,
    },
    scientificLoads: {
      atmosphericLidarKw: 9.5,
      geomagneticObservatoryKw: 4.2,
      iceCoreCryoStorageKw: 15.0,
      meteorologicalRadarKw: 6.8,
    },
    livingQuartersLoads: {
      lightingAndAuxKw: 10,
      galleyKitchenKw: 16,
      workstationsAndCommsKw: 8,
    }
  },

  maitri: {
    id: 'maitri',
    name: 'Maitri Antarctic Research Station',
    location: 'Schirmacher Oasis, Queen Maud Land, Antarctica',
    coordinates: '70°45′57″ S, 11°44′09″ E',
    climateZone: 'Inland Oasis (Severe Katabatic Blizzards)',
    winterTempRange: [-52, -22],
    summerTempRange: [-18, 2],
    currentSeason: 'Polar Summer Transition',
    occupancy: {
      summer: 45,
      winter: 25,
      current: 32,
    },
    baseElevated: false,
    energySystem: {
      dieselGensets: [
        { id: 'DG-1', name: 'Caterpillar Polar Diesel 1', capacityKw: 125, minLoadingPct: 38, fuelRateLPerKwh: 0.29, chpEfficiency: 0.38, status: 'Running', healthScore: 91, runningHours: 3200 },
        { id: 'DG-2', name: 'Caterpillar Polar Diesel 2', capacityKw: 125, minLoadingPct: 38, fuelRateLPerKwh: 0.29, chpEfficiency: 0.38, status: 'Standby', healthScore: 94, runningHours: 2100 },
        { id: 'DG-3', name: 'Backup Polar Diesel 3', capacityKw: 75, minLoadingPct: 40, fuelRateLPerKwh: 0.32, chpEfficiency: 0.32, status: 'Standby', healthScore: 97, runningHours: 540 },
      ],
      solarPV: {
        id: 'SOLAR-1',
        name: 'Oasis Ground-Mounted Bifacial PV',
        capacityKwp: 45,
        tiltAngleDeg: 60,
        albedoMultiplier: 1.15,
        currentSnowCoverPct: 15,
        status: 'Optimal',
      },
      windTurbines: [
        { id: 'WT-1', name: 'Katabatic-Shielded Wind Turbine 1', capacityKw: 20, cutInSpeedMs: 3.5, ratedSpeedMs: 13.0, cutOutSpeedMs: 32.0, antiIcingHeaterKw: 2.0, isDeIcing: false, status: 'Optimal', bladeIcingPct: 8 },
        { id: 'WT-2', name: 'Katabatic-Shielded Wind Turbine 2', capacityKw: 20, cutInSpeedMs: 3.5, ratedSpeedMs: 13.0, cutOutSpeedMs: 32.0, antiIcingHeaterKw: 2.0, isDeIcing: false, status: 'Optimal', bladeIcingPct: 12 },
      ],
      bess: {
        id: 'BESS-1',
        name: 'Deep-Cycle Arctic Battery Bank',
        capacityKwh: 160,
        maxChargeKw: 45,
        maxDischargeKw: 55,
        roundTripEfficiency: 0.90,
        minSocPct: 20,
        maxSocPct: 92,
        currentSocPct: 54,
        batteryTempC: 17.2,
        targetTempC: 19.0,
        thermalHeaterKw: 3.8,
        sohPct: 95.8,
      },
      thermalSystem: {
        districtHeatingLoopKwth: 140,
        chpHeatRecoveryExchangerKwth: 75,
        auxiliaryDieselBoilerKwth: 65,
        snowMelterPlantKw: 28, // Lake Priyadarshini water pumping + heating
        heatingTargetTempC: 20.5,
      },
      fuelStorage: {
        fuelType: 'Antarctic Low-Pour Special Diesel Blend',
        tankCapacityLiters: 150000,
        currentFuelLiters: 89000,
        minSafeReserveLiters: 30000,
        fuelDensityKgPerL: 0.812,
        costPerLiterInAntarcticaUSD: 6.20,
      }
    },
    criticalLoads: {
      lifeSupportHvacKw: 34,
      satelliteCommunicationsKw: 10,
      snowMelterWaterKw: 22,
      sewageTreatmentPlantKw: 9,
      foodStorageFreezersKw: 12,
    },
    scientificLoads: {
      atmosphericLidarKw: 7.0,
      geomagneticObservatoryKw: 6.5,
      iceCoreCryoStorageKw: 12.0,
      meteorologicalRadarKw: 5.0,
    },
    livingQuartersLoads: {
      lightingAndAuxKw: 12,
      galleyKitchenKw: 18,
      workstationsAndCommsKw: 7,
    }
  },

  himadri: {
    id: 'himadri',
    name: 'Himadri Arctic Research Station',
    location: 'Ny-Ålesund, Spitsbergen, Svalbard (79°N)',
    coordinates: '78°55′ N, 11°56′ E',
    climateZone: 'High Arctic Fjord (Strict Zero-Emission & Noise Rules)',
    winterTempRange: [-35, -10],
    summerTempRange: [-4, 8],
    currentSeason: 'Arctic Polar Night / Early Twilight',
    occupancy: {
      summer: 16,
      winter: 6,
      current: 10,
    },
    baseElevated: false,
    energySystem: {
      dieselGensets: [
        { id: 'DG-1', name: 'Ultra-Low Emission Bio-Diesel Genset 1', capacityKw: 50, minLoadingPct: 35, fuelRateLPerKwh: 0.26, chpEfficiency: 0.45, status: 'Standby', healthScore: 98, runningHours: 620 },
        { id: 'DG-2', name: 'Ultra-Low Emission Bio-Diesel Genset 2', capacityKw: 50, minLoadingPct: 35, fuelRateLPerKwh: 0.26, chpEfficiency: 0.45, status: 'Standby', healthScore: 99, runningHours: 410 },
      ],
      solarPV: {
        id: 'SOLAR-1',
        name: 'Vertical Fjord High-Albedo Solar PV',
        capacityKwp: 35,
        tiltAngleDeg: 80, // Vertical to catch low sun and prevent snow accumulation
        albedoMultiplier: 1.35,
        currentSnowCoverPct: 2,
        status: 'Optimal',
      },
      windTurbines: [
        { id: 'WT-1', name: 'Ultra-Quiet Arctic Wind Turbine 1', capacityKw: 15, cutInSpeedMs: 2.8, ratedSpeedMs: 11.0, cutOutSpeedMs: 28.0, antiIcingHeaterKw: 1.2, isDeIcing: false, status: 'Optimal', bladeIcingPct: 2 },
        { id: 'WT-2', name: 'Ultra-Quiet Arctic Wind Turbine 2', capacityKw: 15, cutInSpeedMs: 2.8, ratedSpeedMs: 11.0, cutOutSpeedMs: 28.0, antiIcingHeaterKw: 1.2, isDeIcing: false, status: 'Optimal', bladeIcingPct: 3 },
      ],
      bess: {
        id: 'BESS-1',
        name: 'High-Density Arctic Solid-State/LiFePO4 Bank',
        capacityKwh: 120,
        maxChargeKw: 35,
        maxDischargeKw: 45,
        roundTripEfficiency: 0.94,
        minSocPct: 10,
        maxSocPct: 98,
        currentSocPct: 82,
        batteryTempC: 19.0,
        targetTempC: 20.0,
        thermalHeaterKw: 2.2,
        sohPct: 99.1,
      },
      thermalSystem: {
        districtHeatingLoopKwth: 65,
        chpHeatRecoveryExchangerKwth: 40,
        auxiliaryDieselBoilerKwth: 25,
        snowMelterPlantKw: 10,
        heatingTargetTempC: 21.0,
      },
      fuelStorage: {
        fuelType: 'Arctic Ultra-Low Sulfur Clean Bio-Diesel',
        tankCapacityLiters: 60000,
        currentFuelLiters: 46200,
        minSafeReserveLiters: 12000,
        fuelDensityKgPerL: 0.825,
        costPerLiterInAntarcticaUSD: 4.90,
      }
    },
    criticalLoads: {
      lifeSupportHvacKw: 14,
      satelliteCommunicationsKw: 6,
      snowMelterWaterKw: 7,
      sewageTreatmentPlantKw: 4,
      foodStorageFreezersKw: 6,
    },
    scientificLoads: {
      atmosphericLidarKw: 12.0,
      geomagneticObservatoryKw: 3.5,
      iceCoreCryoStorageKw: 8.0,
      meteorologicalRadarKw: 4.5,
    },
    livingQuartersLoads: {
      lightingAndAuxKw: 5,
      galleyKitchenKw: 8,
      workstationsAndCommsKw: 4,
    }
  },

  expedition: {
    id: 'expedition',
    name: 'Dakshin Gangotri II (Mobile Field Camp)',
    location: 'Princess Astrid Coast Ice Shelf, Antarctica',
    coordinates: '70°05′ S, 12°00′ E',
    climateZone: 'Floating Ice Shelf (High Wind & Extreme Cold)',
    winterTempRange: [-58, -25],
    summerTempRange: [-22, -2],
    currentSeason: 'Deep Field Traverse Operation',
    occupancy: {
      summer: 12,
      winter: 0,
      current: 8,
    },
    baseElevated: true,
    energySystem: {
      dieselGensets: [
        { id: 'DG-1', name: 'Mobile Sled Polar Genset 1', capacityKw: 30, minLoadingPct: 35, fuelRateLPerKwh: 0.30, chpEfficiency: 0.35, status: 'Running', healthScore: 95, runningHours: 480 },
        { id: 'DG-2', name: 'Mobile Sled Polar Genset 2', capacityKw: 30, minLoadingPct: 35, fuelRateLPerKwh: 0.30, chpEfficiency: 0.35, status: 'Standby', healthScore: 98, runningHours: 190 },
      ],
      solarPV: {
        id: 'SOLAR-1',
        name: 'Rapid-Deploy Foldable Bifacial Solar Sled',
        capacityKwp: 18,
        tiltAngleDeg: 70,
        albedoMultiplier: 1.32,
        currentSnowCoverPct: 4,
        status: 'Optimal',
      },
      windTurbines: [
        { id: 'WT-1', name: 'Telescopic Guyed Wind Turbine', capacityKw: 10, cutInSpeedMs: 3.2, ratedSpeedMs: 12.0, cutOutSpeedMs: 30.0, antiIcingHeaterKw: 1.0, isDeIcing: false, status: 'Optimal', bladeIcingPct: 5 },
      ],
      bess: {
        id: 'BESS-1',
        name: 'Insulated Sled BESS Unit',
        capacityKwh: 60,
        maxChargeKw: 20,
        maxDischargeKw: 25,
        roundTripEfficiency: 0.91,
        minSocPct: 15,
        maxSocPct: 95,
        currentSocPct: 62,
        batteryTempC: 16.5,
        targetTempC: 18.0,
        thermalHeaterKw: 1.8,
        sohPct: 97.8,
      },
      thermalSystem: {
        districtHeatingLoopKwth: 30,
        chpHeatRecoveryExchangerKwth: 20,
        auxiliaryDieselBoilerKwth: 15,
        snowMelterPlantKw: 8,
        heatingTargetTempC: 20.0,
      },
      fuelStorage: {
        fuelType: 'ATF Jet A-1 Sled Tanks',
        tankCapacityLiters: 25000,
        currentFuelLiters: 16800,
        minSafeReserveLiters: 5000,
        fuelDensityKgPerL: 0.804,
        costPerLiterInAntarcticaUSD: 7.50,
      }
    },
    criticalLoads: {
      lifeSupportHvacKw: 10,
      satelliteCommunicationsKw: 4,
      snowMelterWaterKw: 5,
      sewageTreatmentPlantKw: 2,
      foodStorageFreezersKw: 3,
    },
    scientificLoads: {
      atmosphericLidarKw: 4.0,
      geomagneticObservatoryKw: 2.0,
      iceCoreCryoStorageKw: 6.0,
      meteorologicalRadarKw: 2.5,
    },
    livingQuartersLoads: {
      lightingAndAuxKw: 3,
      galleyKitchenKw: 5,
      workstationsAndCommsKw: 3,
    }
  }
};
