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

    try{
      const node = await route();
      if(node) viewEl.appendChild(node);
    }catch(err){
      console.error('Route render failed:', path, err);
      const card = document.createElement('div');
      card.className = 'card';

      const header = document.createElement('div');
      header.className = 'card__header';
      const title = document.createElement('div');
      title.className = 'card__title';
      title.textContent = 'View Error';
      const sub = document.createElement('div');
      sub.className = 'card__subtitle';
      sub.textContent = `Failed to render route: ${path}`;
      header.appendChild(title);
      header.appendChild(sub);

      const body = document.createElement('div');
      body.className = 'card__body';
      const pre = document.createElement('pre');
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.margin = '0';
      pre.style.color = 'rgba(255,255,255,.85)';
      pre.textContent = String(err?.stack || err?.message || err);
      body.appendChild(pre);

      card.appendChild(header);
      card.appendChild(body);
      viewEl.appendChild(card);
    }
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
