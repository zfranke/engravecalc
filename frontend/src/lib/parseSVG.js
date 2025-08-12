import { parse } from 'svgson';
import { SVGPathProperties } from 'svg-path-properties';

/**
 * Parses an SVG file to extract size, vector length, and raster coverage.
 * @param {File} file
 * @returns {Promise<{widthMM, heightMM, vectorLengthMM, lineWidths, coverage}>}
 */
export async function parseSVG(file) {
  const text = await file.text();
  const svgObj = await parse(text);

  let widthMM = 0, heightMM = 0, vectorLengthMM = 0;
  let rasterImages = [];

  const traverse = (node) => {
    if (node.name === 'svg') {
      // Prefer mm units, fallback to px → assume 96dpi
      widthMM = parseLength(node.attributes.width);
      heightMM = parseLength(node.attributes.height);
    }
    if (node.name === 'path') {
      const d = node.attributes.d || '';
      if (d) {
        try {
          const props = new SVGPathProperties(d);
          vectorLengthMM += props.getTotalLength();
        } catch {
            console.warn('Failed to parse path:', d);
        }
      }
    }
    if (node.name === 'image') {
      const href = node.attributes['xlink:href'] || node.attributes.href;
      if (href) rasterImages.push(href);
    }
    (node.children || []).forEach(traverse);
  };
  traverse(svgObj);

  // If raster images exist, generate lineWidths + coverage
  let lineWidths = null, coverage = null;
  if (rasterImages.length > 0) {
    const img = await loadImage(rasterImages[0]);
    ({ lineWidths, coverage } = rasterAnalysis(img));
  }

  return { widthMM, heightMM, vectorLengthMM, lineWidths, coverage };
}

function parseLength(val) {
  if (!val) return 0;
  if (val.endsWith('mm')) return parseFloat(val);
  if (val.endsWith('cm')) return parseFloat(val) * 10;
  if (val.endsWith('in')) return parseFloat(val) * 25.4;
  if (val.endsWith('px')) return parseFloat(val) * 25.4 / 96;
  return parseFloat(val);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rasterAnalysis(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height).data;

  let lineWidths = [];
  let totalBlackPx = 0;
  for (let y = 0; y < img.height; y++) {
    let rowBlack = 0;
    for (let x = 0; x < img.width; x++) {
      const idx = (y * img.width + x) * 4;
      const brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;
      if (brightness < 128) rowBlack++;
    }
    if (rowBlack > 0) {
      lineWidths.push(rowBlack);
      totalBlackPx += rowBlack;
    }
  }
  const coverage = totalBlackPx / (img.width * img.height);
  return { lineWidths, coverage };
}