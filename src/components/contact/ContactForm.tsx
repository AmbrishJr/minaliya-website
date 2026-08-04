"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitContactMessage } from "@/actions/contactMessage";

interface ContactFormProps {
  subjects: string[];
  buttonLabel: string;
}

export default function ContactForm({ subjects, buttonLabel }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle
          size={56}
          className="mx-auto"
          style={{ color: "var(--color-forest-500)" }}
        />
        <h3
          className="text-xl font-bold"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-stone-800)",
          }}
        >
          Message Sent!
        </h3>
        <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-secondary text-sm mt-4"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        const result = await submitContactMessage({ name, phone, email, subject, message });
        setIsSubmitting(false);
        if (result.success) {
          setSubmitted(true);
        } else {
          setError(result.error || "Failed to submit message.");
        }
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--color-stone-700)" }}
          >
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--color-cream-50)",
              border: "1.5px solid var(--color-stone-200)",
              color: "var(--color-stone-800)",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="contact-phone"
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--color-stone-700)" }}
          >
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--color-cream-50)",
              border: "1.5px solid var(--color-stone-200)",
              color: "var(--color-stone-800)",
            }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--color-stone-700)" }}
        >
          Email Address *
        </label>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--color-cream-50)",
            border: "1.5px solid var(--color-stone-200)",
            color: "var(--color-stone-800)",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--color-stone-700)" }}
        >
          Subject *
        </label>
        <select
          id="contact-subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
          style={{
            background: "var(--color-cream-50)",
            border: "1.5px solid var(--color-stone-200)",
            color: "var(--color-stone-700)",
          }}
        >
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--color-stone-700)" }}
        >
          Message *
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          placeholder="Tell us how we can help you..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
          style={{
            background: "var(--color-cream-50)",
            border: "1.5px solid var(--color-stone-200)",
            color: "var(--color-stone-800)",
          }}
        />
      </div>

      {error && (
        <div
          className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
          style={{
            background: "var(--color-terra-50)",
            border: "1px solid var(--color-terra-200)",
            color: "var(--color-terra-500)",
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto justify-center py-3 sm:py-4 px-10 text-base disabled:opacity-60 disabled:cursor-not-allowed">
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {isSubmitting ? "Sending..." : (buttonLabel || "Send Message")}
      </button>
    </form>
  );
}
