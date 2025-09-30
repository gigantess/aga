import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { log } from './logger.js';
import { tenantMiddleware } from './auth.js';
import type { DSL } from './types.js';
import { maskPII } from './pii.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(tenantMiddleware);

const Input = z.object({
  prompt: z.string().min(5),
  constraints: z.array(z.string()).optional(),
});

app.post('/parse', async (req, res) => {
  const parsed = Input.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  const { prompt, constraints } = parsed.data;
  const wantsCalendar = /면접|캘린더|일정/.test(prompt);
  const wantsSheet = /시트|스프레드시트/.test(prompt);
  const wantsEmail = /이메일|메일/.test(prompt);

  const dsl: DSL = {
    agent: {
      name: 'generated_agent',
      objectives: [maskPII(prompt)],
      constraints,
    },
    tools: [
      wantsEmail && 'gmail.read',
      wantsSheet && 'sheets.write',
      wantsCalendar && 'calendar.write',
    ].filter(Boolean) as string[],
    workflow: [
      { step: 'ingest', action: wantsEmail ? 'gmail.fetch' : 'input.parse', guard: ['pii_scan'] },
      { step: 'classify', action: 'llm.classify', guard: ['toxicity_check'] },
      { step: 'score', action: 'rule.scorecard' },
      { step: 'persist', action: wantsSheet ? 'sheets.write' : 'db.write', hitl: true },
      wantsCalendar ? { step: 'schedule', action: 'calendar.create_event', hitl: true } : undefined,
    ].filter(Boolean) as DSL['workflow'],
    governance: { transparency: true, logging: ['prompt','tool_calls','outputs'], retention_days: 30 },
  };

  log('DSL generated for tenant', (req as any).tenant.id);
  res.json({ dsl });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => log(`nl-dsl listening on ${port}`));
