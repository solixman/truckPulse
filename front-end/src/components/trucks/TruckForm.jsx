import { useState } from "react";
import { createTruck, updateTruck } from "../../services/truckService";

export default function TruckForm({ truck, onSuccess }) {
  const [licensePlate, setLicensePlate] = useState(truck?.licensePlate || "");
  const [model, setModel] = useState(truck?.model || "");
  const [status, setStatus] = useState(truck?.status || "available");
  const [currentFuel, setCurrentFuel] = useState(truck?.currentFuel || 0);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      const payload = { licensePlate, model, status, currentFuel };
      if (truck) {
        await updateTruck(truck._id, payload);
      } else {
        await createTruck(payload);
      }
      onSuccess();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <input
        className="w-full border px-2 py-1"
        placeholder="License Plate"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
      />
      <input
        className="w-full border px-2 py-1"
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <select
        className="w-full border px-2 py-1"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="available">available</option>
        <option value="unavailable">unavailable</option>
        <option value="inMaintenance">inMaintenance</option>
      </select>
      <input
        type="number"
        className="w-full border px-2 py-1"
        placeholder="Current Fuel"
        value={currentFuel}
        onChange={(e) => setCurrentFuel(e.target.value)}
      />
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button className="bg-indigo-600 text-white px-3 py-1 rounded">
        {truck ? "Update" : "Create"}
      </button>
    </form>
  );
}
