import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from './interceptors/logging/logging.module';
import { NotionModule } from './notion/notion.module';
import { BatchModule } from './schedule/batch/batch.module';
import { TaskModule } from './schedule/task/task.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      port: 3306,
      // docker-compose.yml 파일에서 MariaDB 서비스의 이름이 database라면, NestJS 애플리케이션의 데이터베이스 연결 설정에서 호스트를 127.0.0.1 대신 database로 지정
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize 데이터베이스 스키마를 자동으로 생성하거나 업데이트하는 역할을 하지만,
      // 일반적으로 기존의 데이터를 삭제하지는 않음
      synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
    }),
    LoggingModule,
    NotionModule,
    BatchModule,
    TaskModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
