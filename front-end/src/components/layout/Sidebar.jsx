import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded hover:bg-white hover:shadow ${isActive ? "bg-white shadow" : "text-slate-700"}`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar({ open, onClose }) {
  return (
    <>
      
      <div
        className={`fixed inset-0 z-20 bg-black/30 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside className={`z-30 fixed left-0 top-0 bottom-0 w-64 transform bg-gradient-to-b from-indigo-700 to-indigo-600 text-white md:static md:translate-x-0 transition-transform ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-2xl font-bold tracking-tight">TruckPulse</div>
            <div className="text-xs opacity-90 mt-1">Fleet management</div>
          </div>

          <nav className="mt-4 flex-1 px-2 space-y-1">
            <NavItem to="/">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12l9-7 9 7" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Dashboard</span>
            </NavItem>

            <NavItem to="/trucks">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 7h13v10H3z" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 8h4l1 3v5h-5" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Trucks</span>
            </NavItem>

            <NavItem to="/trips">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M7 7h10v10H7z" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 12h2m16 0h2" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Trips</span>
            </NavItem>

            <NavItem to="/trailers">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 7h13v6H3z" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 8h4l1 3v2h-5" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Trailers</span>
            </NavItem>

            <NavItem to="/tires">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="7" strokeWidth="2" />
                <path d="M12 7v5l3 3" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Tires</span>
            </NavItem>

            <NavItem to="/maintenance">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 8v8" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12h8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
              </svg>
              <span>Maintenance</span>
            </NavItem>
          </nav>

          <div className="px-6 py-4 border-t border-white/10 text-xs opacity-90">
            © {new Date().getFullYear()} TruckPulse • v1.0
          </div>
        </div>
      </aside>
    </>
  );
}