import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { UserRepository } from '../../domain/user.repository';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: UserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('USER_NOT_FOUND', 'User not found');
    return UserMapper.toResponse(user);
  }
}
