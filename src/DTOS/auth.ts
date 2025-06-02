import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from 'generated/prisma';
import { Exclude } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseña123!',
    minLength: 8,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;
}

export class RegisterResponseDto implements User {
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string | null;
  @ApiProperty()
  id: number;
  @ApiProperty()
  role: $Enums.UserRole;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdAt: Date;
  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseña123!',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Token de refresco',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'El token de refresco debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El token de refresco es requerido' })
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'usuario@ejemplo.com' },
      name: { type: 'string', example: 'Juan Pérez' },
      isAdmin: { type: 'boolean', example: false },
    },
  })
  user: {
    id: number;
    email: string;
    name: string | null;
    isAdmin: boolean;
  };

  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  constructor(userData: User, token: string) {
    this.message = 'Login successful';
    this.user = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      isAdmin: userData.role === 'admin',
    };
    this.access_token = token;
  }
}
