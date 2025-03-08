import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/system';

// Custom styled button
const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: '8px', // Rounded corners
  padding: theme.spacing(1.5, 4), // Comfortable padding
  fontWeight: 600, // Bold text
  textTransform: 'none', // No uppercase transformation
  boxShadow: theme.shadows[2], // Subtle shadow for depth
  '&:hover': {
    boxShadow: theme.shadows[4], // Stronger shadow on hover
    backgroundColor: theme.palette.secondary.main, // Secondary color on hover
    color: theme.palette.background.default, // Text color changes on hover
  },
}));

export default function CustomButton({ children, ...props }) {
  return (
    <StyledButton variant="contained" color="primary" {...props}>
      {children}
    </StyledButton>
  );
}