import { ui } from '../ui.js';
import { store } from '../storage.js';

function projectRow(p, isActive){
  const setActiveBtn = ui.el('button', { class:'btn btn--secondary', type:'button', text: isActive ? 'Active' : 'Set Active' });
  setActiveBtn.disabled = isActive;
  setActiveBtn.addEventListener('click', () => {
    store.update(s => {
      s.activeProjectId = p.id;
      return s;
    });
  });

  const delBtn = ui.el('button', { class:'btn btn--danger', type:'button', text:'Delete' });
  delBtn.addEventListener('click', () => {
    const ok = confirm(`Delete project "${p.name}"? This will remove stored data linked to it.`);
    if(!ok) return;
    store.update(s => {
      s.projects = (s.projects || []).filter(x => x.id !== p.id);
      if(s.activeProjectId === p.id) s.activeProjectId = s.projects[0]?.id || null;
      return s;
    });
  });

  return ui.el('tr', {}, [
    ui.el('td', {}, [ui.el('div', { text:p.name })]),
    ui.el('td', { text:p.client || '-' }),
    ui.el('td', { text:p.location || '-' }),
    ui.el('td', { text:p.buildingType || '-' }),
    ui.el('td', { text:String(p.floors ?? 0) }),
    ui.el('td', { text:String(p.durationMonths ?? 0) }),
    ui.el('td', {}, [ui.el('div', { class:'row row--end' }, [setActiveBtn, delBtn])])
  ]);
}

export async function projectsView(){
  const card = ui.el('div', { class:'card' });

  card.appendChild(ui.el('div', { class:'card__header' }, [
    ui.el('div', { class:'card__title', text:'Project Management' }),
    ui.el('div', { class:'card__subtitle', text:'Create, select, and manage project metadata.' })
  ]));

  const body = ui.el('div', { class:'card__body' });
  const actions = ui.el('div', { class:'row' }, [
    ui.el('button', { class:'btn', type:'button', text:'New Project', onclick: () => ui.openProjectCreateModal() })
  ]);
  body.appendChild(actions);
  body.appendChild(ui.el('div', { style:'height:12px' }));

  const wrap = ui.el('div', { class:'table-wrap' });
  const table = ui.el('table', { class:'table' });
  table.appendChild(ui.el('thead', {}, [
    ui.el('tr', {}, [
      ui.el('th', { text:'Project Name' }),
      ui.el('th', { text:'Client' }),
      ui.el('th', { text:'Location' }),
      ui.el('th', { text:'Building Type' }),
      ui.el('th', { text:'Floors' }),
      ui.el('th', { text:'Duration (months)' }),
      ui.el('th', { text:'Actions' })
    ])
  ]));

  const tbody = ui.el('tbody');
  table.appendChild(tbody);

  function rebuild(){
    const state = store.getState();
    tbody.innerHTML = '';
    (state.projects || []).forEach(p => tbody.appendChild(projectRow(p, p.id === state.activeProjectId)));
  }

  rebuild();
  store.subscribe(rebuild);
  wrap.appendChild(table);
  body.appendChild(wrap);

  card.appendChild(body);
  return card;
}
