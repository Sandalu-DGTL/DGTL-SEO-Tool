import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  MousePointerClick,
  Target,
} from "lucide-react";

const opportunities = [
  {
    keyword: "digital marketing sri lanka",
    position: 11,
    volume: "2.4K",
    intent: "Commercial",
  },
  {
    keyword: "seo agency colombo",
    position: 14,
    volume: "880",
    intent: "Transactional",
  },
  {
    keyword: "social media marketing sri lanka",
    position: 18,
    volume: "1.3K",
    intent: "Commercial",
  },
] as const;

export function DashboardPreviewActions({ projectId }: { projectId: string }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
      <PreviewPanel
        eyebrow="Action center"
        title="Quick-win opportunities"
        icon={Target}
      >
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Position</th>
                <th>Volume</th>
                <th>Intent</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opportunity) => (
                <tr key={opportunity.keyword}>
                  <td className="font-medium whitespace-nowrap">
                    {opportunity.keyword}
                  </td>
                  <td>
                    <span className="badge badge-warning badge-sm">
                      #{opportunity.position}
                    </span>
                  </td>
                  <td className="tabular-nums">{opportunity.volume}</td>
                  <td className="text-base-content/60">{opportunity.intent}</td>
                  <td>
                    <Link
                      to="/p/$projectId/keywords"
                      params={{ projectId }}
                      search={{ q: opportunity.keyword }}
                      className="btn btn-ghost btn-xs btn-square"
                      aria-label={`Research ${opportunity.keyword}`}
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PreviewPanel>

      <PreviewPanel eyebrow="Microsoft Clarity" title="Visitor behavior">
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <BehaviorMetric
              icon={MousePointerClick}
              iconClass="text-rose-400"
              value="126"
              label="Rage clicks"
            />
            <BehaviorMetric
              icon={Flame}
              iconClass="text-orange-400"
              value="68%"
              label="Avg. scroll depth"
            />
          </div>
          <div className="rounded-xl border border-warning/20 bg-warning/10 p-4 text-sm leading-6 text-base-content/65">
            Pricing and contact pages show the highest hesitation. Review mobile
            recordings first.
          </div>
          <Link
            to="/p/$projectId/clarity"
            params={{ projectId }}
            className="btn btn-sm w-full"
          >
            Open behavior insights <ArrowRight className="size-4" />
          </Link>
        </div>
      </PreviewPanel>
    </div>
  );
}

function PreviewPanel({
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
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
        {Icon ? <Icon className="size-4 text-primary" /> : null}
      </header>
      {children}
    </section>
  );
}

function BehaviorMetric({
  icon: Icon,
  iconClass,
  value,
  label,
}: {
  icon: LucideIcon;
  iconClass: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-base-200 p-4">
      <Icon className={`size-4 ${iconClass}`} />
      <p className="mt-4 text-3xl font-semibold tabular-nums">{value}</p>
      <p className="text-sm text-base-content/50">{label}</p>
    </div>
  );
}
