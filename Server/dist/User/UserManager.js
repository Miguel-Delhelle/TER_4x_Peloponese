"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor() {
        this.listSocket = new Map;
    }
    addUser(user) {
        this.listSocket.set(user.__socket(), user);
    }
    removeUser(socket) {
        this.listSocket.delete(socket);
    }
    getUser(socket) {
        let user = this.listSocket.get(socket);
        if (!user == null) {
            throw new Error("L'utilisateur n'existe pas");
        }
        else {
            return user;
        }
    }
    getUsername(socket) {
        return this.getUser(socket).__username();
    }
    size() {
        return this.listSocket.size;
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=UserManager.js.map