"use client";

import { useState } from "react";
import { X, Phone, User, CheckCircle2, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendOtpAction, verifyOtpAction } from "@/actions/auth";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [step, setStep] = useState<"info" | "otp">("info");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2) {
      setError("Please enter a valid name");
      return;
    }
    if (mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      const response = await sendOtpAction(name, mobile);
      if (response.success && response.otpToken) {
        setOtpToken(response.otpToken);
        setStep("otp");
      } else {
        setError(response.error || "Failed to send OTP. Please check details.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await verifyOtpAction(name, mobile, otp, otpToken);
      if (response.success && response.user) {
        login({ 
          name: response.user.name, 
          mobile: response.user.mobile,
          email: response.user.email
        });
        setStep("info");
        setName("");
        setMobile("");
        setOtp("");
        setOtpToken("");
      } else {
        setError(response.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={closeLoginModal}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="p-6 pb-0 flex justify-end">
          <button 
            onClick={closeLoginModal}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
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
              <MessageSquare size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {step === "info" ? "Welcome to Minaliya" : "Verify WhatsApp OTP"}
            </h2>
            <p className="text-sm text-stone-500">
              {step === "info" 
                ? "Enter your details to access your account and track orders." 
                : `We've sent a 6-digit code to your WhatsApp number +91 ${mobile}`}
            </p>
          </div>

          {step === "info" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">Full Name</label>
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
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">Mobile Number</label>
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

              {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 justify-center text-base mt-4 shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending OTP..." : "Send OTP via WhatsApp"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-3 text-stone-400 text-center">6-Digit OTP</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="0 0 0 0 0 0" 
                  className="w-full px-4 py-4 rounded-xl border text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                  style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
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
                  onClick={() => setStep("info")}
                  className="w-full text-sm font-bold text-stone-400 hover:text-stone-600 py-2 transition-colors"
                >
                  Change Details
                </button>
              </div>
            </form>
          )}

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
