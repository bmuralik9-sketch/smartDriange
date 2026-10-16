// Default Municipal Data for Andhra Pradesh Capital Urban Region
// Vijayawada, Guntur, Mangalagiri, Tadepalli & Surrounding Krishna River Basin

const drains = [
  {
    drainId: "DRAIN-001",
    name: "Benz Circle Storm Canal",
    location: "Benz Circle NH-16 Flyover Lower Ramp, Vijayawada",
    latitude: 16.5002,
    longitude: 80.6480,
    waterLevel: 88,
    flowRate: 1.4,
    status: "blocked",
    riskLevel: "critical",
    assignedWorker: "K. Venkateswara Rao (WRK-101)",
    lastUpdated: new Date().toISOString(),
    capacity: 7500,
    widthMeters: 3.5,
    depthMeters: 3.8,
    zone: "Vijayawada Central"
  },
  {
    drainId: "DRAIN-002",
    name: "Ryves Canal Inflow Trunk",
    location: "Governorpet Canal Sluice Gate, Vijayawada",
    latitude: 16.5120,
    longitude: 80.6280,
    waterLevel: 74,
    flowRate: 7.8,
    status: "slow",
    riskLevel: "medium",
    assignedWorker: "Ch. Satyanarayana (WRK-102)",
    lastUpdated: new Date().toISOString(),
    capacity: 9000,
    widthMeters: 4.5,
    depthMeters: 4.0,
    zone: "Vijayawada Central"
  },
  {
    drainId: "DRAIN-003",
    name: "Bandar Canal Sluice",
    location: "Krishna River Intake Headworks, Vijayawada",
    latitude: 16.5080,
    longitude: 80.6150,
    waterLevel: 42,
    flowRate: 26.5,
    status: "normal",
    riskLevel: "low",
    assignedWorker: "None",
    lastUpdated: new Date().toISOString(),
    capacity: 12000,
    widthMeters: 5.5,
    depthMeters: 4.5,
    zone: "Vijayawada Riverside"
  },
  {
    drainId: "DRAIN-004",
    name: "Eluru Canal Outfall",
    location: "Gunadala Mary Matha Shrine Road, Vijayawada",
    latitude: 16.5240,
    longitude: 80.6650,
    waterLevel: 62,
    flowRate: 14.2,
    status: "warning",
    riskLevel: "medium",
    assignedWorker: "M. Subba Rao (WRK-103)",
    lastUpdated: new Date().toISOString(),
    capacity: 8200,
    widthMeters: 3.8,
    depthMeters: 3.5,
    zone: "Vijayawada East"
  },
  {
    drainId: "DRAIN-005",
    name: "PNBS Junction Culvert",
    location: "Pandit Nehru Bus Station North Sump, Vijayawada",
    latitude: 16.5170,
    longitude: 80.6190,
    waterLevel: 91,
    flowRate: 0.6,
    status: "blocked",
    riskLevel: "critical",
    assignedWorker: "S. Lakshmi (WRK-104)",
    lastUpdated: new Date().toISOString(),
    capacity: 6800,
    widthMeters: 3.2,
    depthMeters: 3.6,
    zone: "Vijayawada Central"
  },
  {
    drainId: "DRAIN-006",
    name: "One Town KR Market Conduit",
    location: "Kaleswara Rao Market Vegetable Yard, Vijayawada",
    latitude: 16.5190,
    longitude: 80.6090,
    waterLevel: 82,
    flowRate: 2.8,
    status: "slow",
    riskLevel: "high",
    assignedWorker: "P. Srinivas (WRK-105)",
    lastUpdated: new Date().toISOString(),
    capacity: 5400,
    widthMeters: 2.6,
    depthMeters: 3.0,
    zone: "Vijayawada Old Town"
  },
  {
    drainId: "DRAIN-007",
    name: "Prakasam Barrage Spillway Canal",
    location: "Barrage South Escape Channel, Krishna River",
    latitude: 16.5050,
    longitude: 80.6040,
    waterLevel: 35,
    flowRate: 34.0,
    status: "normal",
    riskLevel: "low",
    assignedWorker: "None",
    lastUpdated: new Date().toISOString(),
    capacity: 15000,
    widthMeters: 6.0,
    depthMeters: 5.0,
    zone: "Krishna River Basin"
  },
  {
    drainId: "DRAIN-008",
    name: "Bhavanipuram Lowland Discharge Conduit",
    location: "Gollapudi Bypass Junction, Bhavanipuram, Vijayawada",
    latitude: 16.5280,
    longitude: 80.5900,
    waterLevel: 55,
    flowRate: 18.4,
    status: "normal",
    riskLevel: "low",
    assignedWorker: "None",
    lastUpdated: new Date().toISOString(),
    capacity: 6500,
    widthMeters: 3.0,
    depthMeters: 3.2,
    zone: "Vijayawada West"
  },
  {
    drainId: "DRAIN-009",
    name: "Mangalagiri Temple Road Storm Drain",
    location: "Panakala Narasimha Swamy Temple Road, Mangalagiri",
    latitude: 16.4344,
    longitude: 80.5670,
    waterLevel: 94,
    flowRate: 0.2,
    status: "blocked",
    riskLevel: "critical",
    assignedWorker: "B. Nagaraju (WRK-106)",
    lastUpdated: new Date().toISOString(),
    capacity: 5000,
    widthMeters: 2.5,
    depthMeters: 3.0,
    zone: "Mangalagiri Municipality"
  },
  {
    drainId: "DRAIN-010",
    name: "Mangalagiri IT SEZ & AIIMS Main Lateral",
    location: "AIIMS Mangalagiri Hospital North Perimeter Canal",
    latitude: 16.4520,
    longitude: 80.5750,
    waterLevel: 38,
    flowRate: 22.0,
    status: "normal",
    riskLevel: "low",
    assignedWorker: "None",
    lastUpdated: new Date().toISOString(),
    capacity: 7800,
    widthMeters: 3.6,
    depthMeters: 3.8,
    zone: "Mangalagiri Municipality"
  },
  {
    drainId: "DRAIN-011",
    name: "Tadepalli Krishna Canal Sump",
    location: "Buckingham Canal Confluence, Tadepalli",
    latitude: 16.4820,
    longitude: 80.6050,
    waterLevel: 68,
    flowRate: 11.5,
    status: "warning",
    riskLevel: "medium",
    assignedWorker: "G. Appa Rao (WRK-107)",
    lastUpdated: new Date().toISOString(),
    capacity: 8500,
    widthMeters: 4.0,
    depthMeters: 3.8,
    zone: "Tadepalli Zone"
  },
  {
    drainId: "DRAIN-012",
    name: "Kunchanapalli Highway Box Culvert",
    location: "Kunchanapalli NH-16 Service Road Subway",
    latitude: 16.4680,
    longitude: 80.5920,
    waterLevel: 78,
    flowRate: 5.6,
    status: "slow",
    riskLevel: "high",
    assignedWorker: "G. Appa Rao (WRK-107)",
    lastUpdated: new Date().toISOString(),
    capacity: 6200,
    widthMeters: 3.0,
    depthMeters: 3.2,
    zone: "Tadepalli Zone"
  },
  {
    drainId: "DRAIN-013",
    name: "Guntur Brodipet 4th Line Storm Drain",
    location: "Brodipet Main Commercial Road, Guntur",
    latitude: 16.3110,
    longitude: 80.4340,
    waterLevel: 93,
    flowRate: 0.4,
    status: "blocked",
    riskLevel: "critical",
    assignedWorker: "Sk. Baji (WRK-108)",
    lastUpdated: new Date().toISOString(),
    capacity: 6000,
    widthMeters: 2.8,
    depthMeters: 3.2,
    zone: "Guntur Central"
  },
  {
    drainId: "DRAIN-014",
    name: "Guntur Arundalpet Main Collector Canal",
    location: "Arundalpet 8th Cross Road Subway, Guntur",
    latitude: 16.3050,
    longitude: 80.4420,
    waterLevel: 76,
    flowRate: 6.2,
    status: "slow",
    riskLevel: "high",
    assignedWorker: "D. Prasad (WRK-109)",
    lastUpdated: new Date().toISOString(),
    capacity: 7200,
    widthMeters: 3.4,
    depthMeters: 3.5,
    zone: "Guntur Central"
  },
  {
    drainId: "DRAIN-015",
    name: "Guntur Market Yard Outfall",
    location: "Old Club Road Grain Godowns, Guntur",
    latitude: 16.2980,
    longitude: 80.4550,
    waterLevel: 45,
    flowRate: 24.1,
    status: "normal",
    riskLevel: "low",
    assignedWorker: "None",
    lastUpdated: new Date().toISOString(),
    capacity: 6800,
    widthMeters: 3.2,
    depthMeters: 3.4,
    zone: "Guntur East"
  },
  {
    drainId: "DRAIN-016",
    name: "Guntur Collectorate Perimeter Trench",
    location: "District Collector Office Gate 1, Guntur",
    latitude: 16.3150,
    longitude: 80.4280,
    waterLevel: 28,
    flowRate: 29.5,
    status: "normal",
    riskLevel: "low",
    assignedWorker: "None",
    lastUpdated: new Date().toISOString(),
    capacity: 4800,
    widthMeters: 2.2,
    depthMeters: 2.8,
    zone: "Guntur Central"
  },
  {
    drainId: "DRAIN-017",
    name: "Guntur Mirchi Yard Flood Siphon",
    location: "Asia Largest Mirchi Yard Terminal Gate, Guntur",
    latitude: 16.2890,
    longitude: 80.4670,
    waterLevel: 84,
    flowRate: 2.2,
    status: "slow",
    riskLevel: "high",
    assignedWorker: "Y. Rama Rao (WRK-110)",
    lastUpdated: new Date().toISOString(),
    capacity: 8900,
    widthMeters: 4.2,
    depthMeters: 4.0,
    zone: "Guntur Industrial"
  },
  {
    drainId: "DRAIN-018",
    name: "Amaravati Road Outer Arterial Canal",
    location: "Gorantla Junction Amaravati Highway, Guntur",
    latitude: 16.3280,
    longitude: 80.4150,
    waterLevel: 51,
    flowRate: 19.8,
    status: "normal",
    riskLevel: "low",
    assignedWorker: "None",
    lastUpdated: new Date().toISOString(),
    capacity: 9500,
    widthMeters: 4.6,
    depthMeters: 4.2,
    zone: "Guntur North"
  },
  {
    drainId: "DRAIN-019",
    name: "Tenali Road Sump Conduit",
    location: "Narakodur Road Cross, Guntur-Tenali Road",
    latitude: 16.2750,
    longitude: 80.4850,
    waterLevel: 32,
    flowRate: 23.4,
    status: "normal",
    riskLevel: "low",
    assignedWorker: "None",
    lastUpdated: new Date().toISOString(),
    capacity: 5600,
    widthMeters: 2.6,
    depthMeters: 3.0,
    zone: "Guntur South"
  },
  {
    drainId: "DRAIN-020",
    name: "Pattabhipuram Low-Lying Storm Trench",
    location: "Railway Overbridge Base, Pattabhipuram, Guntur",
    latitude: 16.3190,
    longitude: 80.4220,
    waterLevel: 67,
    flowRate: 12.0,
    status: "warning",
    riskLevel: "medium",
    assignedWorker: "Sk. Baji (WRK-108)",
    lastUpdated: new Date().toISOString(),
    capacity: 5200,
    widthMeters: 2.5,
    depthMeters: 3.0,
    zone: "Guntur Central"
  }
];

