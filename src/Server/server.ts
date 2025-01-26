import path from 'path';
import cors from 'cors';
import express from 'express';
import http from 'http';
import {Server} from "socket.io";
import { fileURLToPath } from 'url';

const app = express();
app.listen(8888);
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const __fileName:string = fileURLToPath(import.meta.url);
const rootDir:string = path.dirname(__fileName);
const clientDistDir:any = path.resolve(rootDir,'..','Client');

console.log("Serveur prêt");


io.on('connection', (socket) => {
    console.log('Client connecté');

    // Émettre un message au client
    socket.emit('message', 'Bienvenue sur le serveur Socket.IO');

    // Écouter les messages du client
    socket.on('clientMessage', (data) => {
        console.log('Message du client:', data);
        socket.emit('message', 'Message reçu par le serveur');
    });

    socket.on('disconnect', () => {
        console.log('Client déconnecté');
    });
});


app.get('/', function (req:any, response:any) {
    response.sendFile(path.resolve(clientDistDir,'index.html'));
});

app.get('/:nom', function(req:any, response:any) {
    response.sendFile(path.resolve(clientDistDir,req.params.nom));
});

/*
app.get('/src', function(req:any, response:any) {
    response.sendFile('./'+req.params.nom, {root: rootDir});
}); */

//app.use('/dist/Client', express.static(path.resolve(rootDir,'..','Client'))); 
app.use('/src/Client', express.static(path.resolve(rootDir,'..','..','src','Client'))); 