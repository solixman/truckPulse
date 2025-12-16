import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/Auth/AuthProvider";
import "./styles/index.css"; 
import { NotificationProvider } from "./context/Notification/NotificationProvider";

createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
        <App />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  
);