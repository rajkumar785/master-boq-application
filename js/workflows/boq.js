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
        // A: PRELIMINARIES
        { id: store.uid('sec'), type:'section', section:'A: PRELIMINARIES' },
        { id: store.uid('item'), type:'item', itemNo:'A1', description:'Site Setup and Establishment', unit:'lump sum', qty:1, rate:150000 },
        { id: store.uid('item'), type:'item', itemNo:'A2', description:'Temporary Works and Protection', unit:'lump sum', qty:1, rate:85000 },
        
        // E: SUBSTRUCTURE
        { id: store.uid('sec'), type:'section', section:'E: SUBSTRUCTURE' },
        { id: store.uid('item'), type:'item', itemNo:'E1', description:'General Excavation by Machine', unit:'m³', qty:50, rate:85 },
        { id: store.uid('item'), type:'item', itemNo:'E2', description:'Trench Excavation for Foundations', unit:'m³', qty:25, rate:120 },
        { id: store.uid('item'), type:'item', itemNo:'E3', description:'Blinding Concrete Grade 15', unit:'m³', qty:15, rate:2500 },
        { id: store.uid('item'), type:'item', itemNo:'E4', description:'Reinforced Concrete Grade 25 - Foundations', unit:'m³', qty:40, rate:3200 },
        { id: store.uid('item'), type:'item', itemNo:'E5', description:'Reinforcement for Foundations', unit:'kg', qty:2500, rate:65 },
        { id: store.uid('item'), type:'item', itemNo:'E6', description:'Formwork for Foundations', unit:'m²', qty:120, rate:180 },
        
        // F: SUPERSTRUCTURE
        { id: store.uid('sec'), type:'section', section:'F: SUPERSTRUCTURE' },
        { id: store.uid('item'), type:'item', itemNo:'F1', description:'Reinforced Concrete Columns Grade 30', unit:'m³', qty:25, rate:3500 },
        { id: store.uid('item'), type:'item', itemNo:'F2', description:'Reinforced Concrete Beams Grade 30', unit:'m³', qty:35, rate:3400 },
        { id: store.uid('item'), type:'item', itemNo:'F3', description:'Reinforced Concrete Slab Grade 25', unit:'m³', qty:80, rate:3100 },
        { id: store.uid('item'), type:'item', itemNo:'F4', description:'Reinforcement for Slabs', unit:'kg', qty:4800, rate:65 },
        { id: store.uid('item'), type:'item', itemNo:'F5', description:'Brickwork in Cement Mortar 1:4', unit:'m²', qty:250, rate:850 },
        { id: store.uid('item'), type:'item', itemNo:'F6', description:'Concrete Blockwork in Cement Mortar 1:6', unit:'m²', qty:180, rate:650 },
        
        // G: FINISHES
        { id: store.uid('sec'), type:'section', section:'G: FINISHES' },
        { id: store.uid('item'), type:'item', itemNo:'G1', description:'Cement Plaster 12mm Thick - Walls', unit:'m²', qty:450, rate:280 },
        { id: store.uid('item'), type:'item', itemNo:'G2', description:'Cement Plaster 12mm Thick - Ceiling', unit:'m²', qty:200, rate:320 },
        { id: store.uid('item'), type:'item', itemNo:'G3', description:'Internal Emulsion Paint 2 Coats', unit:'m²', qty:650, rate:180 },
        { id: store.uid('item'), type:'item', itemNo:'G4', description:'External Weatherproof Paint 2 Coats', unit:'m²', qty:220, rate:350 },
        { id: store.uid('item'), type:'item', itemNo:'G5', description:'Ceramic Floor Tiles 300x300mm', unit:'m²', qty:180, rate:280 },
        { id: store.uid('item'), type:'item', itemNo:'G6', description:'Ceramic Wall Tiles 200x200mm', unit:'m²', qty:120, rate:320 },
        { id: store.uid('item'), type:'item', itemNo:'G7', description:'Vinyl Floor Tiles', unit:'m²', qty:150, rate:180 },
        
        // L: EXTERNAL WORKS
        { id: store.uid('sec'), type:'section', section:'L: EXTERNAL WORKS' },
        { id: store.uid('item'), type:'item', itemNo:'L1', description:'Site Clearance and Grubbing', unit:'m²', qty:500, rate:25 },
        { id: store.uid('item'), type:'item', itemNo:'L2', description:'Road Subbase Granular Material', unit:'m³', qty:120, rate:450 },
        { id: store.uid('item'), type:'item', itemNo:'L3', description:'Asphalt Paving 50mm Thick', unit:'m²', qty:300, rate:280 },
        { id: store.uid('item'), type:'item', itemNo:'L4', description:'Landscaping and Turfing', unit:'m²', qty:200, rate:85 },
        { id: store.uid('item'), type:'item', itemNo:'L5', description:'Surface Water Drainage', unit:'m', qty:80, rate:120 },
        
        // M: SERVICES
        { id: store.uid('sec'), type:'section', section:'M: SERVICES' },
        { id: store.uid('item'), type:'item', itemNo:'M1', description:'Electrical Wiring and Installation', unit:'point', qty:25, rate:850 },
        { id: store.uid('item'), type:'item', itemNo:'M2', description:'Plumbing Water Supply Installation', unit:'m', qty:150, rate:95 },
        { id: store.uid('item'), type:'item', itemNo:'M3', description:'HVAC Ducting Installation', unit:'m²', qty:80, rate:220 }
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
