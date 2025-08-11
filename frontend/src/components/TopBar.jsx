import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';

export default function TopBar({ onOpenMaterials, onOpenPresets }) {
  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mr: 'auto' }}>EngraveCalc</Typography>
        <Button startIcon={<Inventory2Icon />} variant="outlined" onClick={onOpenMaterials}>Materials</Button>
        <Button startIcon={<TuneIcon />} variant="outlined" onClick={onOpenPresets}>Presets</Button>
        <IconButton><SettingsIcon /></IconButton>
      </Toolbar>
    </AppBar>
  );
}
