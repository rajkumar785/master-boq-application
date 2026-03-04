import { ui } from '../ui.js';
import { store } from '../storage.js';
import { cashflowEngine } from '../workflows/cashflow.js';

function money(n){
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function drawSCurve(canvas, rows){
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0,0,w,h);

  ctx.fillStyle = 'rgba(255,255,255,.04)';
  ctx.fillRect(0,0,w,h);

  const pad = 32;
  const plotW = w - pad*2;
  const plotH = h - pad*2;

  const maxY = Math.max(1, ...rows.map(r => r.cumulative));

  // axes
  ctx.strokeStyle = 'rgba(255,255,255,.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, h-pad);
  ctx.lineTo(w-pad, h-pad);
  ctx.stroke();

  // curve
  ctx.strokeStyle = 'rgba(79,140,255,.95)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  rows.forEach((r, i) => {
    const x = pad + (i/(Math.max(1, rows.length-1))) * plotW;
    const y = (h-pad) - (r.cumulative/maxY) * plotH;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // points
  ctx.fillStyle = 'rgba(43,213,118,.9)';
  rows.forEach((r, i) => {
    const x = pad + (i/(Math.max(1, rows.length-1))) * plotW;
    const y = (h-pad) - (r.cumulative/maxY) * plotH;
    ctx.beginPath();
    ctx.arc(x,y,3.2,0,Math.PI*2);
    ctx.fill();
  });
}

export async function cashflowView(){
  const s = store.getState();
  const projectId = s.activeProjectId;

  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Cash Flow Forecast' }),
    ui.el('div', { class:'card__subtitle', text:'Monthly expenditure projection and S-curve (planned).' })
  ]));

  const body = ui.el('div', { class:'card__body' });

  if(!projectId){
    body.appendChild(ui.el('div', { class:'badge', text:'Select an active project first.' }));
    card.appendChild(body);
    return card;
  }

  const project = (s.projects || []).find(p => p.id === projectId) || null;
  const months = Math.max(1, Math.floor(project?.durationMonths || 12));
  cashflowEngine.ensure(projectId, months);

  const info = ui.el('div', { class:'row' }, [
    ui.el('span', { class:'badge', id:'cfGrand', text:'Grand Total: 0.00' }),
    ui.el('span', { class:'badge', id:'cfMonths', text:`Months: ${months}` })
  ]);

  const grid = ui.el('div', { class:'grid grid--2' });
  const left = ui.el('div');
  const right = ui.el('div');

  const wrap = ui.el('div', { class:'table-wrap' });
  const table = ui.el('table', { class:'table' });
  wrap.appendChild(table);

  const canvasWrap = ui.el('div', { class:'chart' });
  const canvas = ui.el('canvas', { width:'820', height:'420' });
  canvasWrap.appendChild(canvas);

  left.appendChild(wrap);
  right.appendChild(canvasWrap);

  grid.appendChild(left);
  grid.appendChild(right);

  body.appendChild(info);
  body.appendChild(ui.el('div', { style:'height:12px' }));
  body.appendChild(grid);

  function rebuild(){
    const plan = cashflowEngine.getPlan(projectId);
    document.getElementById('cfGrand').textContent = `Grand Total: ${money(plan.grand)}`;

    table.innerHTML = '';
    table.appendChild(ui.el('thead', {}, [
      ui.el('tr', {}, [
        ui.el('th', { text:'Month' }),
        ui.el('th', { text:'% Allocation' }),
        ui.el('th', { text:'Amount' }),
        ui.el('th', { text:'Cumulative' })
      ])
    ]));

    const tbody = ui.el('tbody');
    for(let i=0;i<plan.rows.length;i++){
      const r = plan.rows[i];
      const pctInp = ui.el('input', { type:'number', step:'0.1', value: String(r.pct) });
      pctInp.addEventListener('change', () => cashflowEngine.setMonthlyPct(projectId, i, toNum(pctInp.value)));

      tbody.appendChild(ui.el('tr', {}, [
        ui.el('td', { text: String(r.month) }),
        ui.el('td', {}, [pctInp]),
        ui.el('td', { text: money(r.amount) }),
        ui.el('td', { text: money(r.cumulative) })
      ]));
    }
    table.appendChild(tbody);

    drawSCurve(canvas, plan.rows);
  }

  rebuild();
  store.subscribe(rebuild);

  card.appendChild(body);
  return card;
}
