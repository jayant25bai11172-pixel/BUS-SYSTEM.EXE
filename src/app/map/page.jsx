// src/app/map/page.jsx
"use client";
import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import { supabase } from "../../lib/supabase";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapPage() {
  const [busLocation, setBusLocation] = useState({ lat: 0, lng: 0 });
  const [seats, setSeats] = useState(40);
  const busId = "bus_01";

  useEffect(() => {
    // 1. Fetch initial bus location on load
    const fetchBus = async () => {
      const { data } = await supabase.from("Buses").select("*").eq("bus_id", busId).single();
      if (data) {
        setBusLocation({ lat: data.lat, lng: data.lng });
        setSeats(data.seats_available);
      }
    };
    fetchBus();

    // 2. Subscribe to Real-Time updates
    const channel = supabase
      .channel("live-bus")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Buses", filter: `bus_id=eq.${busId}` },
        (payload) => {
          // This fires instantly whenever the driver app updates the database
          setBusLocation({ lat: payload.new.lat, lng: payload.new.lng });
          setSeats(payload.new.seats_available);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="relative w-screen h-screen">
      {/* Floating Info UI overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">Route 1</h2>
        <p className="text-gray-600">Seats Left: {seats}</p>
      </div>

      {/* Map component (Requires a Mapbox API token) */}
      <Map
        mapboxAccessToken="YOUR_MAPBOX_TOKEN"
        initialViewState={{ longitude: 77.2090, latitude: 28.6139, zoom: 14 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {busLocation.lat !== 0 && (
          <Marker longitude={busLocation.lng} latitude={busLocation.lat} color="red" />
        )}
      </Map>
    </div>
  );
}
