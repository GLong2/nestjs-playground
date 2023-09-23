import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    {
      provide: 'LoggingInterceptorLogger',
      useFactory: () => {
        const logger = new Logger('LoggingInterceptorLogger');
        return logger;
      },
    },
  ],
})
export class LoggingModule {}
