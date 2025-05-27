import express, { Router } from 'express';

import * as Controller from '../controllers/login.controller';
import { zodValidator } from '../middlewares';
import { LOGIN_SCHEMA, LOGOUT_SCHEMA } from '../schemas';

const router: Router = express.Router();

router.post('/login', zodValidator(LOGIN_SCHEMA), Controller.login);
router.post('/logout', zodValidator(LOGOUT_SCHEMA), Controller.logout);

export { router as LoginRouter };