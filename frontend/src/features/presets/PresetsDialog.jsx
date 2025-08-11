import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Table, TableHead, TableRow, TableCell, TableBody, MenuItem
} from '@mui/material';

const MATERIALS = ['Basswood','Birch Ply','Slate','Acrylic','Leather'];

export default function PresetsDialog({ open, onClose }) {
  const [rows, setRows] = useState([
    { material: 'Basswood', profile: 'Photo', speed: 300, power: 80, dpi: 300, note: 'IR 2W draft' },
  ]);
  const [form, setForm] = useState({ material:'Basswood', profile:'', speed:'', power:'', dpi:'', note:'' });

  const add = () => {
    if (!form.profile) return;
    setRows(prev => [...prev, {
      material: form.material,
      profile: form.profile,
      speed: +form.speed || 0,
      power: +form.power || 0,
      dpi: +form.dpi || 0,
      note: form.note
    }]);
    setForm({ material:'Basswood', profile:'', speed:'', power:'', dpi:'', note:'' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Presets</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField select label="Material" size="small" value={form.material} onChange={e=>setForm({...form, material:e.target.value})}>
            {MATERIALS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
          <TextField label="Profile" size="small" value={form.profile} onChange={e=>setForm({...form, profile:e.target.value})}/>
          <TextField label="Speed (mm/s)" size="small" value={form.speed} onChange={e=>setForm({...form, speed:e.target.value})}/>
          <TextField label="Power (%)" size="small" value={form.power} onChange={e=>setForm({...form, power:e.target.value})}/>
          <TextField label="DPI" size="small" value={form.dpi} onChange={e=>setForm({...form, dpi:e.target.value})}/>
          <TextField label="Notes" size="small" value={form.note} onChange={e=>setForm({...form, note:e.target.value})}/>
          <Button variant="contained" onClick={add}>Add</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Material</TableCell><TableCell>Profile</TableCell><TableCell>Speed</TableCell>
              <TableCell>Power</TableCell><TableCell>DPI</TableCell><TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r,i)=>(
              <TableRow key={i}>
                <TableCell>{r.material}</TableCell>
                <TableCell>{r.profile}</TableCell>
                <TableCell>{r.speed}</TableCell>
                <TableCell>{r.power}</TableCell>
                <TableCell>{r.dpi}</TableCell>
                <TableCell>{r.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
