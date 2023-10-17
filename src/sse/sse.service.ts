// sse.service.ts
import { Injectable } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SseService {
  connect(): Observable<any> {
    return interval(1000).pipe(map((_) => ({ data: new Date() }))); // 각 초마다 현재 시간을 보냅니다.
  }
}
