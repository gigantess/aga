import express from 'express';
import cors from 'cors';
import { log } from './logger.js';
import { tenantMiddleware } from './auth.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(tenantMiddleware);

app.post('/preflight', (req, res) => {
  const { dsl, plan } = req.body;
  const findings: string[] = [];
  const actions: string[] = [];

  const hasPIIGuard = dsl?.workflow?.some((w:any) => (w.guard||[]).includes('pii_scan'));
  if (!hasPIIGuard) { findings.push('PII 스캔이 누락되었습니다'); actions.push('pii_scan 가드를 추가해야 합니다'); }

  if (!plan?.nodes?.length) { findings.push('플랜 노드가 없습니다'); actions.push('Planner를 통해 플랜을 재생성해야 합니다'); }

  const result = { pass: findings.length === 0, findings, actions };
  log('Preflight', result);
  res.json(result);
});

const port = Number(process.env.PORT || 3003);
app.listen(port, () => log(`policy-guard listening on ${port}`));
