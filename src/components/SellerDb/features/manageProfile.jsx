import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Avatar, Box, Paper, IconButton, Modal } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../utils/FireBaseConfig/fireBaseConfig";
import { useAuth } from "../../../utils/Auth/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import AchievementImage1 from "../../../resources/images/btc.png";
import AchievementImage2 from "../../../resources/images/usdt.png";
import AchievementImage3 from "../../../resources/images/tron.png";
import AchievementImage4 from "../../../resources/images/ltc.png";

const ManageProfile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({
    username: "",
    name: "",
    profileURL: "",
    status: "",
    limit: "",
    walletBalance: 0,
    cryptocurrencies: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser.uid);
    }
  }, [currentUser]);

  const fetchUserData = async (userId) => {
    try {
      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const verifyRef = doc(firestore, "users", userId, "verify", "form");
        const verifyDoc = await getDoc(verifyRef);
        if (verifyDoc.exists()) {
          const verifyData = verifyDoc.data();
          setEditedData({
            ...editedData,
            username: userData.username,
            name: verifyData.name,
            profileURL: verifyData.photoURL, // Fetch profile photoURL from verify form data
            status: verifyData.status,
            limit: verifyData.limit,
            walletBalance: verifyData.walletBalance || 0,
            cryptocurrencies: verifyData.cryptocurrencies || [],
          });
        }
        setUserData(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const verifyRef = doc(firestore, "users", currentUser.uid, "verify", "form");
      await updateDoc(verifyRef, {
        name: editedData.name,
        walletBalance: editedData.walletBalance,
        cryptocurrencies: editedData.cryptocurrencies,
        // Update other editable fields here
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const renderVerificationIcon = () => {
    if (editedData.status === "approved") {
      return <CheckCircleIcon sx={{ color: "green" }} />;
    } else if (editedData.status === "pending") {
      return <WarningIcon sx={{ color: "yellow" }} />;
    }
    return null;
  };

  const handleOpenAchievement = (achievementImage) => {
    setSelectedAchievement(achievementImage);
  };

  const handleCloseAchievement = () => {
    setSelectedAchievement(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>Manage Profile</Typography>
      <br></br>
      <Paper elevation={3} sx={{ p: 2, width: "150%", borderRadius: "40px", backgroundColor: "#cacaca", marginTop: "-20px", marginBottom: "20px", position: "relative" }}>
        <Box display="flex" alignItems="center">
          <Avatar alt={userData?.username} src={editedData?.profileURL} sx={{ width: 100, height: 100, marginRight: "20px" }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px" }}>{editedData?.username}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Username:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{editedData?.username}</Typography>
            </Box>
            {isEditing ? (
              <TextField
                name="name"
                label="Name"
                value={editedData?.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Name:</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>{editedData?.name}</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Status:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{editedData?.status} {renderVerificationIcon()}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Limit:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{editedData?.limit}$</Typography>
            </Box>
            {isEditing ? (
              <TextField
                name="walletBalance"
                label="Wallet Balance"
                value={editedData?.walletBalance}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Wallet Balance:</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>{editedData?.walletBalance}$</Typography>
              </Box>
            )}
            {/* Display other non-editable fields */}
            <Button variant="contained" color="primary" onClick={isEditing ? handleSave : handleEdit} sx={{ borderRadius: "20px", marginBottom: "10px" }}>
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Box>
        </Box>
        <Box sx={{ position: "absolute", top: "16px", right: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={() => handleOpenAchievement(AchievementImage1)} sx={{ margin: "5px" }}>
            <img src={AchievementImage1} alt="Achievement" style={{ width: 48, height: 48, borderRadius: "50%" }} />
          </IconButton>
          <IconButton onClick={() => handleOpenAchievement(AchievementImage2)} sx={{ margin: "5px" }}>
            <img src={AchievementImage2} alt="Achievement" style={{ width: 48, height: 48, borderRadius: "50%" }} />
          </IconButton>
          <IconButton onClick={() => handleOpenAchievement(AchievementImage3)} sx={{ margin: "5px" }}>
            <img src={AchievementImage3} alt="Achievement" style={{ width: 48, height: 48, borderRadius: "50%" }} />
          </IconButton>
          <IconButton onClick={() => handleOpenAchievement(AchievementImage4)} sx={{ margin: "5px" }}>
            <img src={AchievementImage4} alt="Achievement" style={{ width: 48, height: 48, borderRadius: "50%" }} />
          </IconButton>
        </Box>
      </Paper>

      <Modal open={Boolean(selectedAchievement)} onClose={handleCloseAchievement}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 400, bgcolor: 'background.paper', borderRadius: 16, p: 2 }}>
          {selectedAchievement && <img src={selectedAchievement} alt="Achievement" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageProfile;
