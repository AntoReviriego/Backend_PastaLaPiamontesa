import express, { Router } from 'express';

import * as Controller from '../controllers/productos.controller';
import { zodValidator, requirePermission } from '../middlewares';
import { CREATE_PRODUCTO_SCHEMA, DELETE_PRODUCTO_SCHEMA, UPDATE_PRODUCTO_SCHEMA } from '../schemas';
import checkSession from '../middlewares/auth.middleware';


const router: Router = express.Router();

router.get('/', Controller.getProductos);
router.post('/create', zodValidator(CREATE_PRODUCTO_SCHEMA), Controller.createProductos);
router.put('/update', zodValidator(UPDATE_PRODUCTO_SCHEMA), Controller.updateProductos);
router.put('/delete', zodValidator(DELETE_PRODUCTO_SCHEMA), Controller.removeProductos);
export { router as ProductosRouter };