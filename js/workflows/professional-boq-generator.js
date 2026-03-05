/**
 * Professional BOQ Generator
 * Creates SMM7-compliant Bill of Quantities with professional formatting
 */

export class ProfessionalBOQGenerator {
  constructor() {
    this.sections = [
      'Preliminaries',
      'Substructure',
      'Superstructure',
      'Finishes',
      'External Works',
      'Services'
    ];
    
    this.smm7Codes = {
      'Preliminaries': 'A',
      'Substructure': 'E',
      'Superstructure': 'F',
      'Finishes': 'G',
      'External Works': 'L',
      'Services': 'M'
    };
  }

  generateBOQ(boqItems, projectInfo) {
    const boq = {
      projectInfo: projectInfo,
      sections: [],
      grandTotal: 0,
      totalItems: 0,
      generatedDate: new Date().toISOString()
    };
    
    // Group items by section
    const groupedItems = this.groupItemsBySection(boqItems);
    
    // Generate each section
    this.sections.forEach(sectionName => {
      const items = groupedItems[sectionName] || [];
      if (items.length > 0) {
        const section = this.generateSection(sectionName, items);
        boq.sections.push(section);
        boq.grandTotal += section.total;
        boq.totalItems += items.length;
      }
    });
    
    return boq;
  }
  
  generateSection(sectionName, items) {
    const sectionCode = this.smm7Codes[sectionName];
    const section = {
      name: sectionName,
      code: sectionCode,
      items: [],
      total: 0,
      itemCount: items.length
    };
    
    items.forEach((item, index) => {
      const boqItem = this.generateBOQItem(item, sectionCode, index + 1);
      section.items.push(boqItem);
      section.total += boqItem.amount;
    });
    
    return section;
  }
  
  generateBOQItem(item, sectionCode, itemNumber) {
    const itemCode = `${sectionCode}${itemNumber.toString().padStart(3, '0')}`;
    const amount = (item.qty || 0) * (item.rate || 0);
    
    return {
      itemNo: itemCode,
      description: item.description || '',
      unit: item.unit || '',
      quantity: item.qty || 0,
      rate: item.rate || 0,
      amount: amount,
      notes: item.notes || '',
      reference: item.reference || ''
    };
  }
  
  groupItemsBySection(items) {
    const grouped = {};
    
    // Initialize sections
    this.sections.forEach(section => {
      grouped[section] = [];
    });
    
    // Group items based on description keywords
    items.forEach(item => {
      const section = this.determineSection(item.description || '');
      if (section) {
        grouped[section].push(item);
      } else {
        // Default to Superstructure if unclear
        grouped['Superstructure'].push(item);
      }
    });
    
    return grouped;
  }
  
  determineSection(description) {
    const desc = description.toLowerCase();
    
    if (desc.includes('preliminary') || desc.includes('general') || desc.includes('site setup')) {
      return 'Preliminaries';
    }
    if (desc.includes('excav') || desc.includes('foundation') || desc.includes('ground') || desc.includes('substructure')) {
      return 'Substructure';
    }
    if (desc.includes('brick') || desc.includes('concrete') || desc.includes('beam') || desc.includes('column') || desc.includes('slab')) {
      return 'Superstructure';
    }
    if (desc.includes('plaster') || desc.includes('paint') || desc.includes('floor') || desc.includes('tile') || desc.includes('finish')) {
      return 'Finishes';
    }
    if (desc.includes('external') || desc.includes('landscap') || desc.includes('drain') || desc.includes('road')) {
      return 'External Works';
    }
    if (desc.includes('electrical') || desc.includes('plumbing') || desc.includes('hvac') || desc.includes('fire')) {
      return 'Services';
    }
    
    return 'Superstructure'; // Default
  }
  
