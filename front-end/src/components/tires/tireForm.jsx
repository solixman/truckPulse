import { useState, useEffect } from "react";
import { createTire, updateTire } from "../../services/tireService";
import { notify } from "../../services/notificationService";

export default function TireForm({ tire, onSuccess, onClose }) {
  const [form, setForm] = useState({
    brand: "",
    size: "",
    status: "inStorage",
    wearLevel: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tire) {
      setForm({
        brand: tire.brand || "",
        size: tire.size || "",
        status: tire.status || "inStorage",
        wearLevel: tire.wearLevel || 0,
      });
    } else {
      setForm({ brand: "", size: "", status: "inStorage", wearLevel: 0 });
    }
  }, [tire]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      const saved = tire
        ? await updateTire(tire._id, payload)
        : await createTire(payload);

      notify(
        tire ? "Tire updated successfully" : "Tire created successfully",
        "success"
      );
      onSuccess?.(saved);
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to save tire", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-3">{tire ? "Edit Tire" : "Add Tire"}</h3>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label>Brand *</label>
          <input
            className="w-full border px-2 py-1 rounded"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            required
          />
        </div>

        <div>
          <label>Size *</label>
          <input
            className="w-full border px-2 py-1 rounded"
            value={form.size}
            onChange={(e) => update("size", e.target.value)}
            required
          />
        </div>

        <div>
          <label>Status</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            {["mounted", "inStorage", "needToBeReplaced", "replaced"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Wear Level (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-full border px-2 py-1 rounded"
            value={form.wearLevel}
            onChange={(e) => update("wearLevel", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          {loading ? "Saving..." : tire ? "Update Tire" : "Create Tire"}
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
