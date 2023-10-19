import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrometheusService } from '../prometheus/prometheus.service';

@Injectable()
export class PrometheusMiddleware implements NestMiddleware {
  constructor(private readonly prometheusService: PrometheusService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    res.on('finish', () => {
      // 요청이 완료되면 걸린 시간을 측정합니다.
      const diff = process.hrtime(start);
      const duration = diff[0] * 1e3 + diff[1] * 1e-6; // 밀리초로 변환

      // 요청 메서드, 경로, 상태 코드를 가져옵니다.
      const { method } = req;
      const route = req.originalUrl || req.url;
      const { statusCode: code } = res;

      // 메트릭을 기록합니다.
      this.prometheusService.recordRequest(duration, method, route, code);
    });

    next();
  }
}
