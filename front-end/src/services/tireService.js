import api from "../api/axios"

export async function getTires(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/tires${params ? `?${params}` : ""}`);
  return response.data.tires || response.data;
}

export async function createTire(data) {
  const response = await api.post("/tires", data);
  return response.data.tire || response.data;
}

export async function updateTire(id, data) {
  const response = await api.put(`/tires/${id}`, data);
  return response.data.tire || response.data;
}

export async function deleteTire(id) {
  const response = await api.delete(`/tires/${id}`);
  return response.data;
}
