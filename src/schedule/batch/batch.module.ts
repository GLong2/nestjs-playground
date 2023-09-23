import { Logger, Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BatchController],
  providers: [
    {
      provide: 'BatchControllerLogger',
      useFactory: () => {
        const logger = new Logger('BatchControllerLogger');
        return logger;
      },
    },
  ],
})
export class BatchModule {}
