import { Box, Button, Card, CardContent, CardHeader, Grid, MenuItem, Slider, Stack, TextField } from '@mui/material';

const MACHINES = ['xTool S1 40W','xTool D1 Pro 20W','OmTech 60W CO₂'];
const MODULES = ['IR 2W','Blue 40W','CO₂'];
const MATERIALS = ['Basswood','Birch Ply','Slate','Acrylic','Leather'];

export default function EstimatorPanel({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <Card>
      <CardHeader title="Job Parameters" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField select label="Machine" fullWidth value={value.machine} onChange={(e)=>set({machine:e.target.value})}>
              {MACHINES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="Module" fullWidth value={value.module} onChange={(e)=>set({module:e.target.value})}>
              {MODULES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="Material" fullWidth value={value.material} onChange={(e)=>set({material:e.target.value})}>
              {MATERIALS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={6} md={3}><TextField type="number" label="Width (mm)" fullWidth value={value.w} onChange={(e)=>set({w:+e.target.value})} /></Grid>
          <Grid item xs={6} md={3}><TextField type="number" label="Height (mm)" fullWidth value={value.h} onChange={(e)=>set({h:+e.target.value})} /></Grid>
          <Grid item xs={6} md={3}><TextField type="number" label="Speed (mm/s)" fullWidth value={value.speed} onChange={(e)=>set({speed:+e.target.value})} /></Grid>
          <Grid item xs={6} md={3}><TextField type="number" label="DPI" fullWidth value={value.dpi} onChange={(e)=>set({dpi:+e.target.value})} /></Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <small>Power (%)</small><small>{value.power}%</small>
              </Box>
              <Slider value={value.power} onChange={(_,v)=>set({power:v})} min={1} max={100} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <small>Profit Margin (%)</small><small>{value.margin}%</small>
              </Box>
              <Slider value={value.margin} onChange={(_,v)=>set({margin:v})} min={0} max={200} />
            </Stack>
          </Grid>

          <Grid item xs={6} md={3}><TextField type="number" label="Sheet Cost ($)" fullWidth value={value.sheetCost} onChange={(e)=>set({sheetCost:+e.target.value})} /></Grid>
          <Grid item xs={6} md={3}><TextField type="number" label="Electric ($/kWh)" fullWidth value={value.electric} onChange={(e)=>set({electric:+e.target.value})} /></Grid>

          <Grid item xs={12}>
            <Button variant="outlined">Import SVG/XCS</Button>
            {/* hook file picker here later */}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
