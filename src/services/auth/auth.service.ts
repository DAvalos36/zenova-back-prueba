import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaDbService } from '../prisma-db/prisma-db.service';
import { RegisterDto } from 'src/DTOS/auth';

import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(private db: PrismaDbService) {}

  async register(
    registroData: RegisterDto,
    ip?: string,
    userAgent?: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(registroData.password, 10);

    try {
      const newUser = await this.db.user.create({
        data: {
          email: registroData.email,
          passwordHash: hashedPassword,
          name: registroData.name,
          auditLogs: {
            create: {
              action: 'register',
              ipAddress: ip,
              userAgent: userAgent,
            },
          },
        },
      });
      return newUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Email already exists',
          JSON.stringify(error),
        );
      } else if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UnprocessableEntityException(
          'Invalid data',
          JSON.stringify(error),
        );
      } else {
        throw new InternalServerErrorException(
          'Error creating user',
          JSON.stringify(error),
        );
      }
    }
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
