// import { Invoice } from '@/types/invoice';

// export interface ShopDetails {
//   name: string;
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   phones: string[]; // Array of 4 phone numbers
//   email?: string;
//   gstin: string;
//   bankName?: string;
//   accountNumber?: string;
//   ifscCode?: string;
//   branch?: string;
// }

// export interface ShopsData {
//   shop1: ShopDetails;
//   shop2: ShopDetails;
//   bankName?: string;
//   accountNumber?: string;
//   ifscCode?: string;
//   branch?: string;
// }

// const INVOICES_KEY = 'newpower_invoices';
// const SHOPS_DATA_KEY = 'newpower_shops_data';
// const INVOICE_COUNTER_KEY = 'newpower_invoice_counter';

// export const defaultShopsData: ShopsData = {
//   shop1: {
//     name: 'New Power Home Appliance & Furniture',
//     address: 'Raja Complex, Palanakuppam X-Road',
//     city: 'Vaniyambadi',
//     state: 'Tamil Nadu',
//     pincode: '635851',
//     phones: ['9443553041', '', '', ''],
//     email: 'newpower@example.com',
//     gstin: '33DDOPS2231K129',
//   },
//   shop2: {
//     name: 'New Power Home Appliance & Furniture',
//     address: 'Second Location Address',
//     city: 'Vaniyambadi',
//     state: 'Tamil Nadu',
//     pincode: '635851',
//     phones: ['9443553041', '', '', ''],
//     email: 'newpower@example.com',
//     gstin: '33DDOPS2231K130',
//   },
//   bankName: 'Bank of Baroda',
//   accountNumber: '05480500010418',
//   ifscCode: 'BARBODHADHA',
//   branch: 'Dharmapuri',
// };

// export function getInvoices(): Invoice[] {
//   const data = localStorage.getItem(INVOICES_KEY);
//   return data ? JSON.parse(data) : [];
// }

// export function saveInvoice(invoice: Invoice): void {
//   const invoices = getInvoices();
//   const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
  
//   if (existingIndex >= 0) {
//     invoices[existingIndex] = invoice;
//   } else {
//     invoices.push(invoice);
//   }
  
//   localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
// }

// export function getInvoiceById(id: string): Invoice | undefined {
//   return getInvoices().find(inv => inv.id === id);
// }

// export function deleteInvoice(id: string): void {
//   const invoices = getInvoices().filter(inv => inv.id !== id);
//   localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
// }

// export function getNextInvoiceNumber(): string {
//   const counter = localStorage.getItem(INVOICE_COUNTER_KEY);
//   const nextNumber = counter ? parseInt(counter) + 1 : 1;
//   localStorage.setItem(INVOICE_COUNTER_KEY, nextNumber.toString());
//   return `INV/${new Date().getFullYear()}/${String(nextNumber).padStart(4, '0')}`;
// }

// export function getShopsData(): ShopsData {
//   const data = localStorage.getItem(SHOPS_DATA_KEY);
//   return data ? JSON.parse(data) : defaultShopsData;
// }

// export function saveShopsData(details: ShopsData): void {
//   localStorage.setItem(SHOPS_DATA_KEY, JSON.stringify(details));
// }

// export function getShopDetails(shopId: 'shop1' | 'shop2' = 'shop1'): ShopDetails {
//   const shopsData = getShopsData();
//   const shop = shopsData[shopId];
//   // Merge bank details into shop details
//   return {
//     ...shop,
//     bankName: shopsData.bankName,
//     accountNumber: shopsData.accountNumber,
//     ifscCode: shopsData.ifscCode,
//     branch: shopsData.branch,
//   };
// }

// export function searchInvoices(query: string, dateFrom?: string, dateTo?: string): Invoice[] {
//   const invoices = getInvoices();
//   const lowerQuery = query.toLowerCase();
  
//   return invoices.filter(inv => {
//     const matchesQuery = 
//       inv.invoiceNumber.toLowerCase().includes(lowerQuery) ||
//       inv.customer.name.toLowerCase().includes(lowerQuery) ||
//       inv.customer.mobile.includes(query);
    
