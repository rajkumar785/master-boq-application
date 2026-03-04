import { ui } from '../ui.js';
import { rebarEngine } from '../workflows/rebar.js';

export async function rebarView(){
  const card = ui.el('div', { class:'card' });
  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Reinforcement Bar Schedule' }),
    ui.el('div', { class:'card__subtitle', text:'Generate a basic bar bending schedule and compute steel weight.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  const mountEl = ui.el('div');
  body.appendChild(mountEl);
  card.appendChild(body);

  rebarEngine.mount({ rootEl: mountEl });
  return card;
}
