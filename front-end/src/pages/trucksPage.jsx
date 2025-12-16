import { useState } from "react";
import TruckList from "../components/trucks/TruckList";
import TruckForm from "../components/trucks/TruckForm";
import { useAuth } from "../context/Auth/useAuth";
import { PlusCircle } from "lucide-react";

export default function TrucksPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  if (user?.role !== "Admin") {
    return (
      <div className="card">
        <p>You are not authorized to view trucks.</p>
      </div>
    );
  }

  function handleAddClick() {
    setEditingTruck(null);
    setShowForm((s) => !s);
  }

  function handleEdit(truck) {
    setEditingTruck(truck);
    setShowForm(true);
  }

  function handleSuccess() {
    setRefreshFlag((f) => f + 1);
    setShowForm(false);
    setEditingTruck(null);
  }

  function handleClose() {
    setShowForm(false);
    setEditingTruck(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trucks</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded"
        >
          <PlusCircle size={18} />
          <span>{showForm ? "Close" : "Add Truck"}</span>
        </button>
      </div>

      {showForm && (
        <TruckForm
          truck={editingTruck}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      )}

      <TruckList key={refreshFlag} onEdit={handleEdit} />
    </div>
  );
}
