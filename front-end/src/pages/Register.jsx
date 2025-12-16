import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await register({ name, email, password });

      if (!data?.token) navigate("/login");
      else navigate("/");
    } catch (error) {
      setErr(
        error?.response?.data?.error || error?.message || "Register failed"
      );
    }
  }

  return (
    <div>
      <header className="p-4 bg-gray-800 text-white flex justify-between">
        <Link to="/" className="font-bold">
          TruckPulse
        </Link>
        <div className="flex i  tems-center gap-4">
          <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">
            login
          </Link>
        </div>
      </header>
      <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
        <h1 className="text-2xl mb-4">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="w-full bg-indigo-600 text-white py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
