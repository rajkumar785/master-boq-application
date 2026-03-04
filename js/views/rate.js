import { ui } from '../ui.js';
import { rateEngine } from '../workflows/rate.js';

export async function rateView(){
  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Rate Analysis' }),
    ui.el('div', { class:'card__subtitle', text:'Break down unit rates into materials, labour, equipment, overhead, and profit.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  const mountEl = ui.el('div');
  body.appendChild(mountEl);
  card.appendChild(body);

  rateEngine.mount({ rootEl: mountEl });
  return card;
}
