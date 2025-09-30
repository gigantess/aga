import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();

// 기본 미들웨어
app.use(cors());
app.use(express.json());

// 헬스체크
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: 'manifest' });
});

// (예시) 실제 라우트가 있다면 타입을 명시하여 추가하세요.
// app.post('/v1/something', (req: Request, res: Response) => {
//   const payload = req.body as { name: string };
//   res.json({ received: payload.name });
// });

// 에러 핸들러 (타입 안전)
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(500).json({ error: message });
});

// 기동
const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`[manifest] listening on :${PORT}`);
});

export default app;
