import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Eye,
  Gauge,
  Globe2,
  Link2,
  Search,
  TrendingUp,
} from "lucide-react";
import { DashboardPreviewActions } from "./DashboardPreviewActions";

const metrics = [
  {
    label: "SEO visibility",
    value: "72%",
    change: "+8.4%",
    note: "Across tracked keywords",
    icon: Eye,
    iconClass: "bg-indigo-400/10 text-indigo-300",
  },
  {
    label: "Organic traffic",
    value: "18.4K",
    change: "+12.7%",
    note: "Estimated monthly visits",
    icon: TrendingUp,
    iconClass: "bg-cyan-400/10 text-cyan-300",
  },
  {
    label: "Ranking keywords",
    value: "1,284",
    change: "+96",
    note: "300 keywords in top 10",
    icon: Search,
    iconClass: "bg-indigo-400/10 text-indigo-300",
  },
  {
    label: "Site health",
    value: "92",
    change: "+4",
    note: "7 technical issues open",
    icon: Gauge,
    iconClass: "bg-amber-400/10 text-amber-300",
  },
] as const;

const positions = [
  { label: "Top 3", value: 86, height: "14%", color: "bg-emerald-400" },
  { label: "4–10", value: 214, height: "34%", color: "bg-cyan-400" },
  { label: "11–20", value: 337, height: "52%", color: "bg-indigo-400" },
  { label: "21–100", value: 647, height: "100%", color: "bg-slate-400" },
] as const;

