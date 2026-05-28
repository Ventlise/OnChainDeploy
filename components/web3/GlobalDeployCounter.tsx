import { Activity } from "lucide-react";

interface Props {
  total: number;
}

export function GlobalDeployCounter({ total }: Props) {
  return (
    <div className="glass-card rounded-2xl px-4 py-2.5 flex items-center gap-3">
      <div className="relative">
        <Activity className="h-4 w-4 text-accent" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-success animate-pulse" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Global Deployments
        </span>
        <span className="text-sm font-bold tabular-nums gradient-text">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
