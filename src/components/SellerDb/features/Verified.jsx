import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { firestore, storage } from '../../../utils/FireBaseConfig/fireBaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../../utils/Auth/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verified = () => {
  const { currentUser } = useAuth();
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    mobile: '',
    limit: ''
  });
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
console.log(isSubmitted);
  useEffect(() => {
    if (currentUser) {
      const fetchUserId = async () => {
        try {
          const userId = currentUser.uid;
          setUserId(userId);
          const userRef = doc(firestore, 'users', userId, 'verify', 'form');
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setVerificationStatus(data.status);
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      };

      fetchUserId();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'aadhar') setAadharFile(files[0]);
    if (name === 'pan') setPanFile(files[0]);
    if (name === 'photo') setPhotoFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("No authenticated user found. Please log in to continue.");
      return;
    }

    const userRef = doc(firestore, 'users', userId, 'verify', 'form');

    try {
      const aadharPath = aadharFile ? `users/${userId}/docs/${aadharFile.name}` : null;
      const panPath = panFile ? `users/${userId}/docs/${panFile.name}` : null;
      const photoPath = photoFile ? `users/${userId}/docs/${photoFile.name}` : null;

      const uploadPromises = [];

      if (aadharFile) {
        const aadharRef = ref(storage, aadharPath);
        uploadPromises.push(uploadBytes(aadharRef, aadharFile).then(() => getDownloadURL(aadharRef)));
      }

      if (panFile) {
        const panRef = ref(storage, panPath);
        uploadPromises.push(uploadBytes(panRef, panFile).then(() => getDownloadURL(panRef)));
      }

      if (photoFile) {
        const photoRef = ref(storage, photoPath);
        uploadPromises.push(uploadBytes(photoRef, photoFile).then(() => getDownloadURL(photoRef)));
      }

      const [aadharURL, panURL, photoURL] = await Promise.all(uploadPromises);

      const formDetails = {
        ...formData,
        aadharURL: aadharURL || '',
        panURL: panURL || '',
        photoURL: photoURL || '',
        status: 'pending'
      };

      await setDoc(userRef, formDetails);
      setIsSubmitted(true);
      setVerificationStatus('pending');
      toast.success('Verification details saved successfully!');
    } catch (error) {
      console.error('Error uploading files and saving form details:', error);
      toast.error('Failed to save verification details. Please check the console for more details.');
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column' 
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        {verificationStatus === 'pending' ? (
          <Typography variant="h4" gutterBottom>
            Your verification status is pending.
          </Typography>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>
              Verification Form
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Seller's Limit (USD)"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Box mt={2}>
              <Typography variant="h6">Upload Documents</Typography>
              <input
                type="file"
                name="aadhar"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ marginTop: '10px' }}
              />
              <input
                type="file"
                name="pan"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ marginTop: '10px' }}
              />
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                style={{ marginTop: '10px' }}
              />
            </Box>
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
              Submit
            </Button>
          </Box>
        )}
      </Paper>
      <ToastContainer />
    </Box>
  );
};

export default Verified;
