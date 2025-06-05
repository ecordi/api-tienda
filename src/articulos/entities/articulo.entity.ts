import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  marca: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
}
