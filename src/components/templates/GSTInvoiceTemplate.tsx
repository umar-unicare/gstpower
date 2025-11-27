// // import React from 'react';
// // import { Invoice } from '@/types/invoice';
// // import { getShopDetails } from '@/lib/storage';
// // import { numberToWords } from '@/lib/invoiceCalculations';
// // import shopLogo from '@/assets/shop-logo.png';

// // interface GSTInvoiceTemplateProps {
// //   invoice: Invoice;
// // }

// // export function GSTInvoiceTemplate({ invoice }: GSTInvoiceTemplateProps) {
// //   const shop = getShopDetails(invoice.shopId || 'shop1');

// //   return (
// //     <div className="w-full max-w-[210mm] mx-auto bg-white text-black p-2 sm:p-4 md:p-8 text-[10px] sm:text-xs md:text-sm print:w-[210mm] print:p-8 print:text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
// //       {/* Header */}
// //       <div className="border-2 border-black">
// //         <div className="text-center border-b border-black p-3">
// //           <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">TAX INVOICE</h2>
// //         </div>

// //         <div className="text-center border-b-2 border-black p-2">
// //           <div className="flex items-center justify-center gap-3 mb-2">
// //             <img src={shopLogo} alt="Shop Logo" className="w-12 h-12 object-contain" />
// //              <h1 className="text-base sm:text-lg md:text-xl font-bold">நியூ பவர் ஹோம் அப்ளையன்ஸ் & ஃபர்னிச்சர்</h1><br />
// //             <h1 className="text-base sm:text-lg md:text-xl font-bold">{shop.name}</h1>
// //           </div>
// //           <p className="text-[9px] sm:text-[10px] md:text-xs">{shop.address}, {shop.city}</p>
// //           <p className="text-[9px] sm:text-[10px] md:text-xs">{shop.state} - {shop.pincode}</p>
// //           <p className="text-[9px] sm:text-[10px] md:text-xs">
// //             Contact: {shop.phones.filter(p => p).join(' | ')}
// //           </p>
// //           <p className="text-[9px] sm:text-[10px] md:text-xs">GSTIN: {shop.gstin}</p>
// //         </div>

// //         <div className="grid grid-cols-2 border-b border-black">
// //           <div className="border-r border-black p-2">
// //             <p className="text-xs">Invoice No: {invoice.invoiceNumber}</p>
// //             <p className="text-xs">Date: {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
// //           </div>
// //           <div className="p-2">
// //             <p className="text-xs">State: {shop.state}</p>
// //           </div>
// //         </div>

// //         {/* Customer Details */}
// //         <div className="grid grid-cols-2 border-b border-black">
// //           <div className="border-r border-black p-2">
// //             <p className="font-bold text-xs mb-1">Billed To:</p>
// //             <p className="text-xs font-semibold">{invoice.customer.name}</p>
// //             {invoice.customer.address && <p className="text-xs">{invoice.customer.address}</p>}
// //             <p className="text-xs">State: {shop.state}</p>
// //             {invoice.customer.gstin && <p className="text-xs">GSTIN: {invoice.customer.gstin}</p>}
// //             <p className="text-xs">{invoice.customer.mobile}</p>
// //           </div>
// //           <div className="p-2">
// //             <p className="font-bold text-xs mb-1">Shipped To:</p>
// //             <p className="text-xs font-semibold">{invoice.customer.name}</p>
// //             {invoice.customer.address && <p className="text-xs">{invoice.customer.address}</p>}
// //             <p className="text-xs">State: {shop.state}</p>
// //             <p className="text-xs">{invoice.customer.mobile}</p>
// //           </div>
// //         </div>

