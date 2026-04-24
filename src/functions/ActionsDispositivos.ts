import { createCrudService } from "@/api/general.api";

const dispositivoBase = createCrudService("/dispositivo");

export const handleSave = async (data: any) => {
  try {

    console.log(data);
    const response = await dispositivoBase.create(data);

    return {
      success: true,
      message: "Dispositivo creado correctamente",
      data: response.data,

    };

  } catch (error: any) {
    console.error("Error al crear Dispositivo:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear el Dispositivo",
    };
  }
};
export const obtenerCodigoPreview = async () => {
  try {
    const response = await dispositivoBase.get("/preview-codigo");
    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener numero:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener numero",
    };
  }
};

export const obtenerDispositivos = async () => {
  try {
    const response = await dispositivoBase.getAll();
    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener Dispositivos:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener Dispositivos",
    };
  }
}


export const obtenerDetalleGrupo = async (idGrupo: number) => {
  try {
    const response = await dispositivoBase.get(`/grupo/${idGrupo}`);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener detalle del grupo",
    };
  }
};