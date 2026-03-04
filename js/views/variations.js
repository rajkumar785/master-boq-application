import { ui } from '../ui.js';
import { store } from '../storage.js';
import { variationsEngine } from '../workflows/variations.js';

function money(n){
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function variationsView(){
  const s = store.getState();
  const projectId = s.activeProjectId;

  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Variation Management' }),
    ui.el('div', { class:'card__subtitle', text:'Set a baseline BOQ snapshot, then compare revised quantities and costs.' })
  ]));

  const body = ui.el('div', { class:'card__body' });

  if(!projectId){
    body.appendChild(ui.el('div', { class:'badge', text:'Select an active project first.' }));
    card.appendChild(body);
    return card;
  }

  variationsEngine.ensure(projectId);

  const btnBaseline = ui.el('button', { class:'btn', type:'button', text:'Set Baseline (Snapshot)' });
  const baselineInfo = ui.el('div', { class:'badge', text:'Baseline: not set' });
  const totalInfo = ui.el('div', { class:'badge', text:'Variation Total: 0.00' });

  const wrap = ui.el('div', { class:'table-wrap' });
  const table = ui.el('table', { class:'table' });
  wrap.appendChild(table);

  btnBaseline.addEventListener('click', () => {
    variationsEngine.setBaseline(projectId);
    alert('Baseline snapshot saved. Any BOQ changes will show as variations.');
  });

  body.appendChild(ui.el('div', { class:'row' }, [btnBaseline, baselineInfo, totalInfo]));
  body.appendChild(ui.el('div', { style:'height:12px' }));
  body.appendChild(wrap);

  function rebuild(){
    const { rows, totalCost, baselineAt } = variationsEngine.getRows(projectId);
    baselineInfo.textContent = `Baseline: ${baselineAt ? baselineAt : 'not set'}`;
    totalInfo.textContent = `Variation Total: ${money(totalCost)}`;

    table.innerHTML = '';
    table.appendChild(ui.el('thead', {}, [
      ui.el('tr', {}, [
        ui.el('th', { text:'Description' }),
        ui.el('th', { text:'Unit' }),
        ui.el('th', { text:'Original Qty' }),
        ui.el('th', { text:'Revised Qty' }),
        ui.el('th', { text:'Difference' }),
        ui.el('th', { text:'Rate' }),
        ui.el('th', { text:'Variation Cost' })
      ])
    ]));

    const tbody = ui.el('tbody');
    for(const r of rows){
      tbody.appendChild(ui.el('tr', {}, [
        ui.el('td', { text: r.description || '' }),
        ui.el('td', { text: r.unit || '' }),
        ui.el('td', { text: r.originalQty.toFixed(3) }),
        ui.el('td', { text: r.revisedQty.toFixed(3) }),
        ui.el('td', { text: r.diff.toFixed(3) }),
        ui.el('td', { text: money(r.rate) }),
        ui.el('td', { text: money(r.cost) })
      ]));
    }
    table.appendChild(tbody);
  }

  rebuild();
  store.subscribe(rebuild);

  card.appendChild(body);
  return card;
}
