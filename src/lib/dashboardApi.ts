import { Invoice } from '@/types/invoice';

const BASE_URL = 'https://api.powerfurnitures.com';

export interface DashboardStats {
  totalInvoices: number;
  todaySales: {
    count: number;
    amount: number;
  };
  monthlySales: {
    count: number;
    amount: number;
  };
  ewayBillsGenerated: number;
  recentInvoices: Invoice[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const dashboardApi = {
  getDashboardStats: async (
    accessToken: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<ApiResponse<DashboardStats>> => {
    const queryParams = new URLSearchParams();
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);

    const url = queryParams.toString() 
      ? `${BASE_URL}/api/dashboard/stats?${queryParams}`
      : `${BASE_URL}/api/dashboard/stats`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch dashboard statistics');
    }

    return response.json();
  },
};
