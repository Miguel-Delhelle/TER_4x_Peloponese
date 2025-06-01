import { Server, Socket as ServerSocket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";
import { IClientToServerEvents,IServerToClientEvents } from "../interfaces/network";
import { IUser } from "../interfaces/users";

export type ServerIO = Server<IClientToServerEvents, IServerToClientEvents>;
export type SocketIOServer = ServerSocket<IClientToServerEvents, IServerToClientEvents>;
export type SocketIOClient = ClientSocket<IServerToClientEvents, IClientToServerEvents>;
export type AnySocket = SocketIOServer|SocketIOClient;

export type GameStatus = 'waiting'|'playing'|'paused'|'finished';
export type ConsoleOutputType = 'log'|'warn'|'error'|'info';

export type ResponseRegister = {
  msg?: string,
  error?: string,
  user?: IUser,
  mail?: boolean,
  username?: boolean,
  password?: boolean,
}
export type ResponseLogin = {
  msg?: string,
  error?: string,
  user?: IUser,
  mail?: boolean,
  password?: boolean,
}

export enum FACTION {
   OTHER,
   SPARTA,
   ATHENS,
   THEBES,
   WILDERNESS
}