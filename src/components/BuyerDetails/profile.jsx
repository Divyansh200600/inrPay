import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';

const Profile = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const db = getFirestore();
        const userDoc = doc(db, 'users', userId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUserDetails(userSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">User not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: '#f0f0f0' }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: '30px',
          width: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ color: '#333' }}>
          Buyer's Details
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '10px', color: '#555' }}>
          <strong>Name:</strong> {userDetails.username}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '10px', color: '#555' }}>
          <strong>Email:</strong> {userDetails.email}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '10px', color: '#555' }}>
          <strong>User Type:</strong> {userDetails.userType}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
