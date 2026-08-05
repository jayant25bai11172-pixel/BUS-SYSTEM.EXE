// src/app/driver/page.jsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverPage() {
  const [status, setStatus] = useState("Waiting for GPS...");
  const busId = "bus_01"; // Hardcoded for this example

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
      return;
    }

    // watchPosition continuously tracks the phone's movement
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus(`Tracking Active: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        // Send new coordinates to Supabase
        await supabase
          .from("Buses")
          .update({ lat: latitude, lng: longitude })
          .eq("bus_id", busId);
      },
      (error) => setStatus(`Error: ${error.message}`),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    // Cleanup when the driver closes the app
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Driver GPS Tracker</h1>
      <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow">
        {status}
      </div>
    </div>
  );
}
