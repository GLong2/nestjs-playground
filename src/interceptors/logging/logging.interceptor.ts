/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, Inject, Injectable, LoggerService, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('LoggingInterceptorLogger') private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context.getArgByIndex(0);
    this.logger.log(`Request to ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap((data) => {
          // this.logger.log(`Response from ${method} ${url} \n response: ${JSON.stringify(data)}`);
          return;
        })
      );
  }
}
