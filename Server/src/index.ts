import "reflect-metadata";
import express from "express";
import path from "path";
import os from "os";
import { fileURLToPath } from 'url';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User/User"
import { Database } from "sqlite3";
import * as bcrypt from 'bcrypt';
import { RemoteSocket, Socket, Server as SocketIOServer } from 'socket.io';
import { createServer } from "http";
import { UserConnected } from "./entity/User/UserConnected";
import { DecorateAcknowledgementsWithMultipleResponses, DefaultEventsMap } from "socket.io/dist/typed-events";

export var listUsersConnected:Map<string,UserConnected> = new Map();

const app = express();
const port = "3000";

const server = createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


const db = new Database('greekAnatomic.sqlite');

AppDataSource.initialize().then(async () => {

    //console.log("Inserting a new user into the database...")
    //const user = new User("test@test.fr","testCoucou",await hashedPassword("k76"));
    //await AppDataSource.manager.save(user)
    //console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

}).catch(error => console.log(error))

app.get("/", (req, res) => {
  //res.send("Hello World!");
  res.sendFile(path.resolve(__dirname,"..","..","Client","dist","index.html"));
});

app.get("/coucou", (req,res)=> {
  res.status(200).json({
    areYouInTruth:"yes",
    whoAreYou:"My team enfin j'espère",
    ipAdress: os.hostname()
  })
})

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../../Client/dist")));


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



app.post('/register', async function(req,response){
  let mail:string = req.body.mail;
  let username:string = req.body.username;
  let password:string = req.body.password;

  let userRegister:User = new User(mail,username,await hashedPassword(password));

  await AppDataSource.manager.save(userRegister);

  response.status(200).json("Inscription réussi");
});

app.post('/login', async function(req,response) {
let mailReq = req.body.mail;
let password = req.body.password;

try {
  let userLogins = await AppDataSource.manager.findBy(User, {mail: mailReq});
  let userLogin = userLogins[0];

  let passwordOk:boolean = await verifyPassword(password, userLogin._hashedPassword);

  if (passwordOk){
    delete userLogin.hashedPassword;
    response.status(200).json(userLogin);
  }else{
    response.status(403).json({ error: "Mot de passe invalide"});
  }
  
} catch (error) {
  response.status(500).json({ error: "Erreur" });
}

});



async function hashedPassword(clearPassword:string):Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(clearPassword, salt);
  return hashedPassword;
};

async function verifyPassword(clearPassword, hashedPassword) {
try {
    const match = await bcrypt.compare(clearPassword, hashedPassword);
    return match; // Retourne true si les mots de passe correspondent, false sinon
} catch (error) {
    throw new Error('Erreur lors de la vérification du mot de passe');
}
}

// Web Socket

var hostedRooms: string[] = [];

function setRoomID(length: number = 8, alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
  let s: string = '';
  for (let i = 0; i<length; i++) {s+=alphabet.charAt(Math.floor(Math.random()*alphabet.length));}
  return s;
}

