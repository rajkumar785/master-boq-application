import { ui } from '../ui.js';
import { concreteEngine } from '../workflows/concrete.js';

export async function concreteView(){
  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Concrete Mix Calculator' }),
    ui.el('div', { class:'card__subtitle', text:'Compute cement bags, sand, and aggregate using mix ratios and dry volume factor.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  const mountEl = ui.el('div');
  body.appendChild(mountEl);
  card.appendChild(body);

  concreteEngine.mount({ rootEl: mountEl });
  return card;
}
