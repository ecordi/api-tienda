import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticuloDto {
  @ApiProperty({
    description: 'Nombre del artículo',
    example: 'Laptop XPS',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;

  @ApiProperty({
    description: 'Marca del artículo',
    example: 'Dell',
  })
  @IsNotEmpty({ message: 'La marca es obligatoria' })
  @IsString({ message: 'La marca debe ser un texto' })
  marca: string;
}
