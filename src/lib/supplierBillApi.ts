import { SupplierBill } from '@/types/supplierBill';

const BASE_URL = 'https://api.powerfurnitures.com';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const supplierBillApi = {
  createSupplierBill: async (bill: SupplierBill, accessToken: string): Promise<ApiResponse<{ billId: string }>> => {
    const response = await fetch(`${BASE_URL}/api/supplier-bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bill),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create supplier bill');
    }

    return response.json();
  },

  getAllSupplierBills: async (
    accessToken: string,
    params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Promise<PaginatedResponse<SupplierBill>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${BASE_URL}/api/supplier-bills?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch supplier bills');
    }

    return response.json();
  },

  deleteSupplierBill: async (id: string, accessToken: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${BASE_URL}/api/supplier-bills/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete supplier bill');
    }

    return response.json();
  },
};
