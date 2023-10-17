import { Controller, Get, Sse } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}

  @Get()
  @Sse()
  sse(): Observable<any> {
    return this.sseService.connect();
  }
}
