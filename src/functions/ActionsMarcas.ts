import { createCrudService } from "@/api/general.api";

const marcaBase = createCrudService("/marca");

export const obtenerMarcas = async () => {
  try {
    const response = await marcaBase.getAll();
    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener Marcas:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener Marcas",
    };
  }
};


export const handleSave = async (data: any) => {
  try {
    const response = await marcaBase.create(data);

    return {
      success: true,
      message: "Marca creada correctamente",
      data: response.data,

    };

  } catch (error: any) {
    console.error("Error al crear marca:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear marca",
    };
  }
};


export const handleDelete = async (id: any) => {
  try {

    const response = await marcaBase.delete(id);

    return {
      success: true,
      message: "Marca eliminada correctamente",
      data: response.data,
    };

  } catch (error) {
    console.error("Error al eliminar marca", error);
    throw error;
  }
}