import api from "../api/axios";




export async function getTrucks(params) {
  const res = await api.get("/trucks", { params });
  return res.data.trucks ?? res.data;
}

export async function getTruck(id) {
  const res = await api.get(`/trucks/${id}`);
  return res.data.truck ?? res.data;
}


export async function createTruck(data) {
  const res = await api.post("/trucks", data);
  return res.data.truck ?? res.data;
}

export async function updateTruck(id, data) {
  const res = await api.put(`/trucks/${id}`, data);
  return res.data.truck ?? res.data;
}


export async function deleteTruck(id) {
  const res = await api.delete(`/trucks/${id}`);
  return res.data;
}
