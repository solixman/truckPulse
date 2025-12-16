import { useEffect, useState } from "react";
import { getTires, deleteTire } from "../../services/tireService";
import { Edit3, Trash2 } from "lucide-react";

export default function TireList({ onEdit }) {
  const [tires, setTires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getTires();
        setTires(data);
      } catch {
        setTires([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this tire?")) return;
    await deleteTire(id);
    setTires((prev) => prev.filter((t) => t._id !== id));
  }

  if (loading) return <div className="card">Loading tires...</div>;
  if (tires.length === 0)
    return (
      <div className="card text-center">
        <p className="text-slate-600">No tires found</p>
        <p className="text-sm text-slate-400 mt-1">
          Create a tire to get started
        </p>
      </div>
    );

  return (
    <div className="card overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="px-4 py-2 font-medium text-slate-600">Brand</th>
            <th className="px-4 py-2 font-medium text-slate-600">Size</th>
            <th className="px-4 py-2 font-medium text-slate-600">Status</th>
            <th className="px-4 py-2 font-medium text-slate-600">Wear Level</th>
            <th className="px-4 py-2 font-medium text-slate-600 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tires.map((t) => (
            <tr
              key={t._id}
              className="border-t hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-2">{t.brand}</td>
              <td className="px-4 py-2">{t.size}</td>
              <td className="px-4 py-2">{t.status}</td>
              <td className="px-4 py-2">{t.wearLevel}%</td>
              <td className="px-4 py-2 text-right flex justify-end gap-2">
                <button
                  onClick={() => onEdit?.(t)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Tire"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Tire"
                >
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
