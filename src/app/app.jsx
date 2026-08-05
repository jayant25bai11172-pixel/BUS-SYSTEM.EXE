// src/App.jsx
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { 
  Bus, 
  QrCode, 
  Users, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function CollegeBusApp() {
  const [activeTab, setActiveTab] = useState("student"); // "student" | "driver" | "admin"
  
  // Mock Real-Time State
  const [busData, setBusData] = useState({
    busNumber: "BUS-04",
    routeName: "Route 12 - Main Campus to City Center",
    capacity: 50,
    occupancy: 32,
    driverName: "Ramesh Kumar",
    nextStop: "Square Circle (ETA 4 mins)",
    lat: 23.2599,
    lng: 77.4126
  });

  const [studentList, setStudentList] = useState([
    { id: "STU101", name: "Aarav Sharma", stop: "City Center", status: "on_board", time: "08:15 AM" },
    { id: "STU102", name: "Priya Patel", stop: "Square Circle", status: "yet_to_board", time: "-" },
    { id: "STU103", name: "Rohan Verma", stop: "Square Circle", status: "yet_to_board", time: "-" },
    { id: "STU104", name: "Ananya Roy", stop: "City Center", status: "on_board", time: "08:18 AM" },
    { id: "STU105", name: "Vikram Singh", stop: "Subhash Nagar", status: "yet_to_board", time: "-" },
  ]);

  // QR Refresh Timer logic for Student View
  const [qrToken, setQrToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const generateToken = () => {
      const timestamp = Math.floor(Date.now() / 1000 / 30);
      setQrToken(JSON.stringify({ id: "STU102", name: "Priya Patel", token: timestamp }));
    };

    generateToken();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handler for mock boarding a student in Driver View
  const handleBoardStudent = (studentId) => {
    setStudentList((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, status: "on_board", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : s
      )
    );
    setBusData((prev) => ({ ...prev, occupancy: Math.min(prev.capacity, prev.occupancy + 1) }));
  };

  const availableSeats = busData.capacity - busData.occupancy;
  const occupancyPercent = Math.round((busData.occupancy / busData.capacity) * 100);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12">
      {/* Top Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">UniTransit Live</h1>
              <p className="text-xs text-indigo-200">Campus Bus Management System</p>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex bg-indigo-800/80 p-1 rounded-xl border border-indigo-500/30">
            <button
              onClick={() => setActiveTab("student")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "student" ? "bg-white text-indigo-700 shadow-sm" : "text-indigo-200 hover:text-white"
              }`}
            >
              Student View
            </button>
            <button
              onClick={() => setActiveTab("driver")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "driver" ? "bg-white text-indigo-700 shadow-sm" : "text-indigo-200 hover:text-white"
              }`}
            >
              Driver View
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "admin" ? "bg-white text-indigo-700 shadow-sm" : "text-indigo-200 hover:text-white"
              }`}
            >
              Admin View
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 mt-6">

        {/* ==================== 1. STUDENT VIEW ==================== */}
        {activeTab === "student" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Digital Bus Pass & QR */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Dynamic Bus Pass
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 shadow-inner">
                {qrToken && <QRCode value={qrToken} size={180} />}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Refreshes in: <strong className="text-indigo-600">{timeLeft}s</strong></span>
              </div>

              <div className="w-full text-left pt-4 border-t border-slate-100 text-sm">
                <p className="text-slate-500 text-xs">Student Info</p>
                <p className="font-bold text-slate-800">Priya Patel (STU102)</p>
                <p className="text-xs text-slate-500 mt-1">Designated Stop: <span className="font-semibold text-slate-700">Square Circle</span></p>
              </div>
            </div>

            {/* Live Bus Tracking & Capacity Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Capacity Overview Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{busData.busNumber}</span>
                    <h2 className="text-lg font-bold text-slate-900">{busData.routeName}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    availableSeats > 10 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {availableSeats} Seats Available
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      occupancyPercent > 85 ? "bg-red-500" : occupancyPercent > 60 ? "bg-amber-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Occupancy: {busData.occupancy} / {busData.capacity} students</span>
                  <span>{occupancyPercent}% full</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Next Stop: <strong>{busData.nextStop}</strong></span>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-slate-200 h-64 rounded-2xl border border-slate-300 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://maps.wikimedia.org/osm-intl/12/2300/1600.png')" }}></div>
                <div className="relative z-10 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-white flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold text-slate-800">Live GPS Active: Bus is 1.2 km away</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. DRIVER VIEW ==================== */}
        {activeTab === "driver" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera / QR Boarding Scanner Simulation */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
              <h2 className="text-lg font-bold mb-1">Boarding Camera Scanner</h2>
              <p className="text-xs text-slate-500 mb-4">Point phone camera at student QR code</p>

              <div className="aspect-square max-w-xs mx-auto bg-slate-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-white mb-4">
                <QrCode className="w-20 h-20 text-indigo-400 mb-2 animate-pulse" />
                <span className="text-xs text-slate-400">Scanning active...</span>
                <div className="absolute inset-x-0 h-0.5 bg-indigo-500 shadow-[0_0_15px_#6366f1] top-1/2 animate-bounce"></div>
              </div>

              <p className="text-xs text-slate-500 mb-2">Simulate Quick Boarding:</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleBoardStudent("STU102")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  Board "Priya Patel"
                </button>
                <button
                  onClick={() => handleBoardStudent("STU103")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  Board "Rohan Verma"
                </button>
              </div>
            </div>

            {/* Real-time Counter & Quick Roster */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              <h2 className="text-lg font-bold mb-4">Live Trip Status</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-600 uppercase">On Board</p>
                  <p className="text-3xl font-extrabold text-indigo-900">{busData.occupancy}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-600 uppercase">Seats Left</p>
                  <p className="text-3xl font-extrabold text-emerald-900">{availableSeats}</p>
                </div>
              </div>

              <h3 className="font-bold text-xs uppercase text-slate-400 mb-2 tracking-wider">Recent Boarding Activity</h3>
              <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-56">
                {studentList.filter(s => s.status === "on_board").map((s) => (
                  <div key={s.id} className="py-2.5 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.id} • {s.stop}</p>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. ADMIN VIEW ==================== */}
        {activeTab === "admin" && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><Bus className="w-6 h-6" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Active Fleet</p>
                  <p className="text-2xl font-bold text-slate-900">8 / 10 Buses</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600"><UserCheck className="w-6 h-6" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Total Boarded Today</p>
                  <p className="text-2xl font-bold text-slate-900">342 Students</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl text-amber-600"><Clock className="w-6 h-6" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Pending Boarding</p>
                  <p className="text-2xl font-bold text-slate-900">118 Students</p>
                </div>
              </div>
            </div>

            {/* Student Boarding Roster Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-slate-900">Bus-04 Student Roster</h2>
                  <p className="text-xs text-slate-500">Route 12 Real-time passenger log</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-semibold border border-slate-300 hover:bg-slate-50 rounded-lg">
                  Export Log
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Designated Stop</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Boarding Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentList.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-xs text-slate-600">{student.id}</td>
                        <td className="p-4 font-semibold text-slate-900">{student.name}</td>
                        <td className="p-4 text-slate-600">{student.stop}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            student.status === "on_board" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {student.status === "on_board" ? <UserCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {student.status === "on_board" ? "On Board" : "Yet to Board"}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-xs">{student.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
