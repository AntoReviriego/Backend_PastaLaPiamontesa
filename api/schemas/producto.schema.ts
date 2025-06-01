import { z } from 'zod';

const insumoComposicionSchema = z.object({
  id: z.number().optional(),
  idInsumo: z.number({ required_error: 'El ID del insumo es obligatorio.' }),
  cantidad: z.number({ required_error: 'La cantidad del insumo es obligatoria.' }),
});

const properties = {
  nombreProducto: z.string({ required_error: 'El nombre del producto es obligatorio.' }),
  descripcion:  z.string().optional(), 
  porcentajeGanancia: z.number({ required_error: 'El porcentaje del producto es obligatorio.' }),
  costoTotal: z.number({ required_error: 'El costo total del producto es obligatorio.' }),
  precioVenta: z.number({ required_error: 'El precio de venta del producto es obligatorio.' }),
  insumosComposicion: z.array(insumoComposicionSchema),
  id: z.number({ required_error: 'Id es obligatorio' }),
};

export const CREATE_PRODUCTO_SCHEMA = z.object({
  body: z.object({
    nombreProducto: properties.nombreProducto,
    descripcion: properties.descripcion,
    porcentajeGanancia: properties.porcentajeGanancia,
    costoTotal: properties.costoTotal,
    precioVenta: properties.precioVenta,
    insumosComposicion: properties.insumosComposicion,   
  }),
});

export const UPDATE_PRODUCTO_SCHEMA = z.object({
  body: z.object({
    id: properties.id,
    nombreProducto: properties.nombreProducto,
    descripcion: properties.descripcion,
    porcentajeGanancia: properties.porcentajeGanancia,
    costoTotal: properties.costoTotal,
    precioVenta: properties.precioVenta,
    insumosComposicion: properties.insumosComposicion,   
  }),
});

export const DELETE_PRODUCTO_SCHEMA = z.object({
  body: z.object({
    id: properties.id,
  }),
});

export const ADD_PRODUCTO_INSUMO_SCHEMA = z.object({
  body: z.object({ insumoComposicionSchema }),
});

export type CREATE_PRODUCTO_SCHEMA_TYPE = z.infer<typeof CREATE_PRODUCTO_SCHEMA>;

export type UPDATE_PRODUCTO_SCHEMA_TYPE = z.infer<typeof UPDATE_PRODUCTO_SCHEMA>;

export type DELETE_PRODUCTO_SCHEMA_TYPE = z.infer<typeof DELETE_PRODUCTO_SCHEMA>;

export type ADD_PRODUCTO_INSUMO_SCHEMA_TYPE = z.infer<typeof ADD_PRODUCTO_INSUMO_SCHEMA>;
