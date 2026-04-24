import { createContext, useContext, useState } from "react";
import Alerts from "@/components/Alerts";

type AlertType = "success" | "error" | "info" | "delete" | "warning";

type AlertContextType = {
  showAlert: (
    type: AlertType,
    message: string,
    title?: string
  ) => Promise<boolean>;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState({
    open: false,
    type: "info" as AlertType,
    title: "",
    message: "",
  });

  const [resolver, setResolver] = useState<
    ((value: boolean) => void) | null
  >(null);

  const showAlert = (
    type: AlertType,
    message: string,
    title = ""
  ) => {
    return new Promise<boolean>((resolve) => {
      setAlertState({
        open: true,
        type,
        title,
        message,
      });

      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
    resolver?.(true);
  };

  const handleCancel = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
    resolver?.(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Alerts
        open={alertState.open}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }
  return context;
};