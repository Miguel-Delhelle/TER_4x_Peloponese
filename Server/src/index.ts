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

  var dataSocketUser:{[socket: string]: number};
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

  socket.on("disconnect",(reason) => {
    console.log(listUsersConnected.get(idSocket).username,"c'est déconnecté")
    listUsersConnected.delete(idSocket);
  })



  //console.log(socket);


  socket.on("hostRoom",() => { // Set { <socket.id> }
    let idGame:string = setRoomID()
    hostedRooms.push(idGame);
    socket.data.roomIdHosted = idGame;
    socket.join(idGame);
    socket.data.inRoom = idGame;
    socket.emit("roomId", idGame);
  })
  //console.log(socket.rooms);

  socket.on("joinRoom", async ({roomId}) => {
    socket.join(roomId);
    socket.data.inRoom = roomId;
    console.log(await getUserInRoom(roomId));
  })

  socket.on("getUsersInRoom", ({roomId}) => console.log(getUserInRoom (roomId)));
    


});
async function getUserInRoom(idRoom:string):Promise<UserConnected[]>{
  try {
    let socketsInRoom:RemoteSocket<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any>[] = await io.in(idRoom).fetchSockets();

    let idSocketsInRoom:string[];

    socketsInRoom.forEach(e => {
      let socketId:string = e.id;
      idSocketsInRoom.push(socketId);
    });
    let usersInRoom:UserConnected[];

    idSocketsInRoom.forEach(soc => {
      if (listUsersConnected.has(soc)){
        usersInRoom.push(listUsersConnected.get(soc));
      }
    });

    return usersInRoom;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs dans la salle :", error);
  }
}

async function getUserBySocket(socket):Promise<User> {
  let user:User = await AppDataSource.manager.findOneBy(User, { id: socket.data.user});
  return user;
}