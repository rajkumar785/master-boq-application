import { store } from '../storage.js';
import { ui } from '../ui.js';
import { ensurePdfJs } from './loader.js';

function clamp(n, a, b){
  return Math.max(a, Math.min(b, n));
}

function dist(a, b){
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy);
}

function polyArea(points){
  if(points.length < 3) return 0;
  let area = 0;
  for(let i=0;i<points.length;i++){
    const j = (i+1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

function ensureProjectTakeoff(state, projectId){
  state.takeoff = state.takeoff || {};
  if(!state.takeoff[projectId]){
    state.takeoff[projectId] = {
      scale: { pxPerUnit: null, unit: 'm' },
      measurements: [],
      drawing: null
    };
  }
}

function getCanvasSize(canvas){
  const rect = canvas.getBoundingClientRect();
  return { w: Math.max(1, Math.round(rect.width)), h: Math.max(1, Math.round(rect.height)) };
}

function resizeCanvas(canvas, overlay){
  const s = getCanvasSize(canvas);
  canvas.width = s.w;
  canvas.height = s.h;
  overlay.width = s.w;
  overlay.height = s.h;
}

function redraw({ canvas, overlay, drawingImg, state, projectId }){
  const ctx = canvas.getContext('2d');
  const octx = overlay.getContext('2d');

  ctx.clearRect(0,0,canvas.width,canvas.height);
  octx.clearRect(0,0,overlay.width,overlay.height);

  if(drawingImg){
    const scale = Math.min(canvas.width / drawingImg.width, canvas.height / drawingImg.height);
    const dw = drawingImg.width * scale;
    const dh = drawingImg.height * scale;
    const dx = (canvas.width - dw) / 2;
    const dy = (canvas.height - dh) / 2;
    ctx.drawImage(drawingImg, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.06)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,.65)';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Upload a drawing to start takeoff.', 18, 28);
  }

  const t = state.takeoff[projectId];
  const scale = t.scale.pxPerUnit;

  octx.lineWidth = 2;
  octx.strokeStyle = 'rgba(79,140,255,.9)';
  octx.fillStyle = 'rgba(79,140,255,.25)';

  for(const m of t.measurements){
    if(m.type === 'line'){
      octx.beginPath();
      octx.moveTo(m.a.x, m.a.y);
      octx.lineTo(m.b.x, m.b.y);
      octx.stroke();
      const px = dist(m.a, m.b);
      const val = scale ? (px / scale) : null;
      if(val != null){
        octx.fillStyle = 'rgba(0,0,0,.55)';
        octx.fillRect((m.a.x+m.b.x)/2 - 38, (m.a.y+m.b.y)/2 - 16, 76, 22);
        octx.fillStyle = 'rgba(255,255,255,.9)';
        octx.font = '12px Inter, sans-serif';
        octx.fillText(`${val.toFixed(3)} ${t.scale.unit}`, (m.a.x+m.b.x)/2 - 32, (m.a.y+m.b.y)/2);
      }
      octx.fillStyle = 'rgba(79,140,255,.9)';
    }

    if(m.type === 'area'){
      if(m.points.length >= 2){
        octx.beginPath();
        octx.moveTo(m.points[0].x, m.points[0].y);
        for(let i=1;i<m.points.length;i++) octx.lineTo(m.points[i].x, m.points[i].y);
        octx.closePath();
        octx.fill();
        octx.stroke();

        const pxA = polyArea(m.points);
        const val = scale ? (pxA / (scale*scale)) : null;
        if(val != null){
          const c = m.points[0];
          octx.fillStyle = 'rgba(0,0,0,.55)';
          octx.fillRect(c.x - 46, c.y - 18, 92, 22);
          octx.fillStyle = 'rgba(255,255,255,.9)';
          octx.font = '12px Inter, sans-serif';
          octx.fillText(`${val.toFixed(3)} ${t.scale.unit}²`, c.x - 40, c.y - 2);
        }
        octx.fillStyle = 'rgba(79,140,255,.25)';
      }
    }

    if(m.type === 'count'){
      octx.beginPath();
      octx.arc(m.p.x, m.p.y, 7, 0, Math.PI*2);
      octx.stroke();
    }
  }
}

function renderSummary({ summaryEl, state, projectId }){
  const t = state.takeoff[projectId];
  const scale = t.scale.pxPerUnit;

  let lineTotal = 0;
  let areaTotal = 0;
  let countTotal = 0;

  for(const m of t.measurements){
    if(m.type === 'line') lineTotal += dist(m.a, m.b);
    if(m.type === 'area') areaTotal += polyArea(m.points);
    if(m.type === 'count') countTotal += 1;
  }

  const lineVal = scale ? (lineTotal / scale) : null;
  const areaVal = scale ? (areaTotal / (scale*scale)) : null;

  summaryEl.innerHTML = '';
  summaryEl.appendChild(ui.el('div', { class:'badge', text:`Scale: ${scale ? `${scale.toFixed(3)} px/${t.scale.unit}` : 'Not calibrated'}` }));
  summaryEl.appendChild(ui.el('div', { class:'badge', text:`Line total: ${lineVal != null ? `${lineVal.toFixed(3)} ${t.scale.unit}` : `${Math.round(lineTotal)} px`}` }));
  summaryEl.appendChild(ui.el('div', { class:'badge', text:`Area total: ${areaVal != null ? `${areaVal.toFixed(3)} ${t.scale.unit}²` : `${Math.round(areaTotal)} px²`}` }));
  summaryEl.appendChild(ui.el('div', { class:'badge', text:`Count: ${countTotal}` }));
}

function fileToDataUrl(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function renderPdfToImage(file){
  const pdfjsLib = await ensurePdfJs();

  const array = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: array }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2 });
  const tmp = document.createElement('canvas');
  tmp.width = viewport.width;
  tmp.height = viewport.height;

  const ctx = tmp.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;

  return tmp.toDataURL('image/png');
}

