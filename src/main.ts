import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './intercepteurs';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.useGlobalInterceptors(new LoggingInterceptor());
  const uploadDir = join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(join(process.cwd(), 'uploads'))); 
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }
  await app.listen(3000);
  //await app.init()
}
bootstrap();
