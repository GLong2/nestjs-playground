import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { consoleTransport, fileTransport } from './winston.config';
import { WinstonModule } from 'nest-winston';
import { NotionModule } from './notion/notion.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotFoundExceptionFilter } from './filter/not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [consoleTransport, fileTransport],
    }),
  });

  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api'); // 전역 접두사 설정
  app.enableCors(); // CORS 활성화

  // "public" 폴더에서 정적 파일을 제공
  app.use('/', express.static('public'));

  const config = new DocumentBuilder().setTitle('Hong Ground API').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [NotionModule, UserModule, AuthModule],
  });
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
