import { store } from './storage.js';

function qs(sel, root=document){
  return root.querySelector(sel);
}

function qsa(sel, root=document){
  return Array.from(root.querySelectorAll(sel));
}

function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k === 'class') node.className = v;
    else if(k === 'text') node.textContent = v;
    else if(k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  children.forEach(ch => node.appendChild(ch));
  return node;
}

function openModal({ title, bodyNode, footerNode }){
  const modal = document.getElementById('modal');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('modalTitle').textContent = title;
  const body = document.getElementById('modalBody');
  const footer = document.getElementById('modalFooter');
  body.innerHTML = '';
  footer.innerHTML = '';
  body.appendChild(bodyNode);
  if(footerNode) footer.appendChild(footerNode);

  function close(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
  }

  function onClick(e){
    const target = e.target;
    if(target && (target.hasAttribute('data-close-modal') || target.closest('[data-close-modal]'))){
      close();
    }
  }

  function onKey(e){
    if(e.key === 'Escape') close();
  }

  modal.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);

  return { close };
}

function setActiveNav(path){
  qsa('[data-route]').forEach(a => {
    const href = a.getAttribute('href') || '';
    const h = href.startsWith('#') ? href.slice(1) : href;
    const match = h === path;
    a.classList.toggle('is-active', match);
  });
}

function toggleSidebar(force){
  const sidebar = document.getElementById('sidebar');
  const isOpen = sidebar.classList.contains('is-open');
  const next = typeof force === 'boolean' ? force : !isOpen;
  sidebar.classList.toggle('is-open', next);
}

function downloadText(filename, text){
  const blob = new Blob([text], { type:'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function openProjectCreateModal(){
  const formId = store.uid('projectForm');
  const form = el('form', { id: formId, class:'grid', style:'gap:12px' });

  const fields = [
    { key:'name', label:'Project Name', type:'text', required:true },
    { key:'client', label:'Client', type:'text' },
    { key:'location', label:'Location', type:'text' },
    { key:'buildingType', label:'Building Type', type:'text' },
    { key:'floors', label:'Number of Floors', type:'number' },
    { key:'durationMonths', label:'Project Duration (months)', type:'number' }
  ];

  const inputs = {};
  fields.forEach(f => {
    const wrap = el('div', { class:'field' });
    wrap.appendChild(el('label', { text:f.label }));
    const input = el('input', { type:f.type, name:f.key, value:'', ...(f.required ? { required:'true' } : {}) });
    inputs[f.key] = input;
    wrap.appendChild(input);
    form.appendChild(wrap);
  });

  const createBtn = el('button', { class:'btn', type:'button', text:'Create Project' });

  const footer = el('div', { class:'row row--end' }, [
    el('button', { class:'btn btn--secondary', type:'button', 'data-close-modal':'true', text:'Cancel' }),
    createBtn
  ]);

  const modal = openModal({ title:'New Project', bodyNode: form, footerNode: footer });

  function createProject(){
    const project = {
      id: store.uid('project'),
      name: inputs.name.value.trim(),
      client: inputs.client.value.trim(),
      location: inputs.location.value.trim(),
      buildingType: inputs.buildingType.value.trim(),
      floors: Number(inputs.floors.value || 0),
      durationMonths: Number(inputs.durationMonths.value || 0),
      createdAt: new Date().toISOString()
    };

    if(!project.name){
      inputs.name.focus();
      return;
    }

    store.update(s => {
      s.projects = Array.isArray(s.projects) ? s.projects : [];
      s.projects.unshift(project);
      s.activeProjectId = project.id;
      return s;
    });

    const verify = store.getState();
    const ok = Array.isArray(verify.projects) && verify.projects.some(p => p.id === project.id);
    if(!ok) console.error('Project create failed to persist:', project);

    modal.close();
    window.location.hash = '#/projects';
    // If already on #/projects, hashchange won't fire; force a re-render.
    window.dispatchEvent(new Event('hashchange'));
  }

  createBtn.addEventListener('click', createProject);

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    createProject();
  });
}

export const ui = {
  qs,
  qsa,
  el,
  openModal,
  setActiveNav,
  toggleSidebar,
  downloadText,
  openProjectCreateModal
};
