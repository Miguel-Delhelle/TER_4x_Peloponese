import type { Entity } from "../Entity";

export class Unit implements Entity{

    id:string
    private static nbrInstance:number = 0;

    constructor(){
        Unit.nbrInstance++;
        this.id = "Unit"+Unit.nbrInstance;
    }

    spawn(): void{

    }

    move():void{

    }
}