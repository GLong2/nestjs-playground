import { Logger, Module } from '@nestjs/common';
import { NotionController } from './notion.controller';
import { NotionService } from './notion.service';

@Module({
  controllers: [NotionController],
  providers: [
    NotionService,
    {
      provide: 'NotionServiceLogger',
      useFactory: () => {
        const logger = new Logger('NotionServiceLogger');
        return logger;
      },
    },
  ],
})
export class NotionModule {}
