import api from "../api/axios";

export async function getTrucks(filters = {}, skip = 0) {
  const res = await api.get("/trucks", {
    params: { ...filters, skip },
  });
  return res.data.trucks || [];
}

export async function getTruck(id) {
  const res = await api.get(`/trucks/${id}`);
  return res.data;
}

export async function createTruck(data) {
  const res = await api.post("/trucks", data);
  return res.data.truck;
}

export async function updateTruck(id, data) {
  const res = await api.put(`/trucks/${id}`, data);
  return res.data.truck;
}

export async function deleteTruck(id) {
  const res = await api.delete(`/trucks/${id}`);
  return res.data.truck;
}
