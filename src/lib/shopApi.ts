const BASE_URL = 'https://api.powerfurnitures.com';

export interface ShopDetails {
  name: string;
  tamilName?: string;
  address: string;
  gstin: string;
 phones: string[];
  email: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branch: string;
}

export interface ShopsData {
  shop1: ShopDetails;
  shop2: ShopDetails;
  bankDetails: BankDetails;
}

export interface ShopDetailsWithBank extends ShopDetails {
  bankDetails: BankDetails;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const shopApi = {
  getShopSettings: async (accessToken: string): Promise<ApiResponse<ShopsData>> => {
    const response = await fetch(`${BASE_URL}/api/shop-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch shop settings');
    }

    return response.json();
  },

  updateShopSettings: async (settings: ShopsData, accessToken: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${BASE_URL}/api/shop-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update shop settings');
    }

    return response.json();
  },

  getShopDetailsById: async (
    shopId: 'shop1' | 'shop2',
    accessToken: string
  ): Promise<ApiResponse<ShopDetailsWithBank>> => {
    const response = await fetch(`${BASE_URL}/api/shop-settings/${shopId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch shop details');
    }

    return response.json();
  },
};
