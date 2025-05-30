import { FACTION } from '../utils/EFaction';
import { IGameRoom } from './network';
import { AnySocket } from "../types/common";

export interface IUser {

  id: number;
  mail: string;
  username: string;
  hashedPassword?: string;

  toString(): string;

}

export interface IPlayer extends IUser {

  socket: AnySocket;
  room: IGameRoom;
  isReady: boolean;
  faction: FACTION;

  initListener(): void;

}