import { useState } from 'react';
import { X, Printer, Download, FileText, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Invoice, EWayDetails } from '@/types/invoice';
import { GSTInvoiceTemplate } from './templates/GSTInvoiceTemplate';
import { EWayBillTemplate } from './templates/EWayBillTemplate';
import { useAuth } from '@/hooks/useAuth';
import { invoiceApi } from '@/lib/invoiceApi';  
import { toast } from 'sonner';

interface PrintModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPrintComplete: () => void;
  onInvoiceUpdate?: (invoice: Invoice) => void;
}

export function PrintModal({ invoice, onClose, onPrintComplete, onInvoiceUpdate }: PrintModalProps) {
  const [printGST, setPrintGST] = useState(true);
  
  const [printEWay, setPrintEWay] = useState(invoice.ewayGenerated);
  const [ewayDetails, setEwayDetails] = useState<EWayDetails>(
    invoice.ewayDetails || {
      transporterName: '',
      vehicleNumber: '',
      from: '',
      to: '',
      distance: '',
    }
  );
  const { getAccessToken } = useAuth();

  const token = getAccessToken();
  const [updating, setUpdating] = useState(false);

  // const handlePrint = () => {
  //   // If E-Way bill is being printed for the first time, update the invoice
  //   if (printEWay && !invoice.ewayGenerated && onInvoiceUpdate) {
  //     const updatedInvoice = {
  //       ...invoice,
  //       ewayGenerated: true,
  //       ewayDetails: ewayDetails,
  //     };
  //     onInvoiceUpdate(updatedInvoice);
  //   }

  const handlePrint = async () => {
    // If E-Way bill is being printed for the first time, update the invoice via PUT API
    if (printEWay && !invoice.ewayGenerated) {
      const token = getAccessToken();
      if (!token) {
        toast.error('Please login to update invoice');
        return;
      }

      setUpdating(true);
      try {
        const updatedInvoice = {
          ...invoice,
          ewayGenerated: true,
          ewayDetails: ewayDetails,
        };
        
        await invoiceApi.updateInvoice(invoice.id, updatedInvoice, token);
        if (onInvoiceUpdate) {
          onInvoiceUpdate(updatedInvoice);
        }
        toast.success('E-Way bill details saved');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to update invoice');
        setUpdating(false);
        return;
      } finally {
        setUpdating(false);
      }
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const gstContent = printGST ? document.getElementById('gst-invoice-template')?.innerHTML : '';
    const ewayContent = printEWay ? document.getElementById('eway-bill-template')?.innerHTML : '';

    // Get all stylesheets from current document
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Invoice</title>
          <meta charset="UTF-8">
          <style>
            ${styles}
            
            @page { 
              size: A4 portrait; 
              margin: 10mm; 
            }
            
            body { 
              margin: 0; 
              padding: 0; 
              background: white;
            }
            
            .page-break { 
              page-break-after: always;
              page-break-inside: avoid;
              break-after: page;
              display: block;
              height: 0;
              margin: 0;
              padding: 0;
            }
            
            @media print {
              body { 
                print-color-adjust: exact; 
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              
              * {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              
              .page-break {
                page-break-after: always;
                page-break-inside: avoid;
                break-after: page;
                display: block;
                height: 0;
              }
            }
            
            @media screen {
              body {
                background: #f5f5f5;
              }
            }
          </style>
        </head>
        <body>
          ${gstContent}
          ${printGST && printEWay ? '<div class="page-break"></div>' : ''}
          ${ewayContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      onPrintComplete();
    }, 1000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
            Print Options — Choose printouts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="print-gst"
                checked={printGST}
                onCheckedChange={(checked) => setPrintGST(checked as boolean)}
              />
              <Label htmlFor="print-gst" className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                <FileText className="h-4 w-4 text-accent" />
                Print GST Invoice (A4)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="print-eway"
                checked={printEWay}
                onCheckedChange={(checked) => setPrintEWay(checked as boolean)}
              />
              <Label htmlFor="print-eway" className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                <Truck className="h-4 w-4 text-accent" />
                Generate & Print E-Way Bill (A4)
              </Label>
            </div>

            {printEWay && (
              <div className="ml-3 sm:ml-6 space-y-3 p-3 sm:p-4 bg-secondary rounded-lg">
                <p className="text-sm font-medium">E-Way Bill Transport Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Transporter Name</Label>
                    <Input
                      value={ewayDetails.transporterName}
                      onChange={(e) =>
                        setEwayDetails({ ...ewayDetails, transporterName: e.target.value })
                      }
                      placeholder="Enter transporter name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Vehicle Number</Label>
                    <Input
                      value={ewayDetails.vehicleNumber}
                      onChange={(e) =>
                        setEwayDetails({ ...ewayDetails, vehicleNumber: e.target.value })
                      }
                      placeholder="TN01AB1234"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">From</Label>
                    <Input
                      value={ewayDetails.from}
                      onChange={(e) => setEwayDetails({ ...ewayDetails, from: e.target.value })}
                      placeholder="Origin location"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">To</Label>
                    <Input
                      value={ewayDetails.to}
                      onChange={(e) => setEwayDetails({ ...ewayDetails, to: e.target.value })}
                      placeholder="Destination"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Distance (km)</Label>
                    <Input
                      value={ewayDetails.distance}
                      onChange={(e) => setEwayDetails({ ...ewayDetails, distance: e.target.value })}
                      placeholder="85"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground p-3 bg-secondary rounded">
            <p>
              Before printing, choose whether you want to generate the E-Way Bill. If required, fill
              the transport details above.
            </p>
          </div>

          {/* Hidden templates for printing */}
          <div className="hidden">
            <div id="gst-invoice-template">
              <GSTInvoiceTemplate invoice={invoice} accessToken={token}/>
            </div>
            <div id="eway-bill-template">
              <EWayBillTemplate invoice={invoice} ewayDetails={ewayDetails} accessToken={token} />
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-2 sm:p-4 bg-muted max-h-[400px] sm:max-h-[600px] overflow-auto">
            <p className="text-sm font-medium mb-3">Preview:</p>
            {printGST && (
              <div className="bg-white p-2 sm:p-4 rounded shadow-sm mb-4 text-xs sm:text-sm">
                <GSTInvoiceTemplate invoice={invoice} accessToken={token}/>
              </div>
            )}
            {printEWay && (
              <div className="bg-white p-2 sm:p-4 rounded shadow-sm text-xs sm:text-sm">
                <EWayBillTemplate invoice={invoice} ewayDetails={ewayDetails} accessToken={token} />
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto" disabled={updating}>
              Cancel
            </Button>
            <Button onClick={handlePrint} disabled={!printGST && !printEWay || updating} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
             {updating ? 'Updating...' : 'Print'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
