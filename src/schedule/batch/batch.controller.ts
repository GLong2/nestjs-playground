import { Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchController {
  constructor(
    @Inject('BatchControllerLogger') private readonly logger: LoggerService,
    private scheduler: SchedulerRegistry,
  ) {}

  @Post('/start-sample')
  start() {
    const job = this.scheduler.getCronJob('cronSample');

    job.start();
    this.logger.log('start!! ', job.lastDate());

    this.logger.log(job.nextDates(3));
  }

  @Post('/stop-sample')
  stop() {
    const job = this.scheduler.getCronJob('cronSample');

    job.stop();
    this.logger.log('stopped!! ', job.lastDate());
  }
}
