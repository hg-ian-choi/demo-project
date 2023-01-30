// pages/index.tsx

import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { loginUserSelector } from '../store/loginUserSlice';

export default function Home() {
  const loginUser = useSelector(loginUserSelector);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h6" gutterBottom>
          {loginUser.username ? `Welcome, ${loginUser.username}!` : 'Hello, World!'}
        </Typography>
      </Box>
    </Container>
  );
}
