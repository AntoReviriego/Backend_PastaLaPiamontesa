import { Prisma } from "../config/prisma.config";
import { TMiddlewareParams } from "../models/middleware.model";

export const getInsumos: TMiddlewareParams = async (_req, res, next) => {
    try {
        console.log(_req)
       const insumos = await Prisma.insumo.findMany();
        console.log(insumos)
       return res.status(200).json(insumos);
    } catch (error) {
        return next(error);
    }
};

export const createInsumos: TMiddlewareParams = async (_req, res, next) => {
    try {
        console.log(_req)
       const insumos = await Prisma.insumo.findMany();
        console.log(insumos)
       return res.status(200).json(insumos);
    } catch (error) {
        return next(error);
    }
};