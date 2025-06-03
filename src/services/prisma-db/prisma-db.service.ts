import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { execSync } from 'child_process';
import { PrismaClient, ProductStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaDbService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.verifyConenectionData();
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async verifyConenectionData() {
    try {
      await this.$connect();

      const hasData = await this.checkIfDatabaseHasData();

      if (!hasData) {
        console.log('Database is empty. Starting initialization...');
        await this.seedDatabase();
      } else {
        console.log('Database already contains data.');
      }
    } catch (error) {
      console.log('Database connection failed. Creating database...');
      await this.createAndInitializeDatabase();
    }
  }

  private async createAndInitializeDatabase() {
    try {
      console.log('Initializing database...');

      // Verificar si pnpm está disponible
      try {
        execSync('pnpm --version', { stdio: 'pipe' });
      } catch {
        console.log('pnpm not found, falling back to npx...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        execSync('npx prisma generate', { stdio: 'inherit' });
      }

      // Ejecuta las migraciones de Prisma
      console.log('Running Prisma migrations...');
      execSync('pnpm prisma migrate deploy', {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env },
      });

      // Genera el cliente de Prisma
      console.log('Generating Prisma client...');
      execSync('pnpm prisma generate', {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env },
      });

      // Conecta a la base de datos
      await this.$connect();

      // Ejecuta el seed
      await this.seedDatabase();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async checkIfDatabaseHasData(): Promise<boolean> {
    const countedUser = await this.user.count();
    return countedUser > 0;
  }
  private async seedDatabase() {
    console.log('🚀 Iniciando seed para ecommerce gaming...');

    try {
      // 1. Crear usuarios
      console.log('👥 Creando usuarios...');

      const hashedPassword = await bcrypt.hash('admin123', 10);

      const adminUser = await this.user.create({
        data: {
          email: 'admin@gamingstore.com',
          passwordHash: hashedPassword,
          name: 'Administrador Gaming',
          role: UserRole.admin,
          isActive: true,
        },
      });

      const customerUser = await this.user.create({
        data: {
          email: 'gamer@example.com',
          passwordHash: await bcrypt.hash('gamer123', 10),
          name: 'Pro Gamer',
          role: UserRole.customer,
          isActive: true,
        },
      });

      // 2. Crear categorías principales
      console.log('📂 Creando categorías...');

      const consoleCategory = await this.category.create({
        data: {
          name: 'Consolas',
          slug: 'consolas',
        },
      });

      const pcGamingCategory = await this.category.create({
        data: {
          name: 'PC Gaming',
          slug: 'pc-gaming',
        },
      });

      const accessoriesCategory = await this.category.create({
        data: {
          name: 'Accesorios',
          slug: 'accesorios',
        },
      });

      const gamesCategory = await this.category.create({
        data: {
          name: 'Videojuegos',
          slug: 'videojuegos',
        },
      });

      // Subcategorías de consolas
      const ps5Category = await this.category.create({
        data: {
          name: 'PlayStation 5',
          slug: 'playstation-5',
          parentId: consoleCategory.id,
        },
      });

      const xboxCategory = await this.category.create({
        data: {
          name: 'Xbox Series',
          slug: 'xbox-series',
          parentId: consoleCategory.id,
        },
      });

      const nintendoCategory = await this.category.create({
        data: {
          name: 'Nintendo Switch',
          slug: 'nintendo-switch',
          parentId: consoleCategory.id,
        },
      });

      // Subcategorías de PC Gaming
      const cpuCategory = await this.category.create({
        data: {
          name: 'Procesadores',
          slug: 'procesadores',
          parentId: pcGamingCategory.id,
        },
      });

      const gpuCategory = await this.category.create({
        data: {
          name: 'Tarjetas Gráficas',
          slug: 'tarjetas-graficas',
          parentId: pcGamingCategory.id,
        },
      });

      // Subcategorías de accesorios
      const controllerCategory = await this.category.create({
        data: {
          name: 'Controles',
          slug: 'controles',
          parentId: accessoriesCategory.id,
        },
      });

      const headsetCategory = await this.category.create({
        data: {
          name: 'Auriculares Gaming',
          slug: 'auriculares-gaming',
          parentId: accessoriesCategory.id,
        },
      });

      // 3. Crear productos
      console.log('🎮 Creando productos...');

      // Consolas
      const ps5Console = await this.product.create({
        data: {
          sku: 'PS5-STD-001',
          name: 'PlayStation 5 Standard Edition',
          slug: 'playstation-5-standard-edition',
          description:
            'La consola de nueva generación de Sony con SSD ultra rápido y tecnología DualSense.',
          price: 499.99,
          comparePrice: 549.99,
          cost: 400.0,
          stock: 25,
          lowStockThreshold: 5,
          weight: 4.5,
          status: ProductStatus.active,
          featured: true,
        },
      });

      const xboxSeriesX = await this.product.create({
        data: {
          sku: 'XBOX-SX-001',
          name: 'Xbox Series X',
          slug: 'xbox-series-x',
          description:
            'La consola más potente de Xbox con 12 teraflops de potencia gráfica.',
          price: 499.99,
          comparePrice: 529.99,
          cost: 410.0,
          stock: 20,
          lowStockThreshold: 5,
          weight: 4.45,
          status: ProductStatus.active,
          featured: true,
        },
      });

      const nintendoSwitch = await this.product.create({
        data: {
          sku: 'NSW-OLED-001',
          name: 'Nintendo Switch OLED Model',
          slug: 'nintendo-switch-oled-model',
          description:
            'Nintendo Switch con pantalla OLED de 7 pulgadas y colores vibrantes.',
          price: 349.99,
          comparePrice: 369.99,
          cost: 280.0,
          stock: 30,
          lowStockThreshold: 8,
          weight: 0.42,
          status: ProductStatus.active,
          featured: true,
        },
      });

      // Componentes PC Gaming
      const rtx4080 = await this.product.create({
        data: {
          sku: 'RTX-4080-001',
          name: 'NVIDIA GeForce RTX 4080 SUPER',
          slug: 'nvidia-geforce-rtx-4080-super',
          description:
            'Tarjeta gráfica de alta gama con arquitectura Ada Lovelace.',
          price: 999.99,
          comparePrice: 1199.99,
          cost: 750.0,
          stock: 15,
          lowStockThreshold: 3,
          weight: 2.2,
          status: ProductStatus.active,
          featured: true,
        },
      });

      const ryzen9 = await this.product.create({
        data: {
          sku: 'AMD-R9-7900X',
          name: 'AMD Ryzen 9 7900X',
          slug: 'amd-ryzen-9-7900x',
          description:
            'Procesador de 12 núcleos y 24 hilos con arquitectura Zen 4.',
          price: 549.99,
          comparePrice: 599.99,
          cost: 420.0,
          stock: 18,
          lowStockThreshold: 5,
          weight: 0.05,
          status: ProductStatus.active,
          featured: false,
        },
      });

      // Accesorios Gaming
      const dualsenseController = await this.product.create({
        data: {
          sku: 'PS5-CTRL-WHT',
          name: 'Control DualSense PlayStation 5 Blanco',
          slug: 'control-dualsense-playstation-5-blanco',
          description:
            'Control inalámbrico con retroalimentación háptica y gatillos adaptativos.',
          price: 69.99,
          comparePrice: 79.99,
          cost: 50.0,
          stock: 50,
          lowStockThreshold: 15,
          weight: 0.28,
          status: ProductStatus.active,
          featured: false,
        },
      });

      const logitechHeadset = await this.product.create({
        data: {
          sku: 'LOG-G-PRO-X',
          name: 'Logitech G PRO X Gaming Headset',
          slug: 'logitech-g-pro-x-gaming-headset',
          description:
            'Auriculares gaming profesionales con tecnología Blue VO!CE.',
          price: 129.99,
          comparePrice: 149.99,
          cost: 90.0,
          stock: 35,
          lowStockThreshold: 8,
          weight: 0.32,
          status: ProductStatus.active,
          featured: false,
        },
      });

      const corsairKeyboard = await this.product.create({
        data: {
          sku: 'COR-K95-RGB',
          name: 'Corsair K95 RGB Platinum XT',
          slug: 'corsair-k95-rgb-platinum-xt',
          description:
            'Teclado mecánico gaming con switches Cherry MX y retroiluminación RGB.',
          price: 199.99,
          comparePrice: 229.99,
          cost: 140.0,
          stock: 25,
          lowStockThreshold: 5,
          weight: 1.2,
          status: ProductStatus.active,
          featured: false,
        },
      });

      // Videojuegos
      const spiderMan2 = await this.product.create({
        data: {
          sku: 'PS5-SPIDERMAN2',
          name: 'Spider-Man 2 PS5',
          slug: 'spider-man-2-ps5',
          description: 'La continuación épica de la saga Spider-Man.',
          price: 69.99,
          comparePrice: 79.99,
          cost: 45.0,
          stock: 100,
          lowStockThreshold: 20,
          weight: 0.1,
          status: ProductStatus.active,
          featured: true,
        },
      });

      // 4. Crear relaciones producto-categoría
      console.log('🔗 Creando relaciones producto-categoría...');

      await this.productCategory.createMany({
        data: [
          { productId: ps5Console.id, categoryId: ps5Category.id },
          { productId: ps5Console.id, categoryId: consoleCategory.id },
          { productId: xboxSeriesX.id, categoryId: xboxCategory.id },
          { productId: xboxSeriesX.id, categoryId: consoleCategory.id },
          { productId: nintendoSwitch.id, categoryId: nintendoCategory.id },
          { productId: nintendoSwitch.id, categoryId: consoleCategory.id },
          { productId: rtx4080.id, categoryId: gpuCategory.id },
          { productId: rtx4080.id, categoryId: pcGamingCategory.id },
          { productId: ryzen9.id, categoryId: cpuCategory.id },
          { productId: ryzen9.id, categoryId: pcGamingCategory.id },
          {
            productId: dualsenseController.id,
            categoryId: controllerCategory.id,
          },
          {
            productId: dualsenseController.id,
            categoryId: accessoriesCategory.id,
          },
          { productId: logitechHeadset.id, categoryId: headsetCategory.id },
          { productId: logitechHeadset.id, categoryId: accessoriesCategory.id },
          { productId: corsairKeyboard.id, categoryId: accessoriesCategory.id },
          { productId: spiderMan2.id, categoryId: gamesCategory.id },
        ],
      });

      // 5. Crear imágenes de productos
      console.log('🖼️ Creando imágenes de productos...');

      await this.productImage.createMany({
        data: [
          {
            productId: ps5Console.id,
            url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
            altText: 'PlayStation 5 Console',
            position: 1,
            isPrimary: true,
          },
          {
            productId: xboxSeriesX.id,
            url: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500',
            altText: 'Xbox Series X Console',
            position: 1,
            isPrimary: true,
          },
          {
            productId: nintendoSwitch.id,
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
            altText: 'Nintendo Switch OLED',
            position: 1,
            isPrimary: true,
          },
          {
            productId: rtx4080.id,
            url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500',
            altText: 'NVIDIA RTX 4080',
            position: 1,
            isPrimary: true,
          },
          {
            productId: dualsenseController.id,
            url: 'https://images.unsplash.com/photo-1592840062661-e9b72c30b0aa?w=500',
            altText: 'DualSense Controller',
            position: 1,
            isPrimary: true,
          },
        ],
      });

      // 6. Crear API Keys para el admin
      console.log('🔑 Creando API Keys...');

      const apiKeyValue =
        'gsk_' +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const hashedApiKey = await bcrypt.hash(apiKeyValue, 10);

      await this.apiKey.create({
        data: {
          userId: adminUser.id,
          keyHash: hashedApiKey,
          name: 'Admin Development Key',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        },
      });

      // 7. Crear logs de auditoría iniciales
      console.log('📋 Creando logs de auditoría...');

      await this.auditLog.createMany({
        data: [
          {
            userId: adminUser.id,
            action: 'SEED_DATABASE',
            entityType: 'SYSTEM',
            ipAddress: '127.0.0.1',
            userAgent: 'System Seed',
          },
          {
            userId: adminUser.id,
            action: 'CREATE_CATEGORIES',
            entityType: 'CATEGORY',
            ipAddress: '127.0.0.1',
            userAgent: 'System Seed',
          },
          {
            userId: adminUser.id,
            action: 'CREATE_PRODUCTS',
            entityType: 'PRODUCT',
            ipAddress: '127.0.0.1',
            userAgent: 'System Seed',
          },
        ],
      });

      console.log('✅ Seed completado exitosamente!');
      console.log(`
📊 Datos creados:
- 2 usuarios (1 admin, 1 customer)
- ${await this.category.count()} categorías
- ${await this.product.count()} productos
- ${await this.productImage.count()} imágenes
- 1 API Key
- ${await this.auditLog.count()} logs de auditoría

🔐 Credenciales de prueba:
Admin: admin@gamingstore.com / admin123
Customer: gamer@example.com / gamer123
API Key: ${apiKeyValue}
      `);

      console.log('Database seeding completed!');
    } catch (error) {
      console.error('Failed to seed database:', error);
      throw error;
    }
  }
}
