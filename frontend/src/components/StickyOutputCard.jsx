import { Box, Card, CardHeader, CardContent, Divider, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FieldRow from './FieldRow';
import { money, fmtMinutes } from '../lib/formatters';

export default function StickyOutputCard({ est, threshold = 0 }) {
  const profit = est.price - est.totalCost;
  const profitable = profit >= threshold;
  const tone = profitable ? 'success' : 'error';

  return (
    <Box sx={{ position: { md: 'sticky' }, top: { md: 16 } }}>
      <Card
        sx={{
          background: (t) =>
            profitable
              ? `linear-gradient(180deg, ${t.palette.success.main}11, transparent 80%)`
              : `linear-gradient(180deg, ${t.palette.error.main}11, transparent 80%)`,
        }}
      >
        <CardHeader
          title="Estimator Output"
          action={
            <>
              <Chip label={profitable ? 'Profitable' : 'Under Cost'} color={tone} size="small" sx={{ mr: 1 }} />
              <Tooltip
                title={
                  <Box sx={{ p: 0.5 }}>
                    <div><strong>How we decide:</strong></div>
                    <div>Profit = Price − Total Cost</div>
                    <div>Price = Total Cost × (1 + Margin%)</div>
                    <div>Total Cost = Energy + Material + Wear/Tear</div>
                    <div>Green when Profit ≥ {money.format(threshold)}</div>
                  </Box>
                }
              >
                <IconButton size="small"><InfoOutlined fontSize="small" /></IconButton>
              </Tooltip>
            </>
          }
        />
        <CardContent>
          {/* Top section */}
          <Typography variant="h6" sx={{ mb: 1 }}>Time: {fmtMinutes(est.tMin)}</Typography>
          <Divider sx={{ my: 1 }} />
          <FieldRow label="Energy Cost"  value={money.format(round2(est.energy))} />
          <FieldRow label="Material Cost" value={money.format(round2(est.materialC))} />
          <FieldRow label="Wear & Tear"   value={money.format(round2(est.wearTear || 0))} />

          {/* Totals */}
          <Divider sx={{ my: 1.5 }} />
          <FieldRow label="Total Cost" value={money.format(round2(est.totalCost))} />
          <Typography variant="h5" sx={{ mt: 0.5 }}>
            Price: {money.format(round2(est.price))}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5, color: (t)=> profitable ? t.palette.success.main : t.palette.error.main }}>
            Profit: {money.format(round2(profit))}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
