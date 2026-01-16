import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex">

      {/* IZQUIERDA - 60% IMAGEN */}
      <div
        className="
          hidden
          lg:block
          w-[70%]
          h-screen
          bg-cover
          bg-center
          rounded-r-lg
        "
        style={{
          backgroundImage: "url('/src/assets/fondo.png')",
        }}
      />

      {/* DERECHA - 40% LOGIN */}
      <div className="w-full lg:w-[40%] h-screen flex items-center justify-center bg-grisClaro">

        <Card className="w-full max-w-[420px] mx-6 bg-white rounded-xl shadow-xl border border-primario/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primario">
              Iniciar Sesión
            </CardTitle>
            <p className="text-sm text-gray-500">
              Accede a tu cuenta
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-1">
              <Label>Correo</Label>
              <Input placeholder="usuario@correo.com" />
            </div>

            <div className="space-y-1">
              <Label>Contraseña</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <Button className="w-full bg-primario hover:bg-primario-dark text-white">
              Acceder
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
