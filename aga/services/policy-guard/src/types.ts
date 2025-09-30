export type DSL = {
  agent: { name: string; objectives: string[]; constraints?: string[]; };
  data_sources?: Array<{type:string; name:string; auth?: string}>;
  tools?: string[];
  workflow: Array<{step:string; action:string; guard?: string[]; hitl?: boolean}>;
  governance?: { transparency?: boolean; logging?: string[]; retention_days?: number };
};
export type Plan = {
  nodes: Array<{ id: string; type: string; config?: Record<string, unknown> }>;
  edges: Array<{ from: string; to: string; when?: string }>;
  requiredScopes: string[];
};
