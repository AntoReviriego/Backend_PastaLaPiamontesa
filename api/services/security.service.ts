import { DateTime } from "luxon";
import { Prisma } from "../config";
import { session } from '@prisma/client';

export class SecurityService {
  async hasSession(token: string): Promise<boolean> {
    const session = await Prisma.session.findFirst({ where: { token: token } });
    return !!session && session.fechaexpiracion != null &&  session.fechaexpiracion > new Date();
  }

  async getSession(token: string): Promise<session | null> {
    const session = await Prisma.session.findFirst({ where: { token } });
    if (!session) return null;
    // Actualizar fecha de expiración 
    const nuevaExpiracion = new Date(Date.now() + 1000 * 60 * 30); // +30 minutos
    return await Prisma.session.update({
      where: { id: session.id },
      data: { fechaexpiracion: nuevaExpiracion, fechaupdate: new Date() }
    });
  }

  async getPermissions(token: string): Promise<string[]> {
    const session = await Prisma.session.findFirst({
      where: { token },
      include: {
        usuarios: {
          include: {
            roles: {
              include: {
                rolpermiso: {
                  include: { permiso: true }
                }
              }
            }
          }
        }
      }
    });

    if (!session || !session.usuarios) return [];

    return session.usuarios.roles.rolpermiso
      .filter((rp: { enable: any; permiso: { enable: any; }; }) => rp.enable && rp.permiso.enable)
      .map((rp: { permiso: { descripcion: any; }; }) => rp.permiso.descripcion);
  }

  async updateSessionExpiration(token: string): Promise<void> {
    const nuevaExpiracion = DateTime.now(); // 30 minutos
    const expiration = nuevaExpiracion.plus({ minutes: 30 });
    await Prisma.session.updateMany({
      where: { token },
      data: { fechaexpiracion: expiration.toJSDate() },
    });
  }

}