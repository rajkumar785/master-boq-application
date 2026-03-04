export function dist(a, b){
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy);
}

export function polyArea(points){
  if(points.length < 3) return 0;
  let area = 0;
  for(let i=0;i<points.length;i++){
    const j = (i+1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

export function measurementToQuantity(measurement, scale){
  if(!measurement) return { qty: 0, unit: null, ok: false };

  if(measurement.type === 'count'){
    return { qty: 1, unit: 'nr', ok: true };
  }

  if(!scale?.pxPerUnit){
    return { qty: 0, unit: null, ok: false };
  }

  if(measurement.type === 'line'){
    const px = dist(measurement.a, measurement.b);
    return { qty: px / scale.pxPerUnit, unit: scale.unit, ok: true };
  }

  if(measurement.type === 'area'){
    const pxA = polyArea(measurement.points);
    return { qty: pxA / (scale.pxPerUnit * scale.pxPerUnit), unit: `${scale.unit}²`, ok: true };
  }

  return { qty: 0, unit: null, ok: false };
}
