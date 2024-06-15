// BuyerDb.js
import { keyframes } from '@emotion/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/Auth/AuthContext';
import Sidebar from '../SideBar/sidebar'; // Ensure correct import path to Sidebar
import ManageProposals from "./features/ManageProposals";
// Import the necessary features/components
import ChatRooms from '../chat/chat'; // New component to list chat rooms
import C2C from './features/C2C';
import C2I from './features/C2I';
import I2C from './features/I2C';
import Contact from './features/contact';
import Help from './features/help';
import PAYAPP from './features/payApp';

const BuyerDb = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const buyerOptions = [
    { name: 'C2I' },
    { name: 'I2C' },
    { name: 'C2C' },
    { name: 'PAYAPP' },
    { name: 'ManageProposals' },
    { name: 'Chat Rooms' },  // New menu option
    { name: 'Help' },
    { name: 'Contact' },
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
      case 'C2I':
        return <C2I />;
      case 'I2C':
        return <I2C />;
      case 'C2C':
        return <C2C />;
      case 'PAYAPP':
        return <PAYAPP />;
      case 'ManageProposals':
        return <ManageProposals />;
      case 'Chat Rooms':  // New case for chat rooms
        return <ChatRooms userRole="buyer" />;
      case 'Help':
        return <Help />;
      case 'Contact':
        return <Contact />;
      default:
        return (
          <div>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Paper elevation={5} style={{ 
                padding: '20px', 
                margin: '10px', 
                width: '45%', 
                backgroundColor: '#0074D9', 
                color: '#ffffff' 
              }}>
                <Typography variant="h6" gutterBottom>All Deals</Typography>
                <Typography variant="body1">Content for managing deals...</Typography>
              </Paper>

              <Paper elevation={5} style={{ 
                padding: '20px', 
                margin: '10px', 
                width: '45%', 
                backgroundColor: '#2ECC40', 
                color: '#ffffff' 
              }}>
                <Typography variant="h6" gutterBottom>Successful Deals</Typography>
                <Typography variant="body1">Content for successful deals...</Typography>
              </Paper>
            </Box>

            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Paper elevation={5} style={{ 
                padding: '20px', 
                margin: '10px', 
                width: '45%', 
                backgroundColor: '#FF4136', 
                color: '#ffffff' 
              }}>
                <Typography variant="h6" gutterBottom>Unsuccessful Deals</Typography>
                <Typography variant="body1">Content for unsuccessful deals...</Typography>
              </Paper>

              <Paper elevation={5} style={{ 
                padding: '20px', 
                margin: '10px', 
                width: '45%', 
                backgroundColor: '#FF851B', 
                color: '#ffffff' 
              }}>
                <Typography variant="h6" gutterBottom>User Level</Typography>
                <Typography variant="body1">Content for user level...</Typography>
              </Paper>
            </Box>

            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Paper elevation={5} style={{ 
                padding: '20px', 
                margin: '10px', 
                width: '45%', 
                backgroundColor: '#FFDC00', 
                color: '#000000' 
              }}>
                <Typography variant="h6" gutterBottom>Transaction History</Typography>
                <Typography variant="body1">Content for transaction history...</Typography>
              </Paper>
            </Box>
          </div>
        );
    }
  };

  return (
    <div>
      <Sidebar leftOptions={buyerOptions} onItemClick={setSelectedCategory} />

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
         <Typography
  variant="h4"
  component="h2"
  className="font-bold text-center mb-6"
  sx={{
    fontFamily: 'Arial Black, sans-serif',
    fontSize: '1.3rem', // Slightly reduced font size for smaller box
    fontWeight: 'bold',
    color: '#00000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Ensure the text takes the full height of the container
  }}
>
Buyer Dashboard
</Typography>
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

export default BuyerDb;