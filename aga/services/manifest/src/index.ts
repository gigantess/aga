import express from 'express';
import cors from 'cors';
import { log } from './logger.js';
import { tenantMiddleware } from './auth.js';
import type { Plan, DSL } from './types.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(tenantMiddleware);

app.post('/build', (req, res) => {
  const { dsl, plan } = req.body as { dsl: DSL, plan: Plan };
  if (!dsl || !plan) return res.status(400).json({ error: 'Missing dsl or plan' });

  const workflow = {
    name: dsl.agent.name,
    nodes: plan.nodes.map((n, idx) => ({
      id: idx + 1,
      name: n.id,
      type: `custom:${n.type}`,
      parameters: n.config || {},
      position: [200 + idx*240, 200],
    })),
    connections: plan.edges.reduce((acc:any, e) => {
      (acc[e.from] ||= []).push({ node: e.to, type: 'main', index: 0 });
      return acc;
    }, {} as Record<string, any[]>),
    meta: {
      requiredScopes: plan.requiredScopes,
      governance: dsl.governance,
    }
  };

  const manifest = {
    id: `aga-${Date.now()}`,
    version: 1,
    tenant: (req as any).tenant.id,
    scopes: plan.requiredScopes,
    region: 'ap-northeast-2',
    cost_limit_usd_month: 100,
    workflow,
  };

  log('Manifest built', manifest.id);
  res.json({ manifest });
});

const port = Number(process.env.PORT || 3004);
app.listen(port, () => log(`manifest listening on ${port}`));
