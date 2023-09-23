import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionController } from './notion/notion.controller';
import { NotionService } from './notion/notion.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [],
      isGlobal: true,
    }),
  ],
  controllers: [NotionController],
  providers: [NotionService, Logger],
})
export class AppModule {}
