import { z } from 'zod';

const properties = {
  nombreInusmo: z.string({ required_error: 'El nombre del insumo es obligatorio.' }),
  precioInusmo: z.number({ required_error: 'El precio del insumo es obligatorio.' }),
  unidadMedida: z.string({ required_error: 'La unidad de medida del insumo es obligatorio.' }),
  id: z.number({ required_error: 'Id es obligatorio' }),
  cantidad: z.number().optional(),
};

export const CREATE_INSUMO_SCHEMA = z.object({
  body: z.object({
    nombreInusmo: properties.nombreInusmo,
    precioInusmo: properties.precioInusmo,
    unidadMedida: properties.unidadMedida,   
  }),
});

export const UPDATE_INSUMO_SCHEMA = z.object({
  body: z.object({
    id: properties.id,
    nombreInusmo: properties.nombreInusmo,
    precioInusmo: properties.precioInusmo,
    unidadMedida: properties.unidadMedida, 
  }),
});

export const DELETE_INSUMO_SCHEMA = z.object({
  body: z.object({
    id: properties.id,
  }),
});

export type CREATE_INSUMO_SCHEMA_TYPE = z.infer<typeof CREATE_INSUMO_SCHEMA>;

export type UPDATE_INSUMO_SCHEMA_TYPE = z.infer<typeof UPDATE_INSUMO_SCHEMA>;

export type DELETE_INSUMO_SCHEMA_TYPE = z.infer<typeof DELETE_INSUMO_SCHEMA>;