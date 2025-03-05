import { Socket } from "socket.io";
import { User } from "./User";
export declare class UserManager {
    listSocket: Map<Socket, User>;
    constructor();
    addUser(user: User): void;
    removeUser(socket: Socket): void;
    getUser(socket: Socket): User;
    getUsername(socket: Socket): string;
    size(): number;
}
