import { useMemo, useState } from 'react';
import { Box, Grid } from '@mui/material';
import TopBar from './components/TopBar';
import StickyOutputCard from './components/StickyOutputCard';
import EstimatorPanel from './features/estimator/EstimatorPanel';
import MaterialsDialog from './features/materials/MaterialsDialog';
import PresetsDialog from './features/presets/PresetsDialog';
import FilePreview from './components/FilePreview';
import calc from './features/estimator/calculate';
import { storage } from './lib/storage';


export default function App() {
  const [form, setForm] = useState({
    // Machine
    machine: 'xTool S1 40W',
    module: 'Blue 40W',
    w: 200,
    h: 150,
    speed: 300,
    dpi: 300,

    // Material
    material: 'Basswood',
    materialUnitType: 'Sheet',
    materialUnitCost: 2.5,
    materialQty: 1,
    copies: 1,

    // Power/Profit
    power: 80,
    electricCents: 13.5,
    margin: 50,
    wearTear: 0.25,

    // Analysis
    coverage: 1,
    lineWidths: null,
  });

  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [minProfit, setMinProfit] = useState(() => storage.get('minProfit', 0));

  const est = useMemo(() => calc(form), [form]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopBar
        onOpenMaterials={() => setMaterialsOpen(true)}
        onOpenPresets={() => setPresetsOpen(true)}
      />

      <Box sx={{ p: 2 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <EstimatorPanel
            value={form}
            onChange={setForm}
            minProfit={minProfit}
            onMinProfitChange={(v) => {
              const val = Math.max(0, Number.isFinite(v) ? v : 0);
              setMinProfit(val);
              storage.set('minProfit', val);
            }}
          />

          <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="center" alignItems="flex-start">
            <Grid item xs={12} md={7}>
              <FilePreview
                dpi={form.dpi}
                onDimensions={({ w, h }) => setForm((f) => ({ ...f, w, h }))}
                onCoverage={(c) => setForm((f) => ({ ...f, coverage: c }))}
                onLineWidths={(arr) => setForm((f) => ({ ...f, lineWidths: arr }))}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <StickyOutputCard est={est} threshold={minProfit} />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <MaterialsDialog open={materialsOpen} onClose={() => setMaterialsOpen(false)} />
      <PresetsDialog open={presetsOpen} onClose={() => setPresetsOpen(false)} />
    </Box>
  );
}
