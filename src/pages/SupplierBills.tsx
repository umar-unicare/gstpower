import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Trash2, Eye, Download, Printer, FileText, Calendar, User, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { SupplierBill, SupplierBillFile } from '@/types/supplierBill';
import { supplierBillApi } from '@/lib/supplierBillApi';
import { toast as sonnerToast } from 'sonner';

export default function SupplierBills() {
  const { user, getAccessToken } = useAuth();
  const [bills, setBills] = useState<SupplierBill[]>([]);
  const [supplierName, setSupplierName] = useState('');
  const [description, setDescription] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [files, setFiles] = useState<SupplierBillFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<SupplierBillFile | null>(null);
  const [currentBillFiles, setCurrentBillFiles] = useState<SupplierBillFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const response = await supplierBillApi.getAllSupplierBills(token);
      if (response.success && response.data) {
        setBills(response.data);
      }
    } catch (error) {
      sonnerToast.error('Failed to load supplier bills');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > 5) {
      toast({
        title: "Maximum files exceeded",
        description: "You can only upload up to 5 files per bill.",
        variant: "destructive",
      });
      return;
    }

    const filePromises = selectedFiles.map(file => {
      return new Promise<SupplierBillFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            type: file.type,
            dataUrl: reader.result as string,
            size: file.size,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const uploadedFiles = await Promise.all(filePromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
      toast({
        title: "Files uploaded",
        description: `${uploadedFiles.length} file(s) added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload some files.",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplierName.trim() || !purchaseDate || files.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in supplier name, purchase date and upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    const token = getAccessToken();
    if (!token) {
      sonnerToast.error('Please login to save supplier bill');
      return;
    }

    const newBill: SupplierBill = {
      id: crypto.randomUUID(),
      supplierName: supplierName.trim(),
      description: description.trim(),
      purchaseDate,
      files,
      createdAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      await supplierBillApi.createSupplierBill(newBill, token);
      await loadBills();
      
      // Reset form
      setSupplierName('');
      setDescription('');
      setPurchaseDate('');
      setFiles([]);
      
      toast({
        title: "Bill saved",
        description: "Supplier bill has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save bill.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bill?')) return;

    const token = getAccessToken();
    if (!token) return;

    try {
      await supplierBillApi.deleteSupplierBill(id, token);
      await loadBills();
      toast({
        title: "Bill deleted",
        description: "Supplier bill has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete bill.",
        variant: "destructive",
      });
    }
  };

  const createBlobUrl = (dataUrl: string, type: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || type;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return URL.createObjectURL(new Blob([u8arr], { type: mime }));
  };

  const handleViewFiles = (billFiles: SupplierBillFile[], index: number = 0) => {
    setCurrentBillFiles(billFiles);
    setCurrentFileIndex(index);
    setCurrentFile(billFiles[index]);
    setViewerOpen(true);
  };

  const handleNavigateFile = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentFileIndex - 1)
      : Math.min(currentBillFiles.length - 1, currentFileIndex + 1);
    
    setCurrentFileIndex(newIndex);
    setCurrentFile(currentBillFiles[newIndex]);
  };

  const handleDownload = (file: SupplierBillFile) => {
    const link = document.createElement('a');
    link.href = file.dataUrl;
    link.download = file.name;
    link.click();
  };

  const handlePrint = (file: SupplierBillFile) => {
    if (file.type === 'application/pdf') {
      // For PDFs, create a blob URL and open in new window for printing
      const blobUrl = createBlobUrl(file.dataUrl, file.type);
      const printWindow = window.open(blobUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else if (file.type.startsWith('image/')) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print - ${file.name}</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; height: auto; }
              @media print { body { margin: 0; } img { max-width: 100%; page-break-inside: avoid; } }
            </style>
          </head>
          <body>
            <img src="${file.dataUrl}" alt="${file.name}" onload="window.print()" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Supplier Bills</h1>
            <p className="text-muted-foreground">Upload and manage supplier bills and documents</p>
          </div>
          <UserProfile />
        </div>

        {/* Upload Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload New Bill</CardTitle>
            <CardDescription>Add supplier information and upload related documents</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name *</Label>
                  <Input
                    id="supplierName"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Enter supplier name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter bill description or notes (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Upload Files * (Max 5 files)</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={files.length >= 5}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {files.length} of 5 files uploaded
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                />

                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                {loading ? 'Saving...' : 'Save Supplier Bill'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bills List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Saved Bills</h2>
            {bills.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>
          
          {bills.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No bills uploaded yet</p>
                <p className="text-sm text-muted-foreground">Upload your first supplier bill above</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {bills
                .filter((bill) => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  const matchesName = bill.supplierName.toLowerCase().includes(query);
                  const matchesDate = new Date(bill.purchaseDate).toLocaleDateString().toLowerCase().includes(query);
                  return matchesName || matchesDate;
                })
                .map((bill) => (
                <Card key={bill.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          {bill.supplierName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(bill.purchaseDate), 'dd-MM-yyyy')}
                        </CardDescription>
                        <p className="text-sm text-foreground mt-2">{bill.description}</p>
                      </div>
                      {user?.role === 'SUPERADMIN' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(bill.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Files ({bill.files.length})</p>
                      <div className="grid grid-cols-1 gap-2">
                        {bill.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded bg-muted/30">
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm flex-1 truncate">{file.name}</span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewFiles(bill.files, index)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDownload(file)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePrint(file)}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* File Viewer Dialog */}
        <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="truncate flex-1">{currentFile?.name}</span>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentFile && handleDownload(currentFile)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentFile && handlePrint(currentFile)}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4">
              {currentFile && (
                <>
                  {currentFile.type.startsWith('image/') ? (
                    <img 
                      src={currentFile.dataUrl} 
                      alt={currentFile.name}
                      className="max-w-full h-auto mx-auto"
                    />
                  ) : currentFile.type === 'application/pdf' ? (
                    <object
                      data={createBlobUrl(currentFile.dataUrl, currentFile.type)}
                      type="application/pdf"
                      className="w-full h-[60vh] border-0"
                    >
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">PDF preview not available</p>
                        <Button onClick={() => handleDownload(currentFile)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </object>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Preview not available for this file type</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {currentBillFiles.length > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleNavigateFile('prev')}
                  disabled={currentFileIndex === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentFileIndex + 1} of {currentBillFiles.length}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handleNavigateFile('next')}
                  disabled={currentFileIndex === currentBillFiles.length - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
