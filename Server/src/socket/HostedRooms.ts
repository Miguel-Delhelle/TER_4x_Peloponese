import { GameRoom } from "./GameRoom";
import { Player } from "../entity/User/Player";
import { UserConnected } from "../entity/User/UserConnected";

export class HostedRooms {

  private _playableRooms: GameRoom[] = [];
  private static ROOMID_LENGTH: number = 8;
  private static ROOMID_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor() {}

  get playableRooms(): GameRoom[] {return this._playableRooms;}

  private setRoomID(length: number = HostedRooms.ROOMID_LENGTH, alphabet: string = HostedRooms.ROOMID_ALPHABET): string {
    let s: string = '';
    for (let i = 0; i<length; i++) {s+=alphabet.charAt(Math.floor(Math.random()*alphabet.length));}
    return s;
  }

  public contains(roomID: string): boolean {
    return this.playableRooms.find(r => r.id===roomID)?true:false;
  }

  public getRoomByID(roomID: string|string[]): GameRoom|GameRoom[]|null {
    if(roomID instanceof Array)
      return this.playableRooms.filter(r => roomID.includes(r.id));
    return this.playableRooms.find(r => r.id===roomID) ?? null;
  }

  private getRoomIndexByID(roomID: string): number {
    return this.playableRooms.findIndex(r => r.id===roomID);
  }

  public addRoom(host: UserConnected): GameRoom {
    let id: string;
    while(!id || this.contains(id)) id = this.setRoomID();
    const player: Player = Player.fromConnectedUser(host);
    const room: GameRoom = new GameRoom(id,player);
    player.socket.room = room;
    this._playableRooms.push(room);
    return room;
  }

  public removeRoom(roomID: string): boolean {
    const pos: number = this.getRoomIndexByID(roomID);
    if(pos===-1) return false;
    this._playableRooms.splice(pos,1);
    return true;
  }

  public getPlayersInRoom(roomID: string|string[]): Player[] {
    const room: GameRoom|GameRoom[] = this.getRoomByID(roomID);
    if(!room || (room instanceof Array && room.length===0)) return null;
    if(room instanceof Array) {
      let res: Player[] = [];
      room.forEach(r => res.concat(r.players));
    }
    else return room.players;
  }
}