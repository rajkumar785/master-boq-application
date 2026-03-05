/**
 * Educational Quantity Calculation Engine
 * Shows step-by-step calculations for professional QS training
 */

export function calculateExcavation(length, width, depth) {
  const volume = length * width * depth;
  const steps = [
    {
      title: "📊 Step 1: Formula",
      formula: "Volume = Length × Width × Depth",
      calculation: `Volume = ${length} × ${width} × ${depth}`,
      explanation: "Excavation volume calculated using rectangular prism formula for trench or foundation excavation"
    },
    {
      title: "📏 Step 2: Calculation",
      formula: `${length} × ${width} = ${(length * width).toFixed(2)}`,
      calculation: `${(length * width).toFixed(2)} × ${depth} = ${volume.toFixed(2)}`,
      explanation: "First calculate area, then multiply by depth to get volume"
    },
    {
      title: "✅ Step 3: Result",
      formula: `Volume = ${volume.toFixed(2)} m³`,
      calculation: `Total excavation volume = ${volume.toFixed(2)} cubic meters`,
      explanation: "Final excavation quantity in cubic meters for pricing and disposal"
    }
  ];
  
  return {
    result: volume,
    unit: 'm³',
    steps: steps,
    code: 'SMM7: Excavation'
  };
}

export function calculateConcreteVolume(length, width, depth) {
  const volume = length * width * depth;
  const steps = [
    {
      title: "🏗️ Step 1: Formula",
      formula: "Volume = Length × Width × Depth",
      calculation: `Volume = ${length} × ${width} × ${depth}`,
      explanation: "Concrete volume calculated using rectangular prism formula for slab, beam, or column"
    },
    {
      title: "📏 Step 2: Calculation",
      formula: `${length} × ${width} = ${(length * width).toFixed(2)}`,
      calculation: `${(length * width).toFixed(2)} × ${depth} = ${volume.toFixed(2)}`,
      explanation: "First calculate area, then multiply by depth to get volume"
    },
    {
      title: "✅ Step 3: Result",
      formula: `Volume = ${volume.toFixed(2)} m³`,
      calculation: `Total concrete volume = ${volume.toFixed(2)} cubic meters`,
      explanation: "Final concrete quantity in cubic meters for material ordering and mixing"
    }
  ];
  
  return {
    result: volume,
    unit: 'm³',
    steps: steps,
    code: 'SMM7: In-situ Concrete'
  };
}

export function calculateReinforcementWeight(diameter, length) {
  const unitWeight = (diameter * diameter) / 162;
  const totalWeight = unitWeight * length;
  
  const steps = [
    {
      title: "🔧 Step 1: Unit Weight Formula",
      formula: "Unit Weight = Diameter² ÷ 162",
      calculation: `Unit Weight = ${diameter}² ÷ 162`,
      explanation: "Standard formula for reinforcement unit weight (kg/m) based on steel density"
    },
    {
      title: "⚖️ Step 2: Calculate Unit Weight",
      formula: `${diameter}² = ${(diameter * diameter).toFixed(2)}`,
      calculation: `${(diameter * diameter).toFixed(2)} ÷ 162 = ${unitWeight.toFixed(3)} kg/m`,
      explanation: "Unit weight per meter of reinforcement bar"
    },
    {
      title: "📏 Step 3: Total Weight",
      formula: "Total Weight = Unit Weight × Length",
      calculation: `${unitWeight.toFixed(3)} × ${length.toFixed(2)} = ${totalWeight.toFixed(2)} kg`,
      explanation: "Total weight of reinforcement bar for cutting, bending, and installation"
    }
  ];
  
  return {
    result: totalWeight,
    unit: 'kg',
    steps: steps,
    code: 'SMM7: Reinforcement'
  };
}

export function calculateBrickworkArea(length, height) {
  const area = length * height;
  const standardBrickArea = 0.225 * 0.075; // Standard brick size in meters
  const brickCount = area / standardBrickArea;
  
  const steps = [
    {
      title: "🧱 Step 1: Wall Area Formula",
      formula: "Area = Length × Height",
      calculation: `Area = ${length} × ${height}`,
      explanation: "Calculate total wall area for brickwork estimation"
    },
    {
      title: "📏 Step 2: Calculate Area",
      formula: `${length} × ${height} = ${area.toFixed(2)}`,
      calculation: `Total wall area = ${area.toFixed(2)} square meters`,
      explanation: "Wall area in square meters"
    },
    {
      title: "🧱 Step 3: Brick Count",
      formula: "Bricks = Area ÷ Brick Area",
      calculation: `${area.toFixed(2)} ÷ ${(standardBrickArea).toFixed(4)} = ${Math.ceil(brickCount)}`,
      explanation: `Number of standard bricks (225×75mm) required including wastage allowance`
    }
  ];
  
  return {
    result: area,
    unit: 'm²',
    bricks: Math.ceil(brickCount),
    steps: steps,
    code: 'SMM7: Brickwork'
  };
}

export function calculatePlasterArea(length, height) {
  const area = length * height;
  
  const steps = [
    {
      title: "🎨 Step 1: Plaster Area Formula",
      formula: "Area = Length × Height",
      calculation: `Area = ${length} × ${height}`,
      explanation: "Calculate plaster area for wall or ceiling finishing"
    },
    {
      title: "📏 Step 2: Calculate Area",
      formula: `${length} × ${height} = ${area.toFixed(2)}`,
      calculation: `Total plaster area = ${area.toFixed(2)} square meters`,
      explanation: "Plaster area in square meters for material calculation"
    }
  ];
  
  return {
    result: area,
    unit: 'm²',
    steps: steps,
    code: 'SMM7: Plastering'
  };
}

export function displayCalculationSteps(calculation, container) {
  // Clear previous content
  container.innerHTML = '';
  
  // Add header
  const header = document.createElement('div');
  header.className = 'card__header';
  header.innerHTML = `
    <div class="card__title">${calculation.code}</div>
    <div class="card__subtitle">Step-by-step calculation with professional QS methodology</div>
  `;
  container.appendChild(header);
  
  // Add body with steps
  const body = document.createElement('div');
  body.className = 'card__body';
  
  calculation.steps.forEach((step, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'calculation-step';
    stepDiv.style.cssText = `
      margin-bottom: 20px;
      padding: 16px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
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
  
  // Add final result
  const resultDiv = document.createElement('div');
  resultDiv.className = 'calculation-result';
  resultDiv.style.cssText = `
    padding: 20px;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: white;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    font-size: 18px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin-top: 16px;
  `;
  resultDiv.innerHTML = `
    🎯 Final Result: ${calculation.result.toFixed(2)} ${calculation.unit}
  `;
  body.appendChild(resultDiv);
  
  container.appendChild(body);
}
