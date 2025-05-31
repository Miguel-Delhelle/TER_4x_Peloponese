import { Server, Socket } from "socket.io";
import { IClientToServerEvents,IServerToClientEvents } from "../interfaces/network";

export type GameStatus = 'waiting'|'playing'|'paused'|'finished';
export type AnySocket = SocketIOClient.Socket|Socket;