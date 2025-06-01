import "reflect-metadata";
import express from "express";
import path from "path";
import { AppDataSource } from "./data-source"
import { User } from "./entity/User/User"
import { Database } from "sqlite3";
import * as bcrypt from 'bcrypt';
import { Server } from 'socket.io';
import { createServer } from "http";
import { IClientToServerEvents,IServerToClientEvents, IUser } from "common";
import { createProxyMiddleware } from "http-proxy-middleware";
import { GreekMapModel } from "./MapModel/GreekMapModel";
import { GameSocketHandler } from "./socket/GameSocketHandler";

//export var listUsersConnected:Map<string,UserConnected> = new Map();

var mapOfRoom:GreekMapModel; //Qu'une pour l'instant pour le test mais va falloir crée une SDD pour stocker plusieurs matrice côté serveur.

const app = express();
const port = "3000";

const db = new Database('GreeceAnatomy.sqlite');
AppDataSource.initialize().then(async () => {
  console.log("Loading users from the database...");
  const users: User[] = await AppDataSource.manager.find(User);
  console.log("Registered users in database: ", users);
}).catch(error => console.error(error));

const server = createServer(app);
export const io = new Server<IClientToServerEvents,IServerToClientEvents>(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
new GameSocketHandler(io);

app.use(express.json());

app.post('/api/register', async (req,response) => {
  try {
    const mail: string = req.body.mail;
    const username: string = req.body.username;
    const password: string = req.body.password;
    const user: User = new User(mail, username, await hashedPassword(password));

    await AppDataSource.manager.save(user);
    response.status(200).json({
      msg: "Successfully registered",
      data: user as IUser,
    });
  } catch(err) {
    response.status(500).json({
      error: "Incorrect input for registration (false)",
      mail: req.body.mail?true:false,
      username: req.body.username?true:false,
      password: req.body.password?true:false,
    });
  }
});

app.post('/api/login', async function(req,response) {
  try {
    const mail: string = req.body.mail;
    const password: string = req.body.password;
    const user = await AppDataSource.manager.findOneBy(User, {mail: mail});

    if (await verifyPassword(password, user.hashedPassword)) {
      delete user.hashedPassword;
      response.status(200).json({
        msg: "Successfully logged in",
        data: user as IUser,
      });
    } else {
      response.status(403).json({
        error: "Invalid password",
      });
    }
  } catch (err) {
    response.status(500).json({
      error: "Incorrect input for login (false)",
      mail: req.body.mail?true:false,
      password: req.body.password?true:false,
    });
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
  console.log(`Greece Anatomy's server listening on port ${port}`);
});


async function hashedPassword(clearPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(clearPassword, salt);
  return hashedPassword;
}

async function verifyPassword(clearPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(clearPassword, hashedPassword);
  } catch (err) {
    throw new Error('An error occured when checking the password');
  }
}