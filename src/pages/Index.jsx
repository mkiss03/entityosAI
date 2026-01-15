import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Scan,
  ArrowRight,
  ChevronRight,
  Zap,
  ShieldCheck,
  Radar,
  GitCompare,
  Check,
} from "lucide-react";
import { cn } from "../utils/helpers";
import {
  AmbientNeon,
  AnimatedMeshGradient,
  ParticleNetwork,
  Reveal,
  NeonHoverCard,
  NetworkHeroArt,
  Badge,
} from "../components/ui";
import { useAuth } from "../lib/useAuth";

export function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle Start Free Scan button click
  const handleStartScan = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

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
              onClick={handleStartScan}
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
                  onClick={handleStartScan}
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
