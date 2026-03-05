/**
 * Complete SMM7 Rate Analysis Templates
 * Professional QS templates for all SMM7 work categories
 */

export const SMM7_RATE_TEMPLATES = {
  // A: PRELIMINARIES
  preliminaries: {
    site_setup: {
      description: "Site Setup and Establishment",
      unit: "lump sum",
      materials: [],
      labour: [
        { desc: "Site Manager", unit: "months", qty: 1, rate: 15000 },
        { desc: "Site Engineer", unit: "months", qty: 1, rate: 12000 },
        { desc: "Safety Officer", unit: "months", qty: 1, rate: 8000 }
      ],
      plant: [
        { desc: "Site Office", unit: "months", qty: 1, rate: 5000 },
        { desc: "Site Facilities", unit: "months", qty: 1, rate: 3000 }
      ],
      wastePct: 0,
      overheadPct: 15,
      profitPct: 10
    },
    temporary_works: {
      description: "Temporary Works and Protection",
      unit: "lump sum",
      materials: [
        { desc: "Hoarding", unit: "m", qty: 100, rate: 85 },
        { desc: "Safety Signs", unit: "no.", qty: 20, rate: 150 }
      ],
      labour: [
        { desc: "Carpenter", unit: "days", qty: 5, rate: 600 },
        { desc: "Labourer", unit: "days", qty: 10, rate: 400 }
      ],
      plant: [
        { desc: "Tools and Equipment", unit: "lump sum", qty: 1, rate: 2000 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    }
  },

  // E: SUBSTRUCTURE
  substructure: {
    excavation_general: {
      description: "General Excavation by Machine",
      unit: "m³",
      materials: [],
      labour: [
        { desc: "Machine Operator", unit: "hours", qty: 0.5, rate: 300 },
        { desc: "Labourer", unit: "hours", qty: 2, rate: 250 }
      ],
      plant: [
        { desc: "Excavator 5t", unit: "hours", qty: 0.5, rate: 800 },
        { desc: "Dump Truck 10t", unit: "hours", qty: 0.3, rate: 600 }
      ],
      wastePct: 0,
      overheadPct: 12,
      profitPct: 10
    },
    excavation_trench: {
      description: "Trench Excavation for Foundations",
      unit: "m³",
      materials: [],
      labour: [
        { desc: "Machine Operator", unit: "hours", qty: 0.8, rate: 300 },
        { desc: "Labourer", unit: "hours", qty: 3, rate: 250 }
      ],
      plant: [
        { desc: "Trencher", unit: "hours", qty: 0.8, rate: 700 },
        { desc: "Dump Truck 10t", unit: "hours", qty: 0.4, rate: 600 }
      ],
      wastePct: 0,
      overheadPct: 12,
      profitPct: 10
    },
    concrete_blinding: {
      description: "Blinding Concrete Grade 15",
      unit: "m³",
      materials: [
        { desc: "Cement", unit: "bags", qty: 5.0, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.50, rate: 800 },
        { desc: "Aggregate 20mm", unit: "m³", qty: 0.90, rate: 600 }
      ],
      labour: [
        { desc: "Mason", unit: "days", qty: 0.8, rate: 700 },
        { desc: "Labourer", unit: "days", qty: 1.6, rate: 400 }
      ],
      plant: [
        { desc: "Concrete Mixer", unit: "hours", qty: 0.8, rate: 200 },
        { desc: "Vibrator", unit: "hours", qty: 0.8, rate: 150 }
      ],
      wastePct: 3,
      overheadPct: 12,
      profitPct: 10
    },
    concrete_foundation: {
      description: "Reinforced Concrete Grade 25",
      unit: "m³",
      materials: [
        { desc: "Cement", unit: "bags", qty: 6.5, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.44, rate: 800 },
        { desc: "Aggregate 20mm", unit: "m³", qty: 0.88, rate: 600 }
      ],
      labour: [
        { desc: "Mason", unit: "days", qty: 1.0, rate: 700 },
        { desc: "Steel Fixer", unit: "days", qty: 0.5, rate: 650 },
        { desc: "Labourer", unit: "days", qty: 2.0, rate: 400 }
      ],
      plant: [
        { desc: "Concrete Mixer", unit: "hours", qty: 1.0, rate: 200 },
        { desc: "Vibrator", unit: "hours", qty: 1.0, rate: 150 },
        { desc: "Concrete Pump", unit: "hours", qty: 0.2, rate: 800 }
      ],
      wastePct: 3,
      overheadPct: 12,
      profitPct: 10
    },
    reinforcement_foundation: {
      description: "Reinforcement for Foundations",
      unit: "kg",
      materials: [
        { desc: "High Yield Steel Bar", unit: "kg", qty: 1.05, rate: 65 },
        { desc: "Binding Wire", unit: "kg", qty: 0.015, rate: 80 },
        { desc: "Spacer Blocks", unit: "no.", qty: 5, rate: 12 }
      ],
      labour: [
        { desc: "Steel Fixer", unit: "days", qty: 0.015, rate: 650 },
        { desc: "Labourer", unit: "days", qty: 0.008, rate: 400 }
      ],
      plant: [
        { desc: "Cutting Tools", unit: "lump sum", qty: 1, rate: 50 },
        { desc: "Bending Tools", unit: "lump sum", qty: 1, rate: 30 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    },
    formwork_foundation: {
      description: "Formwork for Foundations",
      unit: "m²",
      materials: [
        { desc: "Plywood 18mm", unit: "m²", qty: 0.25, rate: 180 },
        { desc: "Timber Supports", unit: "m³", qty: 0.02, rate: 2500 },
        { desc: "Nails", unit: "kg", qty: 0.5, rate: 120 }
      ],
      labour: [
        { desc: "Carpenter", unit: "days", qty: 0.15, rate: 600 },
        { desc: "Labourer", unit: "days", qty: 0.08, rate: 400 }
      ],
      plant: [
        { desc: "Power Tools", unit: "hours", qty: 1.2, rate: 100 }
      ],
      wastePct: 10,
      overheadPct: 12,
      profitPct: 10
    }
  },

  // F: SUPERSTRUCTURE
  superstructure: {
    concrete_columns: {
      description: "Reinforced Concrete Columns Grade 30",
      unit: "m³",
      materials: [
        { desc: "Cement", unit: "bags", qty: 7.0, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.42, rate: 800 },
        { desc: "Aggregate 20mm", unit: "m³", qty: 0.84, rate: 600 }
      ],
      labour: [
        { desc: "Mason", unit: "days", qty: 1.2, rate: 700 },
        { desc: "Steel Fixer", unit: "days", qty: 0.6, rate: 650 },
        { desc: "Labourer", unit: "days", qty: 2.4, rate: 400 }
      ],
      plant: [
        { desc: "Concrete Mixer", unit: "hours", qty: 1.2, rate: 200 },
        { desc: "Vibrator", unit: "hours", qty: 1.2, rate: 150 },
        { desc: "Concrete Pump", unit: "hours", qty: 0.3, rate: 800 }
      ],
      wastePct: 3,
      overheadPct: 12,
      profitPct: 10
    },
    concrete_beams: {
      description: "Reinforced Concrete Beams Grade 30",
      unit: "m³",
      materials: [
        { desc: "Cement", unit: "bags", qty: 7.0, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.42, rate: 800 },
        { desc: "Aggregate 20mm", unit: "m³", qty: 0.84, rate: 600 }
      ],
      labour: [
        { desc: "Mason", unit: "days", qty: 1.1, rate: 700 },
        { desc: "Steel Fixer", unit: "days", qty: 0.5, rate: 650 },
        { desc: "Labourer", unit: "days", qty: 2.2, rate: 400 }
      ],
      plant: [
        { desc: "Concrete Mixer", unit: "hours", qty: 1.1, rate: 200 },
        { desc: "Vibrator", unit: "hours", qty: 1.1, rate: 150 },
        { desc: "Concrete Pump", unit: "hours", qty: 0.25, rate: 800 }
      ],
      wastePct: 3,
      overheadPct: 12,
      profitPct: 10
    },
    concrete_slab: {
      description: "Reinforced Concrete Slab Grade 25",
      unit: "m³",
      materials: [
        { desc: "Cement", unit: "bags", qty: 6.5, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.44, rate: 800 },
        { desc: "Aggregate 20mm", unit: "m³", qty: 0.88, rate: 600 }
      ],
      labour: [
        { desc: "Mason", unit: "days", qty: 0.9, rate: 700 },
        { desc: "Steel Fixer", unit: "days", qty: 0.4, rate: 650 },
        { desc: "Labourer", unit: "days", qty: 1.8, rate: 400 }
      ],
      plant: [
        { desc: "Concrete Mixer", unit: "hours", qty: 0.9, rate: 200 },
        { desc: "Vibrator", unit: "hours", qty: 0.9, rate: 150 },
        { desc: "Screed Vibrator", unit: "hours", qty: 0.2, rate: 180 }
      ],
      wastePct: 3,
      overheadPct: 12,
      profitPct: 10
    },
    reinforcement_slab: {
      description: "Reinforcement for Slabs",
      unit: "kg",
      materials: [
        { desc: "High Yield Steel Bar", unit: "kg", qty: 1.08, rate: 65 },
        { desc: "Binding Wire", unit: "kg", qty: 0.018, rate: 80 },
        { desc: "Spacer Blocks", unit: "no.", qty: 4, rate: 12 }
      ],
      labour: [
        { desc: "Steel Fixer", unit: "days", qty: 0.012, rate: 650 },
        { desc: "Labourer", unit: "days", qty: 0.006, rate: 400 }
      ],
      plant: [
        { desc: "Cutting Tools", unit: "lump sum", qty: 1, rate: 40 },
        { desc: "Bending Tools", unit: "lump sum", qty: 1, rate: 25 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    },
    brickwork_walls: {
      description: "Brickwork in Cement Mortar 1:4",
      unit: "m²",
      materials: [
        { desc: "Clay Bricks", unit: "no.", qty: 60, rate: 8 },
        { desc: "Cement", unit: "bags", qty: 0.15, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.03, rate: 800 }
      ],
      labour: [
        { desc: "Mason", unit: "days", qty: 0.4, rate: 700 },
        { desc: "Labourer", unit: "days", qty: 0.4, rate: 400 }
      ],
      plant: [
        { desc: "Scaffolding", unit: "days", qty: 0.4, rate: 150 },
        { desc: "Mixing Machine", unit: "hours", qty: 0.3, rate: 120 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    },
    blockwork_walls: {
      description: "Concrete Blockwork in Cement Mortar 1:6",
      unit: "m²",
      materials: [
        { desc: "Concrete Blocks", unit: "no.", qty: 12.5, rate: 45 },
        { desc: "Cement", unit: "bags", qty: 0.08, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.025, rate: 800 }
      ],
      labour: [
        { desc: "Mason", unit: "days", qty: 0.25, rate: 700 },
        { desc: "Labourer", unit: "days", qty: 0.25, rate: 400 }
      ],
      plant: [
        { desc: "Scaffolding", unit: "days", qty: 0.25, rate: 150 },
        { desc: "Mixing Machine", unit: "hours", qty: 0.2, rate: 120 }
      ],
      wastePct: 3,
      overheadPct: 12,
      profitPct: 10
    }
  },

  // G: FINISHES
  finishes: {
    plaster_walls: {
      description: "Cement Plaster 12mm Thick",
      unit: "m²",
      materials: [
        { desc: "Cement", unit: "bags", qty: 0.12, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.02, rate: 800 },
        { desc: "Waterproof Additive", unit: "liters", qty: 0.5, rate: 85 }
      ],
      labour: [
        { desc: "Plasterer", unit: "days", qty: 0.08, rate: 650 },
        { desc: "Labourer", unit: "days", qty: 0.08, rate: 400 }
      ],
      plant: [
        { desc: "Mixing Machine", unit: "hours", qty: 0.15, rate: 120 },
        { desc: "Plastering Tools", unit: "lump sum", qty: 1, rate: 30 }
      ],
      wastePct: 8,
      overheadPct: 12,
      profitPct: 10
    },
    plaster_ceiling: {
      description: "Cement Plaster Ceiling 12mm Thick",
      unit: "m²",
      materials: [
        { desc: "Cement", unit: "bags", qty: 0.14, rate: 450 },
        { desc: "Sand", unit: "m³", qty: 0.022, rate: 800 },
        { desc: "Waterproof Additive", unit: "liters", qty: 0.6, rate: 85 }
      ],
      labour: [
        { desc: "Plasterer", unit: "days", qty: 0.10, rate: 650 },
        { desc: "Labourer", unit: "days", qty: 0.10, rate: 400 }
      ],
      plant: [
        { desc: "Mixing Machine", unit: "hours", qty: 0.18, rate: 120 },
        { desc: "Plastering Tools", unit: "lump sum", qty: 1, rate: 35 }
      ],
      wastePct: 10,
      overheadPct: 12,
      profitPct: 10
    },
    paint_internal: {
      description: "Internal Emulsion Paint 2 Coats",
      unit: "m²",
      materials: [
        { desc: "Emulsion Paint", unit: "liters", qty: 0.18, rate: 280 },
        { desc: "Putty", unit: "kg", qty: 0.3, rate: 45 },
        { desc: "Sandpaper", unit: "sheet", qty: 0.1, rate: 25 }
      ],
      labour: [
        { desc: "Painter", unit: "days", qty: 0.05, rate: 550 },
        { desc: "Labourer", unit: "days", qty: 0.025, rate: 400 }
      ],
      plant: [
        { desc: "Painting Tools", unit: "lump sum", qty: 1, rate: 40 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    },
    paint_external: {
      description: "External Weatherproof Paint 2 Coats",
      unit: "m²",
      materials: [
        { desc: "Weatherproof Paint", unit: "liters", qty: 0.22, rate: 350 },
        { desc: "Primer", unit: "liters", qty: 0.12, rate: 220 },
        { desc: "Putty", unit: "kg", qty: 0.4, rate: 45 }
      ],
      labour: [
        { desc: "Painter", unit: "days", qty: 0.06, rate: 550 },
        { desc: "Labourer", unit: "days", qty: 0.03, rate: 400 }
      ],
      plant: [
        { desc: "Painting Tools", unit: "lump sum", qty: 1, rate: 45 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    },
    floor_tiles: {
      description: "Ceramic Floor Tiles 300x300mm",
      unit: "m²",
      materials: [
        { desc: "Ceramic Tiles", unit: "m²", qty: 1.05, rate: 280 },
        { desc: "Tile Adhesive", unit: "kg", qty: 4.5, rate: 65 },
        { desc: "Grout", unit: "kg", qty: 0.3, rate: 85 }
      ],
      labour: [
        { desc: "Tile Fixer", unit: "days", qty: 0.12, rate: 600 },
        { desc: "Labourer", unit: "days", qty: 0.06, rate: 400 }
      ],
      plant: [
        { desc: "Tile Cutter", unit: "hours", qty: 0.2, rate: 80 },
        { desc: "Mixing Tools", unit: "lump sum", qty: 1, rate: 25 }
      ],
      wastePct: 7,
      overheadPct: 12,
      profitPct: 10
    },
    wall_tiles: {
      description: "Ceramic Wall Tiles 200x200mm",
      unit: "m²",
      materials: [
        { desc: "Ceramic Tiles", unit: "m²", qty: 1.08, rate: 320 },
        { desc: "Tile Adhesive", unit: "kg", qty: 5.0, rate: 65 },
        { desc: "Grout", unit: "kg", qty: 0.35, rate: 85 }
      ],
      labour: [
        { desc: "Tile Fixer", unit: "days", qty: 0.15, rate: 600 },
        { desc: "Labourer", unit: "days", qty: 0.075, rate: 400 }
      ],
      plant: [
        { desc: "Tile Cutter", unit: "hours", qty: 0.3, rate: 80 },
        { desc: "Mixing Tools", unit: "lump sum", qty: 1, rate: 30 }
      ],
      wastePct: 8,
      overheadPct: 12,
      profitPct: 10
    },
    vinyl_flooring: {
      description: "Vinyl Floor Tiles",
      unit: "m²",
      materials: [
        { desc: "Vinyl Tiles", unit: "m²", qty: 1.03, rate: 180 },
        { desc: "Adhesive", unit: "kg", qty: 1.2, rate: 55 }
      ],
      labour: [
        { desc: "Floor Fixer", unit: "days", qty: 0.08, rate: 550 },
        { desc: "Labourer", unit: "days", qty: 0.04, rate: 400 }
      ],
      plant: [
        { desc: "Flooring Tools", unit: "lump sum", qty: 1, rate: 35 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    }
  },

  // L: EXTERNAL WORKS
  external_works: {
    site_clearance: {
      description: "Site Clearance and Grubbing",
      unit: "m²",
      materials: [],
      labour: [
        { desc: "General Labourer", unit: "days", qty: 0.02, rate: 400 }
      ],
      plant: [
        { desc: "Bulldozer", unit: "hours", qty: 0.01, rate: 900 }
      ],
      wastePct: 0,
      overheadPct: 12,
      profitPct: 10
    },
    road_subbase: {
      description: "Road Subbase Granular Material",
      unit: "m³",
      materials: [
        { desc: "Granular Subbase", unit: "m³", qty: 1.15, rate: 450 }
      ],
      labour: [
        { desc: "Road Worker", unit: "days", qty: 0.3, rate: 450 },
        { desc: "Labourer", unit: "days", qty: 0.15, rate: 400 }
      ],
      plant: [
        { desc: "Road Roller", unit: "hours", qty: 0.2, rate: 700 },
        { desc: "Grader", unit: "hours", qty: 0.1, rate: 800 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    },
    asphalt_paving: {
      description: "Asphalt Paving 50mm Thick",
      unit: "m²",
      materials: [
        { desc: "Asphalt Hot Mix", unit: "ton", qty: 0.12, rate: 2800 }
      ],
      labour: [
        { desc: "Paver", unit: "days", qty: 0.05, rate: 500 },
        { desc: "Labourer", unit: "days", qty: 0.025, rate: 400 }
      ],
      plant: [
        { desc: "Paver Machine", unit: "hours", qty: 0.05, rate: 900 },
        { desc: "Roller", unit: "hours", qty: 0.03, rate: 700 }
      ],
      wastePct: 3,
      overheadPct: 12,
      profitPct: 10
    },
    landscaping: {
      description: "Landscaping and Turfing",
      unit: "m²",
      materials: [
        { desc: "Topsoil", unit: "m³", qty: 0.1, rate: 600 },
        { desc: "Grass Turf", unit: "m²", qty: 1.05, rate: 45 },
        { desc: "Fertilizer", unit: "kg", qty: 0.1, rate: 85 }
      ],
      labour: [
        { desc: "Gardener", unit: "days", qty: 0.03, rate: 450 },
        { desc: "Labourer", unit: "days", qty: 0.015, rate: 400 }
      ],
      plant: [
        { desc: "Gardening Tools", unit: "lump sum", qty: 1, rate: 50 }
      ],
      wastePct: 8,
      overheadPct: 12,
      profitPct: 10
    },
    drainage: {
      description: "Surface Water Drainage",
      unit: "m",
      materials: [
        { desc: "PVC Pipe 100mm", unit: "m", qty: 1.02, rate: 85 },
        { desc: "Pipe Fittings", unit: "no.", qty: 0.2, rate: 150 },
        { desc: "Concrete Encasement", unit: "m³", qty: 0.02, rate: 2500 }
      ],
      labour: [
        { desc: "Plumber", unit: "days", qty: 0.02, rate: 550 },
        { desc: "Labourer", unit: "days", qty: 0.02, rate: 400 }
      ],
      plant: [
        { desc: "Excavator", unit: "hours", qty: 0.05, rate: 800 },
        { desc: "Pipe Laying Tools", unit: "lump sum", qty: 1, rate: 40 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    }
  },

  // M: SERVICES
  services: {
    electrical_wiring: {
      description: "Electrical Wiring and Installation",
      unit: "point",
      materials: [
        { desc: "Copper Cable", unit: "m", qty: 15, rate: 25 },
        { desc: "Conduit", unit: "m", qty: 8, rate: 35 },
        { desc: "Switches and Sockets", unit: "no.", qty: 1, rate: 180 }
      ],
      labour: [
        { desc: "Electrician", unit: "days", qty: 0.5, rate: 600 },
        { desc: "Assistant", unit: "days", qty: 0.25, rate: 350 }
      ],
      plant: [
        { desc: "Electrical Tools", unit: "lump sum", qty: 1, rate: 80 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    },
    plumbing_pipes: {
      description: "Plumbing Water Supply Installation",
      unit: "m",
      materials: [
        { desc: "PVC Pipe 20mm", unit: "m", qty: 1.05, rate: 45 },
        { desc: "Pipe Fittings", unit: "no.", qty: 0.3, rate: 85 },
        { desc: "Valves and Taps", unit: "no.", qty: 0.1, rate: 250 }
      ],
      labour: [
        { desc: "Plumber", unit: "days", qty: 0.03, rate: 550 },
        { desc: "Assistant", unit: "days", qty: 0.015, rate: 350 }
      ],
      plant: [
        { desc: "Plumbing Tools", unit: "lump sum", qty: 1, rate: 60 }
      ],
      wastePct: 5,
      overheadPct: 12,
      profitPct: 10
    },
    hvac_ducting: {
      description: "HVAC Ducting Installation",
      unit: "m²",
      materials: [
        { desc: "Galvanized Steel Sheet", unit: "m²", qty: 1.15, rate: 180 },
        { desc: "Insulation", unit: "m²", qty: 1.2, rate: 65 },
        { desc: "Duct Fittings", unit: "no.", qty: 0.5, rate: 120 }
      ],
      labour: [
        { desc: "HVAC Technician", unit: "days", qty: 0.08, rate: 650 },
        { desc: "Assistant", unit: "days", qty: 0.04, rate: 350 }
      ],
      plant: [
        { desc: "Fabrication Tools", unit: "lump sum", qty: 1, rate: 100 }
      ],
      wastePct: 8,
      overheadPct: 12,
      profitPct: 10
    }
  }
};

export function getSMM7Template(category, item) {
  return SMM7_RATE_TEMPLATES[category]?.[item] || null;
}

export function getAllSMM7Categories() {
  return Object.keys(SMM7_RATE_TEMPLATES);
}

export function getSMM7ItemsByCategory(category) {
  return Object.keys(SMM7_RATE_TEMPLATES[category] || {});
}

export function detectSMM7Template(description, unit) {
  const desc = String(description || '').toLowerCase();
  const u = String(unit || '').toLowerCase();
  
  // Enhanced detection logic for all SMM7 categories
  if (u.includes('m³') || u.includes('m3')) {
    if (desc.includes('concrete')) {
      if (desc.includes('column') || desc.includes('beam')) return 'superstructure.concrete_columns';
      if (desc.includes('slab')) return 'superstructure.concrete_slab';
      if (desc.includes('foundation')) return 'substructure.concrete_foundation';
      if (desc.includes('blinding')) return 'substructure.concrete_blinding';
      return 'superstructure.concrete_slab';
    }
    if (desc.includes('excavat')) {
      if (desc.includes('trench')) return 'substructure.excavation_trench';
      return 'substructure.excavation_general';
    }
  }
  
  if (u.includes('kg') || u.includes('ton')) {
    if (desc.includes('reinforcement') || desc.includes('steel')) {
      if (desc.includes('foundation')) return 'substructure.reinforcement_foundation';
      if (desc.includes('slab')) return 'superstructure.reinforcement_slab';
      return 'superstructure.reinforcement_slab';
    }
  }
  
  if (u.includes('m²') || u.includes('m2')) {
    if (desc.includes('brick')) return 'superstructure.brickwork_walls';
    if (desc.includes('block')) return 'superstructure.blockwork_walls';
    if (desc.includes('plaster')) {
      if (desc.includes('ceiling')) return 'finishes.plaster_ceiling';
      return 'finishes.plaster_walls';
    }
    if (desc.includes('paint')) {
      if (desc.includes('external')) return 'finishes.paint_external';
      return 'finishes.paint_internal';
    }
    if (desc.includes('tile')) {
      if (desc.includes('floor')) return 'finishes.floor_tiles';
      if (desc.includes('wall')) return 'finishes.wall_tiles';
      return 'finishes.floor_tiles';
    }
    if (desc.includes('vinyl')) return 'finishes.vinyl_flooring';
    if (desc.includes('formwork')) return 'substructure.formwork_foundation';
  }
  
  if (u.includes('m') || u.includes('meter')) {
    if (desc.includes('drain')) return 'external_works.drainage';
    if (desc.includes('pipe')) {
      if (desc.includes('electrical')) return 'services.electrical_wiring';
      return 'services.plumbing_pipes';
    }
  }
  
  if (u.includes('point') || u.includes('no.') || u.includes('each')) {
    if (desc.includes('electrical')) return 'services.electrical_wiring';
  }
  
  if (u.includes('lump') || u.includes('sum')) {
    if (desc.includes('preliminary')) return 'preliminaries.site_setup';
    if (desc.includes('temporary')) return 'preliminaries.temporary_works';
  }
  
  if (u.includes('m²') || u.includes('m2')) {
    if (desc.includes('clearance')) return 'external_works.site_clearance';
    if (desc.includes('landscap')) return 'external_works.landscaping';
    if (desc.includes('asphalt') || desc.includes('paving')) return 'external_works.asphalt_paving';
  }
  
  if (u.includes('m³') || u.includes('m3')) {
    if (desc.includes('subbase') || desc.includes('road')) return 'external_works.road_subbase';
  }
  
  if (u.includes('m²') || u.includes('m2')) {
    if (desc.includes('duct') || desc.includes('hvac')) return 'services.hvac_ducting';
  }
  
  return null;
}
