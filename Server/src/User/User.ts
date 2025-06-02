import { ClassManipulation, IUser } from "common"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User implements IUser,ClassManipulation {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public mail: string;

  @Column()
  public username: string;

  @Column()
  public hashedPassword?: string;

  public constructor (mail: string, username: string, password: string = "default", id?: number){
      this.mail = mail;
      this.username = username;
      this.hashedPassword = password;
      if (id) this.id = id;
  }

  public toString(): string {
    return "User("+
      [
        "id: "+this.id,
        "mail: "+this.mail,
        "username: "+this.username,
      ].join(", ")+")"
    ;
  }

  public toJSON(includePrivate: boolean = false): Object {
    return includePrivate?
      {
        id: this.id,
        mail: this.mail,
        username: this.username,
        hashedPassword: this.hashedPassword,
      }:
      {
        id: this.id,
        mail: this.mail,
        username: this.username,
      };
  }

  public serialize(): Object {
    return {
      mail: this.mail,
      username: this.username,
    }
  }

}