import { store } from '../storage.js';
import { ensureJsPdfAutoTable, ensureXlsx } from './loader.js';
import { progressEngine } from './progress.js';
import { cashflowEngine } from './cashflow.js';
import { rebarEngine } from './rebar.js';

function money(n){
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getBoqLines(projectId){
  const s = store.getState();
  return s.boq?.[projectId]?.lines || [];
}

function buildBoqRows(projectId){
  const lines = getBoqLines(projectId);
  const rows = [];
  let currentSection = null;
  let sectionTotal = 0;

  function flushSectionTotal(){
    if(!currentSection) return;
    rows.push([ '', `${currentSection} — Section Total`, '', '', '', sectionTotal ]);
    sectionTotal = 0;
  }

  for(const l of lines){
    if(l.type === 'section'){
      flushSectionTotal();
      currentSection = l.section || 'Section';
      rows.push([ '', currentSection, '', '', '', '' ]);
      continue;
    }
    const qty = Number(l.qty || 0);
    const rate = Number(l.rate || 0);
    const amt = qty * rate;
    sectionTotal += amt;
    rows.push([ l.itemNo || '', l.description || '', l.unit || '', qty, rate, amt ]);
  }

  flushSectionTotal();
  return rows;
}

function addHeaderFooter(doc, { title, projectName }){
  const pageCount = doc.getNumberOfPages();
  for(let i=1;i<=pageCount;i++){
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(170);
    doc.text(title, 40, 22);
    doc.text(projectName ? `Project: ${projectName}` : 'Project: N/A', 40, 34);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 18, { align:'right' });
    doc.setTextColor(0);
  }
}

function addTitleBlock(doc, { title, projectName, y=54 }){
  doc.setFontSize(14);
  doc.text(title, 40, y);
  doc.setFontSize(10);
  doc.text(`Project: ${projectName || 'N/A'}`, 40, y + 18);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, y + 34);
}

function boqGrandTotal(projectId){
  const lines = getBoqLines(projectId);
  return lines.reduce((acc, l) => (l.type === 'item' ? acc + Number(l.qty||0)*Number(l.rate||0) : acc), 0);
}

function buildMaterialTakeoffRows(projectId){
  // Simple rule-based material takeoff from BOQ quantities.
  // Concrete (m³): Cement 6 bags, Sand 0.45 m³, Aggregate 0.9 m³ per 1 m³.
  // Reinforcement (kg): Steel kg directly.
  const lines = getBoqLines(projectId);
  let concreteM3 = 0;
  let steelKg = 0;

  for(const l of lines){
    if(l.type !== 'item') continue;
    const qty = Number(l.qty || 0);
    const unit = String(l.unit || '').trim().toLowerCase();
    const desc = String(l.description || '').toLowerCase();

    if(unit === 'm³' || unit === 'm3'){
      if(desc.includes('concrete')) concreteM3 += qty;
    }
    if(unit === 'kg'){
      if(desc.includes('reinforcement') || desc.includes('rebar') || desc.includes('steel')) steelKg += qty;
    }
  }

  const cementBags = concreteM3 * 6;
  const sandM3 = concreteM3 * 0.45;
  const aggM3 = concreteM3 * 0.9;

  return [
    ['Concrete (from BOQ)', 'm³', concreteM3],
    ['Cement (6 bags/m³)', 'bags', cementBags],
    ['Sand (0.45 m³/m³)', 'm³', sandM3],
    ['Aggregate (0.9 m³/m³)', 'm³', aggM3],
    ['Reinforcement steel (from BOQ)', 'kg', steelKg]
  ];
}

function sumConcreteM3(projectId){
  const lines = getBoqLines(projectId);
  let concreteM3 = 0;
  for(const l of lines){
    if(l.type !== 'item') continue;
    const qty = Number(l.qty || 0);
    const unit = String(l.unit || '').trim().toLowerCase();
    const desc = String(l.description || '').toLowerCase();
    if((unit === 'm³' || unit === 'm3') && desc.includes('concrete')) concreteM3 += qty;
  }
  return concreteM3;
}

