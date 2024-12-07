import React, { useState, useEffect } from "react";
import { useAuth } from "../../../utils/Auth/AuthContext";
import { firestore } from "../../../utils/FireBaseConfig/fireBaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { List, ListItem, ListItemText, Typography, Paper, Divider, Box, Button, Grid } from "@mui/material";

const ManageProposals = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposals, setProposals] = useState([]);
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleDeleteProposal = async (proposalId, buyerId) => {
    try {
      // Delete from seller's collection
      const sellerProposalRef = doc(firestore, `users/${currentUser.uid}/proposals`, proposalId);
      await deleteDoc(sellerProposalRef);

      // Delete from buyer's collection
      const buyerProposalRef = doc(firestore, `users/${buyerId}/proposals`, proposalId);
      await deleteDoc(buyerProposalRef);

      // Update local state to remove the deleted proposal
      setProposals((prevProposals) => prevProposals.filter(proposal => proposal.id !== proposalId));

      toast.success("Proposal deleted successfully");
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast.error(`Error deleting proposal: ${error.message}`);
    }
  };

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
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleDeleteProposal(proposal.id, proposal.buyerId)}
                      >
                        Delete
                      </Button>
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

export default ManageProposals;
