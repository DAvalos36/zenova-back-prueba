# Zenova Backend - Prueba Técnica

API REST robusta para **ecommerce de gaming** desarrollada con **NestJS**, **MySQL**, **Prisma ORM**, documentada con **Swagger** y containerizada con **Docker**.

## 🎯 Características Implementadas

- ✅ **API REST** con NestJS y TypeScript
- ✅ **Base de datos MySQL** con Prisma ORM
- ✅ **Cache con Redis** para optimización
- ✅ **Documentación automática** con Swagger
- ✅ **Containerización** con Docker Compose
- ✅ **Validación de datos** con class-validator
- ✅ **Arquitectura modular** y escalable
- ✅ **Manejo de errores** centralizado
- ✅ **Variables de entorno** configurables

## 🚀 Stack Tecnológico

| Tecnología     | Uso                         |
| -------------- | --------------------------- |
| **NestJS**     | Framework Node.js escalable |
| **MySQL**      | Base de datos relacional    |
| **Redis**      | Cache                       |
| **Prisma**     | ORM con type safety         |
| **Swagger**    | Documentación interactiva   |
| **phpMyAdmin** | Administrador de MySQL      |
| **Docker**     | Containerización            |

## 🛠️ Instalación Rápida

### Prerrequisitos

**Solo necesitas:**

- **Docker** con **Docker Compose** (o Podman)

### Con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/DAvalos36/zenova-back-prueba
cd zenova-backend-prueba

# 2. Ejecutar
docker-compose up
```

Una vez aparesca lo siguiente en la terminal estara lista para utilizarle la app.

![Db & App Cargada](https://i.ibb.co/NngMTHRF/Captura-de-pantalla-2025-06-03-a-la-s-1-46-42-a-m.png, 'Db & App cargada')

## 📚 Endpoints Principales

Una vez ejecutándose:

- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api - Fácil de usar gracias a la correcta implementación de OpenAPI
- **phpMyAdmin**: http://localhost:8081/ (usuario: **root**, contraseña: **root**)

![Apis en Swagger](https://i.ibb.co/Y461Mrdp/Captura-de-pantalla-2025-06-03-a-la-s-2-19-42-a-m.png)

### 🎮 Usuarios de Prueba

La API incluye usuarios predefinidos para pruebas inmediatas:

| Tipo        | Email                 | Contraseña |
| ----------- | --------------------- | ---------- |
| **Admin**   | admin@gamingstore.com | admin123   |
| **Cliente** | gamer@example.com     | gamer123   |

> **Nota:** También puedes crear nuevos usuarios usando los endpoints de auth si lo deseas.

### ⚙️ Configuración

Todas las variables de entorno están **pre-cargadas** en el archivo `docker-compose.yml` y se pueden configurar directamente ahí si necesitas modificar algo.

## 🐳 Comandos Docker Útiles

```bash
# Iniciar servicios
docker-compose up

# Detener servicios
docker-compose down
```

---

**Desarrollado como prueba técnica** - API para ecommerce de gaming demostrando mejores prácticas en desarrollo backend moderno.
