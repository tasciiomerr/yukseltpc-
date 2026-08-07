export type ResultStatus = "compatible" | "incompatible" | "pending";

interface ResultCardProps {
  title: string;
  status: ResultStatus;
  message: string;
}

const statusStyles: Record<ResultStatus, string> = {
  compatible: "border-success-500/30 bg-success-50 text-success-700",
  incompatible: "border-danger-500/30 bg-danger-50 text-danger-700",
  pending: "border-warning-500/30 bg-warning-50 text-warning-700",
};

const iconStyles: Record<ResultStatus, string> = {
  compatible: "bg-success-500 text-white",
  incompatible: "bg-danger-500 text-white",
  pending: "bg-warning-500 text-white",
};

const statusIcons: Record<ResultStatus, string> = {
  compatible: "✓",
  incompatible: "✗",
  pending: "…",
};

export default function ResultCard({
  title,
  status,
  message,
}: ResultCardProps) {
  return (
    <div
      data-testid={`result-${title}`}
      data-status={status}
      className={`rounded-xl border p-4 shadow-sm transition-colors ${statusStyles[status]}`}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${iconStyles[status]}`}
        >
          {statusIcons[status]}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm opacity-90">{message}</p>
    </div>
  );
}
