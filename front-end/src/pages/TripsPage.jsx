import React, { useState } from "react";
import TripList from "../components/trips/TripList";
import TripForm from "../components/trips/TripForm";
import { useAuth } from "../context/AuthContext";

export default function TripsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [editingTrip, setEditingTrip] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  function handleCreateClick() {
    setEditingTrip(null);
    setShowForm((s) => !s);
  }

  function handleEdit(trip) {
    setEditingTrip(trip);
    setShowForm(true);
  }

  function handleSuccess(savedTrip, isNew) {
    setRefreshFlag((f) => f + 1);
    if (isNew) setShowForm(false);
    else setEditingTrip(savedTrip);
  }

  function handleClose() {
    setShowForm(false);
    setEditingTrip(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trips</h2>
        {isAdmin && (
          <button
            onClick={handleCreateClick}
            className="bg-indigo-600 text-white px-3 py-1 rounded"
          >
            {showForm ? "Close" : "Add Trip"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-4">
          <TripForm trip={editingTrip} onSuccess={handleSuccess} onClose={handleClose} />
        </div>
      )}

      <TripList onEdit={handleEdit} refreshFlag={refreshFlag} />
    </div>
  );
}
