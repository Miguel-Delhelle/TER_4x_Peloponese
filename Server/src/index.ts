import "reflect-metadata";
import express from "express";
import path from "path";
import os from "os";
import { fileURLToPath } from 'url';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { Database } from "sqlite3";
import * as bcrypt from 'bcrypt';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from "http";

const app = express();
const port = "3000";

const server = createServer(app);
const io = new SocketIOServer(server, {
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




