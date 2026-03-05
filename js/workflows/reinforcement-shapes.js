/**
 * Professional Reinforcement Bar Shape System
 * Standard shapes used in reinforcement scheduling and detailing
 */

export const REINFORCEMENT_SHAPES = {
  // Straight Bars
  straight: {
    name: 'Straight Bar',
    code: '00',
    description: 'Straight reinforcement bar',
    dimensions: ['length'],
    formula: 'L = Length',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '━',
    example: 'L = 6.0m'
  },
  
  // L-Shaped Bars
  l_shape: {
    name: 'L-Shape Bar',
    code: '01',
    description: '90° bent bar with one leg',
    dimensions: ['length1', 'length2', 'diameter'],
    formula: 'L = L1 + L2 + (π × D × 90° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '┗',
    example: 'L = 2.5m + 1.2m + (π × 0.016 × 90° ÷ 360°) = 3.71m'
  },
  
  // U-Shaped Bars
  u_shape: {
    name: 'U-Shape Bar',
    code: '02',
    description: 'U-shaped bar with two legs',
    dimensions: ['length1', 'length2', 'length3', 'diameter'],
    formula: 'L = L1 + 2×L2 + (π × D × 180° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '∪',
    example: 'L = 1.5m + 2×0.8m + (π × 0.016 × 180° ÷ 360°) = 3.13m'
  },
  
  // Rectangular Stirrups
  rectangular_stirrup: {
    name: 'Rectangular Stirrup',
    code: '03',
    description: 'Rectangular closed stirrup',
    dimensions: ['width', 'height', 'diameter'],
    formula: 'L = 2×(W + H) + 2×(π × D × 135° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '□',
    example: 'L = 2×(0.3m + 0.5m) + 2×(π × 0.008 × 135° ÷ 360°) = 1.62m'
  },
  
  // Circular Stirrups
  circular_stirrup: {
    name: 'Circular Stirrup',
    code: '04',
    description: 'Circular closed stirrup',
    dimensions: ['diameter', 'bar_diameter'],
    formula: 'L = π × (D - 2×cover)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '○',
    example: 'L = π × (0.4m - 2×0.025m) = 1.10m'
  },
  
  // Crank Bars
  crank: {
    name: 'Crank Bar',
    code: '05',
    description: 'Bar with 45° crank for slab reinforcement',
    dimensions: ['length1', 'length2', 'length3', 'diameter'],
    formula: 'L = L1 + L2 + L3 + 2×(π × D × 45° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '⌒',
    example: 'L = 1.2m + 0.5m + 1.2m + 2×(π × 0.016 × 45° ÷ 360°) = 2.93m'
  },
  
  // Hook Bar
  hook: {
    name: 'Hook Bar',
    code: '06',
    description: 'Bar with 180° hook at end',
    dimensions: ['length', 'diameter'],
    formula: 'L = L + (π × D × 180° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '┐',
    example: 'L = 3.0m + (π × 0.016 × 180° ÷ 360°) = 3.03m'
  },
  
  // T-Shape Bar
  t_shape: {
    name: 'T-Shape Bar',
    code: '07',
    description: 'T-shaped bar for column-beam junction',
    dimensions: ['length1', 'length2', 'length3', 'diameter'],
    formula: 'L = L1 + L2 + L3 + (π × D × 90° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '┬',
    example: 'L = 1.5m + 0.8m + 1.5m + (π × 0.016 × 90° ÷ 360°) = 3.81m'
  },
  
  // Diamond Stirrup
  diamond_stirrup: {
    name: 'Diamond Stirrup',
    code: '08',
    description: 'Diamond-shaped stirrup for shear reinforcement',
    dimensions: ['width', 'height', 'diameter'],
    formula: 'L = 2×√(W² + H²) + 2×(π × D × 135° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '◇',
    example: 'L = 2×√(0.3² + 0.5²) + 2×(π × 0.008 × 135° ÷ 360°) = 1.17m'
  },
  
  // Ladder Stirrup
  ladder_stirrup: {
    name: 'Ladder Stirrup',
    code: '09',
    description: 'Ladder-shaped stirrup for wide beams',
    dimensions: ['width', 'height', 'spacing', 'diameter'],
    formula: 'L = 2×W + H + (spacing × runs) + 4×(π × D × 135° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '▓',
    example: 'L = 2×0.6m + 0.8m + (0.15m × 3) + 4×(π × 0.008 × 135° ÷ 360°) = 2.45m'
  },
  
  // Bent-Up Bar
  bent_up: {
    name: 'Bent-Up Bar',
    code: '10',
    description: 'Bar bent up at supports for shear reinforcement',
    dimensions: ['length1', 'length2', 'length3', 'length4', 'diameter'],
    formula: 'L = L1 + L2 + L3 + L4 + 2×(π × D × 45° ÷ 360°)',
    weightFormula: 'Weight = (D² ÷ 162) × L',
    icon: '∧',
    example: 'L = 1.0m + 0.8m + 1.0m + 0.8m + 2×(π × 0.016 × 45° ÷ 360°) = 3.63m'
  }
};

