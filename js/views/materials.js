import { ui } from '../ui.js';
import { materialsEngine } from '../workflows/materials.js';

export async function materialsView(){
  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Material Takeoff' }),
    ui.el('div', { class:'card__subtitle', text:'Convert BOQ quantities into materials with waste factors.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  const mountEl = ui.el('div');
  body.appendChild(mountEl);
  card.appendChild(body);

  materialsEngine.mount({ rootEl: mountEl });
  return card;
}
