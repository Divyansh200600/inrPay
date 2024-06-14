import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/FireBaseConfig/fireBaseConfig';
import { useAuth } from '../../utils/Auth/AuthContext';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Chat = () => {
  const { currentUser } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!currentUser) return;

      setLoading(true);

      try {
        const chatRoomsRef = collection(firestore, 'chatRooms');
        const q = query(
          chatRoomsRef,
          where('buyerId', '==', currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        let fetchedChatRooms = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedChatRooms.push({ id: doc.id, ...data });
        });

        // Also fetch rooms where current user is seller
        const q2 = query(
          chatRoomsRef,
          where('sellerId', '==', currentUser.uid)
        );

        const querySnapshot2 = await getDocs(q2);

        querySnapshot2.forEach((doc) => {
          const data = doc.data();
          fetchedChatRooms.push({ id: doc.id, ...data });
        });

        console.log('Fetched chat rooms:', fetchedChatRooms);
        setChatRooms(fetchedChatRooms);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
        toast.error(`Error fetching chat rooms: ${error.message}`);
        setError('Error fetching chat rooms. Please try again later.');
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Typography variant="body1" color="error">
        No user logged in.
      </Typography>
    );
  }

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>Chat Rooms</Typography>
      {chatRooms.length > 0 ? (
        <List>
          {chatRooms.map((room) => (
            <React.Fragment key={room.id}>
              <ListItem button component={Link} to={`/chat/${room.id}`}>
                <ListItemText primary={`Chat Room ID: ${room.id}`} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={`Buyer ID: ${room.buyerId}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Seller ID: ${room.sellerId}`} />
              </ListItem>
              {/* Add more details as needed */}
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No chat rooms found.</Typography>
      )}
    </Box>
  );
};

export default Chat;
