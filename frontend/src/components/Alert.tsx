type AlertVariant = "success" | "error" | "info";

interface AlertProps {
  variant: AlertVariant;
  message: string;
}

export function Alert({ variant, message }: AlertProps) {
  if (!message) return null;
  return (
    <div className={`alert alert-${variant}`} role="alert">
      {message}
    </div>
  );
}
