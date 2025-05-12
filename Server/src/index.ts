import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
const app = express();
const port = "3000";

// Obtenir le chemin absolu du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get("/", (req, res) => {
  //res.send("Hello World!");
  res.sendFile(path.resolve(__dirname,"..","..","Client","dist","index.html"));
});

app.use(express.static(path.resolve(__dirname, "../../Client/dist")));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
