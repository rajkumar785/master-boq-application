let cache = null;

export async function getSmm7Items(){
  if(cache) return cache;
  const res = await fetch('./data/smm7_items.json');
  cache = await res.json();
  return cache;
}
