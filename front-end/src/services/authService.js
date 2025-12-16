import api from "../api/axios";

export async function login(email, password) {
    try {
        const res = await api.post("/auth/login", { email, password });
        return res.data; 
        
    } catch (error) {
        console.log(error)
    }
}

export async function register(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data; 
}

export async function logout() {
  const res = await api.get("/auth/logout");
  return res.data;
}
