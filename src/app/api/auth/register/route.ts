import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeEmail, normalizePhone } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, mobile, name } = body;

    if (!mobile || !name) {
      return NextResponse.json(
        { error: "Name and mobile number are required" },
        { status: 400 }
      );
    }

    const phone = normalizePhone(mobile);
    const trimmedName = name.trim();
    const normalizedEmail = email ? normalizeEmail(email) : null;

    const existingByPhone = await prisma.user.findUnique({
      where: { phoneNumber: phone },
    });

    const existingByEmail = normalizedEmail
      ? await prisma.user.findUnique({ where: { email: normalizedEmail } })
      : null;

    // Same account matched by phone and email
    if (
      existingByPhone &&
      existingByEmail &&
      existingByPhone.id === existingByEmail.id
    ) {
      const user = await prisma.user.update({
        where: { id: existingByPhone.id },
        data: {
          name: trimmedName,
          email: normalizedEmail,
          phoneNumber: phone,
        },
      });
      return NextResponse.json({ success: true, user });
    }

    // Two different records — merge into the email account (user verified this email)
    if (
      existingByPhone &&
      existingByEmail &&
      existingByPhone.id !== existingByEmail.id
    ) {
      const orphanOrderCount = await prisma.order.count({
        where: { userId: existingByPhone.id },
      });

      if (orphanOrderCount > 0) {
        return NextResponse.json(
          {
            error:
              "This phone number is linked to another account. Please use the email and phone you originally registered with, or contact support.",
          },
          { status: 409 }
        );
      }

      await prisma.user.delete({ where: { id: existingByPhone.id } });

      const user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          name: trimmedName,
          email: normalizedEmail,
          phoneNumber: phone,
        },
      });
      return NextResponse.json({ success: true, user });
    }

    // Phone record exists
    if (existingByPhone) {
      if (normalizedEmail && existingByEmail && existingByEmail.id !== existingByPhone.id) {
        return NextResponse.json(
          {
            error:
              "This email is already registered with a different phone number. Please use a different email or sign in with your existing account.",
          },
          { status: 409 }
        );
      }

      const user = await prisma.user.update({
        where: { id: existingByPhone.id },
        data: {
          name: trimmedName,
          phoneNumber: phone,
          ...(normalizedEmail ? { email: normalizedEmail } : {}),
        },
      });
      return NextResponse.json({ success: true, user });
    }

    // Email exists but phone is new for this account
    if (existingByEmail) {
      const linkedPhone = existingByEmail.phoneNumber
        ? normalizePhone(existingByEmail.phoneNumber)
        : null;

      if (linkedPhone && linkedPhone !== phone) {
        return NextResponse.json(
          {
            error:
              "This email is already linked to a different phone number. Please use your registered phone or contact support.",
          },
          { status: 409 }
        );
      }

      const user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          name: trimmedName,
          email: normalizedEmail,
          phoneNumber: phone,
        },
      });
      return NextResponse.json({ success: true, user });
    }

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        phoneNumber: phone,
        ...(normalizedEmail ? { email: normalizedEmail } : {}),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    console.error("Auth register error:", error);

    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "This email or phone is already registered. Please sign in instead or use different details.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
