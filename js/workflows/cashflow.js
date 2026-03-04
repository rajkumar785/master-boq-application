import { store } from '../storage.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function round2(n){
  return Math.round(toNum(n) * 100) / 100;
}

function defaultDistribution(months){
  // Smooth bell distribution using sine curve
  const m = Math.max(1, Math.floor(months));
  const weights = [];
  for(let i=1;i<=m;i++){
    const x = i/(m+1);
    const w = Math.sin(Math.PI * x);
    weights.push(Math.max(0.0001, w));
  }
  const sum = weights.reduce((a,b)=>a+b,0);
  return weights.map(w => w/sum);
}

export const cashflowEngine = {
  ensure(projectId, months){
    store.update(s => {
      s.cashflow = s.cashflow || {};
      if(!s.cashflow[projectId]){
        const dist = defaultDistribution(months || 12);
        s.cashflow[projectId] = {
          months: dist.length,
          monthlyPct: dist.map(x => round2(x*100))
        };
      }
      return s;
    });
  },

  setMonthlyPct(projectId, idx, pct){
    store.update(s => {
      s.cashflow = s.cashflow || {};
      const cf = s.cashflow[projectId];
      if(!cf) return s;
      cf.monthlyPct[idx] = round2(pct);
      return s;
    });
  },

  getPlan(projectId){
    const s = store.getState();
    const lines = s.boq?.[projectId]?.lines || [];
    const grand = lines.reduce((acc, l) => (l.type==='item' ? acc + toNum(l.qty)*toNum(l.rate) : acc), 0);

    const cf = s.cashflow?.[projectId];
    if(!cf) return { months: 0, grand, rows: [] };

    const rows = [];
    let cum = 0;
    for(let i=0;i<cf.months;i++){
      const pct = toNum(cf.monthlyPct[i]);
      const amt = grand * (pct/100);
      cum += amt;
      rows.push({ month:i+1, pct, amount: amt, cumulative: cum });
    }

    return { months: cf.months, grand, rows };
  }
};
