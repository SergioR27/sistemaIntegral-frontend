import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Info, Trash2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

type AlertType = "success" | "error" | "info" | "delete" | "warning";

type AlertsProps = {
  open: boolean;
  type: AlertType;
  title: string;
  message: any;
  requireInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  confirmText?: string;
  onInputChange?: (value: string) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function Alerts({
  open,
  type,
  title,
  message,
  requireInput = false,
  inputLabel = "",
  inputPlaceholder = "",
  inputValue = "",
  confirmText = "",
  onInputChange,
  onConfirm,
  onCancel,
}: AlertsProps) {

  const styles = {
    success: {
      icon: <CheckCircle className="w-14 h-14 text-green-500" />,
      button: "bg-red-900 hover:bg-red-800",
    },
    error: {
      icon: <XCircle className="w-14 h-14 text-red-500" />,
      button: "bg-red-600 hover:bg-red-700",
    },
    info: {
      icon: <Info className="w-14 h-14 text-blue-500" />,
      button: "bg-red-900 hover:bg-red-800",
    },
    delete: {
      icon: <Trash2 className="w-14 h-14 text-red-500" />,
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: <AlertTriangle className="w-14 h-14 text-yellow-500" />,
      button: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
  };

  const current = styles[type];
  const isConfirmDisabled = requireInput && !inputValue.trim();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md rounded-2xl shadow-2xl">
        <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
          {current.icon}

          <AlertDialogTitle className="text-2xl font-bold">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-base text-muted-foreground">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requireInput && (
          <div className="space-y-2">
            {inputLabel && (
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {inputLabel}
              </label>
            )}

            <Input
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full"
            />
          </div>
        )}

        <AlertDialogFooter className="flex justify-center gap-3 pt-4">
          {type === "delete" && (
            <AlertDialogCancel onClick={onCancel}>
              Cancelar
            </AlertDialogCancel>
          )}

          <AlertDialogAction
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={`text-white ${current.button}`}
          >
            {confirmText || (type === "delete" ? "Eliminar" : "Aceptar")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );



}