const sensors = drains.map((drain, index) => {
  const sensorNum = String(index + 1).padStart(3, "0");
  const types = ["Ultrasonic Level Sensor", "Electromagnetic Flow Sensor", "Laser Radar Level Sensor", "Hydrostatic Probe"];
  const isOffline = index === 18; // Make DRAIN-019 sensor offline as demo
  return {
    sensorId: `ESP32-AP-DRAIN-${sensorNum}`,
    drainId: drain.drainId,
    type: types[index % types.length],
    waterLevel: drain.waterLevel,
    flowRate: drain.flowRate,
    rainfall: Math.round(20 + Math.sin(index) * 12),
    temperature: Math.round(30 + (index % 4) * 1.2),
    battery: isOffline ? 11 : Math.round(78 + (index * 7) % 20),
    signalStrength: isOffline ? -99 : Math.round(-64 - (index * 3) % 22),
    status: isOffline ? "offline" : (drain.riskLevel === "critical" ? "critical" : drain.riskLevel === "high" ? "warning" : "online"),
    firmwareVersion: "v2.5.0-esp32-ap",
    lastCommunication: isOffline ? new Date(Date.now() - 4800000).toISOString() : new Date().toISOString()
  };
});

const workers = [
  {
    workerId: "WRK-101",
    name: "K. Venkateswara Rao",
    phone: "+91 98480 22101",
    area: "Vijayawada Central",
    status: "busy",
    currentTask: "Clearing plastic silt choke at Benz Circle NH-16 Ramp",
    alertsAssigned: 2,
    lastActive: "Just now",
    badgeNumber: "VMC-SAN-0101"
  },
  {
    workerId: "WRK-102",
    name: "Ch. Satyanarayana",
    phone: "+91 98480 22102",
    area: "Vijayawada Central",
    status: "available",
    currentTask: "Monitoring Ryves Canal sluice gate level",
    alertsAssigned: 1,
    lastActive: "4 mins ago",
    badgeNumber: "VMC-SAN-0102"
  },
  {
    workerId: "WRK-103",
    name: "M. Subba Rao",
    phone: "+91 98480 22103",
    area: "Vijayawada East",
    status: "available",
    currentTask: "Standby for Gunadala Mary Matha shrine lateral",
    alertsAssigned: 1,
    lastActive: "12 mins ago",
    badgeNumber: "VMC-SAN-0103"
  },
  {
    workerId: "WRK-104",
    name: "S. Lakshmi",
    phone: "+91 98480 22104",
    area: "Vijayawada Central",
    status: "busy",
    currentTask: "Operating high-suction de-silt truck at PNBS Junction",
    alertsAssigned: 2,
    lastActive: "1 min ago",
    badgeNumber: "VMC-SAN-0104"
  },
  {
    workerId: "WRK-105",
    name: "P. Srinivas",
    phone: "+91 98480 22105",
    area: "Vijayawada Old Town",
    status: "busy",
    currentTask: "Removing vegetable waste blockages at KR Market culvert",
    alertsAssigned: 2,
    lastActive: "Just now",
    badgeNumber: "VMC-SAN-0105"
  },
  {
    workerId: "WRK-106",
    name: "B. Nagaraju",
    phone: "+91 98480 22106",
    area: "Mangalagiri Municipality",
    status: "busy",
    currentTask: "Unblocking Panakala Narasimha Swamy Temple Road drain",
    alertsAssigned: 3,
    lastActive: "3 mins ago",
    badgeNumber: "MMC-SAN-0106"
  },
  {
    workerId: "WRK-107",
    name: "G. Appa Rao",
    phone: "+91 98480 22107",
    area: "Tadepalli Zone",
    status: "available",
    currentTask: "Patrolling Kunchanapalli NH-16 subway drainage",
    alertsAssigned: 1,
    lastActive: "7 mins ago",
    badgeNumber: "TMC-SAN-0107"
  },
  {
    workerId: "WRK-108",
    name: "Sk. Baji",
    phone: "+91 98480 22108",
    area: "Guntur Central",
    status: "busy",
    currentTask: "Clearing 4th line commercial drain grate in Brodipet",
    alertsAssigned: 2,
    lastActive: "2 mins ago",
    badgeNumber: "GMC-SAN-0108"
  },
  {
    workerId: "WRK-109",
    name: "D. Prasad",
    phone: "+91 98480 22109",
    area: "Guntur Central",
    status: "available",
    currentTask: "Inspecting Arundalpet railway underpass sump",
    alertsAssigned: 1,
    lastActive: "10 mins ago",
    badgeNumber: "GMC-SAN-0109"
  },
  {
    workerId: "WRK-110",
    name: "Y. Rama Rao",
    phone: "+91 98480 22110",
    area: "Guntur Industrial",
    status: "available",
    currentTask: "Siphon flood gate inspection at Guntur Mirchi Yard",
    alertsAssigned: 1,
    lastActive: "15 mins ago",
    badgeNumber: "GMC-SAN-0110"
  }
];

