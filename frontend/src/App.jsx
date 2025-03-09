import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';

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
    h1: {
      fontWeight: 900,
      color: '#ffffff',
    },
    h4: {
      fontWeight: 500,
      color: '#ffffff',
    },
    h5: {
      fontWeight: 400,
      color: '#b0bec5',
    },
    body1: {
      color: '#b0bec5',
    },
  },
});

// Custom styles
const HeroSection = styled(Box)(({ theme }) => ({
  width: '100%', // Use 100% of parent's width (more responsive than 100vw)
  minHeight: '80vh', // Minimum height adjusts to content
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  boxSizing: 'border-box', // Include padding in width calculations
  color: theme.palette.text.primary,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  minHeight: '250px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const CTASection = styled(Box)(({ theme }) => ({
  width: '100%', // Use full width of parent container
  padding: theme.spacing(6),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.primary,
  textAlign: 'center',
  boxSizing: 'border-box', // Ensure proper sizing with padding
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.secondary.light,
  },
}));

function App() {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      {/* Hero Section */}
      <HeroSection>
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: 900, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          1984
        </Typography>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 300 }}>
          A full-stack AI-powered system that monitors, detects, and responds to digital threats in real time, ensuring robust cybersecurity and proactive incident management.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <StyledButton
            variant="contained"
            color="secondary"
            size="large"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => navigate('/login')}
            style={{ transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s' }}
          >
            Login
          </StyledButton>
          <StyledButton
            variant="contained"
            color="secondary"
            size="large"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => navigate('/signup')}
            style={{ transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s' }}
          >
            Signup
          </StyledButton>
        </Box>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box py={8} px={4}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 500 }}>
            Key Features of 1984
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <FeatureCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      The Cybercrime Investigator Toolkit
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    Provides a seamless interface for law enforcement to securely interact with IoT devices, retrieve critical data, and generate reports for efficient case resolution.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FeatureCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Uncovering Hidden Digital Evidence
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    Extracts and analyzes forensic data from IoT devices, helping investigators recover logs, configurations, and deleted files crucial for cybercrime investigations.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FeatureCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Tamper-Proof Digital Forensics
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    Ensures data integrity through cryptographic hashing, timestamping, and forensic imaging, preserving evidence in its original form for legal proceedings.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Call-to-Action Section */}
      <CTASection>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          Ready to Secure Your Network?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Get started with our open-source cybersecurity tool today.
        </Typography>
        <StyledButton
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => window.open('https://github.com/saqib40/1984', '_blank')}
          style={{ transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s' }}
        >
          View on GitHub
        </StyledButton>
      </CTASection>
    </ThemeProvider>
  );
}

export default App;
