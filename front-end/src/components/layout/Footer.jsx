import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="app-container py-4 text-sm text-slate-500">
        Built with care — TruckPulse © {new Date().getFullYear()}
      </div>
    </footer>
  );
}