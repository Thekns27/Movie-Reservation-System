import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { HashService } from 'src/module/hash-service/hash.service';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { IHASH_SERVICE } from 'src/common/constant';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.AUTH)
    private readonly userRepo: AuthRepository,
    private readonly jwt: JwtService,
    @Inject(IHASH_SERVICE)
    private readonly hashService: HashService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    console.log(user);
    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(user.password);
    const match = await this.hashService.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwt.signAsync(payload),
    };
  }
}
