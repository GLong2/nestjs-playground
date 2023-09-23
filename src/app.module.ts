import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from './interceptors/logging/logging.module';
import { NotionModule } from './notion/notion.module';
import { BatchModule } from './batch/batch.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
