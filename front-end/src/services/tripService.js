import api from "../api/axios";

export function getTrips(params) {
  return api.get("/trips", { params }).then((r) => r.data.trips ?? []);
}

export function getTrip(id) {
  return api.get(`/trips/${id}`).then((r) => r.data);
}

export function createTrip(payload) {
  return api.post("/trips", payload).then((r) => r.data.trip ?? r.data);
}

export function updateTrip(id, payload, includeUser = null) {
  const body = includeUser ? { ...payload, user: includeUser } : payload;
  return api.put(`/trips/${id}`, body).then((r) => r.data.trip ?? r.data);
}

export function deleteTrip(id) {
  return api.delete(`/trips/${id}`).then((r) => r.data);
}

export function downloadPdf(id) {
  return api
    .get(`/trips/${id}/pdf`, { responseType: "blob" })
    .then((r) => r.data);
}

export function assignTruck(tripId, truckId) {
  return api
    .post(`/trips/${tripId}/assign-truck`, { truckId })
    .then((r) => r.data);
}
export function assignTrailer(tripId, trailerId) {
  return api
    .post(`/trips/${tripId}/assign-trailer`, { trailerId })
    .then((r) => r.data);
}
