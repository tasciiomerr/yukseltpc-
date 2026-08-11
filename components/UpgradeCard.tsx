import Link from "next/link";
import { getCategory } from "@/lib/categories";
import type { UpgradeRecommendation } from "@/lib/upgradeAdvisor";

const severityStyles: Record<UpgradeRecommendation["severity"], string> = {
  critical: "border-danger-500/30 bg-danger-50 text-danger-700",
  recommended: "border-primary-500/30 bg-primary-50 text-primary-accent",
  info: "border-warning-500/30 bg-warning-50 text-warning-700",
};

const severityBadge: Record<UpgradeRecommendation["severity"], string> = {
  critical: "bg-danger-500 text-white",
  recommended: "bg-primary-500 text-white",
  info: "bg-warning-500 text-white",
};

const severityLabel: Record<UpgradeRecommendation["severity"], string> = {
  critical: "Acil",
  recommended: "Önerilir",
  info: "Bilgi",
};

export default function UpgradeCard({
  recommendation,
  priority,
}: {
  recommendation: UpgradeRecommendation;
  priority: number;
}) {
  const category = getCategory(recommendation.categorySlug);

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${severityStyles[recommendation.severity]}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground shadow-sm"
        >
          {priority}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading font-semibold">
              {recommendation.title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityBadge[recommendation.severity]}`}
            >
              {severityLabel[recommendation.severity]}
            </span>
          </div>
          <p className="mt-2 text-sm opacity-90">{recommendation.reason}</p>
          {category ? (
            <Link
              href={`/${category.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-accent hover:underline"
            >
              {category.labelPlural} sayfasına git →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
