const KEY = 'smartSmm7.state.v1';

function safeParse(json){
  try{ return JSON.parse(json); }catch{ 
    console.error('JSON parse error:', json);
    return null; 
  }
}

function read(){
  const data = localStorage.getItem(KEY);
  console.log('Reading from localStorage:', data ? 'data found' : 'no data');
  return safeParse(data) || {};
}

function write(state){
  console.log('Writing to localStorage:', state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    console.log('Write successful');
  } catch (error) {
    console.error('Write error:', error);
  }
}

function uid(prefix='id'){
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const listeners = new Set();

export const store = {
  uid,
  getState(){
    const state = read();
    console.log('Current state:', state);
    return state;
  },
  setState(partial){
    const current = read();
    const next = { ...current, ...partial };
    console.log('Setting state:', { from: current, to: next });
    write(next);
    listeners.forEach(fn => fn(next));
  },
  update(fn){
    const current = read();
    console.log('Updating state with function, current:', current);
    const next = fn({ ...current }) || current;
    console.log('Update result:', next);
    write(next);
    listeners.forEach(cb => cb(next));
  },
  subscribe(fn){
    listeners.add(fn);
    console.log('Added subscriber, total listeners:', listeners.size);
    return () => {
      listeners.delete(fn);
      console.log('Removed subscriber, total listeners:', listeners.size);
    };
  },
  exportBackup(){
    const state = read();
    const json = JSON.stringify(state, null, 2);
    console.log('Exporting backup, size:', json.length);
    return json;
  },
  importBackup(text){
    console.log('Importing backup, size:', text.length);
    const parsed = safeParse(text);
    if(!parsed || typeof parsed !== 'object') {
      console.error('Invalid backup file:', parsed);
      throw new Error('Invalid backup file');
    }
    write(parsed);
    listeners.forEach(cb => cb(parsed));
    console.log('Backup imported successfully');
  }
};
