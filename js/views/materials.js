import { ui } from '../ui.js';
import { materialsEngine } from '../workflows/materials.js';
import { calculateMaterialTakeoff, generateMaterialTakeoffReport, displayMaterialTakeoff } from '../workflows/professional-material-takeoff.js';

export async function materialsView(){
  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Material Takeoff' }),
    ui.el('div', { class:'card__subtitle', text:'Convert BOQ quantities into materials with waste factors.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  
  // Add toggle for professional mode
  const btnProfessional = ui.el('button', { class:'btn btn--secondary', type:'button', text:'Professional Takeoff' });
  body.appendChild(btnProfessional);
  body.appendChild(ui.el('div', { style:'height:12px' }));
  
  const mountEl = ui.el('div', { id: 'standardMaterialTakeoff' });
  const professionalContainer = ui.el('div', { id: 'professionalMaterialTakeoff', style: 'display: none;' });
  
  body.appendChild(mountEl);
  body.appendChild(professionalContainer);
  card.appendChild(body);

  // Mount standard material engine
  materialsEngine.mount({ rootEl: mountEl });
  
  // Professional material takeoff functionality
  let isProfessionalMode = false;
  
  btnProfessional.addEventListener('click', () => {
    isProfessionalMode = !isProfessionalMode;
    if (isProfessionalMode) {
      mountEl.style.display = 'none';
      professionalContainer.style.display = 'block';
      btnProfessional.textContent = 'Standard Mode';
      
      // Generate professional material takeoff
      const state = store.getState();
      const projectId = state.activeProjectId;
      const boqItems = state.boq?.[projectId] || [];
      
      if (boqItems.length === 0) {
        professionalContainer.innerHTML = '<div class="badge">No BOQ items found. Please add items to BOQ first.</div>';
        return;
      }
      
      const report = generateMaterialTakeoffReport(boqItems);
      
      // Display report
      professionalContainer.innerHTML = '';
      
      // Summary card
      const summaryCard = ui.el('div', { class:'card' }, [
        ui.el('div', { class:'card__header' }, [
          ui.el('div', { class:'card__title', text:'Material Takeoff Summary' }),
          ui.el('div', { class:'card__subtitle', text:`${report.summary.totalItems} BOQ items processed` })
        ]),
        ui.el('div', { class:'card__body' }, [
          ui.el('div', { class:'row' }, [
            ui.el('span', { class:'badge', text:`Items: ${report.summary.itemsWithMaterials}` }),
            ui.el('span', { class:'badge', text:`Materials: ${report.summary.uniqueMaterials}` }),
            ui.el('span', { class:'badge', text:`Types: ${report.summary.totalMaterialTypes.length}` })
          ])
        ])
      ]);
      professionalContainer.appendChild(summaryCard);
      
      // Detailed breakdown for each item
      report.projectMaterials.forEach(itemReport => {
        const itemCard = ui.el('div', { class:'card' });
        displayMaterialTakeoff(itemReport.takeoff, itemCard);
        professionalContainer.appendChild(itemCard);
      });
      
      // Aggregated materials summary
      const aggregatedCard = ui.el('div', { class:'card' }, [
        ui.el('div', { class:'card__header' }, [
          ui.el('div', { class:'card__title', text:'Aggregated Materials Summary' }),
          ui.el('div', { class:'card__subtitle', text:'Total material requirements for project' })
        ]),
        ui.el('div', { class:'card__body' }, [
          ui.el('div', { class:'table-wrap' }, [
            ui.el('table', { class:'table' }, [
              ui.el('thead', [
                ui.el('tr', [
                  ui.el('th', { text:'Material' }),
                  ui.el('th', { text:'Unit' }),
                  ui.el('th', { text:'Total Quantity' }),
                  ui.el('th', { text:'Used In' })
                ])
              ]),
              ui.el('tbody', 
                Array.from(report.totalMaterials.values()).map(material => 
                  ui.el('tr', [
                    ui.el('td', { text:material.name }),
                    ui.el('td', { text:material.unit }),
                    ui.el('td', { text:material.totalQuantity.toFixed(2) }),
                    ui.el('td', { text:`${material.items.length} items` })
                  ])
                )
              )
            ])
          ])
        ])
      ]);
      professionalContainer.appendChild(aggregatedCard);
      
    } else {
      mountEl.style.display = 'block';
      professionalContainer.style.display = 'none';
      btnProfessional.textContent = 'Professional Takeoff';
    }
  });

  return card;
}
