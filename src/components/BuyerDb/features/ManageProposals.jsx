import React, { useState, useEffect } from "react";
import { useAuth } from "../../../utils/Auth/AuthContext";
import { firestore } from "../../../utils/FireBaseConfig/fireBaseConfig";
import { collection, getDocs} from "firebase/firestore";
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
                <Typography variant="body1">Time Remaining: </Typography>
                <Typography variant="body1">Buyer ID: {proposal.buyerId}</Typography>
                <Typography variant="body1">Seller ID: {currentUser.uid}</Typography>
                <Grid container spacing={2} justifyContent="flex-end">
                  
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