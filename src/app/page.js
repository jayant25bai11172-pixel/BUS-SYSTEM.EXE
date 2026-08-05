import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">TransitTrack</h1>
          <p className="text-blue-100 text-lg">School Bus Management System</p>
        </div>

        {/* Navigation Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Student Map Card */}
          <Link href="/map" className="group flex flex-col items-center p-6 bg-gray-50 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Live Map</h2>
            <p className="text-sm text-gray-500 text-center mt-2">Student & Parent Portal</p>
          </Link>

          {/* Conductor Scanner Card */}
          <Link href="/conductor" className="group flex flex-col items-center p-6 bg-gray-50 border-2 border-gray-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">QR Scanner</h2>
            <p className="text-sm text-gray-500 text-center mt-2">Conductor Portal</p>
          </Link>

          {/* Driver GPS Card */}
          <Link href="/driver" className="group flex flex-col items-center p-6 bg-gray-50 border-2 border-gray-100 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
            <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">GPS Tracker</h2>
            <p className="text-sm text-gray-500 text-center mt-2">Bus Driver Portal</p>
          </Link>

        </div>
      </div>
    </main>
  );
}
