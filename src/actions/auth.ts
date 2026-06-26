"use server";

import crypto from "crypto";
import prisma from "@/lib/prisma";
import { isCompleteReturningUser, normalizeEmail, normalizePhone } from "@/lib/auth-utils";
import { sendOtpEmail } from "@/lib/email";

const OTP_SECRET = process.env.OTP_SECRET || "minaliyaa-otp-secure-signing-key-32-chars-long";
const AISENSY_API_KEY = process.env.AISENSY_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGE2N2NhMmIyZDBmNTVkZGM5ZDRmMSIsIm5hbWUiOiJNaW5hbGl5YSBHb29kcyBBbmQgU2VydmljZXMiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjg0YTY3Y2EyYjJkMGY1NWRkYzlkNGVhIiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3NDk3MDY2OTh9.fTdJ31H_ROoT-M1RKE0AWV5Y4pnDdMSDISwNqm7TwIc";
const AISENSY_CAMPAIGN_NAME = process.env.AISENSY_CAMPAIGN_NAME || "minaliyaloginotp";
const AISENSY_USER_NAME = process.env.AISENSY_USER_NAME || "Minaliya Goods And Services";

function generateOtpToken(identifier: string, otp: string, expiresAt: number): string {
  const data = `${identifier}:${otp}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", OTP_SECRET).update(data).digest("hex");
  return Buffer.from(`${data}:${signature}`).toString("base64");
}

function verifyOtpToken(identifier: string, otp: string, token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 4) return false;

    const [tokenIdentifier, tokenOtp, tokenExpiresAtStr, tokenSignature] = parts;
    const expiresAt = parseInt(tokenExpiresAtStr, 10);

    if (Date.now() > expiresAt) {
      console.warn(`[OTP] Token expired for ${identifier}`);
      return false;
    }

    if (tokenIdentifier !== identifier || tokenOtp !== otp) {
      console.warn(`[OTP] Value mismatch for ${identifier}`);
      return false;
    }

    const expectedData = `${tokenIdentifier}:${tokenOtp}:${tokenExpiresAtStr}`;
    const expectedSignature = crypto.createHmac("sha256", OTP_SECRET).update(expectedData).digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(tokenSignature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("[OTP] Error verifying OTP token:", error);
    return false;
  }
}

/**
 * Generates an OTP, signs it, and triggers the AiSensy WhatsApp campaign.
 */
export async function sendOtpAction(name: string, mobile: string) {
  const phone = normalizePhone(mobile);
  try {
    if (!phone || phone.length < 10) {
      return { success: false, error: "Please enter a valid mobile number." };
    }

    // Generate a 6-digit dynamic OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
    const otpToken = generateOtpToken(phone, otp, expiresAt);

    // In development mode, always print to console for quick developer feedback
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n==============================================`);
      console.log(`[OTP DEBUG] Generated OTP for ${phone}: ${otp}`);
      console.log(`==============================================\n`);
    }

    // Format destination with 91 country code for India
    let destination = phone;
    if (destination.length === 10 && !destination.startsWith("91")) {
      destination = `91${destination}`;
    }

    // Construct the exact payload requested by the client for the AiSensy Campaign API
    const payload = {
      apiKey: AISENSY_API_KEY,
      campaignName: AISENSY_CAMPAIGN_NAME,
      destination: destination,
      userName: name || AISENSY_USER_NAME,
      templateParams: [
        `*${otp}*`
      ],
      source: "new-landing-page form",
      media: {},
      buttons: [
        {
          type: "button",
          sub_type: "url",
          index: 0,
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
      ],
      carouselCards: [],
      location: {},
      attributes: {},
      paramsFallbackValue: {
        FirstName: name || "user",
      },
    };

    // Post to AiSensy Campaign Endpoint
    const response = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Check both boolean and string representations of success returned by AiSensy API
    if (
      result.success === true ||
      result.success === "true" ||
      result.status === "SUCCESS" ||
      result.status === true
    ) {
      console.log(`[OTP] AiSensy Campaign message sent successfully! Msg ID: ${result.submitted_message_id}`);
      return { success: true, otpToken };
    } else {
      console.error("[OTP] AiSensy Campaign Delivery API Error:", result);
      
      // Developer-friendly fallback in development mode if there is a real delivery configuration issue
      if (process.env.NODE_ENV !== "production") {
        console.warn("[OTP] AiSensy API returned failure, but returning success token because NODE_ENV is development.");
        return { 
          success: true, 
          otpToken, 
          debugMessage: "Development mode fallback: OTP printed in server console." 
        };
      }

      return { 
        success: false, 
        error: result.message || "Failed to deliver OTP via WhatsApp. Please try again later." 
      };
    }
  } catch (error) {
    console.error("[OTP] Exception occurred while sending WhatsApp OTP:", error);
    
    // Developer-friendly fallback in development mode
    if (process.env.NODE_ENV !== "production") {
      console.warn("[OTP] Network/fetch error, but returning success token because NODE_ENV is development.");
      const mockOtp = "123456";
      const expiresAt = Date.now() + 5 * 60 * 1000;
      const otpToken = generateOtpToken(phone, mockOtp, expiresAt);
      
      console.log(`\n==============================================`);
      console.log(`[OTP DEBUG FALLBACK] Network error. Mock OTP for ${phone}: ${mockOtp}`);
      console.log(`==============================================\n`);

      return { 
        success: true, 
        otpToken, 
        debugMessage: "Network error fallback: OTP is 123456." 
      };
    }

    return { success: false, error: "An unexpected connection error occurred. Please try again." };
  }
}

