import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';

@Injectable()
export class MeUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.AUTH)
    private readonly userRepo: AuthRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
