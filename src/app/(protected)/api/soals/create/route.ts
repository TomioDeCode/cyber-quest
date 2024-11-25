import { NextResponse, NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { soal, url, flag } = body;

    if (!soal || !url || !flag) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          error: "Soal, URL, and flag are required",
        },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid URL format",
          error: "Please provide a valid URL",
        },
        { status: 400 }
      );
    }

    const existingEntry = await prisma.soal.findFirst({
      where: {
        OR: [{ soal: soal.trim() }, { url: url.trim() }, { flag: flag.trim() }],
      },
    });

    if (existingEntry) {      
      const duplicateFields = [];
      if (existingEntry.soal === soal.trim()) duplicateFields.push("soal");
      if (existingEntry.url === url.trim()) duplicateFields.push("url");
      if (existingEntry.flag === flag.trim()) duplicateFields.push("flag");

      return NextResponse.json(
        {
          success: false,
          message: "Duplicate entry detected",
          error: `The following fields already exist: ${duplicateFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const newSoal = await prisma.soal.create({
      data: {
        soal: soal.trim(),
        url: url.trim(),
        flag: flag.trim(),
      },
      select: {
        id: true,
        soal: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Soal created successfully",
        data: newSoal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/soal:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[]) || [];
        return NextResponse.json(
          {
            success: false,
            message: "Duplicate entry",
            error: `${target.join(", ")} already exist`,
          },
          { status: 400 }
        );
      }
    }

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
