/**
 * Educational Rate Analysis Display
 * Shows step-by-step professional QS rate build-up calculations
 */

export function displayRateCalculationSteps(totals, container) {
  // Clear previous content
  container.innerHTML = '';
  
  // Add header
  const header = document.createElement('div');
  header.className = 'card__header';
  header.innerHTML = `
    <div class="card__title">🧮 Professional Rate Analysis Calculation</div>
    <div class="card__subtitle">Easy-to-follow table format for beginners</div>
  `;
  container.appendChild(header);
  
  // Add body with table format
  const body = document.createElement('div');
  body.className = 'card__body';
  
  // Create calculation table
  const calcTable = document.createElement('table');
  calcTable.className = 'table';
  calcTable.style.cssText = `
    margin-bottom: 20px;
    border: 2px solid var(--primary);
    border-radius: 8px;
    overflow: hidden;
  `;
  
  calcTable.innerHTML = `
    <thead>
      <tr style="background: var(--primary); color: white;">
        <th style="padding: 12px; text-align: left;">📊 Step</th>
        <th style="padding: 12px; text-align: left;">📝 Description</th>
        <th style="padding: 12px; text-align: left;">🧮 Formula</th>
        <th style="padding: 12px; text-align: left;">📈 Calculation</th>
        <th style="padding: 12px; text-align: right;">💰 Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background: var(--panel);">
        <td style="padding: 12px; font-weight: 600; color: var(--primary);">1</td>
        <td style="padding: 12px;">📦 Materials Cost</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">Sum of all materials</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">${totals.mat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: #3b82f6;">${totals.mat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
      <tr style="background: var(--bg);">
        <td style="padding: 12px; font-weight: 600; color: var(--primary);">2</td>
        <td style="padding: 12px;">👷 Labour Cost</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">Sum of all labour</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">${totals.lab.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: #10b981;">${totals.lab.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
      <tr style="background: var(--panel);">
        <td style="padding: 12px; font-weight: 600; color: var(--primary);">3</td>
        <td style="padding: 12px;">🏗 Equipment Cost</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">Sum of all equipment</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">${totals.plant.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: #f59e0b;">${totals.plant.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
      <tr style="background: var(--bg); border-top: 2px solid var(--border);">
        <td style="padding: 12px; font-weight: 600; color: var(--primary);">4</td>
        <td style="padding: 12px; font-weight: 600;">📊 Direct Cost</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">Materials + Labour + Equipment</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">${totals.mat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.lab.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.plant.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 12px; text-align: right; font-weight: 700; color: var(--primary);">${totals.direct.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
  `;
  
  // Add waste row if applicable
  if (totals.waste > 0) {
    const wastePercentage = ((totals.waste / totals.direct) * 100).toFixed(1);
    calcTable.innerHTML += `
      <tr style="background: var(--panel);">
        <td style="padding: 12px; font-weight: 600; color: var(--primary);">5</td>
        <td style="padding: 12px;">🔄 Material Waste</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">Direct Cost × ${wastePercentage}%</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">${totals.direct.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${wastePercentage}%</td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: #ef4444;">${totals.waste.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
      <tr style="background: var(--bg); border-top: 2px solid var(--border);">
        <td style="padding: 12px; font-weight: 600; color: var(--primary);">6</td>
        <td style="padding: 12px; font-weight: 600;">📈 Subtotal</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">Direct Cost + Waste</td>
        <td style="padding: 12px; font-family: monospace; font-size: 13px;">${totals.direct.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.waste.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 12px; text-align: right; font-weight: 700; color: var(--primary);">${totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
    `;
  }
  
  // Add overhead row
  const overheadPercentage = ((totals.overhead / totals.subTotal) * 100).toFixed(1);
  calcTable.innerHTML += `
    <tr style="background: var(--panel);">
      <td style="padding: 12px; font-weight: 600; color: var(--primary);">${totals.waste > 0 ? '7' : '5'}</td>
      <td style="padding: 12px;">🏢 Overhead</td>
      <td style="padding: 12px; font-family: monospace; font-size: 13px;">Subtotal × ${overheadPercentage}%</td>
      <td style="padding: 12px; font-family: monospace; font-size: 13px;">${totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${overheadPercentage}%</td>
      <td style="padding: 12px; text-align: right; font-weight: 600; color: #8b5cf6;">${totals.overhead.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
  `;
  
  // Add profit row
  const profitPercentage = ((totals.profit / (totals.subTotal + totals.overhead)) * 100).toFixed(1);
  calcTable.innerHTML += `
    <tr style="background: var(--bg);">
      <td style="padding: 12px; font-weight: 600; color: var(--primary);">${totals.waste > 0 ? '8' : '6'}</td>
      <td style="padding: 12px;">💰 Profit</td>
      <td style="padding: 12px; font-family: monospace; font-size: 13px;">(Subtotal + Overhead) × ${profitPercentage}%</td>
      <td style="padding: 12px; font-family: monospace; font-size: 13px;">(${totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.overhead.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × ${profitPercentage}%</td>
      <td style="padding: 12px; text-align: right; font-weight: 600; color: #06b6d4;">${totals.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
  `;
  
  // Add final rate row
  calcTable.innerHTML += `
    <tr style="background: linear-gradient(135deg, var(--primary), var(--primary-2)); color: white; border-top: 3px solid white;">
      <td style="padding: 16px; font-weight: 700; font-size: 16px;">🎯</td>
      <td style="padding: 16px; font-weight: 700; font-size: 16px;">FINAL RATE</td>
      <td style="padding: 16px; font-family: monospace; font-size: 14px;">Subtotal + Overhead + Profit</td>
      <td style="padding: 16px; font-family: monospace; font-size: 14px;">${totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.overhead.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="padding: 16px; text-align: right; font-weight: 700; font-size: 18px;">${totals.finalRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
  `;
  
  calcTable.innerHTML += '</tbody>';
  body.appendChild(calcTable);
  
  // Add beginner-friendly explanation section
  const explanationDiv = document.createElement('div');
  explanationDiv.className = 'card';
  explanationDiv.style.cssText = 'margin-top: 20px;';
  explanationDiv.innerHTML = `
    <div class="card__header">
      <div class="card__title">📚 Beginner's Guide to Rate Analysis</div>
      <div class="card__subtitle">Understanding each step in simple terms</div>
    </div>
    <div class="card__body">
      <div style="display: grid; gap: 12px;">
        <div style="padding: 12px; background: var(--panel); border-radius: 6px; border-left: 4px solid #3b82f6;">
          <div style="font-weight: 600; color: #3b82f6; margin-bottom: 4px;">📦 Materials Cost</div>
          <div style="font-size: 13px; color: var(--muted);">Cost of all raw materials needed for one unit of work (cement, steel, bricks, etc.)</div>
        </div>
        <div style="padding: 12px; background: var(--panel); border-radius: 6px; border-left: 4px solid #10b981;">
          <div style="font-weight: 600; color: #10b981; margin-bottom: 4px;">👷 Labour Cost</div>
          <div style="font-size: 13px; color: var(--muted);">Wages for workers to complete one unit of work (masons, carpenters, laborers)</div>
        </div>
        <div style="padding: 12px; background: var(--panel); border-radius: 6px; border-left: 4px solid #f59e0b;">
          <div style="font-weight: 600; color: #f59e0b; margin-bottom: 4px;">🏗 Equipment Cost</div>
          <div style="font-size: 13px; color: var(--muted);">Cost of machines and tools used (mixers, vibrators, scaffolding)</div>
        </div>
        <div style="padding: 12px; background: var(--panel); border-radius: 6px; border-left: 4px solid #ef4444;">
          <div style="font-weight: 600; color: #ef4444; margin-bottom: 4px;">🔄 Material Waste</div>
          <div style="font-size: 13px; color: var(--muted);">Extra material for cutting, breakage, and transport losses (typically 3-10%)</div>
        </div>
        <div style="padding: 12px; background: var(--panel); border-radius: 6px; border-left: 4px solid #8b5cf6;">
          <div style="font-weight: 600; color: #8b5cf6; margin-bottom: 4px;">🏢 Overhead</div>
          <div style="font-size: 13px; color: var(--muted);">Site expenses like supervision, office, safety, tools, and utilities (10-15%)</div>
        </div>
        <div style="padding: 12px; background: var(--panel); border-radius: 6px; border-left: 4px solid #06b6d4;">
          <div style="font-weight: 600; color: #06b6d4; margin-bottom: 4px;">💰 Profit</div>
          <div style="font-size: 13px; color: var(--muted);">Contractor's profit margin for business risk and investment return (8-15%)</div>
        </div>
      </div>
    </div>
  `;
  body.appendChild(explanationDiv);
  
  container.appendChild(body);
}

export function createRateCalculationDisplay(totals) {
  const container = document.createElement('div');
  container.className = 'rate-calculation-display';
  container.style.cssText = `
    margin-top: 20px;
  `;
  
  displayRateCalculationSteps(totals, container);
  
  return container;
}
