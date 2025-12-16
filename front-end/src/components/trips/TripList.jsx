import React, { useEffect, useState } from "react";
import { getTrips, deleteTrip, downloadPdf } from "../../services/tripService";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../services/notificationService";
import { Edit3, Trash2, FileDown } from "lucide-react";

export default function TripList({ onEdit, refreshFlag }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  async function loadTrips() {
    setLoading(true);
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (e) {
      notify(e?.response?.data?.message || e.message || "Failed to load trips", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
  }, [refreshFlag]);

  async function handleDelete(id) {
    if (!confirm("Delete this trip?")) return;
    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((t) => (t._id ?? t.id) !== id));
      notify("Trip deleted successfully", "success");
    } catch (e) {
      notify(e?.response?.data?.message || "Delete failed", "error");
    }
  }

  async function handleDownloadPdf(id) {
    try {
      const blob = await downloadPdf(id);
      const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      window.open(url, "_blank");
    } catch (e) {
      notify(e?.response?.data?.message || "PDF download failed", "error");
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "bg-gray-200 text-gray-700";
      case "toDo": return "bg-blue-100 text-blue-700";
      case "inProgress": return "bg-yellow-100 text-yellow-700";
      case "done": return "bg-green-100 text-green-700";
      case "canceled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="card">Loading trips...</div>;
  if (!trips || trips.length === 0) return <div className="card">No trips found</div>;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">From</th>
            <th className="px-3 py-2">To</th>
            <th className="px-3 py-2">Start Date</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Truck / Driver / Trailer</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="table-row-hover">
          {trips.map((t) => {
            const id = t._id ?? t.id;
            const truck = t.truck || {};
            const driver = truck.driver;
            const trailer = t.trailer || {};

            return (
              <tr key={id} className="border-t hover:bg-slate-50 transition min-h-[80px]">
                <td className="px-3 py-2 font-mono text-xs">{(id || "").slice(0, 8)}</td>
                <td className="px-3 py-2">{t.startingPoint}</td>
                <td className="px-3 py-2">{t.destination}</td>
                <td className="px-3 py-2">{t.startDate ? new Date(t.startDate).toLocaleDateString() : "-"}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(t.status)}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-2 min-h-[50px]">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">
                        {truck.licensePlate || "No Truck"}
                      </div>
                      {truck.model && <span className="text-xs text-slate-500">{truck.model}</span>}
                    </div>

                    {driver && (
                      <div className="flex items-center gap-2">
                        {driver.avatar ? (
                          <img
                            src={driver.avatar}
                            alt={driver.name || "driver"}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs">
                            {(driver.name || driver.email || "D").slice(0, 1)}
                          </div>
                        )}
                        <div className="text-xs font-medium">{driver.name ?? driver.email}</div>
                      </div>
                    )}

                    {trailer?.licensePlate && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="bg-slate-100 px-2 py-1 rounded">
                          Trailer: {trailer.licensePlate}
                        </span>
                        {trailer.model && <span>({trailer.model})</span>}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center gap-3 justify-end flex-wrap">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit Trip"
                      onClick={() => onEdit?.(t)}
                    >
                      <Edit3 size={18} />
                    </button>

                    {user?.role === "Driver" && (
                      <button
                        className="text-indigo-600 hover:text-indigo-800 transition"
                        title="Download PDF"
                        onClick={() => handleDownloadPdf(id)}
                      >
                        <FileDown size={18} />
                      </button>
                    )}

                    {user?.role === "Admin" && (
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete Trip"
                        onClick={() => handleDelete(id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
