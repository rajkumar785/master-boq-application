import { ui } from '../ui.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function round3(n){
  return Math.round(toNum(n) * 1000) / 1000;
}

export const materialsEngine = {
  mount({ rootEl }){
    const wetVol = ui.el('input', { type:'number', value:'1', step:'0.01' });

    const cementWaste = ui.el('input', { type:'number', value:'5', step:'0.1' });
    const steelWaste = ui.el('input', { type:'number', value:'3', step:'0.1' });
    const tilesWaste = ui.el('input', { type:'number', value:'8', step:'0.1' });

    const out = ui.el('div', { class:'grid', style:'gap:8px' });

    function recalc(){
      const v = toNum(wetVol.value);
      const base = {
        cementBags: 6 * v,
        sandM3: 0.45 * v,
        aggM3: 0.9 * v
      };

      const cementFinal = base.cementBags * (1 + toNum(cementWaste.value)/100);
      out.innerHTML = '';
      out.appendChild(ui.el('div', { class:'badge', text:`Concrete (base for ${v} m³): Cement ${round3(base.cementBags)} bags, Sand ${round3(base.sandM3)} m³, Aggregate ${round3(base.aggM3)} m³` }));
      out.appendChild(ui.el('div', { class:'badge', text:`Cement with waste (${cementWaste.value}%): ${round3(cementFinal)} bags` }));
      out.appendChild(ui.el('div', { class:'badge', text:`Steel waste default: ${steelWaste.value}% (used in rebar schedule)` }));
      out.appendChild(ui.el('div', { class:'badge', text:`Tiles waste default: ${tilesWaste.value}% (used for finishes takeoff)` }));
    }

    [wetVol, cementWaste, steelWaste, tilesWaste].forEach(i => i.addEventListener('input', recalc));

    rootEl.appendChild(ui.el('div', { class:'grid grid--2' }, [
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Concrete volume (m³)' }), wetVol]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Cement waste (%)' }), cementWaste]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Steel waste (%)' }), steelWaste]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Tiles waste (%)' }), tilesWaste])
    ]));

    rootEl.appendChild(ui.el('div', { style:'height:12px' }));
    rootEl.appendChild(out);

    recalc();
  }
};
