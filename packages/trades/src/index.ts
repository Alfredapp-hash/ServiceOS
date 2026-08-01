export const tradeIds = [
  "hvac",
  "plumbing",
  "electrical",
  "roofing",
  "garage-door",
  "water-treatment",
  "energy-systems"
] as const;

export type TradeId = (typeof tradeIds)[number];

export type TradeDefinition = {
  id: TradeId;
  name: string;
  description: string;
  assets: string[];
  workflows: string[];
  records: string[];
};

export const trades: Record<TradeId, TradeDefinition> = {
  hvac: {
    id: "hvac",
    name: "HVAC",
    description: "Heating, cooling, ventilation, indoor air quality, maintenance, repair, and replacement.",
    assets: ["Air conditioner", "Furnace", "Heat pump", "Air handler", "Boiler", "Mini-split", "Thermostat"],
    workflows: ["Tune-up", "No cooling", "No heat", "Leak diagnosis", "Replacement", "Commissioning"],
    records: ["Refrigerant", "Tonnage", "SEER", "AFUE", "Filter size", "Temperature split", "Static pressure"]
  },
  plumbing: {
    id: "plumbing",
    name: "Plumbing",
    description: "Emergency service, drains, water systems, fixtures, piping, and installation.",
    assets: ["Water heater", "Tankless unit", "Fixture", "Sewer line", "Sump pump", "Pressure regulator"],
    workflows: ["Leak diagnosis", "Drain clearing", "Camera inspection", "Replacement", "Repiping"],
    records: ["Pipe material", "Water pressure", "Flow rate", "Shutoff location", "Sewer access"]
  },
  electrical: {
    id: "electrical",
    name: "Electrical",
    description: "Panels, circuits, generators, EV charging, lighting, inspections, and service upgrades.",
    assets: ["Main panel", "Subpanel", "Circuit", "Generator", "Transfer switch", "EV charger"],
    workflows: ["Safety inspection", "Panel replacement", "Circuit repair", "Load calculation", "Commissioning"],
    records: ["Service amperage", "Voltage", "Panel schedule", "Wire gauge", "AFCI", "GFCI"]
  },
  roofing: {
    id: "roofing",
    name: "Roofing",
    description: "Inspection, measurement, insurance, proposals, production, installation, and warranty.",
    assets: ["Roof system", "Skylight", "Gutter", "Flashing", "Ventilation", "Solar mounting area"],
    workflows: ["Inspection", "Measurement", "Insurance claim", "Supplement", "Material order", "Installation"],
    records: ["Squares", "Pitch", "Waste factor", "Material", "Underlayment", "Warranty", "Permit"]
  },
  "garage-door": {
    id: "garage-door",
    name: "Garage Door",
    description: "Residential and commercial door repair, opener service, replacement, and inspection.",
    assets: ["Garage door", "Opener", "Spring", "Track", "Roller", "Safety sensor", "Keypad"],
    workflows: ["Emergency repair", "Spring replacement", "Opener diagnosis", "Door replacement", "Commercial inspection"],
    records: ["Door dimensions", "Door type", "Spring cycle rating", "Opener serial", "Remote records", "Warranty"]
  },
  "water-treatment": {
    id: "water-treatment",
    name: "Water Treatment",
    description: "Testing, softeners, filtration, reverse osmosis, consumables, delivery, and maintenance.",
    assets: ["Softener", "Reverse-osmosis system", "Whole-home filter", "UV system", "Storage tank"],
    workflows: ["Water test", "Installation", "Filter change", "Salt delivery", "Repair", "Maintenance"],
    records: ["Hardness", "pH", "Iron", "TDS", "Chlorine", "Filter interval", "Resin age", "Salt usage"]
  },
  "energy-systems": {
    id: "energy-systems",
    name: "Energy Systems",
    description: "Solar, battery, generator, monitoring, interconnection, maintenance, and warranty service.",
    assets: ["Solar panel", "Inverter", "Optimizer", "Battery", "Generator", "Transfer switch"],
    workflows: ["Site assessment", "Installation", "Commissioning", "Maintenance", "Warranty service", "Monitoring review"],
    records: ["Production history", "Interconnection", "Monitoring credentials", "Warranty", "Permit", "Inspection status"]
  }
};
