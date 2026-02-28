import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REPOSITORY_TOKEN } from "src/common/constant/repository.config";
import { PrismaService } from "src/core/infrastructure/prisma/prisma.service";
import { UserRepository } from "../../domain/user.repository";
import { Role } from "@prisma/client";
import { UserMapper } from "../mapper/user.mapper";


@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, input: { name?: string; role?: Role }) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    user.update({
      name: input.name,
      role: input.role,
    });

    return await this.prisma.runInTransaction(async (tx) => {
      const updated = await this.userRepo.save(user, tx);
      return UserMapper.toResponse(updated);
    });
  }
}