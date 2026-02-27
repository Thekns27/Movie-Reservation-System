
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvSchema } from './common/config/env.schema';
import { PrismaModule } from './core/infrastructure/prisma/prisma.module';
import { AppConfigService } from './common/config/config.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService,
    AppConfigService,
    ConfigService
  ],
})
export class AppModule {}

