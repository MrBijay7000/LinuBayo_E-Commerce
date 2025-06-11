import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../shared/Context/auth-context";

export default function ProtectedAdminRoute() {
  const { isLoggedIn, role } = useContext(AuthContext);

  if (!isLoggedIn || role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
