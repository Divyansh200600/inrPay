import React, { useState } from 'react';
import { useAuth } from '../../utils/Auth/AuthContext';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar/sidebar'; // Ensure correct import path to Sidebar
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chat from '../Chat'; // Ensure correct import path to Chat component
import { keyframes } from '@emotion/react';

// Import the necessary features/components
import C2I from './features/C2I';
import I2C from './features/I2C';
import C2C from './features/C2C';
import PAYAPP from './features/payApp';
import Help from './features/help';
import Contact from './features/contact';

const BuyerDb = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null); // State to hold selected proposal
console.log(setSelectedProposal)
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const buyerOptions = [
    { name: 'C2I' },
    { name: 'I2C' },
    { name: 'C2C' },
    { name: 'PAYAPP' },
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

  const renderChat = () => {
    if (selectedProposal) {
      const roomId = `Chat Room - ${selectedProposal.id}`; // Assuming selectedProposal has an id
      return <Chat currentUser={currentUser} roomId={roomId} />;
    }
    return null;
  };

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
                <Typography variant="body1">Content for successful deals...</Typography>
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
                <Typography variant="body1">Content for unsuccessful deals...</Typography>
              </Paper>

              <Paper elevation={5} style={{ 
                padding: '20px', 
                margin: '10px', 
                width: '45%', 
                backgroundColor: '#FF851B', 
                color: '#ffffff',
              }}>
                <Typography variant="h6" gutterBottom>User Level</Typography>
                <Typography variant="body1">Content for user level...</Typography>
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
              <Typography variant="body1">Content for transaction history...</Typography>
            </Paper>

            <Box>
              {/* Render the Chat component */}
              {renderChat()}
            </Box>
          </div>
        );
    }
  };

  return (
    <div>
      <Sidebar leftOptions={buyerOptions}  onItemClick={setSelectedCategory} />

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
        {/* Render the content based on selectedCategory */}
        {renderContent()}
      </Box>
    </div>
  );
};

export default BuyerDb;
