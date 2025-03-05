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
const User_1 = require("./User");
let GatewayServer = class GatewayServer {
    constructor() {
        this.listSocket = new Map;
        this.listUser = [];
    }
    afterInit(server) {
        console.log('WebSocket initialisé');
    }
    handleConnection(client) {
        let newUser = new User_1.User(client);
        this.listUser.push(newUser);
        this.listSocket.set(client, newUser);
        console.log(`Client connecté: ${newUser.__username()}`);
    }
    handleDisconnect(client) {
        console.log(`Client déconnecté: ${this.listSocket.get(client).__username()}`);
    }
    handleMessage(message, client) {
        console.log(`Message reçu de ${this.listSocket.get(client).__username()}: ${message}`);
        this.server.emit('message', { clientId: this.listSocket.get(client)?.__username(), message });
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