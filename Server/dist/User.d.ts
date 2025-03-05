import { Socket } from "socket.io";
export declare class User {
    private static compteurInstance;
    private socket;
    private username;
    constructor(socket: Socket);
    __username(): string;
    __socket(): Socket;
}