// //         {/* Items Table */}
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-[9px] sm:text-[10px] md:text-xs min-w-[600px]">
// //             <thead>
// //               <tr className="border-b border-black">
// //                 <th className="border-r border-black p-0.5 sm:p-1 text-left">SNo</th>
// //                 <th className="border-r border-black p-0.5 sm:p-1 text-left">Description</th>
// //                 <th className="border-r border-black p-0.5 sm:p-1 text-left">HSN/SAC</th>
// //                 <th className="border-r border-black p-0.5 sm:p-1 text-right">Qty</th>
// //                 <th className="border-r border-black p-0.5 sm:p-1 text-right">Rate</th>
// //                 <th className="border-r border-black p-0.5 sm:p-1 text-right">Disc</th>
// //                 <th className="border-r border-black p-0.5 sm:p-1 text-right">CGST%</th>
// //                 <th className="border-r border-black p-0.5 sm:p-1 text-right">SGST%</th>
// //                 <th className="p-0.5 sm:p-1 text-right">Amount</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {invoice.items.map((item, index) => (
// //                 <tr key={item.id} className="border-b border-black">
// //                   <td className="border-r border-black p-0.5 sm:p-1">{index + 1}</td>
// //                   <td className="border-r border-black p-0.5 sm:p-1">{item.productName}</td>
// //                   <td className="border-r border-black p-0.5 sm:p-1">{item.hsnSac || '-'}</td>
// //                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.qty}</td>
// //                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.unitPrice.toFixed(2)}</td>
// //                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.discount?.toFixed(2) || '0.00'}</td>
// //                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{(item.taxPercent / 2).toFixed(2)}</td>
// //                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{(item.taxPercent / 2).toFixed(2)}</td>
// //                   <td className="p-0.5 sm:p-1 text-right">{item.lineTotal.toFixed(2)}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Summary */}
// //         <div className="grid grid-cols-2 border-t-2 border-black">
// //           <div className="border-r border-black p-2">
// //             <p className="text-xs font-bold mb-1">Terms & Conditions:</p>
// //             <ol className="text-xs list-decimal list-inside space-y-1">
// //               <li>Goods once sold cannot be taken back or exchanged.</li>
// //               <li>Subject to {shop.city} jurisdiction.</li>
// //             </ol>

// //             {shop.bankName && (
// //               <div className="mt-3">
// //                 <p className="text-xs font-bold">Bank Details:</p>
// //                 <p className="text-xs">Bank: {shop.bankName}</p>
// //                 {shop.accountNumber && <p className="text-xs">A/C No: {shop.accountNumber}</p>}
// //                 {shop.ifscCode && <p className="text-xs">IFSC: {shop.ifscCode}</p>}
// //                 {shop.branch && <p className="text-xs">Branch: {shop.branch}</p>}
// //               </div>
// //             )}
// //           </div>
// //           <div className="p-2">
// //             <div className="flex justify-between mb-1">
// //               <span className="text-xs">Sub Total:</span>
// //               <span className="text-xs font-semibold">{invoice.subTotal.toFixed(2)}</span>
// //             </div>
// //             {invoice.totalDiscount && invoice.totalDiscount > 0 && (
// //               <div className="flex justify-between mb-1">
// //                 <span className="text-xs">Discount:</span>
// //                 <span className="text-xs">-{invoice.totalDiscount.toFixed(2)}</span>
// //               </div>
// //             )}
// //             <div className="flex justify-between mb-1">
// //               <span className="text-xs">CGST:</span>
// //               <span className="text-xs">{invoice.totalCGST.toFixed(2)}</span>
// //             </div>
// //             <div className="flex justify-between mb-1">
// //               <span className="text-xs">SGST:</span>
// //               <span className="text-xs">{invoice.totalSGST.toFixed(2)}</span>
// //             </div>
// //             <div className="flex justify-between mb-1">
// //               <span className="text-xs">Round Off:</span>
// //               <span className="text-xs">{invoice.roundOff.toFixed(2)}</span>
// //             </div>
// //             <div className="flex justify-between border-t border-black pt-1 mt-1">
// //               <span className="text-xs font-bold">Total:</span>
// //               <span className="text-xs font-bold">{invoice.grandTotal.toFixed(2)}</span>
// //             </div>
// //             <p className="text-xs mt-2 italic">
// //               Rupees: {numberToWords(invoice.grandTotal)}
// //             </p>

// //             <div className="mt-4 text-right">
// //               <p className="text-xs">for {shop.name}</p>
// //               <p className="text-xs mt-8">Authorised Signatory</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React from 'react';
// import { Invoice } from '@/types/invoice';
// import { getShopDetails } from '@/lib/storage';
// import { numberToWords } from '@/lib/invoiceCalculations';
// import shopLogo from '@/assets/shop-logo.png';

// interface GSTInvoiceTemplateProps {
//   invoice: Invoice;
// }

// export function GSTInvoiceTemplate({ invoice }: GSTInvoiceTemplateProps) {
//   const shop = getShopDetails(invoice.shopId || 'shop1');

//   return (
//     <div className="w-full max-w-[210mm] mx-auto bg-white text-black p-2 sm:p-4 md:p-8 text-[10px] sm:text-xs md:text-sm print:w-[210mm] print:p-8 print:text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
//       {/* Header */}
//       <div className="border-2 border-black">
//         <div className="text-center border-b border-black p-3">
//           <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">TAX INVOICE</h2>
//         </div>

