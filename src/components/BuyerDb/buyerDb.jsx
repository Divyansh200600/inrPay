import React from 'react';
import { useAuth } from '../../utils/Auth/AuthContext';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar'; // Import the Sidebar component
import Paper from '@mui/material/Paper'; 
import Typography from '@mui/material/Typography'; 
import Box from '@mui/material/Box'; 
import { keyframes } from '@emotion/react'; 

const BuyerDb = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

 
   
    const handleLogout = () => {
      logout();
      navigate('/');
    };

  const buyerOptions = [
    { name: 'C2I', path: '/c2i' },
    { name: 'I2C', path: '/i2c' },
    { name: 'C2C', path: '/c2c' },
    { name: 'PAYAPP', path: '/PayApp' },
    { name: 'Help', path: '/help' },
    { name: 'Contact', path: '/contact' },
  ];

  const worldChatOptions = [
    { name: 'World Chat Room-INDIA' }
  ];

  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  return (
    <div>
      {/* Add Sidebar component directly */}
      <Sidebar leftOptions={buyerOptions} />
      <Sidebar rightOptions={worldChatOptions} />

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
        <h1 style={{ margin: '0', fontSize: '1.5rem' }}>Buyer Dashboard</h1>
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
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={5} style={{ 
            padding: '20px', 
            margin: '10px', 
            width: '45%', 
            backgroundColor: '#0074D9', 
            color: '#ffffff',
          }}>
            <Typography variant="h6" gutterBottom>All Deals</Typography>
            <Typography variant="body1">Animated content for all deals...</Typography>
          </Paper>

          <Paper elevation={5} style={{ 
            padding: '20px', 
            margin: '10px', 
            width: '45%', 
            backgroundColor: '#2ECC40', 
            color: '#ffffff',
          }}>
            <Typography variant="h6" gutterBottom>Successful Deals</Typography>
            <Typography variant="body1">Animated content for successful deals...</Typography>
          </Paper>
        </Box>

        <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Paper elevation={5} style={{ 
            padding: '20px', 
            margin: '10px', 
            width: '45%', 
            backgroundColor: '#FF4136', 
            color: '#ffffff',
          }}>
            <Typography variant="h6" gutterBottom>Unsuccessful Deals</Typography>
            <Typography variant="body1">Animated content for unsuccessful deals...</Typography>
          </Paper>

          <Paper elevation={5} style={{ 
            padding: '20px', 
            margin: '10px', 
            width: '45%', 
            backgroundColor: '#FF851B', 
            color: '#ffffff',
          }}>
            <Typography variant="h6" gutterBottom>User Level</Typography>
            <Typography variant="body1">Animated content for user level...</Typography>
          </Paper>
        </Box>

        <Paper elevation={5} style={{ 
          padding: '20px', 
          margin: '10px', 
          width: '45%', 
          backgroundColor: '#FFDC00', 
          color: '#000000',
        }}>
          <Typography variant="h6" gutterBottom>Transaction History</Typography>
          <Typography variant="body1">Animated content for transaction history...</Typography>
        </Paper>
      </Box>
    </div>
  );
};

export default BuyerDb;
