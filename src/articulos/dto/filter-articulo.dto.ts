import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterArticuloDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por nombre del artículo',
    required: false,
    example: 'Laptop',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({
    description: 'Filtrar por estado del artículo (activo/inactivo)',
    required: false,
    example: 'true',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  estado?: boolean;

  @ApiProperty({
    description: 'Búsqueda exacta por nombre (true) o parcial (false)',
    required: false,
    example: 'false',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  exacto?: boolean;
}
