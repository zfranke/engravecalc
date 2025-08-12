export async function parseImage(file) {
  const img = await blobToImage(file);
  const { lineWidths, coverage } = rasterAnalysis(img);

  // No vector data for raster images
  return {
    widthMM: pxToMM(img.width),
    heightMM: pxToMM(img.height),
    vectorLengthMM: 0,
    lineWidths,
    coverage
  };
}

export async function rasterAnalysisFromBlob(blob) {
  const img = await blobToImage(blob);
  return rasterAnalysis(img);
}

function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
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

function pxToMM(px) {
  // Assume 96dpi → 1in = 25.4mm
  return (px / 96) * 25.4;
}