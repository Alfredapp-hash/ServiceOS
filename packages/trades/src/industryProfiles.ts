export type TradeKey =
  | "hvac"
  | "plumbing"
  | "electrical"
  | "roofing"
  | "garage-door"
  | "water-treatment"
  | "energy-systems";

export type FieldType = "text" | "number" | "select" | "boolean" | "date" | "photo" | "signature";

export interface ConfigField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  unit?: string;
  options?: string[];
}

export interface QuoteFormula {
  key: string;
  label: string;
  description: string;
  fields: ConfigField[];
  calculatedInputs: string[];
}

export interface IndustryProfile {
  key: TradeKey;
  label: string;
  singularAssetLabel: string;
  pluralAssetLabel: string;
  primaryJobLabel: string;
  accent: string;
  intakeFields: ConfigField[];
  assetFields: ConfigField[];
  inspectionSections: Array<{ title: string; fields: ConfigField[] }>;
  quoteFormulas: QuoteFormula[];
  complianceChecks: string[];
  defaultMemberships: string[];
  dashboardKpis: string[];
  automations: string[];
  recommendedTemplateModules: string[];
}

const commonIntake: ConfigField[] = [
  { key: "customerConcern", label: "Customer concern", type: "text", required: true },
  { key: "urgency", label: "Urgency", type: "select", options: ["Routine", "Same day", "Emergency"], required: true },
  { key: "propertyAccess", label: "Property access instructions", type: "text" },
  { key: "petsPresent", label: "Pets present", type: "boolean" },
  { key: "preferredArrivalWindow", label: "Preferred arrival window", type: "select", options: ["Morning", "Afternoon", "Evening", "Any"] }
];

