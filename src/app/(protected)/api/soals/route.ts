import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const soals = await prisma.soal.findMany({
      select: {
        id: true,
        soal: true,
        url: true,
        createdAt: true,
        updatedAt: true,
        userSoal: {
          select: {
            id: true,
            takenAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            userSoal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!soals || soals.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No soals found",
          data: null,
        },
        { status: 404 }
      );
    }

    const transformedSoals = soals.map((soal: { _count: { userSoal: any; }; userSoal: any[]; }) => ({
      ...soal,
      attemptCount: soal._count.userSoal,
      userSoal: soal.userSoal.map((us) => ({
        id: us.id,
        takenAt: us.takenAt,
        user: us.user,
      })),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Soals retrieved successfully",
        data: transformedSoals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/soals:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
