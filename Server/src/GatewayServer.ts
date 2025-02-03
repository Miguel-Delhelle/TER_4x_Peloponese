import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketServerOptions } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Active le CORS pour le client
export class GatewayServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialisé');
  }

  handleConnection(client: Socket) {
    console.log(`Client connecté: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    console.log('Message reçu:', payload);
    this.server.emit('message', payload);
  }
}
