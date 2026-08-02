import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-data";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json({ storeMode: "LIVE" }, { status: 500 });
  }
}
