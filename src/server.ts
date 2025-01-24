// chargement des modules node avec require()
console.log("Serveur prêt");
const cors = require("cors");
var express = require("express");
const url = require('url');
//const querystring = require('querystring');
//const bcrypt = require("bcrypt");
//var mysql = require('mysql');

// con pour connexion
/*var con = mysql.createConnection({
    host: "localhost",
    user: "projetweb",
    password: "Password1234_",
    database: "PROJET_WEB"
}); */

//fs pour file system
var fs = require("fs");

// express démarre le serveur
var app = express();
app.listen(8888);
app.use(cors());
app.use(express.json());


app.get('/', function (req:any, response:any) {
    response.sendFile('index.html', { root: __dirname});
});