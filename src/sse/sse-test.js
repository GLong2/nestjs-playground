// sseClient.js
const EventSource = require('eventsource');

// SSE 서버에 연결
// const eventSource = new EventSource(`http://localhost:3000/api/notion/employee/sse`);
// const eventSource = new EventSource(`https://localhost/api/notion/employee/sse`);
const eventSource = new EventSource(`https://hong-ground.com/api/notion/employee/sse`);
// const eventSource = new EventSource(`http://localhost:3000/api/sse`);

// 서버로부터 메시지를 수신하는 이벤트 리스너
eventSource.onmessage = (event) => {
  // 수신한 데이터를 콘솔에 출력
  console.log('Received event:', event.data);

  // 특정 조건에 따라 SSE 스트림 연결 종료 (여기서는 예시로 간단한 조건을 사용)
  if (event.data.includes('close')) { // 문자열 조건을 사용하여 'close' 메시지 검사
    console.log('Closing SSE connection.');
    eventSource.close(); // SSE 스트림 연결 종료
  }
};

// 에러 발생 시 처리
eventSource.onerror = (error) => {
  console.error('EventSource failed:', error);
  eventSource.close(); // SSE 연결을 종료하여 추가적인 재연결 시도 방지
};
