import { Socket } from "socket.io";


export class User{

    private static compteurInstance = 0; //Compteur d'instance d'user
    private socket:Socket;
    private username:string;

    constructor(socket:Socket){
        User.compteurInstance = User.compteurInstance+1;
        this.socket = socket;
        this.username = "Player"+ User.compteurInstance;
    }

    __username():string{
        return this.username;
    }

    __socket():Socket{
        return this.socket;
    }
}