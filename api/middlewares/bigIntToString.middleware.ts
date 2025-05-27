import { Request, Response, NextFunction } from 'express';

export function bigIntToStringMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;
  res.json = function (data: any) {
    const replacer = (_key: string, value: any) =>
      typeof value === 'bigint' ? value.toString() : value;

    return originalJson.call(this, JSON.parse(JSON.stringify(data, replacer)));
  };
  next();
}