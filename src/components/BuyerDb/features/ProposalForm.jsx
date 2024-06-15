import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography, InputAdornment } from "@mui/material";
import { toast } from 'react-toastify';

const ProposalForm = ({ open, onClose, onSubmit }) => {
  const [amountCurrency, setAmountCurrency] = useState("");
  const [walletName, setWalletName] = useState("");

  const handleSubmit = () => {
    if (amountCurrency && walletName) {
      onSubmit({ amountCurrency, walletName });
      onClose();
    } else {
      toast.error("Please fill out all fields");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 4, bgcolor: 'background.paper', borderRadius: 2, width: '300px', margin: 'auto', marginTop: '10%' }}>
        <Typography variant="h6">Send Proposal</Typography>
        <TextField
          label="Enter amount and currency"
          value={amountCurrency}
          onChange={(e) => setAmountCurrency(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          label="Enter wallet name"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>Send Proposal</Button>
      </Box>
    </Modal>
  );
};

export default ProposalForm;
