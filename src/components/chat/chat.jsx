import { Avatar, Box, CircularProgress, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../utils/Auth/AuthContext';
import { firestore } from '../../utils/FireBaseConfig/fireBaseConfig';
import ChatPage from './ChatPage'; // Assuming ChatPage is in the same directory

const Chat = () => {
  const { currentUser } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
      <Typography
  variant="h4"
  component="h2"
  className="font-bold text-center mb-6"
  sx={{
    fontFamily: 'Arial Black, sans-serif',
    fontSize: '2rem', // Slightly reduced font size for smaller box
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '10%', // Ensure the text takes the full height of the container
  }}
>
  Chat Room
</Typography>
<br/>
        {chatRooms.length > 0 ? (
          <List>
            {chatRooms.map((room) => (
              <React.Fragment key={room.id}>
                <ListItem button onClick={() => setSelectedRoom(room.id)} sx={{ alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', marginRight: '16px' }}>
                    {room.chatRoomId.split('-')[1]}
                  </Avatar>
                  <ListItemText primary={`ChatRoom NO: ${room.chatRoomId}`} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            No chat rooms found.
          </Typography>
        )}
      </Box>
      <Box sx={{ width: '70%', padding: '16px' }}>
        {selectedRoom ? (
          <ChatPage roomId={selectedRoom} />
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '50%' }}>
            Select a chat room to start messaging
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