export const takeoff = {
  mount({ projectId, canvas, overlay, summaryEl }){
    store.update(s => {
      ensureProjectTakeoff(s, projectId);
      return s;
    });

    let tool = 'scale';
    let drawingImg = null;
    let scaleTarget = { realLength: 1, unit: 'm' };
    let pending = null;

    function getState(){
      return store.getState();
    }

    function save(fn){
      store.update(s => {
        ensureProjectTakeoff(s, projectId);
        fn(s);
        return s;
      });
    }

    function refresh(){
      const state = getState();
      redraw({ canvas, overlay, drawingImg, state, projectId });
      renderSummary({ summaryEl, state, projectId });
    }

    function toPoint(e){
      const rect = overlay.getBoundingClientRect();
      return {
        x: clamp(e.clientX - rect.left, 0, rect.width),
        y: clamp(e.clientY - rect.top, 0, rect.height)
      };
    }

    function onDown(e){
      overlay.setPointerCapture?.(e.pointerId);
      const p = toPoint(e);

      if(tool === 'line' || tool === 'scale'){
        pending = { type:'line', a:p, b:p };
        return;
      }

      if(tool === 'area'){
        if(!pending) pending = { type:'area', points:[] };
        pending.points.push(p);
        refresh();
        return;
      }

      if(tool === 'count'){
        save(s => {
          s.takeoff[projectId].measurements.push({ id: store.uid('cnt'), type:'count', p });
        });
        refresh();
      }
    }

    function onMove(e){
      if(!pending) return;
      const p = toPoint(e);
      if(pending.type === 'line'){
        pending.b = p;
        const state = getState();
        redraw({ canvas, overlay, drawingImg, state, projectId });
        const octx = overlay.getContext('2d');
        octx.lineWidth = 2;
        octx.strokeStyle = 'rgba(43,213,118,.95)';
        octx.beginPath();
        octx.moveTo(pending.a.x, pending.a.y);
        octx.lineTo(pending.b.x, pending.b.y);
        octx.stroke();
      }
    }

    function onUp(){
      if(!pending) return;

      if(pending.type === 'line'){
        const px = dist(pending.a, pending.b);

        if(tool === 'scale'){
          save(s => {
            const t = s.takeoff[projectId];
            t.scale.unit = scaleTarget.unit;
            t.scale.pxPerUnit = px / (scaleTarget.realLength || 1);
          });
        } else {
          save(s => {
            s.takeoff[projectId].measurements.push({ id: store.uid('ln'), type:'line', a: pending.a, b: pending.b });
          });
        }

        pending = null;
        refresh();
        return;
      }
    }

    function onDblClick(){
      if(tool !== 'area' || !pending) return;
      if(pending.points.length < 3){
        pending = null;
        refresh();
        return;
      }
      save(s => {
        s.takeoff[projectId].measurements.push({ id: store.uid('ar'), type:'area', points: pending.points });
      });
      pending = null;
      refresh();
    }

    function onResize(){
      resizeCanvas(canvas, overlay);
      refresh();
    }

    resizeCanvas(canvas, overlay);
    refresh();

    window.addEventListener('resize', onResize);
    overlay.addEventListener('pointerdown', onDown);
    overlay.addEventListener('pointermove', onMove);
    overlay.addEventListener('pointerup', onUp);
    overlay.addEventListener('dblclick', onDblClick);

    return {
      setTool(t){ tool = t; pending = null; refresh(); },
      setScaleTarget(target){
        scaleTarget = { ...scaleTarget, ...target };
        save(s => {
          s.takeoff[projectId].scale.unit = scaleTarget.unit;
        });
        refresh();
      },
      clearMeasurements(){
        save(s => { s.takeoff[projectId].measurements = []; });
        refresh();
      },
      async loadFile(file){
        let url;
        if(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')){
          try{
            url = await renderPdfToImage(file);
          }catch(err){
            alert(err?.message || 'Unable to load PDF.');
            return;
          }
        } else {
          url = await fileToDataUrl(file);
        }

        const img = new Image();
        img.onload = () => {
          drawingImg = img;
          save(s => {
            s.takeoff[projectId].drawing = { name: file.name, type: file.type || 'image', loadedAt: new Date().toISOString() };
          });
          refresh();
        };
        img.src = url;
      }
      ,
      listMeasurements(){
        const s = store.getState();
        ensureProjectTakeoff(s, projectId);
        return s.takeoff[projectId].measurements || [];
      },
      updateMeasurement(id, patch){
        if(!id) return;
        save(s => {
          const m = s.takeoff[projectId].measurements.find(x => x.id === id);
          if(!m) return;
          Object.assign(m, patch);
        });
        refresh();
      }
    };
  }
};
