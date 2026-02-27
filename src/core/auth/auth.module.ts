import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { RegisterUseCase } from './application/use-case/register.usecase';
import { LoginUseCase } from './application/use-case/login.usecase';
import { PrismaAuthRepository } from './infrastructure/prisma-auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/module/auth/strategies/jwt.strategy';
import { BcryptHashService } from 'src/module/hash-service/bcrypt-hash.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MeUseCase } from './application/use-case/me.usecse';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';
import { IHASH_SERVICE } from 'src/common/constant';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    MeUseCase,
    JwtStrategy,
    {
      provide: REPOSITORY_TOKEN.AUTH,
      useClass: PrismaAuthRepository,
    },
    {
      provide: IHASH_SERVICE,
      useClass: BcryptHashService,
    },
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
