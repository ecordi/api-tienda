import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Contraseña',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
