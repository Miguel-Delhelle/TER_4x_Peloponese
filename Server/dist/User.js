"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(socket) {
        User.compteurInstance = User.compteurInstance + 1;
        this.socket = socket;
        this.username = "Player" + User.compteurInstance;
    }
    __username() {
        return this.username;
    }
    __socket() {
        return this.socket;
    }
}
exports.User = User;
User.compteurInstance = 0;
//# sourceMappingURL=User.js.map