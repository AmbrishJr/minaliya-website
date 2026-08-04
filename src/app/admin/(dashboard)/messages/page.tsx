import { getContactMessages } from "@/actions/contactMessage";
import ContactMessagesTable from "@/components/admin/ContactMessagesTable";

export const revalidate = 0; // Disable static rendering for admin data pages

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Contact Messages
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Messages submitted through the contact page form by visitors and customers.
          </p>
        </div>
        <div className="px-3 py-1 text-xs font-semibold rounded-full bg-forest-50 text-forest-700 border border-forest-200 shadow-sm shrink-0 whitespace-nowrap">
          {messages.length} Messages
        </div>
      </div>

      {/* Messages list table */}
      <ContactMessagesTable messages={messages} />
    </div>
  );
}
