import { Injectable } from '@nestjs/common';
import { Registry, Gauge, Counter } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly registry: Registry;
  private readonly counter: Counter;
  private readonly httpRequestDurationMicroseconds: Gauge;

  constructor() {
    this.registry = new Registry();
    // collectDefaultMetrics({ register: this.registry });

    this.counter = new Counter({
      name: 'custom_counter',
      help: 'This is a custom counter example',
      registers: [this.registry],
    });

    this.httpRequestDurationMicroseconds = new Gauge({
      name: 'custom_http_request_duration_ms',
      help: 'Duration of HTTP requests in ms',
      labelNames: ['method', 'route', 'code'],
      registers: [this.registry],
    });
  }

  increaseCounter() {
    this.counter.inc(); // increment by 1
  }

  recordRequest(duration: number, method: string, route: string, code: number) {
    this.httpRequestDurationMicroseconds.labels(method, route, code.toString()).set(duration);
  }

  async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }
}
