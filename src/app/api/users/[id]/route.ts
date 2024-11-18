import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      return NextResponse.json(
        { error: `User not found with ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching user data" },
      { status: 500 }
    );
  }
}