  exportToHTML(boq) {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill of Quantities - ${boq.projectInfo.name || 'Project'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .project-info { margin-bottom: 20px; }
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          .section-header { background: #f5f5f5; padding: 10px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f9f9f9; }
          .amount { text-align: right; }
          .total { font-weight: bold; background: #f0f0f0; }
          .grand-total { font-size: 16px; background: #e0e0e0; }
          @media print {
            .no-print { display: none; }
            body { margin: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Bill of Quantities</h1>
          <h2>${boq.projectInfo.name || 'Construction Project'}</h2>
          <p>SMM7 Method of Measurement</p>
        </div>
        
        <div class="project-info">
          <table>
            <tr><td><strong>Client:</strong></td><td>${boq.projectInfo.client || 'N/A'}</td></tr>
            <tr><td><strong>Location:</strong></td><td>${boq.projectInfo.location || 'N/A'}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
          </table>
        </div>
    `;
    
    boq.sections.forEach(section => {
      html += this.generateSectionHTML(section);
    });
    
    html += `
        <div class="grand-total">
          <table>
            <tr>
              <td colspan="5" style="text-align: right;"><strong>GRAND TOTAL:</strong></td>
              <td class="amount">${boq.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </table>
        </div>
        
        <div class="no-print" style="margin-top: 30px;">
          <button onclick="window.print()">Print BOQ</button>
        </div>
      </body>
      </html>
    `;
    
    return html;
  }
  
  generateSectionHTML(section) {
    let html = `
      <div class="section">
        <div class="section-header">
          ${section.code} - ${section.name}
        </div>
        <table>
          <thead>
            <tr>
              <th>Item No.</th>
              <th>Description</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    section.items.forEach(item => {
      html += `
        <tr>
          <td>${item.itemNo}</td>
          <td>${item.description}</td>
          <td>${item.unit}</td>
          <td>${item.quantity.toLocaleString()}</td>
          <td class="amount">${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="amount">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
          <tfoot>
            <tr class="total">
              <td colspan="5">Section Total</td>
              <td class="amount">${section.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
    
    return html;
  }
  
  exportToCSV(boq) {
    let csv = 'Item No.,Description,Unit,Quantity,Rate,Amount,Section\n';
    
    boq.sections.forEach(section => {
      section.items.forEach(item => {
        csv += `"${item.itemNo}","${item.description}","${item.unit}",${item.quantity},${item.rate},${item.amount},"${section.name}"\n`;
      });
      
      // Add section total
      csv += `,"SECTION TOTAL","","","",${section.total},"${section.name}"\n`;
    });
    
    // Add grand total
    csv += `,"GRAND TOTAL","","","",${boq.grandTotal},"All Sections"\n`;
    
    return csv;
  }
  
  exportToJSON(boq) {
    return JSON.stringify(boq, null, 2);
  }
  
  generateSummary(boq) {
    return {
      project: boq.projectInfo.name || 'Untitled Project',
      totalSections: boq.sections.length,
      totalItems: boq.totalItems,
      grandTotal: boq.grandTotal,
      sections: boq.sections.map(section => ({
        name: section.name,
        code: section.code,
        itemCount: section.itemCount,
        total: section.total,
        percentage: ((section.total / boq.grandTotal) * 100).toFixed(1)
      })),
      generatedDate: boq.generatedDate
    };
  }
}

export function displayProfessionalBOQ(boq, container) {
  container.innerHTML = '';
  
  // Header
  const header = document.createElement('div');
  header.className = 'card__header';
  header.innerHTML = `
    <div class="card__title">📋 Professional Bill of Quantities</div>
    <div class="card__subtitle">SMM7 compliant with section grouping and totals</div>
  `;
  container.appendChild(header);
  
  // Body
  const body = document.createElement('div');
  body.className = 'card__body';
  
  // Project info
  const projectInfo = document.createElement('div');
  projectInfo.className = 'project-info';
  projectInfo.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
    padding: 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
  `;
  
  projectInfo.innerHTML = `
    <div><strong>🏢 Project:</strong> ${boq.projectInfo.name || 'N/A'}</div>
    <div><strong>👤 Client:</strong> ${boq.projectInfo.client || 'N/A'}</div>
    <div><strong>📍 Location:</strong> ${boq.projectInfo.location || 'N/A'}</div>
  `;
  body.appendChild(projectInfo);
  
  // Export buttons
  const exportDiv = document.createElement('div');
  exportDiv.className = 'export-buttons';
  exportDiv.style.cssText = `
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  `;
  
  exportDiv.innerHTML = `
    <button class="btn" onclick="window.exportBOQ('html')">📄 Export HTML</button>
    <button class="btn btn--secondary" onclick="window.exportBOQ('csv')">📊 Export CSV</button>
    <button class="btn btn--secondary" onclick="window.exportBOQ('json')">📋 Export JSON</button>
    <button class="btn btn--secondary" onclick="window.print()">🖨️ Print</button>
  `;
  body.appendChild(exportDiv);
  
  // BOQ sections
  boq.sections.forEach(section => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'boq-section';
    sectionDiv.style.cssText = `
      margin-bottom: 24px;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    `;
    
    // Section header
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'section-header';
    sectionHeader.style.cssText = `
      background: var(--primary);
      color: white;
      padding: 12px 16px;
      font-weight: 600;
      font-size: 16px;
    `;
    sectionHeader.innerHTML = `
      📁 ${section.code} - ${section.name}
    `;
    sectionDiv.appendChild(sectionHeader);
    
    // Section table
    const tableDiv = document.createElement('div');
    tableDiv.style.cssText = 'padding: 16px;';
    
    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>🔢 Item No.</th>
          <th>📝 Description</th>
          <th>📏 Unit</th>
          <th>📊 Quantity</th>
          <th>💰 Rate</th>
          <th>💵 Amount</th>
        </tr>
      </thead>
      <tbody>
        ${section.items.map(item => `
          <tr>
            <td>${item.itemNo || ''}</td>
            <td>${item.description || ''}</td>
            <td>${item.unit || ''}</td>
            <td>${(item.quantity || 0).toFixed(2)}</td>
            <td>${(item.rate || 0).toFixed(2)}</td>
            <td><strong>${(item.amount || 0).toFixed(2)}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    tableDiv.appendChild(table);
    sectionDiv.appendChild(tableDiv);
    
    // Section subtotal
    const subtotalDiv = document.createElement('div');
    subtotalDiv.className = 'section-subtotal';
    subtotalDiv.style.cssText = `
      background: var(--panel);
      padding: 12px 16px;
      border-top: 1px solid var(--border);
      font-weight: 600;
      text-align: right;
      font-size: 16px;
    `;
    subtotalDiv.innerHTML = `
      📊 Section Subtotal: ${section.total.toFixed(2)}
    `;
    sectionDiv.appendChild(subtotalDiv);
    
    body.appendChild(sectionDiv);
  });
  
  // Grand total
  const grandTotalDiv = document.createElement('div');
  grandTotalDiv.className = 'grand-total';
  grandTotalDiv.style.cssText = `
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    margin-top: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  `;
  grandTotalDiv.innerHTML = `
    🏆 Grand Total: ${boq.grandTotal.toFixed(2)}
  `;
  body.appendChild(grandTotalDiv);
  
  exportDiv.innerHTML = `
    <button class="btn" onclick="exportBOQ('html')">Export HTML</button>
    <button class="btn btn--secondary" onclick="exportBOQ('csv')">Export CSV</button>
    <button class="btn btn--secondary" onclick="exportBOQ('json')">Export JSON</button>
    <button class="btn btn--secondary" onclick="window.print()">Print</button>
  `;
  body.appendChild(exportDiv);
  
  container.appendChild(body);
}

// Global function for export buttons
window.exportBOQ = function(format) {
  // This would be implemented in the main application
  console.log('Export BOQ as:', format);
};
