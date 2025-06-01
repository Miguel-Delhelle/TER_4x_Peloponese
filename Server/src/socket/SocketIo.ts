import { Socket } from "socket.io";
import { Player } from "../entity/User/Player";
import { GameRoom } from "./GameRoom";
import { FACTION } from "../../../Common/src/utils/EFaction";
import { UserConnected } from "../entity/User/UserConnected";


export class SocketIO {
  private _socket: Socket;
  private _player: Player|UserConnected;
  private _room: GameRoom;

  constructor(socket: Socket) {
    this._socket = socket;
  }

  get socket(): Socket {return this._socket;}

  get player(): Player|UserConnected {return this._player;}
  set player(player: Player|UserConnected) {this._player = player;}

  get room(): GameRoom {return this._room;}
  set room(room: GameRoom) {this._room = room;}

  get faction(): FACTION {return (this.player instanceof Player)?this.player.faction:null;}

  get username(): string {return this.player._username;}
}