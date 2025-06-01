import "reflect-metadata";
import express from "express";
import path from "path";
import { AppDataSource } from "./data-source"
import { User } from "./entity/User/User"
import { Database } from "sqlite3";
import * as bcrypt from 'bcrypt';
import { Server } from 'socket.io';
import { createServer } from "http";
import { IClientToServerEvents,IServerToClientEvents } from "common";
import { createProxyMiddleware } from "http-proxy-middleware";
import { GreekMapModel } from "./MapModel/GreekMapModel";
import { GameSocketHandler } from "./socket/GameSocketHandler";

//export var listUsersConnected:Map<string,UserConnected> = new Map();

var mapOfRoom:GreekMapModel; //Qu'une pour l'instant pour le test mais va falloir crée une SDD pour stocker plusieurs matrice côté serveur.

const app = express();
const port = "3000";

const server = createServer(app);
export const io = new Server<IClientToServerEvents,IServerToClientEvents>(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.use(express.json());
new GameSocketHandler(io);


const db = new Database('greekAnatomy.sqlite');

AppDataSource.initialize().then(async () => {
    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

}).catch(error => console.log(error))

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
  } else {
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
}

async function verifyPassword(clearPassword, hashedPassword) {
  try {
      const match = await bcrypt.compare(clearPassword, hashedPassword);
      return match; // Retourne true si les mots de passe correspondent, false sinon
  } catch (error) {
      throw new Error('Erreur lors de la vérification du mot de passe');
  }
}