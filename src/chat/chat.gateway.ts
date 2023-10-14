import { Logger } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ path: '/api/socket.io' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log(`Init ${server}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.logger.log(`Client ${client.id} sent: ${payload}`);
    this.server.emit('msgToClient', payload); // 모든 클라이언트에게 메시지를 전달합니다.
  }
}
