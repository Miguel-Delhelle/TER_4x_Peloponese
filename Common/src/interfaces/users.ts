import { FACTION } from '../types/common';
import { IGameRoom } from './network';
import { Socket } from 'socket.io';

export interface IUser {

  get username(): string;
  get mail(): string;

}

export interface IPlayer extends IUser {

  get socket(): Socket;
  get room(): IGameRoom;
  get faction(): FACTION;
  get isReady(): boolean;
  set isReady(value: boolean);
  set faction(faction: FACTION);

}