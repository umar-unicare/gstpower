export interface SupplierBillFile {
  name: string;
  type: string;
  dataUrl: string;
  size: number;
}

export interface SupplierBill {
  id: string;
  supplierName: string;
  description: string;
  purchaseDate: string;
  files: SupplierBillFile[];
  createdAt: string;
}
