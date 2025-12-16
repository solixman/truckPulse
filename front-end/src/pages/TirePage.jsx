import { useState } from "react";
import TireList from "../components/tires/tireList";
import TireForm from "../components/tires/tireForm";

export default function TirePage() {
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSuccess() {
    setEditing(null);
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tires Management</h2>
        {!editing && (
          <button
            onClick={() => setEditing({})}
            className="bg-indigo-600 text-white px-3 py-1 rounded"
          >
            + Add Tire
          </button>
        )}
      </div>

      {editing && (
        <TireForm
          tire={editing._id ? editing : null}
          onSuccess={handleSuccess}
          onClose={() => setEditing(null)}
        />
      )}

      <TireList key={refreshKey} onEdit={(t) => setEditing(t)} />
    </div>
  );
}
