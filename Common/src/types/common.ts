import { Socket } from "socket.io";


export type GameStatus = 'waiting'|'playing'|'paused'|'finished';
export type ConsoleOutputType = 'log'|'warn'|'error'|'info';

export type AnySocket = SocketIOClient.Socket|Socket;

export enum FACTION {
   OTHER,
   SPARTA,
   ATHENS,
   THEBES,
   WILDERNESS
}