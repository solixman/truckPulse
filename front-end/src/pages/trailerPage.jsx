import { useState } from "react";
import TrailerList from "../components/traiers/trailerList";
import TrailerForm from "../components/traiers/trailerForm";


export default function TrailerPage() {
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSuccess() {
    setEditing(null);
    setRefreshKey((k) => k + 1); 
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Trailers Management</h2>
        {!editing && (
          <button
            onClick={() => setEditing({})}
            className="bg-indigo-600 text-white px-3 py-1 rounded"
          >
            + Add Trailer
          </button>
        )}
      </div>

      {editing && (
        <TrailerForm
          trailer={editing._id ? editing : null}
          onSuccess={handleSuccess}
          onClose={() => setEditing(null)}
        />
      )}

      <TrailerList key={refreshKey} onEdit={(t) => setEditing(t)} />
    </div>
  );
}
