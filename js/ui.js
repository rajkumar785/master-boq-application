import { store } from './storage.js';
import { Validation } from './utils/validation.js';
import { ErrorHandler } from './utils/error-handler.js';
import { APP_CONSTANTS } from './utils/constants.js';

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
  console.log('Opening modal with title:', title);
  
  const modal = document.getElementById('modal');
  if (!modal) {
    console.error('Modal element not found!');
    return { close: () => {} };
  }
  
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('modalTitle').textContent = title;
  const body = document.getElementById('modalBody');
  const footer = document.getElementById('modalFooter');
  
  if (!body || !footer) {
    console.error('Modal body or footer not found!');
    return { close: () => {} };
  }
  
  body.innerHTML = '';
  footer.innerHTML = '';
  body.appendChild(bodyNode);
  if(footerNode) footer.appendChild(footerNode);

  function close(){
    console.log('Closing modal');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
  }

  function onClick(e){
    const target = e.target;
    if(target && (target.hasAttribute('data-close-modal') || target.closest('[data-close-modal]'))){
      console.log('Modal close clicked');
      close();
    }
  }

  function onKey(e){
    if(e.key === 'Escape') {
      console.log('Escape key pressed');
      close();
    }
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
  console.log('Opening project create modal...');
  
  const formId = store.uid('projectForm');
  const form = el('form', { id: formId, class:'grid', style:'gap:12px' });
  
  // Create validation container
  const validationContainer = el('div', { class:'validation-container' });

  const fields = [
    { 
      key:'name', 
      label:'Project Name', 
      type:'text', 
      required:true,
      validation: {
        ...APP_CONSTANTS.VALIDATION.PROJECT_NAME,
        label: 'Project Name'
      }
    },
    { 
      key:'client', 
      label:'Client', 
      type:'text',
      validation: {
        ...APP_CONSTANTS.VALIDATION.CLIENT_NAME,
        label: 'Client Name'
      }
    },
    { 
      key:'location', 
      label:'Location', 
      type:'text',
      validation: {
        ...APP_CONSTANTS.VALIDATION.LOCATION,
        label: 'Location'
      }
    },
    { 
      key:'buildingType', 
      label:'Building Type', 
      type:'text',
      validation: {
        ...APP_CONSTANTS.VALIDATION.BUILDING_TYPE,
        label: 'Building Type'
      }
    },
    { 
      key:'floors', 
      label:'Number of Floors', 
      type:'number',
      validation: {
        ...APP_CONSTANTS.VALIDATION.FLOORS,
        label: 'Number of Floors'
      }
    },
    { 
      key:'durationMonths', 
      label:'Project Duration (months)', 
      type:'number',
      validation: {
        ...APP_CONSTANTS.VALIDATION.DURATION_MONTHS,
        label: 'Project Duration'
      }
    }
  ];

  const inputs = {};
  fields.forEach(f => {
    const wrap = el('div', { class:'field' });
    wrap.appendChild(el('label', { text:f.label }));
    const input = el('input', { 
      type:f.type, 
      name:f.key, 
      value:'',
      ...(f.required ? { required:'true' } : {}),
      placeholder: f.validation ? `Enter ${f.label.toLowerCase()}` : ''
    });
    inputs[f.key] = input;
    wrap.appendChild(input);
    form.appendChild(wrap);
  });

  const createBtn = el('button', { class:'btn', type:'submit', text:'Create Project' });

  const footer = el('div', { class:'row row--end' }, [
    el('button', { class:'btn btn--secondary', type:'button', 'data-close-modal':'true', text:'Cancel' }),
    createBtn
  ]);

  const modal = openModal({ 
    title:'New Project', 
    bodyNode: form, 
    footerNode: footer 
  });

  function createProject(e){
    if(e) e.preventDefault();
    
    try {
      // Clear previous validation errors
      Validation.clearErrors(validationContainer);
      
      // Validate all fields
      const validationResult = Validation.form(form, fields.reduce((rules, field) => {
        rules[field.key] = field.validation;
        return rules;
      }, {}));

      if (!validationResult.isValid) {
        Validation.showErrors(validationResult, validationContainer);
        return;
      }

      // Sanitize inputs
      const project = {
        id: store.uid('project'),
        name: Validation.sanitize(inputs.name.value.trim()),
        client: Validation.sanitize(inputs.client.value.trim()),
        location: Validation.sanitize(inputs.location.value.trim()),
        buildingType: Validation.sanitize(inputs.buildingType.value.trim()),
        floors: Number(inputs.floors.value || 0),
        durationMonths: Number(inputs.durationMonths.value || 0),
        createdAt: new Date().toISOString()
      };

      console.log('Project data:', project);

      // Additional validation
      const nameValidation = Validation.projectName(project.name);
      if (!nameValidation.isValid) {
        Validation.showErrors({ isValid: false, errors: { name: nameValidation.message } }, validationContainer);
        return;
      }

      console.log('Saving project to store...');
      store.update(s => {
        s.projects = Array.isArray(s.projects) ? s.projects : [];
        s.projects.unshift(project);
        s.activeProjectId = project.id;
        console.log('Updated state:', s);
        return s;
      });

      const verify = store.getState();
      const ok = Array.isArray(verify.projects) && verify.projects.some(p => p.id === project.id);
      console.log('Verification check:', ok, 'Projects:', verify.projects);
      
      if(!ok) {
        throw new Error('Project failed to save to storage');
      }

      console.log('Project created successfully!');
      ErrorHandler.showUserMessage(APP_CONSTANTS.SUCCESS_MESSAGES.PROJECT_CREATED, 'success');
      
      modal.close();
      window.location.hash = '#/projects';
      // If already on #/projects, hashchange won't fire; force a re-render.
      window.dispatchEvent(new Event('hashchange'));
      
    } catch (error) {
      console.error('Project creation error:', error);
      ErrorHandler.handleFormError(error, form, 'create project');
    }
  }

  createBtn.addEventListener('click', (e) => {
    e.preventDefault();
    createProject(e);
  });

  form.addEventListener('submit', createProject);
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
