import { ui } from '../ui.js';
import { store } from '../storage.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function unitWeightKgPerM(diaMm){
  return (toNum(diaMm) ** 2) / 162;
}

function rebarWeightKg(diaMm, lengthM, qty){
  return unitWeightKgPerM(diaMm) * toNum(lengthM) * toNum(qty);
}

function round3(n){
  return Math.round(toNum(n) * 1000) / 1000;
}

function round1(n){
  return Math.round(toNum(n) * 10) / 10;
}

function mmToM(mm){
  return toNum(mm) / 1000;
}

function areaMm2(diaMm){
  const d = toNum(diaMm);
  return (Math.PI * d * d) / 4;
}

function volumeCm3(diaMm, totalLenMm){
  // mm³ -> cm³ (÷1000)
  return (areaMm2(diaMm) * toNum(totalLenMm)) / 1000;
}

function bendDeduction90Mm(diaMm){
  // Beginner approximation (BS8666-style): deduction for one 90° bend.
  return 2.5 * toNum(diaMm);
}

const SHAPES = [
  { code: '00', name: 'Straight bar', dims: ['A'], bends90: 0, calc: ({ A }) => toNum(A) },
  { code: '20', name: 'L-bar (right angle)', dims: ['A', 'B'], bends90: 1, calc: ({ A, B }) => toNum(A) + toNum(B) },
  { code: '21', name: 'U-bar', dims: ['A', 'B', 'C'], bends90: 2, calc: ({ A, B, C }) => toNum(A) + toNum(B) + toNum(C) },
  { code: 'MAN', name: 'Manual cutting length', dims: [], bends90: 0, calc: ({ manualLenMm }) => toNum(manualLenMm) }
];

function shapeByCode(code){
  return SHAPES.find(s => s.code === String(code)) || SHAPES[0];
}

function shapePreviewSvg(code){
  const c = String(code);
  if(c === '20'){
    return `
      <svg viewBox="0 0 220 90" width="220" height="90" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="220" height="90" fill="none" />
        <path d="M40 15 L40 70 L190 70" stroke="rgba(255,255,255,.85)" stroke-width="6" fill="none" stroke-linecap="round"/>
        <text x="112" y="85" fill="rgba(255,255,255,.7)" font-size="12" text-anchor="middle">Shape 20</text>
      </svg>`;
  }
  if(c === '21'){
    return `
      <svg viewBox="0 0 220 90" width="220" height="90" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="220" height="90" fill="none" />
        <path d="M40 15 L40 70 L180 70 L180 15" stroke="rgba(255,255,255,.85)" stroke-width="6" fill="none" stroke-linecap="round"/>
        <text x="112" y="85" fill="rgba(255,255,255,.7)" font-size="12" text-anchor="middle">Shape 21</text>
      </svg>`;
  }
  if(c === 'MAN'){
    return `
      <svg viewBox="0 0 220 90" width="220" height="90" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="220" height="90" fill="none" />
        <path d="M30 50 L190 50" stroke="rgba(255,255,255,.85)" stroke-width="6" fill="none" stroke-linecap="round"/>
        <text x="112" y="85" fill="rgba(255,255,255,.7)" font-size="12" text-anchor="middle">Manual length</text>
      </svg>`;
  }
  return `
    <svg viewBox="0 0 220 90" width="220" height="90" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="220" height="90" fill="none" />
      <path d="M30 50 L190 50" stroke="rgba(255,255,255,.85)" stroke-width="6" fill="none" stroke-linecap="round"/>
      <text x="112" y="85" fill="rgba(255,255,255,.7)" font-size="12" text-anchor="middle">Shape 00</text>
    </svg>`;
}

function ensureProject(projectId){
  store.update(s => {
    s.rebar = s.rebar || {};
    s.rebar[projectId] = s.rebar[projectId] || { bars: [] };
    return s;
  });
}

function getBars(projectId){
  const s = store.getState();
  return s.rebar?.[projectId]?.bars || [];
}

function setBars(projectId, bars){
  store.update(s => {
    s.rebar = s.rebar || {};
    s.rebar[projectId] = s.rebar[projectId] || { bars: [] };
    s.rebar[projectId].bars = bars;
    return s;
  });
}

function computeLine(bar){
  const dia = toNum(bar.dia);
  const qty = Math.max(0, Math.floor(toNum(bar.qty) || 0));
  const shape = shapeByCode(bar.shapeCode);

  const dims = {
    A: toNum(bar.A),
    B: toNum(bar.B),
    C: toNum(bar.C),
    D: toNum(bar.D),
    E: toNum(bar.E),
    manualLenMm: toNum(bar.manualLenMm)
  };

  const allowanceMm = toNum(bar.allowanceMm);
  const baseMm = Math.max(0, shape.calc(dims));
  const deductionMm = (shape.code === 'MAN' || shape.bends90 <= 0) ? 0 : (shape.bends90 * bendDeduction90Mm(dia));
  const cuttingLenMm = Math.max(0, baseMm + allowanceMm - deductionMm);

  const lengthM = mmToM(cuttingLenMm);
  const unitKgM = unitWeightKgPerM(dia);
  const unitKg = unitKgM * lengthM;
  const totalKg = unitKg * qty;

  const totalLenMm = cuttingLenMm * qty;
  const volCm3 = volumeCm3(dia, totalLenMm);

  return {
    ...bar,
    dia,
    qty,
    shapeCode: shape.code,
    shapeName: shape.name,
    cuttingLenMm,
    lengthM,
    unitKgM,
    unitKg,
    totalKg,
    totalLenMm,
    volCm3
  };
}

