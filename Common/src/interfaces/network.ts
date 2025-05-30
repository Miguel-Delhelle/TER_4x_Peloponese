import { AnySocket, GameStatus } from '../types/common';
import { ITile } from './map';
import { IPlayer } from './users';

export interface IGameRoom {
  
  id: string;
  players: IPlayer[];
  status: GameStatus;
  createdOn: Date;

  isFull(): boolean;
  allSockets(): AnySocket[];
  addPlayer(player: IPlayer): number|Error;
  sendMessageToAll(ev: string, ...args: any[]): void;
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
  
  'join-room': (roomId: string, playerName: string) => void;
  'leave-room': () => void;
  'ready': () => void;
  'move-player': (tile: ITile) => void;
  
}