//         <div className="text-center border-b-2 border-black p-2">
//           <div className="flex items-center justify-center gap-3 mb-2">
//             <img src={shopLogo} alt="Shop Logo" className="w-14 h-14 object-contain" />
//             <div>
//               {shop.tamilName && (
//                 <h1 className="text-sm sm:text-base md:text-lg font-bold">{shop.tamilName}</h1>
//               )}
//               <h1 className="text-base sm:text-lg md:text-xl font-bold">{shop.name}</h1>
//             </div>
//           </div>
//           <p className="text-[9px] sm:text-[10px] md:text-xs">{shop.address}, {shop.city}</p>
//           <p className="text-[9px] sm:text-[10px] md:text-xs">{shop.state} - {shop.pincode}</p>
//           <p className="text-[9px] sm:text-[10px] md:text-xs">
//             Contact: {shop.phones.filter(p => p).join(' | ')}
//           </p>
//           <p className="text-[9px] sm:text-[10px] md:text-xs">GSTIN: {shop.gstin}</p>
//         </div>

//         <div className="grid grid-cols-2 border-b border-black">
//           <div className="border-r border-black p-2">
//             <p className="text-xs">Invoice No: {invoice.invoiceNumber}</p>
//             <p className="text-xs">Date: {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
//           </div>
//           <div className="p-2">
//             <p className="text-xs">State: {shop.state}</p>
//           </div>
//         </div>

//         {/* Customer Details */}
//         <div className="grid grid-cols-2 border-b border-black">
//           <div className="border-r border-black p-2">
//             <p className="font-bold text-xs mb-1">Billed To:</p>
//             <p className="text-xs font-semibold">{invoice.customer.name}</p>
//             {invoice.customer.address && <p className="text-xs">{invoice.customer.address}</p>}
//             <p className="text-xs">State: {shop.state}</p>
//             {invoice.customer.gstin && <p className="text-xs">GSTIN: {invoice.customer.gstin}</p>}
//             <p className="text-xs">{invoice.customer.mobile}</p>
//           </div>
//           <div className="p-2">
//             <p className="font-bold text-xs mb-1">Shipped To:</p>
//             <p className="text-xs font-semibold">{invoice.customer.name}</p>
//             {invoice.customer.address && <p className="text-xs">{invoice.customer.address}</p>}
//             <p className="text-xs">State: {shop.state}</p>
//             <p className="text-xs">{invoice.customer.mobile}</p>
//           </div>
//         </div>

//         {/* Items Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-[9px] sm:text-[10px] md:text-xs min-w-[600px]">
//             <thead>
//               <tr className="border-b border-black">
//                 <th className="border-r border-black p-0.5 sm:p-1 text-left">SNo</th>
//                 <th className="border-r border-black p-0.5 sm:p-1 text-left">Description</th>
//                 <th className="border-r border-black p-0.5 sm:p-1 text-left">HSN/SAC</th>
//                 <th className="border-r border-black p-0.5 sm:p-1 text-right">Qty</th>
//                 <th className="border-r border-black p-0.5 sm:p-1 text-right">Rate</th>
//                 <th className="border-r border-black p-0.5 sm:p-1 text-right">Disc</th>
//                 <th className="border-r border-black p-0.5 sm:p-1 text-right">CGST%</th>
//                 <th className="border-r border-black p-0.5 sm:p-1 text-right">SGST%</th>
//                 <th className="p-0.5 sm:p-1 text-right">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoice.items.map((item, index) => (
//                 <tr key={item.id} className="border-b border-black">
//                   <td className="border-r border-black p-0.5 sm:p-1">{index + 1}</td>
//                   <td className="border-r border-black p-0.5 sm:p-1">{item.productName}</td>
//                   <td className="border-r border-black p-0.5 sm:p-1">{item.hsnSac || '-'}</td>
//                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.qty}</td>
//                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.unitPrice.toFixed(2)}</td>
//                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.discount?.toFixed(2) || '0.00'}</td>
//                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{(item.taxPercent / 2).toFixed(2)}</td>
//                   <td className="border-r border-black p-0.5 sm:p-1 text-right">{(item.taxPercent / 2).toFixed(2)}</td>
//                   <td className="p-0.5 sm:p-1 text-right">{item.lineTotal.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Summary */}
//         <div className="grid grid-cols-2 border-t-2 border-black">
//           <div className="border-r border-black p-2">
//             <p className="text-xs font-bold mb-1">Terms & Conditions:</p>
//             <ol className="text-xs list-decimal list-inside space-y-1">
//               <li>Goods once sold cannot be taken back or exchanged.</li>
//               <li>Subject to {shop.city} jurisdiction.</li>
//             </ol>

