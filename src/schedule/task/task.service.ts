import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TaskServiceLogger') private readonly logger: LoggerService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.addCronJob();
  }

  addCronJob() {
    const name = 'cronSample';

    const job = new CronJob(`* * * * * *`, () => {
      this.logger.warn(`run! ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    // this.schedulerRegistry.getCronJob(name).start();

    this.logger.warn(`job ${name} added!`);
  }

  // @Cron('* * * * * *', { name: 'cronTask' })
  // // @Cron(new Date(Date.now() + 3 * 1000))
  // // @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_1AM)
  // handleCron() {
  //   this.logger.log('Task Called');
  // }

  // @Interval('intervalTask', 3000)
  // handleInterval() {
  //   this.logger.log('Task Called by Interval');
  // }

  // @Timeout('timeoutTask', 5000)
  // handleTimeout() {
  //   this.logger.log('Task Called by Timeout');
  // }
}
