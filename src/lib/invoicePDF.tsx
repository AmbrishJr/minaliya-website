import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { numberToWords } from "./numberToWords";

export interface InvoiceItem {
  sno: number;
  productName: string;
  hsnSac?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  discount: number;
  gstPercent: number;
  totalPrice: number;
}

export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGst: string;
  companyFssai: string;
  logoUrl: string;
  invoiceNumber: string;
  orderId: string;
  invoiceDate: string;
  invoiceTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress: string;
  customerState: string;
  customerPincode: string;
  items: InvoiceItem[];
  subtotal: number;
  couponDiscount: number;
  shippingCharges: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  grandTotal: number;
  amountPaid: number;
  balance: number;
}

function fmt(amount: number): string {
  return "\u20B9" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#F7F7F5",
    color: "#1A1A1A",
    fontSize: 13,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  companyName: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
  },
  companyDetails: {
    fontSize: 13,
    color: "#4A4A4A",
    lineHeight: 1.6,
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
  title: {
    textAlign: "center",
    color: "#9A9A9A",
    fontSize: 14,
    letterSpacing: 3,
    marginVertical: 30,
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  billToLabel: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 6,
  },
  billToDetails: {
    fontSize: 13,
    color: "#2A2A2A",
    lineHeight: 1.6,
  },
  invoiceMeta: {
    textAlign: "right",
    fontSize: 13,
    lineHeight: 1.9,
  },
  metaKey: { color: "#6B6B6B" },
  metaValue: { fontWeight: 700, color: "#1A1A1A" },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#9B8FD9",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 700,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E2",
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: 700,
    borderTopWidth: 2,
    borderTopColor: "#1A1A1A",
  },
  colSno: { width: "6%", textAlign: "center" },
  colName: { width: "20%", paddingRight: 4 },
  colHsn: { width: "12%", textAlign: "center" },
  colQty: { width: "8%", textAlign: "center" },
  colUnit: { width: "8%", textAlign: "center" },
  colPrice: { width: "12%", textAlign: "right" },
  colDisc: { width: "10%", textAlign: "right" },
  colGst: { width: "12%", textAlign: "right" },
  colAmount: { width: "12%", textAlign: "right" },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  leftCol: { maxWidth: 400 },
  sectionLabel: { fontWeight: 700, fontSize: 13, marginBottom: 6, marginTop: 20 },
  sectionText: { fontSize: 13, color: "#2A2A2A" },
  summary: { width: 300 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, fontSize: 13 },
  sumKey: { color: "#4A4A4A", fontWeight: 600 },
  sumVal: { fontWeight: 600 },
  sumEmphasizeKey: { color: "#1A1A1A", fontWeight: 700 },
  sumEmphasizeVal: { fontWeight: 700, color: "#1A1A1A" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 60,
  },
  footNote: { fontSize: 12, color: "#9A9A9A" },
  footSign: { textAlign: "right", fontSize: 13 },
  forText: { fontWeight: 700, marginBottom: 40 },
});

