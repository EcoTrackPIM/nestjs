import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './intercepteurs';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
   // Serve static files
   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/',
  });
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',

  });

  // Enable global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Serve static files
  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }
  app.use('/uploads', express.static(uploadDir));
  
  // Start the server
  const port = 3000;
  await app.listen(port); // <-- THIS WAS MISSING!
  console.log(`Server running on http://localhost:${port}`); // Optional: Log server start
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
});

