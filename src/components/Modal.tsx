import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string; // 👈 agregar esto
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  className = "",
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent
        className={`
          w-[95vw]
          sm:w-[90vw]
          md:w-[85vw]
          lg:w-[80vw]
          xl:max-w-5xl
          max-h-[80vh]
          overflow-y-auto
          dark:bg-oscuro-relleno
          dark:border-oscuro-redondear
          ${className}
        `}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}