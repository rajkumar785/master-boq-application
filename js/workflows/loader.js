let scriptPromises = new Map();

function loadScriptOnce(src){
  if(scriptPromises.has(src)) return scriptPromises.get(src);

  const p = new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find(s => s.src === src);
    if(existing){
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      if(existing.dataset.loaded === 'true') resolve();
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => {
      s.dataset.loaded = 'true';
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });

  scriptPromises.set(src, p);
  return p;
}

export async function ensurePdfJs(){
  if(window.pdfjsLib && typeof window.pdfjsLib.getDocument === 'function') return window.pdfjsLib;

  await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
  if(!window.pdfjsLib) throw new Error('PDF.js failed to load');

  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  return window.pdfjsLib;
}

export async function ensureJsPdf(){
  if(window.jspdf?.jsPDF) return window.jspdf;
  await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  return window.jspdf;
}

export async function ensureJsPdfAutoTable(){
  if(window.jspdf && window.jspdfAutoTable) return { jspdf: window.jspdf, autoTable: window.jspdfAutoTable };
  await ensureJsPdf();
  await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js');
  return { jspdf: window.jspdf, autoTable: window.jspdfAutoTable };
}

export async function ensureXlsx(){
  if(window.XLSX) return window.XLSX;
  await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.19.3/xlsx.full.min.js');
  return window.XLSX;
}
