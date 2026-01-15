import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Network,
  Radar,
  Settings,
  Sparkles,
  Scan,
  Activity,
  ShieldCheck,
  Cpu,
  Database,
  ChevronRight,
  ArrowRight,
  Zap,
  GitCompare,
  Check,
} from "lucide-react";
import * as d3 from "d3";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

// EntityOS — Multi-page SaaS (MVP UI)
// - React + Tailwind + lucide-react
// - react-router-dom routing: / (Index) and /dashboard (Dashboard)
// - Smooth transitions using simple CSS (no external animation libs)

const NAV = [
  { key: "mapping", label: "Entity Mapping", icon: Network },
  { key: "injection", label: "Fact Injection", icon: ShieldCheck },
  { key: "sentiment", label: "Sentiment Watch", icon: Radar },
  { key: "settings", label: "Settings", icon: Settings },
];

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

function useInterval(callback, delay) {
  const savedRef = useRef(callback);
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedRef.current?.(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

const MOCK = {
  nodes: [
    { id: "Tesla", kind: "org", score: 0.93 },
    { id: "Elon Musk", kind: "person", score: 0.89 },
    { id: "EVs", kind: "topic", score: 0.78 },
    { id: "Stock Market", kind: "topic", score: 0.74 },
    // Extra nodes so it doesn't feel empty
    { id: "Model Y", kind: "product", score: 0.66 },
    { id: "Gigafactory", kind: "asset", score: 0.62 },
    { id: "Autopilot", kind: "capability", score: 0.71 },
    { id: "Battery Supply", kind: "topic", score: 0.57 },
    { id: "Regulators", kind: "entity", score: 0.52 },
    { id: "AI Safety", kind: "topic", score: 0.55 },
  ],
  links: [
    { source: "Tesla", target: "Elon Musk", rel: "CEO" },
    { source: "Tesla", target: "EVs", rel: "category" },
    { source: "Tesla", target: "Stock Market", rel: "ticker" },
    { source: "Tesla", target: "Model Y", rel: "product" },
    { source: "Tesla", target: "Gigafactory", rel: "infrastructure" },
    { source: "Tesla", target: "Autopilot", rel: "feature" },
    { source: "EVs", target: "Battery Supply", rel: "depends_on" },
    { source: "Autopilot", target: "AI Safety", rel: "governed_by" },
    { source: "Autopilot", target: "Regulators", rel: "reviewed_by" },
    { source: "Stock Market", target: "Regulators", rel: "regulated_by" },
  ],
};

const KIND_BADGES = {
  org: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30",
  person: "bg-cyan-500/15 text-cyan-200 border-cyan-500/30",
  topic: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
  product: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  asset: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  capability: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  entity: "bg-violet-500/15 text-violet-200 border-violet-500/30",
};

function Badge({ children, kind }) {
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

function GlassCard({ className, children }) {
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

function NeonDivider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
  );
}

function formatPct(x) {
  const v = Math.max(0, Math.min(1, x));
  return `${Math.round(v * 100)}%`;
}

function AmbientNeon() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute top-24 right-16 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="absolute bottom-20 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.06),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.06),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.05),transparent_45%)]" />
    </div>
  );
}

function PageTransition({ children }) {
  return <div className="min-h-screen animate-[pageIn_240ms_ease-out]">{children}</div>;
}

