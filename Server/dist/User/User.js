"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const main_1 = require("../main");
class User {
    constructor(socket) {
        this.username = "";
        this.socket = socket;
        this.username = "Player" + main_1.mainUserManager.size();
    }
    __username() {
        return this.username;
    }
    __socket() {
        return this.socket;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map