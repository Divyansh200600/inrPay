import React, { useState, useEffect } from "react";
import { Typography, Avatar, Box, Paper, IconButton, Modal, Button } from "@mui/material";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AchievementImage1 from "../../../resources/images/btc.png";
import AchievementImage2 from "../../../resources/images/usdt.png";
import AchievementImage3 from "../../../resources/images/tron.png";
import AchievementImage4 from "../../../resources/images/ltc.png";
import { firestore, auth } from "../../../utils/FireBaseConfig/fireBaseConfig";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ProposalForm from "./ProposalForm";

const SellerIDCard = ({ userId }) => {
  const [seller, setSeller] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isProposalFormOpen, setIsProposalFormOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    username: "",
    name: "",
    profileURL: "",
    status: "",
    limit: "",
    walletBalance: 0,
    cryptocurrencies: [],
  });

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const userRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const verifyRef = doc(firestore, "users", userId, "verify", "form");
          const verifyDoc = await getDoc(verifyRef);
          if (verifyDoc.exists()) {
            const verifyData = verifyDoc.data();
            setSeller({
              ...userData,
              name: verifyData.name,
              profileURL: verifyData.profileURL,
              status: verifyData.status,
              limit: verifyData.limit,
              walletBalance: verifyData.walletBalance || 0,
              cryptocurrencies: verifyData.cryptocurrencies || [],
            });
            setEditedData({
              ...userData,
              name: verifyData.name,
              profileURL: verifyData.profileURL,
              status: verifyData.status,
              limit: verifyData.limit,
              walletBalance: verifyData.walletBalance || 0,
              cryptocurrencies: verifyData.cryptocurrencies || [],
            });
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting seller data:", error);
      }
    };

    fetchSellerData();
  }, [userId]);

  const handleOpenAchievement = (achievementImage) => {
    setSelectedAchievement(achievementImage);
  };

  const handleCloseAchievement = () => {
    setSelectedAchievement(null);
  };

  const handleOpenProposalForm = () => {
    setIsProposalFormOpen(true);
  };

  const handleCloseProposalForm = () => {
    setIsProposalFormOpen(false);
  };

  const handleSendProposal = async (proposal) => {
    try {
      const proposalData = {
        ...proposal,
        buyerId: auth.currentUser.uid,
        sellerId: userId,
        createdAt: serverTimestamp(),
      };

      // Add proposal to seller's proposals collection
      const sellerProposalsRef = collection(firestore, `users/${userId}/proposals`);
      await addDoc(sellerProposalsRef, proposalData);

      // Add proposal to buyer's proposals collection
      const buyerProposalsRef = collection(firestore, `users/${auth.currentUser.uid}/proposals`);
      await addDoc(buyerProposalsRef, proposalData);

      toast.success("Proposal sent successfully!");
    } catch (error) {
      toast.error(`Error sending proposal: ${error.message}`);
    }
  };

  if (!seller) {
    return null;
  }

  const renderVerificationIcon = () => {
    if (editedData.status === "approved") {
      return <CheckCircleIcon sx={{ color: "green" }} />;
    } else if (editedData.status === "pending") {
      return <WarningIcon sx={{ color: "yellow" }} />;
    }
    return null;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", height: "fit-content", gap: "20px", marginBottom: "20px" }}>
      <Paper elevation={3} sx={{ p: 2, width: "180%", borderRadius: "40px", backgroundColor: "#cacaca", marginBottom: "30px", position: "relative", minHeight: "300px" }}>
        <Box display="flex" alignItems="center">
          <Avatar alt={seller.username} src={seller.profileURL} sx={{ width: 100, height: 100, marginRight: "20px" }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px" }}>{seller.username}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Username:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{seller.username}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Name:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{seller.name}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Status:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{seller.status} {renderVerificationIcon()}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Limit:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{seller.limit}$</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>Wallet Balance:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{seller.walletBalance}$</Typography>
            </Box>
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

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpenProposalForm}>
            Send Proposal
          </Button>
        </Box>
      </Paper>
      <Modal open={Boolean(selectedAchievement)} onClose={handleCloseAchievement}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 400, bgcolor: 'background.paper', borderRadius: 16, p: 2 }}>
          {selectedAchievement && <img src={selectedAchievement} alt="Achievement" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
        </Box>
      </Modal>
      <ProposalForm open={isProposalFormOpen} onClose={handleCloseProposalForm} onSubmit={handleSendProposal} />
      <ToastContainer />
    </Box>
  );
};

export default SellerIDCard;
