import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
