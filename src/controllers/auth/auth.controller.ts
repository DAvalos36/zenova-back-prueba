import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Ip,
  Headers,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  RegisterDto,
  RegisterResponseDto,
  LoginDto,
  LoginResponseDto,
} from 'src/DTOS/auth';
import { AuthService } from 'src/services/auth/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
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
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 422, description: 'Usuario no encontrado' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
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
