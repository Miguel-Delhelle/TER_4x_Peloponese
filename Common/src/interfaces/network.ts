import { AnySocket, GameStatus } from '../types/common';
import { ITile } from './map';
import { IPlayer } from './users';

export interface IGameRoom {

  get id(): string;
  get players(): IPlayer[];
  get status(): GameStatus;

  isFull(): boolean;
  allSockets(): AnySocket[];
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
  'room-host': (callback: (response: {ok: boolean, room?: IGameRoom}) => void) => void;
  'room-join': (id: string, callback: (response: {ok: boolean, room?: IGameRoom}) => void) => void;
  'room-leave': (id: string, callback: (response: {ok: boolean}) => void) => void;

  'ready': () => void;
  'move-player': (tile: ITile) => void;
  
}