import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

type Props = {
  codigo: string; // 👈 CTRL-IMIFE-0001
  size?: number;
};

export default function QrEquipamiento({ codigo, size = 150 }: Props) {

  const qrRef = useRef<HTMLDivElement | null>(null);
  const qrInstance = useRef<any>(null);

  useEffect(() => {
    if (!codigo) return;

    // limpiar
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
    }

    // 🔥 URL FINAL
    const url = `http://sar.imife.gob.mx/?id=${codigo}&SDERT`;

    qrInstance.current = new QRCodeStyling({
      width: size,
      height: size,
      data: url,

      dotsOptions: {
        color: "#000000",
        type: "extra-rounded",
      },

      backgroundOptions: {
        color: "#ffffff",
      },

      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0,
      },
    });

    qrInstance.current.append(qrRef.current);

  }, [codigo, size]);

  return (
    <div className="bg-white dark:bg-oscuro-fondo rounded-2xl shadow p-4 flex flex-col items-center">

      <div className="bg-white p-3 rounded-lg">
        <div ref={qrRef}></div>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        CTRL-IMIFE-{codigo}
      </p>

    </div>
  );
}