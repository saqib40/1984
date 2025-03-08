import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';

// Custom theme
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
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      color: '#ffffff',
    },
  },
});

// Custom styles
const SignupContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

const FormBox = styled(Box)(({ theme }) => ({
  width: '30vw',
  maxWidth: '400px',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.text.secondary,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.secondary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.secondary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.secondary.main,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'underline',
  '&:hover': {
    color: theme.palette.secondary.light,
  },
}));

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (email === '') {
      setEmailError(true);
    }
    if (password === '') {
      setPasswordError(true);
    }
    if (email && password) {
      try {
        const response = await fetch('http://localhost:4000/v1/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const responseData = await response.json();
        if (response.ok) {
          alert(responseData.message);
          navigate('/login'); // Redirect to login after successful signup
        } else {
          console.error('Error sending data to the backend:', responseData.message);
          alert(responseData.message || 'Signup failed');
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred');
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <SignupContainer>
        <FormBox>
          <Typography variant="h2" align="center" gutterBottom>
            Sign Up
          </Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <StyledTextField
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              variant="outlined"
              color="secondary"
              required
              fullWidth
              error={emailError}
              helperText={emailError ? 'Email is required' : ''}
              sx={{ mb: 3 }}
            />
            <StyledTextField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              variant="outlined"
              color="secondary"
              type="password"
              required
              fullWidth
              error={passwordError}
              helperText={passwordError ? 'Password is required' : ''}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <StyledLink
              component="button"
              onClick={() => navigate('/login')}
            >
              Already have an account? Login
            </StyledLink>
          </Box>
        </FormBox>
      </SignupContainer>
    </ThemeProvider>
  );
}