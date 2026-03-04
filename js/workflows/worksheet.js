import { ui } from '../ui.js';
import { store } from '../storage.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function round3(n){
  return Math.round(toNum(n) * 1000) / 1000;
}

function nowIso(){
  return new Date().toISOString();
}

function ensureWorksheetState(s, projectId){
  s.worksheets = s.worksheets || {};
  s.worksheets[projectId] = s.worksheets[projectId] || {};
}

function computeRow(row, type){
  const times = toNum(row.times ?? 1);
  if(type === 'length') return toNum(row.l) * times;
  if(type === 'area') return (toNum(row.l) * toNum(row.h)) * times;
  if(type === 'volume') return (toNum(row.l) * toNum(row.w) * toNum(row.d)) * times;
  if(type === 'count') return toNum(row.count) * times;
  if(type === 'rebar_weight'){
    // kg = (dia^2/162) * length(m) * qty
    return ((toNum(row.dia) ** 2) / 162) * toNum(row.l) * toNum(row.count) * times;
  }
  return 0;
}

function columnsForType(type){
  if(type === 'length') return ['Description','L','Times','Total'];
  if(type === 'area') return ['Description','L','H','Times','Total'];
  if(type === 'volume') return ['Description','L','W','D','Times','Total'];
  if(type === 'count') return ['Description','Count','Times','Total'];
  if(type === 'rebar_weight') return ['Description','Dia (mm)','Length (m)','Qty','Times','Total (kg)'];
  return ['Description','Total'];
}

function newRow(type){
  if(type === 'length') return { id: store.uid('wr'), desc:'', l:0, times:1 };
  if(type === 'area') return { id: store.uid('wr'), desc:'', l:0, h:0, times:1 };
  if(type === 'volume') return { id: store.uid('wr'), desc:'', l:0, w:0, d:0, times:1 };
  if(type === 'count') return { id: store.uid('wr'), desc:'', count:1, times:1 };
  if(type === 'rebar_weight') return { id: store.uid('wr'), desc:'', dia:12, l:6, count:1, times:1 };
  return { id: store.uid('wr'), desc:'', total:0 };
}

function computeTotal(sheet){
  const rows = sheet.rows || [];
  return rows.reduce((acc, r) => acc + computeRow(r, sheet.type), 0);
}

