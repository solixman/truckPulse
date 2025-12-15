import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between">
      <Link to="/" className="font-bold">TruckPulse</Link>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span>{user?.email || 'User'}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <Link to="/register" className="bg-blue-500 px-3 py-1 rounded">register</Link>
        )}
      </div>
    </header>
  );
}