import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link, // Added Link import
  ThemeProvider,
} from '@mui/material';
import { style, styled, width } from '@mui/system';
import { createTheme } from '@mui/material/styles';

// Custom theme (unchanged)
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

// Custom styles (unchanged)
const LoginContainer = styled(Container)(({ theme }) => ({
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

// Styled Link for "Sign up here"
const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main, // Light green from theme
  textDecoration: 'underline',
  '&:hover': {
    color: theme.palette.secondary.light, // Lighter green on hover
  },
}));

export default function Login() {
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
        const response = await fetch('http://localhost:4000/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const responseData = await response.json();
        console.log('The token is: ', responseData.token);
        if (response.status === 401) {
          alert(responseData.message);
        }
        if (response.ok) {
          localStorage.setItem('myToken', responseData.token);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <LoginContainer>
        <FormBox>
          <Typography variant="h2" align="center" gutterBottom>
            Login
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
              Login
            </Button>
          </form>
          {/* Added "Sign up here" link */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <StyledLink
              component="button"
              onClick={() => navigate('/signup')}
            >
              Don't have an account? Sign up here
            </StyledLink>
          </Box>
        </FormBox>
      </LoginContainer>
    </ThemeProvider>
  );
}