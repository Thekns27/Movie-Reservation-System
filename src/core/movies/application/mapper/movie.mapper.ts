import { Movie } from '../../domain/entities/movie.entity';
import { MovieResponseDto } from '../dtos/movie-response.dto';

export class MovieMapper {
  static toResponse(movie: Movie): MovieResponseDto {
    const primitives = movie.toPrimitives();
    return {
      id: primitives.id!,
      title: primitives.title,
      genre: primitives.genre,
      actors: primitives.actors,
      duration: primitives.duration,
      description: primitives.description,
      isActive: primitives.isActive,
    };
  }

  static toResponseList(movies: Movie[]): MovieResponseDto[] {
    return movies.map((movie) => this.toResponse(movie));
  }
}
