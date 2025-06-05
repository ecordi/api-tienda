import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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
  password: string;
}
