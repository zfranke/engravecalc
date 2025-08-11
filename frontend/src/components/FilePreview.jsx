import { useEffect, useRef, useState } from 'react';
import { Box, Card, CardHeader, CardContent, Typography, Button } from '@mui/material';

export default function FilePreview({ onDimensions, dpi = 300 }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [name, setName] = useState('');
  const imgRef = useRef(null);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    setName(f.name);
  };

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const handler = () => {
      if (!onDimensions) return;
      const pxW = el.naturalWidth || 0;
      const pxH = el.naturalHeight || 0;
      if (dpi && dpi > 0) {
        const mmW = Math.round((pxW / dpi) * 25.4);
        const mmH = Math.round((pxH / dpi) * 25.4);
        onDimensions({ w: mmW, h: mmH });
      } else {
        // fallback if DPI unknown
        onDimensions({ w: pxW, h: pxH });
      }
    };
    el.addEventListener('load', handler);
    return () => el.removeEventListener('load', handler);
  }, [fileUrl, dpi, onDimensions]);

  const isSvg = name.toLowerCase().endsWith('.svg');

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Artwork Preview"
        action={
          <Button component="label" size="small" variant="outlined">
            Import SVG/PNG/JPG
            <input hidden type="file" accept=".svg,.png,.jpg,.jpeg" onChange={onPick} />
          </Button>
        }
        subheader={dpi ? `Using ${dpi} DPI to convert pixels → mm` : undefined}
      />
      <CardContent sx={{
        height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center',
        bgcolor: 'background.default', borderRadius: 2, overflow: 'hidden'
      }}>
        {!fileUrl ? (
          <Typography color="text.secondary">Drop in a file to preview (SVG recommended)</Typography>
        ) : isSvg ? (
          <object data={fileUrl} type="image/svg+xml" style={{ width: '100%', height: '100%' }} />
        ) : (
          <img ref={imgRef} src={fileUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        )}
      </CardContent>
    </Card>
  );
}
