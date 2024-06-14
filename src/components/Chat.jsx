import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { collection, query,  orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../utils/FireBaseConfig/fireBaseConfig';

const Chat = ({ currentUser, chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!chatRoomId) return;

    const messagesRef = collection(firestore, 'chatRooms', chatRoomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedMessages = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messagesRef = collection(firestore, 'chatRooms', chatRoomId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Chat Room</Typography>
      <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ display: 'flex', justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start' }}>
            <Paper sx={{ p: 1, m: 1, backgroundColor: message.senderId === currentUser.uid ? '#E3F2FD' : '#F1F8E9' }}>
              <Typography variant="body2">{message.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>Send</Button>
      </Box>
    </Paper>
  );
};

export default Chat;
