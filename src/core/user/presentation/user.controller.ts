import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserUseCase } from '../application/use-case/create-user.usecase';
import { FindUserUseCase } from '../application/use-case/find-user.usecase';
import { FindAllUserUseCase } from '../application/use-case/find-all-user.usecase';
import {
  ApiCustomResponse,
  ApiPaginatedResponse,
  PaginationMeta,
} from 'src/common/dto/response/response.dto';
import { UserResponseDto } from '../application/dtos/user-response.dto';
import { CreateUserDto } from '../application/dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUser: FindUserUseCase,
    private readonly findAllUser: FindAllUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCustomResponse(UserResponseDto)
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 409, description: 'Conflict - user already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUser.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiCustomResponse(UserResponseDto)
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.findUser.execute(id);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all user' })
  @ApiPaginatedResponse(UserResponseDto)
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(): Promise<{
    data: UserResponseDto[];
    paginateMeta: PaginationMeta;
  }> {
    return this.findAllUser.execute();
  }
}
