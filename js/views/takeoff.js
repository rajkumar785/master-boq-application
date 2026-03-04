import { ui } from '../ui.js';
import { store } from '../storage.js';
import { takeoff } from '../workflows/takeoff.js';
import { getSmm7Items } from '../workflows/smm7.js';
import { measurementToQuantity } from '../workflows/quantity.js';
import { automation } from '../workflows/automation.js';

export async function takeoffView(){
  const state = store.getState();
  const activeProjectId = state.activeProjectId;

  const root = ui.el('div', { class:'card' });
  root.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Drawing Takeoff' }),
    ui.el('div', { class:'card__subtitle', text:'Upload a drawing (image or PDF), set scale, then measure line/area/count on Canvas.' })
  ]));

  const body = ui.el('div', { class:'card__body' });

  if(!activeProjectId){
    body.appendChild(ui.el('div', { class:'badge', text:'Create/select an active project first (Project Management).' }));
    root.appendChild(body);
    return root;
  }

  const fileInput = ui.el('input', { type:'file', accept:'.pdf,image/*' });
  const toolSelect = ui.el('select');
  ['scale','line','area','count','pan'].forEach(v => {
    const label = v === 'scale' ? 'Scale calibration' : v.toUpperCase();
    toolSelect.appendChild(ui.el('option', { value:v, text:label }));
  });

  const scaleRealLen = ui.el('input', { type:'number', value:'1', step:'0.01' });
  const scaleUnit = ui.el('select');
  ['m','mm','ft'].forEach(u => scaleUnit.appendChild(ui.el('option', { value:u, text:u })));

  const btnClear = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Clear Measurements' });
  const btnAutoBoq = ui.el('button', { class:'btn', type:'button', text:'Import Takeoff → BOQ' });

  const controls = ui.el('div', { class:'row' }, [
    ui.el('div', { class:'field', style:'min-width:240px' }, [
      ui.el('label', { text:'Upload drawing (PDF/image)' }),
      fileInput
    ]),
    ui.el('div', { class:'field', style:'min-width:200px' }, [
      ui.el('label', { text:'Tool' }),
      toolSelect
    ]),
    ui.el('div', { class:'field', style:'min-width:160px' }, [
      ui.el('label', { text:'Scale: real length' }),
      scaleRealLen
    ]),
    ui.el('div', { class:'field', style:'min-width:120px' }, [
      ui.el('label', { text:'Unit' }),
      scaleUnit
    ]),
    btnClear,
    btnAutoBoq
  ]);

  const split = ui.el('div', { class:'split' });
  const left = ui.el('div', { class:'split__left' });
  const right = ui.el('div', { class:'split__right' });

  const canvasWrap = ui.el('div', { class:'canvas-wrap' });
  const canvas = ui.el('canvas', { id:'takeoffCanvas' });
  const overlay = ui.el('canvas', { id:'takeoffOverlay' });
  canvasWrap.appendChild(canvas);
  canvasWrap.appendChild(overlay);

  left.appendChild(canvasWrap);

  const infoCard = ui.el('div', { class:'card' }, [
    ui.el('div', { class:'card__header' }, [
      ui.el('div', { class:'card__title', text:'Measurements' }),
      ui.el('div', { class:'card__subtitle', text:'Assign SMM7 items to takeoff entities, then import into BOQ.' })
    ]),
    ui.el('div', { class:'card__body' }, [
      ui.el('div', { id:'takeoffSummary', class:'grid', style:'gap:8px' }),
      ui.el('div', { style:'height:12px' }),
      ui.el('div', { class:'table-wrap' }, [
        ui.el('table', { class:'table', id:'takeoffMapTable' })
      ])
    ])
  ]);
  right.appendChild(infoCard);

  split.appendChild(left);
  split.appendChild(right);

  body.appendChild(controls);
  body.appendChild(ui.el('div', { style:'height:12px' }));
  body.appendChild(split);

  root.appendChild(body);

  const api = takeoff.mount({
    projectId: activeProjectId,
    canvas,
    overlay,
    summaryEl: document.getElementById('takeoffSummary')
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    await api.loadFile(file);
  });

  toolSelect.addEventListener('change', () => api.setTool(toolSelect.value));
  scaleRealLen.addEventListener('change', () => api.setScaleTarget({ realLength: Number(scaleRealLen.value || 1), unit: scaleUnit.value }));
  scaleUnit.addEventListener('change', () => api.setScaleTarget({ realLength: Number(scaleRealLen.value || 1), unit: scaleUnit.value }));
  btnClear.addEventListener('click', () => api.clearMeasurements());
  btnAutoBoq.addEventListener('click', async () => {
    await automation.importTakeoffToBoq({ projectId: activeProjectId });
    alert('Imported takeoff quantities into BOQ. Open BOQ Generator to review and add rates.');
    window.location.hash = '#/boq';
  });

  api.setTool(toolSelect.value);
  api.setScaleTarget({ realLength: Number(scaleRealLen.value || 1), unit: scaleUnit.value });

  const smm7Items = await getSmm7Items();

  function rebuildMapTable(){
    const s = store.getState();
    const t = s.takeoff?.[activeProjectId];
    const tableEl = document.getElementById('takeoffMapTable');
    if(!tableEl) return;
    tableEl.innerHTML = '';

    tableEl.appendChild(ui.el('thead', {}, [
      ui.el('tr', {}, [
        ui.el('th', { text:'Type' }),
        ui.el('th', { text:'Measured Qty' }),
        ui.el('th', { text:'Factor' }),
        ui.el('th', { text:'SMM7 Code' }),
        ui.el('th', { text:'Unit Override' })
      ])
    ]));

    const tbody = ui.el('tbody');
    const measurements = t?.measurements || [];
    for(const m of measurements){
      const q = measurementToQuantity(m, t?.scale);
      const qtyText = q.ok ? `${q.qty.toFixed(3)} ${q.unit}` : 'Scale required';

      const factorInput = ui.el('input', { type:'number', step:'0.001', value: String(m.factor ?? 1) });

      const codeSel = ui.el('select');
      codeSel.appendChild(ui.el('option', { value:'', text:'(not assigned)' }));
      for(const it of smm7Items){
        codeSel.appendChild(ui.el('option', { value: it.code, text: `${it.code} - ${it.description}` }));
      }
      codeSel.value = m.smm7Code || '';

      const unitOverride = ui.el('input', { value: String(m.unitOverride || '') });

      factorInput.addEventListener('change', () => api.updateMeasurement(m.id, { factor: Number(factorInput.value || 1) }));
      codeSel.addEventListener('change', () => api.updateMeasurement(m.id, { smm7Code: codeSel.value || null }));
      unitOverride.addEventListener('change', () => api.updateMeasurement(m.id, { unitOverride: unitOverride.value.trim() }));

      const tr = ui.el('tr', {}, [
        ui.el('td', { text: m.type }),
        ui.el('td', { text: qtyText }),
        ui.el('td', {}, [factorInput]),
        ui.el('td', {}, [codeSel]),
        ui.el('td', {}, [unitOverride])
      ]);
      tbody.appendChild(tr);
    }

    tableEl.appendChild(tbody);
  }

  rebuildMapTable();
  store.subscribe(rebuildMapTable);

  return root;
}
