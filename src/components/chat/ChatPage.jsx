import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../utils/FireBaseConfig/fireBaseConfig';
import { useAuth } from '../../utils/Auth/AuthContext';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, IconButton, Avatar, Paper, Drawer, ListSubheader, ListItemButton, ListItemIcon, ListItemText as MuiListItemText } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiPicker from 'emoji-picker-react';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';

// Import background images for additional themes
import WhatsAppBackground from '../../resources/Chats-theme/1.jpg';
import TwitterBackground from '../../resources/Chats-theme/2.jpg';
import SnapchatBackground from '../../resources/Chats-theme/3.jpg';
import TelegramBackground from '../../resources/Chats-theme/4.jpg';

const ChatPage = ({ roomId }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [theme, setTheme] = useState(null); // Main theme for overall page
  const [innerTheme, setInnerTheme] = useState(null); // Inner theme for chat render
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

        // Automatically scroll to the bottom when new messages arrive
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });

      return unsubscribe;
    };

    fetchMessages();
  }, [roomId]);

  const handleSendMessage = async () => {
    try {
      if (!newMessage.trim()) return;

      const messageRef = collection(firestore, `chatRooms/${roomId}/messages`);
      await addDoc(messageRef, {
        senderId: currentUser.uid,
        content: newMessage,
        timestamp: serverTimestamp(),
        seen: false,
      });

      setNewMessage('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Error sending message: ${error.message}`);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const messageDocRef = doc(firestore, `chatRooms/${roomId}/messages/${messageId}`);
      await deleteDoc(messageDocRef);

      toast.success('Message deleted.');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(`Error deleting message: ${error.message}`);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.emoji);
    inputRef.current.focus();
  };

  const toggleSettingsDrawer = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleChangeTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsSettingsOpen(false); // Close settings drawer after theme selection
  };

  const handleChangeInnerTheme = (selectedTheme) => {
    setInnerTheme(selectedTheme);
    setIsSettingsOpen(false); // Close settings drawer after theme selection
  };

  const getChatContainerStyle = () => {
    switch (innerTheme) {
      case 'whatsapp':
        return {
          backgroundImage: `url(${WhatsAppBackground})`,
          backgroundSize: 'cover',
          color: '#fff',
        };
      case 'twitter':
        return {
          backgroundImage: `url(${TwitterBackground})`,
          backgroundSize: 'cover',
          color: '#fff',
        };
      case 'snapchat':
        return {
          backgroundImage: `url(${SnapchatBackground})`,
          backgroundSize: 'cover',
          color: '#fff',
        };
      case 'telegram':
        return {
          backgroundImage: `url(${TelegramBackground})`,
          backgroundSize: 'cover',
          color: '#fff',
        };
      default:
        return {};
    }
  };

  const getOuterContainerStyle = () => {
    switch (theme) {
      case 'light':
        return {
          backgroundColor: '#f0f0f0',
          color: '#333',
        };
      case 'dark':
        return {
          backgroundColor: '#333',
          color: '#f0f0f0',
        };
      case 'instagram':
        return {
          backgroundColor: '#800080 ',
          color: '#fff',
        };
      case 'messenger':
        return {
          backgroundColor: '#0084ff',
          color: '#fff',
        };
      default:
        return {};
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        ...getOuterContainerStyle(), // Apply dynamic styles based on outer theme
        padding: '20px',
        marginTop: '-40px', // Adjust the marginTop as needed
      }}
    >
      <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: '20px' }}>
        Chat Room: {roomId}
      </Typography>
      <Paper
        elevation={3}
        sx={{
          width: '80%',
          height: '45vh', // Adjust the height as needed
          maxHeight: '800px', // Max height to limit scrolling
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          padding: '20px',
          overflowY: 'auto', // Enable scrolling
          ...getChatContainerStyle(), // Apply dynamic styles based on inner theme
        }}
      >
        <List sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  maxWidth: '90%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: message.senderId === currentUser.uid ? '#DCF8C6' : '#FFF',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: message.senderId === currentUser.uid ? '#388E3C' : '#1976D2', marginRight: '10px' }}>
                    {message.senderId === currentUser.uid ? 'You' : message.senderId.charAt(0)}
                  </Avatar>
                  <ListItemText
                    primary={message.content}
                    secondary={message.senderId === currentUser.uid ? 'You' : message.senderId}
                    primaryTypographyProps={{ sx: { wordBreak: 'break-word' } }}
                  />
                  {message.senderId !== currentUser.uid && message.seen && (
                    <Typography variant="caption" color="textSecondary" sx={{ marginLeft: '5px' }}>
                      ✓✓
                    </Typography>
                  )}
                  {message.senderId === currentUser.uid && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteMessage(message.id)}
                      sx={{ marginLeft: 'auto' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            </ListItem>
          ))}
          <div ref={messageEndRef} />
        </List>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '800px', // Adjust the maximum width as needed
          display: 'flex',
          alignItems: 'center',
          padding: '5px',
          backgroundColor: '#fff',
          borderTop: '2px solid #ccc',
          position: 'relative', // Ensure the EmojiPicker is positioned correctly
        }}
      >
        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} sx={{ padding: '10px' }}>
          😊
        </IconButton>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          inputRef={inputRef}
          variant="outlined"
          fullWidth
          label="Type your message"
          margin="normal"
          sx={{ marginLeft: '10px', flexGrow: 1 }}
          InputProps={{ sx: { height: '50px', padding: '10px' } }}
        />
        <Button onClick={handleSendMessage} variant="contained" color="primary" sx={{ marginLeft: '10px', padding: '15px' }}>
          Send
        </Button>
        <IconButton onClick={toggleSettingsDrawer} sx={{ marginLeft: 'auto', padding: '10px' }}>
          <SettingsIcon />
        </IconButton>
      </Paper>
      {showEmojiPicker && (
        <Box sx={{ position: 'absolute', bottom: '90px', right: '700px', zIndex: 1 }}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </Box>
      )}
      <Drawer anchor="right" open={isSettingsOpen} onClose={toggleSettingsDrawer}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListSubheader>Theme Settings</ListSubheader>
            {/* Main themes */}
            <ListItemButton selected={theme === 'light'} onClick={() => handleChangeTheme('light')}>
              <ListItemIcon>
                {theme === 'light' && <CheckIcon />}
              </ListItemIcon>
              <MuiListItemText primary="Light Theme" />
            </ListItemButton>
            <ListItemButton selected={theme === 'dark'} onClick={() => handleChangeTheme('dark')}>
              <ListItemIcon>
                {theme === 'dark' && <CheckIcon />}
              </ListItemIcon>
              <MuiListItemText primary="Dark Theme" />
            </ListItemButton>
            <ListItemButton selected={theme === 'instagram'} onClick={() => handleChangeTheme('instagram')}>
              <ListItemIcon>
                {theme === 'instagram' && <CheckIcon />}
              </ListItemIcon>
              <MuiListItemText primary="Purple Theme" />
            </ListItemButton>
            <ListItemButton selected={theme === 'messenger'} onClick={() => handleChangeTheme('messenger')}>
              <ListItemIcon>
                {theme === 'messenger' && <CheckIcon />}
              </ListItemIcon>
              <MuiListItemText primary="SkyBlue Theme" />
            </ListItemButton>
            {/* Additional inner chat themes */}
            <ListSubheader>Chat Themes</ListSubheader>
            <ListItemButton selected={innerTheme === 'whatsapp'} onClick={() => handleChangeInnerTheme('whatsapp')}>
              <ListItemIcon>
                {innerTheme === 'whatsapp' && <CheckIcon />}
              </ListItemIcon>
              <MuiListItemText primary="Orange Box" />
            </ListItemButton>
            <ListItemButton selected={innerTheme === 'twitter'} onClick={() => handleChangeInnerTheme('twitter')}>
              <ListItemIcon>
                {innerTheme === 'twitter' && <CheckIcon />}
              </ListItemIcon>
              <MuiListItemText primary="Space" />
            </ListItemButton>
            <ListItemButton selected={innerTheme === 'snapchat'} onClick={() => handleChangeInnerTheme('snapchat')}>
              <ListItemIcon>
                {innerTheme === 'snapchat' && <CheckIcon />}
              </ListItemIcon>
              <MuiListItemText primary="Mountain" />
            </ListItemButton>
            <ListItemButton selected={innerTheme === 'telegram'} onClick={() => handleChangeInnerTheme('telegram')}>
              <ListItemIcon>
                {innerTheme === 'telegram' && <CheckIcon />}
              </ListItemIcon>
              <MuiListItemText primary="Moon" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ChatPage;