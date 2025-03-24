import { mainScene } from "../../../main";
import { Player } from "../../Player/player";
import type { Point } from "../../Math/Point";
import type { Entity } from "../Entity";

export class Unit implements Entity{

    id:string
    private nomUnite:string;
    private range:number;
    private hp:number;
    private static nbrInstance:number = 0;
    private spriteKey:string;
    private owner: Player;
    private position: Point;

    constructor(){
        Unit.nbrInstance++;
        this.id = "Unit"+Unit.nbrInstance;
    }



    spawn(positionSpawn?:Point): void{

    }

    move():void{

    }

}

