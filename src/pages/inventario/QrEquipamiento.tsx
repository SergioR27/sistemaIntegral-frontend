import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import QRCodeStyling from "qr-code-styling";
import { toPng } from "html-to-image";

export type QrEquipamientoHandle = {
  download: () => Promise<void>;
};

type Props = {
  codigo: string;
  size?: number;
};

const QrEquipamiento = forwardRef<QrEquipamientoHandle, Props>(
  ({ codigo, size = 150 }, ref) => {
    const qrRef = useRef<HTMLDivElement | null>(null);
    const qrDownloadRef = useRef<HTMLDivElement | null>(null);
    const qrInstance = useRef<any>(null);
    const qrDownloadInstance = useRef<any>(null);

    useEffect(() => {
      if (!codigo || !qrRef.current || !qrDownloadRef.current) return;

      qrRef.current.innerHTML = "";
      qrDownloadRef.current.innerHTML = "";

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
      });

      qrDownloadInstance.current = new QRCodeStyling({
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
      });

      qrInstance.current.append(qrRef.current);
      qrDownloadInstance.current.append(qrDownloadRef.current);
    }, [codigo, size]);

    useImperativeHandle(ref, () => ({
      download: async () => {
        const node = document.getElementById(`qr-export-${codigo}`);
        if (!node) return;

        const dataUrl = await toPng(node, {
          cacheBust: true,
          backgroundColor: "#ffffff",
          skipFonts: true,
        });

        const link = document.createElement("a");
        link.download = `${codigo}.png`;
        link.href = dataUrl;
        link.click();
      },
    }));

    return (
      <>
        {/* Vista en pantalla */}
        <div className="bg-white dark:bg-oscuro-fondo rounded-2xl shadow p-2 flex flex-col items-center">
          <div className="bg-white rounded-lg">
            <div ref={qrRef}></div>
          </div>

          <p className="text-xs text-gray-400">
            {codigo}
          </p>
        </div>

        {/* Vista para descarga */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <div
            id={`qr-export-${codigo}`}
            className="bg-white p-2 flex flex-col items-center"
          >
            <div className="bg-white">
              <div ref={qrDownloadRef}></div>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {codigo}
            </p>
          </div>
        </div>
      </>
    );
  }
);

export default QrEquipamiento;
