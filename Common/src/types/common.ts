import { Socket } from "socket.io";


export type GameStatus = 'waiting'|'playing'|'paused'|'finished';
export type AnySocket = SocketIOClient.Socket|Socket;