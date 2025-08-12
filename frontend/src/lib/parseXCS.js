import JSZip from 'jszip';
import { rasterAnalysisFromBlob } from './parseImage';

/**
 * Parses an xTool Creative Space .xcs file
 * @param {File} file
 * @returns {Promise<{widthMM, heightMM, vectorLengthMM, lineWidths, coverage}>}
 */
export async function parseXCS(file) {
  const zip = await JSZip.loadAsync(file);
  const projectJson = await zip.file('project.json').async('string');
  const project = JSON.parse(projectJson);

  let widthMM = 0, heightMM = 0, vectorLengthMM = 0;
  let rasterImages = [];

  for (const obj of project.objects || []) {
    if (obj.geometry) {
      widthMM = Math.max(widthMM, obj.geometry.width || 0);
      heightMM = Math.max(heightMM, obj.geometry.height || 0);
    }
    if (obj.type === 'vector') {
      if (obj.pathLengthMM) vectorLengthMM += obj.pathLengthMM;
    }
    if (obj.type === 'bitmap' && obj.source?.path) {
      const imgFile = zip.file(obj.source.path);
      if (imgFile) {
        const blob = await imgFile.async('blob');
        rasterImages.push(blob);
      }
    }
  }

  let lineWidths = null, coverage = null;
  if (rasterImages.length > 0) {
    ({ lineWidths, coverage } = await rasterAnalysisFromBlob(rasterImages[0]));
  }

  return { widthMM, heightMM, vectorLengthMM, lineWidths, coverage };
}