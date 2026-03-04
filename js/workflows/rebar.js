import { ui } from '../ui.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function rebarWeightKg(diaMm, lengthM, qty){
  return (toNum(diaMm) ** 2 / 162) * toNum(lengthM) * toNum(qty);
}

function round3(n){
  return Math.round(toNum(n) * 1000) / 1000;
}

export const rebarEngine = {
  mount({ rootEl }){
    const dia = ui.el('input', { type:'number', value:'12', step:'1' });
    const len = ui.el('input', { type:'number', value:'6', step:'0.01' });
    const qty = ui.el('input', { type:'number', value:'10', step:'1' });

    const out = ui.el('div', { class:'badge', text:'' });

    function recalc(){
      const w = rebarWeightKg(dia.value, len.value, qty.value);
      out.textContent = `Weight = (Dia² ÷ 162) × Length × Qty = ${round3(w)} kg`;
    }

    [dia, len, qty].forEach(i => i.addEventListener('input', recalc));

    rootEl.appendChild(ui.el('div', { class:'grid grid--2' }, [
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Bar diameter (mm)' }), dia]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Bar length (m)' }), len]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Number of bars' }), qty]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Result' }), out])
    ]));

    recalc();
  }
};
