import { DateTime } from "luxon";
import { Prisma } from "../config/prisma.config";
import { TMiddlewareParams } from "../models/middleware.model";
import { CREATE_INSUMO_SCHEMA_TYPE, DELETE_INSUMO_SCHEMA_TYPE, UPDATE_INSUMO_SCHEMA_TYPE } from "../schemas";

export const getInsumos: TMiddlewareParams = async (_req, res, next) => {
    try {
        const page = parseInt(_req.query.page as string) || 0;
        const pageSize = parseInt(_req.query.pageSize as string) || 10;
        const skip = page * pageSize;
        const [insumos, total] = await Promise.all([
            Prisma.insumo.findMany({
                where: { enable: true },
                skip,
                take: pageSize,
            }),
            Prisma.insumo.count()
        ]);

        return res.status(200).json({       
            data: insumos,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        return next(error);
    }
};

export const createInsumos: TMiddlewareParams = async (_req, res, next) => {
    try {
        const { body } = _req as unknown as CREATE_INSUMO_SCHEMA_TYPE;
        const fechaActual = DateTime.now();

        const isValid = await Prisma.insumo.findFirst({ where: { nombre: body.nombreInusmo } })
        if(isValid != null ){
            return res.status(400).json({ msg: 'Ya hay un insumos con ese nombre' });
        }

        const insumo = await Prisma.insumo.create({
        data: {
            nombre: body.nombreInusmo, 
            unidadmedida: body.unidadMedida, 
            preciounitario: body.precioInusmo,
            enable: true, 
            fechainsert: fechaActual.toJSDate(),
            fechaupdate: fechaActual.toJSDate()
        },
        });

        return res.status(201).json(insumo);
    } catch (error) {
        return next(error);
    }
};

export const updateInsumos: TMiddlewareParams = async (_req, res, next) => {
    try {
        const { body } = _req as unknown as UPDATE_INSUMO_SCHEMA_TYPE;
        const fechaActual = DateTime.now();

        const isValid = await Prisma.insumo.findFirst({ where: { nombre: body.nombreInusmo, enable: true } })

        if(body.nombreInusmo === isValid?.nombre && !(body.precioInusmo.toString() !== isValid?.preciounitario.toString() || isValid?.unidadmedida !== body.unidadMedida)){
            return res.status(400).json({ msg: 'Ya hay un insumos con ese nombre. Cambien el nombre o alguna propiedad del insumo' });
        }

        const insumo = await Prisma.insumo.update( { where: { id: body.id }, 
            data: {
                nombre: body.nombreInusmo, 
                unidadmedida: body.unidadMedida, 
                preciounitario: body.precioInusmo,
                enable: true, 
                fechaupdate: fechaActual.toJSDate()
            },
        });

        return res.status(200).json(insumo);
    } catch (error) {
        return next(error);
    }
};

export const removeInsumos: TMiddlewareParams = async (_req, res, next) => {
    try {
        const { body } = _req as unknown as DELETE_INSUMO_SCHEMA_TYPE;
        const fechaActual = DateTime.now();

        const isValid = await Prisma.insumo.findFirst({ where: { id: body.id, enable: true } })

        if(isValid === null){
            return res.status(400).json({ msg: 'No se encontro ningún inusmo.' });
        }

        const insumo = await Prisma.insumo.update( { where: { id: body.id }, 
            data: {
                enable: false, 
                fechaupdate: fechaActual.toJSDate()
            },
        });

        return res.status(200).json(insumo);
    } catch (error) {
        return next(error);
    }
};