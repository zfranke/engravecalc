import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  Slider,
  Stack,
  TextField,
  InputAdornment,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

const MACHINES = ['xTool S1 40W', 'xTool D1 Pro 20W', 'OmTech 60W CO₂'];
const MODULES  = ['IR 2W', 'Blue 40W', 'CO₂'];
const MATERIALS = ['Basswood', 'Birch Ply', 'Slate', 'Acrylic', 'Leather'];
const UNIT_TYPES = ['Sheet', 'Coaster', 'Piece', 'Custom'];

export default function EstimatorPanel({
  value,
  onChange,
  minProfit = 0,
  onMinProfitChange,
}) {
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <Card>
      <CardHeader title="Job Parameters" />
      <CardContent>
        {/* MACHINE DETAILS */}
        <SectionTitle>Machine Details</SectionTitle>
        <Grid container rowSpacing={2} columnSpacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} md={3}>
            <TextField size="small" select label="Machine" fullWidth value={value.machine}
              onChange={(e)=>set({machine:e.target.value})}>
              {MACHINES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField size="small" select label="Module" fullWidth value={value.module}
              onChange={(e)=>set({module:e.target.value})}>
              {MODULES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" type="number" label="DPI" fullWidth value={value.dpi}
              onChange={(e)=>set({dpi:+e.target.value})}/>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" type="number" label="Width" fullWidth
              InputProps={{ endAdornment: <InputAdornment position="end">mm</InputAdornment> }}
              value={value.w} onChange={(e)=>set({w:+e.target.value})}/>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" type="number" label="Height" fullWidth
              InputProps={{ endAdornment: <InputAdornment position="end">mm</InputAdornment> }}
              value={value.h} onChange={(e)=>set({h:+e.target.value})}/>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField size="small" type="number" label="Speed" fullWidth
              InputProps={{ endAdornment: <InputAdornment position="end">mm/s</InputAdornment> }}
              value={value.speed} onChange={(e)=>set({speed:+e.target.value})}/>
          </Grid>
          <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: { xs:'flex-start', md:'flex-end' }, alignItems: 'center' }}>
            <Button variant="outlined">Import SVG/XCS</Button>
          </Grid>
          <Grid item xs={12} md={3} />
        </Grid>

        <Divider sx={{ my: 1.5 }} />

        {/* MATERIAL DETAILS */}
        <SectionTitle>Material Details</SectionTitle>
        <Grid container rowSpacing={2} columnSpacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} md={3}>
            <TextField size="small" select label="Material Type" fullWidth value={value.material}
              onChange={(e)=>set({material:e.target.value})}>
              {MATERIALS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" select label="Unit" fullWidth value={value.materialUnitType}
              onChange={(e)=>set({materialUnitType:e.target.value})}>
              {UNIT_TYPES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" type="number" label="Unit Cost" fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              value={value.materialUnitCost} onChange={(e)=>set({materialUnitCost:+e.target.value})}/>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" type="number" label="Quantity" fullWidth
              value={value.materialQty} onChange={(e)=>set({materialQty:Math.max(1,+e.target.value||1)})}/>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1.5 }} />

        {/* POWER / PROFIT DETAILS */}
        <SectionTitle>Power / Profit Details</SectionTitle>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <SliderField label="Power (%)" value={value.power} onChange={(v)=>set({power:v})} />
          </Grid>
          <Grid item xs={12} md={3}>
            <SliderField label="Profit Margin (%)" value={value.margin} onChange={(v)=>set({margin:v})} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              type="number"
              label="Electric"
              fullWidth
              InputProps={{ endAdornment: <InputAdornment position="end">¢/kWh</InputAdornment> }}
              value={value.electricCents}
              onChange={(e)=>set({electricCents:+e.target.value})}
            />
            <Box sx={{ display:'flex', alignItems:'center', mt: 0.5 }}>
              <Tooltip title="Set your utility tier (e.g., Off-peak 12.9–15.4 ¢/kWh, On-Peak)">
                <IconButton size="small" sx={{ ml: -1, color:'text.secondary' }}>
                  <InfoOutlined fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                Check your provider for rates
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              type="number"
              label="Min Profit"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              value={Number(minProfit).toFixed(2)}
              onChange={(e)=>onMinProfitChange?.(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </Grid>

          {/* NEW: Wear & Tear */}
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              type="number"
              label="Wear & Tear"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              value={value.wearTear}
              onChange={(e)=>set({wearTear: Math.max(0, +e.target.value || 0)})}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ children }) {
  return <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>{children}</Typography>;
}

/** Matches a small TextField footprint so rows align */
function SliderField({ label, value, onChange, min=0, max=100, step=1 }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        px: 1.5,
        pt: 1,
        pb: 0.5,
        minHeight: 56,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display:'flex', justifyContent:'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="caption" color="text.secondary">{Math.round(value)}%</Typography>
      </Box>
      <Slider
        size="small"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(_,v)=>onChange(Array.isArray(v)?v[0]:v)}
      />
    </Box>
  );
}
