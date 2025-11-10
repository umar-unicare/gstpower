import { Invoice } from '@/types/invoice';

const BASE_URL = 'http://localhost:5000';

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

export const invoiceApi = {
  createInvoice: async (invoice: Invoice, accessToken: string): Promise<ApiResponse<{ invoiceId: string }>> => {
    const response = await fetch(`${BASE_URL}/api/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(invoice),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create invoice');
    }

    return response.json();
  },

  getAllInvoices: async (
    accessToken: string,
    params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Promise<PaginatedResponse<Invoice>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${BASE_URL}/api/invoices?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch invoices');
    }

    return response.json();
  },

  getInvoiceById: async (id: string, accessToken: string): Promise<ApiResponse<Invoice>> => {
    const response = await fetch(`${BASE_URL}/api/invoices/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch invoice');
    }

    return response.json();
  },

  searchInvoices: async (
    accessToken: string,
    query: string,
    dateFrom?: string,
    dateTo?: string,
    shopId?: string
  ): Promise<ApiResponse<Invoice[]>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);
    if (shopId) queryParams.append('shopId', shopId);

    const response = await fetch(`${BASE_URL}/api/invoices/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search invoices');
    }

    return response.json();
  },

  deleteInvoice: async (id: string, accessToken: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${BASE_URL}/api/invoices/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete invoice');
    }

    return response.json();
  },

  getNextInvoiceNumber: async (accessToken: string, shopId?: string): Promise<ApiResponse<{ nextNumber: string }>> => {
    const queryParams = shopId ? `?shopId=${shopId}` : '';
    const response = await fetch(`${BASE_URL}/api/invoices/next-number${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get next invoice number');
    }

    return response.json();
  },
};
