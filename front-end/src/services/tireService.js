import api from "../api/axios";

export async function getTires(params) {
  const res = await api.get("/tires", { params });
  return res.data.tires ?? res.data;
}