export function DashboardPreview({ projectId }: { projectId: string }) {
  return (
    <details
      className="group rounded-2xl border border-primary/20 bg-base-200/35"
      open
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Preview dashboard
            </p>
            <span className="badge badge-outline badge-sm">Sample data</span>
          </div>
          <p className="mt-1 text-sm text-base-content/65">
            See how this workspace will look after SEO integrations collect
            data.
          </p>
        </div>
        <span className="text-sm font-medium text-primary group-open:hidden">
          Show preview
        </span>
        <span className="hidden text-sm font-medium text-primary group-open:inline">
          Hide preview
        </span>
      </summary>

      <div className="space-y-5 border-t border-base-300 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(
            ({ label, value, change, note, icon: Icon, iconClass }) => (
              <article
                key={label}
                className="rounded-xl border border-base-300 bg-base-100 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-base-content/65">{label}</span>
                  <span
                    className={`grid size-10 place-items-center rounded-xl ${iconClass}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-5 flex items-end gap-2">
                  <strong className="text-3xl font-semibold tracking-tight tabular-nums">
                    {value}
                  </strong>
                  <span className="mb-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    {change}
                  </span>
                </div>
                <p className="mt-2 text-sm text-base-content/60">{note}</p>
              </article>
            ),
          )}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <PreviewPanel
            eyebrow="Visibility + traffic"
            title="Organic growth trend"
            action="Last 28 days"
          >
            <div className="p-5">
              <div className="mb-5 flex flex-wrap gap-5 text-xs text-base-content/55">
                <span className="flex items-center gap-2">
                  <i className="size-2 rounded-full bg-emerald-400" /> Organic
                  traffic
                </span>
                <span className="flex items-center gap-2">
                  <i className="size-2 rounded-full bg-cyan-400" /> Visibility %
                </span>
              </div>
              <div className="relative h-64 overflow-hidden rounded-lg">
                <div className="absolute inset-0 grid grid-rows-4">
                  {[0, 1, 2, 3].map((line) => (
                    <div
                      key={line}
                      className="border-t border-base-content/10"
                    />
                  ))}
                </div>
                <svg
                  viewBox="0 0 800 240"
                  className="absolute inset-0 size-full"
                  preserveAspectRatio="none"
                  aria-label="Sample organic growth chart"
                >
                  <defs>
                    <linearGradient
                      id="preview-traffic"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0" stopColor="#34d399" stopOpacity=".28" />
                      <stop offset="1" stopColor="#34d399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 180 L115 166 L230 154 L345 126 L460 105 L575 91 L690 60 L800 28 L800 240 L0 240 Z"
                    fill="url(#preview-traffic)"
                  />
                  <path
                    d="M0 180 L115 166 L230 154 L345 126 L460 105 L575 91 L690 60 L800 28"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="3"
                  />
                  <path
                    d="M0 180 L115 173 L230 160 L345 143 L460 126 L575 112 L690 101 L800 90"
                    fill="none"
                    stroke="#22d3ee"
                    strokeDasharray="7 6"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="absolute inset-x-1 bottom-0 flex justify-between text-[10px] text-base-content/40">
                  <span>Aug 22</span>
                  <span>Aug 30</span>
                  <span>Sep 7</span>
                  <span>Sep 18</span>
                </div>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel eyebrow="1,284 keywords" title="Search position spread">
            <div className="p-5">
              <div className="flex h-52 items-end gap-4 border-b border-base-content/10 px-2">
                {positions.map((position) => (
                  <div
                    key={position.label}
                    className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2 text-center"
                  >
                    <span className="text-xs font-medium tabular-nums text-base-content/55">
                      {position.value}
                    </span>
                    <div
                      className={`w-full rounded-t-lg ${position.color}`}
                      style={{ height: position.height }}
                    />
                    <span className="pb-2 text-[10px] text-base-content/50">
                      {position.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <PreviewStat
                  label="Improved"
                  value="128 keywords"
                  tone="success"
                />
                <PreviewStat
                  label="Declined"
                  value="34 keywords"
                  tone="error"
                />
              </div>
            </div>
          </PreviewPanel>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <PreviewPanel eyebrow="Site audit" title="Technical health">
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-4">
                <div className="grid size-20 shrink-0 place-items-center rounded-full border-[7px] border-emerald-400/25 bg-emerald-400/5 text-2xl font-semibold text-emerald-400">
                  92
                </div>
                <div>
                  <p className="font-medium">Healthy foundation</p>
                  <p className="mt-1 text-xs text-base-content/50">
                    184 pages crawled · updated today
                  </p>
                </div>
              </div>
              <HealthRow
                label="Critical"
                value="2"
                className="bg-error/10 text-error"
              />
              <HealthRow
                label="Warnings"
                value="5"
                className="bg-warning/10 text-warning"
              />
              <HealthRow
                label="Passed checks"
                value="47"
                className="bg-success/10 text-success"
              />
            </div>
          </PreviewPanel>

          <PreviewPanel eyebrow="Web analytics" title="Acquisition mix">
            <div className="flex items-center gap-5 p-5">
              <div
                className="size-36 shrink-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#34d399 0 58%, #22d3ee 58% 82%, #818cf8 82% 93%, #f59e0b 93%)",
                }}
              >
                <div className="m-7 size-22 rounded-full bg-base-100" />
              </div>
              <div className="min-w-0 flex-1 space-y-3 text-xs">
                <Legend color="bg-emerald-400" label="Organic" value="58%" />
                <Legend color="bg-cyan-400" label="Direct" value="24%" />
                <Legend color="bg-indigo-400" label="Referral" value="11%" />
                <Legend color="bg-amber-400" label="Social" value="7%" />
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel eyebrow="Backlink profile" title="Link authority">
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <MiniMetric icon={Link2} value="4,836" label="Backlinks" />
                <MiniMetric icon={Globe2} value="312" label="Ref. domains" />
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-5 text-sm">
                <span className="text-base-content/55">Authority score</span>
                <strong className="flex items-center gap-2">
                  <i className="size-2 rounded-full bg-emerald-400" />
                  61 / 100
                </strong>
              </div>
            </div>
          </PreviewPanel>
        </div>

        <DashboardPreviewActions projectId={projectId} />

        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-base-content/70">
          <BarChart3 className="mt-0.5 size-5 shrink-0 text-primary" />
          Preview values are examples only. Connect your website, Search
          Console, Analytics, rank tracking, backlinks, and site audit to
          replace them with live measurements.
        </div>
      </div>
    </details>
  );
}

function PreviewPanel({
  eyebrow,
  title,
  action,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-base-300 bg-base-100">
      <header className="flex items-start justify-between gap-3 border-b border-base-300 px-5 py-4">
        <div>
          <p className="mb-1 text-sm font-medium text-primary">{eyebrow}</p>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        {Icon ? (
          <Icon className="size-4 text-primary" />
        ) : action ? (
          <span className="text-xs text-base-content/45">{action}</span>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function PreviewStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "error";
}) {
  return (
    <div
      className={`rounded-xl p-3 ${tone === "success" ? "bg-success/10" : "bg-error/10"}`}
    >
      <p className="text-xs text-base-content/50">{label}</p>
      <p
        className={`mt-1 font-semibold ${tone === "success" ? "text-success" : "text-error"}`}
      >
        {value}
      </p>
    </div>
  );
}

function HealthRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${className}`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-base-content/55">
        <i className={`size-2 rounded-full ${color}`} />
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-base-200 p-3">
      <Icon className="size-4 text-primary" />
      <p className="mt-4 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-base-content/45">{label}</p>
    </div>
  );
}
