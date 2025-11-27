import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import InvoiceHistory from "./pages/InvoiceHistory";
import SupplierBills from "./pages/SupplierBills";
import Settings from "./pages/Settings";
import MyAccount from "./pages/MyAccount";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NoRole from "./pages/NoRole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/no-role" element={<ProtectedRoute><NoRole /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><Dashboard /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><InvoiceHistory /></ProtectedRoute>} />
            <Route path="/supplier-bills" element={<ProtectedRoute><SupplierBills /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><Settings /></ProtectedRoute>} />
            <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminPanel /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
