import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function SectionHeader({
  title,
  linkLabel,
  href,
  router,
}: {
  title: string;
  linkLabel?: string;
  href?: string;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {linkLabel && href && (
        <button
          onClick={() => router.push(href)}
          className="text-xs text-primary hover:underline flex items-center gap-1 transition-colors"
        >
          {linkLabel} <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
