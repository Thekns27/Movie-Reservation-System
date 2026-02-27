
import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get nodeEnv(): "development" {
    return this.configService.get<string>("NODE_ENV") as any;
  }

  get port(): number {
    return parseInt(this.configService.get<string>("PORT", "3000"), 10);
  }

  get databaseUrl(): string {
    return this.configService.get<string>("DATABASE_URL") || "";
  }

  get jwtSecret(): string {
    return this.configService.get<string>("JWT_SECRET") || "";
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>("JWT_EXPIRES_IN", "3600s");
  }

}



