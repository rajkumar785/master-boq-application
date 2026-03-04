import { ui } from '../ui.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const MIXES = {
  M15: { label: 'M15 (1:2:4)', ratio: [1,2,4] },
  M20: { label: 'M20 (1:1.5:3)', ratio: [1,1.5,3] }
};

function round3(n){
  return Math.round(toNum(n) * 1000) / 1000;
}

export const concreteEngine = {
  mount({ rootEl }){
    const wetVol = ui.el('input', { type:'number', value:'1', step:'0.01' });
    const mixSel = ui.el('select');
    Object.entries(MIXES).forEach(([k,v]) => mixSel.appendChild(ui.el('option', { value:k, text:v.label })));

    const out = ui.el('div', { class:'grid', style:'gap:8px' });

    function recalc(){
      const wet = toNum(wetVol.value);
      const dry = wet * 1.54;
      const mix = MIXES[mixSel.value];
      const sum = mix.ratio.reduce((a,b)=>a+b,0);

      const cementM3 = dry * (mix.ratio[0] / sum);
      const sandM3 = dry * (mix.ratio[1] / sum);
      const aggM3 = dry * (mix.ratio[2] / sum);

      const cementBags = cementM3 / 0.035;

      out.innerHTML = '';
      out.appendChild(ui.el('div', { class:'badge', text:`Wet volume: ${round3(wet)} m³` }));
      out.appendChild(ui.el('div', { class:'badge', text:`Dry volume factor: 1.54 → Dry volume: ${round3(dry)} m³` }));
      out.appendChild(ui.el('div', { class:'badge', text:`Cement: ${round3(cementM3)} m³ ≈ ${round3(cementBags)} bags (0.035 m³/bag)` }));
      out.appendChild(ui.el('div', { class:'badge', text:`Sand: ${round3(sandM3)} m³` }));
      out.appendChild(ui.el('div', { class:'badge', text:`Aggregate: ${round3(aggM3)} m³` }));
    }

    [wetVol, mixSel].forEach(i => i.addEventListener('input', recalc));

    rootEl.appendChild(ui.el('div', { class:'grid grid--2' }, [
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Concrete wet volume (m³)' }), wetVol]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Mix grade' }), mixSel])
    ]));
    rootEl.appendChild(ui.el('div', { style:'height:12px' }));
    rootEl.appendChild(out);
    recalc();
  }
};
