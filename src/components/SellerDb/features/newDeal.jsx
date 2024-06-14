import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography, Paper, Divider, Box, Button, Grid } from "@mui/material";
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../../utils/FireBaseConfig/fireBaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../utils/Auth/AuthContext";

const SavedProposals = () => {
  const { currentUser } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        const proposalsRef = collection(firestore, `users/${currentUser.uid}/proposals`);
        const querySnapshot = await getDocs(proposalsRef);

        let fetchedProposals = [];
        querySnapshot.forEach((doc) => {
          fetchedProposals.push({ id: doc.id, ...doc.data() });
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

  const handleAccept = async (proposalId) => {
    try {
      toast.success(`Proposal ${proposalId} accepted.`);
      // Add your accept logic here
    } catch (error) {
      console.error("Error accepting proposal:", error);
      toast.error(`Error accepting proposal: ${error.message}`);
    }
  };

  const handleReject = async (proposalId, buyerId) => {
    try {
      const proposalDocRef = doc(firestore, `users/${currentUser.uid}/proposals`, proposalId);
      await deleteDoc(proposalDocRef);
      
      const notificationsRef = collection(firestore, `users/${buyerId}/notifications`);
      await addDoc(notificationsRef, {
        message: `Your proposal to ${currentUser.uid} was rejected.`,
        timestamp: serverTimestamp(),
      });
      
      setProposals(proposals.filter((proposal) => proposal.id !== proposalId));
      toast.success(`Proposal ${proposalId} rejected and deleted.`);
    } catch (error) {
      console.error("Error rejecting proposal:", error);
      toast.error(`Error rejecting proposal: ${error.message}`);
    }
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
                  <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                      <Button variant="contained" color="primary" onClick={() => handleAccept(proposal.id)}>Accept</Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="secondary" onClick={() => handleReject(proposal.id, proposal.buyerId)}>Reject</Button>
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

export default SavedProposals;
