import { Activity } from "lucide-react";

export function DgtlOverview() {
  return (
    <header className="dgtl-overview-header border-b border-base-300 pb-6">
      <p className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
        <Activity className="size-4" aria-hidden="true" /> SEO workspace
      </p>
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight">
        Search performance overview
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-base-content/75">
        Review your connected data below. Add your website and connect your
        tools to start collecting results for this project.
      </p>
    </header>
  );
}
