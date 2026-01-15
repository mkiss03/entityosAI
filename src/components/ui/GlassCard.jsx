import { cn } from "../../utils/helpers";

export function GlassCard({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/70 bg-slate-900/35 backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(148,163,184,0.06),0_20px_60px_rgba(0,0,0,0.55)]",
        className
      )}
    >
      {children}
    </div>
  );
}
