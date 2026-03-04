import { ui } from '../ui.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function money(n){
  return toNum(n).toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 });
}

export const rateEngine = {
  mount({ rootEl }){
    const mat = ui.el('input', { type:'number', value:'0', step:'0.01' });
    const lab = ui.el('input', { type:'number', value:'0', step:'0.01' });
    const eqp = ui.el('input', { type:'number', value:'0', step:'0.01' });
    const ovh = ui.el('input', { type:'number', value:'10', step:'0.1' });
    const prf = ui.el('input', { type:'number', value:'10', step:'0.1' });

    const out = ui.el('div', { class:'badge', text:'Final Rate: 0.00' });

    function recalc(){
      const base = toNum(mat.value) + toNum(lab.value) + toNum(eqp.value);
      const overhead = base * (toNum(ovh.value) / 100);
      const profit = (base + overhead) * (toNum(prf.value) / 100);
      const finalRate = base + overhead + profit;
      out.textContent = `Final Rate: ${money(finalRate)}`;
    }

    [mat, lab, eqp, ovh, prf].forEach(i => i.addEventListener('input', recalc));
    recalc();

    rootEl.appendChild(ui.el('div', { class:'grid grid--2' }, [
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Material cost (per unit)' }), mat]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Labour cost (per unit)' }), lab]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Equipment cost (per unit)' }), eqp]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Overhead (%)' }), ovh]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Profit (%)' }), prf]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Result' }), out])
    ]));
  }
};
