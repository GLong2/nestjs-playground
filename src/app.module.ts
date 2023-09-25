import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from './interceptors/logging/logging.module';
import { NotionModule } from './notion/notion.module';
import { BatchModule } from './schedule/batch/batch.module';
import { TaskModule } from './schedule/task/task.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize 데이터베이스 스키마를 자동으로 생성하거나 업데이트하는 역할을 하지만,
      // 일반적으로 기존의 데이터를 삭제하지는 않음
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
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
  providers: [],
})
export class AppModule {}
