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
import { createProxyMiddleware } from "http-proxy-middleware";
import unitsData from "./data/Units.json";
import { GreekMapModel } from "./MapModel/GreekMapModel";

export var listUsersConnected:Map<string,UserConnected> = new Map();

var mapOfRoom:GreekMapModel; //Qu'une pour l'instant pour le test mais va falloir crée une SDD pour stocker plusieurs matrice côté serveur.

const app = express();
const port = "3000";

const server = createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.use(express.json());


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






app.get("/api/coucou", (req,res)=> {
  res.status(200).json({
    areYouInTruth:"yes",
    whoAreYou:"My team enfin j'espère",
    ipAdress: os.hostname()
  })
})






app.post('/api/register', async function(req,response){
  let mail:string = req.body.mail;
  let username:string = req.body.username;
  let password:string = req.body.password;

  let userRegister:User = new User(mail,username,await hashedPassword(password));

  await AppDataSource.manager.save(userRegister);

  response.status(200).json("Inscription réussi");
});

app.post('/api/login', async function(req,response) {
let mailReq = req.body.mail;
let password = req.body.password;

try {
  let userLogin = await AppDataSource.manager.findOneBy(User, {mail: mailReq});

  let passwordOk:boolean = await verifyPassword(password, userLogin.hashedPassword);

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

if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      ws: true,
    })
  );
}else{

  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname,"..","..","Client","dist","index.html"));
  });

  app.use(express.static(path.resolve(__dirname, "../../Client/dist")));
}

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
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
// Traitement des données des unités


// Web Socket

var hostedRooms: string[] = [];

function setRoomID(length: number = 8, alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
  let s: string = '';
  for (let i = 0; i<length; i++) {s+=alphabet.charAt(Math.floor(Math.random()*alphabet.length));}
  return s;
}

io.on("connection", (socket) => {


  let idSocket = socket.id;
  
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
      console.log(listUsersConnected.get(idSocket).username,"s'est déconnecté",reason)
      listUsersConnected.delete(idSocket);
    }catch(error){
      console.error(error);
    }
  })


  //console.log(socket); Décommentez cette ligne si vous voulez analyser à quoi ressemble tout les attributs d'un socket
  // On peut lui stocker un user par ailleurs, je le fais mais doute de l'utilité puisqu'on stock déjà ça dans listUserConnected.


  socket.on("getUnits", () => {
    console.log("quelqu'un essaye de récupérer les unités")
    socket.emit("unitsList", unitsData);
  });

  socket.on("hostRoom",async(callback) => { // Set { <socket.id> }
    let idGame:string = setRoomID()
    hostedRooms.push(idGame);
    socket.data.roomIdHosted = idGame;
    socket.join(idGame);
    socket.data.inRoom = idGame;
    //console.log(idGame);
    //console.log(await getUserInRoom(idGame));
    callback(await getRoomInfo(idGame));
  
  })

  socket.on("joinRoom", async ({roomId},callback) => {
    socket.join(roomId);
    socket.data.inRoom = roomId;
    let infoRoom:string[] = await getRoomInfo(roomId);
    console.log("l'information envoyé en callback est: ",infoRoom); 
    callback(infoRoom);
    console.log(infoRoom);
    
    io.to(roomId).emit("playerJoined", {
      tabOfRoomInfo: infoRoom
    });

  })

  socket.on("getRoomInfo", async (idGame:string) => {
    let tabInfo:string[] = await getRoomInfo(idGame);
  });

  /*socket.on("sendMatriceMap",(data) => {
    let staticMatrice = data.staticMatrice;
    let dynamicMatrice = data.dynamicMatrice;
    mapOfRoom = new GreekMapModel(undefined,dynamicMatrice,staticMatrice);
    console.log(mapOfRoom);
  }) */


  // Déprécié
  //socket.emit("getUsersInRoom", ({roomId}) => getUserInRoom (roomId));

  console.log("Room:",Array.from(io.sockets.adapter.rooms.keys()));

});

// ***********************************************************************************



// Fonction


async function getRoomInfo(idRoom:string):Promise<string[]>{
  let tabInfo:string[] = [];
  tabInfo[0] = idRoom;
  let usernames:string[] = getUsernameInTab(await getUserInRoom(idRoom));
  usernames.forEach(username => {
    tabInfo.push(username);
  });
  return tabInfo;
}

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

function getUsernameInTab(tabOfUser:UserConnected[]):string[]{
  let tabOfUsername:string[] = [];
  tabOfUser.forEach(element => {
    tabOfUsername.push(element._username)
  });
  return tabOfUsername;

}

// Déprécié, encore là au cas ou 
// Triste d'être crée à 20h et déprécié à 23h, c'est un peu l'image de ce projet pour l'instant
async function getUserBySocket(socket):Promise<User> {
  let user:User = await AppDataSource.manager.findOneBy(User, { id: socket.data.user});
  return user;
}