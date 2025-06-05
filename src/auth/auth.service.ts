import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save new user
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    
    await this.userRepository.save(user);
    
    // Generate tokens
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    
    return {
      message: 'Usuario registrado exitosamente',
      ...tokens
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    // Find user
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Generate tokens
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    
    return tokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Acceso denegado');
      }
      
      // Validate stored refresh token
      const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isRefreshTokenValid) {
        throw new ForbiddenException('Acceso denegado');
      }
      
      // Generate new tokens
      const tokens = await this.getTokens(user.id, user.username);
      await this.updateRefreshToken(user.id, tokens.refresh_token);
      
      return tokens;
    } catch (error) {
      throw new ForbiddenException('Acceso denegado');
    }
  }
  
  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRATION || '1h',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '3h',
        },
      ),
    ]);
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  
  async updateRefreshToken(userId: string, refreshToken: string) {
    // Hash refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
    // Update user with new refresh token
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async findAll() {
    const users = await this.userRepository.find();
    return plainToInstance(UserResponseDto, users);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return plainToInstance(UserResponseDto, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(UserResponseDto, updatedUser);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Soft delete (set isActive to false)
    await this.userRepository.update(id, { isActive: false });
    
    return { message: `Usuario con ID ${id} desactivado correctamente` };
  }

  async logout(userId: string) {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    
    // Clear refresh token
    await this.userRepository.update(userId, { refreshToken: '' });
    return { message: 'Sesión cerrada correctamente' };
  }
}
