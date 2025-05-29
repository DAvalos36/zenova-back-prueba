import { Injectable } from '@nestjs/common';
import { PrismaDbService } from '../prisma-db/prisma-db.service';

@Injectable()
export class AuthService {
  constructor(private db: PrismaDbService) {}

  register(registerDto: any): string {
    console.log('Register DTO:', registerDto);
    // Aquí podrías agregar validaciones o lógica adicional
    // Lógica para el registro
    return 'This action adds a new user';
    this.db.user.create({
      data: {},
    });
  }

  login(req: any): string {
    console.log('Login Request:', req);
    // Lógica para el inicio de sesión
    return 'This action logs in a user';
  }

  refresh(refreshTokenDto: any): string {
    console.log('Refresh Token DTO:', refreshTokenDto);
    // Lógica para refrescar el token
    return 'This action refreshes a token';
  }

  showAllUsers() {
    return this.db.user.findMany();
  }
}
