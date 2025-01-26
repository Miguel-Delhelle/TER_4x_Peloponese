// chargement des modules node avec require()
import path from "path";

const cors = require("cors");
var express = require("express");
const url = require('url');
const http = require('http');
const {Server} = require('socket.io');
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

app.get('/', function (req:any, response:any) {
    response.sendFile('./index.html', { root: __dirname});
});
app.get('/client/:nom', function(req:any, response:any) {
    response.sendFile('./Client/'+req.params.nom, { root: __dirname});
});
app.get('/:nom', function(req:any, response:any) {
    response.sendFile('./'+req.params.nom, { root: __dirname});
});
app.get('/src', function(req:any, response:any) {
    response.sendFile('./'+req.params.nom, { root: __dirname});
});

app.use('/src/Client', express.static(path.join(__dirname, '../src/Client'))); // Sert le dossier src pour accéder aux fichiers TypeScript