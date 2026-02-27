import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dtos/register.dto';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { User } from '../../domain/entities/auth.entity';
import { HashService } from 'src/module/hash-service/hash.service';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { IHASH_SERVICE } from 'src/common/constant';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.AUTH)
    private readonly userRepo: AuthRepository,
    @Inject(IHASH_SERVICE)
    private readonly hashService: HashService,
  ) {}

  async execute(dto: RegisterDto) {
    const exists = await this.userRepo.findByEmail(dto.email);

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const hash = await this.hashService.hash(dto.password);

    const user = User.create({
      name: dto.name,
      email: dto.email,
      password: hash,
    });

    await this.userRepo.save(user);

    return user;
  }
}
