import { DateTime } from "luxon";
import { Prisma } from "../config/prisma.config";
import { TMiddlewareParams } from "../models/middleware.model";
import { CREATE_PRODUCTO_SCHEMA_TYPE, DELETE_PRODUCTO_SCHEMA_TYPE, UPDATE_PRODUCTO_SCHEMA_TYPE } from "../schemas";

export const getProductos: TMiddlewareParams = async (_req, res, next) => {
    try {
        const page = parseInt(_req.query.page as string) || 0;
        const pageSize = parseInt(_req.query.pageSize as string) || 10;
        const ordenParam = (_req.query.orden as string)?.toLowerCase();
        const orden = ordenParam === 'desc' ? 'desc' : 'asc';
        const skip = page * pageSize;
        const [productos, total] = await Promise.all([
            Prisma.producto.findMany({
                where: { enable: true },
                orderBy: { nombre: orden },
                include: {
                    composicionproducto: {
                        where: { enable: true },
                        include: {
                            insumo: true
                        }
                    }
                }, 
                skip,
                take: pageSize,
            }),
            Prisma.producto.count()
        ]);

        return res.status(200).json({       
            data: productos,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        return next(error);
    }
};

export const createProductos: TMiddlewareParams = async (_req, res, next) => {
    try {
        const { body } = _req as unknown as CREATE_PRODUCTO_SCHEMA_TYPE;
        const fechaActual = DateTime.now();

        const isValid = await Prisma.producto.findFirst({ where: { nombre: body.nombreProducto, enable: true } })
        if(isValid != null ){
            return res.status(400).json({ msg: 'Ya hay un producto con ese nombre' });
        }

        const PRODUCTO = await Prisma.producto.create({
            data: {
                nombre: body.nombreProducto,
                descripcion: body.descripcion, 
                porcentajeganancia: body.porcentajeGanancia, 
                costototal: body.costoTotal, 
                precioventa: body.precioVenta,
                enable: true, 
                fechainsert: fechaActual.toJSDate(),
                fechaupdate: fechaActual.toJSDate()
            },
        });

        for (let i = 0; i < body.insumosComposicion.length; i++) {
            await Prisma.composicionproducto.create({
                data: {
                    idproducto: PRODUCTO.id, 
                    idinsumo:  body.insumosComposicion[i]?.idInsumo ?? 0, 
                    cantidad: body.insumosComposicion[i]?.cantidad ?? 0.0,
                    enable: true, 
                    fechainsert: fechaActual.toJSDate(),
                    fechaupdate: fechaActual.toJSDate()
                },
            });
        }

        return res.status(201).json(PRODUCTO);
    } catch (error) {
        return next(error);
    }
};

export const updateProductos: TMiddlewareParams = async (_req, res, next) => {
    try {
        const { body } = _req as unknown as UPDATE_PRODUCTO_SCHEMA_TYPE;
        const fechaActual = DateTime.now();
        const isValid = await Prisma.producto.findFirst({ 
            where: { nombre: body.nombreProducto, enable: true, NOT: { id: body.id }}, 
            include: {
                composicionproducto: {
                    where: { enable: true },
                    include: {
                        insumo: true
                    }
                }
            },  
        })

        if(body.nombreProducto === isValid?.nombre && !(body.descripcion !== isValid?.descripcion || parseFloat(isValid?.porcentajeganancia.toString()) !== body.porcentajeGanancia)){
            return res.status(400).json({ msg: 'Ya hay un producto con ese nombre. Cambien el nombre o alguna propiedad del producto' });
        }

        const producto = await Prisma.producto.update( { where: { id: body.id }, 
            data: {
                nombre: body.nombreProducto,
                descripcion: body.descripcion, 
                porcentajeganancia: body.porcentajeGanancia, 
                costototal: body.costoTotal, 
                precioventa: body.precioVenta,
                fechaupdate: fechaActual.toJSDate()
            },
        });

        const IdInsumosProductos_Producto = await Prisma.composicionproducto.findMany({
            where: { idproducto: producto.id, enable: true },
        });

        const idsEnBody = body.insumosComposicion.filter(x => x.id !== undefined).map(x => x.id);

        const idsADeshabilitar = IdInsumosProductos_Producto.filter(reg => !idsEnBody.includes(Number(reg.id))).map(reg => reg.id);

        await Prisma.composicionproducto.updateMany({
            where: {
                id: { in: idsADeshabilitar },
            },
            data: {
                enable: false,
                fechaupdate: fechaActual.toJSDate(),
            },
        });

        await Promise.all(body.insumosComposicion.map(async (item) => {
            if (item.id) {
                await Prisma.composicionproducto.update({
                    where: { id: item.id },
                    data: {
                        cantidad: item.cantidad ?? 0.0,
                        enable: true,
                        fechaupdate: fechaActual.toJSDate()
                    }
                });
            } else {
                const composicionExistente = await Prisma.composicionproducto.findFirst({
                    where: {
                        idproducto: producto.id,
                        idinsumo: item.idInsumo,
                        enable: false
                    }
                });

                if (composicionExistente) {
                    await Prisma.composicionproducto.update({
                        where: { id: composicionExistente.id },
                        data: {
                            cantidad: item.cantidad ?? 0.0,
                            enable: true,
                            fechaupdate: fechaActual.toJSDate()
                        }
                    });
                }
                else{
                    await Prisma.composicionproducto.create({
                        data: {
                            idproducto: producto.id,
                            idinsumo: item.idInsumo,
                            cantidad: item.cantidad ?? 0.0,
                            enable: true,
                            fechainsert: fechaActual.toJSDate(),
                            fechaupdate: fechaActual.toJSDate()
                        }
                    });
                }
            }
        }));

        return res.status(200).json(producto);
    } catch (error) {
        return next(error);
    }
};

export const removeProductos: TMiddlewareParams = async (_req, res, next) => {
    try {
        const { body } = _req as unknown as DELETE_PRODUCTO_SCHEMA_TYPE;
        const fechaActual = DateTime.now();

        const isValid = await Prisma.producto.findFirst({ where: { id: body.id, enable: true } })

        if(isValid === null){
            return res.status(400).json({ msg: 'No se encontro ningún producto.' });
        }

        const producto = await Prisma.producto.update( { where: { id: body.id }, 
            data: {
                enable: false, 
                fechaupdate: fechaActual.toJSDate()
            },
        });

        await Prisma.composicionproducto.updateMany( { where: { idproducto: body.id }, 
            data: {
                enable: false, 
                fechaupdate: fechaActual.toJSDate()
            },
        });

        return res.status(200).json(producto);
    } catch (error) {
        return next(error);
    }
};