"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// chargement des modules node avec require()
const path_1 = __importDefault(require("path"));
const cors = require("cors");
var express = require("express");
const url = require('url');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
//const querystring = require('querystring');
//const bcrypt = require("bcrypt");
//var mysql = require('mysql');
var fs = require("fs");
app.listen(8888);
app.use(cors());
app.use(express.json());
//const httpServer 
const httpServer = http.createServer(app);
console.log("Serveur prêt");
app.get('/', function (req, response) {
    response.sendFile('./index.html', { root: __dirname });
});
app.get('/client/:nom', function (req, response) {
    response.sendFile('./Client/' + req.params.nom, { root: __dirname });
});
app.get('/:nom', function (req, response) {
    response.sendFile('./' + req.params.nom, { root: __dirname });
});
app.get('/src', function (req, response) {
    response.sendFile('./' + req.params.nom, { root: __dirname });
});
app.use('/src/Client', express.static(path_1.default.join(__dirname, '../src/Client'))); // Sert le dossier src pour accéder aux fichiers TypeScript
//# sourceMappingURL=server.js.map