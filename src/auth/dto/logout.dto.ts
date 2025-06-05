import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    description: 'ID del usuario para cerrar sesión',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
