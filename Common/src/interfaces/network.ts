import { AnySocket, GameStatus } from '../types/common';
import { ITile } from './map';
import { IPlayer } from './users';

export interface IGameRoom {

  get id(): string;
  get players(): IPlayer[];
  get status(): GameStatus;

  isFull(): boolean;
  allSockets(): AnySocket[];
  addPlayer(player: IPlayer): number|Error;
  //sendMessageToAll(ev: string, ...args: any[]): void;
  sendMessageTo(socket: AnySocket|AnySocket[], ev: string, ...args: any[]): void;

}

export interface IServerToClientEvents {
  
  'room-updated': (room: IGameRoom) => void;
  'player-joined': (player: IPlayer) => void;
  'player-left': (playerId: string) => void;
  'game-started': (room: IGameRoom) => void;
  'error': (message: string) => void;
  
}

export interface IClientToServerEvents {
  
  'login': (id: number) => void;
  'room-host': () => IGameRoom;
  'room-join': (id: string, player: IPlayer) => IGameRoom;
  'room-leave': (id: string, player: IPlayer) => boolean;

  'ready': () => void;
  'move-player': (tile: ITile) => void;
  
}