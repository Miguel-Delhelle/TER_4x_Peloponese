import { AnySocket, GameStatus } from '../types/common';
import { ITile } from './map';
import { IPlayer } from './users';

export interface IGameRoom {

  id: string;
  players: IPlayer[];
  status: GameStatus;

  sendMessageTo(socket: AnySocket|AnySocket[], ev: string, ...args: any[]): void;

}

export interface IServerToClientEvents {
  
  'room-updated': (room: IGameRoom) => void;
  'player-joined': (player: IPlayer) => void;
  'player-left': (player: IPlayer) => void;
  'game-started': (room: IGameRoom) => void;
  'error': (message: string) => void;
  
}

export interface IClientToServerEvents {
  
  'login': (mail: string, callback: (response: {ok: boolean, user?: IPlayer, error?: string}) => void) => void;
  'room-host': (callback: (response: {ok: boolean, room?: IGameRoom, error?: string}) => void) => void;
  'room-join': (id: string, callback: (response: {ok: boolean, room?: IGameRoom, error?: string}) => void) => void;
  'room-leave': (id: string, callback: (response: {ok: boolean, error?: string}) => void) => void;

  'ready': () => void;
  'move-player': (tile: ITile) => void;
  
}