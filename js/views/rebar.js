import { ui } from '../ui.js';
import { store } from '../storage.js';
import { rebarEngine } from '../workflows/rebar.js';
import { calculateReinforcementWeight, displayReinforcementCalculation } from '../workflows/educational-calculations.js';
import { 
  REINFORCEMENT_SHAPES, 
  displayShapeSelection, 
  displayShapeCalculator, 
  generateBarBendingSchedule 
} from '../workflows/reinforcement-shapes.js';

export async function rebarView(){
  const state = store.getState();
  const projectId = state.activeProjectId;

  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:' Reinforcement Bar Scheduler' }),
    ui.el('div', { class:'card__subtitle', text:'Professional bar bending schedule with shape selection and weight calculations' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  if(!projectId){
    body.appendChild(ui.el('div', { class:'badge', text:'Create/select an active project first (Project Management).' }));
    card.appendChild(body);
    return card;
  }

  // Shape selection section
  const shapeSection = ui.el('div', { class:'card', style:'margin-bottom: 16px;' });
  const shapeHeader = ui.el('div', { class:'card__header' });
  shapeHeader.innerHTML = `
    <div class="card__title"> Select Bar Shape</div>
    <div class="card__subtitle">Choose from standard reinforcement bar shapes</div>
  `;
  shapeSection.appendChild(shapeHeader);
  
  const shapeContainer = ui.el('div', { class:'card__body', id: 'shapeSelectionContainer' });
  shapeSection.appendChild(shapeContainer);
  body.appendChild(shapeSection);

  // Calculator section
  const calculatorSection = ui.el('div', { class:'card', style:'margin-bottom: 16px;' });
  const calculatorHeader = ui.el('div', { class:'card__header' });
  calculatorHeader.innerHTML = `
    <div class="card__title"> Bar Calculator</div>
    <div class="card__subtitle">Enter dimensions and calculate bar length & weight</div>
  `;
  calculatorSection.appendChild(calculatorHeader);
  
  const calculatorContainer = ui.el('div', { class:'card__body', id: 'calculatorContainer' });
  calculatorContainer.innerHTML = `
    <div style="text-align: center; padding: 40px; color: var(--muted);">
      <div style="font-size: 48px; margin-bottom: 16px;"></div>
      <div>Select a bar shape above to start calculating</div>
    </div>
  `;
  calculatorSection.appendChild(calculatorContainer);
  body.appendChild(calculatorSection);

  // Results section
  const resultsSection = ui.el('div', { class:'card', style:'margin-bottom: 16px;' });
  const resultsHeader = ui.el('div', { class:'card__header' });
  resultsHeader.innerHTML = `
    <div class="card__title"> Bar Bending Schedule</div>
    <div class="card__subtitle">Calculated bar lengths, weights, and quantities</div>
  `;
  resultsSection.appendChild(resultsHeader);
  
  const resultsContainer = ui.el('div', { class:'card__body', id: 'resultsContainer' });
  resultsContainer.innerHTML = '';
  resultsSection.appendChild(resultsContainer);
  body.appendChild(resultsSection);

  // Educational calculation display
  const educationalSection = ui.el('div', { class:'card', style:'margin-bottom: 16px;' });
  const educationalHeader = ui.el('div', { class:'card__header' });
  educationalHeader.innerHTML = `
    <div class="card__title"> Educational Calculation Steps</div>
    <div class="card__subtitle">Learn the formulas and step-by-step calculations</div>
  `;
  educationalSection.appendChild(educationalHeader);
  
  const educationalContainer = ui.el('div', { class:'card__body', id: 'educationalContainer' });
  educationalContainer.innerHTML = '';
  educationalSection.appendChild(educationalContainer);
  body.appendChild(educationalSection);

  card.appendChild(body);

  // Initialize shape selection
  let selectedShape = null;
  let scheduleData = [];

  displayShapeSelection(shapeContainer, (shapeKey, shapeData) => {
    selectedShape = shapeKey;
    displayShapeCalculator(shapeKey, calculatorContainer, (schedule) => {
      scheduleData.push(schedule);
      displayResults();
      displayEducationalCalculation(schedule);
    });
  });

  function displayResults() {
    resultsContainer.innerHTML = '';
    
    if (scheduleData.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--muted);">
          <div style="font-size: 48px; margin-bottom: 16px;"></div>
          <div>No calculations yet. Select a shape and calculate to see results.</div>
        </div>
      `;
      return;
    }

    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Shape</th>
          <th>Code</th>
          <th>Ø (mm)</th>
          <th>Length (m)</th>
          <th>Weight (kg)</th>
          <th>Qty</th>
          <th>Total Weight (kg)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${scheduleData.map((item, index) => `
          <tr>
            <td><strong>${item.shape}</strong></td>
            <td>${item.code}</td>
            <td>${item.barDiameter}</td>
            <td>${item.length.toFixed(3)}</td>
            <td>${item.weight.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td><strong>${item.totalWeight.toFixed(2)}</strong></td>
            <td>
              <button class="btn btn--danger btn--small" onclick="removeScheduleItem(${index})">
                × Remove
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    resultsContainer.appendChild(table);
    
    // Add total summary
    const totalWeight = scheduleData.reduce((sum, item) => sum + item.totalWeight, 0);
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'card';
    summaryDiv.style.cssText = 'margin-top: 16px; background: linear-gradient(135deg, var(--primary), var(--primary-2)); color: white;';
    summaryDiv.innerHTML = `
      <div class="card__header">
        <div class="card__title" style="color: white;"> Schedule Summary</div>
      </div>
      <div class="card__body">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; text-align: center;">
          <div>
            <div style="font-size: 12px; opacity: 0.8;">Total Items</div>
            <div style="font-size: 24px; font-weight: 700;">${scheduleData.length}</div>
          </div>
          <div>
            <div style="font-size: 12px; opacity: 0.8;">Total Quantity</div>
            <div style="font-size: 24px; font-weight: 700;">${scheduleData.reduce((sum, item) => sum + item.quantity, 0)}</div>
          </div>
          <div>
            <div style="font-size: 12px; opacity: 0.8;">Total Weight (kg)</div>
            <div style="font-size: 24px; font-weight: 700;">${totalWeight.toFixed(2)}</div>
          </div>
        </div>
      </div>
    `;
    resultsContainer.appendChild(summaryDiv);
  }

  function displayEducationalCalculation(schedule) {
    educationalContainer.innerHTML = '';
    
    // Create educational calculation display
    const calcData = {
      barDiameter: schedule.barDiameter,
      length: schedule.length,
      quantity: schedule.quantity,
      totalWeight: schedule.totalWeight,
      shape: schedule.shape,
      formula: schedule.formula
    };
    
    displayReinforcementCalculation(calcData, educationalContainer);
  }

  // Make remove function global
  window.removeScheduleItem = (index) => {
    scheduleData.splice(index, 1);
    displayResults();
  };

  return card;
}
