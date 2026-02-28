

import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { MovieRepository } from '../../domain/repositories/movie.repository';
import { MovieMapper } from '../mapper/movie.mapper';
// import { UserRepository } from '../../domain/user.repository';
// import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class FindAllMovieUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.MOVIE) private readonly movieRepo: MovieRepository,
  ) {}

  async execute() {
    const { data, paginateMeta } = await this.movieRepo.findAll();
    return {
      data: MovieMapper.toResponseList(data),
      paginateMeta,
    };
  }
}
