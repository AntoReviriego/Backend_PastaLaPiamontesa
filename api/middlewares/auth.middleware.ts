import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '../services/security.service';

const checkSession = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'] as string;
  console.log(token)
  if (!token) return res.status(401).json({ msg: 'Token requerido' });

  const service = new SecurityService();
  const valid = await service.hasSession(token);

  if (!valid) return res.status(401).json({ msg: 'Sesión inválida o expirada' });

  const session = await service.getSession(token);
  res.setHeader('ExpireToken', session?.fechaexpiracion?.toISOString() ?? '');

  res.locals.session = session;
  next();
};

export default checkSession;