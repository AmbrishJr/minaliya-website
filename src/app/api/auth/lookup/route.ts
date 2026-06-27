import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizePhone } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, mobile } = body;

    let user;

    if (mobile) {
      const phone = normalizePhone(mobile);
      user = await prisma.user.findUnique({ where: { phoneNumber: phone } });
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    } else {
      return NextResponse.json(
        { error: "Email or mobile number is required" },
        { status: 400 }
      );
    }

    if (user) {
      const isAdmin = user.role === "ADMIN";
      return NextResponse.json({
        exists: true,
        isAdmin,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.phoneNumber,
        },
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Auth lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
