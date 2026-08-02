import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getAllOrders } from "@/actions/adminData";

export const runtime = "nodejs";

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function money(value: number | null | undefined): number | string {
  if (value == null) return "";
  return Math.round(value * 100) / 100;
}

export async function GET() {
  try {
    const orders = await getAllOrders();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Minaliya Admin";
    workbook.created = new Date();

    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, color: { argb: "FFFFFFFF" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4F1F" } },
      alignment: { vertical: "middle", horizontal: "center" },
    };

    const moneyFormat = "#,##0.00";

    // ─── Sheet 1: Orders ─────────────────────────────────
    const ordersSheet = workbook.addWorksheet("Orders");
    const orderColumns: { header: string; key: string; width: number }[] = [
      { header: "Order ID", key: "id", width: 30 },
      { header: "Order Date", key: "date", width: 20 },
      { header: "Customer Name", key: "customerName", width: 22 },
      { header: "Email", key: "email", width: 28 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "Address", key: "address", width: 34 },
      { header: "City", key: "city", width: 16 },
      { header: "State", key: "state", width: 16 },
      { header: "Pincode", key: "pincode", width: 12 },
      { header: "Order Notes", key: "notes", width: 28 },
      { header: "Items", key: "items", width: 46 },
      { header: "Item Count", key: "itemCount", width: 10 },
      { header: "Subtotal", key: "subtotal", width: 12 },
      { header: "Discount", key: "discount", width: 12 },
      { header: "Shipping", key: "shipping", width: 12 },
      { header: "Round Off", key: "roundOff", width: 12 },
      { header: "GST", key: "gst", width: 12 },
      { header: "Total Amount", key: "total", width: 14 },
      { header: "Payment Method", key: "paymentMethod", width: 14 },
      { header: "Payment Status", key: "paymentStatus", width: 14 },
      { header: "Order Status", key: "status", width: 16 },
      { header: "AWB Number", key: "awb", width: 18 },
      { header: "Invoice Number", key: "invoiceNumber", width: 20 },
      { header: "Invoice Generated", key: "invoiceGenerated", width: 16 },
      { header: "Invoice URL", key: "invoiceUrl", width: 42 },
    ];
    ordersSheet.columns = orderColumns;

    for (const order of orders) {
      const addr = order.shippingAddress || {};
      const itemsSummary = order.items
        .map((item) => `${item.quantity}x ${item.productName} (₹${money(item.price)})`)
        .join("\n");
      const pd = order.priceDetails;

      ordersSheet.addRow({
        id: order.id,
        date: formatDate(order.createdAt),
        customerName: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: addr.address || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pinCode || "",
        notes: addr.notes || "",
        items: itemsSummary,
        itemCount: order.items.length,
        subtotal: money(pd?.subtotal),
        discount: money(pd?.discount),
        shipping: money(pd?.shipping),
        roundOff: money(pd?.roundOff),
        gst: money(pd?.gst),
        total: money(order.totalAmount),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        awb: order.awbNumber || "",
        invoiceNumber: order.invoiceNumber || "",
        invoiceGenerated: order.invoiceGenerated ? "Yes" : "No",
        invoiceUrl: order.invoiceUrl || "",
      });
    }

    // Style header row
    ordersSheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });
    ordersSheet.getRow(1).height = 22;

    // Money columns as real numbers
    const moneyKeys = ["subtotal", "discount", "shipping", "roundOff", "gst", "total"];
    ordersSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      for (const key of moneyKeys) {
        const col = ordersSheet.getColumn(key);
        if (col && col.number) {
          const cell = row.getCell(col.number);
          if (typeof cell.value === "number") {
            cell.numFmt = moneyFormat;
          }
        }
      }
    });

    // Wrap text for Items & Notes columns
    const wrapCols = ["items", "notes", "address"];
    for (const key of wrapCols) {
      const col = ordersSheet.getColumn(key);
      if (col && col.number) {
        col.eachCell((cell) => {
          cell.alignment = { wrapText: true, vertical: "top" };
        });
      }
    }

    ordersSheet.views = [{ state: "frozen", ySplit: 1 }];
    ordersSheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: Math.max(orders.length + 1, 2), column: orderColumns.length },
    };

    // ─── Sheet 2: Order Items ────────────────────────────
    const itemsSheet = workbook.addWorksheet("Order Items");
    itemsSheet.columns = [
      { header: "Order ID", key: "orderId", width: 30 },
      { header: "Order Date", key: "date", width: 20 },
      { header: "Customer Name", key: "customerName", width: 22 },
      { header: "Product Name", key: "productName", width: 40 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Unit Price", key: "unitPrice", width: 12 },
      { header: "Line Total", key: "lineTotal", width: 14 },
    ];

    for (const order of orders) {
      for (const item of order.items) {
        itemsSheet.addRow({
          orderId: order.id,
          date: formatDate(order.createdAt),
          customerName: order.customerName,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: money(item.price),
          lineTotal: money(item.price * item.quantity),
        });
      }
    }

    itemsSheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });
    itemsSheet.getRow(1).height = 22;
    itemsSheet.views = [{ state: "frozen", ySplit: 1 }];
    itemsSheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: Math.max(itemsSheet.rowCount, 2), column: 7 },
    };

    const buffer = await workbook.xlsx.writeBuffer();

    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="minaliya-orders-${date}.xlsx"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to export orders.";
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error exporting orders:", error);
    return NextResponse.json({ error: "Failed to export orders" }, { status: 500 });
  }
}
