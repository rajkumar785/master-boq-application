const KEY = 'smartSmm7.state.v1';

function safeParse(json){
  try{ return JSON.parse(json); }catch{ return null; }
}

function read(){
  return safeParse(localStorage.getItem(KEY) || '');
}

function write(state){
  localStorage.setItem(KEY, JSON.stringify(state));
}

function uid(prefix='id'){
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const listeners = new Set();

export const store = {
  uid,
  getState(){
    return read() || {};
  },
  setState(partial){
    const next = { ...store.getState(), ...partial };
    write(next);
    listeners.forEach(fn => fn(next));
  },
  update(fn){
    const current = store.getState();
    const next = fn({ ...current }) || current;
    write(next);
    listeners.forEach(cb => cb(next));
  },
  subscribe(fn){
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  exportBackup(){
    return JSON.stringify(store.getState(), null, 2);
  },
  importBackup(text){
    const parsed = safeParse(text);
    if(!parsed || typeof parsed !== 'object') throw new Error('Invalid backup file');
    write(parsed);
    listeners.forEach(cb => cb(parsed));
  }
};
