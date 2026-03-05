import { ui } from '../ui.js';
import { store } from '../storage.js';
import { displayRateCalculationSteps, createRateCalculationDisplay } from '../workflows/educational-rate-analysis.js';
import { SMM7_RATE_TEMPLATES, detectSMM7Template, getAllSMM7Categories, getSMM7ItemsByCategory } from '../workflows/smm7-rate-templates.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function money(n){
  return toNum(n).toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 });
}

function ensure(projectId){
  store.update(s => {
    s.rateAnalysis = s.rateAnalysis || {};
    s.rateAnalysis[projectId] = s.rateAnalysis[projectId] || {};
    return s;
  });
}

function getBoqItems(projectId){
  const s = store.getState();
  const lines = s.boq?.[projectId]?.lines || [];
  return lines.filter(l => l.type === 'item');
}

function defaultAnalysis(){
  return {
    materials: [],
    labour: [],
    plant: [],
    wastePct: 0,
    overheadPct: 12,
    profitPct: 10
  };
}

function getAnalysis(projectId, lineId){
  const s = store.getState();
  return s.rateAnalysis?.[projectId]?.[lineId] || null;
}

function setAnalysis(projectId, lineId, analysis){
  store.update(s => {
    s.rateAnalysis = s.rateAnalysis || {};
    s.rateAnalysis[projectId] = s.rateAnalysis[projectId] || {};
    s.rateAnalysis[projectId][lineId] = analysis;
    return s;
  });
}

function rowAmount(r){
  return toNum(r.qty) * toNum(r.rate);
}

function sumRows(rows){
  return (rows || []).reduce((acc, r) => acc + rowAmount(r), 0);
}

function computeTotals(a){
  const mat = sumRows(a.materials);
  const lab = sumRows(a.labour);
  const plant = sumRows(a.plant);

  const direct = mat + lab + plant;
  const waste = direct * (toNum(a.wastePct) / 100);
  const subTotal = direct + waste;
  const overhead = subTotal * (toNum(a.overheadPct) / 100);
  const profit = (subTotal + overhead) * (toNum(a.profitPct) / 100);
  const finalRate = subTotal + overhead + profit;
  return { mat, lab, plant, direct, waste, subTotal, overhead, profit, finalRate };
}

function makeRow(){
  return { id: store.uid('ra'), desc:'', unit:'', qty: 0, rate: 0 };
}

function setRows(kindRows, items){
  kindRows.length = 0;
  items.forEach(it => {
    kindRows.push({
      id: store.uid('ra'),
      desc: String(it.desc || ''),
      unit: String(it.unit || ''),
      qty: toNum(it.qty || 0),
      rate: toNum(it.rate || 0)
    });
  });
}

function detectTemplateKey({ description, unit }){
  return detectSMM7Template(description, unit);
}

function applyTemplate(analysis, templateKey){
  if(!templateKey || templateKey === 'custom') return;
  
  const [category, item] = templateKey.split('.');
  const template = SMM7_RATE_TEMPLATES[category]?.[item];
  
  if(!template) return;
  
  // Apply template to analysis
  setRows(analysis.materials, template.materials);
  setRows(analysis.labour, template.labour);
  setRows(analysis.plant, template.plant);
  analysis.wastePct = template.wastePct;
  analysis.overheadPct = template.overheadPct;
  analysis.profitPct = template.profitPct;
}

