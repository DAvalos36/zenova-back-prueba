import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // Aquí podrías inyectar servicios si es necesario
  }

  @Post('register')
  register(@Body() registerDto: any) {
    console.log('Register DTO:', registerDto);
    // Aquí podrías agregar validaciones o lógica adicional
    // Lógica para el registro
    return 'This action adds a new user';
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
