import { useEffect, useState } from "react";
import { getTrucks, deleteTruck } from "../../services/truckService";
import { useAuth } from "../../context/AuthContext";

export default function TruckList({ refresh }) {
  const { user } = useAuth();
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getTrucks();
        setTrucks(data);
      } catch {
        setTrucks([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [refresh]);

  async function handleDelete(id) {
    if (!confirm("Delete this truck?")) return;
    await deleteTruck(id);
    setTrucks((prev) => prev.filter((t) => t._id !== id));
  }

  if (loading) {
    return <div className="card">Loading trucks...</div>;
  }

  if (trucks.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-slate-600">No trucks found</p>
        <p className="text-sm text-slate-400 mt-1">
          Create a truck to get started
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2">Plate</th>
            <th className="px-3 py-2">Model</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {trucks.map((t) => (
            <tr key={t._id} className="border-t">
              <td className="px-3 py-2">{t.licensePlate}</td>
              <td className="px-3 py-2">{t.model || "-"}</td>
              <td className="px-3 py-2">{t.status}</td>
              <td className="px-3 py-2 text-right">
                {user?.role === "Admin" && (
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
