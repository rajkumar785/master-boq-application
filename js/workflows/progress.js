import { store } from '../storage.js';

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export const progressEngine = {
  ensure(projectId){
    store.update(s => {
      s.progress = s.progress || {};
      s.progress[projectId] = s.progress[projectId] || { completed: {} };
      return s;
    });
  },

  setCompleted(projectId, lineId, qty){
    store.update(s => {
      s.progress = s.progress || {};
      s.progress[projectId] = s.progress[projectId] || { completed: {} };
      s.progress[projectId].completed[lineId] = toNum(qty);
      return s;
    });
  },

  getSummary(projectId){
    const s = store.getState();
    const lines = s.boq?.[projectId]?.lines || [];
    const completed = s.progress?.[projectId]?.completed || {};

    let plannedTotal = 0;
    let completedTotal = 0;

    const items = lines.filter(l => l.type === 'item');
    for(const it of items){
      const planned = toNum(it.qty);
      const comp = toNum(completed[it.id] || 0);
      plannedTotal += planned;
      completedTotal += Math.min(comp, planned);
    }

    const pct = plannedTotal > 0 ? (completedTotal / plannedTotal) * 100 : 0;
    return { plannedTotal, completedTotal, pct };
  }
};
