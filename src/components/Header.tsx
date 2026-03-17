import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from "./Modal";

interface HeaderProps {
  titulo: string;
  subTitulo?: string;
  botonTexto?: string;
  modalTitle?: string;
  modalContent?: React.ReactNode | ((close: () => void) => React.ReactNode);

  // nuevos props opcionales
  open?: boolean;
  setOpen?: (value: boolean) => void;
}

export default function Header({
  titulo,
  subTitulo,
  botonTexto,
  modalTitle,
  modalContent,
  open,
  setOpen,
}: HeaderProps) {

  // estado interno solo si no se controla desde afuera
  const [internalOpen, setInternalOpen] = useState(false);

  const modalOpen = open ?? internalOpen;
  const modalSetOpen = setOpen ?? setInternalOpen;

  const closeModal = () => modalSetOpen(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

      {/* Título */}
      <div className="md:col-span-2">
        <h3 className="text-slate-950 dark:text-white text-4xl font-black tracking-tight">
          {titulo}
        </h3>

        {subTitulo && (
          <p className="text-primario dark:text-gray-400 text-lg mt-2">
            {subTitulo}
          </p>
        )}
      </div>

      {/* Botón + Modal */}
      {botonTexto && modalContent && (
        <div className="flex md:justify-end">

          <Modal
            open={modalOpen}
            onOpenChange={modalSetOpen}
            title={modalTitle ?? ""}
            trigger={
              <Button
                onClick={() => modalSetOpen(true)}
                className="bg-primario text-white hover:bg-primario-dark flex items-center gap-2 w-full md:w-auto"
              >
                <Plus size={22} />
                {botonTexto}
              </Button>
            }
          >
            {typeof modalContent === "function"
              ? modalContent(closeModal)
              : modalContent}
          </Modal>

        </div>
      )}
    </div>
  );
}