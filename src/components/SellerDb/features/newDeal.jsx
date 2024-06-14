import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography, Paper, Divider, Box, Button, Grid } from "@mui/material";
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../../../utils/FireBaseConfig/fireBaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../utils/Auth/AuthContext";
import Chat from "../../Chat"; // Ensure correct import path to Chat component

const NewDeal = () => {
  const { currentUser } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [activeChatRooms, setActiveChatRooms] = useState([]);
console.log(selectedProposal)
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
          console.log(`Fetched Proposal: ${JSON.stringify(data)}`);
          if (!data.buyerId || !data.sellerId) {
            console.error("Error: Missing buyerId or sellerId in proposal data.");
          }
          fetchedProposals.push({ id: doc.id, ...data, remainingTime: 120 });
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

      console.log(`Accept Proposal - Seller ID: ${currentUser.uid}`);
      console.log(`Accept Proposal - Buyer ID: ${proposal.buyerId}`);

      toast.success(`Proposal ${proposal.id} accepted.`);
      setSelectedProposal(proposal);

      // Create a new chat room document
      const chatRoomRef = collection(firestore, 'chatRooms');
      const newChatRoomDoc = await addDoc(chatRoomRef, {
        buyerId: proposal.buyerId,
        sellerId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      console.log(`New Chat Room ID: ${newChatRoomDoc.id}`);

      // Update buyer's proposal document with chatRoomId
      const buyerProposalDocRef = doc(firestore, `users/${proposal.buyerId}/proposals`, proposal.id);
      await updateDoc(buyerProposalDocRef, { chatRoomId: newChatRoomDoc.id });

      // Update seller's proposal document with chatRoomId
      const sellerProposalDocRef = doc(firestore, `users/${currentUser.uid}/proposals`, proposal.id);
      await updateDoc(sellerProposalDocRef, { chatRoomId: newChatRoomDoc.id });

      // Update active chat rooms state
      setActiveChatRooms((prevRooms) => [
        ...prevRooms,
        {
          id: newChatRoomDoc.id,
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
      console.log(`Reject Proposal - Seller ID: ${currentUser.uid}`);
      console.log(`Reject Proposal - Buyer ID: ${proposal.buyerId}`);

      const proposalDocRef = doc(firestore, `users/${currentUser.uid}/proposals`, proposal.id);
      await deleteDoc(proposalDocRef);

      const notificationsRef = collection(firestore, `users/${proposal.buyerId}/notifications`);
      await addDoc(notificationsRef, {
        message: `Your proposal to ${currentUser.uid} was rejected.`,
        timestamp: serverTimestamp(),
      });

      setProposals(proposals.filter((p) => p.id !== proposal.id));
      toast.success(`Proposal ${proposal.id} rejected and deleted.`);

      // Remove from active chat rooms if present
      setActiveChatRooms((prevRooms) => prevRooms.filter((room) => room.id !== proposal.chatRoomId));
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
      <Typography variant="h5" gutterBottom>Saved Proposals</Typography>
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
                <Paper elevation={3} sx={{ p: 2, borderRadius: "16px" }}>
                  <Typography variant="subtitle1" gutterBottom>Proposal ID: {proposal.id}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1">Amount and Currency: ${proposal.amountCurrency}</Typography>
                  <Typography variant="body1">Wallet Name: {proposal.walletName}</Typography>
                  <Typography variant="body1">Time Remaining: {formatTime(proposal.remainingTime)}</Typography>
                  <Typography variant="body1">Buyer ID: {proposal.buyerId}</Typography>
                  <Typography variant="body1">Seller ID: {currentUser.uid}</Typography>
                  <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                      <Button variant="contained" color="primary" onClick={() => handleAccept(proposal)}>Accept</Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="secondary" onClick={() => handleReject(proposal)}>Reject</Button>
                    </Grid>
                  </Grid>
                  {/* Display active chat room if selected */}
                  {activeChatRooms.some(room => room.id === proposal.chatRoomId) && (
                    <Chat currentUser={currentUser} chatRoomId={proposal.chatRoomId} />
                  )}
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

export default NewDeal;
