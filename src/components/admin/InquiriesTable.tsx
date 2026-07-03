"use client";

import { Fragment, useState, useTransition } from "react";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { deleteInquiry } from "@/actions/adminData";
import { useRouter } from "next/navigation";

interface Inquiry {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  message: string | null;
  createdAt: string;
}

interface InquiriesTableProps {
  inquiries: Inquiry[];
}

export default function InquiriesTable({ inquiries: initialInquiries }: InquiriesTableProps) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteInquiry = (id: string) => {
    setDeleteError(null);
    startTransition(async () => {
      try {
        const result = await deleteInquiry(id);
        if (result.success) {
          setInquiries((prev) => prev.filter((inq) => inq.id !== id));
          setDeletingId(null);
          router.refresh();
        } else {
          setDeleteError(result.error || "Failed to delete inquiry.");
        }
      } catch {
        setDeleteError("An unexpected error occurred while deleting.");
      }
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (inquiries.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center text-stone-500 font-medium"
        style={{
          background: "white",
          borderColor: "var(--color-stone-200)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        No bulk inquiry forms submitted yet.
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "white",
        borderColor: "var(--color-stone-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Mobile cards */}
      <div className="md:hidden divide-y" style={{ borderColor: "var(--color-stone-100)" }}>
        {inquiries.map((inquiry) => {
          const isExpanded = expandedId === inquiry.id;
          return (
            <div key={inquiry.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-stone-900">{inquiry.name}</p>
                  {inquiry.company && (
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <Building2 size={10} />
                      {inquiry.company}
                    </p>
                  )}
                  <p className="text-sm text-stone-700 mt-1">{inquiry.product}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-50 text-forest-700 border border-forest-200">
                    {inquiry.quantity} Liters
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 shrink-0">{formatDate(inquiry.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-stone-500 mt-3">
                <span className="flex items-center gap-1">
                  <Phone size={10} />
                  {inquiry.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={10} />
                  {inquiry.email}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                <div>
                  {inquiry.message && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(inquiry.id)}
                      className="text-xs font-bold text-forest-700 flex items-center gap-1"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isExpanded ? "Hide message" : "Read message"}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError(null);
                    setDeletingId(inquiry.id);
                  }}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                  title="Delete Inquiry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr
              className="border-b text-stone-500 font-semibold"
              style={{
                borderColor: "var(--color-stone-200)",
                background: "var(--color-stone-50)",
              }}
            >
              <th className="p-4 pl-6 w-10"></th>
              <th className="p-4 text-xs uppercase tracking-wider">Contact</th>
              <th className="p-4 text-xs uppercase tracking-wider">Company</th>
              <th className="p-4 text-xs uppercase tracking-wider">Product Info</th>
              <th className="p-4 text-xs uppercase tracking-wider">Quantity</th>
              <th className="p-4 text-xs uppercase tracking-wider">Submitted On</th>
              <th className="p-4 text-xs uppercase tracking-wider text-right">Message</th>
              <th className="p-4 pr-6 text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-stone-200)" }}>
            {inquiries.map((inquiry) => {
              const isExpanded = expandedId === inquiry.id;

              return (
                <Fragment key={inquiry.id}>
                  <tr
                    className="hover:bg-stone-50/50 text-stone-600 transition-colors border-b"
                    style={{ borderColor: "var(--color-stone-100)" }}
                  >
                    <td className="p-4 pl-6 text-center">
                      {inquiry.message ? (
                        <button
                          onClick={() => toggleExpand(inquiry.id)}
                          className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      ) : (
                        <span className="text-stone-400 font-semibold">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-stone-900">{inquiry.name}</div>
                      <div className="flex items-center gap-3 text-stone-500 text-xs mt-1">
                        <span className="flex items-center gap-1">
                          <Phone size={10} />
                          {inquiry.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={10} />
                          {inquiry.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {inquiry.company ? (
                        <span className="flex items-center gap-1 text-stone-700 font-medium">
                          <Building2 size={12} style={{ color: "var(--color-forest-600)" }} />
                          {inquiry.company}
                        </span>
                      ) : (
                        <span className="text-stone-400 italic">Individual</span>
                      )}
                    </td>
                    <td className="p-4 text-stone-900 font-medium">{inquiry.product}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-50 text-forest-700 border border-forest-200">
                        {inquiry.quantity} Liters
                      </span>
                    </td>
                    <td className="p-4 text-stone-500 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-stone-400" />
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </td>
                     <td className="p-4 text-right">
                      {inquiry.message ? (
                        <button
                          onClick={() => toggleExpand(inquiry.id)}
                          className="text-xs font-bold text-forest-700 hover:text-forest-600 transition-colors uppercase tracking-wider"
                        >
                          {isExpanded ? "Collapse" : "Read Msg"}
                        </button>
                      ) : (
                        <span className="text-xs text-stone-400 italic">No notes</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError(null);
                          setDeletingId(inquiry.id);
                        }}
                        className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors inline-flex"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>

                  {isExpanded && inquiry.message && (
                    <tr className="bg-stone-50/40">
                      <td
                        colSpan={8}
                        className="p-6 pl-16 border-b"
                        style={{ borderColor: "var(--color-stone-200)" }}
                      >
                        <div className="max-w-3xl">
                          <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2 flex items-center gap-2">
                            <MessageSquare
                              size={14}
                              style={{ color: "var(--color-forest-600)" }}
                            />
                            Custom Message / Business Notes
                          </h4>
                          <p className="text-stone-700 text-xs leading-relaxed bg-white border border-stone-200 p-4 rounded-xl whitespace-pre-wrap shadow-sm">
                            {inquiry.message}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[110] overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => !isPending && setDeletingId(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md rounded-3xl border shadow-2xl p-6 bg-white space-y-4"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
                    Delete Inquiry
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Are you sure you want to delete this bulk inquiry? This will permanently delete this record from the database.
                  </p>
                </div>
              </div>

              {deleteError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4.5 py-3">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(deletingId)}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
