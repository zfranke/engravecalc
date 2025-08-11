import { useMemo, useState } from 'react';
import { Box, Grid } from '@mui/material';
import TopBar from './components/TopBar';
import StickyOutputCard from './components/StickyOutputCard';
import EstimatorPanel from './features/estimator/EstimatorPanel';
import MaterialsDialog from './features/materials/MaterialsDialog';
import PresetsDialog from './features/presets/PresetsDialog';
import calc from './features/estimator/calculate';

export default function App() {
  // shared state (single page)
  const [form, setForm] = useState({
    machine: 'xTool S1 40W',
    module: 'IR 2W',
    material: 'Basswood',
    w: 200,
    h: 150,
    speed: 300,
    dpi: 300,
    power: 80,
    sheetCost: 2.5,
    electric: 0.14,
    margin: 50,
  });

  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);

  const est = useMemo(() => calc(form), [form]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopBar
        onOpenMaterials={() => setMaterialsOpen(true)}
        onOpenPresets={() => setPresetsOpen(true)}
      />

      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} lg={9}>
            <EstimatorPanel value={form} onChange={setForm} />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StickyOutputCard est={est} />
          </Grid>
        </Grid>
      </Box>

      <MaterialsDialog open={materialsOpen} onClose={() => setMaterialsOpen(false)} />
      <PresetsDialog open={presetsOpen} onClose={() => setPresetsOpen(false)} />
    </Box>
  );
}

