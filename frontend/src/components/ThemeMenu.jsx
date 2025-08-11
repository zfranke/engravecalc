import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CheckIcon from '@mui/icons-material/Check';
import { useThemeName } from '../theme/context';

const options = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'forest', label: 'Forest' },
  { key: 'ocean', label: 'Ocean' },
  { key: 'desert', label: 'Desert' },
];

export default function ThemeMenu() {
  const { name, setName } = useThemeName();
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <IconButton onClick={(e)=>setAnchor(e.currentTarget)} aria-label="theme">
        <ColorLensIcon />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={()=>setAnchor(null)}>
        {options.map(o => (
          <MenuItem key={o.key} onClick={()=>{ setName(o.key); setAnchor(null); }}>
            <ListItemIcon>{name === o.key ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
            <ListItemText>{o.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
