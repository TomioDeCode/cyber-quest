import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const allUser = await prisma.user.findMany({});

    return NextResponse.json({
      allUser,
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
