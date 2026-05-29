import axiosInstance from "@/services/axiosInstance";
import { setAuthSession } from "@/utils/auth";

export const handleLogin = async (correo: string, password: string) => {

  const { data } = await axiosInstance.post(
    "/auth/login",
    {
      correo,
      password
    }
  );

  setAuthSession(data);

  return data;
}
