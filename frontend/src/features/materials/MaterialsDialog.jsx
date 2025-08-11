import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';

export default function MaterialsDialog({ open, onClose }) {
  const [rows, setRows] = useState([
    { name: 'Basswood', thickness: 3, cost: 2.5 },
    { name: 'Birch Ply', thickness: 3, cost: 3.2 },
  ]);
  const [form, setForm] = useState({ name: '', thickness: '', cost: '' });

  const add = () => {
    if (!form.name) return;
    setRows(prev => [...prev, { name: form.name, thickness: +form.thickness || 0, cost: +form.cost || 0 }]);
    setForm({ name: '', thickness: '', cost: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Materials</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField label="Name" size="small" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
          <TextField label="Thickness (mm)" size="small" value={form.thickness} onChange={(e)=>setForm({...form, thickness:e.target.value})}/>
          <TextField label="Cost per sheet ($)" size="small" value={form.cost} onChange={(e)=>setForm({...form, cost:e.target.value})}/>
          <Button variant="contained" onClick={add}>Add</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell><TableCell>Thickness (mm)</TableCell><TableCell>Cost ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r,i)=>(
              <TableRow key={i}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.thickness}</TableCell>
                <TableCell>{r.cost}</TableCell>
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
