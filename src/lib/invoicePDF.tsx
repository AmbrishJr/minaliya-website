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
    backgroundColor: "#FFFFFF",
    color: "#111111",
    fontSize: 15,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: {
    width: "70%",
  },
  companyName: {
    fontSize: 36,
    fontWeight: 700,
    color: "#111111",
    marginBottom: 8,
  },
  companyAddress: {
    fontSize: 16,
    color: "#111111",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 15,
    color: "#111111",
    lineHeight: 1.8,
  },
  logo: {
    width: 95,
    height: 95,
    objectFit: "contain",
  },
  title: {
    textAlign: "center",
    color: "#666666",
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: 4,
    marginVertical: 30,
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  billToSection: {
    width: "55%",
  },
  billToLabel: {
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
  },
  billToDetails: {
    fontSize: 15,
    color: "#111111",
    lineHeight: 1.8,
  },
  invoiceMetaSection: {
    width: "45%",
    alignItems: "flex-end",
  },
  invoiceMetaLabel: {
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
    textAlign: "right",
  },
  invoiceMeta: {
    fontSize: 15,
    lineHeight: 1.8,
    textAlign: "right",
  },
  metaKey: { fontWeight: 700, color: "#111111" },
  metaValue: { color: "#111111" },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#A68CF3",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: 700,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 8,
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    minHeight: 54,
    alignItems: "center",
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: 700,
    borderTopWidth: 2,
    borderTopColor: "#111111",
    alignItems: "center",
  },
  colSno: { width: "5%", textAlign: "center" },
  colName: { width: "40%", paddingRight: 4 },
  colHsn: { width: "10%", textAlign: "center" },
  colQty: { width: "7%", textAlign: "center" },
  colUnit: { width: "7%", textAlign: "center" },
  colPrice: { width: "10%", textAlign: "right" },
  colDisc: { width: "8%", textAlign: "right" },
  colGst: { width: "8%", textAlign: "right" },
  colAmount: { width: "10%", textAlign: "right" },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  leftCol: { width: "60%" },
  rightCol: { width: "40%" },
  sectionLabel: {
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
    marginTop: 20,
    textTransform: "uppercase",
  },
  sectionText: { fontSize: 15, color: "#111111" },
  summary: { marginTop: 20 },
  sumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    fontSize: 15,
  },
  sumKey: { color: "#111111", fontWeight: 600 },
  sumVal: { fontWeight: 600, color: "#111111" },
  sumEmphasizeKey: { color: "#111111", fontWeight: 700 },
  sumEmphasizeVal: { fontWeight: 700, color: "#111111" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 60,
  },
  footNote: { fontSize: 13, color: "#666666" },
  footSign: { textAlign: "right", fontSize: 15 },
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
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>{data.companyName}</Text>
            <Text style={styles.companyAddress}>{data.companyAddress.replace(/<br\s*\/?>/g, "\n")}</Text>
            <View style={styles.companyDetails}>
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

        {/* Customer + Invoice Details */}
        <View style={styles.metaRow}>
          <View style={styles.billToSection}>
            <Text style={styles.billToLabel}>Bill To:</Text>
            <View style={styles.billToDetails}>
              <Text>{data.customerName}</Text>
              <Text>{data.billingAddress}</Text>
              <Text>{data.customerState}, {data.customerPincode}</Text>
              <Text>Ph: {data.customerPhone}</Text>
            </View>
          </View>
          <View style={styles.invoiceMetaSection}>
            <Text style={styles.invoiceMetaLabel}>Invoice Information</Text>
            <View style={styles.invoiceMeta}>
              <Text>
                <Text style={styles.metaKey}>Invoice Number: </Text>
                <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
              </Text>
              <Text>
                <Text style={styles.metaKey}>Order ID: </Text>
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
        </View>

        {/* Table */}
        <View style={styles.table}>
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
                <Text style={styles.colGst}>
                  {fmt(gstAmount)}{"\n"}
                  <Text style={{ fontSize: 12, color: "#666666" }}>({item.gstPercent.toFixed(2)}%)</Text>
                </Text>
                <Text style={styles.colAmount}>{fmt(item.totalPrice)}</Text>
              </View>
            );
          })}

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

        {/* Lower Section */}
        <View style={styles.bottom}>
          <View style={styles.leftCol}>
            <Text style={styles.sectionLabel}>Invoice Amount in Words</Text>
            <Text style={styles.sectionText}>{numberToWords(data.grandTotal)}</Text>

            <Text style={styles.sectionLabel}>Terms and Conditions</Text>
            <Text style={styles.sectionText}>Terms and Conditions apply.</Text>
          </View>

          <View style={styles.rightCol}>
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footNote}>This is a computer generated invoice.{"\n"}No signature is required.</Text>
          <View style={styles.footSign}>
            <Text style={styles.forText}>For {data.companyName}</Text>
            <Text>Authorized Signatory</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
