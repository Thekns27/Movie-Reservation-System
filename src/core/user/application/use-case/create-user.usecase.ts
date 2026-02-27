import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { IHASH_SERVICE } from 'src/common/constant';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';
import { HashService } from 'src/module/hash-service/hash.service';
import { UserRepository } from '../../domain/user.repository';
import { ERROR_CODES } from 'src/common/errors/errors.code';
import { User } from '../../domain/user.entity';
import { UserMapper } from '../mapper/user.mapper';
import { Email } from '../../domain/value-objects/user-email.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: UserRepository,
    @Inject(IHASH_SERVICE)
    private readonly hashService: HashService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: { name: string; email: string; password: string ; role:Role}) {
    const email = Email.create(input.email);
    const exists = await this.userRepo.findByEmail(email.getValue());
    if (exists) {
      throw new ConflictException(
        ERROR_CODES.CONFLICT_EMAIL,
        'User with this email already exists',
      );
    }
    const hashed = await this.hashService.hash(input.password);
    const user = User.create({
      name: input.name,
      email,
      password: hashed,
      role: input.role,
    });

    const created = await this.prisma.runInTransaction(
      async (tx?: Prisma.TransactionClient) => {
        return await this.userRepo.save(user, tx);
      },
    );
    return UserMapper.toResponse(created);
  }
}
