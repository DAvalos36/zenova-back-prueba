import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Ip,
  Headers,
} from '@nestjs/common';
import { RegisterDto, RegisterResponseDto } from 'src/DTOS/auth';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() inputData: RegisterDto,
    @Ip() ip: string,
    @Headers() headers?: Record<string, string>,
  ): Promise<RegisterResponseDto> {
    const userAgent = headers ? headers['user-agent'] : 'Unknown';

    const newUserData = await this.authService.register(
      inputData,
      ip,
      userAgent,
    );

    const response = new RegisterResponseDto(newUserData);
    return response;
  }

  @Post('login')
  login(@Request() req) {
    console.log('Login Request:', req);
    // Lógica para el inicio de sesión
    return 'This action logs in a user';
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: any) {
    console.log('Refresh Token DTO:', refreshTokenDto);
    // Lógica para refrescar el token
    return 'This action refreshes a token';
  }

  @Get()
  async showAllUsers() {
    const r = await this.authService.showAllUsers();
    // Aquí deberías llamar al servicio que maneja la lógica de negocio
    // Por ejemplo, podrías inyectar un servicio de usuario y llamar a un método para obtener todos los usuarios
    return r;
  }
}
