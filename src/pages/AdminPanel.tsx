import { useState, useEffect } from 'react';
import { Trash2, Shield } from 'lucide-react';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { authApi, User as ApiUser } from '@/lib/api';

interface UserData {
  id: number;
  name: string;
  mobileNumber: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'USER';
  email?: string;
}

export default function AdminPanel() {
  const { user, getAccessToken } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      const apiUsers = await authApi.getAllUsers(accessToken);
      setUsers(apiUsers.map(u => ({
        id: u.id,
        name: u.name,
        mobileNumber: u.mobileNumber,
        role: u.roles,
        email: u.email,
      })));
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleRoleChange = async (mobileNumber: string, newRole: 'SUPERADMIN' | 'ADMIN' | 'USER') => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      await authApi.updateUserRole(accessToken, mobileNumber, newRole);
      await loadUsers();
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    // Can't delete self
    if (userId === user?.id) {
      toast.error("Cannot delete your own account");
      return;
    }

    // Note: No delete API provided yet, keeping functionality disabled
    toast.error("Delete functionality not yet implemented in backend");
    setDeleteTarget(null);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'destructive';
      case 'ADMIN':
        return 'default';
      default:
        return 'secondary';
    }
  };

  // Only SUPERADMIN can access this page
  if (user?.role !== 'SUPERADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Admin Panel</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage user roles and permissions
            </p>
          </div>
          <UserProfile />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell className="font-medium">{userData.name}</TableCell>
                      <TableCell>{userData.email || '-'}</TableCell>
                      <TableCell>{userData.mobileNumber}</TableCell>
                      <TableCell>
                        <Select
                          value={userData.role}
                          onValueChange={(value) => 
                            handleRoleChange(userData.mobileNumber, value as any)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">USER</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        {userData.id !== user?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(userData.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteTarget && handleDeleteUser(deleteTarget)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
