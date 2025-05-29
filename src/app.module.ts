import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { PrismaDbService } from './services/prisma-db/prisma-db.service';
import { ProductsService } from './services/products/products.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaDbService, ProductsService],
})
export class AppModule {}
