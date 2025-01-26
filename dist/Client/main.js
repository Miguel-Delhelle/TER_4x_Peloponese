"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)();
socket.on('connect', () => {
    console.log('Connecté au serveur avec ID :', socket.id);
    socket.emit('message', 'Bonjour serveur');
});
socket.on('message', (data) => {
    console.log('Message reçu :', data);
});
//# sourceMappingURL=main.js.map