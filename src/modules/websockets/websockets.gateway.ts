import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('messageToAdmin')
  handleMessageToAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    console.log(`Message from client ${client.id}: ${message}`);

    this.server.to('admin_room').emit('messageFromClient', {
      clientId: client.id,
      message,
    });
  }

  @SubscribeMessage('messageToClient')
  handleMessageToClient(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { clientId: string; message: string },
  ) {
    const { clientId, message } = data;
    console.log(`Admin sending message to client ${clientId}: ${message}`);

    this.server.to(`client_${clientId}`).emit('messageFromAdmin', {
      message,
    });
  }
}
