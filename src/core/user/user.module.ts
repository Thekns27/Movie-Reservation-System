import { Module } from '@nestjs/common';
import { BcryptHashService } from 'src/module/hash-service/bcrypt-hash.service';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { UserController } from './presentation/user.controller';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { CreateUserUseCase } from './application/use-case/create-user.usecase';
import { FindAllUserUseCase } from './application/use-case/find-all-user.usecase';
import { FindUserUseCase } from './application/use-case/find-user.usecase';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { IHASH_SERVICE } from 'src/common/constant';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    PrismaUserRepository,
    CreateUserUseCase,
    FindUserUseCase,
    FindAllUserUseCase,
    {
      provide: REPOSITORY_TOKEN.USER,
      useExisting: PrismaUserRepository,
    },
    {
      provide: IHASH_SERVICE,
      useClass: BcryptHashService,
    },
  ],
})
export class UserModule {}
