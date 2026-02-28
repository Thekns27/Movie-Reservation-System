
import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { Movie } from '../../domain/entities/movie.entity';
import { MovieRepository } from '../../domain/repositories/movie.repository';

@Injectable()
export class CreateMovieUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.MOVIE) private readonly movieRepo: MovieRepository,
  ) {}

  async execute(input: {
    title: string;
    genre: string;
    actors: string[];
    duration: number;
    description?: string | undefined;
    isActive?: boolean;
  }) {
    const movie = Movie.create({
    title: input.title,
    genre: input.genre,
    actors: input.actors,
    duration: input.duration,
    description: input.description,
    isActive: input.isActive ?? true,
  });
  return await this.movieRepo.save(movie);
  }
}
