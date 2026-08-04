"use server";

import prisma from "@/lib/prisma";
import { verifyAdminSession } from "./admin";
import { revalidatePath } from "next/cache";

export interface ContactMessageInput {
  name: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
}

async function requireAdmin() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }
}

export async function submitContactMessage(data: ContactMessageInput) {
  try {
    if (!data.name || !data.email || !data.subject || !data.message) {
      return { success: false as const, error: "Required fields are missing." };
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });

    return { success: true as const };
  } catch (error) {
    console.error("Error submitting contact message:", error);
    return { success: false as const, error: "Failed to submit message. Please try again later." };
  }
}

export async function getContactMessages() {
  await requireAdmin();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return messages.map((message) => ({
    id: message.id,
    name: message.name,
    phone: message.phone,
    email: message.email,
    subject: message.subject,
    message: message.message,
    createdAt: message.createdAt.toISOString(),
  }));
}

export async function deleteContactMessage(messageId: string) {
  await requireAdmin();

  try {
    await prisma.contactMessage.delete({
      where: { id: messageId },
    });
    revalidatePath("/admin/messages");
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Error deleting contact message:", error);
    return { success: false as const, error: "Failed to delete message." };
  }
}
