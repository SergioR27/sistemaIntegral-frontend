import { createCrudService } from "@/api/general.api";

const nombramientoBase = createCrudService("/nombramientos");

export const handleSave = async (data: FormData | Record<string, any>) => {
  try {

    const response = await nombramientoBase.create(data);

    return {
      success: true,
      message: "Nombramiento creado correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al crear nombramiento:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al crear el nombramiento",
    };
  }
};

export const obtenerNombramientos = async () => {
  try {
    const response = await nombramientoBase.getAll();
    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener Nombramiento:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener Nombramiento",
    };
  }
}

export const updateNombramiento = async (id: number, formData: FormData) => {
  try {

    const response = await nombramientoBase.update(id, formData);

    return {
      success: true,
      message: "Nombramiento actualizado correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al actualizar nombramiento:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al actualizar nombramiento",
    };
  }
};

export const obtenerOrganigrama = async () => {
  try {

    const response = await nombramientoBase.getAll({
      customUrl: "/organigrama-tree"
    });

    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener organigrama:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al obtener organigrama",
    };
  }
};


export const darBajaNombramiento = async (
  id: number,
  fechaFin: string
) => {
  try {

    console.log(" datos: " + fechaFin + " " + id);
    const formData = new FormData();
    formData.append("fecha_fin", fechaFin);
    formData.append("activo", "false");

    const response = await nombramientoBase.update(id, formData);

    return {
      success: true,
      message: "Nombramiento dado de baja correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al dar de baja:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al actualizar nombramiento",
    };
  }
};

export const obtenerHistorialNombramientos = async (areaId: number) => {
  try {
    const response = await nombramientoBase.getAll({
      customUrl: `/historial/${areaId}`
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al obtener los datos del historial",
    };
  }
}