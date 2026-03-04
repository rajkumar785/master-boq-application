import { ui } from '../ui.js';
import { store } from '../storage.js';
import { progressEngine } from '../workflows/progress.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function progressView(){
  const s = store.getState();
  const projectId = s.activeProjectId;

  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Progress Tracking' }),
    ui.el('div', { class:'card__subtitle', text:'Track planned vs completed quantities and compute progress percentage.' })
  ]));

  const body = ui.el('div', { class:'card__body' });

  if(!projectId){
    body.appendChild(ui.el('div', { class:'badge', text:'Select an active project first.' }));
    card.appendChild(body);
    return card;
  }

  progressEngine.ensure(projectId);

  const summaryEl = ui.el('div', { class:'grid', style:'gap:8px' });
  const bar = ui.el('div', { class:'progressbar' }, [
    ui.el('div', { class:'progressbar__fill', style:'width:0%' })
  ]);

  const wrap = ui.el('div', { class:'table-wrap' });
  const table = ui.el('table', { class:'table' });
  wrap.appendChild(table);

  body.appendChild(summaryEl);
  body.appendChild(ui.el('div', { style:'height:12px' }));
  body.appendChild(bar);
  body.appendChild(ui.el('div', { style:'height:12px' }));
  body.appendChild(wrap);

  function rebuild(){
    const st = store.getState();
    const lines = st.boq?.[projectId]?.lines || [];
    const completed = st.progress?.[projectId]?.completed || {};

    const sum = progressEngine.getSummary(projectId);
    summaryEl.innerHTML = '';
    summaryEl.appendChild(ui.el('div', { class:'badge', text:`Planned Total Qty: ${sum.plannedTotal.toFixed(3)}` }));
    summaryEl.appendChild(ui.el('div', { class:'badge', text:`Completed Total Qty: ${sum.completedTotal.toFixed(3)}` }));
    summaryEl.appendChild(ui.el('div', { class:'badge', text:`Progress: ${sum.pct.toFixed(1)}%` }));

    const fill = bar.querySelector('.progressbar__fill');
    fill.style.width = `${Math.max(0, Math.min(100, sum.pct))}%`;

    table.innerHTML = '';
    table.appendChild(ui.el('thead', {}, [
      ui.el('tr', {}, [
        ui.el('th', { text:'Description' }),
        ui.el('th', { text:'Unit' }),
        ui.el('th', { text:'Planned Qty' }),
        ui.el('th', { text:'Completed Qty' }),
        ui.el('th', { text:'%' })
      ])
    ]));

    const tbody = ui.el('tbody');
    for(const l of lines){
      if(l.type !== 'item') continue;
      const planned = toNum(l.qty);
      const compInp = ui.el('input', { type:'number', step:'0.001', value: String(completed[l.id] ?? 0) });
      compInp.addEventListener('change', () => progressEngine.setCompleted(projectId, l.id, compInp.value));

      const comp = toNum(completed[l.id] ?? 0);
      const pct = planned > 0 ? (Math.min(comp, planned) / planned) * 100 : 0;

      tbody.appendChild(ui.el('tr', {}, [
        ui.el('td', { text: l.description || '' }),
        ui.el('td', { text: l.unit || '' }),
        ui.el('td', { text: planned.toFixed(3) }),
        ui.el('td', {}, [compInp]),
        ui.el('td', { text: `${pct.toFixed(1)}%` })
      ]));
    }

    table.appendChild(tbody);
  }

  rebuild();
  store.subscribe(rebuild);

  card.appendChild(body);
  return card;
}
