import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import * as dotenv from 'dotenv';
dotenv.config();

export class WebSocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    server.listen(process.env.WEBSOCKET_PORT);
  
    return server;
  }
}
