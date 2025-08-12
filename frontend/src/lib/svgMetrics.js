// SVG analysis with per-row bounding box widths (0..1 of full width).
// Returns: { widthMM, heightMM, coverage, vectorLengthMM, lineWidths }

export async function analyzeSvgString(svgString, dpi = 300) {
  const dom = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svg = dom.documentElement;

  const vb = svg.getAttribute('viewBox')?.split(/\s+/).map(Number) || null;
  const widthAttr = svg.getAttribute('width');
  const heightAttr = svg.getAttribute('height');

  const pxToMm = (px) => (px / dpi) * 25.4;
  const toPx = (val) => {
    const n = parseFloat(val);
    const s = String(val);
    if (s.endsWith('mm')) return (n / 25.4) * dpi;
    if (s.endsWith('cm')) return (n * 10 / 25.4) * dpi;
    if (s.endsWith('in')) return n * dpi;
    return n; // px or unitless
  };

  let pxW, pxH;
  if (vb) {
    const [, , vbw, vbh] = vb;
    pxW = Math.max(1, Math.round(vbw));
    pxH = Math.max(1, Math.round(vbh));
  } else if (widthAttr && heightAttr) {
    pxW = Math.max(1, Math.round(toPx(widthAttr)));
    pxH = Math.max(1, Math.round(toPx(heightAttr)));
  } else {
    const { width, height } = await renderSvgToImage(svgString);
    pxW = width; pxH = height;
  }
  const widthMM  = round2(pxToMm(pxW));
  const heightMM = round2(pxToMm(pxH));

  const { avg, lineWidths } = await perRowBoundingWidths(svgString, pxW, pxH);
  const vectorLengthMM = round2(measureStrokeLengthMM(svg));

  return { widthMM, heightMM, coverage: avg, vectorLengthMM, lineWidths };
}

async function renderSvgToImage(svgString) {
  const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }));
  try { const img = await loadImage(url); return { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height }; }
  finally { URL.revokeObjectURL(url); }
}

function loadImage(src){ return new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; }); }

async function perRowBoundingWidths(svgString, widthPx, heightPx) {
  const MAX = 1400;
  const scale = Math.min(1, MAX / Math.max(widthPx, heightPx));
  const w = Math.max(64, Math.round(widthPx * scale));
  const h = Math.max(64, Math.round(heightPx * scale));

  const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }));
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
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
        lineWidths[y] = engravedWidth / w; // 0..1 of total width
      }
      inkTotal += inkRow;
    }
    const avg = Math.min(Math.max(inkTotal / (w * h), 0), 1);
    return { avg, lineWidths };
  } finally { URL.revokeObjectURL(url); }
}

function measureStrokeLengthMM(svgRoot) {
  const temp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let totalPx = 0;
  svgRoot.querySelectorAll('path, polyline, line, polygon').forEach((node) => {
    try {
      const cs = window.getComputedStyle(node);
      const stroke = cs.stroke;
      const sw = parseFloat(cs['stroke-width'] || '0');
      if (stroke && stroke !== 'none' && sw > 0 && typeof node.getTotalLength === 'function') {
        const copy = node.cloneNode(true);
        temp.appendChild(copy);
        totalPx += copy.getTotalLength();
      }
    } catch {
        console.warn('Failed to measure stroke length for:', node.tagName, node);
    }
  });
  const PX_PER_IN = 96;
  return (totalPx / PX_PER_IN) * 25.4;
}

function round2(n){return Math.round((n+Number.EPSILON)*100)/100;}
