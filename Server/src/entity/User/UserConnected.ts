import { Socket } from "socket.io";
import { User } from "./User";
import { io } from "../..";

export class UserConnected extends User{

   private socket:any;

   constructor(user:User,socket:Socket){
      super(user._mail,user._username,undefined,user._id);
      this.socket;
   }

   public getSocket():Socket{
      
      return this.socket;
      //return io.sockets.sockets.get(this.socketId);
   }

}