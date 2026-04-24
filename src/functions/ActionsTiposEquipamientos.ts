import { createCrudService } from "@/api/general.api";

const tipoEquipamientoBase = createCrudService("/tipoEquipamiento");

export const obtenerTiposEquipamientos = async () => {
  try {
    const response = await tipoEquipamientoBase.getAll();
    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener Tipos Equipamiento:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener Tipos Equipamiento",
    };
  }
};


export const handleSave = async (data: any) => {
  try {
    const response = await tipoEquipamientoBase.create(data);

    return {
      success: true,
      message: "Tipo Equipamiento creado correctamente",
      data: response.data,

    };

  } catch (error: any) {
    // console.error("Error al crear marca:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear Tipo Equipamiento",
    };
  }
};


export const handleDelete = async (id: any) => {
  try {

    const response = await tipoEquipamientoBase.delete(id);

    return {
      success: true,
      message: "Tipos Equipamiento eliminado correctamente",
      data: response.data,
    };

  } catch (error) {
    console.error("Error al eliminar Tipos Equipamiento", error);
    throw error;
  }
}

export const updateTipoEquipamiento = async (id: number, data: any) => {
  try {

    console.log(id)
    console.log("val", data)

    const response = await tipoEquipamientoBase.update(id, data);

    return {
      success: true,
      message: "Tipos Equipamiento actualizado correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al actualizar Tipos Equipamiento:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar Tipos Equipamiento",
    };
  }
};