import React from 'react';
import CustomButton from './CustomButton';
import {
  Typography,
  Box,
  Grid,
  ThemeProvider,
} from '@mui/material';
import { styled, width } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';

// Define a custom theme with a white background
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1', // Dark blue
    },
    secondary: {
      main: '#00c853', // Light green
    },
    background: {
      default: '#ffffff', // White background
      paper: '#f5f5f5', // Light gray for cards and sections
    },
    text: {
      primary: '#000000', // Black text for readability
      secondary: '#616161', // Dark gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      color: '#000000',
    },
    h5: {
      fontWeight: 500,
      color: '#000000',
    },
  },
});

// Styled components for layout and effects
const DashboardContainer = styled(Box)(({ theme }) => ({
  height: '100%', // Full viewport height
  width: '100%',  // Full viewport width
  display: 'flex',
  flexDirection: 'column', // Stack children vertically
  backgroundColor: theme.palette.background.default, // White background
  padding: theme.spacing(4),
  boxSizing: 'border-box',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height:'60px',
  backgroundColor: theme.palette.background.paper, // Light gray
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3), // Space below header
}));

const CardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Light gray
  padding: theme.spacing(3),
  borderRadius: '10px', // Rounded corners
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Soft shadow
  backdropFilter: 'blur(10px)', // Blur effect for glassmorphism
  WebkitBackdropFilter: 'blur(10px)', // Safari support
  height: '300px', // Fixed height for cards


  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(190, 151, 151, 0.3)', // Subtle border
}));

const FooterBox = styled(Box)(({ theme }) => ({
  width: '100%',height:'17vh',
  backgroundColor: theme.palette.background.paper, // Light gray
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
  marginTop: theme.spacing(3), // Space above footer
  flexGrow: 1, // Fill remaining space
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function Dashboard() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer>
        {/* Header Section */}
        <HeaderBox>
          <Typography  >Dashboard</Typography>
          <CustomButton onClick={() => console.log('Button clicked!')}>
      Click Me
    </CustomButton>
        </HeaderBox>

        {/* Cards Section */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <CardBox onClick={()=>Navigate('/Bl-mc')}>
              <Typography variant="h5">Card 1</Typography>
            </CardBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardBox onClick={()=>Navigate('/Ec-mc')}>
              <Typography variant="h5">Card 2</Typography>
            </CardBox>
          </Grid>
        </Grid>

        {/* Footer Section */}
        <FooterBox>
          <Typography variant="body1" color="text.secondary">
            More services are coming
          </Typography>
        </FooterBox>
      </DashboardContainer>
    </ThemeProvider>
  );
}