function NetworkHeroArt() {
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

// ----------------------
// Index (Landing Page)
// ----------------------
function AnimatedMeshGradient({ className }) {
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

function ParticleNetwork({ density = 62 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const rand = (a, b) => a + Math.random() * (b - a);

    const points = Array.from({ length: density }).map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: rand(1.2, 2.2),
      phase: rand(0, Math.PI * 2),
    }));

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (const p of points) {
        if (!p.x && !p.y) {
          p.x = rand(0, w);
          p.y = rand(0, h);
          p.vx = rand(-0.18, 0.18);
          p.vy = rand(-0.14, 0.14);
        } else {
          p.x = Math.max(0, Math.min(w, p.x));
          p.y = Math.max(0, Math.min(h, p.y));
        }
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const render = (t) => {
      const time = (t || 0) / 1000;
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(
        w * 0.5,
        h * 0.35,
        40,
        w * 0.5,
        h * 0.35,
        Math.max(w, h)
      );
      g.addColorStop(0, "rgba(15,23,42,0.0)");
      g.addColorStop(1, "rgba(2,6,23,0.35)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.01;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const maxD = 150;
          if (d2 < maxD * maxD) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / maxD) * 0.22;
            const hueMix = 0.5 + 0.5 * Math.sin(time * 0.35 + (i + j) * 0.03);
            const stroke = `rgba(${Math.round(34 + 183 * hueMix)}, ${Math.round(
              211 - 70 * hueMix
            )}, ${Math.round(238)}, ${alpha})`;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const pulse = 0.6 + 0.4 * Math.sin(p.phase + time * 0.7);
        ctx.fillStyle = `rgba(34,211,238,${0.20 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(217,70,239,${0.10 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 4.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(226,232,240,${0.10 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(render);
    };

    raf = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

function Reveal({ children, delayMs = 0, className }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

function NeonHoverCard({ children, accent = "cyan" }) {
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

function Index() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Gap Analysis",
      desc: "Detect missing entities, weak relationships, and conflicting facts that cause AI to hallucinate or omit you.",
      icon: Zap,
      accent: "mix",
    },
    {
      title: "Fact Injection",
      desc: "Push high-confidence facts across sources with a structured entity schema designed for LLM retrieval.",
      icon: ShieldCheck,
      accent: "cyan",
    },
    {
      title: "Sentiment Watch",
      desc: "Track shifting narratives and sentiment vectors over time—before they damage your brand presence in AI answers.",
      icon: Radar,
      accent: "purple",
    },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$49",
      period: "/mo",
      bullets: ["1 brand graph", "Weekly scan", "Basic gap report", "Email alerts"],
      highlight: false,
    },
    {
      name: "Growth",
      price: "$199",
      period: "/mo",
      bullets: [
        "5 brand graphs",
        "Daily scans",
        "Fact injection queue",
        "Sentiment watch",
        "Team access",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      bullets: [
        "Unlimited graphs",
        "Dedicated index",
        "SLA + SSO",
        "Custom connectors",
        "On-prem options",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Local CSS keyframes (no external animation libs) */}
      <style>{`
        @keyframes mesh {
          0% { background-position: 0% 0%; }
          35% { background-position: 100% 30%; }
          70% { background-position: 10% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(34,211,238,0.12), 0 0 18px rgba(217,70,239,0.14); }
          50% { box-shadow: 0 0 0 1px rgba(34,211,238,0.22), 0 0 46px rgba(217,70,239,0.28); }
        }
      `}</style>

      <AmbientNeon />

      {/* Top nav */}
      <header className="relative z-20 border-b border-slate-800/70 bg-slate-950/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="group inline-flex items-center gap-2">
            <span className="relative">
              <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-fuchsia-500/30 via-cyan-400/30 to-indigo-400/30 blur opacity-70 transition group-hover:opacity-100" />
              <span className="relative flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2">
                <Sparkles className="h-5 w-5 text-cyan-200" />
                <span className="text-sm font-semibold tracking-wide">EntityOS</span>
              </span>
            </span>
            <span className="hidden sm:inline text-xs text-slate-400">
              Knowledge Graph Optimization (GEO)
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden md:inline-flex rounded-xl border border-slate-800/70 bg-slate-900/30 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400/30"
            >
              Open Dashboard
            </Link>
            <button
              onClick={() => navigate("/dashboard")}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
                "border border-slate-800/70 bg-slate-900/35 backdrop-blur-xl",
                "hover:border-cyan-400/40",
                "animate-[glowPulse_2.4s_ease-in-out_infinite]"
              )}
            >
              <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-fuchsia-500/20 via-cyan-400/20 to-indigo-400/20 blur opacity-70" />
              <Scan className="relative h-4 w-4 text-cyan-200" />
              <span className="relative">Start Free Scan</span>
              <ArrowRight className="relative h-4 w-4 text-slate-500 transition group-hover:text-cyan-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 overflow-hidden">
        <div className="absolute inset-0">
          <AnimatedMeshGradient />
          <ParticleNetwork density={68} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950" />
          <div className="absolute inset-0 opacity-[0.14]">
            <div className="h-full w-full bg-[linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px]" />
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="transition-all duration-700 ease-out animate-[pageIn_360ms_ease-out]">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/25 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-cyan-300/70" />
                <span className="text-xs text-slate-300">New category:</span>
                <span className="font-mono text-xs text-fuchsia-200">GEO</span>
              </div>

              <h1 className="mt-6 text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                  Don&apos;t let AI ignore your brand.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base text-slate-200/90 sm:text-lg">
                The world&apos;s first Knowledge Graph Optimization (GEO) platform.
                <span className="text-slate-300">{" "}
                  Build entity authority, reduce hallucinations, and win citations inside AI answers.
                </span>
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className={cn(
                    "group relative inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold",
                    "border border-slate-800/70 bg-slate-900/35 backdrop-blur-xl",
                    "transition hover:border-cyan-400/40",
                    "animate-[glowPulse_2.2s_ease-in-out_infinite]"
                  )}
                >
                  <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-fuchsia-500/25 via-cyan-400/25 to-indigo-400/25 blur opacity-80" />
                  <Scan className="relative h-4 w-4 text-cyan-200" />
                  <span className="relative">Start Free Scan</span>
                  <ChevronRight className="relative h-4 w-4 text-slate-500 transition group-hover:text-cyan-200" />
                </button>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/20 px-6 py-3 text-sm text-slate-200 hover:border-slate-700"
                >
                  See it in action <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {["Entity Mapping", "Vector Signals", "RAG Trace"].map((k) => (
                  <div
                    key={k}
                    className="rounded-2xl border border-slate-800/70 bg-slate-900/20 px-4 py-3 backdrop-blur-xl"
                  >
                    <div className="text-xs font-semibold tracking-widest text-slate-400">MODULE</div>
                    <div className="mt-1 font-mono text-xs text-cyan-200">{k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-6 transition-all duration-700 ease-out animate-[pageIn_420ms_ease-out]">
              <NetworkHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:py-28">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-widest text-slate-400">FEATURES</div>
              <h2 className="mt-3 text-3xl font-semibold">Built for how AI actually retrieves information</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                EntityOS turns scattered brand signals into a structured, queryable graph—optimized for retrieval-augmented generation.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delayMs={idx * 80}>
                <NeonHoverCard accent={f.accent}>
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-2">
                        <Icon className="h-5 w-5 text-cyan-200" />
                      </div>
                      <div className="text-lg font-semibold">{f.title}</div>
                    </div>
                    <p className="mt-4 text-sm text-slate-300">{f.desc}</p>
                    <div className="mt-5 font-mono text-[11px] text-slate-400">
                      pipeline: ingest → embed → infer → commit
                    </div>
                  </div>
                </NeonHoverCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Comparison */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:py-28">
        <Reveal>
          <div className="mb-10">
            <div className="text-xs font-semibold tracking-widest text-slate-400">COMPARISON</div>
            <h2 className="mt-3 text-3xl font-semibold">Old SEO vs EntityOS</h2>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <NeonHoverCard accent="purple">
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-slate-400" />
                  <div className="text-sm font-semibold">Old SEO</div>
                </div>
                <p className="mt-3 text-sm text-slate-400">A list of pages. Keywords. Links. Hope.</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-300">
                  {[
                    "Unstructured content",
                    "Keyword-centric",
                    "Slow feedback loops",
                    "Hard to debug AI omissions",
                  ].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </NeonHoverCard>
          </Reveal>

          <Reveal delayMs={80}>
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-fuchsia-500/26 via-cyan-400/22 to-indigo-400/22 blur" />
              <div className="relative rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-200" />
                  <div className="text-sm font-semibold">EntityOS</div>
                  <Badge kind="topic">graph-first</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  A structured entity graph tuned for retrieval and reasoning.
                </p>

                <div className="mt-5 rounded-2xl border border-slate-800/70 bg-slate-950/35 p-4">
                  <div className="font-mono text-xs text-slate-200">Tesla</div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {[
                      { k: "CEO", v: "Elon Musk" },
                      { k: "Category", v: "EVs" },
                      { k: "Ticker", v: "Stock Market" },
                      { k: "Feature", v: "Autopilot" },
                    ].map((row) => (
                      <div
                        key={row.k}
                        className="rounded-xl border border-slate-800/70 bg-slate-900/20 px-3 py-2"
                      >
                        <div className="text-[11px] text-slate-400">{row.k}</div>
                        <div className="font-mono text-xs text-cyan-200">{row.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:py-28">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-slate-400">PRICING</div>
              <h2 className="mt-3 text-3xl font-semibold">Ship your entity authority in days</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                Pick a plan and start scanning immediately. Upgrade when you&apos;re ready to inject facts at scale.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-slate-800/70 bg-slate-900/25 px-4 py-2 text-sm hover:border-cyan-400/30"
            >
              Try the Dashboard
            </button>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {pricing.map((p, idx) => (
            <Reveal key={p.name} delayMs={idx * 80}>
              <div className="relative transition-transform duration-300 ease-out hover:scale-[1.03]">
                {p.highlight && (
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-fuchsia-500/34 via-cyan-400/28 to-indigo-400/26 blur" />
                )}
                <div
                  className={cn(
                    "relative rounded-2xl border border-slate-800/70 bg-slate-900/22 p-6 backdrop-blur-xl",
                    "transition-all duration-300",
                    "hover:border-cyan-400/30 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_34px_rgba(217,70,239,0.18)]",
                    p.highlight && "border-cyan-400/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">{p.name}</div>
                    {p.highlight && <Badge kind="topic">recommended</Badge>}
                  </div>
                  <div className="mt-4 flex items-end gap-2">
                    <div className="text-4xl font-semibold">{p.price}</div>
                    <div className="pb-1 text-sm text-slate-400">{p.period}</div>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-slate-300">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-cyan-200" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className={cn(
                      "mt-6 w-full rounded-xl px-4 py-2 text-sm font-semibold",
                      "border border-slate-800/70 bg-slate-950/40",
                      "transition",
                      p.highlight
                        ? "hover:border-cyan-400/40 hover:shadow-[0_0_18px_rgba(34,211,238,0.10)]"
                        : "hover:border-slate-700 hover:shadow-[0_0_28px_rgba(217,70,239,0.10)]"
                    )}
                  >
                    Start {p.name}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/70 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8">
          <div className="text-sm text-slate-400">© {new Date().getFullYear()} EntityOS</div>
          <div className="flex items-center gap-4 text-sm">
            {["Docs", "Privacy", "Terms"].map((x) => (
              <a key={x} href="#" className="text-slate-400 hover:text-slate-200">
                {x}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ----------------------
// Dashboard (Existing UI)
// ----------------------
// ----------------------
function Dashboard() {
  const [active, setActive] = useState("mapping");
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState("Tesla");
  const [scanState, setScanState] = useState({ running: false, step: 0 });
  const [terminal, setTerminal] = useState(() => [
    "[boot] EntityOS kernel online · neon pipeline ready",
    "[graph] loaded 10 nodes, 10 edges",
    "[rag] warmed vector cache (mock)",
  ]);

  // RAG panel messages (mock)
  const [ragMessages, setRagMessages] = useState(() => [
    {
      role: "system",
      text: "RAG Simulation: ingest → embed → retrieve → synthesize (mock logs)",
      ts: Date.now() - 120000,
    },
    {
      role: "assistant",
      text:
        "Loaded entity schema v2.3. Preparing similarity search on: org/person/topic relations.",
      ts: Date.now() - 90000,
    },
    {
      role: "assistant",
      text:
        "Tip: Hover nodes to highlight edges. Click to pin a focus entity and stream context logs.",
      ts: Date.now() - 65000,
    },
  ]);

  // Force graph state
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const zoomRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [layout, setLayout] = useState(() => {
    const nodes = MOCK.nodes.map((n) => ({ ...n }));
    const links = MOCK.links.map((l) => ({ ...l }));
    return { nodes, links };
  });

  const connected = useMemo(() => {
    if (!hovered) return new Set();
    const set = new Set([hovered]);
    layout.links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      if (s === hovered) set.add(t);
      if (t === hovered) set.add(s);
    });
    return set;
  }, [hovered, layout.links]);

  const focusedNode = useMemo(
    () => layout.nodes.find((n) => n.id === selected) || layout.nodes[0],
    [layout.nodes, selected]
  );

  // Boot a d3-force sim once
  useEffect(() => {
    const w = 900;
    const h = 640;

    const nodes = layout.nodes.map((n) => ({
      ...n,
      x: n.x ?? w / 2 + (Math.random() - 0.5) * 80,
      y: n.y ?? h / 2 + (Math.random() - 0.5) * 80,
    }));
    const links = layout.links.map((l) => ({ ...l }));

    const sim = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => {
            const s = d.source?.id || d.source;
            const t = d.target?.id || d.target;
            if (s === "Tesla" || t === "Tesla") return 140;
            return 170;
          })
          .strength(0.7)
      )
      .force("charge", d3.forceManyBody().strength(-520))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide().radius((d) => (d.id === "Tesla" ? 46 : 34)))
      .alphaDecay(0.04)
      .velocityDecay(0.35);

    sim.on("tick", () => {
      setLayout((prev) => ({
        ...prev,
        nodes: nodes.map((n) => ({ ...n })),
        links: links.map((l) => ({ ...l })),
      }));
    });

    simRef.current = sim;

    return () => {
      sim.stop();
      simRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zoom / pan
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svgRef.current) return;

    const zoom = d3
      .zoom()
      .scaleExtent([0.55, 2.6])
      .on("zoom", (event) => {
        setTransform({ x: event.transform.x, y: event.transform.y, k: event.transform.k });
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Set an initial transform for a nicer framing
    const initial = d3.zoomIdentity.translate(40, 10).scale(1.0);
    svg.call(zoom.transform, initial);

    return () => {
      svg.on(".zoom", null);
    };
  }, []);

  // Terminal scroll
  useInterval(
    () => {
      setTerminal((prev) => {
        const t = new Date();
        const ts = t.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const samples = [
          "Real-time Vector Analysis…",
          "Embedding drift check: stable",
          "Edge inference: +0.03 confidence",
          "Reranking candidates (cosine)",
          "Graph delta committed",
          "Cache hit: ANN index",
          "Streaming entity signals",
          "Sentiment window: neutral→slightly positive",
        ];
        const line = `[${ts}] ${samples[Math.floor(Math.random() * samples.length)]}`;
        const next = [...prev, line];
        return next.length > 120 ? next.slice(next.length - 120) : next;
      });
    },
    scanState.running ? 700 : 1400
  );

  // Scan animation + RAG log injection
  const triggerScan = () => {
    if (scanState.running) return;
    setScanState({ running: true, step: 0 });

    const steps = [
      { tag: "ingest", text: "Ingesting sources… (mock)" },
      { tag: "embed", text: "Generating embeddings… (mock)" },
      { tag: "retrieve", text: "Retrieving context… (mock)" },
      { tag: "synthesize", text: "Synthesizing graph updates… (mock)" },
      { tag: "commit", text: "Committing deltas to EntityStore… (mock)" },
    ];

    const startedAt = Date.now();

    // Make the graph gently re-energize
    try {
      simRef.current?.alpha(0.9)?.restart();
    } catch {}

    steps.forEach((s, idx) => {
      window.setTimeout(() => {
        setScanState((prev) => ({ ...prev, step: idx + 1 }));
        setRagMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `▶ ${s.text}  · focus: ${selected}`,
            ts: Date.now(),
          },
        ]);
        setTerminal((prev) => [...prev, `[scan:${s.tag}] ${s.text} (entity=${selected})`]);
      }, 420 + idx * 520);
    });

    window.setTimeout(() => {
      setRagMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "✓ Scan complete. Graph confidence updated; watchlist & sentiment counters refreshed (mock).",
          ts: Date.now(),
        },
      ]);
      setTerminal((prev) => [
        ...prev,
        `[scan] done in ~${Math.round((Date.now() - startedAt) / 100) / 10}s`,
      ]);
      setScanState({ running: false, step: 0 });
    }, 420 + steps.length * 520 + 400);
  };

  const onNodeClick = (id) => {
    setSelected(id);
    setRagMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: `Context pinned → entity: ${id}. Loading neighborhood summary (mock)…`,
        ts: Date.now(),
      },
    ]);
    setTerminal((prev) => [...prev, `[graph] focus set: ${id}`]);

    // Slightly pull the selected node toward center for a "snap" feel
    const sim = simRef.current;
    if (sim) {
      const n = sim.nodes().find((x) => x.id === id);
      if (n) {
        n.fx = 450;
        n.fy = 320;
        sim.alpha(0.75).restart();
        window.setTimeout(() => {
          n.fx = null;
          n.fy = null;
          sim.alpha(0.35).restart();
        }, 850);
      }
    }
  };

  const scanProgress = scanState.running
    ? Math.min(100, (scanState.step / 5) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AmbientNeon />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/70 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="group relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-fuchsia-500/30 via-cyan-400/30 to-indigo-400/30 blur opacity-70 transition group-hover:opacity-100" />
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2">
              <Sparkles className="h-5 w-5 text-cyan-200" />
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">EntityOS</div>
                <div className="text-[11px] text-slate-400">AI Knowledge Graph Optimization</div>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/30 px-3 py-2">
            <Cpu className="h-4 w-4 text-fuchsia-200" />
            <span className="text-xs text-slate-300">RAG Kernel:</span>
            <span className="font-mono text-xs text-cyan-200">v0.9.4-mock</span>
            <span className="mx-2 h-4 w-px bg-slate-800" />
            <Database className="h-4 w-4 text-cyan-200" />
            <span className="text-xs text-slate-300">Vector Index:</span>
            <span className="font-mono text-xs text-slate-200">ANN/HNSW</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/30 px-3 py-2">
            <Activity
              className={cn(
                "h-4 w-4",
                scanState.running ? "text-cyan-200" : "text-slate-400"
              )}
            />
            <span className="text-xs text-slate-300">Pipeline:</span>
            <span
              className={cn(
                "font-mono text-xs",
                scanState.running ? "text-cyan-200" : "text-slate-200"
              )}
            >
              {scanState.running ? "scanning" : "idle"}
            </span>
          </div>

          <button
            onClick={triggerScan}
            className={cn(
              "group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
              "border border-slate-800/70 bg-slate-900/35 backdrop-blur-xl",
              "transition hover:shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_40px_rgba(217,70,239,0.15)]",
              scanState.running
                ? "cursor-not-allowed opacity-80"
                : "hover:border-cyan-400/40"
            )}
          >
            <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-fuchsia-500/20 via-cyan-400/20 to-indigo-400/20 blur opacity-0 transition group-hover:opacity-100" />
            <Scan
              className={cn(
                "relative h-4 w-4",
                scanState.running ? "animate-pulse text-cyan-200" : "text-slate-200"
              )}
            />
            <span className="relative">Scan Now</span>
            <ChevronRight className="relative h-4 w-4 text-slate-500 transition group-hover:text-cyan-200" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 grid h-[calc(100vh-56px)] grid-cols-12 gap-3 p-3">
        {/* Sidebar */}
        <GlassCard className="col-span-12 md:col-span-3 lg:col-span-2 p-3">
          <div className="mb-2 text-xs font-semibold tracking-widest text-slate-400">NAVIGATION</div>
          <div className="space-y-2">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left",
                    "border border-transparent bg-slate-900/20",
                    "transition",
                    isActive
                      ? "border-cyan-400/30 bg-slate-900/45 shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_26px_rgba(217,70,239,0.14)]"
                      : "hover:bg-slate-900/35 hover:border-slate-800/70"
                  )}
                >
                  {isActive && (
                    <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-fuchsia-500/20 via-cyan-400/20 to-indigo-400/20 blur" />
                  )}
                  <Icon
                    className={cn(
                      "relative h-4 w-4",
                      isActive
                        ? "text-cyan-200"
                        : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  <span
                    className={cn(
                      "relative text-sm",
                      isActive
                        ? "text-slate-100"
                        : "text-slate-300 group-hover:text-slate-100"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="my-4">
            <NeonDivider />
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-widest text-slate-400">FOCUS ENTITY</div>
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/35 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{focusedNode?.id}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge kind={focusedNode?.kind}>
                      {focusedNode?.kind || "entity"}
                    </Badge>
                    <span className="font-mono text-[11px] text-slate-400">conf</span>
                    <span className="font-mono text-[11px] text-cyan-200">
                      {formatPct(focusedNode?.score ?? 0.5)}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 px-2 py-1">
                  <div className="font-mono text-[11px] text-slate-300">ID</div>
                  <div className="font-mono text-[11px] text-fuchsia-200">
                    {(focusedNode?.id || "").slice(0, 10)}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Neighborhood</span>
                  <span className="font-mono text-slate-200">
                    {Math.max(0, connected.size - 1)} links
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-400/70 via-cyan-300/70 to-indigo-300/70"
                    style={{
                      width: `${Math.min(
                        100,
                        35 + (focusedNode?.score ?? 0.5) * 55
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="font-mono text-slate-200">schema:</span> entity ↔
                  fact ↔ sentiment ↔ source
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/70 bg-slate-900/25 p-3">
              <div className="text-xs font-semibold tracking-widest text-slate-400">QUICK ACTIONS</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setTerminal((p) => [...p, "[action] queued: edge reweight (mock)"]);
                    simRef.current?.alpha(0.6)?.restart();
                  }}
                  className="rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-xs hover:border-fuchsia-400/30 hover:shadow-[0_0_20px_rgba(217,70,239,0.12)]"
                >
                  Reweight
                </button>
                <button
                  onClick={() => {
                    setTerminal((p) => [...p, "[action] queued: dedupe entities (mock)"]);
                    setRagMessages((m) => [
                      ...m,
                      {
                        role: "assistant",
                        text: "Dedupe pass staged (mock).",
                        ts: Date.now(),
                      },
                    ]);
                  }}
                  className="rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-xs hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                >
                  Dedupe
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Main Graph */}
        <GlassCard className="col-span-12 md:col-span-6 lg:col-span-7 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Entity Graph</div>
              <div className="text-[11px] text-slate-400">
                Force-directed topology · hover to trace links · click to pin focus
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/30 px-3 py-2">
                <span className="text-xs text-slate-400">zoom</span>
                <span className="font-mono text-xs text-cyan-200">
                  {Math.round(transform.k * 100)}%
                </span>
                <span className="mx-2 h-4 w-px bg-slate-800" />
                <span className="text-xs text-slate-400">pan</span>
                <span className="font-mono text-xs text-slate-200">
                  {Math.round(transform.x)},{Math.round(transform.y)}
                </span>
              </div>
              <button
                onClick={() => {
                  const svg = d3.select(svgRef.current);
                  if (zoomRef.current) {
                    svg
                      .transition()
                      .duration(450)
                      .call(
                        zoomRef.current.transform,
                        d3.zoomIdentity.translate(40, 10).scale(1.0)
                      );
                  }
                  setTerminal((p) => [...p, "[ui] viewport reset"]);
                }}
                className="rounded-xl border border-slate-800/70 bg-slate-900/25 px-3 py-2 text-xs hover:border-slate-700"
              >
                Reset View
              </button>
            </div>
          </div>

          {/* Scan progress bar */}
          <div className="relative">
            <div className="h-px w-full bg-slate-800/70" />
            <div
              className={cn(
                "absolute left-0 top-0 h-px",
                "bg-gradient-to-r from-fuchsia-400/80 via-cyan-300/80 to-indigo-300/80",
                scanState.running ? "opacity-100" : "opacity-0"
              )}
              style={{ width: `${scanProgress}%` }}
            />
          </div>

          <div className="relative">
            {/* subtle grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
              <div className="h-full w-full bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:28px_28px]" />
            </div>

            {/* scanning sheen */}
            {scanState.running && (
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 animate-[pulse_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-300/8 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.10),transparent_55%)]" />
              </div>
            )}

            <svg
              ref={svgRef}
              viewBox="0 0 900 640"
              className="relative h-[560px] w-full select-none"
            >
              <g
                transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
              >
                {/* Links */}
                {layout.links.map((l, idx) => {
                  const s = typeof l.source === "string" ? l.source : l.source.id;
                  const t = typeof l.target === "string" ? l.target : l.target.id;
                  const source =
                    typeof l.source === "string"
                      ? layout.nodes.find((n) => n.id === s)
                      : l.source;
                  const target =
                    typeof l.target === "string"
                      ? layout.nodes.find((n) => n.id === t)
                      : l.target;
                  const isHot = hovered && (s === hovered || t === hovered);
                  const isDim = hovered && !isHot;
                  return (
                    <g key={`${s}-${t}-${idx}`}>
                      <line
                        x1={source?.x}
                        y1={source?.y}
                        x2={target?.x}
                        y2={target?.y}
                        className={cn(
                          "transition",
                          isHot
                            ? "stroke-cyan-300/80"
                            : isDim
                            ? "stroke-slate-600/25"
                            : "stroke-slate-600/40"
                        )}
                        strokeWidth={isHot ? 2.2 : 1.2}
                      />
                      {isHot && (
                        <line
                          x1={source?.x}
                          y1={source?.y}
                          x2={target?.x}
                          y2={target?.y}
                          className="stroke-fuchsia-400/30"
                          strokeWidth={6}
                          strokeLinecap="round"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {layout.nodes.map((n) => {
                  const isCenter = n.id === "Tesla";
                  const isHovered = hovered === n.id;
                  const isSelected = selected === n.id;
                  const isConnected = hovered ? connected.has(n.id) : true;

                  const r = isCenter ? 34 : 24;

                  return (
                    <g
                      key={n.id}
                      transform={`translate(${n.x || 0},${n.y || 0})`}
                      onMouseEnter={() => setHovered(n.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => onNodeClick(n.id)}
                      style={{ cursor: "pointer" }}
                      opacity={isConnected ? 1 : 0.22}
                    >
                      {/* glow */}
                      <circle
                        r={r + (isHovered || isSelected ? 10 : 6)}
                        className={cn(
                          "transition",
                          isSelected
                            ? "fill-cyan-400/10"
                            : isHovered
                            ? "fill-fuchsia-500/10"
                            : "fill-indigo-500/5"
                        )}
                      />

                      {/* body */}
                      <circle
                        r={r}
                        className={cn(
                          "transition",
                          "fill-slate-950/50 stroke-slate-600/60",
                          isCenter && "stroke-cyan-300/70",
                          (isHovered || isSelected) && "stroke-cyan-300/80"
                        )}
                        strokeWidth={isCenter ? 2.2 : 1.6}
                      />

                      {/* neon ring */}
                      <circle
                        r={r - 6}
                        className={cn(
                          "transition",
                          isSelected
                            ? "stroke-cyan-300/85"
                            : isHovered
                            ? "stroke-fuchsia-300/80"
                            : "stroke-indigo-300/30"
                        )}
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray={isSelected ? "6 4" : "0"}
                      />

                      {/* label */}
                      <text
                        y={5}
                        textAnchor="middle"
                        className={cn(
                          "select-none fill-slate-100",
                          isCenter
                            ? "text-[13px] font-semibold"
                            : "text-[12px]"
                        )}
                        style={{
                          filter: isHovered
                            ? "drop-shadow(0 0 10px rgba(34,211,238,0.35))"
                            : "none",
                        }}
                      >
                        {n.id}
                      </text>

                      {/* meta chips */}
                      <g transform={`translate(${-(r + 8)},${r + 10})`}>
                        <rect
                          width={Math.max(70, n.kind.length * 8 + 28)}
                          height={20}
                          rx={10}
                          className={cn(
                            "stroke-slate-700/60",
                            n.kind === "org"
                              ? "fill-fuchsia-500/10"
                              : n.kind === "person"
                              ? "fill-cyan-500/10"
                              : "fill-indigo-500/10"
                          )}
                        />
                        <text x={12} y={14} className="fill-slate-200 font-mono text-[10px]">
                          {n.kind}
                        </text>
                        <text
                          x={Math.max(70, n.kind.length * 8 + 28) - 10}
                          y={14}
                          textAnchor="end"
                          className="fill-cyan-200 font-mono text-[10px]"
                        >
                          {formatPct(n.score)}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Edge labels (only for hovered) */}
                {hovered &&
                  layout.links
                    .filter((l) => {
                      const s = typeof l.source === "string" ? l.source : l.source.id;
                      const t = typeof l.target === "string" ? l.target : l.target.id;
                      return s === hovered || t === hovered;
                    })
                    .map((l, idx) => {
                      const s = typeof l.source === "string" ? l.source : l.source.id;
                      const t = typeof l.target === "string" ? l.target : l.target.id;
                      const source =
                        typeof l.source === "string"
                          ? layout.nodes.find((n) => n.id === s)
                          : l.source;
                      const target =
                        typeof l.target === "string"
                          ? layout.nodes.find((n) => n.id === t)
                          : l.target;
                      const mx = ((source?.x || 0) + (target?.x || 0)) / 2;
                      const my = ((source?.y || 0) + (target?.y || 0)) / 2;
                      return (
                        <g key={`lbl-${idx}`} transform={`translate(${mx},${my})`}>
                          <rect
                            x={-34}
                            y={-12}
                            width={68}
                            height={20}
                            rx={10}
                            className="fill-slate-950/70 stroke-cyan-300/25"
                          />
                          <text
                            y={2}
                            textAnchor="middle"
                            className="fill-slate-200 font-mono text-[10px]"
                          >
                            {l.rel}
                          </text>
                        </g>
                      );
                    })}
              </g>
            </svg>

            {/* Graph legend */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 backdrop-blur-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400">Legend</span>
                  <span className="h-1 w-1 rounded-full bg-cyan-300/80" />
                  <span className="text-[11px] text-slate-300">hover link</span>
                  <span className="h-1 w-1 rounded-full bg-fuchsia-300/80" />
                  <span className="text-[11px] text-slate-300">node glow</span>
                  <span className="h-1 w-1 rounded-full bg-indigo-300/60" />
                  <span className="text-[11px] text-slate-300">context</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Active</span>
                  <span className="font-mono text-[11px] text-cyan-200">{selected}</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Right Panel */}
        <GlassCard className="col-span-12 md:col-span-3 lg:col-span-3 flex flex-col overflow-hidden">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">RAG Simulation</div>
                <div className="text-[11px] text-slate-400">AI processing logs · mock retrieval trace</div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/30 px-3 py-2">
                <span className="text-xs text-slate-400">mode</span>
                <span className="font-mono text-xs text-fuchsia-200">trace</span>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-slate-800/70" />

          <div className="flex-1 overflow-auto p-3">
            <div className="space-y-2">
              {ragMessages.map((m, i) => {
                const isSystem = m.role === "system";
                const isUser = m.role === "user";
                return (
                  <div
                    key={i}
                    className={cn(
                      "rounded-2xl border p-3",
                      isSystem
                        ? "border-slate-800/70 bg-slate-900/20"
                        : isUser
                        ? "border-cyan-400/20 bg-cyan-500/5"
                        : "border-fuchsia-400/15 bg-fuchsia-500/5"
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-[11px] tracking-widest",
                          isSystem
                            ? "text-slate-400"
                            : isUser
                            ? "text-cyan-200"
                            : "text-fuchsia-200"
                        )}
                      >
                        {isSystem ? "SYSTEM" : isUser ? "YOU" : "ENTITYOS"}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {new Date(m.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-sm leading-relaxed text-slate-200">{m.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-800/70 bg-slate-950/40 p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-slate-800/70 bg-slate-900/25 px-3 py-2">
                <div className="text-[11px] text-slate-400">prompt</div>
                <div className="font-mono text-xs text-slate-200">"simulate retrieval for {selected}"</div>
              </div>
              <button
                onClick={() => {
                  setRagMessages((prev) => [
                    ...prev,
                    {
                      role: "user",
                      text: `Simulate retrieval for ${selected}. Provide context + inferred relations.`,
                      ts: Date.now(),
                    },
                    {
                      role: "assistant",
                      text:
                        "Retrieved 6 neighbors; top facts: leadership, product line, market linkage. Suggest edge strengthening: Tesla↔EVs (0.84), Tesla↔Autopilot (0.79) (mock).",
                      ts: Date.now() + 50,
                    },
                  ]);
                  setTerminal((p) => [...p, `[rag] simulated query: ${selected}`]);
                }}
                className="rounded-xl border border-slate-800/70 bg-slate-900/30 px-3 py-2 text-sm hover:border-cyan-400/30 hover:shadow-[0_0_18px_rgba(34,211,238,0.10)]"
              >
                Run
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Bottom Status / Terminal */}
        <div className="col-span-12">
          <GlassCard className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300/70" />
                <span className="text-xs font-semibold tracking-widest text-slate-300">STATUS</span>
                <span className="mx-2 h-4 w-px bg-slate-800" />
                <span className="text-xs text-slate-400">stream</span>
                <span className="font-mono text-xs text-cyan-200">vector-analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">latency</span>
                <span className="font-mono text-xs text-slate-200">{scanState.running ? "22ms" : "31ms"}</span>
                <span className="mx-2 h-4 w-px bg-slate-800" />
                <span className="text-xs text-slate-400">events</span>
                <span className="font-mono text-xs text-fuchsia-200">{terminal.length}</span>
              </div>
            </div>
            <div className="h-px w-full bg-slate-800/70" />
            <div className="max-h-40 overflow-auto bg-slate-950/55 p-3">
              <div className="space-y-1 font-mono text-[11px] leading-relaxed text-slate-200">
                {terminal.slice(-32).map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-slate-500">$</span>
                    <span className="whitespace-pre-wrap">{line}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <span className="text-slate-500">$</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-slate-400">Real-time Vector Analysis…</span>
                    <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-cyan-300/60" />
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ----------------------
// Router Shell
// ----------------------
// ----------------------
// Router Shell (JAVÍTOTT VERZIÓ)
// ----------------------
function AnimatedRoutes() {
  const location = useLocation();
  
  // Hiba javítva: AnimatePresence eltávolítva
  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <PageTransition>
            <Index />
          </PageTransition>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PageTransition>
            <Dashboard />
          </PageTransition>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}