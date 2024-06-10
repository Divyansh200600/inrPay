import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom"; // Import Routes
import LoginForm from "./pages/LoginFormPage/loginFormPage";
import BuyerDbPage from "./pages/BuyerDbPage/buyerDbPage";
import SellerDbPage from "./pages/SellerDbPage/sellerDbPage";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");

  const handleLogin = (userType) => {
    setIsLoggedIn(true);
    setUserType(userType);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType("");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to={`/${userType}`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
        <Route path="/buyer" element={isLoggedIn && userType === "buyer" ? <BuyerDbPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/seller" element={isLoggedIn && userType === "seller" ? <SellerDbPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;