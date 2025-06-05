import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateArticuloDto {
  @ApiProperty({
    description: 'Nombre del artículo',
    example: 'Laptop XPS',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;

  @ApiProperty({
    description: 'Marca del artículo',
    example: 'Dell',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La marca debe ser un texto' })
  marca?: string;

  @ApiProperty({
    description: 'Estado del artículo (activo/inactivo)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  estado?: boolean;
}