//             {shop.bankName && (
//               <div className="mt-3">
//                 <p className="text-xs font-bold">Bank Details:</p>
//                 <p className="text-xs">Bank: {shop.bankName}</p>
//                 {shop.accountNumber && <p className="text-xs">A/C No: {shop.accountNumber}</p>}
//                 {shop.ifscCode && <p className="text-xs">IFSC: {shop.ifscCode}</p>}
//                 {shop.branch && <p className="text-xs">Branch: {shop.branch}</p>}
//               </div>
//             )}
//           </div>
//           <div className="p-2">
//             <div className="flex justify-between mb-1">
//               <span className="text-xs">Sub Total:</span>
//               <span className="text-xs font-semibold">{invoice.subTotal.toFixed(2)}</span>
//             </div>
//             {invoice.totalDiscount && invoice.totalDiscount > 0 && (
//               <div className="flex justify-between mb-1">
//                 <span className="text-xs">Discount:</span>
//                 <span className="text-xs">-{invoice.totalDiscount.toFixed(2)}</span>
//               </div>
//             )}
//             <div className="flex justify-between mb-1">
//               <span className="text-xs">CGST:</span>
//               <span className="text-xs">{invoice.totalCGST.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between mb-1">
//               <span className="text-xs">SGST:</span>
//               <span className="text-xs">{invoice.totalSGST.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between mb-1">
//               <span className="text-xs">Round Off:</span>
//               <span className="text-xs">{invoice.roundOff.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between border-t border-black pt-1 mt-1">
//               <span className="text-xs font-bold">Total:</span>
//               <span className="text-xs font-bold">{invoice.grandTotal.toFixed(2)}</span>
//             </div>
//             <p className="text-xs mt-2 italic">
//               Rupees: {numberToWords(invoice.grandTotal)}
//             </p>

//             <div className="mt-4 text-right">
//               <p className="text-xs">for {shop.name}</p>
//               <p className="text-xs mt-8">Authorised Signatory</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Invoice } from '@/types/invoice';
import { shopApi, ShopDetailsWithBank } from '@/lib/shopApi';
import { numberToWords } from '@/lib/invoiceCalculations';
import shopLogo from '@/assets/shop-logo.png';

interface GSTInvoiceTemplateProps {
  invoice: Invoice;
  accessToken: string;
}

