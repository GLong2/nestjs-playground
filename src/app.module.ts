import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from './interceptors/logging/logging.module';
import { NotionModule } from './notion/notion.module';
import { BatchModule } from './schedule/batch/batch.module';
import { TaskModule } from './schedule/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [],
      isGlobal: true,
    }),
    LoggingModule,
    NotionModule,
    BatchModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
