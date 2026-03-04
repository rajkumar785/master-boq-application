import { ui } from '../ui.js';
import { store } from '../storage.js';
import { worksheet } from './worksheet.js';

function money(n){
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ensureProjectBoq(state, projectId){
  state.boq = state.boq || {};
  if(!state.boq[projectId]){
    state.boq[projectId] = {
      lines: [
        { id: store.uid('sec'), type:'section', section:'Groundworks' },
        { id: store.uid('item'), type:'item', itemNo:'1', description:'Excavation to reduce levels', unit:'m³', qty:10, rate:25 },
        { id: store.uid('item'), type:'item', itemNo:'2', description:'Backfilling and compaction', unit:'m³', qty:8, rate:18 }
      ]
    };
  }
}

function calcAmount(line){
  return (Number(line.qty || 0) * Number(line.rate || 0));
}

function rebuild({ projectId, tableEl, grandTotalEl }){
  const state = store.getState();
  const lines = state.boq?.[projectId]?.lines || [];

  tableEl.innerHTML = '';

  tableEl.appendChild(ui.el('thead', {}, [
    ui.el('tr', {}, [
      ui.el('th', { text:'Item No.' }),
      ui.el('th', { text:'Description' }),
      ui.el('th', { text:'Unit' }),
      ui.el('th', { text:'Quantity' }),
      ui.el('th', { text:'Rate' }),
      ui.el('th', { text:'Amount' }),
      ui.el('th', { text:'Actions' })
    ])
  ]));

  const tbody = ui.el('tbody');
  let grand = 0;

  lines.forEach((line, idx) => {
    if(line.type === 'section'){
      const tr = ui.el('tr');
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text: line.section || 'Section', style:'font-weight:700' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text:'' }));
      const actions = ui.el('div', { class:'row row--end' }, [
        ui.el('button', { class:'btn btn--danger', type:'button', text:'Remove', onclick: () => removeLine(projectId, idx, { tableEl, grandTotalEl }) })
      ]);
      tr.appendChild(ui.el('td', {}, [actions]));
      tbody.appendChild(tr);
      return;
    }

    const amount = calcAmount(line);
    grand += amount;

    const tr = ui.el('tr');

    const itemNo = ui.el('input', { value: line.itemNo ?? '' });
    const desc = ui.el('input', { value: line.description ?? '' });
    const unit = ui.el('input', { value: line.unit ?? '' });
    const qty = ui.el('input', { value: String(line.qty ?? 0), type:'number', step:'0.001' });
    const rate = ui.el('input', { value: String(line.rate ?? 0), type:'number', step:'0.01' });

    function commit(){
      store.update(s => {
        const l = s.boq?.[projectId]?.lines?.[idx];
        if(!l) return s;
        l.itemNo = itemNo.value;
        l.description = desc.value;
        l.unit = unit.value;
        l.qty = Number(qty.value || 0);
        l.rate = Number(rate.value || 0);
        return s;
      });
      rebuild({ projectId, tableEl, grandTotalEl });
    }

    [itemNo, desc, unit, qty, rate].forEach(inp => inp.addEventListener('change', commit));

    tr.appendChild(ui.el('td', {}, [itemNo]));
    tr.appendChild(ui.el('td', {}, [desc]));
    tr.appendChild(ui.el('td', {}, [unit]));
    tr.appendChild(ui.el('td', {}, [qty]));
    tr.appendChild(ui.el('td', {}, [rate]));
    tr.appendChild(ui.el('td', { text: money(amount) }));

    const btnWorksheet = ui.el('button', {
      class:'btn btn--secondary',
      type:'button',
      text:'Worksheet',
      onclick: () => worksheet.open({
        projectId,
        lineId: line.id,
        lineDescription: line.description,
        unit: line.unit
      })
    });

    const btnRemove = ui.el('button', { class:'btn btn--danger', type:'button', text:'Remove', onclick: () => removeLine(projectId, idx, { tableEl, grandTotalEl }) });

    const actions = ui.el('div', { class:'row row--end' }, [
      btnWorksheet,
      btnRemove
    ]);
    tr.appendChild(ui.el('td', {}, [actions]));

    tbody.appendChild(tr);
  });

  tableEl.appendChild(tbody);
  grandTotalEl.textContent = `Grand Total: ${money(grand)}`;
}

function removeLine(projectId, idx, { tableEl, grandTotalEl }){
  store.update(s => {
    s.boq[projectId].lines.splice(idx, 1);
    return s;
  });
  rebuild({ projectId, tableEl, grandTotalEl });
}

export const boqEngine = {
  mount({ projectId, tableEl, grandTotalEl }){
    store.update(s => {
      ensureProjectBoq(s, projectId);
      return s;
    });

    rebuild({ projectId, tableEl, grandTotalEl });

    return {
      addItem(){
        store.update(s => {
          ensureProjectBoq(s, projectId);
          s.boq[projectId].lines.push({
            id: store.uid('item'),
            type:'item',
            itemNo: String((s.boq[projectId].lines.filter(l => l.type==='item').length || 0) + 1),
            description:'',
            unit:'',
            qty:0,
            rate:0
          });
          return s;
        });
        rebuild({ projectId, tableEl, grandTotalEl });
      },
      addSection(){
        store.update(s => {
          ensureProjectBoq(s, projectId);
          s.boq[projectId].lines.push({ id: store.uid('sec'), type:'section', section:'New Section' });
          return s;
        });
        rebuild({ projectId, tableEl, grandTotalEl });
      }
    };
  }
};
