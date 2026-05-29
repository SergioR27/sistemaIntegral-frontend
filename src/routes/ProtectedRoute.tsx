import {
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";
import {
  clearAuthSession,
  getAccessToken
} from "@/utils/auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    clearAuthSession();
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />
}
