import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})

export class WalletGateway {
  @WebSocketServer()
  server: Server;

    @SubscribeMessage("join")
  handleJoin(client: any, userId: string) {
    client.join(userId);
  }

  notifyUser(userId: string, message: string){
    this.server.to(userId).emit('notification', message);
  }
}
