import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'admin',
  })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
  })
  isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
