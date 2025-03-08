"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayServer = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const User_1 = require("./User/User");
const main_1 = require("./main");
let GatewayServer = class GatewayServer {
    afterInit(server) {
        console.log('WebSocket initialisé');
    }
    handleConnection(client) {
        let newUser = new User_1.User(client);
        main_1.mainUserManager.addUser(newUser);
        console.log(`Client connecté: ${main_1.mainUserManager.getUsername(client)}`);
    }
    handleDisconnect(client) {
        console.log(`Client déconnecté: ${main_1.mainUserManager.getUsername(client)}`);
        main_1.mainUserManager.listSocket.delete(client);
    }
    handleMessage(message, client) {
        console.log(`Message reçu de ${main_1.mainUserManager.getUsername(client)}: ${message}`);
        this.server.emit('message', { clientId: main_1.mainUserManager.getUsername(client), message });
    }
};
exports.GatewayServer = GatewayServer;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GatewayServer.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayServer.prototype, "handleMessage", null);
exports.GatewayServer = GatewayServer = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], GatewayServer);
//# sourceMappingURL=GatewayServer.js.map