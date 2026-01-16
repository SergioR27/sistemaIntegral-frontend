import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ModalProps = {
  title: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string; // más flexible que maxWidth
};

export default function Modal({
  title,
  trigger,
  children,
  className = "",
}: ModalProps) {
  return (
    <Dialog>
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
          ${className}
        `}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
