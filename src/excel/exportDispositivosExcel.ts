import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const crearFechaArchivo = () => {
  const now = new Date();

  return (
    String(now.getDate()).padStart(2, "0") +
    String(now.getMonth() + 1).padStart(2, "0") +
    now.getFullYear() +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0")
  );
};

const obtenerGrupo = (dispositivo: any) => {
  const numeroControl = dispositivo.grupoDetalle?.[0]?.grupoEquipo?.numero_control;

  if (!numeroControl) return "SIN GRUPO";

  return `CTRL-IMIFE-${String(numeroControl).padStart(3, "0")}`;
};

const obtenerAsignacionActiva = (dispositivo: any) => {
  const asignaciones = dispositivo.grupoDetalle?.[0]?.grupoEquipo?.asignaciones || [];

  return asignaciones.find((item: any) => item.estatus === "ACTIVO") || null;
};

const obtenerNombreAsignado = (dispositivo: any) => {
  const asignacionActiva = obtenerAsignacionActiva(dispositivo);
  const empleado = asignacionActiva?.asignacionEmpleado;

  if (!empleado) return "SIN ASIGNACION";

  return `${empleado.nombre || ""} ${empleado.apellidos || ""}`.trim() || "SIN ASIGNACION";
};

const obtenerDepartamentoAsignado = (dispositivo: any) => {
  const asignacionActiva = obtenerAsignacionActiva(dispositivo);
  return asignacionActiva?.asignacionEmpleado?.area?.nombre_area || "SIN DEPARTAMENTO";
};

export const exportDispositivosExcel = async (
  data: any[],
  fileName: string,
  sheetTitle = "REPORTE DE DISPOSITIVOS"
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Dispositivos");

  const response = await fetch("/logo.png");
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();

  const imageId = workbook.addImage({
    buffer,
    extension: "png",
  });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 150, height: 120 },
  });

  worksheet.mergeCells("A5:O5");

  const titulo = worksheet.getCell("A5");
  titulo.value = sheetTitle;
  titulo.font = { size: 16, bold: true };
  titulo.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.columns = [
    { key: "inventario", width: 18 },
    { key: "serie", width: 22 },
    { key: "service_tag", width: 18 },
    { key: "tipo", width: 18 },
    { key: "marca", width: 18 },
    { key: "modelo", width: 22 },
    { key: "estatus", width: 16 },
    { key: "grupo", width: 18 },
    { key: "procesador", width: 22 },
    { key: "ram", width: 12 },
    { key: "disco", width: 12 },
    { key: "mac_ethernet", width: 20 },
    { key: "mac_wifi", width: 20 },
    { key: "asignado_a", width: 28 },
    { key: "departamento", width: 24 },
  ];

  const headerRow = worksheet.getRow(6);
  headerRow.values = [
    "No. Inventario",
    "No. Serie",
    "Service Tag",
    "Tipo",
    "Marca",
    "Modelo",
    "Estatus",
    "Grupo",
    "Procesador",
    "RAM",
    "Disco Duro",
    "Mac Ethernet",
    "Mac WiFi",
    "Asignado a",
    "Departamento",
  ];

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF942241" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  data.forEach((dispositivo) => {
    const row = worksheet.addRow({
      inventario: dispositivo.numero_inventario || "S/N",
      serie: dispositivo.numero_serie || "S/N",
      service_tag: dispositivo.service_tag || "S/N",
      tipo: dispositivo.tipo?.nombre_tipo || "SIN TIPO",
      marca: dispositivo.modelo?.marca?.nombre_marca || "SIN MARCA",
      modelo: dispositivo.modelo?.nombre_modelo || "SIN MODELO",
      estatus: dispositivo.estatus || "SIN ESTATUS",
      grupo: obtenerGrupo(dispositivo),
      procesador: dispositivo.procesador || "S/N",
      ram: dispositivo.ram || "S/N",
      disco: dispositivo.disco_duro || "S/N",
      mac_ethernet: dispositivo.mac_ethernet || "S/N",
      mac_wifi: dispositivo.mac_wifi || "S/N",
      asignado_a: obtenerNombreAsignado(dispositivo),
      departamento: obtenerDepartamentoAsignado(dispositivo),
    });

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 10;

    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const length = cell.value ? cell.value.toString().length : 10;

      if (length > maxLength) maxLength = length;
    });

    column.width = maxLength + 2;
  });

  const bufferExcel = await workbook.xlsx.writeBuffer();
  const file = new Blob([bufferExcel]);

  saveAs(file, `${fileName} ${crearFechaArchivo()}.xlsx`);
};
