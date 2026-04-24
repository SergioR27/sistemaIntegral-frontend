import { createCrudService } from "@/api/general.api";

const modeloBase = createCrudService("/modelo");

export const obtenerModelos = async () => {
  try {
    const response = await modeloBase.getAll();
    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener Modelos:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener Modelos",
    };
  }
};


export const handleSave = async (data: any) => {
  try {
    const response = await modeloBase.create(data);

    return {
      success: true,
      message: "Modelo creado correctamente",
      data: response.data,

    };

  } catch (error: any) {
    // console.error("Error al crear marca:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear modelo",
    };
  }
};


export const handleDelete = async (id: any) => {
  try {

    const response = await modeloBase.delete(id);

    return {
      success: true,
      message: "Modelo eliminado correctamente",
      data: response.data,
    };

  } catch (error) {
    console.error("Error al eliminar modelo", error);
    throw error;
  }
}

export const updateModelo = async (id: number, data: any) => {
  try {

    console.log(data)

    const response = await modeloBase.update(id, data);

    return {
      success: true,
      message: "Modelo actualizado correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al actualizar modelo:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar modelo",
    };
  }
};