import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { UserRepository } from '../../domain/user.repository';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class FindAllUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: UserRepository,
  ) {}

  async execute() {
    const { data, paginateMeta } = await this.userRepo.findAll();
    return {
      data: UserMapper.toResponseList(data),
      paginateMeta,
    };
  }
}
