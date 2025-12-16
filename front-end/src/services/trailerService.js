import api from "../api/axios";

export async function getTrailers(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/trailers${params ? `?${params}` : ""}`);
  return response.data.trailers || response.data;
}

export async function createTrailer(data) {
  const response = await api.post("/trailers", data);
  return response.data.trailer || response.data;
}

export async function updateTrailer(id, data) {
  const response = await api.put(`/trailers/${id}`, data);
  return response.data.trailer || response.data;
}

export async function deleteTrailer(id) {
  const response = await api.delete(`/trailers/${id}`);
  return response.data;
}
