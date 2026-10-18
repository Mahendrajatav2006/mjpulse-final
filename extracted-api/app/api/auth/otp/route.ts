import { NextRequest, NextResponse } from "next/server";
import { otpService } from "../../../../services/otp.service";
import { handleApiError } from "../../../../lib/errorHandler";

/**
 * POST /api/auth/otp
 * Body:
 * - action: "send" | "verify"
 * - phone: string
 * - channel?: "sms" | "whatsapp" | "auto"
 * - provider?: "fast2sms" | "2factor" | "whatsapp" | "auto"
 * - otp?: string (for "verify")
 * - name?: string (optional display name)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, phone, channel, provider, otp, name } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Mobile phone number is required." },
        { status: 400 }
      );
    }

    // 1. SEND OTP via Fast2SMS / 2Factor / WhatsApp
    if (action === "send" || !action) {
      const sendResult = await otpService.sendOtp({
        phone,
        channel: channel || "auto",
        preferredProvider: provider || "auto",
      });

      return NextResponse.json(sendResult, { status: sendResult.success ? 200 : 400 });
    }

    // 2. VERIFY OTP
    if (action === "verify") {
      if (!otp) {
        return NextResponse.json(
          { success: false, message: "Please enter the 6-digit OTP code." },
          { status: 400 }
        );
      }

      const verifyResult = otpService.verifyOtp(phone, otp);
      if (!verifyResult.success) {
        return NextResponse.json(verifyResult, { status: 400 });
      }

      const { digits10, international } = otpService.cleanPhone(phone);
      const last4 = digits10.slice(-4);
      const displayName = name?.trim() || `User +91-${last4}`;

      // Return a verified user object compatible with standard Firebase user schemas
      const verifiedUser = {
        uid: `phone_${digits10}`,
        phoneNumber: international,
        displayName: displayName,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D9488&color=fff&size=256`,
        isVerified: true,
        providerId: "phone",
        loginMethod: "otp",
        authTime: Date.now(),
      };

      return NextResponse.json({
        success: true,
        message: "Phone verification successful!",
        user: verifiedUser,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action. Use 'send' or 'verify'." },
      { status: 400 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
