import "reflect-metadata";
import express from "express";
import path from "path";
import os from "os";
import { fileURLToPath } from 'url';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { Database } from "sqlite3";


const app = express();
const port = "3000";
const db = new Database('greekAnatomic.sqlite');

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "Mathis"
    user.lastName = "Rosier"
    user.age = 24
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

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

app.use(express.static(path.resolve(__dirname, "../../Client/dist")));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});