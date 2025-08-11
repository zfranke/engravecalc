import { Box, Card, CardHeader, CardContent, Divider, Typography } from '@mui/material';
import FieldRow from './FieldRow';

export default function StickyOutputCard({ est }) {
  return (
    <Box sx={{ position: { md: 'sticky' }, top: { md: 16 } }}>
      <Card>
        <CardHeader title="Estimator Output" />
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Time: {est.tMin} min</Typography>
          <Divider sx={{ my: 1 }} />
          <FieldRow label="Energy Cost" value={`$${est.energy.toFixed(2)}`} />
          <FieldRow label="Material Cost" value={`$${est.materialC.toFixed(2)}`} />
          <FieldRow label="Base Cost" value={`$${est.base.toFixed(2)}`} />
          <Divider sx={{ my: 1 }} />
          <Typography variant="h5">Price: ${est.price.toFixed(2)}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
