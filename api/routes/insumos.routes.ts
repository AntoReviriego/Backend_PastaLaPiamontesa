import express, { Router } from 'express';

import * as Controller from '../controllers/insumos.controller';
import { zodValidator, requirePermission } from '../middlewares';
import { CREATE_INSUMO_SCHEMA } from '../schemas';
import checkSession from '../middlewares/auth.middleware';


const router: Router = express.Router();

router.get('/', Controller.getInsumos);
// router.post('/create', checkSession, requirePermission('Alta Insumo'), zodValidator(CREATE_INSUMO_SCHEMA), Controller.createInsumos);
// // router.post('/create', zodValidator(TASK_SCHEMA), Controller.create);
// router.put('/update', zodValidator(UPDATE_TASK_SCHEMA), Controller.update);
// router.delete('/delete', zodValidator(DELETE_TASK_SCHEMA), Controller.remove);
export { router as InsumosRouter };