/**
 * Generates an OTP, signs it, and sends it via the Webaroo Email Gateway.
 */
export async function sendEmailOtpAction(customerName: string, email: string) {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const normalizedEmail = normalizeEmail(email);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const otpToken = generateOtpToken(normalizedEmail, otp, expiresAt);

    if (process.env.NODE_ENV !== "production") {
      console.log(`\n==============================================`);
      console.log(`[Email OTP DEBUG] Generated OTP for ${normalizedEmail}: ${otp}`);
      console.log(`==============================================\n`);
    }

    const sent = await sendOtpEmail(normalizedEmail, otp, customerName);
    if (!sent) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Email OTP] API returned failure, returning success token because NODE_ENV is development.");
        return {
          success: true,
          otpToken,
          debugMessage: "Development mode fallback: OTP printed in server console.",
        };
      }
      return { success: false, error: "Failed to send OTP via email. Please try again later." };
    }

    console.log(`[Email OTP] Sent successfully to ${normalizedEmail}`);
    return { success: true, otpToken };
  } catch (error) {
    console.error("[Email OTP] Exception occurred while sending:", error);
    if (process.env.NODE_ENV !== "production") {
      const normalizedEmail = normalizeEmail(email);
      const mockOtp = "123456";
      const expiresAt = Date.now() + 5 * 60 * 1000;
      const otpToken = generateOtpToken(normalizedEmail, mockOtp, expiresAt);
      console.log(`\n==============================================`);
      console.log(`[Email OTP DEBUG FALLBACK] Mock OTP for ${normalizedEmail}: ${mockOtp}`);
      console.log(`==============================================\n`);
      return {
        success: true,
        otpToken,
        debugMessage: "Network error fallback: OTP is 123456.",
      };
    }
    return { success: false, error: "An unexpected connection error occurred. Please try again." };
  }
}

/**
 * Validates the entered OTP code against the signed token.
 * Supports both WhatsApp (phone identifier) and Email (email identifier) OTPs.
 */
