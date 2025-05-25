import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    public mail:string

    @Column()
    public username:string

    @Column()
    public hashedPassword:string
 
    public constructor (mail:string,username:string,password:string){
        this.mail = mail;
        this.username = username;
        this.hashedPassword = password;
    }
 
 
    public get _hashedPassword(){
       return this.hashedPassword;
    }
 
    public get _username(){
       return this.username;
    }
 
    public get _id(){
       return this.id;
    }
    public get _mail(){
       return this.mail;
    }

}
