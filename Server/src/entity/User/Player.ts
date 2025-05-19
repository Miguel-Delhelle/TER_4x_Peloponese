import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { UserConnected } from "./UserConnected";


export class Player {

   public user:UserConnected;
   public faction:string;
   public room:string;

   constructor(user: UserConnected, faction: string, room: string) {
      this.user = user;
      this.faction = faction;
      this.room = room;
    }

}