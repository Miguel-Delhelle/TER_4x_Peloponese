import { FACTION, IPlayer, IGameRoom, ClassManipulation } from "common";
import { GameRoom } from "../../socket/GameRoom";
import { Socket } from "socket.io";
import { User } from "./User";


export class Player extends User implements IPlayer,ClassManipulation {

  private _socket: Socket;
  private _room: GameRoom;
  private _isReady: boolean = false;
  private _faction: FACTION = FACTION.OTHER;
  private _from: User;

  constructor(from: User, socket: Socket) {
    super(from.mail, from.username);
    this._from = from;
    this._socket = socket;
    Object.assign(this, from);
  }

  get socket(): Socket {return this._socket;}

  get room(): GameRoom {return this._room;}
  set room(room: GameRoom) {this._room = room;}

  get roomID(): string|undefined {return this._room?.id;}

  get isReady(): boolean {return this._isReady;}
  set isReady(value: boolean) {this._isReady = value;}

  get faction(): FACTION {return this._faction;}
  set faction(faction: FACTION) {this._faction = faction;}

  public toString(): string {
    const user: string = this._from.toString();
    return "Player("+
      [
        user,
        "socket: "+this.socket,
        "room: "+this.room,
        "isReady: "+this.isReady,
        "faction: "+this.faction,
      ].join(", ")+")"
    ;
  }

  public toJSON(includePrivate: boolean = false): Object {
    const user: Object = this._from.toJSON(includePrivate);
    return {
      ...user,
      socket: this.socket,
      room: this.room,
      isReady: this.isReady,
      faction: this.faction,
    };
  }

  public serialize(): Object {
    const user: Object = this._from.serialize();
    return {
      ...user,
      roomID: this.roomID,
      faction: this.faction,
      isReady: this.isReady,
    }
  }

}