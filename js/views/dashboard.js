import { ui } from '../ui.js';
import { store } from '../storage.js';

export async function dashboardView(){
  const state = store.getState();
  const active = state.projects?.find(p => p.id === state.activeProjectId) || null;

  const root = ui.el('div', { class:'grid grid--2' });

  const left = ui.el('div', { class:'card' }, [
    ui.el('div', { class:'card__header' }, [
      ui.el('div', { class:'card__title', text:'Dashboard' }),
      ui.el('div', { class:'card__subtitle', text:'Project overview, workflow shortcuts, and status.' })
    ]),
    ui.el('div', { class:'card__body' }, [
      ui.el('div', { class:'row' }, [
        ui.el('span', { class:'badge', text:`Projects: ${state.projects?.length || 0}` }),
        ui.el('span', { class:'badge', text:`Active: ${active ? active.name : 'None'}` })
      ]),
      ui.el('div', { style:'height:12px' }),
      ui.el('div', { class:'grid', style:'gap:10px' }, [
        ui.el('a', { class:'btn', href:'#/projects', text:'Go to Project Management' }),
        ui.el('a', { class:'btn btn--secondary', href:'#/takeoff', text:'Open Drawing Takeoff' }),
        ui.el('a', { class:'btn btn--secondary', href:'#/boq', text:'Open BOQ Generator' })
      ])
    ])
  ]);

  const right = ui.el('div', { class:'card' }, [
    ui.el('div', { class:'card__header' }, [
      ui.el('div', { class:'card__title', text:'Workflow' }),
      ui.el('div', { class:'card__subtitle', text:'Recommended sequence for professional estimating.' })
    ]),
    ui.el('div', { class:'card__body' }, [
      ui.el('div', { class:'grid', style:'gap:8px' }, [
        ui.el('div', { class:'badge', text:'1) Project Setup' }),
        ui.el('div', { class:'badge', text:'2) Upload Drawing + Set Scale' }),
        ui.el('div', { class:'badge', text:'3) Digital Takeoff (Line/Area/Count)' }),
        ui.el('div', { class:'badge', text:'4) Apply SMM7 Items + Formulas' }),
        ui.el('div', { class:'badge', text:'5) BOQ + Rate Analysis' }),
        ui.el('div', { class:'badge', text:'6) Materials + Rebar + Concrete Mix' }),
        ui.el('div', { class:'badge', text:'7) Variations/Progress/Cashflow' }),
        ui.el('div', { class:'badge', text:'8) Reports Export' })
      ])
    ])
  ]);

  root.appendChild(left);
  root.appendChild(right);
  return root;
}
