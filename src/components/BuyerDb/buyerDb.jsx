import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/Auth/AuthContext';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar/sidebar'; // Ensure correct import path to Sidebar
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import ManageProposals from "./features/ManageProposals";
import { doc, getDoc } from 'firebase/firestore'; // Ensure correct import path for Firestore
import { firestore } from '../../utils/FireBaseConfig/fireBaseConfig';

// Import the necessary features/components
import C2I from './features/C2I';
import I2C from './features/I2C';
import C2C from './features/C2C';
import PAYAPP from './features/payApp';
import Help from './features/help';
import Contact from './features/contact';
import ChatRooms from '../chat/chat';  // New component to list chat rooms

const BuyerDb = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [repPlus, setRepPlus] = useState(null); // Initialize with null or appropriate initial state

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

  useEffect(() => {
    const fetchRepPlus = async () => {
      if (!currentUser) return; // Ensure currentUser is available

      try {
        // Construct the Firestore document reference
        const userDocRef = doc(firestore, `dashBoard/${currentUser.uid}`);

        // Fetch the document snapshot
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // Extract the repPlus count from the document data
          const { repPlus } = userDocSnap.data();
          setRepPlus(repPlus); // Update state with repPlus count
        } else {
          console.log('Document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching repPlus:', error);
        // Handle error fetching repPlus (e.g., show error message)
      }
    };

    fetchRepPlus(); // Call the function to fetch repPlus when component mounts or currentUser changes
  }, [currentUser]);

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

              <Paper elevation={5} style={{
                padding: '20px',
                margin: '10px',
                width: '45%',
                backgroundColor: '#3f51b5',
                color: '#ffffff'
              }}>
                <Typography variant="h4" gutterBottom>Rep+ Counter</Typography>
                {repPlus !== null ? (
                  <Typography variant="h4">{repPlus}</Typography>
                ) : (
                  <Typography variant="body1">Loading repPlus count...</Typography>
                )}

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
        {renderContent()}
      </Box>
    </div>
  );
};

export default BuyerDb;
