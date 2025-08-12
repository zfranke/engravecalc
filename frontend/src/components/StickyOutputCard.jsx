import { Box, Card, CardHeader, CardContent, Divider, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FieldRow from './FieldRow';
import { money } from '../lib/formatters';

const money3 = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 3, maximumFractionDigits: 3 });
const num3 = new Intl.NumberFormat(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export default function StickyOutputCard({ est, threshold = 0 }) {
  const profit = est.price - est.totalCost;
  const profitable = profit >= threshold;
  const tone = profitable ? 'success' : 'error';

  return (
    <Box sx={{ position: { md: 'sticky' }, top: { md: 16 } }}>
      <Card>
        <CardHeader
          title="Estimator Output"
          action={
            <Tooltip
              title={
                <Box sx={{ p: 0.5 }}>
                  <div><strong>How we decide:</strong></div>
                  <div>Profit = Price − Total Cost</div>
                  <div>MarginAmount = Total Cost × Margin%</div>
                  <div>Green when Profit ≥ {money.format(threshold)}</div>
                </Box>
              }
            >
              <IconButton size="small"><InfoOutlined fontSize="small" /></IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">Estimated Time: {fmtMinutes(est.tMin)}</Typography>
            <Chip label={profitable ? 'Profitable' : 'Under Cost'} color={tone} size="small" sx={{ ml: 2 }} />
          </Box>

          <Divider sx={{ my: 1 }} />
          <FieldRow label="Energy Cost" value={`${money3.format(est.energy)}  •  ${num3.format(est.kWh)} kWh`} />
          <FieldRow label="Energy / Copy" value={money3.format(est.energyPerCopy ?? est.energy)} />
          <FieldRow label="Material Cost" value={money.format(round2(est.materialC))} />
          <FieldRow label="Wear & Tear" value={money.format(round2(est.wearTear || 0))} />

          <Divider sx={{ my: 1.5 }} />
          <FieldRow label="Total Cost" value={money.format(round2(est.totalCost))} />

          {/* Combined profit line with margin shown inline */}
          <Typography
            variant="body1"
            sx={{ mt: 0.5, fontWeight: 600, color: (t)=> profitable ? t.palette.success.main : t.palette.error.main }}
          >
            {profitable ? 'Profit' : 'Loss'} ({round0(est.marginPct)}% margin): {money.format(round2(profit))}
          </Typography>

          <Typography variant="h5" sx={{ mt: 0.5 }}>
            Price: {money.format(round2(est.price))}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function fmtMinutes(min) { return `${(Math.round(min * 10) / 10).toFixed(1)} min`; }
function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
function round0(n) { return Math.round(Number(n) || 0); }
