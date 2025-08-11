// Money with 2 decimals
export const money = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

// Minutes with 1 decimal (e.g., 5.6 min)
export function fmtMinutes(min) {
  if (!isFinite(min)) return '0.0 min';
  return `${(Math.round(min * 10) / 10).toFixed(1)} min`;
}
