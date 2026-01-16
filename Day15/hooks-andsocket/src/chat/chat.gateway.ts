import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-room')
  joinRoom(
    @MessageBody() data: { room: string, name: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    client.data.name = data.name;
    client.emit('System', `joined room: ${data.room}`);
  }

  @SubscribeMessage('send-message')
  sendMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ){
    this.server.to(data.room).emit('new-message', {
      message: data.message,
      sender: client.data.name,
    });
  }
}
