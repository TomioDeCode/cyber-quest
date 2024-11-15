import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ role: user?.role });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user role" },
      { status: 500 }
    );
  }
}
