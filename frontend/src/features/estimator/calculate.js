// LightBurn-style raster time with per-row bounding widths.
// Adds "copies" so time & energy scale with items engraved in one run.
// Material qty can optionally follow copies (linkQtyToCopies).

const MACHINE_PROFILES = {
  'xTool S1 40W':     { maxSpeed: 500, accel: 4000, baseW: 50,  varW: 120 },
  'xTool D1 Pro 20W': { maxSpeed: 400, accel: 3000, baseW: 35,  varW: 90  },
  'OmTech 60W CO₂':   { maxSpeed: 700, accel: 6000, baseW: 180, varW: 300 },
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function calc({
  machine, module, w, h, speed, dpi, power,
  materialUnitCost, materialQty, copies = 1,
  electricCents, margin, wearTear = 0.25,
  coverage = 1, lineWidths = null, vectorLengthMM = 0,
}) {
  const prof = MACHINE_PROFILES[machine] || { maxSpeed: 400, accel: 3000, baseW: 40, varW: 100 };
  const v = clamp(Number(speed) || 0, 10, prof.maxSpeed); // mm/s

  const heightMM = Number(h) || 0;
  const widthMM  = Number(w) || 0;
  const linesExact = (heightMM / 25.4) * (Number(dpi) || 0);
  const overscan = (v * v) / (2 * prof.accel); // mm each end

  // Per-copy raster time
  let rasterTimeSec = 0;
  if (Array.isArray(lineWidths) && lineWidths.length > 0) {
    const L = lineWidths.length;
    const lines = Math.ceil(linesExact);
    for (let i = 0; i < lines; i++) {
      const srcIdx = Math.floor((i / Math.max(1, lines - 1)) * Math.max(0, L - 1));
      const frac = clamp(lineWidths[srcIdx] || 0, 0, 1);
      if (frac <= 0) continue;
      const rowWidthMM = widthMM * frac;
      rasterTimeSec += (rowWidthMM + 2 * overscan) / v;
    }
  } else {
    const frac = clamp(Number(coverage) || 0, 0, 1);
    if (frac > 0) {
      const lines = Math.ceil(linesExact);
      const rowWidthMM = widthMM * frac;
      rasterTimeSec = lines * ((rowWidthMM + 2 * overscan) / v);
    }
  }

  // Vector time per copy (optional)
  const vectorDistance = Math.max(0, Number(vectorLengthMM) || 0);
  const accelPenalty = 1.10;
  const vectorTimeSec = (vectorDistance / v) * accelPenalty;

  // Copies scale engrave time; overhead once; small per-copy gaps
  const copiesInt = Math.max(1, Math.floor(Number(copies) || 1));
  const passGapSec = 1.5 * copiesInt;
  const perCopySec = rasterTimeSec + vectorTimeSec;
  const totalEngraveSec = perCopySec * copiesInt + passGapSec;

  const jobOverheadMin = 2;
  const tMin = Math.max(0.1, totalEngraveSec / 60) + jobOverheadMin;

  // Energy (whole job)
  const moduleFactor = module === 'IR 2W' ? 0.5 : module === 'CO₂' ? 1.4 : 1.0;
  const wallWatts = (prof.baseW + prof.varW * ((Number(power) || 0) / 100)) * moduleFactor;
  const supportWatts = 150;
  const kWh = ((wallWatts + supportWatts) / 1000) * (tMin / 60);
  const elecDollars = clamp(Number(electricCents) || 0, 2, 100) / 100;
  const energy = kWh * elecDollars;
  const energyPerCopy = energy / copiesInt;

  // Material cost — optionally mirror copies
  const unitCost = Math.max(0, Number(materialUnitCost) || 0);
  const materialC = unitCost * Math.max(1, Number(materialQty) || 1);

  // Totals & price
  const wt = Math.max(0, Number(wearTear) || 0);
  const totalCost = energy + materialC + wt;

  const marginPct = Math.max(0, Number(margin) || 0);
  const marginAmount = totalCost * (marginPct / 100);
  const price = totalCost + marginAmount;

  return {
    tMin, kWh, energy, energyPerCopy,
    materialC, wearTear: wt, totalCost, marginPct, marginAmount, price
  };
}
