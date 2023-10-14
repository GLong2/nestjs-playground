import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): Server {
    const server = super.createIOServer(port, options);
    const pubClient = createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
    const subClient = pubClient.duplicate();

    const redisAdapter = createAdapter({ pubClient, subClient });
    server.adapter(redisAdapter);
    return server;
  }
}
