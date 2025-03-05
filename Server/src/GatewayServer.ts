import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody,ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Active le CORS pour le client
export class GatewayServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialisé');
  }
  // Lorsqu'un client se connecte
  handleConnection(client: Socket) {
    console.log(`Client connecté: ${client.id}`);
  }

  // Lorsqu'un client se déconnecte
  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté: ${client.id}`);
  }

  // Gestion d'un message envoyé par un client
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    console.log(`Message reçu de ${client.id}: ${message}`);
    // Diffuse le message à tous les clients connectés
    this.server.emit('message', { clientId: client.id, message });
  }
}
