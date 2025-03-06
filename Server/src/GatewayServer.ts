import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody,ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from './User/User';
import { mainUserManager } from './main';

@WebSocketGateway({ cors: true })
export class GatewayServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  //listUser:User[] = [];

  afterInit(server: Server) {
    console.log('WebSocket initialisé');
  }
  // Lorsqu'un client se connecte
  handleConnection(client: Socket) {
    let newUser = new User(client);
    mainUserManager.addUser(newUser);
    console.log(`Client connecté: ${mainUserManager.getUsername(client)}`);
  }

  // Lorsqu'un client se déconnecte  
  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté: ${mainUserManager.getUsername(client)}`);
    mainUserManager.listSocket.delete(client);
  }

  // Gestion d'un message envoyé par un client
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    console.log(`Message reçu de ${mainUserManager.getUsername(client)}: ${message}`);    

    this.server.emit('message', { clientId: mainUserManager.getUsername(client), message });
  }
}
