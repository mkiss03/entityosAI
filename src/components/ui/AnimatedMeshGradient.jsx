import { cn } from "../../utils/helpers";

export function AnimatedMeshGradient({ className }) {
  // Subtle animated mesh using CSS keyframes (defined in <style> inside Index)
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0",
        "bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.14),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(217,70,239,0.14),transparent_45%),radial-gradient(circle_at_45%_85%,rgba(99,102,241,0.12),transparent_55%)]",
        "bg-[length:140%_140%]",
        "animate-[mesh_26s_ease-in-out_infinite]",
        className
      )}
    />
  );
}
