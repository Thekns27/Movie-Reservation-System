
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvSchema } from './common/config/env.schema';
import { PrismaModule } from './core/infrastructure/prisma/prisma.module';
import { AppConfigService } from './common/config/config.service';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [PrismaModule,UserModule,AuthModule],
  controllers: [AppController],
  providers: [AppService,
    AppConfigService,
    ConfigService
  ],
})
export class AppModule {}

