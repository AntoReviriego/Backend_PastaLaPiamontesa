import { Prisma } from "../config/prisma.config";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { SecurityService } from '../services/security.service';
import { TMiddlewareParams } from "../models/middleware.model";
import { LOGIN_SCHEMA } from '../schemas';
import { DateTime } from "luxon";
import { LOGOUT_SCHEMA } from '../schemas/login.schema';

export const login: TMiddlewareParams = async (_req, res, next) => {
    try {
        const parsed = LOGIN_SCHEMA.safeParse({ body: _req.body });

        if (!parsed.success) {
            return res.status(400).json({ msg: 'Datos inválidos', errors: parsed.error.format() });
        }

        const { username, password } = parsed.data.body;
        const user = await Prisma.usuarios.findFirst({
            where: { usuario: username },
            include: {
                roles: {
                    include: {
                        rolpermiso: {
                            where: { enable: true },
                            include: { permiso: true }
                        }
                    }
                }
            }
        });

        if (!user) return null;

        const passOk = await bcrypt.compare(password, user.password);

        if (!passOk){
            return res.status(400).json({ msg: 'La contraseña y/o el usuario no son correctos' });
        } 

        const existingSession = await Prisma.session.findFirst({
            where: { idusuario: user.id }
        });

        if (existingSession) {
            return res.json(await buildSessionDTO(existingSession, user));
        }

        const token = uuid();
        const fechaActual = DateTime.now(); // ya está en UTC-3
        const expiration = fechaActual.plus({ minutes: 30 });
        const session = await Prisma.session.create({
            data: {
                idusuario: user.id,
                token,
                fechaexpiracion: expiration.toJSDate(),
                fechainsert: fechaActual.toJSDate(),
                fechaupdate: fechaActual.toJSDate()
            }
        });
       return res.json(await buildSessionDTO(session, user));
    } catch (error) {
        return next(error);
    }
};

export const logout: TMiddlewareParams = async (_req, res, next) => {
    try {
        const parsed = LOGOUT_SCHEMA.safeParse({ body: _req.body });

        if (!parsed.success) {
            return res.status(400).json({ msg: 'Datos inválidos', errors: parsed.error.format() });
        }

        const { id, username, token } = parsed.data.body;
        const user = await Prisma.session.findFirst({where: { idusuario: id }});

        if (!user) return null;

        await Prisma.session.deleteMany({ where: { idusuario: id }});

        return res.status(200).json(true);
    } catch (error) {
        return next(error);
    }
};


async function buildSessionDTO(session: any, user: any) {   
    let objetoSesion = {
        token: session.token,
        usuario: {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            rol: user.roles.descripcion,
            idRol: user.roles.id,
            permiso: (user.roles.rolpermiso ?? []).map((p: any) => ({
                id: p.permiso.id,
                descripcion: p.permiso.descripcion,
                isConfig: p.permiso.isConfig
            }))
        },
        fechaexpiracion: session.fechaexpiracion
    }; 
  return objetoSesion;
}