// src/components/SellerDb/SellerDb.jsx
import React, { useState } from 'react';
import { useAuth } from '../../utils/Auth/AuthContext';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import Verified from './features/Verified';  
import ManageDeal from './features/manageDeal';

const SellerDb = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sellerOptions = [
    { name: 'Manage Deal' },
    { name: 'New Deal' },
    { name: 'Verified' },
    { name: 'Help' },
    { name: 'Contact' },
  ];

  const worldChatOptions = [
    { name: 'World Chat - INDIA' }
  ];

  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Manage Deal':
        return (
         <ManageDeal/>
        );
      case 'New Deal':
        return (
          <Paper elevation={5} style={{ padding: '20px', margin: '10px', width: '90%', backgroundColor: '#2ECC40', color: '#ffffff' }}>
            <Typography variant="h6" gutterBottom>New Deal</Typography>
            <Typography variant="body1">Content for new deals...</Typography>
          </Paper>
        );
      case 'Verified':
        return (
          <Verified />  // Render the Verified component
        );
      case 'Help':
        return (
          <Paper elevation={5} style={{ padding: '20px', margin: '10px', width: '90%', backgroundColor: '#FF851B', color: '#ffffff' }}>
            <Typography variant="h6" gutterBottom>Help</Typography>
            <Typography variant="body1">Help content...</Typography>
          </Paper>
        );
      case 'Contact':
        return (
          <Paper elevation={5} style={{ padding: '20px', margin: '10px', width: '90%', backgroundColor: '#FFDC00', color: '#000000' }}>
            <Typography variant="h6" gutterBottom>Contact</Typography>
            <Typography variant="body1">Contact content...</Typography>
          </Paper>
        );
      default:
        return (
          <Box>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Paper elevation={5} style={{ padding: '20px', margin: '10px', width: '45%', backgroundColor: '#0074D9', color: '#ffffff' }}>
                <Typography variant="h6" gutterBottom>All Deals</Typography>
                <Typography variant="body1">Content for managing deals...</Typography>
              </Paper>

              <Paper elevation={5} style={{ padding: '20px', margin: '10px', width: '45%', backgroundColor: '#2ECC40', color: '#ffffff' }}>
                <Typography variant="h6" gutterBottom>Successful Deals</Typography>
                <Typography variant="body1">Content for new deals...</Typography>
              </Paper>
            </Box>

            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Paper elevation={5} style={{ padding: '20px', margin: '10px', width: '45%', backgroundColor: '#FF4136', color: '#ffffff' }}>
                <Typography variant="h6" gutterBottom>Unsuccessful Deals</Typography>
                <Typography variant="body1">Content for verified deals...</Typography>
              </Paper>

              <Paper elevation={5} style={{ padding: '20px', margin: '10px', width: '45%', backgroundColor: '#FF851B', color: '#ffffff' }}>
                <Typography variant="h6" gutterBottom>User Level</Typography>
                <Typography variant="body1">Content for help...</Typography>
              </Paper>
            </Box>

            <Paper elevation={5} style={{ padding: '20px', margin: '10px', width: '45%', backgroundColor: '#FFDC00', color: '#000000' }}>
              <Typography variant="h6" gutterBottom>Transaction History</Typography>
              <Typography variant="body1">Content for contact...</Typography>
            </Paper>
          </Box>
        );
    }
  };

  return (
    <div>
      <Sidebar leftOptions={sellerOptions} rightOptions={worldChatOptions} onItemClick={setSelectedCategory} />

      <nav style={{ 
        width: '100%', 
        backgroundColor: '#001f3f', 
        color: '#ffffff', 
        padding: '10px', 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        position: 'fixed', 
        top: '0', 
        zIndex: '1000', 
        borderBottom: '2px solid #ffffff', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ margin: '0', fontSize: '1.5rem' }}>Seller Dashboard</h1>
        <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginRight: '10px' }}>
          Logout
        </Button>
      </nav>

      <Box style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column', 
        marginTop: '100px', 
        animation: `${fadeIn} 1s ease-in`, 
      }}>
        {renderContent()}
      </Box>
    </div>
  );
};

export default SellerDb;
