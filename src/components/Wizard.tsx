import { useState, useEffect } from "react";

type StepItem = {
  title: string;
  content: React.ReactNode;
};

type Props = {
  steps: StepItem[];
  close: () => void;
  initialStep?: number;
  onNextStep?: (currentStep: number) => number;
  onFinish?: () => void;
  onValidateStep?: (currentStep: number) => boolean | Promise<boolean>;
};




export default function Wizard({ steps, close, initialStep = 1, onNextStep, onFinish, onValidateStep }: Props) {
  const [step, setStep] = useState(initialStep);

  const totalSteps = steps.length;

  const next = () => {
    if (onNextStep) {
      const nextStep = onNextStep(step);

      if (nextStep <= totalSteps) {
        setStep(nextStep);
      }
    } else {
      if (step < totalSteps) setStep(step + 1);
    }
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  useEffect(() => {
    if (step > steps.length) {
      setStep(1); // 👈 reinicia si cambia el flujo
    }
  }, [steps]);


  return (
    <div className="space-y-6">
      {/* header */}
      <div className="text-center">
        <p className="text-2xl text-primario font-bold">
          Agregar Elemento
        </p>
        <p className="text-base text-gray-500">
          Registro de equipo institucional
        </p>

        {/* barra */}
        <div className="relative mt-6 mb-6">
          {/* progreso */}
          <div className="flex items-center gap-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded ${step >= index + 1 ? "bg-primario-dark" : "bg-gray-200"
                  }`}
              />
            ))}
          </div>
          {/* TEXTOS */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between text-xs font-semibold">

            {steps.map((item, index) => (
              <span
                key={index}
                className={`px-3 bg-white dark:bg-oscuro-relleno dark:text-white ${step === index + 1
                  ? "text-primario"
                  : "text-gray-400"
                  }`}
              >
                {index + 1}. {item.title}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* CONTENIDO */}
      <div className="min-h-[200px] ">
        {steps.length > 0 && steps[step - 1]?.content}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center pt-4 border-t">

        {/* CANCEL */}
        <button
          onClick={close}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancelar
        </button>

        {/* BOTONES */}
        <div className="flex gap-3">

          {step > 1 && (
            <button
              onClick={prev}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              ← Anterior
            </button>
          )}

          <button
            onClick={async () => {
              const isValid = onValidateStep ? await onValidateStep(step) : true;
              if (!isValid) return;

              if (step === totalSteps) {
                onFinish?.();
              } else {
                await next();
              }
            }}
            className="px-6 py-2 bg-primario text-white rounded-lg shadow"
          >
            {step === totalSteps ? "Finalizar" : "Siguiente →"}
          </button>

        </div>
      </div>
    </div>
  );
}