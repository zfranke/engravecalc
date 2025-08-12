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
  FormControlLabel,
  Switch,
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
      {/* Row 1 */}
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
      <Grid item xs={6} md={2}>
        <TextField size="small" type="number" label="DPI" fullWidth value={value.dpi}
          onChange={(e)=>set({dpi:+e.target.value || 0})}/>
      </Grid>
      <Grid item xs={6} md={2}>
        {/* Speed on first row */}
        <TextField
          size="small"
          type="number"
          label="Speed"
          fullWidth
          InputProps={{ endAdornment: <InputAdornment position="end">mm/s</InputAdornment> }}
          value={value.speed}
          onChange={(e)=>set({speed:+e.target.value || 0})}
        />
      </Grid>

      {/* Row 2 */}
      <Grid item xs={12} md={4}>
        {/* Width & Height grouped */}
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            type="number"
            label="Width"
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">mm</InputAdornment> }}
            value={value.w}
            onChange={(e)=>set({w:+e.target.value || 0})}
          />
          <TextField
            size="small"
            type="number"
            label="Height"
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">mm</InputAdornment> }}
            value={value.h}
            onChange={(e)=>set({h:+e.target.value || 0})}
          />
        </Stack>
      </Grid>

      <Grid item xs={12} md={2}>
        {/* Copies narrower / its own cell */}
        <TextField
          size="small"
          type="number"
          label="Copies (in one run)"
          fullWidth
          value={value.copies}
          onChange={(e)=>set({copies: Math.max(1, +e.target.value || 1)})}
          helperText="Time & energy scale with copies"
        />
      </Grid>
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
            {/* MAX 300% */}
            <SliderField label="Profit Margin (%)" value={value.margin} onChange={(v)=>set({margin:v})} max={300} />
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
              <Tooltip title="Set your utility tier (e.g., APS off-peak 12.9–15.4 ¢/kWh)">
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

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              type="number"
              label="Wear & Tear"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              value={value.wearTear}
              onChange={(e)=>set({wearTear: Math.max(0, +e.target.value || 0)})}
              helperText="Consumables allowance"
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

function SliderField({ label, value, onChange, min=0, max=100, step=1 }) {
  return (
    <Box sx={{ border:'1px solid', borderColor:'divider', borderRadius:1, px:1.5, pt:1, pb:0.5, minHeight:56, display:'flex', flexDirection:'column', justifyContent:'center' }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.5 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="caption" color="text.secondary">{Math.round(value)}%</Typography>
      </Box>
      <Slider size="small" value={value} min={min} max={max} step={step} onChange={(_,v)=>onChange(Array.isArray(v)?v[0]:v)} />
    </Box>
  );
}
