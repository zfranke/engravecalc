// Raster engrave estimator (¢/kWh). Material cost = unitCost * qty.
// Wear & Tear is provided by UI. Returns wearTear so UI shows it.

const MACHINE_PROFILES = {
  'xTool S1 40W':     { maxSpeed: 500, accel: 4000, baseW: 50,  varW: 120 },
  'xTool D1 Pro 20W': { maxSpeed: 400, accel: 3000, baseW: 35,  varW: 90  },
  'OmTech 60W CO₂':   { maxSpeed: 700, accel: 6000, baseW: 180, varW: 300 },
};

function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

export default function calc({
  machine, module, w, h, speed, dpi, power,
  materialUnitCost, materialQty,
  electricCents, margin, wearTear = 0.25,
}) {
  const prof = MACHINE_PROFILES[machine] || { maxSpeed: 400, accel: 3000, baseW: 40, varW: 100 };

  // --- Time model (raster) ---
  const v = clamp(Number(speed) || 0, 10, prof.maxSpeed); // mm/s
  const lines = Math.max(1, (Number(h) || 0) / 25.4 * (Number(dpi) || 0));
  const overscan = (v * v) / (2 * prof.accel);            // mm per side
  const totalDistanceMm = ((Number(w) || 0) + 2 * overscan) * lines;
  const tMin = Math.max(0.5, (totalDistanceMm / v) / 60); // minutes

  // --- Energy ---
  const moduleFactor = module === 'IR 2W' ? 0.5 : module === 'CO₂' ? 1.4 : 1.0;
  const wallWatts = (prof.baseW + prof.varW * ((Number(power) || 0) / 100)) * moduleFactor;
  const supportWatts = 150;     // fans/air assist/chiller
  const jobOverheadMin = 2;     // homing/focus/etc
  const totalMin = tMin + jobOverheadMin;
  const kWh = ((wallWatts + supportWatts) / 1000) * (totalMin / 60);
  const elecDollars = clamp(Number(electricCents) || 0, 2, 100) / 100;
  const energy = kWh * elecDollars;

  // --- Material (per-unit × qty) ---
  const unitCost = Math.max(0, Number(materialUnitCost) || 0);
  const qty = Math.max(1, Number(materialQty) || 1);
  const materialC = unitCost * qty;

  // --- Totals & price ---
  const wt = Math.max(0, Number(wearTear) || 0);
  const totalCost = energy + materialC + wt;
  const price = totalCost * (1 + (Number(margin) || 0) / 100);

  return { tMin, energy, materialC, wearTear: wt, totalCost, price };
}
