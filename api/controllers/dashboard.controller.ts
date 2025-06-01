import { TMiddlewareParams } from "../models";
import { Prisma } from "../config/prisma.config";

export const getDashboard: TMiddlewareParams = async (_req, res, next) => {
    try {
        const productos = await Prisma.producto.aggregate({
            _count: { _all: true },
            _sum: { precioventa: true },
            where: {
                enable: true,
            },
        });

        // Insumos habilitados
        const insumos = await Prisma.insumo.aggregate({
            _count: { _all: true },
            _sum: { preciounitario: true },
            where: {
                enable: true,
            },
        });

        // Armar respuesta
        return res.json({
            productos: {
                cantidad: productos._count._all,
                totalPrecioVenta: productos._sum.precioventa ?? 0,
            },
            insumos: {
                cantidad: insumos._count._all,
                totalPrecioUnitario: insumos._sum.preciounitario ?? 0,
            },
        });
    } catch (error) {
        return next(error);
    }
};
