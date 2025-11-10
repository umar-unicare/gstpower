import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Printer } from 'lucide-react';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceItem, Customer, Invoice } from '@/types/invoice';
import { numberToWords } from '@/lib/invoiceCalculations';
import { invoiceApi } from '@/lib/invoiceApi';
import { shopApi, ShopsData } from '@/lib/shopApi';
import { PrintModal } from '@/components/PrintModal';
import { useAuth } from '@/hooks/useAuth';

export default function Billing() {
  const navigate = useNavigate();
  const { user, getAccessToken } = useAuth();
  const [shopsData, setShopsData] = useState<ShopsData | null>(null);
  const [selectedShop, setSelectedShop] = useState<'shop1' | 'shop2'>('shop1');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [defaultTaxPercent, setDefaultTaxPercent] = useState(18);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const [shopResponse, invoiceResponse] = await Promise.all([
          shopApi.getShopSettings(token),
          invoiceApi.getNextInvoiceNumber(token)
        ]);

        if (shopResponse.success && shopResponse.data) {
          setShopsData(shopResponse.data);
        }
        if (invoiceResponse.success && invoiceResponse.data) {
          setInvoiceNumber(invoiceResponse.data.nextNumber);
        }
      } catch (error) {
        toast.error('Failed to load data');
      }
    };

    loadData();
  }, [getAccessToken]);

  const [customer, setCustomer] = useState<Customer>({
    name: '',
    mobile: '',
    address: '',
    gstin: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      productName: '',
      hsnSac: '',
      qty: 1,
      unitPrice: 0,
      discount: 0,
      taxPercent: defaultTaxPercent,
      taxableValue: 0,
      cgst: 0,
      sgst: 0,
      lineTotal: 0,
    },
  ]);

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalculate line total without tax and discount (those are now invoice-level)
    if (['qty', 'unitPrice'].includes(field)) {
      const lineTotal = newItems[index].qty * newItems[index].unitPrice;
      newItems[index].lineTotal = lineTotal;
      newItems[index].taxableValue = lineTotal;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productName: '',
        hsnSac: '',
        qty: 1,
        unitPrice: 0,
        discount: 0,
        taxPercent: defaultTaxPercent,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        lineTotal: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculate totals with invoice-level discount and tax
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  const afterDiscount = subtotal - invoiceDiscount;
  const totalTax = (afterDiscount * defaultTaxPercent) / 100;
  const totalCGST = totalTax / 2;
  const totalSGST = totalTax / 2;
  const beforeRound = afterDiscount + totalTax;
  const grandTotal = Math.round(beforeRound);
  const roundOff = grandTotal - beforeRound;

  const handleSave = async () => {
    if (!customer.name || !customer.mobile) {
      toast.error('Please enter customer name and mobile number');
      return;
    }

    if (items.every(item => !item.productName)) {
      toast.error('Please add at least one product');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      toast.error('Please login to save invoice');
      return;
    }

    setLoading(true);
    try {
      // Update items with calculated values
      const finalItems = items.filter(item => item.productName).map(item => {
        const itemSubtotal = item.qty * item.unitPrice;
        const itemDiscountRatio = invoiceDiscount / subtotal;
        const itemDiscount = itemSubtotal * itemDiscountRatio;
        const itemAfterDiscount = itemSubtotal - itemDiscount;
        const itemTax = (itemAfterDiscount * defaultTaxPercent) / 100;
        
        return {
          ...item,
          discount: itemDiscount,
          taxPercent: defaultTaxPercent,
          taxableValue: itemAfterDiscount,
          cgst: itemTax / 2,
          sgst: itemTax / 2,
          lineTotal: itemAfterDiscount + itemTax,
        };
      });

      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber,
        date,
        shopId: selectedShop,
        customer,
        items: finalItems,
        taxPercent: defaultTaxPercent,
        subTotal: subtotal,
        totalDiscount: invoiceDiscount,
        totalCGST,
        totalSGST,
        totalTax,
        roundOff,
        grandTotal,
        ewayGenerated: false,
        createdAt: new Date().toISOString(),
        createdBy: user?.name || 'Unknown',
      };

      await invoiceApi.createInvoice(invoice, token);
      setCurrentInvoice(invoice);
      toast.success('Invoice saved successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!currentInvoice) {
      handleSave();
    }
    setShowPrintModal(true);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Create Invoice</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Enter customer details and add items</p>
          </div>
          <div className="flex items-center gap-3">
            <UserProfile />
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="outline" className="flex-1 sm:flex-none" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{loading ? 'Saving...' : 'Save'}</span>
              </Button>
              <Button onClick={handlePrint} className="flex-1 sm:flex-none" disabled={loading}>
                <Printer className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice Header */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Select Shop *</Label>
              <Select value={selectedShop} onValueChange={(value: 'shop1' | 'shop2') => setSelectedShop(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shop1">
                    Shop 1 - {shopsData?.shop1.address || 'Loading...'}
                  </SelectItem>
                  <SelectItem value="shop2">
                    Shop 2 - {shopsData?.shop2.address || 'Loading...'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Invoice Number</Label>
              <Input value={invoiceNumber} disabled className="bg-muted" />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <p className="text-sm text-muted-foreground">Enter Customer name & mobile (required). More details optional.</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Customer Name *</Label>
              <Input
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div>
              <Label>Mobile Number *</Label>
              <Input
                value={customer.mobile}
                onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
                placeholder="Enter mobile number"
                required
              />
            </div>
            <div>
              <Label>Address (Optional)</Label>
              <Input
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            <div>
              <Label>GST Number (Optional)</Label>
              <Input
                value={customer.gstin}
                onChange={(e) => setCustomer({ ...customer, gstin: e.target.value })}
                placeholder="Enter GST number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile View - Card Based */}
            <div className="md:hidden space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">Item #{index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Product Name</Label>
                      <Input
                        value={item.productName}
                        onChange={(e) => updateItem(index, 'productName', e.target.value)}
                        placeholder="Product name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">HSN/SAC</Label>
                        <Input
                          value={item.hsnSac}
                          onChange={(e) => updateItem(index, 'hsnSac', e.target.value)}
                          placeholder="HSN/SAC"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                          min="1"
                          step="1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Price</Label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium">Total:</span>
                      <span className="font-bold">₹{(item.qty * item.unitPrice).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Product Name</th>
                    <th className="text-left p-2">HSN/SAC</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        <Input
                          value={item.productName}
                          onChange={(e) => updateItem(index, 'productName', e.target.value)}
                          placeholder="Product name"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={item.hsnSac}
                          onChange={(e) => updateItem(index, 'hsnSac', e.target.value)}
                          placeholder="HSN/SAC"
                          className="w-24"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                          min="1"
                          step="1"
                          className="w-20"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                          min="0"
                          step="1"
                          className="w-32"
                        />
                      </td>
                      <td className="p-2 text-right font-semibold">₹{(item.qty * item.unitPrice).toFixed(2)}</td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={addItem} variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md md:ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2 border-t pt-2">
                <div>
                  <Label>Discount</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={invoiceDiscount}
                      onChange={(e) => setInvoiceDiscount(Number(e.target.value))}
                      min="0"
                      step="1"
                      className="flex-1"
                    />
                    {invoiceDiscount > 0 && subtotal > 0 && (
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        ({((invoiceDiscount / subtotal) * 100).toFixed(2)}%)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>After Discount:</span>
                  <span>₹{afterDiscount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 border-t pt-2">
                <div>
                  <Label>Tax % (CGST + SGST)</Label>
                  <Input
                    type="number"
                    value={defaultTaxPercent}
                    onChange={(e) => setDefaultTaxPercent(Number(e.target.value))}
                    min="0"
                    max="100"
                    step="1"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will be split equally: {(defaultTaxPercent / 2).toFixed(2)}% CGST + {(defaultTaxPercent / 2).toFixed(2)}% SGST
                  </p>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total CGST:</span>
                  <span>₹{totalCGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total SGST:</span>
                  <span>₹{totalSGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span className="font-semibold">₹{totalTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm border-t pt-2">
                <span>Round Off:</span>
                <span>₹{roundOff.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Amount in words: {numberToWords(grandTotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        {showPrintModal && currentInvoice && (
          <PrintModal
            invoice={currentInvoice}
            onClose={() => setShowPrintModal(false)}
            onPrintComplete={() => {
              toast.success('Invoice printed successfully!');
              navigate('/history');
            }}
            onInvoiceUpdate={async (updatedInvoice) => {
              const token = getAccessToken();
              if (!token) return;
              
              try {
                await invoiceApi.createInvoice(updatedInvoice, token);
                setCurrentInvoice(updatedInvoice);
              } catch (error) {
                toast.error('Failed to update invoice');
              }
            }}
          />
        )}
      </div>
    </Layout>
  );
}
