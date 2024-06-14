import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../utils/FireBaseConfig/fireBaseConfig';
import { useAuth } from '../../utils/Auth/AuthContext';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = () => {
      if (!roomId) return;

      const messagesRef = collection(firestore, `chatRooms/${roomId}/messages`);
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let fetchedMessages = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMessages.push({ id: doc.id, ...data });
        });
        setMessages(fetchedMessages);
      });

      return unsubscribe;
    };

    fetchMessages();

    // Clean up function for useEffect
    return () => setMessages([]); // Clear messages on component unmount or roomId change
  }, [roomId]);

  const handleSendMessage = async () => {
    try {
      if (!newMessage.trim()) return;

      const messageRef = collection(firestore, `chatRooms/${roomId}/messages`);
      await addDoc(messageRef, {
        senderId: currentUser.uid === 'seller' ? 'seller' : 'buyer',
        content: newMessage,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Error sending message: ${error.message}`);
    }
  };

  if (!currentUser) {
    return (
      <Typography variant="body1" color="error">
        No user logged in.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Chat Room: {roomId}</Typography>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText
              primary={`${message.senderId === 'seller' ? 'Seller' : 'Buyer'}: ${message.content}`}
            />
          </ListItem>
        ))}
      </List>
      <TextField
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        variant="outlined"
        fullWidth
        label="Type your message"
        margin="normal"
      />
      <Button onClick={handleSendMessage} variant="contained" color="primary">
        Send
      </Button>
    </Box>
  );
};

export default ChatPage;
