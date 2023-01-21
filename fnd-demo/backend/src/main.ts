// main.ts

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as AWS from 'aws-sdk';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function main() {
  const mainLogger = new Logger('Main');
  const config = configuration();
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(config.cookieSecret));
  app.enableCors({
    origin: `${config.ssl}://${config.domain}`,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  AWS.config.update({ credentials: config.awsCredentials });

  await app.listen(config.port).then(() => {
    mainLogger.verbose(
      `FND-Demo server listening on [${config.ssl}://${config.domain}:${config.port}]`,
    );
  });
}
main();
