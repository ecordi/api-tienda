import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { FilterArticuloDto } from './dto/filter-articulo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('articulos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo artículo' })
  @ApiResponse({ status: 201, description: 'Artículo creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createArticuloDto: CreateArticuloDto) {
    return this.articulosService.create(createArticuloDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los artículos con filtros opcionales y paginación' })
  @ApiResponse({ status: 200, description: 'Lista de artículos paginada' })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'estado', required: false, type: Boolean })
  @ApiQuery({ name: 'exacto', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página', example: 10 })
  findAll(@Query() filterDto: FilterArticuloDto) {
    return this.articulosService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un artículo por ID' })
  @ApiResponse({ status: 200, description: 'Artículo encontrado' })
  @ApiResponse({ status: 404, description: 'Artículo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.articulosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un artículo' })
  @ApiResponse({ status: 200, description: 'Artículo actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Artículo no encontrado' })
  update(@Param('id') id: string, @Body() updateArticuloDto: UpdateArticuloDto) {
    return this.articulosService.update(id, updateArticuloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un artículo (borrado lógico)' })
  @ApiResponse({ status: 200, description: 'Artículo eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Artículo no encontrado' })
  remove(@Param('id') id: string) {
    return this.articulosService.remove(id);
  }
}
