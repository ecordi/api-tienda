import { Controller, Post, Body, Get, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso', 
    schema: { 
      properties: { 
        access_token: { type: 'string' },
        refresh_token: { type: 'string' }
      } 
    } 
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refrescado exitosamente', 
    schema: { 
      properties: { 
        access_token: { type: 'string' },
        refresh_token: { type: 'string' }
      } 
    } 
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  // Endpoints de gestión de usuarios

  @Get('users')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Desactivar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada correctamente' })
  logout(@Body('userId') userId: string) {
    return this.authService.logout(userId);
  }
}
