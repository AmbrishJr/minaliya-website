"use client";

import { useState, useCallback } from "react";
import { X, Phone, Mail, User, CheckCircle2, MessageSquare, ArrowLeft, LogIn, UserPlus, AtSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendOtpAction, sendEmailOtpAction, verifyOtpAction } from "@/actions/auth";
import { adminLogin } from "@/actions/admin";

type Step = "identifier" | "login-otp" | "register";
type RegisterStep = "details" | "channel" | "otp";
type IdentifierType = "email" | "mobile";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [step, setStep] = useState<Step>("identifier");
  const [registerStep, setRegisterStep] = useState<RegisterStep>("details");
  const [identifierType, setIdentifierType] = useState<IdentifierType | null>(null);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingUserName, setExistingUserName] = useState("");
  const [existingUserEmail, setExistingUserEmail] = useState("");
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [isRedirectingToAdmin, setIsRedirectingToAdmin] = useState(false);

  const resetForm = useCallback(() => {
    setStep("identifier");
    setRegisterStep("details");
    setIdentifierType(null);
    setChannel("whatsapp");
    setEmail("");
    setMobile("");
    setOtp("");
    setName("");
    setError("");
    setExistingUserName("");
    setExistingUserEmail("");
    setIsRedirectingToAdmin(false);
  }, []);

  if (!isLoginModalOpen) return null;

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = email || "";
    if (!raw.trim()) {
      setError("Please enter your email or mobile number");
      return;
    }

    const isEmail = raw.includes("@");
    const normalizedEmail = isEmail ? raw.toLowerCase().trim() : "";
    const normalizedMobile = isEmail ? "" : raw.replace(/\D/g, "").slice(0, 10);

    if (!isEmail && normalizedMobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (isEmail && !normalizedEmail.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);
    setIdentifierType(isEmail ? "email" : "mobile");

    try {
      const lookupPayload = isEmail ? { email: normalizedEmail } : { mobile: normalizedMobile };
      const lookupRes = await fetch("/api/auth/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lookupPayload),
      });
      const lookupData = await lookupRes.json();

      if (lookupData.isAdmin) {
        setIsRedirectingToAdmin(true);
        const adminEmail = lookupData.user?.email || "";
        const adminMobile = lookupData.user?.mobile || "";
        const adminRes = await adminLogin(adminEmail, adminMobile);
        if (adminRes.success) {
          resetForm();
          closeLoginModal();
          window.location.assign("/admin");
          return;
        }
        setIsRedirectingToAdmin(false);
        setError(adminRes.error || "Failed to access admin dashboard.");
        return;
      }

      if (lookupData.exists && lookupData.user) {
        setExistingUserName(lookupData.user.name || "");
        setExistingUserEmail(lookupData.user.email || "");
        setEmail(lookupData.user.email || "");
        setMobile(lookupData.user.mobile || "");
        setChannel(isEmail ? "email" : "whatsapp");
        setStep("login-otp");
      } else {
        if (isEmail) {
          setEmail(normalizedEmail);
          setMobile("");
        } else {
          setMobile(normalizedMobile);
          setEmail("");
        }
        setStep("register");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = channel === "email"
        ? await sendEmailOtpAction(existingUserName || "Minaliya Customer", existingUserEmail)
        : await sendOtpAction(existingUserName || "Minaliya Customer", mobile);

      if (response.success && response.otpToken) {
        setOtpToken(response.otpToken);
      } else {
        setError(response.error || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter a 6-digit code");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const response = await verifyOtpAction(mobile, otp, otpToken, existingUserEmail, channel);
      if (response.success && response.user) {
        login({
          id: response.user.id,
          name: response.user.name,
          mobile: response.user.mobile,
          email: response.user.email || existingUserEmail,
        });
        resetForm();
        closeLoginModal();
      } else {
        setError(response.error || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missingMobile = mobile.length < 10;
    const missingName = name.length < 2;
    const hasEmail = email.includes("@");

    if (hasEmail && email.length < 5) {
      setError("Please enter a valid email address");
      return;
    }
    if (missingMobile) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (missingName) {
      setError("Please enter your name");
      return;
    }

    setError("");
    setChannel(hasEmail && email.trim() ? "email" : "whatsapp");
    setRegisterStep("channel");
  };

  const handleSendRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = channel === "email"
        ? await sendEmailOtpAction(name, email)
        : await sendOtpAction(name, mobile);

      if (response.success && response.otpToken) {
        setOtpToken(response.otpToken);
        setRegisterStep("otp");
      } else {
        setError(response.error || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter a 6-digit code");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const response = await verifyOtpAction(mobile, otp, otpToken, email, channel);
      if (response.success) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email || null, mobile, name }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          login({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            mobile: data.user.phoneNumber,
          });
          resetForm();
          closeLoginModal();
        } else {
          setError(data.error || "Failed to register. Please try again.");
        }
      } else {
        setError(response.error || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderIdentifierStep = () => (
    <form onSubmit={handleIdentifierSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">
          Email or Mobile Number
        </label>
        <div className="relative">
          <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
          <input
            required
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com or 9876543210"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
            style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
            autoFocus
          />
        </div>
      </div>

      {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-4 justify-center text-base mt-4 shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading
          ? isRedirectingToAdmin
            ? "Redirecting to admin dashboard..."
            : "Checking..."
          : "Continue"}
      </button>
    </form>
  );

  const renderLoginOtpChannel = () => (
    <form onSubmit={handleSendLoginOtp} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-stone-400">Receive OTP via</label>
        <div className="flex flex-col gap-3">
          {mobile && (
            <button
              type="button"
              onClick={() => setChannel("whatsapp")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${
                channel === "whatsapp"
                  ? "border-forest-500 bg-forest-50 text-forest-700"
                  : "border-stone-200 bg-cream-50 text-stone-500 hover:border-stone-300"
              }`}
            >
              <MessageSquare size={20} />
              <div className="text-left">
                <div className="text-sm font-semibold">WhatsApp OTP</div>
                <div className="text-xs opacity-75">+91 {mobile}</div>
              </div>
              {channel === "whatsapp" && (
                <span className="ml-auto text-xs font-bold text-forest-600">Selected</span>
              )}
            </button>
          )}

          {existingUserEmail && (
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${
                channel === "email"
                  ? "border-forest-500 bg-forest-50 text-forest-700"
                  : "border-stone-200 bg-cream-50 text-stone-500 hover:border-stone-300"
              }`}
            >
              <Mail size={20} />
              <div className="text-left">
                <div className="text-sm font-semibold">Email OTP</div>
                <div className="text-xs opacity-75 truncate max-w-[180px]">{existingUserEmail}</div>
              </div>
              {channel === "email" && (
                <span className="ml-auto text-xs font-bold text-forest-600">Selected</span>
              )}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-4 justify-center text-base mt-4 shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending OTP..." : channel === "email" ? "Send OTP to Email" : "Send OTP to WhatsApp"}
      </button>
    </form>
  );

  const renderLoginOtpVerify = () => (
    <form onSubmit={handleVerifyLoginOtp} className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-3 text-stone-400 text-center">6-Digit OTP</label>
        <p className="text-xs text-stone-400 text-center mb-4">
          Sent to {channel === "email" ? existingUserEmail : `+91 ${mobile}`}
        </p>
        <input
          autoFocus
          required
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="0 0 0 0 0 0"
          className="w-full px-4 py-4 rounded-xl border text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-forest-200 outline-none transition-all"
          style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
          disabled={isLoading}
        />
      </div>

      {error && <p className="text-xs font-medium text-red-500 text-center">{error}</p>}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-4 justify-center text-base shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify & Login"}
        </button>
        <button
          type="button"
          onClick={() => { setOtp(""); setOtpToken(""); setError(""); }}
          disabled={isLoading}
          className="w-full text-sm font-bold text-stone-400 hover:text-stone-600 py-2 transition-colors disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>
    </form>
  );

  const renderRegisterDetails = () => (
    <form onSubmit={handleRegisterDetailsSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">
          Full Name <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
            style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
            autoFocus
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">
          Mobile Number <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400 border-r pr-2 mr-2" style={{ borderColor: "var(--color-stone-200)" }}>+91</span>
          <input
            required
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="9876543210"
            className="w-full pl-20 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
            style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">
          Email Address <span className="text-stone-300 font-normal normal-case">(optional)</span>
        </label>
        <div className="relative">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
            style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
          />
        </div>
      </div>

      {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-4 justify-center text-base mt-4 shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </form>
  );

  const renderRegisterChannel = () => (
    <form onSubmit={handleSendRegisterOtp} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-stone-400">Receive OTP via</label>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setChannel("whatsapp")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${
              channel === "whatsapp"
                ? "border-forest-500 bg-forest-50 text-forest-700"
                : "border-stone-200 bg-cream-50 text-stone-500 hover:border-stone-300"
            }`}
          >
            <MessageSquare size={20} />
            <div className="text-left">
              <div className="text-sm font-semibold">WhatsApp OTP</div>
              <div className="text-xs opacity-75">+91 {mobile}</div>
            </div>
            {channel === "whatsapp" && (
              <span className="ml-auto text-xs font-bold text-forest-600">Selected</span>
            )}
          </button>

          {email.includes("@") && (
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${
                channel === "email"
                  ? "border-forest-500 bg-forest-50 text-forest-700"
                  : "border-stone-200 bg-cream-50 text-stone-500 hover:border-stone-300"
              }`}
            >
              <Mail size={20} />
              <div className="text-left">
                <div className="text-sm font-semibold">Email OTP</div>
                <div className="text-xs opacity-75 truncate max-w-[180px]">{email}</div>
              </div>
              {channel === "email" && (
                <span className="ml-auto text-xs font-bold text-forest-600">Selected</span>
              )}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-4 justify-center text-base mt-4 shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending OTP..." : channel === "email" ? "Send OTP to Email" : "Send OTP to WhatsApp"}
      </button>
    </form>
  );

  const renderRegisterOtpVerify = () => (
    <form onSubmit={handleVerifyRegisterOtp} className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-3 text-stone-400 text-center">6-Digit OTP</label>
        <p className="text-xs text-stone-400 text-center mb-4">
          Sent to {channel === "email" ? email : `+91 ${mobile}`}
        </p>
        <input
          autoFocus
          required
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="0 0 0 0 0 0"
          className="w-full px-4 py-4 rounded-xl border text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-forest-200 outline-none transition-all"
          style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
          disabled={isLoading}
        />
      </div>

      {error && <p className="text-xs font-medium text-red-500 text-center">{error}</p>}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-4 justify-center text-base shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify & Create Account"}
        </button>
        <button
          type="button"
          onClick={() => { setOtp(""); setOtpToken(""); setError(""); setRegisterStep("channel"); }}
          disabled={isLoading}
          className="w-full text-sm font-bold text-stone-400 hover:text-stone-600 py-2 transition-colors disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={closeLoginModal}
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6 pb-0 flex items-center justify-between">
          {step !== "identifier" && (
            <button
              onClick={() => {
                if (step === "register" && registerStep === "channel") {
                  setRegisterStep("details");
                } else if (step === "register" && registerStep === "otp") {
                  setRegisterStep("channel");
                } else {
                  setStep("identifier");
                }
                setError("");
                setOtp("");
                setOtpToken("");
              }}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={20} className="text-stone-400" />
            </button>
          )}
          <button
            onClick={closeLoginModal}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors ml-auto"
          >
            <X size={20} className="text-stone-400" />
          </button>
        </div>

        <div className="px-8 pb-10">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--color-forest-50)", color: "var(--color-forest-600)" }}
            >
              {step === "register" ? <UserPlus size={32} /> : <LogIn size={32} />}
            </div>

            {step === "identifier" && (
              <>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Welcome to Minaliya
                </h2>
                <p className="text-sm text-stone-500">
                  Enter your email or mobile number to login or create an account.
                </p>
              </>
            )}

            {step === "login-otp" && (
              <>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Welcome Back, {existingUserName || "Valued Customer"}!
                </h2>
                <p className="text-sm text-stone-500">
                  {otpToken ? "Enter the code sent to your contact" : "Choose how to receive your login code"}
                </p>
              </>
            )}

            {step === "register" && (
              <>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Create Your Account
                </h2>
                <p className="text-sm text-stone-500">
                  {registerStep === "channel"
                    ? "Choose how to receive your verification code"
                    : registerStep === "otp"
                      ? "Enter the code sent to your contact"
                      : "Fill in your details to get started"
                  }
                </p>
              </>
            )}
          </div>

          {step === "identifier" && renderIdentifierStep()}

          {step === "login-otp" && !otpToken && renderLoginOtpChannel()}

          {step === "login-otp" && otpToken && renderLoginOtpVerify()}

          {step === "register" && registerStep === "details" && renderRegisterDetails()}

          {step === "register" && registerStep === "channel" && renderRegisterChannel()}

          {step === "register" && registerStep === "otp" && renderRegisterOtpVerify()}

          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: "var(--color-stone-100)" }}>
            <p className="text-xs text-stone-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} className="text-forest-500" />
              100% Secure & Privacy Protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
