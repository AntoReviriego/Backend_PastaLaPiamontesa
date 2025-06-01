import express, { Router } from 'express';

import * as Controller from '../controllers/dashboard.controller';
import { zodValidator } from '../middlewares';
import { LOGIN_SCHEMA, LOGOUT_SCHEMA } from '../schemas';

const router: Router = express.Router();

router.get('/', Controller.getDashboard);

export { router as DashboardRouter };