export function GSTInvoiceTemplate({ invoice, accessToken }: GSTInvoiceTemplateProps) {
  const [shop, setShop] = useState<ShopDetailsWithBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const response = await shopApi.getShopDetailsById(
          invoice.shopId || 'shop1',
          accessToken
        );

        if (response.success && response.data) {
          setShop(response.data);
        } else {
          setError('Failed to load shop details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [invoice.shopId, accessToken]);

  if (loading) {
    return (
      <div className="w-full max-w-[210mm] mx-auto bg-white text-black p-8 flex items-center justify-center min-h-[297mm]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="w-full max-w-[210mm] mx-auto bg-white text-black p-8 flex items-center justify-center min-h-[297mm]">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">⚠️ Error</p>
          <p>{error || 'Shop details not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white text-black p-2 sm:p-4 md:p-8 text-[10px] sm:text-xs md:text-sm print:w-[210mm] print:p-8 print:text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-2 border-black">
        <div className="text-center border-b border-black p-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">TAX INVOICE</h2>
        </div>

        <div className="flex items-start justify-between border-b-2 border-black p-2">
          <div className="w-24 flex-shrink-0 flex justify-start">
            <img src={shopLogo} alt="Shop Logo" className="w-20 h-20 object-contain" />
          </div>
          <div className="flex-grow text-center px-2">
            <div>
              {shop.tamilName && (
                <h1 className="text-sm sm:text-base md:text-lg font-bold">{shop.tamilName}</h1>
              )}
              <h1 className="text-base sm:text-lg md:text-xl font-bold">{shop.name}</h1>
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs">{shop.address}, {shop.city}</p>
            <p className="text-[9px] sm:text-[10px] md:text-xs">{shop.state} - {shop.pincode}</p>
            <p className="text-[9px] sm:text-[10px] md:text-xs">
              Contact: {shop.phones.filter(p => p).join(' | ')}
            </p>
            <p className="text-[9px] sm:text-[10px] md:text-xs">GSTIN: {shop.gstin}</p>
          </div>
          <div className="w-24 flex-shrink-0"></div>
        </div>

        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-2">
            <p className="text-xs">Invoice No: {invoice.invoiceNumber}</p>
            <p className="text-xs">Date: {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="p-2">
            <p className="text-xs">State: {shop.state}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-2">
            <p className="font-bold text-xs mb-1">Billed To:</p>
            <p className="text-xs font-semibold">{invoice.customer.name}</p>
            {invoice.customer.address && <p className="text-xs">{invoice.customer.address}</p>}
            <p className="text-xs">State: {shop.state}</p>
            {invoice.customer.gstin && <p className="text-xs">GSTIN: {invoice.customer.gstin}</p>}
            <p className="text-xs">{invoice.customer.mobile}</p>
          </div>
          <div className="p-2">
            <p className="font-bold text-xs mb-1">Shipped To:</p>
            <p className="text-xs font-semibold">{invoice.customer.name}</p>
            {invoice.customer.address && <p className="text-xs">{invoice.customer.address}</p>}
            <p className="text-xs">State: {shop.state}</p>
            <p className="text-xs">{invoice.customer.mobile}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-[10px] md:text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-black p-0.5 sm:p-1 text-left">SNo</th>
                <th className="border-r border-black p-0.5 sm:p-1 text-left">Description</th>
                <th className="border-r border-black p-0.5 sm:p-1 text-left">HSN/SAC</th>
                <th className="border-r border-black p-0.5 sm:p-1 text-right">Qty</th>
                <th className="border-r border-black p-0.5 sm:p-1 text-right">Rate</th>
                <th className="border-r border-black p-0.5 sm:p-1 text-right">Disc</th>
                <th className="border-r border-black p-0.5 sm:p-1 text-right">CGST%</th>
                <th className="border-r border-black p-0.5 sm:p-1 text-right">SGST%</th>
                <th className="p-0.5 sm:p-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="border-b border-black">
                  <td className="border-r border-black p-0.5 sm:p-1">{index + 1}</td>
                  <td className="border-r border-black p-0.5 sm:p-1">{item.productName}</td>
                  <td className="border-r border-black p-0.5 sm:p-1">{item.hsnSac || '-'}</td>
                  <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.qty}</td>
                  <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.unitPrice.toFixed(2)}</td>
                  <td className="border-r border-black p-0.5 sm:p-1 text-right">{item.discount?.toFixed(2) || '0.00'}</td>
                  <td className="border-r border-black p-0.5 sm:p-1 text-right">{(item.taxPercent / 2).toFixed(2)}</td>
                  <td className="border-r border-black p-0.5 sm:p-1 text-right">{(item.taxPercent / 2).toFixed(2)}</td>
                  <td className="p-0.5 sm:p-1 text-right">{item.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 border-t-2 border-black">
          <div className="border-r border-black p-2">
            <p className="text-xs font-bold mb-1">Terms & Conditions:</p>
            <ol className="text-xs list-decimal list-inside space-y-1">
              <li>Goods once sold cannot be taken back or exchanged.</li>
              <li>Subject to {shop.city} jurisdiction.</li>
            </ol>

            {shop.bankDetails?.bankName && (
              <div className="mt-3">
                <p className="text-xs font-bold">Bank Details:</p>
                <p className="text-xs">Bank: {shop.bankDetails.bankName}</p>
                {shop.bankDetails.accountNumber && <p className="text-xs">A/C No: {shop.bankDetails.accountNumber}</p>}
                {shop.bankDetails.ifscCode && <p className="text-xs">IFSC: {shop.bankDetails.ifscCode}</p>}
                {shop.bankDetails.branch && <p className="text-xs">Branch: {shop.bankDetails.branch}</p>}
              </div>
            )}
          </div>
          <div className="p-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs">Sub Total:</span>
              <span className="text-xs font-semibold">{invoice.subTotal.toFixed(2)}</span>
            </div>
            {invoice.totalDiscount && invoice.totalDiscount > 0 && (
              <div className="flex justify-between mb-1">
                <span className="text-xs">Discount:</span>
                <span className="text-xs">-{invoice.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-1">
              <span className="text-xs">CGST:</span>
              <span className="text-xs">{invoice.totalCGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-xs">SGST:</span>
              <span className="text-xs">{invoice.totalSGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-xs">Round Off:</span>
              <span className="text-xs">{invoice.roundOff.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-black pt-1 mt-1">
              <span className="text-xs font-bold">Total:</span>
              <span className="text-xs font-bold">{invoice.grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs mt-2 italic">
              Rupees: {numberToWords(invoice.grandTotal)}
            </p>

            <div className="mt-4 text-right">
              <p className="text-xs">for {shop.name}</p>
              <p className="text-xs mt-8">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}