import React, { useState, useEffect } from 'react';
import { Save, Building, Store } from 'lucide-react';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { shopApi, ShopsData } from '@/lib/shopApi';
import { useAuth } from '@/hooks/useAuth';
import shopLogo from '@/assets/shop-logo.png';

export default function Settings() {
  const { getAccessToken } = useAuth();

  const [defaultTax, setDefaultTax] = useState(18);
  const [loading, setLoading] = useState(false);

  const EMPTY_SHOPS_DATA: ShopsData = {
  shop1: {
    name: '',
    address: '',
    email: '',
    city: 'Vaniyambadi', 
    state: 'Tamil Nadu', 
    pincode: '635851',
    gstin: '',
    phones: [''],
  },
  shop2: {
    name: '',
    address: '',
    gstin: '',
    city: 'Vaniyambadi', state: 'Tamil Nadu', pincode: '635851',
    phones: [''],
     email: '',
  },
  bankDetails: {
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
  },
};

  const [shopsData, setShopsData] = useState<ShopsData>(EMPTY_SHOPS_DATA);



  useEffect(() => {
    loadSettings();
    const saved = localStorage.getItem('newpower_default_tax');
    if (saved) setDefaultTax(Number(saved));
  }, []);

 const loadSettings = async () => {
  const token = getAccessToken();
  if (!token) return;

  try {
    const response = await shopApi.getShopSettings(token);
    if (response.success && response.data) {
      setShopsData(response.data);
    } else {
      // ✅ No data yet → fallback to empty template
      setShopsData(EMPTY_SHOPS_DATA);
    }
  } catch (error) {
    toast.error('Failed to load shop settings');
    // ✅ Keep the default form to allow creating new shops
    setShopsData(EMPTY_SHOPS_DATA);
  }
};


  const handleSaveShops = async () => {
    if (!shopsData) return;

    const token = getAccessToken();
    if (!token) {
      toast.error('Please login to save settings');
      return;
    }

    setLoading(true);
    try {
      await shopApi.updateShopSettings(shopsData, token);
      toast.success('Shop details saved successfully');
    } catch (error) {
      toast.error('Failed to save shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTax = () => {
    localStorage.setItem('newpower_default_tax', defaultTax.toString());
    toast.success('Default tax updated');
  };

  const updateShop = (shopId: 'shop1' | 'shop2', field: string, value: any) => {
    if (!shopsData) return;
    setShopsData(prev => prev ? ({
      ...prev,
      [shopId]: {
        ...prev[shopId],
        [field]: value
      }
    }) : prev);
  };

  const updatePhone = (shopId: 'shop1' | 'shop2', index: number, value: string) => {
    if (!shopsData) return;
    setShopsData(prev => {
      if (!prev) return prev;
      const shop = prev[shopId] as any;
      const newPhones = shop.phones ? [...shop.phones] : [];
      newPhones[index] = value;
      return {
        ...prev,
        [shopId]: {
          ...prev[shopId],
          phones: newPhones
        }
      };
    });
  };

  const renderShopForm = (shopId: 'shop1' | 'shop2', shopLabel: string) => {
    const shop = shopsData?.[shopId];
 
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <img src={shopLogo} alt="Shop Logo" className="w-16 h-16 object-contain" />
          <h3 className="text-lg font-semibold">{shopLabel}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Shop Name</Label>
            <Input
              value={shop.name}
              onChange={(e) => updateShop(shopId, 'name', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Input
              value={shop.address}
              onChange={(e) => updateShop(shopId, 'address', e.target.value)}
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              value={shop.city}
              onChange={(e) => updateShop(shopId, 'city', e.target.value)}
            />
          </div>
          <div>
            <Label>State</Label>
            <Input
              value={shop.state}
              onChange={(e) => updateShop(shopId, 'state', e.target.value)}
            />
          </div>
          <div>
            <Label>Pincode</Label>
            <Input
              value={shop.pincode}
              onChange={(e) => updateShop(shopId, 'pincode', e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={shop.email}
              onChange={(e) => updateShop(shopId, 'email', e.target.value)}
            />
          </div>
          <div>
            <Label>GSTIN</Label>
            <Input
              value={shop.gstin}
              onChange={(e) => updateShop(shopId, 'gstin', e.target.value)}
            />
          </div>
        </div>

          <div className="mt-4">
            <Label className="mb-2 block">Contact Numbers (4 Numbers)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div key={index}>
                  <Label className="text-xs">Phone {index + 1}</Label>
                  <Input
                    value={(shop.phones && shop.phones[index]) || ''}
                    onChange={(e) => updatePhone(shopId, index, e.target.value)}
                    placeholder={`Phone number ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Settings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Configure your shop details and preferences</p>
          </div>
          <UserProfile />
        </div>

        {/* Shop Details - Two Shops */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Shop Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="shop1" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shop1">Shop 1</TabsTrigger>
                <TabsTrigger value="shop2">Shop 2</TabsTrigger>
              </TabsList>
              <TabsContent value="shop1" className="mt-4">
                {renderShopForm('shop1', 'Primary Shop')}
              </TabsContent>
              <TabsContent value="shop2" className="mt-4">
                {renderShopForm('shop2', 'Secondary Shop')}
              </TabsContent>
            </Tabs>
            <Button onClick={handleSaveShops} className="mt-4" disabled={loading || !shopsData}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Shop Details'}
            </Button>
          </CardContent>
        </Card>

        {/* Bank Details - Shared */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Details (Shared for both shops)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={shopsData?.bankDetails?.bankName || ''}
                  onChange={(e) => shopsData && setShopsData({ ...shopsData, bankDetails: { ...shopsData.bankDetails, bankName: e.target.value } })}
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input
                  value={shopsData?.bankDetails?.accountNumber || ''}
                  onChange={(e) => shopsData && setShopsData({ ...shopsData, bankDetails: { ...shopsData.bankDetails, accountNumber: e.target.value } })}
                />
              </div>
              <div>
                <Label>IFSC Code</Label>
                <Input
                  value={shopsData?.bankDetails?.ifscCode || ''}
                  onChange={(e) => shopsData && setShopsData({ ...shopsData, bankDetails: { ...shopsData.bankDetails, ifscCode: e.target.value } })}
                />
              </div>
              <div>
                <Label>Branch</Label>
                <Input
                  value={shopsData?.bankDetails?.branch || ''}
                  onChange={(e) => shopsData && setShopsData({ ...shopsData, bankDetails: { ...shopsData.bankDetails, branch: e.target.value } })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Settings - Shared */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Configuration (Shared for both shops)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Tax Percentage (CGST + SGST)</Label>
              <Input
                type="number"
                value={defaultTax}
                onChange={(e) => setDefaultTax(Number(e.target.value))}
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-sm text-muted-foreground mt-2">
                This will be used as the default tax for new invoices. CGST and SGST will be split
                equally ({(defaultTax / 2).toFixed(2)}% each).
              </p>
            </div>
            <Button onClick={handleSaveTax}>
              <Save className="mr-2 h-4 w-4" />
              Save Tax Settings
            </Button>
          </CardContent>
        </Card>

        {/* Print Template Info */}
        <Card>
          <CardHeader>
            <CardTitle>Print Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              GST Invoice and E-Way Bill templates are configured to print on A4 paper with
              accurate dimensions. Templates automatically populate with your shop and invoice
              details.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