export async function verifyOtpAction(
  mobile: string,
  otp: string,
  otpToken: string,
  email: string,
  channel?: "whatsapp" | "email"
) {
  try {
    if (!otp || !otpToken) {
      return { success: false, error: "Invalid submission data." };
    }

    const useEmailChannel = channel === "email";
    const identifier = useEmailChannel ? normalizeEmail(email) : normalizePhone(mobile);

    if (!identifier) {
      return { success: false, error: "Invalid identifier for OTP verification." };
    }

    const isValid = verifyOtpToken(identifier, otp, otpToken);
    if (!isValid) {
      return { success: false, error: "Invalid or expired OTP. Please try again." };
    }

    const user = useEmailChannel
      ? await prisma.user.findUnique({ where: { email: identifier } })
      : await prisma.user.findUnique({ where: { phoneNumber: identifier } });

    if (user && isCompleteReturningUser(user, email, mobile)) {
      return {
        success: true,
        needsRegistration: false,
        user: {
          id: user.id,
          name: user.name!,
          mobile: user.phoneNumber || normalizePhone(mobile),
          email: user.email || undefined,
          image: user.image || undefined,
          newsletterSubscribed: user.newsletterSubscribed,
          addresses: user.addresses || [],
          cart: user.cart || [],
        },
      };
    }

    return { success: true, needsRegistration: true };
  } catch (error) {
    console.error("[OTP] Exception occurred while verifying OTP:", error);
    return { success: false, error: "Failed to verify OTP. Please try again." };
  }
}

/**
 * Persists updated user profile changes to the PostgreSQL database via Prisma.
 */
export async function updateUserAction(
  currentMobile: string,
  data: {
    name?: string;
    email?: string;
    mobile?: string;
    image?: string;
    newsletterSubscribed?: boolean;
    addresses?: any;
    cart?: any;
  }
) {
  try {
    if (!currentMobile) {
      return { success: false, error: "Authentication required." };
    }

    // Find the user by their current mobile number
    const user = await prisma.user.findUnique({
      where: { phoneNumber: currentMobile },
    });

    if (!user) {
      // If the user doesn't exist in the DB, create them
      const newUser = await prisma.user.create({
        data: {
          phoneNumber: data.mobile || currentMobile,
          name: data.name || null,
          email: data.email || null,
          image: data.image || null,
          newsletterSubscribed: data.newsletterSubscribed !== undefined ? data.newsletterSubscribed : true,
          addresses: data.addresses || [],
          cart: data.cart || [],
        },
      });
      console.log(`[OTP] Created new user on profile update: ${newUser.phoneNumber}`);
      return { 
        success: true, 
        user: { 
          name: newUser.name, 
          mobile: newUser.phoneNumber, 
          email: newUser.email || undefined,
          image: newUser.image || undefined,
          newsletterSubscribed: newUser.newsletterSubscribed,
          addresses: newUser.addresses || [],
          cart: newUser.cart || [],
        } 
      };
    }

    // Update details in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        email: data.email !== undefined ? (typeof data.email === "string" && data.email.trim() ? data.email : null) : undefined,
        phoneNumber: data.mobile !== undefined ? data.mobile : undefined,
        image: data.image !== undefined ? data.image : undefined,
        newsletterSubscribed: data.newsletterSubscribed !== undefined ? data.newsletterSubscribed : undefined,
        addresses: data.addresses !== undefined ? data.addresses : undefined,
        cart: data.cart !== undefined ? data.cart : undefined,
      },
    });

    console.log(`[OTP] Updated user profile in database for ID ${updatedUser.id}`);
    return { 
      success: true, 
      user: { 
        name: updatedUser.name, 
        mobile: updatedUser.phoneNumber, 
        email: updatedUser.email || undefined,
        image: updatedUser.image || undefined,
        newsletterSubscribed: updatedUser.newsletterSubscribed,
        addresses: updatedUser.addresses || [],
        cart: updatedUser.cart || [],
      } 
    };
  } catch (error: any) {
    console.error("[OTP] Error updating user profile in database:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A user with this mobile number or email already exists." };
    }
    return { success: false, error: error.message || "Failed to update profile in database." };
  }
}
