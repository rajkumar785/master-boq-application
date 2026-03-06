import { createRouter } from './router.js';
import { store } from './storage.js';
import { ui } from './ui.js';
import { registerRoutes } from './routes.js';
import { ErrorHandler } from './utils/error-handler.js';

function ensureDefaultState(){
  try {
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
  } catch (error) {
    ErrorHandler.handleStorageError(error, 'initialize default state', {});
  }
}

function renderActiveProject(){
  const state = store.getState();
  const active = state.projects?.find(p => p.id === state.activeProjectId) || null;
  document.getElementById('activeProjectName').textContent = active ? active.name : 'None';
}

function wireGlobalEvents(){
  try {
    document.getElementById('btnToggleSidebar').addEventListener('click', () => ui.toggleSidebar());
    document.getElementById('btnNewProject').addEventListener('click', () => {
      try {
        ui.openProjectCreateModal();
      } catch (error) {
        ErrorHandler.handleFormError(error, null, 'open project creation modal');
      }
    });

    document.getElementById('btnExportBackup').addEventListener('click', () => {
      try {
        const json = store.exportBackup();
        ui.downloadText('smart-smm7-backup.json', json);
        ErrorHandler.showUserMessage('Backup exported successfully', 'success');
      } catch (error) {
        ErrorHandler.handleFormError(error, null, 'export backup');
      }
    });

    document.getElementById('importBackupFile').addEventListener('change', async (e) => {
      try {
        const file = e.target.files?.[0];
        if(!file) return;
        const text = await file.text();
        store.importBackup(text);
        renderActiveProject();
        window.location.reload();
        ErrorHandler.showUserMessage('Backup imported successfully', 'success');
      } catch (error) {
        ErrorHandler.handleFormError(error, null, 'import backup');
      }
    });

    store.subscribe(renderActiveProject);
  } catch (error) {
    ErrorHandler.log(error, 'wire global events');
  }
}

ensureDefaultState();
ErrorHandler.init();
wireGlobalEvents();
renderActiveProject();

const router = createRouter({
  viewEl: document.getElementById('view'),
  setActiveNav: ui.setActiveNav
});

registerRoutes(router);
router.start();
