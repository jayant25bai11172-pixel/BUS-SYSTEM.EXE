// src/app/conductor/page.jsx
"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ConductorPage() {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    // Initialize the camera scanner
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    
    scanner.render(
      async (decodedText) => {
        // Stop scanning to prevent multiple triggers
        scanner.pause();
        setScanResult(`Scanned Student ID: ${decodedText}`);
        
        // Call your backend to deduct a seat
        await fetch("/api/scan-qr", {
          method: "POST",
          body: JSON.stringify({ student_id: decodedText, bus_id: "bus_01" })
        });
        
        // Resume scanning after 3 seconds
        setTimeout(() => {
          setScanResult(null);
          scanner.resume();
        }, 3000);
      },
      (errorMessage) => { /* Ignore background scan errors */ }
    );

    return () => scanner.clear(); // Cleanup camera on unmount
  }, []);

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Boarding Scanner</h1>
      
      {/* The div where the camera video feed will appear */}
      <div id="reader" className="w-full max-w-md overflow-hidden rounded-lg shadow"></div>
      
      {scanResult && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded shadow w-full max-w-md text-center font-bold">
          {scanResult}
        </div>
      )}
    </div>
  );
}
