export function createRouter({ viewEl, setActiveNav }){
  const routes = new Map();

  function normalize(hash){
    if(!hash || hash === '#') return '/dashboard';
    const h = hash.startsWith('#') ? hash.slice(1) : hash;
    return h.startsWith('/') ? h : `/${h}`;
  }

  async function render(){
    const path = normalize(window.location.hash);
    const route = routes.get(path) || routes.get('/dashboard');
    if(!route) return;

    setActiveNav(path);
    viewEl.innerHTML = '';

    const node = await route();
    if(node) viewEl.appendChild(node);
  }

  function add(path, handler){
    routes.set(path, handler);
  }

  function start(){
    window.addEventListener('hashchange', render);
    render();
  }

  return { add, start, render };
}
