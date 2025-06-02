import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { execSync } from 'child_process';
import { PrismaClient } from '../../../generated/prisma';

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

  private async verifyConenectionData(){
    try {
      // Intenta conectar a la base de datos
      await this.$connect();
      
      // Verifica si hay datos
      const hasData = await this.checkIfDatabaseHasData();
      
      if (!hasData) {
        console.log('Database is empty. Starting initialization...');
        // await this.seedDatabase();
      } else {
        console.log('Database already contains data.');
      }
    } catch (error) {
      console.log('Database connection failed. Creating database...');
      await this.createAndInitializeDatabase();
    }
  }  private async createAndInitializeDatabase() {
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
        env: { ...process.env }
      });
      
      // Genera el cliente de Prisma
      console.log('Generating Prisma client...');
      execSync('pnpm prisma generate', { 
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env }
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
    const countedUser = await this.user.count()
    return countedUser > 0;
  }
  private async seedDatabase() {
    console.log('Seeding database...');
    
    try {
      // Opción 1: Ejecutar el archivo seed de Prisma
      execSync('pnpm prisma db seed', { stdio: 'inherit' });
      
      // Opción 2: O ejecutar el seed directamente aquí
      // await this.createInitialData();
      
      console.log('Database seeding completed!');
    } catch (error) {
      console.error('Failed to seed database:', error);
      throw error;
    }
  }
}
