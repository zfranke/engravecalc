import { Box, Typography } from '@mui/material';

export default function FieldRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}
