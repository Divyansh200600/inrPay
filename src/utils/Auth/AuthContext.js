import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../FireBaseConfig/fireBaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return savedIsLoggedIn ? JSON.parse(savedIsLoggedIn) : false;
  });
  const [userType, setUserType] = useState(() => {
    const savedUserType = localStorage.getItem('userType');
    return savedUserType ? savedUserType : "";
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const login = (userType) => {
    setIsLoggedIn(true);
    setUserType(userType);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType("");
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    auth.signOut(); // Add this line to sign out the user from Firebase authentication
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
