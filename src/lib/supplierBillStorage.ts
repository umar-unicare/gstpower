import { SupplierBill } from '@/types/supplierBill';

const STORAGE_KEY = 'supplier_bills';

export const getSupplierBills = (): SupplierBill[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading supplier bills:', error);
    return [];
  }
};

export const saveSupplierBill = (bill: SupplierBill): void => {
  try {
    const bills = getSupplierBills();
    bills.unshift(bill);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
  } catch (error) {
    console.error('Error saving supplier bill:', error);
    throw new Error('Failed to save supplier bill. Storage might be full.');
  }
};

export const deleteSupplierBill = (id: string): void => {
  try {
    const bills = getSupplierBills().filter(bill => bill.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
  } catch (error) {
    console.error('Error deleting supplier bill:', error);
    throw new Error('Failed to delete supplier bill.');
  }
};
