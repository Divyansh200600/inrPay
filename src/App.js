import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/Auth/AuthContext";
import LoginForm from "./pages/LoginFormPage/loginFormPage";
import BuyerDbPage from "./pages/BuyerDbPage/buyerDbPage";
import SellerDbPage from "./pages/SellerDbPage/sellerDbPage";
import AdminPage from "./pages/Admin/adminPage";
import Chat from "./components/chat/chat"; // Import Chat component
import ChatPage from "./components/chat/ChatPage"; // Import ChatPage component
import ProtectedRoute from "./utils/ProtectedRoute/ProtectedRoute";

const AppRoutes = () => {
  const { isLoggedIn, userType } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to={`/${userType}`} /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/buyer/*"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDbPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/*"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <SellerDbPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="/chat" element={<Chat />} /> {/* Route for displaying chat rooms */}
      <Route path="/chat/:roomId" element={<ChatPage />} /> {/* Route for individual chat room */}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
