import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaDbService } from '../prisma-db/prisma-db.service';
import { LoginDto, RegisterDto, LoginResponseDto } from 'src/DTOS/auth';

import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaDbService,
    private jwtService: JwtService,
  ) {}

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

  async login(info: LoginDto): Promise<LoginResponseDto> {
    const userData = await this.db.user.findFirst({
      where: { email: info.email },
    });

    if (!userData) {
      throw new UnprocessableEntityException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      info.password,
      userData.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Invalid password');
    }

    // Generar JWT si las credenciales son válidas
    const token = await this.generateJWT(userData);

    return new LoginResponseDto(userData, token);
  }

  refresh(refreshTokenDto: any): string {
    console.log('Refresh Token DTO:', refreshTokenDto);
    // Lógica para refrescar el token
    return 'This action refreshes a token';
  }

  private async generateJWT(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.signAsync(payload);
  }

  showAllUsers() {
    return this.db.user.findMany();
  }
}
