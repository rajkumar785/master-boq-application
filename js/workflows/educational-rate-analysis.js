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
    <div class="card__title">Professional Rate Analysis Calculation</div>
    <div class="card__subtitle">SMM7 compliant step-by-step breakdown</div>
  `;
  container.appendChild(header);
  
  // Add body with steps
  const body = document.createElement('div');
  body.className = 'card__body';
  
  // Step 1: Direct Costs
  const directStep = document.createElement('div');
  directStep.className = 'calculation-step';
  directStep.style.cssText = `
    margin-bottom: 16px;
    padding: 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `;
  
  directStep.innerHTML = `
    <div style="font-weight: 600; color: var(--primary); margin-bottom: 12px; font-size: 16px;">
      📊 Step 1: Calculate Direct Costs
    </div>
    <div style="font-family: monospace; background: var(--bg); padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 4px solid var(--primary);">
      <strong>Formula:</strong> Direct Costs = Materials + Labour + Equipment<br>
      <strong>Calculation:</strong> ${totals.mat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.lab.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.plant.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${totals.direct.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
    <div style="font-size: 13px; color: var(--muted); line-height: 1.5;">
      💡 <strong>Explanation:</strong> Sum of all direct cost components including materials, skilled labour, unskilled labour, and equipment/plant costs.
    </div>
  `;
  body.appendChild(directStep);
  
  // Step 2: Add Waste (if applicable)
  if (totals.waste > 0) {
    const wasteStep = document.createElement('div');
    wasteStep.className = 'calculation-step';
    wasteStep.style.cssText = `
      margin-bottom: 16px;
      padding: 16px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    `;
    
    const wastePercentage = ((totals.waste / totals.direct) * 100).toFixed(1);
    
    wasteStep.innerHTML = `
      <div style="font-weight: 600; color: var(--primary); margin-bottom: 12px; font-size: 16px;">
        🔄 Step 2: Add Material Waste
      </div>
      <div style="font-family: monospace; background: var(--bg); padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 4px solid var(--primary);">
        <strong>Formula:</strong> Waste = Direct Costs × Waste Percentage<br>
        <strong>Calculation:</strong> ${totals.direct.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${wastePercentage}% = ${totals.waste.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div style="font-size: 13px; color: var(--muted); line-height: 1.5;">
        💡 <strong>Explanation:</strong> Material waste allowance for cutting, breakage, handling losses, and transportation damage. Typical rates: Concrete 3%, Bricks 5%, Plaster 8%, Steel 2%.
      </div>
    `;
    body.appendChild(wasteStep);
  }
  
  // Step 3: Calculate Subtotal
  const subtotalStep = document.createElement('div');
  subtotalStep.className = 'calculation-step';
  subtotalStep.style.cssText = `
    margin-bottom: 16px;
    padding: 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `;
  
  subtotalStep.innerHTML = `
    <div style="font-weight: 600; color: var(--primary); margin-bottom: 12px; font-size: 16px;">
      📈 Step 3: Calculate Subtotal
    </div>
    <div style="font-family: monospace; background: var(--bg); padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 4px solid var(--primary);">
      <strong>Formula:</strong> Subtotal = Direct Costs + Waste<br>
      <strong>Calculation:</strong> ${totals.direct.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.waste.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
    <div style="font-size: 13px; color: var(--muted); line-height: 1.5;">
      💡 <strong>Explanation:</strong> Subtotal represents the total direct cost before adding overhead and profit margins.
    </div>
  `;
  body.appendChild(subtotalStep);
  
  // Step 4: Add Overhead
  const overheadStep = document.createElement('div');
  overheadStep.className = 'calculation-step';
  overheadStep.style.cssText = `
    margin-bottom: 16px;
    padding: 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `;
  
  const overheadPercentage = ((totals.overhead / totals.subTotal) * 100).toFixed(1);
  
  overheadStep.innerHTML = `
    <div style="font-weight: 600; color: var(--primary); margin-bottom: 12px; font-size: 16px;">
      🏢 Step 4: Add Overhead
    </div>
    <div style="font-family: monospace; background: var(--bg); padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 4px solid var(--primary);">
      <strong>Formula:</strong> Overhead = Subtotal × Overhead Percentage<br>
      <strong>Calculation:</strong> ${totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${overheadPercentage}% = ${totals.overhead.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
    <div style="font-size: 13px; color: var(--muted); line-height: 1.5;">
      💡 <strong>Explanation:</strong> Site overhead covers supervision, temporary works, site administration, safety equipment, utilities, and general site expenses. Typical range: 10-15%.
    </div>
  `;
  body.appendChild(overheadStep);
  
  // Step 5: Add Profit
  const profitStep = document.createElement('div');
  profitStep.className = 'calculation-step';
  profitStep.style.cssText = `
    margin-bottom: 16px;
    padding: 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `;
  
  const profitPercentage = ((totals.profit / (totals.subTotal + totals.overhead)) * 100).toFixed(1);
  
  profitStep.innerHTML = `
    <div style="font-weight: 600; color: var(--primary); margin-bottom: 12px; font-size: 16px;">
      💰 Step 5: Add Profit
    </div>
    <div style="font-family: monospace; background: var(--bg); padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 4px solid var(--primary);">
      <strong>Formula:</strong> Profit = (Subtotal + Overhead) × Profit Percentage<br>
      <strong>Calculation:</strong> (${totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.overhead.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × ${profitPercentage}% = ${totals.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
    <div style="font-size: 13px; color: var(--muted); line-height: 1.5;">
      💡 <strong>Explanation:</strong> Contractor's profit margin on the project. Covers business overheads, risk, and return on investment. Typical range: 8-15%.
    </div>
  `;
  body.appendChild(profitStep);
  
  // Step 6: Final Rate
  const finalStep = document.createElement('div');
  finalStep.className = 'calculation-step';
  finalStep.style.cssText = `
    margin-bottom: 16px;
    padding: 20px;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    border: 2px solid var(--primary);
    border-radius: 8px;
    color: white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  `;
  
  finalStep.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 16px; font-size: 18px; text-align: center;">
      🎯 Step 6: Final Unit Rate
    </div>
    <div style="font-family: monospace; background: rgba(255,255,255,0.15); padding: 16px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid white;">
      <strong>Formula:</strong> Final Rate = Subtotal + Overhead + Profit<br>
      <strong>Calculation:</strong> ${totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.overhead.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${totals.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${totals.finalRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
    <div style="font-size: 20px; font-weight: 700; text-align: center; padding: 16px; background: rgba(255,255,255,0.2); border-radius: 8px; border: 2px solid white;">
      🏆 FINAL UNIT RATE = ${totals.finalRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per unit
    </div>
  `;
  body.appendChild(finalStep);
  
  // Component breakdown summary
  const breakdownDiv = document.createElement('div');
  breakdownDiv.className = 'component-breakdown';
  breakdownDiv.style.cssText = `
    margin-top: 24px;
    padding: 20px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `;
  
  const total = totals.finalRate;
  const matPercent = ((totals.mat / total) * 100).toFixed(1);
  const labPercent = ((totals.lab / total) * 100).toFixed(1);
  const plantPercent = ((totals.plant / total) * 100).toFixed(1);
  const wastePercent = ((totals.waste / total) * 100).toFixed(1);
  const overheadPercent = ((totals.overhead / total) * 100).toFixed(1);
  const profitPercent = ((totals.profit / total) * 100).toFixed(1);
  
  breakdownDiv.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 16px; color: var(--primary); font-size: 16px;">
      📊 Component Breakdown Analysis
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div style="padding: 12px; background: var(--bg); border-radius: 6px; border-left: 3px solid #3b82f6;">
        <div style="font-weight: 600; color: #3b82f6;">📦 Materials</div>
        <div style="font-size: 14px;">${matPercent}% (${totals.mat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</div>
      </div>
      <div style="padding: 12px; background: var(--bg); border-radius: 6px; border-left: 3px solid #10b981;">
        <div style="font-weight: 600; color: #10b981;">👷 Labour</div>
        <div style="font-size: 14px;">${labPercent}% (${totals.lab.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</div>
      </div>
      <div style="padding: 12px; background: var(--bg); border-radius: 6px; border-left: 3px solid #f59e0b;">
        <div style="font-weight: 600; color: #f59e0b;">🏗 Equipment</div>
        <div style="font-size: 14px;">${plantPercent}% (${totals.plant.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</div>
      </div>
      <div style="padding: 12px; background: var(--bg); border-radius: 6px; border-left: 3px solid #ef4444;">
        <div style="font-weight: 600; color: #ef4444;">♻️ Waste</div>
        <div style="font-size: 14px;">${wastePercent}% (${totals.waste.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</div>
      </div>
      <div style="padding: 12px; background: var(--bg); border-radius: 6px; border-left: 3px solid #8b5cf6;">
        <div style="font-weight: 600; color: #8b5cf6;">🏢 Overhead</div>
        <div style="font-size: 14px;">${overheadPercent}% (${totals.overhead.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</div>
      </div>
      <div style="padding: 12px; background: var(--bg); border-radius: 6px; border-left: 3px solid #06b6d4;">
        <div style="font-weight: 600; color: #06b6d4;">💰 Profit</div>
        <div style="font-size: 14px;">${profitPercent}% (${totals.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</div>
      </div>
    </div>
    <div style="padding: 16px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 8px; border: 2px solid var(--border); text-align: center;">
      <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">TOTAL COST BREAKDOWN</div>
      <div style="font-size: 16px; font-weight: 700; color: var(--text);">
        Materials: ${matPercent}% | Labour: ${labPercent}% | Equipment: ${plantPercent}% | Waste: ${wastePercent}% | Overhead: ${overheadPercent}% | Profit: ${profitPercent}%
      </div>
    </div>
  `;
  body.appendChild(breakdownDiv);
  
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
