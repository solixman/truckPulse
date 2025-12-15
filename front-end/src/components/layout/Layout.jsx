import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const titles = {
    "/": "Dashboard",
    "/trucks": "Trucks",
    "/trips": "Trips",
    "/trailers": "Trailers",
    "/tires": "Tires",
    "/maintenance": "Maintenance",
  };
  const title = titles[location.pathname] || "TruckPulse";

  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b">
          <div className="app-container flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 rounded hover:bg-slate-100"
                onClick={() => setOpen((s) => !s)}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600 hidden sm:block">{user?.name || user?.email}</div>
              <button className="text-sm text-red-600" onClick={logout}>Logout</button>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6">
          <div className="app-container">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}