export async function rateView(){
  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Rate Analysis' }),
    ui.el('div', { class:'card__subtitle', text:'SMM7 method: build unit rates from materials, labour, plant, waste, overheads and profit.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  const mountEl = ui.el('div');
  body.appendChild(mountEl);
  card.appendChild(body);

  const s = store.getState();
  const projectId = s.activeProjectId;
  if(!projectId){
    mountEl.appendChild(ui.el('div', { class:'badge', text:'Select an active project first.' }));
    return card;
  }

  // Start rate engine
  ensure(projectId);

  const header = ui.el('div', { class:'card' });
  header.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'SMM7 Rate Build-Up' }),
    ui.el('div', { class:'card__subtitle', text:'Select a BOQ item, add materials/labour/plant, then apply waste, overhead and profit to get the final unit rate.' })
  ]));
  const headerBody = ui.el('div', { class:'card__body' });

  const itemSel = ui.el('select');
  const itemTitle = ui.el('div', { class:'badge', text:'' });

  const templateSel = ui.el('select');
  const btnLoadTemplate = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Load Template' });

  const wastePct = ui.el('input', { type:'number', value:'0', step:'0.1', min:'0' });
  const overheadPct = ui.el('input', { type:'number', value:'12', step:'0.1', min:'0' });
  const profitPct = ui.el('input', { type:'number', value:'10', step:'0.1', min:'0' });

  const btnApplyToBoq = ui.el('button', { class:'btn btn--primary', type:'button', text:'Apply Rate to BOQ Item' });
  const btnAddMat = ui.el('button', { class:'btn', type:'button', text:'Add Material Row' });
  const btnAddLab = ui.el('button', { class:'btn', type:'button', text:'Add Labour Row' });
  const btnAddPlant = ui.el('button', { class:'btn', type:'button', text:'Add Plant Row' });

  const totalsBadge = ui.el('div', { class:'badge', text:'' });
  const finalCostBadge = ui.el('div', { class:'badge', text:'' });
  const componentBadges = ui.el('div', { class:'row', style:'gap:8px; flex-wrap:wrap; margin:12px 0;' });
  const percentBadges = ui.el('div', { class:'row', style:'gap:8px; flex-wrap:wrap; margin:12px 0;' });
  const summaryBox = ui.el('div', { class:'card', style:'margin-top:12px;' });
  const calculationDisplay = ui.el('div', { id: 'rateCalculationDisplay', style:'margin-top:20px;' });

  const wrap = ui.el('div', { class:'table-wrap' });
  const table = ui.el('table', { class:'table' });
  wrap.appendChild(table);

  function rebuildItemOptions(){
    const items = getBoqItems(projectId);
    itemSel.innerHTML = '';
    itemSel.appendChild(ui.el('option', { value:'', text:'Select BOQ item...' }));
    items.forEach(it => {
      const label = `${it.itemNo || ''} — ${it.description || ''} (${it.unit || ''})`;
      itemSel.appendChild(ui.el('option', { value: it.id, text: label }));
    });
    if(!itemSel.value && items[0]) itemSel.value = items[0].id;
  }

  function getSelectedItem(){
    const id = String(itemSel.value || '');
    if(!id) return null;
    const items = getBoqItems(projectId);
    return items.find(x => x.id === id) || null;
  }

  function ensureSelectedAnalysis(){
    const it = getSelectedItem();
    if(!it) return null;
    let a = getAnalysis(projectId, it.id);
    if(!a){
      a = defaultAnalysis();
      setAnalysis(projectId, it.id, a);
    }
    return a;
  }

  function ensureTemplateOptions(){
    templateSel.innerHTML = '';
    templateSel.appendChild(ui.el('option', { value:'custom', text:'Custom (blank)' }));
    
    // Add all SMM7 categories and items
    const categories = getAllSMM7Categories();
    categories.forEach(category => {
      const items = getSMM7ItemsByCategory(category);
      if (items.length > 0) {
        // Add category as optgroup
        const optgroup = document.createElement('optgroup');
        optgroup.label = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
        
        items.forEach(itemKey => {
          const template = SMM7_RATE_TEMPLATES[category][itemKey];
          const option = ui.el('option', { 
            value: `${category}.${itemKey}`, 
            text: template.description 
          });
          optgroup.appendChild(option);
        });
        
        templateSel.appendChild(optgroup);
      }
    });
  }

  function updateHeader(){
    const it = getSelectedItem();
    if(!it){
      itemTitle.textContent = 'No BOQ item selected.';
      return;
    }
    itemTitle.textContent = `Item: ${it.description || ''} | Unit: ${it.unit || ''} | BOQ Qty: ${toNum(it.qty || 0)} | Current BOQ rate: ${money(it.rate || 0)}`;
  }

  function rebuild(){
    rebuildItemOptions();
    const it = getSelectedItem();
    updateHeader();
    table.innerHTML = '';

    if(!it){
      totalsBadge.textContent = '';
      return;
    }

    const a = ensureSelectedAnalysis();

    ensureTemplateOptions();
    if(!templateSel.value || templateSel.value === 'custom'){
      templateSel.value = detectTemplateKey({ description: it.description, unit: it.unit });
    }

    wastePct.value = String(a.wastePct ?? 0);
    overheadPct.value = String(a.overheadPct ?? 12);
    profitPct.value = String(a.profitPct ?? 10);

    const totals = computeTotals(a);
    totalsBadge.textContent = '';
    finalCostBadge.textContent = '';

    const boqQty = toNum(it.qty || 0);
    const totalAmount = boqQty * toNum(totals.finalRate);

    // Component cost badges
    componentBadges.innerHTML = '';
    componentBadges.appendChild(ui.el('div', { class:'badge', text:`Materials: ${money(totals.mat)}` }));
    componentBadges.appendChild(ui.el('div', { class:'badge', text:`Labour: ${money(totals.lab)}` }));
    componentBadges.appendChild(ui.el('div', { class:'badge', text:`Plant: ${money(totals.plant)}` }));
    componentBadges.appendChild(ui.el('div', { class:'badge', text:`Direct: ${money(totals.direct)}` }));
    componentBadges.appendChild(ui.el('div', { class:'badge', text:`Waste: ${money(totals.waste)}` }));
    componentBadges.appendChild(ui.el('div', { class:'badge', text:`Overhead: ${money(totals.overhead)}` }));
    componentBadges.appendChild(ui.el('div', { class:'badge', text:`Profit: ${money(totals.profit)}` }));

    // Percentage breakdowns
    percentBadges.innerHTML = '';
    const final = toNum(totals.finalRate);
    if(final > 0){
      percentBadges.appendChild(ui.el('div', { class:'badge', text:`Materials ${(totals.mat/final*100).toFixed(1)}%` }));
      percentBadges.appendChild(ui.el('div', { class:'badge', text:`Labour ${(totals.lab/final*100).toFixed(1)}%` }));
      percentBadges.appendChild(ui.el('div', { class:'badge', text:`Plant ${(totals.plant/final*100).toFixed(1)}%` }));
      percentBadges.appendChild(ui.el('div', { class:'badge', text:`Waste ${(totals.waste/final*100).toFixed(1)}%` }));
      percentBadges.appendChild(ui.el('div', { class:'badge', text:`Overhead ${(totals.overhead/final*100).toFixed(1)}%` }));
      percentBadges.appendChild(ui.el('div', { class:'badge', text:`Profit ${(totals.profit/final*100).toFixed(1)}%` }));
    }

    // Summary box
    summaryBox.innerHTML = '';
    summaryBox.appendChild(ui.el('div', { class:'card__header' }, [
      ui.el('div', { class:'card__title', text:'Final Rate Summary' })
    ]));
    const summaryBody = ui.el('div', { class:'card__body', style:'display:flex; flex-direction:column; gap:8px;' });
    summaryBody.appendChild(ui.el('div', { class:'row', style:'gap:12px; align-items:center;' }, [
      ui.el('div', { text:'Unit Rate:' }),
      ui.el('div', { class:'badge', text:money(totals.finalRate) })
    ]));
    summaryBody.appendChild(ui.el('div', { class:'row', style:'gap:12px; align-items:center;' }, [
      ui.el('div', { text:'BOQ Qty:' }),
      ui.el('div', { class:'badge', text:toNum(it.qty || 0) })
    ]));
    summaryBody.appendChild(ui.el('div', { class:'row', style:'gap:12px; align-items:center;' }, [
      ui.el('div', { text:'Total Item Cost:' }),
      ui.el('div', { class:'badge', text:money(totalAmount) })
    ]));
    summaryBox.appendChild(summaryBody);

    // Add educational calculation display
    displayRateCalculationSteps(totals, calculationDisplay);

    function sectionHeader(title){
      const tr = ui.el('tr');
      tr.appendChild(ui.el('td', { text:'', style:'font-weight:700' }));
      tr.appendChild(ui.el('td', { text:title, style:'font-weight:700' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text:'' }));
      return tr;
    }

    function subtotalRow(label, amount){
      const tr = ui.el('tr');
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text: label, style:'font-weight:700' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text:'' }));
      tr.appendChild(ui.el('td', { text: money(amount), style:'font-weight:700' }));
      return tr;
    }

    function rowEditor(rows, idx){
      const r = rows[idx];
      const desc = ui.el('input', { value: r.desc || '' });
      const unit = ui.el('input', { value: r.unit || '' });
      const qty = ui.el('input', { type:'number', step:'0.001', value: String(r.qty ?? 0) });
      const rate = ui.el('input', { type:'number', step:'0.01', value: String(r.rate ?? 0) });

      function commit(){
        const it = getSelectedItem();
        if(!it) return;
        const a = ensureSelectedAnalysis();
        if(!a) return;
        const row = rows[idx];
        row.desc = desc.value;
        row.unit = unit.value;
        row.qty = toNum(qty.value);
        row.rate = toNum(rate.value);
        setAnalysis(projectId, it.id, a);
        rebuild();
      }

      desc.addEventListener('input', commit);
      unit.addEventListener('input', commit);
      qty.addEventListener('input', commit);
      rate.addEventListener('input', commit);

      const tr = ui.el('tr');
      tr.appendChild(ui.el('td', {}, [ui.el('button', { class:'btn btn--danger', type:'button', text:'×' }, [
        ui.el('span', { style:'pointer-events:none;' }, [ui.el('span', { text:'×' })])
      ], { click: () => {
        rows.splice(idx, 1);
        const it = getSelectedItem();
        if(it){
          const a = ensureSelectedAnalysis();
          if(a) setAnalysis(projectId, it.id, a);
        }
        rebuild();
      }})]));
      tr.appendChild(ui.el('td', {}, [desc]));
      tr.appendChild(ui.el('td', {}, [unit]));
      tr.appendChild(ui.el('td', {}, [qty]));
      tr.appendChild(ui.el('td', {}, [rate]));
      tr.appendChild(ui.el('td', { text: money(rowAmount(r)) }));
      return tr;
    }

    table.appendChild(ui.el('thead', {}, [
      ui.el('tr', {}, [
        ui.el('th', { text:'' }),
        ui.el('th', { text:'Description' }),
        ui.el('th', { text:'Unit' }),
        ui.el('th', { text:'Quantity' }),
        ui.el('th', { text:'Rate' }),
        ui.el('th', { text:'Amount' })
      ])
    ]));

    const tbody = ui.el('tbody');

    tbody.appendChild(sectionHeader('Materials'));
    a.materials.forEach((_, i) => tbody.appendChild(rowEditor(a.materials, i)));
    tbody.appendChild(subtotalRow('Materials — Subtotal', totals.mat));

    tbody.appendChild(sectionHeader('Labour'));
    a.labour.forEach((_, i) => tbody.appendChild(rowEditor(a.labour, i)));
    tbody.appendChild(subtotalRow('Labour — Subtotal', totals.lab));

    tbody.appendChild(sectionHeader('Plant / Equipment'));
    a.plant.forEach((_, i) => tbody.appendChild(rowEditor(a.plant, i)));
    tbody.appendChild(subtotalRow('Plant / Equipment — Subtotal', totals.plant));

    tbody.appendChild(subtotalRow('Direct Cost (Materials + Labour + Plant)', totals.direct));

    const trWaste = ui.el('tr');
    trWaste.appendChild(ui.el('td', { text:'' }));
    trWaste.appendChild(ui.el('td', { text:'Wastage (applied on direct cost)', style:'font-weight:700' }));
    trWaste.appendChild(ui.el('td', { text:'%' }));
    trWaste.appendChild(ui.el('td', {}, [wastePct]));
    trWaste.appendChild(ui.el('td', { text:'' }));
    trWaste.appendChild(ui.el('td', { text: money(totals.waste) }));
    tbody.appendChild(trWaste);

    tbody.appendChild(subtotalRow('Subtotal (Direct + Wastage)', totals.subTotal));

    const trOvh = ui.el('tr');
    trOvh.appendChild(ui.el('td', { text:'' }));
    trOvh.appendChild(ui.el('td', { text:'Overheads', style:'font-weight:700' }));
    trOvh.appendChild(ui.el('td', { text:'%' }));
    trOvh.appendChild(ui.el('td', {}, [overheadPct]));
    trOvh.appendChild(ui.el('td', { text:'' }));
    trOvh.appendChild(ui.el('td', { text: money(totals.overhead) }));
    tbody.appendChild(trOvh);

    const trProfit = ui.el('tr');
    trProfit.appendChild(ui.el('td', { text:'' }));
    trProfit.appendChild(ui.el('td', { text:'Profit', style:'font-weight:700' }));
    trProfit.appendChild(ui.el('td', { text:'%' }));
    trProfit.appendChild(ui.el('td', {}, [profitPct]));
    trProfit.appendChild(ui.el('td', { text:'' }));
    trProfit.appendChild(ui.el('td', { text: money(totals.profit) }));
    tbody.appendChild(trProfit);

    const trFinal = ui.el('tr');
    trFinal.appendChild(ui.el('td', { text:'' }));
    trFinal.appendChild(ui.el('td', { text:'Final Rate / Unit', style:'font-weight:700' }));
    trFinal.appendChild(ui.el('td', { text:it.unit || '' }));
    trFinal.appendChild(ui.el('td', { text:'' }));
    trFinal.appendChild(ui.el('td', { text:'' }));
    trFinal.appendChild(ui.el('td', { text: money(totals.finalRate), style:'font-weight:700' }));
    tbody.appendChild(trFinal);

    table.appendChild(tbody);

    wastePct.addEventListener('input', () => {
      const it = getSelectedItem();
      if(!it) return;
      const a = ensureSelectedAnalysis();
      if(!a) return;
      a.wastePct = toNum(wastePct.value);
      setAnalysis(projectId, it.id, a);
      rebuild();
    });

    overheadPct.addEventListener('input', () => {
      const it = getSelectedItem();
      if(!it) return;
      const a = ensureSelectedAnalysis();
      if(!a) return;
      a.overheadPct = toNum(overheadPct.value);
      setAnalysis(projectId, it.id, a);
      rebuild();
    });

    profitPct.addEventListener('input', () => {
      const it = getSelectedItem();
      if(!it) return;
      const a = ensureSelectedAnalysis();
      if(!a) return;
      a.profitPct = toNum(profitPct.value);
      setAnalysis(projectId, it.id, a);
      rebuild();
    });

    btnLoadTemplate.addEventListener('click', () => {
      const it = getSelectedItem();
      if(!it) return;
      const a = ensureSelectedAnalysis();
      if(!a) return;
      applyTemplate(a, templateSel.value);
      setAnalysis(projectId, it.id, a);
      rebuild();
    });

    btnAddMat.addEventListener('click', () => {
      const it = getSelectedItem();
      if(!it) return;
      const a = ensureSelectedAnalysis();
      if(!a) return;
      a.materials.push(makeRow());
      setAnalysis(projectId, it.id, a);
      rebuild();
    });

    btnAddLab.addEventListener('click', () => {
      const it = getSelectedItem();
      if(!it) return;
      const a = ensureSelectedAnalysis();
      if(!a) return;
      a.labour.push(makeRow());
      setAnalysis(projectId, it.id, a);
      rebuild();
    });

    btnAddPlant.addEventListener('click', () => {
      const it = getSelectedItem();
      if(!it) return;
      const a = ensureSelectedAnalysis();
      if(!a) return;
      a.plant.push(makeRow());
      setAnalysis(projectId, it.id, a);
      rebuild();
    });

    btnApplyToBoq.addEventListener('click', () => {
      const it = getSelectedItem();
      if(!it) return;
      const a = ensureSelectedAnalysis();
      if(!a) return;
      const totals = computeTotals(a);
      store.update(s => {
        const boq = s.boq = s.boq || {};
        const proj = boq[projectId] = boq[projectId] || { lines: [] };
        const line = proj.lines.find(x => x.id === it.id);
        if(line){
          line.rate = toNum(totals.finalRate);
        }
        return s;
      });
      updateHeader();
    });

    itemSel.addEventListener('change', rebuild);
  }

  headerBody.appendChild(ui.el('div', { class:'field' }, [ui.el('label', { text:'BOQ Item' }), itemSel]));
  headerBody.appendChild(itemTitle);
  headerBody.appendChild(ui.el('div', { class:'field' }, [ui.el('label', { text:'Micro analysis template' }), templateSel]));
  headerBody.appendChild(ui.el('div', { class:'field' }, [ui.el('label', { text:'Template action' }), ui.el('div', { class:'row' }, [btnLoadTemplate])]));
  headerBody.appendChild(ui.el('div', { class:'field' }, [ui.el('label', { text:'Wastage (%)' }), wastePct]));
  headerBody.appendChild(ui.el('div', { class:'field' }, [ui.el('label', { text:'Overheads (%)' }), overheadPct]));
  headerBody.appendChild(ui.el('div', { class:'field' }, [ui.el('label', { text:'Profit (%)' }), profitPct]));
  headerBody.appendChild(ui.el('div', { class:'field' }, [ui.el('label', { text:'Actions' }), ui.el('div', { class:'row' }, [btnAddMat, btnAddLab, btnAddPlant, btnApplyToBoq])]));

  headerBody.appendChild(ui.el('div', { style:'height:10px' }));
  headerBody.appendChild(totalsBadge);
  headerBody.appendChild(ui.el('div', { style:'height:10px' }));
  headerBody.appendChild(finalCostBadge);
  headerBody.appendChild(ui.el('div', { class:'card__subtitle', text:'Component Costs' }));
  headerBody.appendChild(componentBadges);
  headerBody.appendChild(ui.el('div', { class:'card__subtitle', text:'Percentage Breakdown' }));
  headerBody.appendChild(percentBadges);
  header.appendChild(headerBody);

  mountEl.appendChild(header);
  mountEl.appendChild(ui.el('div', { style:'height:12px' }));
  mountEl.appendChild(summaryBox);
  mountEl.appendChild(ui.el('div', { style:'height:12px' }));
  mountEl.appendChild(calculationDisplay);
  mountEl.appendChild(ui.el('div', { style:'height:12px' }));
  mountEl.appendChild(wrap);

  rebuild();
  store.subscribe(rebuild);
  return card;
}
