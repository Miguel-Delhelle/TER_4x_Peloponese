import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import path from 'path';
//import cors from 'cors';
//import * as express from 'express';
//import http from 'http';
//import {Server} from "socket.io";
//import { fileURLToPath } from 'url';
import { IoAdapter } from '@nestjs/platform-socket.io';




//const rootDir:string = path.dirname(__filename);

const clientDistDir:any = path.resolve(__dirname, '..', '..', 'Client', 'dist','client','browser');

bootServ();
async function bootServ() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));

  //app.use(clientDistDir); 

  // Route pour servir l'index.html pour toutes les autres routes


  // Configurer CORS pour Socket.io
  const io = app.getHttpAdapter().getInstance();
  //io.origins('*:*');

  // Écouter sur le port spécifié
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);



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



}
