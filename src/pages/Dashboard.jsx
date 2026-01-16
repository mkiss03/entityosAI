import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Scan,
  Activity,
  Cpu,
  Database,
  ChevronRight,
} from "lucide-react";
import * as d3 from "d3";
import { cn, useInterval, formatPct } from "../utils/helpers";
import { NAV, MOCK } from "../constants";
import { AmbientNeon, GlassCard, NeonDivider, Badge } from "../components/ui";
import { generateGraph } from "../lib/openai";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";

export function Dashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState("mapping");
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState("Tesla");
  const [scanState, setScanState] = useState({ running: false, step: 0 });
  const [brandName] = useState("Tesla"); // Brand to scan
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

  // Scan with OpenAI + Save to Supabase
  const triggerScan = async () => {
    console.log('[Dashboard] ========== SCAN BUTTON CLICKED ==========');
    setTerminal((prev) => [...prev, '[DEBUG] ========== SCAN BUTTON CLICKED ==========']);

    if (scanState.running) {
      console.log('[Dashboard] Scan already running, ignoring click');
      setTerminal((prev) => [...prev, '[DEBUG] Scan already running, ignoring click']);
      return;
    }

    const startedAt = Date.now();
    setScanState({ running: true, step: 0 });
    console.log('[Dashboard] Scan state set to running');

    const steps = [
      { tag: "ingest", text: "Analyzing brand data with AI…" },
      { tag: "embed", text: "Generating entity embeddings…" },
      { tag: "retrieve", text: "Extracting relationships…" },
      { tag: "synthesize", text: "Building knowledge graph…" },
      { tag: "commit", text: "Saving to database…" },
    ];

    // Make the graph gently re-energize
    try {
      simRef.current?.alpha(0.9)?.restart();
    } catch {
      // Ignore errors if simulation is not ready
    }

    // Animate through steps
    steps.forEach((s, idx) => {
      window.setTimeout(() => {
        setScanState((prev) => ({ ...prev, step: idx + 1 }));
        setRagMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `▶ ${s.text}  · brand: ${brandName}`,
            ts: Date.now(),
          },
        ]);
        setTerminal((prev) => [...prev, `[scan:${s.tag}] ${s.text} (brand=${brandName})`]);
      }, 420 + idx * 520);
    });

    // Actually generate the graph with OpenAI
    try {
      console.log('[Dashboard] Starting graph generation for:', brandName);
      setTerminal((prev) => [...prev, `[DEBUG] About to call OpenAI API for: ${brandName}`]);

      const graphData = await generateGraph(brandName);

      setTerminal((prev) => [...prev, '[DEBUG] OpenAI API call completed successfully']);
      console.log('[Dashboard] Graph generated successfully:', graphData);

      // Save to Supabase
      if (user) {
        console.log('[Dashboard] User logged in, saving to Supabase...', user.id);
        const { data, error } = await supabase
          .from('scans')
          .insert([
            {
              user_id: user.id,
              brand_name: brandName,
              graph_data: graphData,
            },
          ])
          .select();

        if (error) {
          console.error('[Dashboard] Supabase save error:', error);
          setTerminal((prev) => [...prev, `[error] Failed to save: ${error.message}`]);
        } else {
          console.log('[Dashboard] Supabase save successful:', data);
          setTerminal((prev) => [...prev, `[db] Scan saved successfully (id: ${data[0].id})`]);
        }
      } else {
        console.warn('[Dashboard] User not logged in, skipping database save');
        setTerminal((prev) => [...prev, '[warn] Not logged in - scan not saved to database']);
      }

      // Update the graph visualization
      console.log('[Dashboard] Updating visualization with new graph data');
      setTerminal((prev) => [...prev, `[DEBUG] Updating visualization with ${graphData.nodes.length} nodes and ${graphData.links.length} links`]);

      const newNodes = graphData.nodes.map((n) => ({ ...n }));
      const newLinks = graphData.links.map((l) => ({ ...l }));
      console.log('[Dashboard] New nodes:', newNodes.length, 'New links:', newLinks.length);

      setLayout({ nodes: newNodes, links: newLinks });

      // Re-initialize the force simulation with new data
      const w = 900;
      const h = 640;

      const nodes = newNodes.map((n) => ({
        ...n,
        x: w / 2 + (Math.random() - 0.5) * 80,
        y: h / 2 + (Math.random() - 0.5) * 80,
      }));

      if (simRef.current) {
        simRef.current.stop();
      }

      const sim = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(newLinks)
            .id((d) => d.id)
            .distance(140)
            .strength(0.7)
        )
        .force("charge", d3.forceManyBody().strength(-520))
        .force("center", d3.forceCenter(w / 2, h / 2))
        .force("collide", d3.forceCollide().radius(34))
        .alphaDecay(0.04)
        .velocityDecay(0.35);

      sim.on("tick", () => {
        setLayout((prev) => ({
          ...prev,
          nodes: nodes.map((n) => ({ ...n })),
          links: newLinks.map((l) => ({ ...l })),
        }));
      });

      simRef.current = sim;
      console.log('[Dashboard] D3 simulation restarted with new data');
      setTerminal((prev) => [...prev, '[DEBUG] D3 force simulation restarted - graph should be animating now']);

      window.setTimeout(() => {
        setRagMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `✓ Scan complete. Generated ${graphData.nodes.length} entities and ${graphData.links.length} relationships.`,
            ts: Date.now(),
          },
        ]);
        setTerminal((prev) => [
          ...prev,
          `[scan] done in ~${Math.round((Date.now() - startedAt) / 100) / 10}s`,
          `[graph] ${graphData.nodes.length} nodes, ${graphData.links.length} edges`,
        ]);
        setScanState({ running: false, step: 0 });
      }, 420 + steps.length * 520 + 400);

    } catch (error) {
      console.error('[Dashboard] CRITICAL ERROR during scan:', error);
      console.error('[Dashboard] Error stack:', error.stack);
      setRagMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `✗ Scan failed: ${error.message}. Using fallback data.`,
          ts: Date.now(),
        },
      ]);
      setTerminal((prev) => [
        ...prev,
        `[error] Scan failed: ${error.message}`,
      ]);
      setScanState({ running: false, step: 0 });
    }
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
            disabled={scanState.running}
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
                <div className="font-mono text-xs text-slate-200">&quot;simulate retrieval for {selected}&quot;</div>
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
