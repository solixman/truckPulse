import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded hover:bg-white hover:shadow ${
        isActive ? "bg-white shadow" : "text-slate-700"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black/30 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`z-30 fixed left-0 top-0 bottom-0 w-64 transform bg-gradient-to-b from-indigo-700 to-indigo-600 text-white md:static md:translate-x-0 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-2xl font-bold tracking-tight">TruckPulse</div>
            <div className="text-xs opacity-90 mt-1">Fleet management</div>
          </div>

          <nav className="mt-4 flex-1 px-2 space-y-1">
            {/* Dashboard – everyone */}
            <NavItem to="/">
              <span>Dashboard</span>
            </NavItem>

            {/* Admin / Manager */}
            {(role === "Admin" || role === "Manager") && (
              <NavItem to="/trucks">
                <span>Trucks</span>
              </NavItem>
            )}

            {/* Admin / Manager / Driver */}
            {(role === "Admin" || role === "Manager" || role === "Driver") && (
              <NavItem to="/trips">
                <span>Trips</span>
              </NavItem>
            )}

            {/* Admin / Manager */}
            {(role === "Admin" || role === "Manager") && (
              <NavItem to="/trailers">
                <span>Trailers</span>
              </NavItem>
            )}

            {/* Admin / Mechanic */}
            {(role === "Admin" || role === "Mechanic") && (
              <NavItem to="/tires">
                <span>Tires</span>
              </NavItem>
            )}

            {/* Admin / Mechanic */}
            {(role === "Admin" || role === "Mechanic") && (
              <NavItem to="/maintenance">
                <span>Maintenance</span>
              </NavItem>
            )}
          </nav>

          <div className="px-6 py-4 border-t border-white/10 text-xs opacity-90">
            © {new Date().getFullYear()} TruckPulse • v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
