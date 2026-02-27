import "./common/config/instrument";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { transform } from "zod";
import { AppConfigService } from "./common/config/config.service";
import { setupSwagger } from "./common/swagger/swagger.config";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });
  app.enableCors({origin:"*"})
  const configService = app.get(AppConfigService);

  // app.useGlobalFilters(new HttpExceptionFilter());

  // app.useGlobalInterceptors(
  //   new LoggingInterceptor(),
  //   new TimeoutInterceptor(10000),
  //   new ResponseInterceptor()
  // );

  // app.useGlobalPipes(
  //   new ValidationPipe(),
  //   new SanitizePipe(),
  // );

  if (configService.nodeEnv === "development") {
    setupSwagger(app);
  }


  const port = configService.port;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:8091`);
  if (configService.nodeEnv === "development") {
    console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
  }
}
bootstrap();

