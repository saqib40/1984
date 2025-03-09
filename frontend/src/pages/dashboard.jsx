import React, { useState, useEffect } from 'react';
import CustomButton from './CustomButton'; // Import the updated component
import {
  Typography,
  Box,
  Grid,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Custom dark theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1', // Dark blue
    },
    secondary: {
      main: '#00c853', // Light green
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Dark card background
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b0bec5', // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h5: {
      fontWeight: 500,
      color: '#ffffff',
    },
  },
});

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh', // Full viewport height
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default, // Dark background
  padding: theme.spacing(4),
  boxSizing: 'border-box',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const CardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Dark card
  padding: theme.spacing(3),
  borderRadius: '10px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)', // Stronger shadow
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle white border
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)', // Slight scale on hover
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  textAlign: 'center',
  marginTop: 'auto', // Push footer to bottom
}));

export default function Dashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('myToken');
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor={theme.palette.background.default}
      >
        <Typography variant="h6" color="error">
          You aren't authorized to access this route. Please login.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer>
        {/* Header Section */}
        <HeaderSection>
          <Typography variant="h2">Dashboard</Typography>
          <CustomButton>Log Out</CustomButton>
        </HeaderSection>

        {/* Cards Section (only BLE and ESP32 use CardBox) */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <CardBox onClick={() => navigate('/bl-mc')}>
              <Typography variant="h5">BLE Service</Typography>
            </CardBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardBox onClick={() => navigate('/ec-mc')}>
              <Typography variant="h5">ESP32 Service</Typography>
            </CardBox>
          </Grid>
        </Grid>

        {/* Footer Section */}
        <FooterSection>
          <Typography variant="body1" color="text.secondary">
            More services are coming
          </Typography>
        </FooterSection>
      </DashboardContainer>
    </ThemeProvider>
  );
}