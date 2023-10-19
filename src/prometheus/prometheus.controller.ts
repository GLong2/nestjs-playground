import { Controller, Get } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

@Controller('metrics')
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get('increase-counter')
  increaseCounter(): string {
    this.prometheusService.increaseCounter();
    return 'Counter increased!';
  }

  @Get()
  async getMetrics(): Promise<string> {
    return await this.prometheusService.getMetrics();
  }
}
