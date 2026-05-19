import { createContext, useContext, useState } from "react";
import Alerts from "@/components/Alerts";

type AlertType = "success" | "error" | "info" | "delete" | "warning";

type AlertInputOptions = {
  requireInput: true;
  inputLabel?: string;
  inputPlaceholder?: string;
  confirmText?: string;
};

type AlertResult = {
  confirmed: boolean;
  value: string;
};

type AlertContextType = {
  showAlert: {
    (type: AlertType, message: string, title?: string): Promise<boolean>;
    (
      type: AlertType,
      message: string,
      title: string,
      options: AlertInputOptions
    ): Promise<AlertResult>;
  };
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState({
    open: false,
    type: "info" as AlertType,
    title: "",
    message: "",
    requireInput: false,
    inputLabel: "",
    inputPlaceholder: "",
    inputValue: "",
    confirmText: "",
  });

  const [resolver, setResolver] = useState<
    ((value: boolean | AlertResult) => void) | null
  >(null);

  function showAlert(
    type: AlertType,
    message: string,
    title?: string
  ): Promise<boolean>;
  function showAlert(
    type: AlertType,
    message: string,
    title: string,
    options: AlertInputOptions
  ): Promise<AlertResult>;
  function showAlert(
    type: AlertType,
    message: string,
    title = "",
    options?: AlertInputOptions
  ) {
    return new Promise<boolean | AlertResult>((resolve) => {
      setAlertState({
        open: true,
        type,
        title,
        message,
        requireInput: options?.requireInput ?? false,
        inputLabel: options?.inputLabel ?? "",
        inputPlaceholder: options?.inputPlaceholder ?? "",
        inputValue: "",
        confirmText: options?.confirmText ?? "",
      });

      setResolver(() => resolve);
    });
  }

  const handleConfirm = () => {
    const inputValue = alertState.inputValue.trim();

    setAlertState((prev) => ({
      ...prev,
      open: false,
      inputValue: "",
    }));

    if (alertState.requireInput) {
      resolver?.({
        confirmed: true,
        value: inputValue,
      });
      return;
    }

    resolver?.(true);
  };

  const handleCancel = () => {
    setAlertState((prev) => ({
      ...prev,
      open: false,
      inputValue: "",
    }));

    if (alertState.requireInput) {
      resolver?.({
        confirmed: false,
        value: "",
      });
      return;
    }

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
        requireInput={alertState.requireInput}
        inputLabel={alertState.inputLabel}
        inputPlaceholder={alertState.inputPlaceholder}
        inputValue={alertState.inputValue}
        confirmText={alertState.confirmText}
        onInputChange={(value) =>
          setAlertState((prev) => ({ ...prev, inputValue: value }))
        }
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