const alerts = [
  {
    alertId: "ALT-AP-001",
    drainId: "DRAIN-001",
    sensorId: "ESP32-AP-DRAIN-001",
    type: "CRITICAL",
    message: "Severe stormwater canal choke under Benz Circle Flyover ramp! Water at 88%, flow rate throttled to 1.4 L/min.",
    location: "Benz Circle NH-16 Flyover Lower Ramp, Vijayawada",
    riskLevel: "CRITICAL",
    waterLevel: 88,
    flowRate: 1.4,
    status: "In Progress",
    assignedWorker: "K. Venkateswara Rao (WRK-101)",
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    resolvedAt: null
  },
  {
    alertId: "ALT-AP-002",
    drainId: "DRAIN-009",
    sensorId: "ESP32-AP-DRAIN-009",
    type: "CRITICAL",
    message: "Critical blockage detected at Mangalagiri Temple Road. Silt run-off from hillocks trapped in storm grating (94% water level).",
    location: "Panakala Narasimha Swamy Temple Road, Mangalagiri",
    riskLevel: "CRITICAL",
    waterLevel: 94,
    flowRate: 0.2,
    status: "Assigned",
    assignedWorker: "B. Nagaraju (WRK-106)",
    createdAt: new Date(Date.now() - 2400000).toISOString(),
    resolvedAt: null
  },
  {
    alertId: "ALT-AP-003",
    drainId: "DRAIN-013",
    sensorId: "ESP32-AP-DRAIN-013",
    type: "CRITICAL",
    message: "Brodipet 4th line storm conduit blocked. Roadside flooding starting to submerge shop thresholds.",
    location: "Brodipet Main Commercial Road, Guntur",
    riskLevel: "CRITICAL",
    waterLevel: 93,
    flowRate: 0.4,
    status: "In Progress",
    assignedWorker: "Sk. Baji (WRK-108)",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    resolvedAt: null
  },
  {
    alertId: "ALT-AP-004",
    drainId: "DRAIN-005",
    sensorId: "ESP32-AP-DRAIN-005",
    type: "CRITICAL",
    message: "PNBS passenger entry subway experiencing high backwater surge (91% level). Immediate de-silting ordered.",
    location: "Pandit Nehru Bus Station North Sump, Vijayawada",
    riskLevel: "CRITICAL",
    waterLevel: 91,
    flowRate: 0.6,
    status: "Assigned",
    assignedWorker: "S. Lakshmi (WRK-104)",
    createdAt: new Date(Date.now() - 4800000).toISOString(),
    resolvedAt: null
  },
  {
    alertId: "ALT-AP-005",
    drainId: "DRAIN-017",
    sensorId: "ESP32-AP-DRAIN-017",
    type: "HIGH",
    message: "Guntur Mirchi Yard flood siphon capacity reduced 70%. High intake expected during cloudburst.",
    location: "Asia Largest Mirchi Yard Terminal Gate, Guntur",
    riskLevel: "HIGH",
    waterLevel: 84,
    flowRate: 2.2,
    status: "Acknowledged",
    assignedWorker: "Y. Rama Rao (WRK-110)",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    resolvedAt: null
  }
];

