import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/infrastructure/prisma/prisma.module';
import { PrismaMovieRepository } from './infrastructure/prisma-movie.repository';
import { CreateMovieUseCase } from './application/use-case/create-movie.usecase';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { MovieController } from './presentation/movie.controller';
import { FindAllMovieUseCase } from './application/use-case/find-all-movie.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [MovieController],
  providers: [
    CreateMovieUseCase,
    FindAllMovieUseCase,
    {
      provide: REPOSITORY_TOKEN.MOVIE,
      useClass: PrismaMovieRepository,
    },
  ],
})
export class MovieModule {}
