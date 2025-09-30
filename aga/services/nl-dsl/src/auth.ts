import { Request, Response, NextFunction } from 'express';
export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const tenant = req.header('x-tenant');
  if (!tenant) return res.status(400).json({ error: 'Missing X-Tenant header' });
  (req as any).tenant = { id: tenant };
  next();
}
