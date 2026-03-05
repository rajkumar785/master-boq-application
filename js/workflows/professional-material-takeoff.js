/**
 * Professional Material Takeoff System
 * Converts BOQ quantities to material requirements with wastage factors
 */

export const MATERIAL_CONVERSIONS = {
  // Concrete mixes (per m³)
  concrete: {
    'C25/30': {
      cement: { qty: 6.5, unit: 'bags' },
      sand: { qty: 0.44, unit: 'm³' },
      aggregate: { qty: 0.88, unit: 'm³' },
      water: { qty: 180, unit: 'liters' },
      wastage: { cement: 0.03, sand: 0.05, aggregate: 0.05, water: 0.02 }
    },
    'C30/37': {
      cement: { qty: 7.0, unit: 'bags' },
      sand: { qty: 0.42, unit: 'm³' },
      aggregate: { qty: 0.84, unit: 'm³' },
      water: { qty: 185, unit: 'liters' },
      wastage: { cement: 0.03, sand: 0.05, aggregate: 0.05, water: 0.02 }
    }
  },
  
  // Mortar mixes (per m³)
  mortar: {
    '1:4': {
      cement: { qty: 4.8, unit: 'bags' },
      sand: { qty: 1.0, unit: 'm³' },
      water: { qty: 200, unit: 'liters' },
      wastage: { cement: 0.05, sand: 0.07, water: 0.03 }
    },
    '1:6': {
      cement: { qty: 3.2, unit: 'bags' },
      sand: { qty: 1.0, unit: 'm³' },
      water: { qty: 180, unit: 'liters' },
      wastage: { cement: 0.05, sand: 0.07, water: 0.03 }
    }
  },
  
  // Brickwork (per m²)
  brickwork: {
    standard: {
      bricks: { qty: 60, unit: 'no.' },
      mortar: { qty: 0.03, unit: 'm³' },
      wastage: { bricks: 0.05, mortar: 0.10 }
    }
  },
  
  // Plaster (per m²)
  plaster: {
    '12mm': {
      cement: { qty: 0.12, unit: 'bags' },
      sand: { qty: 0.02, unit: 'm³' },
      water: { qty: 15, unit: 'liters' },
      wastage: { cement: 0.05, sand: 0.07, water: 0.03 }
    },
    '20mm': {
      cement: { qty: 0.20, unit: 'bags' },
      sand: { qty: 0.033, unit: 'm³' },
      water: { qty: 25, unit: 'liters' },
      wastage: { cement: 0.05, sand: 0.07, water: 0.03 }
    }
  },
  
  // Flooring (per m²)
  flooring: {
    'ceramic_tiles': {
      tiles: { qty: 1.05, unit: 'm²' },
      adhesive: { qty: 4.5, unit: 'kg' },
      grout: { qty: 0.3, unit: 'kg' },
      wastage: { tiles: 0.07, adhesive: 0.05, grout: 0.05 }
    },
    'vinyl_tiles': {
      tiles: { qty: 1.03, unit: 'm²' },
      adhesive: { qty: 1.2, unit: 'kg' },
      wastage: { tiles: 0.05, adhesive: 0.03 }
    }
  },
  
  // Painting (per m²)
  painting: {
    'primer': {
      paint: { qty: 0.12, unit: 'liters' },
      wastage: 0.05
    },
    'emulsion': {
      paint: { qty: 0.18, unit: 'liters' },
      wastage: 0.05
    },
    'enamel': {
      paint: { qty: 0.15, unit: 'liters' },
      thinner: { qty: 0.02, unit: 'liters' },
      wastage: { paint: 0.05, thinner: 0.03 }
    }
  },
  
  // Formwork (per m²)
  formwork: {
    'timber': {
      timber: { qty: 0.05, unit: 'm³' },
      nails: { qty: 0.15, unit: 'kg' },
      oil: { qty: 0.2, unit: 'liters' },
      wastage: { timber: 0.10, nails: 0.05, oil: 0.05 }
    },
    'steel': {
      panels: { qty: 1.0, unit: 'm²' },
      props: { qty: 0.8, unit: 'no.' },
      ties: { qty: 1.2, unit: 'no.' },
      wastage: { panels: 0.03, props: 0.02, ties: 0.02 }
    }
  }
};

