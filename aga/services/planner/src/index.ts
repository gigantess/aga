import express from 'express';
import cors from 'cors';
import { log } from './logger.js';
import { tenantMiddleware } from './auth.js';
import type { DSL, Plan } from './types.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(tenantMiddleware);

app.post('/plan', async (req, res) => {
  const { dsl } = req.body as { dsl: DSL };
  if (!dsl?.workflow?.length) return res.status(400).json({ error: 'Missing DSL/workflow' });

  const nodes = dsl.workflow.map((w, i) => ({
    id: `n${i+1}`,
    type: w.action,
    config: { hitl: !!w.hitl, guard: w.guard || [] }
  }));
  const edges = nodes.slice(1).map((n, i) => ({ from: nodes[i].id, to: n.id }));
  const scopes = (dsl.tools||[]).map(t => `${t}.scope`);

  const plan: Plan = { nodes, edges, requiredScopes: scopes };
  log('Plan synthesized', plan.nodes.length, 'nodes');
  res.json({ plan });
});

const port = Number(process.env.PORT || 3002);
app.listen(port, () => log(`planner listening on ${port}`));
