import { store } from '../storage.js';
import { getSmm7Items } from './smm7.js';
import { measurementToQuantity } from './quantity.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function unitNormalize(unit){
  return String(unit || '').trim();
}

function buildBoqImportLines({ projectId }){
  const state = store.getState();
  const t = state.takeoff?.[projectId];
  if(!t) return [];

  const scale = t.scale;
  const measurements = t.measurements || [];

  const grouped = new Map();

  for(const m of measurements){
    if(!m.smm7Code) continue;

    const q = measurementToQuantity(m, scale);
    if(!q.ok) continue;

    const factor = toNum(m.factor ?? 1);
    const qty = q.qty * factor;

    const key = `${m.smm7Code}__${unitNormalize(m.unitOverride || '')}`;
    const current = grouped.get(key) || {
      smm7Code: m.smm7Code,
      descriptionOverride: m.descriptionOverride || '',
      unitOverride: m.unitOverride || '',
      qty: 0
    };

    current.qty += qty;
    grouped.set(key, current);
  }

  return Array.from(grouped.values());
}

export const automation = {
  async importTakeoffToBoq({ projectId }){
    const items = await getSmm7Items();
    const importLines = buildBoqImportLines({ projectId });

    const byCode = new Map(items.map(it => [it.code, it]));

    const boqLines = [];
    const sectionOrder = [];
    const sectionHas = new Set();

    function ensureSection(section){
      if(sectionHas.has(section)) return;
      sectionHas.add(section);
      sectionOrder.push(section);
      boqLines.push({ type:'section', section });
    }

    for(const l of importLines){
      const it = byCode.get(l.smm7Code);
      const section = it?.section || 'Unsorted';
      ensureSection(section);

      boqLines.push({
        type:'item',
        source: 'takeoff',
        smm7Code: l.smm7Code,
        description: l.descriptionOverride || it?.description || 'Item',
        unit: l.unitOverride || it?.unit || '',
        qty: l.qty,
        rate: 0
      });
    }

    store.update(s => {
      s.boq = s.boq || {};
      if(!s.boq[projectId]) s.boq[projectId] = { lines: [] };

      const existing = s.boq[projectId].lines || [];
      const keep = existing.filter(x => x.type === 'section' || (x.type === 'item' && x.source !== 'takeoff'));

      const next = [];
      for(const l of boqLines){
        if(l.type === 'section'){
          next.push({ id: store.uid('sec'), type:'section', section: l.section });
          continue;
        }
        next.push({
          id: store.uid('item'),
          type:'item',
          itemNo: '',
          description: l.description,
          unit: l.unit,
          qty: Math.round(toNum(l.qty) * 1000) / 1000,
          rate: toNum(l.rate),
          source: l.source,
          smm7Code: l.smm7Code
        });
      }

      s.boq[projectId].lines = [...keep, ...next];
      return s;
    });
  }
};
