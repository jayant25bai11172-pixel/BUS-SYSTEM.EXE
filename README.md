# 🚌 Real-Time School Bus Tracking System

A full-stack Next.js application designed to track school buses in real-time and manage student boarding using QR codes. Optimized for deployment on Vercel.

## 🌟 Features

*   **Driver GPS Tracker (`/driver`)**: Uses native browser geolocation to continuously stream the bus's live coordinates to the backend.
*   **Conductor QR Scanner (`/conductor`)**: Leverages the conductor's mobile device camera to scan student QR codes, validating boarding and automatically decrementing available seat counts.
*   **Student Live Map (`/map`)**: A real-time dashboard displaying the moving bus on a map and live seat availability, powered by WebSockets so students don't have to refresh the page.

## 🏗️ Tech Stack

*   **Frontend & API**: [Next.js](https://nextjs.org/) (React, App Router)
*   **Database & Real-Time**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime WebSockets)
*   **Maps**: [Mapbox](https://www.mapbox.com/) via `react-map-gl`
*   **QR Scanning**: `html5-qrcode`
*   **Styling**: Tailwind CSS
*   **Hosting**: [Vercel](https://vercel.com/)

## 📂 Project Structure

```text
src/
├── lib/
│   └── supabase.js              # Supabase client initialization
└── app/
    ├── api/
    │   └── scan-qr/
    │       └── route.js         # Backend API for processing QR scans and seat logic
    ├── driver/
    │   └── page.jsx             # GPS broadcasting interface
    ├── conductor/
    │   └── page.jsx             # QR camera scanner interface
    ├── map/
    │   └── page.jsx             # Student map and seat dashboard
    ├── layout.jsx               # Global Next.js layout
    └── page.jsx                 # Application landing page
```

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/school-bus-tracker.git
cd school-bus-tracker
```

### 2. Install dependencies
```bash
npm install @supabase/supabase-js react-map-gl mapbox-gl html5-qrcode
```

### 3. Configure the Database
1. Create a new project on [Supabase](https://supabase.com/).
2. Create a `Buses` table with the following columns: `bus_id` (text), `lat` (float), `lng` (float), `total_seats` (int), `seats_available` (int).
3. Create a `Students` table with the following columns: `student_id` (text), `name` (text), `assigned_bus` (text).
4. **Crucial:** Enable **Realtime** on the `Buses` table in your Supabase database settings to allow the map to listen for WebSocket changes.

### 4. Set Environment Variables
Create a `.env.local` file in the root directory and add your API keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser. Navigate to `/driver`, `/conductor`, or `/map` to test the individual interfaces.
