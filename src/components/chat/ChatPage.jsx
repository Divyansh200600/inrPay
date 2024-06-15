import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, IconButton, Box, Paper, Typography, List, ListItem, ListItemText, Avatar, Drawer, ListSubheader, ListItemButton, ListItemIcon, ListItemText as MuiListItemText } from '@mui/material';
import { collection, getDoc,query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp,writeBatch } from 'firebase/firestore';
import { firestore } from '../../utils/FireBaseConfig/fireBaseConfig';
import { useAuth } from '../../utils/Auth/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiPicker from 'emoji-picker-react';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import ReplyIcon from '@mui/icons-material/Reply';

// Import background images for additional themes
import WhatsAppBackground from '../../resources/Chats-theme/1.jpg';
import TwitterBackground from '../../resources/Chats-theme/2.jpg';
import SnapchatBackground from '../../resources/Chats-theme/3.jpg';
import TelegramBackground from '../../resources/Chats-theme/4.jpg';

// Import sound for message send
import sendSound from '../../resources/Sounds/sounds/send-message.mp3'; // Adjust path as needed
import { Howl } from 'howler'; // Import Howl from howler

const ChatPage = ({ roomId }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [theme, setTheme] = useState(null); // Main theme for overall page
  const [innerTheme, setInnerTheme] = useState(null); // Inner theme for chat render
  const [mentionSuggestions, setMentionSuggestions] = useState([]); // State for mention suggestions
  const [replyToMessage, setReplyToMessage] = useState(null); // State to store the message being replied to
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const audioRef = useRef(null); // Reference to the audio element
  const [repPlusGiven, setRepPlusGiven] = useState(false);

  useEffect(() => {
    audioRef.current = new Howl({
      src: [sendSound],
      volume: 0.5, // Adjust volume as needed
    });
  }, []);

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
  
        // Log buyerId and sellerId for each message
        fetchedMessages.forEach((message) => {
          const isCurrentUserSender = message.senderId === currentUser.uid;
          const buyerId = isCurrentUserSender ? currentUser.uid : message.senderId;
          const sellerId = isCurrentUserSender ? message.senderId : currentUser.uid;
  
          console.log(`Buyer ID: ${buyerId}, Seller ID: ${sellerId}`);
        });
      });
  
      return unsubscribe;
    };
  
    fetchMessages(); // Fetch messages when roomId changes
  
  }, [roomId, currentUser]); // Ensure useEffect dependencies are set correctly
   // Ensure useEffect dependencies are set correctly
  

  // Function to play the send sound
  const playSendSound = () => {
    if (audioRef.current) {
      audioRef.current.play(); // Play the audio element
    }
  };

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

      // Play send sound effect
      playSendSound();
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

  const handleReplyMessage = (message) => {
    setReplyToMessage(message);
    // Optionally, you can add logic to auto-populate the message input with some content like:
    // setNewMessage(`@${message.senderId} `);
    inputRef.current.focus(); // Focus on the input field after initiating a reply
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const currentCursorPosition = e.target.selectionStart;
      const newMessageText = `${newMessage.slice(0, currentCursorPosition)}\n${newMessage.slice(currentCursorPosition)}`;
      setNewMessage(newMessageText);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

    // Detect '@' symbol to trigger mention suggestions
    if (e.key === '@') {
      // Implement logic to fetch and display mention suggestions
      // For simplicity, I'll set a sample list here
      const sampleSuggestions = ['Alice', 'Bob', 'Charlie', 'David'];
      setMentionSuggestions(sampleSuggestions);
    }
  };

  if (!currentUser) {
    return (
      <Typography variant="body1" color="error">
        No user logged in.
      </Typography>
    );
  }

  const handleRepPlus = async () => {
    try {
      if (!roomId || !currentUser) return;

      // Determine buyerId (current user's ID)
      const buyerId = currentUser.uid;

      // Fetch the latest message to determine the sellerId (if needed)
      // Replace this with your actual logic to fetch sellerId
      let sellerId = ''; // Replace with actual sellerId logic if needed

      // Update buyer's dashboard with repPlus count
      const buyerDocRef = doc(firestore, `dashBoard/${buyerId}`);
      const buyerDocSnap = await getDoc(buyerDocRef);

      const batch = writeBatch(firestore);

      if (!buyerDocSnap.exists()) {
        // Create dashboard document for the buyer and set initial reputation
        batch.set(buyerDocRef, { repPlus:25});
        console.log(`Buyer ${buyerId} reputation updated.`);
      } else {
        // Increment repPlus if buyerDoc exists
        const newRepPlus = (buyerDocSnap.data().repPlus || 0) + 25;
        batch.update(buyerDocRef, { repPlus: newRepPlus });
        console.log(`Buyer ${buyerId} reputation incremented to ${newRepPlus}.`);
      }

      // Commit the batch write
      await batch.commit();

      // Update state to hide the Rep+ button
      setRepPlusGiven(true);

      // Provide feedback to the user
      toast.success('Rep+ given successfully!');

    } catch (error) {
      console.error('Error giving rep+:', error);
      toast.error(`Error giving rep+: ${error.message}`);
    }
  };

  const handleDealClose = async () => {
    try {
      if (!roomId || !currentUser) return;
  
      // Construct a reference to the chat room document
      const chatRoomRef = doc(firestore, 'chatRooms', roomId);
  
      // Fetch the chat room data to determine sellerId
      const chatRoomSnap = await getDoc(chatRoomRef);
      if (!chatRoomSnap.exists()) {
        console.error('Chat room does not exist.');
        return;
      }
  
      const chatRoomData = chatRoomSnap.data();
      const buyerId = currentUser.uid;
      const sellerId = chatRoomData.sellerId; // Assuming sellerId is stored in chat room data
  
      // Delete the document from Firestore
      await deleteDoc(chatRoomRef);
  
      // Update dealDone count for both buyer and seller
      const batch = writeBatch(firestore);
  
      // Update buyer's dashboard with dealDone count
      const buyerDocRef = doc(firestore, 'dashBoard', buyerId);
      const buyerDocSnap = await getDoc(buyerDocRef);
  
      if (!buyerDocSnap.exists()) {
        // Create dashboard document for the buyer and set initial dealDone count
        batch.set(buyerDocRef, { dealDone: 1 });
      } else {
        // Increment dealDone if buyerDoc exists
        const newDealDoneBuyer = (buyerDocSnap.data().dealDone || 0) + 1;
        batch.update(buyerDocRef, { dealDone: newDealDoneBuyer });
      }
  
      // Update seller's dashboard with dealDone count
      const sellerDocRef = doc(firestore, 'dashBoard', sellerId);
      const sellerDocSnap = await getDoc(sellerDocRef);
  
      if (!sellerDocSnap.exists()) {
        // Create dashboard document for the seller and set initial dealDone count
        batch.set(sellerDocRef, { dealDone: 1 });
      } else {
        // Increment dealDone if sellerDoc exists
        const newDealDoneSeller = (sellerDocSnap.data().dealDone || 0) + 1;
        batch.update(sellerDocRef, { dealDone: newDealDoneSeller });
      }
  
      // Commit the batch write
      await batch.commit();
  
      // Optionally, you may want to navigate away or provide feedback to the user
      console.log(`Chat room ${roomId} successfully closed.`);
      toast.success('Chat room closed successfully.');
  
      // Implement any additional logic as needed after deleting the chat room and updating dealDone counts
    } catch (error) {
      console.error('Error closing deal:', error);
      toast.error(`Error closing deal: ${error.message}`);
    }
  };
  
  
  
  
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
        <List sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
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
                {/* Message header with sender avatar and reply button */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Avatar sx={{ bgcolor: message.senderId === currentUser.uid ? '#388E3C' : '#1976D2', marginRight: '10px' }}>
                    {message.senderId === currentUser.uid ? 'You' : message.senderId.charAt(0)}
                  </Avatar>
                  <ListItemText
                    primary={message.content}
                    secondary={message.senderId === currentUser.uid ? 'You' : message.senderId}
                    primaryTypographyProps={{ sx: { wordBreak: 'break-word' } }}
                  />
                  {/* Reply button */}
                  <IconButton onClick={() => handleReplyMessage(message)} sx={{ marginLeft: 'auto' }}>
                    <ReplyIcon />
                  </IconButton>
                  {/* Seen indicator */}
                  {message.senderId !== currentUser.uid && message.seen && (
                    <Typography variant="caption" color="textSecondary" sx={{ marginLeft: '5px' }}>
                      ✓✓
                    </Typography>
                  )}
                  {/* Delete button (visible for sender only) */}
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
                {/* Display replied message if available */}
                {replyToMessage && replyToMessage.id === message.id && (
                  <Paper elevation={1} sx={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px', marginBottom: '5px' }}>
                    <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                      Replying to {message.senderId === currentUser.uid ? 'your message' : message.senderId}
                    </Typography>
                    <Typography variant="body2">
                      {replyToMessage.content}
                    </Typography>
                  </Paper>
                )}
              </Paper>
            </ListItem>
          ))}
          <div ref={messageEndRef} />
        </List>
      </Paper>
 {/* Rep+ button */}
 {!repPlusGiven && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button variant="contained" color="primary" onClick={handleRepPlus}>
            Rep+
          </Button>
        </Box>
          )}

          {/* Deal Close button */}
 {!repPlusGiven && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button variant="contained" color="primary" onClick={handleDealClose}>
           Deal Close
          </Button>
        </Box>
          )}


      {/* Input area for typing new message */}
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
        {/* Emoji picker button */}
        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} sx={{ padding: '10px' }}>
          😊
        </IconButton>
        {/* Text input field for typing new message */}
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          inputRef={inputRef}
          variant="outlined"
          fullWidth
          multiline  // Enable multiline input
          label="Type your message"
          margin="normal"
          sx={{ marginLeft: '10px', flexGrow: 1 }}
          InputProps={{ sx: { height: '50px', padding: '10px' } }}
          onKeyDown={handleKeyDown} // Attach handleKeyDown for handling Shift + Enter and mentions
        />
        {/* Send message button */}
        <Button onClick={handleSendMessage} variant="contained" color="primary" sx={{ marginLeft: '10px', padding: '15px' }}>
          Send
        </Button>
        {/* Settings button */}
        <IconButton onClick={toggleSettingsDrawer} sx={{ marginLeft: 'auto', padding: '10px' }}>
          <SettingsIcon />
        </IconButton>
      </Paper>
      {/* Emoji picker component */}
      {showEmojiPicker && (
        <Box sx={{ position: 'absolute', bottom: '90px', right: '700px', zIndex: 1 }}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </Box>
      )}
      {/* Settings drawer */}
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
      {/* Mention suggestions */}
      {mentionSuggestions.length > 0 && (
        <Paper elevation={3} sx={{ position: 'absolute', top: '60px', left: '20px', zIndex: 2 }}>
          <List sx={{ width: '100%' }}>
            {/* Display mention suggestions */}
            {mentionSuggestions.map((mention, index) => (
              <ListItem key={index} button>
                <ListItemText primary={`@${mention}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {/* Audio element for send sound */}
      <audio ref={audioRef} />
    </Box>
  );
};

export default ChatPage;