function defaultMark(bars){
  const n = bars.length + 1;
  return `B${String(n).padStart(3,'0')}`;
}

export const rebarEngine = {
  ensure: ensureProject,
  getBars,
  computeLine,
  getSchedule(projectId){
    const lines = getBars(projectId).map(computeLine);
    const totalKg = lines.reduce((a,b) => a + toNum(b.totalKg), 0);
    return { lines, totalKg };
  },
  mount({ rootEl, projectId }){
    ensureProject(projectId);

    const formCard = ui.el('div', { class:'card' });
    formCard.appendChild(ui.el('div', { class:'card__header' }, [
      ui.el('div', { class:'card__title', text:'Beginner Bar Entry (BS 8666 style)' }),
      ui.el('div', { class:'card__subtitle', text:'Select a shape code, enter dimensions in mm, and the schedule will compute cutting length and weight.' })
    ]));

    const formBody = ui.el('div', { class:'card__body' });

    const host = ui.el('input', { type:'text', value:'', placeholder:'e.g. TL.W06' });
    const rebarNo = ui.el('input', { type:'text', value:'', placeholder:'e.g. 07' });
    const dia = ui.el('input', { type:'number', value:'12', step:'1', min:'6' });
    const shape = ui.el('select');
    for(const s of SHAPES){
      shape.appendChild(ui.el('option', { value:s.code, text:`${s.code} — ${s.name}` }));
    }

    const A = ui.el('input', { type:'number', value:'1000', step:'1', min:'0' });
    const B = ui.el('input', { type:'number', value:'0', step:'1', min:'0' });
    const C = ui.el('input', { type:'number', value:'0', step:'1', min:'0' });
    const D = ui.el('input', { type:'number', value:'0', step:'1', min:'0' });
    const E = ui.el('input', { type:'number', value:'0', step:'1', min:'0' });
    const allowanceMm = ui.el('input', { type:'number', value:'0', step:'1', min:'0' });
    const manualLenMm = ui.el('input', { type:'number', value:'0', step:'1', min:'0' });
    const qty = ui.el('input', { type:'number', value:'1', step:'1', min:'0' });

    const shapePreview = ui.el('div', { class:'badge', style:'padding:10px' });

    const hint = ui.el('div', { class:'badge', text:'' });

    function currentBar(){
      return {
        id: store.uid('bar'),
        host: String(host.value || '').trim(),
        rebarNo: String(rebarNo.value || '').trim(),
        mark: '',
        dia: toNum(dia.value),
        shapeCode: String(shape.value),
        A: toNum(A.value),
        B: toNum(B.value),
        C: toNum(C.value),
        D: toNum(D.value),
        E: toNum(E.value),
        allowanceMm: toNum(allowanceMm.value),
        manualLenMm: toNum(manualLenMm.value),
        qty: Math.max(0, Math.floor(toNum(qty.value) || 0))
      };
    }

    function updateHint(){
      const bar = currentBar();
      const line = computeLine(bar);
      const used = shapeByCode(bar.shapeCode).dims;
      const dimText = used.length ? used.map(k => `${k}=${round1(bar[k])}mm`).join(', ') : '';
      const allowText = bar.allowanceMm ? `, allowance=${round1(bar.allowanceMm)}mm` : '';
      hint.textContent = `Cutting length = ${dimText || 'manual'}${allowText} => ${Math.round(line.cuttingLenMm)} mm | Total length = ${Math.round(line.totalLenMm)} mm | Volume = ${round3(line.volCm3)} cm³`;

      shapePreview.innerHTML = shapePreviewSvg(bar.shapeCode);

      const dims = { A, B, C, D, E };
      Object.entries(dims).forEach(([k, el]) => {
        el.disabled = !used.includes(k);
      });
      allowanceMm.disabled = (bar.shapeCode === 'MAN');
      manualLenMm.disabled = (bar.shapeCode !== 'MAN');
    }

    function addBar(){
      const bars = getBars(projectId);
      const next = currentBar();
      next.mark = defaultMark(bars);
      setBars(projectId, [...bars, next]);
      host.value = '';
      rebarNo.value = '';
      qty.value = '1';
    }

    const btnAdd = ui.el('button', { class:'btn btn--primary', text:'Add to Schedule' });
    btnAdd.addEventListener('click', addBar);

    const btnClear = ui.el('button', { class:'btn', text:'Clear All' });
    btnClear.addEventListener('click', () => setBars(projectId, []));

    const grid = ui.el('div', { class:'grid grid--2' }, [
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Host' }), host]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Rebar number' }), rebarNo]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Diameter (mm)' }), dia]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Shape code' }), shape]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Quantity (no.)' }), qty]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'A (mm)' }), A]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'B (mm)' }), B]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'C (mm)' }), C]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'D (mm)' }), D]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'E (mm)' }), E]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Allowance (mm)' }), allowanceMm]),
      ui.el('div', { class:'field' }, [ui.el('label', { text:'Manual cutting length (mm)' }), manualLenMm])
    ]);

    formBody.appendChild(grid);
    formBody.appendChild(ui.el('div', { style:'height:10px' }));
    formBody.appendChild(shapePreview);
    formBody.appendChild(ui.el('div', { style:'height:10px' }));
    formBody.appendChild(hint);
    formBody.appendChild(ui.el('div', { style:'height:10px' }));
    formBody.appendChild(ui.el('div', { class:'row' }, [btnAdd, btnClear]));
    formCard.appendChild(formBody);

    const tableCard = ui.el('div', { class:'card' });
    tableCard.appendChild(ui.el('div', { class:'card__header' }, [
      ui.el('div', { class:'card__title', text:'Bar Bending Schedule (BBS)' }),
      ui.el('div', { class:'card__subtitle', text:'Beginner output: cutting length and weight are calculated from your dimensions.' })
    ]));

    const tableBody = ui.el('div', { class:'card__body' });
    const totalBadge = ui.el('div', { class:'badge', text:'' });
    const wrap = ui.el('div', { class:'table-wrap' });
    const table = ui.el('table', { class:'table' });
    wrap.appendChild(table);
    tableBody.appendChild(totalBadge);
    tableBody.appendChild(ui.el('div', { style:'height:10px' }));
    tableBody.appendChild(wrap);
    tableCard.appendChild(tableBody);

    function rebuild(){
      updateHint();
      const sched = rebarEngine.getSchedule(projectId);
      totalBadge.textContent = `Total steel weight: ${round3(sched.totalKg)} kg`;

      table.innerHTML = '';
      table.appendChild(ui.el('thead', {}, [
        ui.el('tr', {}, [
          ui.el('th', { text:'Host' }),
          ui.el('th', { text:'Rebar No.' }),
          ui.el('th', { text:'Bar Dia' }),
          ui.el('th', { text:'Shape' }),
          ui.el('th', { text:'Quantity' }),
          ui.el('th', { text:'Shape Image' }),
          ui.el('th', { text:'A' }),
          ui.el('th', { text:'B' }),
          ui.el('th', { text:'C' }),
          ui.el('th', { text:'D' }),
          ui.el('th', { text:'E' }),
          ui.el('th', { text:'Total Bar Length (mm)' }),
          ui.el('th', { text:'Reinf. Volume (cm³)' }),
          ui.el('th', { text:'' })
        ])
      ]));

      const tbody = ui.el('tbody');
      sched.lines.forEach((l, idx) => {
        const btnDel = ui.el('button', { class:'btn', text:'Remove' });
        btnDel.addEventListener('click', () => {
          const bars = getBars(projectId);
          bars.splice(idx, 1);
          setBars(projectId, [...bars]);
        });

        tbody.appendChild(ui.el('tr', {}, [
          ui.el('td', { text: String(l.host || '') }),
          ui.el('td', { text: String(l.rebarNo || '') }),
          ui.el('td', { text: `${String(l.dia || '')} mm` }),
          ui.el('td', { text: String(l.shapeCode || '') }),
          ui.el('td', { text: String(l.qty || 0) }),
          ui.el('td', {}, [ui.el('div', { class:'badge', style:'padding:6px', text:'' })]),
          ui.el('td', { text: `${String(Math.round(toNum(l.A)))} mm` }),
          ui.el('td', { text: `${String(Math.round(toNum(l.B)))} mm` }),
          ui.el('td', { text: `${String(Math.round(toNum(l.C)))} mm` }),
          ui.el('td', { text: `${String(Math.round(toNum(l.D)))} mm` }),
          ui.el('td', { text: `${String(Math.round(toNum(l.E)))} mm` }),
          ui.el('td', { text: String(Math.round(toNum(l.totalLenMm))) }),
          ui.el('td', { text: `${round3(l.volCm3)}` }),
          ui.el('td', {}, [btnDel])
        ]));

        const imgCell = tbody.lastChild.children[5];
        const holder = imgCell.querySelector('.badge');
        if(holder) holder.innerHTML = shapePreviewSvg(l.shapeCode);
      });
      table.appendChild(tbody);
    }

    [host, rebarNo, dia, shape, A, B, C, D, E, allowanceMm, manualLenMm, qty].forEach(el => el.addEventListener('input', updateHint));
    shape.addEventListener('change', updateHint);

    rebuild();
    store.subscribe(rebuild);

    rootEl.appendChild(ui.el('div', { class:'grid grid--2' }, [
      ui.el('div', {}, [formCard]),
      ui.el('div', {}, [tableCard])
    ]));
  }
};
