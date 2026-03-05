import { ui } from '../ui.js';
import { store } from '../storage.js';
import { boqEngine } from '../workflows/boq.js';
import { ProfessionalBOQGenerator, displayProfessionalBOQ } from '../workflows/professional-boq-generator.js';

export async function boqView(){
  const state = store.getState();
  const projectId = state.activeProjectId;

  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'BOQ Generator' }),
    ui.el('div', { class:'card__subtitle', text:'Excel-style editable BOQ with section totals and grand total.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  if(!projectId){
    body.appendChild(ui.el('div', { class:'badge', text:'Create/select an active project first (Project Management).' }));
    card.appendChild(body);
    return card;
  }

  const btnAdd = ui.el('button', { class:'btn', type:'button', text:'Add Line Item' });
  const btnAddSection = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Add Section Header' });
  const btnProfessional = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Professional BOQ' });
  const btnExport = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Export' });
  const totals = ui.el('div', { class:'row' }, [
    ui.el('span', { class:'badge', id:'boqGrandTotal', text:'Grand Total: 0.00' })
  ]);

  const actions = ui.el('div', { class:'row' }, [btnAdd, btnAddSection, btnProfessional, btnExport, totals]);
  body.appendChild(actions);
  body.appendChild(ui.el('div', { style:'height:12px' }));

  const wrap = ui.el('div', { class:'table-wrap' });
  const table = ui.el('table', { class:'table', id:'boqTable' });
  wrap.appendChild(table);
  body.appendChild(wrap);

  card.appendChild(body);

  const api = boqEngine.mount({ projectId, tableEl: table, grandTotalEl: document.getElementById('boqGrandTotal') });
  btnAdd.addEventListener('click', () => api.addItem());
  btnAddSection.addEventListener('click', () => api.addSection());
  
  // Professional BOQ functionality
  let isProfessionalMode = false;
  const professionalContainer = ui.el('div', { id: 'professionalBOQ', style: 'display: none;' });
  body.appendChild(professionalContainer);
  
  btnProfessional.addEventListener('click', () => {
    isProfessionalMode = !isProfessionalMode;
    if (isProfessionalMode) {
      wrap.style.display = 'none';
      professionalContainer.style.display = 'block';
      btnProfessional.textContent = 'Edit Mode';
      
      // Generate professional BOQ
      const state = store.getState();
      const project = state.projects?.find(p => p.id === projectId);
      const boqItems = api.getItems();
      
      const generator = new ProfessionalBOQGenerator();
      const professionalBOQ = generator.generateBOQ(boqItems, project || {});
      displayProfessionalBOQ(professionalBOQ, professionalContainer);
      
      // Setup export functions
      window.exportBOQ = (format) => {
        let content, filename, mimeType;
        
        switch(format) {
          case 'html':
            content = generator.exportToHTML(professionalBOQ);
            filename = `BOQ_${project?.name || 'project'}.html`;
            mimeType = 'text/html';
            break;
          case 'csv':
            content = generator.exportToCSV(professionalBOQ);
            filename = `BOQ_${project?.name || 'project'}.csv`;
            mimeType = 'text/csv';
            break;
          case 'json':
            content = generator.exportToJSON(professionalBOQ);
            filename = `BOQ_${project?.name || 'project'}.json`;
            mimeType = 'application/json';
            break;
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      };
      
    } else {
      wrap.style.display = 'block';
      professionalContainer.style.display = 'none';
      btnProfessional.textContent = 'Professional BOQ';
    }
  });
  
  btnExport.addEventListener('click', () => {
    if (isProfessionalMode) {
      // Export professional BOQ
      window.exportBOQ('html');
    } else {
      // Export simple BOQ as CSV
      const items = api.getItems();
      let csv = 'Description,Unit,Quantity,Rate,Amount\n';
      items.forEach(item => {
        csv += `"${item.description}","${item.unit}",${item.qty},${item.rate},${item.qty * item.rate}\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BOQ_simple.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  });

  return card;
}
