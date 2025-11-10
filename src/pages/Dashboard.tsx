import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Package, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/lib/dashboardApi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    todayRevenue: 0,
    todayCount: 0,
    monthRevenue: 0,
    monthCount: 0,
    ewayBillsGenerated: 0,
    recentInvoices: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const token = getAccessToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await dashboardApi.getDashboardStats(token);
      if (response.success && response.data) {
        setStats({
          totalInvoices: response.data.totalInvoices,
          todayRevenue: response.data.todaySales.amount,
          todayCount: response.data.todaySales.count,
          monthRevenue: response.data.monthlySales.amount,
          monthCount: response.data.monthlySales.count,
          ewayBillsGenerated: response.data.ewayBillsGenerated,
          recentInvoices: response.data.recentInvoices
        });
      }
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>
          <UserProfile />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalInvoices}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground">{stats.todayCount} invoice(s) today</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">₹{stats.monthRevenue.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground">{stats.monthCount} invoice(s) this month</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">E-Way Bills</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.ewayBillsGenerated}</div>
                  <p className="text-xs text-muted-foreground">Total generated</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/billing')} size="lg">
              <FileText className="mr-2 h-5 w-5" />
              Create New Invoice
            </Button>
            <Button onClick={() => navigate('/history')} variant="outline" size="lg">
              View Invoice History
            </Button>
          </CardContent>
        </Card>

        {stats.recentInvoices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentInvoices.slice(0, 5).map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{inv.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{inv.customer?.name || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{inv.grandTotal?.toLocaleString('en-IN') || '0'}</p>
                      <p className="text-sm text-muted-foreground">{new Date(inv.date).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