//     if (!matchesQuery) return false;
    
//     if (dateFrom && inv.date < dateFrom) return false;
//     if (dateTo && inv.date > dateTo) return false;
    
//     return true;
//   }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
// }


import { Invoice } from '@/types/invoice';

export interface ShopDetails {
  name: string;
  tamilName?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phones: string[]; // Array of 4 phone numbers
  email?: string;
  gstin: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
}

export interface ShopsData {
  shop1: ShopDetails;
  shop2: ShopDetails;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
}

const INVOICES_KEY = 'newpower_invoices';
const SHOPS_DATA_KEY = 'newpower_shops_data';
const INVOICE_COUNTER_KEY = 'newpower_invoice_counter';

export const defaultShopsData: ShopsData = {
  shop1: {
    name: 'New Power Home Appliance & Furniture',
    tamilName: 'நியூ பவர் ஹோம் அப்ளையன்ஸ் & ஃபர்னிச்சர்',
    address: 'Raja Complex, Palanakuppam X-Road',
    city: 'Vaniyambadi',
    state: 'Tamil Nadu',
    pincode: '635851',
    phones: ['9443553041', '', '', ''],
    email: 'newpower@example.com',
    gstin: '33DDOPS2231K129',
  },
  shop2: {
    name: 'New Power Home Appliance & Furniture',
    tamilName: 'நியூ பவர் ஹோம் அப்ளையன்ஸ் & ஃபர்னிச்சர்',
    address: 'Second Location Address',
    city: 'Vaniyambadi',
    state: 'Tamil Nadu',
    pincode: '635851',
    phones: ['9443553041', '', '', ''],
    email: 'newpower@example.com',
    gstin: '33DDOPS2231K130',
  },
  bankName: 'Bank of Baroda',
  accountNumber: '05480500010418',
  ifscCode: 'BARBODHADHA',
  branch: 'Dharmapuri',
};

export function getInvoices(): Invoice[] {
  const data = localStorage.getItem(INVOICES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getInvoices();
  const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
  
  if (existingIndex >= 0) {
    invoices[existingIndex] = invoice;
  } else {
    invoices.push(invoice);
  }
  
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function getInvoiceById(id: string): Invoice | undefined {
  return getInvoices().find(inv => inv.id === id);
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter(inv => inv.id !== id);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function getNextInvoiceNumber(): string {
  const counter = localStorage.getItem(INVOICE_COUNTER_KEY);
  const nextNumber = counter ? parseInt(counter) + 1 : 1;
  localStorage.setItem(INVOICE_COUNTER_KEY, nextNumber.toString());
  return `INV/${new Date().getFullYear()}/${String(nextNumber).padStart(4, '0')}`;
}

export function getShopsData(): ShopsData {
  const data = localStorage.getItem(SHOPS_DATA_KEY);
  return data ? JSON.parse(data) : defaultShopsData;
}

export function saveShopsData(details: ShopsData): void {
  localStorage.setItem(SHOPS_DATA_KEY, JSON.stringify(details));
}

export function getShopDetails(shopId: 'shop1' | 'shop2' = 'shop1'): ShopDetails {
  const shopsData = getShopsData();
  const shop = shopsData[shopId];
  // Merge bank details into shop details
  return {
    ...shop,
    bankName: shopsData.bankName,
    accountNumber: shopsData.accountNumber,
    ifscCode: shopsData.ifscCode,
    branch: shopsData.branch,
  };
}

export function searchInvoices(query: string, dateFrom?: string, dateTo?: string): Invoice[] {
  const invoices = getInvoices();
  const lowerQuery = query.toLowerCase();
  
  return invoices.filter(inv => {
    const matchesQuery = 
      inv.invoiceNumber.toLowerCase().includes(lowerQuery) ||
      inv.customer.name.toLowerCase().includes(lowerQuery) ||
      inv.customer.mobile.includes(query);
    
    if (!matchesQuery) return false;
    
    if (dateFrom && inv.date < dateFrom) return false;
    if (dateTo && inv.date > dateTo) return false;
    
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
