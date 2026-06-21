import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute() {
  const { authLoading, isAuthenticated } = useAuth();

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
