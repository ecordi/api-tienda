# Tienda API - Microservicio de Gestión de Artículos

Este proyecto es un microservicio RESTful desarrollado con NestJS (TypeScript) y MySQL usando TypeORM para la gestión de artículos.

## Características

- CRUD completo para la entidad Artículo
- Búsqueda con filtros (nombre, estado, búsqueda exacta)
- Paginación de resultados con metadatos
- Validaciones con class-validator
- Documentación con Swagger
- Autenticación JWT con refresh token
- Gestión completa de usuarios (CRUD)
- Endpoint de healthcheck
- Configuración para despliegue en Railway
- Arquitectura modular limpia

## Requisitos previos

- Node.js (v14 o superior)
- npm o yarn
- Docker y Docker Compose (opcional, para desarrollo local con MySQL)

## Instalación

1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd tienda-api
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=tienda_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1h
```

4. Iniciar la base de datos MySQL con Docker (opcional para desarrollo local)

```bash
docker-compose up -d
```

5. Iniciar la aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## Documentación de la API

La documentación de la API está disponible en Swagger UI:

```
http://localhost:3000/api
```

## Endpoints

### Autenticación

- `POST /auth/register` - Registrar un nuevo usuario
- `POST /auth/login` - Iniciar sesión y obtener token JWT y refresh token
- `POST /auth/refresh` - Refrescar token de acceso usando refresh token
- `POST /auth/logout` - Cerrar sesión (invalidar refresh token)

### Gestión de Usuarios

- `GET /auth/users` - Listar todos los usuarios
- `GET /auth/users/:id` - Obtener un usuario por ID
- `PUT /auth/users/:id` - Actualizar un usuario
- `DELETE /auth/users/:id` - Desactivar un usuario (soft delete)

### Artículos

- `GET /articulos` - Listar artículos con filtros opcionales y paginación:
  - `nombre`: permite coincidencia parcial
  - `estado`: true/false
  - `exacto`: true/false para búsqueda exacta del nombre
  - `page`: número de página (por defecto: 1)
  - `limit`: elementos por página (por defecto: 10)
- `POST /articulos` - Crear un nuevo artículo
- `PUT /articulos/:id` - Actualizar un artículo
- `DELETE /articulos/:id` - Borrado lógico (marcar estado como inactivo)

### Health Check

- `GET /health` - Verificar el estado de la API

## Ejemplos de uso

### Registro de usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

Respuesta:
```json
{
  "message": "Usuario registrado exitosamente",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Listar Usuarios

```bash
curl -X GET http://localhost:3000/auth/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Crear artículo

```bash
curl -X POST http://localhost:3000/articulos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nombre": "Laptop XPS", "marca": "Dell"}'
```

### Listar artículos con filtros y paginación

```bash
curl -X GET "http://localhost:3000/articulos?nombre=Laptop&estado=true&exacto=false&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

Ejemplo de respuesta:

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nombre": "Laptop XPS",
      "marca": "Dell",
      "estado": true,
      "fechaCreacion": "2025-06-04T21:30:00.000Z",
      "fechaModificacion": "2025-06-04T21:30:00.000Z"
    },
    // ... más artículos
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "lastPage": 5,
    "limit": 10
  }
}
```

### Actualizar artículo

```bash
curl -X PUT http://localhost:3000/articulos/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nombre": "Laptop XPS 15", "marca": "Dell"}'
```

### Eliminar artículo (borrado lógico)

```bash
curl -X DELETE http://localhost:3000/articulos/<id> \
  -H "Authorization: Bearer <token>"
```

### Health Check

```bash
curl -X GET http://localhost:3000/health
```

Respuesta:
```json
{
  "status": "ok",
  "message": "API funcionando correctamente",
  "timestamp": "2023-06-05T04:56:02.123Z"
}
```

## Estructura del proyecto

```
src/
├── articulos/                # Módulo de artículos
│   ├── dto/                  # Data Transfer Objects
│   ├── entities/             # Entidades
│   ├── articulos.controller.ts
│   ├── articulos.module.ts
│   └── articulos.service.ts
├── auth/                     # Módulo de autenticación
│   ├── dto/                  # DTOs para auth
│   ├── entities/             # Entidad de usuario
│   ├── guards/               # Guards de autenticación
│   ├── strategies/           # Estrategias de autenticación
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── common/                   # Componentes comunes reutilizables
│   ├── dto/                  # DTOs comunes (paginación)
│   └── interfaces/           # Interfaces comunes
├── app.module.ts            # Módulo principal
└── main.ts                  # Punto de entrada
```

## Licencia

MIT
