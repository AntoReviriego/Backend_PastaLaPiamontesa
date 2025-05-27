import { z } from 'zod';

export const LOGIN_SCHEMA = z.object({
  body: z.object({
    username: z.string({ required_error: 'El usuario es obligatorio' }),
    password: z.string({ required_error: 'La contraseña es obligatoria' }).min(6, 'Mínimo 6 caracteres'),
  }),
});

export type LOGIN_SCHEMA_TYPE = z.infer<typeof LOGIN_SCHEMA>;
