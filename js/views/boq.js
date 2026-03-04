import { ui } from '../ui.js';
import { store } from '../storage.js';
import { boqEngine } from '../workflows/boq.js';

export async function boqView(){
  const state = store.getState();
  const projectId = state.activeProjectId;

  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'BOQ Generator' }),
    ui.el('div', { class:'card__subtitle', text:'Excel-style editable BOQ with section totals and grand total.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  if(!projectId){
    body.appendChild(ui.el('div', { class:'badge', text:'Create/select an active project first (Project Management).' }));
    card.appendChild(body);
    return card;
  }

  const btnAdd = ui.el('button', { class:'btn', type:'button', text:'Add Line Item' });
  const btnAddSection = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Add Section Header' });
  const totals = ui.el('div', { class:'row' }, [
    ui.el('span', { class:'badge', id:'boqGrandTotal', text:'Grand Total: 0.00' })
  ]);

  const actions = ui.el('div', { class:'row' }, [btnAdd, btnAddSection, totals]);
  body.appendChild(actions);
  body.appendChild(ui.el('div', { style:'height:12px' }));

  const wrap = ui.el('div', { class:'table-wrap' });
  const table = ui.el('table', { class:'table', id:'boqTable' });
  wrap.appendChild(table);
  body.appendChild(wrap);

  card.appendChild(body);

  const api = boqEngine.mount({ projectId, tableEl: table, grandTotalEl: document.getElementById('boqGrandTotal') });
  btnAdd.addEventListener('click', () => api.addItem());
  btnAddSection.addEventListener('click', () => api.addSection());

  return card;
}
