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

      socket.on("disconnect", (reason) => {
        try {
          socket.disconnect(true);
          const user: Player = this._users.get(socket);
          if(user && this._users.delete(socket)) {
            if(user.room) {
              socket.leave(user.room.id);
              printMessage(`${user.username} (id: ${user.id}) left the room ${user.room.id} (${user.room.players.length}/${GameRoom.ROOM_MAXPLAYER} players)`,'warn');
            }
            printMessage(`${user.username} got disconnected, see below:\n  ${reason.toString()}`,'warn');
          } else
            printMessage(`An unregistered user got disconnected, see below:\n  ${reason.toString()}`,'error');
        } catch(err) {
          console.error(err);
        }
      });
      
      socket.on("login", async (mail: string, callback) => {
        try {
          const user: User = await AppDataSource.manager.findOneBy(User, {mail: mail});
          const player: Player = new Player(user, socket);
          this._users.set(socket,player);
          printMessage(`${user.username} connected`,'info');
          callback({ok: true, user: player});
        } catch(err) {
          console.error(err);
          callback({ok: false});
        }
      });

      socket.on("room-host", (callback) => {
        try {
          const player: Player = this._users.get(socket);
          const room: IGameRoom = this.addRoom(player);
          socket.join(room.id);
          printMessage(`The room ${room.id} has been created, hosted by ${player.username}`,'info')
          callback({ok: true, room: room});
        } catch(err) {
          console.error(err);
          callback({ok: false});
        }
      });

      socket.on("room-join", (id: string, callback) => {
        try {
          const room: GameRoom = this.rooms.get(id);
          const player: Player = this._users.get(socket);
          if(room) {
            if(room.addPlayer(player)) {
              socket.join(room.id);
              printMessage(`${player.username} (id: ${player.id}) joined the room ${room.id} (${room.players.length}/${GameRoom.ROOM_MAXPLAYER} players), see below the room data:`,'info');
              console.log(room);
              callback({ok: true, room: room});
            } else {
              printMessage(`${player.username} (id: ${player.id}) tried to join the room ${room.id} but the room is already full (${room.players.length}/${GameRoom.ROOM_MAXPLAYER} players)`,'error');
              callback({ok: false, room: room});
            }
          } else {
            printMessage(`${player.username} (id: ${player.id}) tried to join a non-existing room (${room.id})`,'error');
            callback({ok: false});
          }
        } catch(err) {
          console.error(err);
          callback({ok: false});
        }
      });

      socket.on("room-leave", (id: string, callback) => {
        try {
          const player: Player = this._users.get(socket);
          const room: GameRoom = this._rooms.get(id);
          if(player && room && room.removePlayer(player)) {
            socket.leave(room.id);
            printMessage(`${player.username} (id: ${player.id}) left the room ${room.id} (${room.players.length}/${GameRoom.ROOM_MAXPLAYER} players), see below the room data:`,'info');
            console.log(room);
            callback({ok: true});
          } else {
            printMessage(`${player.username} (id: ${player.id}) couldn't be removed from the room ${room.id}`,'error');
            callback({ok: false});
          }
        } catch(err) {
          console.error(err);
          callback({ok: false});
        }
      });

    });
  }

  private setRoomID(length: number = GameSocketHandler.ROOMID_LENGTH, alphabet: string = GameSocketHandler.ROOMID_ALPHABET): string {
    let s: string = '';
    for (let i = 0; i<length; i++) {s+=alphabet.charAt(Math.floor(Math.random()*alphabet.length));}
    return s;
  }

  public addRoom(host: Player): IGameRoom {
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