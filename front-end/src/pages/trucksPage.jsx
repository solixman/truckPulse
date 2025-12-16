import { useState } from "react";
import TruckList from "../components/trucks/TruckTable";
import { useAuth } from "../context/AuthContext";

export default function TrucksPage() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);

  if (user?.role !== "Admin") {
    return (
      <div className="card">
        <p>You are not authorized to view trucks.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trucks</h2>
      </div>

      <TruckList refresh={refresh} />
    </div>
  );
}
