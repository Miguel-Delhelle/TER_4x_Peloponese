import { Socket } from "socket.io";
import { User } from "./User";

export class UserManager{
  public listSocket:Map<Socket,User> = new Map<Socket,User>;
  
  constructor(){
  }

  addUser(user:User){
    this.listSocket.set(user.__socket(),user);
  }

  removeUser(socket:Socket){
    this.listSocket.delete(socket);
  }

  getUser(socket:Socket):User{
    let user:User = this.listSocket.get(socket)!;
    if (!user == null){
        throw new Error ("L'utilisateur n'existe pas");
    }
    else{
        return user;
    }
  }

  getUsername(socket:Socket):string{

    return this.getUser(socket).__username();
  }
  size(){
    return this.listSocket.size;
  }

}