import { store } from '../storage.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function nowIso(){
  return new Date().toISOString();
}

export const variationsEngine = {
  ensure(projectId){
    store.update(s => {
      s.variations = s.variations || {};
      s.variations[projectId] = s.variations[projectId] || { baselineAt: null, baseline: {} };
      return s;
    });
  },

  setBaseline(projectId){
    const s0 = store.getState();
    const lines = s0.boq?.[projectId]?.lines || [];

    const baseline = {};
    for(const l of lines){
      if(l.type !== 'item') continue;
      baseline[l.id] = { qty: toNum(l.qty), rate: toNum(l.rate) };
    }

    store.update(s => {
      s.variations = s.variations || {};
      s.variations[projectId] = { baselineAt: nowIso(), baseline };
      return s;
    });
  },

  getRows(projectId){
    const s = store.getState();
    const lines = s.boq?.[projectId]?.lines || [];
    const base = s.variations?.[projectId]?.baseline || {};

    const rows = [];
    for(const l of lines){
      if(l.type !== 'item') continue;
      const b = base[l.id] || { qty: 0, rate: toNum(l.rate) };

      const originalQty = toNum(b.qty);
      const revisedQty = toNum(l.qty);
      const diff = revisedQty - originalQty;

      const rate = toNum(l.rate || b.rate);
      const cost = diff * rate;

      rows.push({
        id: l.id,
        description: l.description,
        unit: l.unit,
        originalQty,
        revisedQty,
        diff,
        rate,
        cost
      });
    }

    const totalCost = rows.reduce((a,r)=>a + r.cost, 0);
    return { rows, totalCost, baselineAt: s.variations?.[projectId]?.baselineAt || null };
  }
};
