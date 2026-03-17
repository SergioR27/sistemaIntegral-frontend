import { createCrudService } from "@/api/general.api";

const empleadoBase = createCrudService("/empleados");

export const handleSave = async (data: any) => {
  try {
    const response = await empleadoBase.create(data);

    return {
      success: true,
      message: "Servidor Público creado correctamente",
      data: response.data,

    };

  } catch (error: any) {
    console.error("Error al crear Servidor Público:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear el Servidor Público",
    };
  }
};

export const obtenerEmpleados = async () => {
  try {
    const response = await empleadoBase.getAll();
    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al obtener Servidor Público:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener Servidor Público",
    };
  }
}

export const updateEmpleados = async (id: number, data: any) => {
  try {

    const response = await empleadoBase.update(id, data);

    return {
      success: true,
      message: "Servidor Público actualizado correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al actualizar el Servidor Público:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar Servidor Público",
    };

  }
}

export const handleDelete = async (id: any) => {
  try {

    const response = await empleadoBase.delete(id);

    return {
      success: true,
      message: "Servidor Público eliminado correctamente",
      data: response.data,
    };

  } catch (error) {
    console.error("Error al eliminar Servidor Público", error);
    throw error;
  }
}