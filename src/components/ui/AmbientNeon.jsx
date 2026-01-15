export function AmbientNeon() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute top-24 right-16 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="absolute bottom-20 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.06),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.06),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.05),transparent_45%)]" />
    </div>
  );
}