export function calculateBarLength(shape, dimensions, barDiameter) {
  const shapeData = REINFORCEMENT_SHAPES[shape];
  if (!shapeData) return 0;
  
  let length = 0;
  const D = barDiameter / 1000; // Convert mm to m
  
  switch (shape) {
    case 'straight':
      length = dimensions.length || 0;
      break;
      
    case 'l_shape':
      length = (dimensions.length1 || 0) + (dimensions.length2 || 0) + 
               (Math.PI * D * 90 / 360);
      break;
      
    case 'u_shape':
      length = (dimensions.length1 || 0) + 2 * (dimensions.length2 || 0) + 
               (Math.PI * D * 180 / 360);
      break;
      
    case 'rectangular_stirrup':
      length = 2 * ((dimensions.width || 0) + (dimensions.height || 0)) + 
               2 * (Math.PI * D * 135 / 360);
      break;
      
    case 'circular_stirrup':
      length = Math.PI * ((dimensions.diameter || 0) - 2 * 0.025); // 25mm cover
      break;
      
    case 'crank':
      length = (dimensions.length1 || 0) + (dimensions.length2 || 0) + 
               (dimensions.length3 || 0) + 2 * (Math.PI * D * 45 / 360);
      break;
      
    case 'hook':
      length = (dimensions.length || 0) + (Math.PI * D * 180 / 360);
      break;
      
    case 't_shape':
      length = (dimensions.length1 || 0) + (dimensions.length2 || 0) + 
               (dimensions.length3 || 0) + (Math.PI * D * 90 / 360);
      break;
      
    case 'diamond_stirrup':
      length = 2 * Math.sqrt(Math.pow(dimensions.width || 0, 2) + Math.pow(dimensions.height || 0, 2)) + 
               2 * (Math.PI * D * 135 / 360);
      break;
      
    case 'ladder_stirrup':
      const runs = Math.floor((dimensions.width || 0) / (dimensions.spacing || 0.15));
      length = 2 * (dimensions.width || 0) + (dimensions.height || 0) + 
               ((dimensions.spacing || 0.15) * runs) + 4 * (Math.PI * D * 135 / 360);
      break;
      
    case 'bent_up':
      length = (dimensions.length1 || 0) + (dimensions.length2 || 0) + 
               (dimensions.length3 || 0) + (dimensions.length4 || 0) + 
               2 * (Math.PI * D * 45 / 360);
      break;
  }
  
  return length;
}

export function calculateBarWeight(length, barDiameter) {
  // Weight formula: (D² ÷ 162) × L
  // D = diameter in mm, L = length in m
  return (Math.pow(barDiameter, 2) / 162) * length;
}

export function generateBarBendingSchedule(shape, dimensions, barDiameter, quantity, spacing = null) {
  const shapeData = REINFORCEMENT_SHAPES[shape];
  const length = calculateBarLength(shape, dimensions, barDiameter);
  const weight = calculateBarWeight(length, barDiameter);
  const totalWeight = weight * quantity;
  
  return {
    shape: shapeData.name,
    code: shapeData.code,
    barDiameter: barDiameter,
    dimensions: dimensions,
    length: length,
    weight: weight,
    quantity: quantity,
    spacing: spacing,
    totalWeight: totalWeight,
    formula: shapeData.formula,
    example: shapeData.example
  };
}

