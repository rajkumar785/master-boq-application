import { ui } from '../ui.js';
import { getSmm7Items } from '../workflows/smm7.js';

export async function libraryView(){
  const card = ui.el('div', { class:'card' });

  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'SMM7 Item Library' }),
    ui.el('div', { class:'card__subtitle', text:'Complete SMM7 construction items with codes, units, and measurement formulas.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  
  // Add loading state
  const loadingDiv = ui.el('div', { class:'badge', text:'Loading SMM7 items...' });
  body.appendChild(loadingDiv);
  
  try {
    const items = await getSmm7Items();
    
    // Remove loading state
    loadingDiv.remove();
    
    // Add item count
    body.appendChild(ui.el('div', { class:'badge', text:`Items loaded: ${items.length}` }));
    body.appendChild(ui.el('div', { style:'height:12px' }));

    // Add search/filter controls
    const controls = ui.el('div', { class:'row row--between', style:'margin-bottom: 16px;' });
    const searchInput = ui.el('input', { 
      type:'text', 
      placeholder:'Search items...', 
      style:'flex: 1; padding: 8px; border: 1px solid var(--border); border-radius: 4px;'
    });
    const clearBtn = ui.el('button', { class:'btn btn--secondary', text:'Clear' });
    
    controls.appendChild(searchInput);
    controls.appendChild(clearBtn);
    body.appendChild(controls);

    const wrap = ui.el('div', { class:'table-wrap' });
    const table = ui.el('table', { class:'table' });
    table.appendChild(ui.el('thead', {}, [
      ui.el('tr', {}, [
        ui.el('th', { text:'Section' }),
        ui.el('th', { text:'Item Code' }),
        ui.el('th', { text:'Description' }),
        ui.el('th', { text:'Unit' }),
        ui.el('th', { text:'Formula' })
      ])
    ]));

    const tbody = ui.el('tbody');
    
    // Filter function
    function filterItems(searchTerm) {
      tbody.innerHTML = '';
      const filtered = items.filter(it => 
        !searchTerm || 
        it.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      filtered.slice(0, 200).forEach(it => {
        tbody.appendChild(ui.el('tr', {}, [
          ui.el('td', { text:it.section }),
          ui.el('td', { text:it.code }),
          ui.el('td', { text:it.description }),
          ui.el('td', { text:it.unit }),
          ui.el('td', { text:it.formula })
        ]));
      });
      
      // Update count
      const countBadge = body.querySelector('.badge');
      if (countBadge) {
        countBadge.textContent = `Showing ${filtered.length} of ${items.length} items`;
      }
    }

    // Initial load
    filterItems('');

    // Search functionality
    searchInput.addEventListener('input', (e) => {
      filterItems(e.target.value);
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterItems('');
    });

    wrap.appendChild(table);
    body.appendChild(wrap);

  } catch (error) {
    console.error('Error loading SMM7 library:', error);
    loadingDiv.remove();
    
    // Show error state
    const errorDiv = ui.el('div', { 
      class:'validation-errors',
      text: `Failed to load SMM7 library: ${error.message}`
    });
    body.appendChild(errorDiv);
    
    // Add retry button
    const retryBtn = ui.el('button', { 
      class:'btn',
      text:'Retry Loading Library',
      onclick: () => window.location.reload()
    });
    body.appendChild(retryBtn);
  }

  card.appendChild(body);
  return card;
}
