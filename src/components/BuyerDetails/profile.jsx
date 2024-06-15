import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { Typography, Paper, Box, CircularProgress, Button, TextField } from '@mui/material';
import { useAuth } from '../../utils/Auth/AuthContext'; // Make sure this path is correct

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const db = getFirestore();
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserDetails(userData);
          setUsername(userData.username);
          setEmail(userData.email);
          setUserType(userData.userType);
       
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserDetails();
    }
  }, [currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const db = getFirestore();
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        username: username,
        email: email,
        userType: userType,
        
      });

       
       

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user details: ', error);
    }
  };

 
 

   

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

        {isEditing ? (
          <>
            <TextField
              fullWidth
              variant="outlined"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="User Type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              sx={{ marginBottom: '10px' }}
            />
            
            <Box display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </>
        ) : (
          <>
            
            <Typography variant="body1" sx={{ marginBottom: '10px', color: '#555' }}>
              <strong>Name:</strong> {userDetails.username}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px', color: '#555' }}>
              <strong>Email:</strong> {userDetails.email}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px', color: '#555' }}>
              <strong>User Type:</strong> {userDetails.userType}
            </Typography>
            <Box display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={handleEdit}>
                Edit
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
