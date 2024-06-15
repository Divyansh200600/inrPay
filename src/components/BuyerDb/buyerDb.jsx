import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/Auth/AuthContext';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar/sidebar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import ManageProposals from "./features/ManageProposals";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../utils/FireBaseConfig/fireBaseConfig';
import C2I from './features/C2I';
import I2C from './features/I2C';
import C2C from './features/C2C';
import PAYAPP from './features/payApp';
import Help from './features/help';
import Contact from './features/contact';
import ChatRooms from '../chat/chat';

const BuyerDb = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [repPlus, setRepPlus] = useState(null);
  const [dealDone, setDealDone] = useState(null);
  const [loading, setLoading] = useState(true);

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
    { name: 'Chat Rooms' },
    { name: 'Help' },
    { name: 'Contact' },
  ];

  useEffect(() => {
    const fetchRepPlus = async () => {
      if (!currentUser) return;

      try {
        const userDocRef = doc(firestore, `dashBoard/${currentUser.uid}`);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const { repPlus } = userDocSnap.data();
          setRepPlus(repPlus);
        } else {
          console.log('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching repPlus:', error);
      }
    };

    fetchRepPlus();
  }, [currentUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        // Construct the Firestore document reference
        const userDocRef = doc(firestore, `dashBoard/${currentUser.uid}`);

        // Fetch the document snapshot
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // Extract the dealDone field from the document data
          const userData = userDocSnap.data();
          const { dealDone } = userData;
          setDealDone(dealDone); // Update state with dealDone count
        } else {
          console.log('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error fetching data
      } finally {
        setLoading(false); // Update loading state
      }
    };

    fetchUserData(); // Call the function to fetch user data when component mounts or currentUser changes
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
    if (loading) {
      return <Typography variant="body1">Loading...</Typography>;
    }

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
      case 'Chat Rooms':
        return <ChatRooms userRole="buyer" />;
      case 'Help':
        return <Help />;
      case 'Contact':
        return <Contact />;
      default:
        return (
          <div>
            <Box sx={{ padding: '20px', marginTop: '20px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Paper elevation={5} sx={{
                  padding: '20px',
                  backgroundColor: '#0074D9',
                  color: '#ffffff',
                  width: 'calc(50% - 10px)',
                  marginRight: '10px',
                }}>
                  <Typography variant="h6" gutterBottom>All Deals</Typography>
                  <Typography variant="h4">{dealDone !== null ? dealDone : 'No successful deals yet.'}</Typography>
                </Paper>
                
                <Paper elevation={5} sx={{
                  padding: '20px',
                  backgroundColor: '#2ECC40',
                  color: '#ffffff',
                  width: 'calc(50% - 10px)',
                  marginLeft: '10px',
                }}>
                  <Typography variant="h6" gutterBottom>Successful Deals</Typography>
                  <Typography variant="h4">{dealDone !== null ? dealDone : 'No successful deals yet.'}</Typography>
                </Paper>
              </Box>
      
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Paper elevation={5} sx={{
                  padding: '20px',
                  backgroundColor: '#FF851B',
                  color: '#ffffff',
                  width: 'calc(50% - 10px)',
                  marginRight: '10px',
                }}>
                  <Typography variant="h6" gutterBottom>User Level</Typography>
                  <Typography variant="h4">Content for user level...</Typography>
                </Paper>
      
                <Paper elevation={5} sx={{
                  padding: '20px',
                  backgroundColor: '#3f51b5',
                  color: '#ffffff',
                  width: 'calc(50% - 10px)',
                  marginLeft: '10px',
                }}>
                  <Typography variant="h6" gutterBottom>Rep+ Counter</Typography>
                  <Typography variant="h4" gutterBottom>{repPlus !== null ? repPlus : 'Loading repPlus count...'}</Typography>
                </Paper>
              </Box>
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
