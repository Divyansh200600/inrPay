import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography, Paper, Divider, Box, Button, Grid } from "@mui/material";
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../../../utils/FireBaseConfig/fireBaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../utils/Auth/AuthContext";

const ManageDeal = () => {
  const { currentUser } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChatRooms, setActiveChatRooms] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        const proposalsRef = collection(firestore, `users/${currentUser.uid}/proposals`);
        const querySnapshot = await getDocs(proposalsRef);

        let fetchedProposals = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedProposals.push({ id: doc.id, ...data });
        });

        setProposals(fetchedProposals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast.error(`Error fetching proposals: ${error.message}`);
        setError("Error fetching proposals. Please try again later.");
        setLoading(false);
      }
    };

    fetchProposals();
  }, [currentUser]);

  const handleAccept = async (proposal) => {
    try {
      if (!proposal.buyerId || !currentUser?.uid) {
        toast.error("Invalid buyer or seller ID");
        return;
      }
  
      // Fetch the current highest chat room ID
      const chatRoomsRef = collection(firestore, 'chatRooms');
      const chatRoomsSnapshot = await getDocs(chatRoomsRef);
      const chatRoomCount = chatRoomsSnapshot.size;
      const newChatRoomId = `chat-${String(chatRoomCount + 1).padStart(2, '0')}`;
  
      toast.success(`Proposal ${proposal.id} accepted.`);
  
      // Create a new chat room document
      const newChatRoomDoc = await addDoc(chatRoomsRef, {
        chatRoomId: newChatRoomId,
        buyerId: proposal.buyerId,
        sellerId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
  
      // Update buyer's proposal document with chatRoomId
      const buyerProposalDocRef = doc(firestore, `users/${proposal.buyerId}/proposals`, proposal.id);
      await updateDoc(buyerProposalDocRef, { chatRoomId: newChatRoomId });
  
      // Update seller's proposal document with chatRoomId
      const sellerProposalDocRef = doc(firestore, `users/${currentUser.uid}/proposals`, proposal.id);
      await updateDoc(sellerProposalDocRef, { chatRoomId: newChatRoomId });
  
      // Update active chat rooms state
      setActiveChatRooms((prevRooms) => [
        ...prevRooms,
        {
          id: newChatRoomId,
          buyerId: proposal.buyerId,
          sellerId: currentUser.uid,
        },
      ]);
    } catch (error) {
      console.error("Error accepting proposal:", error);
      toast.error(`Error accepting proposal: ${error.message}`);
    }
  };

  const handleReject = async (proposal) => {
    try {
      const proposalDocRef = doc(firestore, `users/${currentUser.uid}/proposals`, proposal.id);
      await deleteDoc(proposalDocRef);

      const notificationsRef = collection(firestore, `users/${proposal.buyerId}/notifications`);
      await addDoc(notificationsRef, {
        message: `Your proposal to ${currentUser.uid} was rejected.`,
        timestamp: serverTimestamp(),
      });

      setProposals(proposals.filter((p) => p.id !== proposal.id));
      toast.success(`Proposal ${proposal.id} rejected and deleted.`);
    } catch (error) {
      console.error("Error rejecting proposal:", error);
      toast.error(`Error rejecting proposal: ${error.message}`);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (!currentUser) {
    return (
      <Paper elevation={3} sx={{ p: 2, width: "50%", borderRadius: "16px", marginBottom: "20px" }}>
        <Typography variant="body1" color="error">No user logged in.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, width: "50%", borderRadius: "16px", marginBottom: "20px" }}>
      <Typography variant="h5" gutterBottom>New Proposals</Typography>
      <ToastContainer />
      {loading && <Typography variant="body1">Loading...</Typography>}
      {!loading && error && (
        <Typography variant="body1" color="error">{error}</Typography>
      )}
      {!loading && !error && (
        <List>
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <Box key={proposal.id} sx={{ mb: 2 }}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: "16px", backgroundColor: "#f0f0f0", border: "1px solid #ccc" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333", borderBottom: "1px solid #ccc", paddingBottom: 1 }} gutterBottom>Proposal ID: {proposal.id}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>Amount and Currency:</span> ${proposal.amountCurrency}
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>Wallet Name:</span> {proposal.walletName}
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>Time Remaining:</span> {formatTime(proposal.remainingTime)}
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>Buyer ID:</span> {proposal.buyerId}
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>Seller ID:</span> {currentUser.uid}
                  </Typography>

                  <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                      <Button variant="contained" color="primary" onClick={() => handleAccept(proposal)}>Accept</Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="secondary" onClick={() => handleReject(proposal)}>Reject</Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No saved proposals found." />
            </ListItem>
          )}
        </List>
      )}
    </Paper>
  );
};

export default ManageDeal;
