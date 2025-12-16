import React, { createContext, useState, useEffect } from "react";
import { subscribeNotification } from "../../services/notificationService";


const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeNotification((n) => {
      setList((l) => [...l, n]);
      setTimeout(() => setList((l) => l.filter((x) => x.id !== n.id)), 7000);
    });
    return unsubscribe;
  }, []);

  function remove(id) {
    setList((l) => l.filter((x) => x.id !== id));
  }

  return (
    <NotificationContext.Provider value={{ list, remove }}>
      {children}
      <div className="fixed right-4 top-4 space-y-2 z-50">
        {list.map((n) => (
          <div
            key={n.id}
            className={`max-w-sm w-full px-4 py-2 rounded shadow ${
              n.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>{n.message}</div>
              <button onClick={() => remove(n.id)} className="ml-4 text-sm opacity-80">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
