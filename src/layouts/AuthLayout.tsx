import {
  Navigate,
  Outlet
} from "react-router-dom";
import { getAccessToken } from "@/utils/auth";

export default function AuthLayout() {
  if (getAccessToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  );
}
