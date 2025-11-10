import React from 'react';
import { Invoice, EWayDetails } from '@/types/invoice';
import { getShopDetails } from '@/lib/storage';
import shopLogo from '@/assets/shop-logo.png';

interface EWayBillTemplateProps {
  invoice: Invoice;
  ewayDetails: EWayDetails;
}

export function EWayBillTemplate({ invoice, ewayDetails }: EWayBillTemplateProps) {
  const shop = getShopDetails(invoice.shopId || 'shop1');
  const ewayNumber = ewayDetails.billNo || Math.random().toString().slice(2, 14);
  const generatedDate = new Date().toLocaleString('en-IN');
  const validUpto = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('en-IN');

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white text-black p-2 sm:p-4 md:p-8 text-[10px] sm:text-xs md:text-sm print:w-[210mm] print:p-8 print:text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="border-2 border-black">
        <div className="text-center border-b-2 border-black p-2 bg-gray-100">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={shopLogo} alt="Shop Logo" className="w-12 h-12 object-contain" />
            <h1 className="text-base sm:text-lg md:text-xl font-bold">e-Way Bill</h1>
          </div>
          <p className="text-xs">{shop.name}</p>
        </div>

        {/* E-Way Bill Details */}
        <div className="p-2 sm:p-3 border-b border-black bg-blue-50">
          <p className="text-[10px] sm:text-xs font-bold mb-2">1. E-WAY BILL Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] sm:text-xs">
            <div>
              <span className="font-semibold">Bill No:</span> {ewayNumber}
            </div>
            <div>
              <span className="font-semibold">Generated Date:</span> {generatedDate}
            </div>
            <div>
              <span className="font-semibold">Valid Upto:</span> {validUpto}
            </div>
            <div>
              <span className="font-semibold">Approx Distance:</span> {ewayDetails.distance || '0'} km
            </div>
            <div>
              <span className="font-semibold">Transaction type:</span> Outward - Supply
            </div>
            <div>
              <span className="font-semibold">Document:</span> Tax Invoice - {new Date(invoice.date).toLocaleDateString('en-IN')}
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black">
          <div className="border-b sm:border-b-0 sm:border-r border-black p-2 sm:p-3">
            <p className="text-[10px] sm:text-xs font-bold mb-2">2. Address Details - From</p>
            <p className="text-[9px] sm:text-xs"><span className="font-semibold">GSTIN:</span> {shop.gstin}</p>
            <p className="text-[9px] sm:text-xs font-semibold">{shop.name}</p>
            <p className="text-[9px] sm:text-xs">{shop.address}</p>
            <p className="text-[9px] sm:text-xs">{shop.city} - {shop.pincode}, {shop.state}</p>
            <p className="text-[9px] sm:text-xs">Contact: {shop.phones.filter(p => p).join(' | ')}</p>
          </div>
          <div className="p-2 sm:p-3">
            <p className="text-[10px] sm:text-xs font-bold mb-2">To</p>
            {invoice.customer.gstin && (
              <p className="text-[9px] sm:text-xs"><span className="font-semibold">GSTIN:</span> {invoice.customer.gstin}</p>
            )}
            <p className="text-[9px] sm:text-xs font-semibold">{invoice.customer.name}</p>
            {invoice.customer.address && <p className="text-[9px] sm:text-xs">{invoice.customer.address}</p>}
            <p className="text-[9px] sm:text-xs">{shop.state}</p>
            <p className="text-[9px] sm:text-xs">Cell: {invoice.customer.mobile}</p>
          </div>
        </div>

        {/* Goods Details */}
        <div className="p-2 sm:p-3 border-b border-black">
          <p className="text-[10px] sm:text-xs font-bold mb-2">3. Goods Details</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] sm:text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left p-0.5 sm:p-1">Description</th>
                  <th className="text-right p-0.5 sm:p-1">HSN/SAC</th>
                  <th className="text-right p-0.5 sm:p-1">Qty</th>
                  <th className="text-right p-0.5 sm:p-1">Taxable Amt</th>
                  <th className="text-right p-0.5 sm:p-1">CGST</th>
                  <th className="text-right p-0.5 sm:p-1">SGST</th>
                  <th className="text-right p-0.5 sm:p-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-0.5 sm:p-1">{item.productName}</td>
                    <td className="text-right p-0.5 sm:p-1">{item.hsnSac || '-'}</td>
                    <td className="text-right p-0.5 sm:p-1">{item.qty}</td>
                    <td className="text-right p-0.5 sm:p-1">{item.taxableValue.toFixed(2)}</td>
                    <td className="text-right p-0.5 sm:p-1">{item.cgst.toFixed(2)}</td>
                    <td className="text-right p-0.5 sm:p-1">{item.sgst.toFixed(2)}</td>
                    <td className="text-right p-0.5 sm:p-1">{item.lineTotal.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold border-t-2 border-black">
                  <td colSpan={3} className="p-0.5 sm:p-1">Total</td>
                  <td className="text-right p-0.5 sm:p-1">{invoice.subTotal.toFixed(2)}</td>
                  <td className="text-right p-0.5 sm:p-1">{invoice.totalCGST.toFixed(2)}</td>
                  <td className="text-right p-0.5 sm:p-1">{invoice.totalSGST.toFixed(2)}</td>
                  <td className="text-right p-0.5 sm:p-1">{invoice.grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transportation Details */}
        <div className="p-2 sm:p-3 border-b border-black bg-yellow-50">
          <p className="text-[10px] sm:text-xs font-bold mb-2">4. Transportation Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] sm:text-xs">
            <div>
              <span className="font-semibold">Transporter Name:</span> {ewayDetails.transporterName || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">From:</span> {ewayDetails.from || shop.city}
            </div>
            <div>
              <span className="font-semibold">To:</span> {ewayDetails.to || 'N/A'}
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs font-bold mb-2">5. Vehicle Details</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] sm:text-xs border border-black min-w-[500px]">
              <thead>
                <tr className="border-b border-black bg-gray-100">
                  <th className="border-r border-black p-0.5 sm:p-1 text-left">Mode</th>
                  <th className="border-r border-black p-0.5 sm:p-1 text-left">Vehicle No.</th>
                  <th className="border-r border-black p-0.5 sm:p-1 text-left">From</th>
                  <th className="border-r border-black p-0.5 sm:p-1 text-left">Entered Date</th>
                  <th className="p-0.5 sm:p-1 text-left">Doc No</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-black p-0.5 sm:p-1">Road</td>
                  <td className="border-r border-black p-0.5 sm:p-1">{ewayDetails.vehicleNumber || 'N/A'}</td>
                  <td className="border-r border-black p-0.5 sm:p-1">{ewayDetails.from || shop.city}</td>
                  <td className="border-r border-black p-0.5 sm:p-1">{generatedDate}</td>
                  <td className="p-0.5 sm:p-1">{ewayNumber}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
