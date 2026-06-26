"use client";

import { Fragment, useState, useTransition } from "react";
import { updateOrderStatus, deleteOrder, updateOrderAwb } from "@/actions/adminData";
import OrderStatusBadge from "./OrderStatusBadge";
import { ChevronDown, ChevronUp, Phone, Mail, MapPin, CheckCircle, Loader2, Trash2, AlertTriangle, X, Pencil, Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: Record<string, string>;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  awbNumber: string | null;
  items: OrderItem[];
}

type OrderFilter = "all" | "active";

interface OrdersTableProps {
  initialOrders: Order[];
  initialFilter?: OrderFilter;
}

const ACTIVE_STATUSES = new Set(["PENDING", "PROCESSING"]);

export default function OrdersTable({
  initialOrders,
  initialFilter = "all",
}: OrdersTableProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<OrderFilter>(initialFilter);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // AWB editing state
  const [awbEditingId, setAwbEditingId] = useState<string | null>(null);
  const [awbInput, setAwbInput] = useState("");
  const [awbSaving, setAwbSaving] = useState(false);
  const [awbError, setAwbError] = useState<string | null>(null);

  const handleSaveAwb = async () => {
    if (!awbEditingId) return;
    setAwbSaving(true);
    setAwbError(null);
    const result = await updateOrderAwb(awbEditingId, awbInput);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => o.id === awbEditingId ? { ...o, awbNumber: awbInput.trim() || null } : o)
      );
      setAwbEditingId(null);
    } else {
      setAwbError(result.error || "Failed to save AWB number.");
    }
    setAwbSaving(false);
  };

  const handleDeleteOrder = (id: string) => {
    setDeleteError(null);
    startTransition(async () => {
      try {
        const result = await deleteOrder(id);
        if (result.success) {
          setOrders((prev) => prev.filter((o) => o.id !== id));
          setDeletingId(null);
          router.refresh();
        } else {
          setDeleteError(result.error || "Failed to delete order.");
        }
      } catch {
        setDeleteError("An unexpected error occurred while deleting the order.");
      }
    });
  };

  const filteredOrders =
    filter === "active"
      ? orders.filter((o) => ACTIVE_STATUSES.has(o.status))
      : orders;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED");
      if (result.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert(result.error || "Failed to update order status.");
      }
    } catch {
      alert("An unexpected error occurred while updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderExpandedDetails = (order: Order) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      <div>
        <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-4 flex items-center gap-2">
          <CheckCircle size={14} style={{ color: "var(--color-forest-600)" }} />
          Order Items ({order.items.length})
        </h4>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-50 flex items-center justify-center shrink-0 border border-stone-200">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h5 className="font-semibold text-stone-900 text-xs">{item.productName}</h5>
                  <p className="text-[10px] text-stone-500 mt-0.5">₹{item.price} each</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-stone-500">Qty: {item.quantity}</span>
                <p className="text-xs font-bold text-stone-900 mt-0.5">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-4 flex items-center gap-2">
          <MapPin size={14} style={{ color: "var(--color-forest-600)" }} />
          Shipping & Customer Details
        </h4>
        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3.5 text-xs text-stone-600 shadow-sm">
          <div className="flex items-start gap-2">
            <span className="font-bold text-stone-500 shrink-0 w-16">Customer:</span>
            <div>
              <p className="font-semibold text-stone-900">{order.customerName}</p>
              <div className="flex items-center gap-1.5 text-stone-500 mt-1">
                <Phone size={12} />
                {order.customerPhone}
              </div>
              {order.customerEmail && order.customerEmail !== "N/A" && (
                <div className="flex items-center gap-1.5 text-stone-500 mt-1">
                  <Mail size={12} />
                  {order.customerEmail}
                </div>
              )}
            </div>
          </div>
          <div
            className="flex items-start gap-2 border-t pt-3"
            style={{ borderColor: "var(--color-stone-200)" }}
          >
            <span className="font-bold text-stone-500 shrink-0 w-16">Address:</span>
            <div className="space-y-1">
              <p className="text-stone-800 leading-relaxed font-medium">
                {order.shippingAddress?.address}
              </p>
              <p className="text-stone-500">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.pinCode}
              </p>
            </div>
          </div>
          {/* AWB Number */}
          <div
            className="flex items-center gap-2 border-t pt-3"
            style={{ borderColor: "var(--color-stone-200)" }}
          >
            <span className="font-bold text-stone-500 shrink-0 w-16">AWB No:</span>
            {order.awbNumber ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider" style={{ background: "var(--color-forest-50)", color: "var(--color-forest-700)", border: "1px solid var(--color-forest-200)" }}>
                <Package size={11} />
                {order.awbNumber}
              </span>
            ) : (
              <span className="text-stone-400 italic">Not assigned yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "white",
        borderColor: "var(--color-stone-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-2 p-4 border-b"
        style={{ borderColor: "var(--color-stone-100)" }}
      >
        {(
          [
            { id: "all" as const, label: "All Orders" },
            { id: "active" as const, label: "Pending / Processing" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              background: filter === tab.id ? "var(--color-forest-600)" : "var(--color-stone-100)",
              color: filter === tab.id ? "white" : "var(--color-stone-600)",
            }}
          >
            {tab.label}
            <span className="ml-1 opacity-80">
              (
              {tab.id === "all"
                ? orders.length
                : orders.filter((o) => ACTIVE_STATUSES.has(o.status)).length}
              )
            </span>
          </button>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        <>
          {/* Mobile cards */}
          <div className="md:hidden divide-y" style={{ borderColor: "var(--color-stone-100)" }}>
            {filteredOrders.map((order) => {
              const isExpanded = !!expandedOrders[order.id];
              const isUpdating = updatingId === order.id;
              return (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-stone-500">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="font-semibold text-stone-900 text-sm mt-0.5">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-stone-900">₹{order.totalAmount}</p>
                      <div className="mt-1.5">
                        {isUpdating ? (
                          <Loader2 size={14} className="animate-spin text-stone-400 ml-auto" />
                        ) : (
                          <OrderStatusBadge status={order.status} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="flex-1 px-2.5 py-2 rounded-xl text-xs bg-white text-stone-700 border border-stone-200 outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setDeletingId(order.id);
                      }}
                      className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAwbInput(order.awbNumber || "");
                        setAwbError(null);
                        setAwbEditingId(order.id);
                      }}
                      className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:text-forest-600 hover:border-forest-200 hover:bg-forest-50 transition-colors"
                      title="Edit AWB Number"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="p-2 rounded-lg border border-stone-200 text-stone-500"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {isExpanded && <div className="mt-4">{renderExpandedDetails(order)}</div>}
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
                <th className="p-4 text-xs uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-xs uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs uppercase tracking-wider">Payment</th>
                <th className="p-4 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs uppercase tracking-wider">Date</th>
                <th className="p-4 pr-6 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-stone-200)" }}>
              {filteredOrders.map((order) => {
                const isExpanded = !!expandedOrders[order.id];
                const isUpdating = updatingId === order.id;

                return (
                  <Fragment key={order.id}>
                    {/* Main Row */}
                    <tr
                      className="hover:bg-stone-50/50 text-stone-600 transition-colors border-b"
                      style={{ borderColor: "var(--color-stone-100)" }}
                    >
                      <td className="p-4 pl-6 text-center">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td className="p-4 font-mono text-xs text-stone-500 font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-stone-900">{order.customerName}</div>
                        <div className="text-xs text-stone-500">{order.customerPhone}</div>
                      </td>
                      <td className="p-4 font-semibold text-stone-900">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <div className="text-xs font-semibold text-stone-700">{order.paymentMethod}</div>
                        <div
                          className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                            order.paymentStatus === "PAID"
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </div>
                      </td>
                      <td className="p-4">
                        {isUpdating ? (
                          <div className="flex items-center gap-1.5 text-xs text-stone-600">
                            <Loader2 size={12} className="animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          <OrderStatusBadge status={order.status} />
                        )}
                      </td>
                      <td className="p-4 text-stone-500 text-xs">{formatDate(order.createdAt)}</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <select
                            value={order.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl text-xs bg-white text-stone-700 border border-stone-200 outline-none cursor-pointer focus:border-forest-500 transition-colors shadow-sm"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              setAwbInput(order.awbNumber || "");
                              setAwbError(null);
                              setAwbEditingId(order.id);
                            }}
                            className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:text-forest-600 hover:border-forest-200 hover:bg-forest-50 transition-colors"
                            title="Edit AWB Number"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setDeletingId(order.id);
                            }}
                            className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <tr className="bg-stone-50/40">
                        <td
                          colSpan={8}
                          className="p-6 pl-8 sm:pl-16 border-b"
                          style={{ borderColor: "var(--color-stone-200)" }}
                        >
                          {renderExpandedDetails(order)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          </div>
        </>
      ) : (
        <div className="p-12 text-center text-stone-500 font-medium">
          {filter === "active"
            ? "No pending or processing orders right now."
            : "No customer orders found in the database."}
        </div>
      )}

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
                    Delete Order
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Are you sure you want to delete this order? This will permanently delete the order and all its items from the database.
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
                  onClick={() => handleDeleteOrder(deletingId)}
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
      {/* AWB Edit Modal */}
      {awbEditingId && (
        <div className="fixed inset-0 z-[110] overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => !awbSaving && setAwbEditingId(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md rounded-3xl border shadow-2xl p-6 bg-white space-y-5"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--color-forest-50)", color: "var(--color-forest-600)" }}>
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
                      AWB / Tracking Number
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Order #{awbEditingId.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAwbEditingId(null)}
                  disabled={awbSaving}
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                  Enter AWB Number
                </label>
                <input
                  type="text"
                  value={awbInput}
                  onChange={(e) => setAwbInput(e.target.value)}
                  placeholder="e.g. 1234567890"
                  className="w-full px-4 py-3 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                  style={{ background: "white", borderColor: "var(--color-stone-200)" }}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveAwb(); }}
                />
                {awbError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertTriangle size={12} /> {awbError}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAwbEditingId(null)}
                  disabled={awbSaving}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAwb}
                  disabled={awbSaving}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-75 transition-colors"
                  style={{ background: "var(--color-forest-600)" }}
                >
                  {awbSaving ? (
                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  ) : (
                    <><Package size={16} /> Save AWB</>
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
