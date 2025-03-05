import { Socket } from "socket.io";
import { mainUserManager } from "src/main";

export class User{

    private socket:Socket;
    private username:string ="";

    constructor(socket:Socket){
        this.socket = socket;
        this.username = "Player"+ mainUserManager.size();
    }

    __username():string{
        return this.username;
    }

    __socket():Socket{
        return this.socket;
    }
}