export const industryProfiles: Record<TradeKey, IndustryProfile> = {
  hvac: {
    key: "hvac",
    label: "HVAC",
    singularAssetLabel: "HVAC system",
    pluralAssetLabel: "HVAC systems",
    primaryJobLabel: "Service call",
    accent: "#2563eb",
    intakeFields: [...commonIntake, { key: "coolingOrHeating", label: "Primary issue", type: "select", options: ["No cooling", "No heat", "Poor airflow", "Noise", "Maintenance", "Replacement"] }],
    assetFields: [
      { key: "equipmentType", label: "Equipment type", type: "select", options: ["Air conditioner", "Furnace", "Heat pump", "Air handler", "Mini-split", "Boiler", "Rooftop unit"], required: true },
      { key: "manufacturer", label: "Manufacturer", type: "text" },
      { key: "model", label: "Model", type: "text" },
      { key: "serial", label: "Serial number", type: "text" },
      { key: "installDate", label: "Installation date", type: "date" },
      { key: "refrigerant", label: "Refrigerant type", type: "select", options: ["R-410A", "R-32", "R-22", "Other"] },
      { key: "tonnage", label: "Tonnage", type: "number", unit: "tons" },
      { key: "seer", label: "SEER / SEER2", type: "number" },
      { key: "filterSize", label: "Filter size", type: "text" }
    ],
    inspectionSections: [
      { title: "Electrical", fields: [{ key: "voltage", label: "Voltage", type: "number", unit: "V" }, { key: "capacitor", label: "Capacitor reading", type: "number", unit: "µF" }] },
      { title: "Airflow", fields: [{ key: "temperatureSplit", label: "Temperature split", type: "number", unit: "°F" }, { key: "staticPressure", label: "Static pressure", type: "number", unit: "in. WC" }] },
      { title: "Condition", fields: [{ key: "coilCondition", label: "Coil condition", type: "select", options: ["Good", "Dirty", "Damaged"] }, { key: "leakDetected", label: "Refrigerant leak detected", type: "boolean" }] }
    ],
    quoteFormulas: [{ key: "hvac-repair", label: "HVAC repair or replacement", description: "Build repair, restore, and replacement options using labor, materials, equipment, efficiency, warranty, and financing.", fields: [{ key: "laborHours", label: "Labor hours", type: "number" }, { key: "equipmentCost", label: "Equipment cost", type: "number" }, { key: "materialsCost", label: "Materials cost", type: "number" }, { key: "permitCost", label: "Permit cost", type: "number" }], calculatedInputs: ["targetGrossMargin", "membershipDiscount", "warrantyReserve"] }],
    complianceChecks: ["EPA certification", "Refrigerant log", "Permit status", "Commissioning checklist", "Warranty registration"],
    defaultMemberships: ["Seasonal tune-up plan", "Priority comfort plan", "Whole-home HVAC plan"],
    dashboardKpis: ["Calls by system type", "First-visit resolution", "Replacement close rate", "Maintenance conversion", "Refrigerant usage"],
    automations: ["Seasonal tune-up reminders", "Filter replacement reminders", "Warranty expiration campaign", "Replacement opportunity alert"],
    recommendedTemplateModules: ["Auth", "Audit Log", "Integrations", "Leads", "Email", "Tracking", "Monitoring", "Reviews"]
  },
  plumbing: {
    key: "plumbing", label: "Plumbing", singularAssetLabel: "Plumbing system", pluralAssetLabel: "Plumbing systems", primaryJobLabel: "Plumbing call", accent: "#0891b2",
    intakeFields: [...commonIntake, { key: "waterShutoff", label: "Water shut off?", type: "boolean" }, { key: "activeLeak", label: "Active leak?", type: "boolean" }],
    assetFields: [{ key: "assetType", label: "Asset type", type: "select", options: ["Water heater", "Tankless water heater", "Sewer line", "Drain line", "Sump pump", "Water softener", "Backflow preventer"], required: true }, { key: "manufacturer", label: "Manufacturer", type: "text" }, { key: "model", label: "Model", type: "text" }, { key: "serial", label: "Serial number", type: "text" }, { key: "pipeMaterial", label: "Pipe material", type: "select", options: ["Copper", "PEX", "PVC", "CPVC", "Cast iron", "Galvanized", "Other"] }],
    inspectionSections: [{ title: "Water system", fields: [{ key: "waterPressure", label: "Water pressure", type: "number", unit: "PSI" }, { key: "flowRate", label: "Flow rate", type: "number", unit: "GPM" }, { key: "leakLocation", label: "Leak location", type: "text" }] }, { title: "Drain and sewer", fields: [{ key: "cameraCompleted", label: "Camera inspection completed", type: "boolean" }, { key: "lineCondition", label: "Line condition", type: "select", options: ["Clear", "Restricted", "Root intrusion", "Collapsed", "Corroded"] }] }],
    quoteFormulas: [{ key: "plumbing-project", label: "Plumbing repair or project", description: "Price labor, fittings, pipe, fixtures, access difficulty, restoration, permits, and emergency fees.", fields: [{ key: "laborHours", label: "Labor hours", type: "number" }, { key: "materialsCost", label: "Materials cost", type: "number" }, { key: "accessDifficulty", label: "Access difficulty", type: "select", options: ["Standard", "Moderate", "Difficult"] }, { key: "restorationCost", label: "Restoration allowance", type: "number" }], calculatedInputs: ["targetGrossMargin", "emergencyMultiplier", "warrantyReserve"] }],
    complianceChecks: ["Permit status", "Backflow certification", "Pressure test", "Water-heater code checklist", "Inspection status"],
    defaultMemberships: ["Plumbing protection plan", "Drain care plan", "Whole-home plumbing plan"],
    dashboardKpis: ["Emergency response time", "Leak resolution rate", "Drain callback rate", "Water-heater replacement close rate", "Membership conversion"],
    automations: ["Water-heater age alert", "Annual plumbing inspection reminder", "Backflow renewal reminder", "Drain maintenance reminder"],
    recommendedTemplateModules: ["Auth", "Audit Log", "Integrations", "Leads", "Email", "Tracking", "Monitoring", "Reviews"]
  },
  electrical: {
    key: "electrical", label: "Electrical", singularAssetLabel: "Electrical system", pluralAssetLabel: "Electrical systems", primaryJobLabel: "Electrical call", accent: "#f59e0b",
    intakeFields: [...commonIntake, { key: "powerOut", label: "Power currently out?", type: "boolean" }, { key: "burningSmell", label: "Burning smell or heat?", type: "boolean" }],
    assetFields: [{ key: "assetType", label: "Asset type", type: "select", options: ["Main panel", "Subpanel", "Generator", "Transfer switch", "EV charger", "Solar interconnection", "Battery system"], required: true }, { key: "manufacturer", label: "Manufacturer", type: "text" }, { key: "serviceAmperage", label: "Service amperage", type: "number", unit: "A" }, { key: "voltage", label: "Voltage", type: "number", unit: "V" }, { key: "panelSchedule", label: "Panel schedule photo", type: "photo" }],
    inspectionSections: [{ title: "Safety", fields: [{ key: "grounding", label: "Grounding condition", type: "select", options: ["Pass", "Needs correction", "Unsafe"] }, { key: "afci", label: "AFCI protection", type: "select", options: ["Complete", "Partial", "None"] }, { key: "gfci", label: "GFCI protection", type: "select", options: ["Complete", "Partial", "None"] }] }, { title: "Load", fields: [{ key: "calculatedLoad", label: "Calculated load", type: "number", unit: "A" }, { key: "availableCapacity", label: "Available capacity", type: "number", unit: "A" }] }],
    quoteFormulas: [{ key: "electrical-project", label: "Electrical project", description: "Price equipment, wire, devices, labor, permits, inspections, load calculations, and commissioning.", fields: [{ key: "laborHours", label: "Labor hours", type: "number" }, { key: "materialsCost", label: "Materials cost", type: "number" }, { key: "permitCost", label: "Permit cost", type: "number" }, { key: "inspectionCost", label: "Inspection cost", type: "number" }], calculatedInputs: ["targetGrossMargin", "complexityMultiplier", "warrantyReserve"] }],
    complianceChecks: ["License verification", "Permit status", "Load calculation", "Panel schedule", "Inspection approval", "Commissioning checklist"],
    defaultMemberships: ["Electrical safety plan", "Generator maintenance plan", "Whole-home protection plan"],
    dashboardKpis: ["Safety inspections completed", "Panel replacement close rate", "Permit cycle time", "Generator maintenance completion", "Callback rate"],
    automations: ["Annual safety inspection reminder", "Generator exercise alert", "Permit follow-up", "Certification expiration alert"],
    recommendedTemplateModules: ["Auth", "Audit Log", "Integrations", "Leads", "Email", "Tracking", "Monitoring", "Reviews"]
  },
  roofing: {
    key: "roofing", label: "Roofing", singularAssetLabel: "Roof system", pluralAssetLabel: "Roof systems", primaryJobLabel: "Roofing project", accent: "#7c3aed",
    intakeFields: [...commonIntake, { key: "activeLeak", label: "Active leak?", type: "boolean" }, { key: "insuranceClaim", label: "Insurance claim involved?", type: "boolean" }, { key: "stormDate", label: "Storm or loss date", type: "date" }],
    assetFields: [{ key: "roofType", label: "Roof type", type: "select", options: ["Asphalt shingle", "Tile", "Metal", "Flat / membrane", "Wood shake", "Slate"], required: true }, { key: "roofArea", label: "Measured roof area", type: "number", unit: "sq ft" }, { key: "pitch", label: "Pitch", type: "text" }, { key: "layers", label: "Existing layers", type: "number" }, { key: "installDate", label: "Approximate installation date", type: "date" }, { key: "warranty", label: "Warranty", type: "text" }],
    inspectionSections: [{ title: "Exterior", fields: [{ key: "shingleCondition", label: "Surface condition", type: "select", options: ["Good", "Aged", "Damaged", "Failed"] }, { key: "flashingCondition", label: "Flashing condition", type: "select", options: ["Good", "Repair needed", "Replace"] }, { key: "ventilation", label: "Ventilation condition", type: "select", options: ["Adequate", "Marginal", "Inadequate"] }] }, { title: "Documentation", fields: [{ key: "dronePhotos", label: "Drone or roof photos", type: "photo", required: true }, { key: "measurementReport", label: "Measurement report attached", type: "boolean" }, { key: "damageMap", label: "Damage map completed", type: "boolean" }] }],
    quoteFormulas: [{ key: "roof-replacement", label: "Roof replacement", description: "Calculate squares, pitch, waste, layers, tear-off, underlayment, flashing, ventilation, labor, permits, disposal, warranty, and financing.", fields: [{ key: "squares", label: "Roof squares", type: "number" }, { key: "pitchMultiplier", label: "Pitch multiplier", type: "number" }, { key: "wastePercent", label: "Waste", type: "number", unit: "%" }, { key: "layers", label: "Tear-off layers", type: "number" }, { key: "materialCostPerSquare", label: "Material cost per square", type: "number" }, { key: "laborCostPerSquare", label: "Labor cost per square", type: "number" }, { key: "dumpsterCost", label: "Disposal cost", type: "number" }, { key: "permitCost", label: "Permit cost", type: "number" }], calculatedInputs: ["adjustedSquares", "targetGrossMargin", "insuranceDeductible", "warrantyReserve"] }],
    complianceChecks: ["Permit status", "Insurance documents", "Supplement status", "Final inspection", "Manufacturer installation checklist", "Warranty registration"],
    defaultMemberships: ["Annual roof inspection", "Commercial roof maintenance", "Storm response priority plan"],
    dashboardKpis: ["Lead-to-inspection rate", "Inspection-to-contract rate", "Average project margin", "Supplement recovery", "Production cycle time", "Crew utilization"],
    automations: ["Storm follow-up campaign", "Insurance supplement follow-up", "Material delivery reminder", "Warranty inspection reminder"],
    recommendedTemplateModules: ["Auth", "Audit Log", "Integrations", "Leads", "Email", "Tracking", "Monitoring", "Reviews", "Promotions", "SEO Center"]
  },
  "garage-door": {
    key: "garage-door", label: "Garage Doors", singularAssetLabel: "Garage door system", pluralAssetLabel: "Garage door systems", primaryJobLabel: "Garage door call", accent: "#475569",
    intakeFields: [...commonIntake, { key: "doorStuck", label: "Door stuck open or closed?", type: "select", options: ["Open", "Closed", "No"] }, { key: "vehicleTrapped", label: "Vehicle trapped?", type: "boolean" }],
    assetFields: [{ key: "doorType", label: "Door type", type: "select", options: ["Sectional", "Roll-up", "Carriage", "Commercial", "Fire-rated"] }, { key: "width", label: "Width", type: "number", unit: "ft" }, { key: "height", label: "Height", type: "number", unit: "ft" }, { key: "openerManufacturer", label: "Opener manufacturer", type: "text" }, { key: "openerModel", label: "Opener model", type: "text" }, { key: "springType", label: "Spring type", type: "select", options: ["Torsion", "Extension", "TorqueMaster", "Commercial"] }, { key: "springCycleRating", label: "Spring cycle rating", type: "number" }],
    inspectionSections: [{ title: "Door hardware", fields: [{ key: "springCondition", label: "Spring condition", type: "select", options: ["Good", "Worn", "Broken"] }, { key: "rollerCondition", label: "Roller condition", type: "select", options: ["Good", "Worn", "Replace"] }, { key: "trackCondition", label: "Track condition", type: "select", options: ["Aligned", "Needs adjustment", "Damaged"] }] }, { title: "Safety", fields: [{ key: "sensorTest", label: "Safety sensor test", type: "select", options: ["Pass", "Fail"] }, { key: "reversalTest", label: "Auto-reversal test", type: "select", options: ["Pass", "Fail"] }] }],
    quoteFormulas: [{ key: "garage-door", label: "Garage door repair or replacement", description: "Price springs, opener, panels, track, rollers, labor, haul-away, commercial hardware, and warranty.", fields: [{ key: "laborHours", label: "Labor hours", type: "number" }, { key: "partsCost", label: "Parts cost", type: "number" }, { key: "doorCost", label: "Door or opener cost", type: "number" }, { key: "haulAwayCost", label: "Haul-away cost", type: "number" }], calculatedInputs: ["targetGrossMargin", "emergencyMultiplier", "warrantyReserve"] }],
    complianceChecks: ["Safety sensor test", "Auto-reversal test", "Commercial inspection schedule", "Fire-door documentation", "Warranty registration"],
    defaultMemberships: ["Annual garage door tune-up", "Commercial inspection agreement", "Priority repair plan"],
    dashboardKpis: ["Emergency response time", "Spring replacement margin", "Opener close rate", "First-visit resolution", "Commercial agreement renewals"],
    automations: ["Annual tune-up reminder", "Commercial inspection scheduling", "Spring cycle replacement alert", "Warranty reminder"],
    recommendedTemplateModules: ["Auth", "Audit Log", "Integrations", "Leads", "Email", "Tracking", "Monitoring", "Reviews"]
  },
  "water-treatment": {
    key: "water-treatment", label: "Water Treatment", singularAssetLabel: "Water treatment system", pluralAssetLabel: "Water treatment systems", primaryJobLabel: "Water service call", accent: "#0d9488",
    intakeFields: [...commonIntake, { key: "waterConcern", label: "Water concern", type: "select", options: ["Hard water", "Taste or odor", "Iron staining", "Sediment", "Contaminant concern", "Service or repair"] }, { key: "waterSource", label: "Water source", type: "select", options: ["Municipal", "Private well", "Other"] }],
    assetFields: [{ key: "systemType", label: "System type", type: "select", options: ["Water softener", "Reverse osmosis", "Whole-home filtration", "UV system", "Iron filter", "Chemical feed", "Commercial treatment"] }, { key: "manufacturer", label: "Manufacturer", type: "text" }, { key: "model", label: "Model", type: "text" }, { key: "serial", label: "Serial number", type: "text" }, { key: "filterType", label: "Filter or media type", type: "text" }, { key: "replacementInterval", label: "Replacement interval", type: "number", unit: "months" }, { key: "resinInstallDate", label: "Resin installation date", type: "date" }],
    inspectionSections: [{ title: "Water test", fields: [{ key: "hardness", label: "Hardness", type: "number", unit: "gpg" }, { key: "ph", label: "pH", type: "number" }, { key: "iron", label: "Iron", type: "number", unit: "mg/L" }, { key: "tds", label: "TDS", type: "number", unit: "ppm" }, { key: "chlorine", label: "Chlorine", type: "number", unit: "mg/L" }] }, { title: "System", fields: [{ key: "saltLevel", label: "Salt level", type: "select", options: ["Full", "Adequate", "Low", "Empty"] }, { key: "leakDetected", label: "Leak detected", type: "boolean" }, { key: "serviceRequired", label: "Service required", type: "boolean" }] }],
    quoteFormulas: [{ key: "water-treatment", label: "Water treatment system", description: "Price equipment, media, plumbing connections, testing, installation labor, consumables, delivery, and recurring service.", fields: [{ key: "equipmentCost", label: "Equipment cost", type: "number" }, { key: "mediaCost", label: "Media or filters", type: "number" }, { key: "installationHours", label: "Installation hours", type: "number" }, { key: "deliveryCost", label: "Delivery cost", type: "number" }], calculatedInputs: ["targetGrossMargin", "subscriptionValue", "warrantyReserve"] }],
    complianceChecks: ["Water test documented", "Backflow requirements", "Sanitization completed", "Installation checklist", "Warranty registration"],
    defaultMemberships: ["Filter replacement plan", "Salt delivery plan", "Annual water quality plan", "Commercial treatment agreement"],
    dashboardKpis: ["Recurring route revenue", "Filter renewal rate", "Salt delivery density", "System replacement close rate", "Consumable gross margin"],
    automations: ["Filter replacement reminder", "Salt delivery scheduling", "Annual water test reminder", "Resin age alert"],
    recommendedTemplateModules: ["Auth", "Audit Log", "Integrations", "Leads", "Email", "Tracking", "Monitoring", "Reviews", "Subscribers"]
  },
  "energy-systems": {
    key: "energy-systems", label: "Energy Systems", singularAssetLabel: "Energy system", pluralAssetLabel: "Energy systems", primaryJobLabel: "Energy service call", accent: "#16a34a",
    intakeFields: [...commonIntake, { key: "systemType", label: "System involved", type: "select", options: ["Solar", "Battery", "Generator", "Transfer switch", "Monitoring"] }, { key: "outage", label: "Current outage?", type: "boolean" }],
    assetFields: [{ key: "assetType", label: "Asset type", type: "select", options: ["Solar array", "Inverter", "Optimizer", "Battery", "Generator", "Transfer switch", "Monitoring gateway"] }, { key: "manufacturer", label: "Manufacturer", type: "text" }, { key: "model", label: "Model", type: "text" }, { key: "serial", label: "Serial number", type: "text" }, { key: "ratedCapacity", label: "Rated capacity", type: "number", unit: "kW/kWh" }, { key: "installDate", label: "Installation date", type: "date" }, { key: "monitoringProvider", label: "Monitoring provider", type: "text" }],
    inspectionSections: [{ title: "Performance", fields: [{ key: "currentOutput", label: "Current output", type: "number", unit: "kW" }, { key: "expectedOutput", label: "Expected output", type: "number", unit: "kW" }, { key: "batterySoc", label: "Battery state of charge", type: "number", unit: "%" }] }, { title: "Safety and interconnection", fields: [{ key: "disconnectCondition", label: "Disconnect condition", type: "select", options: ["Pass", "Needs service", "Unsafe"] }, { key: "interconnectionStatus", label: "Interconnection status", type: "select", options: ["Approved", "Pending", "Not applicable"] }, { key: "firmwareCurrent", label: "Firmware current", type: "boolean" }] }],
    quoteFormulas: [{ key: "energy-system", label: "Energy system project", description: "Price equipment, electrical balance of system, roof or site work, permits, interconnection, commissioning, monitoring, and warranty.", fields: [{ key: "equipmentCost", label: "Equipment cost", type: "number" }, { key: "electricalCost", label: "Electrical materials", type: "number" }, { key: "laborHours", label: "Labor hours", type: "number" }, { key: "permitCost", label: "Permit and interconnection cost", type: "number" }, { key: "commissioningCost", label: "Commissioning cost", type: "number" }], calculatedInputs: ["targetGrossMargin", "taxCreditDisplay", "financingPayment", "warrantyReserve"] }],
    complianceChecks: ["Permit status", "Utility interconnection", "Commissioning report", "Generator load test", "Battery safety checklist", "Warranty registration"],
    defaultMemberships: ["Solar performance plan", "Battery health plan", "Generator maintenance plan", "Whole-home energy plan"],
    dashboardKpis: ["System uptime", "Production variance", "Generator test completion", "Battery health", "Warranty recovery", "Service agreement renewal"],
    automations: ["Production underperformance alert", "Generator exercise reminder", "Battery health alert", "Firmware update notice", "Warranty expiration campaign"],
    recommendedTemplateModules: ["Auth", "Audit Log", "Integrations", "Leads", "Email", "Tracking", "Monitoring", "Reviews"]
  }
};

export const getIndustryProfile = (key: TradeKey): IndustryProfile => industryProfiles[key];
