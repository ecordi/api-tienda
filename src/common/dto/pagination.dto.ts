import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Número de página',
    example: 1,
    required: false,
    default: 1,
  })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Límite de elementos por página',
    example: 10,
    required: false,
    default: 10,
  })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
