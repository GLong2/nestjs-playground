import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { consoleTransport, fileTransport } from './winston.config';
import { WinstonModule } from 'nest-winston';
import { NotionModule } from './notion/notion.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [consoleTransport, fileTransport],
    }),
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors(); // CORS 활성화

  // "public" 폴더에서 정적 파일을 제공
  app.use('/', express.static('public'));

  const config = new DocumentBuilder().setTitle('My API').setDescription('My API description').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [NotionModule, AuthModule, UserModule],
  });
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
