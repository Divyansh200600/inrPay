import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/Auth/AuthContext';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar/sidebar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import { doc, getDoc } from 'firebase/firestore'; // Ensure correct import path for Firestore
import { firestore } from '../../utils/FireBaseConfig/fireBaseConfig';

// Import all features here
import Verified from './features/Verified';
import ManageProfile from './features/manageProfile';
import ManageDeal from './features/manageDeal';
import Help from './features/help';
import Contact from './features/contact';
import ChatRooms from '../chat/chat';

const SellerDb = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [repPlus, setRepPlus] = useState(null); // Initialize with null or appropriate initial state
  const [dealDone, setDealDone] = useState(null); // Initialize dealDone state
  const [loading, setLoading] = useState(true); // Loading state for initial fetch

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sellerOptions = [
    { name: 'Manage Deal' },
    { name: 'Manage Profile' },
    { name: 'Verified' },
    { name: 'Chat Rooms' },  // New menu option
    { name: 'Help' },
    { name: 'Contact' },
  ];

  useEffect(() => {
    const fetchRepPlus = async () => {
      if (!currentUser) return; // Ensure currentUser is available
  
      try {
        // Construct the Firestore document reference for repPlus
        const userDocRef = doc(firestore, `dashBoard/${currentUser.uid}`);
  
        // Fetch the document snapshot for repPlus
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          // Extract the repPlus count from the document data
          const { repPlus } = userDocSnap.data();
          setRepPlus(repPlus); // Update state with repPlus count
        } else {
          console.log('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching repPlus:', error);
        // Handle error fetching repPlus (e.g., show error message)
      }
    };

    fetchRepPlus(); // Call the function to fetch repPlus when component mounts or currentUser changes
    
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
      case 'Manage Profile':
        return <ManageProfile />;
      case 'Manage Deal':
        return <ManageDeal />;
      case 'Verified':
        return <Verified />;
      case 'Chat Rooms':  // New case for chat rooms
        return <ChatRooms userRole="seller" />;
      case 'Help':
        return <Help />;
      case 'Contact':
        return <Contact />;
      default:
        return (
          <Box sx={{ padding: '20px', marginTop: '20px' }}>
            {/* First Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Paper elevation={5} sx={{
                padding: '20px',
                backgroundColor: '#0074D9',
                color: '#ffffff',
                width: 'calc(50% - 10px)', // 50% width with spacing between
                marginRight: '10px', // Space between the two papers
              }}>
                <Typography variant="h6" gutterBottom>All Deals</Typography>
                <Typography variant="h4">{dealDone !== null ? dealDone : 'No successful deals yet.'}</Typography>
              </Paper>
              
              <Paper elevation={5} sx={{
                padding: '20px',
                backgroundColor: '#2ECC40',
                color: '#ffffff',
                width: 'calc(50% - 10px)', // 50% width with spacing between
                marginLeft: '10px', // Space between the two papers
              }}>
                <Typography variant="h6" gutterBottom>Successful Deals</Typography>
                <Typography variant="h4">{dealDone !== null ? dealDone : 'No successful deals yet.'}</Typography>
              </Paper>
            </Box>
      
            {/* Second Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Paper elevation={5} sx={{
                padding: '20px',
                backgroundColor: '#FF851B',
                color: '#ffffff',
                width: 'calc(50% - 10px)', // 50% width with spacing between
                marginRight: '10px', // Space between the two papers
              }}>
                <Typography variant="h6" gutterBottom>User Level</Typography>
                <Typography variant="h4">Content for user level...</Typography>
              </Paper>
      
              <Paper elevation={5} sx={{
                padding: '20px',
                backgroundColor: '#3f51b5',
                color: '#ffffff',
                width: 'calc(50% - 10px)', // 50% width with spacing between
                marginLeft: '10px', // Space between the two papers
              }}>
                <Typography variant="h6" gutterBottom>Rep+ Counter</Typography>
                <Typography variant="h4" gutterBottom>{repPlus !== null ? repPlus : 'Loading repPlus count...'}</Typography>
              </Paper>
            </Box>
          </Box>
        );
    }
  };

  return (
    <div>
      <Sidebar leftOptions={sellerOptions} onItemClick={setSelectedCategory} />

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