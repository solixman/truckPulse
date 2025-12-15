import React, { useState } from "react";
import TripList from "../components/trips/TripList";
import TripForm from "../components/trips/TripForm";

export default function TripsPage() {
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
    // Increment refreshFlag to notify TripList to update
    setRefreshFlag((f) => f + 1);

    if (isNew) setShowForm(false); // close form after create
    else setEditingTrip(savedTrip); // keep form open for update
  }

  function handleClose() {
    setShowForm(false);
    setEditingTrip(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trips</h2>
        <button
          onClick={handleCreateClick}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          {showForm ? "Close" : "Add Trip"}
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
          <TripForm
            trip={editingTrip}
            onSuccess={handleSuccess}
            onClose={handleClose}
          />
        </div>
      )}

      <TripList onEdit={handleEdit} refreshFlag={refreshFlag} />
    </div>
  );
}