io.on("connection", (socket) => {


  // Note Miguel 13 Mai 23h45, Batiment 16, Capitale de l'informatique dans l'hérault.. enfin surtout de mon début d'absence de vie sociale
  // Initialisation de socket.io, si quelqu'un s'amuse à reprendre ça pour le reste du sprint normalement vous avez les idées de pourquoi j'ai fais comme celà

  //var dataSocketUser:{[socket: string]: number};
  // Ancienne sdd, remplacé par listUserConnected en haut

  // listUserConnected, prend en clé, le socket.id, et en valeur l'objet UserConnected qui hérite de User (et se construit avec)
  // Et un socket
  // L'idée est qu'un User peut se connecter et il est persévérant, l'insription reste une fois
  // Mais lorsqu'un socket se deconnecte on désinstancie UserConnected

  // A savoir pour tout le monde, je stock l'id du socket directement ici, j'ai eu des problèmes pour faire socket.id,
  // Pas trop compris pourquoi dans un premier temps, mais il semblerait que ça venait du faite que je n'initialiser pas mes SDD
  // Mais pas sûr, en tout cas j'ai l'impression que stocker la variable une fois avant fait du bien
  // Pour ceux qui travaillent sur le web Socket, pensait à toujours tout mettre dans des try catch
  // Surtout qu'il y a des scénario qui peuvent se passer en Dev qui font de la merde qui sont pas censé se passer en prod
  // Mais faut rendre cette partie la plus résiliente possible, tout de même, on peut pas la faire crash en permanence

  let idSocket = socket.id;


  // Envoyé au front après que la connexion est ok pour l'utilisateur (User) --> UserConnected, instancié à chaque socket
  // Si le user tartanpion se déconnecte il reste dans la base de donnée, mais le userConnected se deconnecte il est désinstancié

  socket.on("loginOk",async ({idUser}) => {
    try{
    let user:User = await AppDataSource.manager.findOneBy(User, {id: idUser});
    console.log(user._username,"s'est connecté !!");
    socket.data.user = user;    
    let userCon:UserConnected = new UserConnected(user,socket);
    listUsersConnected.set((idSocket),userCon);
    listUsersConnected.forEach(element => {
      console.log(element._username,element.id,element._mail)
    });
    }catch(error){
    console.error(error);
    }
  });

  // 
  socket.on("disconnect",(reason) => {
    try{
      console.log(listUsersConnected.get(idSocket).username,"c'est déconnecté",reason)
      listUsersConnected.delete(idSocket);
    }catch(error){
      console.error(error);
    }
  })


  //console.log(socket); Décommentez cette ligne si vous voulez analyser à quoi ressemble tout les attributs d'un socket
  // On peut lui stocker un user par ailleurs, je le fais mais doute de l'utilité puisqu'on stock déjà ça dans listUserConnected.


  socket.on("hostRoom",async() => { // Set { <socket.id> }
    let idGame:string = setRoomID()
    hostedRooms.push(idGame);
    socket.data.roomIdHosted = idGame;
    socket.join(idGame);
    socket.data.inRoom = idGame;
    socket.emit("roomId", idGame);
    console.log(idGame);
    console.log(await getUserInRoom(idGame));
  })

  socket.on("joinRoom", async ({roomId}) => {
    socket.join(roomId);
    socket.data.inRoom = roomId;
    console.log(await getUserInRoom(roomId));
  })
  // NOTE POUR DEMAIN (14 MAI), LE HOST ROOM N'A PAS L'AIR DE REJOINDRE DIRECTEMENT
  // Du moins d'après le getUserInRoom. Cependant si il rejoint après l'avoir crée (étrange), les deux userConnected sont affiché
  // Je peux m'empêcher de trouver ça étrange


  //socket.on("getUsersInRoom", ({roomId}) => console.log(getUserInRoom (roomId)));
  // Pas essayé le front  mais à faire

  console.log("Room:",Array.from(io.sockets.adapter.rooms.keys()));

});


async function getUserInRoom(idRoom:string):Promise<UserConnected[]>{
  try {
    let socketsInRoom:RemoteSocket<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any>[] = await io.in(idRoom).fetchSockets();

    let idSocketsInRoom:string[] = [];

    socketsInRoom.forEach(e => {
      
      let remoteSocketId:string = e.id;
      //console.log(remoteSocketId);

      idSocketsInRoom.push(remoteSocketId);
    });
    let usersInRoom:UserConnected[] = [];

    idSocketsInRoom.forEach(soc => {
      //if (listUsersConnected.has(soc)){
        usersInRoom.push(listUsersConnected.get(soc));
      //}
    });

    return usersInRoom;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs dans la salle :", error);
  }
}

// Déprécié, encore là au cas ou 
// Triste d'être crée à 20h et déprécié à 23h, c'est un peu l'image de ce projet pour l'instant
async function getUserBySocket(socket):Promise<User> {
  let user:User = await AppDataSource.manager.findOneBy(User, { id: socket.data.user});
  return user;
}