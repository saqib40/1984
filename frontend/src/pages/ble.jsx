import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  ThemeProvider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import axios from 'axios';

// Dark theme
const theme = createTheme({
  palette: {
    primary: { main: '#0d47a1' }, // Dark blue
    secondary: { main: '#00c853' }, // Light green
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
    h2: { fontWeight: 700, color: '#ffffff' },
    h5: { fontWeight: 500, color: '#ffffff' },
    body1: { color: '#b0bec5' },
  },
});

// Styled components
const BLEContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  boxSizing: 'border-box',
}));

const DeviceCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: '10px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#2a2a2a',
  },
}));

const ScanButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.light,
  },
}));

const ScanProgress = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '300px',
  marginTop: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: '100%',
  height: 8,
  borderRadius: 4,
  backgroundColor: '#333',
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(0.5, 2),
  fontSize: '0.8rem',
  backgroundColor: '#d32f2f',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#f44336',
  },
}));

export default function BLE() {
  const navigate = useNavigate();
  const [extractions, setExtractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [modeDialogOpen, setModeDialogOpen] = useState(false);

  useEffect(() => {
    fetchBLEData();
  }, [navigate]);

  const fetchBLEData = async () => {
    try {
      const token = localStorage.getItem('myToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:4000/v1/get-ble', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      setExtractions(response.data.extractions);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch BLE data');
      setLoading(false);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleOpenModeDialog = () => {
    setModeDialogOpen(true);
  };

  const handleCloseModeDialog = () => {
    setModeDialogOpen(false);
  };

  const handleScan = async (isolated) => {
    const timeout = isolated ? 60000 : 300000; // 1 min for isolated, 5 min for non-isolated
    const controller = new AbortController();
    setAbortController(controller);
    setScanning(true);
    setModeDialogOpen(false);
    try {
      const token = localStorage.getItem('myToken');
      const response = await axios.post(
        'http://localhost:4000/v1/ble-scan',
        { isolated, timeout },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );
      await fetchBLEData();
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Scan cancelled by user');
      } else {
        setError(err.response?.data?.error || 'Scan failed');
      }
    } finally {
      setScanning(false);
      setAbortController(null);
    }
  };

  const handleCancelScan = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleDeviceClick = (extraction) => {
    setSelectedDevice(extraction);
  };

  const handleCloseModal = () => {
    setSelectedDevice(null);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <BLEContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <StyledLinearProgress />
          </Box>
        </BLEContainer>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <BLEContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center">
            <ScanButton variant="contained" onClick={handleOpenModeDialog} disabled={scanning}>
              New Scan
            </ScanButton>
          </Box>
          {scanning && (
            <ScanProgress>
              <StyledLinearProgress variant="indeterminate" />
              <CancelButton variant="contained" onClick={handleCancelScan}>
                Cancel
              </CancelButton>
            </ScanProgress>
          )}
        </BLEContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <BLEContainer>
        <Typography variant="h2" align="center" gutterBottom>
          BLE Extractions
        </Typography>
        {extractions.length === 0 ? (
          <Typography variant="h5" align="center" color="text.secondary">
            No BLE extractions found for your account.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {extractions.map((extraction) => (
              <Grid item xs={12} sm={6} key={extraction._id}>
                <DeviceCard onClick={() => handleDeviceClick(extraction)}>
                  <CardContent>
                    <Typography variant="body1">
                      <strong>Address:</strong> {extraction.deviceId}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Discovered:</strong>{' '}
                      {new Date(extraction.timestamp).toLocaleString()}
                    </Typography>
                  </CardContent>
                </DeviceCard>
              </Grid>
            ))}
          </Grid>
        )}

        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <ScanButton variant="contained" onClick={handleOpenModeDialog} disabled={scanning}>
            New Scan
          </ScanButton>
          {scanning && (
            <ScanProgress>
              <StyledLinearProgress variant="indeterminate" />
              <CancelButton variant="contained" onClick={handleCancelScan}>
                Cancel
              </CancelButton>
            </ScanProgress>
          )}
        </Box>

        {/* Mode Selection Dialog */}
        <Dialog
          open={modeDialogOpen}
          onClose={handleCloseModeDialog}
          PaperProps={{
            style: { backgroundColor: '#1e1e1e', color: '#ffffff' },
          }}
        >
          <DialogTitle>Select Scan Mode</DialogTitle>
          <DialogContent>
            <DialogContentText color="text.secondary">
              Choose the scan mode for discovering BLE devices:
            </DialogContentText>
            <Box mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleScan(true)}
                fullWidth
                style={{ marginBottom: 8 }}
              >
                Isolated (1 min)
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleScan(false)}
                fullWidth
              >
                Non-Isolated (5 min)
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModeDialog} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Device Details Modal */}
        <Dialog
          open={!!selectedDevice}
          onClose={handleCloseModal}
          PaperProps={{
            style: { backgroundColor: '#1e1e1e', color: '#ffffff' },
          }}
        >
          <DialogTitle>Device Details</DialogTitle>
          {selectedDevice && (
            <DialogContent>
              <Typography variant="body1">
                <strong>Address:</strong> {selectedDevice.deviceId}
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedDevice.metadata.name || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>RSSI:</strong> {selectedDevice.metadata.rssi || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedDevice.status}
              </Typography>
              <Typography variant="body1">
                <strong>Mode:</strong> {selectedDevice.mode}
              </Typography>
              <Typography variant="body1">
                <strong>Timestamp:</strong>{' '}
                {new Date(selectedDevice.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>File Path:</strong> {selectedDevice.filePath}
              </Typography>
              <Typography variant="body1" style={{ wordBreak: 'break-all' }}>
                <strong>Hash:</strong> {selectedDevice.hash}
              </Typography>
              {selectedDevice.error && (
                <Typography variant="body1" color="error">
                  <strong>Error:</strong> {selectedDevice.error}
                </Typography>
              )}
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </BLEContainer>
    </ThemeProvider>
  );
}