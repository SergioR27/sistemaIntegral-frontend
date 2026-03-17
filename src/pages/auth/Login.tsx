import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex font-display bg-background-light">

      {/* IZQUIERDA - IMAGEN */}
      <div
        className="
          hidden lg:block
          w-[70%] h-screen
          bg-cover bg-center
          rounded-r-xl
        "
        style={{
          backgroundImage: "url('/src/assets/fondo.png')",
        }}
      />

      {/* DERECHA - LOGIN */}
      <div className="w-full lg:w-[40%] h-screen flex items-center justify-center px-6">

        <Card className="w-full max-w-[480px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Header institucional */}
          <CardHeader className="pt-10 pb-6 text-center space-y-3">
            <div className="mx-auto w-24 h-24 rounded-full bg-primario/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primario icon-xl">
                account_balance
              </span>
            </div>

            <p className="text-gray-500 text-sm font-semibold tracking-widest uppercase">
              Sistema Administrativo
            </p>

            <CardTitle className="text-[32px] font-bold tracking-tight text-primario-dark">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>

          {/* Formulario */}
          <CardContent className="px-8 pb-10 space-y-6">

            {/* Usuario */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-primario-dark">
                Correo
              </Label>

              <div className="flex group">
                <div className="
                  flex items-center justify-center
                  px-4 rounded-l-lg
                  border border-r-0 border-[#e4dcdf]
                  text-gray-400
                  group-focus-within:text-primario
                  transition-colors
                ">
                  <span className="material-symbols-outlined">person</span>
                </div>

                <Input
                  className="
                    h-14 rounded-l-none
                    border-[#e4dcdf]
                    focus:border-primario
                    focus:ring-2 focus:ring-primario/20
                    placeholder:text-[#85666e]
                    text-base
                  "
                  placeholder="Ingrese su correo"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-primario-dark">
                Contraseña
              </Label>

              <div className="flex group">
                <div className="
                  flex items-center justify-center
                  px-4 rounded-l-lg
                  border border-r-0 border-[#e4dcdf]
                  text-gray-400
                  group-focus-within:text-primario
                  transition-colors
                ">
                  <span className="material-symbols-outlined">lock</span>
                </div>

                <Input
                  type="password"
                  className="
                    h-14 rounded-l-none
                    border-[#e4dcdf]
                    focus:border-primario
                    focus:ring-2 focus:ring-primario/20
                    placeholder:text-[#85666e]
                    text-base
                  "
                  placeholder="Ingrese su contraseña"
                />
              </div>
            </div>

            {/* Botón */}
            <Button
              className="
                w-full h-14
                bg-primario hover:bg-primario-dark
                text-white text-lg font-bold
                tracking-wide
                shadow-md shadow-primario/20
                transition-colors
              "
            >
              Entrar
            </Button>

          </CardContent>

          {/* Barra inferior institucional */}
          <div className="h-2 w-full bg-gradient-to-r from-primario via-[#b32d4e] to-primario" />
        </Card>
      </div>
    </div>
  );
}
