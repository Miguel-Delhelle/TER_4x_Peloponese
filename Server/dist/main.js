"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = __importDefault(require("path"));
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const clientDistDir = path_1.default.resolve(__dirname, '..', '..', 'Client', 'dist', 'client', 'browser');
bootServ();
async function bootServ() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    const io = app.getHttpAdapter().getInstance();
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    io.on('connection', (socket) => {
        console.log('Client connecté');
        socket.emit('message', 'Bienvenue sur le serveur Socket.IO');
        socket.on('clientMessage', (data) => {
            console.log('Message du client:', data);
            socket.emit('message', 'Message reçu par le serveur');
        });
        socket.on('disconnect', () => {
            console.log('Client déconnecté');
        });
    });
}
//# sourceMappingURL=main.js.map