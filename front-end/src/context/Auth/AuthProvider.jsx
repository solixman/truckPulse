import React, { createContext, useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u || null);
    return res.data;
  };

  const register = async (credentials) => {
    const res = await api.post("/auth/register", credentials);
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u || null);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