const roadFlooding = [
  {
    roadId: "ROAD-AP-001",
    drainId: "DRAIN-001",
    name: "Benz Circle NH-16 Service Corridor",
    city: "Vijayawada",
    waterDepthCm: 22,
    trafficCondition: "Jammed",
    trafficSpeedKmH: 6,
    transitImpact: "APSRTC City Bus Routes 5, 5G, 222 diverted via Pinnamaneni Polyclinic Road. Heavy auto crawl.",
    rainfallIntensity: "Heavy Rain (45 mm/h)",
    drainCondition: "Blocked (DRAIN-001)",
    floodRisk: "CRITICAL",
    status: "Submerged Ramp",
    vehicles: [
      { id: "V01", type: "bus", label: "APSRTC 5G (City Liner)", speed: 5 },
      { id: "V02", type: "car", label: "Sedan Cab", speed: 8 },
      { id: "V03", type: "auto", label: "CNG Passenger Auto", speed: 6 }
    ],
    coordinates: [
      [16.5020, 80.6460],
      [16.5002, 80.6480],
      [16.4985, 80.6500]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-002",
    drainId: "DRAIN-002",
    name: "Governorpet Canal Sluice Road & MG Road Link",
    city: "Vijayawada",
    waterDepthCm: 7,
    trafficCondition: "Normal",
    trafficSpeedKmH: 34,
    transitImpact: "Bus routes 3, 10 operating on schedule. Slight spray on curb lanes.",
    rainfallIntensity: "Moderate Rain (18 mm/h)",
    drainCondition: "Normal (DRAIN-002)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V04", type: "bus", label: "Metro Express 10M", speed: 32 },
      { id: "V05", type: "car", label: "Private Hatchback", speed: 36 }
    ],
    coordinates: [
      [16.5140, 80.6260],
      [16.5120, 80.6280],
      [16.5100, 80.6300]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-003",
    drainId: "DRAIN-003",
    name: "Bandar Canal River Intake Highway Road",
    city: "Vijayawada",
    waterDepthCm: 5,
    trafficCondition: "Normal",
    trafficSpeedKmH: 42,
    transitImpact: "Machilipatnam Intercity Express buses moving normally.",
    rainfallIntensity: "Moderate Rain (15 mm/h)",
    drainCondition: "Normal (DRAIN-003)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V06", type: "bus", label: "Super Luxury RTC", speed: 45 },
      { id: "V07", type: "truck", label: "Vegetable Delivery Truck", speed: 38 }
    ],
    coordinates: [
      [16.5100, 80.6130],
      [16.5080, 80.6150],
      [16.5060, 80.6170]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-004",
    drainId: "DRAIN-004",
    name: "Gunadala Mary Matha Shrine Main Arterial Road",
    city: "Vijayawada",
    waterDepthCm: 14,
    trafficCondition: "Slow",
    trafficSpeedKmH: 16,
    transitImpact: "Pilgrim shuttles and local vans proceeding at low gear; water splashing on shoulders.",
    rainfallIntensity: "Heavy Rain (38 mm/h)",
    drainCondition: "Slow (DRAIN-004)",
    floodRisk: "HIGH",
    status: "Curb Overflow",
    vehicles: [
      { id: "V08", type: "bus", label: "Pilgrim Special Van", speed: 14 },
      { id: "V09", type: "auto", label: "Passenger Auto", speed: 12 }
    ],
    coordinates: [
      [16.5260, 80.6630],
      [16.5240, 80.6650],
      [16.5220, 80.6670]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-005",
    drainId: "DRAIN-005",
    name: "PNBS Central Bus Station Subway Entry Approach",
    city: "Vijayawada",
    waterDepthCm: 25,
    trafficCondition: "Jammed",
    trafficSpeedKmH: 5,
    transitImpact: "Pandit Nehru Bus Station Platform 1-6 arrivals rerouted through South Gate. Heavy waterlogging.",
    rainfallIntensity: "Heavy Rain (52 mm/h)",
    drainCondition: "Blocked (DRAIN-005)",
    floodRisk: "CRITICAL",
    status: "Subway Inundation",
    vehicles: [
      { id: "V10", type: "bus", label: "Garuda Plus Volvo (APSRTC)", speed: 4 },
      { id: "V11", type: "bus", label: "Palle Velugu 142", speed: 5 },
      { id: "V12", type: "car", label: "Station Taxi", speed: 6 }
    ],
    coordinates: [
      [16.5190, 80.6170],
      [16.5170, 80.6190],
      [16.5150, 80.6210]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-006",
    drainId: "DRAIN-006",
    name: "KR Market Vegetable Yard Culvert Road (One Town)",
    city: "Vijayawada",
    waterDepthCm: 20,
    trafficCondition: "Jammed",
    trafficSpeedKmH: 7,
    transitImpact: "Mini-freight tempo trucks stalled; vegetable porters using pedestrian flyover.",
    rainfallIntensity: "Heavy Rain (46 mm/h)",
    drainCondition: "Blocked (DRAIN-006)",
    floodRisk: "CRITICAL",
    status: "Market Waterlogging",
    vehicles: [
      { id: "V13", type: "truck", label: "Tata Ace Agri Tempo", speed: 6 },
      { id: "V14", type: "auto", label: "Goods Auto-Rickshaw", speed: 7 }
    ],
    coordinates: [
      [16.5210, 80.6070],
      [16.5190, 80.6090],
      [16.5170, 80.6110]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-007",
    drainId: "DRAIN-007",
    name: "Prakasam Barrage Spillway Crest Highway",
    city: "Vijayawada",
    waterDepthCm: 3,
    trafficCondition: "Clear",
    trafficSpeedKmH: 45,
    transitImpact: "Scenic Krishna River connection clear; winds gusting up to 34 km/h.",
    rainfallIntensity: "Moderate Rain (20 mm/h)",
    drainCondition: "Normal (DRAIN-007)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V15", type: "bus", label: "Vijayawada-Guntur Non-Stop", speed: 48 },
      { id: "V16", type: "car", label: "Private SUV", speed: 44 }
    ],
    coordinates: [
      [16.5070, 80.6020],
      [16.5050, 80.6040],
      [16.5030, 80.6060]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-008",
    drainId: "DRAIN-008",
    name: "Gollapudi Bypass Freight Highway (NH-65)",
    city: "Vijayawada",
    waterDepthCm: 8,
    trafficCondition: "Normal",
    trafficSpeedKmH: 38,
    transitImpact: "Interstate goods container carriers operating normally with wet road advisories.",
    rainfallIntensity: "Moderate Rain (22 mm/h)",
    drainCondition: "Normal (DRAIN-008)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V17", type: "truck", label: "BharatBenz Multi-Axle", speed: 36 },
      { id: "V18", type: "car", label: "Sedan", speed: 42 }
    ],
    coordinates: [
      [16.5300, 80.5880],
      [16.5280, 80.5900],
      [16.5260, 80.5920]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-009",
    drainId: "DRAIN-009",
    name: "Mangalagiri Temple Hill Approach Road",
    city: "Mangalagiri",
    waterDepthCm: 18,
    trafficCondition: "Slow",
    trafficSpeedKmH: 10,
    transitImpact: "Narasimha Swamy Temple pilgrim buses halted at base foot-overbridge; share autos crawling.",
    rainfallIntensity: "Heavy Rain (40 mm/h)",
    drainCondition: "Blocked (DRAIN-009)",
    floodRisk: "CRITICAL",
    status: "Hillock Runoff Inundation",
    vehicles: [
      { id: "V19", type: "bus", label: "Temple Devasthanam Minibus", speed: 9 },
      { id: "V20", type: "auto", label: "7-Seater Electric Auto", speed: 10 }
    ],
    coordinates: [
      [16.4360, 80.5650],
      [16.4344, 80.5670],
      [16.4325, 80.5690]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-010",
    drainId: "DRAIN-010",
    name: "Mangalagiri AIIMS Expressway & IT Park Corridor",
    city: "Mangalagiri",
    waterDepthCm: 4,
    trafficCondition: "Clear",
    trafficSpeedKmH: 50,
    transitImpact: "Emergency hospital ambulances prioritized; AIIMS medical transport operating with full clearance.",
    rainfallIntensity: "Light Rain (8 mm/h)",
    drainCondition: "Normal (DRAIN-010)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V21", type: "car", label: "108 Emergency Ambulance", speed: 55 },
      { id: "V22", type: "bus", label: "Tech Park Employee Shuttle", speed: 46 }
    ],
    coordinates: [
      [16.4540, 80.5730],
      [16.4520, 80.5750],
      [16.4500, 80.5770]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-011",
    drainId: "DRAIN-011",
    name: "Tadepalli Bypass Subway under NH-16",
    city: "Tadepalli",
    waterDepthCm: 14,
    trafficCondition: "Slow",
    trafficSpeedKmH: 14,
    transitImpact: "Vijayawada-Guntur commuter route: heavy two-wheeler traffic diverted to flyover top deck.",
    rainfallIntensity: "Moderate Rain (28 mm/h)",
    drainCondition: "Slow (DRAIN-011)",
    floodRisk: "HIGH",
    status: "Subway Waterlogging",
    vehicles: [
      { id: "V23", type: "bus", label: "Amaravati Rapid Bus", speed: 15 },
      { id: "V24", type: "auto", label: "Commuter Auto", speed: 12 }
    ],
    coordinates: [
      [16.4840, 80.6030],
      [16.4820, 80.6050],
      [16.4800, 80.6070]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-012",
    drainId: "DRAIN-012",
    name: "Kunchanapalli Highway Box Culvert Road",
    city: "Tadepalli",
    waterDepthCm: 9,
    trafficCondition: "Normal",
    trafficSpeedKmH: 32,
    transitImpact: "Local village transit vans operating normally with minor curb pooling.",
    rainfallIntensity: "Moderate Rain (19 mm/h)",
    drainCondition: "Normal (DRAIN-012)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V25", type: "car", label: "Private Sedan", speed: 35 },
      { id: "V26", type: "truck", label: "Milk Supply Tanker", speed: 30 }
    ],
    coordinates: [
      [16.4700, 80.5900],
      [16.4680, 80.5920],
      [16.4660, 80.5940]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-013",
    drainId: "DRAIN-013",
    name: "Brodipet Main Commercial Road (Guntur 4th Line)",
    city: "Guntur",
    waterDepthCm: 19,
    trafficCondition: "Slow",
    trafficSpeedKmH: 11,
    transitImpact: "City Bus 7 and local shared autos crawling; commercial shop thresholds sandbagged.",
    rainfallIntensity: "Moderate Rain (32 mm/h)",
    drainCondition: "Blocked (DRAIN-013)",
    floodRisk: "HIGH",
    status: "Commercial Street Ponding",
    vehicles: [
      { id: "V27", type: "bus", label: "GMC City Circular 7", speed: 10 },
      { id: "V28", type: "auto", label: "Commercial Auto", speed: 12 }
    ],
    coordinates: [
      [16.3130, 80.4320],
      [16.3110, 80.4340],
      [16.3090, 80.4360]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-014",
    drainId: "DRAIN-014",
    name: "Arundelpet Main Collector Avenue (Guntur)",
    city: "Guntur",
    waterDepthCm: 8,
    trafficCondition: "Normal",
    trafficSpeedKmH: 28,
    transitImpact: "APSRTC city circulars running smoothly with 5-minute rain delay.",
    rainfallIntensity: "Moderate Rain (18 mm/h)",
    drainCondition: "Normal (DRAIN-014)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V29", type: "bus", label: "City Metro Bus 12", speed: 26 },
      { id: "V30", type: "car", label: "Ride-share Cab", speed: 30 }
    ],
    coordinates: [
      [16.3070, 80.4400],
      [16.3050, 80.4420],
      [16.3030, 80.4440]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-015",
    drainId: "DRAIN-015",
    name: "Guntur Market Yard Outfall Road",
    city: "Guntur",
    waterDepthCm: 11,
    trafficCondition: "Slow",
    trafficSpeedKmH: 18,
    transitImpact: "Spice market freight tractors moving cautiously around drain inlets.",
    rainfallIntensity: "Moderate Rain (25 mm/h)",
    drainCondition: "Slow (DRAIN-015)",
    floodRisk: "MEDIUM",
    status: "Moderate Flow",
    vehicles: [
      { id: "V31", type: "truck", label: "Chilli Freight Lorry", speed: 16 },
      { id: "V32", type: "auto", label: "Cargo Tricycle Auto", speed: 14 }
    ],
    coordinates: [
      [16.3000, 80.4530],
      [16.2980, 80.4550],
      [16.2960, 80.4570]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-016",
    drainId: "DRAIN-016",
    name: "Guntur Collectorate Ring Road",
    city: "Guntur",
    waterDepthCm: 6,
    trafficCondition: "Normal",
    trafficSpeedKmH: 35,
    transitImpact: "Administrative zone traffic flowing with full transit signal priority.",
    rainfallIntensity: "Light Rain (12 mm/h)",
    drainCondition: "Normal (DRAIN-016)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V33", type: "car", label: "Government Staff Car", speed: 36 },
      { id: "V34", type: "bus", label: "Secretariat Shuttle", speed: 32 }
    ],
    coordinates: [
      [16.3170, 80.4260],
      [16.3150, 80.4280],
      [16.3130, 80.4300]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-017",
    drainId: "DRAIN-017",
    name: "Asia Largest Mirchi Yard Terminal Highway Link",
    city: "Guntur",
    waterDepthCm: 21,
    trafficCondition: "Jammed",
    trafficSpeedKmH: 8,
    transitImpact: "Heavy agricultural lorries queued; cargo dispatch delayed by 45 minutes.",
    rainfallIntensity: "Heavy Rain (48 mm/h)",
    drainCondition: "Blocked (DRAIN-017)",
    floodRisk: "CRITICAL",
    status: "Yard Gate Ponding",
    vehicles: [
      { id: "V35", type: "truck", label: "Export Container Carrier", speed: 7 },
      { id: "V36", type: "truck", label: "Tractor Trailer", speed: 8 }
    ],
    coordinates: [
      [16.2910, 80.4650],
      [16.2890, 80.4670],
      [16.2870, 80.4690]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-018",
    drainId: "DRAIN-018",
    name: "Amaravati Road Outer Arterial Boulevard",
    city: "Guntur",
    waterDepthCm: 5,
    trafficCondition: "Clear",
    trafficSpeedKmH: 48,
    transitImpact: "High-speed multi-lane transit corridor running with green telemetry waves.",
    rainfallIntensity: "Light Rain (10 mm/h)",
    drainCondition: "Normal (DRAIN-018)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V37", type: "bus", label: "Amaravati Metro Bus", speed: 50 },
      { id: "V38", type: "car", label: "Electric Cab", speed: 46 }
    ],
    coordinates: [
      [16.3300, 80.4130],
      [16.3280, 80.4150],
      [16.3260, 80.4170]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-019",
    drainId: "DRAIN-019",
    name: "Tenali Road Sump & Highway Link",
    city: "Guntur",
    waterDepthCm: 7,
    trafficCondition: "Normal",
    trafficSpeedKmH: 36,
    transitImpact: "Guntur-Tenali regional express buses on time.",
    rainfallIntensity: "Moderate Rain (16 mm/h)",
    drainCondition: "Normal (DRAIN-019)",
    floodRisk: "LOW",
    status: "Clear & Flowing",
    vehicles: [
      { id: "V39", type: "bus", label: "Tenali Express RTC", speed: 38 },
      { id: "V40", type: "car", label: "Private Car", speed: 35 }
    ],
    coordinates: [
      [16.2770, 80.4830],
      [16.2750, 80.4850],
      [16.2730, 80.4870]
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    roadId: "ROAD-AP-020",
    drainId: "DRAIN-020",
    name: "Pattabhipuram Commercial Link Corridor",
    city: "Guntur",
    waterDepthCm: 16,
    trafficCondition: "Slow",
    trafficSpeedKmH: 15,
    transitImpact: "Local auto stands operating from elevated curb stops; puddle splashing.",
    rainfallIntensity: "Moderate Rain (29 mm/h)",
    drainCondition: "Slow (DRAIN-020)",
    floodRisk: "MEDIUM",
    status: "Street Flow",
    vehicles: [
      { id: "V41", type: "auto", label: "Shared Passenger Auto", speed: 14 },
      { id: "V42", type: "car", label: "Delivery Van", speed: 16 }
    ],
    coordinates: [
      [16.3210, 80.4200],
      [16.3190, 80.4220],
      [16.3170, 80.4240]
    ],
    lastUpdated: new Date().toISOString()
  }
];

const rainfall = {
  currentMm: 34.5,
  intensity: "Heavy Rain",
  intensityCategory: "heavy",
  last1HourMm: 22.0,
  last6HoursMm: 62.5,
  last24HoursMm: 104.0,
  forecast: "Monsoonal squall cell over Krishna-Guntur delta continuing for 80 minutes",
  history: [
    { time: "00:00", mm: 1.5, intensity: "Light" },
    { time: "04:00", mm: 3.2, intensity: "Light" },
    { time: "08:00", mm: 12.0, intensity: "Moderate" },
    { time: "12:00", mm: 28.5, intensity: "Moderate" },
    { time: "16:00", mm: 48.0, intensity: "Heavy" },
    { time: "20:00", mm: 38.0, intensity: "Heavy" },
    { time: "Now", mm: 34.5, intensity: "Heavy" }
  ],
  stations: [
    { name: "Vijayawada Doppler AWS (Prakasam Barrage)", mm: 36.2, status: "Active" },
    { name: "Guntur Collectorate AWS", mm: 32.0, status: "Active" },
    { name: "Mangalagiri AIIMS Radar", mm: 38.5, status: "Active" },
    { name: "Tadepalli Krishna Basin Post", mm: 34.0, status: "Active" },
    { name: "Gannavaram Airport AWS", mm: 29.5, status: "Active" }
  ]
};

// Canal lines for Vijayawada, Guntur, and Mangalagiri
const canals = [
  {
    canalId: "CANAL-VJA-1",
    name: "Ryves Canal Main Trunk (Vijayawada)",
    coordinates: [
      [16.5050, 80.6040], // Prakasam Barrage
      [16.5080, 80.6150],
      [16.5120, 80.6280],
      [16.5170, 80.6400],
      [16.5240, 80.6650]
    ],
    flowDirection: "Eastwards from Krishna Barrage towards Gunadala",
    status: "Steady Flow"
  },
  {
    canalId: "CANAL-VJA-2",
    name: "Bandar Canal Arterial (Vijayawada-Machilipatnam)",
    coordinates: [
      [16.5050, 80.6040],
      [16.5002, 80.6250],
      [16.4950, 80.6420],
      [16.4900, 80.6600]
    ],
    flowDirection: "South-Eastwards along NH-65",
    status: "Normal Discharge"
  },
  {
    canalId: "CANAL-MGL-3",
    name: "Mangalagiri-Tadepalli Drainage Linker",
    coordinates: [
      [16.4344, 80.5670],
      [16.4520, 80.5750],
      [16.4680, 80.5920],
      [16.4820, 80.6050]
    ],
    flowDirection: "Northwards from Mangalagiri into Krishna River Basin",
    status: "Choked at Temple Road Intake"
  },
  {
    canalId: "CANAL-GNT-4",
    name: "Guntur Brodipet-Arundalpet Collector Trunk",
    coordinates: [
      [16.3280, 80.4150],
      [16.3150, 80.4280],
      [16.3110, 80.4340],
      [16.3050, 80.4420],
      [16.2980, 80.4550],
      [16.2890, 80.4670]
    ],
    flowDirection: "South-Eastwards towards Mirchi Yard outfall",
    status: "Severe Blockage at Brodipet 4th line"
  }
];

module.exports = {
  drains,
  sensors,
  workers,
  alerts,
  roadFlooding,
  rainfall,
  canals
};
