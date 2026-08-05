"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ConductorPage() {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    
    scanner.render(
      async (decodedText) => {
        scanner.pause();
        setScanResult({ status: "processing", message: `Verifying ID: ${decodedText}...` });
        
        try {
          const res = await fetch("/api/scan-qr", {
            method: "POST",
            body: JSON.stringify({ student_id: decodedText, bus_id: "bus_01" })
          });
          const data = await res.json();
          
          if (res.ok) {
            setScanResult({ status: "success", message: `Boarded! Seats left: ${data.seats_left}` });
          } else {
            setScanResult({ status: "error", message: data.error });
          }
        } catch (err) {
          setScanResult({ status: "error", message: "Network error" });
        }

        setTimeout(() => {
          setScanResult(null);
          scanner.resume();
        }, 3000);
      },
      () => {}
    );

    return () => scanner.clear();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-md mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Scan Student ID</h1>
        <p className="text-gray-500 mb-6 text-center">Align QR code within the frame</p>
        
        {/* Camera Container */}
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div id="reader" className="w-full rounded-xl overflow-hidden"></div>
        </div>
        
        {/* Scan Result Toast */}
        {scanResult && (
          <div className={`mt-6 p-4 rounded-xl shadow-md text-center font-bold text-lg transition-all ${
            scanResult.status === 'success' ? 'bg-green-100 text-green-700 border-green-200' :
            scanResult.status === 'error' ? 'bg-red-100 text-red-700 border-red-200' :
            'bg-blue-100 text-blue-700 border-blue-200'
          }`}>
            {scanResult.message}
          </div>
        )}
      </div>
    </div>
  );
}
