import { useEffect, useState } from "react";
import { getTrucks, deleteTruck } from "../../services/truckService";
import { Edit3, Trash2 } from "lucide-react";

export default function TruckList({ onEdit }) {
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
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this truck?")) return;
    await deleteTruck(id);
    setTrucks((prev) => prev.filter((t) => t._id !== id));
  }

  if (loading) return <div className="card">Loading trucks...</div>;
  if (trucks.length === 0)
    return (
      <div className="card text-center">
        <p className="text-slate-600">No trucks found</p>
        <p className="text-sm text-slate-400 mt-1">Create a truck to get started</p>
      </div>
    );

  return (
    <div className="card overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="px-4 py-2 font-medium text-slate-600">Plate</th>
            <th className="px-4 py-2 font-medium text-slate-600">Model</th>
            <th className="px-4 py-2 font-medium text-slate-600">Status</th>
            <th className="px-4 py-2 font-medium text-slate-600">Driver</th>
            <th className="px-4 py-2 font-medium text-slate-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trucks.map((t) => (
            <tr key={t._id} className="border-t hover:bg-slate-50 transition-colors">
              <td className="px-4 py-2">{t.licensePlate}</td>
              <td className="px-4 py-2">{t.model || "-"}</td>
              <td className="px-4 py-2">{t.status}</td>
              <td className="px-4 py-2">{t.driver ? t.driver.username || t.driver.name || t.driver.email : "—"}</td>
              <td className="px-4 py-2 text-right flex justify-end gap-2">
                <button onClick={() => onEdit?.(t)} className="text-blue-600 hover:text-blue-800" title="Edit Truck">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(t._id)} className="text-red-600 hover:text-red-800" title="Delete Truck">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
