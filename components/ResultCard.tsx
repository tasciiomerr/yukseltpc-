export type ResultStatus = "compatible" | "incompatible" | "pending";

interface ResultCardProps {
  title: string;
  status: ResultStatus;
  message: string;
}

const statusStyles: Record<ResultStatus, string> = {
  compatible:
    "border-green-500/40 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-200",
  incompatible:
    "border-red-500/40 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200",
  pending:
    "border-yellow-500/40 bg-yellow-50 text-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-200",
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
      className={`rounded-lg border p-4 ${statusStyles[status]}`}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-lg font-bold">
          {statusIcons[status]}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-1 text-sm opacity-90">{message}</p>
    </div>
  );
}
