import { Logger, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    TaskService,
    {
      provide: 'TaskServiceLogger',
      useFactory: () => {
        const logger = new Logger('TaskServiceLogger');
        return logger;
      },
    },
  ],
})
export class TaskModule {}
