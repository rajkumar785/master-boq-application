import { dashboardView } from './views/dashboard.js';
import { projectsView } from './views/projects.js';
import { libraryView } from './views/library.js';
import { takeoffView } from './views/takeoff.js';
import { boqView } from './views/boq.js';
import { rateView } from './views/rate.js';
import { materialsView } from './views/materials.js';
import { rebarView } from './views/rebar.js';
import { concreteView } from './views/concrete.js';
import { variationsView } from './views/variations.js';
import { progressView } from './views/progress.js';
import { cashflowView } from './views/cashflow.js';
import { reportsView } from './views/reports.js';

export function registerRoutes(router){
  router.add('/dashboard', dashboardView);
  router.add('/projects', projectsView);
  router.add('/library', libraryView);
  router.add('/takeoff', takeoffView);
  router.add('/boq', boqView);
  router.add('/rate', rateView);
  router.add('/materials', materialsView);
  router.add('/rebar', rebarView);
  router.add('/concrete', concreteView);
  router.add('/variations', variationsView);
  router.add('/progress', progressView);
  router.add('/cashflow', cashflowView);
  router.add('/reports', reportsView);
}
