import React from "react";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl">Dashboard</h1>
      <p className="mt-4">
        Welcome! Now that you have a token, authenticated requests (e.g., to
        maintenance, trucks, trips APIs) will work.
      </p>
    </div>
  );
}