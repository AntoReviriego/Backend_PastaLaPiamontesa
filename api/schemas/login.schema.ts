import { z } from 'zod';

export const LOGIN_SCHEMA = z.object({
  body: z.object({
    username: z.string({ required_error: 'El usuario es obligatorio' }),
    password: z.string({ required_error: 'La contraseña es obligatoria' }).min(6, 'Mínimo 6 caracteres'),
  }),
});

export const LOGOUT_SCHEMA = z.object({
  body: z.object({
    id: z.number({ required_error: 'El id es obligatorio' }),
    username: z.string({ required_error: 'El usuario es obligatorio' }),
    token: z.string({ required_error: 'El token es obligatorio' }),
  }),
});


export type LOGIN_SCHEMA_TYPE = z.infer<typeof LOGIN_SCHEMA>;
export type LOGOUT_SCHEMA_TYPE = z.infer<typeof LOGOUT_SCHEMA>;
