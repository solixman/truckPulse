import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import TrucksPage from "./pages/trucksPage";
import TripsPage from "./pages/TripsPage";
import TrailerPage from "./pages/trailerPage";
import TirePage from "./pages/TirePage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trucks"
            element={
              <ProtectedRoute>
                <Layout>
                  <TrucksPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trailers"
            element={
              <ProtectedRoute>
                <Layout>
                  <TrailerPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tires"
            element={
              <ProtectedRoute>
                <Layout>
                  <TirePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Layout>
                  <TripsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
