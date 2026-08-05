import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase for the server environment
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { student_id, bus_id } = await request.json();

    // 1. Fetch the current bus data to check available seats
    const { data: busData, error: busError } = await supabase
      .from("Buses")
      .select("seats_available")
      .eq("bus_id", bus_id)
      .single();

    if (busError || !busData) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    if (busData.seats_available <= 0) {
      return NextResponse.json({ error: "Bus is full!" }, { status: 400 });
    }

    // 2. Deduct 1 seat and update the database
    const newSeatCount = busData.seats_available - 1;
    const { error: updateError } = await supabase
      .from("Buses")
      .update({ seats_available: newSeatCount })
      .eq("bus_id", bus_id);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: "Scan successful. Seat reserved.",
      seats_left: newSeatCount 
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
