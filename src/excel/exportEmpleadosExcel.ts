import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportEmpleadosExcel = async (data: any[], fileName: string) => {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Empleados");

  /*
  ───────── IMAGEN (A2)
  */

  const response = await fetch("/logo.png");
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();

  const imageId = workbook.addImage({
    buffer: buffer,
    extension: "png",
  });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 150, height: 120 },
  });

  /*
  ───────── TITULO (A5:E5)
  */

  worksheet.mergeCells("A5:I5");

  const titulo = worksheet.getCell("A5");

  titulo.value = "REPORTE DE EMPLEADOS";
  titulo.font = { size: 16, bold: true };
  titulo.alignment = { vertical: "middle", horizontal: "center" };

  /*
  ───────── COLUMNAS (sin header)
  */

  worksheet.columns = [
    { key: "nombre", width: 20 },
    { key: "apellidos", width: 20 },
    { key: "area", width: 25 },
    { key: "categoria", width: 25 },
    { key: "correo", width: 30 },
    { key: "curp", width: 30 },
    { key: "nip_issemyn", width: 30 },
    { key: "municipio", width: 30 },
    { key: "estatus", width: 15 },
  ];

  /*
  ───────── ENCABEZADOS (A6)
  */

  const headerRow = worksheet.getRow(6);

  headerRow.values = [
    "Nombre",
    "Apellidos",
    "Área",
    "Categoría",
    "Correo",
    "Curp",
    "ISSEMYM",
    "Municipio",
    "Estatus",
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

  /*
  ───────── DATOS (A7)
  */

  data.forEach((e) => {

    const row = worksheet.addRow({
      nombre: e.nombre,
      apellidos: e.apellidos,
      area: e.area?.nombre_area,
      categoria: e.categoria,
      correo: e.correo ? e.correo : "Pendiente",
      curp: e.curp,
      nip_issemyn: e.nip_issemyn,
      municipio: e.municipio,
      estatus: e.estatus,
    });

    row.getCell("nip_issemyn").numFmt = "@";

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

  });

  /*
  ───────── AUTO AJUSTAR COLUMNAS
  */

  worksheet.columns.forEach((column) => {

    let maxLength = 10;

    column.eachCell?.({ includeEmpty: true }, (cell) => {

      const length = cell.value
        ? cell.value.toString().length
        : 10;

      if (length > maxLength) maxLength = length;

    });

    column.width = maxLength + 2;

  });

  /*
  ───────── NOMBRE ARCHIVO CON FECHA
  */

  const now = new Date();

  const fecha =
    String(now.getDate()).padStart(2, "0") +
    String(now.getMonth() + 1).padStart(2, "0") +
    now.getFullYear() +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0");

  const bufferExcel = await workbook.xlsx.writeBuffer();

  const file = new Blob([bufferExcel]);

  saveAs(file, `${fileName} ${fecha}.xlsx`);

};