import { createRouter } from './router.js';
import { store } from './storage.js';
import { ui } from './ui.js';
import { registerRoutes } from './routes.js';

function ensureDefaultState(){
  const state = store.getState();
  if(!state.projects){
    store.setState({
      projects: [],
      activeProjectId: null,
      drawings: {},
      takeoff: {},
      boq: {},
      rateAnalysis: {},
      materials: {},
      rebar: {},
      concrete: {},
      variations: {},
      progress: {},
      cashflow: {}
    });
  }
}

function renderActiveProject(){
  const state = store.getState();
  const active = state.projects?.find(p => p.id === state.activeProjectId) || null;
  document.getElementById('activeProjectName').textContent = active ? active.name : 'None';
}

function wireGlobalEvents(){
  document.getElementById('btnToggleSidebar').addEventListener('click', () => ui.toggleSidebar());
  document.getElementById('btnNewProject').addEventListener('click', () => ui.openProjectCreateModal());

  document.getElementById('btnExportBackup').addEventListener('click', () => {
    const json = store.exportBackup();
    ui.downloadText('smart-smm7-backup.json', json);
  });

  document.getElementById('importBackupFile').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const text = await file.text();
    store.importBackup(text);
    renderActiveProject();
    window.location.reload();
  });

  store.subscribe(renderActiveProject);
}

ensureDefaultState();
wireGlobalEvents();
renderActiveProject();

const router = createRouter({
  viewEl: document.getElementById('view'),
  setActiveNav: ui.setActiveNav
});

registerRoutes(router);
router.start();
