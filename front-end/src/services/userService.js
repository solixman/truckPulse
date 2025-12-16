import api from "../api/axios";

export async function getUsers() {
  const response = await api.get("/users/drivers");
  return response.data.users || response.data;
}
