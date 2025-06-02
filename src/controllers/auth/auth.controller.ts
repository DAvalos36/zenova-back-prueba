import {
  Controller,
  Post,
  Body,
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
  @ApiResponse({ status: 422, description: 'Usuario no encontrado' })
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Headers() headers?: Record<string, string>,
  ): Promise<LoginResponseDto> {
    const userAgent = headers ? headers['user-agent'] : 'Unknown';
    return await this.authService.login(loginDto, ip, userAgent);
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: any) {
    console.log('Refresh Token DTO:', refreshTokenDto);
    // Lógica para refrescar el token
    return 'This action refreshes a token';
  }
}
