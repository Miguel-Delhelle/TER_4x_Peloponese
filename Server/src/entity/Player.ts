import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Player {

   @PrimaryColumn()
   public id;

   @OneToOne(() => User)
   @JoinColumn({name: "id"})
   public user:User

   @Column()
   public faction:faction
    
   @Column()
   public room: any;
 
   @Column()
   public socket: any;
 
   constructor(user: User, faction: faction, room: any, socket: any) {
      this.id = user.id;
      this.user = user;
      this.faction = faction;
      this.room = room;
      this.socket = socket;
    }

}

enum faction {
   SPARTE,
   ATHENES,
   THEBES
}