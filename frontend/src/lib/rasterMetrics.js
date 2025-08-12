// PNG/JPG analysis with per-row bounding box widths (0..1).

export function analyzeRasterImage(imgEl, dpi = 300) {
  const pxW = Math.max(1, imgEl.naturalWidth || imgEl.width || 0);
  const pxH = Math.max(1, imgEl.naturalHeight || imgEl.height || 0);

  const widthMM  = round2((pxW / dpi) * 25.4);
  const heightMM = round2((pxH / dpi) * 25.4);

  const { avg, lineWidths } = perRowBoundingWidths(imgEl);

  return { widthMM, heightMM, coverage: avg, lineWidths };
}

function perRowBoundingWidths(imgEl) {
  const MAX = 1400;
  const pxW = Math.max(1, imgEl.naturalWidth || imgEl.width || 0);
  const pxH = Math.max(1, imgEl.naturalHeight || imgEl.height || 0);
  const scale = Math.min(1, MAX / Math.max(pxW, pxH));
  const w = Math.max(64, Math.round(pxW * scale));
  const h = Math.max(64, Math.round(pxH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imgEl, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  let inkTotal = 0;
  const lineWidths = new Array(h).fill(0);
  for (let y = 0; y < h; y++) {
    let first = -1, last = -1, inkRow = 0;
    const rowAlphaStart = y * w * 4 + 3;
    for (let x = 0; x < w; x++) {
      const alpha = data[rowAlphaStart + x * 4];
      if (alpha > 10) {
        if (first === -1) first = x;
        last = x;
        inkRow++;
      }
    }
    if (first !== -1) {
      const engravedWidth = last - first + 1;
      lineWidths[y] = engravedWidth / w;
    }
    inkTotal += inkRow;
  }
  const avg = Math.min(Math.max(inkTotal / (w * h), 0), 1);
  return { avg, lineWidths };
}

function round2(n){return Math.round((n+Number.EPSILON)*100)/100;}
