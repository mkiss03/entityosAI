export function NetworkHeroArt() {
  // Simple abstract network SVG with neon glow (no external deps)
  const nodes = [
    { x: 78, y: 42, r: 5 },
    { x: 60, y: 22, r: 4 },
    { x: 40, y: 36, r: 4 },
    { x: 26, y: 20, r: 3 },
    { x: 22, y: 50, r: 4 },
    { x: 50, y: 55, r: 4 },
    { x: 70, y: 60, r: 3 },
    { x: 84, y: 24, r: 3 },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 4],
    [4, 5],
    [5, 6],
    [1, 7],
    [7, 0],
    [0, 6],
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[32px] bg-gradient-to-r from-fuchsia-500/15 via-cyan-400/12 to-indigo-400/12 blur-2xl" />
      <div className="relative overflow-hidden rounded-[32px] border border-slate-800/70 bg-slate-900/25 p-5 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-[0.22]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:28px_28px]" />
        </div>
        <svg viewBox="0 0 100 70" className="relative h-[260px] w-full">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(217,70,239,0.55)" />
              <stop offset="50%" stopColor="rgba(34,211,238,0.55)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.45)" />
            </linearGradient>
          </defs>

          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="url(#edge)"
              strokeWidth="1.4"
              opacity="0.75"
              filter="url(#glow)"
            />
          ))}

          {nodes.map((n, i) => (
            <g key={i} filter="url(#glow)">
              <circle cx={n.x} cy={n.y} r={n.r + 2.8} fill="rgba(34,211,238,0.10)" />
              <circle cx={n.x} cy={n.y} r={n.r} fill="rgba(15,23,42,0.55)" stroke="rgba(34,211,238,0.65)" strokeWidth="1.2" />
            </g>
          ))}
        </svg>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold tracking-widest text-slate-400">LIVE STRUCTURE</div>
            <div className="mt-1 font-mono text-xs text-cyan-200">neon.graph.v1 · mock topology</div>
          </div>
          <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2">
            <div className="text-[11px] text-slate-400">signal</div>
            <div className="font-mono text-xs text-fuchsia-200">stable</div>
          </div>
        </div>
      </div>
    </div>
  );
}