function SummaryRow({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <View style={styles.sumRow}>
      <Text style={emphasize ? styles.sumEmphasizeKey : styles.sumKey}>{label}</Text>
      <Text style={emphasize ? styles.sumEmphasizeVal : styles.sumVal}>{value}</Text>
    </View>
  );
}

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  const totalQty = data.items.reduce((s, i) => s + i.quantity, 0);
  const totalDisc = data.items.reduce((s, i) => s + i.discount, 0);
  const totalGst = data.items.reduce(
    (s, i) => s + (i.pricePerUnit - i.discount) * i.quantity * (i.gstPercent / 100), 0
  );
  const isIntraState = data.igst === 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{data.companyName}</Text>
            <View style={styles.companyDetails}>
              <Text>{data.companyAddress.replace(/<br\s*\/?>/g, "\n")}</Text>
              <Text>FSSAI LICENSE NO: {data.companyFssai}</Text>
              <Text>GSTIN: {data.companyGst}</Text>
              <Text>Email: {data.companyEmail}</Text>
              <Text>Phone: {data.companyPhone}</Text>
            </View>
          </View>
          <Image style={styles.logo} src={data.logoUrl} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Tax Invoice</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.billToLabel}>Bill To:</Text>
            <View style={styles.billToDetails}>
              <Text>{data.customerName}</Text>
              <Text>{data.billingAddress}</Text>
              <Text>{data.customerState}, {data.customerPincode}</Text>
              <Text>Ph: {data.customerPhone}</Text>
            </View>
          </View>
          <View style={styles.invoiceMeta}>
            <Text>
              <Text style={styles.metaKey}>Invoice Number: </Text>
              <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
            </Text>
            <Text>
              <Text style={styles.metaKey}>Order Id: </Text>
              <Text style={styles.metaValue}>{data.orderId}</Text>
            </Text>
            <Text>
              <Text style={styles.metaKey}>Date: </Text>
              <Text style={styles.metaValue}>{data.invoiceDate}</Text>
            </Text>
            <Text>
              <Text style={styles.metaKey}>Time: </Text>
              <Text style={styles.metaValue}>{data.invoiceTime}</Text>
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableHeader}>
            <Text style={styles.colSno}>SNo</Text>
            <Text style={styles.colName}>Item Name</Text>
            <Text style={styles.colHsn}>HSN/SAC</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colUnit}>Unit</Text>
            <Text style={styles.colPrice}>Price/Unit</Text>
            <Text style={styles.colDisc}>Discount</Text>
            <Text style={styles.colGst}>GST</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          {/* Data Rows */}
          {data.items.map((item) => {
            const gstAmount = (item.pricePerUnit - item.discount) * item.quantity * (item.gstPercent / 100);
            return (
              <View key={item.sno} style={styles.tableRow} wrap={false}>
                <Text style={styles.colSno}>{item.sno}</Text>
                <Text style={styles.colName}>{item.productName}</Text>
                <Text style={styles.colHsn}>{item.hsnSac || "\u2014"}</Text>
                <Text style={styles.colQty}>{item.quantity.toFixed(2)}</Text>
                <Text style={styles.colUnit}>{item.unit}</Text>
                <Text style={styles.colPrice}>{fmt(item.pricePerUnit)}</Text>
                <Text style={styles.colDisc}>{fmt(item.discount)}</Text>
                <Text style={styles.colGst}>{fmt(gstAmount)}</Text>
                <Text style={styles.colAmount}>{fmt(item.totalPrice)}</Text>
              </View>
            );
          })}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <Text style={styles.colSno}></Text>
            <Text style={styles.colName}>Total</Text>
            <Text style={styles.colHsn}></Text>
            <Text style={styles.colQty}>{totalQty.toFixed(2)}</Text>
            <Text style={styles.colUnit}></Text>
            <Text style={styles.colPrice}></Text>
            <Text style={styles.colDisc}>{fmt(totalDisc)}</Text>
            <Text style={styles.colGst}>{fmt(totalGst)}</Text>
            <Text style={styles.colAmount}>{fmt(data.grandTotal)}</Text>
          </View>
        </View>

        {/* Bottom */}
        <View style={styles.bottom}>
          <View style={styles.leftCol}>
            <Text style={styles.sectionLabel}>INVOICE AMOUNT IN WORDS</Text>
            <Text style={styles.sectionText}>{numberToWords(data.grandTotal)}</Text>

            <Text style={styles.sectionLabel}>TERMS AND CONDITIONS</Text>
            <Text style={styles.sectionText}>Terms and Conditions apply.</Text>
          </View>

          <View style={styles.summary}>
            <SummaryRow label="Sub Total" value={fmt(data.subtotal)} />
            <SummaryRow label="Discount" value={fmt(data.couponDiscount)} />
            {isIntraState ? (
              <>
                <SummaryRow label="SGST@2.50%" value={fmt(data.sgst)} />
                <SummaryRow label="CGST@2.50%" value={fmt(data.cgst)} />
              </>
            ) : (
              <SummaryRow label="IGST@5.00%" value={fmt(data.igst)} />
            )}
            <SummaryRow label="Round Off" value={fmt(data.roundOff)} />
            <SummaryRow label="Total Amount" value={fmt(data.grandTotal)} emphasize />
            <SummaryRow label="Received" value={fmt(data.amountPaid)} emphasize />
            <SummaryRow label="Balance" value={fmt(data.balance)} emphasize />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footNote}>This is a computer generated invoice. No signature is required.</Text>
          <View style={styles.footSign}>
            <Text style={styles.forText}>For {data.companyName}</Text>
            <Text>Authorized Signatory</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
