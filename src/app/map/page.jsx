"use client";
import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import { supabase } from "../../lib/supabase";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapPage() {
  const [busLocation, setBusLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [seats, setSeats] = useState("--");
  const busId = "bus_01";

  useEffect(() => {
    const fetchBus = async () => {
      const { data } = await supabase.from("Buses").select("*").eq("bus_id", busId).single();
      if (data) {
        setBusLocation({ lat: data.lat, lng: data.lng });
        setSeats(data.seats_available);
      }
    };
    fetchBus();

    const channel = supabase
      .channel("live-bus")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Buses", filter: `bus_id=eq.${busId}` },
        (payload) => {
          setBusLocation({ lat: payload.new.lat, lng: payload.new.lng });
          setSeats(payload.new.seats_available);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-gray-200">
      
      {/* Floating Status Card */}
      <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20 min-w-[200px]">
        <h2 className="text-sm uppercase tracking-wider font-bold text-gray-500 mb-1">Route 01</h2>
        <div className="text-2xl font-extrabold text-gray-800 mb-3">Morning Pickup</div>
        
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100">
          <span className="font-semibold text-blue-800">Seats Left</span>
          <span className="text-2xl font-bold text-blue-600">{seats}</span>
        </div>
      </div>

      {/* Fullscreen Map */}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude: busLocation.lng, latitude: busLocation.lat, zoom: 14 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Marker longitude={busLocation.lng} latitude={busLocation.lat} color="#3b82f6" />
      </Map>
      
    </div>
  );
}
