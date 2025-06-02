import { FACTION } from '../types/common';
import { IGameRoom } from './network';
import { Socket } from 'socket.io';

export interface IUser {

  username: string;
  mail: string;

}

export interface IPlayer extends IUser {

  roomID: string|undefined;
  faction: FACTION;
  isReady: boolean;

}