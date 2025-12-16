import { useState, useEffect } from "react";
import { createTrailer, updateTrailer } from "../../services/trailerService";
import { notify } from "../../services/notificationService";

export default function TrailerForm({ trailer, onSuccess, onClose }) {
  const [form, setForm] = useState({
    licensePlate: "",
    model: "",
    status: "available",
    lastMaintenanceDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trailer) {
      setForm({
        licensePlate: trailer.licensePlate || "",
        model: trailer.model || "",
        status: trailer.status || "available",
        lastMaintenanceDate: trailer.lastMaintenanceDate
          ? new Date(trailer.lastMaintenanceDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setForm({
        licensePlate: "",
        model: "",
        status: "available",
        lastMaintenanceDate: "",
      });
    }
  }, [trailer]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      const saved = trailer
        ? await updateTrailer(trailer._id, payload)
        : await createTrailer(payload);

      notify(
        trailer
          ? "Trailer updated successfully"
          : "Trailer created successfully",
        "success"
      );
      onSuccess?.(saved);
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to save trailer", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-3">
        {trailer ? "Edit Trailer" : "Add Trailer"}
      </h3>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label>License Plate *</label>
          <input
            className="w-full border px-2 py-1 rounded"
            value={form.licensePlate}
            onChange={(e) => update("licensePlate", e.target.value)}
            required
          />
        </div>

        <div>
          <label>Model</label>
          <input
            className="w-full border px-2 py-1 rounded"
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            {["available", "inMaintenance", "onTrip", "unavailable"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Last Maintenance Date</label>
          <input
            type="date"
            className="w-full border px-2 py-1 rounded"
            value={form.lastMaintenanceDate}
            onChange={(e) => update("lastMaintenanceDate", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          {loading ? "Saving..." : trailer ? "Update Trailer" : "Create Trailer"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
