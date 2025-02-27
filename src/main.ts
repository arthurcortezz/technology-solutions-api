import * as morgan from 'morgan';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      validationError: { target: false },
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.use(cookieParser(process.env.APP_SECRET));

  app.use(compression());
  app.use(morgan('combined'));

  app.enableCors();
  await app.listen(process.env.APP_PORT, () => {
    Logger.log(
      `Listening at http://localhost:${process.env.APP_PORT}/${'api'}`,
    );
  });
}
bootstrap();
