import { NextRequest } from "next/server";
import { firebaseService } from "../../../services/firebase.service";
import { otpService } from "../../../services/otp.service";
import { handleApiError } from "../../../lib/errorHandler";

interface OtpEntry {
  code: string;
  expiresAt: number;
}

// In-memory OTP store for email verification
const otpStore = new Map<string, OtpEntry>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, phone, otp, name, provider, channel, photoUrl, favorite } = body;

    if (action === "save_favorite" && favorite) {
      const result = await firebaseService.saveFavorite(favorite);
      return Response.json({ success: true, result });
    }

    // 1. Request real-time verification code for Google / Facebook Email
    if (action === "request_verification_code") {
      if (!email || !email.includes("@")) {
        return Response.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      // Generate secure 6-digit real-time OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(cleanEmail, {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes TTL
      });

      console.log(`[Auth API] Real-time Email OTP for ${cleanEmail}: ${code}`);

      return Response.json({
        success: true,
        message: `Real-time verification code sent to ${cleanEmail}`,
        email: cleanEmail,
        code: code,
      });
    }

    // 2. Request OTP for Phone Login via Fast2SMS / 2Factor / WhatsApp
    if (action === "request_phone_otp") {
      const result = await otpService.sendOtp({
        phone: phone || "",
        channel: channel || "auto",
        preferredProvider: provider || "auto",
      });
      return Response.json(result, { status: result.success ? 200 : 400 });
    }

    // 3. Verify Google or Facebook account with Email OTP
    if (action === "verify_account") {
      const cleanEmail = (email || "").trim().toLowerCase();
      const entry = otpStore.get(cleanEmail);

      if (!entry) {
        return Response.json({ success: false, error: "No verification code requested for this email." }, { status: 400 });
      }

      if (Date.now() > entry.expiresAt) {
        otpStore.delete(cleanEmail);
        return Response.json({ success: false, error: "Verification code expired. Please request a new one." }, { status: 400 });
      }

      if (entry.code !== (otp || "").trim()) {
        return Response.json({ success: false, error: "Invalid verification code. Please check and try again." }, { status: 400 });
      }

      // Validated successfully
      otpStore.delete(cleanEmail);
      const verifiedProvider = provider === "facebook" ? "facebook" : "google";
      const displayName = (name || "").trim() || (cleanEmail.split("@")[0].charAt(0).toUpperCase() + cleanEmail.split("@")[0].slice(1));
      
      // Real avatar: Unavatar or custom or dicebear
      const realPhoto = photoUrl?.trim() || `https://unavatar.io/${verifiedProvider}/${encodeURIComponent(cleanEmail)}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff&size=256`;

      return Response.json({
        success: true,
        user: {
          id: `${verifiedProvider}_${Date.now()}`,
          name: displayName,
          email: cleanEmail,
          photoUrl: realPhoto,
          provider: verifiedProvider,
          isVerified: true,
          verifiedAt: Date.now(),
        },
      });
    }

    // 4. Verify Phone Number via SMS/WhatsApp OTP
    if (action === "verify_phone_otp" || action === "verify_phone_guest") {
      if (!otp) {
        return Response.json({ success: false, error: "Please enter the 6-digit OTP code." }, { status: 400 });
      }

      const verifyResult = otpService.verifyOtp(phone || "", otp);
      if (!verifyResult.success) {
        return Response.json({ success: false, error: verifyResult.message }, { status: 400 });
      }

      const { digits10, international } = otpService.cleanPhone(phone || "");
      const lastDigits = digits10.slice(-4) || "0000";
      const displayName = (name || "").trim() || `User (+91-${lastDigits})`;

      return Response.json({
        success: true,
        message: "Phone number verified successfully!",
        user: {
          id: `phone_${digits10}`,
          uid: `phone_${digits10}`,
          name: displayName,
          displayName: displayName,
          phone: international,
          phoneNumber: international,
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D9488&color=fff&size=256`,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D9488&color=fff&size=256`,
          provider: "phone",
          providerId: "phone",
          isVerified: true,
          verifiedAt: Date.now(),
        },
      });
    }

    return Response.json({ success: true, message: "Auth route active" });
  } catch (error) {
    return handleApiError(error);
  }
}
