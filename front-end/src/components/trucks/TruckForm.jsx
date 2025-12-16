import { useState, useEffect } from "react";
import { createTruck, updateTruck } from "../../services/truckService";
import { getUsers } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../services/notificationService";

export default function TruckForm({ truck, onSuccess, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [form, setForm] = useState({
    licensePlate: "",
    model: "",
    mileage: "",
    status: "available",
    currentFuel: "",
    driver: "",
  });
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    async function loadDrivers() {
      if (!isAdmin) return;
      try {
        const data = await getUsers();
        setDrivers(data);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    }
    loadDrivers();
  }, [isAdmin]);

  useEffect(() => {
    if (truck) {
      setForm({
        licensePlate: truck.licensePlate || "",
        model: truck.model || "",
        mileage: truck.mileage || "",
        status: truck.status || "available",
        currentFuel: truck.currentFuel || "",
        driver: truck.driver?._id || truck.driver || "",
      });
    } else {
      setForm({
        licensePlate: "",
        model: "",
        mileage: "",
        status: "available",
        currentFuel: "",
        driver: "",
      });
    }
  }, [truck]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        licensePlate: form.licensePlate,
        model: form.model,
        mileage: form.mileage,
        status: form.status,
        currentFuel: form.currentFuel,
        driver: form.driver || null,
      };
      const saved = truck
        ? await updateTruck(truck._id, payload)
        : await createTruck(payload);

      notify(truck ? "Truck updated successfully" : "Truck created successfully", "success");
      onSuccess?.(saved);
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to save truck", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-3">{truck ? "Edit Truck" : "Add Truck"}</h3>

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
          <label>Mileage</label>
          <input
            type="number"
            className="w-full border px-2 py-1 rounded"
            value={form.mileage}
            onChange={(e) => update("mileage", e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            {["available", "OnTrip", "inMaintenance", "unavailable"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Current Fuel (L)</label>
          <input
            type="number"
            className="w-full border px-2 py-1 rounded"
            value={form.currentFuel}
            onChange={(e) => update("currentFuel", e.target.value)}
          />
        </div>

        {isAdmin && (
          <div>
            <label>Driver</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={form.driver}
              onChange={(e) => update("driver", e.target.value)}
            >
              <option value="">-- No driver assigned --</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.username || d.name || d.email}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          {loading ? "Saving..." : truck ? "Update Truck" : "Create Truck"}
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
