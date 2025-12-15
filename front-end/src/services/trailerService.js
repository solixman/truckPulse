import api from "../api/axios";




export async function getTrailers(params) {
  const res = await api.get("/trailers", { params });
  return res.data.trailers ?? res.data;
}


export async function getTrailer(id) {
  const res = await api.get(`/trailers/${id}`);
  return res.data.trailer ?? res.data;
}

export async function createTrailer(data) {
  const res = await api.post("/trailers", data);
  return res.data.trailer ?? res.data;
}


export async function updateTrailer(id, data) {
  const res = await api.put(`/trailers/${id}`, data);
  return res.data.trailer ?? res.data;
}


export async function deleteTrailer(id) {
  const res = await api.delete(`/trailers/${id}`);
  return res.data;
}
