// main.ts

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function main() {
  const config = configuration();
  const mainLogger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(config.port).then(() => {
    mainLogger.verbose(
      `FND-Demo server listening on ${config.domain}:${config.port}`,
    );
  });
}
main();
