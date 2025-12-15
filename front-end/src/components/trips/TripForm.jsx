import React, { useEffect, useState } from "react";
import { createTrip, updateTrip, assignTruck, assignTrailer, getTrip } from "../../services/tripService";
import { getTrucks, updateTruck } from "../../services/truckService";
import { getTrailers, updateTrailer } from "../../services/trailerService";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../services/notificationService";

export default function TripForm({ trip, onSuccess, onClose }) {
  const { user } = useAuth();
  const isDriver = user?.role === "Driver";

  const [form, setForm] = useState({
    startingPoint: "",
    destination: "",
    startDate: "",
    startMileage: "",
    notes: "",
    truck: "",
    trailer: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [detaching, setDetaching] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    async function loadOptions() {
      const [tks, trs] = await Promise.all([getTrucks({ status: "available" }).catch(() => []), getTrailers({ status: "available" }).catch(() => [])]);
      let trucksList = tks || [];
      let trailersList = trs || [];
      if (trip?.truck && !trucksList.find((t) => (t._id ?? t.id) === (trip.truck._id ?? trip.truck))) trucksList = [trip.truck, ...trucksList];
      if (trip?.trailer && !trailersList.find((tr) => (tr._id ?? tr.id) === (trip.trailer._id ?? trip.trailer))) trailersList = [trip.trailer, ...trailersList];
      setTrucks(trucksList);
      setTrailers(trailersList);
    }
    loadOptions();
  }, [trip]);

  useEffect(() => {
    if (trip) {
      setForm({
        startingPoint: trip.startingPoint || "",
        destination: trip.destination || "",
        startDate: trip.startDate ? new Date(trip.startDate).toISOString().slice(0, 10) : "",
        startMileage: trip.startMileage ?? "",
        notes: trip.notes || "",
        truck: trip.truck ? (trip.truck._id ?? trip.truck) : "",
        trailer: trip.trailer ? (trip.trailer._id ?? trip.trailer) : "",
        status: trip.status || "draft",
      });
    } else setForm({ startingPoint: "", destination: "", startDate: "", startMileage: "", notes: "", truck: "", trailer: "", status: "draft" });
  }, [trip]);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }
  function disabledStyle() { return "bg-slate-50 cursor-not-allowed"; }

  async function handleDetachTruck() {
    if (!form.truck || !confirm("Detach this truck?")) return;
    setDetaching(true);
    await updateTrip(trip._id ?? trip.id, { truck: null });
    await updateTruck(form.truck, { status: "available" });
    setForm((f) => ({ ...f, truck: "" }));
    const updatedTrip = await getTrip(trip._id ?? trip.id);
    onSuccess?.(updatedTrip, false);
    setDetaching(false);
  }

  async function handleDetachTrailer() {
    if (!form.trailer || !confirm("Detach this trailer?")) return;
    setDetaching(true);
    await updateTrip(trip._id ?? trip.id, { trailer: null });
    await updateTrailer(form.trailer, { status: "available" });
    setForm((f) => ({ ...f, trailer: "" }));
    const updatedTrip = await getTrip(trip._id ?? trip.id);
    onSuccess?.(updatedTrip, false);
    setDetaching(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        startingPoint: form.startingPoint,
        destination: form.destination,
        startDate: form.startDate,
        startMileage: form.startMileage || undefined,
        notes: form.notes,
        status: form.status,
      };
      let savedTrip;
      if (trip) {
        savedTrip = await updateTrip(trip._id ?? trip.id, payload);
        if (form.truck && form.truck !== (trip.truck?._id ?? trip.truck)) await assignTruck(trip._id ?? trip.id, form.truck);
        if (form.trailer && form.trailer !== (trip.trailer?._id ?? trip.trailer)) await assignTrailer(trip._id ?? trip.id, form.trailer);
        onSuccess?.(savedTrip, false);
      } else {
        savedTrip = await createTrip(payload);
        const id = savedTrip._id ?? savedTrip.id;
        if (form.truck) await assignTruck(id, form.truck);
        if (form.trailer) await assignTrailer(id, form.trailer);
        onSuccess?.(savedTrip, true);
      }
    } catch (e) {
      notify(e?.response?.data?.message || "Save failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label>Starting Point *</label>
          <input className={`w-full border px-2 py-1 rounded ${isDriver ? disabledStyle() : ""}`} value={form.startingPoint} onChange={(e) => update("startingPoint", e.target.value)} disabled={isDriver} />
        </div>
        <div>
          <label>Destination *</label>
          <input className={`w-full border px-2 py-1 rounded ${isDriver ? disabledStyle() : ""}`} value={form.destination} onChange={(e) => update("destination", e.target.value)} disabled={isDriver} />
        </div>
        <div>
          <label>Start Date *</label>
          <input type="date" className={`w-full border px-2 py-1 rounded ${isDriver ? disabledStyle() : ""}`} value={form.startDate} onChange={(e) => update("startDate", e.target.value)} disabled={isDriver} />
        </div>
        <div>
          <label>Start Mileage</label>
          <input type="number" className="w-full border px-2 py-1 rounded" value={form.startMileage} onChange={(e) => update("startMileage", e.target.value)} />
        </div>
        <div>
          <label>Truck</label>
          <div className="flex gap-2">
            <select className="w-full border px-2 py-1 rounded" value={form.truck} onChange={(e) => update("truck", e.target.value)} disabled={isDriver}>
              <option value="">-- No truck --</option>
              {trucks.map((t) => <option key={t._id ?? t.id} value={t._id ?? t.id}>{t.licensePlate}</option>)}
            </select>
            {form.truck && <button type="button" onClick={handleDetachTruck} disabled={detaching} className="bg-orange-600 text-white px-2 rounded">{detaching ? "..." : "Detach"}</button>}
          </div>
        </div>
        <div>
          <label>Trailer</label>
          <div className="flex gap-2">
            <select className="w-full border px-2 py-1 rounded" value={form.trailer} onChange={(e) => update("trailer", e.target.value)} disabled={isDriver}>
              <option value="">-- No trailer --</option>
              {trailers.map((tr) => <option key={tr._id ?? tr.id} value={tr._id ?? tr.id}>{tr.licensePlate}</option>)}
            </select>
            {form.trailer && <button type="button" onClick={handleDetachTrailer} disabled={detaching} className="bg-orange-600 text-white px-2 rounded">{detaching ? "..." : "Detach"}</button>}
          </div>
        </div>
        {trip && <div>
          <label>Status</label>
          <select className="w-full border px-2 py-1 rounded" value={form.status} onChange={(e) => update("status", e.target.value)}>
            {["draft","toDo","inProgress","done","canceled"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>}
        <div className="col-span-2">
          <label>Notes</label>
          <textarea className="w-full border px-2 py-1 rounded" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-3 py-1 rounded">{loading ? "Saving..." : trip ? "Update Trip" : "Create Trip"}</button>
        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-3 py-1 rounded">Close</button>
      </div>
    </form>
  );
}
