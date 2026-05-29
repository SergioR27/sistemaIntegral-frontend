import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleLogin } from "@/functions/ActionsLogin";
import imagenGif from "/src/assets/gifLogin.gif";
import imagenLogo from "/src/assets/logo_blanco.png";

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await handleLogin(correo.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "No se pudo iniciar sesión. Intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = (widthClass: string) => (
    <div className="relative">
      <div className="absolute inset-0 bg-white/30 rounded-3xl translate-x-4 translate-y-3 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-white/20 rounded-3xl -translate-x-4 -translate-y-3 backdrop-blur-sm" />

      <Card className={`relative z-10 ${widthClass} rounded-3xl shadow-2xl border-0`}>
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-indigo-950">
              Sistema Integral
            </h1>

            <p className="text-gray-500 mt-1">
              Bienvenido, ingresa tus datos correspondientes
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="correo"
                className="text-xs font-bold text-gray-700 uppercase"
              >
                Correo:
              </label>

              <Input
                id="correo"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="correo@edugem.gob.mx"
                type="email"
                autoComplete="email"
                className="border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-bold text-gray-700 uppercase"
              >
                Contraseña:
              </label>

              <Input
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                className="border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0"
                required
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-primario-dark to-primario hover:opacity-90 h-12 text-white font-semibold disabled:opacity-70"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-vinoFuerte via-primario-dark to-primario-dark overflow-x-hidden">
      <div className="flex lg:hidden flex-col min-h-screen">
        <div className="flex justify-center pt-8">
          <img
            src={imagenLogo}
            alt="Logo"
            className="w-53 object-contain"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-5">
          {renderForm("w-[320px]")}
        </div>
      </div>

      <div className="hidden lg:flex min-h-screen">
        <div className="w-[60%] flex flex-col">
          <div className="p-8">
            <img
              src={imagenLogo}
              alt="Logo"
              className="w-72 object-contain"
            />
          </div>

          <div className="flex-1 flex items-center justify-center px-10 pb-10">
            <img
              src={imagenGif}
              alt="Animación"
              className="max-w-full max-h-[650px] object-contain"
            />
          </div>
        </div>

        <div className="w-[40%] flex items-center justify-center px-8">
          {renderForm("w-[380px]")}
        </div>
      </div>
    </div>
  );
}
