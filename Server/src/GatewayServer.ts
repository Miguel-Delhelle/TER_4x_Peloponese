import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody,ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from './User';

@WebSocketGateway({ cors: true }) // Active le CORS pour le client
export class GatewayServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  listSocket:Map<Socket,User> = new Map<Socket,User>;
  listUser:User[] = [];

  afterInit(server: Server) {
    console.log('WebSocket initialisé');
  }
  // Lorsqu'un client se connecte
  handleConnection(client: Socket) {
    let newUser = new User(client);
    this.listUser.push(newUser);
    this.listSocket.set(client,newUser);
    console.log(`Client connecté: ${newUser.__username()}`);
  }

  // Lorsqu'un client se déconnecte
  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté: ${this.listSocket.get(client)!.__username()}`);
  }

  // Gestion d'un message envoyé par un client
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    console.log(`Message reçu de ${this.listSocket.get(client)!.__username()}: ${message}`);
    // Diffuse le message à tous les clients connectés
    
    this.server.emit('message', { clientId: this.listSocket.get(client)?.__username(), message });
  }
}