function buildConcreteMixRows(projectId){
  const wet = sumConcreteM3(projectId);
  const dry = wet * 1.54;

  // Default to M20 1:1.5:3
  const ratio = [1, 1.5, 3];
  const sum = ratio.reduce((a,b)=>a+b,0);
  const cementM3 = dry * (ratio[0] / sum);
  const sandM3 = dry * (ratio[1] / sum);
  const aggM3 = dry * (ratio[2] / sum);

  const cementBags = cementM3 / 0.035;

  return [
    ['Concrete wet volume (from BOQ)', 'm³', wet],
    ['Dry volume factor', '-', 1.54],
    ['Dry volume', 'm³', dry],
    ['Mix grade (assumed)', '-', 'M20 (1:1.5:3)'],
    ['Cement', 'bags', cementBags],
    ['Sand', 'm³', sandM3],
    ['Aggregate', 'm³', aggM3]
  ];
}

function buildRebarScheduleRows(projectId){
  // Prefer true BBS rows if the user entered bars in the BS 8666 beginner schedule.
  const s = store.getState();
  const bars = s.rebar?.[projectId]?.bars || [];
  if(bars.length){
    const sched = rebarEngine.getSchedule(projectId);
    return sched.lines.map(l => [
      String(l.host || ''),
      String(l.rebarNo || ''),
      String(l.dia || ''),
      String(l.shapeCode || ''),
      String(Number(l.qty || 0)),
      String(Math.round(Number(l.A || 0))),
      String(Math.round(Number(l.B || 0))),
      String(Math.round(Number(l.C || 0))),
      String(Math.round(Number(l.D || 0))),
      String(Math.round(Number(l.E || 0))),
      String(Math.round(Number(l.totalLenMm || 0))),
      Number(l.volCm3 || 0)
    ]);
  }

  // Fallback: if BOQ contains reinforcement in kg, generate a simple summary breakdown.
  const lines = getBoqLines(projectId);
  let steelKg = 0;
  for(const l of lines){
    if(l.type !== 'item') continue;
    const qty = Number(l.qty || 0);
    const unit = String(l.unit || '').trim().toLowerCase();
    const desc = String(l.description || '').toLowerCase();
    if(unit === 'kg'){
      if(desc.includes('reinforcement') || desc.includes('rebar') || desc.includes('steel')) steelKg += qty;
    }
  }

  const breakdown = [
    { dia: 8, pct: 10 },
    { dia: 10, pct: 15 },
    { dia: 12, pct: 30 },
    { dia: 16, pct: 25 },
    { dia: 20, pct: 20 }
  ];

  return breakdown.map((b, i) => {
    const w = steelKg * (b.pct/100);
    return [`RB${String(i+1).padStart(2,'0')}`, `${b.dia}`, `${b.pct}%`, w];
  });
}

