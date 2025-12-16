import { useEffect, useState } from "react";
import { getTrailers, deleteTrailer } from "../../services/trailerService";
import { Edit3, Trash2 } from "lucide-react";

export default function TrailerList({ onEdit }) {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getTrailers();
        setTrailers(data);
      } catch {
        setTrailers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this trailer?")) return;
    await deleteTrailer(id);
    setTrailers((prev) => prev.filter((t) => t._id !== id));
  }

  if (loading) return <div className="card">Loading trailers...</div>;

  if (trailers.length === 0)
    return (
      <div className="card text-center">
        <p className="text-slate-600">No trailers found</p>
        <p className="text-sm text-slate-400 mt-1">
          Create a trailer to get started
        </p>
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
            <th className="px-4 py-2 font-medium text-slate-600">Last Maintenance</th>
            <th className="px-4 py-2 font-medium text-slate-600 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {trailers.map((t) => (
            <tr
              key={t._id}
              className="border-t hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-2">{t.licensePlate}</td>
              <td className="px-4 py-2">{t.model || "-"}</td>
              <td className="px-4 py-2">{t.status}</td>
              <td className="px-4 py-2">
                {t.lastMaintenanceDate
                  ? new Date(t.lastMaintenanceDate).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-4 py-2 text-right flex justify-end gap-2">
                <button
                  onClick={() => onEdit?.(t)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Trailer"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Trailer"
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
