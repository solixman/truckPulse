import api from "../api/axios";

export async function getDrivers() {
  try {
    const res = await api.get("/users", { params: { role: "Driver" } });
    return res.data.users ?? res.data;
  } catch (err) {
    console.log(err)
    const res = await api.get("/drivers");
    return res.data.drivers ?? res.data;
  }
}
