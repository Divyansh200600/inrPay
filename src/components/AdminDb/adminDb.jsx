import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/Auth/AuthContext";
import { Button, Card, CardContent, Typography, CardActions, Box, Grid, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, TextField } from "@mui/material";
import { firestore } from "../../utils/FireBaseConfig/fireBaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 240;

const AdminDb = () => {
  const { logout } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [queryId, setQueryId] = useState("");
  const [queryReason, setQueryReason] = useState("");
  const [currentProposal, setCurrentProposal] = useState(null); // Define currentProposal state

  useEffect(() => {
    document.body.style.backgroundColor = 'lightblue';

    const fetchProposals = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const proposalsData = [];

        const fetchFormData = async (userId) => {
          const formDoc = doc(firestore, "users", userId, "verify", "form");
          const formSnapshot = await getDoc(formDoc);
          if (formSnapshot.exists()) {
            const formData = formSnapshot.data();
            console.log(`Fetched form data for user ${userId}:`, formData);
            return { ...formData, id: userId };
          } else {
            console.error(`No form data found for user ${userId}`);
          }
          return null;
        };

        for (const userDoc of querySnapshot.docs) {
          const userData = userDoc.data();
          console.log(`Fetched user data:`, userData);
          if (userData.userType === "seller") {
            const formData = await fetchFormData(userDoc.id);
            if (formData) {
              proposalsData.push(formData);
            }
          }
        }

        console.log('Final proposals data:', proposalsData);
        setProposals(proposalsData);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleAccept = async (id) => {
    try {
      await updateDoc(doc(firestore, "users", id, "verify", "form"), { status: "approved" });
      setProposals(proposals.map(proposal => proposal.id === id ? { ...proposal, status: "approved" } : proposal));
    } catch (error) {
      console.error(`Error accepting proposal ${id}:`, error);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(firestore, "users", id, "verify", "form"), { status: "rejected" });
      setProposals(proposals.map(proposal => proposal.id === id ? { ...proposal, status: "rejected" } : proposal));
    } catch (error) {
      console.error(`Error rejecting proposal ${id}:`, error);
    }
  };

  const handleQuery = (proposal) => { // Accept proposal object as an argument
    setCurrentProposal(proposal); // Set currentProposal state
    setQueryReason("");
  };

  const handleSaveQuery = async () => {
    try {
      await updateDoc(doc(firestore, "users", currentProposal.id, "verify", "form"), {
        status: "queried",
        reason: queryReason,
      });
      setProposals(
        proposals.map((p) =>
          p.id === currentProposal.id ? { ...p, status: "queried", reason: queryReason } : p
        )
      );
      setQueryReason(""); // Reset the query reason input
      setCurrentProposal(null); // Reset currentProposal state
    } catch (error) {
      console.error(`Error querying proposal ${currentProposal.id}:`, error);
    }
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" edge="end" onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Dashboard', 'Proposal History'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <HomeIcon /> : <ExitToAppIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container spacing={3}>
          {proposals.map((proposal) => (
            <Grid item xs={12} sm={6} md={4} key={proposal.id}>
              <Card sx={{ borderRadius: 10 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {proposal.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {proposal.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Age: {proposal.age}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mobile: {proposal.mobile}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Limit: ${proposal.limit}
                  </Typography>
                  <img src={proposal.photoURL} alt="User Photo" style={{ width: '100%', height: 'auto' }} />
                  <Typography variant="body2" color="text.secondary">
                    Status: {proposal.status}
                  </Typography>
                  {proposal.status === "queried" && (
                    <Typography variant="body2" color="error">
                      Reason: {proposal.reason}
                    </Typography>
                  )}
                  {proposal.aadharURL && (
                    <Typography variant="body2">
                      <a href={proposal.aadharURL} target="_blank" rel="noopener noreferrer">Aadhar Card Link</a>
                    </Typography>
                  )}
                  {proposal.panURL && (
                    <Typography variant="body2">
                      <a href={proposal.panURL} target="_blank" rel="noopenernoreferrer">PAN Card Link</a>
                    </Typography>
                  )}
                  {currentProposal && currentProposal.id === proposal.id && ( // Render query input for the current proposal
                    <Box mt={2}>
                      <TextField
                        label="Query Reason"
                        variant="outlined"
                        value={queryReason}
                        onChange={(e) => setQueryReason(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mt: 2 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveQuery} // Pass the handleSaveQuery function directly
                        sx={{ mt: 2 }}
                      >
                        Save Query
                      </Button>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleAccept(proposal.id)}>
                    Accept
                  </Button>
                  <Button size="small" color="secondary" onClick={() => handleReject(proposal.id)}>
                    Reject
                  </Button>
                  <Button
                    size="small"
                    color="warning"
                    onClick={() => handleQuery(proposal)} // Pass the proposal object to handleQuery
                  >
                    Query
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDb;
