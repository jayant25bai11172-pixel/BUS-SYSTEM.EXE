"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DriverPage() {
  const [status, setStatus] = useState("Initializing...");
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [isActive, setIsActive] = useState(false);
  const busId = "bus_01"; 

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("GPS not supported on this device.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setStatus("Broadcasting Live");
        setIsActive(true);

        await supabase
          .from("Buses")
          .update({ lat: latitude, lng: longitude })
          .eq("bus_id", busId);
      },
      (error) => {
        setStatus(`GPS Error: ${error.message}`);
        setIsActive(false);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Driver Console</h1>
        <p className="text-gray-500 mb-8">Route: Morning Pickup (Bus 01)</p>
        
        {/* Status Indicator */}
        <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full mb-6 ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="font-semibold">{status}</span>
        </div>

        {/* Coordinate Display */}
        <div className="bg-gray-100 rounded-xl p-4 flex justify-around text-left">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Latitude</p>
            <p className="text-lg font-mono text-gray-700">{coords.lat.toFixed(5)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Longitude</p>
            <p className="text-lg font-mono text-gray-700">{coords.lng.toFixed(5)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
