// src/components/DatabaseCard.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const DatabaseCard = () => {
  return (
    <Card sx={{ height: '100%',  width: '100px'}}>
      <CardContent>
        <Typography variant="h5">Database</Typography>
        <Typography variant="body2" color="text.secondary">
          Database content goes here.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DatabaseCard;