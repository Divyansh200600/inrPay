import React from "react";
import { useAuth } from "../../utils/Auth/AuthContext";
import Button from "@mui/material/Button";

const AdminDb = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>Here admin verify the sellers verification</h1>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default AdminDb;
