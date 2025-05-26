import { UserConnected } from "./UserConnected";
import { FACTION } from "../../MapModel/EFaction";
import { GameRoom } from "../../socket/GameRoom";


export class Player extends UserConnected {

  private _faction: FACTION;

  constructor(user: UserConnected) {
    super(user,user.socket);
    user.socket.player = this;
    Object.assign(this, user);
  }

  get faction(): FACTION {return this._faction;}
  set faction(faction: FACTION) {this._faction = faction;}

  public static fromConnectedUser(user: UserConnected): Player {
    return new Player(user);
  }

}