import { cn } from "../../utils/helpers";
import { KIND_BADGES } from "../../constants";

export function Badge({ children, kind }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]",
        KIND_BADGES[kind] || "bg-slate-500/15 text-slate-200 border-slate-500/30"
      )}
    >
      {children}
    </span>
  );
}
