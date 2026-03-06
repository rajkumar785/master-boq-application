import { createRouter } from './router.js';
import { store } from './storage.js';
import { ui } from './ui.js';
import { registerRoutes } from './routes.js';

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
    console.error('Failed to initialize default state:', error);
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
        console.error('Error opening project creation modal:', error);
        alert('Failed to open project creation modal');
      }
    });

    document.getElementById('btnExportBackup').addEventListener('click', () => {
      try {
        const json = store.exportBackup();
        ui.downloadText('smart-smm7-backup.json', json);
        alert('Backup exported successfully');
      } catch (error) {
        console.error('Error exporting backup:', error);
        alert('Failed to export backup');
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
        alert('Backup imported successfully');
      } catch (error) {
        console.error('Error importing backup:', error);
        alert('Failed to import backup');
      }
    });

    store.subscribe(renderActiveProject);
  } catch (error) {
    console.error('Error wiring global events:', error);
  }
}

// Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Ready - Initializing Application...');
  
  try {
    ensureDefaultState();
    wireGlobalEvents();
    renderActiveProject();

    const router = createRouter({
      viewEl: document.getElementById('view'),
      setActiveNav: ui.setActiveNav
    });

    registerRoutes(router);
    router.start();
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Fallback initialization
    ensureDefaultState();
    wireGlobalEvents();
    renderActiveProject();
    
    const router = createRouter({
      viewEl: document.getElementById('view'),
      setActiveNav: ui.setActiveNav
    });

    registerRoutes(router);
    router.start();
  }
});
