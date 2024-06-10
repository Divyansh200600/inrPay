// src/utils/Auth/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return savedIsLoggedIn ? JSON.parse(savedIsLoggedIn) : false;
  });
  const [userType, setUserType] = useState(() => {
    const savedUserType = localStorage.getItem('userType');
    return savedUserType ? savedUserType : "";
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('userType', userType);
  }, [isLoggedIn, userType]);

  const login = (userType) => {
    setIsLoggedIn(true);
    setUserType(userType);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType("");
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
