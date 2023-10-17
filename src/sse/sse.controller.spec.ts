import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';
import * as EventSource from 'eventsource';

describe('SseController', () => {
  let app: INestApplication;
  const port = 3000; // 테스트 서버의 포트를 지정합니다.
  const dates: Date[] = [];

  beforeAll(async () => {
    // Datetime을 저장하는 array를 생성합니다.
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SseController],
      providers: [SseService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(port); // 실제 네트워크 포트에서 애플리케이션을 실행합니다.
  });

  it('should connect and receive SSE events', (done) => {
    // EventSource를 사용하여 SSE 서버에 연결
    const eventSource = new EventSource(`http://localhost:${port}/sse`);

    // 이벤트 리스너 설정
    eventSource.onmessage = (event) => {
      expect(event.data).toBeDefined();
      dates.push(event.data);
      if (dates.length === 3) {
        eventSource.close(); // 테스트 완료 후 SSE 스트림 연결 종료
        done();
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      done(err);
    };
  });

  afterAll(async () => {
    console.log(dates);
    await app.close();
  });
});
