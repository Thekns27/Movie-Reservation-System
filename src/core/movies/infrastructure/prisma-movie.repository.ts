

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';
import { MovieRepository } from '../domain/repositories/movie.repository';
import { Movie } from '../domain/entities/movie.entity';
import { PaginationMeta } from 'src/common/dto/response/response.dto';

@Injectable()
export class PrismaMovieRepository implements MovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(movie: Movie): Promise<Movie> {
    const data = movie.toPrimitives();
    const record = await this.prisma.movie.upsert({
      where: { id: data.id || '' },
      update: data,
      create: {
        title: data.title,
        genre: data.genre,
        actors: data.actors,
        duration: data.duration,
        description: data.description,
        isActive: data.isActive,
      },
    });
    return this.toDomain(record);
  }

  async findById(id: string): Promise<Movie | null> {
    const record = await this.prisma.movie.findUnique({ where: { id } });
    return this.toDomain(record);
  }

 async findAll(): Promise<{ data: Movie[]; paginateMeta?: PaginationMeta }> {
       const record = await this.prisma.movie.paginate({
         limit: 10,
         page: 1,
       });
       return {
         data: record ? this.toDomainList(record.data) : [],
         paginateMeta: record?.meta,
       };
     }


  async delete(id: string): Promise<void> {
    await this.prisma.movie.delete({ where: { id } });
  }

  private toDomain(record: any): Movie {
  return Movie.create({
    id: record.id,
    title: record.title,
    genre: record.genre,
    actors: record.actors,
    duration: record.duration,
    description: record.description,
    isActive: record.isActive,
  });
}


  private toDomainList(records: any[]): Movie[] {
    return records.map(record => this.toDomain(record));
  }
}
