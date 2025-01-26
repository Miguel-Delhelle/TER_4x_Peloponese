// chargement des modules node avec require()
import path from 'path';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
const app = express();
app.listen(8888);
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const __fileName = fileURLToPath(import.meta.url);
const rootDir = path.dirname(__fileName);
const clientDistDir = path.resolve(rootDir, '..', 'Client');
console.log("Serveur prêt");
app.get('/', function (req, response) {
    response.sendFile(path.resolve(clientDistDir, 'index.html'));
});
app.get('/:nom', function (req, response) {
    response.sendFile(path.resolve(clientDistDir, req.params.nom));
});
/*
app.get('/src', function(req:any, response:any) {
    response.sendFile('./'+req.params.nom, {root: rootDir});
}); */
app.use('/dist/Client', express.static(path.resolve(rootDir, '..', 'Client')));
app.use('/src/Client', express.static(path.resolve(rootDir, '..', '..', 'src', 'Client')));
//# sourceMappingURL=server.js.map