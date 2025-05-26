import { Player } from "../entity/User/Player";
import { io } from "..";
import { SocketIO } from "./SocketIo";

export class GameRoom {

  private _id: string;
  private _players: Player[] = [];
  private static ROOM_MAXPLAYER: number = 3;

  constructor(id: string, host: Player) {
    this._id = id;
    this.addPlayer(host);
  }

  get id(): string {return this._id;}

  get players(): Player[] {return this._players;}

  public addPlayer(player: Player): number|Error {
    if (this.players.length===GameRoom.ROOM_MAXPLAYER) throw new Error(`Room ${this.id} is already full`);
    this._players.push(player);
    this.initListener(player.socket);
    return this._players.length-1;
  }

  public sendMessageToAll(ev: string, ...args: any[]): void {
    io.to(this.id).emit(ev,args);
  }

  private initListener(socket: SocketIO): void {}

}