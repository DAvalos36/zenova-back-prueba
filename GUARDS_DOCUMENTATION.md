# Documentación de Guards de Autenticación

## Guards Disponibles

### 1. JwtAuthGuard
- **Propósito**: Validar solo que el usuario esté autenticado
- **Uso**: Para endpoints que requieren autenticación básica

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async getProfile(@CurrentUser() user: JwtPayload) {
  // Cualquier usuario autenticado puede acceder
}
```

### 2. JwtAdminGuard
- **Propósito**: Validar autenticación + rol de administrador
- **Uso**: Para endpoints exclusivos de administradores

```typescript
@Get('admin-only')
@UseGuards(JwtAdminGuard)
@ApiBearerAuth()
async adminOnlyEndpoint(@CurrentUser() user: JwtPayload) {
  // Solo usuarios admin pueden acceder
}
```

### 3. RolesGuard + @Roles()
- **Propósito**: Sistema flexible de roles
- **Uso**: Para endpoints con diferentes niveles de acceso

```typescript
@Post('admin-action')
@UseGuards(RolesGuard)
@Roles('admin')
@ApiBearerAuth()
async adminAction(@CurrentUser() user: JwtPayload) {
  // Solo usuarios con rol 'admin' pueden acceder
}
```

## Respuestas de Error

### 401 Unauthorized
- Token no proporcionado
- Token inválido o expirado

### 403 Forbidden
- Usuario autenticado pero sin permisos suficientes
- No es administrador cuando se requiere

## JWT Payload Estructura

```typescript
interface JwtPayload {
  sub: number;        // User ID
  email: string;      // Email del usuario
  name: string;       // Nombre del usuario
  isAdmin: boolean;   // Si es administrador
  iat?: number;       // Issued at
  exp?: number;       // Expiration
}
```

## Recomendaciones de Uso

1. **Para endpoints públicos**: No usar guards
2. **Para endpoints de usuarios**: Usar `JwtAuthGuard`
3. **Para endpoints de admin**: Usar `JwtAdminGuard` o `RolesGuard` + `@Roles('admin')`
4. **Para sistemas complejos de roles**: Usar `RolesGuard` + `@Roles()`
