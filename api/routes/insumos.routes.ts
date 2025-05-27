import express, { Router } from 'express';

import * as Controller from '../controllers/insumos.controller';
import { zodValidator, requirePermission } from '../middlewares';
import { CREATE_INSUMO_SCHEMA, DELETE_INSUMO_SCHEMA, UPDATE_INSUMO_SCHEMA } from '../schemas';
import checkSession from '../middlewares/auth.middleware';


const router: Router = express.Router();

router.get('/', Controller.getInsumos);
router.post('/create', zodValidator(CREATE_INSUMO_SCHEMA), Controller.createInsumos);
router.put('/update', zodValidator(UPDATE_INSUMO_SCHEMA), Controller.updateInsumos);
router.put('/delete', zodValidator(DELETE_INSUMO_SCHEMA), Controller.removeInsumos);
export { router as InsumosRouter };