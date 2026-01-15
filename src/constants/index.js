import { Network, Radar, Settings, ShieldCheck } from "lucide-react";

export const NAV = [
  { key: "mapping", label: "Entity Mapping", icon: Network },
  { key: "injection", label: "Fact Injection", icon: ShieldCheck },
  { key: "sentiment", label: "Sentiment Watch", icon: Radar },
  { key: "settings", label: "Settings", icon: Settings },
];

export const MOCK = {
  nodes: [
    { id: "Tesla", kind: "org", score: 0.93 },
    { id: "Elon Musk", kind: "person", score: 0.89 },
    { id: "EVs", kind: "topic", score: 0.78 },
    { id: "Stock Market", kind: "topic", score: 0.74 },
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

export const KIND_BADGES = {
  org: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30",
  person: "bg-cyan-500/15 text-cyan-200 border-cyan-500/30",
  topic: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
  product: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  asset: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  capability: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  entity: "bg-violet-500/15 text-violet-200 border-violet-500/30",
};
