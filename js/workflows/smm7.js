let cache = null;

export async function getSmm7Items(){
  try {
    if(cache) return cache;
    
    console.log('Loading SMM7 items from:', './data/smm7_items.json');
    
    const res = await fetch('./data/smm7_items.json');
    
    if (!res.ok) {
      throw new Error(`Failed to load SMM7 items: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('SMM7 items loaded:', data.length, 'items');
    
    if (!Array.isArray(data)) {
      throw new Error('SMM7 data is not in expected format');
    }
    
    cache = data;
    return cache;
  } catch (error) {
    console.error('Error loading SMM7 items:', error);
    // Return fallback data if fetch fails
    return [
      {"section":"Preliminaries","code":"A1","description":"General items, attendance, temporary works","unit":"item","formula":"Item"},
      {"section":"Groundworks","code":"B1","description":"Site clearance","unit":"m²","formula":"Area = Length × Width"},
      {"section":"Concrete","code":"C1","description":"Plain in-situ concrete","unit":"m³","formula":"Volume = Length × Width × Thickness"},
      {"section":"Reinforcement","code":"D1","description":"High yield reinforcement bars","unit":"kg","formula":"Weight = (Dia² ÷ 162) × Length (m) × Qty"},
      {"section":"Formwork","code":"E1","description":"Formwork to sides of foundations","unit":"m²","formula":"Area = Perimeter × Height"},
      {"section":"Masonry","code":"F1","description":"Brickwork in walls","unit":"m³","formula":"Volume = Length × Height × Thickness"}
    ];
  }
}
