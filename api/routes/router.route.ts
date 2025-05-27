import express, { Express } from 'express';
import { LoginRouter } from './login.routes';
import { InsumosRouter } from './insumos.routes';

export const Router = (app: Express) => {
  const router = express.Router();

  app.use('/api', router);

  router.use('/auth', LoginRouter);
  router.use('/insumo', InsumosRouter);
};
