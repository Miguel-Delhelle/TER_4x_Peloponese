import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from './User';
export declare class GatewayServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    listSocket: Map<Socket, User>;
    listUser: User[];
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(message: string, client: Socket): void;
}
