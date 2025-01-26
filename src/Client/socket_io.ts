import {io} from "socket.io-client";

const socket = io();

socket.on('connect', () => {
    console.log('Connecté au serveur avec ID :', socket.id);
    socket.emit('message', 'Bonjour serveur');
});

socket.on('message', (data:any) => {
    console.log('Message reçu :', data);
});