export const worksheet = {
  open({ projectId, lineId, lineDescription, unit }){
    const state = store.getState();
    if(!projectId || !lineId) return;

    const current = state.worksheets?.[projectId]?.[lineId] || null;
    const type = current?.type || (unit === 'm³' ? 'volume' : unit === 'm²' ? 'area' : unit === 'kg' ? 'rebar_weight' : unit === 'nr' ? 'count' : 'length');

    store.update(s => {
      ensureWorksheetState(s, projectId);
      if(!s.worksheets[projectId][lineId]){
        s.worksheets[projectId][lineId] = {
          type,
          rows: [newRow(type)],
          audit: [{ at: nowIso(), action: 'created' }]
        };
      }
      return s;
    });

    const root = ui.el('div');

    const typeSel = ui.el('select');
    const types = [
      { v:'length', t:'Length (m)' },
      { v:'area', t:'Area (m²)' },
      { v:'volume', t:'Volume (m³)' },
      { v:'count', t:'Count (nr)' },
      { v:'rebar_weight', t:'Rebar Weight (kg)' }
    ];
    for(const t of types) typeSel.appendChild(ui.el('option', { value:t.v, text:t.t }));

    const totalBadge = ui.el('div', { class:'badge', text:'Total: 0' });

    const headerRow = ui.el('div', { class:'row' }, [
      ui.el('div', { class:'field', style:'min-width:280px' }, [
        ui.el('label', { text:'Worksheet Type' }),
        typeSel
      ]),
      ui.el('div', { class:'field', style:'min-width:240px' }, [
        ui.el('label', { text:'Item' }),
        ui.el('div', { class:'badge', text: lineDescription || 'BOQ item' })
      ]),
      ui.el('div', { class:'field', style:'min-width:180px' }, [
        ui.el('label', { text:'Computed Quantity' }),
        totalBadge
      ])
    ]);

    const wrap = ui.el('div', { class:'table-wrap' });
    const table = ui.el('table', { class:'table' });
    wrap.appendChild(table);

    const btnAdd = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Add Row' });
    const btnApply = ui.el('button', { class:'btn', type:'button', text:'Apply to BOQ' });

    const auditBox = ui.el('div', { class:'grid', style:'gap:6px' });

    root.appendChild(headerRow);
    root.appendChild(ui.el('div', { style:'height:12px' }));
    root.appendChild(wrap);
    root.appendChild(ui.el('div', { style:'height:12px' }));
    root.appendChild(ui.el('div', { class:'row' }, [btnAdd, btnApply]));
    root.appendChild(ui.el('div', { style:'height:12px' }));
    root.appendChild(ui.el('div', { class:'badge', text:'Audit Trail' }));
    root.appendChild(auditBox);

    const modal = ui.openModal({
      title: 'Measurement Worksheet',
      bodyNode: root,
      footerNode: ui.el('div', { class:'row row--end' }, [
        ui.el('button', { class:'btn btn--secondary', type:'button', text:'Close', 'data-close-modal':'true' })
      ])
    });

    function getSheet(){
      const s = store.getState();
      return s.worksheets?.[projectId]?.[lineId];
    }

    function setSheet(patchFn){
      store.update(s => {
        ensureWorksheetState(s, projectId);
        const sheet = s.worksheets[projectId][lineId];
        patchFn(sheet);
        return s;
      });
    }

    function rebuild(){
      const sheet = getSheet();
      if(!sheet) return;

      typeSel.value = sheet.type;
      const cols = columnsForType(sheet.type);

      table.innerHTML = '';
      table.appendChild(ui.el('thead', {}, [
        ui.el('tr', {}, cols.map(c => ui.el('th', { text:c })))
      ]));

      const tbody = ui.el('tbody');
      for(const r of sheet.rows){
        const rowTotal = round3(computeRow(r, sheet.type));

        const desc = ui.el('input', { value: r.desc || '' });
        desc.addEventListener('change', () => setSheet(s => {
          const rr = s.rows.find(x => x.id === r.id);
          if(rr) rr.desc = desc.value;
          s.audit.push({ at: nowIso(), action: 'row_updated' });
        }));

        const tds = [ui.el('td', {}, [desc])];

        function numCell(key, step='0.001'){
          const inp = ui.el('input', { type:'number', step, value: String(r[key] ?? 0) });
          inp.addEventListener('change', () => setSheet(s => {
            const rr = s.rows.find(x => x.id === r.id);
            if(!rr) return;
            rr[key] = Number(inp.value || 0);
            s.audit.push({ at: nowIso(), action: 'row_updated' });
          }));
          return ui.el('td', {}, [inp]);
        }

        if(sheet.type === 'length'){
          tds.push(numCell('l'));
          tds.push(numCell('times','0.001'));
          tds.push(ui.el('td', { text: String(rowTotal) }));
        }

        if(sheet.type === 'area'){
          tds.push(numCell('l'));
          tds.push(numCell('h'));
          tds.push(numCell('times','0.001'));
          tds.push(ui.el('td', { text: String(rowTotal) }));
        }

        if(sheet.type === 'volume'){
          tds.push(numCell('l'));
          tds.push(numCell('w'));
          tds.push(numCell('d'));
          tds.push(numCell('times','0.001'));
          tds.push(ui.el('td', { text: String(rowTotal) }));
        }

        if(sheet.type === 'count'){
          tds.push(numCell('count','1'));
          tds.push(numCell('times','0.001'));
          tds.push(ui.el('td', { text: String(rowTotal) }));
        }

        if(sheet.type === 'rebar_weight'){
          tds.push(numCell('dia','1'));
          tds.push(numCell('l'));
          tds.push(numCell('count','1'));
          tds.push(numCell('times','0.001'));
          tds.push(ui.el('td', { text: String(rowTotal) }));
        }

        const tr = ui.el('tr', {}, tds);
        tbody.appendChild(tr);
      }

      table.appendChild(tbody);

      const total = computeTotal(sheet);
      totalBadge.textContent = `Total: ${round3(total)} ${unit || ''}`;

      auditBox.innerHTML = '';
      const last = (sheet.audit || []).slice(-8).reverse();
      for(const a of last){
        auditBox.appendChild(ui.el('div', { class:'badge', text:`${a.at} — ${a.action}` }));
      }
    }

    typeSel.addEventListener('change', () => {
      const nextType = typeSel.value;
      setSheet(s => {
        s.type = nextType;
        s.rows = [newRow(nextType)];
        s.audit.push({ at: nowIso(), action: `type_changed:${nextType}` });
      });
      rebuild();
    });

    btnAdd.addEventListener('click', () => {
      const sheet = getSheet();
      setSheet(s => {
        s.rows.push(newRow(sheet.type));
        s.audit.push({ at: nowIso(), action:'row_added' });
      });
      rebuild();
    });

    btnApply.addEventListener('click', () => {
      const sheet = getSheet();
      const total = computeTotal(sheet);
      store.update(s => {
        const line = s.boq?.[projectId]?.lines?.find(x => x.id === lineId);
        if(!line) return s;
        line.qty = round3(total);
        line.qtySource = 'worksheet';
        line.qtyAudit = line.qtyAudit || [];
        line.qtyAudit.push({ at: nowIso(), source:'worksheet', qty: round3(total) });
        return s;
      });
      setSheet(s => s.audit.push({ at: nowIso(), action: 'applied_to_boq' }));
      rebuild();
      alert('Worksheet quantity applied to BOQ line.');
    });

    const unsub = store.subscribe(rebuild);
    const originalClose = modal.close;
    modal.close = () => {
      unsub();
      originalClose();
    };

    rebuild();
  }
};
