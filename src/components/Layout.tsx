import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, History, Settings, Menu, Receipt, LogOut, User, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/billing', icon: FileText, label: 'Create Invoice' },
  { to: '/history', icon: History, label: 'Invoice History' },
  { to: '/supplier-bills', icon: Receipt, label: 'Supplier Bills' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
  { to: '/admin', icon: Shield, label: 'Admin Panel', requiredRole: 'SUPERADMIN' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const getFilteredNavItems = () => {
    if (user?.role === 'ADMIN') {
      return navItems.filter(item => 
        item.to === '/billing' || item.to === '/supplier-bills'
      );
    }
    return navItems;
  };

  const NavContent = () => (
    <nav className="flex flex-col gap-2">
      {getFilteredNavItems().map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link key={item.to} to={item.to}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start gap-3"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        );
      })}
      {user?.role === 'SUPERADMIN' && adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link key={item.to} to={item.to}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start gap-3"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-serif font-bold text-primary">
            New Power
          </h1>
          <p className="text-sm text-muted-foreground">Home Appliance & Furniture</p>
        </div>
        <div className="flex-1 p-4">
          <NavContent />
        </div>
        {isAuthenticated && user && (
          <div className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <User className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/my-account')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {!isAuthenticated && (
          <div className="p-4 border-t border-border">
            <Button onClick={() => navigate('/auth/login')} className="w-full">
              Sign In
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-serif font-bold text-primary">New Power</h1>
          <div className="flex items-center gap-2">
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/my-account')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-6">
                  <h2 className="text-2xl font-serif font-bold text-primary mb-2">
                    New Power
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Home Appliance & Furniture
                  </p>
                  <NavContent />
                  {!isAuthenticated && (
                    <div className="mt-6">
                      <Button onClick={() => navigate('/auth/login')} className="w-full">
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-16 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="border-t border-border bg-card mt-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <p className="text-center">
                Copyright © <a 
                  href="tel:+918754913368" 
                  className="text-primary hover:underline font-medium"
                >
                  Al-Fattah Solutions
                </a> All Rights Reserved.
              </p>
              <span className="hidden sm:inline">|</span>
              <p className="flex items-center gap-2">
                Developed By <a 
                  href="tel:+918754913368" 
                  className="text-primary hover:underline font-medium"
                >
                  Al-Fattah Solutions
                </a>
                <a 
                  href="mailto:umarfarook1395@gmail.com" 
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                  title="Email for Enquiry"
                >
                  <Mail className="h-4 w-4" />
                  Enquiry
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
