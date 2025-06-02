import { Player } from "../entity/User/Player";
import { io } from "..";
import { Socket } from "socket.io";
import { ClassManipulation, GameStatus, IGameRoom, IPlayer, getDate } from "common";

export class GameRoom implements IGameRoom,ClassManipulation {

  private _id: string;
  private _players: Player[] = [];
  private _status: GameStatus = 'waiting';
  private _createdOn: Date = new Date();
  public static ROOM_MAXPLAYER: number = 3;

  constructor(id: string, host?: Player) {
    this._id = id;
    if(host)
      this.addPlayer(host);
  }

  get id(): string {return this._id;}

  get players(): Player[] {return this._players;}
  public addPlayer(player: Player): boolean {
    if (this.isFull()) return false;
    this._players.push(player);
    player.room = this;
    return true;
  }
  public removePlayer(player: Player): boolean {
    const pos: number = this.players.findIndex(p => p===player);
    if(pos<0) return false;
    this._players.splice(pos,1);
    return true;
  }

  get status(): GameStatus {return this._status;}
  set status(value: GameStatus) {this._status = value;}

  get createdOn(): Date {return this._createdOn;}

  public isFull(): boolean {
    return this.players.length>=GameRoom.ROOM_MAXPLAYER;
  }

  public allSockets(): Socket[] {
      let sockets: Socket[] = [];
      this.players.forEach(p => sockets.push(p.socket));
      return sockets;
  }

  public sendMessageTo(socket: Socket | Socket[], ev: string, ...args: any[]): void {
    if(socket instanceof Array)
      socket.forEach(s => s.emit(ev,args));
    else
      socket.emit(ev,args);
  }

  /*public sendMessageToAll(ev: string, ...args: any[]): void {
    
    
    io.to(this.id).emit(ev,args);
  } */

  public toString(): string {
    return "GameRoom("+
      [
        "id: "+this.id,
        "players: "+this.players,
        "status: "+this.status,
        "createdOn: "+getDate(this.createdOn),
      ].join(", ")+")"
    ;
  }

  public toJSON(includePrivate: boolean = false): Object {
    return includePrivate?
      {
        id: this.id,
        players: this.players,
        status: this.status,
        createdOn: this.createdOn,
      }:
      {
        id: this.id,
        players: this.players,
        status: this.status,
      };
  }

  public serialize(): Object {
    let players: IPlayer[] = [];
    this.players.forEach(p => players.push(p.serialize() as IPlayer));
    return {
      id: this.id,
      players: players,
      status: this.status,
    }
  }

}