import { useState } from 'react';
import { Box, Card, CardHeader, CardContent, Typography, Button, Stack, Chip } from '@mui/material';
import { analyzeSvgString } from '../lib/svgMetrics';
import { analyzeRasterImage } from '../lib/rasterMetrics';

export default function FilePreview({ onDimensions, dpi = 300, onCoverage, onLineWidths, onVectorLength }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [name, setName] = useState('');
  const [meta, setMeta] = useState(null);
  const [pendingRaster, setPendingRaster] = useState(false); // NEW: gate raster analysis

  // PNG/JPG: analyze when the <img> actually loads
  const handleImageLoad = (e) => {
    if (!pendingRaster) return;
    const imgEl = e.currentTarget;
    const info = analyzeRasterImage(imgEl, dpi);

    // update chips
    setMeta({
      widthMM: info.widthMM,
      heightMM: info.heightMM,
      coverage: info.coverage,
      vectorLengthMM: 0,
    });

    // update form
    onDimensions?.({ w: info.widthMM, h: info.heightMM });
    onCoverage?.(info.coverage);
    onLineWidths?.(info.lineWidths);
    onVectorLength?.(0);

    setPendingRaster(false);
  };

  const onPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    setName(f.name);

    // SVG handled immediately from text
    if (f.type === 'image/svg+xml' || /\.svg$/i.test(f.name)) {
      const text = await f.text();
      const info = await analyzeSvgString(text, dpi);
      setMeta(info);
      onDimensions?.({ w: info.widthMM, h: info.heightMM });
      onCoverage?.(info.coverage);
      onLineWidths?.(info.lineWidths);
      onVectorLength?.(info.vectorLengthMM || 0);
      setPendingRaster(false);
      return;
    }

    // PNG/JPG path: wait for <img onLoad> to fire
    setPendingRaster(true);
  };

  return (
    <Card>
      <CardHeader
        title="Artwork Preview"
        action={
          <Button component="label" size="small" variant="outlined">
            IMPORT SVG/PNG/JPG
            <input hidden type="file" accept=".svg,.png,.jpg,.jpeg" onChange={onPick} />
          </Button>
        }
        subheader={dpi ? `Using ${dpi} DPI to convert pixels → mm` : undefined}
      />
      <CardContent sx={{ minHeight: 420, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {meta && (
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
            <Chip size="small" label={`W×H: ${meta.widthMM} × ${meta.heightMM} mm`} />
            <Chip size="small" label={`Coverage: ${(meta.coverage * 100).toFixed(1)}%`} />
            {meta.vectorLengthMM > 0 && <Chip size="small" label={`Stroke Len: ${meta.vectorLengthMM} mm`} />}
          </Stack>
        )}

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 2, overflow: 'hidden' }}>
          {!fileUrl ? (
            <Typography color="text.secondary">Drop in a file to preview (SVG recommended)</Typography>
          ) : /\.svg$/i.test(name) ? (
            <object data={fileUrl} type="image/svg+xml" style={{ width: '100%', height: '100%' }} />
          ) : (
            <img
              src={fileUrl}
              alt="preview"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onLoad={handleImageLoad}     // ← analyze PNG/JPG here
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
