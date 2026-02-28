

import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CreateMovieUseCase } from '../application/use-case/create-movie.usecase';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt-auth.guards';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMovieDto } from '../application/dtos/create-movie.dto';
import { MovieResponseDto } from '../application/dtos/movie-response.dto';
import { MovieMapper } from '../application/mapper/movie.mapper';
import { ApiPaginatedResponse, PaginationMeta } from 'src/common/dto/response/response.dto';
import { FindAllMovieUseCase } from '../application/use-case/find-all-movie.usecase';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly createMovieUC: CreateMovieUseCase,
    private readonly findAllmovie:FindAllMovieUseCase,
) {}
@Post()
//   @UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Create a new movie' })
async create(@Body() dto: CreateMovieDto): Promise<MovieResponseDto> {
  const result = await this.createMovieUC.execute(dto);
  return MovieMapper.toResponse(result);
}


    @Get('')
    @ApiOperation({ summary: 'Get all user' })
    @ApiPaginatedResponse(MovieResponseDto)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findAll(): Promise<{
      data: MovieResponseDto[];
      paginateMeta: PaginationMeta;
    }> {
      return this.findAllmovie.execute();
    }

//   @Get()
//   async findAll() {
//   }


    // @Get(':id')
    // @ApiOperation({ summary: 'Get user by ID' })
    // @ApiCustomResponse(UserResponseDto)
    // @ApiResponse({ status: 404, description: 'User not found' })
    // @ApiResponse({ status: 500, description: 'Internal server error' })
    // async findById(@Param('id') id: string): Promise<UserResponseDto> {
    //   return this.findUser.execute(id);
    // }

}