export function calculateMaterialTakeoff(boqItem, materialSpec) {
  const quantity = boqItem.qty || 0;
  const unit = boqItem.unit || '';
  
  // Determine material category based on item description
  const category = determineMaterialCategory(boqItem.description);
  const spec = materialSpec || getDefaultSpec(category);
  
  if (!category || !MATERIAL_CONVERSIONS[category] || !MATERIAL_CONVERSIONS[category][spec]) {
    return {
      materials: [],
      totalCost: 0,
      explanation: 'No material conversion available for this item'
    };
  }
  
  const conversion = MATERIAL_CONVERSIONS[category][spec];
  const materials = [];
  const steps = [];
  
  // Step 1: Show base calculation
  steps.push({
    title: "Step 1: Base Quantity",
    formula: `Base Quantity = ${quantity} ${unit}`,
    calculation: `Working with ${quantity} ${unit} of ${boqItem.description}`,
    explanation: "Starting with the BOQ quantity"
  });
  
  // Calculate each material
  for (const [materialName, materialData] of Object.entries(conversion)) {
    if (materialName === 'wastage') continue;
    
    const baseQty = materialData.qty * quantity;
    const wastagePct = conversion.wastage?.[materialName] || 0;
    const wastageQty = baseQty * wastagePct;
    const totalQty = baseQty + wastageQty;
    
    materials.push({
      name: materialName,
      unit: materialData.unit,
      baseQuantity: baseQty,
      wastagePercent: wastagePct * 100,
      wastageQuantity: wastageQty,
      totalQuantity: totalQty
    });
    
    steps.push({
      title: `Step ${steps.length + 1}: ${materialName.charAt(0).toUpperCase() + materialName.slice(1)}`,
      formula: `${materialName} = Base Quantity × Rate`,
      calculation: `${quantity} × ${materialData.qty} = ${baseQty.toFixed(2)} ${materialData.unit}`,
      explanation: `Base requirement for ${materialName}`
    });
    
    if (wastagePct > 0) {
      steps.push({
        title: `Step ${steps.length + 1}: ${materialName} Wastage`,
        formula: `Wastage = Base Quantity × ${wastagePct * 100}%`,
        calculation: `${baseQty.toFixed(2)} × ${wastagePct} = ${wastageQty.toFixed(2)} ${materialData.unit}`,
        explanation: `Add ${wastagePct * 100}% wastage for ${materialName}`
      });
      
      steps.push({
        title: `Step ${steps.length + 1}: Total ${materialName}`,
        formula: `Total = Base + Wastage`,
        calculation: `${baseQty.toFixed(2)} + ${wastageQty.toFixed(2)} = ${totalQty.toFixed(2)} ${materialData.unit}`,
        explanation: `Total ${materialName} including wastage`
      });
    }
  }
  
  return {
    materials: materials,
    steps: steps,
    category: category,
    specification: spec,
    explanation: `Material takeoff for ${boqItem.description} using ${spec} specification`
  };
}

function determineMaterialCategory(description) {
  const desc = (description || '').toLowerCase();
  
  if (desc.includes('concrete')) return 'concrete';
  if (desc.includes('brick')) return 'brickwork';
  if (desc.includes('plaster') || desc.includes('render')) return 'plaster';
  if (desc.includes('tile') || desc.includes('floor')) return 'flooring';
  if (desc.includes('paint')) return 'painting';
  if (desc.includes('formwork') || desc.includes('shuttering')) return 'formwork';
  if (desc.includes('mortar')) return 'mortar';
  
  return null;
}

