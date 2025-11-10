import { InvoiceItem } from '@/types/invoice';

export function calculateLineItem(
  qty: number,
  unitPrice: number,
  discount: number = 0,
  taxPercent: number
): Partial<InvoiceItem> {
  const taxableValue = qty * unitPrice - discount;
  const taxAmount = (taxableValue * taxPercent) / 100;
  const cgst = taxAmount / 2;
  const sgst = taxAmount / 2;
  const lineTotal = taxableValue + taxAmount;

  return {
    taxableValue: Number(taxableValue.toFixed(2)),
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    lineTotal: Number(lineTotal.toFixed(2)),
  };
}

export function calculateInvoiceTotals(items: InvoiceItem[]) {
  const subTotal = items.reduce((sum, item) => sum + item.taxableValue, 0);
  const totalCGST = items.reduce((sum, item) => sum + item.cgst, 0);
  const totalSGST = items.reduce((sum, item) => sum + item.sgst, 0);
  const totalTax = totalCGST + totalSGST;
  const beforeRounding = subTotal + totalTax;
  const grandTotal = Math.round(beforeRounding);
  const roundOff = grandTotal - beforeRounding;

  return {
    subTotal: Number(subTotal.toFixed(2)),
    totalCGST: Number(totalCGST.toFixed(2)),
    totalSGST: Number(totalSGST.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    roundOff: Number(roundOff.toFixed(2)),
    grandTotal,
  };
}

export function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const convert = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
  };

  return convert(Math.floor(num)) + ' Only';
}
