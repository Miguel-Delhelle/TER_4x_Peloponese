import { ClassManipulation, IUser } from "common"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User implements IUser,ClassManipulation {

  @PrimaryGeneratedColumn()
  private _id: number;

  @Column({ unique: true })
  public _mail: string;

  @Column()
  private _username: string;

  @Column()
  private _hashedPassword?: string;

  public constructor (mail: string, username: string, password: string = "default", id?: number){
      this._mail = mail;
      this._username = username;
      this._hashedPassword = password;
      if (id) this._id = id;
  }

  get id(): number {return this._id;}

  get mail(): string {return this._mail;}

  get username(): string {return this._username;}

  get hashedPassword(): string {return this._hashedPassword;}
  set hashedPassword(value: string) {this._hashedPassword = value;}

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

}