import { Socket } from "socket.io";
import { User } from "./User";
import { io } from "../..";
import { SocketIO } from "../../socket/SocketIo";

export class UserConnected extends User {

  private _socket: SocketIO;

  constructor(user:User,socket:SocketIO) {
    super(user._mail,user._username,undefined,user._id);
    this._socket = socket;
    this._socket.player = this;
    Object.assign(this, user);
  }

  get socket(): SocketIO {return this._socket;}

  public static fromUser(user: User, socket: SocketIO): UserConnected {
    return new UserConnected(user, socket);
  }

}