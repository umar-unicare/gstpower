export interface SupplierBillFile {
  id?: number;
  name: string;
  type: string;
  dataUrl?: string; // Used for upload
  url?: string; // Used for display from backend (S3/local URL)
  size?: number;
}

export interface SupplierBill {
  id: string;
  supplierName: string;
  description: string;
  purchaseDate: string;
  files: SupplierBillFile[];
  createdAt: string;
}
