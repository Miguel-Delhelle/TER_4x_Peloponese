// chargement des modules node avec require()
import path from 'path';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
//const querystring = require('querystring');
//const bcrypt = require("bcrypt");
//var mysql = require('mysql');
/*
var fs = require("fs");
app.listen(8888);
app.use(cors());
app.use(express.json());
*/
//const httpServer 
const app = express();
app.listen(8888);
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const __fileName = fileURLToPath(import.meta.url);
const rootDir = path.dirname(__fileName);
console.log("Serveur prêt");
app.get('/', function (req, response) {
    response.sendFile('./index.html', { root: rootDir });
});
app.get('/client/:nom', function (req, response) {
    response.sendFile('./Client/' + req.params.nom, { root: rootDir });
});
app.get('/:nom', function (req, response) {
    response.sendFile('./' + req.params.nom, { root: rootDir });
});
app.get('/src', function (req, response) {
    response.sendFile('./' + req.params.nom, { root: rootDir });
});
app.use('/src/Client', express.static(path.resolve(rootDir, '..', 'src', 'Client')));
//# sourceMappingURL=server.js.map