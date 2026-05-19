"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import {
  Leaf,
  Send,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Clock,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  showChips?: boolean;
}

interface ApiPayload {
  messages: { role: "user" | "assistant"; content: string }[];
  userName?: string;
}

const INITIAL_QUICK_REPLIES = [
  "Shop Oils",
  "Health Benefits",
  "Compare Oils",
  "Bulk Orders",
  "Free Delivery Info",
];

const CONTEXT_CHIPS: Record<string, string[]> = {
  groundnut: ["Buy Groundnut Oil", "Groundnut Oil Benefits", "Compare Oils"],
  coconut: ["Buy Coconut Oil", "Coconut Oil Uses", "Compare Oils"],
  sesame: ["Buy Sesame Oil", "Sesame Oil Benefits", "Compare Oils"],
  shipping: ["Free Delivery Info", "Track My Order", "Return Policy"],
  order: ["Track My Order", "Return Policy", "Contact Support"],
  price: ["View All Products", "Combo Packs", "Bulk Orders"],
  benefit: ["Shop Groundnut Oil", "Shop Coconut Oil", "Shop Sesame Oil"],
};

const ERROR_MESSAGE =
  "Sorry, I'm having trouble connecting. Please try again or reach us on WhatsApp at +91 98765 43210.";

function deriveChips(content: string): string[] | null {
  const lower = content.toLowerCase();
  for (const [key, chips] of Object.entries(CONTEXT_CHIPS)) {
    if (lower.includes(key)) return chips;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PageTypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4 animate-fade-in-up">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
        style={{ background: "var(--color-forest-600, #1F4F1F)" }}
      >
        <Leaf size={15} />
      </div>
      <div className="bg-white shadow-soft border border-stone-200/60 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full opacity-60"
            style={{
              background: "var(--color-forest-600, #1F4F1F)",
              animation: `minaliya-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onChipClick: (chip: string) => void;
}

function PageMessageBubble({ message, onChipClick }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Parse direct links in text like [View Product](/shop/groundnut-oil)
  const renderContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      parts.push(
        <Link
          key={match.index}
          href={match[2]}
          className="underline font-semibold hover:opacity-85 transition-opacity"
          style={{ color: isUser ? "#ffffff" : "var(--color-forest-600, #1F4F1F)" }}
        >
          {match[1]}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div
      className={`flex items-end gap-3 mb-4 animate-fade-in-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{ background: "var(--color-forest-600, #1F4F1F)" }}
        >
          <Leaf size={15} />
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4.5 py-3 rounded-2xl text-[14.5px] leading-relaxed shadow-soft transition-all duration-300 ${
            isUser
              ? "text-white rounded-br-sm shadow-md"
              : message.isError
              ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-sm"
              : "bg-white border border-stone-200/60 text-stone-800 rounded-bl-sm"
          }`}
          style={
            isUser
              ? { background: "var(--color-forest-600, #1F4F1F)" }
              : undefined
          }
        >
          {renderContent(message.content)}
        </div>

        {message.showChips && !isUser && (() => {
          const chips =
            message.id === "bot-welcome"
              ? INITIAL_QUICK_REPLIES
              : deriveChips(message.content);
          return chips ? (
            <div className="flex flex-wrap gap-2 mt-1 animate-fade-in-up">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => onChipClick(chip)}
                  className="text-xs px-3.5 py-2 rounded-full border font-medium transition-all duration-200 hover:text-white active:scale-95 cursor-pointer shadow-soft"
                  style={{
                    borderColor: "var(--color-forest-400, #4A8B4A)",
                    color: "var(--color-forest-600, #1F4F1F)",
                    background: "rgba(255, 255, 255, 0.7)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "var(--color-forest-600, #1F4F1F)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255, 255, 255, 0.7)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-forest-600, #1F4F1F)";
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Standalone Chat Page Component
// ---------------------------------------------------------------------------
export default function StandaloneChatPage() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "bot-welcome",
      role: "assistant",
      content: user?.name
        ? `Vanakkam, ${user.name}! 🌿 I'm Meena, your Minaliya customer assistant. How can I help you discover the pure health benefits of our traditional wooden cold-pressed oils today?`
        : "Vanakkam! 🌿 I'm Meena, your Minaliya customer assistant. Ask me anything about our pure wood cold-pressed (Mara Chekku) oils, prices, delivery, or health benefits!",
      showChips: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedPayload, setLastFailedPayload] = useState<ApiPayload | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on load
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  const sendMessage = useCallback(
    async (userText: string, payloadOverride?: ApiPayload) => {
      if (!userText.trim() || isLoading) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userText.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);
      setLastFailedPayload(null);

      const history = [...messages, userMsg]
        .filter((m) => !m.isError)
        .map((m) => ({ role: m.role, content: m.content }));

      const payload: ApiPayload = payloadOverride ?? {
        messages: history,
        userName: user?.name,
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: { reply: string } = await res.json();

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          showChips: true,
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        console.error("API request failed:", error);
        const errMsg: Message = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: ERROR_MESSAGE,
          isError: true,
        };
        setMessages((prev) => [...prev, errMsg]);
        setLastFailedPayload(payload);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, user?.name]
  );

  const handleSend = () => {
    if (inputValue.trim()) sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  const handleRetry = () => {
    if (!lastFailedPayload) return;
    setMessages((prev) => prev.filter((m) => !m.isError));
    sendMessage(
      lastFailedPayload.messages[lastFailedPayload.messages.length - 1]?.content ?? "",
      lastFailedPayload
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-cream-50, #FFFDF7)" }}>
      {/* ── Keyframe Animations styles ── */}
      <style>{`
        @keyframes minaliya-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-7px); opacity: 1; }
        }
        .minaliya-messages::-webkit-scrollbar { width: 5px; }
        .minaliya-messages::-webkit-scrollbar-track { background: transparent; }
        .minaliya-messages::-webkit-scrollbar-thumb {
          background: var(--color-stone-200, #ECEAE4);
          border-radius: 8px;
        }
      `}</style>

      {/* Nav bar */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="flex-1 py-10 px-4 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8 items-stretch">
        
        {/* Left Side: Brand Story & Info Panel */}
        <section className="w-full md:w-[35%] flex flex-col gap-6 md:sticky md:top-24 h-fit">
          {/* Header Back Button */}
          <div className="flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
              style={{ color: "var(--color-forest-600, #1F4F1F)" }}
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>

          {/* Assistant profile summary */}
          <div className="glass-card p-6 border border-stone-200/60 shadow-soft flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{
                    background: "linear-gradient(135deg, var(--color-forest-600, #1F4F1F) 0%, #0D240D 100%)",
                  }}
                >
                  <Leaf size={28} className="text-white animate-pulse" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold tracking-tight text-stone-800">Meena</h1>
                <p className="text-stone-500 text-xs font-semibold flex items-center gap-1.5 mt-0.5">
                  <Clock size={12} className="text-emerald-500" />
                  Minaliya AI Assistant · Online
                </p>
              </div>
            </div>

            <hr className="border-stone-200/60" />

            <p className="text-stone-600 text-sm leading-relaxed">
              I am trained exclusively on the <strong>Minaliya Design and Product Catalog</strong> to assist you in discovering authentic wooden cold-pressed oils.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-stone-700 text-xs font-medium bg-stone-100/50 p-3 rounded-xl border border-stone-200/40">
                <ShieldCheck className="text-emerald-600 flex-shrink-0" size={18} />
                <span>100% Traditional Mara Chekku Extraction</span>
              </div>
              <div className="flex items-center gap-3 text-stone-700 text-xs font-medium bg-stone-100/50 p-3 rounded-xl border border-stone-200/40">
                <Award className="text-amber-500 flex-shrink-0" size={18} />
                <span>Zero Chemicals, Zero Preservatives</span>
              </div>
            </div>
          </div>

          {/* Quick Support & Contact Details */}
          <div className="glass-card p-6 border border-stone-200/60 shadow-soft flex flex-col gap-4">
            <h2 className="font-heading text-base font-bold text-stone-800">Need human assistance?</h2>
            <p className="text-stone-500 text-xs leading-relaxed">
              If Meena is unable to answer specific questions, feel free to contact our support team.
            </p>

            <div className="flex flex-col gap-2.5 mt-1">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm px-4 py-2.5 rounded-xl border font-semibold hover:bg-stone-50 transition-colors"
                style={{ borderColor: "var(--color-stone-200, #ECEAE4)", color: "var(--color-stone-700, #4A4740)" }}
              >
                <Phone size={15} className="text-emerald-500" />
                <span>WhatsApp Support</span>
              </a>
              <a
                href="mailto:support@minaliya.com"
                className="flex items-center gap-3 text-sm px-4 py-2.5 rounded-xl border font-semibold hover:bg-stone-50 transition-colors"
                style={{ borderColor: "var(--color-stone-200, #ECEAE4)", color: "var(--color-stone-700, #4A4740)" }}
              >
                <Mail size={15} className="text-amber-500" />
                <span>support@minaliya.com</span>
              </a>
            </div>
          </div>
        </section>

        {/* Right Side: Primary Immersive Chat Interface */}
        <section className="flex-1 flex flex-col min-h-[580px] md:h-[680px] bg-white border border-stone-200/60 rounded-3xl overflow-hidden shadow-soft">
          
          {/* Chat Window Header */}
          <div
            className="flex items-center gap-4 px-6 py-4 flex-shrink-0 border-b border-stone-100"
            style={{
              background: "linear-gradient(135deg, var(--color-forest-600, #1F4F1F) 0%, #153815 100%)",
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Sparkles size={20} className="text-white animate-spin-slow" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">Conversation with Meena</p>
              <p className="text-white/70 text-xs">Usually responds instantly</p>
            </div>
          </div>

          {/* Message Area */}
          <div
            className="minaliya-messages flex-1 overflow-y-auto px-6 py-6"
            style={{ background: "#FAF9F5" }}
          >
            {messages.map((message) => (
              <PageMessageBubble
                key={message.id}
                message={message}
                onChipClick={handleChipClick}
              />
            ))}

            {isLoading && <PageTypingIndicator />}

            {/* Failed state button */}
            {lastFailedPayload && !isLoading && (
              <div className="flex justify-center mt-3 animate-fade-in-up">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} className="animate-spin-slow" />
                  Retry Connection
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Chat Input Area */}
          <div className="px-5 py-4 flex-shrink-0 border-t border-stone-100 bg-white">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Ask Meena about Groundnut, Coconut or Gingelly oils, or tracking orders..."
                aria-label="Type your message"
                className="flex-1 text-[14.5px] px-5 py-3.5 rounded-full border outline-none transition-all disabled:opacity-50"
                style={{
                  borderColor: "var(--color-stone-200, #ECEAE4)",
                  background: "var(--color-stone-50, #FAFAF8)",
                  color: "#1c1917",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-forest-400, #4A8B4A)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,139,74,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-stone-200, #ECEAE4)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-150 disabled:opacity-45 hover:opacity-95 active:scale-95 cursor-pointer shadow-soft"
                style={{ background: "var(--color-forest-600, #1F4F1F)" }}
              >
                {isLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            
            <p className="text-center text-[10.5px] text-stone-400 mt-3 font-medium">
              Vanakkam from Chennai! All customer conversations are secure and encrypted.
            </p>
          </div>

        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
