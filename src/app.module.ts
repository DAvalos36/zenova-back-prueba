import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { PrismaDbService } from './services/prisma-db/prisma-db.service';
import { ProductsService } from './services/products/products.service';
import { ProductsController } from './controllers/products/products.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, AuthController, ProductsController],
  providers: [AppService, AuthService, PrismaDbService, ProductsService],
})
export class AppModule {}
