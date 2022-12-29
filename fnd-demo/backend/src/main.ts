// main.ts

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function main() {
  const mainLogger = new Logger('Main');
  const config = configuration();
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(cookieParser(config.cookieSecret));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(config.port).then(() => {
    mainLogger.verbose(
      `FND-Demo server listening on ${config.domain}:${config.port}`,
    );
  });
}
main();
