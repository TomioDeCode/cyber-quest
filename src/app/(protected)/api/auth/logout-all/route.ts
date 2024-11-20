import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Hapus semua sesi untuk user dari database
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { success: true, message: "Logged out from all devices" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to logout from all devices" },
      { status: 500 }
    );
  }
}