function getDefaultSpec(category) {
  const defaults = {
    concrete: 'C25/30',
    brickwork: 'standard',
    plaster: '12mm',
    flooring: 'ceramic_tiles',
    painting: 'emulsion',
    formwork: 'timber',
    mortar: '1:4'
  };
  
  return defaults[category] || null;
}

export function generateMaterialTakeoffReport(boqItems, materialSpecs = {}) {
  const allMaterials = new Map();
  const report = {
    projectMaterials: [],
    totalMaterials: new Map(),
    summary: {}
  };
  
  boqItems.forEach(item => {
    const takeoff = calculateMaterialTakeoff(item, materialSpecs[item.id]);
    
    if (takeoff.materials.length > 0) {
      report.projectMaterials.push({
        item: item,
        takeoff: takeoff
      });
      
      // Aggregate materials by type
      takeoff.materials.forEach(material => {
        const key = `${material.name}_${material.unit}`;
        if (!report.totalMaterials.has(key)) {
          report.totalMaterials.set(key, {
            name: material.name,
            unit: material.unit,
            totalQuantity: 0,
            items: []
          });
        }
        
        const aggregated = report.totalMaterials.get(key);
        aggregated.totalQuantity += material.totalQuantity;
        aggregated.items.push({
          itemDescription: item.description,
          quantity: item.qty,
          materialQuantity: material.totalQuantity
        });
      });
    }
  });
  
  // Generate summary
  report.summary = {
    totalItems: boqItems.length,
    itemsWithMaterials: report.projectMaterials.length,
    uniqueMaterials: report.totalMaterials.size,
    totalMaterialTypes: Array.from(report.totalMaterials.values())
  };
  
  return report;
}

export function displayMaterialTakeoff(takeoff, container) {
  container.innerHTML = '';
  
  // Header
  const header = document.createElement('div');
  header.className = 'card__header';
  header.innerHTML = `
    <div class="card__title">🏗️ Professional Material Takeoff</div>
    <div class="card__subtitle">${takeoff.explanation}</div>
  `;
  container.appendChild(header);
  
  // Body
  const body = document.createElement('div');
  body.className = 'card__body';
  
  // Display calculation steps
  takeoff.steps.forEach((step, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'calculation-step';
    stepDiv.style.cssText = `
      margin-bottom: 16px;
      padding: 16px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    `;
    
    stepDiv.innerHTML = `
      <div style="font-weight: 600; color: var(--primary); margin-bottom: 12px; font-size: 16px;">
        ${step.title}
      </div>
      <div style="font-family: monospace; background: var(--bg); padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 4px solid var(--primary); font-size: 14px;">
        <strong>Formula:</strong> ${step.formula}<br>
        <strong>Calculation:</strong> ${step.calculation}
      </div>
      <div style="font-size: 13px; color: var(--muted); line-height: 1.5;">
        💡 <strong>Explanation:</strong> ${step.explanation}
      </div>
    `;
    
    body.appendChild(stepDiv);
  });
  
  // Materials table
  if (takeoff.materials.length > 0) {
    const tableDiv = document.createElement('div');
    tableDiv.style.cssText = 'margin-top: 20px;';
    
    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>📦 Material</th>
          <th>📏 Unit</th>
          <th>📊 Base Qty</th>
          <th>🔄 Waste %</th>
          <th>♻️ Waste Qty</th>
          <th>🎯 Total Qty</th>
        </tr>
      </thead>
      <tbody>
        ${takeoff.materials.map(mat => `
          <tr>
            <td><strong>${mat.name}</strong></td>
            <td>${mat.unit}</td>
            <td>${mat.baseQuantity.toFixed(2)}</td>
            <td>${mat.wastagePercent.toFixed(1)}%</td>
            <td>${mat.wastageQuantity.toFixed(2)}</td>
            <td><strong>${mat.totalQuantity.toFixed(2)}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    tableDiv.appendChild(table);
    body.appendChild(tableDiv);
  }
  
  container.appendChild(body);
}
