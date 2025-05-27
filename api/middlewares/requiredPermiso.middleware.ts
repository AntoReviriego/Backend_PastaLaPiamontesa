import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '../services/security.service';

export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['token'] as string;
    const service = new SecurityService();

    const permissions = await service.getPermissions(token);

    if (!permissions.includes(permission)) {
      return res.status(403).json({ msg: 'No tenés permisos' });
    }

    next();
  };
}
