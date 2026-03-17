import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Download } from "lucide-react";
import {
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";

type Props = {
  empleado: Empleado;
};

type Estatus = "activo" | "baja" | "licencia";

export default function QRCard({ empleado }: Props) {

  const qrRef = useRef(null);
  const qrSmall = useRef<any>(null);
  const qrDownload = useRef<any>(null);


  const estatusColor: Record<Estatus, string> = {
    activo: "bg-green-600 text-white",
    baja: "bg-red-500 text-white",
    licencia: "bg-yellow-500 text-black",
  };

  useEffect(() => {

    // limpiar si ya existe (evita QR duplicados)
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
    }

    qrSmall.current = new QRCodeStyling({
      width: 150,
      height: 150,
      data: 'http://sistemas.imife.gob.mx:8088/ServidoresPublicos/' + empleado.qr_token.toString(),
      image: "/SO.png", // opcional (logo en medio)
      dotsOptions: {
        color: "#000000",
        type: "extra-rounded"
      },
      backgroundOptions: {
        color: "#ffffff"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0
      },

    });

    qrSmall.current.append(qrRef.current);

    qrDownload.current = new QRCodeStyling({
      width: 290,
      height: 290,
      data: 'http://sistemas.imife.gob.mx:8088/ServidoresPublicos/' + empleado.qr_token.toString(),
      image: "/SO.png", // opcional (logo en medio)
      margin: 2,
      dotsOptions: {
        color: "#000000",
        type: "extra-rounded"
      },
      backgroundOptions: {
        color: "#ffffff"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 2
      },
      // qrOptions: {
      //   errorCorrectionLevel: "H"
      // }
    });


  }, [empleado.id_empleado]);

  const descargarQR = () => {
    qrDownload.current.download({
      name: `codigo_qr-${empleado.id_empleado}`,
      extension: "png"
    });
  };

  return (
    <CardFooter className="flex items-center justify-between py-3">

      {/* Estatus */}
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <span>Estatus:</span>
        <Badge className={estatusColor[empleado.estatus as Estatus] || "bg-gray-400 text-white mr-4"}>
          {empleado.estatus}
        </Badge>
      </div>

      {/* QR + Descargar */}
      <div className="flex items-center gap-3">

        <Download
          size={24}
          className="text-primario cursor-pointer"
          onClick={descargarQR}
        />

        <div className="bg-white p-2 rounded-lg shadow">
          <div ref={qrRef}></div>
        </div>

      </div>

    </CardFooter>
  );
}