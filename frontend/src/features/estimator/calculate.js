// Temporary/simple calculation model.
// Swap this with a backend call later using actual motion/planning.
export default function calc({ w, h, speed, dpi, power, sheetCost, electric, margin }) {
  const area = (w * h) / 100;                 // fake factor to scale
  const tMin = Math.max(1, Math.round((area * (dpi / 200)) / (speed / 100)));
  const kWh = (power / 100) * 0.04 * (tMin / 60); // pretend ~40W avg draw baseline
  const energy = kWh * electric;
  const usage = Math.min(1, (w * h) / (300 * 300));
  const materialC = usage * sheetCost;
  const base = energy + materialC + 0.25;     // tiny wear/tear buffer
  const price = base * (1 + margin / 100);

  return { tMin, energy, materialC, base, price };
}
