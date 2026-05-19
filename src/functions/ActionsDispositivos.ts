import api from "@/api/axios";
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


export const updateDispositivo = async (id: number, data: any) => {
  try {

    console.log(id);
    const response = await dispositivoBase.update(id, data);

    return {
      success: true,
      message: "Dispositivos actualizada correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al actualizar Dispositivos:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar Dispositivos",
    };
  }
};

export const handleDelete = async (id: number, motivo_baja?: string) => {
  try {
    const response = await dispositivoBase.delete(id, {
      data: {
        motivo_baja,
      },
    });

    return {
      success: true,
      message: "Dispositivo dado de baja correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al eliminar Dispositivo", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al dar de baja el dispositivo",
    };
  }
}

export const handleDeleteGroup = async (idGrupo: number, motivo_baja?: string) => {
  try {
    const response = await api.put(`/dispositivo/grupo/${idGrupo}/baja`, {
      motivo_baja,
    });

    return {
      success: true,
      message: response.data?.message || "Grupo dado de baja correctamente",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error al dar de baja Grupo", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al dar de baja el grupo",
    };
  }
}

export const handleAssignGroup = async (idGrupo: number, sid_empleado: number) => {
  try {
    const response = await api.post(`/dispositivo/grupo/${idGrupo}/asignacion`, {
      sid_empleado,
    });

    return {
      success: true,
      message: response.data?.message || "Grupo asignado correctamente",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error al asignar Grupo", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al asignar el grupo",
    };
  }
}

export const handleUnassignGroup = async (idGrupo: number) => {
  try {
    const response = await api.delete(`/dispositivo/grupo/${idGrupo}/asignacion`);

    return {
      success: true,
      message: response.data?.message || "Asignación retirada correctamente",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error al quitar asignación del Grupo", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Error al quitar la asignación del grupo",
    };
  }
}

export const handleComentario = async (comentario: string, idGrupo: number) => {
  try {
    const response = await api.post(`/dispositivo/grupo/${idGrupo}/comentario`, {
      comentario,
    });

    return {
      success: true,
      message: response.data?.message || "Comentario agregado correctamente",
      data: response.data,
    };

  } catch (error: any) {
    console.error("Error al agregar comentario del Grupo", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "No se pudo agregar el comentario",
    };
  }
}

type ActualizarGrupoDispositivoPayload = {
  sid_grupo: number;
};

export const actualizarGrupoDispositivo = async (
  id: number,
  data: ActualizarGrupoDispositivoPayload
) => {

  try {

    const response = await api.put(
      `/dispositivo/asignar-dispositivo-grupo/${id}`,
      data
    );

    return response.data;

  } catch (error: any) {

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al actualizar",
    };
  }
};
