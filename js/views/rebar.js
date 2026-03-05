import { ui } from '../ui.js';
import { store } from '../storage.js';
import { rebarEngine } from '../workflows/rebar.js';
import { calculateReinforcementWeight, displayCalculationSteps } from '../workflows/educational-calculations.js';

export async function rebarView(){
  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Reinforcement Bar Schedule' }),
    ui.el('div', { class:'card__subtitle', text:'BS 8666 beginner mode: pick a shape code, enter dimensions, and get cutting length + weight.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  const mountEl = ui.el('div');
  const calculationContainer = ui.el('div', { id: 'rebarCalculation', style: 'display: none;' });
  
  body.appendChild(mountEl);
  body.appendChild(ui.el('div', { style:'height:20px;' }));
  body.appendChild(calculationContainer);
  card.appendChild(body);

  const s = store.getState();
  const projectId = s.activeProjectId;
  if(!projectId){
    mountEl.appendChild(ui.el('div', { class:'badge', text:'Select an active project first.' }));
    return card;
  }

  rebarEngine.mount({ rootEl: mountEl, projectId });
  
  // Add educational calculation display
  const originalAddBar = rebarEngine.addBar;
  rebarEngine.addBar = function(bar) {
    const result = originalAddBar.call(this, bar);
    
    // Show educational calculation for this bar
    if (bar.diameter && bar.length) {
      calculationContainer.style.display = 'block';
      calculationContainer.className = 'card';
      
      const calculation = calculateReinforcementWeight(bar.diameter, bar.length);
      displayCalculationSteps(calculation, calculationContainer);
    }
    
    return result;
  };
  return card;
}
