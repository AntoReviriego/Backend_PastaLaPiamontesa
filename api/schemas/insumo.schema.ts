import { z } from 'zod';

const properties = {
  nombreInusmo: z.string({ required_error: 'El nombre del insumo es obligatorio.' }),
  precioInusmo: z.number({ required_error: 'El precio del insumo es obligatorio.' }),
  unidadMedida: z.boolean({ required_error: 'Completed is required' }),
  id: z.string({ required_error: 'Id es obligatorio' }),
};

export const CREATE_INSUMO_SCHEMA = z.object({
  body: z.object({
    nombreInusmo: properties.nombreInusmo,
    precioInusmo: properties.precioInusmo,
    unidadMedida: properties.unidadMedida,   
  }),
});

export const UPDATE_INSUMO_SCHEMA = z.object({
  query: z.object({
    id: properties.id,
  }),
  body: z.object({
    nombreInusmo: properties.nombreInusmo,
    precioInusmo: properties.precioInusmo,
    unidadMedida: properties.unidadMedida, 
  }),
});

export const DELETE_INSUMO_SCHEMA = z.object({
  query: z.object({
    id: properties.id,
  }),
});

export type CREATE_INSUMO_SCHEMA_TYPE = z.infer<typeof CREATE_INSUMO_SCHEMA>;

export type UPDATE_INSUMO_SCHEMA_TYPE = z.infer<typeof UPDATE_INSUMO_SCHEMA>;

export type DELETE_INSUMO_SCHEMA_TYPE = z.infer<typeof DELETE_INSUMO_SCHEMA>;