export function displayShapeSelection(container, onShapeSelected) {
  container.innerHTML = '';
  
  const header = document.createElement('div');
  header.className = 'card__header';
  header.innerHTML = `
    <div class="card__title">🔧 Reinforcement Bar Shapes</div>
    <div class="card__subtitle">Select bar shape for scheduling and calculation</div>
  `;
  container.appendChild(header);
  
  const body = document.createElement('div');
  body.className = 'card__body';
  
  const shapeGrid = document.createElement('div');
  shapeGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
    width: 100%;
  `;
  
  Object.entries(REINFORCEMENT_SHAPES).forEach(([key, shape]) => {
    const shapeCard = document.createElement('div');
    shapeCard.className = 'card';
    shapeCard.style.cssText = `
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid var(--border);
      background: var(--panel);
      min-height: 200px;
      display: flex;
      flex-direction: column;
    `;
    
    shapeCard.innerHTML = `
      <div class="card__header" style="text-align: center; flex: 1;">
        <div style="font-size: 48px; margin-bottom: 8px;">${shape.icon}</div>
        <div class="card__title" style="font-size: 14px;">${shape.name}</div>
        <div class="card__subtitle" style="font-size: 12px;">Code: ${shape.code}</div>
      </div>
      <div class="card__body" style="padding: 12px;">
        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">${shape.description}</div>
        <div style="font-family: monospace; font-size: 11px; background: var(--bg); padding: 8px; border-radius: 4px; word-break: break-all;">
          ${shape.formula}
        </div>
      </div>
    `;
    
    shapeCard.addEventListener('click', () => {
      // Remove active state from other cards
      document.querySelectorAll('.shape-card').forEach(card => {
        card.style.borderColor = 'var(--border)';
        card.style.background = 'var(--panel)';
      });
      
      // Add active state to selected card
      shapeCard.style.borderColor = 'var(--primary)';
      shapeCard.style.background = 'var(--primary-2)';
      
      onShapeSelected(key, shape);
    });
    
    shapeCard.classList.add('shape-card');
    shapeGrid.appendChild(shapeCard);
  });
  
  body.appendChild(shapeGrid);
  container.appendChild(body);
}

export function displayShapeCalculator(shape, container, onCalculate) {
  const shapeData = REINFORCEMENT_SHAPES[shape];
  if (!shapeData) return;
  
  container.innerHTML = '';
  
  const header = document.createElement('div');
  header.className = 'card__header';
  header.innerHTML = `
    <div class="card__title">🔧 ${shapeData.name} Calculator</div>
    <div class="card__subtitle">Code: ${shapeData.code} - ${shapeData.description}</div>
  `;
  container.appendChild(header);
  
  const body = document.createElement('div');
  body.className = 'card__body';
  
  // Bar diameter selection
  const barDiameterDiv = document.createElement('div');
  barDiameterDiv.className = 'field';
  barDiameterDiv.innerHTML = `
    <label>Bar Diameter (mm)</label>
    <select id="barDiameter" class="form-control">
      <option value="8">8mm</option>
      <option value="10">10mm</option>
      <option value="12">12mm</option>
      <option value="16">16mm</option>
      <option value="20">20mm</option>
      <option value="25">25mm</option>
      <option value="32">32mm</option>
    </select>
  `;
  body.appendChild(barDiameterDiv);
  
  // Dimension inputs based on shape
  const dimensionsDiv = document.createElement('div');
  dimensionsDiv.className = 'dimensions-section';
  dimensionsDiv.style.cssText = 'display: grid; gap: 12px; margin: 16px 0;';
  
  shapeData.dimensions.forEach(dim => {
    const field = document.createElement('div');
    field.className = 'field';
    field.innerHTML = `
      <label>${dim.charAt(0).toUpperCase() + dim.slice(1)} (m)</label>
      <input type="number" id="${dim}" class="form-control" step="0.01" min="0" placeholder="Enter ${dim}">
    `;
    dimensionsDiv.appendChild(field);
  });
  
  body.appendChild(dimensionsDiv);
  
  // Quantity input
  const quantityDiv = document.createElement('div');
  quantityDiv.className = 'field';
  quantityDiv.innerHTML = `
    <label>Quantity</label>
    <input type="number" id="quantity" class="form-control" step="1" min="1" value="1" placeholder="Enter quantity">
  `;
  body.appendChild(quantityDiv);
  
  // Calculate button
  const calculateBtn = document.createElement('button');
  calculateBtn.className = 'btn btn--primary';
  calculateBtn.textContent = '🧮 Calculate Bar Length & Weight';
  calculateBtn.style.cssText = 'width: 100%; margin-top: 16px;';
  
  calculateBtn.addEventListener('click', () => {
    const barDiameter = parseFloat(document.getElementById('barDiameter').value);
    const dimensions = {};
    
    shapeData.dimensions.forEach(dim => {
      const input = document.getElementById(dim);
      if (input) {
        dimensions[dim] = parseFloat(input.value) || 0;
      }
    });
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    const schedule = generateBarBendingSchedule(shape, dimensions, barDiameter, quantity);
    onCalculate(schedule);
  });
  
  body.appendChild(calculateBtn);
  
  // Formula display
  const formulaDiv = document.createElement('div');
  formulaDiv.className = 'card';
  formulaDiv.style.cssText = 'margin-top: 16px; background: var(--panel);';
  formulaDiv.innerHTML = `
    <div class="card__header">
      <div class="card__title" style="font-size: 14px;">📐 Formula</div>
    </div>
    <div class="card__body">
      <div style="font-family: monospace; font-size: 13px; margin-bottom: 8px;">${shapeData.formula}</div>
      <div style="font-family: monospace; font-size: 13px; color: var(--muted);">${shapeData.weightFormula}</div>
      <div style="font-size: 12px; color: var(--muted); margin-top: 8px;">${shapeData.example}</div>
    </div>
  `;
  body.appendChild(formulaDiv);
  
  container.appendChild(body);
}
