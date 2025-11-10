import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Printer, Download, Copy, Trash2, Filter } from 'lucide-react';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { invoiceApi } from '@/lib/invoiceApi';
import { Invoice } from '@/types/invoice';
import { toast } from 'sonner';
import { PrintModal } from '@/components/PrintModal';

export default function InvoiceHistory() {
  const { user, getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [refreshKey]);

  const loadInvoices = async () => {
    const token = getAccessToken();
    if (!token) return;

    setLoading(true);
    try {
      if (searchQuery || dateFrom || dateTo) {
        const response = await invoiceApi.searchInvoices(token, searchQuery, dateFrom, dateTo);
        if (response.success && response.data) {
          setInvoices(response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
      } else {
        const response = await invoiceApi.getAllInvoices(token, { sortBy: 'date', sortOrder: 'desc' });
        if (response.success && response.data) {
          setInvoices(response.data);
        }
      }
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [searchQuery, dateFrom, dateTo]);

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handlePrint = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPrintModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    const token = getAccessToken();
    if (!token) return;

    try {
      await invoiceApi.deleteInvoice(id, token);
      toast.success('Invoice deleted successfully');
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(null);
      }
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Invoice History</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Search and manage your invoices</p>
          </div>
          <UserProfile />
        </div>

        {/* Search & Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Search by Bill ID or Customer Name/Mobile</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search invoices..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            {(searchQuery || dateFrom || dateTo) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSearchQuery('');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Invoice List */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Invoices {invoices.length > 0 && `(${invoices.length})`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Loading invoices...</p>
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No invoices found.</p>
                    <p className="text-sm mt-2">
                      Try widening the date range or searching a different Bill ID / Customer name.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedInvoice?.id === invoice.id
                            ? 'border-primary bg-secondary'
                            : 'border-border hover:bg-secondary'
                        }`}
                        onClick={() => handleView(invoice)}
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">{invoice.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{invoice.customer.mobile}</p>
                            {invoice.createdBy && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Created by: <span className="font-medium">{invoice.createdBy}</span>
                              </p>
                            )}
                          </div>
                           <div className="text-left sm:text-right">
                            <p className="font-bold text-accent">
                              ₹{invoice.grandTotal.toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(invoice.date).toLocaleDateString('en-IN')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Shop: {invoice.shopId === 'shop1' ? '1' : invoice.shopId === 'shop2' ? '2' : '1'}
                            </p>
                            {invoice.ewayGenerated && (
                              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded mt-1 inline-block">
                                E-Way Generated
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(invoice);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrint(invoice);
                            }}
                          >
                            <Printer className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Print</span>
                          </Button>
                          {user?.role === 'SUPERADMIN' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 sm:flex-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(invoice.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Invoice Detail */}
          <div className="xl:sticky xl:top-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedInvoice ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Invoice Number</p>
                      <p className="font-semibold">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Shop Location</p>
                      <p className="font-medium">
                        {selectedInvoice.shopId === 'shop1' ? 'Shop 1' : selectedInvoice.shopId === 'shop2' ? 'Shop 2' : 'Shop 1 (Default)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{new Date(selectedInvoice.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">{selectedInvoice.customer.name}</p>
                      <p className="text-sm">{selectedInvoice.customer.mobile}</p>
                      {selectedInvoice.customer.address && (
                        <p className="text-sm">{selectedInvoice.customer.address}</p>
                      )}
                    </div>
                    {selectedInvoice.createdBy && (
                      <div>
                        <p className="text-sm text-muted-foreground">Created By</p>
                        <p className="font-medium">{selectedInvoice.createdBy}</p>
                      </div>
                    )}
                    {selectedInvoice.ewayGenerated && selectedInvoice.ewayDetails && (
                      <div>
                        <p className="text-sm text-muted-foreground">E-Way Bill Details</p>
                        <div className="text-sm space-y-1 mt-1 bg-secondary p-2 rounded">
                          {selectedInvoice.ewayDetails.transporterName && (
                            <p><span className="font-medium">Transporter:</span> {selectedInvoice.ewayDetails.transporterName}</p>
                          )}
                          {selectedInvoice.ewayDetails.vehicleNumber && (
                            <p><span className="font-medium">Vehicle:</span> {selectedInvoice.ewayDetails.vehicleNumber}</p>
                          )}
                          {selectedInvoice.ewayDetails.from && (
                            <p><span className="font-medium">From:</span> {selectedInvoice.ewayDetails.from}</p>
                          )}
                          {selectedInvoice.ewayDetails.to && (
                            <p><span className="font-medium">To:</span> {selectedInvoice.ewayDetails.to}</p>
                          )}
                          {selectedInvoice.ewayDetails.distance && (
                            <p><span className="font-medium">Distance:</span> {selectedInvoice.ewayDetails.distance} km</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <ul className="space-y-1 mt-1">
                        {selectedInvoice.items.map((item) => (
                          <li key={item.id} className="text-sm">
                            {item.productName} (x{item.qty}) - ₹{item.lineTotal.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t pt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{selectedInvoice.subTotal.toFixed(2)}</span>
                      </div>
                      {selectedInvoice.totalDiscount && selectedInvoice.totalDiscount > 0 && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Discount:</span>
                          <span>-₹{selectedInvoice.totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>CGST:</span>
                        <span>₹{selectedInvoice.totalCGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>SGST:</span>
                        <span>₹{selectedInvoice.totalSGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Grand Total:</span>
                        <span className="text-accent">
                          ₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handlePrint(selectedInvoice)}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Select an invoice to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {showPrintModal && selectedInvoice && (
          <PrintModal
            invoice={selectedInvoice}
            onClose={() => setShowPrintModal(false)}
            onPrintComplete={() => {
              toast.success('Invoice printed successfully!');
              setShowPrintModal(false);
            }}
            onInvoiceUpdate={async (updatedInvoice) => {
              const token = getAccessToken();
              if (!token) return;
              
              try {
                await invoiceApi.createInvoice(updatedInvoice, token);
                setSelectedInvoice(updatedInvoice);
                setRefreshKey(prev => prev + 1);
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
