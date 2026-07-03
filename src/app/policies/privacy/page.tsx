import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection guidelines for Minaliya.",
  alternates: { canonical: "/policies/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <section className="py-16 sm:py-24" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-12 border-b pb-8" style={{ borderColor: "var(--color-stone-200)" }}>
              <h1
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
              >
                Privacy Policy
              </h1>
              <p className="text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
                Last Updated: May 15, 2026
              </p>
            </header>

            <div className="prose prose-stone max-w-none prose-headings:font-heading prose-headings:text-stone-800 prose-p:text-stone-600 prose-li:text-stone-600">
              <p>
                At Minaliya, accessible from minaliya.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Minaliya and how we use it.
              </p>

              <h2>Information We Collect</h2>
              <p>
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </p>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, phone number, and password when you register.</li>
                <li><strong>Order Information:</strong> Shipping address, billing address, and payment details required to fulfill your orders.</li>
                <li><strong>Communication Data:</strong> Information you provide when you contact us via email, WhatsApp, or contact forms.</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Process and fulfill your orders</li>
                <li>Send you emails regarding your order status and updates</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
              </ul>

              <h2>Payment Processing</h2>
              <p>
                We do not store your credit card details on our servers. All payment transactions are processed securely through our trusted payment gateways which adhere to strict industry standards (PCI-DSS).
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at hello@minaliya.com.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
