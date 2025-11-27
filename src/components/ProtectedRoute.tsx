import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('SUPERADMIN' | 'ADMIN' | 'USER')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

   // Check if user has no role assigned
  if (user && !user.role && location.pathname !== '/no-role') {
    return <Navigate to="/no-role" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/billing" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
