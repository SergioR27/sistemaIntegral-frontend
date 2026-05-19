import pdfMake from "@/utils/pdfMake";
import { obtenerDetalleGrupo } from "@/functions/ActionsDispositivos";
import logoHeader from "@/assets/cabecera_IMIFE.png";
import logoFooter from "@/assets/pie_pagina.png";

type ShowAlertFn = (
  type: "success" | "error" | "warning" | "delete",
  message: string,
  title?: string
) => Promise<any>;

const getBase64ImageFromURL = async (url: string) => {

  const data = await fetch(url);

  const blob = await data.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};

export const descargarPdfGrupo = async (
  idGrupo: number,
  showAlert: ShowAlertFn
) => {
  const res = await obtenerDetalleGrupo(idGrupo);

  const headerBase64 =
    await getBase64ImageFromURL(logoHeader);

  const footerBase64 =
    await getBase64ImageFromURL(logoFooter);

  if (!res.success) {
    await showAlert("error", res.message, "Error");
    return;
  }

  const grupoPdf = res.data;

  const codigoGrupo = `CTRL-IMIFE-${String(
    grupoPdf.numero_control
  ).padStart(3, "0")}`;

  const qrValue = `http://sar.imife.gob.mx/?id=${grupoPdf.numero_control}&SDERT`;

  const asignacion = grupoPdf.asignaciones?.[0];

  const asignacionNombre = asignacion
    ? `${asignacion.asignacionEmpleado?.nombre || ""} ${asignacion.asignacionEmpleado?.apellidos || ""
      }`.trim()
    : "N/A";

  const area =
    asignacion?.asignacionEmpleado?.area?.nombre_area || "N/A";

  const fechaAsignacion =
    asignacion?.fecha_asignacion || "N/A";

  const dispositivosRows =
    grupoPdf.detalles?.map((item: any) => {
      const d = item.dispositivos;

      return [
        d.tipo?.nombre_tipo || "—",

        `${d.modelo?.marca?.nombre_marca || ""
          } ${d.modelo?.nombre_modelo || ""}`.trim() || "—",

        d.numero_serie || "—",

        d.numero_inventario || "—",

        d.estatus || "—",

        [
          d.service_tag
            ? `Service Tag: ${d.service_tag}`
            : null,

          d.procesador
            ? `CPU: ${d.procesador}`
            : null,

          d.ram
            ? `RAM: ${d.ram} GB`
            : null,

          d.disco_duro
            ? `Disco: ${d.disco_duro} GB`
            : null,

          d.mac_ethernet
            ? `MAC ETH: ${d.mac_ethernet}`
            : null,

          d.mac_wifi
            ? `MAC WIFI: ${d.mac_wifi}`
            : null,
        ]
          .filter(Boolean)
          .join("\n") || "Sin datos técnicos",
      ];
    }) || [];

  const observaciones =
    grupoPdf.observaciones?.map((obs: any) => ({
      text: `• ${obs.comentario}`,
      margin: [0, 2, 0, 2],
      fontSize: 9,
    })) || [
      {
        text: "Sin observaciones",
        color: "#6b7280",
      },
    ];

  /**
   * HEADER BASE64
   * Reemplaza esto por tu imagen real
   */
  // const headerBase64 = logoHeader;

  /**
   * FOOTER BASE64
   * Reemplaza esto por tu imagen real
   */
  // const footerBase64 = logoFooter;

  const docDefinition: any = {
    pageSize: "LETTER",

    pageMargins: [25, 60, 25, 70],

    header: () => {
      return {
        margin: [20, 10, 20, 0],
        image: headerBase64,
        width: 550,
      };
    },

    footer: () => {
      return {
        margin: [20, 0, 20, 10],

        columns: [
          {
            image: footerBase64,
            width: 470,
          },

          {
            qr: qrValue,
            fit: 55,
            alignment: "right",
          },
        ],
      };
    },

    content: [
      /**
       * TITULO
       */
      {
        text: "RESGUARDO DE EQUIPO DE CÓMPUTO",
        style: "titulo",
        margin: [0, 20, 0, 10],
      },

      /**
       * TABLA GENERAL
       */
      {
        table: {
          widths: [70, "*", 65, 85, 80],

          body: [
            [
              {
                text: "Tipo",
                style: "vinoHeader",
              },

              {
                text: grupoPdf.tipo || "Grupo",
                style: "beigeCell",
              },

              {
                text: "Fecha",
                style: "vinoHeader",
              },

              {
                text: "Control",
                style: "vinoHeader",
              },

              {
                text: "Inventario",
                style: "vinoHeader",
              },
            ],

            [
              "",

              "",

              grupoPdf.created_at || "N/A",

              codigoGrupo,

              grupoPdf.numero_inventario || "N/A",
            ],
          ],
        },

        layout: {
          hLineColor: () => "#ffffff",
          vLineColor: () => "#ffffff",
        },

        margin: [0, 0, 0, 10],
      },

      /**
       * DATOS DEL USUARIO
       */
      {
        table: {
          widths: [80, "*", 80, "*"],

          body: [
            [
              {
                text: "DATOS DEL USUARIO",
                colSpan: 4,
                style: "vinoHeader",
              },
              {},
              {},
              {},
            ],

            [
              {
                text: "Nombre",
                style: "beigeHeader",
              },

              asignacionNombre,

              {
                text: "Fecha",
                style: "beigeHeader",
              },

              fechaAsignacion,
            ],

            [
              {
                text: "Área",
                style: "beigeHeader",
              },

              area,

              {
                text: "Estatus",
                style: "beigeHeader",
              },

              grupoPdf.estatus || "N/A",
            ],

            [
              {
                text: "Token",
                style: "beigeHeader",
              },

              grupoPdf.token || "N/A",

              {
                text: "Dispositivos",
                style: "beigeHeader",
              },

              grupoPdf.detalles?.length || 0,
            ],
          ],
        },

        layout: {
          fillColor: (rowIndex: number) => {
            return rowIndex === 0 ? "#56212f" : null;
          },

          hLineColor: () => "#d1d5db",

          vLineColor: () => "#d1d5db",
        },

        margin: [0, 0, 0, 12],
      },

      /**
       * INVENTARIO
       */
      {
        text: "DESCRIPCIÓN DEL EQUIPO",
        style: "section",
      },

      {
        table: {
          headerRows: 1,

          widths: [60, "*", 70, 70, 55, "*"],

          body: [
            [
              {
                text: "Tipo",
                style: "th",
              },

              {
                text: "Modelo",
                style: "th",
              },

              {
                text: "Serie",
                style: "th",
              },

              {
                text: "Inventario",
                style: "th",
              },

              {
                text: "Estatus",
                style: "th",
              },

              {
                text: "Especificaciones",
                style: "th",
              },
            ],

            ...dispositivosRows,
          ],
        },

        layout: {
          fillColor: (rowIndex: number) => {
            if (rowIndex === 0) return "#56212f";

            return rowIndex % 2 === 0
              ? "#f5f5f5"
              : null;
          },

          hLineColor: () => "#d1d5db",

          vLineColor: () => "#d1d5db",
        },

        margin: [0, 0, 0, 12],
      },

      /**
       * OBSERVACIONES
       */
      {
        table: {
          widths: ["*"],

          body: [
            [
              {
                text: "OBSERVACIONES",
                style: "vinoHeader",
              },
            ],

            [
              {
                stack: observaciones,
                margin: [5, 5, 5, 40],
              },
            ],
          ],
        },

        layout: {
          hLineColor: () => "#d1d5db",

          vLineColor: () => "#d1d5db",
        },

        margin: [0, 0, 0, 12],
      },

      /**
       * TEXTO LEGAL
       */
      {
        text:
          "Como usuario resguardatario a partir de esta fecha recibo los bienes señalados en el presente y me comprometo a hacer uso responsable de los mismos y conservarlos en óptimas condiciones físicas y operativas para el desempeño de mis funciones dentro del Instituto.",

        fontSize: 9,

        alignment: "justify",

        margin: [0, 0, 0, 5],
      },

      {
        text:
          "Así mismo acepto la responsabilidad completa del contenido de los archivos que se encuentren en el equipo y reconozco que es mi deber informar por escrito a mi superior y las áreas involucradas.",

        fontSize: 9,

        alignment: "justify",

        margin: [0, 0, 0, 5],
      },

      {
        text:
          "Cualquier revisión, diagnóstico o instalación de software y/o componentes estarán a cargo de la Unidad de Tecnologías de la Información.",

        fontSize: 9,

        alignment: "justify",

        margin: [0, 0, 0, 5],
      },

      {
        text:
          "NOTA: Este resguardo con fecha más reciente sustituye a los anteriores que se hayan firmado y los deja sin efectos.",

        bold: true,

        fontSize: 9,

        alignment: "justify",

        margin: [0, 0, 0, 20],
      },

      /**
       * FIRMAS
       */
      {
        table: {
          widths: ["*", "*"],

          body: [
            [
              {
                text: "USUARIO RESPONSABLE",
                bold: true,
                alignment: "center",
                border: [false, false, false, false],
              },

              {
                text: "IMPLEMENTADOR",
                bold: true,
                alignment: "center",
                border: [false, false, false, false],
              },
            ],

            [
              {
                text:
                  "\n\n\n__________________________________",

                alignment: "center",

                border: [false, false, false, false],
              },

              {
                text:
                  "\n\n\n__________________________________",

                alignment: "center",

                border: [false, false, false, false],
              },
            ],

            [
              {
                text: asignacionNombre,

                alignment: "center",

                border: [false, false, false, false],
              },

              {
                text:
                  "UNIDAD DE TECNOLOGÍAS DE LA INFORMACIÓN",

                alignment: "center",

                border: [false, false, false, false],
              },
            ],

            [
              {
                text: "\nVALIDA",

                bold: true,

                alignment: "center",

                border: [false, false, false, false],
              },

              {
                text: "\nVALIDA",

                bold: true,

                alignment: "center",

                border: [false, false, false, false],
              },
            ],

            [
              {
                text:
                  "\n\n__________________________________",

                alignment: "center",

                border: [false, false, false, false],
              },

              {
                text:
                  "\n\n__________________________________",

                alignment: "center",

                border: [false, false, false, false],
              },
            ],

            [
              {
                text:
                  "LIC. ADRIANA MUÑOZ MARTIN\nTITULAR DE LA UNIDAD DE TECNOLOGÍAS DE LA INFORMACIÓN",

                alignment: "center",

                fontSize: 8,

                border: [false, false, false, false],
              },

              {
                text:
                  "M. EN A.P. JOSÉ ALFREDO SANTOS PALMA\nSUBDIRECTOR DE ADMINISTRACIÓN",

                alignment: "center",

                fontSize: 8,

                border: [false, false, false, false],
              },
            ],
          ],
        },

        layout: "noBorders",
      },
    ],

    styles: {
      titulo: {
        fontSize: 14,
        bold: true,
        alignment: "center",
        color: "#56212f",
      },

      section: {
        fontSize: 11,
        bold: true,
        color: "#111827",
        margin: [0, 8, 0, 8],
      },

      vinoHeader: {
        fillColor: "#56212f",

        color: "#ffffff",

        bold: true,

        alignment: "center",

        fontSize: 9,
      },

      beigeHeader: {
        fillColor: "#c3b08f",

        bold: true,

        fontSize: 9,

        alignment: "center",
      },

      beigeCell: {
        fillColor: "#c3b08f",

        bold: true,

        alignment: "center",

        fontSize: 9,
      },

      th: {
        bold: true,

        color: "#ffffff",

        alignment: "center",

        fontSize: 8,
      },
    },

    defaultStyle: {
      fontSize: 8,
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`${codigoGrupo}.pdf`);
};