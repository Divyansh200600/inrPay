import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const Career = () => {
  // Initialize formData with useState
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Handle input changes and update formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Add your form submission logic here
  };

  return (
    <Box
      className="relative"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#ffffff', // Set background color to white
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        className="relative z-10 p-8 mx-auto"
        sx={{
          maxWidth: '400px', // Reduced width for a smaller box
          backgroundColor: 'rgba(255, 255, 255, 1)', // Ensure the box background is white and fully opaque
          borderRadius: '16px',
          padding: '2rem', // Reduced padding
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography
  variant="h4"
  component="h2"
  className="font-bold text-center mb-6"
  sx={{
    fontFamily: 'Arial Black, sans-serif',
    fontSize: '2rem', // Slightly reduced font size for smaller box
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Ensure the text takes the full height of the container
  }}
>
  Contact Us
</Typography> <br/>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="name"
                name="name"
                label="Name"
                type="text"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                sx={{ marginBottom: '1rem' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                sx={{ marginBottom: '1rem' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="message"
                name="message"
                label="Message"
                value={formData.message}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  '& .Mui-focused fieldset': {
                    borderColor: '#007BFF'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  padding: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default Career;
