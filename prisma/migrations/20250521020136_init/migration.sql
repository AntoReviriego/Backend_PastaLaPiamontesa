-- Tabla: ComposicionProducto
CREATE TABLE ComposicionProducto (
    Id BIGSERIAL PRIMARY KEY,
    IdProducto BIGINT NOT NULL,
    IdInsumo BIGINT NOT NULL,
    Cantidad DECIMAL(18, 2) NOT NULL,
    Enable BOOLEAN NOT NULL DEFAULT TRUE,
    FechaInsert  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUpdate  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Insumo
CREATE TABLE Insumo (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    UnidadMedida VARCHAR(20) NOT NULL,
    PrecioUnitario DECIMAL(18, 2) NOT NULL,
    Enable BOOLEAN NOT NULL DEFAULT TRUE,
    FechaInsert  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUpdate  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Permiso
CREATE TABLE Permiso (
    Id BIGSERIAL PRIMARY KEY,
    Descripcion VARCHAR(255) NOT NULL,
    Enable BOOLEAN NOT NULL DEFAULT TRUE,
    FechaInsert  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUpdate  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Producto
CREATE TABLE Producto (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Descripcion VARCHAR(255),
    PorcentajeGanancia DECIMAL(5, 2) NOT NULL,
    CostoTotal DECIMAL(18, 2),
    PrecioVenta DECIMAL(18, 2),
    Enable BOOLEAN NOT NULL DEFAULT TRUE,
    FechaInsert  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUpdate  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Roles
CREATE TABLE Roles (
    Id BIGSERIAL PRIMARY KEY,
    Descripcion VARCHAR(255) NOT NULL,
    Enable BOOLEAN NOT NULL DEFAULT TRUE,
    FechaInsert  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUpdate  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: RolPermiso
CREATE TABLE RolPermiso (
    Id BIGSERIAL PRIMARY KEY,
    IdRol BIGINT NOT NULL,
    IdPermiso BIGINT NOT NULL,
    Enable BOOLEAN NOT NULL DEFAULT TRUE,
    FechaInsert  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUpdate  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Session
CREATE TABLE Session (
    Id BIGSERIAL PRIMARY KEY,
    IdUsuario BIGINT NOT NULL,
    Token VARCHAR(50) NOT NULL,
    FechaInsert  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUpdate  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaExpiracion TIMESTAMP
);

-- Tabla: Usuarios
CREATE TABLE Usuarios (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Apellido VARCHAR(255) NOT NULL,
    Usuario VARCHAR(255) NOT NULL,
    Password TEXT NOT NULL,
    Salt BYTEA,
    Email TEXT NOT NULL,
    IdRol BIGINT NOT NULL,
    Enable BOOLEAN NOT NULL DEFAULT TRUE,
    FechaInsert  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUpdate  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Relaciones
ALTER TABLE ComposicionProducto
ADD CONSTRAINT FK_Composicion_Insumo FOREIGN KEY (IdInsumo)
REFERENCES Insumo(Id) ON DELETE CASCADE;

ALTER TABLE ComposicionProducto
ADD CONSTRAINT FK_Composicion_Producto FOREIGN KEY (IdProducto)
REFERENCES Producto(Id) ON DELETE CASCADE;

ALTER TABLE RolPermiso
ADD CONSTRAINT FK_RolPermiso_Permiso FOREIGN KEY (IdPermiso)
REFERENCES Permiso(Id) ON DELETE CASCADE;

ALTER TABLE RolPermiso
ADD CONSTRAINT FK_RolPermiso_Rol FOREIGN KEY (IdRol)
REFERENCES Roles(Id) ON DELETE CASCADE;

ALTER TABLE Usuarios
ADD CONSTRAINT FK_Usuario_Rol FOREIGN KEY (IdRol)
REFERENCES Roles(Id) ON DELETE CASCADE;

ALTER TABLE Session
ADD CONSTRAINT FK_Session_Usuario FOREIGN KEY (IdUsuario)
REFERENCES Usuarios(Id) ON DELETE CASCADE;
