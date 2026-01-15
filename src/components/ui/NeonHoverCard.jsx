import { cn } from "../../utils/helpers";

export function NeonHoverCard({ children, accent = "cyan" }) {
  const ring =
    accent === "mix"
      ? "from-fuchsia-500/30 via-cyan-400/25 to-indigo-400/25"
      : accent === "purple"
      ? "from-fuchsia-500/32 via-indigo-400/22 to-cyan-400/18"
      : "from-cyan-400/30 via-fuchsia-500/22 to-indigo-400/20";

  return (
    <div className="relative transition-transform duration-300 ease-out hover:scale-[1.03]">
      <div
        className={cn(
          "pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r blur opacity-45 transition-opacity duration-300",
          ring
        )}
      />
      <div
        className={cn(
          "relative rounded-2xl border border-slate-800/70 bg-slate-900/22 backdrop-blur-xl",
          "transition-all duration-300",
          "hover:border-cyan-400/30 hover:bg-slate-900/28",
          "hover:shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_34px_rgba(217,70,239,0.18)]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
