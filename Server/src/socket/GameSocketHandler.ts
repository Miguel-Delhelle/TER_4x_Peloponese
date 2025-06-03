import { SocketIOServer,ServerIO } from "common";
import { IGameRoom, IPlayer, printMessage } from "common";
import { GameRoom } from "./GameRoom";
import { Player } from "../entity/User/Player";
import { User } from "../entity/User/User";
import { AppDataSource } from "../data-source";

export class GameSocketHandler {

  private _io: ServerIO;
  private _rooms: Map<string,GameRoom> = new Map();
  private _users: Map<SocketIOServer,Player> = new Map();
  private static ROOMID_LENGTH: number = 8;
  private static ROOMID_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor(io: ServerIO) {
    this._io = io;
    this.setupSocketHandler();
  }

  get io(): ServerIO {return this._io;}

  get rooms(): Map<string,GameRoom> {return this._rooms;}

  get users(): Map<SocketIOServer,Player> {return this._users;}

  private setupSocketHandler(): void {
    this._io.on("connection", (socket: SocketIOServer) => {
      const idSocket: string = socket.id;
      let player: Player;
      let room: GameRoom;

      socket.on("disconnect", (reason) => {
        try {
          socket.disconnect(true);
          if(player && this._users.delete(socket)) {
            if(player.room) {
              socket.leave(player.room.id);
              printMessage(`${player.username} (id: ${player.id}) left the room ${player.room.id} (${player.room.players.length}/${GameRoom.ROOM_MAXPLAYER} players)`,'warn');
            }
            printMessage(`${player.username} got disconnected, see below:\n  ${reason.toString()}`,'warn');
          } else
            printMessage(`An unregistered user got disconnected, see below:\n  ${reason.toString()}`,'error');
        } catch(err) {
          console.error(err);
        }
      });
      
      socket.on("login", async (mail: string, callback) => {
        try {
          const user: User = await AppDataSource.manager.findOneBy(User, {mail: mail});
          player = new Player(user, socket);
          this._users.set(socket,player);
          printMessage(`${user.username} connected`,'info');
          callback({ok: true, user: player.serialize() as IPlayer});
        } catch(err) {
          console.error(err);
          callback({ok: false});
        }
      });

      socket.on("room-host", (callback) => {
        try {
          room = this.addRoom(player);
          socket.join(room.id);
          printMessage(`The room ${room.id} has been created, hosted by ${player.username}`,'info')
          callback({ok: true, room: room.serialize() as IGameRoom});
        } catch(err) {
          console.error(err);
          callback({ok: false});
        }
      });

      socket.on("room-join", (id: string, callback) => {
        try {
          room = this._rooms.get(id);
          if(room) {
            if(room.addPlayer(player)) {
              if(this.io.to(room.id).emit("player-joined", player.serialize() as IPlayer)) // -> Notify the room of the joining player
                callback({ok: true, room: room.serialize() as IGameRoom});
              else
                callback({ok: true, room: room.serialize() as IGameRoom, error: "The server did not successfully informed the room of your arrival"});
              socket.join(room.id);
              printMessage(`${player.username} (id: ${player.id}) joined the room ${room.id} (${room.players.length}/${GameRoom.ROOM_MAXPLAYER} players), see below the room data:`,'info');
              console.log(room);
            } else {
              printMessage(`${player.username} (id: ${player.id}) tried to join the room ${room.id} but the room is already full (${room.players.length}/${GameRoom.ROOM_MAXPLAYER} players)`,'error');
              callback({ok: false, error: `${room.id} is already full (max player: ${GameRoom.ROOM_MAXPLAYER})`});
            }
          } else {
            printMessage(`${player.username} (id: ${player.id}) tried to join a non-existing room (${id})`,'error');
            callback({ok: false, error: `${id}: Invalid room ID`});
          }
        } catch(err) {
          console.error(err);
          callback({ok: false, error: `An error occured joining the room ${id}`});
        }
      });

      socket.on("room-leave", (callback) => {
        try {
          if(player && room && room.removePlayer(player)) {
            socket.leave(room.id);
            printMessage(`${player.username} (id: ${player.id}) left the room ${room.id} (${room.players.length}/${GameRoom.ROOM_MAXPLAYER} players), see below the room data:`,'info');
            console.log(room);
            if(this.io.to(room.id).emit("player-left", player.serialize() as IPlayer)) // -> Notify the room of the leaving player
              callback({ok: true});
            else
              callback({ok: true, error: "The server did not successfully informed the room of your departure"});
          } else {
            printMessage(`${player.username} (id: ${player.id}) couldn't be removed from the room ${room.id}`,'error');
            callback({ok: false, error: `Could not be able to remove you from ${room.id}`});
          }
        } catch(err) {
          console.error(err);
          callback({ok: false, error: `An error occured leaving the room ${room.id}`});
        }
      });

      socket.on("player-update", (player) => {
        Object.assign(this._users.get(socket))
      });

      /*
      socket.on("getUnits", () => {
        console.log("quelqu'un essaye de récupérer les unités")
        socket.emit("unitsList", unitsData);
      });
      */

    });
  }

  private setRoomID(length: number = GameSocketHandler.ROOMID_LENGTH, alphabet: string = GameSocketHandler.ROOMID_ALPHABET): string {
    let s: string = '';
    for (let i = 0; i<length; i++) {s+=alphabet.charAt(Math.floor(Math.random()*alphabet.length));}
    return s;
  }

  public addRoom(host: Player): GameRoom {
    let id: string;
    while(!id || this.rooms.has(id)) id = this.setRoomID();
    const room: GameRoom = new GameRoom(id);
    room.addPlayer(host);
    this.rooms.set(id,room);
    return room;
  }

  public getPlayersInRoom(roomID: string): Player[] {
    const room: GameRoom = this.rooms.get(roomID);
    if(room) return room.players;
    else return;
  }
}