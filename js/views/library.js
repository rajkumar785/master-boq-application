import { ui } from '../ui.js';
import { getSmm7Items } from '../workflows/smm7.js';

export async function libraryView(){
  const items = await getSmm7Items();

  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'SMM7 Item Library (Sample)' }),
    ui.el('div', { class:'card__subtitle', text:'Starter library with item code, unit, and measurement formula template.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  body.appendChild(ui.el('div', { class:'badge', text:`Items loaded: ${items.length}` }));
  body.appendChild(ui.el('div', { style:'height:12px' }));

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
  items.slice(0, 200).forEach(it => {
    tbody.appendChild(ui.el('tr', {}, [
      ui.el('td', { text:it.section }),
      ui.el('td', { text:it.code }),
      ui.el('td', { text:it.description }),
      ui.el('td', { text:it.unit }),
      ui.el('td', { text:it.formula })
    ]));
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  body.appendChild(wrap);

  card.appendChild(body);
  return card;
}
