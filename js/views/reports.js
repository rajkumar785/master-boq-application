import { ui } from '../ui.js';
import { store } from '../storage.js';
import { reporting } from '../workflows/reporting.js';

export async function reportsView(){
  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Reports' }),
    ui.el('div', { class:'card__subtitle', text:'Generate BOQ, material takeoff, rate analysis, rebar schedule, progress, and cashflow reports.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  const btnPdf = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Export BOQ PDF' });
  const btnXlsx = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Export BOQ Excel' });
  const btnMat = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Export Material Takeoff PDF' });
  const btnProg = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Export Progress PDF' });
  const btnCash = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Export Cashflow PDF' });
  const btnRebar = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Export Rebar Schedule PDF' });
  const btnConc = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Export Concrete Mix PDF' });
  const btnJson = ui.el('button', { class:'btn', type:'button', text:'Export Project JSON' });

  btnPdf.addEventListener('click', async () => {
    const s = store.getState();
    const p = s.projects?.find(x => x.id === s.activeProjectId) || null;
    if(!p) return alert('Select an active project first.');
    await reporting.exportBoqPdf({ projectId: p.id, projectName: p.name });
  });

  btnXlsx.addEventListener('click', async () => {
    const s = store.getState();
    const p = s.projects?.find(x => x.id === s.activeProjectId) || null;
    if(!p) return alert('Select an active project first.');
    await reporting.exportBoqExcel({ projectId: p.id, projectName: p.name });
  });

  btnMat.addEventListener('click', async () => {
    const s = store.getState();
    const p = s.projects?.find(x => x.id === s.activeProjectId) || null;
    if(!p) return alert('Select an active project first.');
    await reporting.exportMaterialTakeoffPdf({ projectId: p.id, projectName: p.name });
  });

  btnProg.addEventListener('click', async () => {
    const s = store.getState();
    const p = s.projects?.find(x => x.id === s.activeProjectId) || null;
    if(!p) return alert('Select an active project first.');
    await reporting.exportProgressPdf({ projectId: p.id, projectName: p.name });
  });

  btnCash.addEventListener('click', async () => {
    const s = store.getState();
    const p = s.projects?.find(x => x.id === s.activeProjectId) || null;
    if(!p) return alert('Select an active project first.');
    await reporting.exportCashflowPdf({ projectId: p.id, projectName: p.name });
  });

  btnRebar.addEventListener('click', async () => {
    const s = store.getState();
    const p = s.projects?.find(x => x.id === s.activeProjectId) || null;
    if(!p) return alert('Select an active project first.');
    await reporting.exportRebarSchedulePdf({ projectId: p.id, projectName: p.name });
  });

  btnConc.addEventListener('click', async () => {
    const s = store.getState();
    const p = s.projects?.find(x => x.id === s.activeProjectId) || null;
    if(!p) return alert('Select an active project first.');
    await reporting.exportConcreteMixPdf({ projectId: p.id, projectName: p.name });
  });
  btnJson.addEventListener('click', () => {
    const json = store.exportBackup();
    const blob = new Blob([json], { type:'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-smm7-project-export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  body.appendChild(ui.el('div', { class:'row' }, [btnJson, btnPdf, btnXlsx, btnMat, btnProg, btnCash, btnRebar, btnConc]));
  body.appendChild(ui.el('div', { style:'height:12px' }));
  body.appendChild(ui.el('div', { class:'badge', text:'Exports are scaffolded. Next: generate formatted report templates and real PDF/XLSX output.' }));

  card.appendChild(body);
  return card;
}
