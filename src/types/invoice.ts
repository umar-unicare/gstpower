export interface Customer {
  name: string;
  mobile: string;
  address?: string;
  gstin?: string;
}

export interface InvoiceItem {
  id: string;
  productName: string;
  hsnSac?: string;
  qty: number;
  unitPrice: number;
  discount?: number;
  taxPercent: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  lineTotal: number;
}

export interface EWayDetails {
  billNo?: string;
  generatedDate?: string;
  validUpto?: string;
  distance?: string;
  transporterName?: string;
  vehicleNumber?: string;
  from?: string;
  to?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  shopId?: 'shop1' | 'shop2';
  customer: Customer;
  items: InvoiceItem[];
  taxPercent: number;
  subTotal: number;
  totalDiscount?: number;
  totalCGST: number;
  totalSGST: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  ewayGenerated: boolean;
  ewayDetails?: EWayDetails;
  createdAt: string;
  createdBy?: string;
  printedAt?: string[];
}

