import { createCrudService } from "@/api/general.api";

const areaBase = createCrudService("/areas");

export const handleSave = async (data: any) => {
  try {
    const response = await areaBase.create(data);

    return {
      success: true,
      message: "Área creada correctamente",
      data: response.data,

    };

  } catch (error: any) {
    console.error("Error al crear área:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear área",
    };
  }
};

export const obtenerAreas = async () => {
  try {
    const response = await areaBase.getAll();
    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener áreas:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener áreas",
    };
  }
}

export const obtenerPadres = async () => {
  try {

    const response = await areaBase.getAll({
      parent_id_is_null: true,
    });

    return response.data;

  } catch (error) {
    console.error("Error al obtener áreas padre:", error);
    throw error;

  }
}

export const handleDelete = async (id: any) => {
  try {

    const response = await areaBase.delete(id);

    return {
      success: true,
      message: "Área eliminada correctamente",
      data: response.data,
    };

  } catch (error) {
    console.error("Error al eliminar área", error);
    throw error;
  }
}

export const updateArea = async (id: number, data: any) => {
  try {

    const response = await areaBase.update(id, data);

    return {
      success: true,
      message: "Área actualizada correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al actualizar área:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar área",
    };
  }
};