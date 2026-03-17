import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generarQR } from "./generarQR";

export async function descargarTodo(empleados) {

  const zip = new JSZip();

  for (const emp of empleados) {

    const qrBlob = await generarQR(emp.qr_token);

    const nombre = emp.nombre
      .replace(/\s+/g, "_")
      .toLowerCase();

    zip.file(
      `QR_${nombre}_${emp.id_empleado}.png`,
      qrBlob
    );
  }

  const archivo = await zip.generateAsync({ type: "blob" });

  saveAs(archivo, "qr_empleados.zip");
}