import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { FilterArticuloDto } from './dto/filter-articulo.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
  ) {}

  async create(createArticuloDto: CreateArticuloDto): Promise<Articulo> {
    const articulo = this.articuloRepository.create(createArticuloDto);
    return await this.articuloRepository.save(articulo);
  }

  async findAll(filterDto: FilterArticuloDto): Promise<PaginatedResponse<Articulo>> {
    const { nombre, estado, exacto, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (estado !== undefined) {
      where.estado = estado;
    }

    if (nombre) {
      if (exacto) {
        where.nombre = nombre;
      } else {
        where.nombre = Like(`%${nombre}%`);
      }
    }
    
    // Count total items for pagination metadata
    const totalItems = await this.articuloRepository.count({ where });
    const lastPage = Math.ceil(totalItems / limit);
    
    // Get paginated results
    const data = await this.articuloRepository.find({
      where,
      order: {
        fechaModificacion: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    // Return data with pagination metadata
    return {
      data,
      meta: {
        total: totalItems,
        page,
        lastPage,
        limit,
      },
    };
  }

  async findOne(id: string): Promise<Articulo> {
    const articulo = await this.articuloRepository.findOne({ where: { id } });
    if (!articulo) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado`);
    }
    return articulo;
  }

  async update(id: string, updateArticuloDto: UpdateArticuloDto): Promise<Articulo> {
    const articulo = await this.findOne(id);
    
    // Update the entity with the new values
    Object.assign(articulo, updateArticuloDto);
    
    // Save the updated entity
    return await this.articuloRepository.save(articulo);
  }

  async remove(id: string): Promise<void> {
    const articulo = await this.findOne(id);
    
    // Logical delete - just update the estado to false
    articulo.estado = false;
    await this.articuloRepository.save(articulo);
  }
}