export const reporting = {
  async exportBoqPdf({ projectId, projectName }){
    const { jspdf } = await ensureJsPdfAutoTable();
    const { jsPDF } = jspdf;

    const doc = new jsPDF({ orientation:'p', unit:'pt', format:'a4' });

    addTitleBlock(doc, { title: 'Bill of Quantities (SMM7)', projectName, y: 54 });

    const rows = buildBoqRows(projectId);

    doc.autoTable({
      startY: 108,
      head: [[ 'Item No.', 'Description', 'Unit', 'Qty', 'Rate', 'Amount' ]],
      body: rows.map(r => [
        String(r[0] ?? ''),
        String(r[1] ?? ''),
        String(r[2] ?? ''),
        typeof r[3] === 'number' ? r[3].toFixed(3) : String(r[3] ?? ''),
        typeof r[4] === 'number' ? money(r[4]) : String(r[4] ?? ''),
        typeof r[5] === 'number' ? money(r[5]) : String(r[5] ?? '')
      ]),
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [30, 48, 86] },
      didParseCell: (data) => {
        const row = data.row?.raw;
        if(!row) return;
        const desc = row[1] || '';
        const isSectionHeader = row[0] === '' && row[2] === '' && row[3] === '' && row[4] === '' && row[5] === '';
        const isSectionTotal = row[0] === '' && String(desc).includes('Section Total');

        if(isSectionHeader || isSectionTotal){
          data.cell.styles.fontStyle = 'bold';
          if(isSectionTotal){
            data.cell.styles.fillColor = [18, 31, 54];
          }
        }
      }
    });

    const grand = boqGrandTotal(projectId);

    const y = doc.lastAutoTable.finalY + 16;
    doc.setFontSize(11);
    doc.text(`Grand Total: ${money(grand)}`, 40, y);

    addHeaderFooter(doc, { title: 'BOQ (SMM7) — Smart SMM7 Platform', projectName: projectName || 'N/A' });

    doc.save(`BOQ_${(projectName || 'Project').replace(/\s+/g,'_')}.pdf`);
  },

  async exportMaterialTakeoffPdf({ projectId, projectName }){
    const { jspdf } = await ensureJsPdfAutoTable();
    const { jsPDF } = jspdf;

    const doc = new jsPDF({ orientation:'p', unit:'pt', format:'a4' });
    addTitleBlock(doc, { title: 'Material Takeoff Summary', projectName, y: 54 });

    const rows = buildMaterialTakeoffRows(projectId);
    doc.autoTable({
      startY: 108,
      head: [[ 'Material', 'Unit', 'Quantity' ]],
      body: rows.map(r => [String(r[0]), String(r[1]), Number(r[2] || 0).toFixed(3)]),
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [30, 48, 86] }
    });

    addHeaderFooter(doc, { title: 'Material Takeoff — Smart SMM7 Platform', projectName: projectName || 'N/A' });
    doc.save(`Material_Takeoff_${(projectName || 'Project').replace(/\s+/g,'_')}.pdf`);
  },

  async exportProgressPdf({ projectId, projectName }){
    const { jspdf } = await ensureJsPdfAutoTable();
    const { jsPDF } = jspdf;

    progressEngine.ensure(projectId);
    const sum = progressEngine.getSummary(projectId);

    const s = store.getState();
    const lines = s.boq?.[projectId]?.lines || [];
    const completed = s.progress?.[projectId]?.completed || {};

    const doc = new jsPDF({ orientation:'p', unit:'pt', format:'a4' });
    addTitleBlock(doc, { title: 'Progress Report', projectName, y: 54 });

    doc.setFontSize(10);
    doc.text(`Overall Progress: ${sum.pct.toFixed(1)}%`, 40, 110);

    const rows = lines
      .filter(l => l.type === 'item')
      .map(l => {
        const planned = Number(l.qty || 0);
        const comp = Number(completed[l.id] || 0);
        const pct = planned > 0 ? (Math.min(comp, planned) / planned) * 100 : 0;
        return [l.description || '', l.unit || '', planned, comp, pct];
      });

    doc.autoTable({
      startY: 130,
      head: [[ 'Description', 'Unit', 'Planned', 'Completed', '%' ]],
      body: rows.map(r => [
        String(r[0]),
        String(r[1]),
        Number(r[2] || 0).toFixed(3),
        Number(r[3] || 0).toFixed(3),
        `${Number(r[4] || 0).toFixed(1)}%`
      ]),
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [30, 48, 86] }
    });

    addHeaderFooter(doc, { title: 'Progress — Smart SMM7 Platform', projectName: projectName || 'N/A' });
    doc.save(`Progress_${(projectName || 'Project').replace(/\s+/g,'_')}.pdf`);
  },

  async exportCashflowPdf({ projectId, projectName }){
    const { jspdf } = await ensureJsPdfAutoTable();
    const { jsPDF } = jspdf;

    // ensure plan exists
    const s = store.getState();
    const project = (s.projects || []).find(p => p.id === projectId) || null;
    cashflowEngine.ensure(projectId, Math.max(1, Math.floor(project?.durationMonths || 12)));

    const plan = cashflowEngine.getPlan(projectId);

    const doc = new jsPDF({ orientation:'p', unit:'pt', format:'a4' });
    addTitleBlock(doc, { title: 'Cashflow Forecast (Planned)', projectName, y: 54 });

    doc.setFontSize(10);
    doc.text(`BOQ Grand Total: ${money(plan.grand)}`, 40, 110);

    doc.autoTable({
      startY: 130,
      head: [[ 'Month', '%', 'Amount', 'Cumulative' ]],
      body: plan.rows.map(r => [
        String(r.month),
        `${Number(r.pct || 0).toFixed(1)}%`,
        money(r.amount),
        money(r.cumulative)
      ]),
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [30, 48, 86] }
    });

    addHeaderFooter(doc, { title: 'Cashflow — Smart SMM7 Platform', projectName: projectName || 'N/A' });
    doc.save(`Cashflow_${(projectName || 'Project').replace(/\s+/g,'_')}.pdf`);
  },

  async exportRebarSchedulePdf({ projectId, projectName }){
    const { jspdf } = await ensureJsPdfAutoTable();
    const { jsPDF } = jspdf;

    const doc = new jsPDF({ orientation:'p', unit:'pt', format:'a4' });
    addTitleBlock(doc, { title: 'Reinforcement Schedule (Summary)', projectName, y: 54 });

    const rows = buildRebarScheduleRows(projectId);

    const s = store.getState();
    const hasBars = (s.rebar?.[projectId]?.bars || []).length > 0;
    if(hasBars){
      addTitleBlock(doc, { title: 'Bar Bending Schedule (BS 8666) — Beginner', projectName, y: 54 });
      doc.autoTable({
        startY: 108,
        head: [[ 'Host', 'Rebar No.', 'Dia (mm)', 'Shape', 'Qty', 'A', 'B', 'C', 'D', 'E', 'Total Bar Length (mm)', 'Reinf. Volume (cm³)' ]],
        body: rows.map(r => [
          String(r[0]),
          String(r[1]),
          String(r[2]),
          String(r[3]),
          String(r[4]),
          String(r[5]),
          String(r[6]),
          String(r[7]),
          String(r[8]),
          String(r[9]),
          String(r[10]),
          typeof r[11] === 'number' ? Number(r[11]).toFixed(2) : String(r[11])
        ]),
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [30, 48, 86] }
      });

      const totalKg = rebarEngine.getSchedule(projectId).totalKg;
      const y = doc.lastAutoTable.finalY + 14;
      doc.setFontSize(10);
      doc.text(`Total steel weight: ${money(totalKg)} kg`, 40, y);
    }else{
      doc.autoTable({
        startY: 108,
        head: [[ 'Bar Mark', 'Dia (mm)', 'Allocation', 'Weight (kg)' ]],
        body: rows.map(r => [String(r[0]), String(r[1]), String(r[2]), money(r[3])]),
        styles: { fontSize: 9, cellPadding: 5 },
        headStyles: { fillColor: [30, 48, 86] }
      });
    }

    addHeaderFooter(doc, { title: 'Rebar Schedule — Smart SMM7 Platform', projectName: projectName || 'N/A' });
    doc.save(`Rebar_Schedule_${(projectName || 'Project').replace(/\s+/g,'_')}.pdf`);
  },

  async exportConcreteMixPdf({ projectId, projectName }){
    const { jspdf } = await ensureJsPdfAutoTable();
    const { jsPDF } = jspdf;

    const doc = new jsPDF({ orientation:'p', unit:'pt', format:'a4' });
    addTitleBlock(doc, { title: 'Concrete Mix Summary', projectName, y: 54 });

    const rows = buildConcreteMixRows(projectId);
    doc.autoTable({
      startY: 108,
      head: [[ 'Parameter', 'Unit', 'Value' ]],
      body: rows.map(r => [
        String(r[0]),
        String(r[1]),
        typeof r[2] === 'number' ? Number(r[2]).toFixed(3) : String(r[2])
      ]),
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [30, 48, 86] }
    });

    addHeaderFooter(doc, { title: 'Concrete Mix — Smart SMM7 Platform', projectName: projectName || 'N/A' });
    doc.save(`Concrete_Mix_${(projectName || 'Project').replace(/\s+/g,'_')}.pdf`);
  },

  async exportBoqExcel({ projectId, projectName }){
    const XLSX = await ensureXlsx();
    const rows = buildBoqRows(projectId);

    const aoa = [
      ['Item No.', 'Description', 'Unit', 'Qty', 'Rate', 'Amount'],
      ...rows.map(r => r.map((v, i) => {
        if(i === 3 || i === 4 || i === 5) return typeof v === 'number' ? v : (Number(v) || v);
        return v;
      }))
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BOQ');
    XLSX.writeFile(wb, `BOQ_${(projectName || 'Project').replace(/\s+/g,'_')}.xlsx`);
  }
};
